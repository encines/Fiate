import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.156'],
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Aumentado para subida de documentos/fotos
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jmhchdtkvhhefqenukdx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**', // Permitimos todo el storage (public y sign)
      },
    ],
  },
};

export default nextConfig;
