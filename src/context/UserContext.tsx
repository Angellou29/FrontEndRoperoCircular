// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario, LoginDTO, RegistroDTO, AuthContextValue } from '../types/auth.d';
import { iniciarSesion, registrarUsuario } from '../api/auth';
import { getToken, setToken, setUser, getUser, clearAuth } from '../utils/tokenStorage';

const UserContext = createContext<AuthContextValue | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de un UserProvider');
  return ctx;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  // Estado inicial desde localStorage
  useEffect(() => {
    const t = getToken();
    const u = getUser<Usuario>();
    if (t && u) {
      setTokenState(t);
      setUsuario(u);
    }
  }, []);

  // Logout centralizado (NO emite eventos para evitar loops)
  const logout = () => {
    setUsuario(null);
    setTokenState(null);
    clearAuth(); // limpia token+usuario en storage, sin broadcast
  };

  // Escuchar 401 emitidos por http.ts (un solo sentido; no volvemos a emitir)
  useEffect(() => {
    const handler = () => {
      setUsuario(null);
      setTokenState(null);
      clearAuth();
      // aquí puedes redirigir si quieres:
      // navigate('/IniciarSesion');
    };
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  // Login → guarda token y usuario
  const login = async (dto: LoginDTO) => {
    const res = await iniciarSesion(dto); // { mensaje, token, usuario }
    setToken(res.token);        // guarda en localStorage
    setTokenState(res.token);   // estado react
    setUser(res.usuario);       // guarda usuario en localStorage
    setUsuario(res.usuario);    // estado react
  };

  // Registro → (auto-login opcional) y devuelve la respuesta tipada
  const register = async (dto: RegistroDTO) => {
    const res = await registrarUsuario(dto); // { mensaje, usuario }
    await login({ correo: dto.correo, password: dto.password });
    return res;
  };

  const value: AuthContextValue = useMemo(
    () => ({
      usuario,
      token,
      isAuthenticated: Boolean(usuario && token),
      login,
      register,
      logout,
    }),
    [usuario, token]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
