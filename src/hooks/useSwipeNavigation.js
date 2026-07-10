import { useRef } from 'react';

const SWIPE_THRESHOLD = 40;

const MAX_VERTICAL_RATIO = 0.6;

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight }) {
    const touchStart = useRef(null);

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
        if (Math.abs(deltaY) > Math.abs(deltaX) * MAX_VERTICAL_RATIO) return;

        if (deltaX < 0) {
        onSwipeLeft?.();
        } else {
        onSwipeRight?.();
        }
    };

    const handleTouchCancel = () => {
        touchStart.current = null;
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchCancel,
    };
}
