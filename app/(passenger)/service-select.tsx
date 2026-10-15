import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import { useStore } from '@tanstack/react-store';
import { ArrowLeft, Users, CheckCircle2, Minus, Plus } from 'lucide-react-native';
import { bookingStore, bookingActions } from '../../lib/stores/booking-store';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

/**
 * Mock service types.
 * In Phase 2 these come from FareConfig — vehicleType, capacity, baseFare.
 */
const SERVICE_TYPES = [
  {
    id: 'MOTORCYCLE',
    label: 'Motorcycle',
    icon: '🏍️',
    description: 'Fast and affordable for solo trips',
    capacity: 1,
    baseFare: 30,
    perKm: 8,
    eta: '2–5 min',
    available: true,
  },
  {
    id: 'TRICYCLE',
    label: 'Tricycle',
    icon: '🛺',
    description: 'Comfortable for small groups and errands',
    capacity: 3,
    baseFare: 40,
    perKm: 10,
    eta: '3–7 min',
    available: true,
  },
  {
    id: 'VAN',
    label: 'Van / FX',
    icon: '🚐',
    description: 'Spacious for larger groups or cargo',
    capacity: 6,
    baseFare: 80,
    perKm: 15,
    eta: '5–10 min',
    available: false, // not yet available in service area
  },
];

/**
 * Service & Capacity Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - Show available vehicle/service types and capacity
 * - Passenger count input (reject over-capacity)
 * - Selecting a type + count unlocks Continue
 */
export default function ServiceSelect() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const draftBooking = useStore(bookingStore, (state) => state.draftBooking);

  const [selectedId, setSelectedId] = useState<string | null>(draftBooking.serviceType || null);
  const [passengerCount, setPassengerCount] = useState(draftBooking.passengerCount || 1);

  const selected = SERVICE_TYPES.find(s => s.id === selectedId);
  const overCapacity = selected ? passengerCount > selected.capacity : false;
  const canProceed = !!selected && !overCapacity;

  function increment() {
    if (!selected) return;
    if (passengerCount < selected.capacity) setPassengerCount(c => c + 1);
  }

  function decrement() {
    if (passengerCount > 1) setPassengerCount(c => c - 1);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    // Reset count to 1 when switching vehicle type
    setPassengerCount(1);
  }

  function handleContinue() {
    if (!selected) return;

    // Save to store
    bookingActions.updateDraftBooking({
      serviceType: selected.id,
      passengerCount,
    });

    bookingActions.setCurrentScreen('fare-estimate');
    router.push('/(passenger)/fare-estimate');
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <View className="flex-1">
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Choose Service
          </Text>
          <Text size="xs" className="text-muted-foreground">
            Step 2 of 4
          </Text>
        </View>
      </View>

      {/* ===== PROGRESS BAR ===== */}
      <View className="px-5 pb-4">
        <View className="flex-row gap-1.5">
          {[1, 2, 3, 4].map(step => (
            <View
              key={step}
              className="flex-1 rounded-full"
              style={{
                height: 3,
                backgroundColor: step <= 2 ? PRIMARY_GREEN : '#e5e5e3',
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-5 gap-6">

          {/* ===== SERVICE TYPE CARDS ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Vehicle Type
            </Text>

            {SERVICE_TYPES.map(service => {
              const isSelected = selectedId === service.id;
              const isUnavailable = !service.available;

              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => service.available && handleSelect(service.id)}
                  activeOpacity={service.available ? 0.75 : 1}
                >
                  <View
                    className="rounded-2xl p-4"
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected
                        ? PRIMARY_GREEN
                        : isUnavailable
                        ? '#e5e5e3'
                        : '#e5e5e3',
                      backgroundColor: isSelected
                        ? 'rgba(13, 95, 58, 0.05)'
                        : isUnavailable
                        ? 'rgba(0,0,0,0.02)'
                        : '#fff',
                      opacity: isUnavailable ? 0.5 : 1,
                    }}
                  >
                    <View className="flex-row items-start gap-4">
                      {/* Icon */}
                      <View
                        className="h-14 w-14 rounded-2xl items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? 'rgba(13, 95, 58, 0.1)'
                            : 'rgba(0,0,0,0.04)',
                        }}
                      >
                        <Text style={{ fontSize: 28 }}>{service.icon}</Text>
                      </View>

                      {/* Info */}
                      <View className="flex-1 gap-1">
                        <View className="flex-row items-center justify-between">
                          <Text size="base" weight="bold" className="text-foreground">
                            {service.label}
                          </Text>
                          {isSelected && (
                            <CheckCircle2 size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                          )}
                          {isUnavailable && (
                            <View
                              className="rounded-full px-2 py-0.5"
                              style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                            >
                              <Text size="xs" weight="medium" className="text-muted-foreground">
                                Unavailable
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text size="xs" className="text-muted-foreground">
                          {service.description}
                        </Text>

                        <View className="flex-row items-center gap-4 pt-1">
                          <View className="flex-row items-center gap-1">
                            <Users size={13} color="#9ca3af" strokeWidth={2} />
                            <Text size="xs" className="text-muted-foreground">
                              Up to {service.capacity} pax
                            </Text>
                          </View>
                          <Text size="xs" className="text-muted-foreground">
                            ⏱ {service.eta}
                          </Text>
                          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                            from ₱{service.baseFare}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ===== PASSENGER COUNT ===== */}
          {selected && (
            <View className="gap-3">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Number of Passengers
              </Text>

              <View
                className="rounded-2xl p-4 gap-4"
                style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e5e3' }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="gap-0.5">
                    <Text size="sm" weight="semibold" className="text-foreground">
                      Passengers
                    </Text>
                    <Text size="xs" className="text-muted-foreground">
                      Max {selected.capacity} for {selected.label}
                    </Text>
                  </View>

                  {/* Counter */}
                  <View className="flex-row items-center gap-4">
                    <TouchableOpacity
                      className="h-10 w-10 rounded-full items-center justify-center"
                      style={{
                        borderWidth: 1.5,
                        borderColor: passengerCount <= 1 ? '#e5e5e3' : PRIMARY_GREEN,
                        backgroundColor: passengerCount <= 1 ? 'transparent' : 'rgba(13, 95, 58, 0.06)',
                      }}
                      onPress={decrement}
                      disabled={passengerCount <= 1}
                    >
                      <Minus
                        size={16}
                        color={passengerCount <= 1 ? '#9ca3af' : PRIMARY_GREEN}
                        strokeWidth={2.5}
                      />
                    </TouchableOpacity>

                    <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN, minWidth: 28, textAlign: 'center' }}>
                      {passengerCount}
                    </Text>

                    <TouchableOpacity
                      className="h-10 w-10 rounded-full items-center justify-center"
                      style={{
                        borderWidth: 1.5,
                        borderColor: passengerCount >= selected.capacity ? '#e5e5e3' : PRIMARY_GREEN,
                        backgroundColor: passengerCount >= selected.capacity ? 'transparent' : 'rgba(13, 95, 58, 0.06)',
                      }}
                      onPress={increment}
                      disabled={passengerCount >= selected.capacity}
                    >
                      <Plus
                        size={16}
                        color={passengerCount >= selected.capacity ? '#9ca3af' : PRIMARY_GREEN}
                        strokeWidth={2.5}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Over-capacity error */}
                {overCapacity && (
                  <View
                    className="rounded-xl p-3"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.07)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.25)' }}
                  >
                    <Text size="xs" weight="medium" style={{ color: '#dc2626' }}>
                      ⚠️ This vehicle can carry a maximum of {selected.capacity} passenger{selected.capacity > 1 ? 's' : ''}. Please book multiple rides if needed.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ===== FARE NOTE ===== */}
          {selected && (
            <View
              className="rounded-2xl p-4 gap-1"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <Text size="xs" weight="bold" style={{ color: '#92400e' }}>
                💡 About Fares
              </Text>
              <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
                Starting from ₱{selected.baseFare} + ₱{selected.perKm}/km. An exact fare estimate will be shown on the next screen before you confirm.
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* ===== CONTINUE — pinned bottom ===== */}
      <View
        className="px-5 pt-3"
        style={{
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e3',
          backgroundColor: '#fefdfb',
        }}
      >
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: canProceed ? PRIMARY_GREEN : '#9ca3af' }}
          disabled={!canProceed}
          onPress={handleContinue}
        >
          <Text size="base" weight="bold" className="text-white">
            {canProceed ? `Continue with ${selected!.label}` : 'Select a vehicle type'}
          </Text>
        </Button>
      </View>

    </View>
  );
}
