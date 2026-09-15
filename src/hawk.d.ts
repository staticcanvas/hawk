export interface HawkTheme {
  name: string;
  apply(rootEl: HTMLElement): void;
  tokens?: Record<string, string>;
}

export interface HawkAnimationDriver {
  typeTitle(el: HTMLElement, text: string, options?: { isAnchor?: boolean }): unknown;
  typeContent(el: HTMLElement, html: string, options?: Record<string, unknown>): unknown;
  rotatePlaceholder(el: HTMLElement, strings: string[], options?: Record<string, unknown>): unknown;
  stop(controller: unknown): void;
}

export interface HawkParams {
  scale?: number;
  position?: 'top-center' | 'center' | 'top-left' | 'top-right';
  offset?: { x?: number | string; y?: number | string };
  alignment?: 'stretch' | 'start' | 'center';
  columns?: 1 | 2;
  breakpoint?: number;
  density?: 'fit' | 'medium' | 'compact';
  allowDensityToggle?: boolean;
  verticalFit?: boolean;
}

export interface HawkMatch {
  title: string;
  url: string;
  excerpt: string;
  isAnchor: boolean;
  meta: Record<string, string>;
}

export interface HawkDiscoveryGroupConfig {
  label?: string;
  maxItems?: number;
}

export interface HawkDiscoveryRowConfig {
  matches?: boolean | HawkDiscoveryGroupConfig;
  pages?: boolean | HawkDiscoveryGroupConfig;
  headings?: boolean | HawkDiscoveryGroupConfig;
}

export interface HawkPin {
  url: string;
  title: string;
  isAnchor: boolean;
}

export interface HawkRecentlyViewedItem {
  url: string;
  title: string;
  isAnchor: boolean;
  viewedAt: string;
}

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

export interface HawkTriggerConfig {
  kind?: 'minimal' | 'compact' | 'default';
  container: string | HTMLElement;
  icon?: string;
}

export interface HawkSearchConfig {
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
  showResultDate?: boolean;
  resultDateMetaKey?: string;
  resultDateFormat?: 'timestamp' | 'relative';
  showResultTags?: boolean;
  resultTagsMetaKey?: string;
  resultAccentColors?: string[] | false;
  tagAccentColors?: string[] | false;
  showSubpageConnector?: boolean;
  headerControls?: false | { density?: boolean; escape?: boolean };
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

export declare class HawkSearch {
  static themes: Map<string, HawkTheme>;
  static animations: Map<string, HawkAnimationDriver>;
  static registerTheme(name: string, theme: HawkTheme): void;
  static registerAnimation(name: string, driver: HawkAnimationDriver): void;

  constructor(config: HawkSearchConfig);
  readonly id: string;
  readonly state: HawkState;
  setParams(params: Partial<HawkParams>): void;
  open(): void;
  close(): void;
  destroy(): void;
}

export default HawkSearch;
