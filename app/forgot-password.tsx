import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Send } from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

/**
 * Forgot Password Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 1:
 * - Email input
 * - Neutral confirmation message regardless of whether account exists
 *   (never reveals if an email is registered — security requirement)
 * - Short-lived single-use link described in confirmation copy
 */
export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const emailInvalid =
    attempted && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));

  function handleSubmit() {
    setAttempted(true);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 1200);
  }

  // ── Sent / confirmation state ──────────────────────────────────
  if (sent) {
    return (
      <View
        className="flex-1 px-6"
        style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, backgroundColor: '#fefdfb' }}
      >
        {/* Header */}
        <View className="flex-row items-center gap-3 py-3 mb-6">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Check Your Email
          </Text>
        </View>

        {/* Confirmation card */}
        <View className="flex-1 items-center justify-center gap-8">
          <View className="items-center gap-6">
            <View
              className="h-24 w-24 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)' }}
            >
              <Send size={40} color={PRIMARY_GREEN} strokeWidth={1.75} />
            </View>

            <View className="items-center gap-3">
              <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }} className="text-center">
                Email Sent
              </Text>
              {/* Deliberately neutral — does NOT confirm account existence */}
              <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
                If an account exists for{' '}
                <Text size="sm" weight="semibold" className="text-foreground">
                  {email.trim()}
                </Text>
                , a password reset link has been sent to that address.
              </Text>
              <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
                The link is valid for a short time and can only be used once. Check your spam folder if you don't see it.
              </Text>
            </View>
          </View>

          <View className="w-full gap-3">
            <Button
              size="lg"
              className="w-full"
              style={{ backgroundColor: PRIMARY_GREEN }}
              onPress={() => router.replace('/login')}
            >
              <Text size="base" weight="bold" className="text-white">Back to Login</Text>
            </Button>

            {/* Resend option */}
            <Button
              size="md"
              variant="ghost"
              className="w-full"
              onPress={() => setSent(false)}
            >
              <Text size="sm" weight="medium" style={{ color: PRIMARY_GREEN }}>
                Try a different email address
              </Text>
            </Button>
          </View>

          <Text size="xs" className="text-muted-foreground text-center px-4">
            Phase 0.5 — Mock. No email is actually sent.
          </Text>
        </View>
      </View>
    );
  }

  // ── Input state ────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== HEADER ===== */}
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
            Forgot Password
          </Text>
        </View>

        <View className="flex-1 px-5 gap-8">

          {/* ===== ILLUSTRATION + COPY ===== */}
          <View className="items-center gap-4 pt-6 pb-2">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
            >
              <Mail size={36} color={PRIMARY_GREEN} strokeWidth={1.75} />
            </View>
            <View className="items-center gap-2">
              <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                Reset Your Password
              </Text>
              <Text size="sm" className="text-muted-foreground text-center leading-relaxed px-4">
                Enter the email address linked to your PATULOD account. We'll send you a reset link if an account exists.
              </Text>
            </View>
          </View>

          {/* ===== EMAIL FIELD ===== */}
          <View className="gap-1.5">
            <Text size="sm" weight="semibold" className="text-foreground">Email Address</Text>
            <View
              className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
              style={{
                borderWidth: 1.5,
                borderColor: emailInvalid ? ERROR_RED : '#e5e5e3',
                backgroundColor: '#fff',
              }}
            >
              <Mail size={18} color="#9ca3af" strokeWidth={2} />
              <TextInput
                className="flex-1"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={v => { setEmail(v); setAttempted(false); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </View>
            {emailInvalid && (
              <View className="flex-row items-center gap-1.5 px-1">
                <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                <Text size="xs" style={{ color: ERROR_RED }}>
                  {!email.trim() ? 'Email address is required.' : 'Enter a valid email address.'}
                </Text>
              </View>
            )}
          </View>

          {/* ===== SUBMIT ===== */}
          <View className="gap-4">
            <Button
              size="lg"
              className="w-full"
              style={{
                backgroundColor: PRIMARY_GREEN,
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text size="base" weight="bold" className="text-white">
                {isSubmitting ? 'Sending…' : 'Send Reset Link'}
              </Text>
            </Button>

            <Button
              size="md"
              variant="ghost"
              className="w-full"
              onPress={() => router.back()}
            >
              <Text size="sm" weight="medium" style={{ color: PRIMARY_GREEN }}>
                Back to Login
              </Text>
            </Button>
          </View>

          {/* ===== SECURITY NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1.5"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
              🔒 Security Notice
            </Text>
            <Text size="xs" className="text-muted-foreground leading-relaxed">
              For your security, we do not confirm whether an email address is registered. The response will be the same regardless.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
