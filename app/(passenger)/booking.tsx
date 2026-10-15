import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import { useStore } from '@tanstack/react-store';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  X,
  ChevronRight,
  LocateFixed,
  ArrowDownUp,
} from 'lucide-react-native';
import { bookingStore, bookingActions } from '../../lib/stores/booking-store';
import * as Location from 'expo-location';

const PRIMARY_GREEN = '#0d5f3a';

/** Mock recent/saved places with real Nueva Vizcaya coordinates */
const SUGGESTIONS = [
  { 
    id: '1', 
    label: 'Bayombong Town Hall', 
    address: 'Poblacion, Bayombong, Nueva Vizcaya', 
    icon: '🏛️',
    lat: 16.4833,
    lng: 121.1500,
  },
  { 
    id: '2', 
    label: 'Nueva Vizcaya State University', 
    address: 'Bayombong, Nueva Vizcaya', 
    icon: '🎓',
    lat: 16.4900,
    lng: 121.1450,
  },
  { 
    id: '3', 
    label: 'Bambang Public Market', 
    address: 'Poblacion, Bambang, Nueva Vizcaya', 
    icon: '🛒',
    lat: 16.3833,
    lng: 121.1000,
  },
  { 
    id: '4', 
    label: 'Solano Town Center', 
    address: 'Poblacion, Solano, Nueva Vizcaya', 
    icon: '🏢',
    lat: 16.5167,
    lng: 121.1833,
  },
  { 
    id: '5', 
    label: 'Region 2 Trauma and Medical Center', 
    address: 'Bayombong, Nueva Vizcaya', 
    icon: '🏥',
    lat: 16.4880,
    lng: 121.1520,
  },
];

const RECENT = [
  { 
    id: '1', 
    label: 'Home', 
    address: 'Brgy. Vista Alegre, Bayombong', 
    icon: '🏠',
    lat: 16.4750,
    lng: 121.1400,
  },
  { 
    id: '2', 
    label: 'Work', 
    address: 'Provincial Capitol, Bayombong', 
    icon: '🏢',
    lat: 16.4850,
    lng: 121.1480,
  },
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
  const draftBooking = useStore(bookingStore, (state) => state.draftBooking);

  const [pickup, setPickup] = useState(draftBooking.pickupAddress);
  const [destination, setDestination] = useState(draftBooking.destinationAddress);
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const pickupDisplay = usingCurrentLocation ? 'Current Location (GPS)' : pickup;
  const canProceed = (pickup.trim().length > 0 || usingCurrentLocation) && destination.trim().length > 0;

  // Which suggestions to show based on active field
  const activeSuggestions = activeField === 'destination' ? SUGGESTIONS : RECENT;

  async function handleUseCurrentLocation() {
    setLoadingLocation(true);
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required to use your current location');
        setLoadingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates (reverse geocoding)
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        const addressStr = [addr.street, addr.city, addr.region].filter(Boolean).join(', ');
        setPickup(addressStr || 'Current Location');
      } else {
        setPickup('Current Location');
      }

      // Update store
      bookingActions.updateDraftBooking({
        pickupAddress: 'Current Location (GPS)',
        pickupLat: location.coords.latitude,
        pickupLng: location.coords.longitude,
      });

      setUsingCurrentLocation(true);
      setActiveField(null);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Failed to get your current location. Please enter manually.');
    } finally {
      setLoadingLocation(false);
    }
  }

  function handleSwap() {
    if (usingCurrentLocation) return; // can't swap GPS
    const tmp = pickup;
    setPickup(destination);
    setDestination(tmp);
  }

  function handleSuggestion(label: string, address: string) {
    const fullAddress = `${label} — ${address}`;
    
    // Find the suggestion to get coordinates
    const suggestion = [...SUGGESTIONS, ...RECENT].find(
      s => s.label === label && s.address === address
    );
    
    if (activeField === 'pickup') {
      setPickup(fullAddress);
      setUsingCurrentLocation(false);
      
      // Update store with real coordinates
      if (suggestion) {
        bookingActions.updateDraftBooking({
          pickupAddress: fullAddress,
          pickupLat: suggestion.lat,
          pickupLng: suggestion.lng,
        });
      }
    } else if (activeField === 'destination') {
      setDestination(fullAddress);
      
      // Update store with real coordinates
      if (suggestion) {
        bookingActions.updateDraftBooking({
          destinationAddress: fullAddress,
          destinationLat: suggestion.lat,
          destinationLng: suggestion.lng,
        });
      }
    }
    
    // Clear active field to show map preview and dismiss keyboard
    setActiveField(null);
    Keyboard.dismiss();
  }

  function handleContinue() {
    // If manual entry (not from suggestions), use center of Bayombong, Nueva Vizcaya as fallback
    if (!usingCurrentLocation && !draftBooking.pickupLat) {
      bookingActions.updateDraftBooking({
        pickupAddress: pickup,
        // Center of Bayombong (capital of Nueva Vizcaya) as fallback
        pickupLat: 16.4833,
        pickupLng: 121.1500,
      });
    }
    
    if (!draftBooking.destinationLat) {
      bookingActions.updateDraftBooking({
        destinationAddress: destination,
        // Center of Bayombong as fallback
        destinationLat: 16.4850,
        destinationLng: 121.1520,
      });
    }

    bookingActions.setCurrentScreen('service-select');
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
              disabled={loadingLocation}
            >
              <LocateFixed size={15} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                {loadingLocation ? 'Getting location...' : 'Use my current location as pickup'}
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
              <View className="flex-row items-center justify-between">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  {activeField === 'pickup' ? 'Recent Places' : 'Suggestions'}
                </Text>
                <TouchableOpacity 
                  onPress={() => {
                    setActiveField(null);
                    Keyboard.dismiss();
                  }}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                >
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
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
            /* Static Map Preview */
            <View className="px-5 gap-4">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Route Preview
              </Text>

              {/* Map Container */}
              <View
                style={{ 
                  height: 300, 
                  borderRadius: 24,
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                }}
              >
                {canProceed && draftBooking.pickupLat && draftBooking.destinationLat ? (
                  <>
                    {/* Static map from OpenStreetMap (no API key needed) */}
                    <Image
                      source={{
                        uri: `https://staticmap.openstreetmap.de/staticmap.php?center=${
                          (draftBooking.pickupLat + draftBooking.destinationLat) / 2
                        },${
                          (draftBooking.pickupLng + draftBooking.destinationLng) / 2
                        }&zoom=12&size=600x400&maptype=mapnik&markers=${
                          draftBooking.pickupLat
                        },${
                          draftBooking.pickupLng
                        },greena|${
                          draftBooking.destinationLat
                        },${
                          draftBooking.destinationLng
                        },redb`
                      }}
                      style={{ flex: 1 }}
                      resizeMode="cover"
                    />
                    
                    {/* Overlay with route info */}
                    <View
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        right: 12,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: PRIMARY_GREEN,
                        }}
                      />
                      <Text size="xs" weight="medium" style={{ flex: 1 }} numberOfLines={1}>
                        {pickup.length > 35 ? pickup.substring(0, 35) + '...' : pickup}
                      </Text>
                      <View style={{ width: 16, height: 1, backgroundColor: '#d1d5db' }} />
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#ef4444',
                        }}
                      />
                    </View>
                  </>
                ) : (
                  /* Empty state */
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: 'rgba(13, 95, 58, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <MapPin size={36} color={PRIMARY_GREEN} strokeWidth={2} />
                    </View>
                    <Text size="sm" weight="semibold" className="text-foreground text-center mb-2">
                      Select Your Route
                    </Text>
                    <Text size="xs" className="text-muted-foreground text-center">
                      Choose pickup and destination to preview your route on the map
                    </Text>
                  </View>
                )}
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
