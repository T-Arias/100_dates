import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { PhotoUploader } from '../PhotoUploader';
import { apiService } from '../../service/session.service';
import { getCategoryMeta } from '../../lib/categories';
import type { CatalogEntry } from '../../types/types';

interface DateSheetProps {
    entry: CatalogEntry | null;
    sessionId: string;
    onClose: () => void;
    onCompleted: (dateIdeaId: string, memory: {
        id: string;
        photo_url: string;
        photo_url_2: string;
        created_at: string;
    }) => void;
}

type ViewState = 'detail' | 'upload' | 'saving';

function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

export function DateSheet({ entry, sessionId, onClose, onCompleted }: DateSheetProps) {
    const [viewState, setViewState] = useState<ViewState>('detail');
    const [duplicateError, setDuplicateError] = useState(false);
    const [openEntryId, setOpenEntryId] = useState<string | null>(null);

    // Reset the sheet's internal state when a different entry is opened, without an effect
    // (React's recommended "adjust state during render" pattern).
    if (entry && entry.id !== openEntryId) {
        setOpenEntryId(entry.id);
        setViewState('detail');
        setDuplicateError(false);
    }

    if (!entry) return null;

    const handlePhotoUpload = async (files: [File, File]) => {
        setViewState('saving');
        setDuplicateError(false);
        try {
            const memory = await apiService.completeDate(sessionId, entry.id, files);
            onCompleted(entry.id, memory);
            onClose();
        } catch (e: unknown) {
            const code = (e as { code?: string })?.code;
            if (code === 'DUPLICATE_MEMORY') {
                setDuplicateError(true);
                setViewState('detail');
            } else {
                console.error(e);
                alert('Hubo un error al guardar las fotos.');
                setViewState('upload');
            }
        }
    };

    if (entry.isCompleted) {
        return (
            <BottomSheet open={!!entry} onClose={onClose} title={entry.title}>
                <div className="flex flex-col gap-3 mb-4">
                    {entry.photoUrl && (
                        <img
                            src={entry.photoUrl}
                            alt="Recuerdo 1"
                            className="w-full aspect-square object-cover rounded-2xl"
                        />
                    )}
                    {entry.photoUrl2 && (
                        <img
                            src={entry.photoUrl2}
                            alt="Recuerdo 2"
                            className="w-full aspect-square object-cover rounded-2xl"
                        />
                    )}
                </div>
                <p className="text-center text-sm text-gray-400">
                    {entry.completedAt ? `Completada el ${formatDate(entry.completedAt)}` : 'Completada'}
                </p>
            </BottomSheet>
        );
    }

    const categoryMeta = getCategoryMeta(entry.category);
    const CategoryIcon = categoryMeta.icon;

    return (
        <BottomSheet open={!!entry} onClose={onClose} title={entry.title}>
            {viewState === 'saving' ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="animate-spin text-pink-500 mb-4" size={40} />
                    <p className="text-gray-500 font-medium text-center">
                        Inmortalizando el momento...<br />Esto puede tardar unos segundos.
                    </p>
                </div>
            ) : viewState === 'upload' ? (
                <PhotoUploader onComplete={handlePhotoUpload} onCancel={() => setViewState('detail')} />
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CategoryIcon size={18} className={categoryMeta.textClass} />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {entry.category}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((lvl) => (
                                <div
                                    key={lvl}
                                    className={`h-2 w-2 rounded-full ${lvl <= entry.difficulty ? 'bg-pink-500' : 'bg-pink-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{entry.description}</p>

                    {duplicateError && (
                        <div className="flex items-start gap-2 bg-pink-50 text-pink-700 text-sm rounded-xl p-3 mb-4">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>Tu pareja ya completó esta cita 💕</span>
                        </div>
                    )}

                    <button
                        onClick={() => setViewState('upload')}
                        className="w-full py-4 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-transform"
                    >
                        ¡Aceptamos el Reto! 💖
                    </button>
                </div>
            )}
        </BottomSheet>
    );
}
