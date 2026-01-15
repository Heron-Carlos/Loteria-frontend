export const getInitials = (username: string): string => {
  const parts = username.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    Partner: 'Sócio',
    Admin: 'Administrador',
  };
  return roleMap[role] || role;
};

