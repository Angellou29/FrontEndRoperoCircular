import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/footer.css';

function Footer() {
  return (
    <footer className="footer-circular">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Info */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h5 className="footer-title">Ropero Circular</h5>
            <p>Intercambia, reutiliza y dale nueva vida a tu ropa. 🌱</p>
          </div>

          {/* Contacto + redes */}
          <div className="col-md-6">
            <h5 className="footer-title">Contacto</h5>
            <p className="mb-3">
              <i className="bi bi-envelope-fill me-2" />
              <a className="footer-link" href="mailto:Roperocircular5@gmail.com">
                Roperocircular5@gmail.com
              </a>
            </p>

            <h6 className="footer-subtitle">Síguenos</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a
                href="https://www.tiktok.com/@ropero.circular2"
                className="social-link"
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-tiktok" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center small-text">
          <p>© {new Date().getFullYear()} Ropero Circular — Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
