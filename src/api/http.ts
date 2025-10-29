import axios from 'axios';

/**
 * Instancia Axios centralizada para el frontend.
 * - Lee baseURL de variables de entorno (Vite) con fallback a localhost.
 * - Ajusta timeout y Content-Type.
 * - Inyecta JWT si existe.
 * - Maneja 401/403 sin romper la sesión en 403.
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: Number(import.meta.env.VITE_HTTP_TIMEOUT ?? 10000), // 10s por defecto
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: false // usamos JWT en Authorization
});

// ===== Request: inyectar Authorization Bearer si hay token =====
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    (config.headers as any) = (config.headers as any) ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response: manejo centralizado =====
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Solo en 401 (no autenticado) limpiamos sesión
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // 403 = Prohibido (rol insuficiente). NO cerrar sesión.
    // Solo dejamos que el caller maneje el error y muestre mensaje.

    return Promise.reject(error);
  }
);

export default http;

/**
 * Notas:
 * - En tu .env (Vite):
 *     VITE_API_URL="http://localhost:3001"
 *     VITE_HTTP_TIMEOUT=10000
 *
 * - En tu UserContext, escucha el evento para cerrar sesión/redirigir:
 *   useEffect(() => {
 *     const handler = () => logout(); // limpiar estado y router.push('/IniciarSesion')
 *     window.addEventListener('auth:unauthorized', handler);
 *     return () => window.removeEventListener('auth:unauthorized', handler);
 *   }, []);
 */
