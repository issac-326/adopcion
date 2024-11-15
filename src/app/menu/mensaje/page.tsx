'use client'

import { useState, useEffect, useRef, use } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { getUserProfile } from "@/app/menu/configuraciones/action";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [userEmisor, setUserEmisor] = useState<any>(null);
  const [userReceptor, setUserReceptor] = useState<any>(null);
  const messagesEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [receiverUID, setReceiverUID] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserProfile();
        console.log("user", user);
        setUserEmisor(user);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
    fetchConversations();
  }, []);

  /*   useEffect(() => {
      const fetchUser = async () => {
        try {
          const userReceptor = await getUserProfile(receiverUID);
          setUserReceptor(userReceptor);
          console.log("userReceptor", userReceptor);
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      };
  
      fetchUser().then(() => {
        fetchMessages();
      });
    }, [receiverUID]); */

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


  useEffect(() => {
    const obtenerUsuarioPorUID = (uid) => {
      return new Promise((resolve, reject) => {
        CometChat.getUser(uid).then(
          user => {
            console.log("Usuario encontrado:", user);
            resolve(user);
          },
          error => {
            console.log("Error al obtener el usuario:", error);
            reject(error);
          }
        );
      });
    };

    obtenerUsuarioPorUID(receiverUID).then(user => {
      setUserReceptor(user);
      fetchMessages();
      console.log("userReceptor", user);
    }).catch(error => {
      console.error("Error al obtener el usuario:", error);
    });

  }, [receiverUID]);

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
      <div className="flex min-h-screen w-full mt-5 bg-[#c7b69f]">

        {/* Panel lateral de conversaciones */}
        <div className="w-2/5 bg-gray-100 p-4 space-y-4 overflow-y-auto border-r bg-[#7e634e]">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          {conversations.map((conversation, idx) => {
            const receiver = conversation.conversationWith;
            const lastMessage = conversation.lastMessage;
            const sentAt = conversation.sentAt;
            const receiverImage = '/default-avatar.png'; // Imagen predeterminada si no existe avatar
            const receiverName = conversation.name;

            // Función para formatear la hora de envío
            const formatTime = (timestamp: number) => {
              const date = new Date(timestamp * 1000); // Convertir el timestamp a milisegundos
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-200 ${conversation.conversationId === activeConversationId ? 'bg-blue-100' : 'bg-white'}`}
                onClick={() => { setActiveConversationId(conversation.conversationId); setReceiverUID(conversation.receiver); }}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={receiverImage}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{receiverName}</p>
                    <p className="text-xs text-gray-500">{lastMessage}</p>
                    <p className="text-xs text-gray-400">{formatTime(sentAt)}</p>
                  </div>
                </div>
              </div>

            );
          })}
        </div>

        {/* Panel de mensajes */}
        {messages.length === 0 ? (
          <div className="w-full flex-grow flex flex-col items-center justify-center bg-gray-50 p-6 space-y-4">
            <img src="\img\logos\mensajeria.png" alt="Logo" className="max-w-[70%] object-contain" />
            <p className="text-center text-lg text-gray-700 font-medium max-w-[70%]">
              Comienza a conversar y a conectarte con otras personas para adoptar a tu compañero de vida
            </p>
          </div>) :
          (<div className="flex flex-col flex-1 h-full w-full">

            {/* Título */}
            <div className="relative flex gap-2 items-center bg-blue-500 w-full text-white text-center px-4 py-2">
              <img src="/usuario-default.png" alt="avatar" className="rounded-full w-9" />
              <div className="flex flex-col items-start">
                <p>{userReceptor.name}</p>
                <p className="text-xs">{userReceptor.status !== 'offline' ? 'en linea' : `ultima vez a las ${new Date(userReceptor.lastActiveAt * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}</p>
              </div>
            </div>

            {/* Mensajes */}
            {messages.length === 0 ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex justify-start items-start space-x-2 animate-pulse">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="ml-0 p-3 rounded-lg bg-gray-300 max-w-[60%]">
                      <div className="block mb-1 text-sm bg-gray-400 w-24 h-4 rounded-md"></div>
                      <div className="w-36 h-4 bg-gray-400 rounded-md"></div>
                      <div className="mt-2 w-16 h-3 bg-gray-400 rounded-md text-right"></div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isSender = msg.sender.uid == userEmisor.id_usuario;
                  const previousMessage = messages[idx - 1];
                  const showAvatar = !previousMessage || previousMessage.sender.uid !== msg.sender.uid;

                  return (
                    <div key={idx} className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
                      {!isSender && showAvatar && (
                        <img
                          src={userReceptor ? userReceptor.imagen : '/default-avatar.png'}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div
                        className={`p-3 rounded-lg ml-${showAvatar ? '0' : '12'} text-white max-w-[60%] ${isSender
                          ? 'bg-gradient-to-r from-[#acd094] to-[#f5a473]'
                          : 'bg-gradient-to-r from-[#7d86a5] to-[#f39893]'
                          }`}
                      >
                        {!isSender && showAvatar && <span className="block mb-1 text-sm font-semibold">{msg.sender.name}</span>}
                        <span>{msg.text}</span>
                        <div className="text-xs text-gray-200 mt-2 text-right">
                          {new Date(msg.sentAt * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
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
            <div className="grid grid-cols-6 pt-2 bg-white border-t gap-1">
              <input
                className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 col-span-5"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <button className="w-[2] h-[40px] bg-[#FE8A5B] grid-cols-1 rounded-sm text-sm text-white hover:bg-[#ff9060]" onClick={sendMessage}>
                Enviar
              </button>
            </div>
          </div>)}

      </div>
    )
  );

};

export default Chat;
