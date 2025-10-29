// src/context/RequireAdmin.tsx
import type { ReactNode } from 'react';                  // type-only (verbatimModuleSyntax)
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type RequireAdminProps = {
  /** A dónde enviar si NO hay sesión */
  redirectToLogin?: string;
  /** A dónde enviar si hay sesión pero NO es admin */
  redirectToFallback?: string;
  /** Uso como wrapper: <RequireAdmin>{children}</RequireAdmin> */
  children?: ReactNode;
};

/**
 * Protege rutas para rol ADMIN.
 * - Sin sesión: redirige a login.
 * - Con sesión pero sin rol ADMIN: redirige a fallback.
 * - ADMIN: renderiza children o <Outlet/>.
 */
export default function RequireAdmin({
  redirectToLogin = '/IniciarSesion',
  redirectToFallback = '/',
  children,
}: RequireAdminProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectToLogin}
        replace
        state={{ from: location }}
      />
    );
    // Alternativa: renderizar <Login /> aquí directamente (no recomendado).
  }

  if (!isAdmin) {
    return (
      <Navigate
        to={redirectToFallback}
        replace
        state={{ from: location, reason: 'forbidden' }}
      />
      // Alternativa: return <div>403 — No autorizado</div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
