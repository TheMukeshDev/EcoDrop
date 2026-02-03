"use client"

import { useState, useEffect } from "react"
import { DEFAULT_LOCATION } from "@/lib/constants"

interface LocationState {
    latitude: number
    longitude: number
    error: string | null
    loading: boolean
    usingDefault: boolean
}

export function useUserLocation() {
    const [location, setLocation] = useState<LocationState>({
        latitude: DEFAULT_LOCATION.lat,
        longitude: DEFAULT_LOCATION.lng,
        error: null,
        loading: true,
        usingDefault: true,
    })

    const [retryCount, setRetryCount] = useState(0)

    const retryLocation = () => {
        setLocation(prev => ({ ...prev, loading: true, error: null }))
        setRetryCount(prev => prev + 1)
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation((prev) => ({
                ...prev,
                error: "Geolocation is not supported by your browser",
                loading: false,
                usingDefault: true,
            }))
            return
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
                usingDefault: false,
            })
        }

        const handleError = (error: GeolocationPositionError) => {
            let errorMessage = "Unknown error"
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Using default location."
                    break
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable. Using default location."
                    break
                case error.TIMEOUT:
                    errorMessage = "The request to get user location timed out. Using default location."
                    break
            }
            setLocation((prev) => ({
                ...prev,
                error: errorMessage,
                loading: false,
                usingDefault: true,
            }))
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }

        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, options)

        return () => navigator.geolocation.clearWatch(watcher)
    }, [retryCount])

    return { ...location, retryLocation }
}
