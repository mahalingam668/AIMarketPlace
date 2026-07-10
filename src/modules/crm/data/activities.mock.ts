export type CrmActivityType = 'create' | 'update' | 'delete' | 'publish' | 'access';

export interface CrmActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  type: CrmActivityType;
}

export const CRM_ACTIVITIES: CrmActivity[] = [
  { id: 'a1', actor: 'Alex Chen', action: 'updated pricing on', target: 'CodePilot Pro', timestamp: '2026-07-10T08:12:00Z', type: 'update' },
  { id: 'a2', actor: 'Priya Nair', action: 'published', target: 'DataLens v2.4.0', timestamp: '2026-07-09T16:40:00Z', type: 'publish' },
  { id: 'a3', actor: 'System', action: 'flagged a broken link on', target: 'VoiceCraft', timestamp: '2026-07-09T11:05:00Z', type: 'access' },
  { id: 'a4', actor: 'Marcus Webb', action: 'created draft page', target: 'ResearchBot Beta Notes', timestamp: '2026-07-08T14:22:00Z', type: 'create' },
  { id: 'a5', actor: 'Alex Chen', action: 'archived', target: 'VoiceCraft', timestamp: '2026-07-06T09:50:00Z', type: 'delete' },
  { id: 'a6', actor: 'Priya Nair', action: 'edited theme colors on', target: 'CRM Theme Settings', timestamp: '2026-07-05T17:15:00Z', type: 'update' },
];

export const CRM_CATEGORY_STATS = [
  { category: 'Language Models', count: 1 },
  { category: 'Image Generation', count: 1 },
  { category: 'Code Assistant', count: 2 },
  { category: 'Data Analytics', count: 1 },
  { category: 'Voice & Audio', count: 1 },
  { category: 'Document AI', count: 1 },
  { category: 'Search & Research', count: 1 },
];

export const CRM_USER_ACTIVITY = [
  { day: 'Mon', sessions: 320 },
  { day: 'Tue', sessions: 410 },
  { day: 'Wed', sessions: 380 },
  { day: 'Thu', sessions: 460 },
  { day: 'Fri', sessions: 512 },
  { day: 'Sat', sessions: 268 },
  { day: 'Sun', sessions: 241 },
];

export const CRM_TOTAL_USERS = 48;
