import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './services/auth.service';
import { BetService } from './services/bet.service';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MegaBetPage } from './pages/MegaBetPage';
import { QuinaBetPage } from './pages/QuinaBetPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PaymentInfoManagementPage } from './pages/PaymentInfoManagementPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

const authService = new AuthService();
const betService = new BetService(authService);

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage authService={authService} />} />
      <Route
        path="/register"
        element={
          <ProtectedRoute authService={authService}>
            <Layout authService={authService}>
              <RegisterPage authService={authService} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mega"
        element={<MegaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/quina"
        element={<QuinaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/:partnerUsername/mega"
        element={<MegaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/:partnerUsername/quina"
        element={<QuinaBetPage betService={betService} authService={authService} />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute authService={authService}>
            <Layout authService={authService}>
              <AdminDashboardPage betService={betService} authService={authService} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payment-info"
        element={
          <ProtectedRoute authService={authService}>
            <Layout authService={authService}>
              <PaymentInfoManagementPage authService={authService} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/" element={<Navigate to="/mega" replace />} />
    </Routes>
  );
};

export default App;

