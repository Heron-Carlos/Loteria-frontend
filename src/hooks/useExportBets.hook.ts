import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { UseExportBetsParams } from '../types/hooks.types';

export const useExportBets = ({
  betService,
  username,
}: UseExportBetsParams) => {
  const exportBets = useCallback(async (gameType?: string, isPaid?: boolean): Promise<void> => {
    try {
      const blob = await betService.exportPartnerBetsToExcel(
        gameType,
        isPaid
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Gera nome do arquivo baseado nos filtros
      let fileName = 'apostas';
      if (gameType) {
        fileName += `_${gameType.toLowerCase()}`;
      }
      if (isPaid !== undefined) {
        fileName += isPaid ? '_pagas' : '_pendentes';
      }
      const user = username || 'socio';
      fileName += `_${user}.xlsx`;
      
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Arquivo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar apostas para Excel.');
    }
  }, [username, betService]);

  return { exportBets };
};

