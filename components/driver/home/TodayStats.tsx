import { View } from 'react-native';
import { Text } from 'panelui-native';
import { Banknote, Clock, Star, TrendingUp } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

interface TodayStatsProps {
  todayEarnings: number;
  todayTrips: number;
  rating: number;
  totalTrips: number;
}

export function TodayStats({ todayEarnings, todayTrips, rating, totalTrips }: TodayStatsProps) {
  return (
    <View className="gap-2">
      <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
        Today
      </Text>
      <View className="flex-row gap-3">
        <View
          className="flex-1 rounded-2xl p-4 gap-1"
          style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
        >
          <View className="flex-row items-center gap-1.5">
            <Banknote size={16} color={PRIMARY_GREEN} strokeWidth={2} />
            <Text size="xs" className="text-muted-foreground">Earnings</Text>
          </View>
          <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            ₱{todayEarnings}
          </Text>
          <Text size="xs" className="text-muted-foreground">After commission</Text>
        </View>
        <View
          className="flex-1 rounded-2xl p-4 gap-1"
          style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
        >
          <View className="flex-row items-center gap-1.5">
            <Clock size={16} color={PRIMARY_GREEN} strokeWidth={2} />
            <Text size="xs" className="text-muted-foreground">Trips</Text>
          </View>
          <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            {todayTrips}
          </Text>
          <Text size="xs" className="text-muted-foreground">Completed today</Text>
        </View>
      </View>

      {/* Rating + total trips */}
      <View className="flex-row gap-3">
        <View
          className="flex-1 rounded-2xl px-4 py-3 flex-row items-center gap-3"
          style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)' }}
        >
          <Star size={18} color="#f59e0b" strokeWidth={0} fill="#f59e0b" />
          <View>
            <Text size="base" weight="bold" className="text-foreground">{rating.toFixed(1)}</Text>
            <Text size="xs" className="text-muted-foreground">Rating</Text>
          </View>
        </View>
        <View
          className="flex-1 rounded-2xl px-4 py-3 flex-row items-center gap-3"
          style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
        >
          <TrendingUp size={18} color={PRIMARY_GREEN} strokeWidth={2} />
          <View>
            <Text size="base" weight="bold" className="text-foreground">{totalTrips}</Text>
            <Text size="xs" className="text-muted-foreground">Total trips</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
