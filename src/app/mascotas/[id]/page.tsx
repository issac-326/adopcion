import Image from "next/image";

const Macotas = () => {
    return (
        <div>
            <Image src="/Leo.webp" alt="Mascota" width={190} height={200} />

            <section>
                <div>
                    <h1>Doggi</h1>
                    <div>TGU, HN</div>
                </div>
                <div>
                    Corazon
                </div>
            </section>
            <section>
                <div>
                    <p>Male</p>
                    <p>Sex</p>
                </div>
                <div>
                    <p>Male</p>
                    <p>Sex</p>
                </div>
                <div>
                    <p>Male</p>
                    <p>Sex</p>
                </div>
            </section>
            <section>
                <div>
                    <Image src="/Leo.webp" alt="Mascota" width={190} height={200} />
                    <div>
                        <p>Sophia</p>
                        <p>Propietario</p>
                    </div>
                </div>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, atque expedita? Quam nemo voluptatibus beatae. Eos nam necessitatibus non facere fugiat repudiandae! Dolores provident adipisci eos fugiat nulla, deserunt in.
                </div>
            </section>
            <button>Adopt me</button>

        </div>
    );
}

export default Macotas;