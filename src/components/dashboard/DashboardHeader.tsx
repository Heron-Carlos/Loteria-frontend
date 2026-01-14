import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardHeaderProps = {
  username: string | undefined;
};

export const DashboardHeader = ({
  username,
}: DashboardHeaderProps): JSX.Element => {
  return (
    <CardHeader className="pb-4">
      <div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Dashboard do Sócio
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Bem-vindo, <span className="font-semibold text-foreground">{username}</span>
        </CardDescription>
      </div>
    </CardHeader>
  );
};

