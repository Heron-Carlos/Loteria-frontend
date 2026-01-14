import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

type ConfirmSendBetsParams = {
  gameType: string;
};

export const confirmSendBets = async ({ gameType }: ConfirmSendBetsParams): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Confirmar envio',
    text: `Tem certeza que deseja enviar todas as suas apostas da ${gameType}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, enviar',
    cancelButtonText: 'Cancelar',
  });

  if (!result.isConfirmed) {
    toast('Envio cancelado.');
    return false;
  }

  return true;
};

