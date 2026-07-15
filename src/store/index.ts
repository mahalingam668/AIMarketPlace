import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import toolsReducer from './slices/toolsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import freelancerReducer from './slices/freelancerSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
    ui: uiReducer,
    auth: authReducer,
    marketplace: marketplaceReducer,
    freelancer: freelancerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
