import { Stack } from 'expo-router';

/**
 * Driver route group layout.
 * All screens inside (driver)/ are only reachable after login with a DRIVER role.
 * Phase 0.5 — no real auth guard yet; guard wired in Phase 1.
 */
export default function DriverLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
