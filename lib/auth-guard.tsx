import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useStore } from '@tanstack/react-store';
import { authStore, initializeAuth } from './store';
import { getToken } from './api';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'panelui-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Auth Guard Hook
 * Protects routes based on authentication status
 */
export function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, role, user, isInitialized } = useStore(authStore);
  const [isChecking, setIsChecking] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    async function checkAuth() {
      try {
        const token = await getToken();
        
        // Get current route
        const currentRoute = segments[0] as string;
        const inAuthGroup = currentRoute === '(driver)' || currentRoute === '(passenger)';
        const inAuthFlow = ['login', 'register', 'forgot-password', 'reset-password'].includes(currentRoute);
        const inDriverOnboarding = currentRoute === 'driver-apply' || currentRoute === 'driver-docs' || currentRoute === 'driver-status';
        const isPublicRoute = ['about', 'privacy', 'terms', 'safety', 'support', '', 'index'].includes(currentRoute);

        if (!token && inAuthGroup) {
          // Not authenticated but trying to access protected route (dashboard)
          console.log('🚫 Not authenticated, redirecting to home');
          router.replace('/');
        } else if (!token && inDriverOnboarding) {
          // Not authenticated but on driver onboarding flow - allow it
          // User might be coming from driver apply public flow
          return;
        } else if (token && isAuthenticated) {
          const driverStatus = user?.driverApplicationStatus;
          
          // For drivers with unapproved applications
          if (role === 'DRIVER' && driverStatus !== 'APPROVED') {
            // If trying to access driver dashboard, redirect to status
            if (inAuthGroup && currentRoute === '(driver)') {
              console.log('📋 Driver application not approved, redirecting to status screen');
              router.replace('/driver-status');
            }
            // Allow them to stay on driver onboarding routes or public routes
            return;
          }
          
          // For approved drivers or passengers trying to access auth flow
          if (inAuthFlow && !inDriverOnboarding) {
            console.log('✅ Already authenticated, redirecting to dashboard');
            if (role === 'DRIVER') {
              router.replace('/(driver)/home');
            } else if (role === 'PASSENGER') {
              router.replace('/(passenger)/home');
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [isAuthenticated, role, user, segments, isInitialized]);

  return { isChecking: isChecking || !isInitialized };
}

/**
 * Auth Guard Provider Component
 * Wrap your app with this to enable route protection
 */
export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const { isChecking } = useAuthGuard();

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fefdfb' }}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        <Text size="sm" style={{ marginTop: 16, color: '#9ca3af' }}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
