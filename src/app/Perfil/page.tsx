'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile } from './actions';

const UpdateProfile = () => {
  const [nombre1, setNombre1] = useState("");
  const [nombre2, setNombre2] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde LocalStorage

      if (userId) {
        try {
          const profileData = await getUserProfile(userId); // Usar el ID para obtener el perfil
          if (profileData) {
            setNombre1(profileData.nombre1 || "");
            setNombre2(profileData.nombre2 || "");
            setApellido1(profileData.apellido1 || "");
            setApellido2(profileData.apellido2 || "");
            setTelefono(profileData.telefono || "");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("Error fetching profile data.");
        }
      } else {
        toast.error("No se encontró ningún ID de usuario. Inicie sesión.");
        router.push('/Login'); // Redirigir al login si no hay ID
      }
    };

    fetchProfile();
  }, [router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId'); // Obtener el userId desde localStorage

      if (!userId) {
        throw new Error("No se encontró ningún ID de usuario. Inicie sesión.");
      }

      // Enviar los datos actualizados al servidor junto con el userId
      await updateUserProfile(userId, {
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        telefono
      });
      
      toast.success("Profile updated successfully!");
      router.push('/Perfil'); // Redirigir a la página de perfil o donde prefieras
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px" }} className="mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white">
      <form onSubmit={submitHandler}>
        <h2 className="mb-5 text-2xl font-semibold">Update Profile</h2>

        <div className="mb-4">
          <label className="block mb-1"> First Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="First Name"
            value={nombre1}
            onChange={(e) => setNombre1(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1"> Middle Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Middle Name"
            value={nombre2}
            onChange={(e) => setNombre2(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1"> Last Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Last Name"
            value={apellido1}
            onChange={(e) => setApellido1(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1"> Second Last Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Second Last Name"
            value={apellido2}
            onChange={(e) => setApellido2(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1"> Phone Number </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Phone Number"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
