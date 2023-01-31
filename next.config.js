/** @type {import("next").NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const path = process.env.NEXT_PUBLIC_DEPLOY_PATH;

const nextConfig = {
    reactStrictMode: true,
    trailingSlash: false,
    assetPrefix: isProd ? path : undefined,
    basePath: isProd ? path : undefined,
    swcMinify: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(tex|bib|md)$/,
            use: "raw-loader"
        });
        config.module.rules.push({
            test: /\.ya?ml$/,
            use: "js-yaml-loader"
        });
        return config;
    },
    async rewrites() {
        return [
            {
                source: "/soundcloud-oembed",
                destination: "https://soundcloud.com/oembed"
            },
        ]
    }
}

module.exports = nextConfig
