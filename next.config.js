/** @type {import('next').NextConfig} */

const path = require('path')

const moduleExports = {
  reactStrictMode: true,
  experimental: { images: { unoptimized: true } },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/redbank',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/create',
        destination: '/farm/',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/create/setup',
        destination: '/farm/',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/account/:id/edit',
        destination: '/farm/',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/account/:id/unlock',
        destination: '/farm',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/account/:id/close',
        destination: '/farm',
        permanent: true,
      },
      {
        source: '/farm/vault/:address/account/:id/repay',
        destination: '/farm',
        permanent: true,
      },
    ]
  },
}

module.exports = moduleExports
