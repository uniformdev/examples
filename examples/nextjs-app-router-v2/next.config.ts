import { withUniformConfig } from "@uniformdev/canvas-next-rsc-v2/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default withUniformConfig(nextConfig);
