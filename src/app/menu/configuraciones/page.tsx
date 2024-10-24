'use client';

import React, { useState } from 'react';
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createClient } from '@/utils/supabase/client'; // Asegúrate de que la ruta sea correcta

const Configuracion = () => {
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const supabase = createClient(); // Crear el cliente de Supabase

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar la recarga de la página

        const formData = new FormData();
        formData.append('descripcion', descripcion);

        try {
            const { data, error } = await supabase
                .from('reportes_soporte')
                .insert([
                    {
                        descripcion,
                        fecha: new Date().toISOString(),
                        id_usuario: null // Aquí puedes agregar el ID del usuario si lo tienes
                    }
                ]);

            if (error) throw new Error(error.message); // Manejo de errores

            setSuccess('Reporte enviado con éxito.');
            setDescripcion(''); // Limpiar el campo después de enviar
            setError(''); // Limpiar cualquier error
        } catch (err) {
            setError(err.message);
            setSuccess(''); // Limpiar cualquier mensaje de éxito
        }
    };

    return (
        <>
            <div className="flex">
                <div className="w-full">
                    <section className='soporte'>
                        <div className='w-full mb-10 relative text-center rounded-xl p-5 shadow-md'>
                            <FontAwesomeIcon icon={faPaw} className="text-[#ffa07a] text-5xl block mx-auto" />
                            <h1 className="text-4xl font-bold mt-2">Configuración</h1>
                        </div>

                        <div className='w-full  rounded-xl p-10'>
                            <div className='card'>
                                <div className='card-header mb-5'>
                                    <h2 className="text-3xl font-bold text-center">¿Necesitas ayuda?</h2>
                                </div>
                                <div className='card-text'>
                                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                        <label htmlFor="descripcion" className='text-lg font-medium text-gray-800'>
                                            Descripción del problema:
                                        </label>
                                        <textarea
                                            className='p-3 rounded-lg border border-gray-300 foucs:outline-none focus:border-none'
                                            name="descripcion"
                                            rows={4}
                                            placeholder='Describe tu problema'
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)} // Actualizar el estado
                                        ></textarea>

                                        {error && <p className="text-red-600">{error}</p>} {/* Mostrar error */}
                                        {success && <p className="text-green-600">{success}</p>} {/* Mostrar éxito */}

                                        <button
                                            type="submit"
                                            className='bg-[#ffa07a] text-white py-3 px-6 font-semibold rounded-lg cursor-pointer mt-5 w-40 ml-auto hover:bg-[#ff9060] hover:scale-105'
                                        >
                                            Enviar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Configuracion;
