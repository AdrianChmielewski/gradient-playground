/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // MDX już nie są obsługiwane
};

module.exports = nextConfig;
