export interface HawkTheme {
  name: string;
  apply(rootEl: HTMLElement): void;
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
}

export interface HawkMatch {
  title: string;
  url: string;
  excerpt: string;
  isAnchor: boolean;
}

export interface HawkState {
  open: boolean;
  query: string;
  selectedIndex: number;
  matches: HawkMatch[];
  activeTab: string;
}

export interface HawkTab {
  id?: string;
  label: string;
  filter?: Record<string, string | string[]>;
  pagefindOptions?: Record<string, unknown>;
}

export interface HawkSearchConfig {
  index?: string;
  pagefind?: Record<string, unknown>;
  id?: string;
  triggerSelector?: string;
  container?: HTMLElement;
  params?: HawkParams;
  theme?: string | HawkTheme;
  animation?: string | HawkAnimationDriver | false;
  categories?: string[];
  tabs?: HawkTab[];
  includeAllTab?: boolean;
  defaultTab?: string;
  pagefindOptions?: Record<string, unknown>;
  categoryFilterName?: string;
  maxResults?: number;
  contentSelector?: string;
  hotkeys?: { open?: boolean; slash?: boolean; escape?: boolean };
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
