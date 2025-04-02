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
     ],
   },
 };
 
 export default nextConfig;
 