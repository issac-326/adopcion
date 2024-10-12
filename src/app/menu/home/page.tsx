'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PetCard from "@/components/ui/PetCard";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {faMagnifyingGlass, faChevronDown, faSliders, faGear, faChevronRight} from '@fortawesome/free-solid-svg-icons'
  import {faBell, faUser, faHeart, faCommentDots, } from '@fortawesome/free-regular-svg-icons'
import MenuCategorias from '@/components/MenuCategorias';


export default function Home() {
   

    return (
      <div>

        <MenuCategorias />
        <section className="grid grid-cols-2 gap-4 mt-2">
            <PetCard />

        </section>
      </div>
    );
  }

  
  