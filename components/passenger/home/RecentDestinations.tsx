import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Card } from 'panelui-native';
import { Clock } from 'lucide-react-native';

/** Recent destination interface */
export interface RecentDestination {
  id: string;
  label: string;
  address: string;
  icon: string;
}

interface RecentDestinationsProps {
  destinations: RecentDestination[];
}

/**
 * Recent Destinations List
 * Shows user's recent booking destinations
 * Phase 0.5: Backend integration ready
 */
export default function RecentDestinations({ destinations }: RecentDestinationsProps) {
  const router = useRouter();

  // Don't render if no destinations
  if (destinations.length === 0) {
    return null;
  }

  return (
    <View className="px-5 gap-3 pb-6">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Recent
      </Text>
      <Card className="overflow-hidden">
        {destinations.map((dest, i) => (
          <View key={dest.id}>
            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-3.5"
              onPress={() => router.push('/(passenger)/booking')}
              activeOpacity={0.7}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
              >
                <Text style={{ fontSize: 18 }}>{dest.icon}</Text>
              </View>
              <View className="flex-1 gap-0.5">
                <Text size="sm" weight="semibold" className="text-foreground">{dest.label}</Text>
                <Text size="xs" className="text-muted-foreground" numberOfLines={1}>{dest.address}</Text>
              </View>
              <Clock size={14} color="#9ca3af" strokeWidth={2} />
            </TouchableOpacity>
            {i < destinations.length - 1 && (
              <View className="h-px bg-border/40 mx-4" />
            )}
          </View>
        ))}
      </Card>
    </View>
  );
}
