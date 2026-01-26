import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth.hook';
import { PartnerPaymentInfoService, CreatePartnerPaymentInfoRequest } from '../services/partner-payment-info.service';
import { PartnerPaymentInfo } from '../types/partner.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPartnerName } from '../utils/formatName';
import toast from 'react-hot-toast';
import { IAuthService } from '../interfaces/services.interface';

type PaymentInfoManagementPageProps = {
  authService: IAuthService;
};

const INITIAL_FORM_DATA: CreatePartnerPaymentInfoRequest = {
  partnerId: '',
  type: 'PIX',
  value: '',
  name: '',
};

const hasValidPartnerId = (partnerId: string): boolean => {
  return partnerId.trim() !== '';
};

const filterByType = (items: PartnerPaymentInfo[], type: 'PIX' | 'WHATSAPP'): PartnerPaymentInfo[] => {
  return items.filter((item) => item.type === type);
};

const isFormValid = (formData: CreatePartnerPaymentInfoRequest): boolean => {
  return hasValidPartnerId(formData.partnerId) && formData.value.trim() !== '' && formData.name.trim() !== '';
};

export const PaymentInfoManagementPage = ({
  authService,
}: PaymentInfoManagementPageProps): JSX.Element => {
  const { partners } = useAuth(authService);
  const [paymentInfoService] = useState(() => new PartnerPaymentInfoService(authService));
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [paymentInfoList, setPaymentInfoList] = useState<PartnerPaymentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePartnerPaymentInfoRequest>(INITIAL_FORM_DATA);

  const validPartners = useMemo(
    () => partners.filter((p) => p.partnerId && hasValidPartnerId(p.partnerId)),
    [partners]
  );

  const loadPaymentInfo = useCallback(async (): Promise<void> => {
    if (!hasValidPartnerId(selectedPartnerId)) {
      setPaymentInfoList([]);
      return;
    }

    setLoading(true);
    try {
      const data = await paymentInfoService.getAllByPartnerId(selectedPartnerId);
      setPaymentInfoList(data);
    } catch {
      toast.error('Erro ao carregar informações de pagamento.');
      setPaymentInfoList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPartnerId, paymentInfoService]);

  useEffect(() => {
    loadPaymentInfo();
  }, [loadPaymentInfo]);

  const handlePartnerChange = useCallback((value: string): void => {
    setSelectedPartnerId(value);
    setFormData((prev) => ({ ...prev, partnerId: value }));
    setEditingId(null);
  }, []);

  const handleFormChange = useCallback(
    (field: keyof CreatePartnerPaymentInfoRequest, value: string): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback((): void => {
    setFormData({ ...INITIAL_FORM_DATA, partnerId: selectedPartnerId });
    setEditingId(null);
  }, [selectedPartnerId]);

  const handleCreate = useCallback(async (): Promise<void> => {
    if (!isFormValid(formData)) {
      toast.error('Preencha todos os campos.');
      return;
    }

    try {
      await paymentInfoService.create(formData);
      toast.success('Informação de pagamento criada com sucesso!');
      resetForm();
      loadPaymentInfo();
    } catch {
      toast.error('Erro ao criar informação de pagamento.');
    }
  }, [formData, paymentInfoService, resetForm, loadPaymentInfo]);

  const handleEdit = useCallback((item: PartnerPaymentInfo): void => {
    setFormData({
      partnerId: item.partnerId,
      type: item.type,
      value: item.value,
      name: item.name,
    });
    setEditingId(item.id);
  }, []);

  const handleUpdate = useCallback(async (): Promise<void> => {
    if (!editingId || !isFormValid(formData)) {
      toast.error('Preencha todos os campos.');
      return;
    }

    try {
      await paymentInfoService.update({
        id: editingId,
        type: formData.type,
        value: formData.value,
        name: formData.name,
      });
      toast.success('Informação de pagamento atualizada com sucesso!');
      resetForm();
      loadPaymentInfo();
    } catch {
      toast.error('Erro ao atualizar informação de pagamento.');
    }
  }, [editingId, formData, paymentInfoService, resetForm, loadPaymentInfo]);

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      const confirmed = window.confirm('Tem certeza que deseja excluir esta informação?');
      if (!confirmed) {
        return;
      }

      try {
        await paymentInfoService.delete(id);
        toast.success('Informação de pagamento excluída com sucesso!');
        loadPaymentInfo();
      } catch {
        toast.error('Erro ao excluir informação de pagamento.');
      }
    },
    [paymentInfoService, loadPaymentInfo]
  );

  const pixItems = useMemo(() => filterByType(paymentInfoList, 'PIX'), [paymentInfoList]);
  const whatsappItems = useMemo(() => filterByType(paymentInfoList, 'WHATSAPP'), [paymentInfoList]);

  const selectedPartner = useMemo(
    () => validPartners.find((p) => p.partnerId === selectedPartnerId),
    [validPartners, selectedPartnerId]
  );

  const hasPaymentInfo = pixItems.length > 0 || whatsappItems.length > 0;
  const isEditing = editingId !== null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-select">Selecione o Sócio</Label>
            <Select value={selectedPartnerId} onValueChange={handlePartnerChange}>
              <SelectTrigger id="partner-select">
                <SelectValue placeholder="Selecione um sócio" />
              </SelectTrigger>
              <SelectContent>
                {validPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.partnerId}>
                    {formatPartnerName(partner.username)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPartner && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Sócio selecionado:</span>{' '}
                {formatPartnerName(selectedPartner.username)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {hasValidPartnerId(selectedPartnerId) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Editar Informação' : 'Adicionar Nova Informação'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleFormChange('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome/Descrição</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Ex: CPF Caixa, WhatsApp Principal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => handleFormChange('value', e.target.value)}
                  placeholder={
                    formData.type === 'PIX'
                      ? 'Chave PIX (CPF, Email, Telefone, etc.)'
                      : 'Número do WhatsApp (com DDD)'
                  }
                />
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleUpdate} className="flex-1">
                      Atualizar
                    </Button>
                    <Button onClick={resetForm} variant="outline">
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleCreate} className="flex-1">
                    Adicionar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pixItems.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Chaves PIX</h3>
                      <div className="space-y-2">
                        {pixItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{item.name}</div>
                              <div className="text-sm text-gray-600 font-mono">{item.value}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(item)}
                                size="sm"
                                variant="outline"
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {whatsappItems.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Números WhatsApp</h3>
                      <div className="space-y-2">
                        {whatsappItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{item.name || 'WhatsApp'}</div>
                              <div className="text-sm text-gray-600">{item.value}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(item)}
                                size="sm"
                                variant="outline"
                              >
                                Editar
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                Excluir
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!hasPaymentInfo && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma informação de pagamento cadastrada para este sócio.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
