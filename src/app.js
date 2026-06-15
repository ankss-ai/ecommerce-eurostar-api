const express = require('express');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const healthRoutes = require('./routes/healthRoutes');
const docsRoutes = require('./routes/docsRoutes');

const app = express();

app.use(express.json());

// 4 endpoints: register, login, checkout, healthcheck.
app.use('/auth', authRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/healthcheck', healthRoutes);

// Swagger UI + raw OpenAPI spec.
app.use('/docs', docsRoutes);

// 404 handler for unknown routes.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Centralized error handler. Services throw HttpError with a status code.
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
});

module.exports = app;
