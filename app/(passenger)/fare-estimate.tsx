import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import { useStore } from '@tanstack/react-store';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Banknote,
  Info,
  ChevronRight,
  Bike,
  AlertCircle,
} from 'lucide-react-native';
import { bookingStore, bookingActions } from '../../lib/stores/booking-store';
import { authStore } from '../../lib/store';
import { createBooking } from '../../lib/api/bookings';
import { generateIdempotencyKey } from '../../lib/utils/idempotency';

const PRIMARY_GREEN = '#0d5f3a';

const SERVICE_TYPE_MAP: Record<string, { label: string; icon: string }> = {
  MOTORCYCLE: { label: 'Motorcycle', icon: '🏍️' },
  TRICYCLE: { label: 'Tricycle', icon: '🛺' },
  VAN: { label: 'Van / FX', icon: '🚐' },
};

/**
 * Fare Estimate Screen
 * Phase 2 — Real API Integration
 *
 * Per master-plan.md Phase 2:
 * - Call createBooking API with draft data
 * - Display fare breakdown from server
 * - Handle geofencing errors
 * - Show loading state
 * - Cash only for prototype
 */
export default function FareEstimate() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const draftBooking = useStore(bookingStore, (state) => state.draftBooking);
  const user = useStore(authStore, (state) => state.user);
  const isCreating = useStore(bookingStore, (state) => state.isCreatingBooking);
  const error = useStore(bookingStore, (state) => state.error);

  const [fareData, setFareData] = useState<{
    bookingId: string;
    reference: string;
    fareEstimate: number;
    fareType: 'ESTIMATED' | 'FIXED';
    distanceKm: number;
    breakdown: {
      baseFare: number;
      distanceCharge: number;
      total: number;
    };
  } | null>(null);

  useEffect(() => {
    // Create booking on mount
    handleCreateBooking();
  }, []);

  async function handleCreateBooking() {
    if (!user?.id) {
      bookingActions.setError('User not authenticated');
      return;
    }

    // Validate draft booking has required data
    if (
      !draftBooking.pickupLat ||
      !draftBooking.pickupLng ||
      !draftBooking.destinationLat ||
      !draftBooking.destinationLng
    ) {
      bookingActions.setError('Missing location data. Please go back and enter locations again.');
      return;
    }

    bookingActions.setCreatingBooking(true);
    bookingActions.clearError();

    try {
      const result = await createBooking({
        userId: user.id,
        pickupAddress: draftBooking.pickupAddress,
        destinationAddress: draftBooking.destinationAddress,
        pickupLat: draftBooking.pickupLat,
        pickupLng: draftBooking.pickupLng,
        destinationLat: draftBooking.destinationLat,
        destinationLng: draftBooking.destinationLng,
        serviceType: draftBooking.serviceType,
        passengerCount: draftBooking.passengerCount,
        paymentMethod: draftBooking.paymentMethod,
        idempotencyKey: generateIdempotencyKey(user.id),
      });

      if (result.success && result.data) {
        setFareData(result.data);
        // Save to activeBooking in store for review screen
        bookingActions.setActiveBooking({
          bookingId: result.data.bookingId,
          reference: result.data.reference,
          fareEstimate: result.data.fareEstimate,
          fareType: result.data.fareType,
          distanceKm: result.data.distanceKm,
          breakdown: result.data.breakdown,
        });
      } else {
        const errorMsg = result.errors
          ? Object.values(result.errors).join(', ')
          : result.message || 'Failed to calculate fare';
        bookingActions.setError(errorMsg);
      }
    } catch (err) {
      console.error('Create booking error:', err);
      bookingActions.setError('Network error. Please check your connection and try again.');
    } finally {
      bookingActions.setCreatingBooking(false);
    }
  }

  function handleContinue() {
    if (!fareData) return;
    
    // Store booking ID for confirmation
    bookingActions.updateDraftBooking({
      // Store the booking ID in draft so we can confirm it later
      ...draftBooking,
    });

    bookingActions.setCurrentScreen('review-confirm');
    router.push('/(passenger)/review-confirm');
  }

  const serviceInfo = SERVICE_TYPE_MAP[draftBooking.serviceType] || {
    label: draftBooking.serviceType,
    icon: '🚗',
  };

  const roundedFare = fareData ? Math.ceil(fareData.fareEstimate / 5) * 5 : 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <View className="flex-1">
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Fare & Payment
          </Text>
          <Text size="xs" className="text-muted-foreground">Step 3 of 4</Text>
        </View>
      </View>

      {/* ===== PROGRESS BAR ===== */}
      <View className="px-5 pb-4">
        <View className="flex-row gap-1.5">
          {[1, 2, 3, 4].map(step => (
            <View
              key={step}
              className="flex-1 rounded-full"
              style={{ height: 3, backgroundColor: step <= 3 ? PRIMARY_GREEN : '#e5e5e3' }}
            />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 gap-5">

          {/* ===== LOADING STATE ===== */}
          {isCreating && !fareData && !error && (
            <View className="items-center py-12 gap-4">
              <ActivityIndicator size="large" color={PRIMARY_GREEN} />
              <Text size="sm" className="text-muted-foreground text-center">
                Calculating fare...
              </Text>
            </View>
          )}

          {/* ===== ERROR STATE ===== */}
          {error && (
            <View
              className="rounded-2xl p-4 gap-3"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderWidth: 1.5,
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}
            >
              <View className="flex-row items-start gap-3">
                <AlertCircle size={20} color="#dc2626" strokeWidth={2} />
                <View className="flex-1">
                  <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>
                    Error Calculating Fare
                  </Text>
                  <Text size="sm" style={{ color: '#dc2626', marginTop: 4 }}>
                    {error}
                  </Text>
                </View>
              </View>
              <Button
                size="sm"
                variant="outline"
                style={{ borderColor: '#dc2626' }}
                onPress={handleCreateBooking}
              >
                <Text size="sm" weight="semibold" style={{ color: '#dc2626' }}>
                  Try Again
                </Text>
              </Button>
            </View>
          )}

          {/* ===== FARE DATA (only show when loaded) ===== */}
          {fareData && (
            <>
              {/* ===== FARE HERO ===== */}
              <View
                className="rounded-3xl items-center py-8 px-6 gap-2"
                style={{ backgroundColor: PRIMARY_GREEN }}
              >
                <Text size="sm" weight="medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Estimated Fare
                </Text>
                <View className="flex-row items-start gap-1">
                  <Text size="lg" weight="bold" className="text-white" style={{ marginTop: 6 }}>
                    ₱
                  </Text>
                  <Text
                    weight="bold"
                    className="text-white"
                    style={{ fontSize: 64, lineHeight: 72 }}
                  >
                    {roundedFare}
                  </Text>
                </View>
                <View
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.25)' }}
                >
                  <Text size="xs" weight="semibold" style={{ color: '#fbbf24' }}>
                    {fareData.fareType === 'ESTIMATED'
                      ? 'Estimated — may vary'
                      : 'Fixed fare'}
                  </Text>
                </View>
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                  Booking #{fareData.reference}
                </Text>
              </View>

          {/* ===== FARE BREAKDOWN ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Fare Breakdown
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <BreakdownRow
                label="Base fare"
                value={`₱${fareData.breakdown.baseFare.toFixed(2)}`}
                hint="Starting charge for any ride"
              />
              <View className="h-px bg-border/40 mx-4" />
              <BreakdownRow
                label={`Distance (${fareData.distanceKm} km)`}
                value={`₱${fareData.breakdown.distanceCharge.toFixed(2)}`}
                hint="Based on estimated route distance"
              />
              <View className="h-px bg-border/40 mx-4" />
              <BreakdownRow
                label="Subtotal"
                value={`₱${fareData.breakdown.total.toFixed(2)}`}
              />
              <View className="h-px bg-border/40 mx-4" />
              <BreakdownRow
                label="Rounded total"
                value={`₱${roundedFare}.00`}
                hint="Rounded up to nearest ₱5 for ease of payment"
                highlight
              />
            </View>

            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <Text size="xs" weight="medium" style={{ color: '#92400e' }}>
                📌 This is an estimate based on the expected route distance. The final fare will be confirmed at trip completion. Any difference will be disclosed to you.
              </Text>
            </View>
          </View>

          {/* ===== TRIP SUMMARY ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Trip Summary
            </Text>
            <View
              className="rounded-2xl p-4 gap-3"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              {/* Route */}
              <View className="gap-2.5">
                <View className="flex-row items-start gap-3">
                  <View
                    className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  />
                  <View className="flex-1">
                    <Text size="xs" weight="bold" className="text-muted-foreground">
                      PICKUP
                    </Text>
                    <Text size="sm" className="text-foreground">
                      {draftBooking.pickupAddress}
                    </Text>
                  </View>
                </View>
                <View className="ml-1.5 h-5 w-px" style={{ backgroundColor: '#e5e5e3' }} />
                <View className="flex-row items-start gap-3">
                  <MapPin
                    size={12}
                    color="#ef4444"
                    strokeWidth={2.5}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <View className="flex-1">
                    <Text size="xs" weight="bold" className="text-muted-foreground">
                      DESTINATION
                    </Text>
                    <Text size="sm" className="text-foreground">
                      {draftBooking.destinationAddress}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border/40" />

              {/* Service + pax */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text style={{ fontSize: 18 }}>{serviceInfo.icon}</Text>
                  <Text size="sm" weight="medium" className="text-foreground">
                    {serviceInfo.label}
                  </Text>
                </View>
                <Text size="sm" className="text-muted-foreground">
                  {draftBooking.passengerCount} passenger
                  {draftBooking.passengerCount > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== PAYMENT METHOD ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Payment Method
            </Text>
            <View
              className="flex-row items-center gap-4 rounded-2xl p-4"
              style={{ borderWidth: 1.5, borderColor: PRIMARY_GREEN, backgroundColor: 'rgba(13, 95, 58, 0.04)' }}
            >
              <View
                className="h-12 w-12 rounded-2xl items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <Banknote size={24} color={PRIMARY_GREEN} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text size="base" weight="bold" style={{ color: PRIMARY_GREEN }}>Cash</Text>
                <Text size="xs" className="text-muted-foreground">Pay the driver directly at trip end</Text>
              </View>
              <View
                className="rounded-full px-2.5 py-1"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Only option</Text>
              </View>
            </View>
            <Text size="xs" className="text-muted-foreground px-1">
              During this prototype phase, cash is the only accepted payment method. Do not pay before the trip is completed.
            </Text>
          </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* ===== CONTINUE — pinned bottom ===== */}
      <View
        className="px-5 pt-3"
        style={{
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e3',
          backgroundColor: '#fefdfb',
        }}
      >
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: fareData ? PRIMARY_GREEN : '#9ca3af' }}
          onPress={handleContinue}
          disabled={!fareData || isCreating}
        >
          <Text size="base" weight="bold" className="text-white">
            {isCreating ? 'Loading...' : 'Review & Confirm'}
          </Text>
        </Button>
        <Text size="xs" className="text-center text-muted-foreground pt-2">
          You will review the full booking before it is confirmed
        </Text>
      </View>

    </View>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function BreakdownRow({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <View
      className="flex-row items-start justify-between gap-4 px-4 py-3"
      style={highlight ? { backgroundColor: 'rgba(13, 95, 58, 0.04)' } : undefined}
    >
      <View className="flex-1 gap-0.5">
        <Text
          size="sm"
          weight={highlight ? 'bold' : 'medium'}
          style={{ color: highlight ? PRIMARY_GREEN : '#1a1a1a' }}
        >
          {label}
        </Text>
        {hint && (
          <Text size="xs" className="text-muted-foreground">{hint}</Text>
        )}
      </View>
      <Text
        size="sm"
        weight={highlight ? 'bold' : 'medium'}
        style={{ color: highlight ? PRIMARY_GREEN : '#1a1a1a' }}
      >
        {value}
      </Text>
    </View>
  );
}
