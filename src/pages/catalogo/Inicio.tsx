import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import ImagenIntercambio from '../../../imagenes/intercambio.jpg';
import ConsideracionesImg from '../../../imagenes/consideraciones.jpeg'; // ← guarda tu imagen con este nombre
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/inicio.css'; // ← nuevo css específico de la página
//hola

function Inicio() {

  return (
    <div id="ropero-page-container">

      {/* HERO */}
      <section className="hero-section text-white">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Ropero Circular</h1>
              <p className="lead mb-4">
                Intercambia, reutiliza y dale nueva vida a tu ropa.
                Únete a la comunidad universitaria que promueve la moda sostenible.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/Catalogo" className="btn btn-light fw-semibold">Ver Catálogo</Link>
                <Link to="/Evento" className="btn btn-outline-light fw-semibold">Próximo Evento</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src={ImagenIntercambio}
                alt="Intercambio de ropa entre estudiantes"
                className="img-fluid rounded shadow hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* REGLAS */}
      <section className="reglas-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow border-0">
                <div className="card-header bg-primary text-white text-center py-4">
                  <h2 className="mb-0">Reglas del Intercambio</h2>
                </div>
                <div className="card-body p-5">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="regla-icono bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-1-circle-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-primary">Límite de Prendas</h4>
                          <p className="text-muted">
                            Máximo <strong>5 prendas y/o accesorios</strong> por día.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="regla-icono bg-success text-white rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-2-circle-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-success">Sistema de Puntos</h4>
                          <p className="text-muted">
                            Se otorgan <strong>10, 20, 30, 40 y 50</strong> puntos según el tipo de prenda/accesorio.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="regla-icono bg-info text-white rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-3-circle-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-info">Variedad</h4>
                          <p className="text-muted">
                            Se aceptan prendas y/o accesorios de <strong>hombre, mujer y niño/a</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="regla-icono bg-warning text-white rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-4-circle-fill"></i>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-warning">Estado</h4>
                          <p className="text-muted">
                            Prendas en <strong>buen estado</strong>, limpias y listas para usar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mt-2">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Importante:</strong> trae prendas sin manchas/roturas, sin pelusas ni olores.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSIDERACIONES (Imagen que enviaste) */}
      <section className="py-5 consideraciones-section">
        <div className="container">
          <h2 className="section-title text-center mb-4">Consideraciones y Puntajes</h2>
          <div className="d-flex justify-content-center">
            <img
              src={ConsideracionesImg}
              alt="Consideraciones y puntos por tipo de prenda"
              className="img-fluid rounded shadow consideraciones-img"
            />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="beneficios-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Beneficios de Participar</h2>
            <p className="text-muted">Descubre por qué unirte al Ropero Circular</p>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm text-center card-hover">
                <div className="card-body p-4">
                  <div className="beneficio-icono mb-3">
                    <i className="bi bi-arrow-repeat display-4 text-primary"></i>
                  </div>
                  <h4 className="card-title">Economía Circular</h4>
                  <p className="card-text text-muted">
                    Reduce el desperdicio textil y promueve un consumo responsable.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm text-center card-hover">
                <div className="card-body p-4">
                  <div className="beneficio-icono mb-3">
                    <i className="bi bi-wallet2 display-4 text-success"></i>
                  </div>
                  <h4 className="card-title">Ahorro Económico</h4>
                  <p className="card-text text-muted">
                    Renueva tu armario sin gastar: intercambia prendas gratuitamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm text-center card-hover">
                <div className="card-body p-4">
                  <div className="beneficio-icono mb-3">
                    <i className="bi bi-people display-4 text-info"></i>
                  </div>
                  <h4 className="card-title">Comunidad</h4>
                  <p className="card-text text-muted">
                    Conecta con estudiantes fans de la moda sostenible.
                  </p>
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

export default Inicio;
