import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

/**
 * Login Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 1:
 * - Email + Password (show/hide)
 * - Generic error on failure (no field-level hints that leak account existence)
 * - Forgot password link
 * - PATULOD-themed
 * - Mock: any non-empty email + password navigates to passenger home
 *   Mock "wrong" credentials: email = "fail@test.com" shows error state
 */
export default function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generic error — never reveals whether email or password was wrong
  const [genericError, setGenericError] = useState('');

  // Touched — only show missing-field hints after a submit attempt
  const [attempted, setAttempted] = useState(false);

  const emailMissing = attempted && !email.trim();
  const passwordMissing = attempted && !password;

  function handleLogin() {
    setAttempted(true);
    setGenericError('');
    if (!email.trim() || !password) return;

    setIsSubmitting(true);

    // Mock: simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);

      // Mock failure trigger for demo purposes
      if (email.trim().toLowerCase() === 'fail@test.com') {
        setGenericError('Incorrect email or password. Please try again.');
        return;
      }

      // Route based on email (dev-only)
      const emailLower = email.trim().toLowerCase();
      if (emailLower === 'apply@patulod.com') {
        // Driver application not yet approved → status screen
        router.replace('/driver-status');
      } else if (emailLower === 'driver@patulod.com') {
        // Approved driver → driver dashboard
        router.replace('/(driver)/home');
      } else {
        // Default to passenger (includes rider@patulod.com or any other email)
        router.replace('/(passenger)/home');
      }
    }, 1200);
  }

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
            Log In
          </Text>
        </View>

        <View className="flex-1 px-5 gap-8">

          {/* ===== BRAND MARK ===== */}
          <View className="items-center gap-3 pt-4 pb-2">
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: PRIMARY_GREEN }}
            >
              <View
                className="absolute inset-2.5 rounded-full"
                style={{ borderWidth: 2, borderColor: '#fbbf24' }}
              />
              <Text weight="bold" className="text-white" style={{ fontSize: 36 }}>P</Text>
            </View>
            <View className="items-center gap-1">
              <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN, letterSpacing: 1.5 }}>
                PATULOD
              </Text>
              <Text size="xs" className="text-muted-foreground italic">
                Patulod, Kaluganan a gayyem mo.
              </Text>
            </View>
          </View>

          {/* ===== FORM ===== */}
          <View className="gap-5">

            {/* Generic error banner */}
            {genericError ? (
              <View
                className="flex-row items-start gap-3 rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.07)', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.25)' }}
              >
                <AlertCircle size={18} color={ERROR_RED} strokeWidth={2.5} style={{ marginTop: 1 }} />
                <Text size="sm" style={{ color: ERROR_RED, flex: 1 }}>
                  {genericError}
                </Text>
              </View>
            ) : null}

            {/* Email */}
            <View className="gap-1.5">
              <Text size="sm" weight="semibold" className="text-foreground">Email Address</Text>
              <View
                className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  borderWidth: 1.5,
                  borderColor: emailMissing ? ERROR_RED : genericError ? 'rgba(220,38,38,0.4)' : '#e5e5e3',
                  backgroundColor: '#fff',
                }}
              >
                <Mail size={18} color="#9ca3af" strokeWidth={2} />
                <TextInput
                  className="flex-1"
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={v => { setEmail(v); setGenericError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  style={{ fontSize: 15, color: '#1a1a1a' }}
                />
              </View>
              {emailMissing && (
                <View className="flex-row items-center gap-1.5 px-1">
                  <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                  <Text size="xs" style={{ color: ERROR_RED }}>Email is required.</Text>
                </View>
              )}
            </View>

            {/* Password */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text size="sm" weight="semibold" className="text-foreground">Password</Text>
                <TouchableOpacity onPress={() => router.push('/forgot-password')} hitSlop={8}>
                  <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  borderWidth: 1.5,
                  borderColor: passwordMissing ? ERROR_RED : genericError ? 'rgba(220,38,38,0.4)' : '#e5e5e3',
                  backgroundColor: '#fff',
                }}
              >
                <Lock size={18} color="#9ca3af" strokeWidth={2} />
                <TextInput
                  className="flex-1"
                  placeholder="Your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={v => { setPassword(v); setGenericError(''); }}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  style={{ fontSize: 15, color: '#1a1a1a' }}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  {showPassword
                    ? <EyeOff size={18} color="#9ca3af" strokeWidth={2} />
                    : <Eye size={18} color="#9ca3af" strokeWidth={2} />
                  }
                </TouchableOpacity>
              </View>
              {passwordMissing && (
                <View className="flex-row items-center gap-1.5 px-1">
                  <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                  <Text size="xs" style={{ color: ERROR_RED }}>Password is required.</Text>
                </View>
              )}
            </View>

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
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text size="base" weight="bold" className="text-white">
                {isSubmitting ? 'Logging in…' : 'Log In'}
              </Text>
            </Button>

            {/* Register link */}
            <View className="flex-row items-center justify-center gap-1.5">
              <Text size="sm" className="text-muted-foreground">Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.replace('/register')} hitSlop={8}>
                <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== MOCK HINT ===== */}
          <View
            className="rounded-2xl p-4 gap-1.5"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Phase 0.5 — Mock Login
            </Text>
            <Text size="xs" className="text-muted-foreground leading-relaxed">
              <Text size="xs" weight="semibold">rider@patulod.com</Text> → Passenger flow{'\n'}
              <Text size="xs" weight="semibold">apply@patulod.com</Text> → Driver application status{'\n'}
              <Text size="xs" weight="semibold">driver@patulod.com</Text> → Approved driver dashboard{'\n'}
              <Text size="xs" weight="semibold">fail@test.com</Text> → Error state{'\n'}
              Password can be anything.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
