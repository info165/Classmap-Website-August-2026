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
  /** Shown under the author's name in the byline block, e.g. 'Executive Editor'. */
  authorRole?: string;
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
  /* ------------------------------------------------------------------
     TEMPORARILY UNPUBLISHED - do not delete.

     Commented out on request, not removed. Uncomment this block to put
     the post back; nothing else needs changing. Its cover image is still
     on disk at public/blog/r3-third-language.jpg and still committed, so
     restoring the post needs no new assets.

     While it is out, /blog/r3-the-third-language-question no longer
     resolves to a post. That is handled: an unknown slug falls through to
     the listing rather than erroring.
     ------------------------------------------------------------------ */
  /*
  {
    slug: 'r3-the-third-language-question',
    title: 'R3: The Third Language Question India’s Schools Must Answer',
    excerpt:
      'India’s three-language framework aims to strengthen multilingualism — but the real challenge is not choosing three languages. It is making sure every school has the teachers, resources, time, and flexibility to teach them well.',
    author: 'Janvi Surana',
    authorRole: 'Executive Editor',
    date: '2026-08-28',
    readMinutes: 4,
    category: 'Policy',
    coverImage: '/blog/r3-third-language.jpg',
    coverAlt:
      'A school student in uniform seated at a desk with an open notebook and a globe, looking towards a row of open coloured doors, each marked with a letter of an Indian script and opening onto a different landscape or classroom',
    body: [
      {
        type: 'paragraph',
        text: 'For a Class 6 student, learning a third language may sound like an exciting opportunity to discover a new culture and way of communicating. But what happens when the language a student wants to learn is not offered by their school? Or when there is no trained teacher, textbook, worksheet, or digital material available for it? This is where the gap between policy and classroom reality becomes visible. The three-language framework, being implemented from Class 6, is designed to promote multilingualism, but schools across India operate with very different resources. For many students, their “choice” of a third language may ultimately depend less on what interests them and more on what their school can provide.',
      },
      {
        type: 'paragraph',
        text: 'The deeper issue is that language learning is not like adding another textbook-based subject to the timetable. A language requires regular speaking, listening, reading, writing, and meaningful interaction. Teachers therefore need specialised training, while students need consistent learning material and classroom practice. The challenge becomes even more complex in regions such as the Northeast, where students may already speak indigenous or local languages but schools can struggle to find trained teachers to formally teach them. Existing resources such as Jaadui Pitara, Bhasha Sangam, and multilingual primers can support the vision, but resources alone cannot solve the implementation gap. Student transfers create another complication: a language combination available in one state or school may not be available in another, potentially disrupting a student’s learning journey.',
      },
      {
        // Same block the other two posts use. R3 is the piece's own shorthand
        // for the three-language framework, so it fits the slot a figure holds
        // there; the caption is verbatim from the paragraph above.
        type: 'stat',
        value: 'R3',
        label:
          'The three-language framework, being implemented from Class 6, is designed to promote multilingualism, but schools across India operate with very different resources.',
      },
      {
        type: 'paragraph',
        text: 'This is why implementation needs to be student-centred and phased rather than simply policy-driven. Schools need to first map which languages students want to learn, assess teacher availability, and identify gaps in textbooks and digital resources. Teachers should receive training in beginner-language pedagogy, and schools should use technology and shared digital resources where qualified teachers are unavailable. The Supreme Court’s recent consideration of whether CBSE should postpone Class 6 implementation highlights these practical concerns. The Court has also raised questions around how English fits within the framework and whether students would have adequate preparation time before being assessed in Class 10. A phased rollout could give schools time to build capacity instead of making students absorb the consequences of an unprepared system.',
      },
      {
        // Pull quote: repeats the opening of the paragraph below it, the same
        // editorial pattern used in the two posts above.
        type: 'quote',
        text: 'Ultimately, the debate around R3 is not really about whether students should learn another language. It is about whether they will have a genuine choice in doing so.',
      },
      {
        type: 'paragraph',
        text: 'Ultimately, the debate around R3 is not really about whether students should learn another language. It is about whether they will have a genuine choice in doing so. Promoting Indian languages is an important educational goal, but that goal can only succeed when schools have the teachers, infrastructure, learning materials, training, and classroom time to support it. The most important question is therefore not, “How many languages should a student learn?” but “Can every student access the language they are being asked to learn?” A strong language policy should expand a child’s opportunities, not make their third-language choice a reflection of their school’s limitations.',
      },
    ],
  },
  */

  {
    slug: 'nep-2020-marks-over-meaning-five-years-in',
    title:
      'NEP 2020 Promised to End “Marks Over Meaning.” Five Years In, Its Own Data Shows Why That’s Still Hard.',
    excerpt:
      'The uncomfortable numbers from India’s new assessment system may look like evidence of failure. They may actually be evidence that the system has finally started measuring the problem it was designed to fix.',
    author: 'Janvi Surana',
    authorRole: 'Executive Editor',
    date: '2026-08-21',
    readMinutes: 5,
    category: 'Assessment',
    coverImage: '/blog/nep-2020-parakh.jpg',
    coverAlt:
      'A teacher in an Indian secondary classroom pointing at a wall-mounted screen showing a learning analytics dashboard of charts, while uniformed students take handwritten notes at their desks',
    body: [
      {
        type: 'paragraph',
        text: 'India spent years measuring what students could reproduce on an exam. NEP 2020 set out to change that: move assessment towards competencies, conceptual understanding and continuous feedback. Five years later, PARAKH, the national assessment body created under this reform, has produced some uncomfortable numbers. Its Rashtriya Sarvekshan 2024 covered 21,15,022 students across 74,229 schools, 781 districts and 36 states and UTs. Mathematics was the weakest-performing area nationally, with students averaging 46%, compared with 57% in Language and 49% in “The World Around Us” at Class 6. The instinctive reaction is to ask: if this is what NEP has achieved, has the reform failed? But there is a more useful question. What if the biggest change is that India can now see the learning problem at this scale and at the level of actual competencies, instead of seeing only marks?',
      },
      {
        type: 'paragraph',
        text: 'That distinction matters. A score tells you how a student performed on an assessment. A competency measure can tell you what the student can actually do. PARAKH was created to make that shift, moving assessment away from being a one-time judgement towards a continuous and more inclusive process. Yet the survey shows why changing the assessment framework does not automatically change classroom learning. If a student has spent years learning how to reproduce answers, introducing competency-based questions will expose the gap immediately. A child may remember a mathematical formula but struggle to apply it to an unfamiliar problem. They may read a passage fluently but struggle to infer meaning from it. The problem is therefore bigger than examination design. Assessment can reveal the learning gap, but schools still need the capacity to diagnose why that gap exists and respond to it.',
      },
      {
        // The headline figure, lifted out to break the run of prose. Value and
        // wording are both verbatim from the paragraph above.
        type: 'stat',
        value: '46%',
        label:
          'Mathematics was the weakest-performing area nationally, with students averaging 46%, compared with 57% in Language and 49% in “The World Around Us” at Class 6.',
      },
      {
        type: 'paragraph',
        text: 'That is where the next phase of NEP matters. Schools should treat assessment results as diagnostic signals, not as another ranking exercise. Instead of asking only, “What did this student score?”, teachers and school leaders need to ask, “Which concept did the student fail to understand?”, “Was the difficulty recall, application or reasoning?”, and “What should happen next?” At a classroom level, that means using short, competency-focused assessments regularly, grouping errors by concept, giving targeted remediation and checking whether the intervention actually worked. At a system level, it means using large-scale data like PARAKH to identify patterns across grades, subjects and regions. The value of a national assessment is not that it tells India that mathematics is weak. India already knew that. Its value is that it can help identify where, when and how learning starts breaking down.',
      },
      {
        // Pull quote: repeats the opening of the paragraph below it, the same
        // editorial pattern used in the post above.
        type: 'quote',
        text: 'The 46% mathematics score should not be read as a final verdict on NEP 2020. It is a baseline for a reform that is still unfinished.',
      },
      {
        type: 'paragraph',
        text: 'So the 46% mathematics score should not be read as a final verdict on NEP 2020. It is a baseline for a reform that is still unfinished. The uncomfortable part is that competency-based assessment can make the old problem look worse because it measures learning more honestly. That is not the same as creating the problem. The real test of NEP will come next: whether schools use this new visibility to change instruction, remediation and assessment itself. For decades, India often asked students for marks without having enough evidence about the learning behind those marks. PARAKH is beginning to change that equation. The harder question now is whether the education system is ready to act on what the data is telling it.',
      },
    ],
  },
  {
    slug: 'board-exams-and-entrance-tests-balance',
    title:
      'How Can India’s Education System Strike the Right Balance Between Board Exams and Entrance Tests?',
    excerpt:
      'Board exams and entrance tests reward different skills, so students end up preparing for two parallel systems instead of one meaningful learning journey.',
    author: 'Janvi Surana',
    authorRole: 'Executive Editor',
    date: '2026-08-14',
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
