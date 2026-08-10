import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // jsdom's transitive deps (html-encoding-sniffer -> @exodus/bytes) hit an
  // ESM/CJS interop error when Turbopack bundles them into the serverless
  // function trace. Keeping jsdom external avoids the bundling entirely.
  serverExternalPackages: ["jsdom"],
};

export default nextConfig;
