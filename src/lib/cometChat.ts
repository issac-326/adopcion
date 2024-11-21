import { CometChat } from "@cometchat-pro/chat";

const appID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
const authKey = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY;

if (!authKey) {
  throw new Error("CometChat authKey is not defined");
}

export const initializeCometChat = () => {
  if (typeof window === 'undefined') {
    console.log("CometChat can only be initialized on the client side.");
    return Promise.reject("CometChat can only be initialized on the client side.");
  }

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();

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

export const loginCometChatUser = async (UID: string, name: string, imagen: string) => {
  if (typeof window === 'undefined') {
    console.log("CometChat login can only be performed on the client side.");
    return Promise.reject("CometChat login can only be performed on the client side.");
  }

  await initializeCometChat();

  return await CometChat.login(UID, authKey).then(
    user => {
      console.log("Login Successful:", user);
      return user; // Retorna el usuario logueado
    },
    async error => {
      console.log("Login failed with exception:", error);
      if (error.code === "ERR_UID_NOT_FOUND") {
        const newUser = new CometChat.User(UID);
        newUser.setUid(UID);
        newUser.setName(name);
        newUser.setAvatar(imagen);

        console.log("Creating new user:", newUser);

        return await CometChat.createUser(newUser, authKey).then(
          user_2 => {
            console.log("User created successfully:", user_2);
            return CometChat.login(UID, authKey);
          },
          error_1 => {
            console.log("User creation failed with error:", error_1);
            throw error_1; // Propaga el error si falla la creación
          }
        );
      } else {
        throw error; // Propaga otros errores
      }
    }
  );
};
