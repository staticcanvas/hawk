/* @ts-self-types="./hawk-icons.d.ts" */

/**
 * Icon adapter for Hawk.
 *
 * Provides ready-to-use SVG templates and resolvers for Lucide, Tabler, and Heroicons
 * so triggers, search results, and custom UI elements can reference standard icons without external dependencies.
 * @module @staticcanvas/hawk/icons
 */

/** Built-in Lucide SVG markup keyed by Hawk icon name. */
export const LUCIDE_ICONS = Object.freeze({
  search: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  command: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3z"/></svg>',
  pin: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>',
  clock: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  file: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
});

/** Built-in Tabler SVG markup keyed by Hawk icon name. */
export const TABLER_ICONS = Object.freeze({
  search: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m21 21-6-6"/></svg>',
  command: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0h10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v8a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm10 0v8a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 0H7"/></svg>',
  pin: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 4.5 4 4L14 14l-1.5-1.5-3 3 1.5 1.5-2 2-4-4 2-2 1.5 1.5 3-3L8 10l5.5-5.5Z"/><line x1="9" y1="15" x2="4.5" y2="19.5"/></svg>',
  clock: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></svg>',
  file: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>',
});

/** Built-in Heroicons SVG markup keyed by Hawk icon name. */
export const HEROICONS = Object.freeze({
  search: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>',
  command: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.75 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0h10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v9a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm10.5 0v9a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm0 0H6.75"/></svg>',
  pin: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/></svg>',
  clock: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>',
  file: '<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>',
});

/**
 * Resolves an icon name from Lucide, Tabler, Heroicons, or a custom adapter map / function.
 *
 * @param {'lucide'|'tabler'|'heroicons'|Record<string, string>|((name: string) => string)} library
 * @param {string} name Icon identifier (e.g. 'search', 'command', 'pin', 'clock', 'file')
 * @param {string} [fallback=''] Fallback SVG or string if name is not found
 * @returns {string} SVG markup string
 */
export function resolveHawkIcon(library, name, fallback = '') {
  if (typeof library === 'function') {
    return library(name) || fallback;
  }
  const set = library === 'lucide' ? LUCIDE_ICONS
    : library === 'tabler' ? TABLER_ICONS
    : library === 'heroicons' ? HEROICONS
    : (library && typeof library === 'object' ? library : null);

  return set?.[name] || fallback;
}
