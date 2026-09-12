/* All auth and progress stored in localStorage — no server required. */

const USERS_KEY    = "fq_users_v1";
const SESSION_KEY  = "fq_user";
const PROGRESS_KEY = "fq_progress_v1";

/* ── Types ── */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResult {
  user?: AuthUser;
  error?: string;
}

/* ── Internal helpers ── */
async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type DbRecord = AuthUser & { hash: string };

function getDb(): Record<string, DbRecord> {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}"); } catch { return {}; }
}

function saveDb(db: Record<string, DbRecord>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

/* ── Sign Up ── */
export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  if (!name.trim()) return { error: "Full name is required." };
  if (!email.trim()) return { error: "Email is required." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  const db  = getDb();
  const key = email.trim().toLowerCase();
  if (db[key]) return { error: "An account with this email already exists." };

  const hash = await sha256(`fq_salt_2026:${password}`);
  const id   = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user: AuthUser = { id, name: name.trim(), email: key, createdAt: new Date().toISOString() };

  db[key] = { ...user, hash };
  saveDb(db);
  saveSession(user);
  return { user };
}

/* ── Log In ── */
export async function logIn(email: string, password: string): Promise<AuthResult> {
  if (!email.trim()) return { error: "Email is required." };
  if (!password)     return { error: "Password is required." };

  const db     = getDb();
  const key    = email.trim().toLowerCase();
  const record = db[key];
  if (!record) return { error: "No account found with that email address." };

  const hash = await sha256(`fq_salt_2026:${password}`);
  if (hash !== record.hash) return { error: "Incorrect password. Please try again." };

  const { hash: _h, ...user } = record;
  saveSession(user as AuthUser);
  return { user: user as AuthUser };
}

/* ── Session ── */
export function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.name || !parsed?.email) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed as AuthUser;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ── Text Progress (per genre) ── */
function getAllProgress(): Record<string, Record<string, number>> {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}"); } catch { return {}; }
}

export async function getProgress(userId: string): Promise<Record<string, number>> {
  return getAllProgress()[userId] ?? {};
}

export async function saveProgress(userId: string, genre: string, level: number): Promise<void> {
  const all          = getAllProgress();
  const userProgress = all[userId] ?? {};
  if ((userProgress[genre] ?? 0) < level) {
    userProgress[genre] = level;
    all[userId]         = userProgress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  }
}

/* ── Video Progress (per genre) ── */
const VIDEO_PROGRESS_KEY = "fq_video_progress_v1";

function getAllVideoProgress(): Record<string, Record<string, number>> {
  try { return JSON.parse(localStorage.getItem(VIDEO_PROGRESS_KEY) ?? "{}"); } catch { return {}; }
}

export function getVideoProgress(userId: string): Record<string, number> {
  return getAllVideoProgress()[userId] ?? {};
}

export function saveVideoProgress(userId: string, genre: string, level: number): void {
  const all          = getAllVideoProgress();
  const userProgress = all[userId] ?? {};
  if ((userProgress[genre] ?? 0) < level) {
    userProgress[genre] = level;
    all[userId]         = userProgress;
    localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(all));
  }
}

/* ── AI Summary Grading (Claude-powered strict comparison) ── */
export async function gradeSummary(
  passage: string,
  summary: string,
  _userId: string,
  _genre: string,
  _level: number,
): Promise<{ score: number; feedback: string; passed: boolean; missedPoints: string[] }> {
  const wc = summary.trim().split(/\s+/).length;
  if (wc < 30) {
    return { score: 0, feedback: "Your summary is too short. Write at least 30 words covering the main ideas.", passed: false, missedPoints: [] };
  }

  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return gradeSummaryFallback(passage, summary);
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const prompt = `You are a strict academic examiner. Compare the user's summary against the original passage with rigorous, unforgiving checking.

ORIGINAL PASSAGE:
${passage}

USER'S SUMMARY:
${summary}

STRICT GRADING RUBRIC:
- Score out of 100.
- Deduct heavily for any key fact, figure, date, name, or concept mentioned in the passage that is absent from the summary.
- Deduct heavily for factual inaccuracies or distortions.
- A passing score is 70 or above — the user must cover at least 80% of the key points.
- Do not reward length alone; reward accuracy and completeness.
- Be specific in your feedback about exactly what was missed or wrong.

Respond ONLY with a valid JSON object in this exact shape:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences of specific, direct feedback>",
  "passed": <true if score >= 70, false otherwise>,
  "missedPoints": ["<short phrase describing a missed or wrong point>", ...]
}

missedPoints should list every important concept, fact, or idea from the passage that the user omitted or got wrong. Be thorough — list up to 8 items.`;

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No text in response");

    const raw = textBlock.text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]) as {
      score: number;
      feedback: string;
      passed: boolean;
      missedPoints: string[];
    };

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      feedback: parsed.feedback ?? "",
      passed: parsed.passed === true,
      missedPoints: Array.isArray(parsed.missedPoints) ? parsed.missedPoints : [],
    };
  } catch {
    return gradeSummaryFallback(passage, summary);
  }
}

/* ── AI Video Summary Analysis ── */
export interface VideoAnalysisResult {
  similarity: number;
  feedback: string;
  coveredPoints: string[];
  missingPoints: string[];
}

export async function analyzeVideoSummary(
  videoTitle: string,
  videoTopic: string,
  userSummary: string,
): Promise<VideoAnalysisResult> {
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return analyzeVideoSummaryFallback(videoTitle, userSummary);
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const prompt = `You are an expert educational assessor. A student just watched a YouTube video and wrote a summary. Based on the video title and topic, assess how well their summary covers the expected content.

VIDEO TITLE: ${videoTitle}
TOPIC/GENRE: ${videoTopic}

STUDENT SUMMARY:
${userSummary}

ASSESSMENT TASK:
1. Based on the video title and topic, identify 6-8 specific key concepts, facts, names, dates, or ideas that a thorough summary of this video should include.
2. Check the student's summary for each of those points — exact mentions, paraphrases, and clearly related ideas all count.
3. List which key points the student DID cover (coveredPoints) and which they MISSED (missingPoints).
4. Compute a similarity percentage (0-100) based on coverage.

STRICT SCORING RUBRIC:
- 85-100: Covers all or nearly all expected key points accurately
- 70-84: Covers most key points, may miss 1-2
- 50-69: Covers roughly half; notable gaps
- 30-49: Partial; misses many important concepts
- 0-29: Very sparse; barely addresses the subject

Be strict and specific. Vague or generic summaries that don't demonstrate real knowledge should score below 50.
missingPoints must be SHORT phrases (5-10 words), each describing one specific idea, fact, or concept the student omitted.
coveredPoints must similarly be short phrases describing what was included.

Respond ONLY with valid JSON in this exact shape:
{
  "similarity": <integer 0-100>,
  "feedback": "<2-3 sentences of specific, direct feedback>",
  "coveredPoints": ["<short phrase>"],
  "missingPoints": ["<short phrase>"]
}`;

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1500,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No text in response");

    const jsonMatch = textBlock.text.trim().match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]) as {
      similarity: number;
      feedback: string;
      coveredPoints?: string[];
      missingPoints?: string[];
    };

    return {
      similarity: Math.max(0, Math.min(100, Math.round(parsed.similarity))),
      feedback: parsed.feedback ?? "",
      coveredPoints: Array.isArray(parsed.coveredPoints) ? parsed.coveredPoints : [],
      missingPoints: Array.isArray(parsed.missingPoints) ? parsed.missingPoints : [],
    };
  } catch {
    return analyzeVideoSummaryFallback(videoTitle, userSummary);
  }
}

function analyzeVideoSummaryFallback(
  videoTitle: string,
  userSummary: string,
): VideoAnalysisResult {
  const titleKw   = extractKeywords(videoTitle);
  const summaryKw = extractKeywords(userSummary);
  const wc        = userSummary.trim().split(/\s+/).length;

  const titleMatches = [...titleKw].filter((w) => summaryKw.has(w)).length;
  const titleScore   = titleKw.size > 0 ? (titleMatches / titleKw.size) * 25 : 0;

  const lengthScore = wc >= 80 ? 30 : wc >= 50 ? 22 : wc >= 30 ? 14 : 5;
  const sentences   = userSummary.split(/[.!?]+/).filter((s) => s.trim().length > 4);
  const sentScore   = sentences.length >= 5 ? 25 : sentences.length >= 3 ? 18 : sentences.length >= 2 ? 10 : 4;
  const varScore    = Math.min(summaryKw.size * 1.2, 20);

  const similarity = Math.min(Math.round(titleScore + lengthScore + sentScore + varScore), 100);
  const feedback = similarity >= 70
    ? "Your summary appears to cover the key ideas well. Keep writing detailed, specific summaries."
    : similarity >= 50
    ? "Your summary touches on the topic but could be more detailed. Try to include more specific facts and ideas."
    : "Your summary seems to miss several important aspects of this video. Aim for more depth and specificity.";

  return { similarity, feedback, coveredPoints: [], missingPoints: [] };
}

/* ── Fallback: rule-based grading when API key is unavailable ── */
function gradeSummaryFallback(
  passage: string,
  summary: string,
): { score: number; feedback: string; passed: boolean; missedPoints: string[] } {
  const passageKw = extractKeywords(passage);
  const summaryKw = extractKeywords(summary);
  const wc        = summary.trim().split(/\s+/).length;

  const matches      = [...summaryKw].filter((w) => passageKw.has(w)).length;
  const overlapRatio = Math.min(matches / Math.max(passageKw.size * 0.18, 1), 1);
  const overlapScore = Math.round(overlapRatio * 60);

  const ratio       = wc / Math.max(passageKw.size, 1);
  const lengthScore = ratio >= 0.1 && ratio <= 0.35 ? 20 : ratio >= 0.05 ? 10 : 5;

  const sentences  = summary.split(/[.!?]+/).filter((s) => s.trim().length > 4);
  const sentScore  = sentences.length >= 5 ? 20 : sentences.length >= 3 ? 14 : sentences.length >= 2 ? 8 : 3;

  const score  = Math.min(overlapScore + lengthScore + sentScore, 100);
  const passed = score >= 70;

  const feedback = score >= 85
    ? "Excellent recall! You captured the key ideas clearly and in your own words."
    : score >= 70
    ? "Good summary. You covered the main points well — try adding a few more specific details next time."
    : score >= 50
    ? "You missed several important concepts. Focus on the core arguments and key facts."
    : "Your summary needs much more coverage of the main ideas. Re-read and note the key points before writing.";

  const missedPoints = extractMissedPoints(passage, summaryKw);
  return { score, feedback, passed, missedPoints };
}

/* ── Extract key sentences from the passage not covered by the summary ── */
function extractMissedPoints(passage: string, summaryKw: Set<string>): string[] {
  const allSentences = passage
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 8);

  const scored = allSentences.map((sent) => {
    const kw      = extractKeywords(sent);
    if (kw.size === 0) return { sent, missed: 0, total: 0 };
    const missing = [...kw].filter((w) => !summaryKw.has(w)).length;
    return { sent, missed: missing, total: kw.size };
  });

  const uncovered = scored
    .filter(({ missed, total }) => total >= 3 && missed / total > 0.6)
    .sort((a, b) => b.missed - a.missed);

  const seen   = new Set<string>();
  const result: string[] = [];

  for (const { sent } of uncovered) {
    const kw = extractKeywords(sent);
    const overlap = [...kw].filter((w) => seen.has(w)).length;
    if (kw.size > 0 && overlap / kw.size > 0.5) continue;
    kw.forEach((w) => seen.add(w));
    const display = sent.length > 180 ? sent.slice(0, 177) + "…" : sent;
    result.push(display);
    if (result.length >= 6) break;
  }

  return result;
}

/* ── Keyword extractor ── */
function extractKeywords(text: string): Set<string> {
  const stop = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with",
    "is","was","are","were","be","been","being","have","has","had","do",
    "does","did","will","would","could","should","may","might","shall",
    "this","that","these","those","it","its","as","by","from","into",
    "through","during","before","after","above","below","between","about",
    "not","no","nor","so","yet","both","either","neither","each","more",
    "most","other","some","such","than","then","when","where","who","which",
    "their","they","them","there","here","our","your","his","her","its",
    "we","you","he","she","i","me","my","us","can","just","also","very",
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stop.has(w)),
  );
}

/* ── Initials helper ── */
export function initials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
