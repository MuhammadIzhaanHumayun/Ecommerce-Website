/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "pvhjh4z8-3000.inc1.devtunnels.ms"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ytz2by7d27.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
