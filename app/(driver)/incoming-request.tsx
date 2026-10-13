import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import {
  MapPin,
  Navigation,
  Clock,
  Banknote,
  User,
  X,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const MOCK_REQUEST = {
  bookingId: 'PTL-20261008-0042',
  passengerName: 'Maria Santos',
  passengerRating: 4.9,
  pickup: {
    name: 'City Mall Tuguegarao',
    address: 'Tuguegarao City, Cagayan',
  },
  destination: {
    name: 'Cagayan Valley Medical Center',
    address: 'Carig Sur, Tuguegarao City',
  },
  distance: '3.2 km',
  estimatedFare: 65,
  estimatedDuration: '8 min',
  serviceType: 'TRICYCLE',
};

const AUTO_EXPIRE_SECONDS = 30;

/**
 * Incoming Request Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 0.5:
 * - Pickup/destination/fare visible
 * - Minimal passenger details (name, rating)
 * - Accept/Decline buttons
 * - Auto-expiry countdown (30s)
 * - Mock: Accept → driver-enroute, Decline/Expire → driver home
 */
export default function IncomingRequest() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [secondsLeft, setSecondsLeft] = useState(AUTO_EXPIRE_SECONDS);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  // Pulse animation for the countdown
  const pulseScale = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      handleExpire();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(v => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleAccept() {
    setIsAccepting(true);
    setTimeout(() => {
      router.replace('/(driver)/arriving');
    }, 1200);
  }

  function handleDecline() {
    setIsDeclining(true);
    setTimeout(() => {
      router.replace('/(driver)/home');
    }, 800);
  }

  function handleExpire() {
    // Auto-expire — route back to driver home
    setTimeout(() => {
      router.replace('/(driver)/home');
    }, 1000);
  }

  const isUrgent = secondsLeft <= 10;
  const isExpired = secondsLeft <= 0;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      {/* ===== COUNTDOWN HEADER ===== */}
      <View
        className="items-center py-4"
        style={{
          backgroundColor: isExpired
            ? 'rgba(220, 38, 38, 0.1)'
            : isUrgent
            ? 'rgba(251, 191, 36, 0.15)'
            : 'rgba(13, 95, 58, 0.08)',
        }}
      >
        <View className="flex-row items-center gap-2">
          <Clock
            size={18}
            color={isExpired ? '#dc2626' : isUrgent ? '#92400e' : PRIMARY_GREEN}
            strokeWidth={2.5}
          />
          <Text
            size="sm"
            weight="bold"
            style={{
              color: isExpired ? '#dc2626' : isUrgent ? '#92400e' : PRIMARY_GREEN,
            }}
          >
            {isExpired ? 'Request Expired' : `${secondsLeft}s to respond`}
          </Text>
        </View>
      </View>

      <View className="flex-1 px-5 gap-6 pt-4">
        {/* ===== NEW REQUEST BADGE ===== */}
        <View className="items-center">
          <Animated.View
            style={[
              pulseStyle,
              {
                backgroundColor: 'rgba(13, 95, 58, 0.12)',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
              },
            ]}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN, letterSpacing: 1 }}>
              🔔 NEW RIDE REQUEST
            </Text>
          </Animated.View>
        </View>

        {/* ===== PASSENGER INFO ===== */}
        <View
          className="rounded-3xl p-5 gap-3"
          style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
        >
          <View className="flex-row items-center gap-3">
            <View
              className="h-14 w-14 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <User size={24} color={PRIMARY_GREEN} strokeWidth={2} />
            </View>
            <View className="flex-1 gap-1">
              <Text size="lg" weight="bold" className="text-foreground">
                {MOCK_REQUEST.passengerName}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <View className="flex-row items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={{ fontSize: 12 }}>
                      {i < Math.floor(MOCK_REQUEST.passengerRating) ? '⭐' : '☆'}
                    </Text>
                  ))}
                </View>
                <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_REQUEST.passengerRating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ===== TRIP DETAILS ===== */}
        <View
          className="rounded-3xl p-5 gap-4"
          style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
        >
          {/* Pickup */}
          <View className="flex-row items-start gap-3">
            <View
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
            >
              <MapPin size={18} color="#0369a1" strokeWidth={2.5} />
            </View>
            <View className="flex-1 gap-0.5">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase">
                Pickup
              </Text>
              <Text size="base" weight="bold" className="text-foreground">
                {MOCK_REQUEST.pickup.name}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {MOCK_REQUEST.pickup.address}
              </Text>
            </View>
          </View>

          {/* Separator */}
          <View className="flex-row items-center gap-2 px-2">
            <View className="h-px flex-1 bg-border" />
            <Navigation size={14} color="#9ca3af" strokeWidth={2} />
            <Text size="xs" className="text-muted-foreground">{MOCK_REQUEST.distance}</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* Destination */}
          <View className="flex-row items-start gap-3">
            <View
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <MapPin size={18} color={PRIMARY_GREEN} strokeWidth={2.5} fill={PRIMARY_GREEN} />
            </View>
            <View className="flex-1 gap-0.5">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase">
                Destination
              </Text>
              <Text size="base" weight="bold" className="text-foreground">
                {MOCK_REQUEST.destination.name}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {MOCK_REQUEST.destination.address}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== FARE & DURATION ===== */}
        <View
          className="rounded-3xl p-4"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.12)', borderWidth: 1.5, borderColor: 'rgba(251, 191, 36, 0.3)' }}
        >
          <View className="flex-row items-center justify-around">
            <View className="items-center gap-1">
              <Banknote size={20} color={ACCENT_YELLOW} strokeWidth={2} />
              <Text size="xs" className="text-muted-foreground">Estimated Fare</Text>
              <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                ₱{MOCK_REQUEST.estimatedFare}
              </Text>
            </View>
            <View className="h-12 w-px bg-border" />
            <View className="items-center gap-1">
              <Clock size={20} color={ACCENT_YELLOW} strokeWidth={2} />
              <Text size="xs" className="text-muted-foreground">Est. Duration</Text>
              <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                {MOCK_REQUEST.estimatedDuration}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1" />

        {/* ===== ACTION BUTTONS ===== */}
        {!isExpired && (
          <View className="gap-3">
            <Button
              size="lg"
              className="w-full"
              style={{
                backgroundColor: PRIMARY_GREEN,
                opacity: isAccepting || isDeclining ? 0.5 : 1,
              }}
              onPress={handleAccept}
              disabled={isAccepting || isDeclining}
            >
              <View className="flex-row items-center gap-2">
                <Check size={20} color="#fff" strokeWidth={2.5} />
                <Text size="base" weight="bold" className="text-white">
                  {isAccepting ? 'Accepting...' : 'Accept Request'}
                </Text>
              </View>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              style={{
                borderColor: '#dc2626',
                opacity: isAccepting || isDeclining ? 0.5 : 1,
              }}
              onPress={handleDecline}
              disabled={isAccepting || isDeclining}
            >
              <View className="flex-row items-center gap-2">
                <X size={20} color="#dc2626" strokeWidth={2.5} />
                <Text size="base" weight="bold" style={{ color: '#dc2626' }}>
                  {isDeclining ? 'Declining...' : 'Decline'}
                </Text>
              </View>
            </Button>
          </View>
        )}

        {/* ===== EXPIRED STATE ===== */}
        {isExpired && (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="rounded-3xl p-5 gap-3 items-center"
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.06)', borderWidth: 1.5, borderColor: 'rgba(220, 38, 38, 0.2)' }}
          >
            <AlertCircle size={40} color="#dc2626" strokeWidth={2} />
            <Text size="lg" weight="bold" style={{ color: '#dc2626' }}>
              Request Expired
            </Text>
            <Text size="sm" className="text-center leading-relaxed" style={{ color: '#991b1b' }}>
              You did not respond within the time limit. Returning to home screen...
            </Text>
          </Animated.View>
        )}

        {/* ===== BOOKING ID ===== */}
        <View className="items-center py-2">
          <Text size="xs" className="text-muted-foreground">
            Booking ID: {MOCK_REQUEST.bookingId}
          </Text>
        </View>
      </View>
    </View>
  );
}
