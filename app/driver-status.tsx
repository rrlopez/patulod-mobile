import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text } from 'panelui-native';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  FileText,
  RefreshCw,
  Home,
  Bell,
  User,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const PRIMARY_GREEN = '#0d5f3a';

/**
 * Mock status — toggle between these to preview all states:
 * 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_NEEDED'
 */
type AppStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CORRECTION_NEEDED';

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
    title: 'Application Under Review',
    subtitle: 'Your application has been submitted and is being reviewed by the PATULOD team. This usually takes 1–3 business days.',
    color: '#0369a1',
    badgeLabel: 'Pending Review',
    badgeBg: 'rgba(3,105,161,0.1)',
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
  CORRECTION_NEEDED: {
    icon: <AlertTriangle size={44} color="#92400e" strokeWidth={1.75} />,
    iconBg: 'rgba(251,191,36,0.15)',
    title: 'Action Required',
    subtitle: 'Some of your documents need to be corrected or re-uploaded before your application can proceed.',
    color: '#92400e',
    badgeLabel: 'Correction Needed',
    badgeBg: 'rgba(251,191,36,0.15)',
  },
};

const MOCK_DOCUMENTS = [
  { id: 'license',      label: "Driver's License",       docStatus: 'approved'  as const },
  { id: 'or_cr',        label: 'OR / CR',                docStatus: 'rejected'  as const },
  { id: 'valid_id',     label: 'Government-Issued ID',   docStatus: 'approved'  as const },
  { id: 'selfie',       label: 'Selfie with ID',         docStatus: 'reviewing' as const },
  { id: 'vehicle_photo',label: 'Vehicle Photo',          docStatus: 'approved'  as const },
];

const DOC_STATUS_CFG = {
  pending:   { label: 'Not uploaded', color: '#9ca3af' },
  uploaded:  { label: 'Uploaded',     color: '#0369a1' },
  reviewing: { label: 'Reviewing',    color: '#92400e' },
  approved:  { label: 'Approved ✓',   color: PRIMARY_GREEN },
  rejected:  { label: 'Rejected',     color: '#dc2626' },
};

/**
 * Application Status Screen
 * Phase 0.5 — Mock UI
 *
 * Per master-plan.md Phase 5:
 * - Status badge: PENDING / APPROVED / REJECTED / CORRECTION_NEEDED
 * - Reason for rejection or correction
 * - Correction route back to document upload
 */
export default function DriverStatus() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Toggle to preview different states
  const [currentStatus, setCurrentStatus] = useState<AppStatus>('PENDING');
  const scenario = STATUS_SCENARIOS[currentStatus];

  const STATUS_CYCLE: AppStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'CORRECTION_NEEDED'];

  function cycleStatus() {
    const idx = STATUS_CYCLE.indexOf(currentStatus);
    setCurrentStatus(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>

      {/* ===== HEADER ===== */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text size="xl" weight="bold" style={{ color: PRIMARY_GREEN }}>Application Status</Text>
        
        <View className="flex-row items-center gap-2">
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

          {/* Demo toggle */}
          <TouchableOpacity
            className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ backgroundColor: 'rgba(13,95,58,0.08)' }}
            onPress={cycleStatus}
          >
            <RefreshCw size={13} color={PRIMARY_GREEN} strokeWidth={2.5} />
            <Text size="xs" weight="semibold" style={{ color: PRIMARY_GREEN }}>Demo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
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

          {/* ===== REJECTION REASON (REJECTED) ===== */}
          {currentStatus === 'REJECTED' && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View className="gap-2">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  Reason
                </Text>
                <View
                  className="rounded-2xl p-4 gap-2"
                  style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderWidth: 1.5, borderColor: 'rgba(220,38,38,0.2)' }}
                >
                  <Text size="sm" weight="bold" style={{ color: '#dc2626' }}>Application Not Approved</Text>
                  <Text size="sm" className="text-foreground leading-relaxed">
                    Your OR/CR document could not be verified. The document appears to be expired or the details do not match the vehicle information provided.
                  </Text>
                  <Text size="xs" className="text-muted-foreground leading-relaxed">
                    If you believe this is an error, please contact our support team with your booking reference.
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* ===== CORRECTION DETAILS (CORRECTION_NEEDED) ===== */}
          {currentStatus === 'CORRECTION_NEEDED' && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <View className="gap-2">
                <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                  Documents Requiring Correction
                </Text>
                <View
                  className="rounded-2xl p-4 gap-3"
                  style={{ backgroundColor: 'rgba(251,191,36,0.07)', borderWidth: 1.5, borderColor: 'rgba(251,191,36,0.3)' }}
                >
                  <Text size="sm" weight="bold" style={{ color: '#92400e' }}>OR / CR — Re-upload Required</Text>
                  <Text size="sm" className="text-foreground leading-relaxed">
                    The uploaded OR/CR image is blurry and the text is not legible. Please re-upload a clear, well-lit photo where all details are visible.
                  </Text>
                  <Button
                    size="md"
                    className="w-full"
                    style={{ backgroundColor: '#92400e' }}
                    onPress={() => router.push('/driver-docs')}
                  >
                    <Text size="sm" weight="bold" className="text-white">Re-upload Documents</Text>
                  </Button>
                </View>
              </View>
            </Animated.View>
          )}

          {/* ===== DOCUMENT STATUS LIST ===== */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <View className="gap-2">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Submitted Documents
              </Text>
              <View
                className="rounded-2xl overflow-hidden"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                {MOCK_DOCUMENTS.map((doc, i) => {
                  const cfg = DOC_STATUS_CFG[doc.docStatus];
                  return (
                    <View key={doc.id}>
                      <View className="flex-row items-center gap-3 px-4 py-3.5">
                        <FileText size={16} color="#9ca3af" strokeWidth={2} />
                        <Text size="sm" weight="medium" className="text-foreground flex-1">
                          {doc.label}
                        </Text>
                        <Text size="xs" weight="semibold" style={{ color: cfg.color }}>
                          {cfg.label}
                        </Text>
                      </View>
                      {i < MOCK_DOCUMENTS.length - 1 && (
                        <View className="h-px bg-border/40 mx-4" />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* ===== TIMELINE ===== */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <View className="gap-2">
              <Text size="xs" weight="bold" className="text-muted-foreground uppercase tracking-wider">
                Timeline
              </Text>
              <View
                className="rounded-2xl p-4 gap-3"
                style={{ borderWidth: 1.5, borderColor: '#e5e5e3', backgroundColor: '#fff' }}
              >
                <TimelineItem done label="Application submitted" time="Oct 8, 2026 · 8:30 AM" />
                <TimelineItem done label="Documents uploaded" time="Oct 8, 2026 · 8:35 AM" />
                <TimelineItem
                  done={currentStatus !== 'PENDING'}
                  active={currentStatus === 'PENDING'}
                  label="Under review by PATULOD team"
                  time={currentStatus === 'PENDING' ? 'In progress…' : 'Oct 9, 2026 · 10:00 AM'}
                />
                <TimelineItem
                  done={currentStatus === 'APPROVED'}
                  label="Account activated"
                  time={currentStatus === 'APPROVED' ? 'Oct 9, 2026 · 10:05 AM' : 'Pending'}
                />
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
            {(currentStatus === 'REJECTED' || currentStatus === 'CORRECTION_NEEDED') && (
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

          {/* ===== MOCK NOTE ===== */}
          <View
            className="rounded-2xl p-4 gap-1"
            style={{ backgroundColor: 'rgba(13,95,58,0.05)', borderWidth: 1, borderColor: 'rgba(13,95,58,0.12)' }}
          >
            <Text size="xs" weight="bold" style={{ color: PRIMARY_GREEN }}>Phase 0.5 — Demo</Text>
            <Text size="xs" className="text-muted-foreground">
              Tap the "Demo" button top-right to cycle through all 4 status states.
            </Text>
          </View>

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Local helper ───────────────────────────────────────────────────────── */

function TimelineItem({
  label, time, done, active,
}: {
  label: string;
  time: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="items-center" style={{ width: 20 }}>
        {done ? (
          <CheckCircle2 size={18} color={PRIMARY_GREEN} strokeWidth={2.5} />
        ) : active ? (
          <View className="h-4.5 w-4.5 rounded-full border-2 items-center justify-center" style={{ borderColor: '#0369a1' }}>
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: '#0369a1' }} />
          </View>
        ) : (
          <View className="h-4 w-4 rounded-full border-2" style={{ borderColor: '#e5e5e3' }} />
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <Text size="sm" weight={done || active ? 'semibold' : 'medium'} style={{ color: done ? '#1a1a1a' : active ? '#0369a1' : '#9ca3af' }}>
          {label}
        </Text>
        <Text size="xs" style={{ color: done ? PRIMARY_GREEN : '#9ca3af' }}>{time}</Text>
      </View>
    </View>
  );
}
