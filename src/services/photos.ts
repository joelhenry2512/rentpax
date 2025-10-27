/**
 * Google Street View Static API Integration
 * Shows actual street-level photos of properties
 */

// Add this to src/services/photos.ts (new file)

export function getGoogleStreetViewUrl(address: string): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key not found');
    return '';
  }

  // Google Street View Static API
  // Pricing: $7 per 1,000 requests (Free $200 credit = ~28,000 free images/month)
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encodedAddress}&key=${apiKey}&return_error_codes=true`;
}

/**
 * Zillow-style property image (if you can get Zillow API access)
 * Note: Zillow doesn't have a public API anymore
 */

/**
 * Alternative: Use geocoding + satellite view
 */
export async function getSatelliteViewUrl(address: string): Promise<string | null> {
  try {
    // First, geocode the address to get coordinates
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'RentPax/1.0' }
    });

    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];

      // Option 1: Mapbox satellite (FREE tier: 50k requests/month)
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (mapboxToken) {
        return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lon},${lat},17,0/800x600@2x?access_token=${mapboxToken}`;
      }
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }

  return null;
}
