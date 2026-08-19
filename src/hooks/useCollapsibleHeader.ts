import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 6;

export function useCollapsibleHeader(collapseAt: number): boolean {
    const [collapsed, setCollapsed] = useState(false);
    const lastY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;

                if (y < collapseAt) {
                    setCollapsed(false);
                } else {
                    const delta = y - lastY.current;
                    if (Math.abs(delta) > SCROLL_THRESHOLD || reduced) {
                        setCollapsed(delta > 0);
                    }
                }

                lastY.current = y;
                ticking.current = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [collapseAt]);

    return collapsed;
}
