'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import MenuCategorias from '@/components/MenuCategorias';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function Home() {
   

    return (
      <div>

        <MenuCategorias />
        <section className="grid grid-cols-2 gap-4 mt-2">
            <Card className="bg-[#ADD8E6] h-[200px] rounded-[10px 10px 10px 10px / 15px 15px 15px 15px]">
                <CardHeader>
                    <div className="grid grid-cols-2">
                        <div>
                            <CardTitle className="text-[#03063A]">Leo</CardTitle>
                            <CardDescription className="text-xs">Distacia 0km</CardDescription>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#BB271A"
                                >
                                    <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/>
                                </svg>
                            </div>                      
                        </div>

                    </div>
                </CardHeader>
                <CardContent className="flex justify-end">
                    <Image className="" src="/Leo.webp" alt="Mascota" width={190} height={200}></Image>
                </CardContent>
            </Card>
            <Card className="bg-[#ADD8E6] h-[200px] rounded-2xl">
                <CardHeader>
                    <div className="grid grid-cols-2">
                        <div>
                            <CardTitle className="text-[#03063A]">Leo</CardTitle>
                            <CardDescription className="text-xs">Distacia 0km</CardDescription>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#BB271A"
                                >
                                    <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/>
                                </svg>
                            </div>                      
                        </div>

                    </div>
                </CardHeader>
                <CardContent>
                    <Image src="/Leo.webp" alt="Mascota" width={190} height={200}></Image>
                </CardContent>
            </Card>
            <Card className="bg-[#ADD8E6] h-[200px] rounded-2xl">
                <CardHeader>
                    <div className="grid grid-cols-2">
                        <div>
                            <CardTitle className="text-[#03063A]">Leo</CardTitle>
                            <CardDescription className="text-xs">Distacia 0km</CardDescription>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg ">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#BB271A"
                                >
                                    <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/>
                                </svg>
                            </div>                      
                        </div>

                    </div>
                </CardHeader>
                <CardContent>
                    <Image src="/Leo.webp" alt="Mascota" width={100} height={100}></Image>
                </CardContent>
            </Card>
        </section>
      </div>
    );
  }
  
  