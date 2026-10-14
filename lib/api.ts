// API client for PATULOD mobile app
import * as SecureStore from 'expo-secure-store';

const getBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not defined');
  }
  return apiUrl;
};

const TOKEN_KEY = 'patulod_auth_token';

// Token management
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// API request helper with timeout
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = 30000 // 30 second timeout
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = await getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    // For validation errors (400), return the data with errors field
    // For server errors (500+), throw an error
    if (!response.ok && response.status >= 500) {
      throw new Error(data.error || 'Server error. Please try again.');
    }

    // Return data even if not ok (e.g., 400 with validation errors)
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  }
}

// Auth API
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsVersion: string;
  privacyVersion: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    driverApplicationStatus?: string; // PENDING, APPROVED, REJECTED, DOCUMENTS_NEEDED
  };
  session?: {
    token: string;
    expiresAt: string;
  };
  error?: string;
  errors?: Record<string, string>;
  reason?: string;
}

export interface DriverApplicationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  vehicleType: string;
  plateNumber: string;
  vehicleModel: string;
  vehicleColor: string;
}

export interface DriverApplicationResponse {
  success: boolean;
  applicationId?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  session?: {
    token: string;
    expiresAt: string;
  };
  error?: string;
  errors?: Record<string, string>;
}

export const api = {
  // Register a new passenger
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      '/api/mobile/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Save token if registration successful
    if (response.success && response.session?.token) {
      await saveToken(response.session.token);
    }

    return response;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/api/mobile/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Save token if login successful
    if (response.success && response.session?.token) {
      await saveToken(response.session.token);
    }

    return response;
  },

  // Logout
  logout: async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiRequest<{ success: boolean }>(
        '/api/mobile/auth/logout',
        {
          method: 'POST',
        }
      );

      // Remove token regardless of response
      await removeToken();

      return response;
    } catch (error) {
      // Remove token even if request fails
      await removeToken();
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    return await apiRequest<AuthResponse>('/api/mobile/auth/me', {
      method: 'GET',
    });
  },

  // Driver application
  applyAsDriver: async (data: DriverApplicationData): Promise<DriverApplicationResponse> => {
    const response = await apiRequest<DriverApplicationResponse>(
      '/api/mobile/drivers/apply',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Save token if application successful and session returned
    if (response.success && response.session?.token) {
      await saveToken(response.session.token);
    }

    return response;
  },
};
