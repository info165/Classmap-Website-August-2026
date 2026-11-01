/**
 * Content for the For Schools page.
 *
 * The screenshots in public/school are from the real ClassMap teacher app, and
 * every figure quoted from them (class averages, concept scores, names of the
 * demo students) is read straight off those screens. Anything else, such as the
 * school overview grid or the timetable, is an illustration and is labelled as
 * one on the page.
 */

export type Band = 'green' | 'yellow' | 'red';

export const BAND: Record<Band, { label: string; solid: string; glow: string; text: string; bg: string; ring: string }> = {
  green: { label: 'Strong', solid: '#10B981', glow: 'rgba(16,185,129,0.5)', text: 'text-emerald-300', bg: 'bg-emerald-400/10', ring: 'ring-emerald-400/30' },
  yellow: { label: 'Needs attention', solid: '#F59E0B', glow: 'rgba(245,158,11,0.5)', text: 'text-amber-300', bg: 'bg-amber-400/10', ring: 'ring-amber-400/30' },
  red: { label: 'Weak', solid: '#F43F5E', glow: 'rgba(244,63,94,0.5)', text: 'text-rose-300', bg: 'bg-rose-400/10', ring: 'ring-rose-400/30' }
};

export const bandOf = (v: number): Band => (v >= 75 ? 'green' : v >= 55 ? 'yellow' : 'red');

/** The teacher app's own bands for a concept score (52% shows amber, 50% red). */
export const conceptBand = (v: number): Band => (v >= 80 ? 'green' : v > 50 ? 'yellow' : 'red');

/** Real screens from the teacher app. Sizes are the files' own pixels. */
export const SHOTS = {
  dashboard: { src: '/school/dashboard.webp', w: 1896, h: 862 },
  topic: { src: '/school/current-topic.webp', w: 1527, h: 522 },
  concepts: { src: '/school/concept-map.webp', w: 1582, h: 862 },
  subjective: { src: '/school/subjective-analysis.webp', w: 1575, h: 852 },
  clickers: { src: '/school/clickers.webp', w: 1525, h: 422 }
} as const;

/* -------------------------------------------------- the school overview */

export const OVERVIEW_CLASSES = ['6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '10-A'];
export const OVERVIEW_SUBJECTS = ['Maths', 'Science', 'English', 'Social Sci.', 'Hindi'];

/** An illustrative school: class mastery by subject. */
export const OVERVIEW: number[][] = [
  [82, 76, 88, 71, 84],
  [64, 79, 73, 58, 81],
  [77, 52, 85, 69, 74],
  [71, 41, 68, 77, 86],
  [60, 66, 81, 49, 78],
  [86, 73, 62, 80, 69],
  [57, 84, 76, 72, 63],
  [79, 68, 54, 83, 75]
];

/** The cells the overview points out, weakest first. */
export const ATTENTION = OVERVIEW.flatMap((row, r) => row.map((v, c) => ({ r, c, v })))
  .filter((x) => x.v < 55)
  .sort((a, b) => a.v - b.v);

/* ------------------------------------------- the class report (from the app) */

/** Class 8-A, Mathematics, chapter A Square and A Cube, as on the teacher's screens. */
export const REPORT = {
  className: 'Class 8-A',
  subject: 'Mathematics',
  chapter: 'A Square and A Cube',
  average: 60,
  submissions: 59,
  needHelp: 3,
  concepts: 29,
  conceptsWeak: 17,
  teachNext: 'Divisibility reasoning with exponents',
  students: ['Kiara Mehta', 'Ishaan Bose', 'Reyansh Patel'],
  rows: [
    { name: 'Successive differences of cubes', v: 43 },
    { name: 'Unit cubes in a larger cube', v: 46 },
    { name: 'Units digit of perfect cubes', v: 47 },
    { name: 'Trailing zeros in squares', v: 48 },
    { name: 'Prime factorisation method for cubes', v: 50 },
    { name: 'Prime factorisation method for squares', v: 52 },
    { name: 'Cubes of fractions, decimals and negatives', v: 52 }
  ],
  /** Two concepts the class has mastered. These are illustrative, not from the demo class. */
  strong: [
    { name: 'Patterns in square numbers', v: 86 },
    { name: 'Squares of numbers ending in 5', v: 82 }
  ]
};

/** The handwritten-paper results screen, as in the app. */
export const SUBJECTIVE = { checked: 5, average: 58, needHelp: 1, review: 5 };

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who sets up classes and teachers?',
    a: 'Your school gets an admin account. From it you create classes and sections, assign each teacher the classes and subjects they teach, and plan the routine. Each teacher then sees exactly their own classes.'
  },
  {
    q: 'Do teachers need to change how they teach?',
    a: 'No. Teachers mark the topic they are on, push a test when they are ready, or run a quick test in class. ClassMap does the analysis and tells them what to teach next.'
  },
  {
    q: 'How do in-class tests work?',
    a: 'Each student answers on a clicker device while the questions are shown on the classroom screen. The teacher gets the full performance report for the class as soon as the test ends.'
  },
  {
    q: 'Can teachers send tests to students instead?',
    a: 'Yes. A teacher can push a test straight to the students’ accounts, with questions at different levels, and every result lands in the same class report.'
  },
  {
    q: 'What about handwritten answers?',
    a: 'Teachers upload the students’ handwritten answer sheets. ClassMap AI grades them and produces a detailed report for every student and for the whole class, subject by subject.'
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing is quoted on request. We first understand how many classes, students and teachers will use ClassMap in your school, then send a quote that fits.'
  }
];
