// src/pages/autenticacion/IniciarSesion.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import LogoPrincipal from '../../../imagenes/Logo.png';
import { iniciarSesion as apiIniciarSesion } from '../../api/auth'; // ← usa tu api
import { useUser } from '../../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/login.css'; // ← nuevo css específico para login

function IniciarSesion() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser(); // usa el contexto para guardar user+token

  const manejarInicioSesion = async () => {
    setMensajeError('');

    if (!correo || !password) {
      setMensajeError('Por favor completa todos los campos.');
      return;
    }

    try {
      setEnviando(true);
      const correoNorm = correo.trim().toLowerCase();

      // Usa el contexto que ya llama a la API y persiste token+usuario
      await login({ correo: correoNorm, password });

      navigate('/Inicio');
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setMensajeError(
        err?.response?.data?.error ||
        err?.message ||
        'Error de conexión con el servidor.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const manejarPulsacionTecla = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') manejarInicioSesion();
  };

  return (
    <div className="lc-root">
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
        {/* Logo + título */}
        <div className="lc-header d-flex flex-column align-items-center mb-4">
          <div className="lc-logoCircle mb-3">
            <img src={LogoPrincipal} className="lc-logo" alt="Logo Ropero Circular" />
          </div>
          <h1 className="lc-title text-center mb-2">Ropero Circular</h1>
          <p className="text-center lc-subtitle mb-4">
            ¡Bienvenido a la red de intercambio textil universitario!
          </p>
        </div>

        {/* Formulario */}
        <div className="lc-card w-100" style={{ maxWidth: 400 }}>
          {mensajeError && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setMensajeError('')}
              className="mb-4"
            >
              {mensajeError}
            </Alert>
          )}

          <Form.Group className="mb-4">
            <Form.Label className="lc-label">Correo Electrónico</Form.Label>
            <div className="input-group">
              <span className="input-group-text lc-inputAdornment">
                <i className="bi bi-envelope" />
              </span>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onKeyDown={manejarPulsacionTecla}
                className="lc-input"
                autoFocus
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="lc-label">Contraseña</Form.Label>
            <div className="input-group">
              <span className="input-group-text lc-inputAdornment">
                <i className="bi bi-lock" />
              </span>
              <Form.Control
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={manejarPulsacionTecla}
                className="lc-input"
              />
              <button
                type="button"
                className="input-group-text lc-inputAdornment lc-toggle"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`bi ${mostrarPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </Form.Group>

          <button
            id="boton-iniciar-sesion"
            className="btn lc-submit w-100 py-3 mb-4"
            onClick={manejarInicioSesion}
            disabled={!correo || !password || enviando}
          >
            {enviando ? 'Ingresando…' : 'Iniciar Sesión'}
          </button>

          <div className="text-center">
            <p className="text-muted mb-0">¿Nuevo en Ropero Circular?</p>
            <Link to="/registro" className="btn btn-link p-0 lc-link">
              Crea tu cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IniciarSesion;
