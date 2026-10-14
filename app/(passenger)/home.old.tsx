import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text, Card } from 'panelui-native';
import {
  MapPin,
  Clock,
  ChevronRight,
  Bell,
  User,
  Navigation,
  Star,
  Bike,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

/** Mock recent destinations */
const RECENT_DESTINATIONS = [
  { id: '1', label: 'Home', address: 'Brgy. San Julian, Laoag City', icon: '🏠' },
  { id: '2', label: 'Work', address: 'City Hall, Laoag City', icon: '🏢' },
  { id: '3', label: 'Market', address: 'Ilocos Norte Provincial Capitol Market', icon: '🛒' },
];

/** Mock quick destinations */
const QUICK_DESTINATIONS = [
  { id: '1', label: 'Hospital', icon: '🏥' },
  { id: '2', label: 'School', icon: '🏫' },
  { id: '3', label: 'Market', icon: '🛒' },
  { id: '4', label: 'Church', icon: '⛪' },
];

/**
 * Passenger Home Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - "Book a Ride" / "Plan your ride" — no "dummy booking" wording
 * - "Driver" not "rider"
 * - Entry point to the booking flow
 */
export default function PassengerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== TOP BAR ===== */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="gap-0.5">
          <Text size="xs" className="text-muted-foreground">Good morning,</Text>
          <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>Juan dela Cruz</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
            onPress={() => router.push('/(passenger)/notifications')}
          >
            {/* Unread dot */}
            <View className="relative">
              <Bell size={20} color={PRIMARY_GREEN} strokeWidth={2} />
              <View
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#fefdfb' }}
              />
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* ===== BOOK A RIDE — MAIN CTA ===== */}
        <View className="px-5 pt-2 pb-6">
          <TouchableOpacity
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: PRIMARY_GREEN,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 6,
            }}
            activeOpacity={0.92}
            onPress={() => router.push('/(passenger)/booking')}
          >
            <View className="px-6 py-8 gap-4">
              {/* Header row */}
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text size="2xl" weight="bold" className="text-white">
                    Book a Ride
                  </Text>
                  <Text size="sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Where are you going?
                  </Text>
                </View>
                <View
                  className="h-14 w-14 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <Navigation size={28} color="#fff" strokeWidth={2} />
                </View>
              </View>

              {/* Mock destination input */}
              <View
                className="flex-row items-center gap-3 rounded-2xl px-4 py-3.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <MapPin size={18} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                <Text size="sm" style={{ color: 'rgba(255,255,255,0.65)', flex: 1 }}>
                  Enter your destination…
                </Text>
                <ChevronRight size={16} color="rgba(255,255,255,0.6)" strokeWidth={2.5} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ===== QUICK DESTINATIONS ===== */}
        <View className="px-5 gap-3 pb-6">
          <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
            Quick Destinations
          </Text>
          <View className="flex-row gap-3">
            {QUICK_DESTINATIONS.map(dest => (
              <TouchableOpacity
                key={dest.id}
                className="flex-1 items-center gap-2 rounded-2xl py-4"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
                onPress={() => router.push('/(passenger)/booking')}
              >
                <Text style={{ fontSize: 22 }}>{dest.icon}</Text>
                <Text size="xs" weight="semibold" className="text-foreground">{dest.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== RECENT DESTINATIONS ===== */}
        <View className="px-5 gap-3 pb-6">
          <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
            Recent
          </Text>
          <Card className="overflow-hidden">
            {RECENT_DESTINATIONS.map((dest, i) => (
              <View key={dest.id}>
                <TouchableOpacity
                  className="flex-row items-center gap-3 px-4 py-3.5"
                  onPress={() => router.push('/(passenger)/booking')}
                  activeOpacity={0.7}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
                  >
                    <Text style={{ fontSize: 18 }}>{dest.icon}</Text>
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text size="sm" weight="semibold" className="text-foreground">{dest.label}</Text>
                    <Text size="xs" className="text-muted-foreground" numberOfLines={1}>{dest.address}</Text>
                  </View>
                  <Clock size={14} color="#9ca3af" strokeWidth={2} />
                </TouchableOpacity>
                {i < RECENT_DESTINATIONS.length - 1 && (
                  <View className="h-px bg-border/40 mx-4" />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* ===== SERVICE INFO CARDS ===== */}
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

        {/* ===== SAFETY REMINDER ===== */}
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

      </ScrollView>
    </View>
  );
}
