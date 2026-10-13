import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  User,
  Bell,
  TrendingUp,
  Clock,
  Star,
  Banknote,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const MOCK_DRIVER = {
  name: 'Pedro Bautista',
  rating: 4.8,
  totalTrips: 142,
  todayEarnings: 320,
  todayTrips: 6,
  vehicleType: 'Motorcycle',
  plateNumber: 'INC-1234',
};

const MOCK_RECENT_TRIPS = [
  { id: '1', destination: 'City Hall, Laoag City',         fare: 60, time: '9:14 AM' },
  { id: '2', destination: 'Ilocos Norte Capitol',           fare: 45, time: '8:02 AM' },
  { id: '3', destination: 'Marcos International Airport',   fare: 80, time: 'Yesterday' },
];

/**
 * Driver Home Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 0.5:
 * - Online/offline toggle
 * - Status display
 * - Today's earnings + trips summary
 * - Entry point to incoming request flow
 */
export default function DriverHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Animated toggle track
  const toggleX = useSharedValue(isOnline ? 1 : 0);
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: toggleX.value > 0.5 ? PRIMARY_GREEN : '#e5e5e3',
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value * 28 }],
  }));

  function handleToggle() {
    if (isToggling) return;
    setIsToggling(true);
    const next = !isOnline;
    toggleX.value = withTiming(next ? 1 : 0, { duration: 250, easing: Easing.inOut(Easing.ease) });
    setTimeout(() => {
      setIsOnline(next);
      setIsToggling(false);
      // Mock: if going online, simulate incoming request after 3s
      if (next) {
        setTimeout(() => router.push('/(driver)/incoming-request'), 3000);
      }
    }, 280);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== TOP BAR ===== */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="gap-0.5">
          <Text size="xs" className="text-muted-foreground">Welcome back,</Text>
          <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>{MOCK_DRIVER.name}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/notifications')}
          >
            <Bell size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/profile')}
          >
            <User size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5">

          {/* ===== ONLINE / OFFLINE TOGGLE ===== */}
          <View
            className="rounded-3xl p-6 gap-5"
            style={{ backgroundColor: isOnline ? PRIMARY_GREEN : '#f5f5f3' }}
          >
            {/* Status header */}
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <View className="flex-row items-center gap-2">
                  {isOnline
                    ? <Wifi size={18} color="#fff" strokeWidth={2} />
                    : <WifiOff size={18} color="#9ca3af" strokeWidth={2} />
                  }
                  <Text
                    size="xl"
                    weight="bold"
                    style={{ color: isOnline ? '#fff' : '#1a1a1a' }}
                  >
                    {isOnline ? 'You are Online' : 'You are Offline'}
                  </Text>
                </View>
                <Text
                  size="xs"
                  style={{ color: isOnline ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}
                >
                  {isOnline
                    ? 'Waiting for ride requests…'
                    : 'Go online to start accepting rides'}
                </Text>
              </View>

              {/* Toggle switch */}
              <TouchableOpacity onPress={handleToggle} activeOpacity={0.85}>
                <Animated.View
                  className="w-16 h-8 rounded-full justify-center px-1"
                  style={[trackStyle, { width: 60, height: 32 }]}
                >
                  <Animated.View
                    className="h-6 w-6 rounded-full"
                    style={[thumbStyle, { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 }]}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Online indicator dots */}
            {isOnline && (
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Active in your service area · {MOCK_DRIVER.vehicleType} · {MOCK_DRIVER.plateNumber}
                </Text>
              </View>
            )}

            {/* Demo note */}
            {isOnline && (
              <View
                className="rounded-xl px-3 py-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Demo: An incoming ride request will appear in ~3 seconds.
                </Text>
              </View>
            )}
          </View>

          {/* ===== TODAY'S STATS ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Today
            </Text>
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-2xl p-4 gap-1"
                style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Banknote size={16} color={PRIMARY_GREEN} strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">Earnings</Text>
                </View>
                <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  ₱{MOCK_DRIVER.todayEarnings}
                </Text>
                <Text size="xs" className="text-muted-foreground">After commission</Text>
              </View>
              <View
                className="flex-1 rounded-2xl p-4 gap-1"
                style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
              >
                <View className="flex-row items-center gap-1.5">
                  <Clock size={16} color={PRIMARY_GREEN} strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">Trips</Text>
                </View>
                <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_DRIVER.todayTrips}
                </Text>
                <Text size="xs" className="text-muted-foreground">Completed today</Text>
              </View>
            </View>

            {/* Rating + total trips */}
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-2xl px-4 py-3 flex-row items-center gap-3"
                style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)' }}
              >
                <Star size={18} color="#f59e0b" strokeWidth={0} fill="#f59e0b" />
                <View>
                  <Text size="base" weight="bold" className="text-foreground">{MOCK_DRIVER.rating}</Text>
                  <Text size="xs" className="text-muted-foreground">Rating</Text>
                </View>
              </View>
              <View
                className="flex-1 rounded-2xl px-4 py-3 flex-row items-center gap-3"
                style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
              >
                <TrendingUp size={18} color={PRIMARY_GREEN} strokeWidth={2} />
                <View>
                  <Text size="base" weight="bold" className="text-foreground">{MOCK_DRIVER.totalTrips}</Text>
                  <Text size="xs" className="text-muted-foreground">Total trips</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== QUICK LINKS ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Quick Access
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <QuickLink label="Earnings Summary" icon={<Banknote size={16} color={PRIMARY_GREEN} strokeWidth={2} />} onPress={() => router.push('/(driver)/earnings')} />
              <View className="h-px bg-border/40 mx-4" />
              <QuickLink label="Trip History" icon={<Clock size={16} color={PRIMARY_GREEN} strokeWidth={2} />} onPress={() => router.push('/(driver)/trip-history')} />
              <View className="h-px bg-border/40 mx-4" />
              <QuickLink label="My Profile & Vehicle" icon={<User size={16} color={PRIMARY_GREEN} strokeWidth={2} />} onPress={() => router.push('/(driver)/profile')} />
            </View>
          </View>

          {/* ===== RECENT TRIPS ===== */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Recent Trips
              </Text>
              <TouchableOpacity onPress={() => router.push('/(driver)/trip-history')}>
                <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>See all</Text>
              </TouchableOpacity>
            </View>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              {MOCK_RECENT_TRIPS.map((trip, i) => (
                <View key={trip.id}>
                  <View className="flex-row items-center gap-3 px-4 py-3.5">
                    <View
                      className="h-9 w-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
                    >
                      <Text style={{ fontSize: 16 }}>🏍️</Text>
                    </View>
                    <View className="flex-1 gap-0.5">
                      <Text size="sm" weight="medium" className="text-foreground" numberOfLines={1}>
                        {trip.destination}
                      </Text>
                      <Text size="xs" className="text-muted-foreground">{trip.time}</Text>
                    </View>
                    <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{trip.fare}</Text>
                  </View>
                  {i < MOCK_RECENT_TRIPS.length - 1 && (
                    <View className="h-px bg-border/40 mx-4" />
                  )}
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Local helper ───────────────────────────────────────────────────────── */

function QuickLink({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
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
