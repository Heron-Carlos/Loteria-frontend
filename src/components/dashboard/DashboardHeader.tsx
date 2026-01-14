import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOutIcon } from '@/components/icons';

type DashboardHeaderProps = {
  username: string | undefined;
  onLogout: () => void;
};

export const DashboardHeader = ({
  username,
  onLogout,
}: DashboardHeaderProps): JSX.Element => {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Dashboard do Sócio
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Bem-vindo, <span className="font-semibold text-foreground">{username}</span>
          </CardDescription>
        </div>
        <Button variant="destructive" onClick={onLogout} className="w-full sm:w-auto">
          <span className="mr-2">
            <LogOutIcon />
          </span>
          Sair
        </Button>
      </div>
    </CardHeader>
  );
};

