import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { toast } from 'react-hot-toast';
import {
  Search, Rocket, GraduationCap, Terminal, Code2, BookOpen, ChevronDown,
  Copy, PlayCircle, Clock, BarChart2,
} from 'lucide-react';
import './Documentation.css';

type Section = 'getting-started' | 'learning-paths' | 'api-reference' | 'sdk-guides' | 'tutorials';

const SECTIONS: { id: Section; label: string; icon: typeof Rocket }[] = [
  { id: 'getting-started', label: 'Getting Started', icon: Rocket },
  { id: 'learning-paths', label: 'Learning Paths', icon: GraduationCap },
  { id: 'api-reference', label: 'API Reference', icon: Terminal },
  { id: 'sdk-guides', label: 'SDK Guides', icon: Code2 },
  { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
];

const CODE_SAMPLE = `curl https://api.yakkay.ai/v1/models/nexusgpt/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Summarize this quarter's revenue report",
    "max_tokens": 300
  }'`;

const LEARNING_PATHS = [
  { title: 'Agent Orchestration Path', desc: 'Build multi-agent workflows from scratch in under 2 hours.', duration: '2h', level: 'Intermediate', lessons: 8 },
  { title: 'Foundations of Model Governance', desc: 'Learn access control, lineage, and compliance basics.', duration: '1.5h', level: 'Beginner', lessons: 6 },
  { title: 'Production-Grade RAG Pipelines', desc: 'Design retrieval-augmented generation systems that scale.', duration: '3h', level: 'Advanced', lessons: 10 },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/v1/models/{id}/completions', desc: 'Generate a completion from a specified model.' },
  { method: 'GET', path: '/v1/models', desc: 'List all models available to your workspace.' },
  { method: 'POST', path: '/v1/catalog/assets', desc: 'Register a new asset in the Data & Model Catalog.' },
  { method: 'GET', path: '/v1/governance/status/{modelId}', desc: 'Retrieve the current compliance status of a model.' },
];

const SDKS = [
  { lang: 'Python', install: 'pip install yakkay-ai' },
  { lang: 'Node.js', install: 'npm install @yakkay/ai-sdk' },
  { lang: 'Java', install: "implementation 'ai.yakkay:sdk:1.0.0'" },
];

const TUTORIALS = [
  { category: 'Getting Started', title: 'Your first API call in 5 minutes' },
  { category: 'Agents', title: 'Building a customer support agent' },
  { category: 'Governance', title: 'Setting up role-based access control' },
  { category: 'Integrations', title: 'Connecting YAKKAY to Salesforce' },
];

function highlightCode(code: string) {
  return code
    .split('\n')
    .map((line, i) => (
      <div key={i} className="doc-code__line">
        {line}
      </div>
    ));
}

function Documentation() {
  const [activeSection, setActiveSection] = useState<Section>('getting-started');
  const [search, setSearch] = useState('');

  const handleCopy = () => {
    navigator.clipboard?.writeText(CODE_SAMPLE);
    toast.success('Code sample copied to clipboard');
  };

  return (
    <div className="documentation">
      <aside className="documentation__sidebar">
        <div className="documentation__search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <nav className="documentation__nav">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? 'documentation__nav-item documentation__nav-item--active' : 'documentation__nav-item'}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={15} /> {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="documentation__main">
        <div className="documentation__breadcrumb">
          Documentation <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} /> {SECTIONS.find((s) => s.id === activeSection)?.label}
        </div>

        {activeSection === 'getting-started' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="documentation__panel">
            <h1>Getting Started</h1>
            <p>Make your first authenticated request to the YAKKAY AI Line API in under five minutes.</p>
            <div className="doc-code">
              <div className="doc-code__header">
                <span>cURL</span>
                <button type="button" onClick={handleCopy}><Copy size={13} /> Copy</button>
              </div>
              <div className="doc-code__body">{highlightCode(CODE_SAMPLE)}</div>
            </div>
            <div className="documentation__video-card">
              <button type="button" className="documentation__video-play" onClick={() => toast('Video playback would start here in a full build.')}>
                <PlayCircle size={40} />
              </button>
              <div>
                <h4>Platform walkthrough</h4>
                <span><Clock size={12} /> 4:32</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'learning-paths' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="documentation__panel">
            <h1>Learning Paths</h1>
            <div className="documentation__paths-grid">
              {LEARNING_PATHS.map((path) => (
                <div key={path.title} className="documentation__path-card">
                  <h4>{path.title}</h4>
                  <p>{path.desc}</p>
                  <div className="documentation__path-meta">
                    <span><Clock size={12} /> {path.duration}</span>
                    <span><BarChart2 size={12} /> {path.level}</span>
                    <span>{path.lessons} lessons</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'api-reference' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="documentation__panel">
            <h1>API Reference</h1>
            <Accordion.Root type="single" collapsible className="documentation__api-list">
              {API_ENDPOINTS.map((ep) => (
                <Accordion.Item key={ep.path} value={ep.path} className="documentation__api-item">
                  <Accordion.Header>
                    <Accordion.Trigger className="documentation__api-trigger">
                      <span className={`documentation__method documentation__method--${ep.method.toLowerCase()}`}>{ep.method}</span>
                      <code>{ep.path}</code>
                      <ChevronDown size={14} className="documentation__api-chevron" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="documentation__api-content">
                    {ep.desc}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </motion.div>
        )}

        {activeSection === 'sdk-guides' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="documentation__panel">
            <h1>SDK Guides</h1>
            <div className="documentation__sdk-grid">
              {SDKS.map((sdk) => (
                <div key={sdk.lang} className="documentation__sdk-card">
                  <h4>{sdk.lang}</h4>
                  <div className="doc-code doc-code--sm">
                    <div className="doc-code__body">
                      <div className="doc-code__line">{sdk.install}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'tutorials' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="documentation__panel">
            <h1>Tutorials</h1>
            <div className="documentation__tutorials-list">
              {TUTORIALS.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())).map((tut) => (
                <button
                  key={tut.title}
                  type="button"
                  className="documentation__tutorial-item"
                  onClick={() => toast(`Opening tutorial: ${tut.title}`)}
                >
                  <span className="documentation__tutorial-category">{tut.category}</span>
                  <span className="documentation__tutorial-title">{tut.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Documentation;
