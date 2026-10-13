import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  User,
  Clock,
  Banknote,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const MOCK_TRIP = {
  bookingId: 'PTL-20261008-0042',
  passengerName: 'Maria Santos',
  passengerPhone: '+63 917 555 1234',
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

/**
 * Driver Arriving Screen
 * Phase 0.5 — Mock UI
 *
 * After accepting request, driver navigates to pickup location.
 * Shows passenger info, pickup location, contact options.
 * "I've Arrived" button → pickup-verify screen
 * Mock: 5s delay simulates arriving at pickup
 */
export default function DriverArriving() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showArrivedButton, setShowArrivedButton] = useState(false);
  const [isArriving, setIsArriving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Mock: simulate arrival after 5 seconds
  useState(() => {
    setTimeout(() => {
      setShowArrivedButton(true);
    }, 5000);
  });

  function handleArrived() {
    setIsArriving(true);
    setTimeout(() => {
      router.push('/(driver)/active-ride');
    }, 1000);
  }

  function handleCall() {
    // Mock: would trigger phone call
    console.log('Call passenger:', MOCK_TRIP.passengerPhone);
  }

  function handleMessage() {
    // Mock: would open in-app messaging
    console.log('Message passenger');
  }

  function handleCancelTrip() {
    setShowCancelConfirm(false);
    setTimeout(() => {
      router.replace('/(driver)/home');
    }, 500);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ===== STATUS HEADER ===== */}
      <View
        className="items-center py-4 px-5"
        style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
      >
        <View className="flex-row items-center gap-2">
          <Navigation size={18} color="#0369a1" strokeWidth={2.5} />
          <Text size="sm" weight="bold" style={{ color: '#0369a1' }}>
            {showArrivedButton ? 'Arrived at Pickup' : 'Heading to Pickup'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5 pt-4">

          {/* ===== PASSENGER INFO CARD ===== */}
          <View
            className="rounded-3xl p-5 gap-4"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="h-16 w-16 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <User size={28} color={PRIMARY_GREEN} strokeWidth={2} />
              </View>
              <View className="flex-1 gap-1">
                <Text size="lg" weight="bold" className="text-foreground">
                  {MOCK_TRIP.passengerName}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="flex-row items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={{ fontSize: 12 }}>
                        {i < Math.floor(MOCK_TRIP.passengerRating) ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    {MOCK_TRIP.passengerRating.toFixed(1)}
                  </Text>
                </View>
                <Text size="xs" className="text-muted-foreground">
                  {MOCK_TRIP.serviceType}
                </Text>
              </View>
            </View>

            {/* Contact buttons */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                onPress={handleCall}
              >
                <Phone size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                onPress={handleMessage}
              >
                <MessageCircle size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== PICKUP LOCATION ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Pickup Location
            </Text>
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
              >
                <MapPin size={18} color="#0369a1" strokeWidth={2.5} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="base" weight="bold" className="text-foreground">
                  {MOCK_TRIP.pickup.name}
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  {MOCK_TRIP.pickup.address}
                </Text>
              </View>
            </View>

            {/* Navigate button */}
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-xl py-3 mt-2"
              style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
              onPress={() => console.log('Open maps navigation')}
            >
              <Navigation size={16} color="#0369a1" strokeWidth={2.5} />
              <Text size="sm" weight="semibold" style={{ color: '#0369a1' }}>
                Navigate with Maps
              </Text>
            </TouchableOpacity>
          </View>

          {/* ===== DESTINATION PREVIEW ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1.5, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Destination
            </Text>
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.15)' }}
              >
                <MapPin size={18} color={PRIMARY_GREEN} strokeWidth={2.5} fill={PRIMARY_GREEN} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="base" weight="bold" className="text-foreground">
                  {MOCK_TRIP.destination.name}
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  {MOCK_TRIP.destination.address}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== TRIP INFO ===== */}
          <View
            className="rounded-3xl p-4"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.12)', borderWidth: 1.5, borderColor: 'rgba(251, 191, 36, 0.3)' }}
          >
            <View className="flex-row items-center justify-around">
              <View className="items-center gap-1">
                <Banknote size={20} color={ACCENT_YELLOW} strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">Fare</Text>
                <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                  ₱{MOCK_TRIP.estimatedFare}
                </Text>
              </View>
              <View className="h-12 w-px bg-border" />
              <View className="items-center gap-1">
                <Navigation size={20} color={ACCENT_YELLOW} strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">Distance</Text>
                <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                  {MOCK_TRIP.distance}
                </Text>
              </View>
              <View className="h-12 w-px bg-border" />
              <View className="items-center gap-1">
                <Clock size={20} color={ACCENT_YELLOW} strokeWidth={2} />
                <Text size="xs" className="text-muted-foreground">Duration</Text>
                <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                  {MOCK_TRIP.estimatedDuration}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== ARRIVAL NOTICE ===== */}
          {!showArrivedButton && (
            <View
              className="rounded-2xl p-4 gap-2"
              style={{ backgroundColor: 'rgba(3, 105, 161, 0.06)', borderWidth: 1, borderColor: 'rgba(3, 105, 161, 0.2)' }}
            >
              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#0369a1" strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: '#0369a1' }}>
                  En Route to Pickup
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                Navigate to the pickup location. Tap "I've Arrived" once you reach the passenger.
              </Text>
            </View>
          )}

          {/* ===== I'VE ARRIVED BUTTON ===== */}
          {showArrivedButton && (
            <View className="gap-3">
              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: PRIMARY_GREEN, opacity: isArriving ? 0.7 : 1 }}
                onPress={handleArrived}
                disabled={isArriving}
              >
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />
                  <Text size="base" weight="bold" className="text-white">
                    {isArriving ? 'Confirming...' : "I've Arrived"}
                  </Text>
                </View>
              </Button>

              <View
                className="rounded-2xl p-4 gap-2"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.2)' }}
              >
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                    Ready to Pick Up
                  </Text>
                </View>
                <Text size="xs" className="text-muted-foreground leading-relaxed">
                  You're at the pickup location. Wait for the passenger to board, then start the trip.
                </Text>
              </View>
            </View>
          )}

          {/* ===== CANCEL TRIP ===== */}
          {!showCancelConfirm ? (
            <TouchableOpacity
              className="items-center py-3"
              onPress={() => setShowCancelConfirm(true)}
            >
              <Text size="sm" weight="semibold" style={{ color: '#dc2626' }}>
                Cancel Trip
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              className="rounded-2xl p-4 gap-3"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.06)', borderWidth: 1.5, borderColor: 'rgba(220, 38, 38, 0.2)' }}
            >
              <View className="flex-row items-center gap-2">
                <AlertCircle size={16} color="#dc2626" strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>
                  Cancel this trip?
                </Text>
              </View>
              <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                Cancelling after accepting may affect your acceptance rate. The passenger will be notified.
              </Text>
              <View className="flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: '#e5e5e3' }}
                  onPress={() => setShowCancelConfirm(false)}
                >
                  <Text size="sm" weight="semibold" className="text-foreground">Keep Trip</Text>
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  style={{ backgroundColor: '#dc2626' }}
                  onPress={handleCancelTrip}
                >
                  <View className="flex-row items-center gap-1.5">
                    <X size={14} color="#fff" strokeWidth={2.5} />
                    <Text size="sm" weight="bold" className="text-white">Cancel</Text>
                  </View>
                </Button>
              </View>
            </View>
          )}

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
