function healthcheck(req, res) {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
}

module.exports = { healthcheck };
