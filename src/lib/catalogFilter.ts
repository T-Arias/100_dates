import type { CatalogEntry, CatalogStatus } from '../types/types';
import { normalize } from './text';

export interface CatalogFilters {
    q: string;
    category: string;
    status: CatalogStatus;
}

export function filterCatalog(entries: CatalogEntry[], filters: CatalogFilters): CatalogEntry[] {
    const q = normalize(filters.q.trim());

    return entries.filter((entry) => {
        if (filters.category !== 'Todas' && entry.category !== filters.category) {
            return false;
        }

        if (filters.status === 'pendientes' && entry.isCompleted) {
            return false;
        }

        if (filters.status === 'completadas' && !entry.isCompleted) {
            return false;
        }

        if (q.length > 0) {
            const haystack = normalize(`${entry.title} ${entry.description}`);
            if (!haystack.includes(q)) {
                return false;
            }
        }

        return true;
    });
}
