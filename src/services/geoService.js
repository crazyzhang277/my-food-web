/**
 * Reverse-geocode latitude and longitude to province, city, district and detailed address.
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
    
    const province = addressObj.state || addressObj.province || '';
    const city = addressObj.city || addressObj.town || addressObj.municipality || addressObj.county || '未知城市';
    const district = addressObj.district || addressObj.suburb || addressObj.county || addressObj.neighbourhood || '';
    const road = addressObj.road || addressObj.street || '';

    const formattedCity = province && !city.includes(province) ? `${province} · ${city}` : city;
    const fullAddress = `${province}${city}${district} ${road}`.trim();

    return {
      province,
      city: formattedCity,
      district,
      address: fullAddress,
      raw: data
    };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return { province: '', city: '未知城市', district: '', address: '', raw: null };
  }
}

/**
 * Capture browser GPS coordinates and auto-fetch location details.
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
          province: geoResult.province,
          city: geoResult.city,
          district: geoResult.district,
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
