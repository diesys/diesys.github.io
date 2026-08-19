import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteMenu from './InfiniteMenu';
import MorphSlider from './MorphSlider';

export interface GalleryCategory {
  id: string;
  title: string;
  image: string;
  images: string[];
}

interface GalleryProps {
  categories: GalleryCategory[];
}

// Wires the react-bits components together for the /gallery page:
// - InfiniteMenu shows one thumbnail per category on a rotatable 3D sphere;
//   its action button (↗) is the only way to open a category.
// - Selecting a category opens a full-screen modal hosting a MorphSlider
//   that cross-fades through every image of that category.
export default function Gallery({ categories }: GalleryProps) {
  const [selected, setSelected] = useState<GalleryCategory | null>(null);

  const items = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        image: category.image,
        title: category.title,
        description: `${category.images.length} images`,
      })),
    [categories],
  );

  const sliderItems = useMemo(
    () => (selected ? selected.images.map((image) => ({ image })) : []),
    [selected],
  );

  const open = useCallback((category: GalleryCategory) => setSelected(category), []);
  const close = useCallback(() => setSelected(null), []);

  // Close on Escape and lock page scroll while the modal is open.
  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected, close]);

  return (
    <div className="relative h-full w-full">
      <InfiniteMenu
        items={items}
        onSelect={(item) => {
          const category = categories.find((c) => c.id === item.id);
          if (category) open(category);
        }}
      />

      {selected && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          {/* Backdrop — click anywhere outside the panel to close. */}
          <div
            className="bg-paper/90 absolute inset-0 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />
          <div
            className="relative flex h-full flex-col p-4 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-display text-ink text-2xl">{selected.title}</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="border-line text-ink-soft hover:text-ink hover:border-ink grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="min-h-0 flex-1">
              <MorphSlider
                items={sliderItems}
                showCaptions={false}
                loop
                overlayColor="#101114"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
