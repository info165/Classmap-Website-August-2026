import handwrittenSheetImg from '../assets/images/handwritten_answer_sheet_1785252659162.jpg';
import principalImg from '../assets/images/indian_school_principal_1785252689155.jpg';
import teacherImg from '../assets/images/indian_teacher_portrait_1785252674410.jpg';

export interface AnswerSheetSample {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  studentName: string;
  questionNumber: string;
  questionText: string;
  traditionalMarks: string;
  classMapVerdict: string;
  handwrittenImageUrl: string;
  teacherAnnotations: {
    line: string;
    type: 'concept' | 'reasoning' | 'presentation' | 'positive';
    text: string;
  }[];
  intelligenceBreakdown: {
    conceptGaps: string[];
    reasoningFlaws: string[];
    presentationFlaws: string[];
    misconceptionPatterns: string[];
    recurringMistakes: string[];
    learningBehavior: string;
    remedialAction: string;
  };
  conceptMapNodes: {
    concept: string;
    status: 'mastered' | 'gap' | 'misconception';
    impactScore: number;
  }[];
}

export const ANSWER_SHEET_SAMPLES: AnswerSheetSample[] = [
  {
    id: 'sample-physics-1',
    subject: 'Physics',
    grade: 'Class 10 CBSE',
    topic: "Newton's Laws of Motion & Momentum",
    studentName: 'Aarav Sharma',
    questionNumber: 'Q4 (b) - 5 Marks',
    questionText: 'A vehicle of mass 1200 kg is moving with a velocity of 54 km/h. Brakes are applied to bring it to rest in 5 seconds. Calculate the retarding force and explain the energy transformation during braking.',
    traditionalMarks: '3.5 / 5.0',
    classMapVerdict: 'High formula accuracy, but fundamental misconception on Directional Force Vector vs Speed Unit Conversion.',
    handwrittenImageUrl: handwrittenSheetImg,
    teacherAnnotations: [
      {
        line: 'Step 1: u = 54 km/h = 15 m/s',
        type: 'positive',
        text: 'Correct unit conversion (54 × 5/18 = 15 m/s)'
      },
      {
        line: 'Step 2: a = (0 - 15) / 5 = -3 m/s²',
        type: 'concept',
        text: 'Student wrote negative sign but omitted vector interpretation in text summary.'
      },
      {
        line: 'Step 3: F = m × a = 1200 × 3 = 3600 N',
        type: 'reasoning',
        text: 'Reasoning flaw: Omitting negative force sign leads to confusing retarding force vs applied force.'
      },
      {
        line: 'Step 4: Energy transformed into sound only.',
        type: 'concept',
        text: 'Major Concept Gap: Missed Thermal/Heat energy dissipation in brake pads.'
      }
    ],
    intelligenceBreakdown: {
      conceptGaps: [
        'Fails to recognize Kinetic Energy converts primarily to Thermal Energy via friction (Braking Thermodynamics)',
        'Confuses magnitude of force with vector direction'
      ],
      reasoningFlaws: [
        'Jumped from a = -3 m/s² to F = +3600 N without declaring retarding direction explicitly'
      ],
      presentationFlaws: [
        'Omitted SI unit symbol [N] in intermediate calculation steps'
      ],
      misconceptionPatterns: [
        'Persistent pattern in 3 consecutive tests: Treats deceleration as a scalar subtraction rather than opposite vector acceleration.'
      ],
      recurringMistakes: [
        'Repeated omission of Thermal Energy loss in mechanics word problems (seen in Term 1 & Term 2 midterm).'
      ],
      learningBehavior: 'Shows rush in qualitative explanation questions despite strong numeric accuracy in formula substitution.',
      remedialAction: 'Targeted 5-minute visual simulation on Friction & Heat generation, followed by 3 vector sign practice problems.'
    },
    conceptMapNodes: [
      { concept: 'Unit Conversion (km/h to m/s)', status: 'mastered', impactScore: 100 },
      { concept: 'Kinematics Acceleration Equation', status: 'mastered', impactScore: 90 },
      { concept: 'Vector Direction of Force', status: 'misconception', impactScore: 45 },
      { concept: 'Energy Conservation in Friction', status: 'gap', impactScore: 30 }
    ]
  },
  {
    id: 'sample-math-1',
    subject: 'Mathematics',
    grade: 'Class 9 ICSE',
    topic: 'Quadratic Equations & Discriminant Analysis',
    studentName: 'Ananya Verma',
    questionNumber: 'Q7 - 4 Marks',
    questionText: 'Find the nature of the roots for the equation 3x² - 4√3 x + 4 = 0 and solve for x using the quadratic formula.',
    traditionalMarks: '2.0 / 4.0',
    classMapVerdict: 'Calculation correct up to Discriminant, but algebraic sign slip in radical simplification.',
    handwrittenImageUrl: handwrittenSheetImg,
    teacherAnnotations: [
      {
        line: 'b² - 4ac = (-4√3)² - 4(3)(4)',
        type: 'positive',
        text: 'Discriminant setup is flawless'
      },
      {
        line: '(-4√3)² = 16 × 3 = 48',
        type: 'positive',
        text: 'Correct radical square evaluation'
      },
      {
        line: 'D = 48 - 48 = 0 (Real & Equal roots)',
        type: 'positive',
        text: 'Correct identification of equal roots condition'
      },
      {
        line: 'x = (4√3 ± 0) / 2(3) = 4√3 / 6 = 2√3',
        type: 'reasoning',
        text: 'Division error: 4√3 / 6 simplified to 2√3 instead of 2√3 / 3 or 2 / √3'
      }
    ],
    intelligenceBreakdown: {
      conceptGaps: [
        'Simplification of rationalized fractions involving radical numerators and integer denominators'
      ],
      reasoningFlaws: [
        'Cancelled integer 6 with numerator 4 without preserving denominator factor 3'
      ],
      presentationFlaws: [
        'Did not state both equal roots x₁ = 2√3/3 and x₂ = 2√3/3 explicitly'
      ],
      misconceptionPatterns: [
        'Tends to rush arithmetic simplification when discriminant reduces to zero'
      ],
      recurringMistakes: [
        'Fractional division errors with square root numerators (observed in Chapter 3 Surds as well)'
      ],
      learningBehavior: 'Strong grasp of core formulas; needs systematic double-check routine for fraction cancellation.',
      remedialAction: 'Provide 2-step fraction reduction drill on radical expressions.'
    },
    conceptMapNodes: [
      { concept: 'Discriminant Formula (D=b²-4ac)', status: 'mastered', impactScore: 100 },
      { concept: 'Nature of Roots Identification', status: 'mastered', impactScore: 95 },
      { concept: 'Radical Expressions Arithmetic', status: 'misconception', impactScore: 50 },
      { concept: 'Explicit Root Stating', status: 'gap', impactScore: 60 }
    ]
  },
  {
    id: 'sample-chem-1',
    subject: 'Chemistry',
    grade: 'Class 10 CBSE',
    topic: 'Chemical Reactions & Stoichiometry',
    studentName: 'Rohan Gupta',
    questionNumber: 'Q3 - 3 Marks',
    questionText: 'Write the balanced chemical equation for the reaction between Lead Nitrate and Potassium Iodide. Name the type of reaction and state the color of the precipitate formed.',
    traditionalMarks: '1.5 / 3.0',
    classMapVerdict: 'Correctly identified double displacement, but incorrect formula writing for Lead Nitrate.',
    handwrittenImageUrl: handwrittenSheetImg,
    teacherAnnotations: [
      {
        line: 'PbNO₃ + KI → PbI + KNO₃',
        type: 'concept',
        text: 'Valency misconception: Lead valency +2 ignored (wrote PbNO₃ instead of Pb(NO₃)₂)'
      },
      {
        line: 'Yellow precipitate formed.',
        type: 'positive',
        text: 'Observation correct (Lead Iodide precipitate color)'
      },
      {
        line: 'Type: Double Displacement Reaction',
        type: 'positive',
        text: 'Reaction categorization correct'
      }
    ],
    intelligenceBreakdown: {
      conceptGaps: [
        'Cross-over valency method for polyatomic ions (Nitrate NO₃⁻ vs Lead Pb²⁺)'
      ],
      reasoningFlaws: [
        'Assumed 1:1 mole ratio without verifying ionic valency charges'
      ],
      presentationFlaws: [
        'Did not include physical state symbols (aq) and (s) for precipitate'
      ],
      misconceptionPatterns: [
        'Polyatomic ion charge confusion recurs in 4 out of 5 inorganic chemistry tests'
      ],
      recurringMistakes: [
        'Writing empirical formulas without checking polyatomic brackets'
      ],
      learningBehavior: 'Learns visual observations well (color, reaction type) but skips strict valence balancing rules.',
      remedialAction: 'Revisit Valency Grid worksheet for polyatomic radicals.'
    },
    conceptMapNodes: [
      { concept: 'Observation & Color Identification', status: 'mastered', impactScore: 100 },
      { concept: 'Reaction Type Classification', status: 'mastered', impactScore: 90 },
      { concept: 'Polyatomic Valency Balancing', status: 'gap', impactScore: 35 },
      { concept: 'State Symbols Notation', status: 'gap', impactScore: 55 }
    ]
  }
];

export interface DashboardViewTab {
  id: string;
  label: string;
  role: string;
  subtitle: string;
}

export const DASHBOARD_TABS: DashboardViewTab[] = [
  {
    id: 'heatmap',
    label: 'Class Learning Heatmap',
    role: 'Classroom Overview',
    subtitle: 'Aggregates concept-level mastery across sections, subjects, and terms.'
  },
  {
    id: 'student-profile',
    label: 'Student Learning Profile',
    role: 'Individual Graph',
    subtitle: 'Tracks a student’s cognitive journey, misconception trends, and remedy response.'
  },
  {
    id: 'teacher-hub',
    label: 'Teacher Action Hub',
    role: 'Teacher Portal',
    subtitle: 'Automated remedial lesson recommendations and 10-minute targeted interventions.'
  },
  {
    id: 'school-leader',
    label: 'School Director View',
    role: 'Institutional Intelligence',
    subtitle: 'Macro academic health metrics, department strengths, and cross-grade progress.'
  }
];

export const PRINCIPAL_TESTIMONIALS = [
  {
    id: '1',
    quote: "For decades, our term reports told us student marks dropped in Term 2. ClassMap finally showed us why—it wasn't lack of study, but a specific misconception in vector signs introduced in Class 8. Once we fixed the concept, marks naturally recovered.",
    name: "Dr. Sister Margaret D'Souza",
    title: "Principal & Director of Academics",
    school: "St. Xavier's Senior Secondary School, Bengaluru",
    stats: "1,850 Students Tracked",
    avatar: principalImg
  },
  {
    id: '2',
    quote: "Our teachers used to spend 15 hours a week correcting test papers and recording marks into spreadsheets without knowing what students actually understood. ClassMap turns correction into actionable teaching blueprints.",
    name: "Rajeshwar Mukhopadhyay",
    title: "Academic Coordinator & Vice Principal",
    school: "The Heritage International School, Kolkata",
    stats: "Saved 12 hrs/week per teacher",
    avatar: teacherImg
  },
  {
    id: '3',
    quote: "Parents don't get defensive anymore when we discuss performance. Instead of pointing at a low score, we open the ClassMap learning graph together and show the exact concept gap. It turns confrontation into collaboration.",
    name: "Sunita Krishnamurthy",
    title: "Head of Middle & Senior School",
    school: "Vidyashilp Academy, Hyderabad",
    stats: "96% Parent Satisfaction",
    avatar: principalImg
  }
];

export const CLASS_HEATMAP_DATA = [
  { concept: 'Newton\'s 1st Law (Inertia)', sectionA: 88, sectionB: 92, sectionC: 84, overall: 'Mastered' },
  { concept: 'Newton\'s 2nd Law (F=ma Calculation)', sectionA: 72, sectionB: 68, sectionC: 65, overall: 'Review Needed' },
  { concept: 'Vector Direction of Friction', sectionA: 42, sectionB: 38, sectionC: 45, overall: 'Critical Gap' },
  { concept: 'Impulse & Momentum Theorem', sectionA: 58, sectionB: 61, sectionC: 52, overall: 'Misconception' },
  { concept: 'Thermal Energy Dissipation in Braking', sectionA: 34, sectionB: 29, sectionC: 31, overall: 'Critical Gap' },
  { concept: 'Action-Reaction Pair Identification', sectionA: 91, sectionB: 89, sectionC: 93, overall: 'Mastered' }
];
