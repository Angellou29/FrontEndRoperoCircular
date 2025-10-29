// src/context/RequireAuth.tsx
import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type RequireAuthProps = {
  /** Ruta a donde redirigir si no hay sesión */
  redirectTo?: string;
  /** Si lo usas como wrapper: <RequireAuth>{children}</RequireAuth> */
  children?: ReactNode;
};

/**
 * Protege rutas que requieren sesión iniciada.
 * - Si hay token/usuario -> renderiza children o <Outlet/>
 * - Si NO hay sesión -> redirige a `redirectTo` (incluye `state.from` para poder volver)
 */
export default function RequireAuth({
  redirectTo = '/IniciarSesion', // ← ajusta si tu ruta de login es /login
  children,
}: RequireAuthProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location }} // para volver luego del login
      />
    );
  }

  // Soporta ambos usos: wrapper o <Route element={<RequireAuth/>}><Route .../></Route>
  return children ? <>{children}</> : <Outlet />;
}
