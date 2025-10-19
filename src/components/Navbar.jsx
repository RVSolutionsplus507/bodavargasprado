import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useStore } from '@/store/store';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { invitation } = useStore();
  const isConfirmed = invitation?.confirmed || false;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white/80 dark:bg-wedding-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-wedding-primary-dark" />
              <span className="ml-2 text-xl sm:text-2xl md:text-3xl font-cursive">Ambar & Roberto</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${isActive 
                ? 'text-wedding-primary-dark dark:text-wedding-primary' 
                : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
            } end>
              Inicio
            </NavLink>
            <NavLink 
              to="/confirm" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''} ${isActive 
                  ? 'text-wedding-primary-dark dark:text-wedding-primary' 
                  : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
              }
              onClick={(e) => isConfirmed && e.preventDefault()}
            >
              Confirmar Asistencia
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${isActive 
                ? 'text-wedding-primary-dark dark:text-wedding-primary' 
                : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
            }>
              Galería
            </NavLink>
            <ThemeToggle />
          </div>
          
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center p-3 rounded-md text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 min-h-[44px] min-w-[44px]"
              onClick={toggleMenu}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-wedding-background-dark/95 backdrop-blur-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium min-h-[44px] ${isActive
                  ? 'text-wedding-primary-dark dark:text-wedding-primary'
                  : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
              }
              onClick={closeMenu}
              end
            >
              Inicio
            </NavLink>
            <NavLink
              to="/confirm"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium min-h-[44px] ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''} ${isActive
                  ? 'text-wedding-primary-dark dark:text-wedding-primary'
                  : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
              }
              onClick={(e) => {
                if (isConfirmed) {
                  e.preventDefault();
                } else {
                  closeMenu();
                }
              }}
            >
              Confirmar Asistencia
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium min-h-[44px] ${isActive
                  ? 'text-wedding-primary-dark dark:text-wedding-primary'
                  : 'text-gray-600 hover:text-wedding-primary-dark dark:text-gray-300 dark:hover:text-wedding-primary'}`
              }
              onClick={closeMenu}
            >
              Galería
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
