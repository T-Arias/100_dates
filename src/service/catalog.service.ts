import { supabase } from '../lib/supabase';
import type { CatalogEntry } from '../types/types';

interface CatalogRow {
    id: string;
    title: string;
    description: string;
    category: CatalogEntry['category'];
    difficulty: 1 | 2 | 3;
    is_completed: boolean;
    memory_id: string | null;
    photo_url: string | null;
    photo_url_2: string | null;
    completed_at: string | null;
}

function mapRow(row: CatalogRow): CatalogEntry {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        isCompleted: row.is_completed,
        memoryId: row.memory_id,
        photoUrl: row.photo_url,
        photoUrl2: row.photo_url_2,
        completedAt: row.completed_at,
    };
}

export const catalogService = {
    async getSessionCatalog(sessionId: string): Promise<CatalogEntry[]> {
        const { data, error } = await supabase.rpc('get_session_catalog', {
            p_session_id: sessionId,
        });

        if (error) throw error;
        return ((data ?? []) as CatalogRow[]).map(mapRow);
    },

    subscribeToCompletions(
        sessionId: string,
        onInsert: (memory: {
            date_idea_id: string;
            id: string;
            photo_url: string;
            photo_url_2: string;
            created_at: string;
        }) => void,
    ) {
        const channel = supabase
            .channel(`catalog:${sessionId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'memories',
                    filter: `session_id=eq.${sessionId}`,
                },
                (payload) => onInsert(payload.new as never),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },
};
