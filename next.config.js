/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Define public environment variables here
    API_URL: process.env.API_URL,
    // Add more variables as needed
  },
  //images: { domains: ['http://localhost:3000'] }
}

module.exports = nextConfig
