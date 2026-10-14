import { View, TouchableOpacity } from 'react-native';
import { Button, Text } from 'panelui-native';
import { LogOut } from 'lucide-react-native';

interface LogoutSectionProps {
  showConfirm: boolean;
  isLoggingOut: boolean;
  onShowConfirm: () => void;
  onCancel: () => void;
  onLogout: () => void;
}

/**
 * Logout Section Component
 * Handles user logout with confirmation
 */
export default function LogoutSection({
  showConfirm,
  isLoggingOut,
  onShowConfirm,
  onCancel,
  onLogout,
}: LogoutSectionProps) {
  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Session
      </Text>
      {!showConfirm ? (
        <TouchableOpacity
          className="flex-row items-center gap-3 rounded-2xl px-4 py-4"
          style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
          onPress={onShowConfirm}
        >
          <LogOut size={18} color="#ef4444" strokeWidth={2} />
          <Text size="sm" weight="semibold" style={{ color: '#ef4444' }}>Log Out</Text>
        </TouchableOpacity>
      ) : (
        <View
          className="rounded-2xl p-4 gap-3"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderWidth: 1.5, borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>Log out of PATULOD?</Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
            Your session will be ended on this device. You can log back in at any time.
          </Text>
          <View className="flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              style={{ borderColor: '#e5e5e3' }}
              onPress={onCancel}
              disabled={isLoggingOut}
            >
              <Text size="sm" weight="semibold" className="text-foreground">Cancel</Text>
            </Button>
            <Button
              size="sm"
              className="flex-1"
              style={{ backgroundColor: '#dc2626' }}
              onPress={onLogout}
              disabled={isLoggingOut}
            >
              <Text size="sm" weight="bold" className="text-white">
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
