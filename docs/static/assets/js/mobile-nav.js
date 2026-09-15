/**
 * @fileoverview Responsive documentation menu — a native `<details>`/`<summary>` disclosure
 * (`[data-mobile-nav]`) that needs no ARIA state management of its own, just behavior around it:
 * closing on navigation, closing when the viewport crosses back above the mobile breakpoint, and
 * returning focus to the toggle on Escape (a `<details>` element has no built-in Escape-to-close).
 * @module mobile-nav
 */

const mobileNav = document.querySelector('[data-mobile-nav]');

if (mobileNav) {
  const mobileNavBreakpoint = matchMedia('(max-width: 960px)');

  /**
   * Closes the mobile nav disclosure. Safe to call unconditionally — closing an already-closed
   * `<details>` is a no-op.
   * @returns {void}
   */
  function closeMobileNav() {
    mobileNav.open = false;
  }

  closeMobileNav();
  mobileNavBreakpoint.addEventListener('change', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
  mobileNav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mobileNav.open) return;
    event.preventDefault();
    closeMobileNav();
    mobileNav.querySelector('summary').focus();
  });
}
