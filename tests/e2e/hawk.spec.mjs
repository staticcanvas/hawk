import { test, expect } from '@playwright/test';

/**
 * Real-browser coverage against hawk's own docs site — its actual production mount
 * (docs/layouts/_default/baseof.html), a real built Pagefind index over real content, not a
 * synthetic fixture or jsdom. Complements tests/hawk.test.js's unit coverage, which never
 * exercises a real browser, real layout, or a real Pagefind index.
 */
test.describe('hawk against a real Pagefind index in a real browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('opens via the trigger button and via Ctrl+K, and Escape closes it', async ({ page }) => {
    const modal = page.locator('.hawk-modal');
    await expect(modal).toBeHidden();

    await page.locator('[data-search-trigger]').first().click();
    await expect(modal).toBeVisible();
    await expect(page.locator('.hawk-modal-input')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    await page.keyboard.press('Control+k');
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });

  test('typing a real query returns a real result with a working preview', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('pagefind');

    const firstResult = page.locator('.hawk-result-item').first();
    await expect(firstResult).toBeVisible();
    await expect(page.locator('.hawk-modal-counter')).not.toHaveText('Type to search');

    // The preview pane renders real fetched page content, not just Pagefind's excerpt.
    await expect(page.locator('.hawk-preview-content')).not.toHaveText('');
  });

  test('the results pane actually scrolls a long list instead of silently clipping it', async ({ page }) => {
    // Regression test for a real CSS Grid bug jsdom can't catch (no layout engine): without an
    // explicit grid-template-rows track and min-height:0 on the panes, .hawk-results-pane grew
    // to fit all content instead of being clamped by .hawk-modal-body, and the outer
    // overflow:hidden silently clipped everything past ~480px — results existed in the DOM and
    // in state.matches, but were visually unreachable past the first handful of rows.
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('pagefind'); // a broad term with enough matches to overflow
    await expect(page.locator('.hawk-result-item').first()).toBeVisible();

    const { offsetHeight, scrollHeight } = await page.locator('.hawk-results-pane').evaluate((el) => ({
      offsetHeight: el.offsetHeight,
      scrollHeight: el.scrollHeight,
    }));
    expect(scrollHeight).toBeGreaterThan(offsetHeight);

    const lastResult = page.locator('.hawk-result-item').last();
    await lastResult.scrollIntoViewIfNeeded();
    await expect(lastResult).toBeInViewport();
  });

  test('ArrowDown/ArrowUp move the selection and Enter navigates to the selected result', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('guide');
    await expect(page.locator('.hawk-result-item').first()).toBeVisible();

    await page.keyboard.press('ArrowDown');
    const selected = page.locator('.hawk-result-item.is-selected');
    await expect(selected).toHaveCount(1);
    const targetHref = await selected.getAttribute('href');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(targetHref.replace(/\/$/, '') + '/?$'));
  });

  test('Tab focus is trapped inside the modal: Shift+Tab from the input wraps to the last stop', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    const input = page.locator('.hawk-modal-input');
    await expect(input).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    const activeClass = await page.evaluate(() => document.activeElement?.className ?? '');
    // Wrapped to a stop inside the modal (results/preview pane, or the last density/esc button),
    // never escaping to the page behind the backdrop (e.g. the header's brand link).
    expect(activeClass).not.toBe('brand');
    const isInsideModal = await page.evaluate(
      () => !!document.activeElement?.closest('.hawk-modal')
    );
    expect(isInsideModal).toBe(true);
  });

  test('the density switcher changes and persists the layout across reopen', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-density-btn[data-density="compact"]').click();
    await expect(page.locator('.hawk-modal')).toHaveAttribute('data-hawk-density', 'compact');

    await page.keyboard.press('Escape');
    await page.locator('[data-search-trigger]').first().click();
    await expect(page.locator('.hawk-modal')).toHaveAttribute('data-hawk-density', 'compact');

    const stored = await page.evaluate(() => localStorage.getItem('hawk:density'));
    expect(stored).toBe('compact');
  });
});
