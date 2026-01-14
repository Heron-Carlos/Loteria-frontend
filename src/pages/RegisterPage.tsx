import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPageProps } from '../types/pages.types';
import { validateRegisterForm } from '../utils/validators/register.validator';
import { handleUsernameChange, handleSiglaChange } from '../utils/formHandlers';
import { getErrorMessage } from '../utils/errorHandling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export const RegisterPage = ({ authService }: RegisterPageProps): JSX.Element => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [megaSigla, setMegaSigla] = useState('');
  const [quinaSigla, setQuinaSigla] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    handleUsernameChange(e, setUsername);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
  }, []);

  const handleMegaSiglaChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    handleSiglaChange(e, setMegaSigla);
  }, []);

  const handleQuinaSiglaChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    handleSiglaChange(e, setQuinaSigla);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const validation = validateRegisterForm({ username, password, confirmPassword, megaSigla, quinaSigla });
      if (!validation.isValid) {
        toast.error(validation.error || 'Erro de validação.');
        return;
      }

      setLoading(true);
      try {
        await authService.register({
          username: username.trim(),
          password,
          role: 'Partner',
          megaSigla: megaSigla.trim(),
          quinaSigla: quinaSigla.trim(),
        });
        toast.success('Usuário registrado com sucesso!');
        navigate('/admin/dashboard');
      } catch (error) {
        const errorMessage = getErrorMessage(error, 'Erro ao registrar usuário.');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [username, password, confirmPassword, megaSigla, quinaSigla, authService, navigate]
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-base">
            Preencha os dados para criar uma nova conta
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
                onChange={handleUsernameChangeCallback}
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
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                autoComplete="new-password"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={loading}
                autoComplete="new-password"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="megaSigla">Sigla Mega</Label>
              <Input
                id="megaSigla"
                type="text"
                placeholder="Ex: JE"
                value={megaSigla}
                onChange={handleMegaSiglaChangeCallback}
                disabled={loading}
                maxLength={10}
                className="h-11 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quinaSigla">Sigla Quina</Label>
              <Input
                id="quinaSigla"
                type="text"
                placeholder="Ex: JE"
                value={quinaSigla}
                onChange={handleQuinaSiglaChangeCallback}
                disabled={loading}
                maxLength={10}
                className="h-11 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-semibold"
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

