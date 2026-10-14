import { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { api } from '../../../lib/api';
import { clearUser, authStore } from '../../../lib/store';

// Components
import ProfileHeader from '../../../components/passenger/profile/ProfileHeader';
import AccountDetails from '../../../components/passenger/profile/AccountDetails';
import PoliciesSupport from '../../../components/passenger/profile/PoliciesSupport';
import LogoutSection from '../../../components/passenger/profile/LogoutSection';
import AccountActions from '../../../components/passenger/profile/AccountActions';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Passenger Profile Screen
 * Phase 0.5 — Backend integrated with components
 *
 * Backend data:
 * - User info (name, email, phone) from PatulodUser
 * - Member since date from createdAt
 * - Role from PatulodUser
 */
export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Passenger',
    memberSince: '',
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Fetch user profile from backend
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Get user data from /api/mobile/user/me
      const response = await api.getUserProfile();
      
      if (!response.success || !response.user) {
        throw new Error(response.error || 'Failed to fetch user data');
      }

      const user = response.user;

      // Format member since date
      const createdDate = new Date(user.createdAt);
      const memberSince = createdDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      setUserData({
        fullName: user.fullName || 'Guest',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role === 'DRIVER' ? 'Driver' : 'Passenger',
        memberSince,
      });

    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fallback to stored user data
      const state = authStore.state;
      if (state.user) {
        setUserData({
          fullName: state.user.fullName || 'Guest',
          email: state.user.email || '',
          phone: state.user.phone || '',
          role: state.user.role === 'DRIVER' ? 'Driver' : 'Passenger',
          memberSince: 'Recently',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await api.logout();
      clearUser(); // Clear auth store
      router.replace('/'); // Go to landing page
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local session
      clearUser();
      router.replace('/');
    }
  }

  if (loading) {
    return (
      <View 
        className="flex-1 bg-background items-center justify-center" 
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        <Text size="sm" className="text-muted-foreground mt-4">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="px-5 py-3">
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-6">

          {/* Profile Header - Avatar, Name, Role */}
          <ProfileHeader
            fullName={userData.fullName}
            role={userData.role}
            memberSince={userData.memberSince}
          />

          {/* Account Details - Name, Email, Phone */}
          <AccountDetails
            fullName={userData.fullName}
            email={userData.email}
            phone={userData.phone}
            onEdit={() => router.push('/(passenger)/edit-profile')}
          />

          {/* Policies & Support Links */}
          <PoliciesSupport />

          {/* Logout Section */}
          <LogoutSection
            showConfirm={showLogoutConfirm}
            isLoggingOut={isLoggingOut}
            onShowConfirm={() => setShowLogoutConfirm(true)}
            onCancel={() => setShowLogoutConfirm(false)}
            onLogout={handleLogout}
          />

          {/* Account Actions - Deactivate, Delete */}
          <AccountActions
            showDeactivateConfirm={showDeactivateConfirm}
            showDeleteConfirm={showDeleteConfirm}
            onToggleDeactivate={() => setShowDeactivateConfirm(v => !v)}
            onToggleDelete={() => setShowDeleteConfirm(v => !v)}
          />

          {/* ===== FOOTER ===== */}
          <View className="items-center gap-1 pt-4">
            <Text size="xs" className="text-muted-foreground">PATULOD · Version 1.0.0 · Phase 0.5</Text>
            <Text size="xs" className="text-muted-foreground">Role: {userData.role}</Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
