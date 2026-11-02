/**
 * Content and constants for the For Students page.
 *
 * Everything here comes from the product as the team described it, or is read
 * off the real app screenshots and the video in public/student. Anything that is
 * only an illustration (the colours on the Photosynthesis parts, the scores in
 * the phone) is labelled as one where it appears on the page.
 */

/** The live student portal. */
export const STUDENT_PORTAL_URL = 'https://classmap.in/students';

export const PRICE = 99;

/** The three colours every report uses. Thresholds match the app's own bands. */
export type Band = 'green' | 'yellow' | 'red';

export const BANDS: Record<
  Band,
  { label: string; short: string; range: string; text: string; bg: string; ring: string; solid: string; glow: string }
> = {
  green: {
    label: 'Good to go',
    short: 'Good',
    range: '80% and above',
    text: 'text-emerald-300',
    bg: 'bg-emerald-400/10',
    ring: 'ring-emerald-400/30',
    solid: '#10B981',
    glow: 'rgba(16,185,129,0.45)'
  },
  yellow: {
    label: 'Getting there',
    short: 'Improving',
    range: '60% to 79%',
    text: 'text-amber-300',
    bg: 'bg-amber-400/10',
    ring: 'ring-amber-400/30',
    solid: '#F59E0B',
    glow: 'rgba(245,158,11,0.45)'
  },
  red: {
    label: 'Needs help',
    short: 'Not good yet',
    range: 'Under 60%',
    text: 'text-rose-300',
    bg: 'bg-rose-400/10',
    ring: 'ring-rose-400/30',
    solid: '#F43F5E',
    glow: 'rgba(244,63,94,0.45)'
  }
};

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'How does ClassMap decide my next test?',
    a: 'From how you did on the last one. If you do well in a topic, your next test in that topic is at a higher level. If you struggle, the next one is easier and covers your weak topics, so you can build them up properly before moving on.'
  },
  {
    q: 'What if I am weak in a topic?',
    a: 'For the topics you are weak in, you get video lessons that explain the idea, so you can clear your doubts and then try the test again.'
  },
  {
    q: 'Can I test myself whenever I want?',
    a: 'Yes. You can take a self-test in the app any time, on any topic, not only when a test has been set.'
  },
  {
    q: 'How do my handwritten answers get graded?',
    a: 'Write your answers on paper, photograph the pages and upload them in the ClassMap portal. ClassMap AI grades them and gives you a detailed analysis report.'
  },
  {
    q: 'How much does it cost?',
    a: `For now, students get access for ₹${PRICE} a month.`
  }
];

/**
 * The video lesson: a real ClassMap video on Photosynthesis (about 1 min 33 s,
 * explained in Hindi and English with subtitles on screen). Each part of the
 * topic starts at the time shown, read off the video itself, so a weak part can
 * open the lesson at the right moment.
 */
export const LESSON = {
  src: '/student/photosynthesis.mp4',
  poster: '/student/photosynthesis-poster.jpg',
  title: 'Photosynthesis',
  subtitle: 'How plants make their own food',
  subject: 'Science',
  duration: 93
};

/** The parts of the topic, with where each begins in the video. The colours are an example. */
export const PHOTOSYNTHESIS_PARTS: { name: string; band: Band; at: number }[] = [
  { name: 'The leaf and its cells', band: 'green', at: 28 },
  { name: 'Chloroplast and chlorophyll', band: 'green', at: 34 },
  { name: 'Water and carbon dioxide', band: 'yellow', at: 41 },
  { name: 'How light makes glucose', band: 'red', at: 50 },
  { name: 'The photosynthesis equation', band: 'red', at: 63 },
  { name: 'Why photosynthesis matters', band: 'green', at: 74 }
];

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
