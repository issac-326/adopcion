'use client';

import { useEffect, useState } from "react";

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_API_ID!,
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION!,
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!,
};

export default function CometChatWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const initCometChat = async () => {
      try {
        const { CometChat } = await import('@cometchat-pro/chat');

        // Inicializar CometChat
        const appID = COMETCHAT_CONSTANTS.APP_ID;
        const region = COMETCHAT_CONSTANTS.REGION;

        const appSetting = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(region)
          .build();

        await CometChat.init(appID, appSetting);
        console.log("CometChat inicializado exitosamente");
      } catch (error) {
        console.error("Error al inicializar CometChat:", error);
      }
    };

    if (typeof window !== 'undefined') {
      initCometChat();
    }

    // Limpieza al desmontar el componente
    return () => {
      if (typeof window !== 'undefined') {
        import('@cometchat-pro/chat').then(({ CometChat }) => {
          CometChat.logout();
        });
      }
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}