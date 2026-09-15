/**
 * @fileoverview A minimal, dependency-free JS/JSON syntax highlighter for the playground's own
 * generated code panels (`[data-pg-highlight]`, and the "Generated output" config snippet).
 *
 * Deliberately not Hugo's Chroma (used for markdown code fences elsewhere on the site, see
 * `docs/static/assets/docs.css`'s `.chroma` rules) — these blocks are built and updated entirely
 * client-side from live playground state, so they need a highlighter that runs in the browser
 * against a plain string, not a build-time template pipeline. Token classes (`.pg-token--*`) are
 * styled in `docs/static/assets/playground.css`.
 * @module code-highlight
 */

/**
 * Escapes `&`, `<`, and `>` so arbitrary source text can be safely written into `innerHTML`.
 * Deliberately narrower than a full HTML-entity escape (no quotes) — this only ever feeds text
 * nodes inside a `<code>` block, never an attribute value.
 * @param {string} value
 * @returns {string}
 */
function escapeCode(value) {
  return value.replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

/**
 * Wraps recognized JS/JSON tokens in a source string with `<span class="pg-token--*">` so CSS can
 * color them — comments, strings, booleans/null/undefined, numbers, and a fixed set of keywords.
 * Everything else (including punctuation not explicitly matched) passes through escaped but
 * unstyled. Not a real tokenizer/parser — a single regex pass good enough for the short,
 * generated snippets this project ever feeds it (config objects, install commands), not for
 * arbitrary untrusted JS.
 * @param {string} source Plain-text JS or JSON source.
 * @returns {string} HTML-safe markup with token spans, ready for `element.innerHTML`.
 * @example
 * highlightCode("const x = 'hi'; // note");
 * // => '<span class="pg-token--keyword">const</span> x <span class="pg-token--punctuation">=</span> <span class="pg-token--string">\'hi\'</span><span class="pg-token--punctuation">;</span> <span class="pg-token--comment">// note</span>'
 */
export function highlightCode(source) {
  const tokenPattern =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:import|from|const|let|var|function|return|new|await|async|if|else|class|extends|this)\b|\b(?:true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b|[{}[\](),.;:])/g;
  let highlighted = '';
  let cursor = 0;

  for (const match of source.matchAll(tokenPattern)) {
    const token = match[0];
    let type = 'punctuation';
    if (token.startsWith('//') || token.startsWith('/*')) type = 'comment';
    else if (token.startsWith('"') || token.startsWith("'")) type = 'string';
    else if (/^(true|false|null|undefined)$/.test(token)) type = 'literal';
    else if (/^\d/.test(token)) type = 'number';
    else if (/^[A-Za-z]/.test(token)) type = 'keyword';

    highlighted += escapeCode(source.slice(cursor, match.index));
    highlighted += '<span class="pg-token--' + type + '">' + escapeCode(token) + '</span>';
    cursor = match.index + token.length;
  }

  return highlighted + escapeCode(source.slice(cursor));
}
