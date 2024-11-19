// lib/cometChat.js
import { CometChat } from "@cometchat-pro/chat";

const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
const authKey = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY;

export const initializeCometChat = () => {
  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();

  // Aquí retornamos la promesa para que pueda ser encadenada en loginCometChatUser
  return CometChat.init(appID, appSetting).then(
    () => {
      console.log("Initialization completed successfully");
    },
    error => {
      console.log("Initialization failed with error:", error);
      throw error; // Propagar el error si la inicialización falla
    }
  );
};

export const loginCometChatUser = (UID: string, name : string, imagen : string) => {
  if (typeof window !== 'undefined') {
    return initializeCometChat().then(() => {
      return CometChat.login(UID, authKey).then(
        user => {
          console.log("Login Successful:", user);
          return user; // Retorna el usuario logueado
        },
        error => {
          console.log("Login failed with exception:", error);
          // Si el usuario no existe, crearlo
          if (error.code === "ERR_UID_NOT_FOUND") {
            const newUser = new CometChat.User(UID);
            newUser.setUid(UID); // Puedes asignar cualquier nombre
            newUser.setName(name);
            newUser.setAvatar(imagen);

            console.log("Creating new user:", newUser);

            return CometChat.createUser(newUser, authKey).then(
              user => {
                console.log("User created successfully:", user);
                return CometChat.login(UID, authKey);
              },
              error => {
                console.log("User creation failed with error:", error);
                throw error; // Propaga el error si falla la creación
              }
            );
          } else {
            throw error; // Propaga otros errores si no es ERR_UID_NOT_FOUND
          }
        }
      );
    });
  } else {
    console.log("CometChat login can only be performed on the client side.");
    return Promise.reject("CometChat login can only be performed on the client side.");
  }
};
