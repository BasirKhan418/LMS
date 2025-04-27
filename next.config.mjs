/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'res.cloudinary.com',
         port: '',
       },
       {
         protocol: 'http',
         hostname: 'res.cloudinary.com',
         port: '',
       },
       {
        protocol: 'https',
        hostname: 'd1vamwx4eg4oha.cloudfront.net',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'd1vamwx4eg4oha.cloudfront.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'infotact-assets.s3.us-east-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'infotact-assets.s3.us-east-1.amazonaws.com',
        port: '',
      },
     ],
   },
 };
 
 export default nextConfig;
 