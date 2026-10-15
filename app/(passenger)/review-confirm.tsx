import { ScrollView, View, Alert } from 'react-native';
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
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { bookingStore, bookingActions } from '../../lib/stores/booking-store';
import { authStore } from '../../lib/store';
import { confirmBooking } from '../../lib/api/bookings';

const PRIMARY_GREEN = '#0d5f3a';

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
  
  // ALL HOOKS AT THE TOP
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Get booking data from store
  const booking = useStore(bookingStore, (state) => state.activeBooking);
  const draftBooking = useStore(bookingStore, (state) => state.draftBooking);
  const user = useStore(authStore, (state) => state.user);

  // Service type display
  const serviceTypeMap: Record<string, { label: string; icon: string }> = {
    'MOTORCYCLE': { label: 'Motorcycle', icon: '🏍️' },
    'TRICYCLE': { label: 'Tricycle', icon: '🛺' },
    'SEDAN': { label: 'Sedan', icon: '🚗' },
  };
  
  const serviceInfo = draftBooking.serviceType 
    ? serviceTypeMap[draftBooking.serviceType] || { label: draftBooking.serviceType, icon: '🚗' }
    : { label: 'Unknown', icon: '🚗' };

  // Redirect if no booking data (after all hooks)
  useEffect(() => {
    if (!booking?.bookingId || !draftBooking.serviceType) {
      router.replace('/(passenger)/booking');
    }
  }, [booking?.bookingId, draftBooking.serviceType, router]);

  async function handleConfirm() {
    if (!user?.id || !booking.bookingId) {
      Alert.alert('Error', 'Missing user or booking information');
      return;
    }

    setIsConfirming(true);
    
    try {
      const result = await confirmBooking(booking.bookingId, user.id);
      
      if (result.success) {
        // Update store
        bookingActions.setCurrentScreen('searching');
        // Navigate to searching screen
        router.push('/(passenger)/searching');
      } else {
        Alert.alert(
          'Confirmation Failed',
          result.message || 'Unable to confirm booking. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Confirm booking error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConfirming(false);
    }
  }

  // Prevent rendering if data is missing (will redirect via useEffect)
  if (!booking?.bookingId || !draftBooking.serviceType) {
    return null;
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
                    <Text size="sm" weight="medium" className="text-foreground">{draftBooking.pickupAddress}</Text>
                  </View>
                  <View>
                    <Text size="xs" weight="bold" className="text-muted-foreground">DESTINATION</Text>
                    <Text size="sm" weight="medium" className="text-foreground">{draftBooking.destinationAddress}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-4 pt-1">
                <View className="flex-row items-center gap-1.5">
                  <Navigation size={13} color="#9ca3af" strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">~{booking.distanceKm?.toFixed(1) || '0.0'} km</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={13} color="#9ca3af" strokeWidth={2} />
                  <Text size="xs" className="text-muted-foreground">Driver in ~2–5 min</Text>
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
                  <Text style={{ fontSize: 24 }}>{serviceInfo.icon}</Text>
                </View>
                <View>
                  <Text size="base" weight="bold" className="text-foreground">
                    {serviceInfo.label}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {draftBooking.passengerCount} passenger{draftBooking.passengerCount > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <View className="items-end gap-0.5">
                <Text size="xs" className="text-muted-foreground">Est. arrival</Text>
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  2–5 min
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
                  <Text size="xs" className="text-muted-foreground">
                    Base ₱{booking.breakdown?.baseFare || 0} + ₱{booking.breakdown?.distanceCharge.toFixed(2) || '0.00'} distance
                  </Text>
                </View>
                <View className="items-end">
                  <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                    ₱{booking.fareEstimate || 0}
                  </Text>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: booking.fareType === 'FIXED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)' }}
                  >
                    <Text size="xs" weight="medium" style={{ color: booking.fareType === 'FIXED' ? '#15803d' : '#92400e' }}>
                      {booking.fareType === 'FIXED' ? 'Fixed' : 'Estimated'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="h-px bg-border/40" />

              {/* Payment method */}
              <View className="flex-row items-center gap-3">
                <Banknote size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                <Text size="sm" weight="medium" className="text-foreground">
                  {draftBooking.paymentMethod} — pay driver at trip end
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
