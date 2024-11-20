import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/summary-dashboard',
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    
    // Exclude PDF.js worker from being processed by webpack
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]'
      }
    });
    
    return config;
  },
};

export default nextConfig;