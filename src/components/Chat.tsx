import { useState, useEffect, useRef, use } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { getUserProfile } from "@/app/menu/configuraciones/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faSmile } from '@fortawesome/free-regular-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const Chat = ({ receiverUIDParam, mascota, onRetroceder }:
  { receiverUIDParam: string, mascota: string, onRetroceder: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState(`¡Estoy emocionado por adoptar a ${mascota}! 🐾`);
  const [userEmisor, setUserEmisor] = useState<any>(null);
  const [userReceptor, setUserReceptor] = useState<any>(null);
  const messagesEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isSendImage, setIsSendImage] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  //listener
  /*   useEffect(() => {
      if (!receiverUIDParam) return;
    
      const listenerID = `Listener_${Date.now()}`;
    
      // Añadir listener para recibir mensajes en tiempo real
      CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: (message) => {
            console.log("Nuevo mensaje recibido:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
          },
          onMediaMessageReceived: (message) => {
            console.log("Nuevo mensaje de media recibido:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
          },
        })
      );
    
      // Eliminar listener al desmontar el componente
      return () => {
        CometChat.removeMessageListener(listenerID);
        console.log("Listener de mensajes eliminado.");
      };
    }, [receiverUIDParam]); */

  //conexion con cometChat
  useEffect(() => {
    const initCometChat = async () => {
      const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
      const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;

      try {
        const initialized = await CometChat.init(appID, new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build());

        if (initialized) {
          console.log("CometChat inicializado correctamente.");
          loginToCometChat();
        } else {
          console.error("Fallo al inicializar CometChat.");
        }
      } catch (error) {
        console.error("Error al inicializar CometChat:", error);
      }
    };

    const loginToCometChat = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error("No se encontró el authToken.");
        return;
      }

      try {
        const user = await CometChat.login(authToken);
        console.log("Inicio de sesión exitoso en CometChat:", user);
      } catch (error) {
        console.error("Error al iniciar sesión en CometChat:", error);
      }
    };


    initCometChat();
  }, []);

  //trae los mensajes del usuario receptor
  useEffect(() => {
    if (!receiverUIDParam) {
      console.warn("receiverUID es null, undefined o vacío.");
      return; // Evita ejecutar la lógica si receiverUID no es válido
    }

    const obtenerUsuarioAutenticado = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error("El authToken no está disponible.");
          return;
        }

        await CometChat.login(authToken); // Asegura la autenticación
        const user = await CometChat.getUser(receiverUIDParam);
        setUserReceptor(user);

        fetchMessages();
        scrollToBottom();
      } catch (error) {
        console.error("Error al autenticar o obtener el usuario receptor:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    setLoadingMessages(true);
    obtenerUsuarioAutenticado();
  }, [receiverUIDParam]);


  const sendFile = () => {
    if (!receiverUIDParam) {
      console.error("receiverUID is null or undefined.");
      return;
    }

    const mediaMessage = new CometChat.MediaMessage(
      receiverUIDParam,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        setMessages([...messages, message]);
        setFile(null);
        setOpenImageModal(false);
        scrollToBottom();
      },
      error => {
        return error
      }
    )
  }

  const fetchMessages = () => {
    setLoadingMessages(true);
    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(receiverUIDParam)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
        setMessages(messages);
        setLoadingMessages(false);
        scrollToBottom();
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  };

  const sendMessage = () => {
    const textMessage = new CometChat.TextMessage(receiverUIDParam, newMessage, CometChat.RECEIVER_TYPE.USER);

    CometChat.sendMessage(textMessage).then(
      (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
        scrollToBottom();
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // @ts-expect-error
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    userEmisor && userReceptor && (
      <div className="flex h-screen overflow-hidden w-full z-auto">
        {/* Panel de mensajes */}
        <div className="flex flex-col flex-1 h-full justify-center items-center">

          {/* Título */}
          <div className="relative max-h-full flex flex-col items-center bg-gradient-to-br from-[#4db8b3] via-[#31767b] to-[#2a4f51] w-full text-white text-center px-4 py-2 rounded-t-xl shadow-lg">
            {/* @ts-expect-error */}
            <div className="absolute top-0 left-0 right-o left-0 m-auto h-full rounded-full w-10 lg:w-12 flex items-center justify-center cursor-pointer hover:scale-110" onClick={() => onRetroceder(true)}>
              <button className="ml-[20px] lg:ml-[30px]">
                <FontAwesomeIcon icon={faAngleLeft as IconProp} className="text-gray-300 text-[24px] lg:text-[32px]" />
              </button>
            </div>
            <h1 className="text-xl font-medium flex gap-2 items-center">
              Conversando con {userReceptor.name}
              <img src="/usuario-default.png" alt="avatar" className="rounded-full w-9" />
            </h1>
            <p className="font-light">Estás hablando sobre la adopción de {mascota}. ¡Esperamos que encuentres un buen amigo!</p>
          </div>

          <div className="flex flex-col flex-1 max-h-full w-full overflow-y-auto">
            {/* Mensajes */}
            {loadingMessages ? (
              //renderiza skeleton
              <div className="flex-1 overflow-y-auto p-4 space-y-4 lg:w-[60%] sm:w-full mx-auto">
                {[...Array(4)].map((_, idx) => {
                  const isSender = idx % (2 + 1) === 0;
                  return (
                    <div key={idx} className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start space-x-2 animate-pulse`}>
                      {/* Avatar */}
                      <div className={`w-10 h-10 bg-gray-300 rounded-full ${isSender ? 'order-last' : ''}`}></div>

                      {/* Contenedor del mensaje */}
                      <div className={`ml-${isSender ? '0' : '12'} p-3 rounded-lg bg-gray-300 lg:w-[60%] sm:w-full`}>
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
                <div className="md:w-[60%] sm:w-full mx-auto flex flex-col">
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
                          className={`relative mt-1 rounded-lg ml-${showAvatar ? '0' : '12'} text-white ${isSender
                            ? 'bg-[#3b3a3acf]'
                            : 'bg-[#6D9C8E]'
                            } ${additionalPadding} p-3`}

                        >

                          {/* Nombre del emisor solo si es necesario */}
                          {!isSender && showAvatar && <span className="block mb-1 text-sm font-semibold">{msg.sender.name}</span>}
                          <p>{msg.text}</p>
                          <div className="text-xs text-gray-200 mt-2 text-right">
                            {new Date(msg.sentAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                              {new Date(msg.sentAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input y botón para enviar mensaje */}
            <div className="pt-2 border-t px-3 py-2 flex w-[70%] mx-auto justify-center items-center space-x-1">
              <div className="relative w-full">
                <input
                  className="border border-gray-300 p-2 text-gray-800 focus:outline-none focus:border-blue-500 rounded-full w-full pr-12"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                />

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
              </div>

              {/* Botón de enviar mensaje */}
              {newMessage && (
                <button
                  className="h-full aspect-square bg-[#FE8A5B] text-white flex items-center justify-center rounded-full"
                  onClick={() => {
                    sendMessage();
                    setNewMessage('');
                  }}
                >
                  <FontAwesomeIcon icon={faPaperPlane as IconProp} />
                </button>
              )}
            </div>

          </div>

          {/* Modal de imagen */}
          {openImageModal && (<div
            className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 ${openImageModal ? 'block' : 'hidden'}`}
            onClick={() => setOpenImageModal(false)} // Cierra el modal cuando se hace clic fuera
          >
            <div
              className="flex justify-center items-center min-h-screen relative"
              onClick={(e) => e.stopPropagation()} // Evita que el click en el contenido cierre el modal
            >
              <div className="relative bg-white rounded-lg w-[50%] mx-4 overflow-hidden">
                <button
                  onClick={() => setOpenImageModal(false)}
                  className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-3 w-8 h-8 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faXmark as IconProp} />
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
                    onClick={sendFile}
                    className="bg-[#FE8A5B] text-white py-2 px-4 rounded-full hover:scale-105"
                  >
                    Enviar
                  </button>
                </div>)}
              </div>
            </div>
          </div>)}
        </div>
      </div>
    )
  );
};


export default Chat;