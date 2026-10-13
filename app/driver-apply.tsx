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
  Bike,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react-native';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';
const ERROR_RED = '#dc2626';
const SUCCESS_GREEN = '#10b981';

const VEHICLE_TYPES = [
  { id: 'motorcycle', label: 'Motorcycle', icon: '🏍️', capacity: '1 passenger' },
  { id: 'tricycle',   label: 'Tricycle',   icon: '🛺', capacity: '1–3 passengers' },
];

type FieldState = 'idle' | 'valid' | 'error';

function validate(field: string, value: string): { state: FieldState; message?: string } {
  switch (field) {
    case 'fullName':
      if (!value.trim()) return { state: 'error', message: 'Full name is required.' };
      if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(value.trim()))
        return { state: 'error', message: 'Name may only contain letters, spaces, hyphens, and apostrophes.' };
      return { state: 'valid' };
    case 'email':
      if (!value.trim()) return { state: 'error', message: 'Email address is required.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return { state: 'error', message: 'Enter a valid email address.' };
      return { state: 'valid' };
    case 'phone':
      if (!value.trim()) return { state: 'error', message: 'Mobile number is required.' };
      if (!/^(\+639|09)\d{9}$/.test(value.replace(/\s/g, '')))
        return { state: 'error', message: 'Enter a valid PH number (e.g. 09171234567).' };
      return { state: 'valid' };
    case 'plateNumber':
      if (!value.trim()) return { state: 'error', message: 'Plate number is required.' };
      if (value.trim().length < 4) return { state: 'error', message: 'Enter a valid plate number.' };
      return { state: 'valid' };
    case 'vehicleModel':
      if (!value.trim()) return { state: 'error', message: 'Vehicle model is required.' };
      return { state: 'valid' };
    case 'vehicleColor':
      if (!value.trim()) return { state: 'error', message: 'Vehicle color is required.' };
      return { state: 'valid' };
    default:
      return { state: 'idle' };
  }
}

/**
 * Driver Application Entry Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 0.5 + Phase 5:
 * - Separate registration form
 * - Personal info: full name, email, phone
 * - Vehicle details: type, plate, model, color
 * - Entry point to document submission flow
 */
export default function DriverApply() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [vehicleType, setVehicleType]   = useState<string | null>(null);
  const [plateNumber, setPlateNumber]   = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [touched, setTouched]           = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldStatus = {
    fullName:     touched.fullName     ? validate('fullName', fullName)         : { state: 'idle' as FieldState },
    email:        touched.email        ? validate('email', email)               : { state: 'idle' as FieldState },
    phone:        touched.phone        ? validate('phone', phone)               : { state: 'idle' as FieldState },
    plateNumber:  touched.plateNumber  ? validate('plateNumber', plateNumber)   : { state: 'idle' as FieldState },
    vehicleModel: touched.vehicleModel ? validate('vehicleModel', vehicleModel) : { state: 'idle' as FieldState },
    vehicleColor: touched.vehicleColor ? validate('vehicleColor', vehicleColor) : { state: 'idle' as FieldState },
  };

  const allValid =
    validate('fullName', fullName).state     === 'valid' &&
    validate('email', email).state           === 'valid' &&
    validate('phone', phone).state           === 'valid' &&
    validate('plateNumber', plateNumber).state === 'valid' &&
    validate('vehicleModel', vehicleModel).state === 'valid' &&
    validate('vehicleColor', vehicleColor).state === 'valid' &&
    vehicleType !== null;

  function handleBlur(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
  }

  function handleSubmit() {
    setTouched({ fullName: true, email: true, phone: true, plateNumber: true, vehicleModel: true, vehicleColor: true });
    if (!allValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/driver-docs');
    }, 1000);
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== HEADER ===== */}
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Driver Application</Text>
        </View>

        <View className="px-5 gap-6">

          {/* ===== INTRO ===== */}
          <View
            className="rounded-2xl p-4 gap-2"
            style={{ backgroundColor: 'rgba(13, 95, 58, 0.06)' }}
          >
            <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>Apply to Drive with PATULOD</Text>
            <Text size="xs" className="leading-relaxed text-muted-foreground">
              Fill in your personal and vehicle details below. After submitting, you'll be guided to upload the required documents. Applications are reviewed by the PATULOD team before approval.
            </Text>
          </View>

          {/* ===== PERSONAL INFO ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Personal Information
            </Text>

            <FormField
              label="Full Name"
              icon={<User size={17} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.fullName}
              hint="As it appears on your valid ID"
            >
              <TextInput
                className="flex-1"
                placeholder="e.g. Pedro Bautista"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
                onBlur={() => handleBlur('fullName')}
                autoCapitalize="words"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            <FormField
              label="Email Address"
              icon={<Mail size={17} color="#9ca3af" strokeWidth={2} />}
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
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            <FormField
              label="Mobile Number"
              icon={<Phone size={17} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.phone}
              hint="+63 or 09 format"
            >
              <TextInput
                className="flex-1"
                placeholder="09171234567"
                placeholderTextColor="#9ca3af"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => handleBlur('phone')}
                keyboardType="phone-pad"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>
          </View>

          {/* ===== VEHICLE TYPE ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Vehicle Type
            </Text>
            <View className="flex-row gap-3">
              {VEHICLE_TYPES.map(v => {
                const selected = vehicleType === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    className="flex-1 rounded-2xl p-4 items-center gap-2"
                    style={{
                      borderWidth: 2,
                      borderColor: selected ? PRIMARY_GREEN : '#e5e5e3',
                      backgroundColor: selected ? 'rgba(13, 95, 58, 0.05)' : '#fff',
                    }}
                    onPress={() => setVehicleType(v.id)}
                  >
                    <Text style={{ fontSize: 28 }}>{v.icon}</Text>
                    <Text size="sm" weight="bold" className="text-foreground">{v.label}</Text>
                    <Text size="xs" className="text-muted-foreground">{v.capacity}</Text>
                    {selected && (
                      <CheckCircle2 size={16} color={PRIMARY_GREEN} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {touched.fullName && !vehicleType && (
              <View className="flex-row items-center gap-1.5 px-1">
                <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} />
                <Text size="xs" style={{ color: ERROR_RED }}>Please select a vehicle type.</Text>
              </View>
            )}
          </View>

          {/* ===== VEHICLE DETAILS ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Vehicle Details
            </Text>

            <FormField
              label="Plate Number"
              icon={<Hash size={17} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.plateNumber}
              hint="Official LTO-registered plate"
            >
              <TextInput
                className="flex-1"
                placeholder="e.g. INC-1234"
                placeholderTextColor="#9ca3af"
                value={plateNumber}
                onChangeText={v => setPlateNumber(v.toUpperCase())}
                onBlur={() => handleBlur('plateNumber')}
                autoCapitalize="characters"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            <FormField
              label="Vehicle Model"
              icon={<Bike size={17} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.vehicleModel}
              hint="e.g. Honda Click 125i"
            >
              <TextInput
                className="flex-1"
                placeholder="Brand and model"
                placeholderTextColor="#9ca3af"
                value={vehicleModel}
                onChangeText={setVehicleModel}
                onBlur={() => handleBlur('vehicleModel')}
                autoCapitalize="words"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>

            <FormField
              label="Vehicle Color"
              icon={<FileText size={17} color="#9ca3af" strokeWidth={2} />}
              status={fieldStatus.vehicleColor}
            >
              <TextInput
                className="flex-1"
                placeholder="e.g. Red"
                placeholderTextColor="#9ca3af"
                value={vehicleColor}
                onChangeText={setVehicleColor}
                onBlur={() => handleBlur('vehicleColor')}
                autoCapitalize="words"
                style={{ fontSize: 15, color: '#1a1a1a' }}
              />
            </FormField>
          </View>

          {/* ===== NEXT STEPS ===== */}
          <View
            className="rounded-2xl p-4 gap-3"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
          >
            <Text size="xs" weight="bold" style={{ color: '#92400e' }}>📋 What Happens Next</Text>
            <View className="gap-2">
              {[
                'Submit this form to continue to document upload',
                'Upload required documents (license, OR/CR, valid ID)',
                'PATULOD team reviews your application',
                'You will be notified of your application status',
              ].map((step, i) => (
                <View key={i} className="flex-row items-start gap-2">
                  <View
                    className="h-5 w-5 rounded-full items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(251, 191, 36, 0.3)' }}
                  >
                    <Text size="xs" weight="bold" style={{ color: '#92400e' }}>{i + 1}</Text>
                  </View>
                  <Text size="xs" className="flex-1 leading-relaxed" style={{ color: '#92400e' }}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ===== SUBMIT ===== */}
          <Button
            size="lg"
            className="w-full"
            style={{ backgroundColor: allValid ? PRIMARY_GREEN : '#9ca3af', opacity: isSubmitting ? 0.7 : 1 }}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text size="base" weight="bold" className="text-white">
              {isSubmitting ? 'Saving…' : 'Continue to Document Upload'}
            </Text>
          </Button>

          <Text size="xs" className="text-center text-muted-foreground px-2">
            Already have a passenger account? Driver applications create a separate profile reviewed by the PATULOD team.
          </Text>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ─── Local helper components ────────────────────────────────────────────── */

function FormField({
  label, icon, status, hint, children,
}: {
  label: string;
  icon: React.ReactNode;
  status: { state: FieldState; message?: string };
  hint?: string;
  children: React.ReactNode;
}) {
  const borderColor =
    status.state === 'valid' ? SUCCESS_GREEN :
    status.state === 'error' ? ERROR_RED : '#e5e5e3';

  return (
    <View className="gap-1.5">
      <Text size="sm" weight="semibold" className="text-foreground">{label}</Text>
      <View
        className="flex-row items-center gap-3 rounded-xl px-4 py-3.5"
        style={{ borderWidth: 1.5, borderColor, backgroundColor: '#fff' }}
      >
        {icon}
        {children}
        {status.state === 'valid' && (
          <CheckCircle2 size={17} color={SUCCESS_GREEN} strokeWidth={2} />
        )}
      </View>
      {hint && status.state === 'idle' && (
        <Text size="xs" className="text-muted-foreground px-1">{hint}</Text>
      )}
      {status.state === 'error' && status.message && (
        <View className="flex-row items-start gap-1.5 px-1">
          <AlertCircle size={13} color={ERROR_RED} strokeWidth={2.5} style={{ marginTop: 1 }} />
          <Text size="xs" style={{ color: ERROR_RED, flex: 1 }}>{status.message}</Text>
        </View>
      )}
    </View>
  );
}
