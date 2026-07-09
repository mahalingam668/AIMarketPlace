import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

function loadPersistedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('yakkay_auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
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
