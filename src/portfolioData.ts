export type Experience = {
  role: string
  company: string
  start: string
  end: string
  bullets: string[]
}

export type Education = {
  institution: string
  program: string
  start: string
  end: string
  detail?: string
}

export type Certification = {
  title: string
  issuingOrg: string
  date: string
  credentialId?: string
  credentialUrl?: string
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  features: string[]
  githubUrl?: string
  liveUrl?: string
}

export const portfolioData = {
  name: 'Nilesh Kumar Metakota',
  /** First / middle / last — shown horizontally in hero */
  nameParts: ['Nilesh', 'Kumar', 'Metakota'] as const,
  shortName: 'Nilesh Kumar Metakota',
  title: 'Junior ML Engineer',
  location: 'Pithapuram, India',
  email: 'nilesh.metakota@gmail.com',
  phone: '+91 8309854539',
  githubHandle: 'nileshmetakota-17',
  linkedinHandle: 'Nilesh_Metakota',
  links: {
    github: 'https://github.com/nileshmetakota-17',
    linkedin: 'https://www.linkedin.com/in/Nilesh_Metakota',
  },
  resume: {
    path: '/Nilesh_Metakota_resume.pdf',
    downloadName: 'Nilesh_Metakota_resume.pdf',
  },
  hero: {
    tagline: 'Building scalable digital experiences with modern technologies.',
    intro: [
      'Aspiring Machine Learning Engineer with hands-on robotics internship experience.',
      'Focused on model training, dataset preparation, and optimization to deliver reliable automation.',
    ],
    cta: {
      downloadResumeLabel: 'Download Resume',
      contactLabel: 'Contact Me',
      viewProjectsLabel: 'View Projects',
    },
    typewriterPhrases: ['Machine Learning Engineer', 'Robotics ML', 'Full-Stack Builder'],
  },
  stats: [
    { label: 'Experience Roles', value: '3', hint: 'ML + Testing + Web' },
    { label: 'Projects Built', value: '2', hint: 'Portfolio + Fitoo' },
    { label: 'Certifications', value: '1', hint: 'Full-Stack Internship' },
    { label: 'Collaboration Style', value: 'Team', hint: 'Agile & cross-functional' },
  ],
  skills: {
    technical: [
      { category: 'Programming Languages', items: ['Python', 'C++'] },
      {
        category: 'Web Development',
        items: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub', 'Visual Studio Code'],
      },
      {
        category: 'Machine Learning',
        items: ['Model Training', 'Dataset Preparation', 'Evaluation', 'Optimization'],
      },
      { category: 'Tooling / Platforms', items: ['GitHub', 'VS Code'] },
    ],
    professional: [
      { category: 'Professional Skills', items: ['Problem-Solving', 'Teamwork', 'Adaptability', 'Communication'] },
      { category: 'Languages', items: ['Telugu (Native)', 'English (Fluent)', 'Hindi (Proficient)'] },
    ],
    progress: [
      { label: 'Model Training', value: 78 },
      { label: 'Dataset Preparation', value: 74 },
      { label: 'Evaluation & Optimization', value: 70 },
      { label: 'Python', value: 76 },
      { label: 'Web Fundamentals', value: 68 },
      { label: 'Team Collaboration', value: 72 },
    ],
  },
  experience: [
    {
      role: 'Junior ML Engineer',
      company: 'Bhairav Robotics Pvt. Ltd.',
      start: '07/2025',
      end: 'Present',
      bullets: [
        'Collaborate with cross-functional teams to build and deploy ML models for robotics and automation systems.',
        'Prepare, preprocess, and label datasets to enhance model accuracy and performance.',
        'Develop and optimize data pipelines for efficient training, validation, and deployment workflows.',
        'Perform continuous monitoring, evaluation, and fine-tuning to improve precision, reliability, and response times.',
      ],
    },
    {
      role: 'Test Engineer Intern',
      company: 'Bhairav Robotics Pvt. Ltd.',
      start: '03/2025',
      end: '06/2025',
      bullets: [
        'Assist in testing and validating ML and automation systems to improve system reliability.',
        'Support debugging, performance analysis, and evaluation workflows for AI model testing.',
        'Collaborate during development and deployment to ensure smooth integration.',
      ],
    },
    {
      role: 'Full Stack Web Development Intern',
      company: 'Ava Intern Edutech Pvt. Ltd.',
      start: '11/2024',
      end: '05/2025',
      bullets: [
        'Develop project-based full-stack web applications using HTML, CSS, JavaScript, and modern frameworks.',
        'Design and deploy responsive, user-friendly interfaces with a focus on UX.',
        'Work in agile sprints to debug, test, and integrate new features.',
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      title: 'Fitoo – AI Integrated Meal & Workout Management System',
      description:
        'Android fitness app combining meal logging, workout tracking, step-based activity, and an in-app AI coach (Sensei) with Room database storage.',
      technologies: ['Java', 'Android', 'Room SQLite', 'Material 3', 'OpenAI / AI Coach'],
      features: [
        'Five-tab app: Home, Meals, Workouts, Sensei AI chat, and Profile with goals and macro targets.',
        'Meal logging with local and Open Food Facts nutrition lookup; diet plans applied to daily meals.',
        'Workout routines, today’s log, and Sensei actions to apply diet/workout templates with undo.',
      ],
      githubUrl: 'https://github.com/nileshmetakota-17/Fitoo-',
      liveUrl: '',
    },
    {
      title: 'Personal Portfolio Website',
      description:
        'Recruiter-friendly portfolio showcasing skills, experience, projects, and contact — built with a modern dark UI, animations, and responsive layout.',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      features: [
        'Sticky scroll-spy navigation, animated hero, skills bars, and timeline experience section.',
        'Resume download (Nilesh_Metakota_resume.pdf), GitHub/LinkedIn links, and validated contact form.',
        'Production-ready structure deployable to Vercel, Netlify, or GitHub Pages.',
      ],
      githubUrl: 'https://github.com/nileshmetakota-17/Portfolio',
      liveUrl: '',
    },
  ] satisfies Project[],
  education: [
    {
      institution: 'Kakinada Institute of Technology and Science (KITS), AUTONOMOUS',
      program: 'B.Tech in Computer Science and Engineering',
      start: '2025',
      end: 'Present',
    },
    {
      institution: 'Aditya College of Engineering and Technology, SBTET Board',
      program: 'Diploma in Computer Engineering',
      start: '2022',
      end: '2025',
      detail: '85.38%',
    },
    {
      institution: 'Bhashyam EM High School, SSC Board',
      program: 'Secondary Education (10th Grade)',
      start: '2021',
      end: '2021',
      detail: '98%',
    },
  ] satisfies Education[],
  certifications: [
    {
      title: 'Full Stack Web Development Internship Certificate',
      issuingOrg: 'Ava Intern Edutech Pvt. Ltd.',
      date: '2025-05-20',
      credentialId: 'AVA-2022-200096',
      credentialUrl: '',
    },
  ] satisfies Certification[],
  achievements: [
    {
      title: 'Robotics ML integration (real-world impact)',
      description:
        'Contributed to deploying trained models in robotic environments, supporting seamless system performance and scalability.',
    },
    {
      title: 'Data pipelines that keep training reliable',
      description:
        'Optimized data preparation and pipelines for training, validation, and deployment workflows to improve iteration speed.',
    },
    {
      title: 'Delivering polished full-stack experiences',
      description:
        'Built responsive web applications during internship, combining front-end fundamentals with practical integration in agile sprints.',
    },
    {
      title: 'Certification-backed full-stack learning',
      description:
        'Completed the Full Stack Web Development Internship Certificate (Ava Intern Edutech Pvt. Ltd.).',
    },
  ],
}

