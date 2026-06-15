// Centralized config. JWT_SECRET can be overridden via env var; a demo default
// is provided so the API runs out of the box with no setup.
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'eurostar-demo-secret-change-me',
  jwtExpiresIn: '1h',
};
