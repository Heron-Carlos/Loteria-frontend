import { IBetService, IAuthService } from '../interfaces/services.interface';
import { LoginResponse } from './auth.types';

export type UsePartnerBetsParams = {
  betService: IBetService;
  authService: IAuthService;
  user: LoginResponse | null;
  filteredGameType: string | null;
  searchTerm?: string;
  isPaidFilter?: boolean | null;
};

export type UsePartnerStatsParams = {
  betService: IBetService;
  authService: IAuthService;
  user: LoginResponse | null;
};

export type UseBetActionsParams = {
  betService: IBetService;
  reloadBets: () => Promise<void>;
};

export type UseExportBetsParams = {
  betService: IBetService;
  username: string | undefined;
};

