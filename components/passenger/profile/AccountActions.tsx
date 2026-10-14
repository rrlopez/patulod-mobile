import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import { UserX, Trash2, ChevronRight } from 'lucide-react-native';

interface AccountActionsProps {
  showDeactivateConfirm: boolean;
  showDeleteConfirm: boolean;
  onToggleDeactivate: () => void;
  onToggleDelete: () => void;
}

/**
 * Account Actions Component
 * Handles account deactivation and deletion requests
 */
export default function AccountActions({
  showDeactivateConfirm,
  showDeleteConfirm,
  onToggleDeactivate,
  onToggleDelete,
}: AccountActionsProps) {
  const router = useRouter();

  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Account
      </Text>
      <View
        className="rounded-2xl overflow-hidden"
        style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
      >
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 py-4"
          onPress={onToggleDeactivate}
        >
          <UserX size={16} color="#9ca3af" strokeWidth={2} />
          <Text size="sm" weight="medium" className="text-muted-foreground flex-1">
            Deactivate Account
          </Text>
          <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
        </TouchableOpacity>
        <View className="h-px bg-border/40 mx-4" />
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 py-4"
          onPress={onToggleDelete}
        >
          <Trash2 size={16} color="#9ca3af" strokeWidth={2} />
          <Text size="sm" weight="medium" className="text-muted-foreground flex-1">
            Request Account Deletion
          </Text>
          <ChevronRight size={15} color="#9ca3af" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Deactivate explanation */}
      {showDeactivateConfirm && (
        <View
          className="rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.07)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
        >
          <Text size="sm" weight="bold" style={{ color: '#92400e' }}>About Deactivation</Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
            Deactivating your account suspends your access to PATULOD. Your data is retained and you can reactivate at any time by logging back in. Any active rides must be resolved first.
          </Text>
          <Button
            size="sm"
            className="w-full mt-1"
            style={{ backgroundColor: '#92400e' }}
            onPress={() => router.push('/support')}
          >
            <Text size="sm" weight="bold" className="text-white">Contact Support to Deactivate</Text>
          </Button>
        </View>
      )}

      {/* Delete explanation */}
      {showDeleteConfirm && (
        <View
          className="rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>About Account Deletion</Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
            Requesting deletion removes your personal data from PATULOD. Some records (e.g. trip history for audit purposes) may be retained for a legally required period. Deletion is not immediate and cannot be undone.
          </Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
            We will confirm what data is retained and why before proceeding.
          </Text>
          <Button
            size="sm"
            className="w-full mt-1"
            style={{ backgroundColor: '#dc2626' }}
            onPress={() => router.push('/support')}
          >
            <Text size="sm" weight="bold" className="text-white">Contact Support to Request Deletion</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
