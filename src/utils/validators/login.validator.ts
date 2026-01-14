export type LoginValidationResult = {
  isValid: boolean;
  error: string | null;
};

type ValidateLoginFormParams = {
  username: string;
  password: string;
};

export const validateLoginForm = ({ username, password }: ValidateLoginFormParams): LoginValidationResult => {
  if (!username.trim() || !password.trim()) {
    return {
      isValid: false,
      error: 'Preencha todos os campos.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

