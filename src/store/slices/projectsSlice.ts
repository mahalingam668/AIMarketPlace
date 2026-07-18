import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ProjectBrief {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: 'open' | 'closed';
  createdAt: string;
  proposalCount: number;
}

interface ProjectsState {
  projects: ProjectBrief[];
}

const initialState: ProjectsState = {
  projects: [
    {
      id: 'proj-rag-chatbot',
      title: 'Build a custom RAG chatbot for our support team',
      description:
        'We need a retrieval-augmented generation chatbot trained on our internal knowledge base (help center articles + product docs) to deflect first-line support tickets. Must integrate with our existing helpdesk via API and support a human hand-off flow for unresolved queries.',
      budgetMin: 2000,
      budgetMax: 5000,
      deadline: '2026-08-15',
      status: 'open',
      createdAt: '2026-07-01',
      proposalCount: 6,
    },
    {
      id: 'proj-forecast-model',
      title: 'Fine-tune a demand-forecasting model for retail inventory',
      description:
        'Looking for an ML engineer to fine-tune a time-series forecasting model on three years of POS data to reduce stockouts across 40 stores. Deliverable includes a deployable inference API and a short evaluation report comparing against our current baseline.',
      budgetMin: 3500,
      budgetMax: 8000,
      deadline: '2026-09-05',
      status: 'open',
      createdAt: '2026-06-24',
      proposalCount: 4,
    },
    {
      id: 'proj-voice-agent',
      title: 'Design a voice AI agent for inbound appointment scheduling',
      description:
        'We want a phone-based voice agent that can handle inbound calls, check calendar availability, and book or reschedule appointments, with a graceful fallback to a human agent for edge cases.',
      budgetMin: 4000,
      budgetMax: 9000,
      deadline: '2026-08-30',
      status: 'closed',
      createdAt: '2026-06-10',
      proposalCount: 8,
    },
  ],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<ProjectBrief>) {
      state.projects.unshift(action.payload);
    },
    closeProject(state, action: PayloadAction<{ id: string }>) {
      const project = state.projects.find((p) => p.id === action.payload.id);
      if (project) project.status = 'closed';
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addProject, closeProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
