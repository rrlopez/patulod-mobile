import { ScrollView, View, TouchableOpacity, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Banknote,
  Clock,
  Calendar,
  User,
  Car,
  Hash,
  CheckCircle2,
  Share2,
  ChevronRight,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const SUCCESS_GREEN = '#10b981';

const MOCK_SUMMARY = {
  bookingRef: 'PTL-20261008-0042',
  status: 'COMPLETED' as const,
  paymentStatus: 'CONFIRMED' as const,
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  requestedAt: 'October 8, 2026 · 8:58 AM',
  startedAt:   'October 8, 2026 · 9:00 AM',
  completedAt: 'October 8, 2026 · 9:14 AM',
  durationMinutes: 14,
  distanceKm: 3.6,
  fareEstimate: 56,
  finalFare: 60,
  fareAdjustmentReason: 'Route was slightly longer than estimated.',
  paymentMethod: 'Cash',
  driver: {
    name: 'Pedro Bautista',
    vehicleType: 'Motorcycle',
    vehicleIcon: '🏍️',
    plateNumber: 'INC-1234',
    color: 'Red',
  },
  passengerCount: 1,
};

/**
 * Trip Summary Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 3:
 * - Full booking reference
 * - Locations, dates, driver, fare
 * - No contact button — terminal state
 */
export default function TripSummary() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  async function handleShare() {
    await Share.share({
      message:
        `PATULOD Trip Receipt\n` +
        `Ref: ${MOCK_SUMMARY.bookingRef}\n` +
        `From: ${MOCK_SUMMARY.pickup}\n` +
        `To: ${MOCK_SUMMARY.destination}\n` +
        `Fare: ₱${MOCK_SUMMARY.finalFare} (Cash)\n` +
        `Completed: ${MOCK_SUMMARY.completedAt}`,
    });
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Trip Details</Text>
        </View>
        <TouchableOpacity
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
          onPress={handleShare}
        >
          <Share2 size={18} color={PRIMARY_GREEN} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View className="px-5 gap-5">

          {/* ===== BOOKING REFERENCE ===== */}
          <View
            className="rounded-2xl p-4 gap-3"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            <View className="flex-row items-center justify-between">
              <View className="gap-0.5">
                <Text size="xs" weight="bold" style={{ color: 'rgba(255,255,255,0.6)' }} className="uppercase tracking-wider">
                  Booking Reference
                </Text>
                <Text size="xl" weight="bold" className="text-white" style={{ letterSpacing: 1.5 }}>
                  {MOCK_SUMMARY.bookingRef}
                </Text>
              </View>
              <View className="items-end gap-1.5">
                <StatusBadge label="Ride: Completed" color="#4ade80" />
                <StatusBadge label="Cash: Paid" color="#4ade80" />
              </View>
            </View>

            {/* Quick stats */}
            <View
              className="flex-row items-center justify-around rounded-xl py-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Fare</Text>
                <Text size="base" weight="bold" className="text-white">₱{MOCK_SUMMARY.finalFare}</Text>
              </View>
              <View className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Distance</Text>
                <Text size="base" weight="bold" className="text-white">{MOCK_SUMMARY.distanceKm} km</Text>
              </View>
              <View className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View className="items-center gap-0.5">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Duration</Text>
                <Text size="base" weight="bold" className="text-white">{MOCK_SUMMARY.durationMinutes} min</Text>
              </View>
            </View>
          </View>

          {/* ===== ROUTE ===== */}
          <SummarySection title="Route">
            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <View className="items-center gap-1 pt-0.5">
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: PRIMARY_GREEN }} />
                  <View className="w-px flex-1" style={{ minHeight: 24, backgroundColor: '#e5e5e3' }} />
                  <MapPin size={14} color="#ef4444" strokeWidth={2.5} />
                </View>
                <View className="flex-1 gap-4">
                  <View>
                    <Text size="xs" weight="bold" className="text-muted-foreground">PICKUP</Text>
                    <Text size="sm" weight="medium" className="text-foreground">{MOCK_SUMMARY.pickup}</Text>
                  </View>
                  <View>
                    <Text size="xs" weight="bold" className="text-muted-foreground">DESTINATION</Text>
                    <Text size="sm" weight="medium" className="text-foreground">{MOCK_SUMMARY.destination}</Text>
                  </View>
                </View>
              </View>
            </View>
          </SummarySection>

          {/* ===== DATES & TIMES ===== */}
          <SummarySection title="Timeline">
            <View className="gap-2">
              <TimeRow icon={<Calendar size={14} color="#9ca3af" strokeWidth={2} />} label="Requested"  value={MOCK_SUMMARY.requestedAt} />
              <TimeRow icon={<Clock size={14} color={PRIMARY_GREEN} strokeWidth={2} />}  label="Trip started" value={MOCK_SUMMARY.startedAt} />
              <TimeRow icon={<CheckCircle2 size={14} color={SUCCESS_GREEN} strokeWidth={2} />} label="Completed" value={MOCK_SUMMARY.completedAt} />
            </View>
          </SummarySection>

          {/* ===== DRIVER & VEHICLE ===== */}
          <SummarySection title="Driver & Vehicle">
            <View className="gap-3">
              <DetailRow
                icon={<User size={14} color="#9ca3af" strokeWidth={2} />}
                label="Driver"
                value={MOCK_SUMMARY.driver.name}
              />
              <DetailRow
                icon={<Text style={{ fontSize: 14 }}>{MOCK_SUMMARY.driver.vehicleIcon}</Text>}
                label="Vehicle"
                value={`${MOCK_SUMMARY.driver.color} ${MOCK_SUMMARY.driver.vehicleType}`}
              />
              <DetailRow
                icon={<Hash size={14} color="#9ca3af" strokeWidth={2} />}
                label="Plate"
                value={MOCK_SUMMARY.driver.plateNumber}
                valueWeight="bold"
              />
              <DetailRow
                icon={<User size={14} color="#9ca3af" strokeWidth={2} />}
                label="Passengers"
                value={`${MOCK_SUMMARY.passengerCount}`}
              />
            </View>
          </SummarySection>

          {/* ===== FARE ===== */}
          <SummarySection title="Fare & Payment">
            <View className="gap-2">
              <DetailRow
                icon={<Banknote size={14} color="#9ca3af" strokeWidth={2} />}
                label="Estimated fare"
                value={`₱${MOCK_SUMMARY.fareEstimate}`}
              />
              {MOCK_SUMMARY.finalFare !== MOCK_SUMMARY.fareEstimate && (
                <DetailRow
                  icon={<Banknote size={14} color={PRIMARY_GREEN} strokeWidth={2} />}
                  label="Final fare"
                  value={`₱${MOCK_SUMMARY.finalFare}`}
                  valueWeight="bold"
                  valueColor={PRIMARY_GREEN}
                />
              )}
              <DetailRow
                icon={<Banknote size={14} color="#9ca3af" strokeWidth={2} />}
                label="Payment method"
                value={MOCK_SUMMARY.paymentMethod}
              />
              <DetailRow
                icon={<CheckCircle2 size={14} color={SUCCESS_GREEN} strokeWidth={2} />}
                label="Payment status"
                value="Confirmed"
                valueColor={SUCCESS_GREEN}
                valueWeight="bold"
              />
              {MOCK_SUMMARY.fareAdjustmentReason && MOCK_SUMMARY.finalFare !== MOCK_SUMMARY.fareEstimate && (
                <View
                  className="rounded-xl p-3 mt-1"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.25)' }}
                >
                  <Text size="xs" style={{ color: '#92400e' }}>
                    📌 Fare adjustment: {MOCK_SUMMARY.fareAdjustmentReason}
                  </Text>
                </View>
              )}
            </View>
          </SummarySection>

          {/* ===== ACTIONS ===== */}
          <View className="gap-3 pt-2">
            <Button
              size="lg"
              variant="outline"
              className="w-full flex-row items-center justify-center gap-2"
              style={{ borderColor: PRIMARY_GREEN }}
              onPress={() => router.push('/(passenger)/history')}
            >
              <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>View Trip History</Text>
              <ChevronRight size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
            </Button>

            <Button
              size="lg"
              className="w-full"
              style={{ backgroundColor: PRIMARY_GREEN }}
              onPress={() => router.replace('/(passenger)/home')}
            >
              <Text size="base" weight="bold" className="text-white">Back to Home</Text>
            </Button>
          </View>

          {/* Note: no contact button — terminal state */}
          <Text size="xs" className="text-center text-muted-foreground px-4">
            Driver contact is not available for completed trips.
          </Text>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        {title}
      </Text>
      <View
        className="rounded-2xl p-4"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        {children}
      </View>
    </View>
  );
}

function TimeRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-2.5">
      {icon}
      <Text size="xs" className="text-muted-foreground" style={{ width: 80 }}>{label}</Text>
      <Text size="xs" weight="medium" className="text-foreground flex-1">{value}</Text>
    </View>
  );
}

function DetailRow({
  icon, label, value, valueWeight, valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueWeight?: 'medium' | 'semibold' | 'bold';
  valueColor?: string;
}) {
  return (
    <View className="flex-row items-center gap-2.5">
      {icon}
      <Text size="sm" className="text-muted-foreground" style={{ width: 110 }}>{label}</Text>
      <Text
        size="sm"
        weight={valueWeight ?? 'medium'}
        style={{ color: valueColor ?? '#1a1a1a', flex: 1 }}
      >
        {value}
      </Text>
    </View>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
    >
      <CheckCircle2 size={11} color={color} strokeWidth={2.5} />
      <Text size="xs" weight="bold" style={{ color }}>{label}</Text>
    </View>
  );
}
