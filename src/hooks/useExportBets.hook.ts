import { useCallback } from 'react';
import { IBetService } from '../interfaces/services.interface';
import toast from 'react-hot-toast';

type UseExportBetsParams = {
  betService: IBetService;
  betsCount: number;
  exportGameType: string | null;
  username: string | undefined;
};

export const useExportBets = ({
  betService,
  betsCount,
  exportGameType,
  username,
}: UseExportBetsParams) => {
  const exportBets = useCallback(async (): Promise<void> => {
    if (betsCount === 0) {
      toast.error('Não há apostas para exportar.');
      return;
    }

    try {
      const blob = await betService.exportPartnerBetsToExcel(
        exportGameType || undefined
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const gameTypeName = exportGameType ? exportGameType.toLowerCase() : 'todas';
      const user = username || 'socio';
      a.download = `apostas_${gameTypeName}_${user}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Arquivo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar apostas para Excel.');
    }
  }, [betsCount, exportGameType, username, betService]);

  return { exportBets };
};

