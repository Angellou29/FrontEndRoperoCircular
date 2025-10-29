// src/pages/catalogo/Evento.tsx
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import ImagenEvento from '../../../imagenes/evento.jpg';
import '../../css/evento.css';

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  direccion: string;
  descripcion: string;
}

function Evento() {
  const [evento, setEvento] = useState<Evento | null>(null);

  useEffect(() => {
    // Datos simulados del evento
    const eventoData: Evento = {
      id: 1,
      nombre: 'Gran Evento de Intercambio Textil Universitario',
      fecha: '1 de Octubre, 2025',
      hora: '10:00 AM - 2:00 PM',
      lugar: 'Universidad de Lima',
      direccion: 'Av. Javier Prado Este 4600, Lima 33, Lima',
      descripcion:
        'Únete a nuestro evento de intercambio de ropa donde podrás dar nueva vida a tu armario mientras contribuyes a la moda sostenible. Trae hasta 5 prendas en buen estado y encuentra nuevas piezas para tu estilo.',
    };
    setEvento(eventoData);
  }, []);

  if (!evento) return <div className="container py-5">Cargando…</div>;

  return (
    <div className="evento-page">
      {/* HERO */}
      <section className="evento-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h1 className="evento-titulo">{evento.nombre}</h1>
              <p className="evento-descripcion">{evento.descripcion}</p>

              <div className="evento-info">
                <div className="info-item">
                  <i className="bi bi-calendar-event" />
                  <span>{evento.fecha}</span>
                </div>
                <div className="info-item">
                  <i className="bi bi-clock" />
                  <span>{evento.hora}</span>
                </div>
                <div className="info-item">
                  <i className="bi bi-geo-alt" />
                  <span>
                    {evento.lugar}, {evento.direccion}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <img
                src={ImagenEvento}
                alt="Evento de intercambio"
                className="evento-imagen img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="evento-ubicacion py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">¿Cómo llegar?</h2>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="mapa-container">
                <div className="ratio ratio-16x9">
                  <iframe
                    title="Mapa Universidad de Lima"
                    src="https://www.google.com/maps?q=Universidad%20de%20Lima%2C%20Av.%20Javier%20Prado%20Este%204600%2C%20Lima%2033%2C%20Lima&output=embed"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="ubicacion-info text-center mt-4">
                  <h5>{evento.lugar}</h5>
                  <p className="text-muted">{evento.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Evento;
