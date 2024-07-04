const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Опції для swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
    },
  },
  apis: [path.join(__dirname, "docs/openapi.yaml")], // Вкажіть шлях до вашого файлу OpenAPI
};

// Ініціалізуємо swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
