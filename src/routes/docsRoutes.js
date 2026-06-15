const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

// Load the OpenAPI spec from the project root.
const swaggerDocument = require(path.join(__dirname, '..', '..', 'swagger.json'));

const router = express.Router();

// Serve the raw spec for tooling, and the Swagger UI for humans.
router.get('/swagger.json', (req, res) => res.json(swaggerDocument));
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
