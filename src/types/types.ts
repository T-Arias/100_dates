// `category` is a free-text column in Supabase, not a DB enum — treat it as an open string.
export interface DateIdea {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 1 | 2 | 3;
}

export interface Memory {
    id: string;
    date_id: string;
    photo_urls: string[];
    created_at: string;
}

export interface CatalogEntry extends DateIdea {
    isCompleted: boolean;
    memoryId: string | null;
    photoUrl: string | null;
    photoUrl2: string | null;
    completedAt: string | null;
}

export type CatalogStatus = 'todas' | 'pendientes' | 'completadas';
