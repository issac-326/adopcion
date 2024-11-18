'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <>
      {/* Encabezado */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-orange-500">Pet Finder</h1>
          <nav className="flex space-x-4">
            <a href="/Landing" className="hover:text-orange-500">Inicio</a>
          </nav>
        </div>
      </header>

      {/* Sección de Políticas de Privacidad */}
      <section id="políticas" className="py-16 bg-f4f0fd">
        <div className="container mx-auto px-6 text-left max-w-screen-lg"> {/* Cambié text-center por text-left */}
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Política de Privacidad</h1>
          <p className="text-lg text-gray-600 mb-10">
            En Pet Finder, tu privacidad es muy importante para nosotros. Esta política describe cómo recolectamos, usamos y protegemos tus datos personales.
          </p>
          
          <div className="space-y-8">
            {/* Sección 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">1. Información que Recopilamos</h2>
              <p className="text-gray-600 mt-4">
                Recopilamos información personal como tu nombre, dirección de correo electrónico y detalles de contacto cuando te registras en nuestro sitio o interactúas con nosotros.
              </p>
            </div>

            {/* Sección 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">2. Uso de la Información</h2>
              <p className="text-gray-600 mt-4">
                Usamos la información recopilada para mejorar nuestros servicios, enviarte notificaciones importantes y proporcionarte una experiencia personalizada. También podemos usar tus datos para enviarte comunicaciones promocionales si has dado tu consentimiento.
              </p>
            </div>

            {/* Sección 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">3. Protección de Datos</h2>
              <p className="text-gray-600 mt-4">
                Tomamos medidas razonables para proteger tu información personal. Sin embargo, no podemos garantizar la seguridad absoluta de los datos transmitidos a través de Internet.
              </p>
            </div>

            {/* Sección 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">4. Cookies</h2>
              <p className="text-gray-600 mt-4">
                Usamos cookies para mejorar tu experiencia en nuestro sitio web. Las cookies nos permiten recordar tus preferencias y ofrecer contenido relevante.
              </p>
            </div>

            {/* Sección 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">5. Terceros</h2>
              <p className="text-gray-600 mt-4">
                No compartimos tu información personal con terceros, excepto cuando sea necesario para la prestación de nuestros servicios (por ejemplo, proveedores de servicios de pago).
              </p>
            </div>

            {/* Sección 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">6. Cambios en la Política de Privacidad</h2>
              <p className="text-gray-600 mt-4">
                Nos reservamos el derecho de actualizar esta política en cualquier momento. Cualquier cambio será publicado en esta página, y te notificaremos si es necesario.
              </p>
            </div>

            {/* Sección 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">7. Contacto</h2>
              <p className="text-gray-600 mt-4">
                Si tienes preguntas sobre nuestra política de privacidad o cómo tratamos tus datos, no dudes en contactarnos a través de <a href="mailto:petfinder.hn@gmail.com" className="text-orange-500 hover:underline">petfinder.hn@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default PrivacyPolicy;
