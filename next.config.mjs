/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        //2:37:18 / 8:40:33
        domains: [
            "lh3.googleusercontent.com",
            "res.cloudinary.com"

        ]
    }
};

export default nextConfig;
