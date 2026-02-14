import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { apiService } from '../service/session.service'; // Asegúrate que la ruta sea correcta
import { LogOut, Copy, Check, Users, QrCode, Loader2 } from 'lucide-react';

export function ProfilePage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para manejar el código generado
    const [activeCode, setActiveCode] = useState<string | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        // Ahora cargamos TODAS las sesiones, no solo una
        const data = await apiService.getMySessions();
        setSessions(data);
        setLoading(false);
    };

    const handleGenerateCode = async (sessionId: string) => {
        try {
            console.log("Generando código para sesión:", sessionId); // Debug

            const code = await apiService.generateInviteCode(sessionId);

            // Guardamos el código y el ID de la sesión para mostrarlo en la tarjeta correcta
            setActiveCode(code);
            setSelectedSessionId(sessionId);
        } catch (e) {
            console.error(e);
            alert("Error al generar el código");
        }
    };

    const copyToClipboard = () => {
        if (activeCode) {
            navigator.clipboard.writeText(activeCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="p-6 pb-24 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black text-gray-800 mb-2">Mi Perfil</h1>
            <p className="text-gray-500 mb-6">Gestiona tus aventuras</p>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-500" /></div>
            ) : (
                <div className="space-y-6 mb-8">
                    <h2 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Mis Sesiones Activas</h2>

                    {sessions.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No tienes sesiones activas.</p>
                    )}

                    {sessions.map((session) => (
                        <div key={session.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-pink-100 p-2 rounded-full text-pink-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{session.name}</h3>
                                    <p className="text-xs text-gray-400">ID: {session.id.slice(0, 8)}...</p>
                                </div>
                            </div>

                            {/* ZONA DE CÓDIGO DE INVITACIÓN */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 text-center">

                                {selectedSessionId === session.id && activeCode ? (
                                    // Si ya generamos código para ESTA sesión, lo mostramos
                                    <div className="animate-in fade-in zoom-in">
                                        <p className="text-xs text-gray-400 mb-2">Código para tu pareja (10 min):</p>
                                        <div
                                            onClick={copyToClipboard}
                                            className="flex items-center justify-center gap-2 text-3xl font-mono font-black text-gray-800 cursor-pointer active:scale-95 transition-transform"
                                        >
                                            {activeCode}
                                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400" />}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">Toca para copiar</p>
                                    </div>
                                ) : (
                                    // Botón para generar
                                    <button
                                        onClick={() => handleGenerateCode(session.id)}
                                        className="flex items-center justify-center gap-2 w-full py-2 text-pink-600 font-bold text-sm hover:bg-pink-50 rounded-lg transition-colors"
                                    >
                                        <QrCode size={18} />
                                        Invitar Pareja
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-white text-red-500 font-bold py-4 rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-transform"
            >
                <LogOut size={20} />
                Cerrar Sesión
            </button>
        </div>
    );
}