import { useState } from 'react';
import { apiService } from '../service/session.service.ts';
import { Share2, Timer } from 'lucide-react';

export function InvitePartner({ sessionId }: { sessionId: string }) {
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const newCode = await apiService.generateInviteCode(sessionId);
            setCode(newCode);
        } catch (e) {
            alert("Error al generar código");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-3xl shadow-lg text-center border-2 border-dashed border-pink-200">
            <h3 className="font-bold text-gray-800 mb-2 text-lg">¡Invita a tu pareja!</h3>
            <p className="text-sm text-gray-500 mb-6">Para jugar juntos, tu pareja debe ingresar este código en su app.</p>

            {!code ? (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"
                >
                    <Share2 size={18} /> {loading ? 'Generando...' : 'Generar Código'}
                </button>
            ) : (
                <div className="animate-in zoom-in">
                    <div className="text-4xl font-black tracking-widest text-pink-600 bg-pink-50 py-4 rounded-2xl mb-4 border border-pink-100">
                        {code}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-orange-500 text-xs font-bold uppercase">
                        <Timer size={14} /> Vence en 10 minutos
                    </div>
                    <button onClick={() => setCode(null)} className="mt-4 text-gray-400 text-xs underline">Generar otro código</button>
                </div>
            )}
        </div>
    );
}