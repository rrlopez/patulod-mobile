# Passenger Home Screen

## Structure

The passenger home screen has been split into reusable components with backend integration.

**Location:** 
- Route: `app/(passenger)/home/index.tsx`
- Components: `components/passenger/home/`

### Components

#### `index.tsx` (in `app/(passenger)/home/`)
Main screen component that orchestrates all child components and handles backend data fetching.

**Backend Integration:**
- Fetches user profile from `/api/mobile/user/me`
- Counts unread notifications using Prisma endpoint (`notification` model)
- Fetches recent completed bookings using Prisma endpoint (`booking` model)

**Data Fetched:**
- `userName` - Full name from PatulodUser table
- `hasUnreadNotifications` - Boolean from Notification count
- `recentDestinations` - List of recent completed bookings (Phase 3)

#### `Header.tsx` (in `components/passenger/home/`)
Top bar with greeting, user name, and action buttons.

**Props:**
- `userName: string` - User's full name
- `hasUnreadNotifications?: boolean` - Shows red dot on bell icon

**Features:**
- Dynamic greeting based on time of day (morning/afternoon/evening)
- Notifications button with unread indicator
- Profile button

#### `BookRideCTA.tsx` (in `components/passenger/home/`)
Main call-to-action card for booking a ride.

**Features:**
- Large prominent card with green background
- Navigation icon
- Mock destination input field
- Links to booking flow

#### `QuickDestinations.tsx` (in `components/passenger/home/`)
Grid of quick access destination buttons.

**Features:**
- 4 quick destination buttons: Hospital, School, Market, Church
- Static icons (Phase 3: will be from user preferences)

#### `RecentDestinations.tsx` (in `components/passenger/home/`)
List of recently visited destinations.

**Props:**
- `destinations: RecentDestination[]` - Array of recent destinations

**Backend Integration:**
- Shows recent completed bookings
- Hides component if no destinations available
- Each destination has icon, label, and address

**RecentDestination Interface:**
```typescript
interface RecentDestination {
  id: string;
  label: string;
  address: string;
  icon: string;
}
```

#### `ServiceCards.tsx` (in `components/passenger/home/`)
Cards showing available vehicle types and pricing.

**Features:**
- Motorcycle card (1 passenger, from ₱30)
- Tricycle card (1-3 passengers, from ₱40)
- Static pricing (Phase 3: will be from FareConfig table)

#### `SafetyReminder.tsx` (in `components/passenger/home/`)
Safety reminder card linking to safety guidelines.

**Features:**
- Shield emoji icon
- Brief safety message
- Links to `/safety` screen

## Backend Models Used

### Primary Models
- **PatulodUser** - User profile data (fullName, role, etc.)
- **Notification** - Unread notification count
- **Booking** - Recent destinations (status: COMPLETED)

### API Endpoints
- `GET /api/mobile/user/me` - Fetch user profile
- `POST /api/prisma` - Generic Prisma queries with Bearer token

## Phase Notes

### Current (Phase 0.5)
- ✅ Component split complete
- ✅ Backend integration for user profile
- ✅ Backend integration for notifications count
- ✅ Backend integration for recent bookings

### Phase 3
- [ ] Load quick destinations from user preferences
- [ ] Enhanced booking history with trip details
- [ ] Dynamic fare pricing from FareConfig

## Fallback Behavior

If backend fetch fails:
- Falls back to stored user data from authStore
- Shows "Guest" if no user data available
- Empty array for recent destinations (component hidden)
- No unread notification indicator

## Layout

The layout is **exactly the same** as the original `home.tsx` - we've only split it into components and added backend integration. The visual design and spacing remain unchanged.
