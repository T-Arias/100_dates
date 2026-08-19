import { Heart, Flame, Utensils, Coffee, PartyPopper, Sparkles, type LucideIcon } from 'lucide-react';

interface CategoryMeta {
    icon: LucideIcon;
    textClass: string;
    bgClass: string;
}

// `date_ideas.category` is free text in Supabase, not a DB enum — new categories can appear
// at any time. Only the ones known today get a curated icon/color; anything else falls back
// to DEFAULT_CATEGORY_META instead of crashing (see getCategoryMeta).
export const CATEGORIES = ['Romántica', 'Aventura', 'Gastronomía', 'Relax', 'Diversión'];

const KNOWN_CATEGORY_META: Record<string, CategoryMeta> = {
    'Romántica': { icon: Heart, textClass: 'text-pink-500', bgClass: 'bg-pink-50' },
    'Aventura': { icon: Flame, textClass: 'text-orange-500', bgClass: 'bg-orange-50' },
    'Gastronomía': { icon: Utensils, textClass: 'text-yellow-600', bgClass: 'bg-yellow-50' },
    'Relax': { icon: Coffee, textClass: 'text-blue-500', bgClass: 'bg-blue-50' },
    'Diversión': { icon: PartyPopper, textClass: 'text-purple-500', bgClass: 'bg-purple-50' },
};

const DEFAULT_CATEGORY_META: CategoryMeta = {
    icon: Sparkles,
    textClass: 'text-gray-500',
    bgClass: 'bg-gray-50',
};

export function getCategoryMeta(category: string): CategoryMeta {
    return KNOWN_CATEGORY_META[category] ?? DEFAULT_CATEGORY_META;
}
