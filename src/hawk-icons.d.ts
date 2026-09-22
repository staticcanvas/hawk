export interface HawkIconSet {
  search: string;
  command: string;
  pin: string;
  clock: string;
  file: string;
  [key: string]: string;
}

export declare const LUCIDE_ICONS: Readonly<HawkIconSet>;
export declare const TABLER_ICONS: Readonly<HawkIconSet>;
export declare const HEROICONS: Readonly<HawkIconSet>;

export declare function resolveHawkIcon(
  library: 'lucide' | 'tabler' | 'heroicons' | Record<string, string> | ((name: string) => string),
  name: string,
  fallback?: string
): string;
