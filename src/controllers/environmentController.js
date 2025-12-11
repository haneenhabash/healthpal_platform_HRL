// src/controllers/environmentController.js
const {
  getCurrentWeatherByCity,
  getAirQualityByCoordinates,
} = require('../utils/environmentService');

function getHeatHealthLevel(temp) {
  if (temp < 5) {
    return {
      level: 'cold',
      message: 'الطقس بارد، يُنصح بارتداء ملابس دافئة خاصة للأطفال وكبار السن.',
    };
  } else if (temp >= 5 && temp < 25) {
    return {
      level: 'comfortable',
      message: 'الطقس معتدل، الظروف مناسبة لمعظم الأنشطة اليومية.',
    };
  } else if (temp >= 25 && temp < 35) {
    return {
      level: 'warm',
      message: 'الطقس دافئ، يُنصح بشرب الماء بشكل كافٍ وتجنّب الشمس وقت الذروة.',
    };
  } else {
    return {
      level: 'hot',
      message: 'موجة حر، خطر الجفاف وضربة الشمس، يُنصح بالإكثار من شرب السوائل وتجنّب التعرّض المباشر للشمس.',
    };
  }
}

// تحويل AQI إلى رسالة صحية
function getAirQualityHealthInfo(aqi) {
  switch (aqi) {
    case 1:
      return {
        category: 'Good',
        message: 'جودة الهواء جيدة، يمكن للجميع ممارسة الأنشطة بشكل طبيعي.',
      };
    case 2:
      return {
        category: 'Fair',
        message: 'جودة الهواء مقبولة، لا توجد مخاطر كبيرة لمعظم الأشخاص.',
      };
    case 3:
      return {
        category: 'Moderate',
        message: 'جودة الهواء متوسطة، قد يتأثر الأشخاص الحساسون (مرضى الربو والأطفال).',
      };
    case 4:
      return {
        category: 'Poor',
        message: 'جودة الهواء ضعيفة، يُنصح بتقليل الأنشطة الخارجية لمرضى الجهاز التنفسي.',
      };
    case 5:
      return {
        category: 'Very Poor',
        message: 'جودة الهواء سيئة جداً، يُفضّل البقاء في الأماكن المغلقة لمرضى الربو وكبار السن.',
      };
    default:
      return {
        category: 'Unknown',
        message: 'لا تتوفر معلومات كافية عن جودة الهواء.',
      };
  }
}

// GET /api/environment/weather-alert?city=Amman
exports.getWeatherHealthAlert = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required, e.g. ?city=Nablus' });
    }

    const weather = await getCurrentWeatherByCity(city);
    const heatInfo = getHeatHealthLevel(weather.temperature);

    return res.json({
      city: weather.city,
      weather: {
        temperature: weather.temperature,
        feelsLike: weather.feelsLike,
        humidity: weather.humidity,
        description: weather.description,
      },
      healthAlert: heatInfo,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching weather health alert',
      error: error.message,
    });
  }
};

// GET /api/environment/air-quality?city=Nablus
exports.getAirQualityHealthInfo = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required, e.g. ?city=Nablus' });
    }

    const weather = await getCurrentWeatherByCity(city);
    const airQuality = await getAirQualityByCoordinates(weather.lat, weather.lon);
    const healthInfo = getAirQualityHealthInfo(airQuality.aqi);

    return res.json({
      city: weather.city,
      aqi: airQuality.aqi,
      airQualityCategory: healthInfo.category,
      healthMessage: healthInfo.message,
      components: airQuality.components,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching air quality health info',
      error: error.message,
    });
  }
};
