const express = require('express');
const router = express.Router();
const environmentController = require('../controllers/environmentController');

/**
 * @swagger
 * tags:
 *   name: Environment
 *   description: Endpoints that use external weather and air-quality APIs
 */

/**
 * @swagger
 * /api/environment/weather-alert:
 *   get:
 *     summary: Get weather + health alert (via external weather API)
 *     description: >
 *       Uses an external weather provider (OpenWeather API) to fetch real-time
 *       temperature and humidity for the given city, then generates a simple health
 *       recommendation based on the temperature.
 *     tags: [Environment]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: City name (e.g., Nablus). If not provided, a default city may be used.
 *     responses:
 *       200:
 *         description: Weather data retrieved from external API and health alert generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "Nablus"
 *                 weather:
 *                   type: object
 *                   description: Raw weather data from external API
 *                   properties:
 *                     temperature:
 *                       type: number
 *                       example: 31.5
 *                     feelsLike:
 *                       type: number
 *                       example: 33.0
 *                     humidity:
 *                       type: number
 *                       example: 40
 *                     description:
 *                       type: string
 *                       example: "clear sky"
 *                 healthAlert:
 *                   type: object
 *                   description: Internal health interpretation based on temperature
 *                   properties:
 *                     level:
 *                       type: string
 *                       example: "hot"
 *                     message:
 *                       type: string
 *                       example: "موجة حر، يُنصح بالإكثار من شرب الماء وتجنّب التعرّض المباشر للشمس."
 *       400:
 *         description: City parameter missing or invalid.
 *       500:
 *         description: Error calling external weather API or generating health alert.
 */
router.get('/weather-alert', environmentController.getWeatherHealthAlert);

/**
 * @swagger
 * /api/environment/air-quality:
 *   get:
 *     summary: Get air quality + health message (via external air-quality API)
 *     description: >
 *       Uses the external OpenWeather Air Pollution API to fetch the Air Quality Index (AQI)
 *       for the given city (via its coordinates), then maps the AQI (1–5) to a health
 *       recommendation in Arabic.
 *     tags: [Environment]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: City name (e.g., Nablus, Hebron). If not provided, a default city may be used.
 *     responses:
 *       200:
 *         description: AQI value fetched from external API and converted to health info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "Nablus"
 *                 aqi:
 *                   type: integer
 *                   description: AQI from external API (1 = Good, 5 = Very Poor)
 *                   example: 3
 *                 airQualityCategory:
 *                   type: string
 *                   example: "Moderate"
 *                 healthMessage:
 *                   type: string
 *                   example: "جودة الهواء متوسطة، قد يتأثر الأشخاص الحساسون (مرضى الربو والأطفال)."
 *       400:
 *         description: City parameter missing or invalid.
 *       500:
 *         description: Error calling external air-quality API.
 */
router.get('/air-quality', environmentController.getAirQualityHealthInfo);

module.exports = router;
