import http from './http';

export type RopaItem = {
  id: number;
  categoria: string;
  talla: string;
  genero?: string | null;
  estado: number;            // 1..4
  colores: string[];         // array de enums/strings normalizados
  estilo: string;
  material?: string | null;
  descripcion: string;
  estadoPub?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  motivoRechazo?: string | null; // para mostrar al dueño
  usuarioId: number;
};

const URL = '/api/ropa';

// Helper para construir la URL de imagen servida por backend
export function imagenDe(ropaId: number, orden = 0) {
  // http.defaults.baseURL ya debe estar configurada (p.ej. VITE_API_URL)
  return `${http.defaults.baseURL}${URL}/${ropaId}/imagen/${orden}`;
}

// Listado (admite filtros + scope de moderación)
export async function listarRopa(params?: {
  categoria?: string;
  talla?: string;
  genero?: string;
  estilo?: string;
  estado?: string | number;
  color?: string;
  q?: string;
  scope?: 'moderacion'; // 👈 aquí va el scope (solo esto o undefined)
}) {
  const { data } = await http.get<RopaItem[]>(URL, { params });
  return data;
}

// Crear (multipart) — nombre de campo de archivos: "imagenes"
export async function crearRopaMultipart(payload: {
  categoria: string;
  talla: string;
  estado: string | number;
  colores: string[];      // strings de enum
  estilo: string;
  descripcion: string;
  genero?: string | null;
  material?: string | null;
  imagenFiles?: File[];   // 0..3 imágenes
}) {
  const fd = new FormData();
  fd.append('categoria', payload.categoria);
  fd.append('talla', payload.talla);
  fd.append('estado', String(payload.estado));
  fd.append('estilo', payload.estilo);
  fd.append('descripcion', payload.descripcion);
  if (payload.genero !== undefined) fd.append('genero', payload.genero ?? '');
  if (payload.material !== undefined) fd.append('material', payload.material ?? '');
  // el backend acepta "colores" como lista separada por coma
  fd.append('colores', payload.colores.join(','));

  (payload.imagenFiles ?? []).slice(0, 3).forEach((f) => {
    fd.append('imagenes', f);
  });

  const { data } = await http.post(`${URL}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function moderarRopa(
  id: number,
  accion: 'APROBAR' | 'RECHAZAR',
  motivo?: string
) {
  const { data } = await http.patch(`${URL}/${id}/moderar`, { accion, motivo });
  return data;
}