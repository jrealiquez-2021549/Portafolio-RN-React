import { createContext, useContext, useRef, useState, useCallback } from 'react';

const LightboxContext = createContext(null);

export function LightboxProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
    title: '',
  });
  const onCloseCallbackRef = useRef(null);

  const openLightbox = useCallback((images, startIndex, title, onClose) => {
    if (!images || !images.length) return;
    onCloseCallbackRef.current = typeof onClose === 'function' ? onClose : null;
    setState({ isOpen: true, images, startIndex: startIndex || 0, title: title || '' });
  }, []);

  const closeLightbox = useCallback((finalIndex) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (onCloseCallbackRef.current) {
      onCloseCallbackRef.current(finalIndex);
      onCloseCallbackRef.current = null;
    }
  }, []);

  return (
    <LightboxContext.Provider value={{ ...state, openLightbox, closeLightbox }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox debe usarse dentro de LightboxProvider');
  return ctx;
}
