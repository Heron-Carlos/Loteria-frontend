import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './services/auth.service';
import { BetService } from './services/bet.service';
import { LoginPage } from './pages/LoginPage';
import { MegaBetPage } from './pages/MegaBetPage';
import { QuinaBetPage } from './pages/QuinaBetPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const authService = new AuthService();
const betService = new BetService(authService);

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage authService={authService} />} />
      <Route
        path="/mega"
        element={<MegaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/quina"
        element={<QuinaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute authService={authService}>
            <AdminDashboardPage betService={betService} authService={authService} />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/mega" replace />} />
    </Routes>
  );
};

export default App;

