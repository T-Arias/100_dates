import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Check, X } from 'lucide-react';

interface PhotoUploaderProps {
    onComplete: (files: [File, File]) => void;
    onCancel: () => void;
}

export function PhotoUploader({ onComplete, onCancel }: PhotoUploaderProps) {
    const [files, setFiles] = useState<[File | null, File | null]>([null, null]);
    const [previews, setPreviews] = useState<[string | null, string | null]>([null, null]);
    const [activeSlot, setActiveSlot] = useState<0 | 1 | null>(null);

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && activeSlot !== null) {
            const file = e.target.files[0];
            const newFiles = [...files] as [File | null, File | null];
            const newPreviews = [...previews] as [string | null, string | null];

            newFiles[activeSlot] = file;
            newPreviews[activeSlot] = URL.createObjectURL(file);

            setFiles(newFiles);
            setPreviews(newPreviews);
            setActiveSlot(null);
        }
    };

    const handleConfirm = () => {
        if (files[0] && files[1]) {
            onComplete([files[0], files[1]]);
        }
    };

    const removePhoto = (index: 0 | 1, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = [...files] as [File | null, File | null];
        const newPreviews = [...previews] as [string | null, string | null];
        newFiles[index] = null;
        newPreviews[index] = null;
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center">
            {activeSlot === null ? (
                <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="font-black text-2xl text-gray-800 mb-2">¡Cita Completada!</h3>
                    <p className="text-gray-500 text-sm mb-6 text-center">Inmortalicen este momento con dos fotos.</p>

                    <div className="flex w-full gap-3 mb-6">
                        <div
                            onClick={() => setActiveSlot(0)}
                            className={`relative flex-1 aspect-square rounded-2xl border-2 flex items-center justify-center cursor-pointer overflow-hidden transition-all ${previews[0] ? 'border-pink-500' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            {previews[0] ? (
                                <>
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${previews[0]})` }} />
                                    <button onClick={(e) => removePhoto(0, e)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Camera size={24} className="mb-2" />
                                    <span className="text-xs font-bold">Foto 1</span>
                                </div>
                            )}
                        </div>

                        <div
                            onClick={() => setActiveSlot(1)}
                            className={`relative flex-1 aspect-square rounded-2xl border-2 flex items-center justify-center cursor-pointer overflow-hidden transition-all ${previews[1] ? 'border-pink-500' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            {previews[1] ? (
                                <>
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${previews[1]})` }} />
                                    <button onClick={(e) => removePhoto(1, e)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={14} /></button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Camera size={24} className="mb-2" />
                                    <span className="text-xs font-bold">Foto 2</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={!files[0] || !files[1]}
                            className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                        >
                            <Check size={18} />
                            Guardar Recuerdos
                        </button>
                        <button onClick={onCancel} className="text-gray-400 text-sm font-bold hover:text-gray-600 py-2">
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col items-center animate-in slide-in-from-right-4 duration-300">
                    <h3 className="font-bold text-xl text-gray-800 mb-6">Agregar Foto {activeSlot + 1}</h3>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex items-center justify-center gap-3 w-full bg-pink-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors active:scale-95"
                        >
                            <Camera size={24} />
                            Tomar Foto Ahora
                        </button>

                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            className="flex items-center justify-center gap-3 w-full bg-gray-50 text-gray-700 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 transition-colors active:scale-95"
                        >
                            <ImageIcon size={24} />
                            Subir de la Galería
                        </button>

                        <button onClick={() => setActiveSlot(null)} className="mt-4 text-gray-400 text-sm font-bold hover:text-gray-600 py-2">
                            Volver
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={cameraInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={galleryInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}