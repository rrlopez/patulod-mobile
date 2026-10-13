import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';

const CONTACT_METHODS = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email Support',
    subtitle: 'support@patulod.com',
    detail: 'We typically respond within 24 hours',
    action: () => Linking.openURL('mailto:support@patulod.com'),
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone Support',
    subtitle: '+63 917 123 4567',
    detail: 'Mon-Fri, 8:00 AM - 6:00 PM',
    action: () => Linking.openURL('tel:+639171234567'),
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Live Chat',
    subtitle: 'Chat with our support team',
    detail: 'Available 9:00 AM - 5:00 PM',
    action: () => {}, // Mock action for now
  },
];

const FAQ_ITEMS = [
  {
    question: 'How long does application review take?',
    answer: 'Application reviews typically take 1-3 business days.',
  },
  {
    question: 'What documents do I need to provide?',
    answer: "You'll need a valid driver's license, OR/CR, government ID, selfie with ID, and vehicle photo.",
  },
  {
    question: 'Why was my application rejected?',
    answer: 'Common reasons include expired documents, unclear photos, or mismatched information. Check your email for specific details.',
  },
];

/**
 * Support/Contact Screen
 * Phase 0.5 — Mock UI
 *
 * Provides contact methods and FAQ for users needing help
 */
export default function Support() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
          Support & Help
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="px-5 gap-6">
          {/* ===== INTRO ===== */}
          <View className="gap-2 pt-2">
            <Text size="lg" weight="bold" className="text-foreground">
              How can we help you?
            </Text>
            <Text size="sm" className="text-muted-foreground leading-relaxed">
              Our support team is here to assist you with any questions or concerns about your PATULOD account.
            </Text>
          </View>

          {/* ===== CONTACT METHODS ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Contact Us
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              {CONTACT_METHODS.map((method, i) => {
                const Icon = method.icon;
                return (
                  <View key={method.id}>
                    <TouchableOpacity
                      className="flex-row items-center gap-4 px-4 py-4"
                      onPress={method.action}
                      activeOpacity={0.6}
                    >
                      <View
                        className="h-12 w-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: 'rgba(13,95,58,0.1)' }}
                      >
                        <Icon size={20} color={PRIMARY_GREEN} strokeWidth={2} />
                      </View>
                      <View className="flex-1 gap-1">
                        <Text size="base" weight="semibold" className="text-foreground">
                          {method.title}
                        </Text>
                        <Text size="sm" weight="medium" style={{ color: PRIMARY_GREEN }}>
                          {method.subtitle}
                        </Text>
                        <Text size="xs" className="text-muted-foreground">
                          {method.detail}
                        </Text>
                      </View>
                      <ChevronRight size={18} color="#9ca3af" strokeWidth={2} />
                    </TouchableOpacity>
                    {i < CONTACT_METHODS.length - 1 && (
                      <View className="h-px bg-border/40 mx-4" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* ===== OFFICE HOURS ===== */}
          <View
            className="rounded-2xl p-4 gap-2"
            style={{ backgroundColor: 'rgba(13,95,58,0.05)', borderWidth: 1, borderColor: 'rgba(13,95,58,0.12)' }}
          >
            <View className="flex-row items-center gap-2">
              <Clock size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                Support Hours
              </Text>
            </View>
            <Text size="sm" className="text-foreground leading-relaxed">
              Monday - Friday: 8:00 AM - 6:00 PM{'\n'}
              Saturday: 9:00 AM - 4:00 PM{'\n'}
              Sunday: Closed
            </Text>
          </View>

          {/* ===== FAQ ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Frequently Asked Questions
            </Text>
            <View className="gap-3">
              {FAQ_ITEMS.map((item, i) => (
                <View
                  key={i}
                  className="rounded-2xl p-4 gap-2"
                  style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
                >
                  <Text size="sm" weight="bold" className="text-foreground">
                    {item.question}
                  </Text>
                  <Text size="sm" className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ===== OFFICE LOCATION ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Office Location
            </Text>
            <View
              className="rounded-2xl p-4 gap-3"
              style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(13,95,58,0.1)' }}
                >
                  <MapPin size={18} color={PRIMARY_GREEN} strokeWidth={2} />
                </View>
                <View className="flex-1 gap-1">
                  <Text size="base" weight="semibold" className="text-foreground">
                    PATULOD Headquarters
                  </Text>
                  <Text size="sm" className="text-muted-foreground leading-relaxed">
                    123 Main Street, Tuguegarao City{'\n'}
                    Cagayan Valley, Philippines 3500
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ===== MOCK NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1"
            style={{ backgroundColor: 'rgba(13,95,58,0.05)', borderWidth: 1, borderColor: 'rgba(13,95,58,0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Phase 0.5 — Mock UI
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Contact methods are placeholders. Real integration in Phase 1.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
