import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SearchX, PartyPopper, AlertTriangle } from 'lucide-react';
import { useSessionCatalog } from '../hooks/useSessionCatalog';
import { useCollapsibleHeader } from '../hooks/useCollapsibleHeader';
import { CatalogHeader } from '../components/catalog/CatalogHeader';
import { DateRow } from '../components/catalog/DateRow';
import { DateSheet } from '../components/catalog/DateSheet';
import { filterCatalog } from '../lib/catalogFilter';
import type { CatalogEntry, CatalogStatus } from '../types/types';

const HEADER_COLLAPSE_AT = 112;

function RowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 min-h-16 bg-white rounded-2xl border border-gray-100 animate-pulse">
            <div className="shrink-0 w-11 h-11 rounded-xl bg-gray-100" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
                <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
            </div>
        </div>
    );
}

export function CatalogPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { entries, loading, error, patchEntry } = useSessionCatalog(sessionId);
    const collapsed = useCollapsibleHeader(HEADER_COLLAPSE_AT);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const q = searchParams.get('q') ?? '';
    const category = searchParams.get('cat') ?? 'Todas';
    const status = (searchParams.get('estado') as CatalogStatus | null) ?? 'todas';

    const updateParams = (patch: Record<string, string>) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(patch).forEach(([key, value]) => {
            if (!value || value === 'todas' || value === 'Todas') {
                next.delete(key);
            } else {
                next.set(key, value);
            }
        });
        setSearchParams(next, { replace: true });
    };

    const filtered = useMemo(
        () => filterCatalog(entries, { q, category, status }),
        [entries, q, category, status],
    );

    const completedCount = useMemo(() => entries.filter((e) => e.isCompleted).length, [entries]);
    const selectedEntry: CatalogEntry | null = entries.find((e) => e.id === selectedId) ?? null;

    const handleCompleted = (dateIdeaId: string, memory: { id: string; photo_url: string; photo_url_2: string; created_at: string }) => {
        patchEntry(dateIdeaId, {
            isCompleted: true,
            memoryId: memory.id,
            photoUrl: memory.photo_url,
            photoUrl2: memory.photo_url_2,
            completedAt: memory.created_at,
        });
        setSelectedId(null);
    };

    const clearFilters = () => updateParams({ q: '', cat: '', estado: '' });

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <CatalogHeader
                total={entries.length}
                completedCount={completedCount}
                q={q}
                category={category}
                status={status}
                collapsed={collapsed}
                onBack={() => navigate(-1)}
                onQChange={(value) => updateParams({ q: value })}
                onCategoryChange={(value) => updateParams({ cat: value })}
                onStatusChange={(value) => updateParams({ estado: value })}
            />

            <div className="p-4 space-y-2">
                {loading && (
                    <>
                        {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
                    </>
                )}

                {!loading && error && (
                    <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <AlertTriangle size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No pudimos cargar el catálogo.</p>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && status === 'pendientes' && (
                    <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-pink-200">
                        <PartyPopper size={40} className="text-pink-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-bold">¡Completaron las 100 citas! 🎉</p>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && status !== 'pendientes' && (
                    <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <SearchX size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium mb-4">
                            {q ? `No encontramos «${q}»` : 'No hay citas con estos filtros'}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-pink-600 font-bold text-sm hover:underline focus-visible:ring-2 focus-visible:ring-pink-500 outline-none rounded"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                {!loading && !error && filtered.map((entry) => (
                    <DateRow key={entry.id} entry={entry} onSelect={(e) => setSelectedId(e.id)} />
                ))}
            </div>

            {sessionId && (
                <DateSheet
                    entry={selectedEntry}
                    sessionId={sessionId}
                    onClose={() => setSelectedId(null)}
                    onCompleted={handleCompleted}
                />
            )}
        </div>
    );
}
