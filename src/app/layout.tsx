"use client";

import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Carga de fuentes locales
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_API_ID!,
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION!,
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    return null; // o un componente de carga
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} font-montserrat antialiased bg-[#f4f0fd]`}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}