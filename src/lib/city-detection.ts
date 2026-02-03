import { SUPPORTED_CITIES } from "./constants"

// This would typically be a reverse geocoding API call
// For now, we'll simulate city detection based on known coordinates
export function detectCityFromCoordinates(lat: number, lng: number): string {
    // Prayagraj coordinates (approximate bounding box)
    const prayagrajBounds = {
        minLat: 25.3,
        maxLat: 25.6,
        minLng: 81.7,
        maxLng: 82.0
    }

    if (lat >= prayagrajBounds.minLat && lat <= prayagrajBounds.maxLat &&
        lng >= prayagrajBounds.minLng && lng <= prayagrajBounds.maxLng) {
        return "Prayagraj"
    }

    // For other coordinates, return a default or detected city name
    // In a real implementation, you'd use a geocoding service like Google Maps API
    return "Unknown"
}

export function isCitySupported(city: string): boolean {
    return SUPPORTED_CITIES.some(
        supportedCity => supportedCity.toLowerCase() === city.toLowerCase().trim()
    )
}