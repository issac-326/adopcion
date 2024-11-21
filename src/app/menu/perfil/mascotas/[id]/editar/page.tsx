'use client'

import React, { useEffect, useState } from 'react';
import { getDepartamentos } from "@/app/menu/inicio/actions";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { editPublicacionValidator } from '@/validations/editPublicacion';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { type DropzoneState, useDropzone } from 'react-dropzone';
import { imagenCloudinary } from '@/app/menu/publicar/actions';
import InputFieldSmall from '@/components/ui/InputFieldSmall';
import Departamentos from '@/types/Departamentos';
import InputFieldFull from '@/components/ui/InputFieldFull';
import { Textarea } from "@/components/ui/textarea"
import { getPet, updatePet,getUserProfile } from './actions';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import { startTransition } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconProp } from '@fortawesome/fontawesome-svg-core';


interface PetFormData {
    nombre: string;
    sexo: string;
    imagen: string;
    tipoAnimal: string;
    descripcion: string;
    anos: string;
    meses: string;
    departamento: string;
    peso: string;
}

interface Params {
    id: string;
}

export default function AnimalFormEdit({ params }: { params: Params }) {
    const { id } = params;
    const [pet, setPet] = useState(null);
    const [formData, setFormData] = useState<PetFormData>();
    const [name, setName] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedTipoAnimal, setSelectedTipoAnimal] = useState("");
    const [selectedSexo, setSelectedSexo] = useState("");
    const [selectedDepartamento, setSelectedDepartamento] = useState("");
    const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(''); // Estado para manejar la imagen
    const userId =  getUserProfile();

    const router = useRouter();


    const onDrop = async (acceptedFiles: File[]) => {
        // Verifica que se haya seleccionado al menos un archivo
        console.log('Archivo seleccionado: ', acceptedFiles[0])
    }
    const handleRefresh = () => {
        if (typeof window !== 'undefined'){
            window.location.reload()
        }
    }
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        isDragActive,
        acceptedFiles
    }: DropzoneState = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false,
        maxSize: 10000000
    })

    //funcion que trae la informacion de la mascota
    useEffect(() => {
        const fetchPet = async () => {
            try {
                console.log("ID de la mascota:", id);
                const data = await getPet(id); // Obtener la mascota desde la API
                console.log("Mascota obtenida:", data);
                // @ts-expect-error
                setPet(data); // Actualizar el estado de la mascota

                setName(data.nombre); // Actualizar el nombre de la mascota
                setImage(data.imagen); // Actualizar la imagen de la mascota
                // Actualizar formData directamente con los datos obtenidos
                setFormData({
                    nombre: data.nombre || '',  // Asegurarse de que haya un valor
                    sexo: data.sexo ? '1' : '2', // Convertir a string
                    tipoAnimal: data.tipo_animal || '',
                    descripcion: data.descripcion || '',
                    anos: data.anios || '',
                    meses: data.meses || '',
                    departamento: data.id_departamento || '',
                    imagen: data.imagen || '',
                    peso: data.peso || ''
                });

            } catch (error) {
                console.error("Error al obtener la mascota:", error);
            }
        };

        fetchPet();
    }, [id]); // Asegúrate de que el efecto dependa de 'id' o los datos que cambian

    // Función que captura el cambio en los inputs y actualiza el estado
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // @ts-expect-error
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /* Obtiene los departamentos y los carga en el estado departamentos */
    useEffect(() => {
        try {

            const obtenerDepartamentos = async () => {
                const data = await getDepartamentos();
                console.log("Departamentos obtenidos:", data);
                setDepartamentos(data);
            };

            obtenerDepartamentos();

        } catch (error) {
            console.error("Error al obtener los departamentos:", error);
        }
    }, [])

    const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // @ts-expect-error
        setFormData({
            ...formData,
            [name]: value
        });
    };

    interface FormResult {
        isValid: boolean;
        errors: Record<string, string>;
    }

    interface CloudinaryResponse {
        secure_url: string;
    }

    const handleEdit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        if (!userId) {
            throw new Error('El ID de usuario no fue proporcionado');
        }

        // Validación del formulario
        // @ts-expect-error
        const formResult: FormResult = editPublicacionValidator(formData);
        if (!formResult.isValid) {
            setErrors(formResult.errors);
            return; // Salir si la validación falla
        }

        // Si el formulario es válido, comenzar la actualización
        startTransition(async () => {
            if (acceptedFiles.length > 0) {
                // Cambia esta línea para llamar a la función de subir imagen con formDataUpload
                
                const formImagen = new FormData();
                formImagen.append('file', acceptedFiles[0]);
                // @ts-expect-error
                const { data: dataClo, error }: { data: CloudinaryResponse; error: any } = await imagenCloudinary(formImagen);

                console.log("Imagen subida:", dataClo.secure_url);
                if (formData) {
                    formData.imagen = dataClo.secure_url;
                }

                // Crear la publicación con la imagen actualizada
                try {
                    setIsModalOpen(true);
                } catch (err) {
                    console.error("Error al actualizar la mascota:", err);
                }

            } else {
                // Si no hay imagen para subir, continuar con la actualización
                try {
                    setIsModalOpen(true);
                } catch (err) {
                    console.error("Error al actualizar la mascota:", err);
                }
            }
        });
    };

    const handleUpdatePet = async (formData: any) => {
        try {
            const data = await updatePet(formData, id);
            console.log('Mascota actualizada exitosamente:', data);
            toast.success('Los datos de la mascota han sido actualizados exitosamente 🎉');
            router.push('/menu/perfil');
        } catch (error) {
            console.error("Error al actualizar la mascota:", error);
            toast.error('Error al actualizar la mascota');
        }
    }



    const handleSelectSexChange = (value: string) => {
        // @ts-expect-error
        setFormData({
            ...formData,
            sexo: value
        });
    }

    const handleSelectDeptChange = (value: string) => {
        // @ts-expect-error
        setFormData({
            ...formData,
            departamento: value
        });
    }

    const handleSelectTipoAnimalChange = (value: string) => {
        // @ts-expect-error
        setFormData({
            ...formData,
            tipoAnimal: value
        });
    }

    return (
        <>

            {pet && formData && (<>
                <header className='relative w-full'>
                    <div className='w-[60%] mx-auto flex justify-between gap-10'>
                        <p className="text-[24px] font-bold text-black flex justify-center mt-6">¡Editando la Información de {name}!</p>
                        <div className="relative group">
                            {/* Imagen de la mascota */}
                            <Image
                                src={image}
                                alt="Imagen de la mascota"
                                width={120}
                                height={120}
                                className="h-30 w-30 mt-2 mx-auto rounded-full aspect-square object-cover border-4 border-[#FFA07A]/50"
                            />
                        </div>

                    </div>

                    {/* Botón para regresar */}
                    <div className="absolute top-4 left-4 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110" onClick={() => { router.push('/menu/perfil') }}>
                        <button className="ml-[20px] lg:ml-[30px]">
                            <FontAwesomeIcon icon={faAngleLeft as IconProp} className="text-red-500 text-[24px] lg:text-[32px]" />
                        </button>
                    </div>
                </header>

                <form className="space-y-4 mx-auto mt-5 items-center w-[60%] grid grid-cols-1">
                    <div>
                        <InputFieldFull
                            id="nombre"
                            name="nombre"
                            type="text"
                            placeholder="Nombre"
                            value={formData.nombre || ''}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.nombre && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.nombre}</div>}
                    </div>

                    <div className='grid gap-4 grid-cols-2'>
                        <div>
                            <Select value={formData.sexo} onValueChange={handleSelectSexChange}>
                                <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
                                    <SelectValue placeholder="Selecciona el sexo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="2">Macho</SelectItem>
                                        <SelectItem value="1">Hembra</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.select && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.select}</div>}
                        </div>

                        <div>
                            <Select value={formData.tipoAnimal.toString()} onValueChange={handleSelectTipoAnimalChange}>
                                <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
                                    <SelectValue placeholder="Selecciona el tipo de animal" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectItem value="1">Perro</SelectItem>
                                        <SelectItem value="2">Gato</SelectItem>
                                        <SelectItem value="3">Ave</SelectItem>
                                        <SelectItem value="4">Otro</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.tipoAnimal && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.tipoAnimal}</div>}
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <InputFieldSmall
                                id="anos"
                                name="anos"
                                type="text"
                                placeholder="Años"
                                value={formData.anos}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.anos && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.anos}</div>}
                        </div>
                        <div>
                            <InputFieldSmall
                                id="meses"
                                name="meses"
                                type="text"
                                placeholder="Meses"
                                value={formData.meses}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.meses && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.meses}</div>}
                        </div>
                    </div>

                    <div className='grid gap-4 grid-cols-2'>
                        <div>
                            <InputFieldSmall
                                id="peso"
                                name="peso"
                                type="text"
                                placeholder="Peso (kg)"
                                value={formData.peso}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.peso && <p className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.peso}</p>}
                        </div>

                        <div>
                            <Select value={formData.departamento.toString()} onValueChange={handleSelectDeptChange}>
                                <SelectTrigger className="rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
                                    <SelectValue placeholder="Selecciona el departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Departamento</SelectLabel>
                                        {departamentos && departamentos.length > 0 ? (
                                            departamentos.map((departamento, index) => (
                                                <SelectItem key={index} value={departamento.id.toString()} >{departamento.descripcion}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="perro">No hay departamentos disponibles</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.departamento && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.departamento}</div>}
                        </div>
                    </div>
                    <div>
                        <Textarea placeholder="Aqui puedes agregar una informacion adicional, como sus vacunas, condiciones médicas, etc." value={formData.descripcion} onChange={handleChangeTextarea} id="descripcion"
                            name="descripcion" className='h-[100px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2' />
                        {errors.descripcion && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.descripcion}</div>}
                    </div>
                    <div className="relative group">
                        {/* Componente de arrastrar y soltar la imagen */}
                        <div
                            {...getRootProps()}
                            className={`mt-4 flex dark:text-gray-400 text-gray-600 flex-col justify-center items-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10 transition-colors duration-500 hover:border-[#FFA07A] hover:bg-[#f5f5f5] dark:hover:bg-neutral-700 hover:shadow-lg`}
                        >
                            <input name='file' {...getInputProps()} />

                            {/* Mensajes para el estado de arrastrar y soltar */}
                            {acceptedFiles.length > 0 ? (
                                <p>Imagen seleccionada: {acceptedFiles[0].name}</p>
                            ) : (
                                <>
                                    {isDragAccept && <p>Suelta la imagen</p>}
                                    {isDragReject && <p>Solo se permiten imágenes</p>}
                                    {!isDragActive && (
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md font-semibold text-sec focus-within:outline-none focus-within:ring-2 focus-within:ring-sec focus-within:ring-offset-2 hover:text-sec"
                                                >
                                                    <span>Subir un archivo</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                </label>
                                                <p className="pl-1">o arrastra y suelta</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG hasta 10MB</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Vista previa de la imagen seleccionada */}
                            {acceptedFiles.length > 0 && (
                                <div className="flex justify-center relative group">
                                    <img
                                        src={URL.createObjectURL(acceptedFiles[0])}
                                        alt={`Vista previa de la imagen`}
                                        className="h-40 w-40 mt-2 mx-auto rounded-full aspect-square object-cover border-4 border-[#FFA07A]/50"
                                    />
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Renderiza la imagen si imageUrl está definido */}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Imagen cargada"
                            className="mt-4 w-32 h-auto rounded-lg shadow-lg" // Cambia 'w-32' por el tamaño deseado
                        />
                    )}

                    <button onClick={handleEdit} className="hover:scale-105 hover:bg-[#ff9060] mt-16 mx-auto w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
                        Actualizar
                    </button>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmar cambios</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                ¿Estás seguro de que deseas guardar los cambios en los datos de {name}?
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        router.push('/menu/perfil');
                                        handleUpdatePet(formData);
                                    }}
                                    className="w-full text-white bg-[#FFA07A]"
                                >
                                    Guardar cambios
                                </Button>
                                <Button
                                    onClick={() => { setIsModalOpen(false); }}
                                    className="w-full bg-gray-300 text-[#4b4f5c]"
                                >
                                    Cancelar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </form></>)}
        </>
    );
}
