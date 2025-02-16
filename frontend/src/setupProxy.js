
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // All requests starting with /api will be proxied
    createProxyMiddleware({
      target: 'http://localhost:5000', // Your Express server address
      changeOrigin: true, // Required for CORS to work
    })
  );
};