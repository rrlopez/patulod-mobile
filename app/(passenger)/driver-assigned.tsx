import { View, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  MapPin,
  Phone,
  Navigation,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Star,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';

const MOCK_DRIVER = {
  name: 'Pedro Bautista',
  phone: '+639171234567',
  vehicleType: 'Motorcycle',
  vehicleIcon: '🏍️',
  plateNumber: 'INC-1234',
  color: 'Red',
  rating: 4.8,
  totalTrips: 142,
  isVerified: true,
  etaMinutes: 4,
};

const MOCK_BOOKING = {
  pickup: 'Brgy. San Julian, Laoag City',
  destination: 'City Hall, F.R. Castro Ave, Laoag City',
  fareEstimate: 56,
  bookingRef: 'PTL-20261008-0042',
};

/**
 * Driver Assigned Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - Driver name, photo (mock avatar), vehicle type, plate/identifier
 * - Phone dialer button (direct call — number visible, per Safety Guidelines)
 * - "Verified" badge only shown because review actually completed (mock: true)
 * - Contact available from Driver Assigned through In Progress only
 */
export default function DriverAssigned() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [driverCardExpanded, setDriverCardExpanded] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  function handleCall() {
    Linking.openURL(`tel:${MOCK_DRIVER.phone}`);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== MOCK MAP ===== */}
      <View className="flex-1 relative">
        <View className="absolute inset-0" style={{ backgroundColor: '#e8f0e9' }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <View key={`h${i}`} className="absolute w-full" style={{ height: 1, top: `${i * 14}%`, backgroundColor: 'rgba(13,95,58,0.12)' }} />
          ))}
          {[0,1,2,3,4,5,6,7].map(i => (
            <View key={`v${i}`} className="absolute h-full" style={{ width: 1, left: `${i * 14}%`, backgroundColor: 'rgba(13,95,58,0.12)' }} />
          ))}

          {/* Driver dot */}
          <View className="absolute items-center" style={{ top: '32%', left: '38%' }}>
            <View
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: PRIMARY_GREEN, borderWidth: 3, borderColor: '#fff' }}
            >
              <Text style={{ fontSize: 18 }}>🏍️</Text>
            </View>
            <View
              className="absolute -bottom-1 h-3 w-3 rounded-sm"
              style={{ backgroundColor: PRIMARY_GREEN, transform: [{ rotate: '45deg' }] }}
            />
          </View>

          {/* Pickup pin */}
          <View className="absolute items-center" style={{ top: '52%', left: '55%' }}>
            <View
              className="h-8 w-8 rounded-full items-center justify-center"
              style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: PRIMARY_GREEN }}
            >
              <Navigation size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
            </View>
            <Text
              size="xs"
              weight="bold"
              style={{ color: PRIMARY_GREEN, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 4, borderRadius: 4, marginTop: 2 }}
            >
              You
            </Text>
          </View>

          {/* Map label */}
          <View
            className="absolute top-3 right-3 rounded-lg px-2 py-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
          >
            <Text size="xs" weight="medium" className="text-muted-foreground">Mock map • Phase 0.5</Text>
          </View>
        </View>

        {/* ===== ETA PILL ===== */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="absolute top-4 left-0 right-0 items-center"
        >
          <View
            className="flex-row items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}
          >
            <Clock size={15} color={PRIMARY_GREEN} strokeWidth={2.5} />
            <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Driver arriving in ~{MOCK_DRIVER.etaMinutes} min
            </Text>
          </View>
        </Animated.View>

        {/* ===== DRIVER CARD — bottom sheet ===== */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
          style={{
            backgroundColor: '#fff',
            paddingBottom: insets.bottom + 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* Drag handle */}
          <TouchableOpacity
            className="items-center pt-3 pb-1"
            onPress={() => setDriverCardExpanded(v => !v)}
          >
            <View className="h-1 w-10 rounded-full" style={{ backgroundColor: '#e5e5e3' }} />
          </TouchableOpacity>

          {/* Header — always visible */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-3"
            onPress={() => setDriverCardExpanded(v => !v)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="h-14 w-14 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <Text style={{ fontSize: 28 }}>👤</Text>
              </View>
              <View className="gap-0.5">
                <View className="flex-row items-center gap-1.5">
                  <Text size="base" weight="bold" className="text-foreground">{MOCK_DRIVER.name}</Text>
                  {MOCK_DRIVER.isVerified && (
                    <ShieldCheck size={15} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-0.5">
                    <Star size={12} color="#f59e0b" strokeWidth={0} fill="#f59e0b" />
                    <Text size="xs" weight="semibold" className="text-foreground">{MOCK_DRIVER.rating}</Text>
                  </View>
                  <Text size="xs" className="text-muted-foreground">•</Text>
                  <Text size="xs" className="text-muted-foreground">{MOCK_DRIVER.totalTrips} trips</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                className="h-11 w-11 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                onPress={handleCall}
              >
                <Phone size={20} color={PRIMARY_GREEN} strokeWidth={2} />
              </TouchableOpacity>
              {driverCardExpanded
                ? <ChevronDown size={18} color="#9ca3af" strokeWidth={2} />
                : <ChevronUp size={18} color="#9ca3af" strokeWidth={2} />
              }
            </View>
          </TouchableOpacity>

          {/* Expanded details */}
          {driverCardExpanded && (
            <View className="px-5 gap-4">

              {/* Vehicle */}
              <View
                className="flex-row items-center gap-3 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
              >
                <Text style={{ fontSize: 24 }}>{MOCK_DRIVER.vehicleIcon}</Text>
                <View className="flex-1">
                  <Text size="sm" weight="semibold" className="text-foreground">
                    {MOCK_DRIVER.color} {MOCK_DRIVER.vehicleType}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    Plate: <Text size="xs" weight="bold" className="text-foreground">{MOCK_DRIVER.plateNumber}</Text>
                  </Text>
                </View>
              </View>

              {/* Verification reminder */}
              <View
                className="flex-row items-start gap-2.5 rounded-xl p-3"
                style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
              >
                <ShieldCheck size={16} color="#92400e" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
                <Text size="xs" className="leading-relaxed flex-1" style={{ color: '#92400e' }}>
                  Before boarding, verify the driver's name, vehicle color, and plate number{' '}
                  <Text size="xs" weight="bold" style={{ color: '#92400e' }}>({MOCK_DRIVER.plateNumber})</Text>{' '}
                  match what is shown here.
                </Text>
              </View>

              {/* Destination + fare */}
              <View className="flex-row items-center gap-2">
                <MapPin size={14} color="#ef4444" strokeWidth={2.5} />
                <Text size="xs" className="text-muted-foreground flex-1" numberOfLines={1}>
                  {MOCK_BOOKING.destination}
                </Text>
                <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>₱{MOCK_BOOKING.fareEstimate}</Text>
              </View>

              {/* Booking ref */}
              <View className="flex-row items-center justify-between">
                <Text size="xs" className="text-muted-foreground">Booking ref</Text>
                <Text size="xs" weight="semibold" className="text-foreground">{MOCK_BOOKING.bookingRef}</Text>
              </View>

              {/* Demo: advance flow */}
              <Button
                size="md"
                className="w-full"
                style={{ backgroundColor: PRIMARY_GREEN }}
                onPress={() => router.push('/(passenger)/driver-enroute')}
              >
                <Text size="sm" weight="bold" className="text-white">Demo: Driver En Route →</Text>
              </Button>

              {/* Cancel */}
              {!showCancelConfirm ? (
                <TouchableOpacity
                  className="items-center py-2"
                  onPress={() => setShowCancelConfirm(true)}
                >
                  <Text size="sm" weight="semibold" style={{ color: '#ef4444' }}>Cancel Ride</Text>
                </TouchableOpacity>
              ) : (
                <View
                  className="rounded-2xl p-4 gap-3"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.07)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>Cancel this ride?</Text>
                  <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                    A cancellation fee may apply since a driver has already been assigned. Are you sure?
                  </Text>
                  <View className="flex-row gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      style={{ borderColor: '#e5e5e3' }}
                      onPress={() => setShowCancelConfirm(false)}
                    >
                      <Text size="sm" weight="semibold" className="text-foreground">Keep Ride</Text>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      style={{ backgroundColor: '#dc2626' }}
                      onPress={() => router.replace('/(passenger)/home')}
                    >
                      <Text size="sm" weight="bold" className="text-white">Yes, Cancel</Text>
                    </Button>
                  </View>
                </View>
              )}

            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
