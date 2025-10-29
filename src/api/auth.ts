// src/api/apiauth.ts
import http from './http';
import type { RegistroDTO, LoginDTO, RegisterResponse, LoginResponse, Usuario } from '../types/auth.d';

const URL = '/api/usuarios';

/** POST /api/usuarios/registrar */
export async function registrarUsuario(body: RegistroDTO): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>(`${URL}/registrar`, body);
  return data;
}

/** POST /api/usuarios/login */
export async function iniciarSesion(payload: LoginDTO): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>(`${URL}/login`, payload);
  return data;
}

/**
 * GET /api/usuarios/:id
 * (Usa esto como “perfil” por ahora. Si luego creas /perfil con JWT en backend,
 * cambia esta función para llamarlo).
 */
export async function obtenerUsuarioPorId(id: number): Promise<Usuario> {
  const { data } = await http.get<Usuario>(`${URL}/${id}`);
  return data;
}

/**
 * PUT /api/usuarios/:id
 * Tu backend actual espera JSON (nombre/correo/password). Si no estás subiendo archivos,
 * no uses multipart.
 */
export async function actualizarUsuario(
  id: number,
  body: Partial<Pick<Usuario, 'nombre' | 'correo'>> & { password?: string }
): Promise<{ mensaje: string; usuario: Usuario }> {
  const { data } = await http.put<{ mensaje: string; usuario: Usuario }>(`${URL}/${id}`, body);
  return data;
}