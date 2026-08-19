import { Lock, ChevronRight } from 'lucide-react';
import type { CatalogEntry } from '../../types/types';
import { getCategoryMeta } from '../../lib/categories';

interface DateRowProps {
    entry: CatalogEntry;
    onSelect: (entry: CatalogEntry) => void;
    style?: React.CSSProperties;
}

function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

export function DateRow({ entry, onSelect, style }: DateRowProps) {
    const categoryMeta = getCategoryMeta(entry.category);
    const CategoryIcon = categoryMeta.icon;

    if (entry.isCompleted) {
        const label = `${entry.title}. Cita completada${entry.completedAt ? ` el ${formatDate(entry.completedAt)}` : ''}. Ver recuerdo.`;

        return (
            <button
                onClick={() => onSelect(entry)}
                aria-label={label}
                style={style}
                className="w-full flex items-center gap-3 p-3 min-h-16 bg-gray-50 rounded-2xl border border-gray-100 text-left active:scale-[0.98] transition-transform focus-visible:ring-2 focus-visible:ring-pink-500 outline-none animate-fade-in"
            >
                <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-gray-200">
                    {entry.photoUrl && (
                        <img
                            src={entry.photoUrl}
                            alt=""
                            width={44}
                            height={44}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-gray-500 text-sm truncate">{entry.title}</h3>
                        <Lock size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-gray-400">
                        {entry.completedAt ? `Completada el ${formatDate(entry.completedAt)}` : 'Completada'}
                    </p>
                </div>

                <ChevronRight className="text-gray-300 shrink-0" size={18} aria-hidden="true" />
            </button>
        );
    }

    return (
        <button
            onClick={() => onSelect(entry)}
            style={style}
            className="w-full flex items-center gap-3 p-3 min-h-16 bg-white rounded-2xl border border-gray-100 text-left active:scale-[0.98] transition-transform hover:border-pink-200 focus-visible:ring-2 focus-visible:ring-pink-500 outline-none animate-fade-in"
        >
            <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${categoryMeta.bgClass}`}>
                <CategoryIcon size={20} className={categoryMeta.textClass} />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm truncate">{entry.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{entry.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex gap-0.5">
                        {[1, 2, 3].map((lvl) => (
                            <span
                                key={lvl}
                                className={`h-1.5 w-1.5 rounded-full ${lvl <= entry.difficulty ? 'bg-pink-400' : 'bg-gray-200'}`}
                            />
                        ))}
                    </span>
                </div>
            </div>

            <ChevronRight className="text-gray-300 shrink-0" size={18} aria-hidden="true" />
        </button>
    );
}
