'use client';

import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { CometChat } from "@cometchat-pro/chat";
import { getUserProfile } from "@/app/menu/configuraciones/action";
import { faSmile } from '@fortawesome/free-regular-svg-icons';
import EmojiPicker from "emoji-picker-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload} from 'lucide-react'
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { reportarUsuario, insertarImagenesPorArray} from "../mascota/[id]/actions";
import { toast } from "react-toastify";
import { Tooltip } from "@nextui-org/react";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [userEmisor, setUserEmisor] = useState<any>(null);
  const [userReceptor, setUserReceptor] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [receiverUID, setReceiverUID] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImage, setModalImage] = useState<File | string>('');
  const [isSendImage, setIsSendImage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  //trae el usuario emisor y conversaciones
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserProfile();
        setUserEmisor(user);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedIndex', '2');
    }
  }, []);

  //conexion con cometChat
  useEffect(() => {
    const initializeCometChat = async () => {
      if (typeof window !== "undefined") {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          console.error("No se encontró el authToken en el localStorage.");
          return;
        }

        const { initCometChat } = await import("@/app/menu/mensajeria/actions");

        initCometChat(authToken)
          .then(() => { console.log("CometChat inicializado correctamente."); fetchConversations(); })
          .catch((error: any) => console.error("Error al inicializar CometChat:", error));
      }
    };

    initializeCometChat();
  }, []);

  //Listeners de mensajes
  useEffect(() => {
    const setupMessageListener = async () => {
      if (!receiverUID) return;

      const listenerID = `Listener_${Date.now()}`;
      const { addMessageListener, removeMessageListener } = await import("@/app/menu/mensajeria/actions");

      // Configurar handlers para los mensajes
      const callbackHandlers = {
        onTextMessageReceived: (message: CometChat.TextMessage) => {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        },
        onMediaMessageReceived: (message: CometChat.MediaMessage) => {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        },
      };

      // Añadir listener
      addMessageListener(listenerID, callbackHandlers);
      return () => {
        // Eliminar listener al desmontar el componente
        removeMessageListener(listenerID);
      };
    };

    setupMessageListener();
  }, [receiverUID]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverUID) return;

      const { obtenerUsuarioPorUID } = await import("@/app/menu/mensajeria/actions");
      const { fetchMessages } = await import("@/app/menu/mensajeria/actions");

      setLoadingMessages(true);
      try {
        const user = await obtenerUsuarioPorUID(receiverUID);
        setUserReceptor(user);
        const messages = await fetchMessages(receiverUID);
        setMessages(messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [receiverUID]);

  const handleSendFile = async () => {
    if (!receiverUID || !file) return;

    const { sendFileAction } = await import("@/app/menu/mensajeria/actions");

    sendFileAction(receiverUID, file)
      .then((message) => {
        setMessages((prev) => [...prev, message]);
        setFile(null);
        scrollToBottom();
      })
      .catch((error) => console.error(error.message));
  };

  const handleSendMessage = async () => {
    if (!receiverUID || !newMessage) return;

    const { sendMessageAction } = await import("@/app/menu/mensajeria/actions");

    sendMessageAction(receiverUID, newMessage)
      .then((message) => {
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
        scrollToBottom();
      })
      .catch((error) => console.error(error.message));
  };

  const fetchConversations = async () => {
    const { fetchConversationsAction } = await import("@/app/menu/mensajeria/actions");

    fetchConversationsAction()
      .then((data: any) => { setConversations(data); })
      .catch((error) => console.error(error.message));
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (timestamp: number) => {
    if (typeof window == 'undefined') return '';
    const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleUserReportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setReportSuccess('');
    setIsLoading(true);
  
    if (!descripcion.trim()) {
      setError('La descripción no puede estar vacía.');
      setIsLoading(false);
      return;
    }
  
    if (!userReceptor) {
      setError('No se pudo identificar al propietario de la mascota.');
      setIsLoading(false);
      return;
    }
  
    try {
      if (uploadedImages.length === 0) {
        return
      }
      const cloudinaryUrls = await Promise.all(
        uploadedImages.map((file) => uploadToCloudinary(file))
      )
      const formData = new FormData();
      formData.append('descripcion', descripcion);
  
      const reporte = await reportarUsuario(Number(receiverUID), formData); 
      if(reporte.data.id_reporte_usuario > 0){
        const urls = await insertarImagenesPorArray(cloudinaryUrls, reporte.data.id_reporte_usuario)
      }
      toast.success('Usuario reportado con éxito.');
      setDescripcion('');
      setIsReportModalOpen(false); // Limpia y cierra el modal
    } catch (error) {
      console.error('Error al reportar usuario:', error);
      setError('Error al reportar al usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadToCloudinary(file: File): Promise<string> {
    if (typeof window !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? ""
        );
        formData.append(
          "cloud_name",
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""
        );
  
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          formData
        );
  
        return response.data.secure_url;
      } catch (error) {
        console.error("Error al subir las imagenes a cloudinary:", error);
        throw error;
      }
    } else {
      throw new Error('No se puede subir a Cloudinary en un entorno no browser.');
    }
  }

  //imagenes 
  
  const onDrop = async (acceptedFiles: File[]): Promise<void> => {
    const remainingSlots = 3 - uploadedImages.length
    const filesToUpload = acceptedFiles.slice(0, remainingSlots)

    setUploadedImages((prev) => [...prev, ...filesToUpload])
    const newPreviewUrls = filesToUpload.map((file) => URL.createObjectURL(file))
    setImageUrls((prev) => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index: number): void => {
    URL.revokeObjectURL(imageUrls[index])
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true,
    maxSize: 10000000
  })

  return (
    userEmisor && (
      <div className="flex h-screen max-h-screen w-full bg-gradient-to-br from-[#ebfbfb] via-[#d9f6f6] to-[#c7f1f1] rounded-xl overflow-hidden">
        {/* Panel lateral de conversaciones - Ancho fijo */}
        <div className="w-96 min-w-[358px] max-w-[358px] bg-gradient-to-br from-[#226569] to-[#123a3c] py-4 px-2 flex flex-col rounded-tl-xl rounded-bl-xl text-[#fdd5d5]">
          <h2 className="text-xl font-semibold mb-2 text-white mx-3 pb-1 border-b border-gray-500">Chats</h2>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => {
              const receiverImage = conversation.receptorImagen;
              const receiverName = conversation.receiverNombre;              ;
              const lastMessage = conversation.lastMessage;
              const sentAt = conversation.sentAt;
              // Función para formatear la hora de envío
              const formattedTime = formatTime(sentAt);
              // Asegúrate de que la comparación sea consistente
              const isActive = conversation.receiver === receiverUID;

              return (
                <div
                  key={conversation.conversationId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 
                    ${isActive
                      ? 'bg-[#ffffff26]'
                      : 'hover:bg-[#ffffff1a]'
                    }`}
                  onClick={() => {
                    setActiveConversationId(conversation.conversationId);
                    setReceiverUID(conversation.receiver);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={receiverImage}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{receiverName}</p>
                      <p className="text-xs text-[#aed3df] truncate">
                        {lastMessage}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de mensajes */}
        {messages.length === 0 ?
          (
            <div className="w-full flex-grow flex flex-col items-center justify-center p-6 space-y-4">
              <img src="\img\logos\mensajeria.png" alt="Logo" className="max-w-[70%] object-contain" />
              <p className="text-center text-lg text-gray-700 font-medium max-w-[70%]">
                Comienza a conversar y a conectarte con otras personas para adoptar a tu compañero de vida
              </p>
            </div>) :
          (
            <div className="flex flex-col flex-1 h-screen w-3/5">

              {/* Título */}
              <div className="relative max-h-full flex gap-2 items-center bg-[#40979d] w-full text-white text-center px-4 py-2 shadow-md">
                <img src={userReceptor.avatar} alt="avatar" className="rounded-full w-9" />
                <div className="flex flex-col items-start">
                  <p>{userReceptor.name}</p>
                  <p className="text-xs">{userReceptor.status !== 'offline' ? 'en linea' : userReceptor.lastActiveAt ? `última vez a las ${formatTime(userReceptor.lastActiveAt)}` : ''}</p>
                </div>
                <button
                  className="ml-auto w-8 h-8 sm:w-14 sm:h-14 lg:w-8 lg:h-8 rounded-full bg-white shadow-[0_0px_7px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsReportModalOpen(true);
                    setError('');
                    setReportSuccess('');
                    setDescripcion('');
                  }}
                >
                  <FontAwesomeIcon
                    icon={faExclamationCircle as IconProp}
                    className="text-[28px] sm:text-[32px] lg:text-[40px] text-red-500"
                    style={{ textShadow: '0 0 5px rgba(255, 0, 0, 0.3)' }}
                  />
                </button>

              </div>

              {/* Mensajes */}
              {loadingMessages ? (
                //renderiza skeleton
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {[...Array(4)].map((_, idx) => {
                    const isSender = idx % (2 + 1) === 0;
                    return (
                      <div key={idx} className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start space-x-2 animate-pulse`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 bg-gray-300 rounded-full ${isSender ? 'order-last' : ''}`}></div>

                        {/* Contenedor del mensaje */}
                        <div className={`ml-${isSender ? '0' : '12'} p-3 rounded-lg bg-gray-300 max-w-[60%]`}>
                          {/* Nombre del emisor */}
                          <div className="block mb-1 text-sm bg-gray-400 w-24 h-4 rounded-md"></div>

                          {/* Contenido del mensaje */}
                          <div className="w-36 h-4 bg-gray-400 rounded-md"></div>

                          {/* Hora del mensaje */}
                          <div className="mt-2 w-16 h-3 bg-gray-400 rounded-md text-right"></div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                //renderiza Mensajes
                <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                  {messages.map((msg, idx) => {
                    const isSender = msg.sender.uid == userEmisor.id_usuario;
                    const previousMessage = messages[idx - 1];
                    const showAvatar = !previousMessage || previousMessage.sender.uid !== msg.sender.uid;

                    // Condición para verificar si el mensaje anterior es del mismo usuario
                    const additionalPadding = previousMessage && previousMessage.sender.uid === msg.sender.uid ? 'py-2' : 'py-3';


                    return (
                      <div key={idx} className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
                        {/* Contenedor del mensaje */}
                        {msg.type === 'text' ? (<div
                          className={`relative rounded-lg ml-${showAvatar ? '0' : '12'} text-white max-w-[60%] ${isSender
                            ? 'bg-[#7E634E]'
                            : 'bg-[#C7B69F]'
                            } ${additionalPadding} p-3`}
                        >

                          {/* Nombre del emisor solo si es necesario */}
                          {!isSender && showAvatar && <span className="block mb-1 text-sm font-semibold">{msg.sender.name}</span>}
                          <p>{msg.text}</p>
                          <div className="text-xs text-gray-200 mt-2 text-right">
                            {formatTime(msg.sentAt)}
                          </div>
                        </div>) : (
                          <div className="relative w-[50%] cursor-pointer">
                            {/* Imagen que cubre todo el div */}
                            <img
                              src={msg.data.url}
                              alt="imagen"
                              className="object-cover rounded-lg"
                              onClick={() => { setIsSendImage(false); setOpenImageModal(true); setModalImage(msg.data.url) }}
                            />

                            {/* Hora en la esquina inferior derecha */}
                            <div className="absolute bottom-2 right-2 text-white text-xs bg-[#00000042] px-2 rounded-full">
                              {formatTime(msg.sentAt)}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>


              )}

              {/* Input y botón para enviar mensaje */}
              <div className="pt-2 border-t border-gray-300 px-3 py-2 flex w-full mx-auto justify-center items-center space-x-1">
                <div className="relative w-full">
                  <input
                    className="border border-gray-300 p-2 focus:outline-none focus:border-blue-500 rounded-full w-full pr-12"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                  />

                  {/* Botón para seleccionar archivo dentro del input */}
                  <label className="absolute right-10 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center">
                    <FontAwesomeIcon icon={faPaperclip as IconProp} className="text-lg text-[#FE8A5B]" />
                    <input
                      type="file"
                      id="img_file"
                      name="img_file"
                      accept="image/x-png,image/gif,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                          setIsSendImage(true);
                          setOpenImageModal(true);
                        }
                      }}
                    />
                  </label>

                  {/* Botón para mostrar el selector de emojis */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={faSmile as IconProp} className="text-lg text-[#FE8A5B]" />
                  </button>

                  {/* Selector de emojis */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-5 z-50">
                      <EmojiPicker onEmojiClick={(emoji) => setNewMessage((prev) => prev + emoji.emoji)} />
                    </div>
                  )}
                </div>

                {/* Botón de enviar mensaje */}
                {newMessage && (
                  <button
                    className="h-full aspect-square bg-[#FE8A5B] text-white flex items-center justify-center rounded-full"
                    onClick={() => {
                      handleSendMessage();
                      setNewMessage('');
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane as IconProp} className="hover:scale-105" />
                  </button>
                )}
              </div>
            </div>
          )}


        {/* Modal de imagen */}
        {openImageModal && (<div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 ${openImageModal ? 'block' : 'hidden'}`}
          onClick={() => setOpenImageModal(false)} // Cierra el modal cuando se hace clic fuera
        >
          <div
            className="flex justify-center items-center min-h-screen relative"
            onClick={(e) => e.stopPropagation()} // Evita que el click en el contenido cierre el modal
          >
            <div className="relative bg-white rounded-lg w-[50%] max-h-screen mx-4 overflow-hidden">
              <button
                onClick={() => setOpenImageModal(false)}
                className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-3 w-8 h-8 flex items-center justify-center"
              >
                <span className="text-xl font-bold">X</span>
              </button>
              <div className="flex justify-center w-full h-full">
                <img
                  src={isSendImage ? (file ? URL.createObjectURL(file) : '') : (typeof modalImage === 'string' ? modalImage : '')}
                  alt="Imagen seleccionada"
                  className="w-full h-auto object-contain"
                />
              </div>
              {isSendImage && (<div className="flex justify-end gap-2 mt-4 absolute bottom-1 right-1">
                <button
                  onClick={handleSendFile}
                  className="bg-[#FE8A5B] text-white py-2 px-4 rounded-full"
                >
                  Enviar
                </button>
              </div>)}

            </div>
          </div>
        </div>)}

        {/* Modal de Reporte */}
        <Dialog open={isReportModalOpen} onOpenChange={(open) => {
          setIsReportModalOpen(open);
          if (!open) {
            setError('');
            setReportSuccess('');
            setDescripcion('');
          }
        }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reportar Propietario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUserReportSubmit} className="flex flex-col gap-4">
              <label className="text-sm font-medium text-gray-700">Razón del reporte:</label>

              <textarea
                className="p-2 rounded-lg border"
                name="descripcion"
                rows={4}
                maxLength={300}
                placeholder="Describe el motivo del reporte (máximo 300 caracteres)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={isLoading}
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {reportSuccess && <p className="text-green-600 text-sm">{reportSuccess}</p>}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[16px]">Imágenes</CardTitle>
                  <h2 className="text-gray-500">Puede adjuntar imagenes como pruebas</h2>
                </CardHeader>
                <CardContent>
                  <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Imágenes de prueba
                  </Label>
                  <div
                    {...getRootProps()}
                    className={`mt-2 flex justify-center cursor-pointer hover:bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors ${
                      isDragActive ? 'border-blue-400 bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer">
                          Sube un archivo
                        </span>{' '}
                        o arrastra y suelta
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG hasta 10MB (máximo 3 imágenes)
                      </p>
                      <input {...getInputProps()} />
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={url} className="relative h-40 aspect-square">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="object-cover rounded-lg shadow-md w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-rose-600 rounded-full p-1 shadow-md"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter className="sticky bottom-0 bg-white pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !descripcion.trim()}
                  className={`py-2 px-4 font-semibold rounded-lg ${
                    descripcion.trim()
                      ? 'bg-[#ffa07a] text-white hover:bg-[#ff9060]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Enviando...' : 'Reportar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


      </div>
    )
  );
};

export default Chat;