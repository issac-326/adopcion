'use client'
import Link from "next/link";
import React, { useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {faMagnifyingGlass, faChevronDown, faSliders, faGear, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {faBell, faUser, faHeart, faCommentDots, } from '@fortawesome/free-regular-svg-icons'


export default function Home() {
    // Define el tipo como string o null
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const categories = ['All', 'Dogs', 'Cats', 'Birds'];

    return (
      <div className="mx-2 text-[#03063a]">

        <div id="encabezado" className="mt-10 mb-2 flex justify-between text-[#03063a]">
            <div>  
                <div className="flex gap-2 text-sm text-gray-400">Location <FontAwesomeIcon icon={faChevronDown} className="w-3"/></div>  
                <div><span className="font-extrabold">TGU,</span> HN</div>        
            </div>
            <div className="flex gap-2">
                <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faMagnifyingGlass} className="w-6" /></span>

                <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faBell} className="w-6"/></span>
            </div>
        </div>


        <div className="flex justify-center">
            <div id="imagen" className="h-[166px] w-[380px] bg-[#FE8A5B] rounded-[20px] grid grid-cols-2">
                <div className=" bg-[#FE8A5B] rounded-l-[20px] ">
                    <div className="mt-5 ml-5">
                        <p className="text-base text-white">Join Our Animal</p>
                        <p className="text-base text-white">Lovers Community</p>
                    </div>
                    <Button asChild className="mt-5 ml-5">
                        <Link href="/error">Join now</Link>
                    </Button>

                </div>
                <div className="bg-[#FE8A5B] flex flex-col-reverse rounded-r-[20px] ">
                    <Image  src="/promo.png" alt="promo" width={200} height={200} />
                </div>
            </div>
        </div>
        <div className="mt-5">
            <h2 className="text-texto my-3 font-semibold">Categories</h2>
            <section className="flex justify-between">
                <span
                    className={`h-14 w-14 rounded-xl flex items-center justify-center ${selectedCategory === null ? 'bg-[#FE8A5B] text-white' : 'bg-[#f7f7f8] text-black'}`}
                    onClick={() => setSelectedCategory(null)} // Esto solo cambiará su estilo
                >
                    <FontAwesomeIcon icon={faSliders} className="w-6" />
                </span>
                {categories.map((category, index) => (
                    <span
                        key={index}
                        className={`h-14 w-14 rounded-xl flex items-center justify-center ${selectedCategory === category ? 'bg-[#FE8A5B] text-white' : 'bg-[#f7f7f8] text-black'}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </span>
                ))}
            </section>


        </div>
        <section className="mt-5 flex justify-between items-center">
            <h2 className="font-semibold">Adopt pet</h2>
            <div className="text-[#FE8A5B] flex gap-2">
                <div className="flex text-xs">View All</div>
                <div className="bg-[#FE8A5B] w-4 h-4 rounded-sm flex items-center justify-center">
                    <FontAwesomeIcon icon={faChevronRight} className="w-1 text-white" />
                </div>
            </div>
        </section>
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
        <footer className="fixed bottom-0 left-0 flex justify-around items-center bg-white h-[64px] w-full text-gray-400 shadow-inner border-t border-gray-300">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-[#03063a]" />
            <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
            <FontAwesomeIcon icon={faCommentDots} className="w-5 h-5" />
            <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
        </footer>
      </div>
    );
  }
  
  