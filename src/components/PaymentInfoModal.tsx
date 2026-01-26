import { useCallback, useMemo } from 'react';
import { PartnerPaymentInfo } from '../types/partner.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type PaymentInfoModalProps = {
  paymentInfo: PartnerPaymentInfo[];
  partnerName: string;
  onClose: () => void;
};

const filterByType = (items: PartnerPaymentInfo[], type: 'PIX' | 'WHATSAPP'): PartnerPaymentInfo[] => {
  return items.filter((info) => info.type === type);
};

const cleanPhoneNumber = (number: string): string => {
  return number.replace(/\D/g, '');
};

const createWhatsAppUrl = (number: string): string => {
  const cleanNumber = cleanPhoneNumber(number);
  return `https://wa.me/55${cleanNumber}`;
};

export const PaymentInfoModal = ({
  paymentInfo,
  partnerName,
  onClose,
}: PaymentInfoModalProps): JSX.Element => {
  const pixKeys = useMemo(() => filterByType(paymentInfo, 'PIX'), [paymentInfo]);
  const whatsappNumbers = useMemo(() => filterByType(paymentInfo, 'WHATSAPP'), [paymentInfo]);

  const handleCopyPix = useCallback((value: string): void => {
    navigator.clipboard.writeText(value);
    toast.success('Chave PIX copiada!');
  }, []);

  const handleOpenWhatsApp = useCallback((number: string): void => {
    const url = createWhatsAppUrl(number);
    window.open(url, '_blank');
  }, []);

  const hasPaymentInfo = pixKeys.length > 0 || whatsappNumbers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-green-600">
                  Parabéns! Suas apostas foram enviadas com sucesso!
                </CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-2">Sócio: {partnerName}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="shrink-0 h-8 w-8 p-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          {pixKeys.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Chaves PIX
              </h3>
              <div className="space-y-3">
                {pixKeys.map((pix) => (
                  <div
                    key={pix.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-800 mb-1">{pix.name}</div>
                        <div className="font-mono text-sm break-all text-gray-700 bg-white px-2 py-1 rounded border">
                          {pix.value}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCopyPix(pix.value)}
                        size="sm"
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {whatsappNumbers.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Enviar Comprovante via WhatsApp
              </h3>
              <div className="space-y-3">
                {whatsappNumbers.map((whatsapp) => (
                  <div
                    key={whatsapp.id}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        {whatsapp.name && (
                          <div className="font-semibold text-sm text-gray-800 mb-1">{whatsapp.name}</div>
                        )}
                        <div className="text-gray-700 font-medium">{whatsapp.value}</div>
                      </div>
                      <Button
                        onClick={() => handleOpenWhatsApp(whatsapp.value)}
                        size="sm"
                        className="shrink-0 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Abrir WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasPaymentInfo && (
            <p className="text-center text-gray-500 py-4">
              Nenhuma informação de pagamento disponível.
            </p>
          )}

          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white"
            >
              Continuar Apostando
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
