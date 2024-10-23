'use client';

import React, { useState, useEffect } from 'react';
import { faPaw, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from '@/components/Header';
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
            <div className="configuracion-container" style={{ display: 'flex' }}>
                <div className="main-content" style={{ marginLeft: '270px', padding: '20px', width: '100%' }}>
                    <section className='soporte'>
                        <div className='banner' style={{ width: '100%', marginBottom: '40px', position: 'relative', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <FontAwesomeIcon icon={faPaw} style={{ color: "#ffa07a", fontSize: '50px', display: 'block', margin: '0 auto' }} />
                            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '10px' }}>Configuracion</h1>
                        </div>

                        <div className='formulario' style={{ width: '100%', backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div className='card'>
                                <div className='card-header' style={{ marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>¿Necesitas ayuda?</h2>
                                </div>
                                <div className='card-text'>
                                    <form onSubmit={handleSubmit} className='Soporte' style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label htmlFor="descripcion" className='form-label' style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>Descripción del problema:</label>
                                        <textarea
                                            className='form-control'
                                            name="descripcion"
                                            rows={4}
                                            placeholder='Describe tu problema'
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)} // Actualizar el estado
                                        ></textarea>

                                        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar error */}
                                        {success && <p style={{ color: 'green' }}>{success}</p>} {/* Mostrar éxito */}

                                        <button type="submit" className='envioSoporte' style={{ backgroundColor: '#ffa07a', color: 'white', padding: '12px', fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: '600' }}>Enviar</button>
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
