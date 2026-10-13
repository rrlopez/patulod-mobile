import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Car,
  Banknote,
  Info,
  Check,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

type NotifType = 'TRIP' | 'PAYMENT' | 'SYSTEM' | 'SAFETY' | 'DRIVER';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionRoute?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'TRIP',
    title: 'Trip Completed',
    body: 'Your ride to City Hall has been completed. Fare: ₱60. Please pay your driver.',
    time: 'Just now',
    read: false,
    actionRoute: '/(passenger)/trip-complete',
  },
  {
    id: '2',
    type: 'DRIVER',
    title: 'Driver Assigned',
    body: 'Pedro Bautista is on the way. Red Motorcycle · INC-1234. ETA: ~4 min.',
    time: '14 min ago',
    read: false,
    actionRoute: '/(passenger)/driver-assigned',
  },
  {
    id: '3',
    type: 'PAYMENT',
    title: 'Payment Confirmed',
    body: 'Cash payment of ₱56 confirmed for booking PTL-20261007-0031.',
    time: 'Yesterday · 3:02 PM',
    read: true,
    actionRoute: '/(passenger)/trip-summary',
  },
  {
    id: '4',
    type: 'TRIP',
    title: 'Ride Cancelled',
    body: 'Your booking PTL-20261006-0018 was cancelled. No charge was applied.',
    time: 'Oct 6 · 7:25 AM',
    read: true,
    actionRoute: '/(passenger)/history',
  },
  {
    id: '5',
    type: 'SAFETY',
    title: 'Safety Reminder',
    body: "Always verify your driver's name, vehicle, and plate before boarding.",
    time: 'Oct 5 · 5:30 PM',
    read: true,
    actionRoute: '/safety',
  },
  {
    id: '6',
    type: 'TRIP',
    title: 'No Driver Found',
    body: 'We couldn\'t find an available driver for your booking PTL-20261004-0003. Please try again.',
    time: 'Oct 4 · 11:12 PM',
    read: true,
    actionRoute: '/(passenger)/home',
  },
  {
    id: '7',
    type: 'SYSTEM',
    title: 'Welcome to PATULOD',
    body: 'Your account has been created. Review our Safety Guidelines before your first ride.',
    time: 'Oct 3 · 8:00 AM',
    read: true,
    actionRoute: '/safety',
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  TRIP: {
    icon: <Car size={18} color={PRIMARY_GREEN} strokeWidth={2} />,
    color: PRIMARY_GREEN,
    bg: 'rgba(13, 95, 58, 0.1)',
  },
  DRIVER: {
    icon: <Car size={18} color="#0369a1" strokeWidth={2} />,
    color: '#0369a1',
    bg: 'rgba(3, 105, 161, 0.1)',
  },
  PAYMENT: {
    icon: <Banknote size={18} color="#059669" strokeWidth={2} />,
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.1)',
  },
  SAFETY: {
    icon: <AlertTriangle size={18} color="#92400e" strokeWidth={2} />,
    color: '#92400e',
    bg: 'rgba(251, 191, 36, 0.15)',
  },
  SYSTEM: {
    icon: <Info size={18} color="#6d28d9" strokeWidth={2} />,
    color: '#6d28d9',
    bg: 'rgba(109, 40, 217, 0.1)',
  },
};

/**
 * Notifications List Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 0.5:
 * - Unread/read states
 * - Notification types
 */
export default function Notifications() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function handleTap(notif: Notification) {
    markRead(notif.id);
    if (notif.actionRoute) {
      router.push(notif.actionRoute as any);
    }
  }

  const todayNotifs = notifications.filter(n =>
    n.time.includes('now') || n.time.includes('min ago')
  );
  const earlierNotifs = notifications.filter(n =>
    !n.time.includes('now') && !n.time.includes('min ago')
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <View className="flex-row items-center gap-2">
            <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Notifications</Text>
            {unreadCount > 0 && (
              <View
                className="h-5 min-w-5 rounded-full items-center justify-center px-1"
                style={{ backgroundColor: '#ef4444' }}
              >
                <Text size="xs" weight="bold" className="text-white">{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            className="flex-row items-center gap-1.5"
            onPress={markAllRead}
            hitSlop={8}
          >
            <Check size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
            <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >

        {notifications.length === 0 ? (
          /* ===== EMPTY STATE ===== */
          <View className="items-center justify-center gap-4 py-24 px-8">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.07)' }}
            >
              <Bell size={36} color="#9ca3af" strokeWidth={1.75} />
            </View>
            <View className="items-center gap-1.5">
              <Text size="lg" weight="bold" className="text-foreground">No Notifications</Text>
              <Text size="sm" className="text-muted-foreground text-center">
                You're all caught up. Notifications about your rides and account will appear here.
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-1">

            {/* ===== TODAY / RECENT ===== */}
            {todayNotifs.length > 0 && (
              <View>
                <View className="px-5 py-2">
                  <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                    Recent
                  </Text>
                </View>
                {todayNotifs.map(notif => (
                  <NotifRow key={notif.id} notif={notif} onTap={handleTap} />
                ))}
              </View>
            )}

            {/* ===== EARLIER ===== */}
            {earlierNotifs.length > 0 && (
              <View>
                <View className="px-5 py-2 mt-2">
                  <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                    Earlier
                  </Text>
                </View>
                {earlierNotifs.map(notif => (
                  <NotifRow key={notif.id} notif={notif} onTap={handleTap} />
                ))}
              </View>
            )}

          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ─── Notification row ───────────────────────────────────────────────────── */

function NotifRow({
  notif,
  onTap,
}: {
  notif: Notification;
  onTap: (n: Notification) => void;
}) {
  const cfg = TYPE_CONFIG[notif.type];

  return (
    <TouchableOpacity
      className="flex-row items-start gap-3 px-5 py-4"
      style={{
        backgroundColor: notif.read ? 'transparent' : 'rgba(13, 95, 58, 0.04)',
        borderLeftWidth: notif.read ? 0 : 3,
        borderLeftColor: PRIMARY_GREEN,
      }}
      onPress={() => onTap(notif)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        className="h-10 w-10 rounded-full items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: cfg.bg }}
      >
        {cfg.icon}
      </View>

      {/* Content */}
      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <Text
            size="sm"
            weight={notif.read ? 'medium' : 'bold'}
            className="text-foreground flex-1"
          >
            {notif.title}
          </Text>
          {/* Unread dot */}
          {!notif.read && (
            <View
              className="h-2 w-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: '#ef4444' }}
            />
          )}
        </View>
        <Text size="xs" className="text-muted-foreground leading-relaxed">
          {notif.body}
        </Text>
        <Text size="xs" style={{ color: notif.read ? '#9ca3af' : PRIMARY_GREEN }} className="font-medium">
          {notif.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
