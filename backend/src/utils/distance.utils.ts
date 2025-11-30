/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param lat1 Latitud del punto 1
 * @param lon1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lon2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Formatea la distancia para mostrar al usuario
 * @param distance Distancia en kilómetros
 * @returns String formateado (ej: "2.5 km", "< 1 km")
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return '< 1 km';
  }
  if (distance < 10) {
    return `${distance.toFixed(1)} km`;
  }
  return `${Math.round(distance)} km`;
};

