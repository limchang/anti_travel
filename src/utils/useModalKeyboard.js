import { useEffect, useRef } from 'react';

/**
 * 모달 Escape 키 닫기 + 포커스 저장/복원 훅
 * @param {Function} onClose - 모달 닫기 콜백
 * @param {boolean} [active=true] - 훅 활성화 여부
 */
export default function useModalKeyboard(onClose, active = true) {
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        try { previousFocusRef.current.focus(); } catch (_) { /* noop */ }
      }
    };
  }, [onClose, active]);
}
