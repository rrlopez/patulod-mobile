import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text, Card } from 'panelui-native';
import { ArrowLeft, MapPin, Users, Leaf, Bike, TrendingUp, Heart } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

/**
 * About PATULOD Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md:
 * - Service explanation
 * - Passenger and driver roles
 * - Service area description
 * - Social benefits
 * - Corporation described as business-pitch structure —
 *   not presented as registered/licensed
 * - Team-approved mission and vision only
 */
export default function About() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          About PATULOD
        </Text>
      </View>

      <View className="px-5 gap-8">

        {/* ===== HERO BANNER ===== */}
        <View
          className="rounded-3xl overflow-hidden items-center justify-center px-6 py-10 gap-3"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-2"
            style={{ borderWidth: 2.5, borderColor: ACCENT_YELLOW }}
          >
            <Text weight="bold" className="text-white" style={{ fontSize: 40 }}>P</Text>
          </View>
          <Text size="2xl" weight="bold" className="text-white text-center tracking-widest">
            PATULOD
          </Text>
          <Text size="sm" weight="medium" className="text-center italic" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Patulod, Kaluganan a gayyem mo.
          </Text>
          <Text size="xs" className="text-center" style={{ color: 'rgba(255,255,255,0.65)', paddingTop: 4 }}>
            Safer Rides • Stronger Livelihoods • A Greener Tomorrow
          </Text>
        </View>

        {/* ===== WHAT IS PATULOD ===== */}
        <View className="gap-3">
          <SectionLabel>What is PATULOD?</SectionLabel>
          <Card className="p-4 gap-3">
            <Text size="sm" className="text-foreground leading-relaxed">
              PATULOD is a community-driven ride-hailing service designed to connect passengers with local drivers in a safe, affordable, and sustainable way.
            </Text>
            <Text size="sm" className="text-foreground leading-relaxed">
              The name <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>PATULOD</Text> is an Ilokano word meaning "to send forth" or "to guide someone on their journey" — reflecting our commitment to being a trusted companion for every ride.
            </Text>
            <Text size="sm" className="text-foreground leading-relaxed">
              We are a grassroots initiative focused on building a fair, transparent, and people-centered transportation solution for our community.
            </Text>
          </Card>
        </View>

        {/* ===== OUR MISSION & VISION ===== */}
        <View className="gap-3">
          <SectionLabel>Mission & Vision</SectionLabel>
          <View className="gap-3">
            <Card className="p-4 gap-2" style={{ borderLeftWidth: 3, borderLeftColor: PRIMARY_GREEN }}>
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>Our Mission</Text>
              <Text size="sm" className="text-foreground leading-relaxed">
                To provide safe, accessible, and livelihood-sustaining transportation by connecting community members with vetted local drivers — making every journey a partnership.
              </Text>
            </Card>
            <Card className="p-4 gap-2" style={{ borderLeftWidth: 3, borderLeftColor: ACCENT_YELLOW }}>
              <Text size="sm" weight="bold" style={{ color: '#92400e' }}>Our Vision</Text>
              <Text size="sm" className="text-foreground leading-relaxed">
                A community where transportation is safe, equitable, and environmentally responsible — where drivers earn a fair livelihood and passengers travel with confidence.
              </Text>
            </Card>
          </View>
        </View>

        {/* ===== WHO WE SERVE ===== */}
        <View className="gap-3">
          <SectionLabel>Who We Serve</SectionLabel>
          <View className="gap-3">

            {/* Passengers */}
            <Card className="p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View
                  className="h-11 w-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
                >
                  <Users size={22} color={PRIMARY_GREEN} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text size="base" weight="bold" className="text-foreground">Passengers</Text>
                  <Text size="xs" className="text-muted-foreground">Community members seeking safe rides</Text>
                </View>
              </View>
              <Text size="sm" className="text-foreground leading-relaxed">
                Anyone in our service area who needs a safe, reliable ride. Whether it's getting to work, running errands, or attending appointments — PATULOD is your trusted travel companion.
              </Text>
              <View className="gap-1.5">
                <FeatureItem text="Simple booking with transparent fare estimates" />
                <FeatureItem text="Verified drivers you can identify before boarding" />
                <FeatureItem text="Direct contact channel for every ride" />
              </View>
            </Card>

            {/* Drivers */}
            <Card className="p-4 gap-3">
              <View className="flex-row items-center gap-3">
                <View
                  className="h-11 w-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(251, 191, 36, 0.15)' }}
                >
                  <Bike size={22} color="#92400e" strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text size="base" weight="bold" className="text-foreground">Drivers</Text>
                  <Text size="xs" className="text-muted-foreground">Local drivers building their livelihood</Text>
                </View>
              </View>
              <Text size="sm" className="text-foreground leading-relaxed">
                Community members who own or operate a vehicle and want to earn a fair livelihood by providing transport services. Drivers go through a screening process to join the platform.
              </Text>
              <View className="gap-1.5">
                <FeatureItem text="Fair earnings with transparent commission structure" />
                <FeatureItem text="Flexible schedule — work on your own terms" />
                <FeatureItem text="Be part of a trusted local network" />
              </View>
            </Card>

          </View>
        </View>

        {/* ===== SERVICE AREA ===== */}
        <View className="gap-3">
          <SectionLabel>Service Area</SectionLabel>
          <Card className="p-4 gap-3">
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
              >
                <MapPin size={22} color={PRIMARY_GREEN} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text size="base" weight="bold" className="text-foreground">Local Coverage</Text>
                <Text size="xs" className="text-muted-foreground">Defined service boundaries apply</Text>
              </View>
            </View>
            <Text size="sm" className="text-foreground leading-relaxed">
              PATULOD currently operates within a defined service area. Bookings are only accepted for pickups and destinations within this area to ensure driver availability and safety.
            </Text>
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
            >
              <Text size="xs" weight="medium" style={{ color: PRIMARY_GREEN }}>
                📍 Service boundaries are enforced at booking time. If your pickup or destination is outside the service area, the booking will not proceed.
              </Text>
            </View>
          </Card>
        </View>

        {/* ===== SOCIAL BENEFITS ===== */}
        <View className="gap-3">
          <SectionLabel>Our Social Impact</SectionLabel>
          <View className="gap-2.5">

            <SocialBenefit
              icon={<TrendingUp size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
              title="Driver Livelihood"
              description="We believe drivers deserve fair compensation. Our commission structure is transparent and designed to support sustainable livelihoods."
              bgColor="rgba(13, 95, 58, 0.08)"
            />

            <SocialBenefit
              icon={<Users size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
              title="Community First"
              description="PATULOD connects neighbors with neighbors. We keep money circulating within the local economy rather than extracting it."
              bgColor="rgba(13, 95, 58, 0.06)"
            />

            <SocialBenefit
              icon={<Leaf size={20} color="#10b981" strokeWidth={2} />}
              title="Environmental Responsibility"
              description="By optimizing routes and reducing unnecessary trips, PATULOD contributes to a lower carbon footprint for community transport."
              bgColor="rgba(16, 185, 129, 0.06)"
            />

            <SocialBenefit
              icon={<Heart size={20} color="#ef4444" strokeWidth={2} />}
              title="Safety for Everyone"
              description="Driver verification, transparent identification, and safety guidelines protect both passengers and drivers on every trip."
              bgColor="rgba(239, 68, 68, 0.06)"
            />

          </View>
        </View>

        {/* ===== PROTOTYPE NOTICE ===== */}
        <View
          className="rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.4)' }}
        >
          <Text size="sm" weight="bold" style={{ color: '#92400e' }}>⚠️ Prototype Notice</Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#92400e' }}>
            PATULOD is currently in its early development phase. Features shown in this app are demonstrations of intended functionality. Some services may not yet be fully operational. We are building this together with our community.
          </Text>
        </View>

        {/* ===== BACK BUTTON ===== */}
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.back()}
        >
          <Text size="base" weight="semibold" className="text-white">Back to Home</Text>
        </Button>

        {/* Footer spacing */}
        <View style={{ height: 8 }} />

      </View>
    </ScrollView>
  );
}

/* ─── Local helper components ─────────────────────────────────── */

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      size="xs"
      weight="bold"
      className="text-muted-foreground uppercase tracking-wider px-1"
    >
      {children}
    </Text>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-start gap-2">
      <Text size="xs" style={{ color: PRIMARY_GREEN, marginTop: 1 }}>✓</Text>
      <Text size="xs" className="text-muted-foreground flex-1">{text}</Text>
    </View>
  );
}

function SocialBenefit({
  icon,
  title,
  description,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <View
      className="flex-row items-start gap-3 rounded-2xl p-4"
      style={{ backgroundColor: bgColor }}
    >
      <View
        className="h-9 w-9 rounded-full items-center justify-center mt-0.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
      >
        {icon}
      </View>
      <View className="flex-1 gap-1">
        <Text size="sm" weight="semibold" className="text-foreground">{title}</Text>
        <Text size="xs" className="text-muted-foreground leading-relaxed">{description}</Text>
      </View>
    </View>
  );
}
