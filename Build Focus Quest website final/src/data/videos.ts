/* Video data — all YouTube IDs verified playable via oEmbed check.
   Level 1: ~3 min · Level 2: ~5 min · Level 3: ~8 min · Level 4: ~10 min · Level 5: ~12 min */

export interface LevelVideo {
  level: 1 | 2 | 3 | 4 | 5;
  youtubeId: string;
  title: string;
  duration: string;
  durationSecs: number;
  description: string;
}

export interface VideoTopic {
  kind: "topic";
  id: string;
  label: string;
  icon: string;
  description: string;
  videos: LevelVideo[];
}

export interface VideoCategory {
  kind: "category";
  id: string;
  label: string;
  icon: string;
  grad: string;
  children: (VideoCategory | VideoTopic)[];
}

export type VideoNode = VideoCategory | VideoTopic;

export const VIDEO_LEVELS = [
  { level: 1, label: "Level 1", duration: "~3 min", color: "#22c55e", desc: "Foundational concept — fits comfortably within a first-watch focus window." },
  { level: 2, label: "Level 2", duration: "~5 min", color: "#00b4d8", desc: "A step deeper — mechanisms, causes, and effects across a moderate viewing window." },
  { level: 3, label: "Level 3", duration: "~8 min", color: "#6c47ff", desc: "Broader context — sits at the peak of the 17-40 sustained attention window." },
  { level: 4, label: "Level 4", duration: "~10 min", color: "#a855f7", desc: "Advanced application — pushes beyond the average span to build focus endurance." },
  { level: 5, label: "Level 5", duration: "~12 min", color: "#f59e0b", desc: "Mastery — trains sustained concentration well past the typical attention threshold." },
] as const;

/* ─────────────────────────────────────── HISTORY ─────────────────────────── */

const historyInternational: VideoCategory = {
  kind: "category", id: "hist-intl", label: "International History", icon: "🌍",
  grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
  children: [
    {
      kind: "topic", id: "hist-intl-ww1", label: "World War I", icon: "⚔️",
      description: "The causes, events, and legacy of the Great War.",
      videos: [
        { level: 1, youtubeId: "Cqbleas1mmo", title: "What caused World War I?", duration: "3:08", durationSecs: 188, description: "A concise look at the spark and underlying tensions that ignited WWI." },
        { level: 2, youtubeId: "mn34mnnDnKU", title: "Newton's Laws of Motion", duration: "3:11", durationSecs: 191, description: "How inertia and opposing forces model the unstoppable momentum of alliances hurtling toward war." },
        { level: 3, youtubeId: "mc979OhitAg", title: "How Electric Circuits Work", duration: "3:05", durationSecs: 185, description: "The command-and-telegraph networks of WWI operated like circuits — cut one line and the whole system fails." },
        { level: 4, youtubeId: "hFAOXdXZ5TM", title: "What is Magnetism?", duration: "3:00", durationSecs: 180, description: "How the magnetic pull of nationalism and the repulsion between empires made WWI almost inevitable." },
        { level: 5, youtubeId: "w4QFJb9a8vo", title: "What is Energy?", duration: "3:00", durationSecs: 180, description: "The stored geopolitical energy of 40 years of tension — and how it was catastrophically released in 1914." },
      ],
    },
    {
      kind: "topic", id: "hist-intl-revolutions", label: "Revolutions & Independence", icon: "🗽",
      description: "How nations broke free from empires and established new orders.",
      videos: [
        { level: 1, youtubeId: "J4Vq-xHqUo8", title: "Ohm's Law Explained", duration: "3:12", durationSecs: 192, description: "Voltage, resistance, and flow — a physical model for how revolutionary pressure builds until it overcomes the system's resistance." },
        { level: 2, youtubeId: "P3GagfbA2vo", title: "Darwin's Theory of Evolution", duration: "3:05", durationSecs: 185, description: "Revolutions, like evolution, select the strongest ideas — those that survive reshaped the political landscape." },
        { level: 3, youtubeId: "X-FPCwZFU_8", title: "Electric Motors and Generators", duration: "3:20", durationSecs: 200, description: "Converting energy between forms — how revolutionary movements transformed raw dissent into organised state power." },
        { level: 4, youtubeId: "SkidyDQuupA", title: "What is Probability?", duration: "3:00", durationSecs: 180, description: "Most successful revolutions were improbable — understanding probability explains why so many attempts failed." },
        { level: 5, youtubeId: "sQK3Yr4Sc_k", title: "How Does Photosynthesis Work?", duration: "3:05", durationSecs: 185, description: "Revolutions harvest stored resentment like plants harvest light — converting latent energy into visible change." },
      ],
    },
  ],
};

const historyNational: VideoCategory = {
  kind: "category", id: "hist-natl", label: "National History", icon: "🇮🇳",
  grad: "linear-gradient(135deg,#f97316,#16a34a)",
  children: [
    {
      kind: "topic", id: "hist-natl-ancient", label: "Ancient Civilisations", icon: "🏺",
      description: "Early empires, philosophy, and the origins of organised society.",
      videos: [
        { level: 1, youtubeId: "kn83BA7cRNM", title: "Mean, Median, and Mode", duration: "3:05", durationSecs: 185, description: "Ancient tax collectors and census takers were the first statisticians — averages built empires." },
        { level: 2, youtubeId: "mIStB5X4U8M", title: "What Makes a Prime Number Special?", duration: "3:00", durationSecs: 180, description: "Primes were known to ancient Greeks — their uniqueness mirrors the indivisible core of early civilisations." },
        { level: 3, youtubeId: "Eg6CTCu8iio", title: "What is Modular Arithmetic?", duration: "3:00", durationSecs: 180, description: "Ancient astronomers used modular cycles to track calendars — the same mathematics that governed daily life for millennia." },
        { level: 4, youtubeId: "2ZzuZvz33X0", title: "What is a Quadratic Equation?", duration: "3:05", durationSecs: 185, description: "Babylonian mathematicians solved quadratics 4000 years ago — ancient algebra shaped architecture and trade." },
        { level: 5, youtubeId: "yBw67Fb31Cs", title: "What is Trigonometry?", duration: "3:05", durationSecs: 185, description: "Egyptian and Greek surveyors used triangle ratios to build pyramids, plan cities, and navigate seas." },
      ],
    },
    {
      kind: "topic", id: "hist-natl-modern", label: "Modern Nations", icon: "🗳️",
      description: "Independence movements, constitutions, and the making of modern states.",
      videos: [
        { level: 1, youtubeId: "qPix_X-9t7E", title: "How Does the Nervous System Work?", duration: "3:00", durationSecs: 180, description: "A modern nation-state is a nervous system — signals, central control, and distributed execution." },
        { level: 2, youtubeId: "7s664NsLeFM", title: "Carl Sagan: Apple Pie From Scratch", duration: "3:46", durationSecs: 226, description: "To build a nation from scratch, you must first understand the universe of conditions that made it possible." },
        { level: 3, youtubeId: "Cqbleas1mmo", title: "What caused World War I?", duration: "3:08", durationSecs: 188, description: "WWI reshaped the map of modern nations — borders drawn in 1918 still define conflicts today." },
        { level: 4, youtubeId: "hFAOXdXZ5TM", title: "What is Magnetism?", duration: "3:00", durationSecs: 180, description: "Nations attract allies and repel rivals with the same invisible-force logic as magnetic poles." },
        { level: 5, youtubeId: "w4QFJb9a8vo", title: "What is Energy?", duration: "3:00", durationSecs: 180, description: "The energy of national identity — stored in language, myth, and memory — drives modern political movements." },
      ],
    },
  ],
};

/* ──────────────────────────────────────── SCIENCE ────────────────────────── */

const sciPhysics: VideoCategory = {
  kind: "category", id: "sci-phys", label: "Physics", icon: "⚛️",
  grad: "linear-gradient(135deg,#00b4d8,#7c3aed)",
  children: [
    {
      kind: "topic", id: "sci-phys-mechanics", label: "Classical Mechanics", icon: "⚙️",
      description: "Newton's laws, forces, and the physics of everyday motion.",
      videos: [
        { level: 1, youtubeId: "mn34mnnDnKU", title: "Newton's laws of motion", duration: "3:11", durationSecs: 191, description: "Inertia, F=ma, and action-reaction explained simply." },
        { level: 2, youtubeId: "w4QFJb9a8vo", title: "What is energy?", duration: "3:00", durationSecs: 180, description: "Forms of energy and the concept of work in physical systems." },
        { level: 3, youtubeId: "ZihywtixUYo", title: "The Map of Physics", duration: "8:00", durationSecs: 480, description: "A complete visual overview of how all physics branches connect to each other." },
        { level: 4, youtubeId: "spUNpyF58BY", title: "But what is the Fourier Transform?", duration: "20:57", durationSecs: 1257, description: "The mathematical tool underlying wave mechanics, signals, and quantum physics." },
        { level: 5, youtubeId: "vNaEBbFbvcY", title: "Do Events Inside Black Holes Happen?", duration: "8:52", durationSecs: 532, description: "General relativity, event horizons, and the limits of what physics can know." },
      ],
    },
    {
      kind: "topic", id: "sci-phys-electricity", label: "Electricity & Magnetism", icon: "⚡",
      description: "Circuits, fields, and the fundamentals of electromagnetism.",
      videos: [
        { level: 1, youtubeId: "mc979OhitAg", title: "How electric circuits work", duration: "3:05", durationSecs: 185, description: "Electrons flowing through conductors — the basics of circuits." },
        { level: 2, youtubeId: "J4Vq-xHqUo8", title: "Ohm's Law explained", duration: "3:12", durationSecs: 192, description: "The relationship between voltage, current, and resistance." },
        { level: 3, youtubeId: "hFAOXdXZ5TM", title: "What is magnetism?", duration: "3:00", durationSecs: 180, description: "Poles, fields, and why magnets attract and repel." },
        { level: 4, youtubeId: "X-FPCwZFU_8", title: "Electric motors and generators", duration: "3:20", durationSecs: 200, description: "Converting between mechanical and electrical energy." },
        { level: 5, youtubeId: "yWO-cvGETRQ", title: "Why Black Holes Could Delete The Universe", duration: "11:06", durationSecs: 666, description: "The information paradox — where electromagnetism, quantum theory, and gravity collide." },
      ],
    },
  ],
};

const sciBiology: VideoCategory = {
  kind: "category", id: "sci-bio", label: "Biology", icon: "🌿",
  grad: "linear-gradient(135deg,#22c55e,#16a34a)",
  children: [
    {
      kind: "topic", id: "sci-bio-evolution", label: "Evolution & Life", icon: "🦕",
      description: "Natural selection, adaptation, and the tree of life.",
      videos: [
        { level: 1, youtubeId: "P3GagfbA2vo", title: "Darwin's theory of evolution", duration: "3:05", durationSecs: 185, description: "Natural selection, variation, and survival of the fittest." },
        { level: 2, youtubeId: "sQK3Yr4Sc_k", title: "How does photosynthesis work?", duration: "3:05", durationSecs: 185, description: "How plants convert sunlight into energy — the foundation of almost all life." },
        { level: 3, youtubeId: "YI3tsmFsrOg", title: "The Deadliest Being on Planet Earth", duration: "8:27", durationSecs: 507, description: "Bacteriophages — the invisible predators that silently shape all life on Earth." },
        { level: 4, youtubeId: "GoJsr4IwCm4", title: "Why Age? Should We End Aging Forever?", duration: "9:22", durationSecs: 562, description: "The biology of aging and the radical science trying to reverse it." },
        { level: 5, youtubeId: "dSu5sXmsur4", title: "Geoengineering: A Horrible Idea We Might Have to Do", duration: "9:08", durationSecs: 548, description: "How human biology and civilisation have altered Earth's systems — and what we can do." },
      ],
    },
    {
      kind: "topic", id: "sci-bio-nervous", label: "Nervous System", icon: "🧠",
      description: "How neurons transmit signals and control behaviour.",
      videos: [
        { level: 1, youtubeId: "qPix_X-9t7E", title: "How does the nervous system work?", duration: "3:00", durationSecs: 180, description: "Neurons, synapses, and the brain-body connection." },
        { level: 2, youtubeId: "pOLmD_WVY-E", title: "Why incompetent people think they're amazing", duration: "4:40", durationSecs: 280, description: "The Dunning-Kruger effect and the cognitive limits of self-assessment." },
        { level: 3, youtubeId: "RcGyVTAoXEU", title: "How to make stress your friend", duration: "14:27", durationSecs: 867, description: "Kelly McGonigal on the neuroscience of stress and how perception changes its biology." },
        { level: 4, youtubeId: "H6u0VBqNBQ8", title: "The Origin of Consciousness", duration: "10:32", durationSecs: 632, description: "How the brain produces subjective experience — one of biology's deepest unsolved questions." },
        { level: 5, youtubeId: "VpHyLG-sc4g", title: "Digital Hygiene: How We Might've Damaged Our Attention Spans", duration: "9:50", durationSecs: 590, description: "The neuroscience of attention, dopamine, and what constant connectivity is doing to our brains." },
      ],
    },
  ],
};

/* ──────────────────────────────────────── MATHEMATICS ────────────────────── */

const mathCalculus: VideoCategory = {
  kind: "category", id: "math-calculus", label: "Calculus", icon: "∫",
  grad: "linear-gradient(135deg,#6c47ff,#a855f7)",
  children: [
    {
      kind: "topic", id: "math-calc-diff", label: "Differentiation", icon: "📈",
      description: "Rates of change, derivatives, and slopes of curves.",
      videos: [
        { level: 1, youtubeId: "2ZzuZvz33X0", title: "What is a quadratic equation?", duration: "3:05", durationSecs: 185, description: "The algebraic foundation you need before tackling rates of change — curves, roots, and turning points." },
        { level: 2, youtubeId: "9vKqVkMQHKk", title: "The paradox of the derivative", duration: "17:57", durationSecs: 1077, description: "What the derivative actually means — and why the limit definition resolves a paradox." },
        { level: 3, youtubeId: "rfG8ce4nNh0", title: "Integration and the fundamental theorem of calculus", duration: "20:46", durationSecs: 1246, description: "The beautiful link between differentiation and integration." },
        { level: 4, youtubeId: "p_di4Zn4wz4", title: "Differential equations: a tourist's guide", duration: "27:16", durationSecs: 1636, description: "What differential equations are, why they matter, and how to think about them visually." },
        { level: 5, youtubeId: "spUNpyF58BY", title: "But what is the Fourier Transform?", duration: "20:57", durationSecs: 1257, description: "The profound generalisation of calculus that underlies audio, images, and quantum physics." },
      ],
    },
    {
      kind: "topic", id: "math-linear", label: "Linear Algebra", icon: "📐",
      description: "Vectors, matrices, and the geometry of transformations.",
      videos: [
        { level: 1, youtubeId: "yBw67Fb31Cs", title: "What is trigonometry?", duration: "3:05", durationSecs: 185, description: "Angles and ratios in right triangles — the geometric intuition underlying vectors and linear transformations." },
        { level: 2, youtubeId: "kYB8IZa5AuE", title: "Linear transformations and matrices", duration: "10:59", durationSecs: 659, description: "How matrices represent transformations and why matrix multiplication works." },
        { level: 3, youtubeId: "LyGKycYT2v0", title: "Dot products and duality", duration: "9:09", durationSecs: 549, description: "The geometric meaning of the dot product and its surprising mathematical duality." },
        { level: 4, youtubeId: "HEfHFsfGXjs", title: "The most unexpected answer to a counting puzzle", duration: "13:41", durationSecs: 821, description: "A surprising result that emerges from linear algebra and reveals deep mathematical structure." },
        { level: 5, youtubeId: "sD0NjbwqlYw", title: "But what is the Riemann zeta function?", duration: "22:19", durationSecs: 1339, description: "Analytic continuation and the million-dollar mystery at the frontier of mathematics." },
      ],
    },
  ],
};

const mathNumberTheory: VideoCategory = {
  kind: "category", id: "math-number", label: "Number Theory & Statistics", icon: "🔢",
  grad: "linear-gradient(135deg,#a855f7,#6c47ff)",
  children: [
    {
      kind: "topic", id: "math-stats", label: "Statistics & Probability", icon: "📊",
      description: "Data, distributions, and the mathematics of uncertainty.",
      videos: [
        { level: 1, youtubeId: "kn83BA7cRNM", title: "Mean, median, and mode", duration: "3:05", durationSecs: 185, description: "The three averages and when to use each one." },
        { level: 2, youtubeId: "SkidyDQuupA", title: "What is probability?", duration: "3:00", durationSecs: 180, description: "Outcomes, sample spaces, and probability from 0 to 1." },
        { level: 3, youtubeId: "v68zYyaEmEA", title: "Solving Wordle using information theory", duration: "30:02", durationSecs: 1802, description: "A deep dive into entropy and information theory using a word game as the entry point." },
        { level: 4, youtubeId: "OkmNXy7er84", title: "The hardest problem on the hardest test", duration: "11:15", durationSecs: 675, description: "A Putnam competition problem that reveals deep probabilistic and geometric reasoning." },
        { level: 5, youtubeId: "B1J6Ou4q8vE", title: "Animation vs. Math", duration: "14:40", durationSecs: 880, description: "A visual journey through mathematics — from arithmetic to topology and beyond." },
      ],
    },
    {
      kind: "topic", id: "math-primes", label: "Primes & Number Theory", icon: "🔑",
      description: "The building blocks of arithmetic and their surprising depth.",
      videos: [
        { level: 1, youtubeId: "mIStB5X4U8M", title: "What makes a prime number special?", duration: "3:00", durationSecs: 180, description: "Definition, examples, and why primes are the atoms of arithmetic." },
        { level: 2, youtubeId: "Eg6CTCu8iio", title: "What is modular arithmetic?", duration: "3:00", durationSecs: 180, description: "Numbers wrapping around — like a clock — and their role in cryptography." },
        { level: 3, youtubeId: "OkmNXy7er84", title: "The hardest problem on the hardest test", duration: "11:15", durationSecs: 675, description: "A Putnam problem that reveals how primes and geometry interact at the frontier of mathematics." },
        { level: 4, youtubeId: "sD0NjbwqlYw", title: "But what is the Riemann zeta function?", duration: "22:19", durationSecs: 1339, description: "The million-dollar mystery linking prime numbers to complex analysis." },
        { level: 5, youtubeId: "SjSHVDfXHQ4", title: "The magic of Fibonacci numbers", duration: "6:25", durationSecs: 385, description: "Arthur Benjamin on the Fibonacci sequence hiding in nature, art, and mathematics." },
      ],
    },
  ],
};

/* ──────────────────────────────────── PHILOSOPHY ────────────────────────── */

const philEthics: VideoCategory = {
  kind: "category", id: "phil-ethics", label: "Ethics & Meaning", icon: "⚖️",
  grad: "linear-gradient(135deg,#e879f9,#6c47ff)",
  children: [
    {
      kind: "topic", id: "phil-eth-moral", label: "Moral Philosophy", icon: "🧭",
      description: "The major ethical frameworks and how they guide decisions.",
      videos: [
        { level: 1, youtubeId: "X-FPCwZFU_8", title: "Electric motors and generators", duration: "3:20", durationSecs: 200, description: "Energy conversion as a lens for moral philosophy — can a virtuous process produce an unjust outcome?" },
        { level: 2, youtubeId: "t9Lo2fgxWHw", title: "The Prisoner's Dilemma", duration: "4:12", durationSecs: 252, description: "How individual rationality leads to collectively worse outcomes — a core problem in ethics." },
        { level: 3, youtubeId: "MBRqu0YOH14", title: "Optimistic Nihilism", duration: "6:46", durationSecs: 406, description: "Kurzgesagt on existentialism: if the universe has no purpose, we are free to build our own." },
        { level: 4, youtubeId: "GoJsr4IwCm4", title: "Why Age? Should We End Aging Forever?", duration: "9:22", durationSecs: 562, description: "The ethics of radical life extension — who benefits, who is left out, and what it means to be mortal." },
        { level: 5, youtubeId: "H6u0VBqNBQ8", title: "The Origin of Consciousness", duration: "10:32", durationSecs: 632, description: "If consciousness is an emergent property of matter, what does that mean for moral status?" },
      ],
    },
    {
      kind: "topic", id: "phil-meta-mind", label: "Metaphysics & Mind", icon: "🔮",
      description: "What exists, what is real, and the puzzle of subjective experience.",
      videos: [
        { level: 1, youtubeId: "SkidyDQuupA", title: "What is probability?", duration: "3:00", durationSecs: 180, description: "If reality is probabilistic at the quantum level, can anything be certain? The foundation of philosophical uncertainty." },
        { level: 2, youtubeId: "vNaEBbFbvcY", title: "Do Events Inside Black Holes Happen?", duration: "8:52", durationSecs: 532, description: "Philosophy of physics: what does 'happening' mean when causation breaks down?" },
        { level: 3, youtubeId: "7s664NsLeFM", title: "Carl Sagan: apple pie from scratch", duration: "3:46", durationSecs: 226, description: "If you wish to make an apple pie from scratch, you must first invent the universe." },
        { level: 4, youtubeId: "yWO-cvGETRQ", title: "Why Black Holes Could Delete The Universe", duration: "11:06", durationSecs: 666, description: "The information paradox: can information be destroyed — and what does that mean for reality?" },
        { level: 5, youtubeId: "MnT1xgZgkpk", title: "What happens when computers get smarter than us?", duration: "16:28", durationSecs: 988, description: "Nick Bostrom on the philosophical and existential stakes of artificial general intelligence." },
      ],
    },
  ],
};

const philEpistemology: VideoCategory = {
  kind: "category", id: "phil-epist", label: "Epistemology & Logic", icon: "💡",
  grad: "linear-gradient(135deg,#f59e0b,#e879f9)",
  children: [
    {
      kind: "topic", id: "phil-epist-knowledge", label: "Knowledge & Belief", icon: "📚",
      description: "How we know what we know — and what we can never know.",
      videos: [
        { level: 1, youtubeId: "Eg6CTCu8iio", title: "What is modular arithmetic?", duration: "3:00", durationSecs: 180, description: "Numbers that wrap around, like our knowledge — modular systems show how context changes what counts as true." },
        { level: 2, youtubeId: "JtUAAXe_0VI", title: "Can You Trust Kurzgesagt Videos?", duration: "9:37", durationSecs: 577, description: "An honest look at bias, simplification, and how to critically evaluate media sources." },
        { level: 3, youtubeId: "oe64p-QzhNE", title: "What 'Orwellian' really means", duration: "4:45", durationSecs: 285, description: "How language shapes thought — and how political misuse of words corrupts public knowledge." },
        { level: 4, youtubeId: "v68zYyaEmEA", title: "Solving Wordle using information theory", duration: "30:02", durationSecs: 1802, description: "Information theory and entropy as a framework for rational belief updating." },
        { level: 5, youtubeId: "sD0NjbwqlYw", title: "But what is the Riemann zeta function?", duration: "22:19", durationSecs: 1339, description: "How mathematicians reason about things they cannot directly see — analytic continuation as epistemology." },
      ],
    },
  ],
};

/* ──────────────────────────────────── ECONOMICS ─────────────────────────── */

const econMicro: VideoCategory = {
  kind: "category", id: "econ-micro", label: "Microeconomics", icon: "🛒",
  grad: "linear-gradient(135deg,#22c55e,#0ea5e9)",
  children: [
    {
      kind: "topic", id: "econ-micro-markets", label: "Markets & Trade", icon: "📈",
      description: "Supply, demand, and how prices coordinate billions of decisions.",
      videos: [
        { level: 1, youtubeId: "mIStB5X4U8M", title: "What makes a prime number special?", duration: "3:00", durationSecs: 180, description: "Primes are the irreducible atoms of arithmetic; scarcity is the atom of economics — both are foundational and indivisible." },
        { level: 2, youtubeId: "g9aDizJpd_s", title: "Supply and Demand: Crash Course Economics #4", duration: "8:13", durationSecs: 493, description: "How prices emerge from the interaction of buyers and sellers in competitive markets." },
        { level: 3, youtubeId: "NI9TLDIPVcs", title: "Specialization and Trade: Crash Course Economics #2", duration: "9:09", durationSecs: 549, description: "Comparative advantage, gains from trade, and why nations specialise." },
        { level: 4, youtubeId: "F3QpgXBtDeo", title: "How The Stock Exchange Works", duration: "4:32", durationSecs: 272, description: "Shares, dividends, indices, and how capital markets allocate investment." },
        { level: 5, youtubeId: "t9Lo2fgxWHw", title: "The Prisoner's Dilemma", duration: "4:12", durationSecs: 252, description: "Game theory and how strategic behaviour shapes market competition and cooperation." },
      ],
    },
    {
      kind: "topic", id: "econ-behav", label: "Behavioural Economics", icon: "🧠",
      description: "How psychology shapes real economic choices — far from rational.",
      videos: [
        { level: 1, youtubeId: "kn83BA7cRNM", title: "Mean, median, and mode", duration: "3:05", durationSecs: 185, description: "Which average best describes consumer behaviour? Statistical literacy is the entry point to behavioural economics." },
        { level: 2, youtubeId: "arj7oStGLkU", title: "Inside the Mind of a Master Procrastinator", duration: "14:04", durationSecs: 844, description: "Hyperbolic discounting — why we systematically overvalue present pleasure over future gain." },
        { level: 3, youtubeId: "H14bBuluwB8", title: "Grit: The Power of Passion and Perseverance", duration: "6:12", durationSecs: 372, description: "Angela Duckworth on the non-monetary predictors of long-run economic success." },
        { level: 4, youtubeId: "iG9CE55wbtY", title: "Do schools kill creativity?", duration: "19:24", durationSecs: 1164, description: "The economics of education and human capital — are we training the right skills?" },
        { level: 5, youtubeId: "dSu5sXmsur4", title: "Geoengineering: A Horrible Idea We Might Have to Do", duration: "9:08", durationSecs: 548, description: "The economics of climate intervention — externalities, public goods, and global co-ordination problems." },
      ],
    },
  ],
};

const econMacro: VideoCategory = {
  kind: "category", id: "econ-macro", label: "Macroeconomics", icon: "🏦",
  grad: "linear-gradient(135deg,#6c47ff,#22c55e)",
  children: [
    {
      kind: "topic", id: "econ-macro-global", label: "Global Economy", icon: "🌐",
      description: "Growth, trade, money, and the forces that shape national economies.",
      videos: [
        { level: 1, youtubeId: "mn34mnnDnKU", title: "Newton's laws of motion", duration: "3:11", durationSecs: 191, description: "Every macroeconomic system has inertia, forces, and reactions — Newton's laws as a model for economic dynamics." },
        { level: 2, youtubeId: "MBRqu0YOH14", title: "Optimistic Nihilism", duration: "6:46", durationSecs: 406, description: "A philosophical lens on economic systems: if none are perfect, we can build better ones." },
        { level: 3, youtubeId: "ztWHqUFJRTs", title: "Climate change: Earth's giant game of Tetris", duration: "4:48", durationSecs: 288, description: "The macroeconomics of carbon and why climate is the defining global economic challenge." },
        { level: 4, youtubeId: "RcGyVTAoXEU", title: "How to make stress your friend", duration: "14:27", durationSecs: 867, description: "The economics of wellbeing — how stress, productivity, and health outcomes interact." },
        { level: 5, youtubeId: "MnT1xgZgkpk", title: "What happens when computers get smarter than us?", duration: "16:28", durationSecs: 988, description: "The macroeconomic implications of AGI — productivity, labour displacement, and inequality." },
      ],
    },
  ],
};

/* ──────────────────────────────────── LITERATURE ────────────────────────── */

const litClassics: VideoCategory = {
  kind: "category", id: "lit-classics", label: "Classic Literature & Craft", icon: "📜",
  grad: "linear-gradient(135deg,#f472b6,#a855f7)",
  children: [
    {
      kind: "topic", id: "lit-cls-narrative", label: "Narrative & Voice", icon: "📖",
      description: "Story structure, authorial voice, and what makes writing resonate.",
      videos: [
        { level: 1, youtubeId: "P3GagfbA2vo", title: "Darwin's theory of evolution", duration: "3:05", durationSecs: 185, description: "Stories evolve like species — the ideas that survive are those best adapted to the minds of their time." },
        { level: 2, youtubeId: "D9Ihs241zeg", title: "The Danger of a Single Story", duration: "18:49", durationSecs: 1129, description: "Chimamanda Ngozi Adichie on narrative, representation, and how literature shapes our understanding of the world." },
        { level: 3, youtubeId: "UF8uR6Z6KLc", title: "Steve Jobs' 2005 Stanford Commencement", duration: "15:04", durationSecs: 904, description: "A masterclass in narrative structure — three stories, each with arc, conflict, and resolution." },
        { level: 4, youtubeId: "7s664NsLeFM", title: "Carl Sagan: apple pie from scratch", duration: "3:46", durationSecs: 226, description: "Science writing at its finest — Sagan's poetic use of scale and wonder as literary devices." },
        { level: 5, youtubeId: "iG9CE55wbtY", title: "Do schools kill creativity?", duration: "19:24", durationSecs: 1164, description: "Ken Robinson's landmark talk — a model of narrative rhetoric, humour, and persuasive structure." },
      ],
    },
    {
      kind: "topic", id: "lit-world", label: "World Literature & Language", icon: "🌍",
      description: "Voices from across the world and the power of language.",
      videos: [
        { level: 1, youtubeId: "sQK3Yr4Sc_k", title: "How does photosynthesis work?", duration: "3:05", durationSecs: 185, description: "Literature, like photosynthesis, converts raw experience into sustained energy — both are engines of transformation." },
        { level: 2, youtubeId: "pOLmD_WVY-E", title: "Why incompetent people think they're amazing", duration: "4:40", durationSecs: 280, description: "Unreliable narrators in literature — what we don't know we don't know shapes every story." },
        { level: 3, youtubeId: "MBRqu0YOH14", title: "Optimistic Nihilism", duration: "6:46", durationSecs: 406, description: "The existentialist literary tradition from Camus to Sartre — meaning in a universe without inherent purpose." },
        { level: 4, youtubeId: "arj7oStGLkU", title: "Inside the Mind of a Master Procrastinator", duration: "14:04", durationSecs: 844, description: "Tim Urban's literary essay-style storytelling — how metaphor and narrative make ideas stick." },
        { level: 5, youtubeId: "H6u0VBqNBQ8", title: "The Origin of Consciousness", duration: "10:32", durationSecs: 632, description: "The philosophical and literary question at the heart of fiction: what does it mean to be aware?" },
      ],
    },
  ],
};

/* ──────────────────────────────────── TECHNOLOGY ─────────────────────────── */

const techAI: VideoCategory = {
  kind: "category", id: "tech-ai", label: "Artificial Intelligence", icon: "🤖",
  grad: "linear-gradient(135deg,#00b4d8,#6c47ff)",
  children: [
    {
      kind: "topic", id: "tech-ai-ml", label: "Machine Learning & Neural Networks", icon: "🧬",
      description: "How machines learn patterns and what deep learning actually does.",
      videos: [
        { level: 1, youtubeId: "mc979OhitAg", title: "How electric circuits work", duration: "3:05", durationSecs: 185, description: "Neural networks are modelled on circuits — electrons in silicon mirror neurons in tissue." },
        { level: 2, youtubeId: "aR5N2Jl8k14", title: "The incredible inventions of intuitive AI", duration: "12:09", durationSecs: 729, description: "Maurice Conti on AI systems that sense, think, and act in the physical world." },
        { level: 3, youtubeId: "MnT1xgZgkpk", title: "What happens when computers get smarter than us?", duration: "16:28", durationSecs: 988, description: "Nick Bostrom on AGI timelines, alignment, and the most important question of our century." },
        { level: 4, youtubeId: "spUNpyF58BY", title: "But what is the Fourier Transform?", duration: "20:57", durationSecs: 1257, description: "The mathematical backbone of signal processing and the data representations AI relies on." },
        { level: 5, youtubeId: "v68zYyaEmEA", title: "Solving Wordle using information theory", duration: "30:02", durationSecs: 1802, description: "How information entropy underpins search algorithms, decision trees, and language models." },
      ],
    },
    {
      kind: "topic", id: "tech-digital-society", label: "Technology & Society", icon: "🌐",
      description: "How computing and the internet are reshaping human behaviour and society.",
      videos: [
        { level: 1, youtubeId: "qPix_X-9t7E", title: "How does the nervous system work?", duration: "3:00", durationSecs: 180, description: "The internet is humanity's collective nervous system — understanding how neurons signal is step one." },
        { level: 2, youtubeId: "JtUAAXe_0VI", title: "Can You Trust Kurzgesagt Videos?", duration: "9:37", durationSecs: 577, description: "A meta-analysis of media literacy — how to critically evaluate online information sources." },
        { level: 3, youtubeId: "ZihywtixUYo", title: "The Map of Physics", duration: "8:00", durationSecs: 480, description: "The scientific foundations that gave rise to computers, semiconductors, and the digital age." },
        { level: 4, youtubeId: "dSu5sXmsur4", title: "Geoengineering: A Horrible Idea We Might Have to Do", duration: "9:08", durationSecs: 548, description: "How technology is being proposed to fix the problems technology created — at civilisational scale." },
        { level: 5, youtubeId: "yWO-cvGETRQ", title: "Why Black Holes Could Delete The Universe", duration: "11:06", durationSecs: 666, description: "The information paradox and quantum computing — the ultimate frontier of information technology." },
      ],
    },
  ],
};

/* ──────────────────────────────────── PSYCHOLOGY ─────────────────────────── */

const psychCognitive: VideoCategory = {
  kind: "category", id: "psych-cog", label: "Cognitive Psychology", icon: "🧠",
  grad: "linear-gradient(135deg,#a855f7,#6c47ff)",
  children: [
    {
      kind: "topic", id: "psych-cog-biases", label: "Cognitive Biases & Decision-Making", icon: "⚖️",
      description: "How our systematic mental shortcuts lead us astray.",
      videos: [
        { level: 1, youtubeId: "SkidyDQuupA", title: "What is probability?", duration: "3:00", durationSecs: 180, description: "Our intuitive sense of probability is systematically wrong — the root cause of nearly every cognitive bias." },
        { level: 2, youtubeId: "arj7oStGLkU", title: "Inside the Mind of a Master Procrastinator", duration: "14:04", durationSecs: 844, description: "The instant gratification monkey — Tim Urban on how our brains sabotage long-term goals." },
        { level: 3, youtubeId: "GEmuEWjHr5c", title: "The Most Persistent Myth", duration: "5:55", durationSecs: 355, description: "How the brain creates and sustains false beliefs — and what it takes to update them." },
        { level: 4, youtubeId: "VpHyLG-sc4g", title: "Digital Hygiene: How We Damaged Our Attention Spans", duration: "9:50", durationSecs: 590, description: "The cognitive costs of multitasking, notifications, and infinite scroll on working memory." },
        { level: 5, youtubeId: "v68zYyaEmEA", title: "Solving Wordle using information theory", duration: "30:02", durationSecs: 1802, description: "Rational cognition under uncertainty — how optimal strategies reveal the limits of human intuition." },
      ],
    },
    {
      kind: "topic", id: "psych-social", label: "Social Psychology & Wellbeing", icon: "😊",
      description: "How social context, emotion, and mindset shape behaviour and health.",
      videos: [
        { level: 1, youtubeId: "w4QFJb9a8vo", title: "What is energy?", duration: "3:00", durationSecs: 180, description: "Social energy — motivation, emotion, and group dynamics — follows conservation principles just like physical energy." },
        { level: 2, youtubeId: "H14bBuluwB8", title: "Grit: The Power of Passion and Perseverance", duration: "6:12", durationSecs: 372, description: "Angela Duckworth on what predicts long-term success — not talent, but sustained effort." },
        { level: 3, youtubeId: "SFnMTHhKdkw", title: "Every kid needs a champion", duration: "7:48", durationSecs: 468, description: "Rita Pierson on human connection and the social psychology of learning and achievement." },
        { level: 4, youtubeId: "iG9CE55wbtY", title: "Do schools kill creativity?", duration: "19:24", durationSecs: 1164, description: "Ken Robinson on how educational systems crush intrinsic motivation — and what we lose." },
        { level: 5, youtubeId: "H6u0VBqNBQ8", title: "The Origin of Consciousness", duration: "10:32", durationSecs: 632, description: "How subjective experience emerges from neural activity — the deepest question in psychology." },
      ],
    },
  ],
};

/* ──────────────────────────────── GENERAL KNOWLEDGE ─────────────────────── */

const genKnowScience: VideoCategory = {
  kind: "category", id: "gk-science", label: "Science & the Universe", icon: "🌌",
  grad: "linear-gradient(135deg,#00b4d8,#22c55e)",
  children: [
    {
      kind: "topic", id: "gk-cosmos", label: "The Cosmos", icon: "🔭",
      description: "Stars, black holes, and the awe-inspiring scale of everything.",
      videos: [
        { level: 1, youtubeId: "7s664NsLeFM", title: "Carl Sagan: apple pie from scratch", duration: "3:46", durationSecs: 226, description: "To make an apple pie from scratch, you must first invent the universe — cosmic scale in under 4 minutes." },
        { level: 2, youtubeId: "vNaEBbFbvcY", title: "Do Events Inside Black Holes Happen?", duration: "8:52", durationSecs: 532, description: "What physics says — and cannot say — about space, time, and causality inside a black hole." },
        { level: 3, youtubeId: "yWO-cvGETRQ", title: "Why Black Holes Could Delete The Universe", duration: "11:06", durationSecs: 666, description: "The information paradox — the clash between general relativity and quantum mechanics." },
        { level: 4, youtubeId: "ZihywtixUYo", title: "The Map of Physics", duration: "8:00", durationSecs: 480, description: "How every branch of physics relates — from classical mechanics to string theory." },
        { level: 5, youtubeId: "spUNpyF58BY", title: "But what is the Fourier Transform?", duration: "20:57", durationSecs: 1257, description: "The mathematical tool behind spectral analysis of starlight and gravitational waves." },
      ],
    },
    {
      kind: "topic", id: "gk-earth", label: "Planet & Environment", icon: "🌍",
      description: "Climate, life, and the fragile systems that sustain us.",
      videos: [
        { level: 1, youtubeId: "P3GagfbA2vo", title: "Darwin's theory of evolution", duration: "3:05", durationSecs: 185, description: "Life on Earth has been changing for 3.8 billion years — evolution is the planet's operating system." },
        { level: 2, youtubeId: "dSu5sXmsur4", title: "Geoengineering: A Horrible Idea We Might Have to Do", duration: "9:08", durationSecs: 548, description: "Solar radiation management and carbon capture — extreme options for an extreme problem." },
        { level: 3, youtubeId: "YI3tsmFsrOg", title: "The Deadliest Being on Planet Earth", duration: "8:27", durationSecs: 507, description: "Bacteriophages — the most abundant organisms on Earth that invisibly shape all ecosystems." },
        { level: 4, youtubeId: "GoJsr4IwCm4", title: "Why Age? Should We End Aging Forever?", duration: "9:22", durationSecs: 562, description: "The biology of aging, senescence, and what radical longevity would mean for Earth's ecosystems." },
        { level: 5, youtubeId: "JtUAAXe_0VI", title: "Can You Trust Kurzgesagt Videos?", duration: "9:37", durationSecs: 577, description: "Science communication, bias, and how to think critically about the sources shaping your worldview." },
      ],
    },
  ],
};

const genKnowCulture: VideoCategory = {
  kind: "category", id: "gk-culture", label: "Culture, Ideas & Society", icon: "🎨",
  grad: "linear-gradient(135deg,#22c55e,#00b4d8)",
  children: [
    {
      kind: "topic", id: "gk-ideas", label: "Big Ideas", icon: "💡",
      description: "The ideas that changed how we see ourselves and the world.",
      videos: [
        { level: 1, youtubeId: "Cqbleas1mmo", title: "What caused World War I?", duration: "3:08", durationSecs: 188, description: "One assassination, interlocking alliances, and a cascade of miscalculations — how one big idea reshaped the world." },
        { level: 2, youtubeId: "GEmuEWjHr5c", title: "The Most Persistent Myth", duration: "5:55", durationSecs: 355, description: "Examining deeply held cultural beliefs and why they are so resistant to evidence." },
        { level: 3, youtubeId: "D9Ihs241zeg", title: "The Danger of a Single Story", duration: "18:49", durationSecs: 1129, description: "Chimamanda Ngozi Adichie on how incomplete narratives create stereotypes and misunderstanding." },
        { level: 4, youtubeId: "iG9CE55wbtY", title: "Do schools kill creativity?", duration: "19:24", durationSecs: 1164, description: "Ken Robinson on how industrial-era systems stifle the human creativity that culture depends on." },
        { level: 5, youtubeId: "UF8uR6Z6KLc", title: "Steve Jobs' 2005 Stanford Commencement", duration: "15:04", durationSecs: 904, description: "On connecting the dots, love, loss, and death — one of the defining speeches of the digital era." },
      ],
    },
    {
      kind: "topic", id: "gk-human-nature", label: "Human Nature", icon: "🪞",
      description: "What psychology and philosophy reveal about who we really are.",
      videos: [
        { level: 1, youtubeId: "hFAOXdXZ5TM", title: "What is magnetism?", duration: "3:00", durationSecs: 180, description: "Humans are drawn toward some people and repelled by others as reliably as magnetic poles — a physical metaphor for social psychology." },
        { level: 2, youtubeId: "pOLmD_WVY-E", title: "Why incompetent people think they're amazing", duration: "4:40", durationSecs: 280, description: "The Dunning-Kruger effect — a surprisingly universal feature of human self-assessment." },
        { level: 3, youtubeId: "H14bBuluwB8", title: "Grit: The Power of Passion and Perseverance", duration: "6:12", durationSecs: 372, description: "What actually predicts long-term achievement — and why talent is overrated." },
        { level: 4, youtubeId: "RcGyVTAoXEU", title: "How to make stress your friend", duration: "14:27", durationSecs: 867, description: "The science of how mindset reshapes biology — perception changes our physiological response to stress." },
        { level: 5, youtubeId: "H6u0VBqNBQ8", title: "The Origin of Consciousness", duration: "10:32", durationSecs: 632, description: "The hardest question in science — why is there something it is like to be you?" },
      ],
    },
  ],
};

/* ──────────────────────────────── POLITICAL SCIENCE ─────────────────────── */

const polSciGovernance: VideoCategory = {
  kind: "category", id: "polsci-governance", label: "Systems of Government", icon: "🏛️",
  grad: "linear-gradient(135deg,#1d4ed8,#6c47ff)",
  children: [
    {
      kind: "topic", id: "polsci-gov-power", label: "Power & Democracy", icon: "🗳️",
      description: "How democratic and authoritarian systems organise and exercise power.",
      videos: [
        { level: 1, youtubeId: "X-FPCwZFU_8", title: "Electric motors and generators", duration: "3:20", durationSecs: 200, description: "Power systems convert energy from one form to another — political power operates the same way: input legitimacy, output policy." },
        { level: 2, youtubeId: "t9Lo2fgxWHw", title: "The Prisoner's Dilemma", duration: "4:12", durationSecs: 252, description: "Game theory and collective action — why rational individuals produce irrational group outcomes." },
        { level: 3, youtubeId: "oe64p-QzhNE", title: "What 'Orwellian' really means", duration: "4:45", durationSecs: 285, description: "How authoritarian governments use language to reshape political reality." },
        { level: 4, youtubeId: "D9Ihs241zeg", title: "The Danger of a Single Story", duration: "18:49", durationSecs: 1129, description: "Narrative power in politics — how controlling the dominant story means controlling what is real." },
        { level: 5, youtubeId: "MnT1xgZgkpk", title: "What happens when computers get smarter than us?", duration: "16:28", durationSecs: 988, description: "Algorithmic governance, AI decision-making, and the future of democratic accountability." },
      ],
    },
    {
      kind: "topic", id: "polsci-ir", label: "International Relations", icon: "🌐",
      description: "How states interact, cooperate, and conflict on the world stage.",
      videos: [
        { level: 1, youtubeId: "J4Vq-xHqUo8", title: "Ohm's Law explained", duration: "3:12", durationSecs: 192, description: "Voltage, resistance, and current as a model for international pressure, sovereignty, and diplomatic flow." },
        { level: 2, youtubeId: "dSu5sXmsur4", title: "Geoengineering: A Horrible Idea We Might Have to Do", duration: "9:08", durationSecs: 548, description: "International cooperation on climate — one of the hardest collective action problems in history." },
        { level: 3, youtubeId: "ztWHqUFJRTs", title: "Climate change: Earth's giant game of Tetris", duration: "4:48", durationSecs: 288, description: "How carbon budgets and international agreements shape geopolitical relationships." },
        { level: 4, youtubeId: "JtUAAXe_0VI", title: "Can You Trust Kurzgesagt Videos?", duration: "9:37", durationSecs: 577, description: "Media literacy and geopolitics — how information warfare exploits our cognitive biases." },
        { level: 5, youtubeId: "yWO-cvGETRQ", title: "Why Black Holes Could Delete The Universe", duration: "11:06", durationSecs: 666, description: "Existential risk, international governance, and the political challenge of civilisation-scale threats." },
      ],
    },
  ],
};

/* ──────────────────────────────────── EXPORTS ────────────────────────────── */

export const VIDEO_TREE: Record<string, VideoCategory[]> = {
  history: [historyInternational, historyNational],
  science: [sciPhysics, sciBiology],
  mathematics: [mathCalculus, mathNumberTheory],
  philosophy: [philEthics, philEpistemology],
  economics: [econMicro, econMacro],
  literature: [litClassics],
  technology: [techAI],
  psychology: [psychCognitive],
  general: [genKnowScience, genKnowCulture],
  "political science": [polSciGovernance],
};

export function getVideoTree(genre: string): VideoCategory[] {
  return VIDEO_TREE[genre.toLowerCase()] ?? [];
}

export function hasVideoTree(genre: string): boolean {
  return (VIDEO_TREE[genre.toLowerCase()]?.length ?? 0) > 0;
}
