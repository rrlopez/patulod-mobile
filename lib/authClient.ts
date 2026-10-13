import { createAuthClient } from 'better-auth/react';

const getBaseUrl = () => {
  // In Expo, environment variables must be prefixed with EXPO_PUBLIC_
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not defined in environment variables');
  }
  return apiUrl;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});
