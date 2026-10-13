import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import { ArrowLeft, Lock } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

const PRIVACY_VERSION = '1.0.0';
const PRIVACY_EFFECTIVE_DATE = 'October 8, 2026';

/**
 * Privacy Notice Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md:
 * - Full text layout
 * - Version number and effective date
 * - Acknowledgment is NOT blanket consent
 * - Accessible before registration (no auth required)
 */
export default function Privacy() {
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
          Privacy Notice
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
            <Lock size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
              Privacy Notice
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Version {PRIVACY_VERSION} • Effective {PRIVACY_EFFECTIVE_DATE}
            </Text>
            <Text size="xs" className="text-muted-foreground">
              PATULOD Ride-Hailing Service
            </Text>
          </View>
        </View>

        {/* ===== NOT BLANKET CONSENT NOTICE ===== */}
        <View
          className="rounded-2xl p-4 gap-1.5"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.06)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' }}
        >
          <Text size="sm" weight="bold" style={{ color: '#1d4ed8' }}>
            ℹ️ About This Notice
          </Text>
          <Text size="xs" className="leading-relaxed" style={{ color: '#1e40af' }}>
            Acknowledging this Privacy Notice is not blanket consent to all data uses. It means you have been informed of how we collect and use your data. Where your explicit consent is required for specific uses, we will ask separately.
          </Text>
        </View>

        {/* ===== INTRO ===== */}
        <PrivacySection title="Introduction">
          <PrivacyParagraph>
            PATULOD is committed to protecting your personal information. This Privacy Notice explains what data we collect, why we collect it, how it is used, and your rights regarding your information.
          </PrivacyParagraph>
          <PrivacyParagraph>
            This Notice applies to all users of the PATULOD platform — passengers and drivers. By using our service, you acknowledge that you have read and understood this Notice.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 1. WHAT WE COLLECT ===== */}
        <PrivacySection title="1. What We Collect">
          <PrivacyParagraph>
            We collect only what is necessary to provide and improve the PATULOD service. This includes:
          </PrivacyParagraph>

          <PrivacySubSection title="Account Information">
            <PrivacyList items={[
              'Full name',
              'Email address',
              'Philippine mobile phone number',
              'Password (stored as a secure hash — never in plain text)',
              'Date and version of Terms acceptance and Privacy Notice acknowledgment',
            ]} />
          </PrivacySubSection>

          <PrivacySubSection title="Trip and Booking Data">
            <PrivacyList items={[
              'Pickup and destination addresses',
              'Trip start and end times',
              'Fare paid and payment status',
              'Booking reference numbers',
              'Trip events and status history',
            ]} />
          </PrivacySubSection>

          <PrivacySubSection title="Location Data">
            <PrivacyList items={[
              'Your device location at the time of booking (for pickup accuracy)',
              'Driver location during active trips (relayed to passenger for safety and ETA)',
              'Location data is not stored continuously — only captured at relevant trip events',
            ]} />
          </PrivacySubSection>

          <PrivacySubSection title="Device and App Data">
            <PrivacyList items={[
              'Device type and operating system (for compatibility)',
              'Push notification token (for ride status alerts)',
              'App usage logs for debugging and service improvement',
            ]} />
          </PrivacySubSection>

          <PrivacyNote>
            We do not collect biometric data, financial account details, or any information beyond what is listed above.
          </PrivacyNote>
        </PrivacySection>

        {/* ===== 2. HOW WE USE IT ===== */}
        <PrivacySection title="2. How We Use Your Information">
          <PrivacyParagraph>
            Your information is used solely for the following purposes:
          </PrivacyParagraph>
          <PrivacyList items={[
            'Creating and managing your account',
            'Processing and fulfilling your ride bookings',
            'Matching you with an available driver',
            'Sending ride status notifications and alerts',
            'Calculating and disclosing fares',
            'Verifying driver identity and eligibility',
            'Providing customer support',
            'Maintaining safety records and audit trails',
            'Improving the platform based on usage patterns',
          ]} />
          <PrivacyParagraph>
            We do not use your data for advertising, profiling, or any purpose unrelated to providing the PATULOD service.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 3. WHO WE SHARE WITH ===== */}
        <PrivacySection title="3. Who We Share Your Information With">
          <PrivacyParagraph>
            PATULOD does not sell your personal data. We share limited information only in these circumstances:
          </PrivacyParagraph>

          <PrivacySubSection title="With Your Driver (During Active Rides)">
            <PrivacyParagraph>
              Your first name and pickup location are shared with your assigned driver to facilitate the ride. Your full contact number is accessible via the in-app dialer for direct communication during the ride only.
            </PrivacyParagraph>
          </PrivacySubSection>

          <PrivacySubSection title="With Service Providers">
            <PrivacyParagraph>
              We use third-party services to operate the platform (e.g., push notification delivery, file storage for driver documents, email delivery for password resets). These providers receive only the minimum data necessary and are not permitted to use it for their own purposes.
            </PrivacyParagraph>
          </PrivacySubSection>

          <PrivacySubSection title="Legal and Safety Requirements">
            <PrivacyParagraph>
              We may disclose information when required by law, in response to a valid legal process, or to protect the safety of our users or the public.
            </PrivacyParagraph>
          </PrivacySubSection>
        </PrivacySection>

        {/* ===== 4. DATA RETENTION ===== */}
        <PrivacySection title="4. How Long We Keep Your Data">
          <PrivacyParagraph>
            We retain your data for as long as your account is active or as needed to provide the service. When you request account deletion, we will remove your personal information subject to the following:
          </PrivacyParagraph>
          <PrivacyList items={[
            'Trip records and payment records may be retained for a legally required period for audit and dispute purposes.',
            'Anonymized or aggregated data (with no personal identifiers) may be retained indefinitely for service improvement.',
            'Data shared with third-party providers is subject to their own retention schedules, governed by our agreements with them.',
          ]} />
          <PrivacyNote>
            Requesting account deletion does not guarantee immediate removal of all records. We will inform you of what is retained and why.
          </PrivacyNote>
        </PrivacySection>

        {/* ===== 5. YOUR RIGHTS ===== */}
        <PrivacySection title="5. Your Rights">
          <PrivacyParagraph>
            You have the following rights regarding your personal information:
          </PrivacyParagraph>
          <PrivacyList items={[
            'Access — request a copy of the personal data we hold about you.',
            'Correction — request corrections to inaccurate or incomplete data.',
            'Deletion — request deletion of your account and personal data, subject to retention requirements.',
            'Portability — request your data in a portable format where technically feasible.',
            'Objection — object to specific uses of your data that are not strictly necessary for the service.',
          ]} />
          <PrivacyParagraph>
            To exercise any of these rights, contact us through the{' '}
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/support')}>
              Help / Support page
            </Text>
            . We will respond within a reasonable timeframe.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 6. SECURITY ===== */}
        <PrivacySection title="6. How We Protect Your Data">
          <PrivacyParagraph>
            We apply technical and organizational measures to protect your personal information, including:
          </PrivacyParagraph>
          <PrivacyList items={[
            'Passwords stored as secure cryptographic hashes — never readable by anyone.',
            'Encrypted data transmission between your device and our servers.',
            'Access controls limiting which team members can view user data.',
            'Audit logs recording sensitive operations on accounts.',
          ]} />
          <PrivacyParagraph>
            No system is completely secure. In the event of a data breach that affects your personal information, we will notify you promptly and take steps to mitigate the impact.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 7. CHILDREN ===== */}
        <PrivacySection title="7. Minors">
          <PrivacyParagraph>
            PATULOD is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has registered without authorization, please contact us so we can remove the account.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 8. CHANGES ===== */}
        <PrivacySection title="8. Changes to This Notice">
          <PrivacyParagraph>
            We may update this Privacy Notice as the service evolves. Material changes will be communicated to you before they take effect. The version number and effective date at the top of this document reflect the current version.
          </PrivacyParagraph>
          <PrivacyParagraph>
            Continued use of PATULOD after an update constitutes acknowledgment of the revised Notice.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== 9. CONTACT ===== */}
        <PrivacySection title="9. Contact">
          <PrivacyParagraph>
            For any questions, concerns, or requests related to this Privacy Notice or how your data is handled, please contact us through the{' '}
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }} onPress={() => router.push('/support')}>
              Help / Support page
            </Text>
            {' '}in the app.
          </PrivacyParagraph>
        </PrivacySection>

        {/* ===== DOCUMENT FOOTER ===== */}
        <View
          className="rounded-2xl p-4 items-center gap-1"
          style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            PATULOD Privacy Notice
          </Text>
          <Text size="xs" className="text-muted-foreground text-center">
            Version {PRIVACY_VERSION} • Effective {PRIVACY_EFFECTIVE_DATE}
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

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <Text size="base" weight="bold" style={{ color: PRIMARY_GREEN }}>
        {title}
      </Text>
      <View className="gap-2.5">{children}</View>
    </View>
  );
}

function PrivacySubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-1.5 pl-1">
      <Text size="sm" weight="semibold" className="text-foreground">
        {title}
      </Text>
      {children}
    </View>
  );
}

function PrivacyParagraph({ children }: { children: React.ReactNode }) {
  return (
    <Text size="sm" className="text-foreground leading-relaxed">
      {children}
    </Text>
  );
}

function PrivacyList({ items }: { items: string[] }) {
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

function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="rounded-xl p-3"
      style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
    >
      <Text size="xs" weight="medium" style={{ color: '#92400e' }}>
        📌 Note: {children}
      </Text>
    </View>
  );
}
