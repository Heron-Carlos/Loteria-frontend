import { IAuthService } from '../interfaces/services.interface';
import { Partner } from '../types/auth.types';

const DEFAULT_PARTNER_USERNAME = 'jorgeermelindo';

export const fetchPartnerByUsername = async (
  authService: IAuthService,
  username: string | undefined,
  gameType: 'Mega' | 'Quina'
): Promise<Partner | null> => {
  const targetUsername = username ?? DEFAULT_PARTNER_USERNAME;
  const partner = await authService.getPartnerByUsername(targetUsername, gameType);
  return partner;
};

