/**
 * @fileoverview Table-of-contents behavior: collapses into a `[data-toc-disclosure]` toggle below
 * the 960px breakpoint (matching the mobile nav's own breakpoint), closes on link click while
 * collapsed, and highlights the currently-visible heading via `IntersectionObserver` — an
 * approach that reacts to what's actually on screen rather than approximating from `scrollY`.
 * @module toc-scrollspy
 */

const toc = document.querySelector('.doc-toc');

if (toc) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tocDisclosure = toc.querySelector('[data-toc-disclosure]');
  const tocBreakpoint = matchMedia('(max-width: 960px)');

  /**
   * Keeps the TOC disclosure open above the breakpoint and closed (collapsed-by-default) below
   * it, re-run on every breakpoint crossing.
   * @returns {void}
   */
  function syncTocDisclosure() {
    if (tocDisclosure) tocDisclosure.open = !tocBreakpoint.matches;
  }

  syncTocDisclosure();
  tocBreakpoint.addEventListener('change', syncTocDisclosure);

  const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
  tocLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (tocDisclosure && tocBreakpoint.matches) tocDisclosure.open = false;
    });
  });

  const headingLinks = tocLinks
    .map((link) => ({
      link,
      heading: document.getElementById(decodeURIComponent(link.hash.slice(1))),
    }))
    .filter(({ heading }) => heading);

  /**
   * Marks the TOC link for `id` as the current location (`aria-current="location"`) and clears
   * that state from every other link, scrolling the active link into view within the TOC itself
   * (not the page) so a long TOC tracks scroll position without the reader hunting for it.
   * @param {string} id The heading element's `id`.
   * @returns {void}
   */
  function setCurrentHeading(id) {
    headingLinks.forEach(({ link }) => {
      if (decodeURIComponent(link.hash.slice(1)) === id) {
        link.setAttribute('aria-current', 'location');
        link.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (headingLinks.length && 'IntersectionObserver' in window) {
    /** @type {Map<string, number>} Heading id -> its current boundingClientRect.top. */
    const visibleHeadings = new Map();
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleHeadings.set(entry.target.id, entry.boundingClientRect.top);
          else visibleHeadings.delete(entry.target.id);
        });
        // Topmost visible heading wins — the one the reader is most likely looking at.
        const current = [...visibleHeadings.entries()].sort((a, b) => a[1] - b[1])[0];
        if (current) setCurrentHeading(current[0]);
      },
      { rootMargin: '-12% 0px -72% 0px', threshold: [0, 1] }
    );
    headingLinks.forEach(({ heading }) => tocObserver.observe(heading));
    setCurrentHeading(headingLinks[0].heading.id);
  }
}
