import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  CheckCircle2,
  MapPin,
  Navigation,
  Banknote,
  Clock,
  ChevronRight,
  Star,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

const PRIMARY_GREEN = '#0d5f3a';
const SUCCESS_GREEN = '#10b981';

const MOCK_TRIP = {
  bookingRef: 'PTL-20261008-0042',
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  fareEstimate: 56,
  finalFare: 60,            // final may differ from estimate
  fareAdjustmentReason: 'Route was slightly longer than estimated.',
  distanceKm: 3.6,          // actual vs estimated 3.2
  durationMinutes: 14,
  paymentStatus: 'PENDING' as 'PENDING' | 'CONFIRMED',
  driver: {
    name: 'Pedro Bautista',
    vehicleType: 'Motorcycle',
    vehicleIcon: '🏍️',
    plateNumber: 'INC-1234',
  },
  completedAt: 'October 8, 2026 · 9:14 AM',
};

/**
 * Trip Completion Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 3:
 * - Final fare shown
 * - Difference from estimate disclosed with reason
 * - Trip summary
 * - Payment status SEPARATE from ride status
 * - Contact button REMOVED — trip is in terminal state
 */
export default function TripComplete() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'CONFIRMED'>(
    MOCK_TRIP.paymentStatus
  );
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const fareChanged = MOCK_TRIP.finalFare !== MOCK_TRIP.fareEstimate;
  const fareDiff = MOCK_TRIP.finalFare - MOCK_TRIP.fareEstimate;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 gap-6">

        {/* ===== COMPLETION HEADER ===== */}
        <Animated.View entering={FadeIn.duration(500)} className="items-center gap-4 pt-4">
          <View
            className="h-24 w-24 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
          >
            <CheckCircle2 size={48} color={SUCCESS_GREEN} strokeWidth={2} />
          </View>
          <View className="items-center gap-1.5">
            <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Trip Completed
            </Text>
            <Text size="xs" className="text-muted-foreground">{MOCK_TRIP.completedAt}</Text>
          </View>
        </Animated.View>

        {/* ===== FINAL FARE ===== */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View
            className="rounded-3xl p-6 gap-4"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            {/* Ride status — SEPARATE from payment */}
            <View className="flex-row items-center justify-between">
              <View
                className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <CheckCircle2 size={13} color="#4ade80" strokeWidth={2.5} />
                <Text size="xs" weight="bold" style={{ color: '#4ade80' }}>Ride: Completed</Text>
              </View>
              {/* Payment status — separate badge */}
              <TouchableOpacity
                className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  backgroundColor: paymentStatus === 'CONFIRMED'
                    ? 'rgba(74, 222, 128, 0.2)'
                    : 'rgba(251, 191, 36, 0.25)',
                }}
                onPress={() => paymentStatus === 'PENDING' && setPaymentStatus('CONFIRMED')}
              >
                <Banknote
                  size={13}
                  color={paymentStatus === 'CONFIRMED' ? '#4ade80' : '#fbbf24'}
                  strokeWidth={2.5}
                />
                <Text
                  size="xs"
                  weight="bold"
                  style={{ color: paymentStatus === 'CONFIRMED' ? '#4ade80' : '#fbbf24' }}
                >
                  Cash: {paymentStatus === 'CONFIRMED' ? 'Paid ✓' : 'Pending — tap to confirm'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Final fare amount */}
            <View className="items-center gap-1">
              <Text size="xs" weight="medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Final Fare
              </Text>
              <View className="flex-row items-start gap-1">
                <Text size="lg" weight="bold" className="text-white" style={{ marginTop: 6 }}>₱</Text>
                <Text weight="bold" className="text-white" style={{ fontSize: 56, lineHeight: 64 }}>
                  {MOCK_TRIP.finalFare}
                </Text>
              </View>

              {/* Fare difference disclosure — required by spec */}
              {fareChanged && (
                <View
                  className="rounded-2xl px-4 py-2 mt-1 gap-1"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}
                >
                  <Text size="xs" weight="bold" style={{ color: '#fbbf24' }} className="text-center">
                    +₱{fareDiff} from ₱{MOCK_TRIP.fareEstimate} estimate
                  </Text>
                  <Text size="xs" style={{ color: 'rgba(255,255,255,0.75)' }} className="text-center">
                    {MOCK_TRIP.fareAdjustmentReason}
                  </Text>
                </View>
              )}
            </View>

            {/* Trip stats row */}
            <View
              className="flex-row items-center justify-around rounded-2xl py-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Distance</Text>
                <Text size="sm" weight="bold" className="text-white">{MOCK_TRIP.distanceKm} km</Text>
              </View>
              <View className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Duration</Text>
                <Text size="sm" weight="bold" className="text-white">{MOCK_TRIP.durationMinutes} min</Text>
              </View>
              <View className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Payment</Text>
                <Text size="sm" weight="bold" className="text-white">Cash</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ===== PAYMENT REMINDER ===== */}
        {paymentStatus === 'PENDING' && (
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <View
              className="rounded-2xl p-4 gap-2 flex-row items-start"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <Banknote size={18} color="#92400e" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
              <View className="flex-1 gap-1">
                <Text size="sm" weight="bold" style={{ color: '#92400e' }}>Pay Your Driver</Text>
                <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
                  Please hand <Text size="xs" weight="bold" style={{ color: '#92400e' }}>₱{MOCK_TRIP.finalFare}</Text> cash to{' '}
                  {MOCK_TRIP.driver.name}. Tap the "Cash: Pending" badge above once paid.
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* ===== ROUTE SUMMARY ===== */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Trip Summary
            </Text>
            <View
              className="rounded-2xl p-4 gap-3"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <View className="flex-row items-start gap-3">
                <View className="items-center gap-1 pt-0.5">
                  <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PRIMARY_GREEN }} />
                  <View className="w-px" style={{ height: 20, backgroundColor: '#e5e5e3' }} />
                  <MapPin size={13} color="#ef4444" strokeWidth={2.5} />
                </View>
                <View className="flex-1 gap-3">
                  <View>
                    <Text size="xs" weight="bold" className="text-muted-foreground">PICKUP</Text>
                    <Text size="sm" className="text-foreground">{MOCK_TRIP.pickup}</Text>
                  </View>
                  <View>
                    <Text size="xs" weight="bold" className="text-muted-foreground">DESTINATION</Text>
                    <Text size="sm" className="text-foreground">{MOCK_TRIP.destination}</Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border/40" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text style={{ fontSize: 18 }}>{MOCK_TRIP.driver.vehicleIcon}</Text>
                  <Text size="sm" weight="medium" className="text-foreground">
                    {MOCK_TRIP.driver.name}
                  </Text>
                </View>
                <Text size="xs" className="text-muted-foreground">{MOCK_TRIP.driver.plateNumber}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text size="xs" className="text-muted-foreground">Booking ref</Text>
                <Text size="xs" weight="semibold" className="text-foreground">{MOCK_TRIP.bookingRef}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ===== RATING ===== */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <View
            className="rounded-2xl p-4 gap-3"
            style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
          >
            {!ratingSubmitted ? (
              <>
                <Text size="sm" weight="semibold" className="text-foreground text-center">
                  How was your ride with {MOCK_TRIP.driver.name}?
                </Text>
                <View className="flex-row items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={8}>
                      <Star
                        size={32}
                        color="#f59e0b"
                        strokeWidth={1.5}
                        fill={star <= rating ? '#f59e0b' : 'transparent'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {rating > 0 && (
                  <Button
                    size="md"
                    className="w-full"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                    onPress={() => setRatingSubmitted(true)}
                  >
                    <Text size="sm" weight="bold" className="text-white">Submit Rating</Text>
                  </Button>
                )}
              </>
            ) : (
              <View className="items-center gap-2 py-1">
                <CheckCircle2 size={24} color={SUCCESS_GREEN} strokeWidth={2} />
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  Thanks for your feedback!
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* ===== ACTIONS ===== */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} className="gap-3">
          <Button
            size="lg"
            className="w-full"
            style={{ backgroundColor: PRIMARY_GREEN }}
            onPress={() => router.push('/(passenger)/trip-summary')}
          >
            <Text size="base" weight="bold" className="text-white">View Full Trip Details</Text>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            style={{ borderColor: PRIMARY_GREEN }}
            onPress={() => router.replace('/(passenger)/home')}
          >
            <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>Back to Home</Text>
          </Button>
        </Animated.View>

        {/* No phone button — contact removed on completion per spec */}
        <Text size="xs" className="text-center text-muted-foreground px-4">
          The driver contact button is no longer available after a trip ends.
        </Text>

        <View style={{ height: 8 }} />
      </View>
    </ScrollView>
  );
}
