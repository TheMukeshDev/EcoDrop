/**
 * Calculates the distance between two points in kilometers using the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
}

/**
 * Formats a distance in kilometers to a user-friendly string (e.g., "0.5 km" or "1.2 km")
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`
    }
    return `${distanceKm.toFixed(1)} km`
}

/**
 * Checks if two points are within a specified radius
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @param radiusMeters Maximum distance in meters
 * @returns true if points are within radius, false otherwise
 */
export function isWithinRadius(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radiusMeters: number
): boolean {
    const distanceKm = calculateDistance(lat1, lon1, lat2, lon2)
    const distanceMeters = distanceKm * 1000
    return distanceMeters <= radiusMeters
}
