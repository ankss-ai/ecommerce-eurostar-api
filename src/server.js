const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`ecommerce-eurostar-api listening on http://localhost:${config.port}`);
});
