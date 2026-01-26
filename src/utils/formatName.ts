export const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Normaliza o nome do jogador: converte para maiúsculas, remove acentos e caracteres especiais
 * Permite apenas letras, números e espaços
 * @param text - Texto a ser normalizado
 * @param trimEnd - Se true, remove espaços no início e fim (para validação final). Se false, mantém espaços (para digitação)
 */
export const normalizePlayerName = (text: string, trimEnd: boolean = false): string => {
  if (!text) {
    return '';
  }
  
  // Remove acentos
  let normalized = removeAccents(text);
  
  // Converte para maiúsculas
  normalized = normalized.toUpperCase();
  
  // Remove caracteres especiais, mantém apenas letras, números e espaços
  normalized = normalized.replace(/[^A-Z0-9\s]/g, '');
  
  // Remove espaços múltiplos (substitui múltiplos espaços por um único espaço)
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Remove espaços no início e fim apenas se trimEnd for true
  if (trimEnd) {
    normalized = normalized.trim();
  }
  
  return normalized;
};

export const formatPartnerName = (username: string): string => {
  if (!username) {
    return '';
  }

  if (username.includes(' ') || /[A-Z]/.test(username)) {
    return username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .trim();
  }

  const lowerUsername = username.toLowerCase();
  
  const commonNamePatterns = [
    { pattern: /^jorgeermelindo$/i, result: 'Jorge Ermelindo' },
    { pattern: /^([a-z]{4,10})([a-z]{4,10})$/i, result: (match: RegExpMatchArray) => 
      match[1].charAt(0).toUpperCase() + match[1].slice(1) + ' ' + 
      match[2].charAt(0).toUpperCase() + match[2].slice(1)
    },
  ];

  for (const { pattern, result } of commonNamePatterns) {
    const match = lowerUsername.match(pattern);
    if (match) {
      if (typeof result === 'function') {
        return result(match);
      }
      return result;
    }
  }

  const capitalized = username.charAt(0).toUpperCase() + username.slice(1);
  return capitalized;
};

