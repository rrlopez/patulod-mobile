import { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'panelui-native';
import { api } from '../../../lib/api';
import { authStore } from '../../../lib/store';

// Components
import Header from '../../../components/passenger/home/Header';
import BookRideCTA from '../../../components/passenger/home/BookRideCTA';
import QuickDestinations from '../../../components/passenger/home/QuickDestinations';
import RecentDestinations, { type RecentDestination } from '../../../components/passenger/home/RecentDestinations';
import ServiceCards from '../../../components/passenger/home/ServiceCards';
import SafetyReminder from '../../../components/passenger/home/SafetyReminder';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Passenger Home Screen
 * Phase 0.5 — Backend integrated with components
 *
 * Backend data:
 * - User name (from PatulodUser)
 * - Unread notifications count (from Notification table)
 * - Recent destinations (from Booking table - Phase 3)
 */
export default function PassengerHome() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<RecentDestination[]>([]);

  useEffect(() => {
    fetchPassengerData();
  }, []);

  /**
   * Fetch passenger profile and related data from backend
   */
  const fetchPassengerData = async () => {
    try {
      setLoading(true);

      // Get user data from /api/mobile/user/me
      const userResponse = await api.getUserProfile();
      
      if (!userResponse.success || !userResponse.user) {
        throw new Error(userResponse.error || 'Failed to fetch user data');
      }
      
      const userData = userResponse.user;

      // Set user name
      setUserName(userData.fullName || 'Guest');

      // TODO Phase 3: Fetch unread notifications count using Prisma endpoint
      // For now, default to false (no notifications)
      setHasUnreadNotifications(false);

      // TODO Phase 3: Fetch recent destinations from Booking table
      // For now, empty array (no recent bookings)
      setRecentDestinations([]);

    } catch (error) {
      console.error('Failed to fetch passenger data:', error);
      // Fallback to stored user data
      const state = authStore.state;
      setUserName(state.user?.fullName || 'Guest');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View 
        className="flex-1 bg-background items-center justify-center" 
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        <Text size="sm" className="text-muted-foreground mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header with user greeting */}
      <Header 
        userName={userName} 
        hasUnreadNotifications={hasUnreadNotifications} 
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Main CTA: Book a Ride */}
        <BookRideCTA />

        {/* Quick access destinations */}
        <QuickDestinations />

        {/* Recent destinations from bookings */}
        <RecentDestinations destinations={recentDestinations} />

        {/* Available service types */}
        <ServiceCards />

        {/* Safety reminder card */}
        <SafetyReminder />
      </ScrollView>
    </View>
  );
}
