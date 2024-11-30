"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { changePassword, comparePasswords, getUserProfile, enviarReporte } from './action';
import Image from "next/image";
import { faPaw, faKey, faExclamationCircle, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface UserProfile {
    imagen: string;
    nombre1: string;
    apellido1: string;
}

interface PasswordChangeFormProps {
    currentPassword: string;
    setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
    newPassword: string;
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    errorOldPassword: string;
    error: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface ReportFormProps {
    descripcion: string;
    setDescripcion: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    reportSuccess: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface UserProfileInfoProps {
    user: UserProfile | null;
    onEdit: () => void;
}

const Configuracion = () => {
    const [descripcion, setDescripcion] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [errorOldPassword, setErrorOldPassword] = useState('');
    const [reportSuccess, setReportSuccess] = useState('');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoadingUser(true);
            try {
                const usuario = await getUserProfile();
                setUser(usuario);
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setErrorOldPassword('');

        try {
            const isPasswordEqual = await comparePasswords(currentPassword);
            if (!isPasswordEqual) {
                setErrorOldPassword('La contraseña actual es incorrecta.');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
            if (!passwordRegex.test(newPassword)) {
                setError('La contraseña nueva debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial.');
                return;
            }

            if (newPassword.length < 6) {
                setError('La nueva contraseña debe tener al menos 6 caracteres.');
                return;
            }

            await changePassword(newPassword);
            toast.success('Contraseña cambiada con éxito.');
            setIsPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            setError('Error al cambiar la contraseña.');
        }
    };

    const handleReportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setReportSuccess('');

        if (!descripcion) {
            setError('La descripción es requerida.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("descripcion", descripcion);
            await enviarReporte(formData);
            toast.success('Reporte enviado con éxito.');
            setIsReportModalOpen(false);
            setReportSuccess('Reporte enviado con éxito.');
            setDescripcion('');
        } catch (error) {
            console.error('Error al enviar el reporte:', error);
            setError('Error al enviar el reporte.');
        }
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
        setReportSuccess('');
    };

    return (
        <div className='mx-4 my-6'>
            <div className="w-full text-center rounded-xl">
                <FontAwesomeIcon icon={faPaw as IconProp} className="text-[#ffa07a] text-5xl mx-auto" />
                <h2 className="text-4xl font-bold mt-2">Configuración</h2>
            </div>

            <div className="shadow-lg">
                {loadingUser ? (
                    <LoadingProfileSkeleton />
                ) : (
                    <UserProfileInfo user={user} onEdit={() => router.push('/menu/configuraciones/perfil')} />
                )}
            </div>

            <div className="flex justify-center mt-2">
                <div className="bg-white rounded-lg w-full p-6 space-y-4">
                    <button onClick={() => { setIsPasswordModalOpen(true); setError(''); setErrorOldPassword(''); }} className="w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3 flex items-center">
                        <FontAwesomeIcon icon={faKey as IconProp} className="mr-3" />
                        Cambiar contraseña
                    </button>
                    <button onClick={openReportModal} className="flex items-center w-full text-lg font-medium text-gray-800 hover:text-[#ffa07a] py-3">
                        <FontAwesomeIcon icon={faExclamationCircle as IconProp} className="mr-3" />
                        <span>Reportar problema</span>
                    </button>
                </div>
            </div>

            {isPasswordModalOpen && (
                <Modal closeModal={() => setIsPasswordModalOpen(false)} title="Cambiar Contraseña">
                    <PasswordChangeForm
                        currentPassword={currentPassword}
                        setCurrentPassword={setCurrentPassword}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        errorOldPassword={errorOldPassword}
                        error={error}
                        onSubmit={handleChangePassword}
                    />
                </Modal>
            )}

            {isReportModalOpen && (
                <Modal closeModal={() => setIsReportModalOpen(false)} title="Reportar problema">
                    <ReportForm
                        descripcion={descripcion}
                        setDescripcion={setDescripcion}
                        error={error}
                        reportSuccess={reportSuccess}
                        onSubmit={handleReportSubmit}
                    />
                </Modal>
            )}
        </div>
    );
};

const LoadingProfileSkeleton = () => (
    <div className="flex items-center py-2 px-6 my-2">
        <div className="rounded-full w-20 h-20 overflow-hidden bg-gray-300 animate-pulse"></div>
        <div className="ml-6">
            <div className="h-6 w-48 bg-gray-300 animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 animate-pulse"></div>
        </div>
    </div>
);

const UserProfileInfo = ({ user, onEdit }: UserProfileInfoProps) => (
    <div className="flex items-center px-6 py-2 my-2 relative">
        <div className="rounded-full w-20 h-20 overflow-hidden">
            <Image src={user?.imagen || '/user-default.jpg'} alt="profile" width={200} height={200} className="object-cover" />
        </div>
        <div className="ml-6">
            <h1 className="text-xl font-semibold text-gray-1000">{user?.nombre1} {user?.apellido1}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full absolute bottom-1 right-1 hover:cursor-pointer bg-white text-xs py-1 px-2 w-8 h-8 hover:w-20 transition-all duration-300 ease-in-out overflow-hidden" onClick={onEdit}>
            <FontAwesomeIcon icon={faPenToSquare as IconProp} className="text-base" />
            <span className="text-black transition-opacity duration-300 ease-in-out whitespace-nowrap">editar</span>
        </div>
    </div>
);

const PasswordChangeForm = ({ currentPassword, setCurrentPassword, newPassword, setNewPassword, errorOldPassword, error, onSubmit }: PasswordChangeFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Ingrese su contraseña actual:</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="p-2 rounded-lg border" />
            {errorOldPassword && <p className="text-red-600 text-sm">{errorOldPassword}</p>}
        </div>
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Nueva Contraseña:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 rounded-lg border" />
            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        <button type="submit" className="bg-[#ffa07a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff9060]">Cambiar</button>
    </form>
);

const ReportForm = ({ descripcion, setDescripcion, error, reportSuccess, onSubmit }: ReportFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-700">Descripción del problema:</label>
        <textarea className="p-2 rounded-lg border" name="descripcion" rows={4} placeholder="Describe tu problema" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {reportSuccess && <p className="text-green-600 text-sm">{reportSuccess}</p>}
        <button type="submit" className="bg-[#ffa07a] text-white py-2 px-4 font-semibold rounded-lg cursor-pointer hover:bg-[#ff9060]">Enviar</button>
    </form>
);

const Modal = ({ closeModal, title, children }: { closeModal: () => void; title: string; children: React.ReactNode }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg mx-4">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                <FontAwesomeIcon icon={faTimes as IconProp} className="text-2xl" />
            </button>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    </div>
);

export default Configuracion;
