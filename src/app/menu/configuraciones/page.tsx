// Configuracion.js
'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserProfile } from './action';
import Image from "next/image";
import { faPaw, faKey, faExclamationCircle, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { createClient } from '@/utils/supabase/client';
const Configuracion = () => {
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

    useEffect(() => {
        const fetchUserProfile = async () => {
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
            }
        };

        fetchUserProfile(); // Llama a la función para obtener el perfil al cargar el componente
    }, []);

    const handleChangePassword = (event) => {
        event.preventDefault();
        if (newPassword.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        const storedPassword = localStorage.getItem('userPassword');
        if (storedPassword !== currentPassword.trim()) {
            setError('La contraseña actual es incorrecta.');
            return;
        }

        localStorage.setItem('userPassword', newPassword.trim());
        setPasswordSuccess('Contraseña cambiada con éxito.');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
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

        try {
            const { data, error } = await supabase
                .from('reportes_soporte')
                .insert([{
                    descripcion,
                    fecha: new Date().toISOString(),
                    id_usuario
                }]);

            if (error) throw new Error(error.message);

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
            <div className="w-full mb-10 text-center rounded-xl p-5 shadow-md">
                <FontAwesomeIcon icon={faPaw} className="text-[#ffa07a] text-5xl mx-auto" />
                <h2 className="text-4xl font-bold mt-2">Configuración</h2>
            </div>

            <div className="relative w-200 h-200 flex rounded-t-xl justify-between items-center mt-6 gap-10 moving-gradient">
                <div className="flex items-center">
                    <Image src={user?.imagen || '/default-profile.png'} alt="profile" width={170} height={170} />
                    <div>
                        <h1 className="text-lg font-semibold">
                            {user?.nombre1} {user?.apellido1}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <div className="bg-white shadow-lg rounded-lg w-full p-6 space-y-4">
                    <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3 pl-4 flex items-center">
                        <FontAwesomeIcon icon={faKey} className="mr-3" />
                        Cambiar contraseña
                    </button>

                    <button 
                        onClick={openReportModal}
                        className="flex items-center w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3 pl-4"
                    >
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
                        <span>Reportes</span>
                    </button>
                </div>
            </div>

            {isPasswordModalOpen && (
                <Modal closeModal={() => setIsPasswordModalOpen(false)} title="Cambiar Contraseña">
                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-700">Contraseña Actual:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="p-2 rounded-lg border"
                        />

                        <label className="text-sm font-medium text-gray-700">Nueva Contraseña:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="p-2 rounded-lg border"
                        />

                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}

                        <button type="submit" className="bg-[#ffa07a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff9060]">
                            Cambiar
                        </button>
                    </form>
                </Modal>
            )}

{isReportModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg mx-4">
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
