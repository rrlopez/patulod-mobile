import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Banknote,
  User,
  Star,
  Calendar,
  CreditCard,
  FileText,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Phone,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

// Mock trip data - in real app, would fetch based on bookingId
const MOCK_TRIP_DETAIL = {
  bookingId: 'PTL-20261008-0042',
  status: 'COMPLETED',
  date: 'October 8, 2026',
  passenger: {
    name: 'Maria Santos',
    rating: 4.9,
    phone: '+63 917 555 1234',
  },
  pickup: {
    name: 'City Mall Tuguegarao',
    address: 'National Highway, Tuguegarao City, Cagayan',
    time: '10:15 AM',
  },
  destination: {
    name: 'Cagayan Valley Medical Center',
    address: 'Carig Sur, Tuguegarao City, Cagayan',
    time: '10:27 AM',
  },
  distance: '3.5 km',
  duration: '12 min',
  fare: {
    baseFare: 40,
    distanceCharge: 28,
    serviceFee: 2,
    total: 70,
  },
  earnings: {
    fare: 70,
    commission: 7,
    net: 63,
  },
  paymentMethod: 'Cash',
  serviceType: 'TRICYCLE',
  vehicleInfo: {
    model: 'Motorcycle',
    plate: 'INC-1234',
  },
};

/**
 * Driver Trip Detail Screen
 * Phase 0.5 — Mock UI
 *
 * Shows complete details of a past trip.
 * Includes route, fare breakdown, passenger info, receipt view.
 */
export default function DriverTripDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          Trip Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5">

          {/* ===== STATUS BADGE ===== */}
          <View className="items-center py-2">
            <View
              className="flex-row items-center gap-2 rounded-full px-4 py-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <CheckCircle2 size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_DETAIL.status}
              </Text>
            </View>
          </View>

          {/* ===== BOOKING ID & DATE ===== */}
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text size="xs" className="text-muted-foreground">Booking ID</Text>
                <Text size="base" weight="bold" className="text-foreground">
                  {MOCK_TRIP_DETAIL.bookingId}
                </Text>
              </View>
              <View className="items-end gap-1">
                <Text size="xs" className="text-muted-foreground">Date</Text>
                <Text size="sm" weight="semibold" className="text-foreground">
                  {MOCK_TRIP_DETAIL.date}
                </Text>
              </View>
            </View>
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
                  {MOCK_TRIP_DETAIL.passenger.name}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <View className="flex-row items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={{ fontSize: 11 }}>
                        {i < Math.floor(MOCK_TRIP_DETAIL.passenger.rating) ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    {MOCK_TRIP_DETAIL.passenger.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== ROUTE TIMELINE ===== */}
          <View
            className="rounded-3xl p-5 gap-4"
            style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
          >
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Route
            </Text>

            {/* Pickup */}
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(3, 105, 161, 0.1)' }}
              >
                <MapPin size={18} color="#0369a1" strokeWidth={2.5} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="xs" className="text-muted-foreground">Pickup</Text>
                <Text size="base" weight="bold" className="text-foreground">
                  {MOCK_TRIP_DETAIL.pickup.name}
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  {MOCK_TRIP_DETAIL.pickup.address}
                </Text>
              </View>
              <Text size="xs" weight="semibold" style={{ color: '#0369a1' }}>
                {MOCK_TRIP_DETAIL.pickup.time}
              </Text>
            </View>

            {/* Separator */}
            <View className="flex-row items-center gap-2 px-2">
              <View className="h-px flex-1 bg-border" />
              <Navigation size={12} color="#9ca3af" strokeWidth={2} />
              <Text size="xs" className="text-muted-foreground">
                {MOCK_TRIP_DETAIL.distance} • {MOCK_TRIP_DETAIL.duration}
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            {/* Destination */}
            <View className="flex-row items-start gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <MapPin size={18} color={PRIMARY_GREEN} strokeWidth={2.5} fill={PRIMARY_GREEN} />
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="xs" className="text-muted-foreground">Destination</Text>
                <Text size="base" weight="bold" className="text-foreground">
                  {MOCK_TRIP_DETAIL.destination.name}
                </Text>
                <Text size="xs" className="text-muted-foreground">
                  {MOCK_TRIP_DETAIL.destination.address}
                </Text>
              </View>
              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_DETAIL.destination.time}
              </Text>
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
                <Text size="sm" weight="medium" className="text-foreground">
                  ₱{MOCK_TRIP_DETAIL.fare.baseFare}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text size="sm" className="text-foreground">
                  Distance ({MOCK_TRIP_DETAIL.distance} × ₱8/km)
                </Text>
                <Text size="sm" weight="medium" className="text-foreground">
                  ₱{MOCK_TRIP_DETAIL.fare.distanceCharge}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text size="sm" className="text-foreground">Service Fee</Text>
                <Text size="sm" weight="medium" className="text-foreground">
                  ₱{MOCK_TRIP_DETAIL.fare.serviceFee}
                </Text>
              </View>

              <View className="h-px bg-border/60 my-1" />

              <View className="flex-row items-center justify-between">
                <Text size="lg" weight="bold" style={{ color: '#92400e' }}>Total Fare</Text>
                <Text size="xl" weight="bold" style={{ color: '#92400e' }}>
                  ₱{MOCK_TRIP_DETAIL.fare.total}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== EARNINGS BREAKDOWN ===== */}
          <View
            className="rounded-3xl p-5 gap-3"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            <Text size="xs" weight="bold" className="uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Your Earnings
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>Trip Fare</Text>
                <Text size="sm" weight="medium" className="text-white">
                  ₱{MOCK_TRIP_DETAIL.earnings.fare}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Platform Commission (10%)
                </Text>
                <Text size="sm" weight="medium" className="text-white">
                  - ₱{MOCK_TRIP_DETAIL.earnings.commission}
                </Text>
              </View>

              <View className="h-px my-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

              <View className="flex-row items-center justify-between">
                <Text size="lg" weight="bold" className="text-white">Net Earnings</Text>
                <Text size="2xl" weight="bold" className="text-white">
                  ₱{MOCK_TRIP_DETAIL.earnings.net}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== PAYMENT & SERVICE INFO ===== */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
          >
            <View className="flex-row items-center justify-between px-4 py-3.5">
              <View className="flex-row items-center gap-2">
                <CreditCard size={16} color="#9ca3af" strokeWidth={2} />
                <Text size="sm" className="text-muted-foreground">Payment Method</Text>
              </View>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_DETAIL.paymentMethod}
              </Text>
            </View>
            <View className="h-px bg-border/40 mx-4" />
            <View className="flex-row items-center justify-between px-4 py-3.5">
              <View className="flex-row items-center gap-2">
                <FileText size={16} color="#9ca3af" strokeWidth={2} />
                <Text size="sm" className="text-muted-foreground">Service Type</Text>
              </View>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_DETAIL.serviceType}
              </Text>
            </View>
            <View className="h-px bg-border/40 mx-4" />
            <View className="flex-row items-center justify-between px-4 py-3.5">
              <View className="flex-row items-center gap-2">
                <Navigation size={16} color="#9ca3af" strokeWidth={2} />
                <Text size="sm" className="text-muted-foreground">Vehicle</Text>
              </View>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                {MOCK_TRIP_DETAIL.vehicleInfo.model} • {MOCK_TRIP_DETAIL.vehicleInfo.plate}
              </Text>
            </View>
          </View>

          {/* ===== ACTIONS ===== */}
          <View className="gap-3">
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', borderWidth: 1.5, borderColor: 'rgba(220, 38, 38, 0.2)' }}
              onPress={() => router.push('/support')}
            >
              <AlertCircle size={16} color="#dc2626" strokeWidth={2.5} />
              <Text size="sm" weight="semibold" style={{ color: '#dc2626' }}>
                Report Issue with this Trip
              </Text>
            </TouchableOpacity>
          </View>

          {/* ===== MOCK NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Phase 0.5 — Mock Data
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Trip details are simulated. Real integration in Phase 1.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
