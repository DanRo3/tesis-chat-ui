export function parseError(payload: unknown): string {
    if (typeof payload === 'string') return payload;
    if (payload && typeof payload === 'object') {
      if ('message' in payload) return payload.message as string;
      if ('detail' in payload) return payload.detail as string;
      return Object.entries(payload)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join(' | ');
    }
    return 'Error desconocido';
  }