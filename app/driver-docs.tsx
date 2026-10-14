import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import { ArrowLeft, Info, AlertCircle } from 'lucide-react-native';
import DocumentUploadField from '../components/DocumentUploadField';

const PRIMARY_GREEN = '#0d5f3a';
const ACCENT_YELLOW = '#fbbf24';
const ERROR_RED = '#dc2626';

/**
 * Document Submission Screen
 * Full integration with DocumentUploadField component
 *
 * Reads applicationId from route params, manages upload state for 7 required documents,
 * and navigates to driver-status on completion.
 */
export default function DriverDocs() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const applicationId = (params.applicationId as string) || '';

  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, { documentId: string; url: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const uploadedCount = Object.keys(uploadedDocuments).length;
  const progress = uploadedCount / 7;

  function handleUploadComplete(documentType: string, documentId: string, url: string) {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: { documentId, url },
    }));
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Navigate to driver-status
      router.push('/driver-status');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit documents. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Error handling: if no applicationId, show error with back button
  if (!applicationId) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#fefdfb' }}
      >
        <View
          className="h-20 w-20 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
        >
          <AlertCircle size={40} color={ERROR_RED} strokeWidth={2} />
        </View>
        <View className="items-center gap-2">
          <Text size="2xl" weight="bold" style={{ color: ERROR_RED }}>Application ID Not Found</Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
            Application ID not found. Please restart the application process.
          </Text>
        </View>
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={() => router.back()}
        >
          <Text size="base" weight="bold" className="text-white">Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

        {/* ===== HEADER ===== */}
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeft size={22} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </Button>
          <View className="flex-1">
            <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Upload Documents</Text>
          </View>
        </View>

        {/* ===== PROGRESS ===== */}
        <View className="px-5 pb-4 gap-2">
          <View className="flex-row items-center justify-between">
            <Text size="xs" className="text-muted-foreground">
              {uploadedCount} of 7 documents uploaded
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
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 gap-5">

            {/* ===== DOCUMENT REQUIREMENTS INFO ===== */}
            <View
              className="rounded-2xl p-4 gap-2 flex-row items-start"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.08)', borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}
            >
              <Info size={16} color="#92400e" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
              <View className="flex-1 gap-1">
                <Text size="sm" weight="bold" style={{ color: '#92400e' }}>Document Requirements</Text>
                <Text size="xs" style={{ color: '#92400e', lineHeight: 18 }}>
                  Ensure photos are clear, well-lit, and all text is legible. Documents must be valid and unexpired. Blurry or incomplete uploads will be rejected.
                </Text>
              </View>
            </View>

            {/* ===== GENERAL SUBMIT ERROR ===== */}
            {submitError && (
              <View
                className="rounded-xl p-4 flex-row items-start gap-3"
                style={{ backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5' }}
              >
                <AlertCircle size={20} color={ERROR_RED} strokeWidth={2} style={{ marginTop: 1 }} />
                <View className="flex-1">
                  <Text size="sm" weight="semibold" style={{ color: ERROR_RED }}>
                    Submission Failed
                  </Text>
                  <Text size="xs" style={{ color: ERROR_RED, marginTop: 4 }}>
                    {submitError}
                  </Text>
                </View>
              </View>
            )}

            {/* ===== DOCUMENT UPLOAD FIELDS ===== */}
            <View className="gap-4">
              <DocumentUploadField
                label="Driver's License - Front"
                documentType="DRIVERS_LICENSE_FRONT"
                required={true}
                hint="Clear photo of front side"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Driver's License - Back"
                documentType="DRIVERS_LICENSE_BACK"
                required={true}
                hint="Clear photo of back side"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Vehicle OR/CR"
                documentType="VEHICLE_OR_CR"
                required={true}
                hint="Official Receipt or Certificate of Registration"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Valid Government ID"
                documentType="GOVERNMENT_ID"
                required={true}
                hint="Any valid government-issued ID"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Vehicle Photo - Front"
                documentType="VEHICLE_PHOTO_FRONT"
                required={true}
                hint="Clear front view of your vehicle"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Vehicle Photo - Side"
                documentType="VEHICLE_PHOTO_SIDE"
                required={true}
                hint="Clear side view of your vehicle"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />

              <DocumentUploadField
                label="Vehicle Photo - Plate"
                documentType="VEHICLE_PHOTO_PLATE"
                required={true}
                hint="Clear photo of your plate number"
                applicationId={applicationId}
                onUploadComplete={handleUploadComplete}
              />
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
          {uploadedCount < 7 && (
            <Text size="xs" className="text-center text-muted-foreground pb-2">
              Upload all required documents to submit ({uploadedCount}/7)
            </Text>
          )}
          <Button
            size="lg"
            className="w-full"
            style={{
              backgroundColor: uploadedCount === 7 ? PRIMARY_GREEN : '#9ca3af',
              opacity: isSubmitting ? 0.75 : 1,
            }}
            disabled={uploadedCount < 7 || isSubmitting}
            onPress={handleSubmit}
          >
            <Text size="base" weight="bold" className="text-white">
              {isSubmitting
                ? 'Submitting Application…'
                : uploadedCount < 7
                ? `Submit Documents (${uploadedCount}/7)`
                : 'Submit Application'}
            </Text>
          </Button>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
