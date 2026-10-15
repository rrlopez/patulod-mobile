import { Store } from '@tanstack/store'

export interface BookingData {
  bookingId: string
  reference: string
  pickupAddress: string
  destinationAddress: string
  pickupLat: number
  pickupLng: number
  destinationLat: number
  destinationLng: number
  serviceType: string
  passengerCount: number
  fareEstimate: number
  fareType: 'ESTIMATED' | 'FIXED'
  status: string
  paymentMethod: string
  distanceKm?: number
  breakdown?: {
    baseFare: number
    distanceCharge: number
    total: number
  }
  trip?: {
    id: string
    driverId: string
    driver?: {
      id: string
      fullName: string
      phone: string
    }
    startedAt?: string
    completedAt?: string
  }
}

export interface DriverLocation {
  lat: number
  lng: number
  timestamp: number
}

interface BookingState {
  // Active booking
  activeBooking: BookingData | null
  
  // Current screen tracking
  currentScreen: 
    | 'home'
    | 'booking'
    | 'service-select'
    | 'fare-estimate'
    | 'review-confirm'
    | 'searching'
    | 'driver-assigned'
    | 'driver-enroute'
    | 'pickup-verify'
    | 'trip-inprogress'
    | 'trip-complete'
    | 'trip-summary'
  
  // Draft booking data (form state)
  draftBooking: {
    pickupAddress: string
    destinationAddress: string
    pickupLat: number | null
    pickupLng: number | null
    destinationLat: number | null
    destinationLng: number | null
    serviceType: string
    passengerCount: number
    paymentMethod: string
  }
  
  // Driver location tracking
  driverLocation: DriverLocation | null
  
  // Connection status
  isOnline: boolean
  socketConnected: boolean
  
  // Loading states
  isCreatingBooking: boolean
  isConfirmingBooking: boolean
  isCancellingBooking: boolean
  
  // Error state
  error: string | null
}

const initialState: BookingState = {
  activeBooking: null,
  currentScreen: 'home',
  draftBooking: {
    pickupAddress: '',
    destinationAddress: '',
    pickupLat: null,
    pickupLng: null,
    destinationLat: null,
    destinationLng: null,
    serviceType: 'TRICYCLE',
    passengerCount: 1,
    paymentMethod: 'CASH',
  },
  driverLocation: null,
  isOnline: true,
  socketConnected: false,
  isCreatingBooking: false,
  isConfirmingBooking: false,
  isCancellingBooking: false,
  error: null,
}

export const bookingStore = new Store<BookingState>(initialState)

// Actions
export const bookingActions = {
  // Set active booking
  setActiveBooking: (booking: Partial<BookingData> | null) => {
    bookingStore.setState((state) => ({
      ...state,
      activeBooking: booking ? {
        ...state.activeBooking,
        ...booking,
      } as BookingData : null,
    }))
  },

  // Update current screen
  setCurrentScreen: (screen: BookingState['currentScreen']) => {
    bookingStore.setState((state) => ({
      ...state,
      currentScreen: screen,
    }))
  },

  // Update draft booking
  updateDraftBooking: (data: Partial<BookingState['draftBooking']>) => {
    bookingStore.setState((state) => ({
      ...state,
      draftBooking: {
        ...state.draftBooking,
        ...data,
      },
    }))
  },

  // Clear draft booking
  clearDraftBooking: () => {
    bookingStore.setState((state) => ({
      ...state,
      draftBooking: initialState.draftBooking,
    }))
  },

  // Update driver location
  updateDriverLocation: (location: DriverLocation) => {
    bookingStore.setState((state) => ({
      ...state,
      driverLocation: location,
    }))
  },

  // Set online status
  setOnlineStatus: (isOnline: boolean) => {
    bookingStore.setState((state) => ({
      ...state,
      isOnline,
    }))
  },

  // Set socket connection status
  setSocketConnected: (connected: boolean) => {
    bookingStore.setState((state) => ({
      ...state,
      socketConnected: connected,
    }))
  },

  // Set loading states
  setCreatingBooking: (loading: boolean) => {
    bookingStore.setState((state) => ({
      ...state,
      isCreatingBooking: loading,
    }))
  },

  setConfirmingBooking: (loading: boolean) => {
    bookingStore.setState((state) => ({
      ...state,
      isConfirmingBooking: loading,
    }))
  },

  setCancellingBooking: (loading: boolean) => {
    bookingStore.setState((state) => ({
      ...state,
      isCancellingBooking: loading,
    }))
  },

  // Set error
  setError: (error: string | null) => {
    bookingStore.setState((state) => ({
      ...state,
      error,
    }))
  },

  // Clear error
  clearError: () => {
    bookingStore.setState((state) => ({
      ...state,
      error: null,
    }))
  },

  // Reset entire store
  reset: () => {
    bookingStore.setState(initialState)
  },
}
