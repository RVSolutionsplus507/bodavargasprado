// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ConfirmPage } from '@/pages/ConfirmPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useStore } from '@/store/store';
import { useEffect } from 'react';

function App() {
  const { theme } = useStore();

  useEffect(() => {
    // Cargar las fuentes
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;700&family=Great+Vibes&display=swap';
    document.head.appendChild(linkElement);

    // Aplicar el tema inicial
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="confirm" element={<ConfirmPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="admin" element={<DashboardPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
