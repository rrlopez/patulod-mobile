import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text, Card } from 'panelui-native';
import { Leaf, Users, Shield, MapPin } from 'lucide-react-native';

/**
 * PATULOD Landing Screen
 * Phase 0.5 - Mock UI with navigation structure
 * 
 * Per master-plan.md Phase 1 requirements:
 * - Logo and taglines: Ilokano + English
 * - Main actions: Register Passenger, Login, Driver Application
 * - Policy links: Terms, Privacy, Safety Guidelines, Help
 * - Mobile-readable typography, professional polish
 */
export default function Landing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const PRIMARY_GREEN = '#0d5f3a';
  const ACCENT_YELLOW = '#fbbf24';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center px-5">
        
        {/* ===== HERO SECTION ===== */}
        <View className="w-full items-center gap-6 pt-8 pb-4">
          
          {/* Logo with elevated design */}
          <View className="relative items-center">
            <View 
              className="h-28 w-28 items-center justify-center rounded-full shadow-xl" 
              style={{ 
                backgroundColor: PRIMARY_GREEN,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Inner accent ring */}
              <View 
                className="absolute inset-3 rounded-full" 
                style={{ borderWidth: 2.5, borderColor: ACCENT_YELLOW }} 
              />
              <Text size="4xl" weight="bold" className="text-white" style={{ fontSize: 48 }}>
                P
              </Text>
            </View>
          </View>
          
          {/* Brand Name */}
          <View className="items-center gap-2">
            <Text 
              size="4xl" 
              weight="bold" 
              className="tracking-widest" 
              style={{ color: PRIMARY_GREEN, fontSize: 36, letterSpacing: 2 }}
            >
              PATULOD
            </Text>
            
            {/* Ilokano Tagline - Featured */}
            <View 
              className="rounded-full px-5 py-2.5" 
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.12)' }}
            >
              <Text 
                size="base" 
                weight="medium" 
                className="text-center italic" 
                style={{ color: PRIMARY_GREEN, fontSize: 15 }}
              >
                Patulod, Kaluganan a gayyem mo.
              </Text>
            </View>
          </View>
          
          {/* English Taglines - Stacked for emphasis */}
          <View className="items-center gap-1.5 pt-1">
            <Text 
              size="base" 
              weight="semibold" 
              className="text-center" 
              style={{ color: '#374151', fontSize: 15 }}
            >
              Safer Rides • Stronger Livelihoods
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Leaf size={14} color="#10b981" strokeWidth={2.5} />
              <Text 
                size="sm" 
                weight="semibold" 
                className="text-success"
                style={{ fontSize: 14 }}
              >
                A Greener Tomorrow
              </Text>
            </View>
          </View>

        </View>

        {/* ===== VALUE PROPOSITIONS ===== */}
        <View className="w-full max-w-md gap-3 pt-6 pb-8">
          <View className="flex-row items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}>
              <Shield size={20} color={PRIMARY_GREEN} strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text size="sm" weight="semibold" className="text-foreground">Safe & Verified</Text>
              <Text size="xs" className="text-muted-foreground">Screened drivers you can trust</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}>
              <MapPin size={20} color={PRIMARY_GREEN} strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text size="sm" weight="semibold" className="text-foreground">Local Service</Text>
              <Text size="xs" className="text-muted-foreground">Connecting communities, building livelihoods</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <Leaf size={20} color="#10b981" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text size="sm" weight="semibold" className="text-foreground">Eco-Friendly</Text>
              <Text size="xs" className="text-muted-foreground">Sustainable transport for a better tomorrow</Text>
            </View>
          </View>
        </View>

        {/* ===== PRIMARY ACTIONS ===== */}
        <View className="w-full max-w-md gap-3.5 pt-2">
          
          {/* Register as Passenger - Primary CTA */}
          <Button 
            size="lg" 
            className="w-full shadow-lg"
            style={{ 
              backgroundColor: PRIMARY_GREEN,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
            onPress={() => router.push('/register')}
          >
            <Text size="lg" weight="bold" className="text-white">
              Register as Passenger
            </Text>
          </Button>
          
          {/* Login - Secondary CTA */}
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full"
            style={{ 
              borderColor: PRIMARY_GREEN, 
              borderWidth: 2 
            }}
            onPress={() => router.push('/login')}
          >
            <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>
              Login to Your Account
            </Text>
          </Button>
          
          {/* Divider */}
          <View className="relative h-6 items-center justify-center">
            <View className="absolute h-px w-full bg-border" />
            <View className="bg-background px-3">
              <Text size="xs" weight="medium" className="text-muted-foreground uppercase tracking-wide">
                Driver Application
              </Text>
            </View>
          </View>
          
          {/* Driver Application - Tertiary CTA */}
          <Button 
            size="lg" 
            variant="ghost" 
            className="w-full border-2"
            style={{ borderColor: ACCENT_YELLOW }}
            onPress={() => router.push('/driver-apply')}
          >
            <View className="flex-row items-center gap-2">
              <Users size={20} color={PRIMARY_GREEN} strokeWidth={2} />
              <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                Apply as Driver
              </Text>
            </View>
          </Button>
          
        </View>

        {/* ===== INFORMATION LINKS ===== */}
        <View className="w-full max-w-md gap-3 pt-12">
          <Text 
            size="xs" 
            weight="bold" 
            className="text-muted-foreground uppercase tracking-wider px-1"
          >
            Learn More About PATULOD
          </Text>
          
          <Card className="overflow-hidden border-border/50">
            <View className="gap-0.5">
              
              <Button 
                variant="ghost" 
                size="md" 
                className="justify-start rounded-none px-4 py-3.5"
                onPress={() => router.push('/about')}
              >
                <View className="flex-row items-center gap-3">
                  <Text size="lg">📖</Text>
                  <Text size="sm" weight="medium" className="text-foreground">About PATULOD</Text>
                </View>
              </Button>
              
              <View className="h-px bg-border/30 mx-3" />
              
              <Button 
                variant="ghost" 
                size="md" 
                className="justify-start rounded-none px-4 py-3.5"
                onPress={() => router.push('/terms')}
              >
                <View className="flex-row items-center gap-3">
                  <Text size="lg">📄</Text>
                  <Text size="sm" weight="medium" className="text-foreground">Terms and Understanding</Text>
                </View>
              </Button>
              
              <View className="h-px bg-border/30 mx-3" />
              
              <Button 
                variant="ghost" 
                size="md" 
                className="justify-start rounded-none px-4 py-3.5"
                onPress={() => router.push('/privacy')}
              >
                <View className="flex-row items-center gap-3">
                  <Text size="lg">🔒</Text>
                  <Text size="sm" weight="medium" className="text-foreground">Privacy Notice</Text>
                </View>
              </Button>
              
              <View className="h-px bg-border/30 mx-3" />
              
              <Button 
                variant="ghost" 
                size="md" 
                className="justify-start rounded-none px-4 py-3.5"
                onPress={() => router.push('/safety')}
              >
                <View className="flex-row items-center gap-3">
                  <Text size="lg">🛡️</Text>
                  <Text size="sm" weight="medium" className="text-foreground">Safety & Community Guidelines</Text>
                </View>
              </Button>
              
              <View className="h-px bg-border/30 mx-3" />
              
              <Button 
                variant="ghost" 
                size="md" 
                className="justify-start rounded-none px-4 py-3.5"
                onPress={() => router.push('/support')}
              >
                <View className="flex-row items-center gap-3">
                  <Text size="lg">💬</Text>
                  <Text size="sm" weight="medium" className="text-foreground">Help / Support</Text>
                </View>
              </Button>
              
            </View>
          </Card>
        </View>

        {/* ===== FOOTER ===== */}
        <View className="items-center gap-3 pt-16 pb-6">
          <View 
            className="rounded-full px-4 py-1.5" 
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
          >
            <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
              Phase 0.5 • Mock UI
            </Text>
          </View>
          <Text size="xs" className="text-center text-muted-foreground" style={{ letterSpacing: 0.5 }}>
            PATULOD © 2026 • Version 1.0.0
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}
