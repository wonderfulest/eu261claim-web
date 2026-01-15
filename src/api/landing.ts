import instance from '@/config/axios'

export interface LandingLeadPayload {
  flightNumber: string
  flightDate: string
  origin: string
  destination: string
  email: string
}

// Simple landing-page lead endpoint. Adjust the path to match your backend implementation.
export const submitLandingLead = (payload: LandingLeadPayload): Promise<void> => {
  return instance.post('/public/claims/landing-lead', payload)
}
