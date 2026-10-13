import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text, Card } from 'panelui-native';
import { ArrowLeft, FileText } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';

const TERMS_VERSION = '1.0.0';
const TERMS_EFFECTIVE_DATE = 'October 8, 2026';

/**
 * Terms and Understanding Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md:
 * - Full text layout
 * - Version number and effective date
 * - "Terms and Understanding" — not "Terms of Service"
 * - Accessible before registration (no auth required)
 */
export default function Terms() {
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
          Terms and Understanding
        </Text>
      </View>

      <View className="px-5 gap-6">

        {/* ===== DOCUMENT META ===== */}
        <View
          className="flex-row items-start gap-3 rounded-2xl p-4"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
        >
          <View
            className="h-10 w-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <FileText size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
              Terms and Understanding
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Version {TERMS_VERSION} • Effective {TERMS_EFFECTIVE_DATE}
            </Text>
            <Text size="xs" className="text-muted-foreground">
              PATULOD Ride-Hailing Service
            </Text>
          </View>
        </View>

        {/* ===== INTRO ===== */}
        <TermsSection title="Introduction">
          <TermsParagraph>
            These Terms and Understanding ("Terms") describe how PATULOD operates and what you can expect when using our service. By registering or using the PATULOD platform, you confirm that you have read, understood, and agree to these Terms.
          </TermsParagraph>
          <TermsParagraph>
            PATULOD is a community-focused ride-hailing service. We connect passengers with local drivers within a defined service area. Our goal is to provide a safe, transparent, and fair transportation experience for everyone.
          </TermsParagraph>
          <TermsNote>
            These Terms apply to all users — passengers and drivers alike. Additional terms apply to drivers during onboarding.
          </TermsNote>
        </TermsSection>

        {/* ===== 1. WHO CAN USE PATULOD ===== */}
        <TermsSection title="1. Who Can Use PATULOD">
          <TermsParagraph>
            To use PATULOD as a passenger, you must:
          </TermsParagraph>
          <TermsList items={[
            'Be at least 18 years of age, or have the consent of a parent or guardian.',
            'Provide accurate and truthful information during registration.',
            'Have access to a valid mobile phone number and email address.',
            'Agree to these Terms and our Privacy Notice.',
          ]} />
          <TermsParagraph>
            Accounts may not be transferred or shared. You are responsible for all activity under your account. If you believe your account has been compromised, contact us immediately.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 2. THE SERVICE ===== */}
        <TermsSection title="2. The Service">
          <TermsParagraph>
            PATULOD provides a platform that connects passengers seeking transportation with independent drivers offering ride services. PATULOD is not a transportation company — drivers are independent and not employees of PATULOD.
          </TermsParagraph>
          <TermsParagraph>
            Our service operates within a defined geographic boundary. Bookings for pickups or destinations outside this service area will not be accepted.
          </TermsParagraph>
          <TermsParagraph>
            PATULOD is a prototype service. While we strive to provide a reliable experience, we cannot guarantee uninterrupted availability. Service may be limited by driver availability, area coverage, or technical factors.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 3. BOOKINGS AND RIDES ===== */}
        <TermsSection title="3. Bookings and Rides">
          <TermsParagraph>
            When you book a ride through PATULOD, you are requesting a service from a driver in your area. A booking is confirmed only when a driver accepts your request.
          </TermsParagraph>
          <TermsParagraph>
            Fares are calculated based on published rates. An estimate is shown before you confirm a booking. The final fare may vary from the estimate due to route changes or other factors, and any difference will be disclosed to you.
          </TermsParagraph>
          <TermsParagraph>
            Cancellations are permitted at certain stages of the booking process. Cancellation fees may apply depending on when you cancel and the stage of the ride. These rules are disclosed at the time of cancellation.
          </TermsParagraph>
          <TermsNote>
            During this prototype phase, cash is the only accepted payment method.
          </TermsNote>
        </TermsSection>

        {/* ===== 4. YOUR RESPONSIBILITIES ===== */}
        <TermsSection title="4. Your Responsibilities">
          <TermsParagraph>
            As a passenger, you agree to:
          </TermsParagraph>
          <TermsList items={[
            'Verify the driver\'s identity and vehicle before boarding (name, vehicle type, plate number).',
            'Treat drivers with respect and courtesy.',
            'Not bring prohibited or dangerous items into any vehicle.',
            'Not request the driver to violate traffic laws or safety guidelines.',
            'Pay the agreed fare in full at the completion of the trip.',
            'Report any safety concerns or incidents promptly.',
          ]} />
          <TermsParagraph>
            Behavior that violates these responsibilities may result in suspension or permanent removal from the platform.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 5. SAFETY ===== */}
        <TermsSection title="5. Safety">
          <TermsParagraph>
            Your safety is our priority. PATULOD requires all drivers to complete a screening and document verification process before being approved. However, we cannot guarantee the conduct of any individual driver or passenger.
          </TermsParagraph>
          <TermsParagraph>
            PATULOD provides direct phone contact between passengers and drivers during active rides. This means the driver's phone number will be visible to you. This is intentional — it allows direct communication without relying solely on app connectivity.
          </TermsParagraph>
          <TermsParagraph>
            In an emergency, always contact local emergency services first. PATULOD does not offer an in-app SOS or emergency dispatch service at this time.
          </TermsParagraph>
          <TermsNote>
            Review our{' '}
            <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/safety')}>
              Safety and Community Guidelines
            </Text>
            {' '}for specific safety practices recommended before and during every ride.
          </TermsNote>
        </TermsSection>

        {/* ===== 6. PRIVACY ===== */}
        <TermsSection title="6. Privacy">
          <TermsParagraph>
            Your personal information is handled in accordance with our{' '}
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/privacy')}>
              Privacy Notice
            </Text>
            . By using PATULOD, you acknowledge the collection and use of your information as described in that document.
          </TermsParagraph>
          <TermsParagraph>
            We collect only what is necessary to provide the service: your name, contact details, trip records, and app usage. We do not sell your data to third parties.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 7. LIMITATIONS ===== */}
        <TermsSection title="7. Limitations of Service">
          <TermsParagraph>
            PATULOD is provided on a best-effort basis during this prototype phase. We do not guarantee:
          </TermsParagraph>
          <TermsList items={[
            'Continuous or uninterrupted availability of the service.',
            'A driver will always be available in your area.',
            'Exact pickup or arrival times.',
            'That all features shown in the app are currently operational.',
          ]} />
          <TermsParagraph>
            PATULOD\'s liability is limited to the value of the disputed transaction. We are not liable for indirect losses, missed appointments, or consequential damages arising from service unavailability.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 8. ACCOUNT TERMINATION ===== */}
        <TermsSection title="8. Account Deactivation and Deletion">
          <TermsParagraph>
            You may request deactivation or deletion of your account at any time through the app or by contacting support. Account deactivation suspends your access; deletion removes your personal data subject to legal retention requirements.
          </TermsParagraph>
          <TermsParagraph>
            PATULOD may suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a safety risk to others. You will be informed of the reason where permitted.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 9. CHANGES TO TERMS ===== */}
        <TermsSection title="9. Changes to These Terms">
          <TermsParagraph>
            PATULOD may update these Terms as the service evolves. You will be notified of material changes before they take effect. Continued use of the service after changes constitute your acceptance of the updated Terms.
          </TermsParagraph>
          <TermsParagraph>
            The version number and effective date at the top of this document reflect the currently active Terms.
          </TermsParagraph>
        </TermsSection>

        {/* ===== 10. CONTACT ===== */}
        <TermsSection title="10. Questions and Contact">
          <TermsParagraph>
            If you have questions about these Terms or how PATULOD operates, please reach out through our{' '}
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/support')}>
              Help / Support page
            </Text>
            . We are committed to being transparent and responsive to your concerns.
          </TermsParagraph>
        </TermsSection>

        {/* ===== DOCUMENT FOOTER ===== */}
        <View
          className="rounded-2xl p-4 items-center gap-1"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            PATULOD Terms and Understanding
          </Text>
          <Text size="xs" className="text-muted-foreground text-center">
            Version {TERMS_VERSION} • Effective {TERMS_EFFECTIVE_DATE}
          </Text>
          <Text size="xs" className="text-muted-foreground text-center">
            This document is subject to change. Check back for the latest version.
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

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text size="base" weight="bold" style={{ color: PRIMARY_GREEN }}>
        {title}
      </Text>
      <View className="gap-2.5">{children}</View>
    </View>
  );
}

function TermsParagraph({ children }: { children: React.ReactNode }) {
  return (
    <Text size="sm" className="text-foreground leading-relaxed">
      {children}
    </Text>
  );
}

function TermsList({ items }: { items: string[] }) {
  return (
    <View className="gap-2 pl-2">
      {items.map((item, i) => (
        <View key={i} className="flex-row items-start gap-2.5">
          <Text size="sm" style={{ color: PRIMARY_GREEN, lineHeight: 20 }}>•</Text>
          <Text size="sm" className="text-foreground leading-relaxed flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
}

function TermsNote({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="rounded-xl p-3 gap-1"
      style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
    >
      <Text size="xs" weight="medium" style={{ color: '#92400e' }}>
        📌 Note: {children}
      </Text>
    </View>
  );
}
