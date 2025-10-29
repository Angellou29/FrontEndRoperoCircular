// src/hooks/useAuth.ts
// Azúcar sintáctico sobre el UserContext: exporta un hook único con helpers.

import { useUser } from '../context/UserContext';
import type { Role, Usuario } from '../types/auth.d';

export function useAuth() {
  const ctx = useUser();

  // Helpers comunes para la UI
  const isAuthenticated = ctx.isAuthenticated;
  const user: Usuario | null = ctx.usuario;
  const token = ctx.token;

  const role: Role | undefined = user?.role;
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  return {
    // estado
    user,
    token,
    isAuthenticated,

    // roles
    role,
    isAdmin,
    isUser,

    // acciones
    login: ctx.login,
    register: ctx.register,
    logout: ctx.logout,
  };
}

export {};