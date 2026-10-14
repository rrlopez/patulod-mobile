import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button, Text } from 'panelui-native';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Upload,
} from 'lucide-react-native';
import { api } from '../lib/api';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';
const SUCCESS_GREEN = '#10b981';

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

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
  const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  // Handle existing approved documents
  if (existingDocument?.reviewStatus === 'APPROVED') {
    return (
      <View className="gap-1.5">
        <View className="flex-row items-center gap-2">
          <Text size="sm" weight="semibold" className="text-foreground">{label}</Text>
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
            <Text size="sm" weight="bold" style={{ color: SUCCESS_GREEN }}>Approved</Text>
            <Text size="xs" className="text-muted-foreground">{documentType.replace(/_/g, ' ')}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Reset handler
  function handleReset() {
    setUploadState('idle');
    setErrorMessage(null);
    setSelectedAsset(null);
    setUploadedFile(null);
  }

  // Remove selected photo
  function handleRemove() {
    setSelectedAsset(null);
    setUploadState('idle');
  }

  // Camera handler
  async function handleCamera() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setUploadState('error');
        setErrorMessage('Permission denied. Please allow camera access in Settings.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      
      // Validate file size
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const fileSizeInMB = blob.size / (1024 * 1024);
      
      if (fileSizeInMB > 5) {
        setUploadState('error');
        setErrorMessage('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }

      // Show preview
      setSelectedAsset(asset);
      setUploadState('selected');
    } catch (error) {
      setUploadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to take photo.');
    }
  }

  // Gallery handler
  async function handleGallery() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setUploadState('error');
        setErrorMessage('Permission denied. Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      
      // Validate file size
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const fileSizeInMB = blob.size / (1024 * 1024);
      
      if (fileSizeInMB > 5) {
        setUploadState('error');
        setErrorMessage('File size exceeds 5MB. Please choose a smaller image.');
        return;
      }

      // Show preview
      setSelectedAsset(asset);
      setUploadState('selected');
    } catch (error) {
      setUploadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to select image.');
    }
  }

  // Upload the selected photo
  async function handleUpload() {
    if (!selectedAsset) return;

    try {
      setUploadState('uploading');

      const fileName = selectedAsset.uri.split('/').pop() || `document_${Date.now()}.jpg`;
      const mimeType = selectedAsset.mimeType || 'image/jpeg';

      const uploadResponse = await api.uploadDriverDocument({
        applicationId,
        documentType,
        fileUri: selectedAsset.uri,
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
    } catch (error) {
      setUploadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed.');
    }
  }

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <Text size="sm" weight="semibold" className="text-foreground">{label}</Text>
        {required && <Text size="sm" style={{ color: ERROR_RED }}>*</Text>}
      </View>

      {/* Idle state - show camera and gallery buttons */}
      {uploadState === 'idle' && (
        <View className="gap-2">
          <TouchableOpacity
            className="rounded-xl p-4 flex-row items-center justify-center gap-3"
            style={{ borderWidth: 1.5, borderColor: PRIMARY_GREEN, backgroundColor: PRIMARY_GREEN }}
            onPress={handleCamera}
          >
            <Camera size={20} color="#fff" strokeWidth={2} />
            <Text size="sm" weight="semibold" className="text-white">Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="rounded-xl p-4 flex-row items-center justify-center gap-3"
            style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
            onPress={handleGallery}
          >
            <ImageIcon size={20} color={PRIMARY_GREEN} strokeWidth={2} />
            <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Selected state - show preview with upload/remove buttons */}
      {uploadState === 'selected' && selectedAsset && (
        <View className="gap-2">
          <View
            className="rounded-xl overflow-hidden"
            style={{ borderWidth: 1.5, borderColor: PRIMARY_GREEN }}
          >
            <Image
              source={{ uri: selectedAsset.uri }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          </View>
          
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                size="sm"
                variant="outline"
                style={{ borderColor: ERROR_RED }}
                onPress={handleRemove}
              >
                <X size={14} color={ERROR_RED} strokeWidth={2} />
                <Text size="sm" weight="semibold" style={{ color: ERROR_RED, marginLeft: 6 }}>
                  Remove
                </Text>
              </Button>
            </View>
            <View className="flex-1">
              <Button
                size="sm"
                style={{ backgroundColor: PRIMARY_GREEN }}
                onPress={handleUpload}
              >
                <Upload size={14} color="#fff" strokeWidth={2} />
                <Text size="sm" weight="semibold" className="text-white ml-1.5">
                  Upload
                </Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* Uploading state */}
      {uploadState === 'uploading' && (
        <View
          className="rounded-xl p-4 gap-2"
          style={{ borderWidth: 1.5, borderColor: PRIMARY_GREEN, backgroundColor: 'rgba(13, 95, 58, 0.05)' }}
        >
          <View className="flex-row items-center gap-3">
            <ActivityIndicator size="small" color={PRIMARY_GREEN} />
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: PRIMARY_GREEN }}>Uploading...</Text>
              <Text size="xs" className="text-muted-foreground">Please wait</Text>
            </View>
          </View>
        </View>
      )}

      {/* Success state */}
      {uploadState === 'success' && uploadedFile && (
        <View
          className="rounded-xl p-4 flex-row items-center gap-3"
          style={{ borderWidth: 1.5, borderColor: SUCCESS_GREEN, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
        >
          <View
            className="h-12 w-12 rounded-lg items-center justify-center"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
          >
            <CheckCircle2 size={24} color={SUCCESS_GREEN} strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text size="sm" weight="bold" style={{ color: SUCCESS_GREEN }}>Upload Complete</Text>
            <Text size="xs" className="text-muted-foreground">{documentType.replace(/_/g, ' ')}</Text>
          </View>
        </View>
      )}

      {/* Error state */}
      {uploadState === 'error' && (
        <View className="gap-2">
          <View
            className="rounded-xl p-4 flex-row items-start gap-3"
            style={{ backgroundColor: '#fee2e2', borderWidth: 1.5, borderColor: ERROR_RED }}
          >
            <AlertCircle size={20} color={ERROR_RED} strokeWidth={2} style={{ marginTop: 1 }} />
            <View className="flex-1">
              <Text size="sm" weight="semibold" style={{ color: ERROR_RED }}>Error</Text>
              <Text size="xs" style={{ color: ERROR_RED, marginTop: 4 }}>{errorMessage}</Text>
            </View>
          </View>
          <Button
            size="sm"
            variant="outline"
            style={{ borderColor: ERROR_RED }}
            onPress={handleReset}
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
