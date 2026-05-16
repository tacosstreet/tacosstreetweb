'use client';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function MobileCarousel({
  children,
  count,
  scrollClass,
}: {
  children: React.ReactNode;
  count: number;
  scrollClass: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const lastX = useRef(0);
  const vel = useRef(0);
  const lastT = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const containerLeft = el.getBoundingClientRect().left;
        const cards = Array.from(el.children) as HTMLElement[];
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.getBoundingClientRect().left - containerLeft);
          if (d < minDist) { minDist = d; closest = i; }
        });
        setCurrent(Math.min(closest, count - 1));
        if (el.scrollLeft > 20) setHintVisible(false);
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [count]);

  const scrollTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | null;
    if (!card) return;
    const offset = card.getBoundingClientRect().left - el.getBoundingClientRect().left;
    el.scrollTo({ left: el.scrollLeft + offset, behavior: 'smooth' });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.pageX;
    dragScrollLeft.current = el.scrollLeft;
    lastX.current = e.pageX;
    vel.current = 0;
    lastT.current = Date.now();
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    el.style.scrollSnapType = 'none';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = ref.current;
    if (!el) return;
    const now = Date.now();
    const dt = now - lastT.current;
    if (dt > 0) vel.current = (e.pageX - lastX.current) / dt;
    lastX.current = e.pageX;
    lastT.current = now;
    el.scrollLeft = dragScrollLeft.current - (e.pageX - dragStartX.current);
  }, []);

  const onMouseUp = useCallback(() => {
    const el = ref.current;
    if (!el || !isDragging.current) return;
    isDragging.current = false;
    el.style.cursor = 'grab';
    el.style.userSelect = '';
    el.style.scrollSnapType = '';
    const v = vel.current;
    let targetIdx = Math.abs(v) > 0.3
      ? v > 0 ? current - 1 : current + 1
      : current;
    targetIdx = Math.max(0, Math.min(targetIdx, count - 1));
    scrollTo(targetIdx);
  }, [current, count, scrollTo]);

  return (
    <>
      <div
        className={scrollClass}
        ref={ref}
        style={{ cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDragStart={e => e.preventDefault()}
      >{children}</div>
      <div className="mobile-carousel-controls">
        <div className="slider-dots">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              className={`slider-dot${current === i ? ' active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Ir a ${i + 1}`}
            />
          ))}
        </div>
        {hintVisible && (
          <div className="swipe-hint" aria-hidden="true">
            Desliza para ver más<span className="sh-arr">›</span>
          </div>
        )}
      </div>
    </>
  );
}
