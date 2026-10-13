import { View, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import {
  MapPin,
  Navigation,
  Phone,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Clock,
  Banknote,
  AlertTriangle,
  X,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';

const MOCK_DRIVER = {
  name: 'Pedro Bautista',
  phone: '+639171234567',
  vehicleType: 'Motorcycle',
  vehicleIcon: '🏍️',
  plateNumber: 'INC-1234',
  color: 'Red',
};

const MOCK_TRIP = {
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  fareEstimate: 56,
  bookingRef: 'PTL-20261008-0042',
  distanceKm: 3.2,
  distanceRemaining: 1.8,
};

/**
 * In-Progress Trip Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 3:
 * - Map with active trip route
 * - Status indicator (label + icon — not color-only)
 * - Fare info
 * - Contact button remains available during active ride
 * - Cancel option at permitted stages only
 * - Contact button removed on completion/cancellation (enforced in trip-complete)
 */
export default function TripInProgress() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [cardExpanded, setCardExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Elapsed trip timer
  useEffect(() => {
    const t = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Driver dot pulse on map
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const formatElapsed = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  function handleCall() {
    Linking.openURL(`tel:${MOCK_DRIVER.phone}`);
  }

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>

      {/* ===== MOCK MAP ===== */}
      <View className="absolute inset-0" style={{ backgroundColor: '#e8f0e9' }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <View key={`h${i}`} className="absolute w-full" style={{ height: 1, top: `${i * 13}%`, backgroundColor: 'rgba(13,95,58,0.1)' }} />
        ))}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <View key={`v${i}`} className="absolute h-full" style={{ width: 1, left: `${i * 13}%`, backgroundColor: 'rgba(13,95,58,0.1)' }} />
        ))}

        {/* Completed route segment (faded) */}
        <View
          className="absolute rounded-full"
          style={{
            width: 70, height: 3,
            backgroundColor: PRIMARY_GREEN,
            opacity: 0.25,
            top: '43%', left: '22%',
            transform: [{ rotate: '-8deg' }],
          }}
        />

        {/* Remaining route segment */}
        <View
          className="absolute rounded-full"
          style={{
            width: 90, height: 3,
            backgroundColor: PRIMARY_GREEN,
            opacity: 0.6,
            top: '40%', left: '38%',
            transform: [{ rotate: '-8deg' }],
          }}
        />

        {/* Driver marker — mid-route */}
        <View className="absolute" style={{ top: '37%', left: '40%' }}>
          <Animated.View style={pulseStyle}>
            <View
              className="h-11 w-11 rounded-full items-center justify-center"
              style={{ backgroundColor: PRIMARY_GREEN, borderWidth: 2.5, borderColor: '#fff', elevation: 4 }}
            >
              <Text style={{ fontSize: 20 }}>🏍️</Text>
            </View>
          </Animated.View>
        </View>

        {/* Pickup (faded — already passed) */}
        <View className="absolute items-center" style={{ top: '50%', left: '22%' }}>
          <View
            className="h-7 w-7 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1.5, borderColor: 'rgba(13,95,58,0.3)' }}
          >
            <Navigation size={12} color="rgba(13,95,58,0.4)" strokeWidth={2} />
          </View>
        </View>

        {/* Destination pin */}
        <View className="absolute items-center" style={{ top: '28%', left: '63%' }}>
          <MapPin size={30} color="#ef4444" strokeWidth={2.5} />
          <View
            className="rounded-md px-1.5 py-0.5 -mt-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            <Text size="xs" weight="bold" style={{ color: '#ef4444' }}>Dest.</Text>
          </View>
        </View>

        {/* Map label */}
        <View
          className="absolute top-3 right-3 rounded-lg px-2 py-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
        >
          <Text size="xs" weight="medium" className="text-muted-foreground">Mock map • Phase 0.5</Text>
        </View>
      </View>

      {/* ===== STATUS PILL — top center ===== */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        className="absolute left-0 right-0 items-center"
        style={{ top: insets.top + 12 }}
      >
        <View
          className="flex-row items-center gap-2 rounded-full px-4 py-2"
          style={{ backgroundColor: PRIMARY_GREEN, elevation: 4 }}
        >
          {/* Label + icon — NOT color-only per spec */}
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: '#4ade80' }}
          />
          <Text size="sm" weight="bold" className="text-white">
            🚗 Trip In Progress
          </Text>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)', fontVariant: ['tabular-nums'] }}>
            {formatElapsed(elapsedSeconds)}
          </Text>
        </View>
      </Animated.View>

      {/* ===== BOTTOM SHEET ===== */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
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

        {/* Summary row — always visible */}
        <TouchableOpacity
          className="flex-row items-center justify-between px-5 py-3"
          onPress={() => setCardExpanded(v => !v)}
          activeOpacity={0.7}
        >
          <View className="gap-0.5">
            <View className="flex-row items-center gap-1.5">
              <MapPin size={13} color="#ef4444" strokeWidth={2.5} />
              <Text size="sm" weight="semibold" className="text-foreground" numberOfLines={1} style={{ maxWidth: 200 }}>
                {MOCK_TRIP.destination}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Clock size={12} color="#9ca3af" strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">{formatElapsed(elapsedSeconds)}</Text>
              </View>
              <Text size="xs" className="text-muted-foreground">~{MOCK_TRIP.distanceRemaining} km left</Text>
              <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{MOCK_TRIP.fareEstimate} est.</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Phone — available during in-progress per spec */}
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
          <View className="px-5 gap-4 pb-2">

            {/* Driver row */}
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
              >
                <Text style={{ fontSize: 22 }}>👤</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text size="sm" weight="bold" className="text-foreground">{MOCK_DRIVER.name}</Text>
                  <ShieldCheck size={13} color={PRIMARY_GREEN} strokeWidth={2.5} />
                </View>
                <Text size="xs" className="text-muted-foreground">
                  {MOCK_DRIVER.color} {MOCK_DRIVER.vehicleType} · {MOCK_DRIVER.plateNumber}
                </Text>
              </View>
            </View>

            {/* Fare breakdown */}
            <View
              className="rounded-2xl p-3 gap-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.04)' }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Banknote size={14} color={PRIMARY_GREEN} strokeWidth={2} />
                  <Text size="xs" weight="semibold" className="text-foreground">Estimated Fare</Text>
                </View>
                <Text size="base" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{MOCK_TRIP.fareEstimate}</Text>
              </View>
              <Text size="xs" className="text-muted-foreground">
                Cash · Pay driver at trip end
              </Text>
            </View>

            {/* Booking ref */}
            <View className="flex-row items-center justify-between px-1">
              <Text size="xs" className="text-muted-foreground">Booking ref</Text>
              <Text size="xs" weight="semibold" className="text-foreground">{MOCK_TRIP.bookingRef}</Text>
            </View>

            {/* Demo: complete trip */}
            <Button
              size="md"
              className="w-full"
              style={{ backgroundColor: PRIMARY_GREEN }}
              onPress={() => router.replace('/(passenger)/trip-complete')}
            >
              <Text size="sm" weight="bold" className="text-white">Demo: Complete Trip →</Text>
            </Button>

            {/* Cancel — only at permitted stages */}
            {!showCancelConfirm ? (
              <TouchableOpacity
                className="items-center py-1 flex-row justify-center gap-1.5"
                onPress={() => setShowCancelConfirm(true)}
              >
                <AlertTriangle size={13} color="#9ca3af" strokeWidth={2} />
                <Text size="xs" weight="medium" className="text-muted-foreground">
                  Need to cancel?
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                className="rounded-2xl p-4 gap-3"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.07)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={16} color="#dc2626" strokeWidth={2.5} />
                  <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>Cancel in-progress ride?</Text>
                </View>
                <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                  Cancelling an in-progress ride may incur a fee. The driver will be notified. Are you sure?
                </Text>
                <View className="flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    style={{ borderColor: '#e5e5e3' }}
                    onPress={() => setShowCancelConfirm(false)}
                  >
                    <Text size="sm" weight="semibold" className="text-foreground">Continue Ride</Text>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    style={{ backgroundColor: '#dc2626' }}
                    onPress={() => router.replace('/(passenger)/home')}
                  >
                    <Text size="sm" weight="bold" className="text-white">Yes, Cancel</Text>
                  </Button>
                </View>
              </View>
            )}

          </View>
        )}
      </Animated.View>
    </View>
  );
}
