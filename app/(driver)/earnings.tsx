import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  TrendingUp,
  Banknote,
  Calendar,
  Clock,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

type TimePeriod = 'TODAY' | 'WEEK' | 'MONTH';

const MOCK_EARNINGS = {
  TODAY: {
    totalEarnings: 320,
    totalTrips: 6,
    avgFare: 53,
    peakHours: '8 AM - 10 AM',
  },
  WEEK: {
    totalEarnings: 1840,
    totalTrips: 34,
    avgFare: 54,
    peakHours: 'Mon-Fri Morning',
  },
  MONTH: {
    totalEarnings: 7240,
    totalTrips: 142,
    avgFare: 51,
    peakHours: 'Weekday Rush Hours',
  },
};

const MOCK_RECENT_TRIPS = [
  {
    id: '1',
    bookingId: 'PTL-20261008-0042',
    destination: 'Cagayan Valley Medical Center',
    fare: 70,
    time: '10:27 AM',
    distance: '3.5 km',
    duration: '12 min',
  },
  {
    id: '2',
    bookingId: 'PTL-20261008-0037',
    destination: 'City Hall, Tuguegarao',
    fare: 60,
    time: '9:14 AM',
    distance: '2.8 km',
    duration: '9 min',
  },
  {
    id: '3',
    bookingId: 'PTL-20261008-0031',
    destination: 'Ilocos Norte Capitol',
    fare: 45,
    time: '8:02 AM',
    distance: '2.1 km',
    duration: '7 min',
  },
  {
    id: '4',
    bookingId: 'PTL-20261008-0028',
    destination: 'Robinsons Place Tuguegarao',
    fare: 55,
    time: '7:33 AM',
    distance: '2.5 km',
    duration: '8 min',
  },
  {
    id: '5',
    bookingId: 'PTL-20261008-0019',
    destination: 'City Mall Tuguegarao',
    fare: 50,
    time: '6:45 AM',
    distance: '2.2 km',
    duration: '7 min',
  },
  {
    id: '6',
    bookingId: 'PTL-20261008-0012',
    destination: 'Tuguegarao Airport',
    fare: 40,
    time: '6:10 AM',
    distance: '1.8 km',
    duration: '6 min',
  },
];

const MOCK_DAILY_BREAKDOWN = [
  { day: 'Mon', earnings: 380, trips: 7 },
  { day: 'Tue', earnings: 420, trips: 8 },
  { day: 'Wed', earnings: 290, trips: 5 },
  { day: 'Thu', earnings: 350, trips: 6 },
  { day: 'Fri', earnings: 400, trips: 8 },
  { day: 'Sat', earnings: 0, trips: 0 },
  { day: 'Sun', earnings: 0, trips: 0 },
];

/**
 * Driver Earnings Screen
 * Phase 0.5 — Mock UI
 *
 * Shows earnings summary, trip history, and daily breakdown.
 * Toggles between Today/Week/Month views.
 */
export default function DriverEarnings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('TODAY');
  const earnings = MOCK_EARNINGS[selectedPeriod];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          Earnings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5">

          {/* ===== PERIOD SELECTOR ===== */}
          <View className="flex-row gap-2">
            {(['TODAY', 'WEEK', 'MONTH'] as TimePeriod[]).map(period => (
              <TouchableOpacity
                key={period}
                className="flex-1 rounded-xl py-3"
                style={{
                  backgroundColor: selectedPeriod === period ? PRIMARY_GREEN : 'rgba(13, 95, 58, 0.08)',
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  size="sm"
                  weight="bold"
                  className="text-center"
                  style={{
                    color: selectedPeriod === period ? '#fff' : PRIMARY_GREEN,
                  }}
                >
                  {period === 'TODAY' ? 'Today' : period === 'WEEK' ? 'This Week' : 'This Month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ===== TOTAL EARNINGS CARD ===== */}
          <View
            className="rounded-3xl p-6 items-center gap-3"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            <View className="flex-row items-center gap-2">
              <TrendingUp size={18} color={ACCENT_YELLOW} strokeWidth={2.5} />
              <Text size="sm" weight="semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Earnings
              </Text>
            </View>
            <Text size="4xl" weight="bold" className="text-white">
              ₱{earnings.totalEarnings.toLocaleString()}
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="items-center">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Total Trips
                </Text>
                <Text size="lg" weight="bold" className="text-white">
                  {earnings.totalTrips}
                </Text>
              </View>
              <View className="h-8 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View className="items-center">
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Avg. Fare
                </Text>
                <Text size="lg" weight="bold" className="text-white">
                  ₱{earnings.avgFare}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== STATS GRID ===== */}
          <View className="flex-row gap-3">
            <View
              className="flex-1 rounded-2xl p-4 gap-2"
              style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
            >
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
              >
                <ArrowUpRight size={18} color={ACCENT_YELLOW} strokeWidth={2.5} />
              </View>
              <Text size="xs" className="text-muted-foreground">Peak Hours</Text>
              <Text size="sm" weight="bold" className="text-foreground">
                {earnings.peakHours}
              </Text>
            </View>

            <View
              className="flex-1 rounded-2xl p-4 gap-2"
              style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
            >
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <DollarSign size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
              </View>
              <Text size="xs" className="text-muted-foreground">Per Trip</Text>
              <Text size="sm" weight="bold" className="text-foreground">
                ₱{earnings.avgFare}
              </Text>
            </View>
          </View>

          {/* ===== WEEKLY BREAKDOWN (only for WEEK view) ===== */}
          {selectedPeriod === 'WEEK' && (
            <View
              className="rounded-3xl p-5 gap-4"
              style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
            >
              <Text size="sm" weight="bold" className="text-foreground">
                Daily Breakdown
              </Text>
              <View className="gap-2">
                {MOCK_DAILY_BREAKDOWN.map(day => {
                  const maxEarnings = Math.max(...MOCK_DAILY_BREAKDOWN.map(d => d.earnings));
                  const barWidth = day.earnings > 0 ? (day.earnings / maxEarnings) * 100 : 0;
                  
                  return (
                    <View key={day.day} className="gap-1">
                      <View className="flex-row items-center justify-between">
                        <Text size="xs" weight="semibold" className="text-foreground w-10">
                          {day.day}
                        </Text>
                        <View className="flex-1 mx-2 h-6 rounded-full overflow-hidden bg-border/30">
                          {day.earnings > 0 && (
                            <View
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: PRIMARY_GREEN,
                                width: `${barWidth}%`,
                              }}
                            />
                          )}
                        </View>
                        <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN, width: 50, textAlign: 'right' }}>
                          {day.earnings > 0 ? `₱${day.earnings}` : '—'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ===== RECENT TRIPS (only for TODAY view) ===== */}
          {selectedPeriod === 'TODAY' && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text size="sm" weight="bold" className="text-foreground">
                  Today's Trips
                </Text>
                <TouchableOpacity onPress={() => router.push('/(driver)/trip-history')}>
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                className="rounded-2xl overflow-hidden"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                {MOCK_RECENT_TRIPS.map((trip, i) => (
                  <View key={trip.id}>
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5"
                      onPress={() => router.push('/(driver)/trip-detail')}
                    >
                      <View
                        className="h-10 w-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                      >
                        <Banknote size={16} color={PRIMARY_GREEN} strokeWidth={2} />
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text size="sm" weight="semibold" className="text-foreground">
                          {trip.destination}
                        </Text>
                        <Text size="xs" className="text-muted-foreground">
                          {trip.distance} • {trip.duration} • {trip.time}
                        </Text>
                      </View>
                      <Text size="base" weight="bold" style={{ color: PRIMARY_GREEN }}>
                        ₱{trip.fare}
                      </Text>
                    </TouchableOpacity>
                    {i < MOCK_RECENT_TRIPS.length - 1 && (
                      <View className="h-px bg-border/40 mx-4" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ===== SUMMARY STATS (for WEEK and MONTH) ===== */}
          {(selectedPeriod === 'WEEK' || selectedPeriod === 'MONTH') && (
            <View
              className="rounded-2xl p-4 gap-2"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.2)' }}
            >
              <View className="flex-row items-center gap-2">
                <TrendingUp size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                  {selectedPeriod === 'WEEK' ? 'Weekly' : 'Monthly'} Summary
                </Text>
              </View>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                You earned ₱{earnings.totalEarnings.toLocaleString()} from {earnings.totalTrips} completed trips.
                Your average fare per trip was ₱{earnings.avgFare}.
              </Text>
            </View>
          )}

          {/* ===== VIEW HISTORY LINK ===== */}
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
            onPress={() => router.push('/(driver)/trip-history')}
          >
            <Calendar size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
              View Full Trip History
            </Text>
            <ChevronRight size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* ===== MOCK NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Phase 0.5 — Mock Data
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Earnings and trip data are simulated. Real integration in Phase 1.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
