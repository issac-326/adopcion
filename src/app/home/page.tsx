import Link from "next/link";
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
  import {faMagnifyingGlass, faChevronDown, faSliders} from '@fortawesome/free-solid-svg-icons'
  import {faBell} from '@fortawesome/free-regular-svg-icons'


export default function Home() {
    return (
      <div className="mx-2 text-[#03063a]">

        <div id="encabezado" className="mt-10 mb-2 flex justify-between text-[#03063a]">
            <div>  
                <div className="flex gap-2 text-sm text-gray-400">Location <FontAwesomeIcon icon={faChevronDown} className="w-3"/></div>  
                <div><span className="font-extrabold">TGU,</span> HN</div>        
            </div>
            <div className="flex gap-2">
                <span className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faMagnifyingGlass} className="w-6" /></span>

                <span className="bg-white h-12 w-12 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faBell} className="w-6"/></span>
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
            <h2 className="font-semibold">Categories</h2>
            <section className="flex gap-2">
                <span className="h-14 w-14 rounded-xl flex items-center justify-center bg-[#f7f7f8]"><FontAwesomeIcon icon={faSliders} className="w-6"/></span>
                <span className="h-14 w-14 rounded-xl flex items-center justify-center bg-[#f7f7f8]">All</span>
                <span className="h-14 w-14 rounded-xl flex items-center justify-center bg-[#f7f7f8]">All</span>
                <span className="h-14 w-14 rounded-xl flex items-center justify-center bg-[#f7f7f8]">All</span>
            </section>


        </div>
        <section className="mt-5">
            <h2 className="font-semibold">Adopt pet</h2>
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
        <footer className="fixed bottom-0 left-0 flex justify-around align-center bg-[#FE8A5B] h-[64px] w-full">
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B5563"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
            </div>
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B5563"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
            </div>
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B5563"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
            </div>
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B5563"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
            </div>
        </footer>
      </div>
    );
  }
  
  