export interface DateIdea {
    id: string;
    title: string;
    description: string;
    category: 'Romántica' | 'Aventura' | 'Gastronomía' | 'Relax';
    difficulty: 1 | 2 | 3;
}

export interface Memory {
    id: string;
    date_id: string;
    photo_urls: string[];
    created_at: string;
}