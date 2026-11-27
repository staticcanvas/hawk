/**
 * Themeable, pluggable command-palette search for static sites.
 *
 * @module @staticcanvas/hawk
 */

/** Visual theme interface understood by {@link HawkSearch}. */
export interface HawkTheme {
  /** Stable theme registration name. */
  name: string;
  /**
   * Applies theme attributes or styles to the Hawk root.
   * @param rootEl Hawk root element owned by the search instance.
   * @returns No value; stylesheets may be loaded separately by the consumer.
   */
  apply(rootEl: HTMLElement): void;
  /** Optional CSS custom-property overrides. */
  tokens?: Record<string, string>;
}

/** Animation-driver interface used for result and placeholder transitions. */
export interface HawkAnimationDriver {
  /**
   * Renders or animates a result title.
   * @param el Result-title element owned by Hawk.
   * @param text Plain page or anchor title.
   * @param options Identifies heading/anchor results for drivers with a separate title style.
   * @returns A driver-specific controller, or null for synchronous rendering.
   */
  typeTitle(el: HTMLElement, text: string, options?: { isAnchor?: boolean }): unknown;
  /**
   * Renders or animates result-preview HTML.
   * @param el Preview-content container owned by Hawk.
   * @param html Preview HTML prepared by the caller.
   * @param options Driver-specific rendering options.
   * @returns A driver-specific controller, or null for synchronous rendering.
   */
  typeContent(el: HTMLElement, html: string, options?: Record<string, unknown>): unknown;
  /**
   * Displays or rotates the search-input placeholder strings.
   * @param el Placeholder overlay element, not the input's native placeholder attribute.
   * @param strings Placeholder messages in display order; an empty list clears the overlay.
   * @param options Driver-specific rotation options.
   * @returns A driver-specific controller, or null for synchronous rendering.
   */
  rotatePlaceholder(el: HTMLElement, strings: string[], options?: Record<string, unknown>): unknown;
  /**
   * Stops a controller previously returned by this driver before rerendering or destruction.
   * @param controller Previous driver return value, including null.
   * @returns No value.
   */
  stop(controller: unknown): void;
}

/** Runtime layout and density settings. */
export interface HawkParams {
  scale?: number;
  position?: 'top-center' | 'center' | 'top-left' | 'top-right';
  offset?: { x?: number | string; y?: number | string };
  alignment?: 'stretch' | 'start' | 'center';
  columns?: 1 | 2;
  breakpoint?: number;
  density?: 'fit' | 'medium' | 'compact';
  /** Show available size buttons; can also be changed with setParams(). Defaults to true. */
  allowDensityToggle?: boolean;
  verticalFit?: boolean;
}

/** Normalized Pagefind result exposed by Hawk state and callbacks. */
export interface HawkMatch {
  title: string;
  url: string;
  excerpt: string;
  isAnchor: boolean;
  meta: Record<string, string>;
}

/** Size and label settings for one discovery-row group. */
export interface HawkDiscoveryGroupConfig {
  label?: string;
  maxItems?: number;
}

/** Controls the groups displayed in the zero-query discovery row. */
export interface HawkDiscoveryRowConfig {
  matches?: boolean | HawkDiscoveryGroupConfig;
  pages?: boolean | HawkDiscoveryGroupConfig;
  headings?: boolean | HawkDiscoveryGroupConfig;
}

/** Persisted pinned-result record. */
export interface HawkPin {
  url: string;
  title: string;
  isAnchor: boolean;
}

/** Persisted recently-viewed result record. */
export interface HawkRecentlyViewedItem {
  url: string;
  title: string;
  isAnchor: boolean;
  viewedAt: string;
}

/** Read-only snapshot of the current HawkSearch UI state. */
export interface HawkState {
  open: boolean;
  query: string;
  selectedIndex: number;
  matches: HawkMatch[];
  pageCount: number;
  pins: HawkPin[];
  recentlyViewed: HawkRecentlyViewedItem[];
  secondColumnEnabled: boolean;
  activeTab: string;
  error: Error | null;
}

/** Configuration for one searchable tab. */
export interface HawkTab {
  id?: string;
  label: string;
  filter?: Record<string, string | string[]>;
  sort?: Record<string, 'asc' | 'desc'>;
  accentColor?: string;
  pagefindOptions?: Record<string, unknown>;
  defaultPreviewUrl?: string;
  defaultPreviewTitle?: string;
}

/** Localizable strings and formatters used by Hawk's interface. */
export interface HawkStrings {
  dialogLabel?: string;
  inputPlaceholder?: string;
  densityGroupLabel?: string;
  densityFit?: string;
  densityMedium?: string;
  densityCompact?: string;
  escKey?: string;
  filtersLabel?: string;
  previewLabel?: string;
  hintNavigate?: string;
  hintSelect?: string;
  hintClose?: string;
  previewEmpty?: string;
  previewLoading?: string;
  discoveryLabel?: string;
  discoveryMatches?: string;
  discoveryPages?: string;
  discoveryHeadings?: string;
  discoveryEmpty?: string;
  discoveryLoading?: string;
  sectionBadge?: string;
  untitled?: string;
  typeToSearch?: string;
  noResults?: (query: string) => string;
  matchingResults?: (count: number) => string;
  entries?: (count: number) => string;
  unavailable?: string;
  unavailableCounter?: string;
  recentlyViewedTab?: string;
}

/** Configuration for a trigger button created by Hawk. */
export interface HawkTriggerConfig {
  kind?: 'minimal' | 'compact' | 'default';
  container: string | HTMLElement;
  icon?: string;
}

/** Complete configuration accepted by {@link HawkSearch}. */
export interface HawkSearchConfig {
  /** Warm search during idle time after page load. Defaults to false; honors Save-Data. */
  preload?: boolean;
  index?: string;
  pagefind?: Record<string, unknown>;
  id?: string;
  triggerSelector?: string;
  trigger?: HawkTriggerConfig;
  container?: HTMLElement;
  params?: HawkParams;
  theme?: string | HawkTheme;
  animation?: string | HawkAnimationDriver | false;
  categories?: string[];
  tabs?: HawkTab[];
  tabsUrl?: string;
  includeAllTab?: boolean;
  defaultTab?: string;
  pagefindOptions?: Record<string, unknown>;
  pagefindInitOptions?: Record<string, unknown>;
  pagefindMergeIndexes?: Array<{ bundlePath: string; options?: Record<string, unknown> }>;
  categoryFilterName?: string;
  maxResults?: number;
  resultHydrationConcurrency?: number;
  maxCandidateResults?: number;
  showResultDate?: boolean;
  resultDateMetaKey?: string;
  resultDateFormat?: 'timestamp' | 'relative';
  showResultTags?: boolean;
  resultTagsMetaKey?: string;
  resultAccentColors?: string[] | false;
  tagAccentColors?: string[] | false;
  showSubpageConnector?: boolean;
  /** Hide the header controls or individual size buttons. Omitted controls remain enabled. */
  headerControls?:
    | false
    | {
        density?: boolean | { fit?: boolean; medium?: boolean; compact?: boolean };
        escape?: boolean;
      };
  excludePages?: string | string[];
  contentSelector?: string;
  disableDefaultMarkdownStyles?: boolean;
  hotkeys?: { open?: boolean; slash?: boolean; escape?: boolean };
  strings?: HawkStrings;
  defaultPreviewUrl?: string;
  defaultPreviewTitle?: string;
  eagerResults?: boolean;
  rotatingPlaceholders?: string[];
  showPoweredBy?: boolean;
  poweredByHref?: string;
  enablePins?: boolean;
  pinStorageKey?: string;
  maxPins?: number;
  enableRecentlyViewed?: boolean;
  recentlyViewedStorageKey?: string;
  maxRecentlyViewed?: number;
  enableSecondColumn?: boolean;
  inlineFilters?: boolean;
  previewSections?: boolean;
  previewSectionSelector?: string;
  previewSectionExcerptLength?: number;
  discoveryRow?: false | HawkDiscoveryRowConfig;
  revealAnimation?: 'fade' | 'scale-fade' | 'slide-down' | 'blur-zoom' | 'spring' | string | false;
  revealDuration?: number;
  backdrop?: {
    color?: string;
    gradient?: string;
    opacity?: number | string;
    blur?: string;
  };
  resultsReveal?: boolean;
  resultsRevealDirection?: 'up' | 'down' | 'left' | 'right';
  resultsRevealStagger?: number;
  onOpen?: (query: string) => void;
  onClose?: () => void;
  onSelect?: (item: HawkMatch) => void;
}

/** Pagefind-backed command-palette search controller. */
export declare class HawkSearch {
  /** Registered visual themes, keyed by name. */
  static themes: Map<string, HawkTheme>;
  /** Registered animation drivers, keyed by name. */
  static animations: Map<string, HawkAnimationDriver>;
  /** Registers or replaces a named visual theme. */
  static registerTheme(name: string, theme: HawkTheme): void;
  /** Registers or replaces a named animation driver. */
  static registerAnimation(name: string, driver: HawkAnimationDriver): void;

  /** Creates and mounts a Hawk search instance. */
  constructor(config: HawkSearchConfig);
  /** Unique identifier for this instance. */
  readonly id: string;
  /** Current public UI and result state. */
  readonly state: HawkState;
  /** Updates layout parameters without rebuilding the instance. */
  setParams(params: Partial<HawkParams>): void;
  /** Warm search without opening it; concurrent callers share work. False means unavailable. */
  preload(): Promise<boolean>;
  /** Opens the search interface. */
  open(): void;
  /** Closes the search interface. */
  close(): void;
  /** Removes listeners, generated UI, and other instance resources. */
  destroy(): void;
}

/** Default Hawk search controller export. */
export default HawkSearch;
