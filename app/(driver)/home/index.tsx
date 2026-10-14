import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'panelui-native';
import { User, Bell } from 'lucide-react-native';
import { api } from '../../../lib/api';
import { StatusToggle } from '../../../components/driver/home/StatusToggle';
import { TodayStats } from '../../../components/driver/home/TodayStats';
import { QuickLinks } from '../../../components/driver/home/QuickLinks';
import { RecentTrips } from '../../../components/driver/home/RecentTrips';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Driver Home Screen
 * Phase 0.5 — Backend Integration
 *
 * Integrated with backend to fetch:
 * - Driver name, vehicle info from DriverApplication table
 * - Driver rating (placeholder 4.8 until Phase 3)
 * - Total trips, today's earnings, today's trips (0 - Phase 3 will have real Trip/Earnings data)
 * - Recent trips (empty array - Phase 3 will have real Trip data)
 */
export default function DriverHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  // Backend data
  const [driverName, setDriverName] = useState('Driver');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [plateNumber, setPlateNumber] = useState('INC-1234');
  const [rating, setRating] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);
  const [recentTrips, setRecentTrips] = useState<Array<{
    id: string;
    destination: string;
    fare: number;
    time: string;
  }>>([]);

  // Fetch driver profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        console.log('🔄 Fetching driver profile...');
        const profileResponse = await api.getUserProfile();
        
        console.log('📥 Profile response:', profileResponse);
        
        if (profileResponse.success && profileResponse.user) {
          const { user } = profileResponse;
          
          console.log('✅ Setting driver data:', {
            name: user.fullName,
            vehicle: user.vehicleInfo?.vehicleType,
            plate: user.vehicleInfo?.plateNumber,
            rating: user.driverStats?.rating,
            trips: user.driverStats?.totalTrips,
          });
          
          setDriverName(user.fullName);
          setVehicleType(user.vehicleInfo?.vehicleType ?? 'Motorcycle');
          setPlateNumber(user.vehicleInfo?.plateNumber ?? 'N/A');
          setRating(user.driverStats?.rating ?? 0);
          setTotalTrips(user.driverStats?.totalTrips ?? 0);
          
          // TODO Phase 3: Query actual earnings and trips when Trip/Earnings models are implemented
          // For now, these remain 0 since no trips exist in database
          setTodayEarnings(0);
          setTodayTrips(0);
          setRecentTrips([]);
        } else {
          console.error('❌ Profile fetch failed:', profileResponse.error);
        }
      } catch (error) {
        console.error('❌ Failed to fetch profile:', error);
        // Keep using default values on error
      }
    }
    
    fetchProfile();
  }, []);

  function handleToggle() {
    if (isToggling) return;
    setIsToggling(true);
    const next = !isOnline;
    
    setTimeout(() => {
      setIsOnline(next);
      setIsToggling(false);
      // Mock: if going online, simulate incoming request after 3s
      if (next) {
        setTimeout(() => router.push('/(driver)/incoming-request'), 3000);
      }
    }, 280);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== TOP BAR ===== */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <View className="gap-0.5">
          <Text size="xs" className="text-muted-foreground">Welcome back,</Text>
          <Text size="lg" weight="bold" style={{ color: PRIMARY_GREEN }}>{driverName}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/notifications')}
          >
            <Bell size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/profile')}
          >
            <User size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-5">

          {/* ===== ONLINE / OFFLINE TOGGLE ===== */}
          <StatusToggle
            isOnline={isOnline}
            isToggling={isToggling}
            vehicleType={vehicleType}
            plateNumber={plateNumber}
            onToggle={handleToggle}
          />

          {/* ===== TODAY'S STATS ===== */}
          <TodayStats
            todayEarnings={todayEarnings}
            todayTrips={todayTrips}
            rating={rating}
            totalTrips={totalTrips}
          />

          {/* ===== QUICK LINKS ===== */}
          <QuickLinks />

          {/* ===== RECENT TRIPS ===== */}
          <RecentTrips trips={recentTrips} />

        </View>
      </ScrollView>
    </View>
  );
}
