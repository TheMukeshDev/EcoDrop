/**
 * Geo-Verification Utilities for E-Waste Drop Confirmation System
 * Implements anti-cheat logic using time-based proximity validation
 * Aligned with Smart City sustainability goals
 */

export interface ActiveDestination {
    binId: string
    lat: number
    lng: number
    binName: string
    address?: string
    startedAt: number // timestamp
}

export interface LocationState {
    isNearBin: boolean
    withinRadiusTime: number // seconds spent within 50m radius
    canConfirm: boolean
    distance?: number
}

export interface GeoPosition {
    latitude: number
    longitude: number
    accuracy?: number
    timestamp?: number
}

/**
 * Haversine formula to calculate distance between two GPS coordinates
 * Returns distance in meters
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // distance in meters
}

/**
 * Check if user is within verification radius of the target bin
 * Uses 50-meter radius as per smart city civic platform standards
 */
export function isWithinProximityRadius(
    userLocation: GeoPosition,
    destination: ActiveDestination,
    radius: number = 50
): boolean {
    const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        destination.lat,
        destination.lng
    )

    return distance <= radius
}

/**
 * Calculate time spent within proximity radius
 * Implements minimum 30-second requirement to prevent cheating
 */
export function calculateTimeInRadius(
    withinRadiusTime: number,
    minimumTime: number = 30
): boolean {
    return withinRadiusTime >= minimumTime
}

/**
 * Local Storage management for active destination
 * Persists navigation state across page refreshes
 */
export const destinationStorage = {
    save: (destination: ActiveDestination): void => {
        try {
            localStorage.setItem('ecodrop_active_destination', JSON.stringify(destination))
        } catch (error) {
            console.warn('Failed to save destination to localStorage:', error)
        }
    },

    load: (): ActiveDestination | null => {
        try {
            const stored = localStorage.getItem('ecodrop_active_destination')
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.warn('Failed to load destination from localStorage:', error)
            return null
        }
    },

    clear: (): void => {
        try {
            localStorage.removeItem('ecodrop_active_destination')
        } catch (error) {
            console.warn('Failed to clear destination from localStorage:', error)
        }
    },

    // Check if destination is still valid (not older than 2 hours)
    isValid: (destination: ActiveDestination): boolean => {
        const now = Date.now()
        const maxAge = 2 * 60 * 60 * 1000 // 2 hours
        return (now - destination.startedAt) < maxAge
    }
}

/**
 * Location tracking state management
 * Handles real-time proximity validation with anti-cheat logic
 */
export class LocationTracker {
    private watchId: number | null = null
    private destination: ActiveDestination | null = null
    private withinRadiusStartTime: number | null = null
    private lastUpdate: number = 0
    private listeners: Array<(state: LocationState) => void> = []

    /**
     * Start tracking user location relative to destination
     * Uses watchPosition for real-time updates
     */
    startTracking(destination: ActiveDestination, callback: (state: LocationState) => void): Promise<boolean> {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser')
        }

        this.destination = destination
        this.listeners.push(callback)

        return new Promise((resolve, reject) => {
            try {
                this.watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const state = this.processLocationUpdate(position)

                        const now = Date.now()
                        // PERFORMANCE OPTIMIZATION:
                        // Throttle updates to UI when not in critical verification zone.
                        // If user is far from bin, only update every 2 seconds to prevent React re-renders.
                        // If near bin, we need real-time updates for the timer.
                        if (!state.isNearBin && now - this.lastUpdate < 2000) {
                            return
                        }

                        this.notifyListeners(state)
                        this.lastUpdate = now

                        // Resolve promise on first successful location
                        if (this.watchId !== null) {
                            resolve(true)
                        }
                    },
                    (error) => {
                        console.error('Location tracking error:', error)
                        reject(new Error(this.getGeolocationErrorMessage(error)))
                    },
                    {
                        enableHighAccuracy: true, // Try high accuracy
                        timeout: 30000, // Increased to 30 seconds to prevent timeouts
                        maximumAge: 30000, // Accept positions up to 30 seconds old
                    }
                )
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Stop tracking and clean up resources
     */
    stopTracking(): void {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId)
            this.watchId = null
        }

        this.destination = null
        this.withinRadiusStartTime = null
        this.listeners = []
    }

    /**
     * Process location update and calculate proximity state
     * Implements time-based validation logic
     */
    private processLocationUpdate(position: GeolocationPosition): LocationState {
        if (!this.destination) {
            return {
                isNearBin: false,
                withinRadiusTime: 0,
                canConfirm: false
            }
        }

        const userLocation: GeoPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
        }

        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            this.destination.lat,
            this.destination.lng
        )

        const isNearBin = distance <= 50 // 50-meter verification radius

        let withinRadiusTime = 0
        let canConfirm = false

        if (isNearBin) {
            // User entered the radius - start timer if not already started
            if (this.withinRadiusStartTime === null) {
                this.withinRadiusStartTime = Date.now()
            }

            withinRadiusTime = Math.floor((Date.now() - this.withinRadiusStartTime) / 1000)
            canConfirm = calculateTimeInRadius(withinRadiusTime)
        } else {
            // User left the radius - reset timer (anti-cheat mechanism)
            this.withinRadiusStartTime = null
        }

        return {
            isNearBin,
            withinRadiusTime,
            canConfirm,
            distance
        }
    }

    /**
     * Notify all registered listeners of state changes
     */
    private notifyListeners(state: LocationState): void {
        this.listeners.forEach(callback => callback(state))
    }

    /**
     * Get user-friendly error messages for geolocation errors
     */
    private getGeolocationErrorMessage(error: GeolocationPositionError): string {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Location permission denied. Please enable location services to verify your drop.'
            case error.POSITION_UNAVAILABLE:
                return 'Location information unavailable. Please check your GPS connection.'
            case error.TIMEOUT:
                return 'Location request timed out. Please try again.'
            default:
                return 'Unknown location error occurred.'
        }
    }

    /**
     * Get current tracking state
     */
    getDestination(): ActiveDestination | null {
        return this.destination
    }

    /**
     * Check if currently tracking
     */
    isTracking(): boolean {
        return this.watchId !== null
    }
}

// Singleton instance for global tracking
export const locationTracker = new LocationTracker()