// Utilidades para formatear información de perfiles

export const formatRelationshipGoal = (goal: string | null | undefined): string => {
  if (!goal) return '';
  
  const goals: Record<string, string> = {
    'amistad': '👥 Amistad',
    'relacion_seria': '❤️ Relación seria',
    'solo_sexo': '🔥 Solo sexo',
  };
  
  return goals[goal] || '';
};

export const formatGender = (gender: string | null | undefined): string => {
  if (!gender) return '';
  
  const genders: Record<string, string> = {
    'hombre': '👨 Hombre',
    'mujer': '👩 Mujer',
    'gay': '🏳️‍🌈 Gay',
    'trans': '🏳️‍⚧️ Trans',
  };
  
  return genders[gender] || '';
};

export const formatRole = (role: string | null | undefined): string => {
  if (!role) return '';
  
  const roles: Record<string, string> = {
    'activo': '🔵 Activo',
    'pasivo': '🔴 Pasivo',
    'versatil': '⚪ Versátil',
  };
  
  return roles[role] || '';
};

