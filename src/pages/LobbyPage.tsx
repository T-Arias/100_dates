import { useState } from 'react';
import { apiService } from '../service/session.service';
import { Users, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

// Definimos que la función prop recibe un objeto (la sesión)
interface LobbyProps {
    onSessionCreated: (session: any) => void;
}

export function LobbyPage({ onSessionCreated }: LobbyProps) {
    const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [descValue, setDescValue] = useState('');

    const handleCreate = async () => {
        if (!inputValue.trim()) return alert("Escribe un nombre");
        setLoading(true);
        try {
            // Pasamos inputValue (nombre) Y descValue (descripción)
            const newSession = await apiService.createSession(inputValue, descValue);
            onSessionCreated(newSession);
        } catch (e) {
            alert("Error creando la sesión");
        } finally {
            setLoading(false);
        }
    };

    // LOGICA PARA UNIRSE
    const handleJoin = async () => {
        if (!inputValue.trim()) return alert("Ingresa el código");
        setLoading(true);
        try {
            // 1. Nos unimos con el código
            const res = await apiService.joinWithCode(inputValue);

            if (res.success) {
                // 2. Como el join solo devuelve 'success', buscamos los datos completos de la sesión
                const sessionFullData = await apiService.getMySessions();

                // 3. Pasamos la sesión encontrada a App.tsx
                if (sessionFullData) {
                    onSessionCreated(sessionFullData);
                } else {
                    alert("Te uniste, pero no pude cargar la sesión. Recarga la página.");
                }
            } else {
                alert(res.message); // "Código inválido" o "Expirado"
            }
        } catch (e: any) {
            console.error(e);
            alert("Error al unirse a la sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 transition-all">
            <h1 className="text-4xl font-black text-pink-600 mb-2">Bienvenido</h1>
            <p className="text-gray-500 mb-8 text-center max-w-xs">
                Antes de jugar, necesitas conectar con tu pareja.
            </p>

            {/* MENÚ PRINCIPAL */}
            {mode === 'menu' && (
                <div className="w-full max-w-sm space-y-4 animate-in zoom-in duration-300">
                    <button
                        onClick={() => setMode('create')}
                        className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center gap-4 hover:border-pink-300 transition-all active:scale-95"
                    >
                        <div className="bg-pink-100 p-3 rounded-full text-pink-600">
                            <UserPlus size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-bold text-gray-800">Crear Nueva Aventura</h3>
                            <p className="text-xs text-gray-400">Generaré un código para invitar</p>
                        </div>
                        <ArrowRight className="text-gray-300" size={20} />
                    </button>

                    <button
                        onClick={() => setMode('join')}
                        className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center gap-4 hover:border-purple-300 transition-all active:scale-95"
                    >
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Users size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-bold text-gray-800">Ya tengo un código</h3>
                            <p className="text-xs text-gray-400">Me invitaron a una sesión</p>
                        </div>
                        <ArrowRight className="text-gray-300" size={20} />
                    </button>
                </div>
            )}

            {mode === 'create' && (
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="font-bold text-xl mb-4 text-gray-800">Crea tu Aventura</h2>

                    {/* Input Nombre */}
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block">NOMBRE DEL EQUIPO</label>
                    <input
                        className="w-full p-4 rounded-xl border border-gray-200 mb-4 focus:ring-2 focus:ring-pink-500 outline-none"
                        placeholder="Ej: Ana y Juan ❤️"
                        autoFocus
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    {/* Input Descripción (NUEVO) */}
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block">DESCRIPCIÓN (OPCIONAL)</label>
                    <textarea
                        className="w-full p-4 rounded-xl border border-gray-200 mb-6 focus:ring-2 focus:ring-pink-500 outline-none resize-none h-24"
                        placeholder="Ej: Nuestra lista de deseos para este año..."
                        onChange={(e) => setDescValue(e.target.value)}
                    />

                    <button onClick={handleCreate} disabled={loading} className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold mb-3 shadow-lg hover:bg-pink-600 transition-colors">
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Comenzar Aventura 🚀'}
                    </button>

                    <button onClick={() => setMode('menu')} className="w-full text-gray-400 py-2">Cancelar</button>
                </div>
            )}

            {/* FORMULARIO DE UNIRSE */}
            {mode === 'join' && (
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="font-bold text-xl mb-4 text-gray-800">Ingresa el Código</h2>
                    <input
                        className="w-full p-4 rounded-xl border border-gray-200 mb-4 text-center uppercase tracking-widest font-mono text-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        placeholder="A1B2C3"
                        maxLength={6}
                        autoFocus
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        onClick={handleJoin}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold mb-3 flex justify-center items-center gap-2 shadow-lg shadow-purple-200 transition-all disabled:opacity-70"
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        {loading ? 'Verificando...' : 'Unirme ✨'}
                    </button>
                    <button onClick={() => setMode('menu')} disabled={loading} className="w-full text-gray-400 py-2 hover:text-gray-600">Cancelar</button>
                </div>
            )}
        </div>
    );
}