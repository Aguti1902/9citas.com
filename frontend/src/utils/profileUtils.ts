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
  };
  
  return genders[gender] || '';
};

