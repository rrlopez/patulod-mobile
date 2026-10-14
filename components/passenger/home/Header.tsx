import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { Bell, User } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

interface HeaderProps {
  userName: string;
  hasUnreadNotifications?: boolean;
}

/**
 * Passenger Home Header
 * Shows greeting, user name, and action buttons
 */
export default function Header({ userName, hasUnreadNotifications = false }: HeaderProps) {
  const router = useRouter();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-row items-center justify-between px-5 py-3">
      <View className="gap-0.5">
        <Text size="xs" className="text-muted-foreground">{getGreeting()},</Text>
        <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>
          {userName}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
          onPress={() => router.push('/(passenger)/notifications')}
        >
          <View className="relative">
            <Bell size={20} color={PRIMARY_GREEN} strokeWidth={2} />
            {hasUnreadNotifications && (
              <View
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#fefdfb' }}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
          onPress={() => router.push('/(passenger)/profile')}
        >
          <User size={20} color={PRIMARY_GREEN} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
