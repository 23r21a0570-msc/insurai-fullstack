import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip = ({ content, children, side = 'top', className }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = rect.top - gap;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }

    setCoords({ top, left });
  }, [visible, side]);

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    top: coords.top,
    left: coords.left,
    transform:
      side === 'top'
        ? 'translate(-50%, -100%)'
        : side === 'bottom'
        ? 'translate(-50%, 0)'
        : side === 'left'
        ? 'translate(-100%, -50%)'
        : 'translate(0, -50%)',
    pointerEvents: 'none',
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('inline-flex', className)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>

      {visible && (
        <div ref={tooltipRef} style={tooltipStyle}>
          <div className="rounded-lg border border-white/[0.10] bg-[#0F1629] px-2.5 py-1.5 text-[11px] font-medium text-gray-300 shadow-xl shadow-black/40 whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
