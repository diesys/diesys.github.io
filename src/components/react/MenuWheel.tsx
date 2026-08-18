import { useCallback, useEffect, useRef, useState } from 'react';
import OptionWheel from './OptionWheel';

interface MenuItem {
  label: string;
  href: string;
}

interface MenuWheelProps {
  items: MenuItem[];
  defaultSelected?: number;
}

// Header menu that opens a full-screen overlay containing the OptionWheel,
// populated with the site's nav links. The wheel distinguishes browsing
// (scroll/arrows, via onChange) from committing (click/Enter, via onSelect):
// navigation happens only on commit. Colors are passed as var() references to
// the design tokens so the wheel follows the .dark swap without any JS.
export default function MenuWheel({ items, defaultSelected = 0 }: MenuWheelProps) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Astro's ClientRouter intercepts real <a> clicks; clicking a programmatically
  // created anchor preserves view transitions instead of doing a full reload.
  const navigate = useCallback((href: string) => {
    const link = document.createElement('a');
    link.href = href;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Esc closes the overlay while it's open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // Focus the wheel's listbox on open so arrow keys work without an extra tab.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      overlayRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const handleSelect = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      close();
      navigate(item.href);
    },
    [items, close, navigate],
  );

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="option-wheel-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="border-line text-ink-soft hover:border-signal hover:text-signal flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18"></path>
        </svg>
      </button>

      {open && (
        <div
          ref={overlayRef}
          id="option-wheel-menu"
          className="bg-paper/80 fixed inset-0 z-50 h-dvh flex items-center justify-center backdrop-blur-xl"
          onClick={close}
        >
          <div className="size-full" onClick={(e) => e.stopPropagation()}>
            <OptionWheel
              items={items.map((item) => item.label)}
              defaultSelected={defaultSelected}
              onSelect={handleSelect}
              textColor="var(--ink-soft)"
              activeColor="var(--signal)"
              fontSize={2}
              spacing={2}
              fade={0.2}
              // curve={2}
              // tilt={3}
              // blur={1}
              // minOpacity={0.06}
              // smoothing={180}
              // loop={items.length > 1}
            />
          </div>
        </div>
      )}
    </>
  );
}
