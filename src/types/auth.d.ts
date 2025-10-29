// src/types/auth.d.ts

// ===== Tipos base de Auth =====
export type Role = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  role?: Role; // puede no venir en algunos endpoints
}

export interface RegistroDTO {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginDTO {
  correo: string;
  password: string;
}

// Respuesta del backend al registrar (no incluye token)
export interface RegisterResponse {
  mensaje: string;
  usuario: Usuario;
}

// Respuesta del backend al login (incluye token JWT)
export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

// ===== Contexto de autenticación (opcional, útil para UserContext) =====
export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: RegistroDTO) => Promise<RegisterResponse>; // ← antes era Promise<void>
  logout: () => void;
}
// ===== Variables de entorno de Vite (frontend) =====
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_HTTP_TIMEOUT?: string; // ms (string), la casteas a number donde la uses
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  // Para que TypeScript reconozca el evento que emitimos en http.ts
  interface WindowEventMap {
    'auth:unauthorized': CustomEvent<void>;
  }
}
