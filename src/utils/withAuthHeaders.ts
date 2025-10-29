// src/utils/withAuthHeaders.ts
import { getToken } from './tokenStorage';

type HeadersInput =
  | HeadersInit
  | Record<string, string | number | boolean | undefined | null>;

/**
 * Devuelve un objeto de headers con Authorization Bearer si hay token,
 * fusionado con headers extra que le pases.
 */
export function withAuthHeaders(extra?: HeadersInput): HeadersInit {
  const token = getToken();
  const base: Record<string, string> = {};

  if (token) base['Authorization'] = `Bearer ${token}`;

  // Normaliza extra en un diccionario plano de strings
  if (extra) {
    const entries: [string, string][] = [];
    if (extra instanceof Headers) {
      extra.forEach((v, k) => entries.push([k, String(v)]));
    } else if (Array.isArray(extra)) {
      (extra as [string, string][]).forEach(([k, v]) => entries.push([k, String(v)]));
    } else {
      Object.entries(extra as Record<string, unknown>).forEach(([k, v]) => {
        if (v !== undefined && v !== null) entries.push([k, String(v)]);
      });
    }
    for (const [k, v] of entries) base[k] = v;
  }

  return base;
}
