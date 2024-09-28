import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
      <div className="bg-gray-900">

        <div id="encabezado">
            <div>
                Lupita
            </div>
            <div>
                Bell
            </div>
        </div>
        <div id="imagen" className="h-[166px] w-full bg-slate-200 ">

        </div>
        <div>
            <h1>Categoria</h1>
            <div>Cats</div>
            <div>Dogs</div>
            <div>Birds</div>
        </div>
        <section>
            <h1>Adopt pet</h1>
        </section>
        <footer className="fixed bottom-0 left-0 flex justify-around bg-yellow-500 h-[64px] w-full align-middle">
            <div className="flex align-center">
                <Image  src="/bell.svg" alt="Notification bell" width={25} height={25} />
            </div>
            <div className="flex align-center">
                <Image  src="/bell.svg" alt="Notification bell" width={25} height={25} />
            </div>
            <div className="flex align-center">
                <Image  src="/bell.svg" alt="Notification bell" width={25} height={25} />
            </div>
            <div className="flex align-center">
                <Image  src="/bell.svg" alt="Notification bell" width={25} height={25} />
            </div>
        </footer>
      </div>
    );
  }
  
  