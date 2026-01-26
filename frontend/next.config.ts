import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: "",
      },
    ],
  },

  // 2. The new Rewrites configuration
  async rewrites() {
    // It's safer to use an env variable, but you can hardcode the Render URL here if you prefer
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://library-mern-backend-dynh.onrender.com';

    return [
      {
        // When your frontend calls /api/proxy/auth/login...
        source: '/api/proxy/:path*',
        // ...it seamlessly proxies to https://your-api.onrender.com/auth/login
        destination: `${backendUrl}/:path*`, 
      },
    ];
  },
};

export default nextConfig;