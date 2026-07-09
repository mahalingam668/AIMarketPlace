import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Trophy, MapPin, TrendingUp, X, Quote, Building2 } from 'lucide-react';
import './Customers.css';

interface CustomerStory {
  id: string;
  company: string;
  region: 'North America' | 'Europe' | 'Middle East' | 'Asia Pacific';
  industry: string;
  useCase: string;
  benefit: string;
  roi: string;
  techStack: string[];
  quote: string;
  author: string;
  narrative: string;
}

const STORIES: CustomerStory[] = [
  {
    id: 'meridian',
    company: 'Meridian Financial Group',
    region: 'North America',
    industry: 'Financial Services',
    useCase: 'Automated document review and fraud detection',
    benefit: '62% faster case resolution',
    roi: '3.8x ROI in year one',
    techStack: ['NexusGPT', 'DocuMind', 'GuardianAI'],
    quote: 'We replaced three manual review steps with a single governed pipeline — audit-ready from day one.',
    author: 'Director of Risk Operations',
    narrative: 'Meridian Financial Group needed to modernize a manual document review process spanning multiple compliance teams. By combining NexusGPT for extraction, DocuMind for structured parsing, and GuardianAI for continuous security scanning, they cut average case resolution time by 62% while maintaining a full audit trail for regulators.',
  },
  {
    id: 'alderbrook',
    company: 'Alderbrook Health Systems',
    region: 'North America',
    industry: 'Healthcare & Life Sciences',
    useCase: 'Clinical documentation summarization',
    benefit: '4.5 hours saved per clinician / week',
    roi: '2.6x ROI in year one',
    techStack: ['NexusGPT Mini', 'DocuMind'],
    quote: 'Governance was the deciding factor — we could prove exactly which model touched which record.',
    author: 'VP of Clinical Informatics',
    narrative: 'Alderbrook Health Systems piloted NexusGPT Mini for clinical note summarization across two hospital campuses. Paired with DocuMind for intake form digitization, clinicians reclaimed an average of 4.5 hours per week previously spent on documentation.',
  },
  {
    id: 'falkirk',
    company: 'Falkirk Manufacturing Co.',
    region: 'Europe',
    industry: 'Manufacturing',
    useCase: 'Predictive maintenance analytics',
    benefit: '31% reduction in unplanned downtime',
    roi: '4.1x ROI in year one',
    techStack: ['DataLens', 'ChartWise'],
    quote: 'DataLens surfaced anomalies our legacy dashboards never caught until it was too late.',
    author: 'Head of Plant Operations',
    narrative: 'Falkirk Manufacturing connected sensor telemetry across four plants into DataLens, using natural-language queries to surface early failure signals. Combined with ChartWise for executive reporting, unplanned downtime dropped 31% within two quarters.',
  },
  {
    id: 'zenith',
    company: 'Zenith Retail Holdings',
    region: 'Middle East',
    industry: 'Retail & Commerce',
    useCase: 'Multilingual customer support voice agents',
    benefit: '48% reduction in support ticket backlog',
    roi: '3.2x ROI in year one',
    techStack: ['VoiceCraft', 'CodePilot Pro'],
    quote: "Launching in five languages simultaneously would have taken us a year without VoiceCraft's cloning pipeline.",
    author: 'Chief Customer Officer',
    narrative: 'Zenith Retail Holdings deployed VoiceCraft-powered IVR across five languages to handle after-hours customer inquiries, cutting their support backlog by 48% while keeping response quality consistent across regions.',
  },
  {
    id: 'harrowgate',
    company: 'Harrowgate Research Institute',
    region: 'Europe',
    industry: 'Higher Education',
    useCase: 'Literature review acceleration',
    benefit: '5x faster literature synthesis',
    roi: 'Grant-funded pilot, renewed for year two',
    techStack: ['ResearchBot', 'NexusGPT'],
    quote: 'Our PhD candidates now spend their time on analysis, not manual citation chasing.',
    author: 'Director of Research Computing',
    narrative: 'Harrowgate Research Institute rolled out ResearchBot across three departments to accelerate systematic literature reviews, synthesizing what previously took weeks into days while maintaining full citation traceability.',
  },
  {
    id: 'pacificore',
    company: 'PacifiCore Logistics',
    region: 'Asia Pacific',
    industry: 'Technology',
    useCase: 'Automated code review at scale',
    benefit: '40% fewer production incidents',
    roi: '3.5x ROI in year one',
    techStack: ['CodePilot Pro', 'GuardianAI'],
    quote: "GuardianAI catches what human review misses at 2 a.m. before a Friday release.",
    author: 'VP of Engineering',
    narrative: 'PacifiCore Logistics integrated CodePilot Pro and GuardianAI into their CI/CD pipeline across 40+ microservices, reducing production incidents tied to code defects by 40% within the first two quarters.',
  },
];

const REGIONS: Array<CustomerStory['region'] | 'All'> = ['All', 'North America', 'Europe', 'Middle East', 'Asia Pacific'];

function Customers() {
  const [region, setRegion] = useState<CustomerStory['region'] | 'All'>('All');
  const [selected, setSelected] = useState<CustomerStory | null>(null);

  const filtered = useMemo(
    () => STORIES.filter((s) => region === 'All' || s.region === region),
    [region]
  );

  return (
    <div className="customers">
      <div className="customers__header">
        <span className="customers__eyebrow"><Trophy size={13} /> Customers</span>
        <h1>Enterprise Success Stories</h1>
        <p>
          Illustrative customer stories for demonstration purposes — company names and metrics below are
          representative examples, not verified case studies.
        </p>
      </div>

      <div className="customers__filters">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            className={region === r ? 'customers__filter-chip customers__filter-chip--active' : 'customers__filter-chip'}
            onClick={() => setRegion(r)}
          >
            <MapPin size={12} /> {r}
          </button>
        ))}
      </div>

      <div className="customers__grid">
        {filtered.map((story) => (
          <motion.div key={story.id} className="customers__card" whileHover={{ y: -3 }} onClick={() => setSelected(story)}>
            <div className="customers__card-logo">
              <Building2 size={20} />
            </div>
            <h4>{story.company}</h4>
            <span className="customers__card-industry">{story.industry} &middot; {story.region}</span>
            <p className="customers__card-usecase">{story.useCase}</p>
            <div className="customers__card-benefit">
              <TrendingUp size={13} /> {story.benefit}
            </div>
            <div className="customers__card-stack">
              {story.techStack.map((t) => <span key={t}>{t}</span>)}
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="customers__modal-overlay" />
          <Dialog.Content className="customers__modal">
            {selected && (
              <>
                <div className="customers__modal-header">
                  <div>
                    <h3>{selected.company}</h3>
                    <span>{selected.industry} &middot; {selected.region}</span>
                  </div>
                  <Dialog.Close className="customers__modal-close"><X size={16} /></Dialog.Close>
                </div>
                <div className="customers__modal-stats">
                  <div><span>{selected.benefit}</span><small>Primary Outcome</small></div>
                  <div><span>{selected.roi}</span><small>Return on Investment</small></div>
                </div>
                <p className="customers__modal-narrative">{selected.narrative}</p>
                <div className="customers__modal-quote">
                  <Quote size={16} />
                  <p>{selected.quote}</p>
                  <span>— {selected.author}, {selected.company}</span>
                </div>
                <div className="customers__modal-stack">
                  <span className="customers__modal-stack-label">Tech Stack</span>
                  <div className="customers__card-stack">
                    {selected.techStack.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Customers;
