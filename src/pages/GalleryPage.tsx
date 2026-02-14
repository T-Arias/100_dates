import { useEffect, useState } from 'react';
import { apiService } from '../service/session.service';
import { Loader2, Image as ImageIcon, CalendarHeart, X } from 'lucide-react';

export function GalleryPage() {
    const [memories, setMemories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        setLoading(true);
        const data = await apiService.getMemories();
        setMemories(data);
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const closeLightbox = () => setSelectedMemory(null);

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="mb-8 pt-4">
                <h1 className="text-3xl font-black text-gray-800">Nuestro Álbum</h1>
                <p className="text-pink-500 font-medium">Momentos inolvidables 📸</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-pink-500" size={40} />
                </div>
            ) : (
                <>
                    {memories.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <ImageIcon size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Aún no hay recuerdos.</p>
                            <p className="text-sm text-gray-400">¡Gira la ruleta y sube tu primera foto!</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {memories.map((memory) => (
                            <div
                                key={memory.id}
                                onClick={() => setSelectedMemory(memory)}
                                className="cursor-pointer bg-white p-2 rounded-lg shadow-md border border-gray-100 transform transition-all hover:scale-105 hover:shadow-xl hover:z-10 flex flex-col"
                            >

                                <div className="aspect-square w-full bg-gray-100 rounded mb-3 flex overflow-hidden gap-1">
                                    <div
                                        className="flex-1 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${memory.photo_url})` }}
                                    />
                                    {memory.photo_url_2 && (
                                        <div
                                            className="flex-1 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${memory.photo_url_2})` }}
                                        />
                                    )}
                                </div>

                                <div className="px-1 pb-1 flex-1 flex flex-col justify-between">
                                    <h3 className="font-bold text-gray-800 text-xs leading-tight mb-2 line-clamp-2">
                                        {memory.date_ideas?.title || 'Cita Sorpresa'}
                                    </h3>
                                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <CalendarHeart size={10} />
                                            {formatDate(memory.created_at)}
                                        </span>
                                        <span className="truncate max-w-20 font-medium text-pink-400">
                                            {memory.sessions?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedMemory && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <button className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-50">
                        <X size={32} />
                    </button>

                    {/* Contenedor de las fotos (Ocupa hasta el 80% del alto de la pantalla) */}
                    <div
                        className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-7xl items-center justify-center h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Contenedor Foto 1 */}
                        <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 min-w-0">
                            <img
                                src={selectedMemory.photo_url}
                                alt="Recuerdo 1"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Contenedor Foto 2 (Si existe) */}
                        {selectedMemory.photo_url_2 && (
                            <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 min-w-0">
                                <img
                                    src={selectedMemory.photo_url_2}
                                    alt="Recuerdo 2"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            </div>
                        )}
                    </div>

                    {/* Título de la cita */}
                    <h2 className="text-white mt-6 font-bold text-2xl text-center px-4">
                        {selectedMemory.date_ideas?.title}
                    </h2>
                </div>
            )}
        </div>
    );
}