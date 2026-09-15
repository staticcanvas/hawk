/**
 * @fileoverview Three independent, scroll-driven chrome behaviors, grouped in one file because
 * each is a small `window`/`document` scroll listener with no shared state between them:
 *  1. A "currently scrolling" data attribute that brightens the themed scrollbar thumb (see the
 *     theming guide's token table for `--hawk-scrollbar-thumb`/`-active`).
 *  2. The "back to top" button's visibility and click behavior.
 *  3. Fade/slide-in reveal for any `[data-reveal]` element as it enters the viewport.
 * All three respect `prefers-reduced-motion` where relevant — reveal skips the observer
 * entirely (elements start visible), and back-to-top's scroll is instant instead of smooth.
 * @module scroll-effects
 */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Site-wide scrollbar activity ───────────────────────────────────────────────────────────
/** @type {WeakMap<Element, ReturnType<typeof setTimeout>>} */
const scrollbarTimers = new WeakMap();

/**
 * Marks `target` (or `document.documentElement` for a `document`-level scroll event) as actively
 * scrolling for 550ms, so the themed scrollbar thumb's CSS can brighten while it's true.
 * @param {EventTarget} target The event's `target` — an `Element`, or `document` itself.
 * @returns {void}
 */
function markScrolling(target) {
  const scrollable = target === document ? document.documentElement : target;
  if (!(scrollable instanceof Element)) return;
  scrollable.dataset.siteScrolling = 'true';
  clearTimeout(scrollbarTimers.get(scrollable));
  scrollbarTimers.set(
    scrollable,
    setTimeout(() => {
      scrollable.dataset.siteScrolling = 'false';
    }, 550)
  );
}

document.addEventListener('scroll', (event) => markScrolling(event.target), {
  capture: true,
  passive: true,
});
window.addEventListener('scroll', () => markScrolling(document.documentElement), { passive: true });

// ── Back to top ─────────────────────────────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  // One shared threshold rather than a per-viewport-height fraction — appearing only after a
  // real scroll (not "half a phone screen") keeps it from popping in on short pages where there
  // was nowhere meaningful to scroll from.
  const revealAfterPx = 600;
  const syncVisibility = () => {
    backToTop.hidden = window.scrollY < revealAfterPx;
  };
  syncVisibility();
  window.addEventListener('scroll', syncVisibility, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

// ── Scroll-reveal ───────────────────────────────────────────────────────────────────────────
// Fades/slides [data-reveal] elements in as they enter the viewport. Skips everything (elements
// start fully visible, no observer attached) when prefers-reduced-motion is set, or if
// IntersectionObserver isn't available at all — a static page is a correct fallback for either
// case, not a broken one.
const revealTargets = document.querySelectorAll('[data-reveal]');
if (revealTargets.length && !reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-revealed'));
}
