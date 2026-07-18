import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import toolsReducer from './slices/toolsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import freelancerReducer from './slices/freelancerSlice';
import categoriesReducer from './slices/categoriesSlice';
import projectsReducer from './slices/projectsSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
    ui: uiReducer,
    auth: authReducer,
    marketplace: marketplaceReducer,
    freelancer: freelancerReducer,
    categories: categoriesReducer,
    projects: projectsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
