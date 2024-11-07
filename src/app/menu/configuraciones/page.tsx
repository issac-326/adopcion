// Configuracion.js
'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { changePassword, comparePasswords, getUserProfile } from './action';
import Image from "next/image";
import { faPaw, faKey, faExclamationCircle, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Configuracion = () => {
    localStorage.setItem('selectedIndex', '5');
    const [descripcion, setDescripcion] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [reportSuccess, setReportSuccess] = useState('');
    const [user, setUser] = useState(null); // Estado para el perfil del usuario
    const supabase = createClient();
    const [loadingUser, setLoadingUser] = useState(true);
    const userId = localStorage.getItem('userId');
    const router = useRouter();
    const [errorOldPassword, setErrorOldPassword] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoadingUser(true);
            const userId = localStorage.getItem('userId'); // Obtén el userId del localStorage
            if (!userId) {
                console.error("No se encontró el ID de usuario en localStorage.");
                return;
            }
            try {
                const usuario = await getUserProfile(userId);
                setUser(usuario);
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserProfile(); // Llama a la función para obtener el perfil al cargar el componente
    }, []);

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorOldPassword('');
        setError('');
    
        const isPasswordEqual = await comparePasswords(currentPassword, userId);
    
        // Validación de la contraseña actual
        if (!isPasswordEqual) {
            setErrorOldPassword('La contraseña actual es incorrecta.');
        }
    
        // Validación de la nueva contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('La contraseña nueva debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial.');
        }
    
        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
        }
    
        // Si hay algún error, detener el proceso
         if (isPasswordEqual && passwordRegex.test(newPassword) && newPassword.length >= 6) {
             try {
                // Si todas las validaciones son correctas, cambiar la contraseña
                await changePassword(newPassword, userId);
                toast.success('Contraseña cambiada con éxito.');
                setIsPasswordModalOpen(false);
            } catch (error) {
                setError('Error al cambiar la contraseña.');
            }
    
            // Limpiar el estado
            setError('');
            setCurrentPassword('');
            setNewPassword('');
         }
     };
    

    const handleReportSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setReportSuccess('');

        const id_usuario = localStorage.getItem('userId');
        if (!id_usuario) {
            setError('Debes iniciar sesión para enviar un reporte.');
            return;
        }

        if (!descripcion) {
            setError('La descripción es requerida.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('reportes_soporte')
                .insert([{
                    descripcion,
                    fecha: new Date().toISOString(),
                    id_usuario
                }]);

            if (error) throw new Error(error.message);

            toast.success('Reporte enviado con éxito.');
            setIsReportModalOpen(false);
            setReportSuccess('Reporte enviado con éxito.');
            setDescripcion('');
        } catch (err) {
            setError(err.message);
        }
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
        setReportSuccess(''); // Reiniciar el mensaje de éxito al abrir el modal
    };

    return (
        <>
            <div className="w-full mb-10 text-center rounded-xl p-5">
                <FontAwesomeIcon icon={faPaw} className="text-[#ffa07a] text-5xl mx-auto" />
                <h2 className="text-4xl font-bold mt-2">Configuración</h2>
            </div>

            <div className='shadow-lg'>
                {loadingUser ? (<div className="flex items-center py-2 px-6 my-2">
                    <div className="rounded-full w-20 h-20 overflow-hidden bg-gray-300 animate-pulse"></div>

                    <div className="ml-6">
                        <div className="h-6 w-48 bg-gray-300 animate-pulse mb-2"></div>
                        <div className="h-4 w-32 bg-gray-300 animate-pulse"></div>
                    </div>
                </div>
                ) : (<div className="flex items-center px-6 py-2 my-2 relative">
                    <div className="rounded-full w-20 h-20 overflow-hidden">
                        <Image
                            src={user?.imagen}
                            alt="profile"
                            width={200}
                            height={200}
                            className="object-cover"
                        />
                    </div>


                    <div className="ml-6">
                        <h1 className="text-xl font-semibold text-gray-1000">
                            {user?.nombre1} {user?.apellido1}
                        </h1>
                    </div>
                    <div
                        className="flex items-center gap-2 rounded-full absolute bottom-1 right-1 hover:cursor-pointer bg-white text-xs py-1 px-2 w-8 h-8 hover:w-20 transition-all duration-300 ease-in-out overflow-hidden"
                        onClick={() => router.push('/menu/configuraciones/perfil')}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-base" />
                        <span className="text-black transition-opacity duration-300 ease-in-out whitespace-nowrap">
                            editar
                        </span>
                    </div>
                </div>
                )}
            </div>


            <div className="flex justify-center mt-2">
                <div className="bg-white rounded-lg w-full p-6 space-y-4">
                    <button onClick={() => {setIsPasswordModalOpen(true);setError(''); setErrorOldPassword('')}} className="w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3 pl-4 flex items-center">
                        <FontAwesomeIcon icon={faKey} className="mr-3" />
                        Cambiar contraseña
                    </button>

                    <button
                        onClick={openReportModal}
                        className="flex items-center w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3 pl-4"
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
                        <span>Reportar problema</span>
                    </button>
                </div>
            </div>

            {isPasswordModalOpen && (
                <Modal closeModal={() => setIsPasswordModalOpen(false)} title="Cambiar Contraseña">
                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <div className='flex flex-col'>
                            <label className="text-sm font-medium text-gray-700">Ingrese su contraseña actual:</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                            {errorOldPassword && <p className="text-red-600 text-sm">{errorOldPassword}</p>}

                        </div>
                        <div className='flex flex-col'>
                            <label className="text-sm font-medium text-gray-700">Nueva Contraseña:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-2 rounded-lg border"
                            />
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                        </div>

                        <button type="button" onClick={handleChangePassword} className="bg-[#ffa07a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff9060]">
                            Cambiar
                        </button>
                    </form>
                </Modal>
            )}

            {isReportModalOpen && (
                <div
                    className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isReportModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <div
                        className={`relative bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg mx-4 transform transition-transform duration-300 ${isReportModalOpen ? 'translate-y-0' : '-translate-y-10'
                            }`}
                    >
                        <button
                            onClick={() => setIsReportModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">¿Necesitas ayuda?</h2>
                        <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
                            <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                                Descripción del problema:
                            </label>
                            <textarea
                                className="p-2 rounded-lg border border-gray-300 focus:outline-none"
                                name="descripcion"
                                rows={4}
                                placeholder="Describe tu problema"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></textarea>
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            {reportSuccess && <p className="text-green-600 text-sm">{reportSuccess}</p>}
                            <button
                                type="submit"
                                className="bg-[#ffa07a] text-white py-2 px-4 font-semibold rounded-lg cursor-pointer hover:bg-[#ff9060]"
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>

            )}
        </>
    );
};

// Componente Modal separado para reutilizar
const Modal = ({ closeModal, title, children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg mx-4">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    </div>
);

export default Configuracion;
