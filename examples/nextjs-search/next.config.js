const { withUniformConfig } = require("@uniformdev/canvas-next-rsc/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
    // rewrites: async () => {
    //     return [
    //         {
    //             source: '/:path*',
    //             destination: 'http://localhost:8866/:path*' 
    //         },
    //     ];
    // },
};

module.exports = withUniformConfig(nextConfig);
