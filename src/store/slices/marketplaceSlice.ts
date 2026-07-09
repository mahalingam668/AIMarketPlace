import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ViewMode = 'grid' | 'list';

interface MarketplaceState {
  viewMode: ViewMode;
  industry: string[];
  region: string[];
  cloud: string[];
  vendor: string[];
  page: number;
  pageSize: number;
}

const initialState: MarketplaceState = {
  viewMode: 'grid',
  industry: [],
  region: [],
  cloud: [],
  vendor: [],
  page: 1,
  pageSize: 12,
};

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    toggleIndustry(state, action: PayloadAction<string>) {
      state.industry = toggleInArray(state.industry, action.payload);
      state.page = 1;
    },
    toggleRegion(state, action: PayloadAction<string>) {
      state.region = toggleInArray(state.region, action.payload);
      state.page = 1;
    },
    toggleCloud(state, action: PayloadAction<string>) {
      state.cloud = toggleInArray(state.cloud, action.payload);
      state.page = 1;
    },
    toggleVendor(state, action: PayloadAction<string>) {
      state.vendor = toggleInArray(state.vendor, action.payload);
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetMarketplaceFilters(state) {
      state.industry = [];
      state.region = [];
      state.cloud = [];
      state.vendor = [];
      state.page = 1;
    },
  },
});

export const {
  setViewMode,
  toggleIndustry,
  toggleRegion,
  toggleCloud,
  toggleVendor,
  setPage,
  resetMarketplaceFilters,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
