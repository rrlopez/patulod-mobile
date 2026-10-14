import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import {
  FileText,
  Lock,
  ShieldCheck,
  MessageCircle,
  Info,
  ChevronRight,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Policies & Support Links Component
 * Shows links to terms, privacy, safety guidelines, help, and about
 */
export default function PoliciesSupport() {
  const router = useRouter();

  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Policies & Support
      </Text>
      <View
        className="rounded-2xl overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        <LinkRow
          icon={<FileText size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
          label="Terms and Understanding"
          onPress={() => router.push('/terms')}
        />
        <View className="h-px bg-border/40 mx-4" />
        <LinkRow
          icon={<Lock size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
          label="Privacy Notice"
          onPress={() => router.push('/privacy')}
        />
        <View className="h-px bg-border/40 mx-4" />
        <LinkRow
          icon={<ShieldCheck size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
          label="Safety & Community Guidelines"
          onPress={() => router.push('/safety')}
        />
        <View className="h-px bg-border/40 mx-4" />
        <LinkRow
          icon={<MessageCircle size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
          label="Help / Support"
          onPress={() => router.push('/support')}
        />
        <View className="h-px bg-border/40 mx-4" />
        <LinkRow
          icon={<Info size={16} color={PRIMARY_GREEN} strokeWidth={2} />}
          label="About PATULOD"
          onPress={() => router.push('/about')}
        />
      </View>
    </View>
  );
}

/* ─── Helper Component ────────────────────────────────────────────── */

function LinkRow({
  icon, label, onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
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
