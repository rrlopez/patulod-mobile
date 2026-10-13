import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Banknote,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Mock booking summary — in Phase 2 this comes from TanStack Store
 * accumulated across the booking flow screens.
 */
const MOCK_SUMMARY = {
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  serviceType: 'Motorcycle',
  serviceIcon: '🏍️',
  passengerCount: 1,
  distanceKm: 3.2,
  fareEstimate: 56,
  fareType: 'ESTIMATED' as const,
  paymentMethod: 'Cash',
  baseFare: 30,
  perKmRate: 8,
  etaMinutes: '2–5',
};

/**
 * Review & Confirm Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - Full booking summary before confirm
 * - Shows: pickup, destination, service, capacity, fare, payment method
 * - Confirm Booking button
 */
export default function ReviewConfirm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  function handleConfirm() {
    setIsConfirming(true);
    // Mock: simulate booking submission delay then navigate to searching screen
    setTimeout(() => {
      setIsConfirming(false);
      router.push('/(passenger)/searching');
    }, 1500);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <View className="flex-1">
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Review Booking
          </Text>
          <Text size="xs" className="text-muted-foreground">Step 4 of 4</Text>
        </View>
      </View>

      {/* ===== PROGRESS BAR ===== */}
      <View className="px-5 pb-4">
        <View className="flex-row gap-1.5">
          {[1, 2, 3, 4].map(step => (
            <View
              key={step}
              className="flex-1 rounded-full"
              style={{ height: 3, backgroundColor: PRIMARY_GREEN }}
            />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 gap-5">

          {/* ===== ROUTE CARD ===== */}
          <SectionCard title="Route">
            <View className="gap-3">
              <View className="flex-row items-start gap-3">
                <View className="items-center gap-1 pt-0.5">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  />
                  <View className="w-px" style={{ height: 24, backgroundColor: '#e5e5e3' }} />
                  <MapPin size={14} color="#ef4444" strokeWidth={2.5} />
                </View>
                <View className="flex-1 gap-3">
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

              <View className="flex-row items-center gap-4 pt-1">
                <View className="flex-row items-center gap-1.5">
                  <Navigation size={13} color="#9ca3af" strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">~{MOCK_SUMMARY.distanceKm} km</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={13} color="#9ca3af" strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">Driver in ~{MOCK_SUMMARY.etaMinutes} min</Text>
                </View>
              </View>
            </View>
          </SectionCard>

          {/* ===== SERVICE CARD ===== */}
          <SectionCard title="Service">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className="h-12 w-12 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
                >
                  <Text style={{ fontSize: 24 }}>{MOCK_SUMMARY.serviceIcon}</Text>
                </View>
                <View>
                  <Text size="base" weight="bold" className="text-foreground">
                    {MOCK_SUMMARY.serviceType}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {MOCK_SUMMARY.passengerCount} passenger{MOCK_SUMMARY.passengerCount > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <View className="items-end gap-0.5">
                <Text size="xs" className="text-muted-foreground">Est. arrival</Text>
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_SUMMARY.etaMinutes} min
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* ===== FARE CARD ===== */}
          <SectionCard title="Fare & Payment">
            <View className="gap-3">
              {/* Fare amount */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text size="sm" weight="medium" className="text-muted-foreground">Estimated total</Text>
                  <Text size="xs" className="text-muted-foreground">Base ₱{MOCK_SUMMARY.baseFare} + ₱{MOCK_SUMMARY.perKmRate}/km × {MOCK_SUMMARY.distanceKm} km</Text>
                </View>
                <View className="items-end">
                  <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                    ₱{MOCK_SUMMARY.fareEstimate}
                  </Text>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
                  >
                    <Text size="xs" weight="medium" style={{ color: '#92400e' }}>Estimated</Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border/40" />

              {/* Payment method */}
              <View className="flex-row items-center gap-3">
                <Banknote size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                <Text size="sm" weight="medium" className="text-foreground">
                  Cash — pay driver at trip end
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* ===== IMPORTANT REMINDERS ===== */}
          <View className="gap-2">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Before You Confirm
            </Text>
            <View className="gap-2">
              <ReminderItem text="Verify the driver's name, vehicle type, and plate number before boarding." />
              <ReminderItem text="Do not board a vehicle that does not match the details shown after booking." />
              <ReminderItem text="Pay only after the trip is completed. Do not pay in advance." />
              <ReminderItem text="In an emergency, contact 911 directly. PATULOD has no in-app SOS." />
            </View>
          </View>

          {/* ===== CANCELLATION NOTICE ===== */}
          <View
            className="rounded-2xl p-4 gap-1.5"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.07)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
          >
            <Text size="xs" weight="bold" style={{ color: '#92400e' }}>⚠️ Cancellation</Text>
            <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
              You may cancel while searching for a driver at no charge. Cancellation after a driver has been assigned may be subject to a fee. Rules are shown at time of cancellation.
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* ===== CONFIRM BUTTON — pinned bottom ===== */}
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
          style={{
            backgroundColor: PRIMARY_GREEN,
            opacity: isConfirming ? 0.75 : 1,
          }}
          onPress={handleConfirm}
          disabled={isConfirming}
        >
          <Text size="base" weight="bold" className="text-white">
            {isConfirming ? 'Confirming Booking…' : 'Confirm Booking'}
          </Text>
        </Button>
        <Text size="xs" className="text-center text-muted-foreground pt-2">
          By confirming, you agree to the fare estimate and cancellation policy above
        </Text>
      </View>

    </View>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
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

function ReminderItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-start gap-2.5">
      <CheckCircle2 size={15} color={PRIMARY_GREEN} strokeWidth={2.5} style={{ marginTop: 1, flexShrink: 0 }} />
      <Text size="xs" className="text-foreground leading-relaxed flex-1">{text}</Text>
    </View>
  );
}
