import { useCallback } from 'react';
import { IBetService } from '../interfaces/services.interface';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type UseBetActionsParams = {
  betService: IBetService;
  reloadBets: () => Promise<void>;
};

export const useBetActions = ({ betService, reloadBets }: UseBetActionsParams) => {
  const markAsPaid = useCallback(
    async (betId: string, currentStatus: boolean): Promise<void> => {
      const result = await Swal.fire({
        title: currentStatus ? 'Desmarcar como Pago?' : 'Marcar como Pago?',
        text: currentStatus
          ? 'Tem certeza que deseja desmarcar esta aposta como paga?'
          : 'Tem certeza que deseja marcar esta aposta como paga?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await betService.updateBetPaidStatus(betId, !currentStatus);
        toast.success('Status de pagamento atualizado!');
        reloadBets();
      } catch (error) {
        toast.error('Erro ao atualizar status de pagamento.');
      }
    },
    [betService, reloadBets]
  );

  const deleteBet = useCallback(
    async (betId: string): Promise<void> => {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter esta exclusão!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await betService.deleteBet(betId);
        toast.success('Aposta excluída com sucesso!');
        reloadBets();
      } catch (error) {
        toast.error('Erro ao excluir a aposta.');
      }
    },
    [betService, reloadBets]
  );

  return {
    markAsPaid,
    deleteBet,
  };
};

