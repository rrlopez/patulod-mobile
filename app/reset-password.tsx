import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  XCircle,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';
const SUCCESS_GREEN = '#10b981';

/**
 * Reset Password Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 1:
 * - New password + confirm fields
 * - Token validation feedback (expired / invalid / valid states)
 * - In Phase 1 the token comes from the deep-link URL query param
 *
 * Mock states:
 *   ?token=expired  → shows expired token screen
 *   ?token=invalid  → shows invalid token screen
 *   anything else   → shows valid form
 */
export default function ResetPassword() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Mock token states ──────────────────────────────────────────
  const mockToken = token ?? 'valid';
  const isExpired = mockToken === 'expired';
  const isInvalid = mockToken === 'invalid';
  const tokenOk = !isExpired && !isInvalid;

  // ── Validation ─────────────────────────────────────────────────
  function validatePassword(v: string) {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter.';
    if (!/[0-9]/.test(v)) return 'Include at least one number.';
    return null;
  }

  const passwordError = attempted ? validatePassword(password) : null;
  const confirmError =
    attempted && (!confirmPassword || confirmPassword !== password)
      ? 'Passwords do not match.'
      : null;

  // Password strength indicator
  function strength(v: string): { level: number; label: string; color: string } {
    if (!v) return { level: 0, label: '', color: '#e5e5e3' };
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    if (score <= 1) return { level: score, label: 'Weak', color: ERROR_RED };
    if (score === 2) return { level: score, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { level: score, label: 'Good', color: '#3b82f6' };
    return { level: score, label: 'Strong', color: SUCCESS_GREEN };
  }

  const pw = strength(password);

  function handleSubmit() {
    setAttempted(true);
    if (validatePassword(password) || confirmPassword !== password) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1200);
  }

  // ── Success state ──────────────────────────────────────────────
  if (success) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
      >
        <View className="items-center gap-6">
          <View
            className="h-24 w-24 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
          >
            <CheckCircle2 size={44} color={SUCCESS_GREEN} strokeWidth={2} />
          </View>
          <View className="items-center gap-2">
            <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }} className="text-center">
              Password Updated
            </Text>
            <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
              Your password has been changed successfully. You can now log in with your new password.
            </Text>
          </View>
        </View>

        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.replace('/login')}
        >
          <Text size="base" weight="bold" className="text-white">Log In</Text>
        </Button>

        <Text size="xs" className="text-muted-foreground text-center">
          Phase 0.5 — Mock. Password is not actually changed.
        </Text>
      </View>
    );
  }

  // ── Expired token state ────────────────────────────────────────
  if (isExpired) {
    return (
      <TokenErrorScreen
        insets={insets}
        icon={<XCircle size={44} color="#f59e0b" strokeWidth={2} />}
        iconBg="rgba(245, 158, 11, 0.12)"
        title="Link Expired"
        message="This password reset link has expired. Reset links are valid for a short time and can only be used once."
        ctaLabel="Request a New Link"
        onCta={() => router.replace('/forgot-password')}
        onBack={() => router.replace('/login')}
      />
    );
  }

  // ── Invalid token state ────────────────────────────────────────
  if (isInvalid) {
    return (
      <TokenErrorScreen
        insets={insets}
        icon={<XCircle size={44} color={ERROR_RED} strokeWidth={2} />}
        iconBg="rgba(220, 38, 38, 0.1)"
        title="Invalid Link"
        message="This password reset link is not valid. It may have already been used or the URL may be incomplete."
        ctaLabel="Request a New Link"
        onCta={() => router.replace('/forgot-password')}
        onBack={() => router.replace('/login')}
      />
    );
  }

  // ── Valid form ─────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-5 gap-8">

          {/* ===== HEADER ===== */}
          <View className="items-center gap-4">
            <View
              className="h-20 w-20 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.08)' }}
            >
              <ShieldCheck size={36} color={PRIMARY_GREEN} strokeWidth={1.75} />
            </View>
            <View className="items-center gap-2">
              <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
                New Password
              </Text>
              <Text size="sm" className="text-muted-foreground text-center leading-relaxed px-4">
                Choose a strong password for your PATULOD account.
              </Text>
            </View>
          </View>

          {/* ===== FORM ===== */}
          <View className="gap-5">

            {/* New Password */}
            <View className="gap-1.5">
              <Text size="sm" weight="semibold" className="text-foreground">New Password</Text>
              <View
                className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  borderWidth: 1.5,
                  borderColor: passwordError ? ERROR_RED : password && !passwordError ? SUCCESS_GREEN : '#e5e5e3',
                  backgroundColor: '#fff',
                }}
              >
                <Lock size={18} color="#9ca3af" strokeWidth={2} />
                <TextInput
                  className="flex-1"
                  placeholder="Create a strong password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  returnKeyType="next"
                  style={{ fontSize: 15, color: '#1a1a1a' }}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  {showPassword
                    ? <EyeOff size={18} color="#9ca3af" strokeWidth={2} />
                    : <Eye size={18} color="#9ca3af" strokeWidth={2} />
                  }
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {password.length > 0 && (
                <View className="gap-1.5 px-1">
                  <View className="flex-row gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <View
                        key={i}
                        className="flex-1 rounded-full"
                        style={{
                          height: 3,
                          backgroundColor: i <= pw.level ? pw.color : '#e5e5e3',
                        }}
                      />
                    ))}
                  </View>
                  {pw.label ? (
                    <Text size="xs" weight="medium" style={{ color: pw.color }}>
                      {pw.label} password
                    </Text>
                  ) : null}
                </View>
              )}

              {passwordError && (
                <View className="flex-row items-start gap-1.5 px-1">
                  <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} style={{ marginTop: 1 }} />
                  <Text size="xs" style={{ color: ERROR_RED, flex: 1 }}>{passwordError}</Text>
                </View>
              )}

              {!passwordError && !password && (
                <Text size="xs" className="text-muted-foreground px-1">
                  Min. 8 characters, 1 uppercase, 1 number
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View className="gap-1.5">
              <Text size="sm" weight="semibold" className="text-foreground">Confirm New Password</Text>
              <View
                className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                style={{
                  borderWidth: 1.5,
                  borderColor: confirmError ? ERROR_RED
                    : confirmPassword && confirmPassword === password ? SUCCESS_GREEN
                    : '#e5e5e3',
                  backgroundColor: '#fff',
                }}
              >
                <Lock size={18} color="#9ca3af" strokeWidth={2} />
                <TextInput
                  className="flex-1"
                  placeholder="Re-enter your new password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  style={{ fontSize: 15, color: '#1a1a1a' }}
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
                  {showConfirm
                    ? <EyeOff size={18} color="#9ca3af" strokeWidth={2} />
                    : <Eye size={18} color="#9ca3af" strokeWidth={2} />
                  }
                </TouchableOpacity>
              </View>
              {confirmError && (
                <View className="flex-row items-center gap-1.5 px-1">
                  <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                  <Text size="xs" style={{ color: ERROR_RED }}>{confirmError}</Text>
                </View>
              )}
              {!confirmError && confirmPassword && confirmPassword === password && (
                <View className="flex-row items-center gap-1.5 px-1">
                  <CheckCircle2 size={13} color={SUCCESS_GREEN} strokeWidth={2.5} />
                  <Text size="xs" style={{ color: SUCCESS_GREEN }}>Passwords match</Text>
                </View>
              )}
            </View>

          </View>

          {/* ===== SUBMIT ===== */}
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
              {isSubmitting ? 'Updating Password…' : 'Update Password'}
            </Text>
          </Button>

          {/* ===== MOCK HINT ===== */}
          <View
            className="rounded-2xl p-4 gap-1.5"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>Phase 0.5 — Mock Token States</Text>
            <Text size="xs" className="text-muted-foreground leading-relaxed">
              Add <Text size="xs" weight="semibold">?token=expired</Text> or{' '}
              <Text size="xs" weight="semibold">?token=invalid</Text> to the URL to preview error states.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Token error shared component ───────────────────────────────────────── */

function TokenErrorScreen({
  insets,
  icon,
  iconBg,
  title,
  message,
  ctaLabel,
  onCta,
  onBack,
}: {
  insets: { top: number; bottom: number };
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  message: string;
  ctaLabel: string;
  onCta: () => void;
  onBack: () => void;
}) {
  return (
    <View
      className="flex-1 items-center justify-center px-8 gap-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
    >
      <View className="items-center gap-6">
        <View
          className="h-24 w-24 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </View>
        <View className="items-center gap-2">
          <Text size="2xl" weight="bold" className="text-foreground text-center">{title}</Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">{message}</Text>
        </View>
      </View>

      <View className="w-full gap-3">
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={onCta}
        >
          <Text size="base" weight="bold" className="text-white">{ctaLabel}</Text>
        </Button>
        <Button size="md" variant="ghost" className="w-full" onPress={onBack}>
          <Text size="sm" weight="medium" style={{ color: PRIMARY_GREEN }}>Back to Login</Text>
        </Button>
      </View>
    </View>
  );
}
