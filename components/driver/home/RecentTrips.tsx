import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';

const PRIMARY_GREEN = '#0d5f3a';

interface Trip {
  id: string;
  destination: string;
  fare: number;
  time: string;
}

interface RecentTripsProps {
  trips: Trip[];
}

export function RecentTrips({ trips }: RecentTripsProps) {
  const router = useRouter();

  if (trips.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
          Recent Trips
        </Text>
        <TouchableOpacity onPress={() => router.push('/(driver)/trip-history')}>
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>See all</Text>
        </TouchableOpacity>
      </View>
      <View
        className="rounded-2xl overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        {trips.map((trip, i) => (
          <View key={trip.id}>
            <View className="flex-row items-center gap-3 px-4 py-3.5">
              <View
                className="h-9 w-9 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
              >
                <Text style={{ fontSize: 16 }}>🏍️</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="sm" weight="medium" className="text-foreground" numberOfLines={1}>
                  {trip.destination}
                </Text>
                <Text size="xs" className="text-muted-foreground">{trip.time}</Text>
              </View>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{trip.fare}</Text>
            </View>
            {i < trips.length - 1 && (
              <View className="h-px bg-border/40 mx-4" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
