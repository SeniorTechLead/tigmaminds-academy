export type HackathonQuestion = {
  id: string;
  title: string;
  statement: string;
  description: string;
};

export const HACKATHON_QUESTIONS: HackathonQuestion[] = [
  {
    id: 'HW01',
    title: '🏥 Health & Wellbeing',
    statement:
      'Innovative solutions that improve healthcare accessibility, prevention, diagnosis, treatment, and overall physical and mental wellbeing.',
    description:
      'Ideas can focus on remote healthcare, health monitoring, patient engagement, wellness, accessibility, and improving healthcare delivery.',
  },
  {
    id: 'AF02',
    title: '🌾 Agriculture & Food Security',
    statement:
      'Technology-driven solutions to improve agricultural productivity, reduce food wastage, support farmers, and strengthen the food supply chain.',
    description:
      'Ideas can include smart farming, crop monitoring, weather insights, precision agriculture, market access, storage, and supply-chain optimization.',
  },
  {
    id: 'EF03',
    title: '🎓 Education & Future Learning',
    statement:
      'Solutions that make education more accessible, personalized, engaging, and effective.',
    description:
      'This can include AI-powered learning, skill development, personalized education, teacher assistance, accessibility, assessment, and preparing learners for future careers.',
  },
  {
    id: 'WS04',
    title: '💧 Water & Water Security',
    statement:
      'Innovations focused on conserving, managing, monitoring, and improving access to clean and safe water.',
    description:
      'Ideas can address water leakage, quality monitoring, smart irrigation, rainwater management, wastewater treatment, groundwater management, and efficient water usage.',
  },
  {
    id: 'CD05',
    title: '🔐 Cybersecurity, Digital Privacy & Threat Defence',
    statement:
      'Solutions that protect individuals, organizations, applications, and data from evolving cyber threats.',
    description:
      'Teams can explore areas such as threat detection, identity and access management, data privacy, fraud prevention, secure APIs, vulnerability management, zero-trust security, and incident response.',
  },
  {
    id: 'AI06',
    title: '🤖 AI & Emerging Technologies',
    statement:
      'Innovative applications of AI and emerging technologies to solve real-world problems or transform existing processes.',
    description:
      'This track can include Generative AI, AI agents, machine learning, computer vision, robotics, IoT, edge computing, digital twins, automation, and other emerging technologies.',
  },
  {
    id: 'CS07',
    title: '🌱 Climate Change & Sustainability',
    statement:
      'Technology solutions that help reduce environmental impact, conserve natural resources, and build resilience against climate change.',
    description:
      'Ideas can focus on carbon reduction, renewable energy, waste management, recycling, sustainable consumption, pollution monitoring, biodiversity, and climate-risk management.',
  },
  {
    id: 'LA08',
    title: '⚡ Low-Code, Event-Driven & Intelligent Automation',
    statement:
      'Solutions that accelerate how applications and workflows are built and integrated.',
    description:
      'Teams can explore drag-and-drop workflow engines, prompt-to-app builders, event-driven integrations (webhooks/queues), low-code connectors for legacy systems, and citizen-developer tools that democratize application development.',
  },
];

export function getHackathonQuestionById(id?: string | number | null) {
  if (id == null) return undefined;
  const normalized = String(id).trim().toUpperCase();
  if (!normalized) return undefined;
  return HACKATHON_QUESTIONS.find((question) => question.id.toUpperCase() === normalized);
}
