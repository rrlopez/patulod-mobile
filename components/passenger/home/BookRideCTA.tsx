import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'panelui-native';
import { MapPin, ChevronRight, Navigation } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Book a Ride CTA Card
 * Main entry point to booking flow
 */
export default function BookRideCTA() {
  const router = useRouter();

  return (
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
  );
}
