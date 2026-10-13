import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Banknote,
  ChevronRight,
  Filter,
  Navigation,
  CheckCircle2,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

type FilterType = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';

const MOCK_TRIPS = [
  {
    id: '1',
    bookingId: 'PTL-20261008-0042',
    date: 'Today',
    time: '10:27 AM',
    pickup: 'City Mall Tuguegarao',
    destination: 'Cagayan Valley Medical Center',
    distance: '3.5 km',
    duration: '12 min',
    fare: 70,
    earnings: 63,
    paymentMethod: 'Cash',
    status: 'COMPLETED',
  },
  {
    id: '2',
    bookingId: 'PTL-20261008-0037',
    date: 'Today',
    time: '9:14 AM',
    pickup: 'Robinsons Place',
    destination: 'City Hall, Tuguegarao',
    distance: '2.8 km',
    duration: '9 min',
    fare: 60,
    earnings: 54,
    paymentMethod: 'GCash',
    status: 'COMPLETED',
  },
  {
    id: '3',
    bookingId: 'PTL-20261008-0031',
    date: 'Today',
    time: '8:02 AM',
    pickup: 'Saint Paul University',
    destination: 'Ilocos Norte Capitol',
    distance: '2.1 km',
    duration: '7 min',
    fare: 45,
    earnings: 41,
    paymentMethod: 'Cash',
    status: 'COMPLETED',
  },
  {
    id: '4',
    bookingId: 'PTL-20261007-0089',
    date: 'Yesterday',
    time: '5:45 PM',
    pickup: 'City Mall',
    destination: 'Tuguegarao Airport',
    distance: '8.2 km',
    duration: '18 min',
    fare: 120,
    earnings: 108,
    paymentMethod: 'Cash',
    status: 'COMPLETED',
  },
  {
    id: '5',
    bookingId: 'PTL-20261007-0078',
    date: 'Yesterday',
    time: '3:20 PM',
    pickup: 'City Hall',
    destination: 'Buntun Bridge',
    distance: '4.1 km',
    duration: '11 min',
    fare: 75,
    earnings: 68,
    paymentMethod: 'Maya',
    status: 'COMPLETED',
  },
  {
    id: '6',
    bookingId: 'PTL-20261006-0142',
    date: 'Oct 6',
    time: '11:30 AM',
    pickup: 'SM City Cauayan',
    destination: 'Cauayan City Hall',
    distance: '3.2 km',
    duration: '10 min',
    fare: 65,
    earnings: 59,
    paymentMethod: 'Cash',
    status: 'COMPLETED',
  },
  {
    id: '7',
    bookingId: 'PTL-20261005-0203',
    date: 'Oct 5',
    time: '4:15 PM',
    pickup: 'Cagayan State University',
    destination: 'City Mall Tuguegarao',
    distance: '5.5 km',
    duration: '14 min',
    fare: 90,
    earnings: 81,
    paymentMethod: 'GCash',
    status: 'COMPLETED',
  },
];

/**
 * Driver Trip History Screen
 * Phase 0.5 — Mock UI
 *
 * Shows complete list of past trips with details.
 * Filter by date range (All/Today/Week/Month).
 * Tap trip to view full details.
 */
export default function DriverTripHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [filter, setFilter] = useState<FilterType>('ALL');

  // Filter trips based on selected period
  const filteredTrips = MOCK_TRIPS.filter(trip => {
    if (filter === 'ALL') return true;
    if (filter === 'TODAY') return trip.date === 'Today';
    if (filter === 'WEEK') return ['Today', 'Yesterday'].includes(trip.date) || trip.date.startsWith('Oct');
    if (filter === 'MONTH') return true; // All trips in this mock are from this month
    return true;
  });

  const totalEarnings = filteredTrips.reduce((sum, trip) => sum + trip.earnings, 0);
  const totalTrips = filteredTrips.length;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          Trip History
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5">

          {/* ===== FILTER BUTTONS ===== */}
          <View className="flex-row gap-2">
            {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as FilterType[]).map(f => (
              <TouchableOpacity
                key={f}
                className="flex-1 rounded-xl py-2.5"
                style={{
                  backgroundColor: filter === f ? PRIMARY_GREEN : 'rgba(13, 95, 58, 0.08)',
                }}
                onPress={() => setFilter(f)}
              >
                <Text
                  size="xs"
                  weight="bold"
                  className="text-center"
                  style={{
                    color: filter === f ? '#fff' : PRIMARY_GREEN,
                  }}
                >
                  {f === 'ALL' ? 'All' : f === 'TODAY' ? 'Today' : f === 'WEEK' ? 'Week' : 'Month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ===== SUMMARY CARD ===== */}
          <View
            className="rounded-3xl p-5"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)', borderWidth: 1.5, borderColor: 'rgba(13, 95, 58, 0.2)' }}
          >
            <View className="flex-row items-center justify-around">
              <View className="items-center gap-1">
                <Text size="xs" className="text-muted-foreground">Total Trips</Text>
                <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {totalTrips}
                </Text>
              </View>
              <View className="h-12 w-px" style={{ backgroundColor: 'rgba(13, 95, 58, 0.3)' }} />
              <View className="items-center gap-1">
                <Text size="xs" className="text-muted-foreground">Total Earnings</Text>
                <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  ₱{totalEarnings}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== TRIPS LIST ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              {filter === 'ALL' ? 'All Trips' : filter === 'TODAY' ? "Today's Trips" : filter === 'WEEK' ? 'This Week' : 'This Month'}
            </Text>

            {filteredTrips.length === 0 ? (
              <View
                className="rounded-2xl p-8 items-center gap-3"
                style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
              >
                <View
                  className="h-16 w-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
                >
                  <Calendar size={28} color="#9ca3af" strokeWidth={2} />
                </View>
                <Text size="base" weight="bold" className="text-foreground">No Trips Found</Text>
                <Text size="sm" className="text-muted-foreground text-center">
                  No trips match the selected filter.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filteredTrips.map(trip => (
                  <TouchableOpacity
                    key={trip.id}
                    className="rounded-2xl p-4 gap-3"
                    style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
                    onPress={() => router.push('/(driver)/trip-detail')}
                    activeOpacity={0.7}
                  >
                    {/* Header */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View
                          className="h-8 w-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                        >
                          <CheckCircle2 size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
                        </View>
                        <View className="gap-0.5">
                          <Text size="xs" className="text-muted-foreground">{trip.date}</Text>
                          <Text size="xs" weight="semibold" className="text-foreground">{trip.time}</Text>
                        </View>
                      </View>
                      <View className="items-end gap-0.5">
                        <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
                          ₱{trip.earnings}
                        </Text>
                        <Text size="xs" className="text-muted-foreground">{trip.paymentMethod}</Text>
                      </View>
                    </View>

                    {/* Route */}
                    <View className="gap-2">
                      <View className="flex-row items-start gap-2">
                        <MapPin size={14} color="#0369a1" strokeWidth={2.5} style={{ marginTop: 2 }} />
                        <Text size="sm" weight="medium" className="text-foreground flex-1">
                          {trip.pickup}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2 pl-1">
                        <Navigation size={10} color="#9ca3af" strokeWidth={2} />
                        <View className="h-px flex-1 bg-border" />
                        <Text size="xs" className="text-muted-foreground">
                          {trip.distance} • {trip.duration}
                        </Text>
                      </View>
                      <View className="flex-row items-start gap-2">
                        <MapPin size={14} color={PRIMARY_GREEN} strokeWidth={2.5} fill={PRIMARY_GREEN} style={{ marginTop: 2 }} />
                        <Text size="sm" weight="medium" className="text-foreground flex-1">
                          {trip.destination}
                        </Text>
                      </View>
                    </View>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between pt-2 border-t border-border/40">
                      <Text size="xs" className="text-muted-foreground">
                        {trip.bookingId}
                      </Text>
                      <ChevronRight size={14} color="#9ca3af" strokeWidth={2} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              Trip history is simulated. Real integration in Phase 1.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
