/**
 * Blog content.
 *
 * Posts are plain data so writing a new one never means touching a component.
 * Bodies are built from typed blocks rather than raw HTML, which keeps the
 * styling consistent and means nothing unescaped is ever injected into the page.
 *
 * To add a post: copy an entry, give it a unique `slug`, and fill in the body.
 * Newest first — the list renders in array order.
 */

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  /** A single figure lifted out of the prose, with the sentence it came from. */
  | { type: 'stat'; value: string; label: string }
  /** Drop the file in public/blog/ and reference it as '/blog/filename.jpg'. */
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface BlogPost {
  /** URL-safe id, also used as the React key. Must be unique. */
  slug: string;
  title: string;
  /** One or two lines shown on the card in the listing. */
  excerpt: string;
  author: string;
  /** ISO yyyy-mm-dd. Formatted for display at render time. */
  date: string;
  readMinutes: number;
  /** Short label shown as a pill, e.g. 'Assessment', 'Product'. */
  category: string;
  /**
   * Cover image for the card and the top of the article. Put the file in
   * public/blog/ and reference it as '/blog/filename.jpg'. Optional — posts
   * without one fall back to a tinted panel rather than a broken layout.
   */
  coverImage?: string;
  coverAlt?: string;
  body: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'board-exams-and-entrance-tests-balance',
    title:
      'How Can India’s Education System Strike the Right Balance Between Board Exams and Entrance Tests?',
    excerpt:
      'Board exams and entrance tests reward different skills, so students end up preparing for two parallel systems instead of one meaningful learning journey.',
    author: 'ClassMap Team',
    date: '2026-08-04',
    readMinutes: 4,
    category: 'Policy',
    coverImage: '/blog/board-exams-entrance-tests.jpg',
    coverAlt:
      'A handwritten examination answer booklet with a fountain pen beside an OMR multiple-choice answer sheet with a pencil, on a sunlit wooden desk',
    body: [
      {
        type: 'paragraph',
        text: 'Every year, millions of Indian students prepare for two entirely different examinations that often reward different skills. In 2026 alone, nearly 54.5 lakh students registered for India’s three largest entrance exams — JEE Main (16 lakh+), NEET UG (22.7 lakh), and CUET UG (15.68 lakh) — while millions more appeared for state and board examinations. Instead of complementing one another, these assessments frequently require different preparation strategies, leading students towards coaching institutes, long study hours, and mounting stress. Education should encourage curiosity and understanding, yet for many students, it becomes a race to perform well in multiple high-stakes examinations.',
      },
      {
        type: 'paragraph',
        text: 'The problem isn’t that India conducts both board and entrance examinations — it’s that they evaluate success differently. Board exams primarily assess a student’s understanding of the prescribed curriculum, whereas entrance tests emphasize speed, accuracy, and competitive problem-solving. This disconnect forces students to prepare for two parallel systems rather than one meaningful learning journey. The consequences are becoming increasingly visible. Over the last decade, the number of CBSE Class 12 students scoring 95% and above has risen by 247%, far outpacing the growth in student registrations. While higher achievement is encouraging, it also shows that board marks alone are becoming less effective at differentiating students, which is one of the reasons universities increasingly rely on separate entrance examinations.',
      },
      {
        // Her own figure, lifted out to break the run of prose. Both the number
        // and the wording come from the paragraph above it.
        type: 'stat',
        value: '247%',
        label:
          'Rise over the last decade in the number of CBSE Class 12 students scoring 95% and above — far outpacing the growth in student registrations.',
      },
      {
        type: 'paragraph',
        text: 'Rather than debating whether board exams or entrance tests should dominate, the focus should be on making both work together. Board examinations should continue to measure conceptual understanding through competency-based questions, projects, practical assessments, and the flexibility of multiple attempts. Entrance examinations, meanwhile, should test aptitude and analytical thinking without becoming a completely separate ecosystem driven by coaching. A balanced admission framework where school performance, standardized entrance scores, and continuous assessment each contribute meaningfully would reduce dependence on a single exam while encouraging students to learn consistently throughout the academic year instead of preparing for isolated tests.',
      },
      {
        // Pull quote: repeats the line that follows, which is standard editorial
        // practice and gives the eye somewhere to land.
        type: 'quote',
        text: 'India doesn’t need fewer examinations — it needs smarter ones.',
      },
      {
        type: 'paragraph',
        text: 'India doesn’t need fewer examinations — it needs smarter ones. A fair assessment system should reward understanding, application, creativity, and consistency rather than memorization or test-taking strategies alone. When board examinations and entrance tests are aligned with the same educational goals, students spend less time juggling two disconnected systems and more time developing skills that will serve them in higher education, careers, and life. The real measure of success should not be how many exams a student can survive, but how well the education system prepares them for the future.',
      },
    ],
  },
];
