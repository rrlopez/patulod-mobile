import { ScrollView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';
const SUCCESS_GREEN = '#10b981';

/**
 * Register Screen — Passenger
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 1:
 * - Fields: Full Name, Email, Phone (+63/09 hint), Password + Confirm (show/hide)
 * - Terms checkbox: unchecked by default, links to /terms
 * - Privacy checkbox: unchecked by default, links to /privacy
 * - Inline field-level validation errors (do not clear other valid fields)
 * - Submit disabled while fields are empty or invalid
 * - Role assigned server-side — not a client input
 */

type FieldState = 'idle' | 'valid' | 'error';

interface FieldStatus {
  state: FieldState;
  message?: string;
}

function validate(field: string, value: string): FieldStatus {
  switch (field) {
    case 'fullName': {
      if (!value.trim()) return { state: 'error', message: 'Full name is required.' };
      if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(value.trim()))
        return { state: 'error', message: 'Name may only contain letters, spaces, hyphens, and apostrophes.' };
      if (value.trim().length < 2)
        return { state: 'error', message: 'Please enter your full name.' };
      return { state: 'valid' };
    }
    case 'email': {
      if (!value.trim()) return { state: 'error', message: 'Email address is required.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return { state: 'error', message: 'Enter a valid email address.' };
      return { state: 'valid' };
    }
    case 'phone': {
      if (!value.trim()) return { state: 'error', message: 'Mobile number is required.' };
      const cleaned = value.replace(/\s/g, '');
      if (!/^(\+639|09)\d{9}$/.test(cleaned))
        return { state: 'error', message: 'Enter a valid PH number (e.g. 09171234567 or +639171234567).' };
      return { state: 'valid' };
    }
    case 'password': {
      if (!value) return { state: 'error', message: 'Password is required.' };
      if (value.length < 8) return { state: 'error', message: 'Password must be at least 8 characters.' };
      if (!/[A-Z]/.test(value)) return { state: 'error', message: 'Include at least one uppercase letter.' };
      if (!/[0-9]/.test(value)) return { state: 'error', message: 'Include at least one number.' };
      return { state: 'valid' };
    }
    default:
      return { state: 'idle' };
  }
}

export default function Register() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Form values
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  // Touched tracking — only show errors after user has left the field
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Mock submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fieldStatus = {
    fullName: touched.fullName ? validate('fullName', fullName) : { state: 'idle' as FieldState },
    email: touched.email ? validate('email', email) : { state: 'idle' as FieldState },
    phone: touched.phone ? validate('phone', phone) : { state: 'idle' as FieldState },
    password: touched.password ? validate('password', password) : { state: 'idle' as FieldState },
    confirmPassword: touched.confirmPassword
      ? confirmPassword === password && confirmPassword.length > 0
        ? { state: 'valid' as FieldState }
        : { state: 'error' as FieldState, message: 'Passwords do not match.' }
      : { state: 'idle' as FieldState },
  };

  const allFieldsValid =
    validate('fullName', fullName).state === 'valid' &&
    validate('email', email).state === 'valid' &&
    validate('phone', phone).state === 'valid' &&
    validate('password', password).state === 'valid' &&
    confirmPassword === password &&
    confirmPassword.length > 0 &&
    termsChecked &&
    privacyChecked;

  function handleBlur(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
  }

  function handleSubmit() {
    // Touch all fields to surface any remaining errors
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });
    if (!allFieldsValid) return;

    // Mock submit
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  }

  // ── Success state ──────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
      >
        <View
          className="h-20 w-20 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
        >
          <CheckCircle2 size={40} color={SUCCESS_GREEN} strokeWidth={2} />
        </View>
        <View className="items-center gap-2">
          <Text size="2xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Account Created!</Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
            Welcome to PATULOD. Your passenger account has been registered. You can now log in to start booking rides.
          </Text>
        </View>
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.replace('/login')}
        >
          <Text size="base" weight="bold" className="text-white">Continue to Login</Text>
        </Button>
        <Text size="xs" className="text-muted-foreground text-center">
          Phase 0.5 — Mock registration. No account is actually created.
        </Text>
      </View>
    );
  }

  // ── Main form ──────────────────────────────────────────────────
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
            Create Account
          </Text>
        </View>

        <View className="px-5 gap-6">

          {/* ===== SUBHEADING ===== */}
          <View className="gap-1">
            <Text size="base" weight="semibold" className="text-foreground">
              Register as a Passenger
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Already have an account?{' '}
              <Text
                size="sm"
                weight="semibold"
                style={{ color: PRIMARY_GREEN }}
                onPress={() => router.replace('/login')}
              >
                Log in
              </Text>
            </Text>
          </View>

          {/* ===== FORM FIELDS ===== */}
          <View className="gap-5">

            {/* Full Name */}
            <FormField
              label="Full Name"
              icon={<User size={18} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.fullName}
              hint="As it appears on your valid ID"
            >
              <TextInput
                className="flex-1 text-sm text-foreground"
                placeholder="e.g. Juan dela Cruz"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
                onBlur={() => handleBlur('fullName')}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            {/* Email */}
            <FormField
              label="Email Address"
              icon={<Mail size={18} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.email}
            >
              <TextInput
                className="flex-1"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            {/* Phone */}
            <FormField
              label="Mobile Number"
              icon={<Phone size={18} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.phone}
              hint="+63 or 09 format (Philippine numbers only)"
            >
              <TextInput
                className="flex-1"
                placeholder="09171234567"
                placeholderTextColor="#9ca3af"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleBlur('phone')}
                keyboardType="phone-pad"
                autoComplete="tel"
                returnKeyType="next"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            {/* Password */}
            <FormField
              label="Password"
              icon={<Lock size={18} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.password}
              hint="Min. 8 characters, 1 uppercase, 1 number"
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  {showPassword
                    ? <EyeOff size={18} color="#9ca3af" strokeWidth={2} />
                    : <Eye size={18} color="#9ca3af" strokeWidth={2} />
                  }
                </TouchableOpacity>
              }
            >
              <TextInput
                className="flex-1"
                placeholder="Create a strong password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                onBlur={() => handleBlur('password')}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                returnKeyType="next"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            {/* Confirm Password */}
            <FormField
              label="Confirm Password"
              icon={<Lock size={18} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.confirmPassword}
              rightElement={
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
                  {showConfirm
                    ? <EyeOff size={18} color="#9ca3af" strokeWidth={2} />
                    : <Eye size={18} color="#9ca3af" strokeWidth={2} />
                  }
                </TouchableOpacity>
              }
            >
              <TextInput
                className="flex-1"
                placeholder="Re-enter your password"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={() => handleBlur('confirmPassword')}
                secureTextEntry={!showConfirm}
                autoComplete="new-password"
                returnKeyType="done"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

          </View>

          {/* ===== CONSENT CHECKBOXES ===== */}
          <View className="gap-3 pt-1">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Required Agreements
            </Text>

            {/* Terms checkbox */}
            <CheckboxRow
              checked={termsChecked}
              onToggle={() => setTermsChecked(v => !v)}
              label="I have read and agree to the"
              linkText="Terms and Understanding"
              onLinkPress={() => router.push('/terms')}
            />

            {/* Privacy checkbox */}
            <CheckboxRow
              checked={privacyChecked}
              onToggle={() => setPrivacyChecked(v => !v)}
              label="I acknowledge the"
              linkText="Privacy Notice"
              onLinkPress={() => router.push('/privacy')}
            />

            {/* Warn if trying to submit without checking */}
            {touched.fullName && (!termsChecked || !privacyChecked) && (
              <View className="flex-row items-start gap-2 px-1">
                <AlertCircle size={14} color={ERROR_RED} strokeWidth={2.5} style={{ marginTop: 1 }} />
                <Text size="xs" style={{ color: ERROR_RED, flex: 1 }}>
                  You must agree to both the Terms and acknowledge the Privacy Notice to continue.
                </Text>
              </View>
            )}
          </View>

          {/* ===== SUBMIT ===== */}
          <View className="gap-3 pt-2">
            <Button
              size="lg"
              className="w-full"
              style={{
                backgroundColor: allFieldsValid ? PRIMARY_GREEN : '#9ca3af',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text size="base" weight="bold" className="text-white">
                {isSubmitting ? 'Creating Account…' : 'Create Account'}
              </Text>
            </Button>

            <Text size="xs" className="text-muted-foreground text-center leading-relaxed px-2">
              By creating an account, your role will be assigned as <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Passenger</Text>. Driver applications are separate.
            </Text>
          </View>

          {/* ===== DRIVER APPLICATION LINK ===== */}
          <View
            className="rounded-2xl p-4 flex-row items-center gap-3"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
          >
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: '#92400e' }}>Want to drive with PATULOD?</Text>
              <Text size="xs" style={{ color: '#92400e' }}>Driver applications are handled separately.</Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.push('/driver-apply')}
            >
              <Text size="xs" weight="bold" style={{ color: '#92400e' }}>Apply</Text>
              <ChevronRight size={14} color="#92400e" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function FormField({
  label,
  icon,
  status,
  hint,
  rightElement,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  status: FieldStatus;
  hint?: string;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
}) {
  const borderColor =
    status.state === 'valid'
      ? SUCCESS_GREEN
      : status.state === 'error'
      ? ERROR_RED
      : '#e5e5e3';

  return (
    <View className="gap-1.5">
      <Text size="sm" weight="semibold" className="text-foreground">{label}</Text>
      <View
        className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
        style={{
          borderWidth: 1.5,
          borderColor,
          backgroundColor: '#fff',
        }}
      >
        {icon}
        {children}
        {/* Valid checkmark */}
        {status.state === 'valid' && !rightElement && (
          <CheckCircle2 size={18} color={SUCCESS_GREEN} strokeWidth={2} />
        )}
        {rightElement}
      </View>
      {/* Hint text */}
      {hint && status.state === 'idle' && (
        <Text size="xs" className="text-muted-foreground px-1">{hint}</Text>
      )}
      {/* Inline error */}
      {status.state === 'error' && status.message && (
        <View className="flex-row items-start gap-1.5 px-1">
          <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} style={{ marginTop: 1 }} />
          <Text size="xs" style={{ color: ERROR_RED, flex: 1 }}>{status.message}</Text>
        </View>
      )}
    </View>
  );
}

function CheckboxRow({
  checked,
  onToggle,
  label,
  linkText,
  onLinkPress,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  linkText: string;
  onLinkPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-start gap-3"
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={{ marginTop: 2 }}>
        {checked
          ? <CheckSquare size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          : <Square size={20} color="#9ca3af" strokeWidth={2} />
        }
      </View>
      <Text size="sm" className="text-foreground flex-1 leading-relaxed">
        {label}{' '}
        <Text
          size="sm"
          weight="semibold"
          style={{ color: PRIMARY_GREEN }}
          onPress={onLinkPress}
        >
          {linkText}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}
