import { withUniformConfig } from "@uniformdev/next-app-router/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default withUniformConfig(nextConfig);
