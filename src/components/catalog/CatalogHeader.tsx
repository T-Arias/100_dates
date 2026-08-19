import { ArrowLeft, Search, X } from 'lucide-react';
import { CATEGORIES, getCategoryMeta } from '../../lib/categories';
import type { CatalogStatus } from '../../types/types';

interface CatalogHeaderProps {
    total: number;
    completedCount: number;
    q: string;
    category: string;
    status: CatalogStatus;
    collapsed: boolean;
    onBack: () => void;
    onQChange: (q: string) => void;
    onCategoryChange: (category: string) => void;
    onStatusChange: (status: CatalogStatus) => void;
}

const STATUS_OPTIONS: { value: CatalogStatus; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendientes', label: 'Pendientes' },
    { value: 'completadas', label: 'Hechas' },
];

const COLLAPSE_OFFSET = '-translate-y-[112px]';

export function CatalogHeader({
    total,
    completedCount,
    q,
    category,
    status,
    collapsed,
    onBack,
    onQChange,
    onCategoryChange,
    onStatusChange,
}: CatalogHeaderProps) {
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const hasActiveFilters = category !== 'Todas' || status !== 'todas';

    return (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div
                className={`overflow-hidden transition-transform duration-200 ease-out ${collapsed ? COLLAPSE_OFFSET : ''}`}
            >
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <button
                        onClick={onBack}
                        aria-label="Volver"
                        className="flex items-center gap-1 text-gray-400 hover:text-gray-600 font-medium p-2 -ml-2 rounded-full focus-visible:ring-2 focus-visible:ring-pink-500 outline-none"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm">Explorar</span>
                    </button>
                    <span className="text-xs font-bold text-pink-500">{completedCount}/{total}</span>
                </div>

                <div className="px-4 pb-3">
                    <div className="h-1.5 w-full bg-pink-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-pink-500 rounded-full transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Progreso de la aventura"
                        />
                    </div>
                </div>

                <div className="flex gap-2 px-4 pb-3" role="group" aria-label="Filtrar por estado">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onStatusChange(opt.value)}
                            aria-pressed={status === opt.value}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-pink-500 outline-none ${
                                status === opt.value
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div
                    className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar"
                    role="group"
                    aria-label="Filtrar por categoría"
                >
                    <button
                        onClick={() => onCategoryChange('Todas')}
                        aria-pressed={category === 'Todas'}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors focus-visible:ring-2 focus-visible:ring-pink-500 outline-none ${
                            category === 'Todas'
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        Todas
                    </button>
                    {CATEGORIES.map((cat) => {
                        const meta = getCategoryMeta(cat);
                        const Icon = meta.icon;
                        const active = category === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                aria-pressed={active}
                                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors focus-visible:ring-2 focus-visible:ring-pink-500 outline-none ${
                                    active
                                        ? 'bg-pink-500 text-white border-pink-500'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Icon size={14} className={active ? 'text-white' : meta.textClass} />
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 pb-3">
                <div className="relative flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                    <Search size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
                    <input
                        type="search"
                        value={q}
                        onChange={(e) => onQChange(e.target.value)}
                        placeholder="Buscar cita..."
                        aria-label="Buscar cita por nombre o descripción"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                    />
                    {q && (
                        <button
                            onClick={() => onQChange('')}
                            aria-label="Limpiar búsqueda"
                            className="shrink-0 text-gray-400 hover:text-gray-600 p-1 focus-visible:ring-2 focus-visible:ring-pink-500 rounded-full outline-none"
                        >
                            <X size={16} />
                        </button>
                    )}
                    {collapsed && hasActiveFilters && category !== 'Todas' && (
                        <span className="shrink-0 text-[10px] font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-full whitespace-nowrap">
                            {category}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
