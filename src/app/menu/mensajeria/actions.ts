'use client'

import axios from "axios";
import { CometChat } from "@cometchat-pro/chat";
// Función para inicializar CometChat y login

// Función para inicializar CometChat y login
export const initCometChat = async (authToken: string): Promise<void> => {
  if (typeof window !== "undefined") {

    const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
    const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
    console.log("appID", appID);
    console.log("region", region);

    try {
      const initialized = await CometChat.init(
        appID,
        new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(region)
          .build()
      );

      if (initialized) {
        console.log("CometChat inicializado correctamente.");
        loginToCometChat(authToken); // Asegúrate de que loginToCometChat sea una función que retorne una promesa
      } else {
        throw new Error("Fallo al inicializar CometChat.");
      }
    } catch (error) {
      console.error("Error al inicializar CometChat:", error);
      throw error; // Para que el error sea propagado
    }
  } else {
    console.error("No se puede inicializar CometChat en un entorno no browser.");
  }

};

// Función para hacer login en CometChat
const loginToCometChat = (authToken: string) => {
  if (!authToken) {
    console.error("No se encontró el authToken.");
    return;
  }

  CometChat.login(authToken).then(
    (user: CometChat.User) => {
      console.log("Login exitoso", user);
    },
    (error) => {
      console.error("Error al iniciar sesión en CometChat:", error);
    }
  );
};

export async function obtenerUsuarioPorUID(receiverUID: string) {
  try {
    const user = await CometChat.getUser(receiverUID);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener el usuario: ${error.message}`);
    } else {
      throw new Error('Error al obtener el usuario: Error desconocido');
    }
  }
}

export async function fetchMessages(receiverUID: string) {
  try {
    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(receiverUID)
      .setLimit(limit)
      .build();
    const messages = await messagesRequest.fetchPrevious();
    return messages;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    } else {
      throw new Error('Error al obtener mensajes: Error desconocido');
    }
  }
}

export async function sendFileAction(receiverUID: string, file: File) {
  try {
    const mediaMessage = new CometChat.MediaMessage(
      receiverUID,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.USER
    );
    const message = await CometChat.sendMediaMessage(mediaMessage);
    return message;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al enviar archivo: ${error.message}`);
    } else {
      throw new Error('Error al enviar archivo: Error desconocido');
    }
  }
}

export async function uploadToCloudinary(file: File): Promise<string> {
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
}

export async function fetchConversationsAction() {
   console.log("usuario", await CometChat.getLoggedinUser());
  try {
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(30)
      .build();
    const conversations = await conversationsRequest.fetchNext();
    console.log("cv", conversations);

    return conversations.map((conversation) => {
      const receiver = conversation.getConversationWith();
      const lastMessage = conversation.getLastMessage();
      let lastMessageText = '';
    
      if (lastMessage) {
        if (lastMessage.type === 'text') {
          lastMessageText = lastMessage.getText ? lastMessage.getText() : ''; // Si el mensaje es de texto
        } else if (lastMessage.type === 'file') {
          lastMessageText = 'Archivo enviado'; // O muestra algún texto genérico
        } else {
          lastMessageText = 'Otro tipo de mensaje'; // Maneja otros tipos de mensajes según sea necesario
        }
      }
    
      return {
        id: conversation.getConversationId(),
        receiver: receiver instanceof CometChat.User ? receiver.getUid() : receiver.getGuid(),
        receiverNombre: receiver.getName(),
        receptorImagen:
          receiver instanceof CometChat.User
            ? receiver.getAvatar() || 'https://res.cloudinary.com/dvqtkgszm/image/upload/v1731795791/avatar_o9cpas.avif'
            : 'https://res.cloudinary.com/dvqtkgszm/image/upload/v1731795791/avatar_o9cpas.avif',
        lastMessage: lastMessageText,
        sentAt: lastMessage?.getSentAt() || 0,
      };
    });
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener conversaciones: ${error.message}`);
    } else {
      throw new Error('Error al obtener conversaciones: Error desconocido');
    }
  }
}

export async function sendMessageAction(receiverUID: string, text: string) {
  try {
    const textMessage = new CometChat.TextMessage(receiverUID, text, CometChat.RECEIVER_TYPE.USER);
    const message = await CometChat.sendMessage(textMessage);
    return message;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    } else {
      throw new Error('Error al enviar mensaje: Error desconocido');
    }
  }
}


export function addMessageListener(listenerID: string, callbackHandlers: { onTextMessageReceived: (message: CometChat.TextMessage) => void; onMediaMessageReceived: (message: CometChat.MediaMessage) => void; }) {
  try {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message: CometChat.TextMessage) => {
          callbackHandlers.onTextMessageReceived(message);
        },
        onMediaMessageReceived: (message: CometChat.MediaMessage) => {
          callbackHandlers.onMediaMessageReceived(message);
        },
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al añadir listener de mensajes: ${error.message}`);
    } else {
      throw new Error('Error al añadir listener de mensajes: Error desconocido');
    }
  }
}

export function removeMessageListener(listenerID: string) {
  try {
    CometChat.removeMessageListener(listenerID);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al eliminar listener de mensajes: ${error.message}`);
    } else {
      throw new Error('Error al eliminar listener de mensajes: Error desconocido');
    }
  }
}
