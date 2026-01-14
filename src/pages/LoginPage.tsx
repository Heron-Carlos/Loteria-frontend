import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAuthService } from '../interfaces/services.interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

type LoginPageProps = {
  authService: IAuthService;
};

export const LoginPage = ({ authService }: LoginPageProps): JSX.Element => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setUsername(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setPassword(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      if (!username.trim() || !password.trim()) {
        toast.error('Preencha todos os campos.');
        return;
      }

      setLoading(true);
      try {
        const response = await authService.login({ username, password });
        toast.success(`Bem-vindo, ${response.username}!`);
        navigate('/admin/dashboard');
      } catch (error) {
        toast.error('Credenciais inválidas.');
      } finally {
        setLoading(false);
      }
    },
    [username, password, authService, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Sistema de Loteria
          </CardTitle>
          <CardDescription className="text-base">
            Faça login para acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={handleUsernameChange}
                disabled={loading}
                autoComplete="username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                autoComplete="current-password"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-semibold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

