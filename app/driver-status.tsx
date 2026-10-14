import { ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Text } from 'panelui-native';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  RefreshCw,
  Bell,
  User,
  AlertCircle,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { api } from '../lib/api';
import { authStore } from '../lib/store';

const PRIMARY_GREEN = '#0d5f3a';
const ERROR_RED = '#dc2626';

type AppStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'DOCUMENTS_NEEDED';

const STATUS_SCENARIOS: Record<AppStatus, {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  color: string;
  badgeLabel: string;
  badgeBg: string;
}> = {
  PENDING: {
    icon: <Clock size={44} color="#0369a1" strokeWidth={1.75} />,
    iconBg: 'rgba(3,105,161,0.1)',
    title: 'Application Submitted',
    subtitle: 'Your application has been submitted and is waiting to be reviewed by the PATULOD team.',
    color: '#0369a1',
    badgeLabel: 'Submitted',
    badgeBg: 'rgba(3,105,161,0.1)',
  },
  IN_PROGRESS: {
    icon: <Clock size={44} color="#2563eb" strokeWidth={1.75} />,
    iconBg: 'rgba(37,99,235,0.1)',
    title: 'Application Under Review',
    subtitle: 'Your application is currently being reviewed by the PATULOD team. This usually takes 1–3 business days.',
    color: '#2563eb',
    badgeLabel: 'Under Review',
    badgeBg: 'rgba(37,99,235,0.1)',
  },
  APPROVED: {
    icon: <CheckCircle2 size={44} color={PRIMARY_GREEN} strokeWidth={1.75} />,
    iconBg: 'rgba(13,95,58,0.1)',
    title: 'Application Approved!',
    subtitle: 'Welcome to PATULOD. Your driver account is active. You can now go online and start accepting rides.',
    color: PRIMARY_GREEN,
    badgeLabel: 'Approved',
    badgeBg: 'rgba(13,95,58,0.1)',
  },
  REJECTED: {
    icon: <XCircle size={44} color="#dc2626" strokeWidth={1.75} />,
    iconBg: 'rgba(220,38,38,0.1)',
    title: 'Application Not Approved',
    subtitle: 'Unfortunately your application was not approved at this time. Please review the reason below and contact support if you have questions.',
    color: '#dc2626',
    badgeLabel: 'Not Approved',
    badgeBg: 'rgba(220,38,38,0.1)',
  },
  DOCUMENTS_NEEDED: {
    icon: <AlertTriangle size={44} color="#92400e" strokeWidth={1.75} />,
    iconBg: 'rgba(251,191,36,0.15)',
    title: 'Action Required',
    subtitle: 'Some of your documents need to be corrected or re-uploaded before your application can proceed.',
    color: '#92400e',
    badgeLabel: 'Correction Needed',
    badgeBg: 'rgba(251,191,36,0.15)',
  },
};

const DOC_STATUS_CFG = {
  PENDING:  { label: 'Reviewing', color: '#0369a1' },
  APPROVED: { label: 'Approved ✓', color: PRIMARY_GREEN },
  REJECTED: { label: 'Rejected', color: ERROR_RED },
};

const DOC_TYPE_LABELS: Record<string, string> = {
  DRIVERS_LICENSE_FRONT: "Driver's License (Front)",
  DRIVERS_LICENSE_BACK: "Driver's License (Back)",
  VEHICLE_OR_CR: 'Vehicle OR/CR',
  GOVERNMENT_ID: 'Government ID',
  VEHICLE_PHOTO_FRONT: 'Vehicle Photo (Front)',
  VEHICLE_PHOTO_SIDE: 'Vehicle Photo (Side)',
  VEHICLE_PHOTO_PLATE: 'Vehicle Photo (Plate)',
};

export default function DriverStatus() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);

  async function fetchApplicationStatus() {
    try {
      setError(null);
      const response = await api.getDriverApplication();

      if (response.success && response.application) {
        setApplicationData(response.application);
        
        // Update the auth store with the latest application status
        const currentState = authStore.state;
        if (currentState.user && currentState.user.role === 'DRIVER') {
          authStore.setState(() => ({
            ...currentState,
            user: {
              ...currentState.user!,
              driverApplicationStatus: response.application.status,
            },
          }));
          console.log('✅ Updated driver application status in store:', response.application.status);
        }
      } else {
        setError(response.error || 'Failed to load application status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchApplicationStatus();
  }

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        <Text size="sm" className="text-muted-foreground mt-4">Loading application status...</Text>
      </View>
    );
  }

  // Error state
  if (error || !applicationData) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-6 bg-background"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View
          className="h-20 w-20 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)' }}
        >
          <AlertCircle size={40} color={ERROR_RED} strokeWidth={2} />
        </View>
        <View className="items-center gap-2">
          <Text size="2xl" weight="bold" style={{ color: ERROR_RED }}>Error Loading Status</Text>
          <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
            {error || 'Failed to load your application status. Please try again.'}
          </Text>
        </View>
        <Button
          size="lg"
          className="w-full"
          style={{ backgroundColor: PRIMARY_GREEN }}
          onPress={fetchApplicationStatus}
        >
          <RefreshCw size={18} color="#fff" strokeWidth={2} />
          <Text size="base" weight="bold" className="text-white ml-2">Try Again</Text>
        </Button>
      </View>
    );
  }

  const currentStatus = applicationData.status as AppStatus;
  const scenario = STATUS_SCENARIOS[currentStatus] || STATUS_SCENARIOS.PENDING;
  const hasRejectedDocs = applicationData.documents.some((doc: any) => doc.reviewStatus === 'REJECTED');

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* ===== HEADER ===== */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Application Status</Text>
        
        <View className="flex-row items-center gap-2">
          {/* Refresh button */}
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={handleRefresh}
          >
            <RefreshCw size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Notification button */}
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/notifications')}
          >
            <Bell size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Profile button */}
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={() => router.push('/(driver)/profile')}
          >
            <User size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[PRIMARY_GREEN]} />
        }
      >
        <View className="px-5 gap-5">
          {/* ===== STATUS CARD ===== */}
          <Animated.View entering={FadeIn.duration(500)}>
            <View
              className="rounded-3xl items-center px-6 py-8 gap-4"
              style={{ backgroundColor: scenario.iconBg }}
            >
              <View
                className="h-24 w-24 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
              >
                {scenario.icon}
              </View>

              <View className="items-center gap-2">
                <View
                  className="flex-row items-center gap-2 rounded-full px-4 py-1.5"
                  style={{ backgroundColor: scenario.badgeBg }}
                >
                  <View className="h-2 w-2 rounded-full" style={{ backgroundColor: scenario.color }} />
                  <Text size="sm" weight="bold" style={{ color: scenario.color }}>
                    {scenario.badgeLabel}
                  </Text>
                </View>
                <Text size="xl" weight="bold" className="text-foreground text-center">
                  {scenario.title}
                </Text>
                <Text size="sm" className="text-muted-foreground text-center leading-relaxed">
                  {scenario.subtitle}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ===== REJECTION REASON ===== */}
          {currentStatus === 'REJECTED' && applicationData.rejectionReason && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View className="gap-2">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  Reason
                </Text>
                <View
                  className="rounded-2xl p-4 gap-2"
                  style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderWidth: 1.5, borderColor: 'rgba(220,38,38,0.2)' }}
                >
                  <Text size="sm" weight="bold" style={{ color: ERROR_RED }}>Application Not Approved</Text>
                  <Text size="sm" className="text-foreground leading-relaxed">
                    {applicationData.rejectionReason}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* ===== REJECTED DOCUMENTS ===== */}
          {hasRejectedDocs && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View className="gap-2">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  Documents Requiring Correction
                </Text>
                {applicationData.documents
                  .filter((doc: any) => doc.reviewStatus === 'REJECTED')
                  .map((doc: any) => (
                    <View
                      key={doc.id}
                      className="rounded-2xl p-4 gap-3"
                      style={{ backgroundColor: 'rgba(251,191,36,0.07)', borderWidth: 1.5, borderColor: 'rgba(251,191,36,0.3)' }}
                    >
                      <Text size="sm" weight="bold" style={{ color: '#92400e' }}>
                        {DOC_TYPE_LABELS[doc.documentType]} — Re-upload Required
                      </Text>
                      {doc.rejectionReason && (
                        <Text size="sm" className="text-foreground leading-relaxed">
                          {doc.rejectionReason}
                        </Text>
                      )}
                    </View>
                  ))}
                <Button
                  size="md"
                  className="w-full mt-2"
                  style={{ backgroundColor: '#92400e' }}
                  onPress={() => router.push(`/driver-docs?applicationId=${applicationData.id}`)}
                >
                  <Text size="sm" weight="bold" className="text-white">Re-upload Documents</Text>
                </Button>
              </View>
            </Animated.View>
          )}

          {/* ===== DOCUMENT STATUS LIST ===== */}
          {applicationData.documents.length > 0 && (
            <Animated.View entering={FadeInDown.delay(150).duration(400)}>
              <View className="gap-2">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  Submitted Documents ({applicationData.documents.length}/7)
                </Text>
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
                >
                  {applicationData.documents.map((doc: any, i: number) => {
                    const cfg = DOC_STATUS_CFG[doc.reviewStatus as keyof typeof DOC_STATUS_CFG] || DOC_STATUS_CFG.PENDING;
                    return (
                      <View key={doc.id}>
                        <View className="flex-row items-center gap-3 px-4 py-3.5">
                          <FileText size={16} color="#9ca3af" strokeWidth={2} />
                          <Text size="sm" weight="medium" className="text-foreground flex-1">
                            {DOC_TYPE_LABELS[doc.documentType] || doc.documentType}
                          </Text>
                          <Text size="xs" weight="semibold" style={{ color: cfg.color }}>
                            {cfg.label}
                          </Text>
                        </View>
                        {i < applicationData.documents.length - 1 && (
                          <View className="h-px bg-border/40 mx-4" />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          )}

          {/* ===== VEHICLE INFO ===== */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View className="gap-2">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Vehicle Information
              </Text>
              <View
                className="rounded-2xl p-4 gap-2"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                <InfoRow label="Type" value={applicationData.vehicleType.toUpperCase()} />
                <InfoRow label="Plate Number" value={applicationData.plateNumber} />
                <InfoRow label="Model" value={applicationData.vehicleModel} />
                <InfoRow label="Color" value={applicationData.vehicleColor} />
              </View>
            </View>
          </Animated.View>

          {/* ===== CTA ACTIONS ===== */}
          <Animated.View entering={FadeInDown.delay(250).duration(400)} className="gap-3">
            {currentStatus === 'APPROVED' && (
              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: PRIMARY_GREEN }}
                onPress={() => router.replace('/(driver)/home')}
              >
                <Text size="base" weight="bold" className="text-white">Go to Driver Dashboard</Text>
              </Button>
            )}
            {(currentStatus === 'REJECTED' || hasRejectedDocs) && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                style={{ borderColor: PRIMARY_GREEN }}
                onPress={() => router.push('/support')}
              >
                <Text size="base" weight="semibold" style={{ color: PRIMARY_GREEN }}>Contact Support</Text>
              </Button>
            )}
          </Animated.View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Helper Components ──────────────────────────────────────────────────── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text size="sm" className="text-muted-foreground">{label}</Text>
      <Text size="sm" weight="semibold" className="text-foreground">{value}</Text>
    </View>
  );
}
