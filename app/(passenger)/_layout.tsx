import { Stack } from 'expo-router';

/**
 * Passenger route group layout.
 * All screens inside (passenger)/ are only reachable after login.
 * Phase 0.5 — no real auth guard yet; guard wired in Phase 1.
 */
export default function PassengerLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
