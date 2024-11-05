'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getMyPets, getUserProfile, updateUserProfile, updateUserProfileImage, imagenCloudinary } from './actions';
import { useDropzone } from 'react-dropzone';
import InputField from "@/components/ui/InputField"; 
import { Button } from "@/components/ui/button"; 
import Image from "next/image";

const ProfilePage = () => {

    const userId = localStorage.getItem('userId');

  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [imagen, setImagen] = useState("/usuario-default.jpg"); // Estado para la imagen de perfil
  const [newImage, setNewImage] = useState<File | null>(null); // Archivo de nueva imagen
  
  // Estados para almacenar los valores originales del perfil
  const [initialNombre1, setInitialNombre1] = useState("");
  const [initialNombre2, setInitialNombre2] = useState("");
  const [initialApellido1, setInitialApellido1] = useState("");
  const [initialApellido2, setInitialApellido2] = useState("");
  const [initialTelefono, setInitialTelefono] = useState("");
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const [myPets, setMyPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {

      if (userId) {
        try {
          const profileData = await getUserProfile(userId);
          if (profileData) {
            setNombre1(profileData.nombre1 || "");
            setNombre2(profileData.nombre2 || "");
            setApellido1(profileData.apellido1 || "");
            setApellido2(profileData.apellido2 || "");
            setTelefono(profileData.telefono || "");
            setCorreo(profileData.correo || "");
            setImagen(profileData.imagen || "/usuario-default.jpg"); // Establece la imagen o usa la predeterminada
            
            // Guardar los valores originales
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
      } else {
        toast.error("No se encontró ningún ID de usuario. Inicie sesión.");
        router.push('/login'); 
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!userId) {
        return;
      }

            setLoadingPets(true);

            try {
                const pets = await getMyPets(userId);
                setMyPets(pets || []);
            } catch (error) {
                console.error("Error fetching pets:", error);
                toast.error("Error al obtener las mascotas.");
            } finally {
                setLoadingPets(false);
            }
        };

        fetchPets();
    }, [userId]);


  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación del teléfono
    const phoneRegexp = /^\d{8}$/;
    if (!phoneRegexp.test(telefono)) {
      toast.error("El número de teléfono no es válido. Debe tener 8 dígitos.");
      setLoading(false);
      return; // No procedemos con la actualización si la validación falla
    }

    // Validación de nombres y apellidos (solo letras, espacios y acentos permitidos)
    const nameRegexp = /^[a-zA-ZÀ-ÿ\s]+$/;

    if (!nameRegexp.test(nombre1)) {
      toast.error("El primer nombre no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }
    if (!nameRegexp.test(nombre2)) {
      toast.error("El segundo nombre no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }
    if (!nameRegexp.test(apellido1)) {
      toast.error("El primer apellido no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }
    if (!nameRegexp.test(apellido2)) {
      toast.error("El segundo apellido no debe contener números ni caracteres especiales.");
      setLoading(false);
      return;
    }

    try {

      if (!userId) {
        throw new Error("No se encontró ningún ID de usuario. Inicie sesión.");
      }

      await updateUserProfile(userId, {
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        telefono
      });
      
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
    // Restaurar los valores originales del perfil
    setNombre1(initialNombre1);
    setNombre2(initialNombre2);
    setApellido1(initialApellido1);
    setApellido2(initialApellido2);
    setTelefono(initialTelefono);
    
    // Mostrar mensaje de que no se actualizó el perfil
    toast.info("No se actualizó el perfil.");
  };

// Configuración de useDropzone con el estado isDragActive
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setNewImage(acceptedFiles[0]);
      setImagen(URL.createObjectURL(acceptedFiles[0])); // Muestra una vista previa de la imagen seleccionada
    }
  },
  accept: { 'image/*': [] },
  multiple: false,
  maxSize: 10000000
});

// Función para subir la nueva imagen a Cloudinary y actualizar la base de datos
const handleImageChange = async () => {
  console.log(newImage)
  if (!newImage || !userId) return;

  const formData = new FormData();
  formData.append('file', newImage);

  const { data: dataClo, error } = await imagenCloudinary(formData);
  if (error) {
    toast.error("Error al subir la imagen");
    console.error("Error al subir la imagen:", error);
    return;
  }

  const imageUrl = dataClo.secure_url;
  try {
    await updateUserProfileImage(userId, imageUrl);
    toast.success("¡Imagen de perfil actualizada con éxito!");
    setNewImage(null);
  } catch (error) {
    console.error("Error actualizando la imagen de perfil:", error);
    toast.error("Error al actualizar la imagen de perfil.");
  }
};

  return (
    <> 
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={submitHandler}
          className="relative flex flex-col items-center rounded-lg max-w-4xl w-full px-6"
        >
          {/* Encabezado */}
          <div className="flex items-center flex-col mb-6 text-center ml-6">
            <p className="text-[24px] font-bold text-black">¡Actualiza tu perfil!</p>
            <p className="text-[12px] text-black">Realiza cambios en tu cuenta</p>
          </div>

        {/* Imagen de perfil y área de arrastrar y soltar */}
        <div className="flex flex-col items-center mb-6">
    <img src={imagen} alt="Imagen de perfil" className="w-48 h-48 rounded-full mb-4" />
    <div
      {...getRootProps()}
      className={`mt-4 flex flex-col justify-center items-center rounded-lg border-2 ${
        isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-100"
      } transition-colors duration-300 ease-in-out px-6 py-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600 text-center font-semibold">
        {isDragActive ? "Suelta la imagen aquí..." : "Arrastra y suelta una imagen o haz clic para seleccionar"}
      </p>
    </div>
    {newImage && (
      <button
        type="button"
        onClick={handleImageChange}
        className="mt-4 bg-[#FFA07A] hover:bg-[#FF8C69] text-white rounded-full px-6 py-2"
      >
        Actualizar Imagen
      </button>
    )}
  </div>

          {/* Primer y Segundo Nombre */}
          <div className="flex gap-10 mb-4 w-full max-w-2xl mx-auto">
            <div className="w-1/2">
             
              <InputField
                id="nombre1"
                name="nombre1"
                type="text"
                placeholder="Primer Nombre"
                value={nombre1}
                onChange={(e) => setNombre1(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              
              <InputField
                id="nombre2"
                name="nombre2"
                type="text"
                placeholder="Segundo Nombre"
                value={nombre2}
                onChange={(e) => setNombre2(e.target.value)}
              />
            </div>
          </div>

          {/* Primer y Segundo Apellido */}
          <div className="flex gap-10 mb-4 w-full max-w-2xl mx-auto">
            <div className="w-1/2">
            
              <InputField
                id="apellido1"
                name="apellido1"
                type="text"
                placeholder="Primer Apellido"
                value={apellido1}
                onChange={(e) => setApellido1(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              
              <InputField
                id="apellido2"
                name="apellido2"
                type="text"
                placeholder="Segundo Apellido"
                value={apellido2}
                onChange={(e) => setApellido2(e.target.value)}
              />
            </div>
          </div>

          {/* Correo y Teléfono */}
          <div className="flex gap-10 mb-4 w-full max-w-2xl mx-auto">
            <div className="w-1/2">
              
              <InputField
                id="correo"
                name="correo"
                type="text"
                placeholder="Correo"
                value={correo}
                readOnly
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="telefono"
                name="telefono"
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 w-full max-w-2xl mx-auto mt-4 pr-20">
            <Button
              type="button"  // Esto evita que el botón cancele dispare el envío del formulario
              variant="secondary"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="default" className="bg-[#FFA07A] hover:bg-[#FF8C69]" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
        </div>
        </>
    );
};

export default ProfilePage;