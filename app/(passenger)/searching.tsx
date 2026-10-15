import { View, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, Button } from 'panelui-native';
import { useStore } from '@tanstack/react-store';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { MapPin, X, RefreshCw } from 'lucide-react-native';
import { bookingStore, bookingActions } from '../../lib/stores/booking-store';
import { authStore } from '../../lib/store';
import { getActiveBooking, cancelBooking } from '../../lib/api/bookings';

const PRIMARY_GREEN = '#0d5f3a';

/** How often to poll for booking updates (ms) */
const POLL_INTERVAL_MS = 3000; // Every 3 seconds
/** Max search time before showing timeout (ms) */
const SEARCH_TIMEOUT_MS = 60000; // 60 seconds

type SearchState = 'searching' | 'found' | 'timeout';

/**
 * Searching for Driver Screen
 * Phase 2 — Real API Integration
 *
 * Per master-plan.md Phase 2:
 * - Poll for booking status updates
 * - Show driver found when status changes to DRIVER_ASSIGNED
 * - Allow cancellation (no fee while searching)
 * - Timeout with retry option
 */
export default function Searching() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // ALL HOOKS MUST BE AT THE TOP, BEFORE ANY CONDITIONAL RETURNS
  const [state, setState] = useState<SearchState>('searching');
  const [elapsed, setElapsed] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Pulse rings animation values
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  
  // Get data from store
  const booking = useStore(bookingStore, (state) => state.activeBooking);
  const draftBooking = useStore(bookingStore, (state) => state.draftBooking);
  const user = useStore(authStore, (state) => state.user);

  // Redirect if no booking data (must be after all hooks)
  useEffect(() => {
    if (!booking?.bookingId || !user?.id) {
      router.replace('/(passenger)/booking');
    }
  }, [booking?.bookingId, user?.id, router]);

  // Poll for booking status updates
  async function checkBookingStatus() {
    if (!user?.id) return;
    
    try {
      const result = await getActiveBooking(user.id);
      
      if (result.success && result.data) {
        const bookingData = result.data;
        
        // Update store with latest booking data
        bookingActions.setActiveBooking({
          ...booking,
          status: bookingData.status,
          trip: bookingData.trip,
        });
        
        // Check if driver has been assigned
        if (bookingData.status === 'DRIVER_ASSIGNED' && bookingData.trip?.driverId) {
          setState('found');
        }
        
        // Check if booking was cancelled or completed elsewhere
        if (['CANCELLED', 'COMPLETED'].includes(bookingData.status)) {
          router.replace('/(passenger)/home');
        }
      } else {
        // 404 means no active booking found - this is normal if booking was just cancelled
        // or if the backend hasn't created the booking event yet
        console.log('No active booking found (this is normal during initial search)');
      }
    } catch (error) {
      console.error('Error polling booking status:', error);
      // Don't show error to user - just keep searching
    }
  }

  useEffect(() => {
    // Start pulse animations staggered
    const pulse = (val: typeof ring1, delay: number) => {
      val.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          false
        )
      );
    };
    pulse(ring1, 0);
    pulse(ring2, 600);
    pulse(ring3, 1200);

    // Elapsed counter
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);

    // Start polling for status updates
    pollRef.current = setInterval(checkBookingStatus, POLL_INTERVAL_MS);
    checkBookingStatus(); // Check immediately

    // Timeout after max search time
    const timeoutTimer = setTimeout(() => {
      setState(s => s === 'searching' ? 'timeout' : s);
    }, SEARCH_TIMEOUT_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      clearTimeout(timeoutTimer);
    };
  }, []);

  // Stop timers when no longer searching
  useEffect(() => {
    if (state !== 'searching') {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    }
    
    // Auto-navigate when driver found
    if (state === 'found') {
      const nav = setTimeout(() => {
        bookingActions.setCurrentScreen('driver-assigned');
        router.replace('/(passenger)/driver-assigned');
      }, 1800);
      return () => clearTimeout(nav);
    }
  }, [state]);

  // Handle cancellation
  async function handleCancel() {
    if (!booking.bookingId || !user?.id) return;
    
    Alert.alert(
      'Cancel Search',
      'Are you sure you want to cancel? You can cancel at no charge while searching.',
      [
        { text: 'Keep Searching', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            
            try {
              const result = await cancelBooking(
                booking.bookingId!,
                user.id,
                'No driver found'
              );
              
              console.log('Cancel booking result:', result);
              
              if (result.success) {
                bookingActions.setActiveBooking(null);
                bookingActions.clearDraftBooking();
                router.replace('/(passenger)/home');
              } else {
                const errorMsg = result.errors 
                  ? Object.values(result.errors).join(', ')
                  : result.message || 'Unable to cancel booking. Please try again.';
                
                console.error('Cancellation failed:', result);
                
                Alert.alert(
                  'Cancellation Failed',
                  errorMsg,
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Cancel error:', error);
              Alert.alert('Error', 'An unexpected error occurred.');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  }

  // Handle retry after timeout
  function handleRetry() {
    setState('searching');
    setElapsed(0);
    // Restart polling
    pollRef.current = setInterval(checkBookingStatus, POLL_INTERVAL_MS);
    checkBookingStatus();
  }

  // Animated ring styles
  function ringStyle(val: typeof ring1, size: number) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAnimatedStyle(() => ({
      width: size + val.value * size * 0.9,
      height: size + val.value * size * 0.9,
      borderRadius: (size + val.value * size * 0.9) / 2,
      opacity: (1 - val.value) * 0.35,
      position: 'absolute',
      backgroundColor: PRIMARY_GREEN,
    }));
  }

  const r1Style = ringStyle(ring1, 80);
  const r2Style = ringStyle(ring2, 80);
  const r3Style = ringStyle(ring3, 80);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Prevent rendering if data is missing (will redirect via useEffect)
  if (!booking?.bookingId || !user?.id) {
    return null;
  }

  // ── Timeout state ─────────────────────────────────────────────
  if (state === 'timeout') {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
      >
        <Animated.View entering={FadeIn.duration(400)} className="items-center gap-6">
          <View
            className="h-24 w-24 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <Text style={{ fontSize: 44 }}>😔</Text>
          </View>
          <View className="items-center gap-2">
            <Text size="2xl" weight="bold" className="text-foreground text-center">
              No Driver Found
            </Text>
            <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
              We couldn't find an available driver in your area right now. This can happen during off-peak hours or when demand is high.
            </Text>
          </View>
        </Animated.View>

        <View className="w-full gap-3">
          <Button
            size="lg"
            className="w-full"
            style={{ backgroundColor: PRIMARY_GREEN }}
            onPress={handleRetry}
          >
            <View className="flex-row items-center gap-2">
              <RefreshCw size={18} color="#fff" strokeWidth={2.5} />
              <Text size="base" weight="bold" className="text-white">Try Again</Text>
            </View>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            style={{ borderColor: PRIMARY_GREEN }}
            onPress={() => {
              bookingActions.setActiveBooking(null);
              bookingActions.clearDraftBooking();
              router.replace('/(passenger)/home');
            }}
          >
            <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>Back to Home</Text>
          </Button>
        </View>
      </View>
    );
  }

  // ── Found state ───────────────────────────────────────────────
  if (state === 'found') {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
      >
        <Animated.View entering={FadeIn.duration(500)} className="items-center gap-6">
          <View
            className="h-24 w-24 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
          >
            <Text style={{ fontSize: 44 }}>🎉</Text>
          </View>
          <View className="items-center gap-2">
            <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }} className="text-center">
              Driver Found!
            </Text>
            <Text size="sm" className="text-muted-foreground text-center">
              Connecting you with your driver…
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  // ── Searching state ───────────────────────────────────────────
  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
    >
      {/* Top: booking info strip */}
      <View
        className="px-5 py-3 flex-row items-center gap-3"
        style={{ borderBottomWidth: 1, borderBottomColor: '#e5e5e3' }}
      >
        <MapPin size={16} color="#ef4444" strokeWidth={2.5} />
        <Text size="xs" className="text-muted-foreground flex-1" numberOfLines={1}>
          {draftBooking.destinationAddress}
        </Text>
        <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
          ₱{booking.fareEstimate} est.
        </Text>
      </View>

      {/* Center: animation */}
      <View className="flex-1 items-center justify-center gap-10">

        {/* Pulse rings + icon */}
        <View className="items-center justify-center" style={{ width: 160, height: 160 }}>
          <Animated.View style={r1Style} />
          <Animated.View style={r2Style} />
          <Animated.View style={r3Style} />
          <View
            className="h-20 w-20 rounded-full items-center justify-center z-10"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            <Text style={{ fontSize: 36 }}>🏍️</Text>
          </View>
        </View>

        {/* Status text */}
        <View className="items-center gap-2 px-8">
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Searching for a Driver
          </Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
            We're finding an available driver near your pickup location. This usually takes less than a minute.
          </Text>
          <View
            className="mt-2 rounded-full px-4 py-1.5"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
          >
            <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN, fontVariant: ['tabular-nums'] }}>
              {formatTime(elapsed)}
            </Text>
          </View>
        </View>

        {/* Animated dots */}
        <View className="flex-row gap-2">
          {[0, 1, 2].map(i => (
            <AnimatedDot key={i} delay={i * 300} />
          ))}
        </View>
      </View>

      {/* Bottom: cancel */}
      <View
        className="px-5 pt-4"
        style={{
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e3',
        }}
      >
        <View
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <Text size="xs" className="text-muted-foreground text-center leading-relaxed">
            You can cancel at no charge while we're still searching. Cancellation after a driver is assigned may incur a fee.
          </Text>
        </View>

        <Button
          size="lg"
          variant="outline"
          className="w-full"
          style={{ borderColor: '#ef4444', borderWidth: 1.5, opacity: isCancelling ? 0.6 : 1 }}
          onPress={handleCancel}
          disabled={isCancelling}
        >
          <View className="flex-row items-center gap-2">
            <X size={18} color="#ef4444" strokeWidth={2.5} />
            <Text size="base" weight="semibold" style={{ color: '#ef4444' }}>
              {isCancelling ? 'Cancelling...' : 'Cancel Search'}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}

/* ─── Animated dot component ─────────────────────────────────────────────── */
function AnimatedDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_GREEN,
  }));

  return <Animated.View style={style} />;
}
