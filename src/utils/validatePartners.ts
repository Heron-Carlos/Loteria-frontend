import { Partner } from '../types/auth.types';

const isPartner = (obj: unknown): obj is Partner => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'username' in obj &&
    'partnerId' in obj
  );
};

export const validatePartners = (data: unknown): Partner[] => {
  if (Array.isArray(data)) {
    return data.filter(isPartner);
  }

  if (isPartner(data)) {
    return [data];
  }

  return [];
};

export const filterValidPartners = (partners: Partner[]): Partner[] => {
  return partners.filter(
    (partner) => partner.partnerId && partner.partnerId.trim() !== ''
  );
};

