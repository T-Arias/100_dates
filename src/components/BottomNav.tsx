import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, User } from 'lucide-react';

export function BottomNav() {
    const location = useLocation();

    // Función helper para clases condicionales simples
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'
            }`;
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-safe pt-2 px-6 h-16 flex justify-between items-center z-50">
            <Link to="/" className={getLinkClass('/')}>
                <Home size={24} />
                <span className="text-[10px] font-medium">Jugar</span>
            </Link>

            <Link to="/gallery" className={getLinkClass('/gallery')}>
                <Grid size={24} />
                <span className="text-[10px] font-medium">Recuerdos</span>
            </Link>

            <Link to="/profile" className={getLinkClass('/profile')}>
                <User size={24} />
                <span className="text-[10px] font-medium">Perfil</span>
            </Link>
        </nav>
    );
}