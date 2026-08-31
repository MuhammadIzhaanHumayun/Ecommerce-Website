/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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
