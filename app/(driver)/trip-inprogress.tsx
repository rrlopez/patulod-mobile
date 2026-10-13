import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  MapPin,
  Navigation,
  User,
  Clock,
  Banknote,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Smartphone,
  AlertCircle,
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const MOCK_TRIP = {
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
  actualDistance: '3.5 km',
  estimatedFare: 65,
  actualFare: 70,
  duration: '12 min',
  serviceType: 'TRICYCLE',
  startTime: '10:15 AM',
  endTime: '10:27 AM',
};

type PaymentMethod = 'CASH' | 'GCASH' | 'MAYA' | null;

/**
 * Driver Trip Complete / Payment Collection Screen
 * Phase 0.5 — Mock UI
 *
 * Trip has ended at destination. Driver collects payment from passenger.
 * Shows trip summary, fare breakdown, payment method selection.
 * "Confirm Payment" button → earnings/home screen
 */
export default function DriverTripComplete() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  function handleConfirmPayment() {
    if (!selectedPayment) return;
    setIsConfirming(true);
    setTimeout(() => {
      router.push('/(driver)/trip-complete-success');
    }, 1500);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ===== STATUS HEADER ===== */}
      <View
        className="items-center py-4 px-5"
        style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
      >
        <View className="flex-row items-center gap-2">
          <CheckCircle2 size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
          <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Trip Completed
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5 pt-4">

          {/* ===== COMPLETION BADGE ===== */}
          <View className="items-center py-4">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
            >
              <CheckCircle2 size={44} color={PRIMARY_GREEN} strokeWidth={2} />
            </View>
            <Text size="xl" weight="bold" className="text-foreground mt-3">
              Trip Completed Successfully
            </Text>
            <Text size="sm" className="text-muted-foreground text-center mt-1">
              Collect payment from the passenger
            </Text>
          </View>

          {/* ===== PASSENGER INFO ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Passenger
            </Text>
            <View className="flex-row items-center gap-3">
              <View
                className="h-14 w-14 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <User size={24} color={PRIMARY_GREEN} strokeWidth={2} />
              </View>
              <View className="flex-1 gap-1">
                <Text size="lg" weight="bold" className="text-foreground">
                  {MOCK_TRIP.passengerName}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="flex-row items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={{ fontSize: 11 }}>
                        {i < Math.floor(MOCK_TRIP.passengerRating) ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    {MOCK_TRIP.passengerRating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== TRIP SUMMARY ===== */}
          <View
            className="rounded-3xl p-5 gap-4"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Trip Summary
            </Text>

            {/* Pickup */}
            <View className="flex-row items-start gap-3">
              <View
                className="h-9 w-9 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
              >
                <MapPin size={16} color="#0369a1" strokeWidth={2.5} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="xs" className="text-muted-foreground">Pickup</Text>
                <Text size="sm" weight="semibold" className="text-foreground">
                  {MOCK_TRIP.pickup.name}
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground">{MOCK_TRIP.startTime}</Text>
            </View>

            {/* Separator */}
            <View className="flex-row items-center gap-2 px-2">
              <View className="h-px flex-1 bg-border" />
              <Navigation size={12} color="#9ca3af" strokeWidth={2} />
              <View className="h-px flex-1 bg-border" />
            </View>

            {/* Destination */}
            <View className="flex-row items-start gap-3">
              <View
                className="h-9 w-9 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <MapPin size={16} color={PRIMARY_GREEN} strokeWidth={2.5} fill={PRIMARY_GREEN} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="xs" className="text-muted-foreground">Destination</Text>
                <Text size="sm" weight="semibold" className="text-foreground">
                  {MOCK_TRIP.destination.name}
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground">{MOCK_TRIP.endTime}</Text>
            </View>
          </View>

          {/* ===== TRIP STATS ===== */}
          <View
            className="rounded-3xl p-4"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1.5, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <View className="flex-row items-center justify-around">
              <View className="items-center gap-1">
                <Navigation size={18} color={PRIMARY_GREEN} strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">Distance</Text>
                <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_TRIP.actualDistance}
                </Text>
              </View>
              <View className="h-12 w-px bg-border" />
              <View className="items-center gap-1">
                <Clock size={18} color={PRIMARY_GREEN} strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">Duration</Text>
                <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {MOCK_TRIP.duration}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== FARE BREAKDOWN ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.12)', borderWidth: 1.5, borderColor: 'rgba(251, 191, 36, 0.3)' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Fare Breakdown
            </Text>
            
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text size="sm" className="text-foreground">Base Fare</Text>
                <Text size="sm" weight="medium" className="text-foreground">₱40</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text size="sm" className="text-foreground">Distance (3.5 km × ₱8/km)</Text>
                <Text size="sm" weight="medium" className="text-foreground">₱28</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text size="sm" className="text-foreground">Service Fee</Text>
                <Text size="sm" weight="medium" className="text-foreground">₱2</Text>
              </View>
              
              <View className="h-px bg-border/60 my-1" />
              
              <View className="flex-row items-center justify-between">
                <Text size="lg" weight="bold" style={{ color: '#92400e' }}>Total Fare</Text>
                <Text size="2xl" weight="bold" style={{ color: '#92400e' }}>₱{MOCK_TRIP.actualFare}</Text>
              </View>
            </View>
          </View>

          {/* ===== PAYMENT METHOD SELECTION ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Select Payment Method
            </Text>
            
            <View className="gap-2">
              {/* Cash */}
              <TouchableOpacity
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: selectedPayment === 'CASH' ? 'rgba(13, 95, 58, 0.1)' : '#fff',
                  borderWidth: 1.5,
                  borderColor: selectedPayment === 'CASH' ? PRIMARY_GREEN : '#e5e5e3',
                }}
                onPress={() => setSelectedPayment('CASH')}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: selectedPayment === 'CASH' ? 'rgba(13, 95, 58, 0.15)' : 'rgba(13, 95, 58, 0.08)' }}
                  >
                    <DollarSign size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text size="base" weight="bold" className="text-foreground">Cash</Text>
                    <Text size="xs" className="text-muted-foreground">Collect cash from passenger</Text>
                  </View>
                  {selectedPayment === 'CASH' && (
                    <CheckCircle2 size={20} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  )}
                </View>
              </TouchableOpacity>

              {/* GCash */}
              <TouchableOpacity
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: selectedPayment === 'GCASH' ? 'rgba(13, 95, 58, 0.1)' : '#fff',
                  borderWidth: 1.5,
                  borderColor: selectedPayment === 'GCASH' ? PRIMARY_GREEN : '#e5e5e3',
                }}
                onPress={() => setSelectedPayment('GCASH')}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: selectedPayment === 'GCASH' ? 'rgba(13, 95, 58, 0.15)' : 'rgba(13, 95, 58, 0.08)' }}
                  >
                    <Smartphone size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text size="base" weight="bold" className="text-foreground">GCash</Text>
                    <Text size="xs" className="text-muted-foreground">Digital payment via GCash</Text>
                  </View>
                  {selectedPayment === 'GCASH' && (
                    <CheckCircle2 size={20} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Maya */}
              <TouchableOpacity
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: selectedPayment === 'MAYA' ? 'rgba(13, 95, 58, 0.1)' : '#fff',
                  borderWidth: 1.5,
                  borderColor: selectedPayment === 'MAYA' ? PRIMARY_GREEN : '#e5e5e3',
                }}
                onPress={() => setSelectedPayment('MAYA')}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: selectedPayment === 'MAYA' ? 'rgba(13, 95, 58, 0.15)' : 'rgba(13, 95, 58, 0.08)' }}
                  >
                    <CreditCard size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text size="base" weight="bold" className="text-foreground">Maya</Text>
                    <Text size="xs" className="text-muted-foreground">Digital payment via Maya</Text>
                  </View>
                  {selectedPayment === 'MAYA' && (
                    <CheckCircle2 size={20} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== PAYMENT NOTICE ===== */}
          {selectedPayment && (
            <Animated.View
              entering={FadeIn.duration(300)}
              className="rounded-2xl p-4 gap-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.2)' }}
            >
              <View className="flex-row items-center gap-2">
                <AlertCircle size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  Payment Collection
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                {selectedPayment === 'CASH'
                  ? 'Confirm that you have received ₱70 in cash from the passenger before completing.'
                  : `Confirm that the passenger has sent ₱70 via ${selectedPayment} before completing.`}
              </Text>
            </Animated.View>
          )}

          {/* ===== CONFIRM PAYMENT BUTTON ===== */}
          <View className="pt-2">
            <Button
              size="lg"
              className="w-full"
              style={{
                backgroundColor: selectedPayment ? PRIMARY_GREEN : '#9ca3af',
                opacity: isConfirming ? 0.7 : 1,
              }}
              onPress={handleConfirmPayment}
              disabled={!selectedPayment || isConfirming}
            >
              <View className="flex-row items-center gap-2">
                <Banknote size={20} color="#fff" strokeWidth={2.5} />
                <Text size="base" weight="bold" className="text-white">
                  {isConfirming ? 'Processing...' : 'Confirm Payment Received'}
                </Text>
              </View>
            </Button>
          </View>

          {/* ===== BOOKING ID ===== */}
          <View className="items-center py-2">
            <Text size="xs" className="text-muted-foreground">
              Booking ID: {MOCK_TRIP.bookingId}
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
