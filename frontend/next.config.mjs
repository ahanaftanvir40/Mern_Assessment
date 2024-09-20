/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname: 'mernassessment-production.up.railway.app'
            }
        ]
    }
};

export default nextConfig;
