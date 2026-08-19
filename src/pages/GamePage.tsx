import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../service/session.service';
import { DateCard } from '../components/DateCard';
import { PhotoUploader } from '../components/PhotoUploader';
import { ArrowLeft, Loader2, Info, ListFilter } from 'lucide-react';
import type { DateIdea } from '../types/types';

export function GamePage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [sessionData, setSessionData] = useState<{ name: string, description?: string } | null>(null);

    const [currentDate, setCurrentDate] = useState<DateIdea | null>(null);
    const [viewState, setViewState] = useState<'roulette' | 'card' | 'upload'>('roulette');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sessionId) {
            apiService.getSessionById(sessionId).then(data => {
                if (data) {
                    setSessionData(data);
                }
            });
        }
    }, [sessionId]);

    const handleSpin = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const date = await apiService.getNextDate(sessionId);
            if (date) {
                setCurrentDate(date);
                setViewState('card');
            } else {
                alert("¡Han completado todas las citas de esta aventura! 🎉");
            }
        } catch (e) {
            console.error(e);
            alert("Error al conectar con la base de datos");
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (files: [File, File]) => {
        if (!sessionId || !currentDate || files.length !== 2) return;

        setLoading(true);
        try {
            await apiService.completeDate(sessionId, currentDate.id, files);

            alert("¡Recuerdos guardados para siempre! 📸✨");
            setViewState('roulette');
            setCurrentDate(null);

        } catch (e) {
            console.error(e);
            alert("Hubo un error al guardar las fotos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-6 pb-24">
            <div className="flex items-start justify-between gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="shrink-0 text-gray-400 hover:text-gray-600 flex items-center gap-1 font-medium"
                >
                    <ArrowLeft size={20} /> Salir
                </button>

                {sessionData && (
                    <div className="text-right min-w-0">
                        <h2 className="text-xs font-black text-pink-500 uppercase tracking-widest truncate">
                            {sessionData.name}
                        </h2>
                        {sessionData.description && (
                            <p className="text-[10px] text-gray-400 max-w-40 truncate">
                                {sessionData.description}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {viewState === 'roulette' && (
                <div className="text-center animate-in zoom-in duration-300 w-full max-w-md">
                    <h1 className="text-4xl font-black text-gray-800 mb-2">100 Citas</h1>

                    {sessionData?.description ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 mx-auto inline-flex items-center gap-2 max-w-xs">
                            <Info size={16} className="text-pink-400 shrink-0" />
                            <p className="text-sm text-gray-500 italic">
                                "{sessionData.description}"
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-8">¿Qué haremos hoy?</p>
                    )}

                    <div className="flex justify-center">
                        <button
                            onClick={handleSpin}
                            disabled={loading}
                            className="w-64 h-64 rounded-full bg-linear-to-br from-pink-500 to-rose-600 text-white text-3xl font-black shadow-2xl shadow-pink-200 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-80 hover:shadow-pink-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={48} />
                                    <span className="text-sm font-normal opacity-80">Eligiendo...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-5xl">🎲</span>
                                    <span>GIRAR</span>
                                </>
                            )}
                        </button>
                    </div>

                    {sessionId && (
                        <Link
                            to={`/game/${sessionId}/explorar`}
                            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors focus-visible:ring-2 focus-visible:ring-pink-500 outline-none rounded-full px-3 py-2"
                        >
                            <ListFilter size={16} />
                            Explorar las 100 citas
                        </Link>
                    )}
                </div>
            )}

            {viewState === 'card' && currentDate && (
                <DateCard
                    idea={currentDate}
                    onAccept={() => setViewState('upload')}
                    onReject={handleSpin}
                />
            )}

            {viewState === 'upload' && (
                <div className="w-full max-w-md animate-in slide-in-from-bottom-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-xl">
                            <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
                            <p className="text-gray-500 font-medium text-center">Inmortalizando el momento...<br />Esto puede tardar unos segundos.</p>
                        </div>
                    ) : (
                        <PhotoUploader
                            onComplete={handlePhotoUpload}
                            onCancel={() => setViewState('card')}
                        />
                    )}
                </div>
            )}
            </div>
        </div>
    );
}