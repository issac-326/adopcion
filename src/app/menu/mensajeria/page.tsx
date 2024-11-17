'use client'

import { useState, useEffect, useRef, use } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { CometChat } from "@cometchat-pro/chat";
import { getUserProfile } from "@/app/menu/configuraciones/action";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
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
    fetchConversations();
  }, []);

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

    const loginToCometChat = () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error("No se encontró el authToken.");
        return;
      }

      CometChat.login(authToken).then(
        (user) => {
          console.log("Login exitoso", user);
          fetchConversations();
        },
        (error) => {
          console.error("Error al iniciar sesión en CometChat:", error);
        }
      );
    };

    initCometChat();
  }, []);

  //trae los mensajes del usuario receptor
  useEffect(() => {
    if (!receiverUID) {
      console.warn("receiverUID es null, undefined o vacío.");
      return; // Evita ejecutar la lógica si receiverUID no es válido
    }

    setLoadingMessages(true);

    const obtenerUsuarioPorUID = (uid) => {
      return new Promise((resolve, reject) => {
        CometChat.getUser(uid).then(
          (user) => {
            console.log("Usuario encontrado:", user);
            resolve(user);
          },
          (error) => {
            console.log("Error al obtener el usuario:", error);
            reject(error);
          }
        );
      });
    };


    obtenerUsuarioPorUID(receiverUID)
      .then((user) => {
        setUserReceptor(user);
        fetchMessages();
        scrollToBottom();
        console.log("userReceptor", user);
      })
      .catch((error) => {
        console.error("Error al obtener el usuario:", error);
      }).finally(() => {
        setLoadingMessages(false);
      });

  }, [receiverUID]);

  const sendFile = () => {
    console.log("Send File Called")
    if (!receiverUID) {
      console.error("receiverUID is null or undefined.");
      return;
    }

    var mediaMessage = new CometChat.MediaMessage(
      receiverUID,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        console.log("file sent", message)
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
      .setUID(receiverUID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
        setMessages(messages);
        setLoadingMessages(false);
        scrollToBottom();
        console.log("Messages fetched:", messages);
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  };

  const fetchConversations = () => {
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(30)
      .build();

    conversationsRequest.fetchNext().then(
      (conversations) => {
        // Mapear las conversaciones para obtener los datos completos
        const conversationData = conversations.map((conversation) => {
          const sender = conversation.sender;
          const receiver = conversation.receiver;

          return {
            id: conversation.conversationId,
            sender: sender ? sender.uid : null,
            receiver: conversation.getConversationWith().getUid(),
            receiverNombre: receiver ? receiver.name : '',
            receptorImagen: receiver ? receiver.avatar : '/default-avatar.png',
            lastMessage: conversation.lastMessage ? conversation.lastMessage.data.text : 'No message',
            sentAt: conversation.lastMessage ? conversation.lastMessage.sentAt : 0,
            name: conversation.getConversationWith().getName(),
          };
        });
        setConversations(conversationData);
        console.log("Conversations fetched:", conversations);
      },
      (error) => {
        console.log("Error fetching conversations:", error);
      }
    );
  };

  const sendMessage = () => {
    const textMessage = new CometChat.TextMessage(receiverUID, newMessage, CometChat.RECEIVER_TYPE.USER);

    CometChat.sendMessage(textMessage).then(
      (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
        fetchConversations();
        scrollToBottom();
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    userEmisor && (
      <div className="flex min-h-screen w-full bg-[#ebfbfb] rounded-xl overflow-hidden">

        {/* Panel lateral de conversaciones */}
        <div className="w-2/5 bg-[#226569] py-4 px-2 space-y-0 overflow-y-auto rounded-tl-xl rounded-bl-xl text-[#fdd5d5]">
          <h2 className="text-xl font-semibold mb-4 text-white">Chats</h2>
          {conversations.map((conversation, idx) => {
            const receiver = conversation.conversationWith;
            const lastMessage = conversation.lastMessage;
            const sentAt = conversation.sentAt;
            const receiverImage = '/default-avatar.png';
            const receiverName = conversation.name;

            // Función para formatear la hora de envío
            const formatTime = (timestamp: number) => {
              const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };

            // Comprobación si esta conversación está activa
            const isActive = conversation.conversationId === activeConversationId;

            return (
              <div
                key={conversation.conversationId}
                className={`p-3 rounded-lg cursor-pointer hover:bg-[#dbeafe3b] ${isActive ? 'bg-blue-100' : ''}`}
                onClick={() => {
                  setActiveConversationId(conversation.conversationId);
                  setReceiverUID(conversation.receiver);
                }}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={receiverImage}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{receiverName}</p>
                    <p className="text-xs text-[#aed3df]">{lastMessage}</p>
                    <p className="text-xs text-gray-400">{formatTime(sentAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
              <div className="relative max-h-full flex gap-2 items-center bg-[#40979d] w-full text-white text-center px-4 py-2">
                <img src="/usuario-default.png" alt="avatar" className="rounded-full w-9" />
                <div className="flex flex-col items-start">
                  <p>{userReceptor.name}</p>
                  <p className="text-xs">{userReceptor.status !== 'offline' ? 'en linea' : `última vez a las ${new Date(userReceptor.lastActiveAt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}</p>
                </div>
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
                        {/* Avatar del receptor */}
                        {!isSender && showAvatar && (
                          <img
                            src={userReceptor ? userReceptor.imagen : '/default-avatar.png'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}

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


                        {/* Avatar del emisor */}
                        {isSender && showAvatar && (
                          <img
                            src={userEmisor ? userEmisor.imagen : '/default-avatar.png'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>


              )}

              {/* Input y botón para enviar mensaje */}
              <div className="pt-2 border-t px-3 py-2 flex w-full justify-center items-center space-x-1">
                <div className="relative w-full w-full">
                  <input
                    className="border border-gray-300 p-2 focus:outline-none focus:border-blue-500 rounded-full w-full pr-12"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                  />

                  {/* Botón para seleccionar archivo dentro del input */}
                  <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center">
                    <FontAwesomeIcon icon={faPaperclip} className="text-lg text-[#FE8A5B] h-full" />
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

                {/* Botón de enviar mensaje, solo aparece si hay texto en el input */}
                {newMessage && (
                  <button
                    className="h-full aspect-square bg-[#FE8A5B] text-white flex items-center justify-center rounded-full"
                    onClick={sendMessage}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
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
            <div className="relative bg-white rounded-lg w-[50%] mx-4 overflow-hidden">
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
                  onClick={sendFile}
                  className="bg-[#FE8A5B] text-white py-2 px-4 rounded-full"
                >
                  Enviar
                </button>
              </div>)}

            </div>
          </div>
        </div>)}


      </div>
    )
  );
};

export default Chat;