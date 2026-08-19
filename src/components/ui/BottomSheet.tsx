import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return;

        triggerRef.current = document.activeElement as HTMLElement | null;
        panelRef.current?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
            triggerRef.current?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-end justify-center overflow-hidden min-[480px]:items-center min-[480px]:p-6">
            <div
                className="absolute inset-0 bg-black/50 animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl min-[480px]:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up outline-none"
            >
                <div className="shrink-0 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-black text-lg text-gray-800 truncate pr-4">{title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="shrink-0 p-2 -mr-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:scale-90 transition-all focus-visible:ring-2 focus-visible:ring-pink-500 outline-none"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}
