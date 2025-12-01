/**
 * Convierte URLs relativas de fotos a URLs absolutas
 * Si la URL empieza con /fake-photos/, la convierte a la URL completa del backend
 */
export function normalizePhotoUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Si ya es una URL absoluta (http/https), devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una URL relativa que empieza con /fake-photos/, convertirla a URL absoluta
  if (url.startsWith('/fake-photos/')) {
    // En producción, usar la URL del backend desde Railway
    // En desarrollo, usar localhost
    const backendUrl = process.env.BACKEND_URL 
      || process.env.RAILWAY_PUBLIC_DOMAIN 
      || (process.env.NODE_ENV === 'production' ? 'https://9citascom-production.up.railway.app' : 'http://localhost:4000');
    // Eliminar /api si está presente
    const baseUrl = backendUrl.replace(/\/api$/, '');
    return `${baseUrl}${url}`;
  }
  
  // Si es una URL relativa que empieza con /uploads/, convertirla a URL absoluta
  if (url.startsWith('/uploads/')) {
    // En producción, usar la URL del backend desde Railway
    const backendUrl = process.env.BACKEND_URL 
      || process.env.RAILWAY_PUBLIC_DOMAIN 
      || (process.env.NODE_ENV === 'production' ? 'https://9citascom-production.up.railway.app' : 'http://localhost:4000');
    const baseUrl = backendUrl.replace(/\/api$/, '');
    return `${baseUrl}${url}`;
  }
  
  // Para otras URLs relativas, devolverlas tal cual (pueden ser de Cloudinary, etc.)
  return url;
}

/**
 * Normaliza todas las URLs de fotos en un objeto de perfil
 */
export function normalizeProfilePhotos(profile: any): any {
  if (!profile) return profile;
  
  if (profile.photos && Array.isArray(profile.photos)) {
    profile.photos = profile.photos.map((photo: any) => ({
      ...photo,
      url: normalizePhotoUrl(photo.url),
    }));
  }
  
  return profile;
}

/**
 * Normaliza URLs de fotos en un array de perfiles
 */
export function normalizeProfilesPhotos(profiles: any[]): any[] {
  return profiles.map(profile => normalizeProfilePhotos(profile));
}

