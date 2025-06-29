// Geocoding service to convert city/country names to coordinates
const GEOCODING_API_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Convert a city and country to coordinates
 * @param {string} city - The city name
 * @param {string} country - The country name
 * @returns {Promise<[number, number]|null>} - Array of [latitude, longitude] or null if not found
 */
export const getCoordinates = async (city, country) => {
  try {
    const query = `${city}, ${country}`;
    const url = `${GEOCODING_API_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const [lat, lon] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      return [lat, lon];
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};

/**
 * Get coordinates for multiple locations with caching
 * @param {Array} locations - Array of objects with city and country properties
 * @returns {Promise<Object>} - Object mapping location strings to coordinates
 */
export const getCoordinatesForLocations = async (locations) => {
  const coordinatesMap = {};
  const promises = [];
  
  locations.forEach(location => {
    const locationString = `${location.city}, ${location.country}`;
    if (!coordinatesMap[locationString]) {
      promises.push(
        getCoordinates(location.city, location.country)
          .then(coords => {
            coordinatesMap[locationString] = coords;
          })
      );
    }
  });
  
  await Promise.all(promises);
  return coordinatesMap;
};

// Fallback coordinates for major cities (in case geocoding fails)
export const FALLBACK_COORDINATES = {
  'Toronto, Canada': [43.6532, -79.3832],
  'New York, United States': [40.7128, -74.0060],
  'Los Angeles, United States': [34.0522, -118.2437],
  'London, United Kingdom': [51.5074, -0.1278],
  'Paris, France': [48.8566, 2.3522],
  'Berlin, Germany': [52.5200, 13.4050],
  'Madrid, Spain': [40.4168, -3.7038],
  'Rome, Italy': [41.9028, 12.4964],
  'Tokyo, Japan': [35.6762, 139.6503],
  'Sydney, Australia': [-33.8688, 151.2093],
  'Mumbai, India': [19.0760, 72.8777],
  'São Paulo, Brazil': [-23.5505, -46.6333],
  'Mexico City, Mexico': [19.4326, -99.1332],
  'Moscow, Russia': [55.7558, 37.6176],
  'Istanbul, Turkey': [41.0082, 28.9784],
  'Cairo, Egypt': [30.0444, 31.2357],
  'Lagos, Nigeria': [6.5244, 3.3792],
  'Johannesburg, South Africa': [-26.2041, 28.0473],
  'Beijing, China': [39.9042, 116.4074],
  'Seoul, South Korea': [37.5665, 126.9780],
  'Vancouver, Canada': [49.2827, -123.1207],
  'Montreal, Canada': [45.5017, -73.5673],
  'Chicago, United States': [41.8781, -87.6298],
  'Houston, United States': [29.7604, -95.3698],
  'Phoenix, United States': [33.4484, -112.0740],
  'Philadelphia, United States': [39.9526, -75.1652],
  'San Antonio, United States': [29.4241, -98.4936],
  'San Diego, United States': [32.7157, -117.1611],
  'Dallas, United States': [32.7767, -96.7970],
  'San Jose, United States': [37.3382, -121.8863],
  'Manchester, United Kingdom': [53.4808, -2.2426],
  'Birmingham, United Kingdom': [52.4862, -1.8904],
  'Leeds, United Kingdom': [53.8008, -1.5491],
  'Liverpool, United Kingdom': [53.4084, -2.9916],
  'Calgary, Canada': [51.0447, -114.0719],
  'Edmonton, Canada': [53.5461, -113.4938],
  'Melbourne, Australia': [-37.8136, 144.9631],
  'Brisbane, Australia': [-27.4698, 153.0251],
  'Perth, Australia': [-31.9505, 115.8605],
  'Adelaide, Australia': [-34.9285, 138.6007],
  'Hamburg, Germany': [53.5511, 9.9937],
  'Munich, Germany': [48.1351, 11.5820],
  'Cologne, Germany': [50.9375, 6.9603],
  'Frankfurt, Germany': [50.1109, 8.6821],
  'Marseille, France': [43.2965, 5.3698],
  'Lyon, France': [45.7578, 4.8320],
  'Toulouse, France': [43.6047, 1.4442],
  'Nice, France': [43.7102, 7.2620],
  'Barcelona, Spain': [41.3851, 2.1734],
  'Valencia, Spain': [39.4699, -0.3763],
  'Seville, Spain': [37.3891, -5.9845],
  'Zaragoza, Spain': [41.6488, -0.8891],
  'Milan, Italy': [45.4642, 9.1900],
  'Naples, Italy': [40.8518, 14.2681],
  'Turin, Italy': [45.0703, 7.6869],
  'Palermo, Italy': [38.1157, 13.3615],
  'Yokohama, Japan': [35.4437, 139.6380],
  'Osaka, Japan': [34.6937, 135.5023],
  'Nagoya, Japan': [35.1815, 136.9066],
  'Sapporo, Japan': [43.0618, 141.3545],
  'Busan, South Korea': [35.1796, 129.0756],
  'Incheon, South Korea': [37.4563, 126.7052],
  'Daegu, South Korea': [35.8714, 128.6014],
  'Daejeon, South Korea': [36.3504, 127.3845],
  'Shanghai, China': [31.2304, 121.4737],
  'Guangzhou, China': [23.1291, 113.2644],
  'Shenzhen, China': [22.3193, 114.1694],
  'Chengdu, China': [30.5728, 104.0668],
  'Delhi, India': [28.7041, 77.1025],
  'Bangalore, India': [12.9716, 77.5946],
  'Hyderabad, India': [17.3850, 78.4867],
  'Chennai, India': [13.0827, 80.2707],
  'Rio de Janeiro, Brazil': [-22.9068, -43.1729],
  'Brasília, Brazil': [-15.7942, -47.8822],
  'Salvador, Brazil': [-12.9714, -38.5011],
  'Fortaleza, Brazil': [-3.7319, -38.5267],
  'Guadalajara, Mexico': [20.6597, -103.3496],
  'Monterrey, Mexico': [25.6866, -100.3161],
  'Puebla, Mexico': [19.0413, -98.2062],
  'Tijuana, Mexico': [32.5149, -117.0382],
  'Saint Petersburg, Russia': [59.9311, 30.3609],
  'Novosibirsk, Russia': [55.0084, 82.9357],
  'Yekaterinburg, Russia': [56.8431, 60.6454],
  'Kazan, Russia': [55.7887, 49.1221],
  'Ankara, Turkey': [39.9334, 32.8597],
  'İzmir, Turkey': [38.4192, 27.1287],
  'Bursa, Turkey': [40.1885, 29.0610],
  'Antalya, Turkey': [36.8969, 30.7133],
  'Alexandria, Egypt': [31.2001, 29.9187],
  'Giza, Egypt': [30.0131, 31.2089],
  'Shubra El Kheima, Egypt': [30.1286, 31.2422],
  'Port Said, Egypt': [31.2667, 32.3000],
  'Kano, Nigeria': [11.9914, 8.5317],
  'Ibadan, Nigeria': [7.3964, 3.8867],
  'Kaduna, Nigeria': [10.5222, 7.4384],
  'Port Harcourt, Nigeria': [4.8156, 7.0498],
  'Cape Town, South Africa': [-33.9249, 18.4241],
  'Durban, South Africa': [-29.8587, 31.0218],
  'Pretoria, South Africa': [-25.7479, 28.2293],
  'Port Elizabeth, South Africa': [-33.7139, 25.5207]
};

/**
 * Get coordinates with fallback to predefined coordinates
 * @param {string} city - The city name
 * @param {string} country - The country name
 * @returns {Promise<[number, number]>} - Array of [latitude, longitude]
 */
export const getCoordinatesWithFallback = async (city, country) => {
  const locationString = `${city}, ${country}`;
  
  // First try to get from fallback coordinates
  if (FALLBACK_COORDINATES[locationString]) {
    return FALLBACK_COORDINATES[locationString];
  }
  
  // If not in fallback, try geocoding
  const coords = await getCoordinates(city, country);
  if (coords) {
    return coords;
  }
  
  // If geocoding fails, return a default location (Toronto)
  console.warn(`Could not find coordinates for ${locationString}, using default`);
  return [43.6532, -79.3832];
}; 