import { IBetService } from '../interfaces/services.interface';
import { IAuthService } from '../interfaces/services.interface';

export type BetPageProps = {
  betService: IBetService;
  authService: IAuthService;
};

export type LoginPageProps = {
  authService: IAuthService;
};

export type RegisterPageProps = {
  authService: IAuthService;
};

export type AdminDashboardPageProps = {
  betService: IBetService;
  authService: IAuthService;
};

