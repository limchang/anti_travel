import { useEffect, useRef } from 'react';

export default function useModalKeyboard(onClose: () => void, active: boolean = true): void {
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;

    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
        try { (previousFocusRef.current as HTMLElement).focus(); } catch (_) { /* noop */ }
      }
    };
  }, [onClose, active]);
}
