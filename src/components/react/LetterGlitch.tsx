import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
const FONT_SIZE = 16;
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;
// Cap the backing-store resolution: at 1.5x the effect looks the same but
// halves the fill work on high-DPI screens (relevant for the Lighthouse gate).
const MAX_DPR = 1.5;

interface Letter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

interface Props {
  glitchSpeed?: number;
  smooth?: boolean;
  centerVignette?: boolean;
  outerVignette?: boolean;
  characters?: string;
}

// Canvas "letter glitch" background, adapted from ReactBits.dev's LetterGlitch.
// The original hardcoded a dark palette and a black backdrop; here every color
// is resolved live from the site's design tokens (--ink/--ink-soft/--signal/
// --paper), the .dark theme swap is picked up via a MutationObserver, and
// prefers-reduced-motion renders a single static frame instead of animating.
export default function LetterGlitch({
  glitchSpeed = 50,
  smooth = true,
  centerVignette = false,
  outerVignette = true,
  characters = DEFAULT_CHARACTERS,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = Array.from(characters);

    const readToken = (name: string): string =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '';

    // Palette ordered: mostly subtle (ink-soft), with ink and the single accent
    // (signal) for the occasional pop — matches the site's one-accent design.
    const palette = (): string[] =>
      [readToken('--ink-soft'), readToken('--ink'), readToken('--signal')].filter(Boolean);

    let letters: Letter[] = [];
    let columns = 0;
    let rows = 0;
    let animationId: number | null = null;
    let lastGlitchTime = 0;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];
    const getRandomColor = () => {
      const p = palette();
      return p.length > 0 ? p[Math.floor(Math.random() * p.length)] : '#000000';
    };

    const hexToRgb = (hex: string) => {
      const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthand, (_m, r, g, b) => r + r + g + g + b + b);
      const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return match
        ? {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16),
          }
        : null;
    };

    const interpolateColor = (
      start: { r: number; g: number; b: number },
      end: { r: number; g: number; b: number },
      factor: number,
    ): string =>
      `rgb(${Math.round(start.r + (end.r - start.r) * factor)}, ${Math.round(
        start.g + (end.g - start.g) * factor,
      )}, ${Math.round(start.b + (end.b - start.b) * factor)})`;

    const initializeLetters = (cols: number, rws: number) => {
      columns = cols;
      rows = rws;
      letters = Array.from({ length: cols * rws }, () => ({
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1,
      }));
    };

    const drawLetters = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      // Canvas font strings can't resolve var(); read the site's mono family
      // (--ff-mono) each draw and fall back to generic monospace.
      const mono = readToken('--ff-mono') || 'monospace';
      ctx.font = `${FONT_SIZE}px ${mono}`;
      ctx.textBaseline = 'top';
      letters.forEach((letter, index) => {
        const x = (index % columns) * CHAR_WIDTH;
        const y = Math.floor(index / columns) * CHAR_HEIGHT;
        ctx.fillStyle = letter.color;
        ctx.fillText(letter.char, x, y);
      });
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initializeLetters(Math.ceil(rect.width / CHAR_WIDTH), Math.ceil(rect.height / CHAR_HEIGHT));
      drawLetters();
    };

    const updateLetters = () => {
      const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
      for (let i = 0; i < updateCount; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        if (!letter) continue;
        letter.char = getRandomChar();
        letter.targetColor = getRandomColor();
        if (!smooth) {
          letter.color = letter.targetColor;
          letter.colorProgress = 1;
        } else {
          letter.colorProgress = 0;
        }
      }
    };

    const handleSmoothTransitions = () => {
      let needsRedraw = false;
      letters.forEach((letter) => {
        if (letter.colorProgress < 1) {
          letter.colorProgress += 0.05;
          if (letter.colorProgress > 1) letter.colorProgress = 1;
          const startRgb = hexToRgb(letter.color);
          const endRgb = hexToRgb(letter.targetColor);
          if (startRgb && endRgb) {
            letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
            needsRedraw = true;
          }
        }
      });
      if (needsRedraw) drawLetters();
    };

    const animate = () => {
      if (reducedMotion) return;
      const now = Date.now();
      if (now - lastGlitchTime >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime = now;
      }
      if (smooth) handleSmoothTransitions();
      animationId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (animationId !== null) return;
      lastGlitchTime = Date.now();
      animate();
    };

    const stopLoop = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    // Respect prefers-reduced-motion: one static frame, no loop, and react to
    // a mid-session preference change as well.
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        stopLoop();
        resizeCanvas();
      } else {
        startLoop();
      }
    };

    // The .dark class swaps the design tokens; letters cache their own hex, so
    // re-read the palette and rebuild the grid whenever the theme changes.
    const themeObserver = new MutationObserver(() => {
      initializeLetters(columns, rows);
      drawLetters();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        stopLoop();
        resizeCanvas();
        if (!reducedMotion) startLoop();
      }, 100);
    };

    resizeCanvas();
    if (!reducedMotion) startLoop();
    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopLoop();
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
      themeObserver.disconnect();
    };
  }, [glitchSpeed, smooth, characters]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    // Token, not a hardcoded color: resolves live, so it follows the .dark swap.
    backgroundColor: 'var(--paper)',
    overflow: 'hidden',
  };
  const canvasStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
  };
  const vignetteStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle} aria-hidden="true">
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && (
        <div
          style={{
            ...vignetteStyle,
            background: 'radial-gradient(circle, transparent 60%, var(--paper) 100%)',
          }}
        />
      )}
      {centerVignette && (
        <div
          style={{
            ...vignetteStyle,
            background: 'radial-gradient(circle, var(--paper) 0%, transparent 60%)',
          }}
        />
      )}
    </div>
  );
}
