// src/swagger.js أو swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HealthPal API Documentation",
      version: "1.0.0",
      description: "API documentation for HealthPal clinical management system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [__dirname + "/routes/*.js", __dirname + "/app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
