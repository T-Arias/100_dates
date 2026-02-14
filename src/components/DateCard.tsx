import type { DateIdea } from '../types/types.ts';
import { Heart, Flame, Utensils, Coffee } from 'lucide-react';

// Diccionario de iconos según categoría
const CATEGORY_ICONS = {
    'Romántica': <Heart className="text-pink-500" />,
    'Aventura': <Flame className="text-orange-500" />,
    'Gastronomía': <Utensils className="text-yellow-600" />,
    'Relax': <Coffee className="text-blue-500" />
};

interface DateCardProps {
    idea: DateIdea;
    onAccept: () => void;
    onReject: () => void;
}

export function DateCard({ idea, onAccept, onReject }: DateCardProps) {
    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-500">

            {/* Cabecera con Categoría y Dificultad */}
            <div className="bg-pink-50 p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[idea.category]}
                    <span className="text-sm font-bold text-pink-900 uppercase tracking-wider">
                        {idea.category}
                    </span>
                </div>

                {/* Indicador de dificultad (puntos) */}
                <div className="flex gap-1">
                    {[1, 2, 3].map((lvl) => (
                        <div
                            key={lvl}
                            className={`h-2 w-2 rounded-full ${lvl <= idea.difficulty ? 'bg-pink-500' : 'bg-pink-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Contenido */}
            <div className="p-8 text-center">
                <h2 className="text-2xl font-black text-gray-800 mb-4 leading-tight">
                    {idea.title}
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {idea.description}
                </p>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onAccept}
                        className="w-full py-4 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-transform"
                    >
                        ¡Aceptamos el Reto! 💖
                    </button>

                    <button
                        onClick={onReject}
                        className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 active:bg-gray-50 rounded-xl transition-colors"
                    >
                        Buscar otra opción
                    </button>
                </div>
            </div>
        </div>
    );
}