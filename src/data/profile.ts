// Approved public profile content, ported from the CV site. Privacy boundary: no NIP, KTP/NPWP/BPJS,
// home address, family records, decree/certificate numbers, religion, marital status or physical data.

export const identity = {
  name: 'Juli Yandi Rahman, S.Mat',
  shortName: 'Juli Yandi Rahman',
  positioning:
    'Mathematics graduate, statistical research consultant, data and information systems practitioner, and AI and cybersecurity learner.',
  origin: 'Kotawaringin Barat, Indonesia',
  location: 'Indonesia',
  github: 'https://github.com/juliyandi35',
  githubHandle: 'juliyandi35',
  linkedin: 'https://www.linkedin.com/in/juli-yandi-rahman-3a2257290',
  email: 'juliyandi35@gmail.com',
  phone: '081348609836',
  heroSubtext: 'Mathematics, statistical modelling, data systems, and applied AI across 301 public repositories.',
}

export const disclaimer =
  'Personal portfolio. Views and projects presented here are personal and do not represent an institution.'

export const trajectory = [
  {
    year: '2020 – 2024',
    label: 'Formation',
    title: 'Mathematics education',
    body: "S-1 Mathematics at Universitas Pertahanan Republik Indonesia, graduating with a GPA of 3.56. A parallel research program at the National Research and Innovation Agency's Data and Information Science Research Center followed in 2023.",
  },
  {
    year: '2023 – 2024',
    label: 'Practice',
    title: 'Statistical research consulting',
    body: 'As a Research Consultant at Educativa ID, processed client research data with regression, clustering, machine learning and other methods, then prepared interpretations and full results-and-discussion chapters.',
  },
  {
    year: '2025 – present',
    label: 'Systems',
    title: 'Government data and information systems',
    body: 'Civil servant at the Ministry of Defense of the Republic of Indonesia, in the Data Management and Application Systems field at the Data and Information Center, working on data services for the ministry.',
  },
  {
    year: '2025 – 2026',
    label: 'Extension',
    title: 'AI and cybersecurity development',
    body: 'Structured coursework spanning network foundations, network defense, ethical hacking, vulnerability assessment and penetration testing, security operations, and generative AI application development.',
  },
]

export const workExperience = [
  {
    organization: 'Ministry of Defense of the Republic of Indonesia',
    role: 'Sandiman Pertama / Ahli Pertama, Data Management and Application Systems, Data and Information Center',
    period: '1 June 2026 – present',
    current: true,
    responsibilities: [
      'Civil servant, rank Penata Muda III/a.',
      'Current unit: Bidang Manajemen Data dan Sistem Aplikasi, Pusat Data dan Informasi, Kementerian Pertahanan RI.',
    ],
  },
  {
    organization: 'Ministry of Defense of the Republic of Indonesia',
    role: 'Sandiman Pertama / Ahli Pertama, Data Services Sub-Field, Data Management and Application Systems',
    period: '4 June 2025 – 31 May 2026',
    current: false,
    responsibilities: [
      'Sub Bidang Layanan Data, Bidang Manajemen Data dan Sistem Aplikasi, Pusat Data dan Informasi, Kementerian Pertahanan RI.',
      'CPNS appointment began 1 June 2025; PNS appointment began 1 June 2026.',
    ],
  },
  {
    organization: 'Educativa ID',
    role: 'Research Consultant in Statistical Data Processing',
    period: '2023 – 2024',
    current: false,
    responsibilities: [
      'Processed research data using regression, clustering, machine learning, and other methods requested by clients.',
      'Prepared concise interpretations and full results-and-discussion chapters based on completed analyses.',
      'Presented material and supported discussion or question-and-answer sessions with clients through online meetings when needed.',
    ],
  },
]

export const education = [
  { institution: 'Universitas Pertahanan Republik Indonesia', program: 'S-1 Mathematics', period: '2020 – 2024', detail: 'GPA 3.56', primary: true },
  { institution: 'National Research and Innovation Agency', program: 'Data and Information Science Research Center', period: '2023', detail: 'GPA 4.00 — research program', primary: true },
  { institution: 'SMA Negeri 1 Kumai', program: 'Secondary education', period: 'Graduated 2020', primary: false },
  { institution: 'MTs Negeri Kumai', program: 'Lower secondary education', period: 'Graduated 2017', primary: false },
  { institution: 'SD Negeri 2 Kumai Hilir', program: 'Primary education', period: 'Graduated 2014', primary: false },
]

export const organization = {
  name: 'UNHAN RI Research and Technology',
  role: 'Member',
  period: '2022',
  detail: 'Participated in discussions related to research conducted by formed research groups.',
}

export const structuralTraining = [
  { title: 'Latsar CPNS Golongan III', period: '2026', detail: 'Completed 21 April 2026' },
  { title: 'Pendidikan Militer DIK KOMCAD', period: '2021', detail: 'Completed 8 September 2021' },
]

export const courses = [
  { title: 'Gen AI Engineer Bootcamp: Build AI Apps & Agents in Python', provider: 'Udemy', hours: 11, completed: '23 August 2026', group: 'AI and data' },
  { title: 'MTCNA', provider: 'PT Citraweb Solusi Teknologi', hours: 40, completed: '23 December 2025', group: 'Networking and cybersecurity' },
  { title: 'Security Operation Center', provider: 'PT Xirka Dama Persada', hours: 40, completed: '5 September 2025', group: 'Networking and cybersecurity' },
  { title: 'Vulnerability Assessment and Penetration Testing', provider: 'PT Xirka Dama Persada', hours: 40, completed: '25 August 2025', group: 'Networking and cybersecurity' },
  { title: 'Ethical Hacking', provider: 'PT Xirka Dama Persada', hours: 40, completed: '15 August 2025', group: 'Networking and cybersecurity' },
  { title: 'Network Defense', provider: 'PT Xirka Dama Persada', hours: 40, completed: '8 August 2025', group: 'Networking and cybersecurity' },
  { title: 'Network Enterprise', provider: 'PT Xirka Dama Persada', hours: 40, completed: '1 August 2025', group: 'Networking and cybersecurity' },
  { title: 'Network Foundation Specialist', provider: 'PT Xirka Dama Persada', hours: 40, completed: '25 July 2025', group: 'Networking and cybersecurity' },
  { title: 'Aptis', provider: 'British Council Indonesia Foundation', hours: undefined, completed: '13 August 2024', group: 'Language and spatial analysis' },
  { title: 'Intermediate Spatial Data Analysis with R, QGIS & More', provider: 'Udemy', hours: 5, completed: '3 July 2024', group: 'Language and spatial analysis' },
]

export const skillClusters = [
  { label: 'Statistical computing', items: ['R and RStudio', 'Python', 'MATLAB', 'IBM SPSS Statistics', 'EViews 12', 'Stata 17', 'Minitab'] },
  { label: 'Data and AI', items: ['Applied machine learning', 'Applied AI', 'MySQL', 'Statistical modelling', 'Research data processing'] },
  { label: 'Research software', items: ['SmartPLS', 'JASP', 'AMOS', 'Maple', 'Mendeley'] },
  { label: 'Spatial tools', items: ['QGIS', 'Spatial statistics', 'Geographic data workflows'] },
  { label: 'Productivity', items: ['Microsoft Word', 'Excel', 'PowerPoint'] },
  { label: 'Security foundations', items: ['Networking fundamentals', 'Network defense', 'Ethical hacking foundations', 'Vulnerability assessment'] },
  { label: 'Communication', items: ['Technical presentation', 'Client-facing discussion', 'Data visualization and dashboards'] },
  { label: 'Mentoring', items: ['Mentoring', 'Cross-functional collaboration'] },
]

export const softSkills = ['Communicative', 'Thorough', 'Responsible', 'Deft and resourceful', 'Adaptive']

export const languages = [
  { name: 'Indonesian', level: 'Native' },
  { name: 'English', level: 'Active, professionally fluent' },
  { name: 'Japanese', level: 'Active' },
]

export const methodGloss: Record<string, string> = {
  'Deret waktu & peramalan': 'Time series & forecasting',
  'Keuangan, biaya & risiko': 'Finance, cost & risk',
  'Kualitatif, literatur & penulisan': 'Qualitative research, literature & writing',
  'Machine learning, AI & data mining': 'Machine learning, AI & data mining',
  'MCDM, optimasi & riset operasi': 'Multi-criteria decision making, optimization & operations research',
  'Meta-analisis & sintesis bukti': 'Meta-analysis & evidence synthesis',
  'Pemodelan matematis, numerik & kendali': 'Mathematical modelling, numerical methods & control',
  'Regresi, korelasi & ekonometrika': 'Regression, correlation & econometrics',
  'SEM, pengukuran & psikometri': 'Structural equation modelling, measurement & psychometrics',
  'Spasial, geografis & GIS': 'Spatial, geographic & GIS analysis',
  'Statistik deskriptif & pengolahan data': 'Descriptive statistics & data processing',
  'Uji hipotesis & rancangan eksperimen': 'Hypothesis testing & experimental design',
  'Visualisasi, dashboard & presentasi': 'Visualization, dashboards & presentation',
}

export const glossOf = (method: string) => methodGloss[method] ?? method
