/**
 * Reverse-geocode latitude and longitude to city and detailed address using Nominatim API.
 */
export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh`,
      { headers: { 'User-Agent': 'GourmetFoodLogApp/1.0' } }
    );
    if (!response.ok) throw new Error('Failed to fetch address');
    const data = await response.json();
    const addressObj = data.address || {};
    
    // Extract city (handling Municipality vs Normal City)
    const city = addressObj.city || addressObj.town || addressObj.county || addressObj.state || '未知城市';
    const road = addressObj.road || addressObj.suburb || addressObj.neighbourhood || '';
    const fullAddress = `${city} ${road}`.trim();

    return { city, address: fullAddress, raw: data };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return { city: '未知城市', address: '', raw: null };
  }
}

/**
 * Capture browser GPS coordinates and auto-fetch city name.
 */
export function getCurrentLocationWithCity() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('您的浏览器不支持 GPS 地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const geoResult = await reverseGeocode(lat, lng);
        resolve({
          lat,
          lng,
          city: geoResult.city,
          address: geoResult.address
        });
      },
      (error) => {
        let msg = '定位获取失败';
        if (error.code === error.PERMISSION_DENIED) msg = '地理定位权限被拒绝';
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
