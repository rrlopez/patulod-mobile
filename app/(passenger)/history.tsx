import { ScrollView, View, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Banknote,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

type TripStatus = 'COMPLETED' | 'CANCELLED' | 'NO_DRIVER_FOUND';

interface TripRecord {
  id: string;
  bookingRef: string;
  status: TripStatus;
  pickup: string;
  destination: string;
  date: string;
  fare: number | null;
  paymentStatus: 'CONFIRMED' | 'PENDING' | null;
  vehicleIcon: string;
  driverName: string | null;
}

const MOCK_TRIPS: TripRecord[] = [
  {
    id: '1',
    bookingRef: 'PTL-20261008-0042',
    status: 'COMPLETED',
    pickup: 'Brgy. San Julian, Laoag City',
    destination: 'City Hall, F.R. Castro Ave, Laoag City',
    date: 'Oct 8, 2026 · 9:14 AM',
    fare: 60,
    paymentStatus: 'CONFIRMED',
    vehicleIcon: '🏍️',
    driverName: 'Pedro Bautista',
  },
  {
    id: '2',
    bookingRef: 'PTL-20261007-0031',
    status: 'COMPLETED',
    pickup: 'Laoag Public Market, Brgy. 2',
    destination: 'Ilocos Norte Provincial Hospital',
    date: 'Oct 7, 2026 · 2:45 PM',
    fare: 45,
    paymentStatus: 'CONFIRMED',
    vehicleIcon: '🛺',
    driverName: 'Mario Santos',
  },
  {
    id: '3',
    bookingRef: 'PTL-20261006-0018',
    status: 'CANCELLED',
    pickup: 'Brgy. San Julian, Laoag City',
    destination: 'Marcos International Airport',
    date: 'Oct 6, 2026 · 7:20 AM',
    fare: null,
    paymentStatus: null,
    vehicleIcon: '🏍️',
    driverName: null,
  },
  {
    id: '4',
    bookingRef: 'PTL-20261005-0009',
    status: 'COMPLETED',
    pickup: 'City Hall, F.R. Castro Ave',
    destination: 'Brgy. San Julian, Laoag City',
    date: 'Oct 5, 2026 · 5:30 PM',
    fare: 56,
    paymentStatus: 'CONFIRMED',
    vehicleIcon: '🏍️',
    driverName: 'Pedro Bautista',
  },
  {
    id: '5',
    bookingRef: 'PTL-20261004-0003',
    status: 'NO_DRIVER_FOUND',
    pickup: 'Ilocos Norte Capitol, Brgy. 1',
    destination: 'Brgy. Balatong A, Laoag City',
    date: 'Oct 4, 2026 · 11:05 PM',
    fare: null,
    paymentStatus: null,
    vehicleIcon: '🏍️',
    driverName: null,
  },
];

const FILTERS: { label: string; value: TripStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'No Driver', value: 'NO_DRIVER_FOUND' },
];

const STATUS_CONFIG: Record<TripStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  COMPLETED: {
    label: 'Completed',
    color: PRIMARY_GREEN,
    bg: 'rgba(13, 95, 58, 0.08)',
    icon: <CheckCircle2 size={13} color={PRIMARY_GREEN} strokeWidth={2.5} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    icon: <XCircle size={13} color="#dc2626" strokeWidth={2.5} />,
  },
  NO_DRIVER_FOUND: {
    label: 'No Driver Found',
    color: '#92400e',
    bg: 'rgba(251, 191, 36, 0.12)',
    icon: <AlertCircle size={13} color="#92400e" strokeWidth={2.5} />,
  },
};

/**
 * Passenger Trip History Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 0.5:
 * - List with status badges
 * - Empty state
 * - Pagination (mock: load more)
 */
export default function TripHistory() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<TripStatus | 'ALL'>('ALL');
  const [visibleCount, setVisibleCount] = useState(4);

  const filtered = activeFilter === 'ALL'
    ? MOCK_TRIPS
    : MOCK_TRIPS.filter(t => t.status === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Trip History</Text>
      </View>

      {/* ===== FILTER TABS ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}
      >
        {FILTERS.map(f => {
          const active = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: active ? PRIMARY_GREEN : 'rgba(13, 95, 58, 0.07)',
              }}
              onPress={() => { setActiveFilter(f.value); setVisibleCount(4); }}
            >
              <Text
                size="xs"
                weight="semibold"
                style={{ color: active ? '#fff' : PRIMARY_GREEN }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
      >

        {/* ===== TRIP LIST ===== */}
        {visible.length > 0 ? (
          <View className="gap-3">
            {visible.map(trip => {
              const cfg = STATUS_CONFIG[trip.status];
              return (
                <TouchableOpacity
                  key={trip.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
                  onPress={() => router.push('/(passenger)/trip-summary')}
                  activeOpacity={0.75}
                >
                  {/* Status bar accent */}
                  <View style={{ height: 3, backgroundColor: cfg.color }} />

                  <View className="p-4 gap-3">
                    {/* Top row: ref + status badge */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-1.5">
                        <Text style={{ fontSize: 14 }}>{trip.vehicleIcon}</Text>
                        <Text size="xs" weight="semibold" className="text-muted-foreground">
                          {trip.bookingRef}
                        </Text>
                      </View>
                      <View
                        className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        {cfg.icon}
                        <Text size="xs" weight="bold" style={{ color: cfg.color }}>
                          {cfg.label}
                        </Text>
                      </View>
                    </View>

                    {/* Route */}
                    <View className="gap-2">
                      <View className="flex-row items-start gap-2">
                        <View
                          className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: PRIMARY_GREEN }}
                        />
                        <Text size="sm" className="text-foreground flex-1" numberOfLines={1}>
                          {trip.pickup}
                        </Text>
                      </View>
                      <View className="flex-row items-start gap-2">
                        <MapPin size={10} color="#ef4444" strokeWidth={2.5} style={{ marginTop: 3, flexShrink: 0 }} />
                        <Text size="sm" className="text-foreground flex-1" numberOfLines={1}>
                          {trip.destination}
                        </Text>
                      </View>
                    </View>

                    {/* Bottom row: date + fare + arrow */}
                    <View className="flex-row items-center justify-between pt-1">
                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                          <Calendar size={12} color="#9ca3af" strokeWidth={2} />
                          <Text size="xs" className="text-muted-foreground">{trip.date}</Text>
                        </View>
                        {trip.fare !== null && (
                          <View className="flex-row items-center gap-1">
                            <Banknote size={12} color={PRIMARY_GREEN} strokeWidth={2} />
                            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
                              ₱{trip.fare}
                            </Text>
                          </View>
                        )}
                      </View>
                      <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* ===== LOAD MORE ===== */}
            {hasMore && (
              <Button
                size="md"
                variant="outline"
                className="w-full mt-1"
                style={{ borderColor: '#e5e5e3' }}
                onPress={() => setVisibleCount(c => c + 4)}
              >
                <Text size="sm" weight="semibold" className="text-muted-foreground">
                  Load More
                </Text>
              </Button>
            )}

            {!hasMore && filtered.length > 4 && (
              <Text size="xs" className="text-center text-muted-foreground py-2">
                All {filtered.length} trips shown
              </Text>
            )}
          </View>
        ) : (
          /* ===== EMPTY STATE ===== */
          <View className="items-center justify-center gap-4 py-20">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.07)' }}
            >
              <Clock size={36} color="#9ca3af" strokeWidth={1.75} />
            </View>
            <View className="items-center gap-1.5">
              <Text size="lg" weight="bold" className="text-foreground">No Trips Yet</Text>
              <Text size="sm" className="text-muted-foreground text-center px-8">
                {activeFilter === 'ALL'
                  ? "You haven't taken any rides yet. Book your first ride from the home screen."
                  : `No ${STATUS_CONFIG[activeFilter as TripStatus]?.label.toLowerCase()} trips found.`}
              </Text>
            </View>
            {activeFilter !== 'ALL' ? (
              <Button
                size="md"
                variant="outline"
                style={{ borderColor: PRIMARY_GREEN }}
                onPress={() => setActiveFilter('ALL')}
              >
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>Show All Trips</Text>
              </Button>
            ) : (
              <Button
                size="md"
                style={{ backgroundColor: PRIMARY_GREEN }}
                onPress={() => router.replace('/(passenger)/home')}
              >
                <Text size="sm" weight="bold" className="text-white">Book a Ride</Text>
              </Button>
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
}
