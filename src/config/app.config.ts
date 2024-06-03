export default () => ({
  port: process.env.APP_PORT || 4000,
  host: process.env.APP_HOST || '127.0.0.1',
  environment: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
});
