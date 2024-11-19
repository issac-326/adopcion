'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile, updateUserProfileImage, imagenCloudinary } from './actions';
import { useDropzone } from 'react-dropzone';
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const ProfilePage = () => {
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState("/usuario-default.webp");
  const [newImage, setNewImage] = useState<File | null>(null);

  const [initialNombre1, setInitialNombre1] = useState("");
  const [initialNombre2, setInitialNombre2] = useState("");
  const [initialApellido1, setInitialApellido1] = useState("");
  const [initialApellido2, setInitialApellido2] = useState("");
  const [initialTelefono, setInitialTelefono] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        if (profileData) {
          setNombre1(profileData.nombre1 || "");
          setNombre2(profileData.nombre2 || "");
          setApellido1(profileData.apellido1 || "");
          setApellido2(profileData.apellido2 || "");
          setTelefono(profileData.telefono || "");
          setCorreo(profileData.correo || "");
          setImagen(profileData.imagen || "/usuario-default.webp");

          setInitialNombre1(profileData.nombre1 || "");
          setInitialNombre2(profileData.nombre2 || "");
          setInitialApellido1(profileData.apellido1 || "");
          setInitialApellido2(profileData.apellido2 || "");
          setInitialTelefono(profileData.telefono || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Error al obtener los datos del perfil.");
      }
    };

    fetchProfile();
  }, [router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Primero, sube la nueva imagen si está presente
    let imageUrl = imagen; // Mantén la URL de la imagen actual por defecto
    if (newImage) {
      const uploadedImageUrl = await handleImageChange();
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        setLoading(false);
        return;
      }
    }

    // Validación del formulario
    const phoneRegexp = /^\d{8}$/;
    if (!phoneRegexp.test(telefono)) {
      toast.error("El número de teléfono no es válido. Debe tener 8 dígitos.");
      setLoading(false);
      return;
    }

    const nameRegexp = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegexp.test(nombre1) || !nameRegexp.test(apellido1)) {
      toast.error("El primer nombre y apellido no deben contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }

    if (nombre2 && !nameRegexp.test(nombre2)) {
      toast.error("El segundo nombre no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }
    if (apellido2 && !nameRegexp.test(apellido2)) {
      toast.error("El segundo apellido no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }

    try {
      await updateUserProfile({
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        telefono
      });

      // Actualizar la imagen de perfil en la base de datos
      await updateUserProfileImage(imageUrl);

      toast.success("¡Perfil actualizado con éxito!");
      router.push('/menu/perfil');
    } catch (error) {
      console.error("Error actualizando el perfil:", error);
      toast.error("Error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/menu/perfil');
    setNombre1(initialNombre1);
    setNombre2(initialNombre2);
    setApellido1(initialApellido1);
    setApellido2(initialApellido2);
    setTelefono(initialTelefono);
    toast.info("No se actualizó el perfil.");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setNewImage(acceptedFiles[0]);
        setImagen(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 10000000
  });

  // Función para manejar la subida de la imagen a Cloudinary y devolver la URL
  const handleImageChange = async (): Promise<string | null> => {
    if (!newImage) return null;

    const formData = new FormData();
    formData.append('file', newImage);

    const { data, error } = await imagenCloudinary(formData);
    if (error) {
      toast.error("Error al subir la imagen");
      console.error("Error al subir la imagen:", error);
      return null;
    }

    setNewImage(null); // Limpiar la imagen una vez que se sube correctamente
    return data; // Devolver la URL de la imagen subida
  };

  return (
    <>
      <header className='relative w-full'>
        <div className='w-[60%] mx-auto flex justify-between gap-10'>
          <div className="mt-6">
            <p className="text-2xl font-semibold text-gray-900">
              {nombre1 ? `Hola, ${nombre1}` : 'Hola'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Actualiza tu información.
            </p>
          </div>
          <div className="relative group">
            <Image
              src={imagen}
              alt="Imagen de perfil"
              width={120}
              height={120}
              className="h-30 w-30 mt-2 mx-auto rounded-full aspect-square object-cover border-4 border-[#FFA07A]/50"
            />
          </div>
        </div>
        <div className="absolute top-4 left-4 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110" onClick={() => { router.push('/menu/perfil') }}>
          <button className="ml-[20px] lg:ml-[30px]">
            <FontAwesomeIcon icon={faAngleLeft as IconProp} className="text-red-500 text-[24px] lg:text-[32px]" />
          </button>
        </div>
      </header>

      <form className="space-y-4 mx-auto items-center w-[60%] grid grid-cols-1" onSubmit={submitHandler}>
        <div className="grid gap-4 grid-cols-2">
          <InputField id="nombre1" name="nombre1" type="text" placeholder="Primer Nombre" value={nombre1} onChange={(e) => setNombre1(e.target.value)} />
          <InputField id="nombre2" name="nombre2" type="text" placeholder="Segundo Nombre (opcional)" value={nombre2} onChange={(e) => setNombre2(e.target.value)} />
        </div>
        <div className="grid gap-4 grid-cols-2">
          <InputField id="apellido1" name="apellido1" type="text" placeholder="Primer Apellido" value={apellido1} onChange={(e) => setApellido1(e.target.value)} />
          <InputField id="apellido2" name="apellido2" type="text" placeholder="Segundo Apellido (opcional)" value={apellido2} onChange={(e) => setApellido2(e.target.value)} />
        </div>
        <div className="grid gap-4 grid-cols-2">
          <InputField id="correo" name="correo" type="text" placeholder="Correo" value={correo} readOnly />
          <InputField id="telefono" name="telefono" type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div className="flex flex-col items-center w-full mt-4 mb-6">
          <div
            {...getRootProps()}
            className={`mt-4 w-full flex flex-col justify-center items-center rounded-lg border-2 ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-100"} transition-colors duration-300 ease-in-out px-6 py-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50`}
          >
            <input {...getInputProps()} />
            <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" aria-hidden="true" />
            <div className="mt-4 text-sm leading-6 text-gray-600 text-center">
              <p className="font-semibold">
                {isDragActive ? "Suelta la imagen aquí..." : "Arrastra y suelta una imagen o haz clic para seleccionar"}
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 w-full max-w-2xl mx-auto mt-4">
          <Button type="button" variant="secondary" className="bg-gray-300 text-black hover:bg-gray-400" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="default" className="bg-[#FFA07A] hover:bg-[#FF8C69]" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfilePage;
