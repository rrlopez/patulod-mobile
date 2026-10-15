import { apiClient } from './client'

/**
 * Mark driver as arrived at pickup location
 */
export async function markDriverArrived(
  tripId: string,
  driverId: string
): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> {
  try {
    const response = await apiClient.post('/api/mobile/trips/arrived', {
      tripId,
      driverId,
    })
    return response.data
  } catch (error: any) {
    console.error('Mark arrived error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark arrival',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Start trip after pickup
 */
export async function startTrip(
  tripId: string,
  driverId: string
): Promise<{ success: boolean; message?: string; errors?: Record<string, string> }> {
  try {
    const response = await apiClient.post('/api/mobile/trips/start', {
      tripId,
      driverId,
    })
    return response.data
  } catch (error: any) {
    console.error('Start trip error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to start trip',
      errors: error.response?.data?.errors,
    }
  }
}

/**
 * Complete trip
 */
export async function completeTrip(params: {
  tripId: string
  driverId: string
  finalFare?: number
  fareAdjustmentReason?: string
}): Promise<{
  success: boolean
  data?: any
  message?: string
  errors?: Record<string, string>
}> {
  try {
    const response = await apiClient.post('/api/mobile/trips/complete', params)
    return response.data
  } catch (error: any) {
    console.error('Complete trip error:', error)
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to complete trip',
      errors: error.response?.data?.errors,
    }
  }
}
