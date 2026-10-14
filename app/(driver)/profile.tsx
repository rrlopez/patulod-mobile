import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  FileText,
  Lock,
  ShieldCheck,
  MessageCircle,
  Info,
  LogOut,
  UserX,
  Trash2,
  Edit3,
  CheckCircle2,
  Car,
  Star,
  AlertCircle,
  RefreshCw,
} from 'lucide-react-native';
import { api } from '../../lib/api';
import { clearUser } from '../../lib/store';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

/**
 * Driver Profile Screen
 * Integrated with backend API
 */
export default function DriverProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function fetchProfile() {
    try {
      setError(null);
      const response = await api.getUserProfile();

      if (response.success && response.user) {
        setProfileData(response.user);
      } else {
        setError(response.error || 'Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchProfile();
  }

  useEffect(() => {
    fetchProfile();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        <Text size="sm" className="text-muted-foreground mt-4">Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-6 bg-background"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View
          className="h-20 w-20 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
        >
          <AlertCircle size={40} color={ERROR_RED} strokeWidth={2} />
        </View>
        <View className="items-center gap-2">
          <Text size="2xl" weight="bold" style={{ color: ERROR_RED }}>Error Loading Profile</Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
            {error || 'Failed to load your profile. Please try again.'}
          </Text>
        </View>
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={fetchProfile}
        >
          <RefreshCw size={18} color="#fff" strokeWidth={2} />
          <Text size="base" weight="bold" className="text-white ml-2">Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>My Profile</Text>
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
          onPress={handleRefresh}
        >
          <RefreshCw size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[PRIMARY_GREEN]} />
        }
      >
        <View className="px-5 gap-6">

          {/* ===== AVATAR + NAME ===== */}
          <View className="items-center gap-3 pt-2 pb-2">
            <View className="relative">
              <View
                className="h-24 w-24 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
              >
                <Text style={{ fontSize: 44 }}>🧑‍✈️</Text>
              </View>
              <View
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full items-center justify-center"
                style={{ backgroundColor: PRIMARY_GREEN, borderWidth: 2, borderColor: '#fefdfb' }}
              >
                <Edit3 size={14} color="#fff" strokeWidth={2.5} />
              </View>
            </View>
            <View className="items-center gap-0.5">
              <Text size="xl" weight="bold" className="text-foreground">{profileData.fullName}</Text>
              <View
                className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
              >
                <CheckCircle2 size={12} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  {profileData.role} · Member since {profileData.driverStats?.memberSince}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== DRIVER STATS ===== */}
          {profileData.driverStats && (
            <View className="gap-2">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Driver Stats
              </Text>
              <View
                className="rounded-2xl p-4"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                <View className="flex-row items-center gap-4">
                  <View className="flex-1 items-center gap-1">
                    <View className="flex-row items-center gap-1">
                      <Star size={16} color="#fbbf24" strokeWidth={2} fill="#fbbf24" />
                      <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                        {profileData.driverStats.rating.toFixed(1)}
                      </Text>
                    </View>
                    <Text size="xs" className="text-muted-foreground">Rating</Text>
                  </View>
                  <View className="h-12 w-px bg-border" />
                  <View className="flex-1 items-center gap-1">
                    <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                      {profileData.driverStats.totalTrips}
                    </Text>
                    <Text size="xs" className="text-muted-foreground">Total Trips</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ===== VEHICLE INFO ===== */}
          {profileData.vehicleInfo && (
            <View className="gap-2">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Vehicle Information
              </Text>
              <View
                className="rounded-2xl overflow-hidden"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                <View className="flex-row items-center gap-3 px-4 py-3.5">
                  <Car size={16} color="#9ca3af" strokeWidth={2} />
                  <View className="flex-1 gap-0.5">
                    <Text size="xs" className="text-muted-foreground">Vehicle Type</Text>
                    <Text size="sm" weight="medium" className="text-foreground">
                      {profileData.vehicleInfo.vehicleType.charAt(0).toUpperCase() + profileData.vehicleInfo.vehicleType.slice(1)}
                    </Text>
                  </View>
                </View>
                <View className="h-px bg-border/40 mx-4" />
                <View className="flex-row items-center gap-3 px-4 py-3.5">
                  <FileText size={16} color="#9ca3af" strokeWidth={2} />
                  <View className="flex-1 gap-0.5">
                    <Text size="xs" className="text-muted-foreground">Plate Number</Text>
                    <Text size="sm" weight="medium" className="text-foreground">{profileData.vehicleInfo.plateNumber}</Text>
                  </View>
                </View>
                <View className="h-px bg-border/40 mx-4" />
                <View className="flex-row items-center gap-3 px-4 py-3.5">
                  <Car size={16} color="#9ca3af" strokeWidth={2} />
                  <View className="flex-1 gap-0.5">
                    <Text size="xs" className="text-muted-foreground">Model & Color</Text>
                    <Text size="sm" weight="medium" className="text-foreground">
                      {profileData.vehicleInfo.vehicleModel} · {profileData.vehicleInfo.vehicleColor}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-center gap-1.5 py-2"
                onPress={() => router.push('/driver-status')}
              >
                <Edit3 size={13} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  View Application Status
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===== ACCOUNT DETAILS ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Account Details
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <ProfileField
                icon={<User size={16} color="#9ca3af" strokeWidth={2} />}
                label="Full Name"
                value={profileData.fullName}
                onEdit={() => router.push('/edit-profile')}
              />
              <View className="h-px bg-border/40 mx-4" />
              <ProfileField
                icon={<Mail size={16} color="#9ca3af" strokeWidth={2} />}
                label="Email"
                value={profileData.email}
                onEdit={() => router.push('/edit-profile')}
                sensitiveNote="Requires password confirmation"
              />
              <View className="h-px bg-border/40 mx-4" />
              <ProfileField
                icon={<Phone size={16} color="#9ca3af" strokeWidth={2} />}
                label="Mobile"
                value={profileData.phone}
                onEdit={() => router.push('/edit-profile')}
                sensitiveNote="Requires password confirmation"
              />
            </View>
            <Text size="xs" className="text-muted-foreground px-1">
              Changing email or phone requires your current password for verification.
            </Text>
          </View>

          {/* ===== POLICIES & SUPPORT ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Policies & Support
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <LinkRow
                icon={<FileText size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
                label="Driver Terms and Understanding"
                onPress={() => router.push('/terms')}
              />
              <View className="h-px bg-border/40 mx-4" />
              <LinkRow
                icon={<Lock size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
                label="Privacy Notice"
                onPress={() => router.push('/privacy')}
              />
              <View className="h-px bg-border/40 mx-4" />
              <LinkRow
                icon={<ShieldCheck size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
                label="Driver Safety Guidelines"
                onPress={() => router.push('/safety')}
              />
              <View className="h-px bg-border/40 mx-4" />
              <LinkRow
                icon={<MessageCircle size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
                label="Help / Support"
                onPress={() => router.push('/support')}
              />
              <View className="h-px bg-border/40 mx-4" />
              <LinkRow
                icon={<Info size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
                label="About PATULOD"
                onPress={() => router.push('/about')}
              />
            </View>
          </View>

          {/* ===== LOGOUT ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Session
            </Text>
            {!showLogoutConfirm ? (
              <TouchableOpacity
                className="flex-row items-center gap-3 rounded-2xl px-4 py-4"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
                onPress={() => setShowLogoutConfirm(true)}
              >
                <LogOut size={18} color="#ef4444" strokeWidth={2} />
                <Text size="sm" weight="semibold" style={{ color: '#ef4444' }}>Log Out</Text>
              </TouchableOpacity>
            ) : (
              <View
                className="rounded-2xl p-4 gap-3"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderWidth: 1.5, borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>Log out of PATULOD?</Text>
                <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                  Your session will be ended on this device. You can log back in at any time.
                </Text>
                <View className="flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    style={{ borderColor: '#e5e5e3' }}
                    onPress={() => setShowLogoutConfirm(false)}
                  >
                    <Text size="sm" weight="semibold" className="text-foreground">Cancel</Text>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    style={{ backgroundColor: '#dc2626' }}
                    onPress={handleLogout}
                  >
                    <Text size="sm" weight="bold" className="text-white">Log Out</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>

          {/* ===== ACCOUNT ACTIONS ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Account
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <TouchableOpacity
                className="flex-row items-center gap-3 px-4 py-4"
                onPress={() => setShowDeactivateConfirm(v => !v)}
              >
                <UserX size={16} color="#9ca3af" strokeWidth={2} />
                <Text size="sm" weight="medium" className="text-muted-foreground flex-1">
                  Deactivate Account
                </Text>
                <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
              </TouchableOpacity>
              <View className="h-px bg-border/40 mx-4" />
              <TouchableOpacity
                className="flex-row items-center gap-3 px-4 py-4"
                onPress={() => setShowDeleteConfirm(v => !v)}
              >
                <Trash2 size={16} color="#9ca3af" strokeWidth={2} />
                <Text size="sm" weight="medium" className="text-muted-foreground flex-1">
                  Request Account Deletion
                </Text>
                <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Deactivate explanation */}
            {showDeactivateConfirm && (
              <View
                className="rounded-2xl p-4 gap-2"
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.07)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
              >
                <Text size="sm" weight="bold" style={{ color: '#92400e' }}>About Deactivation</Text>
                <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
                  Deactivating your driver account suspends your access to PATULOD. Your data is retained and you can reactivate at any time by logging back in. Any active rides must be completed first.
                </Text>
                <Button
                  size="sm"
                  className="w-full mt-1"
                  style={{ backgroundColor: '#92400e' }}
                  onPress={() => router.push('/support')}
                >
                  <Text size="sm" weight="bold" className="text-white">Contact Support to Deactivate</Text>
                </Button>
              </View>
            )}

            {/* Delete explanation */}
            {showDeleteConfirm && (
              <View
                className="rounded-2xl p-4 gap-2"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>About Account Deletion</Text>
                <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                  Requesting deletion removes your personal data from PATULOD. Some records (e.g. trip history for audit purposes) may be retained for a legally required period. Deletion is not immediate and cannot be undone.
                </Text>
                <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                  We will confirm what data is retained and why before proceeding.
                </Text>
                <Button
                  size="sm"
                  className="w-full mt-1"
                  style={{ backgroundColor: '#dc2626' }}
                  onPress={() => router.push('/support')}
                >
                  <Text size="sm" weight="bold" className="text-white">Contact Support to Request Deletion</Text>
                </Button>
              </View>
            )}
          </View>

          {/* ===== FOOTER ===== */}
          <View className="items-center gap-1 pt-4">
            <Text size="xs" className="text-muted-foreground">PATULOD · Version 1.0.0</Text>
            <Text size="xs" className="text-muted-foreground">Role: {profileData.role}</Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function ProfileField({
  icon, label, value, onEdit, sensitiveNote,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
  sensitiveNote?: string;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3.5"
      onPress={onEdit}
      activeOpacity={0.7}
    >
      {icon}
      <View className="flex-1 gap-0.5">
        <Text size="xs" className="text-muted-foreground">{label}</Text>
        <Text size="sm" weight="medium" className="text-foreground">{value}</Text>
        {sensitiveNote && (
          <Text size="xs" style={{ color: '#9ca3af' }}>{sensitiveNote}</Text>
        )}
      </View>
      <Edit3 size={14} color="#9ca3af" strokeWidth={2} />
    </TouchableOpacity>
  );
}

function LinkRow({
  icon, label, onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3.5"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text size="sm" weight="medium" className="text-foreground flex-1">{label}</Text>
      <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
    </TouchableOpacity>
  );
}
