import axios from 'axios';
import { IAuthService } from '../interfaces/services.interface';
import { LoginRequest, LoginResponse, RegisterRequest, Partner } from '../types/auth.types';

const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // Remover barra no final se existir
  return url.replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/auth`;
const STORAGE_KEY = 'currentUser';

// Log para debug (remover em produção se necessário)
if (import.meta.env.PROD) {
  console.log('API Base URL:', API_BASE_URL);
}

export class AuthService implements IAuthService {
  private currentUser: LoginResponse | null = null;

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  private saveUser(user: LoginResponse): void {
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/login`,
      request
    );
    this.saveUser(response.data);
    return response.data;
  }

  async register(request: RegisterRequest): Promise<void> {
    await axios.post(`${API_URL}/register`, request);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUser;
  }

  getAuthHeader(): Record<string, string> {
    if (!this.currentUser || !this.currentUser.token) {
      return {};
    }
    return { Authorization: `Bearer ${this.currentUser.token}` };
  }

  async getAllPartners(): Promise<Partner[]> {
    const response = await axios.get<Partner[] | Partner>(`${API_URL}/partners`);
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data && typeof data === 'object' && 'id' in data && 'partnerId' in data) {
      return [data as Partner];
    }
    
    return [];
  }

  async getPartnerByUsername(username: string, gameType: 'Mega' | 'Quina'): Promise<Partner | null> {
    try {
      const response = await axios.get<Partner>(`${API_URL}/partners/${username}`, {
        params: { gameType },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

