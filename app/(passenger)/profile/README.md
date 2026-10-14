# Passenger Profile Screen

## Structure

The passenger profile screen has been split into reusable components with backend integration.

**Location:** 
- Route: `app/(passenger)/profile/index.tsx`
- Components: `components/passenger/profile/`

### Components

#### `index.tsx` (in `app/(passenger)/profile/`)
Main screen component that orchestrates all child components and handles backend data fetching.

**Backend Integration:**
- Fetches user profile from `/api/mobile/user/me`
- Formats member since date from `createdAt`
- Handles logout via `/api/mobile/auth/logout`

**Data Fetched:**
- `fullName` - User's full name from PatulodUser
- `email` - User's email from PatulodUser
- `phone` - User's phone from PatulodUser
- `role` - User's role (PASSENGER or DRIVER)
- `memberSince` - Formatted from createdAt timestamp

#### `ProfileHeader.tsx` (in `components/passenger/profile/`)
Profile header with avatar, name, role badge, and member since date.

**Props:**
- `fullName: string` - User's full name
- `role: string` - User role (Passenger/Driver)
- `memberSince: string` - Formatted date (e.g., "October 2026")
- `onEditAvatar?: () => void` - Optional avatar edit handler

**Features:**
- Large avatar placeholder with emoji
- Edit button overlay on avatar
- Role badge with checkmark icon
- Member since date display

#### `AccountDetails.tsx` (in `components/passenger/profile/`)
User's account information with edit capability.

**Props:**
- `fullName: string` - User's full name
- `email: string` - User's email address
- `phone: string` - User's phone number
- `onEdit: () => void` - Edit profile handler

**Features:**
- Three editable fields: Full Name, Email, Mobile
- Edit icon on each field
- Sensitive field notes (email/phone require password)
- Information note about password requirement

#### `PoliciesSupport.tsx` (in `components/passenger/profile/`)
Links to policies and support pages.

**Features:**
- Terms and Understanding link
- Privacy Notice link
- Safety & Community Guidelines link
- Help / Support link
- About PATULOD link

#### `LogoutSection.tsx` (in `components/passenger/profile/`)
Logout button with confirmation dialog.

**Props:**
- `showConfirm: boolean` - Show/hide confirmation dialog
- `isLoggingOut: boolean` - Loading state during logout
- `onShowConfirm: () => void` - Show confirmation handler
- `onCancel: () => void` - Cancel logout handler
- `onLogout: () => void` - Confirm logout handler

**Features:**
- Initial logout button
- Confirmation dialog with explanation
- Cancel and confirm buttons
- Loading state during logout API call

#### `AccountActions.tsx` (in `components/passenger/profile/`)
Account deactivation and deletion options.

**Props:**
- `showDeactivateConfirm: boolean` - Show/hide deactivation explanation
- `showDeleteConfirm: boolean` - Show/hide deletion explanation
- `onToggleDeactivate: () => void` - Toggle deactivation explanation
- `onToggleDelete: () => void` - Toggle deletion explanation

**Features:**
- Deactivate Account option with explanation
- Request Account Deletion option with explanation
- Links to support for both actions
- Clear warnings about consequences

## Backend Models Used

### Primary Models
- **PatulodUser** - User profile data (fullName, email, phone, role, createdAt)

### API Endpoints
- `GET /api/mobile/user/me` - Fetch user profile
- `POST /api/mobile/auth/logout` - Logout user

## Phase Notes

### Current (Phase 0.5)
- ✅ Component split complete
- ✅ Backend integration for user profile
- ✅ Real data: name, email, phone, role, member since
- ✅ Logout functionality with backend API

### Phase 1
- [ ] Edit profile functionality
- [ ] Password change
- [ ] Avatar upload
- [ ] Reauthentication for sensitive changes

### Phase 3
- [ ] Account deactivation workflow
- [ ] Account deletion workflow
- [ ] Profile statistics (trips completed, etc.)

## Fallback Behavior

If backend fetch fails:
- Falls back to stored user data from authStore
- Shows "Guest" if no user data available
- Shows "Recently" for member since date

## Layout

The layout is **exactly the same** as the original `profile.tsx` - we've only split it into components and added backend integration. The visual design and spacing remain unchanged.

## User Actions

### Editable (Phase 1)
- Full Name
- Email (requires password confirmation)
- Phone (requires password confirmation)
- Avatar

### Read-only
- Role
- Member since date

### Available Actions
- View policies (Terms, Privacy, Safety)
- Access Help/Support
- Logout
- Request Deactivation (via support)
- Request Deletion (via support)
