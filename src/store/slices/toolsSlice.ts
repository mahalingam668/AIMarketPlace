import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AITool, FilterState } from '../../types';
import { aiTools } from '../../data/mockData';

interface ToolsState {
  tools: AITool[];
  filteredTools: AITool[];
  filters: FilterState;
  selectedToolId: string | null;
  favorites: string[];
}

const initialFilters: FilterState = {
  categories: [],
  pricing: [],
  rating: null,
  badge: [],
  search: '',
  sort: 'popular',
};

function applyFilters(tools: AITool[], filters: FilterState): AITool[] {
  let result = [...tools];

  // Search filter
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        tool.company.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.categories.length > 0) {
    result = result.filter((tool) => filters.categories.includes(tool.category));
  }

  // Pricing filter
  if (filters.pricing.length > 0) {
    result = result.filter((tool) =>
      tool.pricing.some((plan) => {
        if (filters.pricing.includes('free') && plan.period === 'free') return true;
        if (filters.pricing.includes('paid') && plan.period !== 'free' && plan.price > 0) return true;
        if (filters.pricing.includes('enterprise') && plan.name.toLowerCase() === 'enterprise') return true;
        return false;
      })
    );
  }

  // Rating filter
  if (filters.rating !== null) {
    result = result.filter((tool) => tool.rating >= filters.rating!);
  }

  // Badge filter
  if (filters.badge.length > 0) {
    result = result.filter((tool) => tool.badge && filters.badge.includes(tool.badge));
  }

  // Sort
  switch (filters.sort) {
    case 'popular':
      result.sort((a, b) => b.activeUsers - a.activeUsers);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => {
        const badgeOrder = { New: 0, Beta: 1, Featured: 2, Popular: 3, Enterprise: 4 };
        const aOrder = a.badge ? (badgeOrder[a.badge] ?? 5) : 5;
        const bOrder = b.badge ? (badgeOrder[b.badge] ?? 5) : 5;
        return aOrder - bOrder;
      });
      break;
    case 'price-low':
      result.sort((a, b) => {
        const aMin = Math.min(...a.pricing.filter((p) => p.price > 0).map((p) => p.price), Infinity);
        const bMin = Math.min(...b.pricing.filter((p) => p.price > 0).map((p) => p.price), Infinity);
        return aMin - bMin;
      });
      break;
    case 'price-high':
      result.sort((a, b) => {
        const aMax = Math.max(...a.pricing.map((p) => p.price));
        const bMax = Math.max(...b.pricing.map((p) => p.price));
        return bMax - aMax;
      });
      break;
  }

  return result;
}

const initialState: ToolsState = {
  tools: aiTools,
  filteredTools: applyFilters(aiTools, initialFilters),
  filters: initialFilters,
  selectedToolId: null,
  favorites: [],
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    toggleCategory(state, action: PayloadAction<string>) {
      const category = action.payload;
      const index = state.filters.categories.indexOf(category);
      if (index === -1) {
        state.filters.categories.push(category);
      } else {
        state.filters.categories.splice(index, 1);
      }
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    setSort(state, action: PayloadAction<FilterState['sort']>) {
      state.filters.sort = action.payload;
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    setRatingFilter(state, action: PayloadAction<number | null>) {
      state.filters.rating = action.payload;
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    toggleBadgeFilter(state, action: PayloadAction<string>) {
      const badge = action.payload;
      const index = state.filters.badge.indexOf(badge);
      if (index === -1) {
        state.filters.badge.push(badge);
      } else {
        state.filters.badge.splice(index, 1);
      }
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    setPricingFilter(state, action: PayloadAction<string[]>) {
      state.filters.pricing = action.payload;
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    resetFilters(state) {
      state.filters = { ...initialFilters };
      state.filteredTools = applyFilters(state.tools, state.filters);
    },
    setSelectedTool(state, action: PayloadAction<string | null>) {
      state.selectedToolId = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const toolId = action.payload;
      const index = state.favorites.indexOf(toolId);
      if (index === -1) {
        state.favorites.push(toolId);
      } else {
        state.favorites.splice(index, 1);
      }
    },
  },
});

export const {
  setSearch,
  toggleCategory,
  setSort,
  setRatingFilter,
  toggleBadgeFilter,
  setPricingFilter,
  resetFilters,
  setSelectedTool,
  toggleFavorite,
} = toolsSlice.actions;

export default toolsSlice.reducer;
