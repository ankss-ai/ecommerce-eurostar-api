const { spawn } = require('child_process');
const http = require('http');

// Rule 3.6: tests hit a real HTTP server. This root hook boots the app as a
// separate process and waits until it answers before any test runs.
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
let serverProcess;

function waitForServer(url, retries = 50, intervalMs = 100) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const req = http.get(`${url}/healthcheck`, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (remaining <= 0) {
          reject(new Error(`Server at ${url} did not start in time`));
          return;
        }
        setTimeout(() => attempt(remaining - 1), intervalMs);
      });
    };
    attempt(retries);
  });
}

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(20000);
    serverProcess = spawn('node', ['src/server.js'], {
      stdio: 'inherit',
      env: process.env,
    });
    await waitForServer(baseUrl);
  },

  afterAll() {
    if (serverProcess) {
      serverProcess.kill();
    }
  },
};
