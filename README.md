# ecommerce-eurostar-api

API SDLC - Eurostar conference

## Description

A minimal REST API for an e-commerce demo, built with **JavaScript + Express**.
It lets a consumer register, log in to obtain a **JWT** token, and perform a
**checkout**. All data lives **in memory** — no database is used, so the seed
data resets every time the server restarts.

The code is organized into clear layers under `src/`:

```
src/
├── routes/        # HTTP route definitions
├── middleware/    # JWT authentication
├── controllers/   # Request/response handling
├── services/      # Business logic (auth, checkout rules)
├── models/        # In-memory users and products
├── app.js         # Express app wiring
├── config.js      # Port and JWT settings
└── server.js      # Entry point
```

## Installation

Requires Node.js 18+.

```bash
git clone <repository-url>
cd ecommerce-eurostar-api
npm install
```

## How to Run

```bash
npm start
```

The API starts on `http://localhost:3000` (override with the `PORT` env var).
For auto-reload during development:

```bash
npm run dev
```

## Rules

1. The checkout accepts only **cash** (`cash`) or **credit card** (`credit_card`).
2. **Cash** payments receive a **10% discount**.
3. Only **authenticated** users (valid JWT) can perform a checkout.

## Existent Data

The API seeds **3 users** and **3 products** in memory at startup.

### Users (use these to log in)

| ID | Name          | Email               | Password   |
|----|---------------|---------------------|------------|
| 1  | Alice Johnson | alice@example.com   | `alice123` |
| 2  | Bob Smith     | bob@example.com     | `bob123`   |
| 3  | Carol White   | carol@example.com   | `carol123` |

### Products

| ID | Name                | Price  |
|----|---------------------|--------|
| 1  | Wireless Mouse      | 25.00  |
| 2  | Mechanical Keyboard | 80.00  |
| 3  | USB-C Hub           | 45.00  |

## How to Use the REST API

The API exposes **4 endpoints**.

### 1. Healthcheck

```bash
curl http://localhost:3000/healthcheck
```

Response:

```json
{ "status": "ok", "uptime": 12.34, "timestamp": "2026-06-15T10:00:00.000Z" }
```

### 2. Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dave Green","email":"dave@example.com","password":"dave123"}'
```

Response (`201`):

```json
{ "message": "User registered", "user": { "id": 4, "name": "Dave Green", "email": "dave@example.com" } }
```

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"alice123"}'
```

Response:

```json
{ "token": "<JWT>", "tokenType": "Bearer", "expiresIn": "1h" }
```

Copy the `token` value for the checkout request.

### 4. Checkout (requires authentication)

Pass the token in the `Authorization` header as `Bearer <token>`.

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "paymentMethod": "cash",
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }'
```

Response (`201`) — note the 10% cash discount applied:

```json
{
  "message": "Checkout successful",
  "customer": { "id": 1, "name": "Alice Johnson", "email": "alice@example.com" },
  "order": {
    "paymentMethod": "cash",
    "items": [
      { "productId": 1, "name": "Wireless Mouse", "unitPrice": 25, "quantity": 2, "lineTotal": 50 },
      { "productId": 3, "name": "USB-C Hub", "unitPrice": 45, "quantity": 1, "lineTotal": 45 }
    ],
    "subtotal": 95,
    "discount": 9.5,
    "total": 85.5
  }
}
```

Using `"paymentMethod": "credit_card"` applies no discount (`discount: 0`).

### API Documentation (Swagger)

The OpenAPI 3.0 spec lives in [`swagger.json`](./swagger.json) at the project
root. Interactive Swagger UI is served by the running API at:

```
http://localhost:3000/docs
```

The raw spec is also available at `http://localhost:3000/docs/swagger.json`.

### Endpoint Summary

| Method | Path                  | Auth | Purpose                  |
|--------|-----------------------|------|--------------------------|
| GET    | `/healthcheck`        | No   | Service health           |
| POST   | `/auth/register`      | No   | Create a user            |
| POST   | `/auth/login`         | No   | Obtain a JWT token       |
| POST   | `/checkout`           | Yes  | Perform a checkout       |
| GET    | `/docs`               | No   | Swagger UI documentation |
