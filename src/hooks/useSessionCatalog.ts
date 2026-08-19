import { useCallback, useEffect, useState } from 'react';
import { catalogService } from '../service/catalog.service';
import type { CatalogEntry } from '../types/types';

interface UseSessionCatalogResult {
    entries: CatalogEntry[];
    loading: boolean;
    error: boolean;
    refetch: () => void;
    patchEntry: (dateIdeaId: string, patch: Partial<CatalogEntry>) => void;
}

export function useSessionCatalog(sessionId: string | undefined): UseSessionCatalogResult {
    const [entries, setEntries] = useState<CatalogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(() => {
        if (!sessionId) return;
        setLoading(true);
        setError(false);
        catalogService
            .getSessionCatalog(sessionId)
            .then(setEntries)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [sessionId]);

    useEffect(() => {
        load();
    }, [load]);

    const patchEntry = useCallback((dateIdeaId: string, patch: Partial<CatalogEntry>) => {
        setEntries((prev) =>
            prev.map((entry) => (entry.id === dateIdeaId ? { ...entry, ...patch } : entry)),
        );
    }, []);

    useEffect(() => {
        if (!sessionId) return;

        return catalogService.subscribeToCompletions(sessionId, (memory) => {
            patchEntry(memory.date_idea_id, {
                isCompleted: true,
                memoryId: memory.id,
                photoUrl: memory.photo_url,
                photoUrl2: memory.photo_url_2,
                completedAt: memory.created_at,
            });
        });
    }, [sessionId, patchEntry]);

    return { entries, loading, error, refetch: load, patchEntry };
}
