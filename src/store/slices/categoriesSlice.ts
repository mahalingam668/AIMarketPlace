import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MARKETPLACE_CATEGORIES, type MarketplaceCategory } from '../../modules/marketplace/data/categories';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CategoriesState {
  categories: MarketplaceCategory[];
}

// Seeded from the static taxonomy in modules/marketplace/data/categories.ts,
// then editable at runtime — this is what makes the admin category manager
// (blueprint §5.4 "without a code deploy") actually reach the public
// category/search pages instead of being a disconnected admin-only mock.
const initialState: CategoriesState = {
  categories: MARKETPLACE_CATEGORIES.map((c) => ({ ...c, subCategories: [...c.subCategories] })),
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addSubCategory(state, action: PayloadAction<{ categorySlug: string; name: string }>) {
      const name = action.payload.name.trim();
      if (!name) return;
      const category = state.categories.find((c) => c.slug === action.payload.categorySlug);
      if (!category) return;
      const slug = slugify(name);
      if (category.subCategories.some((s) => s.slug === slug)) return;
      category.subCategories.push({ slug, name });
    },
    renameSubCategory(state, action: PayloadAction<{ categorySlug: string; subSlug: string; name: string }>) {
      const name = action.payload.name.trim();
      if (!name) return;
      const category = state.categories.find((c) => c.slug === action.payload.categorySlug);
      const sub = category?.subCategories.find((s) => s.slug === action.payload.subSlug);
      if (sub) sub.name = name;
    },
    retireSubCategory(state, action: PayloadAction<{ categorySlug: string; subSlug: string }>) {
      const category = state.categories.find((c) => c.slug === action.payload.categorySlug);
      if (!category) return;
      category.subCategories = category.subCategories.filter((s) => s.slug !== action.payload.subSlug);
    },
  },
});

export const { addSubCategory, renameSubCategory, retireSubCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
