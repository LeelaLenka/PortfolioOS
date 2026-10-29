import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { HomePage, DemoPage, MemberPage } from './pages/PortfolioPages';
import { JoinPage } from './pages/JoinPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { StudioPage } from './studio/StudioPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/p/:slug" element={<MemberPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
