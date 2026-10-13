import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from 'panelui-native';
import {
  CheckCircle2,
  Banknote,
  Star,
  TrendingUp,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const MOCK_TRIP_SUMMARY = {
  fare: 70,
  distance: '3.5 km',
  duration: '12 min',
  earnings: 63, // After commission
  rating: 5,
};

/**
 * Driver Trip Complete Success Screen
 * Phase 0.5 — Mock UI
 *
 * Shows success animation and trip summary after payment confirmed.
 * Auto-redirects to driver home after 4 seconds.
 */
export default function TripCompleteSuccess() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Success animation
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  useEffect(() => {
    // Animate circle
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    
    // Animate checkmark after circle
    setTimeout(() => {
      checkScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 150 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }, 300);

    // Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      router.replace('/(driver)/home');
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      className="flex-1 bg-background items-center justify-center px-5"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* ===== SUCCESS ANIMATION ===== */}
      <Animated.View style={circleStyle}>
        <View
          className="h-32 w-32 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
        >
          <Animated.View style={checkStyle}>
            <CheckCircle2 size={80} color={PRIMARY_GREEN} strokeWidth={2} />
          </Animated.View>
        </View>
      </Animated.View>

      {/* ===== SUCCESS MESSAGE ===== */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        className="items-center gap-2 mt-6"
      >
        <Text size="2xl" weight="bold" className="text-foreground text-center">
          Trip Completed!
        </Text>
        <Text size="sm" className="text-muted-foreground text-center">
          Payment received successfully
        </Text>
      </Animated.View>

      {/* ===== TRIP SUMMARY CARDS ===== */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(400)}
        className="w-full gap-4 mt-8"
      >
        {/* Earnings Card */}
        <View
          className="rounded-3xl p-6 items-center gap-2"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          <View className="flex-row items-center gap-2">
            <Banknote size={18} color={ACCENT_YELLOW} strokeWidth={2.5} />
            <Text size="sm" weight="semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Your Earnings
            </Text>
          </View>
          <Text size="4xl" weight="bold" className="text-white">
            ₱{MOCK_TRIP_SUMMARY.earnings}
          </Text>
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Fare: ₱{MOCK_TRIP_SUMMARY.fare} • Commission: ₱{MOCK_TRIP_SUMMARY.fare - MOCK_TRIP_SUMMARY.earnings}
          </Text>
        </View>

        {/* Trip Stats */}
        <View
          className="rounded-2xl p-5 gap-4"
          style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
        >
          <View className="flex-row items-center justify-around">
            <View className="items-center gap-1">
              <Text size="xs" className="text-muted-foreground">Distance</Text>
              <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_SUMMARY.distance}
              </Text>
            </View>
            <View className="h-10 w-px bg-border" />
            <View className="items-center gap-1">
              <Text size="xs" className="text-muted-foreground">Duration</Text>
              <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_SUMMARY.duration}
              </Text>
            </View>
            <View className="h-10 w-px bg-border" />
            <View className="items-center gap-1">
              <Text size="xs" className="text-muted-foreground">Rating</Text>
              <View className="flex-row items-center gap-1">
                <Star size={16} color={ACCENT_YELLOW} strokeWidth={2} fill={ACCENT_YELLOW} />
                <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_TRIP_SUMMARY.rating}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ===== REDIRECT MESSAGE ===== */}
      <Animated.View
        entering={FadeIn.delay(1200).duration(400)}
        className="mt-8"
      >
        <View
          className="rounded-2xl px-5 py-3"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
        >
          <Text size="xs" className="text-center" style={{ color: PRIMARY_GREEN }}>
            Returning to home screen...
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
