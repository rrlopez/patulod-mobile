import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { Bike } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Service Cards
 * Shows available vehicle types and pricing
 */
export default function ServiceCards() {
  const router = useRouter();

  return (
    <View className="px-5 gap-3 pb-6">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Available Services
      </Text>
      <View className="flex-row gap-3">

        {/* Motorcycle */}
        <TouchableOpacity
          className="flex-1 rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
          onPress={() => router.push('/(passenger)/booking')}
        >
          <View
            className="h-10 w-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Bike size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </View>
          <Text size="sm" weight="bold" className="text-foreground">Motorcycle</Text>
          <Text size="xs" className="text-muted-foreground">1 passenger</Text>
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>from ₱30</Text>
        </TouchableOpacity>

        {/* Tricycle */}
        <TouchableOpacity
          className="flex-1 rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)' }}
          onPress={() => router.push('/(passenger)/booking')}
        >
          <View
            className="h-10 w-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
          >
            <Text style={{ fontSize: 20 }}>🛺</Text>
          </View>
          <Text size="sm" weight="bold" className="text-foreground">Tricycle</Text>
          <Text size="xs" className="text-muted-foreground">1–3 passengers</Text>
          <Text size="xs" weight="semibold" style={{ color: '#92400e' }}>from ₱40</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
