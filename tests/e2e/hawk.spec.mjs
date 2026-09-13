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

  test('documentation code blocks expose a working copy control', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__copiedCode = text;
          },
        },
      });
    });
    await page.goto('getting-started/index.html');

    const copyButton = page.locator('.code-copy-btn').first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();
    await expect(copyButton).toHaveText('Copied');
    await expect.poll(() => page.evaluate(() => window.__copiedCode)).toContain('npm install');
  });

  test('the homepage release line and logo-title lockup use the compact centered hero', async ({
    page,
  }) => {
    const release = page.locator('.hero-release');
    const titleRow = page.locator('.hero-title-row');
    const logo = titleRow.locator('.hero-logo');
    const title = titleRow.locator('.hero-title');

    await expect(release).toHaveText(`Version v0.11.0 released · MIT License`);
    await expect(logo).toBeVisible();
    await expect(title).toHaveText('hawk.js');

    const layout = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const row = document.querySelector('.hero-title-row').getBoundingClientRect();
      const logoBox = document.querySelector('.hero-logo').getBoundingClientRect();
      const titleBox = document.querySelector('.hero-title').getBoundingClientRect();
      return {
        paddingTop: Number.parseFloat(getComputedStyle(hero).paddingTop),
        releaseMarginTop: Number.parseFloat(
          getComputedStyle(document.querySelector('.hero-release')).marginTop
        ),
        rowCenter: row.left + row.width / 2,
        viewportCenter: window.innerWidth / 2,
        verticallyAligned: Math.abs(
          logoBox.top + logoBox.height / 2 - (titleBox.top + titleBox.height / 2)
        ),
      };
    });
    expect(layout.paddingTop).toBeLessThanOrEqual(24);
    expect(layout.releaseMarginTop).toBeGreaterThan(0);
    expect(Math.abs(layout.rowCenter - layout.viewportCenter)).toBeLessThanOrEqual(2);
    expect(layout.verticallyAligned).toBeLessThanOrEqual(2);
  });

  test('the homepage search-model gallery renders its data manifest and crossfades one card at a time', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto('index.html');

    const gallery = page.locator('[data-search-gallery]');
    const track = gallery.locator('[data-gallery-track]');
    const cards = track.locator('.showcase-card');
    const galleryTitle = gallery.locator('#search-gallery-title');
    await expect(galleryTitle).toHaveText('Search that belongs to your site.');
    await expect(gallery.locator('.search-gallery__header')).toContainText(
      'compact, two-column, filtered, and saved-result layouts'
    );
    await expect(galleryTitle).toHaveCount(1);
    await expect(cards).toHaveCount(4);
    await expect(cards.first().locator('img')).toHaveAttribute('src', /assets\/compact\.png$/);
    await expect
      .poll(() =>
        cards
          .first()
          .locator('img')
          .evaluate((image) => image.naturalWidth)
      )
      .toBeGreaterThan(0);

    // Screenshots are large, so only one card is shown at a time — no arrow navigation, same
    // JSON source, the rest sit hidden behind the active card until autoplay turns to them.
    await expect(gallery.locator('[data-gallery-scroll]')).toHaveCount(0);
    await expect(gallery).not.toContainText('Search layouts');
    await expect(cards.first()).toHaveClass(/is-active/);
    await expect(cards.nth(1)).not.toHaveClass(/is-active/);

    await expect(cards.nth(1).locator('.showcase-card__media')).toHaveCSS('animation-name', 'none');

    // Autoplay crossfades to the next card roughly every 4.2s.
    await expect(cards.nth(1)).toHaveClass(/is-active/, { timeout: 6000 });
    await expect(cards.first()).not.toHaveClass(/is-active/);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(360);

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.reload();
    const desktopTrack = page.locator('[data-gallery-track]');
    const desktopMedia = desktopTrack.locator('.showcase-card.is-active .showcase-card__media');
    const desktopImage = desktopMedia.locator('img');
    const desktopLayout = await desktopMedia.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, ratio: box.width / box.height };
    });
    expect(desktopLayout.width).toBeGreaterThan(900);
    expect(desktopLayout.ratio).toBeCloseTo(21 / 9, 1);
    await expect(desktopImage).toHaveCSS('object-fit', 'contain');
  });

  test('homepage capability cards use title initials and semantic emphasis', async ({ page }) => {
    const cards = page.locator('.feature-card');
    await expect(cards).toHaveCount(9);
    await expect(cards.locator('.feature-index')).toHaveText([
      'P',
      'T',
      'T',
      'R',
      'M',
      'F',
      'K',
      'P',
      'Z',
    ]);
    await expect(cards.locator('p strong')).toHaveCount(9);
    await expect(cards.locator('p em')).toHaveCount(9);
    await expect(cards.locator('.feature-index').first()).toHaveCSS(
      'font-family',
      /Rubik Spray Paint/
    );
    await expect(page.locator('.feature-heading h3')).toHaveText("Hawk's features");
  });

  test('homepage headings, guides, demo note, and footer retain their editorial layout', async ({
    page,
  }) => {
    const sectionTitle = page.locator('.feature-section > .section-heading h2');
    await expect(sectionTitle).toHaveText('Search that belongs to your site.');
    const titleCenterOffset = await sectionTitle.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return Math.abs(box.left + box.width / 2 - window.innerWidth / 2);
    });
    expect(titleCenterOffset).toBeLessThanOrEqual(2);

    const guideMarkers = page.locator('.guide-card__index');
    await expect(guideMarkers.first()).not.toHaveText(/^\d+$/);
    await expect(guideMarkers.first()).toHaveCSS('font-family', /Rubik Spray Paint/);

    const comment = page.locator('.home-note__comment');
    await expect(comment).toContainText('This site’s own search box');
    await expect(comment.locator(':scope > span')).toHaveText(['/*', '*/']);

    const footerColumns = page.locator('.footer-grid > .footer-column');
    await expect(footerColumns.locator('strong')).toHaveText([
      'Resources',
      'Documentation',
      'Project',
    ]);
    await expect(page.locator('.footer-grid > *')).toHaveCount(4);

    await page.setViewportSize({ width: 1024, height: 900 });
    const compactGuidePositions = await page
      .locator('.guide-card')
      .evaluateAll((cards) => cards.slice(0, 2).map((card) => card.getBoundingClientRect().left));
    expect(Math.abs(compactGuidePositions[0] - compactGuidePositions[1])).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 1280, height: 900 });
    const wideGuidePositions = await page
      .locator('.guide-card')
      .evaluateAll((cards) => cards.slice(0, 2).map((card) => card.getBoundingClientRect().left));
    expect(Math.abs(wideGuidePositions[0] - wideGuidePositions[1])).toBeGreaterThan(2);
  });

  test('docs, modal, tables, and playground do not overflow phone or tablet viewports', async ({
    page,
  }) => {
    for (const width of [360, 390, 768, 960, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('index.html');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width);

      await page.goto('guides/theming/index.html');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width);
      await expect(page.locator('.doc-content table').first()).toBeVisible();

      await page.locator('[data-search-trigger]').first().click();
      const dialogBox = await page.locator('.hawk-modal-dialog').boundingBox();
      expect(dialogBox.width).toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');

      await page.goto('playground/index.html');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width);
      await expect(page.locator('.page-shell--playground')).toHaveCount(1);
      await expect(page.locator('.doc-page--playground .doc-header')).toHaveCount(0);

      await page.goto('themes/index.html');
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
        .toBeLessThanOrEqual(width);
    }
  });

  test('the mobile table of contents is a native disclosure with breakpoint state recovery', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto('api/index.html');

    const disclosure = page.locator('[data-toc-disclosure]');
    const summary = disclosure.locator('summary');
    await expect(disclosure).toBeVisible();
    await expect(disclosure).not.toHaveAttribute('open', '');
    expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(44);

    await summary.click();
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(disclosure.locator('a[href^="#"]').first()).toBeVisible();

    await page.setViewportSize({ width: 960, height: 900 });
    await expect(summary).toBeVisible();
    await expect(disclosure).toHaveAttribute('open', '');

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(summary).toBeHidden();

    await page.setViewportSize({ width: 360, height: 900 });
    await expect(disclosure).not.toHaveAttribute('open', '');
  });

  test('the mobile documentation menu replaces the logo and resets across breakpoints', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto('getting-started/index.html');

    const menu = page.locator('[data-mobile-nav]');
    const summary = menu.locator('summary');
    await expect(page.locator('.header-start > .brand')).toBeHidden();
    await expect(summary).toBeVisible();
    expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await summary.click();
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.locator('a', { hasText: 'Playground' })).toBeVisible();
    await expect(menu.locator('a', { hasText: 'API reference' })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(360);

    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(summary).toBeFocused();

    await summary.click();
    await page.setViewportSize({ width: 960, height: 900 });
    await expect(menu).toHaveAttribute('open', '');
    await expect(summary).toBeVisible();
    await expect(page.locator('.header-start > .brand')).toBeHidden();

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(summary).toBeHidden();
    await expect(page.locator('.header-shortcuts a')).toHaveText([
      'Get started',
      'Playground',
      'API reference',
    ]);
    await expect(page.locator('.header-start > .brand')).toHaveAttribute(
      'href',
      /getting-started\/$/
    );
    expect((await page.locator('.search-trigger-btn').boundingBox()).width).toBeLessThanOrEqual(
      180
    );
    await expect
      .poll(() =>
        page.evaluate(() => {
          const shortcuts = document.querySelector('.header-shortcuts');
          const gitlab = document.querySelector('[aria-label="Hawk on GitLab"]');
          return Boolean(
            shortcuts.compareDocumentPosition(gitlab) & Node.DOCUMENT_POSITION_FOLLOWING
          );
        })
      )
      .toBe(true);
  });

  test('theme gallery mounts one isolated profile at a time', async ({ page }) => {
    await page.goto('themes/index.html');
    const cards = page.locator('[data-gallery-theme]');
    const playgroundLinks = page.locator('.theme-gallery-playground');
    await expect(cards).toHaveCount(14);
    await expect(playgroundLinks).toHaveCount(14);
    await expect(page.locator('[data-gallery-theme="midnight-wave"]')).toContainText(
      'Midnight Wave'
    );
    await expect(playgroundLinks.nth(1)).toHaveAttribute(
      'href',
      /playground\/?\?preset=pastel-dusk$/
    );

    await cards.nth(1).click();
    await expect(page.locator('.hawk-modal:visible')).toHaveCount(1);
    await expect(cards.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');

    await cards.nth(2).click();
    await expect(page.locator('.hawk-modal:visible')).toHaveCount(1);
    await expect(cards.nth(2)).toHaveAttribute('aria-pressed', 'true');

    await page.keyboard.press('Escape');
    const simpleDark = page.locator('[data-gallery-theme="simple-dark"]');
    await simpleDark.click();
    const simpleModal = page.locator('.hawk-modal:visible');
    await expect(simpleModal).toHaveAttribute('data-hawk-position', 'top-center');
    await expect(simpleModal).toHaveAttribute('data-hawk-density', 'compact');
    await expect(simpleModal.locator('.hawk-modal-body')).toHaveAttribute('data-hawk-columns', '1');
    await expect(simpleModal.locator('.hawk-modal-dialog')).toHaveCSS(
      'background-color',
      'rgba(11, 13, 17, 0)'
    );
    await expect(simpleModal.locator('.hawk-modal-dialog')).toHaveCSS(
      'border-color',
      'rgba(255, 255, 255, 0)'
    );
    await expect(simpleModal.locator('.hawk-modal-dialog')).toHaveCSS('box-shadow', 'none');
    await expect(simpleModal.locator('.hawk-modal-backdrop')).toHaveCSS(
      'backdrop-filter',
      'blur(14px)'
    );
  });

  test('a gallery preset hydrates the editable playground controls', async ({ page }) => {
    await page.goto('playground/index.html?preset=paper-mint');

    await expect(page.locator('#pg-status')).toContainText('preset: Paper mint');
    await expect(page.locator('#pg-position')).toHaveValue('center');
    await expect(page.locator('#pg-density')).toHaveValue('fit');
    await expect(page.locator('#pg-scale')).toHaveValue('0.94');
    await expect(page.locator('#pg-reveal-animation')).toHaveValue('fade');
    await expect(page.locator('[data-hawk-token="--hawk-accent"]')).toHaveValue('#008f6c');
    await expect(page.locator('[data-hawk-token="--hawk-bg-canvas"]')).toHaveValue('#f5faf8');
  });

  test('playground TypeFlow controls use the Hawk wrapper defaults', async ({ page }) => {
    await page.goto('playground/index.html');

    for (const id of ['title', 'anchor', 'content']) {
      await expect(page.locator(`#pg-tf-${id}-style`)).toHaveValue('zoom-in-space');
      await expect(page.locator(`#pg-tf-${id}-direction`)).toHaveValue('left');
      await expect(page.locator(`#pg-tf-${id}-speed`)).toHaveValue('2');
      await expect(page.locator(`#pg-tf-${id}-cursor`)).toHaveValue('');
    }
    await expect(page.locator('#pg-tf-title-cursor-blink')).not.toBeChecked();
    await expect(page.locator('#pg-tf-anchor-cursor-blink')).not.toBeChecked();
    await expect(page.locator('#pg-tf-rotate-type-style')).toHaveValue('zoom-in-space');
    await expect(page.locator('#pg-tf-rotate-type-speed')).toHaveValue('2');
    await expect(page.locator('#pg-tf-rotate-type-cursor')).toHaveValue('');
    await expect(page.locator('#pg-tf-rotate-type-cursor-blink')).not.toBeChecked();
    await expect(page.locator('#pg-tf-rotate-erase-speed')).toHaveValue('2');
  });

  test('every playground color token has a live Pickr swatch without losing gradients', async ({
    page,
  }) => {
    await page.goto('playground/index.html');

    const inputs = page.locator('[data-hawk-token]');
    const swatches = page.locator('[data-pickr-trigger]');
    await expect(inputs).toHaveCount(22);
    await expect(swatches).toHaveCount(22);
    await expect(swatches.first()).toHaveCSS('background-color', 'rgb(54, 69, 79)');

    await swatches.first().click();
    await expect(page.locator('.pcr-app.visible')).toBeVisible();
    await page.keyboard.press('Escape');

    const firstInput = inputs.first();
    await firstInput.fill('linear-gradient(135deg, #111827, #20e3b2)');
    await expect(swatches.first()).toHaveCSS(
      'background-image',
      /linear-gradient\(135deg, rgb\(17, 24, 39\), rgb\(32, 227, 178\)\)/
    );
    await expect(firstInput).toHaveValue('linear-gradient(135deg, #111827, #20e3b2)');
  });

  test('typing a real query returns a real result with a working preview', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('pagefind');

    // "matching result", not just "a result exists" — eagerResults' own unfiltered listing (its
    // counter reads "N entries", not "N matching results") can otherwise satisfy a looser check
    // before this debounced query's own results replace it; see #executeSearch's
    // #searchGeneration comment in hawk.js.
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');
    const firstResult = page.locator('.hawk-result-item').first();
    await expect(firstResult).toBeVisible();

    // The preview pane renders real fetched page content, not just Pagefind's excerpt.
    await expect(page.locator('.hawk-preview-content')).not.toHaveText('');
  });

  test('frontmatter metadata reaches real Pagefind results beneath the description', async ({
    page,
  }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('frontmatter');
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');

    const result = page.locator('.hawk-result-item[href*="pagefind-setup"]').first();
    await expect(result).toBeVisible();
    await expect(result.locator('.hawk-result-date')).toHaveText(/^\d{4}-\d{2}-\d{2}$/);
    await expect(result.locator('.hawk-result-tag')).toContainText([
      'Pagefind',
      'metadata',
      'frontmatter',
    ]);
    await expect(result.locator('.hawk-result-desc + .hawk-result-meta')).toBeVisible();
  });

  test('the discovery row uses real Pagefind matches and stacks all groups at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('frontmatter');
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');

    const row = page.locator('.hawk-discovery-row');
    await expect(row).toBeVisible();
    await expect(row.locator('.hawk-discovery-group')).toHaveCount(3);
    await expect(row.locator('[data-hawk-discovery-group="matches"] a').first()).toBeVisible();
    await expect(row.locator('[data-hawk-discovery-group="pages"] a').first()).toBeVisible();
    await expect(row.locator('[data-hawk-discovery-group="headings"] a').first()).toHaveAttribute(
      'href',
      /#[^#]+$/
    );
    await expect(row).toHaveCSS('grid-template-columns', /\d+(\.\d+)?px/);
    expect(
      (await row.locator('.hawk-discovery-link').first().boundingBox()).height
    ).toBeGreaterThanOrEqual(44);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(360);
  });

  test('phone and tablet search layouts match maintained screenshots', async ({ page }) => {
    for (const [width, snapshot] of [
      [360, 'hawk-search-phone.png'],
      [768, 'hawk-search-tablet.png'],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('guides/pagefind-setup/index.html');
      await page.locator('[data-search-trigger]').first().click();
      await page.locator('.hawk-modal-input').fill('frontmatter');
      await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');
      await expect(page.locator('.hawk-discovery-row')).toHaveAttribute('aria-busy', 'false');
      await page.addStyleTag({
        content:
          '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }',
      });
      await expect(page.locator('.hawk-modal-dialog')).toHaveScreenshot(snapshot, {
        animations: 'disabled',
        // Chromium can rasterize the focused query glyphs a few pixels differently between
        // otherwise identical captures. Keep structural/color changes strict while tolerating
        // that sub-pixel text antialiasing noise.
        maxDiffPixelRatio: 0.01,
      });
      await page.keyboard.press('Escape');
    }
  });

  test('anchor results are visually identified as indented subpages', async ({ page }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('frontmatter');
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');
    await expect(page.locator('.hawk-result-item--subpage').first()).toBeVisible();
  });

  test('the configured home page exclusion removes it from the real Pagefind listing', async ({
    page,
  }) => {
    await page.locator('[data-search-trigger]').first().click();
    await expect(page.locator('.hawk-modal-counter')).toContainText('entries');

    const paths = await page
      .locator('.hawk-result-item')
      .evaluateAll((items) => items.map((item) => new URL(item.href).pathname));
    expect(paths).not.toContain('/public-e2e/');
    expect(paths).not.toContain('/public-e2e/index.html');
  });

  test('the results pane actually scrolls a long list instead of silently clipping it', async ({
    page,
  }) => {
    // Regression test for a real CSS Grid bug jsdom can't catch (no layout engine): without an
    // explicit grid-template-rows track and min-height:0 on the panes, .hawk-results-pane grew
    // to fit all content instead of being clamped by .hawk-modal-body, and the outer
    // overflow:hidden silently clipped everything past ~480px — results existed in the DOM and
    // in state.matches, but were visually unreachable past the first handful of rows.
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('pagefind'); // a broad term with enough matches to overflow
    // Not just "a result is visible" — eagerResults' own unfiltered listing (page load, no query)
    // can satisfy that the instant it renders, whether or not it happens to still be racing this
    // debounced query at that moment (both go through #executeSearch; see its own #searchGeneration
    // comment). The counter text is query-specific ("N matching results" vs eagerResults'
    // "N entries"), so waiting on it actually waits for *this* query's own results.
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');

    const { offsetHeight, scrollHeight } = await page
      .locator('.hawk-results-pane')
      .evaluate((el) => ({
        offsetHeight: el.offsetHeight,
        scrollHeight: el.scrollHeight,
      }));
    expect(scrollHeight).toBeGreaterThan(offsetHeight);

    const lastResult = page.locator('.hawk-result-item').last();
    await lastResult.scrollIntoViewIfNeeded();
    await expect(lastResult).toBeInViewport();
  });

  test('ArrowDown/ArrowUp move the selection and Enter navigates to the selected result', async ({
    page,
  }) => {
    await page.locator('[data-search-trigger]').first().click();
    await page.locator('.hawk-modal-input').fill('guide');
    await expect(page.locator('.hawk-modal-counter')).toContainText('matching result');

    await page.keyboard.press('ArrowDown');
    const selected = page.locator('.hawk-result-item.is-selected');
    await expect(selected).toHaveCount(1);
    const targetHref = await selected.getAttribute('href');

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(targetHref.replace(/\/$/, '') + '/?$'));
  });

  test('Tab focus is trapped inside the modal: Shift+Tab from the input wraps to the last stop', async ({
    page,
  }) => {
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
