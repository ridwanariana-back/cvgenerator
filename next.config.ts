import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Kita naikkan jadi 5MB agar aman untuk foto
    },
  },
};

export default nextConfig;