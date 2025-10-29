// src/components/auth/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  /** Ruta a la que redirigir después de cerrar sesión (opcional) */
  redirectTo?: string;
  /** Texto del botón (por defecto: "Cerrar sesión") */
  label?: string;
  /** Clases extra para estilos */
  className?: string;
  /** Callback opcional al terminar logout */
  onLoggedOut?: () => void;
  /** Pedir confirmación antes de cerrar sesión */
  confirm?: boolean;
};

export default function LogoutButton({
  redirectTo,
  label = 'Cerrar sesión',
  className = '',
  onLoggedOut,
  confirm = false,
}: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (confirm && !window.confirm('¿Seguro que deseas cerrar sesión?')) return;

    logout(); // limpia token/usuario y emite 'auth:unauthorized'

    if (onLoggedOut) onLoggedOut();

    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`border px-3 py-1.5 rounded hover:bg-gray-100 transition ${className}`}
    >
      {label}
    </button>
  );
}
