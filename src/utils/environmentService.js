const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_BASE_URL = process.env.WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const AIR_QUALITY_BASE_URL = process.env.AIR_QUALITY_BASE_URL || 'https://api.openweathermap.org/data/2.5/air_pollution';

async function getCurrentWeatherByCity(city) {
  try {
    const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        units: 'metric', 
        appid: WEATHER_API_KEY,
      },
    });

    const data = response.data;

    return {
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    throw new Error('Failed to fetch weather data');
  }
}

async function getAirQualityByCoordinates(lat, lon) {
  try {
    const response = await axios.get(AIR_QUALITY_BASE_URL, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
      },
    });

    const data = response.data;

    if (!data.list || data.list.length === 0) {
      throw new Error('No air quality data available');
    }

    const aqi = data.list[0].main.aqi; 

    return {
      aqi,
      components: data.list[0].components, 
    };
  } catch (error) {
    console.error('Error fetching air quality:', error.message);
    throw new Error('Failed to fetch air quality data');
  }
}

module.exports = {
  getCurrentWeatherByCity,
  getAirQualityByCoordinates,
};
