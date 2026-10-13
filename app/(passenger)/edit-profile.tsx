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
  Camera,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

const MOCK_USER = {
  fullName: 'Juan dela Cruz',
  email: 'juan@example.com',
  phone: '+63 917 123 4567',
};

/**
 * Edit Profile Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 1:
 * - Edit name, email, phone
 * - Email/phone changes require password confirmation
 * - Avatar upload
 * - Validation and error handling
 */
export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState(MOCK_USER.fullName);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Track what changed
  const nameChanged = fullName !== MOCK_USER.fullName;
  const emailChanged = email !== MOCK_USER.email;
  const phoneChanged = phone !== MOCK_USER.phone;
  const sensitiveChange = emailChanged || phoneChanged;
  const hasChanges = nameChanged || emailChanged || phoneChanged;

  // Validation
  const fullNameMissing = attempted && !fullName.trim();
  const emailMissing = attempted && !email.trim();
  const phoneMissing = attempted && !phone.trim();
  const passwordMissing = attempted && sensitiveChange && !password;

  function handleSave() {
    setAttempted(true);
    setSaveSuccess(false);

    if (!fullName.trim() || !email.trim() || !phone.trim()) return;
    if (sensitiveChange && !password) {
      setShowPasswordConfirm(true);
      return;
    }

    setIsSaving(true);

    // Mock: simulate save
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    }, 1200);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

        {/* ===== HEADER ===== */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
            </Button>
            <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>
              Edit Profile
            </Text>
          </View>
          {hasChanges && !saveSuccess && (
            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
              <Text size="sm" weight="bold" style={{ color: isSaving ? '#9ca3af' : PRIMARY_GREEN }}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 gap-6 pt-4">

            {/* ===== SUCCESS MESSAGE ===== */}
            {saveSuccess && (
              <View
                className="rounded-2xl p-4 gap-2"
                style={{ backgroundColor: 'rgba(13, 95, 58, 0.1)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.3)' }}
              >
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 size={16} color={PRIMARY_GREEN} strokeWidth={2.5} />
                  <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>
                    Profile Updated
                  </Text>
                </View>
                <Text size="xs" className="text-muted-foreground">
                  Your changes have been saved successfully.
                </Text>
              </View>
            )}

            {/* ===== AVATAR ===== */}
            <View className="items-center gap-3 py-4">
              <View className="relative">
                <View
                  className="h-24 w-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(13, 95, 58, 0.12)' }}
                >
                  <Text style={{ fontSize: 44 }}>👤</Text>
                </View>
                <TouchableOpacity
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: PRIMARY_GREEN, borderWidth: 2, borderColor: '#fefdfb' }}
                  onPress={() => console.log('Upload avatar')}
                >
                  <Camera size={14} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <Text size="xs" className="text-muted-foreground">
                Tap to upload photo
              </Text>
            </View>

            {/* ===== FORM ===== */}
            <View className="gap-5">

              {/* Full Name */}
              <View className="gap-1.5">
                <Text size="sm" weight="semibold" className="text-foreground">Full Name</Text>
                <View
                  className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{
                    borderWidth: 1.5,
                    borderColor: fullNameMissing ? ERROR_RED : '#e5e5e3',
                    backgroundColor: '#fff',
                  }}
                >
                  <User size={18} color="#9ca3af" strokeWidth={2} />
                  <TextInput
                    className="flex-1"
                    placeholder="Your full name"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    returnKeyType="next"
                    style={{ fontSize: 15, color: '#1a1a1a' }}
                  />
                </View>
                {fullNameMissing && (
                  <View className="flex-row items-center gap-1.5 px-1">
                    <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                    <Text size="xs" style={{ color: ERROR_RED }}>Name is required.</Text>
                  </View>
                )}
              </View>

              {/* Email */}
              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text size="sm" weight="semibold" className="text-foreground">Email Address</Text>
                  {emailChanged && (
                    <View className="flex-row items-center gap-1">
                      <Lock size={10} color="#92400e" strokeWidth={2.5} />
                      <Text size="xs" style={{ color: '#92400e' }}>Requires password</Text>
                    </View>
                  )}
                </View>
                <View
                  className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{
                    borderWidth: 1.5,
                    borderColor: emailMissing ? ERROR_RED : emailChanged ? '#fbbf24' : '#e5e5e3',
                    backgroundColor: '#fff',
                  }}
                >
                  <Mail size={18} color="#9ca3af" strokeWidth={2} />
                  <TextInput
                    className="flex-1"
                    placeholder="you@example.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
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

              {/* Phone */}
              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text size="sm" weight="semibold" className="text-foreground">Mobile Number</Text>
                  {phoneChanged && (
                    <View className="flex-row items-center gap-1">
                      <Lock size={10} color="#92400e" strokeWidth={2.5} />
                      <Text size="xs" style={{ color: '#92400e' }}>Requires password</Text>
                    </View>
                  )}
                </View>
                <View
                  className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{
                    borderWidth: 1.5,
                    borderColor: phoneMissing ? ERROR_RED : phoneChanged ? '#fbbf24' : '#e5e5e3',
                    backgroundColor: '#fff',
                  }}
                >
                  <Phone size={18} color="#9ca3af" strokeWidth={2} />
                  <TextInput
                    className="flex-1"
                    placeholder="+63 917 123 4567"
                    placeholderTextColor="#9ca3af"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    style={{ fontSize: 15, color: '#1a1a1a' }}
                  />
                </View>
                {phoneMissing && (
                  <View className="flex-row items-center gap-1.5 px-1">
                    <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                    <Text size="xs" style={{ color: ERROR_RED }}>Phone number is required.</Text>
                  </View>
                )}
              </View>

              {/* Password Confirmation (shown when email/phone changed) */}
              {(showPasswordConfirm || (attempted && sensitiveChange)) && (
                <View className="gap-1.5">
                  <Text size="sm" weight="semibold" className="text-foreground">
                    Confirm Password
                  </Text>
                  <View
                    className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
                    style={{
                      borderWidth: 1.5,
                      borderColor: passwordMissing ? ERROR_RED : '#fbbf24',
                      backgroundColor: 'rgba(251, 191, 36, 0.05)',
                    }}
                  >
                    <Lock size={18} color="#92400e" strokeWidth={2} />
                    <TextInput
                      className="flex-1"
                      placeholder="Enter your password"
                      placeholderTextColor="#9ca3af"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSave}
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
                      <Text size="xs" style={{ color: ERROR_RED }}>
                        Password required to change email or phone.
                      </Text>
                    </View>
                  )}
                  <View
                    className="rounded-xl p-3 gap-1"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                  >
                    <Text size="xs" weight="bold" style={{ color: '#92400e' }}>
                      Security Check
                    </Text>
                    <Text size="xs" className="text-muted-foreground leading-relaxed">
                      Enter your current password to confirm changes to your email or phone number.
                    </Text>
                  </View>
                </View>
              )}

            </View>

            {/* ===== SAVE BUTTON ===== */}
            {hasChanges && !saveSuccess && (
              <Button
                size="lg"
                className="w-full"
                style={{
                  backgroundColor: PRIMARY_GREEN,
                  opacity: isSaving ? 0.7 : 1,
                }}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text size="base" weight="bold" className="text-white">
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Text>
              </Button>
            )}

            {/* ===== INFO NOTE ===== */}
            <View
              className="rounded-2xl p-4 gap-1"
              style={{ backgroundColor: 'rgba(13, 95, 58, 0.05)', borderWidth: 1, borderColor: 'rgba(13, 95, 58, 0.12)' }}
            >
              <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
                About Profile Updates
              </Text>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                • Name changes take effect immediately{'\n'}
                • Email/phone changes require password verification{'\n'}
                • You'll receive a confirmation email for email changes
              </Text>
            </View>

            <View style={{ height: 8 }} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
