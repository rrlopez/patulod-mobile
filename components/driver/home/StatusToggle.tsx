import { View, TouchableOpacity } from 'react-native';
import { Text } from 'panelui-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const PRIMARY_GREEN = '#0d5f3a';

interface StatusToggleProps {
  isOnline: boolean;
  isToggling: boolean;
  vehicleType: string;
  plateNumber: string;
  onToggle: () => void;
}

export function StatusToggle({ isOnline, isToggling, vehicleType, plateNumber, onToggle }: StatusToggleProps) {
  const toggleX = useSharedValue(isOnline ? 1 : 0);

  useEffect(() => {
    toggleX.value = withTiming(isOnline ? 1 : 0, { 
      duration: 250, 
      easing: Easing.inOut(Easing.ease) 
    });
  }, [isOnline]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: toggleX.value > 0.5 ? PRIMARY_GREEN : '#e5e5e3',
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value * 28 }],
  }));

  return (
    <View
      className="rounded-3xl p-6 gap-5"
      style={{ backgroundColor: isOnline ? PRIMARY_GREEN : '#f5f5f3' }}
    >
      {/* Status header */}
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            {isOnline
              ? <Wifi size={18} color="#fff" strokeWidth={2} />
              : <WifiOff size={18} color="#9ca3af" strokeWidth={2} />
            }
            <Text
              size="xl"
              weight="bold"
              style={{ color: isOnline ? '#fff' : '#1a1a1a' }}
            >
              {isOnline ? 'You are Online' : 'You are Offline'}
            </Text>
          </View>
          <Text
            size="xs"
            style={{ color: isOnline ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}
          >
            {isOnline
              ? 'Waiting for ride requests…'
              : 'Go online to start accepting rides'}
          </Text>
        </View>

        {/* Toggle switch */}
        <TouchableOpacity onPress={onToggle} activeOpacity={0.85} disabled={isToggling}>
          <Animated.View
            className="w-16 h-8 rounded-full justify-center px-1"
            style={[trackStyle, { width: 60, height: 32 }]}
          >
            <Animated.View
              className="h-6 w-6 rounded-full"
              style={[thumbStyle, { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 }]}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Online indicator dots */}
      {isOnline && (
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Active in your service area · {vehicleType} · {plateNumber}
          </Text>
        </View>
      )}

      {/* Demo note */}
      {isOnline && (
        <View
          className="rounded-xl px-3 py-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Demo: An incoming ride request will appear in ~3 seconds.
          </Text>
        </View>
      )}
    </View>
  );
}
