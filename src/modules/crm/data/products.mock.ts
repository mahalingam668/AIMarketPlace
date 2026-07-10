export type CrmProductStatus = 'Active' | 'Draft' | 'Deprecated';

export interface CrmScreenshot {
  id: string;
  caption: string;
  /** Decorative gradient swatch — no external image URLs are used in this mock dataset. */
  swatch: string;
}

export interface CrmDocLink {
  title: string;
  description: string;
}

export interface CrmProduct {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  category: string;
  version: string;
  status: CrmProductStatus;
  createdDate: string;
  lastUpdated: string;
  description: string;
  tags: string[];
  features: string[];
  screenshots: CrmScreenshot[];
  integrations: string[];
  documentation: CrmDocLink[];
}

export const CRM_PRODUCTS: CrmProduct[] = [
  {
    id: 'crm-nexusgpt',
    name: 'NexusGPT',
    icon: 'Brain',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    category: 'Language Models',
    version: '4.2.0',
    status: 'Active',
    createdDate: '2025-01-14',
    lastUpdated: '2026-06-02',
    description: 'Enterprise-grade large language model with advanced reasoning, coding, and analysis capabilities.',
    tags: ['NLP', 'Chat', 'RAG', 'Enterprise'],
    features: ['128K context window', 'Fine-tuning support', 'SOC2 compliant', 'On-prem deployment'],
    screenshots: [
      { id: 's1', caption: 'Chat workspace', swatch: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
      { id: 's2', caption: 'Fine-tuning console', swatch: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
    ],
    integrations: ['Slack', 'VS Code', 'Notion', 'Zapier'],
    documentation: [
      { title: 'Getting Started', description: 'Provision an API key and send your first completion request.' },
      { title: 'Fine-tuning Guide', description: 'Train a custom variant on your proprietary corpus.' },
    ],
  },
  {
    id: 'crm-pixelforge',
    name: 'PixelForge AI',
    icon: 'Image',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    category: 'Image Generation',
    version: '3.0.1',
    status: 'Active',
    createdDate: '2025-02-08',
    lastUpdated: '2026-05-20',
    description: 'Photorealistic image generation and editing with industry-leading quality and control.',
    tags: ['Image', 'Creative', 'Design'],
    features: ['8K output', 'Custom models', 'Commercial license', 'Priority GPU'],
    screenshots: [
      { id: 's1', caption: 'Prompt studio', swatch: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    ],
    integrations: ['Figma', 'Adobe Creative Cloud', 'Shopify'],
    documentation: [
      { title: 'API Reference', description: 'Generate, edit, and upscale images via REST.' },
    ],
  },
  {
    id: 'crm-codepilot',
    name: 'CodePilot Pro',
    icon: 'Code',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    category: 'Code Assistant',
    version: '5.1.3',
    status: 'Active',
    createdDate: '2024-11-30',
    lastUpdated: '2026-06-10',
    description: 'AI-powered code completion, refactoring, and debugging for 50+ programming languages.',
    tags: ['Code', 'IDE', 'Testing'],
    features: ['Codebase context', 'Test generation', 'SSO', 'Audit logs'],
    screenshots: [
      { id: 's1', caption: 'Inline suggestions', swatch: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
      { id: 's2', caption: 'Admin dashboard', swatch: 'linear-gradient(135deg, #22d3ee, #0e7490)' },
    ],
    integrations: ['VS Code', 'JetBrains', 'GitHub', 'GitLab'],
    documentation: [
      { title: 'Team Rollout', description: 'Provision seats and enforce org-wide policies.' },
    ],
  },
  {
    id: 'crm-datalens',
    name: 'DataLens',
    icon: 'BarChart3',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    category: 'Data Analytics',
    version: '2.4.0',
    status: 'Draft',
    createdDate: '2026-03-01',
    lastUpdated: '2026-06-18',
    description: 'Natural language data analytics — ask questions about your data and get instant visualizations.',
    tags: ['Analytics', 'BI', 'SQL'],
    features: ['Custom dashboards', 'Scheduled reports', 'Row-level security'],
    screenshots: [
      { id: 's1', caption: 'Query builder', swatch: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    ],
    integrations: ['Snowflake', 'BigQuery', 'Power BI'],
    documentation: [
      { title: 'Connecting a Warehouse', description: 'Link Snowflake, BigQuery, or Postgres in minutes.' },
    ],
  },
  {
    id: 'crm-guardianai',
    name: 'GuardianAI',
    icon: 'Shield',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    category: 'Code Assistant',
    version: '1.9.2',
    status: 'Active',
    createdDate: '2025-05-22',
    lastUpdated: '2026-04-11',
    description: 'AI-powered code security scanner — detect vulnerabilities, secrets, and compliance issues in CI/CD.',
    tags: ['Security', 'DevSecOps', 'Compliance'],
    features: ['Secret detection', 'SBOM generation', 'SOC2/HIPAA policies'],
    screenshots: [
      { id: 's1', caption: 'Findings triage', swatch: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    ],
    integrations: ['GitHub Actions', 'GitLab CI', 'Jenkins'],
    documentation: [
      { title: 'Policy as Code', description: 'Define blocking rules for CI/CD pipelines.' },
    ],
  },
  {
    id: 'crm-voicecraft',
    name: 'VoiceCraft',
    icon: 'Mic',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    category: 'Voice & Audio',
    version: '1.2.0',
    status: 'Deprecated',
    createdDate: '2024-08-04',
    lastUpdated: '2025-09-30',
    description: 'Ultra-realistic text-to-speech and voice cloning with emotion control and multilingual support.',
    tags: ['TTS', 'Voice', 'Multilingual'],
    features: ['Voice cloning', 'Real-time streaming', 'SSML support'],
    screenshots: [],
    integrations: ['Twilio', 'Genesys'],
    documentation: [
      { title: 'Migration Notice', description: 'VoiceCraft is deprecated — see VoiceCraft 2 for the supported successor.' },
    ],
  },
  {
    id: 'crm-documind',
    name: 'DocuMind',
    icon: 'FileText',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    category: 'Document AI',
    version: '3.3.0',
    status: 'Active',
    createdDate: '2025-07-19',
    lastUpdated: '2026-05-29',
    description: 'Intelligent document processing — extract, classify, and understand any document type.',
    tags: ['OCR', 'Extraction', 'Healthcare'],
    features: ['Table extraction', 'Handwriting recognition', 'HIPAA compliant'],
    screenshots: [
      { id: 's1', caption: 'Extraction review', swatch: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    ],
    integrations: ['SAP', 'Salesforce', 'SharePoint'],
    documentation: [
      { title: 'Custom Extractors', description: 'Train field-level extraction for a new document type.' },
    ],
  },
  {
    id: 'crm-researchbot',
    name: 'ResearchBot',
    icon: 'Search',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    category: 'Search & Research',
    version: '1.0.0',
    status: 'Draft',
    createdDate: '2026-06-25',
    lastUpdated: '2026-07-05',
    description: 'AI-powered research assistant that searches, summarizes, and synthesizes academic and web content.',
    tags: ['Research', 'Academic', 'Citations'],
    features: ['Citation export', 'Knowledge base', 'Patent search'],
    screenshots: [],
    integrations: ['Zotero', 'Google Scholar'],
    documentation: [
      { title: 'Beta Notes', description: 'ResearchBot is in draft — API surface may change before GA.' },
    ],
  },
];
