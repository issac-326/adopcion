'use client'; 

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile } from './actions';
import InputField from "@/components/ui/InputField"; 
import { Button } from "@/components/ui/button"; 
import { signupValidator } from "@/validations/signup";


const UpdateProfile = () => {
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId'); 

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
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("Error al obtener los datos del perfil.");
        }
      } else {
        toast.error("No se encontró ningún ID de usuario. Inicie sesión.");
        router.push('/Login'); 
      }
    };

    fetchProfile();
  }, [router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId'); 

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

  return (
    <> 
    <div className="flex justify-center items-center">
      <form onSubmit={submitHandler} className="relative flex flex-col items-center rounded-lg max-w-4xl w-full">
        {/* Encabezado */}
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Actualiza tu perfil!</p>
          <p className="text-[12px] text-black">Realiza cambios en tu cuenta</p>
        </div>

        {/* Imagen de perfil y botones */}
        <div className="flex flex-col items-center mb-6">
          <img src="/usuario-default.jpg" alt="Imagen de perfil" className="w-32 h-32 rounded-full mb-4" />
          <div className="flex gap-4">
            <Button variant="default" className="bg-[#FFA07A] hover:bg-[#FF8C69]">Subir nueva</Button>
            <Button variant="destructive">Eliminar</Button>
          </div>
        </div>

        {/* Primer y Segundo Nombre */}
        <div className="flex gap-6 mb-4 w-full">
          <div className="w-1/2">
            <label className="block mb-0 text-black">Primer Nombre</label>
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
            <label className="block mb-0 text-black">Segundo Nombre</label>
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
        <div className="flex gap-6 mb-4 w-full">
          <div className="w-1/2">
            <label className="block mb-0 text-black">Primer Apellido</label>
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
            <label className="block mb-0 text-black">Segundo Apellido</label>
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
        <div className="flex gap-6 mb-4 w-full">
          <div className="w-1/2">
            <label className="block mb-0 text-black">Correo</label>
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
            <label className="block mb-0 text-black">Teléfono</label>
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
        <div className="flex justify-end gap-4 w-full mt-4 pr-20">
          <Button variant="secondary" className="bg-gray-300 text-black hover:bg-gray-400">Cancelar</Button>
          <Button type="submit" variant="default" className="bg-[#FFA07A] hover:bg-[#FF8C69]" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </form>

    </div>
</>

  );
};

export default UpdateProfile;
