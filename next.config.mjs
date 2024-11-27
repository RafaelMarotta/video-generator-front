/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_URI: process.env.OPENAI_URI,
        GENERATE_VIDEO_URI: process.env.GENERATE_VIDEO_URI,
    }
};

export default nextConfig;
