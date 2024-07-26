/** @type {import('next').NextConfig} */

const repositoryName = "/pi-infra-core";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === "production" ? repositoryName : "",
  basePath: process.env.NODE_ENV === "production" ? repositoryName : "",
};

export default nextConfig;
