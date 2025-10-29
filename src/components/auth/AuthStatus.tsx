// src/components/auth/AuthStatus.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AuthStatus() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-sm">
        <Link to="/IniciarSesion" className="underline">
          Iniciar sesión
        </Link>
        {' '}/{' '}
        <Link to="/registro" className="underline">
          Crear cuenta
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="opacity-80">
        {user?.nombre} <span className="opacity-60">({user?.correo})</span>
      </span>
      <button
        onClick={logout}
        className="border px-2 py-1 rounded hover:bg-gray-100 transition"
        type="button"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
