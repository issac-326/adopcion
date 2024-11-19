/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Puedes dejarlo en false si no necesitas reactStrictMode por ahora
  images: {
    domains: ['res.cloudinary.com'], // Configuración para tus imágenes
  }
};

export default nextConfig;

