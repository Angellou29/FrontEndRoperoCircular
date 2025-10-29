import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Registro from './pages/autenticacion/Registro';
import IniciarSesion from './pages/autenticacion/IniciarSesion';
import Inicio from './pages/catalogo/Inicio';
import Catalogo from './pages/catalogo/Catalogo';
import Evento from './pages/catalogo/Evento';

import { UserProvider } from './context/UserContext';
import RequireAuth from './context/RequireAuth';
import ProtectedLayout from './layouts/ProtectedLayout'; // ← nuevo

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No se encontró el elemento #root');

createRoot(rootElement).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter basename="RoperoCircular">
        <Routes>
          {/* públicas (sin navbar) */}
          <Route path="/" element={<Navigate to="/IniciarSesion" replace />} />
          <Route path="/IniciarSesion" element={<IniciarSesion />} />
          <Route path="/Registro" element={<Registro />} />

          {/* protegidas (con navbar dentro del layout) */}
          <Route
            element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }
          >
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/Catalogo" element={<Catalogo />} />
            <Route path="/Evento" element={<Evento />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 24 }}>Página no encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);
