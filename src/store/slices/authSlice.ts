import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AccountRole } from '../../modules/auth/roles';

export interface AuthUser {
  name: string;
  email: string;
  role: AccountRole;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const ACCOUNT_ROLES: AccountRole[] = ['Company', 'Developer', 'Admin'];

function loadPersistedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('yakkay_auth_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { name: string; email: string; role: string };
    if (ACCOUNT_ROLES.includes(parsed.role as AccountRole)) {
      return parsed as AuthUser;
    }
    // Legacy session from before real account types existed (role: 'Member') —
    // drop it so the user re-authenticates and picks a real account type.
    localStorage.removeItem('yakkay_auth_user');
    return null;
  } catch {
    return null;
  }
}

const persistedUser = loadPersistedUser();

const initialState: AuthState = {
  isAuthenticated: Boolean(persistedUser),
  user: persistedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('yakkay_auth_user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('yakkay_auth_user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
