/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/category/fiction", destination: "/prose/fiction", permanent: true },
      { source: "/category/poetry", destination: "/poetry", permanent: true },
      { source: "/category/criticism", destination: "/prose/non-fiction/criticism", permanent: true },
      { source: "/category/research", destination: "/prose/non-fiction/research", permanent: true },
      { source: "/category/articles", destination: "/prose/non-fiction/articles", permanent: true },
    ];
  },
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
