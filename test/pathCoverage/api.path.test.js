const request = require('supertest');
const { expect } = require('chai');

// Rule 3.6: Supertest runs against the HTTP base URL of a running server,
// not by requiring and pointing to the Express app instance.
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const api = () => request(baseUrl);

// Valid test data sourced from README.md.
const validUser = { email: 'alice@example.com', password: 'alice123' };

describe('Path Coverage - ecommerce-eurostar-api', () => {
  // Path 1 of 4: GET /healthcheck
  describe('GET /healthcheck', () => {
    it('returns service health', async () => {
      const res = await api().get('/healthcheck');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('uptime');
      expect(res.body).to.have.property('timestamp');
    });
  });

  // Path 2 of 4: POST /auth/register
  describe('POST /auth/register', () => {
    it('registers a new user', async () => {
      const newUser = {
        name: 'Dave Green',
        email: `dave_${Date.now()}@example.com`,
        password: 'dave123',
      };

      const res = await api()
        .post('/auth/register')
        .send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered');
      expect(res.body.user).to.include({ name: newUser.name, email: newUser.email });
    });
  });

  // Path 3 of 4: POST /auth/login
  describe('POST /auth/login', () => {
    it('logs in and returns a JWT token', async () => {
      const res = await api()
        .post('/auth/login')
        .send(validUser);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body).to.have.property('tokenType', 'Bearer');
      expect(res.body).to.have.property('expiresIn', '1h');
    });
  });

  // Path 4 of 4: POST /checkout (requires authentication)
  describe('POST /checkout', () => {
    it('performs a checkout with a valid token', async () => {
      const login = await api()
        .post('/auth/login')
        .send(validUser);

      const token = login.body.token;

      const res = await api()
        .post('/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentMethod: 'cash',
          items: [
            { productId: 1, quantity: 2 },
            { productId: 3, quantity: 1 },
          ],
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Checkout successful');
      expect(res.body.order).to.include({ subtotal: 95, discount: 9.5, total: 85.5 });
    });
  });
});
