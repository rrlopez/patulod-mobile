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
  Play,
  Flag,
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
 * Driver Active Ride Screen
 * Phase 0.5 — Mock UI
 *
 * Passenger has boarded. Driver starts the trip and navigates to destination.
 * Shows trip progress, destination, contact options.
 * "Start Trip" button → begins trip (shows timer)
 * "Complete Trip" button → trip-complete screen
 */
export default function DriverActiveRide() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [tripStarted, setTripStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock timer for elapsed time
  useState(() => {
    const interval = setInterval(() => {
      if (tripStarted) {
        setElapsedTime(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  function handleStartTrip() {
    setIsStarting(true);
    setTimeout(() => {
      setTripStarted(true);
      setIsStarting(false);
      setElapsedTime(0);
    }, 1000);
  }

  function handleCompleteTrip() {
    setIsCompleting(true);
    setTimeout(() => {
      router.push('/(driver)/trip-inprogress');
    }, 1200);
  }

  function handleCall() {
    console.log('Call passenger:', MOCK_TRIP.passengerPhone);
  }

  function handleMessage() {
    console.log('Message passenger');
  }

  function handleCancelTrip() {
    setShowCancelConfirm(false);
    setTimeout(() => {
      router.replace('/(driver)/home');
    }, 500);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ===== STATUS HEADER ===== */}
      <View
        className="items-center py-4 px-5"
        style={{ backgroundColor: tripStarted ? 'rgba(13, 95, 58, 0.1)' : 'rgba(251, 191, 36, 0.15)' }}
      >
        <View className="flex-row items-center gap-2">
          {tripStarted ? (
            <>
              <Navigation size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                Trip in Progress • {formatTime(elapsedTime)}
              </Text>
            </>
          ) : (
            <>
              <Clock size={18} color="#92400e" strokeWidth={2.5} />
              <Text size="sm" weight="bold" style={{ color: '#92400e' }}>
                Passenger Boarded • Ready to Start
              </Text>
            </>
          )}
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

          {/* ===== PICKUP COMPLETED ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1.5, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <View className="flex-row items-center gap-2">
              <CheckCircle2 size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Picked Up From
              </Text>
            </View>
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.15)' }}
              >
                <MapPin size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
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
          </View>

          {/* ===== DESTINATION ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Destination
            </Text>
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
              >
                <MapPin size={18} color="#dc2626" strokeWidth={2.5} fill="#dc2626" />
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

            {/* Navigate button */}
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-xl py-3 mt-2"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
              onPress={() => console.log('Open maps navigation to destination')}
            >
              <Navigation size={16} color="#dc2626" strokeWidth={2.5} />
              <Text size="sm" weight="semibold" style={{ color: '#dc2626' }}>
                Navigate to Destination
              </Text>
            </TouchableOpacity>
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
                <Text size="xs" className="text-muted-foreground">Est. Time</Text>
                <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                  {MOCK_TRIP.estimatedDuration}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== START TRIP NOTICE ===== */}
          {!tripStarted && (
            <View
              className="rounded-2xl p-4 gap-2"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.07)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <View className="flex-row items-center gap-2">
                <AlertCircle size={16} color="#92400e" strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: '#92400e' }}>
                  Ready to Start
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                Passenger has boarded. Tap "Start Trip" to begin the ride and navigate to the destination.
              </Text>
            </View>
          )}

          {/* ===== IN PROGRESS NOTICE ===== */}
          {tripStarted && (
            <View
              className="rounded-2xl p-4 gap-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.2)' }}
            >
              <View className="flex-row items-center gap-2">
                <Navigation size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  Trip in Progress
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                Navigate safely to the destination. Tap "Complete Trip" when you arrive.
              </Text>
            </View>
          )}

          {/* ===== START TRIP BUTTON ===== */}
          {!tripStarted && (
            <View>
              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: PRIMARY_GREEN, opacity: isStarting ? 0.7 : 1 }}
                onPress={handleStartTrip}
                disabled={isStarting}
              >
                <View className="flex-row items-center gap-2">
                  <Play size={20} color="#fff" strokeWidth={2.5} fill="#fff" />
                  <Text size="base" weight="bold" className="text-white">
                    {isStarting ? 'Starting Trip...' : 'Start Trip'}
                  </Text>
                </View>
              </Button>
            </View>
          )}

          {/* ===== COMPLETE TRIP BUTTON ===== */}
          {tripStarted && (
            <View>
              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: '#dc2626', opacity: isCompleting ? 0.7 : 1 }}
                onPress={handleCompleteTrip}
                disabled={isCompleting}
              >
                <View className="flex-row items-center gap-2">
                  <Flag size={20} color="#fff" strokeWidth={2.5} />
                  <Text size="base" weight="bold" className="text-white">
                    {isCompleting ? 'Completing...' : 'Complete Trip'}
                  </Text>
                </View>
              </Button>
            </View>
          )}

          {/* ===== CANCEL TRIP (only before starting) ===== */}
          {!tripStarted && (
            <>
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
                <Animated.View
                  entering={FadeIn.duration(300)}
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
                    Cancelling after pickup may incur a penalty. The passenger will be notified.
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
                      <Text size="sm" weight="bold" className="text-white">Cancel</Text>
                    </Button>
                  </View>
                </Animated.View>
              )}
            </>
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
