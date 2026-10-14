import { View, TouchableOpacity } from 'react-native';
import { Text } from 'panelui-native';
import { User, Mail, Phone, Edit3 } from 'lucide-react-native';

interface AccountDetailsProps {
  fullName: string;
  email: string;
  phone: string;
  onEdit: () => void;
}

/**
 * Account Details Component
 * Shows user's personal information with edit capability
 */
export default function AccountDetails({ fullName, email, phone, onEdit }: AccountDetailsProps) {
  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Account Details
      </Text>
      <View
        className="rounded-2xl overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        <ProfileField
          icon={<User size={16} color="#9ca3af" strokeWidth={2} />}
          label="Full Name"
          value={fullName}
          onEdit={onEdit}
        />
        <View className="h-px bg-border/40 mx-4" />
        <ProfileField
          icon={<Mail size={16} color="#9ca3af" strokeWidth={2} />}
          label="Email"
          value={email}
          onEdit={onEdit}
          sensitiveNote="Requires password confirmation"
        />
        <View className="h-px bg-border/40 mx-4" />
        <ProfileField
          icon={<Phone size={16} color="#9ca3af" strokeWidth={2} />}
          label="Mobile"
          value={phone}
          onEdit={onEdit}
          sensitiveNote="Requires password confirmation"
        />
      </View>
      <Text size="xs" className="text-muted-foreground px-1">
        Changing email or phone requires your current password for verification.
      </Text>
    </View>
  );
}

/* ─── Helper Component ────────────────────────────────────────────── */

function ProfileField({
  icon, label, value, onEdit, sensitiveNote,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit: () => void;
  sensitiveNote?: string;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 px-4 py-3.5"
      onPress={onEdit}
      activeOpacity={0.7}
    >
      {icon}
      <View className="flex-1 gap-0.5">
        <Text size="xs" className="text-muted-foreground">{label}</Text>
        <Text size="sm" weight="medium" className="text-foreground">{value}</Text>
        {sensitiveNote && (
          <Text size="xs" style={{ color: '#9ca3af' }}>{sensitiveNote}</Text>
        )}
      </View>
      <Edit3 size={14} color="#9ca3af" strokeWidth={2} />
    </TouchableOpacity>
  );
}
