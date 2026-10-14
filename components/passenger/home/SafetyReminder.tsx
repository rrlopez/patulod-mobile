import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { ChevronRight } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Safety Reminder Card
 * Links to safety guidelines
 */
export default function SafetyReminder() {
  const router = useRouter();

  return (
    <View className="px-5 pb-4">
      <TouchableOpacity
        className="flex-row items-center gap-3 rounded-2xl p-4"
        style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
        onPress={() => router.push('/safety')}
      >
        <Text style={{ fontSize: 20 }}>🛡️</Text>
        <View className="flex-1">
          <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            Safety Reminder
          </Text>
          <Text size="xs" className="text-muted-foreground">
            Always verify your driver before boarding. Tap to review guidelines.
          </Text>
        </View>
        <ChevronRight size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}
