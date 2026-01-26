import axios from 'axios';
import { PartnerPaymentInfo } from '../types/partner.types';
import { IAuthService } from '../interfaces/services.interface';

const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return url.replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/partner-payment-info`;

export const getPartnerPaymentInfo = async (partnerId: string): Promise<PartnerPaymentInfo[]> => {
  const response = await axios.get<PartnerPaymentInfo[]>(`${API_URL}/${partnerId}`);
  return response.data;
};

export type CreatePartnerPaymentInfoRequest = {
  partnerId: string;
  type: 'PIX' | 'WHATSAPP';
  value: string;
  name: string;
};

export type UpdatePartnerPaymentInfoRequest = {
  id: string;
  type: 'PIX' | 'WHATSAPP';
  value: string;
  name: string;
};

export class PartnerPaymentInfoService {
  constructor(private readonly authService: IAuthService) {}

  private getAuthHeaders(): Record<string, string> {
    return this.authService.getAuthHeader();
  }

  async getAllByPartnerId(partnerId: string): Promise<PartnerPaymentInfo[]> {
    const response = await axios.get<PartnerPaymentInfo[]>(`${API_URL}/${partnerId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async create(request: CreatePartnerPaymentInfoRequest): Promise<PartnerPaymentInfo> {
    const response = await axios.post<PartnerPaymentInfo>(API_URL, request, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async update(request: UpdatePartnerPaymentInfoRequest): Promise<void> {
    const { id, type, value, name } = request;
    await axios.put(
      `${API_URL}/${id}`,
      { type, value, name },
      { headers: this.getAuthHeaders() }
    );
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

