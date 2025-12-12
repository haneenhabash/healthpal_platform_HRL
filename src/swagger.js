const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "HealthPal API Documentation",
      version: "1.0.0",
      description: `
Advanced Software Engineering – Course Project
RESTful APIs – Fall 2025

Instructor:
Dr. Amjad AbuHassan

Developed By:
- Raghad Shaar
- Haneen Habash
- Lujain Toma
      `
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication & authorization" },
      { name: "Dashboard", description: "User & Admin dashboard endpoints" },
      { name: "Doctors", description: "Doctors operations" },
      { name: "Patients", description: "Patients operations" },
      { name: "Consultations", description: "Doctor-patient consultations" },
      { name: "Availability", description: "Doctor availability management" },
      { name: "Appointments", description: "Patients appointments" },
      { name: "Messages", description: "Doctor-patient messaging with auto-translation" },
      { name: "PublicAlerts", description: "Public health alerts & emergencies" },
      { name: "Environment", description: "Weather & air-quality APIs" },
      { name: "HealthGuides", description: "Health education content" },
      { name: "Workshops", description: "Health education workshops" },
      { name: "WorkshopRegistrations", description: "Workshop registrations & certificates" },
      { name: "Treatment Cases", description: "Medical donation cases" },
      { name: "Donations", description: "Donation operations" },
      { name: "Donors", description: "Donor profiles" },
      { name: "Requests", description: "Medical requests" },
      { name: "Item Donations", description: "Item donation management" },
      { name: "Transparency & Impact", description: "Invoices & donor transparency" },
      { name: "Mental Assessments", description: "Mental health assessments" },
      { name: "Anonymous Therapy Chat", description: "Anonymous therapy chat" },
      { name: "Payments", description: "Stripe / Payment APIs" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            role: {
              type: "string",
              enum: ["admin", "doctor", "patient", "donor"],
              example: "patient",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: [
    __dirname + "/routes/*.js",
    __dirname + "/app.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(" Swagger Docs available at http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
