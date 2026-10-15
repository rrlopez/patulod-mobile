import { apiClient } from './client'

export interface CreateBookingParams {
  userId: string
  pickupAddress: string
  destinationAddress: string
  pickupLat: number
  pickupLng: number
  destinationLat: number
  destinationLng: number
  serviceType: string
  passengerCount: number
  paymentMethod: string
  idempotencyKey: string
}

export interface BookingResponse {
  success: boolean
  data?: {
    bookingId: string
    reference: string
    fareEstimate: number
    fareType: 'ESTIMATED' | 'FIXED'
    distanceKm: number
    breakdown: {
      baseFare: number
      distanceCharge: number
      total: number
    }
  }
  errors?: Record<string, string>
  message?: string
}

export interface ActiveBookingResponse {
  success: boolean
  data?: any
  message?: string
}

/**
 * Create a new booking
 */
export async function createBooking(params: CreateBookingParams): Promise<BookingResponse> {
  try {
    const response = await apiClient.post('/api/mobile/bookings/create', params)
    return response.data
  } catch (error: any) {
    console.error('Create booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create booking',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Confirm booking and start matching
 */
export async function confirmBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> {
  try {
    const response = await apiClient.post('/api/mobile/bookings/confirm', {
      bookingId,
      userId,
    })
    return response.data
  } catch (error: any) {
    console.error('Confirm booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to confirm booking',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Get active booking for user
 */
export async function getActiveBooking(userId: string): Promise<ActiveBookingResponse> {
  try {
    const response = await apiClient.get(`/api/mobile/bookings/active?userId=${userId}`)
    return response.data
  } catch (error: any) {
    // Don't log 404 as error - it's expected when no active booking
    if (error.response?.status === 404) {
      return {
        success: false,
        message: error.response?.data?.message || 'No active booking',
      }
    }
    
    console.error('Get active booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get active booking',
    }
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(
  bookingId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> {
  try {
    const response = await apiClient.post('/api/mobile/bookings/cancel', {
      bookingId,
      userId,
      initiator: 'PASSENGER',
      reason,
    })
    return response.data
  } catch (error: any) {
    console.error('Cancel booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel booking',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Driver accepts booking (for driver role)
 */
export async function acceptBooking(
  bookingId: string,
  driverId: string
): Promise<{ success: boolean; data?: any; message?: string; errors?: Record<string, string> }> {
  try {
    const response = await apiClient.post('/api/mobile/bookings/accept', {
      bookingId,
      driverId,
    })
    return response.data
  } catch (error: any) {
    console.error('Accept booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to accept booking',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Driver declines booking (for driver role)
 */
export async function declineBooking(
  bookingId: string,
  driverId: string,
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.post('/api/mobile/bookings/decline', {
      bookingId,
      driverId,
      reason,
    })
    return response.data
  } catch (error: any) {
    console.error('Decline booking error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to decline booking',
    }
  }
}
