// src/pages/autenticacion/Registro.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { registrarUsuario } from '../../api/auth';
import LogoSesionCrear from '../../../imagenes/fondo.jpeg';
import LogoPrincipal from '../../../imagenes/Logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/regristo.css'; // <- nuevo css específico

function Registro() {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  const manejarEnvio = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError('');
    setMensajeExito('');

    const correoNorm = correo.trim().toLowerCase();
    if (!correoNorm.includes('@')) {
      setError('Correo inválido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const nuevoUsuario = { nombre: nombre.trim(), correo: correoNorm, password };

    try {
      setEnviando(true);
      const respuesta = await registrarUsuario(nuevoUsuario);

      if ((respuesta as any)?.error) {
        setError((respuesta as any).error);
      } else if (respuesta?.mensaje) {
        setMensajeExito('Registro exitoso. Redirigiendo…');
        setTimeout(() => navigate('/IniciarSesion'), 1500);
      } else {
        setError('Error inesperado en el registro.');
      }
    } catch (err: any) {
      console.error('Error al registrar:', err);
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al registrar. Intenta nuevamente.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="rc-container">
      {/* Sección del formulario */}
      <div className="rc-formSection">
        <div className="rc-logoHeader">
          <img src={LogoPrincipal} alt="Ropero Circular Logo" className="rc-logoImg" />
          <h1 className="rc-logoTitle">Ropero Circular</h1>
        </div>

        <div className="rc-formWrapper">
          <Form onSubmit={manejarEnvio} className="rc-form">
            <h2 className="rc-formTitle">Únete a la comunidad sostenible</h2>

            {error && <Alert variant="danger" className="rc-alert rc-alert-danger">{error}</Alert>}
            {mensajeExito && <Alert variant="success" className="rc-alert rc-alert-success">{mensajeExito}</Alert>}

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label className="rc-label">Nombre completo</Form.Label>
              <Form.Control
                className="rc-input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre completo"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label className="rc-label">Correo Electrónico</Form.Label>
              <Form.Control
                className="rc-input"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="rc-label">Contraseña</Form.Label>
              <Form.Control
                className="rc-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña segura"
                required
                minLength={6}
              />
              <Form.Text className="text-muted">Mínimo 6 caracteres</Form.Text>
            </Form.Group>

            <Button type="submit" className="rc-submitBtn" disabled={enviando}>
              {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>

            <div className="rc-loginRedirect">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/IniciarSesion">Inicia sesión</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>

      {/* Sección de imagen */}
      <div className="rc-imageSection">
        <img src={LogoSesionCrear} alt="Fondo" className="rc-backgroundImg" />
        <div className="rc-imageContent">
          <h2 className="rc-imageTitle">Únete al movimiento circular</h2>
          <p className="rc-imageSubtitle">Intercambia prendas, reduce residuos y ahorra recursos</p>

          <div className="rc-benefitsList">
            <div className="rc-benefitItem">
              <i className="fas fa-exchange-alt"></i>
              <span>Intercambia prendas con otros estudiantes</span>
            </div>
            <div className="rc-benefitItem">
              <i className="fas fa-leaf"></i>
              <span>Contribuye a la moda sostenible</span>
            </div>
            <div className="rc-benefitItem">
              <i className="fas fa-tshirt"></i>
              <span>Renueva tu armario sin gastar dinero</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Registro;
