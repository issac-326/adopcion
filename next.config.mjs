/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Puedes dejarlo en false si no necesitas reactStrictMode por ahora
  images: {
    domains: ['res.cloudinary.com'], // Configuración para tus imágenes
  },
  eslint: {
    ignoreDuringBuilds: true, // Deshabilita ESLint durante la construcción
  },
};

export default nextConfig;

