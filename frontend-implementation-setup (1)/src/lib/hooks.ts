import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [dv, setDv] = useState<T>(value);
  useEffect(() => { const h = setTimeout(() => setDv(value), delay); return () => clearTimeout(h); }, [value, delay]);
  return dv;
};

export const useLocalStorage = <T>(key: string, init: T) => {
  const [val, setVal] = useState<T>(() => { try { const i = localStorage.getItem(key); return i ? JSON.parse(i) : init; } catch { return init; } });
  const set = useCallback((v: T | ((p: T) => T)) => {
    const next = v instanceof Function ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key, val]);
  return [val, set] as const;
};

export const useClickOutside = <T extends HTMLElement>(handler: () => void): RefObject<T | null> => {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => { if (!ref.current || ref.current.contains(e.target as Node)) return; handler(); };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => { document.removeEventListener('mousedown', listener); document.removeEventListener('touchstart', listener); };
  }, [handler]);
  return ref;
};

export const useToggle = (init = false) => {
  const [val, setVal] = useState(init);
  const toggle = useCallback(() => setVal(p => !p), []);
  return [val, toggle, setVal] as const;
};

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => { const h = () => setSize({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  return size;
};

export const usePagination = <T>(data: T[], pageSize = 10) => {
  const [page, setPage] = useState(1);
  const total    = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);
  return { page, setPage, total, paginated, pageSize };
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width < 768;
};
