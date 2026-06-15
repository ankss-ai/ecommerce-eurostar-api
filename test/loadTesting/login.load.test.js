import http from 'k6/http';
import { check } from 'k6';

// Login load test for POST /auth/login.
// Base URL comes from swagger.json servers entry; override with BASE_URL.
const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';

// Valid credentials from README.md.
const credentials = {
  email: 'alice@example.com',
  password: 'alice123',
};

export const options = {
  // Stages: ramp to 10 VUs over 5s, up to 30 VUs over the next 20s,
  // then down to 0 over the final 5s (30s total).
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 },
  ],
  // p95 response time must stay under 500ms.
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify(credentials),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns a token': (r) => !!r.json('token'),
  });
}
