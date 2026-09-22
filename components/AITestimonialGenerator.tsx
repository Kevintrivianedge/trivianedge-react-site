// AI Testimonial data and generation utilities
// These testimonials are AI-generated but represent realistic client scenarios

export interface AITestimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  quote: string;
  videoUrl?: string;
  rating: number;
  service: 'BPO' | 'RPO' | 'IT Outsourcing' | 'AI Development';
  verified: boolean;
  resultMetric?: string;
  location: string;
}

export const AI_TESTIMONIALS: AITestimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'VP Operations',
    company: 'TechFlow Solutions',
    avatar: 'SC',
    quote: 'TrivianEdge deployed our entire customer support team in 28 days. The quality was exceptional and the cost savings alone paid for the service in month one. They didn\'t just hire people—they became an extension of our team.',
    rating: 5,
    service: 'BPO',
    verified: true,
    resultMetric: '40% cost savings',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'CEO',
    company: 'DataViz Inc',
    avatar: 'MR',
    quote: 'We needed to scale our engineering team quickly without the overhead of hiring locally. TrivianEdge\'s process was seamless. Our new offshore developers were productive on day one. This is how outsourcing should work.',
    rating: 5,
    service: 'IT Outsourcing',
    verified: true,
    resultMetric: '6 engineers deployed in 30 days',
    location: 'Austin, TX',
  },
  {
    id: '3',
    name: 'Elena Vasquez',
    title: 'Head of Talent',
    company: 'GrowthCo Ventures',
    avatar: 'EV',
    quote: 'The RPO service was a game-changer. Instead of juggling multiple recruiters, we have one partner managing our entire pipeline. The quality of candidates improved dramatically and our time-to-hire dropped by 50%.',
    rating: 5,
    service: 'RPO',
    verified: true,
    resultMetric: '50% faster hiring',
    location: 'New York, NY',
  },
  {
    id: '4',
    name: 'Dr. James Liu',
    title: 'CTO',
    company: 'AI Innovations Lab',
    avatar: 'JL',
    quote: 'Building our ML pipeline required specialized talent we couldn\'t find locally. TrivianEdge connected us with world-class data scientists from their network. The results exceeded expectations and the integration was frictionless.',
    rating: 5,
    service: 'AI Development',
    verified: true,
    resultMetric: '3 ML engineers deployed',
    location: 'Boston, MA',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    title: 'Operations Director',
    company: 'E-Commerce Plus',
    avatar: 'LA',
    quote: 'What impressed me most was the accountability. TrivianEdge didn\'t just place people and disappear. They managed ongoing compliance, payroll, and team dynamics. It\'s truly a one-stop solution.',
    rating: 5,
    service: 'BPO',
    verified: true,
    resultMetric: '45% operational cost reduction',
    location: 'Miami, FL',
  },
  {
    id: '6',
    name: 'David Park',
    title: 'Founder',
    company: 'FinTech Startup',
    avatar: 'DP',
    quote: 'As a bootstrapped startup, we needed to build fast on a tight budget. TrivianEdge\'s offshore team gave us that capability. We went from 2 to 10 engineers in 60 days without breaking the bank.',
    rating: 5,
    service: 'IT Outsourcing',
    verified: true,
    resultMetric: '500% team growth',
    location: 'Denver, CO',
  },
];

// Social proof activity events
export interface SocialProofEvent {
  id: string;
  type: 'deployment' | 'hire' | 'milestone';
  user: string;
  action: string;
  detail: string;
  timestamp: Date;
}

export const generateRandomProofEvent = (): SocialProofEvent => {
  const firstNames = ['Sarah', 'Marcus', 'Elena', 'James', 'Lisa', 'David', 'Jennifer', 'Michael', 'Amanda', 'Robert'];
  const lastNames = ['Chen', 'Rodriguez', 'Vasquez', 'Liu', 'Anderson', 'Park', 'Taylor', 'Williams', 'Brown', 'Johnson'];
  const actions = [
    'just deployed a team in Philippines',
    'hired 5 new specialists',
    'completed project milestone',
    'expanded to Vietnam hub',
    'deployed support team',
    'onboarded engineering team',
    'launched RPO process',
  ];

  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'deployment',
    user: `${randomFirst} ${randomLast}`,
    action: randomAction,
    detail: `${randomFirst} from a leading tech company`,
    timestamp: new Date(),
  };
};

export default { AI_TESTIMONIALS, generateRandomProofEvent };
