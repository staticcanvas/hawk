/**
 * Dependency-free SVG icon adapters for Hawk integrations.
 *
 * @module @staticcanvas/hawk/icons
 */

/** Named SVG markup supported by a Hawk icon adapter. */
export interface HawkIconSet {
  /** Search icon markup. */
  search: string;
  /** Command-key icon markup. */
  command: string;
  /** Pin icon markup. */
  pin: string;
  /** Recently-viewed clock icon markup. */
  clock: string;
  /** Generic document icon markup. */
  file: string;
  /** Additional consumer-defined icons. */
  [key: string]: string;
}

/** Built-in Lucide SVG markup keyed by Hawk icon name. */
export declare const LUCIDE_ICONS: Readonly<HawkIconSet>;
/** Built-in Tabler SVG markup keyed by Hawk icon name. */
export declare const TABLER_ICONS: Readonly<HawkIconSet>;
/** Built-in Heroicons SVG markup keyed by Hawk icon name. */
export declare const HEROICONS: Readonly<HawkIconSet>;

/**
 * Resolves an icon from a built-in library, custom map, or resolver function.
 *
 * @param library Built-in library name, icon map, or custom resolver.
 * @param name Icon identifier to resolve.
 * @param fallback Markup returned when the icon cannot be resolved.
 * @returns The resolved SVG/string markup or `fallback`.
 */
export declare function resolveHawkIcon(
  library: 'lucide' | 'tabler' | 'heroicons' | Record<string, string> | ((name: string) => string),
  name: string,
  fallback?: string
): string;
