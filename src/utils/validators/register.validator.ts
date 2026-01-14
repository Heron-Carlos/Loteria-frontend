export type RegisterValidationResult = {
  isValid: boolean;
  error: string | null;
};

type ValidateRegisterFormParams = {
  username: string;
  password: string;
  confirmPassword: string;
  megaSigla: string;
  quinaSigla: string;
};

export const validateRegisterForm = ({
  username,
  password,
  confirmPassword,
  megaSigla,
  quinaSigla,
}: ValidateRegisterFormParams): RegisterValidationResult => {
  if (!username.trim() || !password.trim() || !confirmPassword.trim() || !megaSigla.trim() || !quinaSigla.trim()) {
    return {
      isValid: false,
      error: 'Preencha todos os campos.',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'A senha deve ter no mínimo 6 caracteres.',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'As senhas não coincidem.',
    };
  }

  if (megaSigla.length > 10) {
    return {
      isValid: false,
      error: 'A sigla da Mega deve ter no máximo 10 caracteres.',
    };
  }

  if (quinaSigla.length > 10) {
    return {
      isValid: false,
      error: 'A sigla da Quina deve ter no máximo 10 caracteres.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

