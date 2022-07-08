/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  },
};

module.exports = nextConfig;
