import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Text } from 'panelui-native';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react-native';
import { api } from '../lib/api';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';
const SUCCESS_GREEN = '#10b981';

type UploadState = 'idle' | 'picking' | 'uploading' | 'success' | 'error';

interface DocumentUploadFieldProps {
  label: string;
  documentType: string;
  required?: boolean;
  hint?: string;
  applicationId: string;
  onUploadComplete: (documentType: string, documentId: string, url: string) => void;
  existingDocument?: {
    documentId: string;
    url: string;
    reviewStatus: string;
  };
}

export default function DocumentUploadField({
  label,
  documentType,
  required = false,
  hint,
  applicationId,
  onUploadComplete,
  existingDocument,
}: DocumentUploadFieldProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  // Handle existing document states
  if (existingDocument) {
    if (existingDocument.reviewStatus === 'APPROVED') {
      return (
        <View className="gap-1.5">
          <View className="flex-row items-center gap-2">
            <Text size="sm" weight="semibold" className="text-foreground">
              {label}
            </Text>
            {required && <Text size="sm" style={{ color: ERROR_RED }}>*</Text>}
          </View>
          
          <View
            className="rounded-xl p-4 flex-row items-center gap-3"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderWidth: 1.5, borderColor: SUCCESS_GREEN }}
          >
            <View
              className="h-10 w-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
            >
              <CheckCircle2 size={20} color={SUCCESS_GREEN} strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text size="sm" weight="bold" style={{ color: SUCCESS_GREEN }}>
                Approved
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {documentType.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>

          {hint && (
            <Text size="xs" className="text-muted-foreground px-1">{hint}</Text>
          )}
        </View>
      );
    }

    if (existingDocument.reviewStatus === 'REJECTED') {
      return (
        <View className="gap-1.5">
          <View className="flex-row items-center gap-2">
            <Text size="sm" weight="semibold" className="text-foreground">
              {label}
            </Text>
            {required && <Text size="sm" style={{ color: ERROR_RED }}>*</Text>}
          </View>
          
          <View
            className="rounded-xl p-4 gap-3"
            style={{ backgroundColor: '#fee2e2', borderWidth: 1.5, borderColor: ERROR_RED }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="h-10 w-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)' }}
              >
                <AlertCircle size={20} color={ERROR_RED} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text size="sm" weight="bold" style={{ color: ERROR_RED }}>
                  Rejected
                </Text>
                <Text size="xs" style={{ color: ERROR_RED }}>
                  Document needs to be re-uploaded
                </Text>
              </View>
            </View>
            
            <Button
              size="sm"
              style={{ backgroundColor: ERROR_RED }}
              onPress={handleRetry}
            >
              <RefreshCw size={14} color="#fff" strokeWidth={2} />
              <Text size="sm" weight="semibold" className="text-white ml-2">
                Upload New Document
              </Text>
            </Button>
          </View>

          {hint && (
            <Text size="xs" className="text-muted-foreground px-1">{hint}</Text>
          )}
        </View>
      );
    }
  }

  // Retry handler
  function handleRetry() {
    setUploadState('idle');
    setErrorMessage(null);
    setUploadedFile(null);
  }

  // Main upload handler
  async function handleUpload() {
    try {
      // Request permissions
      setUploadState('picking');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setUploadState('error');
        setErrorMessage('Permission denied. Please allow access to your photo library in Settings.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) {
        setUploadState('idle');
        return;
      }

      const asset = result.assets[0];
      
      // Validate file size (<=10MB)
      // Fetch the file to get its size
      setUploadState('uploading');
      
      try {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const fileSizeInMB = blob.size / (1024 * 1024);
        
        if (fileSizeInMB > 10) {
          setUploadState('error');
          setErrorMessage('File size exceeds 10MB. Please choose a smaller image.');
          return;
        }

        // Determine file name and mime type
        const fileName = asset.uri.split('/').pop() || `document_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || 'image/jpeg';

        // Upload to backend
        const uploadResponse = await api.uploadDriverDocument({
          applicationId,
          documentType,
          fileUri: asset.uri,
          fileName,
          mimeType,
        });

        if (uploadResponse.success && uploadResponse.documentId && uploadResponse.uploadedUrl) {
          setUploadState('success');
          setUploadedFile({
            name: fileName,
            url: uploadResponse.uploadedUrl,
          });
          onUploadComplete(documentType, uploadResponse.documentId, uploadResponse.uploadedUrl);
        } else {
          setUploadState('error');
          setErrorMessage(uploadResponse.error || 'Upload failed. Please try again.');
        }
      } catch (uploadError) {
        setUploadState('error');
        setErrorMessage(
          uploadError instanceof Error
            ? uploadError.message
            : 'Upload failed. Please check your connection and try again.'
        );
      }
    } catch (error) {
      setUploadState('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to select image. Please try again.'
      );
    }
  }

  // Render different states
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <Text size="sm" weight="semibold" className="text-foreground">
          {label}
        </Text>
        {required && <Text size="sm" style={{ color: ERROR_RED }}>*</Text>}
      </View>

      {/* Idle state - show upload button */}
      {uploadState === 'idle' && (
        <TouchableOpacity
          className="rounded-xl p-4 flex-row items-center justify-center gap-3"
          style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
          onPress={handleUpload}
          accessibilityLabel={`Upload ${label}`}
          accessibilityRole="button"
        >
          <Upload size={20} color={PRIMARY_GREEN} strokeWidth={2} />
          <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
            {label}
          </Text>
        </TouchableOpacity>
      )}

      {/* Picking state - show disabled button with spinner */}
      {uploadState === 'picking' && (
        <View
          className="rounded-xl p-4 flex-row items-center justify-center gap-3"
          style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#f9f9f9' }}
        >
          <ActivityIndicator size="small" color={PRIMARY_GREEN} />
          <Text size="sm" weight="semibold" className="text-muted-foreground">
            Opening library...
          </Text>
        </View>
      )}

      {/* Uploading state - show progress */}
      {uploadState === 'uploading' && (
        <View
          className="rounded-xl p-4 gap-2"
          style={{ borderWidth: 1.5, borderColor: PRIMARY_GREEN, backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <View className="flex-row items-center gap-3">
            <ActivityIndicator size="small" color={PRIMARY_GREEN} />
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>
                Uploading...
              </Text>
              <Text size="xs" className="text-muted-foreground">
                Please wait while we upload your document
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Success state - show thumbnail or file icon with checkmark */}
      {uploadState === 'success' && uploadedFile && (
        <View
          className="rounded-xl p-4 flex-row items-center gap-3"
          style={{ borderWidth: 1.5, borderColor: SUCCESS_GREEN, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
        >
          {uploadedFile.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <Image
              source={{ uri: uploadedFile.url }}
              style={{ width: 48, height: 48, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="h-12 w-12 rounded-lg items-center justify-center"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
            >
              <FileText size={24} color={SUCCESS_GREEN} strokeWidth={2} />
            </View>
          )}
          <View className="flex-1">
            <Text size="sm" weight="bold" style={{ color: SUCCESS_GREEN }}>
              Upload Complete
            </Text>
            <Text size="xs" className="text-muted-foreground">
              {documentType.replace(/_/g, ' ')}
            </Text>
          </View>
          <CheckCircle2 size={24} color={SUCCESS_GREEN} strokeWidth={2} />
        </View>
      )}

      {/* Error state - show error message with retry button */}
      {uploadState === 'error' && (
        <View className="gap-2">
          <View
            className="rounded-xl p-4 flex-row items-start gap-3"
            style={{ backgroundColor: '#fee2e2', borderWidth: 1.5, borderColor: ERROR_RED }}
          >
            <AlertCircle size={20} color={ERROR_RED} strokeWidth={2} style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: ERROR_RED }}>
                Upload Failed
              </Text>
              <Text size="xs" style={{ color: ERROR_RED, marginTop: 4 }}>
                {errorMessage}
              </Text>
            </View>
          </View>
          <Button
            size="sm"
            variant="outline"
            style={{ borderColor: ERROR_RED }}
            onPress={handleRetry}
            accessibilityLabel="Retry upload"
          >
            <RefreshCw size={14} color={ERROR_RED} strokeWidth={2} />
            <Text size="sm" weight="semibold" style={{ color: ERROR_RED, marginLeft: 8 }}>
              Try Again
            </Text>
          </Button>
        </View>
      )}

      {hint && uploadState === 'idle' && (
        <Text size="xs" className="text-muted-foreground px-1">{hint}</Text>
      )}
    </View>
  );
}
