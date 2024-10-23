import { withUniformConfig } from '@uniformdev/canvas-next-rsc/config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        ppr: true,
    }
};

export default withUniformConfig(nextConfig);