import { Store } from '@tanstack/store';

interface AuthState {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  role: string | null;
}

export const authStore = new Store<AuthState>({
  user: null,
  isAuthenticated: false,
  role: null,
});

export const setUser = (user: AuthState['user']) => {
  authStore.setState(() => ({
    user,
    isAuthenticated: true,
    role: user?.role ?? null,
  }));
};

export const clearUser = () => {
  authStore.setState(() => ({
    user: null,
    isAuthenticated: false,
    role: null,
  }));
};
