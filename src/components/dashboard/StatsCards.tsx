import { Card, CardContent } from '@/components/ui/card';

type Stats = {
  total: number;
  paid: number;
  pending: number;
  mega: number;
  quina: number;
};

type StatsCardsProps = {
  stats: Stats;
};

export const StatsCards = ({ stats }: StatsCardsProps): JSX.Element => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-4">
          <div className="text-sm font-medium opacity-90">Total</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-4">
          <div className="text-sm font-medium opacity-90">Pagas</div>
          <div className="text-2xl font-bold mt-1">{stats.paid}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
        <CardContent className="p-4">
          <div className="text-sm font-medium opacity-90">Pendentes</div>
          <div className="text-2xl font-bold mt-1">{stats.pending}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
        <CardContent className="p-4">
          <div className="text-sm font-medium opacity-90">Mega</div>
          <div className="text-2xl font-bold mt-1">{stats.mega}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
        <CardContent className="p-4">
          <div className="text-sm font-medium opacity-90">Quina</div>
          <div className="text-2xl font-bold mt-1">{stats.quina}</div>
        </CardContent>
      </Card>
    </div>
  );
};

