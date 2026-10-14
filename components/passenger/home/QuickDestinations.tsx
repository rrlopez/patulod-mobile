import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';

/** Quick destination type */
interface QuickDestination {
  id: string;
  label: string;
  icon: string;
}

/** Mock quick destinations - TODO Phase 3: Load from user preferences */
const QUICK_DESTINATIONS: QuickDestination[] = [
  { id: '1', label: 'Hospital', icon: '🏥' },
  { id: '2', label: 'School', icon: '🏫' },
  { id: '3', label: 'Market', icon: '🛒' },
  { id: '4', label: 'Church', icon: '⛪' },
];

/**
 * Quick Destinations Grid
 * Phase 0.5: Static quick access buttons
 */
export default function QuickDestinations() {
  const router = useRouter();

  return (
    <View className="px-5 gap-3 pb-6">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Quick Destinations
      </Text>
      <View className="flex-row gap-3">
        {QUICK_DESTINATIONS.map(dest => (
          <TouchableOpacity
            key={dest.id}
            className="flex-1 items-center gap-2 rounded-2xl py-4"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
            onPress={() => router.push('/(passenger)/booking')}
          >
            <Text style={{ fontSize: 22 }}>{dest.icon}</Text>
            <Text size="xs" weight="semibold" className="text-foreground">{dest.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
