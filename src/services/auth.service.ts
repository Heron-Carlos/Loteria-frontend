import axios from 'axios';
import { IAuthService } from '../interfaces/services.interface';
import { LoginRequest, LoginResponse, Partner } from '../types/auth.types';

// Usar variável de ambiente ou detectar automaticamente em produção
const getApiBaseUrl = (): string => {
  // Se a variável de ambiente estiver definida, usar ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Em desenvolvimento, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // Em produção sem variável, tentar inferir do domínio atual
  const hostname = window.location.hostname;
  if (hostname.includes('vercel.app')) {
    // Tentar diferentes padrões de nome
    let backendHostname = hostname;
    
    // Padrão: loteria-frontend -> loteria-backend
    if (hostname.includes('loteria-frontend')) {
      backendHostname = hostname.replace('loteria-frontend', 'loteria-backend');
    }
    // Padrão: frontend -> backend
    else if (hostname.includes('-frontend')) {
      backendHostname = hostname.replace('-frontend', '-backend');
    }
    // Padrão: front -> back
    else if (hostname.includes('front')) {
      backendHostname = hostname.replace('front', 'back');
    }
    
    return `https://${backendHostname}`;
  }
  
  // Fallback: tentar usar o domínio atual (pode funcionar se backend e frontend estão no mesmo domínio)
  console.warn('VITE_API_URL não configurada. Tentando usar o domínio atual.');
  return `https://${hostname}`;
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/auth`;
const STORAGE_KEY = 'currentUser';

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
}

