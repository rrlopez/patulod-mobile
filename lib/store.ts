import { Store } from '@tanstack/store';
import { getToken } from './api';

interface AuthState {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    driverApplicationStatus?: string;
  } | null;
  isAuthenticated: boolean;
  role: string | null;
  isInitialized: boolean;
}

export const authStore = new Store<AuthState>({
  user: null,
  isAuthenticated: false,
  role: null,
  isInitialized: false,
});

export const setUser = (user: AuthState['user']) => {
  authStore.setState(() => ({
    user,
    isAuthenticated: true,
    role: user?.role ?? null,
    isInitialized: true,
  }));
};

export const clearUser = () => {
  authStore.setState(() => ({
    user: null,
    isAuthenticated: false,
    role: null,
    isInitialized: true,
  }));
};

// Initialize auth state from token
export const initializeAuth = async () => {
  try {
    const token = await getToken();
    if (token) {
      // Token exists, but we don't have user data yet
      // This will be handled by the auth guard
      authStore.setState((state) => ({
        ...state,
        isInitialized: true,
      }));
    } else {
      authStore.setState(() => ({
        user: null,
        isAuthenticated: false,
        role: null,
        isInitialized: true,
      }));
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    authStore.setState((state) => ({
      ...state,
      isInitialized: true,
    }));
  }
};
