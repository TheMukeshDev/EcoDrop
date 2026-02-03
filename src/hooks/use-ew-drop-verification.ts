"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import {
    destinationStorage,
    ActiveDestination,
    locationTracker
} from "@/lib/geo-verification"

interface UseEWDropVerificationOptions {
    onVerificationSuccess?: (data: {
        pointsEarned: number
        co2Saved: number
        binName: string
    }) => void
    onVerificationError?: (error: string) => void
}

interface VerificationState {
    isVerifying: boolean
    destination: ActiveDestination | null
    error: string | null
}

/**
 * Custom hook for managing E-Waste drop verification flow
 * Integrates geo-proximity validation with backend confirmation
 * Supports Smart City sustainability verification standards
 */
export function useEWDropVerification({
    onVerificationSuccess,
    onVerificationError
}: UseEWDropVerificationOptions = {}) {
    const { user } = useAuth()
    const [state, setState] = useState<VerificationState>({
        isVerifying: false,
        destination: null,
        error: null
    })

    /**
     * STEP 1: Activate destination for verification
     * Saves to localStorage and backend for persistence
     */
    const activateDestination = useCallback(async (
        binId: string,
        binName: string,
        lat: number,
        lng: number,
        address?: string
    ) => {
        try {
            const destination: ActiveDestination = {
                binId,
                binName,
                lat,
                lng,
                address,
                startedAt: Date.now()
            }

            // Save to localStorage for persistence
            destinationStorage.save(destination)

            // Save to backend if user is logged in
            try {
                await fetch("/api/user/destination", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user?._id || ""
                    },
                    body: JSON.stringify(destination)
                })
            } catch (error) {
                // Backend save is optional, don't fail the flow
                console.warn("Failed to save destination to backend:", error)
            }

            setState(prev => ({
                ...prev,
                destination,
                error: null
            }))

            return true
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to activate destination"
            setState(prev => ({
                ...prev,
                error: errorMessage
            }))
            onVerificationError?.(errorMessage)
            return false
        }
    }, [onVerificationError])

    /**
     * STEP 5: Manual drop confirmation
     * Calls backend API with verification data
     */
    const confirmDrop = useCallback(async (
        binId: string,
        location: { latitude: number; longitude: number },
        timeSpent: number
    ) => {
        try {
            setState(prev => ({ ...prev, isVerifying: true, error: null }))

            const response = await fetch("/api/drop/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?._id || ""
                },
                body: JSON.stringify({
                    binId,
                    lat: location.latitude,
                    lng: location.longitude,
                    timeSpent
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Verification failed")
            }

            if (!result.success) {
                throw new Error(result.message || "Verification failed")
            }

            // Success! Handle rewards and notifications
            const { pointsEarned, co2Saved, binName } = result.data

            // Show success toast
            toast.success(`🎉 E-Waste verified! +${pointsEarned} points`, {
                description: `You saved ${co2Saved}kg CO₂ at ${binName}`,
                duration: 5000
            })

            // Call success callbacks
            onVerificationSuccess?.({
                pointsEarned,
                co2Saved,
                binName
            })

            // Clear verification state
            setState({
                isVerifying: false,
                destination: null,
                error: null
            })

            return result.data

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Verification failed"

            setState(prev => ({
                ...prev,
                isVerifying: false,
                error: errorMessage
            }))

            // Show error toast
            toast.error("Verification Failed", {
                description: errorMessage,
                duration: 5000
            })

            onVerificationError?.(errorMessage)
            return null
        }
    }, [onVerificationSuccess, onVerificationError])

    /**
     * Cancel active verification
     * Clears tracking and stored destination
     */
    const cancelVerification = useCallback(() => {
        locationTracker.stopTracking()
        destinationStorage.clear()
        setState({
            isVerifying: false,
            destination: null,
            error: null
        })
    }, [])

    /**
     * Handle tracking error from verification banner
     */
    const handleTrackingError = useCallback((error: string) => {
        setState(prev => ({
            ...prev,
            error
        }))
        onVerificationError?.(error)
    }, [onVerificationError])

    /**
     * Get current verification status
     */
    const getVerificationStatus = useCallback(() => {
        const stored = destinationStorage.load()
        if (stored && destinationStorage.isValid(stored)) {
            return {
                isActive: true,
                destination: stored
            }
        }
        return {
            isActive: false,
            destination: null
        }
    }, [])

    return {
        // State
        ...state,

        // Actions
        activateDestination,
        confirmDrop,
        cancelVerification,
        handleTrackingError,
        getVerificationStatus,

        // Computed
        hasActiveVerification: !!state.destination
    }
}