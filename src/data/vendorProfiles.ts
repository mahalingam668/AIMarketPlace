import { Brain, Image, Server, Code, Shield, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PortfolioHighlight {
  label: string;
  category: string;
  icon: LucideIcon;
}

export interface VendorProfile {
  id: string;
  name: string;
  role: 'Vendor' | 'Developer';
  title: string;
  avatarInitials: string;
  avatarColor: string;
  bannerIcon: LucideIcon;
  level: string;
  tier: number;
  startingPrice: string;
  languages: string[];
  bio: string;
  longBio: string;
  skills: string[];
  portfolioHighlights: PortfolioHighlight[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  location: string;
  verified: boolean;
  responseTime: string;
}

export const VENDOR_PROFILES: VendorProfile[] = [
  {
    id: 'v-nexusai-partners',
    name: 'NexusAI Partners',
    role: 'Vendor',
    title: 'I will deploy and govern enterprise LLMs across your regulated business',
    avatarInitials: 'NP',
    avatarColor: '#8b5cf6',
    bannerIcon: Brain,
    level: 'Enterprise Partner',
    tier: 3,
    startingPrice: 'From $2,500/mo',
    languages: ['English'],
    bio: 'Specialist reseller and deployment partner for large-language-model rollouts across regulated industries — banking, healthcare, and public sector.',
    longBio:
      'NexusAI Partners has spent seven years helping regulated enterprises adopt large language models without compromising on compliance. Our team of solution architects handles everything from vendor selection and SLA negotiation to change management and staff enablement, so your rollout succeeds on the first attempt.',
    skills: ['LLM Deployment', 'Compliance', 'Change Management', 'SLA Design'],
    portfolioHighlights: [
      { label: 'Regional Bank LLM Rollout', category: 'Financial Services', icon: Brain },
      { label: 'Clinical Documentation Assistant', category: 'Healthcare', icon: Shield },
      { label: 'Citizen Services Chatbot', category: 'Public Sector', icon: Code },
    ],
    rating: 4.9,
    reviewCount: 214,
    completedProjects: 86,
    location: 'New York, USA',
    verified: true,
    responseTime: 'Usually responds in 2 hours',
  },
  {
    id: 'd-elena-rostova',
    name: 'Elena Rostova',
    role: 'Developer',
    title: 'I will build custom diffusion models and image-generation pipelines',
    avatarInitials: 'ER',
    avatarColor: '#ec4899',
    bannerIcon: Image,
    level: 'Top Rated Seller',
    tier: 3,
    startingPrice: 'From $450',
    languages: ['English', 'German'],
    bio: 'Independent contractor building custom image-generation pipelines and fine-tuned diffusion models for retail and industrial design teams.',
    longBio:
      'I specialize in fine-tuning diffusion models on brand-specific datasets so the output looks like your product photography, not generic stock renders. Recent work spans retail catalog generation, industrial CAD-to-render pipelines, and ControlNet-guided product visualization for e-commerce teams shipping thousands of SKUs.',
    skills: ['Diffusion Models', 'PyTorch', 'ControlNet', 'MLOps'],
    portfolioHighlights: [
      { label: 'Retail Catalog Generator', category: 'Retail & Commerce', icon: Image },
      { label: 'CAD-to-Render Pipeline', category: 'Industrial Design', icon: Server },
      { label: 'Brand-Tuned Diffusion Model', category: 'Marketing', icon: BarChart3 },
    ],
    rating: 4.8,
    reviewCount: 132,
    completedProjects: 47,
    location: 'Berlin, Germany',
    verified: true,
    responseTime: 'Usually responds in 4 hours',
  },
  {
    id: 'v-cloudops-collective',
    name: 'CloudOps Collective',
    role: 'Vendor',
    title: 'I will provision and govern multi-cloud AI infrastructure end-to-end',
    avatarInitials: 'CC',
    avatarColor: '#0ea5e9',
    bannerIcon: Server,
    level: 'Verified Partner',
    tier: 2,
    startingPrice: 'From $1,800/mo',
    languages: ['English'],
    bio: 'Turnkey infrastructure vendor for AI workload provisioning, autoscaling, and cost governance across Azure, AWS, and GCP.',
    longBio:
      'CloudOps Collective designs and operates the infrastructure layer beneath your AI workloads — Kubernetes clusters tuned for GPU scheduling, Terraform modules for repeatable multi-cloud provisioning, and FinOps dashboards that catch runaway spend before the invoice does.',
    skills: ['Kubernetes', 'Terraform', 'FinOps', 'Cloud Migration'],
    portfolioHighlights: [
      { label: 'Multi-Cloud GPU Scheduler', category: 'Infrastructure', icon: Server },
      { label: 'Autoscaling Cost Governor', category: 'FinOps', icon: BarChart3 },
      { label: 'Zero-Downtime Cloud Migration', category: 'Cloud Migration', icon: Shield },
    ],
    rating: 4.7,
    reviewCount: 98,
    completedProjects: 63,
    location: 'Austin, USA',
    verified: true,
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: 'd-arjun-mehta',
    name: 'Arjun Mehta',
    role: 'Developer',
    title: 'I will integrate AI marketplace tools into your CRM, ERP, or help desk',
    avatarInitials: 'AM',
    avatarColor: '#10b981',
    bannerIcon: Code,
    level: 'Level 2 Seller',
    tier: 2,
    startingPrice: 'From $220',
    languages: ['English', 'Hindi'],
    bio: 'Freelance developer specializing in wiring AI marketplace tools into existing CRM, ERP, and support-desk stacks via custom middleware.',
    longBio:
      'Most AI tools are only as useful as the systems they connect to. I build the middleware layer — webhooks, custom connectors, and sync jobs — that gets your new AI tool talking to Salesforce, Zendesk, SAP, or whatever else your team already lives in, usually within a one- or two-week engagement.',
    skills: ['Node.js', 'REST APIs', 'Zapier', 'Webhooks'],
    portfolioHighlights: [
      { label: 'CRM Lead Sync Middleware', category: 'CRM Integration', icon: Code },
      { label: 'Support Desk Webhook Bridge', category: 'Customer Service', icon: Server },
      { label: 'ERP Order Sync Connector', category: 'Operations', icon: BarChart3 },
    ],
    rating: 4.9,
    reviewCount: 176,
    completedProjects: 91,
    location: 'Bengaluru, India',
    verified: true,
    responseTime: 'Usually responds in 3 hours',
  },
  {
    id: 'v-guardian-security-group',
    name: 'Guardian Security Group',
    role: 'Vendor',
    title: 'I will audit your AI stack for SOC 2 and HIPAA readiness',
    avatarInitials: 'GS',
    avatarColor: '#dc2626',
    bannerIcon: Shield,
    level: 'Certified Partner',
    tier: 3,
    startingPrice: 'From $3,200',
    languages: ['English'],
    bio: 'Third-party security auditor and vendor offering SOC 2 / HIPAA readiness assessments for teams deploying AI tools at scale.',
    longBio:
      'Guardian Security Group runs independent security assessments for teams putting AI into production. Our audits cover data handling, model access controls, and vendor risk — producing the documentation your customers and regulators will actually ask for, not just a checklist.',
    skills: ['SOC 2', 'Penetration Testing', 'HIPAA', 'Risk Audits'],
    portfolioHighlights: [
      { label: 'SOC 2 Type II Readiness Audit', category: 'Compliance', icon: Shield },
      { label: 'AI Vendor Risk Assessment', category: 'Risk Management', icon: BarChart3 },
      { label: 'HIPAA Data Handling Review', category: 'Healthcare', icon: Code },
    ],
    rating: 4.8,
    reviewCount: 61,
    completedProjects: 34,
    location: 'London, UK',
    verified: false,
    responseTime: 'Usually responds in 6 hours',
  },
  {
    id: 'd-sofia-almeida',
    name: 'Sofia Almeida',
    role: 'Developer',
    title: 'I will build custom BI dashboards and ETL pipelines for your data',
    avatarInitials: 'SA',
    avatarColor: '#f59e0b',
    bannerIcon: BarChart3,
    level: 'Rising Talent',
    tier: 1,
    startingPrice: 'From $180',
    languages: ['English', 'Portuguese'],
    bio: 'Independent BI consultant building custom dashboards and data pipelines on top of marketplace analytics tools for finance teams.',
    longBio:
      "I help finance and ops teams turn raw exports from marketplace analytics tools into dashboards people actually check every morning. That usually means a Python ETL job feeding a Power BI or Looker model, tuned so refreshes stay fast even as the dataset grows.",
    skills: ['SQL', 'Power BI', 'Python', 'ETL Design'],
    portfolioHighlights: [
      { label: 'Finance KPI Dashboard', category: 'Analytics', icon: BarChart3 },
      { label: 'Automated ETL Pipeline', category: 'Data Engineering', icon: Server },
      { label: 'Usage Analytics Model', category: 'Data Analytics', icon: Code },
    ],
    rating: 4.6,
    reviewCount: 54,
    completedProjects: 29,
    location: 'Lisbon, Portugal',
    verified: false,
    responseTime: 'Usually responds in 5 hours',
  },
];

export const VENDOR_DIRECTORY_STATS = {
  totalProfiles: VENDOR_PROFILES.length,
  avgRating: (VENDOR_PROFILES.reduce((sum, p) => sum + p.rating, 0) / VENDOR_PROFILES.length).toFixed(1),
  totalProjects: VENDOR_PROFILES.reduce((sum, p) => sum + p.completedProjects, 0),
};

export function getVendorProfileById(id: string): VendorProfile | undefined {
  return VENDOR_PROFILES.find((p) => p.id === id);
}

export function getRelatedVendorProfiles(profile: VendorProfile, limit = 3): VendorProfile[] {
  return VENDOR_PROFILES.filter((p) => p.role === profile.role && p.id !== profile.id).slice(0, limit);
}
