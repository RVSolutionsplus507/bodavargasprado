// src/pages/NotFoundPage.jsx (continuación)
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Heart className="h-24 w-24 text-wedding-primary-dark dark:text-wedding-primary" />
        </div>
        <h1 className="text-4xl font-cursive mb-4 text-wedding-primary-dark dark:text-wedding-primary">Página no encontrada</h1>
        <p className="text-lg mb-8">Lo sentimos, la página que buscas no existe.</p>
        <Link to="/">
          <Button className="bg-wedding-primary hover:bg-wedding-primary-dark text-white">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
