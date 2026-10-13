import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Banknote,
  Info,
  ChevronRight,
  Bike,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Mock booking data — in Phase 2 this comes from
 * the booking form + service select screens via TanStack Store.
 */
const MOCK_BOOKING = {
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  serviceType: 'Motorcycle',
  serviceIcon: '🏍️',
  passengerCount: 1,
  distanceKm: 3.2,
  baseFare: 30,
  perKmRate: 8,
  fareType: 'ESTIMATED' as const, // ESTIMATED | FIXED
  paymentMethod: 'CASH' as const,
};

/**
 * Fare Estimate Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - Show peso amount (estimated or fixed)
 * - Show fare basis (base fare + per-km breakdown)
 * - Disclose any additional charges
 * - Cash only for prototype
 * - Confirm before booking
 */
export default function FareEstimate() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const distanceFare = MOCK_BOOKING.perKmRate * MOCK_BOOKING.distanceKm;
  const totalFare = MOCK_BOOKING.baseFare + distanceFare;
  const roundedFare = Math.ceil(totalFare / 5) * 5; // round up to nearest ₱5

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

          {/* ===== FARE HERO ===== */}
          <View
            className="rounded-3xl items-center py-8 px-6 gap-2"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            <Text size="sm" weight="medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Estimated Fare
            </Text>
            <View className="flex-row items-start gap-1">
              <Text size="lg" weight="bold" className="text-white" style={{ marginTop: 6 }}>₱</Text>
              <Text weight="bold" className="text-white" style={{ fontSize: 64, lineHeight: 72 }}>
                {roundedFare}
              </Text>
            </View>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.25)' }}
            >
              <Text size="xs" weight="semibold" style={{ color: '#fbbf24' }}>
                {MOCK_BOOKING.fareType === 'ESTIMATED' ? 'Estimated — may vary' : 'Fixed fare'}
              </Text>
            </View>
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
                value={`₱${MOCK_BOOKING.baseFare}.00`}
                hint="Starting charge for any ride"
              />
              <View className="h-px bg-border/40 mx-4" />
              <BreakdownRow
                label={`Distance (${MOCK_BOOKING.distanceKm} km × ₱${MOCK_BOOKING.perKmRate}/km)`}
                value={`₱${distanceFare.toFixed(2)}`}
                hint="Based on estimated route distance"
              />
              <View className="h-px bg-border/40 mx-4" />
              <BreakdownRow
                label="Subtotal"
                value={`₱${totalFare.toFixed(2)}`}
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
                    <Text size="xs" weight="bold" className="text-muted-foreground">PICKUP</Text>
                    <Text size="sm" className="text-foreground">{MOCK_BOOKING.pickup}</Text>
                  </View>
                </View>
                <View className="ml-1.5 h-5 w-px" style={{ backgroundColor: '#e5e5e3' }} />
                <View className="flex-row items-start gap-3">
                  <MapPin size={12} color="#ef4444" strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
                  <View className="flex-1">
                    <Text size="xs" weight="bold" className="text-muted-foreground">DESTINATION</Text>
                    <Text size="sm" className="text-foreground">{MOCK_BOOKING.destination}</Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border/40" />

              {/* Service + pax */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text style={{ fontSize: 18 }}>{MOCK_BOOKING.serviceIcon}</Text>
                  <Text size="sm" weight="medium" className="text-foreground">{MOCK_BOOKING.serviceType}</Text>
                </View>
                <Text size="sm" className="text-muted-foreground">
                  {MOCK_BOOKING.passengerCount} passenger{MOCK_BOOKING.passengerCount > 1 ? 's' : ''}
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
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.push('/(passenger)/review-confirm')}
        >
          <Text size="base" weight="bold" className="text-white">
            Review & Confirm
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
