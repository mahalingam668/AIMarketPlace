import { aiTools } from '../data/mockData';
import type { AITool } from '../types';

const SIMULATED_LATENCY_MS = 250;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const api = {
  getTools: (): Promise<AITool[]> => delay(aiTools),

  getToolById: (id: string): Promise<AITool | undefined> =>
    delay(aiTools.find((tool) => tool.id === id)),

  getToolsByCategory: (category: string): Promise<AITool[]> =>
    delay(aiTools.filter((tool) => tool.category === category)),

  getFeaturedTools: (): Promise<AITool[]> => delay(aiTools.filter((tool) => tool.featured)),
};

export const queryKeys = {
  tools: ['tools'] as const,
  tool: (id: string) => ['tools', id] as const,
  toolsByCategory: (category: string) => ['tools', 'category', category] as const,
  featuredTools: ['tools', 'featured'] as const,
};
