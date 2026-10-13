import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ShieldCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Linking } from 'react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

const MOCK_DRIVER = {
  name: 'Pedro Bautista',
  phone: '+639171234567',
  vehicleType: 'Motorcycle',
  vehicleIcon: '🏍️',
  plateNumber: 'INC-1234',
  color: 'Red',
  isVerified: true,
};

const CHECKLIST = [
  {
    id: 'name',
    label: 'Driver name matches',
    detail: `The driver's name is "${MOCK_DRIVER.name}"`,
  },
  {
    id: 'vehicle',
    label: 'Vehicle type matches',
    detail: `${MOCK_DRIVER.color} ${MOCK_DRIVER.vehicleType}`,
  },
  {
    id: 'plate',
    label: 'Plate number matches',
    detail: `Plate: ${MOCK_DRIVER.plateNumber}`,
  },
];

/**
 * Pickup Verification Prompt
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 3:
 * - Before boarding, passenger prompted to verify:
 *   driver name, vehicle type, plate number
 * - If anything does not match → do not board, report flow
 * - All 3 checks required to proceed to in-progress trip
 */
export default function PickupVerify() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showMismatch, setShowMismatch] = useState(false);

  const allChecked = CHECKLIST.every(item => checked[item.id]);

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    setShowMismatch(false);
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-5 gap-6 pt-6 pb-8">

          {/* ===== HEADER ===== */}
          <Animated.View entering={FadeIn.duration(400)} className="items-center gap-4">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <ShieldCheck size={40} color={PRIMARY_GREEN} strokeWidth={1.75} />
            </View>
            <View className="items-center gap-2">
              <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }} className="text-center">
                Verify Before Boarding
              </Text>
              <Text size="sm" className="text-muted-foreground text-center leading-relaxed px-4">
                Check that the driver and vehicle match before you get in. This is your safety checkpoint.
              </Text>
            </View>
          </Animated.View>

          {/* ===== DRIVER INFO CARD ===== */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View
              className="rounded-3xl p-5 gap-4"
              style={{ backgroundColor: PRIMARY_GREEN }}
            >
              <Text size="xs" weight="bold" style={{ color: 'rgba(255,255,255,0.65)' }} className="uppercase tracking-wider">
                Your Driver
              </Text>
              <View className="flex-row items-center gap-4">
                <View
                  className="h-14 w-14 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <Text style={{ fontSize: 28 }}>👤</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <View className="flex-row items-center gap-2">
                    <Text size="lg" weight="bold" className="text-white">{MOCK_DRIVER.name}</Text>
                    {MOCK_DRIVER.isVerified && (
                      <ShieldCheck size={16} color="#fbbf24" strokeWidth={2.5} />
                    )}
                  </View>
                  <Text size="sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {MOCK_DRIVER.color} {MOCK_DRIVER.vehicleType}
                  </Text>
                </View>
              </View>

              {/* Plate — large and prominent */}
              <View
                className="rounded-2xl items-center py-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <Text size="xs" weight="bold" style={{ color: 'rgba(255,255,255,0.6)' }} className="uppercase tracking-widest">
                  Plate Number
                </Text>
                <Text weight="bold" className="text-white" style={{ fontSize: 28, letterSpacing: 4, marginTop: 2 }}>
                  {MOCK_DRIVER.plateNumber}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ===== CHECKLIST ===== */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Confirm Each Item
            </Text>

            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3' }}
            >
              {CHECKLIST.map((item, i) => (
                <View key={item.id}>
                  <TouchableOpacity
                    className="flex-row items-center gap-3 px-4 py-4"
                    onPress={() => toggle(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={{ marginTop: 1 }}>
                      {checked[item.id]
                        ? <CheckSquare size={22} color={PRIMARY_GREEN} strokeWidth={2} />
                        : <Square size={22} color="#9ca3af" strokeWidth={2} />
                      }
                    </View>
                    <View className="flex-1">
                      <Text
                        size="sm"
                        weight="semibold"
                        style={{ color: checked[item.id] ? PRIMARY_GREEN : '#1a1a1a' }}
                      >
                        {item.label}
                      </Text>
                      <Text size="xs" weight="medium" className="text-muted-foreground">
                        {item.detail}
                      </Text>
                    </View>
                    {checked[item.id] && (
                      <CheckCircle2 size={18} color={PRIMARY_GREEN} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  {i < CHECKLIST.length - 1 && (
                    <View className="h-px bg-border/40 mx-4" />
                  )}
                </View>
              ))}
            </View>

            {/* Progress indicator */}
            <View className="flex-row items-center gap-2 px-1">
              <View className="flex-row gap-1.5 flex-1">
                {CHECKLIST.map(item => (
                  <View
                    key={item.id}
                    className="flex-1 rounded-full"
                    style={{
                      height: 3,
                      backgroundColor: checked[item.id] ? PRIMARY_GREEN : '#e5e5e3',
                    }}
                  />
                ))}
              </View>
              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                {Object.values(checked).filter(Boolean).length}/{CHECKLIST.length}
              </Text>
            </View>
          </Animated.View>

          {/* ===== SOMETHING DOESN'T MATCH ===== */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            {!showMismatch ? (
              <TouchableOpacity
                className="items-center py-2 flex-row justify-center gap-2"
                onPress={() => setShowMismatch(true)}
              >
                <XCircle size={16} color="#ef4444" strokeWidth={2} />
                <Text size="sm" weight="semibold" style={{ color: '#ef4444' }}>
                  Something doesn't match
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                className="rounded-2xl p-4 gap-3"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.07)', borderWidth: 1.5, borderColor: 'rgba(239, 68, 68, 0.25)' }}
              >
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={18} color={ERROR_RED} strokeWidth={2.5} />
                  <Text size="sm" weight="bold" style={{ color: ERROR_RED }}>Do Not Board</Text>
                </View>
                <Text size="xs" className="leading-relaxed" style={{ color: '#991b1b' }}>
                  If the driver name, vehicle, or plate number does not match what is shown above — do not enter the vehicle. Step away to a safe, visible location.
                </Text>
                <View className="gap-2">
                  <Button
                    size="sm"
                    className="w-full"
                    style={{ backgroundColor: ERROR_RED }}
                    onPress={() => Linking.openURL(`tel:${MOCK_DRIVER.phone}`)}
                  >
                    <View className="flex-row items-center gap-2">
                      <Phone size={15} color="#fff" strokeWidth={2.5} />
                      <Text size="sm" weight="bold" className="text-white">Call Driver to Clarify</Text>
                    </View>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    style={{ borderColor: ERROR_RED }}
                    onPress={() => router.replace('/(passenger)/home')}
                  >
                    <Text size="sm" weight="semibold" style={{ color: ERROR_RED }}>Cancel & Go Back to Safety</Text>
                  </Button>
                </View>
                <Text size="xs" className="text-center" style={{ color: '#991b1b' }}>
                  You can also report this through Help / Support after you are safe.
                </Text>
              </View>
            )}
          </Animated.View>

        </View>
      </ScrollView>

      {/* ===== BOARD BUTTON — pinned bottom ===== */}
      <View
        className="px-5 pt-3"
        style={{
          borderTopWidth: 1,
          borderTopColor: '#e5e5e3',
          backgroundColor: '#fefdfb',
        }}
      >
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: allChecked ? PRIMARY_GREEN : '#9ca3af' }}
          disabled={!allChecked}
          onPress={() => router.replace('/(passenger)/trip-inprogress')}
        >
          <Text size="base" weight="bold" className="text-white">
            {allChecked ? "All Good — I'm Boarding" : 'Confirm All 3 Items to Board'}
          </Text>
        </Button>
      </View>
    </View>
  );
}
