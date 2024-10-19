'use client';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faLocationDot, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

const Mascotas = () => {
  return (
    <div style={{ display: 'flex', height: '100vh'}}>
      
      {/* Información */}
      <div style={{ flex: 1, padding: '50px', display: 'flex', 
        flexDirection: 'column', justifyContent: 'space-between', borderTopRightRadius: '50px',
        borderBottomRightRadius: '50px', backgroundColor: 'white' , 
        boxShadow: '5px 5px 15px rgba(0, 0, 0.2, 0.2)'}}>
        
        {/* Botón para regresar */}
        <div className=" bg-white rounded-full w-12 h-12 flex items-center justify-center hover:scale-110" style={{
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
            }}>
          <button><FontAwesomeIcon icon={faAngleLeft} className="text-red-500" style={{ fontSize: '25px' }} /></button>
        </div>

        {/* Nombre y ubicación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Doggi</h1>
            <div style={{ fontSize: '16px', color: 'gray', display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faLocationDot} style={{ color: '#2196F3', marginRight: '8px' }} />
              TGU, HN
            </div>
          </div>
          <button
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
            }}
          >
              <FontAwesomeIcon icon={faHeart} className="text-red-500" style={{ fontSize: '25px' }}  />
          </button>
        </div>

        {/*  Descripción y detalles */}
        <div>
                   
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                className="hover:scale-110"
                  style={{
                    flex: 1,
                    backgroundColor: '#A5D6A7',
                    padding: '10px',
                    borderRadius: '15px', 
                    marginRight: '15px',
                    position: 'relative', 
                  }}
                >
                  <h2 style={{ fontWeight: 'bold'}} >Macho</h2>
                  <p style={{ fontSize: '12px', color: 'gray'}}>Sexo</p>
                  <FontAwesomeIcon
                    icon={faPaw}
                    rotation={180}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '15px',
                      color: '#4CAF50', 
                      opacity: 0.3,
                      transform: 'rotate(-30deg)',
                      fontSize: '40px',
                    }}
                  />
                </div>
                <div
                  className="hover:scale-110"
                  style={{
                    flex: 1,
                    backgroundColor: '#FFCC80',
                    padding: '10px',
                    borderRadius: '15px',
                    marginRight: '15px',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <h2 style={{ fontWeight: 'bold'}}>1 año</h2>
                  <p style={{ fontSize: '12px', color: 'gray'}}>Edad</p>
                  <FontAwesomeIcon
                    icon={faPaw}
                    rotation={180}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '15px',
                      color: '#FF9800', 
                      opacity: 0.3,
                      transform: 'rotate(-30deg)',
                      fontSize: '40px',
                    }}
                  />
                </div>
 
                <div
                  className="hover:scale-110"
                  style={{
                    flex: 1,
                    backgroundColor: '#90CAF9', 
                    padding: '10px',
                    borderRadius: '15px',
                    marginRight: '15px',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <h2 style={{ fontWeight: 'bold'}}>10kg</h2>
                  <p style={{ fontSize: '12px', color: 'gray'}}>Peso</p>
                  <FontAwesomeIcon
                    icon={faPaw}
                    rotation={180}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '15px',
                      color: '#2196F3',
                      opacity: 0.3,
                      transform: 'rotate(-30deg)',
                      fontSize: '40px',
                    }}
                  />
                </div>
          </div>
          <div style={{ marginTop: '50px' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt, atque expedita? Quam nemo voluptatibus beatae.
          </div>
        </div>

        {/* PImagen y nombre del dueño */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/Leo.webp" alt="Propietario" width={70} height={70} style={{ borderRadius: '50%' }} />
          <div style={{ marginLeft: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>Sophia</p>
          </div>
        </div>

        {/* Botón de Adoptar */}
        <div>
          <button
            style={{
              width: '100%',
              padding: '15px 0',
              backgroundColor: '#FFA07A',
              borderRadius: '30px',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Adoptar
          </button>
        </div>
      </div>
      {/* Lado derecho Imagen de la mascota */}
      <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomRightRadius: '50px',
          }}
        >
          <Image src="/misty.avif" alt="Mascota" width={300} height={300} />
        </div>
    </div>
  );
};

export default Mascotas;
