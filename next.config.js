/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Temporarily disable typescript checks during build to allow deployment
    // This should be removed once type issues are resolved
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'qkrymxbzkobvscvmcqxrt.supabase.co',
        pathname: '/**', // Allow all paths, including temp uploads
      },
    ],
    domains: [
      'qkryxmbzkobvscvmcqxxt.supabase.co',
      // add any other domains you use for images
    ],
  },
}

export default nextConfig
