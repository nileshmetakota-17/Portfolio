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
  title: 'Robotics Software Engineer',
  location: 'Pithapuram, India',
  email: 'nilesh.metakota@gmail.com',
  phone: '+91 8309854539',
  githubHandle: 'nileshmetakota-17',
  linkedinHandle: 'Nilesh_Metakota',
  links: {
    github: 'https://github.com/nileshmetakota-17',
    linkedin: 'https://www.linkedin.com/in/nilesh-kumar-metakota-4ab347335',
  },
  resume: {
    path: '/Nilesh_Metakota_2026.pdf',
    downloadName: 'Nilesh_Metakota_2026.pdf',
  },
  hero: {
    tagline: 'Building autonomous robots that navigate the real world.',
    intro: [
      'Robotics Software Engineer at Bhairav Robotics, working with ROS 2, Nav2, and LiDAR-based navigation.',
      'Combining autonomous navigation, sensor integration, and machine learning to build reliable automation.',
    ],
    cta: {
      downloadResumeLabel: 'Download Resume',
      contactLabel: 'Contact Me',
      viewProjectsLabel: 'View Projects',
    },
    typewriterPhrases: ['Autonomous Navigation', 'Robotics Software', 'Machine Learning', 'AI-powered Applications'],
  },
  stats: [
    { label: 'Experience Roles', value: '4', hint: 'Robotics, ML, testing & web' },
    { label: 'Featured Projects', value: '2', hint: 'Autonomous navigation & Fitoo' },
    { label: 'Certifications', value: '1', hint: 'Full-Stack Internship' },
    { label: 'Collaboration Style', value: 'Team', hint: 'Agile & cross-functional' },
  ],
  skills: {
    technical: [
      { category: 'Programming Languages', items: ['Python', 'C++'] },
      {
        category: 'Robotics & Navigation',
        items: ['ROS 2', 'Nav2', 'LiDAR Navigation', 'Point-to-Point Navigation', 'Autonomous Navigation', 'Obstacle Avoidance'],
      },
      {
        category: 'Web Development',
        items: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub', 'Visual Studio Code'],
      },
      {
        category: 'Machine Learning',
        items: ['Model Training', 'Dataset Preparation', 'Evaluation', 'Optimization'],
      },
      { category: 'Sensor Integration', items: ['LiDAR', 'GPS', 'Camera Integration', 'Sensor Fusion'] },
    ],
    professional: [
      { category: 'Professional Skills', items: ['Problem-Solving', 'Teamwork', 'Adaptability', 'Communication'] },
      { category: 'Languages', items: ['Telugu (Native)', 'English (Fluent)', 'Hindi (Proficient)'] },
    ],
    focus: [
      { label: 'Autonomous navigation', detail: 'ROS 2 / Nav2 workflows for movement between target locations.' },
      { label: 'Environmental awareness', detail: 'Obstacle detection and avoidance with LiDAR, GPS, and camera integration.' },
      { label: 'Machine learning workflows', detail: 'Dataset preparation, model training, evaluation, and optimization.' },
      { label: 'Application development', detail: 'Responsive interfaces, API integration, and AI-assisted features.' },
    ],
  },
  experience: [
    {
      role: 'Robotics Software Engineer',
      company: 'Bhairav Robotics Pvt. Ltd.',
      start: '05/2026',
      end: 'Present',
      bullets: [
        'Develop point-to-point navigation capabilities using the ROS 2 navigation stack.',
        'Implement autonomous workflows to move robots between predefined target locations.',
        'Integrate obstacle detection and avoidance for safe autonomous navigation.',
        'Work with LiDAR, GPS, and camera data for sensor fusion, localization, and navigation.',
        'Integrate navigation components to improve path planning and autonomous movement.',
      ],
    },
    {
      role: 'Junior ML Engineer',
      company: 'Bhairav Robotics Pvt. Ltd.',
      start: '07/2025',
      end: '04/2026',
      bullets: [
        'Collaborated with cross-functional teams to build and deploy ML models for robotics and automation systems.',
        'Prepared, preprocessed, and labeled datasets to enhance model accuracy and performance.',
        'Developed and optimized data pipelines for efficient training, validation, and deployment workflows.',
        'Performed continuous monitoring, evaluation, and fine-tuning to improve precision, reliability, and response times.',
      ],
    },
    {
      role: 'Test Engineer Intern',
      company: 'Bhairav Robotics Pvt. Ltd.',
      start: '03/2025',
      end: '06/2025',
      bullets: [
        'Assisted in testing and validating ML and automation systems to improve system reliability.',
        'Supported debugging, performance analysis, and evaluation workflows for AI model testing.',
        'Collaborated during development and deployment to ensure smooth integration.',
      ],
    },
    {
      role: 'Full Stack Web Development Intern',
      company: 'Ava Intern Edutech Pvt. Ltd.',
      start: '11/2024',
      end: '05/2025',
      bullets: [
        'Developed project-based full-stack web applications using HTML, CSS, JavaScript, and modern frameworks.',
        'Designed and deployed responsive, user-friendly interfaces with a focus on UX.',
        'Worked in agile sprints to debug, test, and integrate new features.',
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      title: 'LiDAR-Based Autonomous Navigation',
      description: 'A ROS 2 navigation system for autonomous robot movement between target locations, with obstacle avoidance and sensor integration.',
      technologies: ['ROS 2', 'Nav2', 'LiDAR', 'GPS', 'Camera Integration'],
      features: [
        'Point-to-point navigation between predefined target locations using the ROS 2 navigation stack.',
        'Obstacle detection and avoidance, with team collaboration on GPS and camera integration.',
        'Navigation testing and debugging to improve movement reliability and environmental awareness.',
      ],
      githubUrl: 'https://github.com/nileshmetakota-17/Lidar_navigation',
      liveUrl: '',
    },
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
      title: 'Autonomous navigation development',
      description: 'Developed ROS 2 navigation workflows with point-to-point movement, obstacle avoidance, and LiDAR, GPS, and camera integration.',
    },
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

