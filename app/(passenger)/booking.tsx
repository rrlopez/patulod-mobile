import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  X,
  ChevronRight,
  LocateFixed,
  ArrowDownUp,
  Clock,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/** Mock recent/saved places */
const SUGGESTIONS = [
  { id: '1', label: 'City Hall', address: 'F.R. Castro Ave, Laoag City', icon: '🏛️' },
  { id: '2', label: 'Ilocos Norte Capitol', address: 'Brgy. 1, Laoag City', icon: '🏛️' },
  { id: '3', label: 'Laoag Public Market', address: 'Brgy. 2, Laoag City', icon: '🛒' },
  { id: '4', label: 'Marcos International Airport', address: 'Brgy. 35, Laoag City', icon: '✈️' },
  { id: '5', label: 'Ilocos Norte Provincial Hospital', address: 'Brgy. San Matias, Laoag City', icon: '🏥' },
];

const RECENT = [
  { id: '1', label: 'Home', address: 'Brgy. San Julian, Laoag City', icon: '🏠' },
  { id: '2', label: 'Work', address: 'City Hall, F.R. Castro Ave', icon: '🏢' },
];

/**
 * Booking Form Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 2:
 * - Pickup location: manual address/landmark entry OR current location
 * - Destination: required
 * - Map pin confirmation view (mock map)
 * - Both fields required before proceeding
 */
export default function Booking() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);

  const pickupDisplay = usingCurrentLocation ? 'Current Location (GPS)' : pickup;
  const canProceed = (pickup.trim().length > 0 || usingCurrentLocation) && destination.trim().length > 0;

  // Which suggestions to show based on active field
  const activeSuggestions = activeField === 'destination' ? SUGGESTIONS : RECENT;

  function handleUseCurrentLocation() {
    setUsingCurrentLocation(true);
    setPickup('');
    setActiveField(null);
  }

  function handleSwap() {
    if (usingCurrentLocation) return; // can't swap GPS
    const tmp = pickup;
    setPickup(destination);
    setDestination(tmp);
  }

  function handleSuggestion(label: string, address: string) {
    if (activeField === 'pickup') {
      setPickup(`${label} — ${address}`);
      setUsingCurrentLocation(false);
    } else if (activeField === 'destination') {
      setDestination(`${label} — ${address}`);
    }
    setActiveField(null);
  }

  function handleContinue() {
    router.push('/(passenger)/service-select');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

        {/* ===== HEADER ===== */}
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Plan Your Ride
          </Text>
        </View>

        {/* ===== INPUT PANEL ===== */}
        <View className="px-5 gap-3 pb-4">

          {/* Pickup + Destination stacked with swap */}
          <View
            className="rounded-3xl overflow-hidden"
            style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
          >
            {/* Pickup row */}
            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-3.5"
              onPress={() => setActiveField('pickup')}
              activeOpacity={0.7}
            >
              <View className="items-center gap-1">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: PRIMARY_GREEN }}
                />
                <View className="w-px flex-1" style={{ backgroundColor: '#e5e5e3', minHeight: 8 }} />
              </View>
              {usingCurrentLocation ? (
                <View className="flex-1 flex-row items-center gap-2">
                  <LocateFixed size={16} color={PRIMARY_GREEN} strokeWidth={2} />
                  <Text size="sm" weight="medium" style={{ color: PRIMARY_GREEN }}>
                    Current Location (GPS)
                  </Text>
                </View>
              ) : (
                <TextInput
                  className="flex-1"
                  placeholder="Enter pickup location or landmark"
                  placeholderTextColor="#9ca3af"
                  value={pickup}
                  onChangeText={v => { setPickup(v); setUsingCurrentLocation(false); }}
                  onFocus={() => setActiveField('pickup')}
                  returnKeyType="next"
                  style={{ fontSize: 14, color: '#1a1a1a' }}
                />
              )}
              {(pickup.length > 0 || usingCurrentLocation) && (
                <TouchableOpacity
                  onPress={() => { setPickup(''); setUsingCurrentLocation(false); }}
                  hitSlop={8}
                >
                  <X size={16} color="#9ca3af" strokeWidth={2.5} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>

            {/* Divider with swap button */}
            <View className="flex-row items-center px-4">
              <View className="h-px flex-1" style={{ backgroundColor: '#e5e5e3' }} />
              <TouchableOpacity
                className="mx-3 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
                onPress={handleSwap}
                hitSlop={8}
              >
                <ArrowDownUp size={14} color={PRIMARY_GREEN} strokeWidth={2.5} />
              </TouchableOpacity>
              <View className="h-px flex-1" style={{ backgroundColor: '#e5e5e3' }} />
            </View>

            {/* Destination row */}
            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-3.5"
              onPress={() => setActiveField('destination')}
              activeOpacity={0.7}
            >
              <MapPin size={16} color="#ef4444" strokeWidth={2.5} />
              <TextInput
                className="flex-1"
                placeholder="Enter destination"
                placeholderTextColor="#9ca3af"
                value={destination}
                onChangeText={setDestination}
                onFocus={() => setActiveField('destination')}
                returnKeyType="done"
                style={{ fontSize: 14, color: '#1a1a1a' }}
              />
              {destination.length > 0 && (
                <TouchableOpacity onPress={() => setDestination('')} hitSlop={8}>
                  <X size={16} color="#9ca3af" strokeWidth={2.5} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          {/* Use current location button */}
          {!usingCurrentLocation && (
            <TouchableOpacity
              className="flex-row items-center gap-2 self-start px-1"
              onPress={handleUseCurrentLocation}
            >
              <LocateFixed size={15} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                Use my current location as pickup
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ===== SUGGESTIONS / MOCK MAP ===== */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeField ? (
            /* Suggestions list */
            <View className="px-5 gap-3">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                {activeField === 'pickup' ? 'Recent Places' : 'Suggestions'}
              </Text>
              <View
                className="rounded-2xl overflow-hidden"
                style={{ borderWidth: 1, borderColor: '#e5e5e3' }}
              >
                {activeSuggestions.map((s, i) => (
                  <View key={s.id}>
                    <TouchableOpacity
                      className="flex-row items-center gap-3 px-4 py-3.5"
                      onPress={() => handleSuggestion(s.label, s.address)}
                      activeOpacity={0.7}
                    >
                      <View
                        className="h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(13, 95, 58, 0.07)' }}
                      >
                        <Text style={{ fontSize: 18 }}>{s.icon}</Text>
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text size="sm" weight="semibold" className="text-foreground">{s.label}</Text>
                        <Text size="xs" className="text-muted-foreground" numberOfLines={1}>{s.address}</Text>
                      </View>
                      <ChevronRight size={14} color="#9ca3af" strokeWidth={2} />
                    </TouchableOpacity>
                    {i < activeSuggestions.length - 1 && (
                      <View className="h-px bg-border/40 mx-4" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            /* Mock map pin view */
            <View className="px-5 gap-4">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Map Preview
              </Text>

              {/* Mock map */}
              <View
                className="rounded-3xl overflow-hidden items-center justify-center"
                style={{ height: 220, backgroundColor: '#e8f0e9' }}
              >
                {/* Mock map grid */}
                <View className="absolute inset-0 opacity-30">
                  {[0,1,2,3,4,5].map(i => (
                    <View key={`h${i}`} className="absolute w-full h-px bg-green-700" style={{ top: `${i * 20}%` }} />
                  ))}
                  {[0,1,2,3,4,5,6].map(i => (
                    <View key={`v${i}`} className="absolute h-full w-px bg-green-700" style={{ left: `${i * 16.6}%` }} />
                  ))}
                </View>

                {/* Route line mock */}
                {canProceed && (
                  <View
                    className="absolute rounded-full opacity-40"
                    style={{
                      width: 120, height: 3,
                      backgroundColor: PRIMARY_GREEN,
                      transform: [{ rotate: '-15deg' }],
                    }}
                  />
                )}

                {/* Pickup pin */}
                <View className="absolute items-center" style={{ top: '35%', left: '30%' }}>
                  <View
                    className="h-8 w-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  >
                    <Navigation size={14} color="#fff" strokeWidth={2.5} />
                  </View>
                  <View
                    className="w-2 h-2 rounded-full -mt-1"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  />
                </View>

                {/* Destination pin */}
                <View className="absolute items-center" style={{ top: '50%', left: '58%' }}>
                  <MapPin size={28} color="#ef4444" strokeWidth={2.5} />
                </View>

                {/* Map label */}
                <View
                  className="absolute bottom-3 right-3 rounded-lg px-2 py-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                >
                  <Text size="xs" weight="medium" className="text-muted-foreground">
                    Mock map • Phase 0.5
                  </Text>
                </View>
              </View>

              {/* Location summary */}
              {canProceed && (
                <View
                  className="rounded-2xl p-4 gap-3"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
                >
                  <View className="flex-row items-start gap-3">
                    <View
                      className="h-2.5 w-2.5 rounded-full mt-1.5"
                      style={{ backgroundColor: PRIMARY_GREEN }}
                    />
                    <View className="flex-1">
                      <Text size="xs" weight="bold" className="text-muted-foreground">PICKUP</Text>
                      <Text size="sm" weight="medium" className="text-foreground" numberOfLines={2}>
                        {usingCurrentLocation ? 'Current Location (GPS)' : pickup}
                      </Text>
                    </View>
                  </View>
                  <View className="h-px bg-border/40 ml-5" />
                  <View className="flex-row items-start gap-3">
                    <MapPin size={12} color="#ef4444" strokeWidth={2.5} style={{ marginTop: 2 }} />
                    <View className="flex-1">
                      <Text size="xs" weight="bold" className="text-muted-foreground">DESTINATION</Text>
                      <Text size="sm" weight="medium" className="text-foreground" numberOfLines={2}>
                        {destination}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Empty state */}
              {!canProceed && (
                <View className="items-center gap-2 py-4">
                  <Text size="sm" className="text-muted-foreground text-center">
                    Enter a pickup location and destination to see your route.
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ===== CONTINUE BUTTON — pinned to bottom ===== */}
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
            style={{
              backgroundColor: canProceed ? PRIMARY_GREEN : '#9ca3af',
            }}
            onPress={handleContinue}
            disabled={!canProceed}
          >
            <Text size="base" weight="bold" className="text-white">
              Continue
            </Text>
          </Button>
          {!canProceed && (
            <Text size="xs" className="text-center text-muted-foreground pt-2">
              Enter both pickup and destination to continue
            </Text>
          )}
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
