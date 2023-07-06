/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    dbConfig: {
      host: process.env.HOST,
      port: process.env.PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE
    },
    secret: '3eacebde-d1e6-4c01-acec-4236cbb4c28a-3808f125-6382-4d12-9db7-709e66a0aead'
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'http://localhost:3000/api'
  }
};

module.exports = nextConfig;
