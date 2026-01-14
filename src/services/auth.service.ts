import axios from 'axios';
import { IAuthService } from '../interfaces/services.interface';
import { LoginRequest, LoginResponse, Partner } from '../types/auth.types';

const API_URL = '/api/auth';
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

