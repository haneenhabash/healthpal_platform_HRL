// src/swagger.js أو swagger.js
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

      { name: "Consultations", description: "Manage doctor-patient consultations (booking, listing, and updates)" },
      { name: "Availability", description: "Doctor availability management APIs" },
      { name: "Appointments", description: "Patients request appointments" },

      { name: "Messages", description: "Doctor-patient messaging with auto-translation" },
      { name: "PublicAlerts", description: " Public health alerts, outbreaks, emergencies, and warnings" },
      { name: "Environment", description: "Endpoints that use external weather and air-quality APIs" },
      { name: "HealthGuides", description: "Health education guides and medical awareness content" },
      { name: "Workshops", description: " Health education workshops and training sessions" },
      { name: "WorkshopRegistrations", description: "Register attendees for workshops and manage attendance & certificates" },

      { name: "Treatment Cases", description: "Medical cases for donation" },
      { name: "Donations", description: "Donation and sponsorship operations" },
      { name: "Donors", description: "Donor profiles and contributions" },
      { name: "Requests", description: " Users can request critical medications or equipments" },
      { name: "Item Donations", description: "Create a new item donation (either crowdsourced or matched to a patient request)" },
      { name: "Transparency & Impact", description: "Invoices, receipts, and donor visibility" },
      { name: "Mental Assessments", description: "Mental health & trauma support" },
      { name: "Anonymous Therapy Chat", description: "Anonymous therapy chat system" },
      { name: "Payments", description: "Stripe / Payment API" },


    ],
  },







  apis: [__dirname + "/routes/*.js", __dirname + "/app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs available at http://localhost:3000/api-docs");
}
function swaggerDocs(app) {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 🔹 OpenAPI JSON (هذا اللي ناقصك)
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📘 Swagger Docs available at http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
