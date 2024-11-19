import { useState, useEffect, useRef } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { ConversacionesPanel } from "./Conversations";
import { getUserProfile } from "@/app/menu/configuraciones/action";

const Conversacion = () => {
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userEmisor, setUserEmisor] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setUser(user);
        setUserEmisor(user.id_usuario);
        console.log("Usuario:", user);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };

    fetchUserProfile();
  }, []);


  // Función para obtener los mensajes de la conversación seleccionada
  // @ts-expect-error
  const fetchMessages = async (conversationId) => {
    const limit = 50; // Puedes ajustar el límite de mensajes que se obtienen
    const messagesRequest = new CometChat.MessagesRequestBuilder()
    // @ts-expect-error
      .setConversationId(conversationId)
      .setLimit(limit)
      .build();

    try {
      const fetchedMessages = await messagesRequest.fetchPrevious();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };

  useEffect(() => {
    if (currentConversation) {
      // @ts-expect-error
      fetchMessages(currentConversation.conversationId); // Cargar mensajes cuando se seleccione una conversación
    }
  }, [currentConversation]);

  // Función para enviar mensajes
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;
    // @ts-expect-error
    const receiverId = currentConversation.conversationWith.uid;
    const receiverType = CometChat.RECEIVER_TYPE.USER;

    const textMessage = new CometChat.TextMessage(
      receiverId,
      newMessage,
      receiverType
    );

    try {
      const message = await CometChat.sendMessage(textMessage);
      // @ts-expect-error
      setMessages((prevMessages) => [...prevMessages, message]); // Agregar el mensaje enviado a la lista
      setNewMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Panel lateral con las conversaciones */}
      <ConversacionesPanel
        userEmisor={String(userEmisor)}
        setCurrentConversation={setCurrentConversation}
      />

      {/* Sección principal para mostrar mensajes */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p>Selecciona una conversación para ver los mensajes</p>
          ) : (
            messages.map((msg, idx) => (
              // @ts-expect-error
              <div key={idx} className={`flex ${msg.sender.uid === userEmisor.uid ? "justify-end" : "justify-start"} mb-2`}>
                {/*@ts-expect-error */}
                <div className={`${msg.sender.uid === userEmisor.uid ? "bg-blue-500" : "bg-gray-300"} p-2 rounded-lg`}>
                  {/*@ts-expect-error*/}
                  <p>{msg.text}</p>
                  {/*@ts-expect-error*/}
                  <span className="text-xs text-gray-500">{new Date(msg.sentAt * 1000).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input para enviar un nuevo mensaje */}
        {currentConversation && (
          <div className="p-4 bg-white border-t flex">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-2 rounded-lg"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={sendMessage}
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversacion;

