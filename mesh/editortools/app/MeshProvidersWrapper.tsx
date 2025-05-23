'use client';

import { MeshApp } from "@uniformdev/mesh-sdk-react";

/**
 * This wrapper is needed to mark mesh providers as client components and avoid rendering them at the server.
 */
export const MeshProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  return <MeshApp>{children}</MeshApp>;
};

