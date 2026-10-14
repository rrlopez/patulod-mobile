import { View } from 'react-native';
import { Text } from 'panelui-native';
import { CheckCircle2, Edit3 } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  memberSince: string;
  onEditAvatar?: () => void;
}

/**
 * Profile Header Component
 * Shows avatar, name, role, and member since date
 */
export default function ProfileHeader({ fullName, role, memberSince, onEditAvatar }: ProfileHeaderProps) {
  return (
    <View className="items-center gap-3 pt-2 pb-2">
      <View className="relative">
        <View
          className="h-24 w-24 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
        >
          <Text style={{ fontSize: 44 }}>👤</Text>
        </View>
        <View
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full items-center justify-center"
          style={{ backgroundColor: PRIMARY_GREEN, borderWidth: 2, borderColor: '#fefdfb' }}
        >
          <Edit3 size={14} color="#fff" strokeWidth={2.5} />
        </View>
      </View>
      <View className="items-center gap-0.5">
        <Text size="xl" weight="bold" className="text-foreground">{fullName}</Text>
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
        >
          <CheckCircle2 size={12} color={PRIMARY_GREEN} strokeWidth={2.5} />
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            {role} · Member since {memberSince}
          </Text>
        </View>
      </View>
    </View>
  );
}
