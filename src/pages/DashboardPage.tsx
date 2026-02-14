import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../service/session.service';
import { Plus, Users, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LobbyPage } from './LobbyPage';

export function DashboardPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLobby, setShowLobby] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        const data = await apiService.getMySessions();
        setSessions(data);
        setLoading(false);
    };

    if (showLobby) {
        return (
            <div className="relative">
                <button onClick={() => setShowLobby(false)} className="absolute top-6 left-6 z-50 text-pink-600 font-bold">
                    ← Volver
                </button>
                <LobbyPage onSessionCreated={() => { setShowLobby(false); loadSessions(); }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Mis Citas</h1>
                    <p className="text-pink-500 font-medium">Selecciona tu aventura</p>
                </div>
                <button onClick={() => supabase.auth.signOut()} className="p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                    <LogOut size={20} />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-500" size={40} /></div>
            ) : (
                <div className="space-y-4">
                    {sessions.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                            No tienes aventuras aún.
                        </div>
                    )}

                    {sessions.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => navigate(`/game/${s.id}`)}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-95 transition-all cursor-pointer group hover:border-pink-200"
                        >
                            <div className="flex items-center gap-4 flex-1"> {/* flex-1 para que ocupe espacio */}
                                <div className="bg-pink-50 p-3 rounded-2xl text-pink-500 group-hover:bg-pink-100 transition-colors">
                                    <Users size={24} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{s.name}</h3>

                                    {/* Muestra la descripción si existe */}
                                    {s.description && (
                                        <p className="text-sm text-gray-500 line-clamp-1 mb-1">{s.description}</p>
                                    )}

                                    <p className="text-[10px] uppercase tracking-wider font-bold text-pink-400">
                                        {s.completedCount} / 100 Citas
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="text-gray-300" />
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => setShowLobby(true)}
                className="fixed bottom-24 right-6 bg-pink-500 text-white p-4 rounded-full shadow-xl flex items-center gap-2 font-bold pr-6 active:scale-90 transition-all"
            >
                <Plus size={24} /> Nueva
            </button>
        </div>
    );
}