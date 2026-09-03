/* WorksheetHub — taxonomy: grade bands, subjects & topics, difficulty, achievements.
   Everything else in the app derives its labels from here. */

export const GRADES = [
  {
    id: 'early', emoji: '🧸', name: 'Early Learning', range: 'Pre-K • Kindergarten',
    band: 'early', tone: 'Playful and picture-led, with short sets and big targets.',
    levels: ['Pre-K', 'Kindergarten']
  },
  {
    id: 'elementary', emoji: '📕', name: 'Elementary', range: 'Grades 1–5',
    band: 'early', tone: 'Friendly and concrete, one idea per question.',
    levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5']
  },
  {
    id: 'middle', emoji: '📘', name: 'Middle School', range: 'Grades 6–8',
    band: 'mid', tone: 'Structured practice with worked explanations.',
    levels: ['Grade 6', 'Grade 7', 'Grade 8']
  },
  {
    id: 'high', emoji: '📗', name: 'High School', range: 'Grades 9–12',
    band: 'upper', tone: 'Exam-shaped, with multi-step reasoning.',
    levels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
  },
  {
    id: 'advanced', emoji: '🎓', name: 'Advanced', range: 'College / Advanced',
    band: 'upper', tone: 'Dense, no hand-holding, full solutions on demand.',
    levels: ['College', 'Advanced']
  }
];

export const SUBJECTS = [
  {
    id: 'math', name: 'Mathematics', emoji: '🔢', accent: 'primary',
    blurb: 'From counting to calculus, one step at a time.',
    topics: [
      { id: 'arithmetic',   name: 'Arithmetic' },
      { id: 'fractions',    name: 'Fractions' },
      { id: 'decimals',     name: 'Decimals' },
      { id: 'percentages',  name: 'Percentages' },
      { id: 'algebra',      name: 'Algebra' },
      { id: 'geometry',     name: 'Geometry' },
      { id: 'trigonometry', name: 'Trigonometry' },
      { id: 'statistics',   name: 'Statistics' },
      { id: 'calculus',     name: 'Calculus' }
    ]
  },
  {
    id: 'science', name: 'Science', emoji: '🔬', accent: 'green',
    blurb: 'How the world works, tested one question at a time.',
    topics: [
      { id: 'biology',   name: 'Biology' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'physics',   name: 'Physics' },
      { id: 'earth',     name: 'Earth Science' },
      { id: 'astronomy', name: 'Astronomy' }
    ]
  },
  {
    id: 'ela', name: 'English / Language Arts', emoji: '📖', accent: 'orange',
    blurb: 'Grammar, vocabulary, reading and writing practice.',
    topics: [
      { id: 'grammar',    name: 'Grammar' },
      { id: 'vocabulary', name: 'Vocabulary' },
      { id: 'reading',    name: 'Reading' },
      { id: 'writing',    name: 'Writing' },
      { id: 'spelling',   name: 'Spelling' },
      { id: 'literature', name: 'Literature' }
    ]
  },
  {
    id: 'social', name: 'Social Studies', emoji: '🌍', accent: 'primary',
    blurb: 'History, geography and how societies are organised.',
    topics: [
      { id: 'history',   name: 'History' },
      { id: 'geography', name: 'Geography' },
      { id: 'civics',    name: 'Civics' },
      { id: 'economics', name: 'Economics' }
    ]
  },
  {
    id: 'languages', name: 'Languages', emoji: '🗣️', accent: 'green',
    blurb: 'Vocabulary and grammar drills in a second language.',
    topics: [
      { id: 'spanish', name: 'Spanish' },
      { id: 'french',  name: 'French' },
      { id: 'german',  name: 'German' },
      { id: 'esl',     name: 'English as a Second Language' }
    ]
  },
  {
    id: 'cs', name: 'Computer Science', emoji: '💻', accent: 'primary',
    blurb: 'Logic, code reading and computational thinking.',
    topics: [
      { id: 'programming', name: 'Programming' },
      { id: 'algorithms',  name: 'Algorithms' },
      { id: 'data',        name: 'Data & Databases' }
    ]
  },
  {
    id: 'study', name: 'Study Skills', emoji: '🧠', accent: 'orange',
    blurb: 'Note-taking, revision technique and exam strategy.',
    topics: [
      { id: 'notes',    name: 'Note-taking' },
      { id: 'revision', name: 'Revision' },
      { id: 'exams',    name: 'Exam Technique' }
    ]
  },
  {
    id: 'arts', name: 'Art & Music', emoji: '🎨', accent: 'orange',
    blurb: 'Theory, history and vocabulary of the arts.',
    topics: [
      { id: 'art-history', name: 'Art History' },
      { id: 'music-theory', name: 'Music Theory' }
    ]
  }
];

export const DIFFICULTIES = [
  { id: 'easy',   name: 'Easy',   dot: '🟢', badge: 'badge-success' },
  { id: 'medium', name: 'Medium', dot: '🟡', badge: 'badge-warn' },
  { id: 'hard',   name: 'Hard',   dot: '🔴', badge: 'badge-danger' }
];

export const QUESTION_TYPES = [
  { id: 'blank',   name: 'Fill in the blank', emoji: '✏️' },
  { id: 'choice',  name: 'Multiple choice',   emoji: '🔘' },
  { id: 'multi',   name: 'Multiple answers',  emoji: '☑️' },
  { id: 'math',    name: 'Math input',        emoji: '🔢' },
  { id: 'match',   name: 'Matching',          emoji: '🧩' },
  { id: 'order',   name: 'Ordering',          emoji: '🔀' },
  { id: 'graph',   name: 'Graph',             emoji: '📊' },
  { id: 'written', name: 'Written response',  emoji: '✍️' }
];

/* Achievements are deliberately optional — the plan asks for gamification that
   never makes the product feel childish, so they live on their own page and
   surface as a quiet toast, not a full-screen celebration. */
export const ACHIEVEMENTS = [
  { id: 'first-sheet',  emoji: '🏆', name: 'First Worksheet', desc: 'Complete your first exercise.',            test: s => s.completed >= 1 },
  { id: 'streak-7',     emoji: '🔥', name: '7 Day Streak',    desc: 'Practise seven days in a row.',            test: s => s.streak >= 7 },
  { id: 'bookworm',     emoji: '📚', name: 'Bookworm',        desc: 'Complete 50 worksheets.',                  test: s => s.completed >= 50 },
  { id: 'math-master',  emoji: '🧮', name: 'Math Master',     desc: 'Score 90% or higher on 20 maths exercises.', test: s => s.mathHighScores >= 20 },
  { id: 'perfect',      emoji: '🎯', name: 'Perfect Score',   desc: 'Get every question in an exercise correct.', test: s => s.perfectRuns >= 1 },
  { id: 'explorer',     emoji: '🧭', name: 'Explorer',        desc: 'Practise in four different subjects.',      test: s => s.subjectsTouched >= 4 },
  { id: 'century',      emoji: '💯', name: 'Century',         desc: 'Answer 100 questions correctly.',           test: s => s.correct >= 100 },
  { id: 'early-bird',   emoji: '🌅', name: 'Early Bird',      desc: 'Finish an exercise before 9am.',            test: s => s.earlyBird === true }
];

/* ------------------------------- lookups ------------------------------- */
const byId = list => Object.fromEntries(list.map(x => [x.id, x]));
export const GRADE_MAP   = byId(GRADES);
export const SUBJECT_MAP = byId(SUBJECTS);
export const DIFF_MAP    = byId(DIFFICULTIES);
export const QTYPE_MAP   = byId(QUESTION_TYPES);

export const TOPIC_MAP = (() => {
  const out = {};
  for (const s of SUBJECTS) for (const t of s.topics) out[t.id] = { ...t, subject: s.id };
  return out;
})();

export const gradeName   = id => GRADE_MAP[id]?.name   ?? id;
export const subjectName = id => SUBJECT_MAP[id]?.name ?? id;
export const topicName   = id => TOPIC_MAP[id]?.name   ?? id;
export const diffName    = id => DIFF_MAP[id]?.name    ?? id;
