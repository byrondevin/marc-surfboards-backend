/** @type {import('next').NextConfig} */


const nextConfig = {



  target: 'serverless',

  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['www.freeiconspng.com', 'is3-ssl.mzstatic.com', 'is5-ssl.mzstatic.com', 'is2-ssl.mzstatic.com', 'is1-ssl.mzstatic.com', 'is4-ssl.mzstatic.com', 'is6-ssl.mzstatic.com'],
  }



}

module.exports = nextConfig
