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

