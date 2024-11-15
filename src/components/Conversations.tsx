import { useEffect, useState } from "react";
import { CometChat } from "@cometchat-pro/chat";

export const ConversacionesPanel = ({ userEmisor, setCurrentConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [authToken, setAuthToken] = useState(null); // Almacena el authToken del usuario

  // Función para autenticar al usuario y obtener su authToken
  const loginUser = async (uid) => {
    if (!uid) {
      console.error("El uid del usuario no está definido.");
      return;
    }
  
    const authKey = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY;
    if (!authKey) {
      console.error("La clave de autenticación de CometChat no está definida.");
      return;
    }
  
    try {
      console.log(uid, authKey);
      const user = await CometChat.login(uid, authKey);
      
      console.log("Usuario autenticado correctamente:", user);
      setAuthToken(user.authToken); // Almacena el authToken
    } catch (error) {
      console.error("Error al autenticar el usuario:", error);
    }
  };
  

  // Función para obtener las conversaciones del usuario emisor
  const fetchConversations = async () => {
    const limit = 30; // Limita la cantidad de conversaciones que quieres obtener
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build();

    try {
      const fetchedConversations = await conversationsRequest.fetchNext();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error("Error al obtener las conversaciones:", error);
    }
  };

  useEffect(() => {
    console.log("Usuario emisor:", userEmisor);
    if (userEmisor && !authToken) {
      loginUser(userEmisor); // Autenticar al usuario si no está autenticado
    }

    if (authToken) {
      fetchConversations(); // Obtener las conversaciones después de la autenticación
    }
  }, [userEmisor, authToken]);

  return (
    <div className="w-1/4 bg-gray-100 h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <div className="space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.conversationId}
            className="p-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
            onClick={() => setCurrentConversation(conv)}
          >
            <p className="text-sm font-medium">{conv.conversationWith.name}</p>
            <p className="text-xs text-gray-500">
              Último mensaje: {conv.lastMessage ? conv.lastMessage.text : "Sin mensajes"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
