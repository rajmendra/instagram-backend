const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "**Instagram Clone API Documentation**",
      version: "1.0.0",
      description: `Explore the Instagram Clone API for streamlined user-related operations in our dynamic social media application. This API enables effortless retrieval of user profiles, viewing liked statuses, and updating user information. Enhance user experiences by integrating these versatile endpoints into your application.

      For details, refer to the API documentation below.
      
      Contact Rajmendra at rajmendra.rawat@gmail.com for any inquiries.`,
    },
    servers: [
      {
        url: "http://localhost:3001",
        url: "https://insta-backend-8xel.onrender.com",

      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
