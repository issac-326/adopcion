import { useState, useEffect, useRef, use } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { getUserProfile } from "@/app/menu/configuraciones/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const Chat = ({ receiverUIDParam, mascota, onRetroceder }: 
  { receiverUIDParam: string, mascota: string, onRetroceder: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState(`¡Estoy emocionado por adoptar a ${mascota}! 🐾`);
  const [userEmisor, setUserEmisor] = useState<any>(null);
  const [userReceptor, setUserReceptor] = useState<any>(null);
  const messagesEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(true);

  console.log(receiverUIDParam)

  //Inicializacion de cometchat, luego traemos usuarios y mensajes
  useEffect(() => {
    const initCometChat = async () => {
      const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
      const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;

      try {
        const initialized = await CometChat.init(appID, new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build());

        if (initialized) {
          console.log("CometChat inicializado correctamente.");
          loginToCometChat();
          fetchUsers().then(() => fetchMessages()).catch((error) => console.error("Error al obtener usuarios:", error));
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
        },
        (error) => {
          console.error("Error al iniciar sesión en CometChat:", error);
        }
      );
    };

    const fetchUsers = async () => {
      try {
        const user = await getUserProfile();
        console.log("user", user);
        const userReceptor = await getUserProfile(String(receiverUIDParam));
        setUserEmisor(user);
        setUserReceptor(userReceptor);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    initCometChat();
  }, []);

  const fetchMessages = () => {
    setLoadingMessages(true);

    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(String(receiverUIDParam))
      .setLimit(limit)
      .build();

      console.log(receiverUIDParam)

    messagesRequest.fetchPrevious().then(
      (messages) => {
        setMessages(messages);
        setLoadingMessages(false);
        console.log("Message fetching completed successfully:", messages);
        scrollToBottom();
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  };

  const sendMessage = () => {
    const textMessage = new CometChat.TextMessage(String(receiverUIDParam), newMessage, CometChat.RECEIVER_TYPE.USER);

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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    userEmisor && userReceptor && (
      <div className="flex h-screen w-full mt-5">
        {/* Panel de mensajes */}
        <div className="flex flex-col flex-1 h-full">
          {/* Título */}
          <div className="relative bg-blue-500 text-white text-center p-4 rounded-t-lg">
            <div
              className="absolute top-0 left-0 rounded-full w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110"
              onClick={() => onRetroceder(false)}
            >
              <button className="ml-[20px] lg:ml-[30px]">
                <FontAwesomeIcon icon={faAngleLeft} className="text-red-500 text-[24px] lg:text-[32px]" />
              </button>
            </div>
            <h1 className="text-xl font-semibold">
              Conversando con {userReceptor.nombre1 + ' ' + userReceptor.apellido1}
            </h1>
            <p>Estás hablando sobre la adopción de {mascota}. ¡Esperamos que encuentres un buen amigo!</p>
          </div>

          {/* Mensajes */}
          {loadingMessages ? (
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
          <div className="flex p-4 bg-white border-t">
            <input
              className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={sendMessage}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    )
  );

};

export default Chat;