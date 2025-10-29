import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../imagenes/Logo.png';
import { useUser } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/navbar.css';

export default function NavbarRC() {
  const { usuario, logout } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Cerrar al hacer click fuera o presionar ESC
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const inicial = (usuario?.nombre || usuario?.correo || '?').charAt(0).toUpperCase();

  const handleLogout = () => {
    logout?.();
    navigate('/IniciarSesion', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-rc sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/Inicio">
          <img src={Logo} alt="Ropero Circular" width={42} height={42} className="rounded-circle" />
          <span className="fw-bold">Ropero Circular</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          {/* Links centrales */}
          <ul className="navbar-nav mx-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink to="/Inicio" className="nav-link">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Catalogo" className="nav-link">Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Evento" className="nav-link">
                <i className="bi bi-calendar-event me-1" />Evento
              </NavLink>
            </li>
          </ul>

          {/* Usuario */}
          <div className="user-menu ms-auto" ref={menuRef}>
            <button
              className="btn user-btn d-flex align-items-center gap-2"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="menu"
            >
              <span className="user-avatar">{inicial}</span>
              <span className="user-name">{usuario?.nombre || usuario?.correo || 'Mi cuenta'}</span>
              <i className={`bi ${open ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} />
            </button>

            {open && (
              <div className="user-dropdown" role="menu">
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/Inicio'); }}>
                  Inicio
                </button>
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/Catalogo'); }}>
                  Ver prendas
                </button>
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/Evento'); }}>
                  Eventos
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
