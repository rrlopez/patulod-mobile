# PATULOD Mobile Authentication Integration

## Overview

The PATULOD mobile app now connects to the admin backend for passenger authentication. This document explains the implementation and how to test it.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│ Mobile App      │  HTTP   │ Admin Backend    │
│ (React Native)  │ ◄─────► │ (TanStack Start) │
│                 │  JSON   │                  │
└─────────────────┘         └──────────────────┘
         │                           │
         │                           │
    ┌────▼────┐                 ┌───▼────┐
    │ Secure  │                 │ Better │
    │ Store   │                 │ Auth   │
    │ (Token) │                 │ + DB   │
    └─────────┘                 └────────┘
```

## Components

### 1. API Client (`lib/api.ts`)
- Handles all HTTP requests to backend
- Manages authentication tokens with SecureStore
- Provides type-safe API methods

**Key Functions:**
- `api.register()` - Register new passenger
- `api.login()` - Login with email/password
- `api.logout()` - Logout and clear session
- `api.getCurrentUser()` - Get current user profile

### 2. Auth Store (`lib/store.ts`)
- TanStack Store for global auth state
- Tracks current user and authentication status
- Used for role-based navigation

**State:**
```typescript
{
  user: { id, fullName, email, phone, role } | null,
  isAuthenticated: boolean,
  role: string | null
}
```

### 3. Integrated Screens

#### Registration (`app/register.tsx`)
- ✅ Connected to `/api/mobile/auth/register`
- ✅ Full validation (client + server)
- ✅ Server error handling (duplicate email/phone)
- ✅ Token storage on success
- ✅ Updates auth store
- ✅ Navigates to passenger home

#### Login (`app/login.tsx`)
- ✅ Connected to `/api/mobile/auth/login`
- ✅ Generic error messages (security)
- ✅ Handles suspended/inactive accounts
- ✅ Role-based navigation (PASSENGER vs DRIVER)
- ✅ Token storage on success

#### Logout (`app/(passenger)/profile.tsx` & `app/(driver)/profile.tsx`)
- ✅ Connected to `/api/mobile/auth/logout`
- ✅ Clears server session
- ✅ Removes local token
- ✅ Clears auth store
- ✅ Navigates to landing page

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```env
# For local development
EXPO_PUBLIC_API_URL=http://localhost:3000

# For production
# EXPO_PUBLIC_API_URL=https://api.patulod.com
```

### 2. Backend Setup

Ensure the admin backend is running on the configured URL (default: `http://localhost:3000`).

See `patulod-admin/README.md` for backend setup instructions.

## Testing

### Test Registration

1. Start the mobile app: `npm start`
2. Open on device/simulator
3. Navigate to Register screen
4. Fill in the form:
   - Full Name: Juan Dela Cruz
   - Email: juan@test.com
   - Phone: +639123456789
   - Password: TestPass123
   - Confirm Password: TestPass123
   - Check both Terms and Privacy boxes
5. Tap "Create Account"
6. Should navigate to passenger home screen

### Test Login

1. Navigate to Login screen
2. Enter credentials from registration
3. Tap "Log In"
4. Should navigate to passenger home (role: PASSENGER) or driver home (role: DRIVER)

### Test Logout

1. While logged in, navigate to Profile screen
2. Scroll down to "Session" section
3. Tap "Log Out"
4. Confirm logout
5. Should navigate back to landing page

## Error Handling

### Network Errors
- Displays user-friendly error messages
- Keeps form data intact
- User can retry without re-entering data

### Validation Errors
- Server-side errors displayed on specific fields
- Client validation runs before server call
- Duplicate email/phone detected by server

### Suspended Accounts
- Login shows generic error for suspended users
- Message: "Your account has been suspended. Please contact support."

## Security Features

### Token Management
- Tokens stored in Expo SecureStore (encrypted)
- Automatically attached to authenticated requests
- Cleared on logout

### Password Security
- Never stored or logged
- Validated on client (UX) and server (security)
- Hashed by Better Auth (bcrypt)

### Generic Error Messages
- Login errors don't reveal if email exists
- Prevents account enumeration attacks

## Phone Number Validation

Uses `libphonenumber-js` for Philippine phone numbers:
- Accepts: `09171234567` or `+639171234567`
- Normalizes to E.164 format: `+639171234567`
- Validates as PH number

## Role-Based Navigation

After login, navigation depends on user role from server:

```typescript
if (user.role === 'DRIVER') {
  router.replace('/(driver)/home');
} else {
  router.replace('/(passenger)/home');
}
```

**Never** trust client-side role selection - always use role from server response.

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/mobile/auth/register` | POST | Register new passenger |
| `/api/mobile/auth/login` | POST | Login with credentials |
| `/api/mobile/auth/logout` | POST | Logout and revoke session |
| `/api/mobile/auth/me` | GET | Get current user profile |

## Next Steps

- [ ] Implement session validation on app startup
- [ ] Add forgot/reset password flow
- [ ] Wire profile edit to backend
- [ ] Add session expiry handling
- [ ] Implement biometric login (Face ID/Touch ID)

## Troubleshooting

### "Cannot connect to backend"
- Check backend is running: `http://localhost:3000`
- Check `.env` has correct `EXPO_PUBLIC_API_URL`
- Check device/simulator can reach backend

### "Registration fails with 500 error"
- Check backend console logs
- Verify database is running (PostgreSQL)
- Check Better Auth configuration in admin backend

### "Token not persisting"
- Verify SecureStore is available (works on device/simulator, not web)
- Check console for SecureStore errors

## Development Notes

### Local Development
When testing on a physical device, use your computer's IP address instead of `localhost`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### iOS Simulator
Use `localhost` or `127.0.0.1`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Android Emulator
Use `10.0.2.2` instead of `localhost`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```
