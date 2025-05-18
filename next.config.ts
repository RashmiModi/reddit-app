// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     domains: ['6use0lu3p7.ufs.sh'],
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
     
    ],
  },
};

module.exports = nextConfig;
