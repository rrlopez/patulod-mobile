import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { Banknote, Clock, User, ChevronRight } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

export function QuickLinks() {
  const router = useRouter();

  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Quick Access
      </Text>
      <View
        className="rounded-2xl overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        <QuickLink 
          label="Earnings Summary" 
          icon={<Banknote size={16} color={PRIMARY_GREEN} strokeWidth={2} />} 
          onPress={() => router.push('/(driver)/earnings')} 
        />
        <View className="h-px bg-border/40 mx-4" />
        <QuickLink 
          label="Trip History" 
          icon={<Clock size={16} color={PRIMARY_GREEN} strokeWidth={2} />} 
          onPress={() => router.push('/(driver)/trip-history')} 
        />
        <View className="h-px bg-border/40 mx-4" />
        <QuickLink 
          label="My Profile & Vehicle" 
          icon={<User size={16} color={PRIMARY_GREEN} strokeWidth={2} />} 
          onPress={() => router.push('/(driver)/profile')} 
        />
      </View>
    </View>
  );
}

function QuickLink({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3.5"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text size="sm" weight="medium" className="text-foreground flex-1">{label}</Text>
      <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
    </TouchableOpacity>
  );
}
