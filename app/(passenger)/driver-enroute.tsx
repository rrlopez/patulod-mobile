import { View, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import {
  Phone,
  MapPin,
  Navigation,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Clock,
  Star,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';

const MOCK_DRIVER = {
  name: 'Pedro Bautista',
  phone: '+639171234567',
  vehicleType: 'Motorcycle',
  vehicleIcon: '🏍️',
  plateNumber: 'INC-1234',
  color: 'Red',
  rating: 4.8,
  isVerified: true,
};

const MOCK_TRIP = {
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  fareEstimate: 56,
  bookingRef: 'PTL-20261008-0042',
  distanceKm: 3.2,
};

/** Mock ETA that counts down */
const INITIAL_ETA = 4;

/**
 * Driver En Route / Map Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 3:
 * - Map showing driver position + ETA
 * - Driver info card (bottom sheet)
 * - Contact button (phone dialer — available through In Progress)
 * - Connectivity loss → textual status fallback
 * - Stale GPS labeled
 * - Tap "Arrived" area to simulate driver arrived → navigate to pickup-verify
 */
export default function DriverEnroute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [cardExpanded, setCardExpanded] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(INITIAL_ETA);
  const [isOffline, setIsOffline] = useState(false);
  const [isStaleGps, setIsStaleGps] = useState(false);

  // Simulate ETA counting down
  useEffect(() => {
    const t = setInterval(() => {
      setEtaMinutes(e => {
        if (e <= 1) {
          clearInterval(t);
          return 1;
        }
        return e - 1;
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Driver icon pulse on map
  const driverPulse = useSharedValue(1);
  useEffect(() => {
    driverPulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const driverIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: driverPulse.value }],
  }));

  function handleCall() {
    Linking.openURL(`tel:${MOCK_DRIVER.phone}`);
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>

      {/* ===== MOCK MAP (full screen) ===== */}
      <View className="absolute inset-0" style={{ backgroundColor: '#e8f0e9' }}>
        {/* Grid */}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <View key={`h${i}`} className="absolute w-full" style={{ height: 1, top: `${i * 13}%`, backgroundColor: 'rgba(13,95,58,0.1)' }} />
        ))}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <View key={`v${i}`} className="absolute h-full" style={{ width: 1, left: `${i * 13}%`, backgroundColor: 'rgba(13,95,58,0.1)' }} />
        ))}

        {/* Route line */}
        <View
          className="absolute rounded-full"
          style={{
            width: 130, height: 3,
            backgroundColor: PRIMARY_GREEN,
            opacity: isStaleGps ? 0.25 : 0.5,
            top: '44%', left: '28%',
            transform: [{ rotate: '-10deg' }],
          }}
        />

        {/* Driver marker */}
        <View className="absolute" style={{ top: '32%', left: '28%' }}>
          <Animated.View style={driverIconStyle}>
            <View
              className="h-11 w-11 rounded-full items-center justify-center"
              style={{
                backgroundColor: isStaleGps ? '#9ca3af' : PRIMARY_GREEN,
                borderWidth: 2.5, borderColor: '#fff',
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
              }}
            >
              <Text style={{ fontSize: 20 }}>🏍️</Text>
            </View>
          </Animated.View>
          {isStaleGps && (
            <View
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full items-center justify-center"
              style={{ backgroundColor: '#f59e0b' }}
            >
              <Text style={{ fontSize: 8, color: '#fff', fontWeight: 'bold' }}>!</Text>
            </View>
          )}
        </View>

        {/* Pickup pin (you) */}
        <View className="absolute items-center" style={{ top: '52%', left: '55%' }}>
          <View
            className="h-9 w-9 rounded-full items-center justify-center"
            style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: PRIMARY_GREEN }}
          >
            <Navigation size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </View>
          <View
            className="rounded-md px-1.5 py-0.5 mt-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>You</Text>
          </View>
        </View>

        {/* Mock label */}
        <View
          className="absolute top-3 right-3 rounded-lg px-2 py-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Text size="xs" weight="medium" className="text-muted-foreground">Mock map • Phase 0.5</Text>
        </View>

        {/* Demo toggle buttons — top left */}
        <View className="absolute top-3 left-3 gap-1.5">
          <TouchableOpacity
            className="rounded-lg px-2 py-1 flex-row items-center gap-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
            onPress={() => setIsOffline(v => !v)}
          >
            {isOffline
              ? <WifiOff size={12} color="#ef4444" strokeWidth={2} />
              : <Wifi size={12} color={PRIMARY_GREEN} strokeWidth={2} />
            }
            <Text size="xs" weight="medium" style={{ color: isOffline ? '#ef4444' : PRIMARY_GREEN }}>
              {isOffline ? 'Offline' : 'Online'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg px-2 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
            onPress={() => setIsStaleGps(v => !v)}
          >
            <Text size="xs" weight="medium" style={{ color: isStaleGps ? '#f59e0b' : '#9ca3af' }}>
              {isStaleGps ? '⚠️ Stale GPS' : 'GPS OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== OFFLINE BANNER ===== */}
      {isOffline && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="absolute left-0 right-0 flex-row items-center gap-2 px-4 py-2.5"
          style={{ top: insets.top + 0, backgroundColor: '#ef4444' }}
        >
          <WifiOff size={15} color="#fff" strokeWidth={2.5} />
          <Text size="xs" weight="semibold" className="text-white flex-1">
            No connection — map paused. Driver status may be outdated.
          </Text>
        </Animated.View>
      )}

      {/* ===== STALE GPS BANNER ===== */}
      {isStaleGps && !isOffline && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="absolute left-0 right-0 flex-row items-center gap-2 px-4 py-2.5"
          style={{ top: insets.top + 0, backgroundColor: '#f59e0b' }}
        >
          <AlertTriangle size={15} color="#fff" strokeWidth={2.5} />
          <Text size="xs" weight="semibold" className="text-white flex-1">
            Driver location not updated recently — position may be approximate.
          </Text>
        </Animated.View>
      )}

      {/* ===== ETA PILL ===== */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(400)}
        className="absolute left-0 right-0 items-center"
        style={{ top: insets.top + (isOffline || isStaleGps ? 44 : 12) }}
      >
        <View
          className="flex-row items-center gap-2 rounded-full px-4 py-2"
          style={{ backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}
        >
          <Clock size={15} color={PRIMARY_GREEN} strokeWidth={2.5} />
          <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
            {isOffline ? 'ETA unavailable' : `Arriving in ~${etaMinutes} min`}
          </Text>
        </View>
      </Animated.View>

      {/* ===== BOTTOM SHEET ===== */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={{
          backgroundColor: '#fff',
          paddingBottom: insets.bottom + 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {/* Drag handle */}
        <TouchableOpacity className="items-center pt-3 pb-1" onPress={() => setCardExpanded(v => !v)}>
          <View className="h-1 w-10 rounded-full" style={{ backgroundColor: '#e5e5e3' }} />
        </TouchableOpacity>

        {/* Driver row — always visible */}
        <TouchableOpacity
          className="flex-row items-center justify-between px-5 py-3"
          onPress={() => setCardExpanded(v => !v)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-12 w-12 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text size="base" weight="bold" className="text-foreground">{MOCK_DRIVER.name}</Text>
                {MOCK_DRIVER.isVerified && (
                  <ShieldCheck size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
                )}
              </View>
              <View className="flex-row items-center gap-1.5">
                <Text style={{ fontSize: 12 }}>{MOCK_DRIVER.vehicleIcon}</Text>
                <Text size="xs" weight="medium" className="text-muted-foreground">
                  {MOCK_DRIVER.color} {MOCK_DRIVER.vehicleType}
                </Text>
                <Text size="xs" className="text-muted-foreground">·</Text>
                <Text size="xs" weight="bold" className="text-foreground">{MOCK_DRIVER.plateNumber}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Call button — available during en route */}
            <TouchableOpacity
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              onPress={handleCall}
            >
              <Phone size={18} color={PRIMARY_GREEN} strokeWidth={2} />
            </TouchableOpacity>
            {cardExpanded
              ? <ChevronDown size={18} color="#9ca3af" strokeWidth={2} />
              : <ChevronUp size={18} color="#9ca3af" strokeWidth={2} />
            }
          </View>
        </TouchableOpacity>

        {/* Expanded details */}
        {cardExpanded && (
          <View className="px-5 gap-3 pt-1">

            {/* Route summary */}
            <View
              className="rounded-2xl p-3 gap-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.04)' }}
            >
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full" style={{ backgroundColor: PRIMARY_GREEN }} />
                <Text size="xs" className="text-muted-foreground flex-1" numberOfLines={1}>
                  {MOCK_TRIP.pickup}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <MapPin size={10} color="#ef4444" strokeWidth={2.5} />
                <Text size="xs" className="text-muted-foreground flex-1" numberOfLines={1}>
                  {MOCK_TRIP.destination}
                </Text>
              </View>
            </View>

            {/* Fare + ref */}
            <View className="flex-row items-center justify-between px-1">
              <Text size="xs" className="text-muted-foreground">Estimated fare</Text>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{MOCK_TRIP.fareEstimate}</Text>
            </View>
            <View className="flex-row items-center justify-between px-1">
              <Text size="xs" className="text-muted-foreground">Booking ref</Text>
              <Text size="xs" weight="semibold" className="text-foreground">{MOCK_TRIP.bookingRef}</Text>
            </View>

            {/* Verification reminder */}
            <View
              className="flex-row items-start gap-2 rounded-xl p-3"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <ShieldCheck size={14} color="#92400e" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
              <Text size="xs" className="flex-1 leading-relaxed" style={{ color: '#92400e' }}>
                Before boarding verify the driver name, vehicle color, and plate{' '}
                <Text size="xs" weight="bold" style={{ color: '#92400e' }}>({MOCK_DRIVER.plateNumber})</Text>.
              </Text>
            </View>

            {/* Demo: simulate arrived */}
            <Button
              size="md"
              className="w-full"
              style={{ backgroundColor: PRIMARY_GREEN }}
              onPress={() => router.push('/(passenger)/pickup-verify')}
            >
              <Text size="sm" weight="bold" className="text-white">
                Demo: Driver Arrived →
              </Text>
            </Button>

          </View>
        )}
      </Animated.View>
    </View>
  );
}
