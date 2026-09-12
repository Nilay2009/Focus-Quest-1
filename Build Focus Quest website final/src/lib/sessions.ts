/* Session history — every completed text or video challenge is recorded here. */

const SESSIONS_KEY = "fq_sessions_v1";

export type RetentionClass = "remembered" | "partial" | "missed";

export interface SessionRecord {
  id: string;
  userId: string;
  date: string;          // ISO-8601 timestamp
  genre: string;
  mode: "text" | "video";
  level: number;         // 1–5
  score: number;         // 0–100
  passed: boolean;
  durationSecs: number;  // reading time for text, watch time for video
  retention: RetentionClass;
  missedPointsCount: number;
}

/* Derive a retention class from score + missed points */
export function classifyRetention(score: number, missedPointsCount: number): RetentionClass {
  if (score >= 75 && missedPointsCount === 0) return "remembered";
  if (score >= 75 || (score >= 50 && missedPointsCount <= 2)) return "partial";
  if (score >= 60) return "partial";
  return "missed";
}

function load(): SessionRecord[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? "[]"); }
  catch { return []; }
}

export function saveSession(record: Omit<SessionRecord, "id">): void {
  try {
    const all = load();
    all.push({ ...record, id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` });
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
  } catch {}
}

export function getSessions(userId: string): SessionRecord[] {
  return load()
    .filter((s) => s.userId === userId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/* ── Derived metrics ── */

export function calcStreak(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0;
  const days = new Set(sessions.map((s) => s.date.slice(0, 10)));
  const msDay = 86_400_000;
  const todayStr   = new Date().toISOString().slice(0, 10);
  const yestStr    = new Date(Date.now() - msDay).toISOString().slice(0, 10);
  if (!days.has(todayStr) && !days.has(yestStr)) return 0;
  let cursor = new Date(days.has(todayStr) ? todayStr : yestStr);
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor = new Date(cursor.getTime() - msDay);
  }
  return streak;
}

export function calcImprovement(sessions: SessionRecord[]): number | null {
  const scored = sessions.filter((s) => s.mode === "text");
  if (scored.length < 4) return null;
  const early  = scored.slice(0, Math.ceil(scored.length / 3));
  const recent = scored.slice(-Math.ceil(scored.length / 3));
  const avg    = (arr: SessionRecord[]) => arr.reduce((a, b) => a + b.score, 0) / arr.length;
  const earlyAvg  = avg(early);
  const recentAvg = avg(recent);
  if (earlyAvg === 0) return null;
  return Math.round(((recentAvg - earlyAvg) / earlyAvg) * 100);
}

export function buildChartPoints(
  sessions: SessionRecord[],
  period: "week" | "month" | "all",
): { day: string; score: number; label: string }[] {
  const msDay = 86_400_000;
  const now   = Date.now();
  const cutoff = period === "week" ? now - 6 * msDay
               : period === "month" ? now - 29 * msDay
               : 0;

  const filtered = sessions.filter((s) => new Date(s.date).getTime() >= cutoff);
  if (filtered.length === 0) return [];

  const byDay = new Map<string, number[]>();
  filtered.forEach((s) => {
    const day = s.date.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(s.score);
  });

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, scores]) => {
      const avg   = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const d     = new Date(day);
      const label = period === "week"
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { day, score: avg, label };
    });
}

export function totalHours(sessions: SessionRecord[]): number {
  return Math.round((sessions.reduce((a, s) => a + s.durationSecs, 0) / 3600) * 10) / 10;
}
