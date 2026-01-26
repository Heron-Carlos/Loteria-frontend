export type PartnerPaymentInfo = {
  id: string;
  partnerId: string;
  type: 'PIX' | 'WHATSAPP';
  value: string;
  name: string;
};

