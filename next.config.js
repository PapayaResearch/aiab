/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = "";
let basePath = "/";

if (isGithubActions) {
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

    if (!repo.includes(".github.io")) {
        assetPrefix = `/${repo}/`
        basePath = `/${repo}`
    }
}

const nextConfig = {
    reactStrictMode: true,
    trailingSlash: false,
    assetPrefix: isProd ? assetPrefix : undefined,
    basePath: isProd ? basePath : undefined,
    swcMinify: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.md$/,
            use: "raw-loader"
        });
        config.module.rules.push({
            test: /\.ya?ml$/,
            use: "js-yaml-loader"
        });
        config.module.rules.push({
            test: /\.tex$/,
            use: "raw-loader"
        });
        return config;
    }
}

module.exports = nextConfig
