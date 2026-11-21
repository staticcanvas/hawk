/** Updates legacy StaticCanvas URLs in staged dependency comments. */
export function normalizeProjectLinks(source) {
  return source
    .replace(/^.*> gitlab:.*\r?\n/gm, '')
    .replace(
      /https:\/\/(?:gitlab\.com\/staticcanvas\/|staticcanvas\.gitlab\.io\/)/g,
      'https://github.com/staticcanvas/'
    );
}
