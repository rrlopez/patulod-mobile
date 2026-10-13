import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  Image as ImageIcon,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';

type DocStatus = 'pending' | 'uploaded' | 'reviewing' | 'approved' | 'rejected';

interface DocItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  status: DocStatus;
  note?: string;
}

const INITIAL_DOCS: DocItem[] = [
  {
    id: 'license',
    label: "Driver's License",
    description: 'Front and back of your valid LTO driver\'s license',
    required: true,
    status: 'pending',
  },
  {
    id: 'or_cr',
    label: 'OR / CR',
    description: 'Official Receipt and Certificate of Registration for your vehicle',
    required: true,
    status: 'pending',
  },
  {
    id: 'valid_id',
    label: 'Government-Issued ID',
    description: 'Any valid government ID (passport, PhilSys, UMID, etc.)',
    required: true,
    status: 'pending',
  },
  {
    id: 'selfie',
    label: 'Selfie with ID',
    description: 'A clear photo of you holding your government-issued ID',
    required: true,
    status: 'pending',
  },
  {
    id: 'vehicle_photo',
    label: 'Vehicle Photo',
    description: 'Clear photo of your vehicle showing the plate number',
    required: false,
    status: 'pending',
    note: 'Optional but recommended',
  },
];

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: 'Not uploaded',  color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', icon: <Upload size={14} color="#9ca3af" strokeWidth={2} /> },
  uploaded:  { label: 'Uploaded',      color: '#0369a1', bg: 'rgba(3,105,161,0.1)',   icon: <Clock size={14} color="#0369a1" strokeWidth={2} /> },
  reviewing: { label: 'Under review',  color: '#92400e', bg: 'rgba(251,191,36,0.12)', icon: <Clock size={14} color="#92400e" strokeWidth={2} /> },
  approved:  { label: 'Approved',      color: PRIMARY_GREEN, bg: 'rgba(13,95,58,0.1)', icon: <CheckCircle2 size={14} color={PRIMARY_GREEN} strokeWidth={2} /> },
  rejected:  { label: 'Rejected',      color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   icon: <AlertCircle size={14} color="#dc2626" strokeWidth={2} /> },
};

/**
 * Document Submission Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 5:
 * - Upload prompts for each required document
 * - Progress indicator
 * - Review status per document
 * - In Phase 5: expo-image-picker + Supabase Storage upload
 */
export default function DriverDocs() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadedCount = docs.filter(d => d.status !== 'pending').length;
  const requiredDocs = docs.filter(d => d.required);
  const allRequiredUploaded = requiredDocs.every(d => d.status !== 'pending');
  const progress = uploadedCount / docs.length;

  function mockUpload(id: string) {
    setDocs(prev =>
      prev.map(d => d.id === id ? { ...d, status: 'uploaded' } : d)
    );
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace('/driver-status');
    }, 1200);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
        </Button>
        <View className="flex-1">
          <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Document Upload</Text>
          <Text size="xs" className="text-muted-foreground">Step 2 of 3 — Application</Text>
        </View>
      </View>

      {/* ===== PROGRESS ===== */}
      <View className="px-5 pb-4 gap-2">
        <View className="flex-row items-center justify-between">
          <Text size="xs" className="text-muted-foreground">
            {uploadedCount} of {docs.length} documents uploaded
          </Text>
          <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View className="h-2 rounded-full bg-surface overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, backgroundColor: PRIMARY_GREEN }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View className="px-5 gap-5">

          {/* ===== INSTRUCTIONS ===== */}
          <View
            className="rounded-2xl p-4 gap-2 flex-row items-start"
            style={{ backgroundColor: 'rgba(13,95,58,0.06)' }}
          >
            <Info size={16} color={PRIMARY_GREEN} strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
            <View className="flex-1 gap-1">
              <Text size="sm" weight="bold" style={{ color: PRIMARY_GREEN }}>Upload Tips</Text>
              <Text size="xs" className="text-muted-foreground leading-relaxed">
                Ensure photos are clear, well-lit, and all text is legible. Documents must be valid and unexpired. Blurry or incomplete uploads will be rejected.
              </Text>
            </View>
          </View>

          {/* ===== DOCUMENT CARDS ===== */}
          <View className="gap-3">
            <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
              Required Documents
            </Text>

            {docs.map((doc, i) => {
              const cfg = STATUS_CONFIG[doc.status];
              const isUploaded = doc.status !== 'pending';

              return (
                <Animated.View
                  key={doc.id}
                  entering={FadeInDown.delay(i * 80).duration(350)}
                >
                  <View
                    className="rounded-2xl overflow-hidden"
                    style={{
                      borderWidth: 1.5,
                      borderColor: isUploaded ? PRIMARY_GREEN : '#e5e5e3',
                      backgroundColor: '#fff',
                    }}
                  >
                    {/* Status accent bar */}
                    <View style={{ height: 3, backgroundColor: cfg.color }} />

                    <View className="p-4 gap-3">
                      {/* Doc info row */}
                      <View className="flex-row items-start gap-3">
                        <View
                          className="h-11 w-11 rounded-2xl items-center justify-center shrink-0"
                          style={{ backgroundColor: cfg.bg }}
                        >
                          <FileText size={20} color={cfg.color} strokeWidth={2} />
                        </View>
                        <View className="flex-1 gap-0.5">
                          <View className="flex-row items-center gap-2">
                            <Text size="sm" weight="bold" className="text-foreground flex-1">
                              {doc.label}
                            </Text>
                            {!doc.required && (
                              <View
                                className="rounded-full px-2 py-0.5"
                                style={{ backgroundColor: 'rgba(156,163,175,0.15)' }}
                              >
                                <Text size="xs" className="text-muted-foreground">Optional</Text>
                              </View>
                            )}
                          </View>
                          <Text size="xs" className="text-muted-foreground leading-relaxed">
                            {doc.description}
                          </Text>
                          {doc.note && (
                            <Text size="xs" style={{ color: '#92400e' }}>{doc.note}</Text>
                          )}
                        </View>
                      </View>

                      {/* Status badge + upload button */}
                      <View className="flex-row items-center justify-between">
                        <View
                          className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
                          style={{ backgroundColor: cfg.bg }}
                        >
                          {cfg.icon}
                          <Text size="xs" weight="semibold" style={{ color: cfg.color }}>
                            {cfg.label}
                          </Text>
                        </View>

                        {!isUploaded ? (
                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              className="flex-row items-center gap-1.5 rounded-xl px-3 py-2"
                              style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
                              onPress={() => mockUpload(doc.id)}
                            >
                              <Camera size={14} color={PRIMARY_GREEN} strokeWidth={2} />
                              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="flex-row items-center gap-1.5 rounded-xl px-3 py-2"
                              style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
                              onPress={() => mockUpload(doc.id)}
                            >
                              <ImageIcon size={14} color={PRIMARY_GREEN} strokeWidth={2} />
                              <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Gallery</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            className="flex-row items-center gap-1"
                            onPress={() => mockUpload(doc.id)}
                          >
                            <Text size="xs" weight="medium" style={{ color: PRIMARY_GREEN }}>Replace</Text>
                            <ChevronRight size={12} color={PRIMARY_GREEN} strokeWidth={2.5} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {/* ===== MOCK NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1.5"
            style={{ backgroundColor: 'rgba(13,95,58,0.05)', borderWidth: 1, borderColor: 'rgba(13,95,58,0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>Phase 0.5 — Mock Upload</Text>
            <Text size="xs" className="text-muted-foreground leading-relaxed">
              Tapping Camera or Gallery marks the document as uploaded instantly. In Phase 5, this opens expo-image-picker and uploads to Supabase Storage.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      {/* ===== SUBMIT — pinned bottom ===== */}
      <View
        className="px-5 pt-3"
        style={{
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: '#e5e5e3',
          backgroundColor: '#fefdfb',
        }}
      >
        {!allRequiredUploaded && (
          <Text size="xs" className="text-center text-muted-foreground pb-2">
            Upload all required documents to submit
          </Text>
        )}
        <Button
          size="lg"
          className="w-full"
          style={{
            backgroundColor: allRequiredUploaded ? PRIMARY_GREEN : '#9ca3af',
            opacity: isSubmitting ? 0.75 : 1,
          }}
          disabled={!allRequiredUploaded || isSubmitting}
          onPress={handleSubmit}
        >
          <Text size="base" weight="bold" className="text-white">
            {isSubmitting ? 'Submitting Application…' : 'Submit Application'}
          </Text>
        </Button>
      </View>

    </View>
  );
}
