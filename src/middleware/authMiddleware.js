const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');

// Verifies a Bearer JWT and attaches the authenticated user to req.user.
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = userModel.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    req.user = { id: user.id, name: user.name, email: user.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
