import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  MapPin,
  Car,
  Users,
  Package,
  DollarSign,
  Briefcase,
  AlertTriangle,
  PhoneCall,
  Flag,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

/**
 * Safety & Community Guidelines Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md:
 * - Sectioned content
 * - Covers: ride/driver verification, safe pickup, equipment/capacity,
 *   respectful conduct, prohibited dangerous items, fares, belongings,
 *   reporting, emergencies
 * - Accessible before AND during rides (no auth required)
 */
export default function Safety() {
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
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          Safety & Community Guidelines
        </Text>
      </View>

      <View className="px-5 gap-6">

        {/* ===== HERO BANNER ===== */}
        <View
          className="rounded-3xl items-center px-6 py-8 gap-3"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          <View
            className="h-14 w-14 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <ShieldCheck size={28} color="#fff" strokeWidth={2} />
          </View>
          <Text size="lg" weight="bold" className="text-white text-center">
            Safety is Everyone's Responsibility
          </Text>
          <Text size="xs" className="text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>
            These guidelines protect passengers, drivers, and the community. Please read before every ride.
          </Text>
        </View>

        {/* ===== EMERGENCY CALLOUT (top-of-page, always visible) ===== */}
        <View
          className="rounded-2xl p-4 gap-2"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.07)', borderWidth: 1.5, borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <View className="flex-row items-center gap-2">
            <AlertTriangle size={18} color="#dc2626" strokeWidth={2.5} />
            <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>In an Emergency</Text>
          </View>
          <Text size="sm" className="leading-relaxed" style={{ color: '#991b1b' }}>
            Always contact local emergency services first. Call <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>911</Text> or your local emergency number immediately. PATULOD does not offer in-app SOS or emergency dispatch.
          </Text>
        </View>

        {/* ===== 1. VERIFY BEFORE YOU BOARD ===== */}
        <GuidelineSection
          icon={<UserCheck size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
          title="1. Verify Before You Board"
          accentColor={PRIMARY_GREEN}
          bgColor="rgba(13, 95, 58, 0.07)"
        >
          <GuidelineParagraph>
            Before entering any vehicle, always confirm you have the right driver and ride. This is your first and most important safety step.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Check the driver\'s name in the app against what the driver tells you.',
            'Check the vehicle type (e.g., motorcycle, tricycle) matches what is shown.',
            'Check the plate number or vehicle identifier matches the app.',
            'If anything does not match — do not board. Cancel the ride and report it.',
          ]} />
          <GuidelineNote color="green">
            A legitimate PATULOD driver will never ask you to board a different vehicle or meet at an unmarked location.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== 2. SAFE PICKUP PRACTICES ===== */}
        <GuidelineSection
          icon={<MapPin size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
          title="2. Safe Pickup Practices"
          accentColor={PRIMARY_GREEN}
          bgColor="rgba(13, 95, 58, 0.07)"
        >
          <GuidelineParagraph>
            Choose your pickup location carefully. A safe pickup makes the start of every ride smoother.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Wait in a well-lit, visible location — avoid isolated or dark spots.',
            'Stay aware of your surroundings while waiting for your driver.',
            'Do not enter the vehicle until you have completed the verification check.',
            'Let someone you trust know your pickup point and destination.',
            'Keep your phone accessible and charged before a ride.',
          ]} />
        </GuidelineSection>

        {/* ===== 3. EQUIPMENT & CAPACITY ===== */}
        <GuidelineSection
          icon={<Car size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
          title="3. Equipment & Capacity"
          accentColor={PRIMARY_GREEN}
          bgColor="rgba(13, 95, 58, 0.07)"
        >
          <GuidelineParagraph>
            PATULOD enforces passenger capacity limits for safety. Overloading a vehicle is dangerous and is not permitted.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Only the number of passengers specified during booking may ride.',
            'Do not pressure the driver to accept more passengers than the vehicle capacity allows.',
            'Wear helmets or use seatbelts as required by the vehicle type and local law.',
            'Drivers are permitted to refuse service if capacity limits would be exceeded.',
          ]} />
          <GuidelineNote color="yellow">
            Capacity rules are enforced at booking. If your group exceeds the vehicle's capacity, please book multiple rides.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== 4. RESPECTFUL CONDUCT ===== */}
        <GuidelineSection
          icon={<Users size={20} color="#6d28d9" strokeWidth={2} />}
          title="4. Respectful Conduct"
          accentColor="#6d28d9"
          bgColor="rgba(109, 40, 217, 0.06)"
        >
          <GuidelineParagraph>
            PATULOD is a community service. Every person — passenger and driver — deserves to be treated with dignity and respect.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Speak respectfully to your driver or passenger at all times.',
            'Do not use offensive, threatening, or discriminatory language.',
            'Avoid distracting the driver with unnecessary conversation while in traffic.',
            'Drivers may decline or end a ride if a passenger behaves in a threatening or disrespectful manner.',
            'Passengers may report drivers who behave unprofessionally or unsafely.',
            'Do not touch the driver or their belongings without permission.',
          ]} />
        </GuidelineSection>

        {/* ===== 5. PROHIBITED ITEMS ===== */}
        <GuidelineSection
          icon={<Package size={20} color="#dc2626" strokeWidth={2} />}
          title="5. Prohibited Items"
          accentColor="#dc2626"
          bgColor="rgba(239, 68, 68, 0.06)"
        >
          <GuidelineParagraph>
            Certain items are strictly prohibited in PATULOD vehicles. Bringing prohibited items endangers everyone.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Firearms, bladed weapons, or any weapon.',
            'Explosive materials, flammable liquids, or hazardous chemicals.',
            'Illegal drugs or controlled substances.',
            'Live animals (unless pre-arranged and agreed with the driver).',
            'Items of unusual size that create safety hazards or obstruct the driver.',
          ]} />
          <GuidelineNote color="red">
            Drivers are required to refuse service if prohibited items are present. Bringing prohibited items may result in permanent account suspension and may be reported to authorities.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== 6. FARES & PAYMENT ===== */}
        <GuidelineSection
          icon={<DollarSign size={20} color="#0369a1" strokeWidth={2} />}
          title="6. Fares & Payment"
          accentColor="#0369a1"
          bgColor="rgba(3, 105, 161, 0.06)"
        >
          <GuidelineParagraph>
            Fares are calculated based on PATULOD's published rates. You will always see a fare estimate before confirming a booking.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Always pay the displayed fare in full at the end of the trip.',
            'Do not negotiate a fare below the quoted amount with the driver.',
            'If the final fare differs from your estimate, you will be informed of the reason.',
            'During this prototype phase, cash is the only accepted payment method.',
            'Never pay before the ride is completed unless instructed by the app.',
          ]} />
          <GuidelineNote color="yellow">
            Drivers are not permitted to charge more than the fare shown in the app. If overcharged, report it immediately.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== 7. YOUR BELONGINGS ===== */}
        <GuidelineSection
          icon={<Briefcase size={20} color="#92400e" strokeWidth={2} />}
          title="7. Your Belongings"
          accentColor="#92400e"
          bgColor="rgba(251, 191, 36, 0.08)"
        >
          <GuidelineParagraph>
            PATULOD and its drivers are not responsible for lost or forgotten items. Take care of your belongings on every ride.
          </GuidelineParagraph>
          <GuidelineList items={[
            'Check that you have all your belongings before exiting the vehicle.',
            'Do not leave valuables unattended in the vehicle.',
            'If you forget an item, contact the driver immediately via the app\'s contact feature (available during active rides).',
            'PATULOD will assist in facilitating recovery where possible, but cannot guarantee the return of lost items.',
          ]} />
        </GuidelineSection>

        {/* ===== 8. CONTACT DURING RIDES ===== */}
        <GuidelineSection
          icon={<PhoneCall size={20} color={PRIMARY_GREEN} strokeWidth={2} />}
          title="8. Contacting Your Driver"
          accentColor={PRIMARY_GREEN}
          bgColor="rgba(13, 95, 58, 0.07)"
        >
          <GuidelineParagraph>
            PATULOD provides a direct phone dialer between passengers and drivers during active rides.
          </GuidelineParagraph>
          <GuidelineList items={[
            'The driver\'s phone number is visible when you initiate a call through the app.',
            'This contact is available from when a driver is assigned through the end of the trip.',
            'The contact feature is removed after the trip is completed or cancelled.',
            'Use this feature for ride coordination only — not for personal contact after the trip.',
          ]} />
          <GuidelineNote color="green">
            There is no masked calling or in-app messaging in this prototype. Direct calls reveal the driver's number. This is documented here so you are informed.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== 9. REPORTING ===== */}
        <GuidelineSection
          icon={<Flag size={20} color="#dc2626" strokeWidth={2} />}
          title="9. Reporting Issues"
          accentColor="#dc2626"
          bgColor="rgba(239, 68, 68, 0.06)"
        >
          <GuidelineParagraph>
            Your reports help keep PATULOD safe for everyone. Please report any of the following:
          </GuidelineParagraph>
          <GuidelineList items={[
            'Driver identity or vehicle does not match the app.',
            'Driver requested payment beyond the quoted fare.',
            'Threatening, abusive, or unsafe driver behavior.',
            'Prohibited items were present in the vehicle.',
            'Any incident that made you feel unsafe during a ride.',
          ]} />
          <GuidelineParagraph>
            Reports can be submitted through the{' '}
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/support')}>
              Help / Support page
            </Text>
            . All reports are reviewed by the PATULOD team.
          </GuidelineParagraph>
          <GuidelineNote color="red">
            PATULOD does not offer 24/7 live monitoring or immediate incident response at this time. For urgent safety situations, contact emergency services (911) directly.
          </GuidelineNote>
        </GuidelineSection>

        {/* ===== DOCUMENT FOOTER ===== */}
        <View
          className="rounded-2xl p-4 items-center gap-1"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            PATULOD Safety & Community Guidelines
          </Text>
          <Text size="xs" className="text-muted-foreground text-center">
            Available before and during every ride
          </Text>
          <Text size="xs" className="text-muted-foreground text-center">
            These guidelines may be updated as the service evolves.
          </Text>
        </View>

        {/* ===== BACK BUTTON ===== */}
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.back()}
        >
          <Text size="base" weight="semibold" className="text-white">Back</Text>
        </Button>

        <View style={{ height: 8 }} />
      </View>
    </ScrollView>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function GuidelineSection({
  icon,
  title,
  accentColor,
  bgColor,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
  bgColor: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <View
          className="h-9 w-9 rounded-full items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </View>
        <Text size="base" weight="bold" style={{ color: accentColor }} className="flex-1">
          {title}
        </Text>
      </View>
      <View
        className="rounded-2xl p-4 gap-2.5"
        style={{ backgroundColor: bgColor }}
      >
        {children}
      </View>
    </View>
  );
}

function GuidelineParagraph({ children }: { children: React.ReactNode }) {
  return (
    <Text size="sm" className="text-foreground leading-relaxed">
      {children}
    </Text>
  );
}

function GuidelineList({ items }: { items: string[] }) {
  return (
    <View className="gap-2 pl-1">
      {items.map((item, i) => (
        <View key={i} className="flex-row items-start gap-2.5">
          <Text size="sm" style={{ color: PRIMARY_GREEN, lineHeight: 20 }}>•</Text>
          <Text size="sm" className="text-foreground leading-relaxed flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
}

function GuidelineNote({ children, color }: { children: React.ReactNode; color: 'green' | 'yellow' | 'red' }) {
  const styles = {
    green: {
      bg: 'rgba(13, 95, 58, 0.1)',
      border: 'rgba(13, 95, 58, 0.3)',
      text: PRIMARY_GREEN,
    },
    yellow: {
      bg: 'rgba(251, 191, 36, 0.12)',
      border: 'rgba(251, 191, 36, 0.35)',
      text: '#92400e',
    },
    red: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#991b1b',
    },
  };
  const s = styles[color];
  return (
    <View
      className="rounded-xl p-3"
      style={{ backgroundColor: s.bg, borderWidth: 1, borderColor: s.border }}
    >
      <Text size="xs" weight="medium" style={{ color: s.text }}>
        📌 {children}
      </Text>
    </View>
  );
}
