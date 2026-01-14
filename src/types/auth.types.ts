export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  username: string;
  userId: string;
  role: string;
  megaSigla: string;
  quinaSigla: string;
};

export type Partner = {
  id: string;
  partnerId: string;
  username: string;
  megaSigla: string;
  quinaSigla: string;
};

