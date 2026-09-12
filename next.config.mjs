/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 100],
  },
  allowedDevOrigins: ['172.20.10.5' , '192.168.1.10' , '127.0.0.1'],
}

export default nextConfig
