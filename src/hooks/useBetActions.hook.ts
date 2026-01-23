import { useCallback } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { UseBetActionsParams } from '../types/hooks.types';

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

  const markAsPaidBulk = useCallback(
    async (betIds: string[], isPaid: boolean): Promise<void> => {
      const result = await Swal.fire({
        title: isPaid ? 'Marcar como Pago?' : 'Desmarcar como Pago?',
        text: isPaid
          ? `Tem certeza que deseja marcar ${betIds.length} aposta(s) como paga(s)?`
          : `Tem certeza que deseja desmarcar ${betIds.length} aposta(s) como paga(s)?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await Promise.all(betIds.map((betId) => betService.updateBetPaidStatus(betId, isPaid)));
        toast.success(`${betIds.length} aposta(s) atualizada(s) com sucesso!`);
        reloadBets();
      } catch (error) {
        toast.error('Erro ao atualizar status de pagamento.');
      }
    },
    [betService, reloadBets]
  );

  const deleteBetBulk = useCallback(
    async (betIds: string[]): Promise<void> => {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: `Você está prestes a excluir ${betIds.length} aposta(s). Esta ação não pode ser revertida!`,
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
        await Promise.all(betIds.map((betId) => betService.deleteBet(betId)));
        toast.success(`${betIds.length} aposta(s) excluída(s) com sucesso!`);
        reloadBets();
      } catch (error) {
        toast.error('Erro ao excluir apostas.');
      }
    },
    [betService, reloadBets]
  );

  return {
    markAsPaid,
    deleteBet,
    markAsPaidBulk,
    deleteBetBulk,
  };
};

