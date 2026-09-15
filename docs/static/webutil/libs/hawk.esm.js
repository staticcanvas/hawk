/*! hawk v0.11.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,r,h,o,c,u,d,p,g,w,f,y,m,v,k,b,S,$,A,x,M,P,C,T,L,E,R,D,H,W,O,N,q,I,K,U,F,j,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,at,nt,lt,rt,ht,ot,ct,ut,dt,pt,gt,wt,ft,yt,mt,vt,kt,bt,St,$t,At,xt,Mt,Pt,Ct,Tt,Lt,Et,Rt,Dt,Ht,Wt,Ot,Nt,qt,It,Kt,Ut,Ft,jt,Bt,Vt,_t,zt,Jt,Qt,Gt=Object.defineProperty,Xt=Object.defineProperties,Yt=Object.getOwnPropertyDescriptors,Zt=Object.getOwnPropertySymbols,te=Object.prototype.hasOwnProperty,ee=Object.prototype.propertyIsEnumerable,ie=t=>{throw TypeError(t)},se=(t,e,i)=>e in t?Gt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ae=(t,e)=>{for(var i in e||(e={}))te.call(e,i)&&se(t,i,e[i]);if(Zt)for(var i of Zt(e))ee.call(e,i)&&se(t,i,e[i]);return t},ne=(t,e)=>Xt(t,Yt(e)),le=(t,e,i)=>se(t,"symbol"!=typeof e?e+"":e,i),re=(t,e,i)=>e.has(t)||ie("Cannot "+i),he=(t,e,i)=>(re(t,e,"read from private field"),i?i.call(t):e.get(t)),oe=(t,e,i)=>e.has(t)?ie("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ce=(t,e,i,s)=>(re(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ue=(t,e,i)=>(re(t,e,"access private method"),i),de=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{r(i.next(t))}catch(t){a(t)}},l=t=>{try{r(i.throw(t))}catch(t){a(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);r((i=i.apply(t,e)).next())});const pe={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=pe);const ge=new Map,we=new Map;we.set("instant",pe);const fe=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],ye={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},me=new Set(["fit","medium","compact"]),ve="hawk:density",ke="pinned",be="recently-viewed",Se={open:!0,slash:!0,escape:!0},$e={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},Ae={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let xe=0;const Me=class{
/**
   * @param {object} [config]
   * @param {string} [config.index] Base path (URL, trailing slash) to a Pagefind bundle — the
   *   directory `pagefind --site <dir>` wrote `pagefind.js` into. Required unless `config.pagefind` is given.
   * @param {object} [config.pagefind] A pre-loaded Pagefind module (or compatible mock) to use
   *   instead of dynamically importing one from `config.index` — e.g. when the consumer already
   *   bundles Pagefind, or in tests.
   * @param {string} [config.triggerSelector='[data-search-trigger]'] Elements that open the modal on click.
   * @param {HTMLElement} [config.container=document.body] Where the modal is mounted.
   * @param {Partial<typeof DEFAULT_PARAMS>} [config.params] Layout params: scale/position/offset/alignment/
   *   columns/breakpoint, plus `density` ('fit'|'medium'|'compact', default 'medium' — 'compact' forces
   *   1 column like below `breakpoint`) and `allowDensityToggle` (default true — shows an in-modal
   *   fit/medium/compact switcher; the visitor's last choice persists to `localStorage`). If `density`
   *   isn't given here, a previously-persisted choice is used before falling back to 'medium'.
   * @param {string|import('./hawk-theme-typeflow.js').HawkTheme} [config.theme='typeflow'] Registered theme name or a theme object.
   * @param {string|import('./hawk-animation-instant.js').HawkAnimationDriver|false} [config.animation] Registered
   *   animation name, a driver object, or `false` to force the instant driver. Defaults to `'typeflow'` if that
   *   name is registered (i.e. the consumer loaded hawk-animation-typeflow.js and registered it), else `'instant'`.
   * @param {string[]} [config.categories] Shorthand for `config.tabs`: one tab per category name, each
   *   filtering on `categoryFilterName`. Ignored if `config.tabs` is given.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, sort?: Record<string, 'asc'|'desc'>, pagefindOptions?: Record<string, unknown>, defaultPreviewUrl?: string, defaultPreviewTitle?: string, accentColor?: string}>} [config.tabs]
   *   Explicit tab list. `filter` is a raw Pagefind `filters` object (passed to `search()`/`debouncedSearch()`
   *   verbatim) — omit it for a filterless tab (e.g. "All"). `sort` is shorthand for
   *   `pagefindOptions: { sort }` — Pagefind's own sort object (e.g. `{ date: 'desc' }`), which needs the
   *   sorted field marked on every page via `data-pagefind-sort="date"` (see Pagefind's own docs); a tab
   *   using `sort` is a listing, not ranked search, so it's most useful paired with an otherwise-filterless
   *   or category-filtered tab a visitor browses rather than searches. `defaultPreviewUrl`/`defaultPreviewTitle`
   *   override `config.defaultPreviewUrl`/`config.defaultPreviewTitle` while this tab is active and nothing is
   *   selected (zero matches, or before a query is typed) — see the top-level options below for the
   *   fetch/extract behavior those share. `accentColor` (any valid CSS color) tints this tab's own pill —
   *   a small dot at all times, plus its border/text/background once active — falling back to the theme's
   *   own accent color for any tab that doesn't set one. Replaces auto-derivation from Pagefind's
   *   `filters()` entirely and renders synchronously on mount instead of waiting for Pagefind to load.
   *   Ignored if `config.tabsUrl` is also given (this wins, being available with zero latency).
   * @param {string} [config.tabsUrl] Fetches a JSON file (an array in the same shape as `config.tabs` above)
   *   once Pagefind loads, instead of requiring the tab list to live in the mount script itself — lets a
   *   non-JS site maintainer, or a separate build step, edit tabs without touching JS. Ignored if
   *   `config.tabs`/`config.categories` is given. Falls back to auto-deriving from Pagefind's `filters()`
   *   (with a console warning) if the fetch fails, the response isn't valid JSON, or isn't a JSON array.
   * @param {boolean} [config.includeAllTab=true] Prepend a filterless "All" tab to `tabs`/`categories`/the
   *   auto-derived list.
   * @param {string} [config.defaultTab='all'] Tab id active on open. Falls back to `'all'` (with a console
   *   warning) if it doesn't match any resolved tab.
   * @param {Record<string, unknown>} [config.pagefindOptions] Raw options merged into every
   *   `search()`/`debouncedSearch()` call (primarily `filters` and `sort`) — an escape hatch for Pagefind
   *   tuning hawk doesn't otherwise wrap. A tab's own `pagefindOptions` merges over this per-tab.
   * @param {Record<string, unknown>} [config.pagefindInitOptions] Options passed to Pagefind's
   *   `options()` before initialization (e.g. `excerptLength`, `exactDiacritics`, `ranking`,
   *   `highlightParam`, `metaCacheTag`, `indexWeight`, or `noWorker`).
   * @param {Array<{bundlePath: string, options?: Record<string, unknown>}>} [config.pagefindMergeIndexes]
   *   Additional Pagefind bundles merged before tabs are derived. Cross-origin bundles must
   *   provide appropriate CORS headers.
   * @param {string} [config.categoryFilterName='category'] The Pagefind filter dimension used for the
   *   auto-derived tabs and the `categories` shorthand (see `data-pagefind-filter`).
   * @param {number} [config.maxResults=18] Maximum rendered result rows.
   * @param {boolean} [config.showResultDate=true] Renders the Pagefind metadata value named by
   *   resultDateMetaKey below the result excerpt.
   * @param {string} [config.resultDateMetaKey='date'] Pagefind metadata key used for result dates.
   * @param {'timestamp'|'relative'} [config.resultDateFormat='timestamp'] `'timestamp'` renders
   *   resultDateMetaKey's raw value as-is; `'relative'` renders it as relative time ("7 days ago",
   *   "last month") via the host's `Intl.RelativeTimeFormat` — the `<time datetime>` attribute
   *   always keeps the raw value either way.
   * @param {boolean} [config.showResultTags=true] Renders comma-separated Pagefind metadata from
   *   resultTagsMetaKey as tags below the result excerpt. meta.section joins this row when present.
   *   Only page-level matches render tags — an anchor/heading sub-result (`item.isAnchor`) reuses
   *   its parent page's meta wholesale, so repeating the same tags on every heading match under
   *   that page would just duplicate the page row already showing them.
   * @param {string} [config.resultTagsMetaKey='tags'] Pagefind metadata key used for result tags.
   * @param {string[]|false} [config.resultAccentColors=false] Optional pastel CSS colors rotated across
   *   result rows and metadata badges; `false` disables the accent treatment.
   * @param {string[]|false} [config.tagAccentColors] Pastel CSS colors rotated across the tags
   *   *within* a single result — index resets per row, so each result's own first tag always gets
   *   the first color, not a running count across the whole result list. Independent of
   *   `resultAccentColors` (which colors a whole row uniformly); set `false` to disable and fall
   *   back to `resultAccentColors`/`--hawk-accent`. Defaults to a small built-in pastel range.
   * @param {boolean} [config.showSubpageConnector=true] Indents an anchor/heading-level match
   *   (`item.isAnchor`) and draws a vertical connector line against its parent page's row above it
   *   (`.hawk-result-item--subpage`), signaling "this is part of that page" at a glance. Set `false`
   *   for a flat list where every row — page or heading match alike — looks the same.
   * @param {boolean|{density?: boolean, escape?: boolean}} [config.headerControls]
   *   Controls the Fit/Medium/Compact group and Escape button at the right of the search input.
   *   Pass false for a minimal input-only header, or disable either control independently.
   * @param {string|string[]} [config.excludePages=[]] Page URLs or paths to omit from results.
   *   Matching ignores query strings, hashes, and a trailing slash, so excluding a page also
   *   excludes all of its section/anchor results (e.g. `excludePages: ['/']` omits the home page).
   * @param {string} [config.contentSelector='[data-pagefind-body]'] Selector used to extract the
   *   preview pane's content from a fetched result page (fetched from `item.url`, same-origin).
   *   Falls back to Pagefind's short excerpt if `fetch`/`DOMParser` are unavailable or the request fails.
   * @param {boolean} [config.disableDefaultMarkdownStyles=false] Opts out of hawk.css's own preview-content
   *   prose rules (headings/lists/tables/code/etc.) entirely, so a consumer can target `.hawk-preview-content`
   *   with their own CSS (e.g. an existing site-wide `.prose` class) instead of overriding hawk's.
   * @param {string} [config.defaultPreviewUrl] Shows this page's content in the preview pane as soon as the
   *   modal mounts, before any result is selected — fetched/extracted via the same path a real selection
   *   uses. Also shown whenever the active tab has zero matches and doesn't define its own
   *   `defaultPreviewUrl` (see `config.tabs`). Replaced the instant real results exist (from a selection,
   *   or from `eagerResults`).
   * @param {string} [config.defaultPreviewTitle=''] Title shown above `defaultPreviewUrl`'s content.
   * @param {'fade'|'scale-fade'|'slide-down'|'blur-zoom'|'spring'|string|false} [config.revealAnimation='scale-fade']
   *   Modal open/close reveal, applied to `.hawk-modal-backdrop`/`.hawk-modal-dialog` via hawk.css keyframes
   *   selected on `[data-hawk-reveal]`. `false` disables it (today's instant show/hide). Any other string is
   *   accepted too — hawk.js only sets the attribute and the CSS variable below, so a consumer can define
   *   `[data-hawk-reveal="my-name"]` keyframes of their own. Always skipped (instant, matching `false`)
   *   when the visitor has `prefers-reduced-motion: reduce` set.
   * @param {number} [config.revealDuration] Milliseconds hawk.js waits before actually hiding the modal
   *   after `close()` (and the value written to `--hawk-reveal-duration`, which hawk.css's keyframes read
   *   for `animation-duration`) — defaults to the built-in duration for the 5 named animations above, or
   *   220ms for an unrecognized/custom `revealAnimation` name.
   * @param {boolean} [config.resultsReveal=true] Staggers each result row's entrance with a fade + slide +
   *   spring-ish bounce (CSS keyframes, `prefers-reduced-motion`-aware) every time the results pane
   *   re-renders — including on every keystroke, not just on open. `false` disables it entirely.
   * @param {'up'|'down'|'left'|'right'} [config.resultsRevealDirection='up'] Which direction rows slide in
   *   from.
   * @param {number} [config.resultsRevealStagger=22] Milliseconds between each row's animation start —
   *   capped at the 10th row internally, so a long result list's total entrance duration doesn't keep
   *   growing past that.
   * @param {{color?: string, gradient?: string, opacity?: number|string, blur?: string}} [config.backdrop]
   *   Customizes the modal scrim color/gradient, opacity, and blur. `gradient` replaces `color` when set.
   * @param {boolean} [config.eagerResults=true] Runs an empty-query search as soon as Pagefind loads, so the
   *   results pane shows a default listing instead of "Type to search". Set `false` to keep the results pane
   *   empty until the visitor types.
   * @param {string[]} [config.rotatingPlaceholders] Example queries cycled through the input's placeholder
   *   via the animation driver's `rotatePlaceholder` (an overlay, since a native `<input>` placeholder can't
   *   be typed character-by-character) — only while the modal is open and the input is empty. Falls back to
   *   `strings.inputPlaceholder` (unchanged, static) if omitted.
   * @param {boolean} [config.showPoweredBy=true] Shows a small "Search powered by Pagefind" link in the
   *   modal footer. Text-only (no logo asset vendored).
   * @param {string} [config.poweredByHref='https://pagefind.app/'] Link target for the powered-by attribution.
   * @param {boolean} [config.enablePins=true] Lets a visitor pin a result from within the results list — a
   *   pin toggle renders on every row, and a synthetic "Pinned" tab is prepended once at least one exists.
   * @param {string} [config.pinStorageKey='hawk:pins'] `localStorage` key pins persist to (an array of
   *   `{url, title, isAnchor}`).
   * @param {number} [config.maxPins=20] Caps the number of pins; pinning past the cap is a silent no-op.
   * @param {boolean} [config.enableRecentlyViewed=true] Persists selected results and exposes them through
   *   a synthetic "Recently viewed" tab. The tab appears after the first selection.
   * @param {string} [config.recentlyViewedStorageKey='hawk:recently-viewed'] `localStorage` key used for
   *   recently viewed entries.
   * @param {number} [config.maxRecentlyViewed=10] Maximum recently viewed entries retained, newest first.
   * @param {boolean} [config.enableSecondColumn=true] Enables the preview pane. Set `false` to render the
   *   results pane as a single column at every viewport and density.
   * @param {boolean} [config.inlineFilters=false] Lets a visitor type `dimension:value` tokens (e.g.
   *   `category:Guides`, `tag:"multi word"`) directly into the search box — parsed out as a Pagefind
   *   filters object (merged over the active tab's own `filter`, inline wins on a dimension collision)
   *   and stripped from the text actually searched. Off by default: turning it on changes how a literal
   *   colon in a normal query behaves (e.g. `"ratio: 16:9"` would get `ratio:` parsed as a filter attempt).
   * @param {boolean} [config.previewSections=false] For a page-level match (not an anchor/sub_result — those
   *   already show their one matched section in full), breaks the preview into clickable rows — one per
   *   heading matching `previewSectionSelector`, each with the heading text and a short plain-text excerpt
   *   of the content up to the next heading — instead of dumping the whole page. Falls back to the full
   *   content view if the page has no matching headings. Reuses the same fetched/cached page content the
   *   full view uses — no extra network request.
   * @param {string} [config.previewSectionSelector='h2, h3'] Which headings count as a "section" for
   *   `previewSections`.
   * @param {number} [config.previewSectionExcerptLength=140] Max characters of a `previewSections` row's
   *   excerpt before truncating with an ellipsis.
   * @param {false|{matches?: boolean|{label?: string, maxItems?: number}, pages?: boolean|{label?: string, maxItems?: number}, headings?: boolean|{label?: string, maxItems?: number}}} [config.discoveryRow=false]
   *   Adds a third row spanning the result and preview columns. Its query-match, related-page,
   *   and heading groups are derived in Pagefind result order from indexed excerpts, metadata,
   *   URLs, and sub-results. Each group is enabled by default and can be disabled or configured
   *   independently; `maxItems` defaults to 4 per group.
   * @param {object} [config.trigger] Renders hawk's own trigger button instead of requiring the consumer to
   *   build one — omit entirely to keep today's behavior (`triggerSelector` pointing at hand-built markup).
   * @param {'minimal'|'compact'|'default'} [config.trigger.kind='default'] `'minimal'`: icon only. `'compact'`:
   *   icon + "Search". `'default'`: icon + "Search..." + a Ctrl/Cmd+K hint (omitted if `hotkeys.open` is off).
   * @param {string|HTMLElement} config.trigger.container Required — selector or element the trigger button is
   *   appended into. Always marked `[data-search-trigger]` regardless of a customized `triggerSelector`.
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(t={}){var F,j,B,V,z,J,Q,G;if(oe(this,N),oe(this,e),oe(this,i),oe(this,s),oe(this,a),oe(this,n),oe(this,l),oe(this,r),oe(this,h),oe(this,o),oe(this,c),oe(this,u),oe(this,d),oe(this,p),oe(this,g),oe(this,w),oe(this,f),oe(this,y),oe(this,m),oe(this,v),oe(this,k),oe(this,b),oe(this,S),oe(this,$),oe(this,A),oe(this,x),oe(this,M),oe(this,P),oe(this,C),oe(this,T),oe(this,L),oe(this,E),oe(this,R),oe(this,D),oe(this,H),oe(this,W),oe(this,O),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${xe+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,ce(this,S,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const X=ue(this,N,Y).call(this);this.params=ne(ae(ae(ae({},ye),X?{density:X}:{}),t.params),{offset:ae(ae({},ye.offset),null==(F=t.params)?void 0:F.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=null!=(j=t.maxResults)?j:18,this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):fe,this.showSubpageConnector=!1!==t.showSubpageConnector;const Z=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==Z&&!1!==Z.density&&this.params.allowDensityToggle,escape:!1!==Z&&!1!==Z.escape};const it=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(it.map(t=>ue(this,N,At).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(B=t.maxPins)?B:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(V=t.maxRecentlyViewed)?V:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(z=t.previewSectionExcerptLength)?z:140,this.discoveryRow=ue(this,N,K).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=ae(ae({},Se),t.hotkeys),this.strings=ae(ae({},Ae),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Q=null!=(J=t.revealDuration)?J:$e[this.revealAnimation])?Q:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(G=t.resultsRevealStagger)?G:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,ce(this,e,ue(this,N,q).call(this,t.theme)),ce(this,i,ue(this,N,I).call(this,t.animation)),ce(this,s,""),ce(this,a,0),ce(this,n,-1),ce(this,l,[]),ce(this,r,0),ce(this,h,this.enablePins?ue(this,N,tt).call(this):[]),ce(this,o,this.enableRecentlyViewed?ue(this,N,et).call(this):[]),ce(this,d,t.defaultTab||"all"),ce(this,u,ue(this,N,U).call(this,t)),ce(this,p,null!==he(this,u)),ce(this,g,!1),ce(this,w,null),ce(this,f,null),ce(this,y,null),ce(this,m,null),ce(this,v,null),ce(this,k,null),ce(this,b,new Map),ce(this,D,new Map),this.container&&ue(this,N,_).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){ge.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){we.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:he(this,g),query:he(this,s),selectedIndex:he(this,n),matches:he(this,l),pageCount:he(this,r),pins:he(this,h),recentlyViewed:he(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:he(this,d),error:he(this,y)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=ne(ae(ae({},this.params),t),{offset:ae(ae({},this.params.offset),null==t?void 0:t.offset)}),ue(this,N,G).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(he(this,O)),delete he(this,$).dataset.hawkAnimState,he(this,$).hidden=!1,document.body.style.overflow="hidden",ce(this,g,!0),ue(this,N,ut).call(this),ue(this,N,Qt).call(this),ue(this,N,zt).call(this)&&(he(this,$).dataset.hawkAnimState="opening",ce(this,O,setTimeout(()=>{delete he(this,$).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{he(this,A).focus(),he(this,A).select()},40),null==(t=this.onOpen)||t.call(this,he(this,s))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",ce(this,g,!1),ue(this,N,Qt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(he(this,O)),ue(this,N,zt).call(this)?(he(this,$).dataset.hawkAnimState="closing",ce(this,O,setTimeout(()=>{he(this,$).hidden=!0,delete he(this,$).dataset.hawkAnimState},this.revealDuration))):he(this,$).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,a;ue(this,N,Ht).call(this),he(this,P)&&he(this,i).stop(he(this,P)),null==(e=null==(t=he(this,H))?void 0:t.removeEventListener)||e.call(t,"change",he(this,W)),he(this,D).forEach(t=>clearTimeout(t)),clearTimeout(he(this,O)),null==(s=he(this,$))||s.remove(),null==(a=he(this,c))||a.remove()}};t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,w=new WeakMap,f=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,A=new WeakMap,x=new WeakMap,M=new WeakMap,P=new WeakMap,C=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,O=new WeakMap,N=new WeakSet,q=function(t){if(!t)return ge.get("typeflow")||null;if("string"==typeof t){const e=ge.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},I=function(t){if(!1===t)return we.get("instant");if(!t)return we.get("typeflow")||we.get("instant");if("string"==typeof t){const e=we.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
K=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
U=function(t){return t.tabs?ue(this,N,F).call(this,t.tabs):t.categories?ue(this,N,F).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
F=function(t){const e=t.map(t=>({id:t.id||ue(this,N,j).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?ne(ae({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},j=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
B=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
V=function(t){var e,i;ce(this,u,t),t.some(t=>t.id===he(this,d))||("all"!==he(this,d)&&he(this,d)!==ke&&he(this,d)!==be&&console.warn(`HawkSearch: no tab with id "${he(this,d)}" (defaultTab); falling back to "all".`),ce(this,d,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ue(this,N,vt).call(this)},_=function(){ue(this,N,z).call(this);const t=document.createElement("div");t.innerHTML=ue(this,N,Q).call(this),ce(this,$,t.firstElementChild),this.container.appendChild(he(this,$)),ce(this,A,he(this,$).querySelector(".hawk-modal-input")),ce(this,x,he(this,$).querySelector(".hawk-input-wrap")),ce(this,M,he(this,$).querySelector(".hawk-input-ghost")),he(this,M)&&(he(this,M).textContent=this.rotatingPlaceholders[0],ue(this,N,Qt).call(this)),ce(this,C,he(this,$).querySelector(".hawk-results-pane")),ce(this,T,he(this,$).querySelector(".hawk-preview-pane")),ce(this,L,he(this,$).querySelector(".hawk-discovery-row")),ce(this,E,he(this,$).querySelector(".hawk-modal-filters")),ce(this,R,he(this,$).querySelector(".hawk-modal-counter")),[he(this,C),he(this,T),he(this,E),he(this,L)].filter(Boolean).forEach(t=>ue(this,N,Jt).call(this,t)),he(this,e)&&(he(this,e).apply(he(this,$)),Object.entries(he(this,e).tokens||{}).forEach(([t,e])=>{he(this,$).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(he(this,$).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(he(this,$).dataset.hawkReveal=this.revealAnimation,he(this,$).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(he(this,$).dataset.hawkResultsReveal=this.resultsRevealDirection,he(this,$).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&he(this,$).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&he(this,$).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&he(this,$).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&he(this,$).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),ue(this,N,G).call(this),ue(this,N,Pt).call(this,"empty"),he(this,p)&&ue(this,N,V).call(this,ue(this,N,rt).call(this,he(this,u)));const i=ue(this,N,wt).call(this);this.enableSecondColumn&&i.url&&ue(this,N,ft).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),he(this,$).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),he(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ue(this,N,Z).call(this,t.dataset.density)})}),he(this,A).addEventListener("input",()=>{ue(this,N,$t).call(this,he(this,A).value),ue(this,N,Qt).call(this)}),he(this,A).addEventListener("keydown",t=>ue(this,N,Kt).call(this,t)),he(this,A).addEventListener("focus",()=>ue(this,N,ut).call(this),{once:!0}),he(this,C).addEventListener("keydown",t=>ue(this,N,Ut).call(this,t)),he(this,T).addEventListener("keydown",t=>ue(this,N,Ft).call(this,t)),he(this,T).addEventListener("focus",()=>{he(this,$).dataset.hawkShowPreview="true"}),he(this,T).addEventListener("blur",()=>{he(this,$).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ue(this,N,jt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
z=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ue(this,N,J).call(this,i),he(this,e)&&(he(this,e).apply(s),Object.entries(he(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),ce(this,c,s)},J=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const a=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${a}`},Q=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${ue(this,N,B).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},G=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:r,verticalFit:h}=this.params;he(this,$).style.setProperty("--hawk-scale",String(i)),he(this,$).style.setProperty("--hawk-offset-x",ue(this,N,X).call(this,a.x)),he(this,$).style.setProperty("--hawk-offset-y",ue(this,N,X).call(this,a.y)),he(this,$).dataset.hawkPosition=s,he(this,$).dataset.hawkDensity=r,he(this,$).dataset.hawkVerticalFit=String(!0===h),he(this,$).dataset.hawkSecondColumn=String(this.enableSecondColumn),he(this,$).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?n:1),he(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),he(this,H)&&(null==(e=(t=he(this,H)).removeEventListener)||e.call(t,"change",he(this,W)),ce(this,H,null)),"function"==typeof window.matchMedia&&(ce(this,H,window.matchMedia(`(max-width: ${l}px)`)),ce(this,W,()=>{he(this,$).dataset.hawkCompact=String(he(this,H).matches)}),he(this,H).addEventListener("change",he(this,W)),he(this,W).call(this))},X=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
Y=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(ve):null;return me.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
Z=function(t){try{null==localStorage||localStorage.setItem(ve,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
tt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
et=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},it=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
st=function(t){if(!this.enableRecentlyViewed||!t||ue(this,N,xt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};ce(this,o,[e,...he(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ue(this,N,it).call(this,he(this,o)),ue(this,N,V).call(this,ue(this,N,rt).call(this,ue(this,N,at).call(this)))},at=function(){return(he(this,u)||[]).filter(t=>t.id!==ke&&t.id!==be)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
nt=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},lt=function(t){return he(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
rt=function(t){const e=[];return this.enablePins&&he(this,h).some(t=>!ue(this,N,xt).call(this,t.url))&&e.push({id:ke,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&he(this,o).some(t=>!ue(this,N,xt).call(this,t.url))&&e.push({id:be,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
ht=function(t){const e=he(this,d)===ke;if(ue(this,N,lt).call(this,t.url))ce(this,h,he(this,h).filter(e=>e.url!==t.url));else{if(!(he(this,h).length<this.maxPins))return;ce(this,h,[...he(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ue(this,N,nt).call(this,he(this,h)),ue(this,N,V).call(this,ue(this,N,rt).call(this,ue(this,N,at).call(this))),he(this,d)===ke?ue(this,N,ot).call(this):e?ue(this,N,$t).call(this,he(this,s)):ue(this,N,Mt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ot=function(){ce(this,l,he(this,h).filter(t=>!ue(this,N,xt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ce(this,r,new Set(he(this,l).map(t=>t.url.split("#")[0])).size),ce(this,n,he(this,l).length?0:-1),ue(this,N,Mt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ct=function(){ce(this,l,he(this,o).filter(t=>!ue(this,N,xt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ce(this,r,new Set(he(this,l).map(t=>t.url.split("#")[0])).size),ce(this,n,he(this,l).length?0:-1),ue(this,N,Mt).call(this)},ut=function(){return de(this,null,function*(){return he(this,w)?he(this,w):he(this,S)?(ce(this,w,he(this,S)),yield ue(this,N,dt).call(this,he(this,w)),yield ue(this,N,mt).call(this),yield ue(this,N,pt).call(this),he(this,w)):(he(this,f)||ce(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>de(this,null,function*(){return yield ue(this,N,dt).call(this,t,{basePath:this.indexBasePath}),ce(this,w,t),yield ue(this,N,mt).call(this),yield ue(this,N,pt).call(this),t})).catch(t=>(ce(this,y,t),ue(this,N,gt).call(this),null))),he(this,f))})},dt=function(t){return de(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,ae(ae({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},pt=function(){return de(this,null,function*(){he(this,d)!==ke?he(this,d)!==be?this.eagerResults&&!he(this,s)&&(yield ue(this,N,$t).call(this,"")):ue(this,N,ct).call(this):ue(this,N,ot).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
gt=function(){he(this,C).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,he(this,C).removeAttribute("aria-activedescendant"),he(this,R).textContent=this.strings.unavailableCounter,ue(this,N,Pt).call(this,"empty")},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
wt=function(){const t=(he(this,u)||[]).find(t=>t.id===he(this,d));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
ft=function(t,e){if(t===he(this,k))return;ue(this,N,Ht).call(this),ce(this,k,t),he(this,T).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=he(this,T).querySelector(".hawk-preview-title"),a=he(this,T).querySelector(".hawk-preview-content");ce(this,m,he(this,i).typeTitle(s,e,{isAnchor:!1})),ue(this,N,Wt).call(this,{url:t,excerpt:"",isAnchor:!1},t,a)},yt=function(){return de(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},mt=function(){return de(this,null,function*(){if(he(this,p))return;if(this.tabsUrl){const t=yield ue(this,N,yt).call(this);if(t)return void ue(this,N,V).call(this,ue(this,N,rt).call(this,ue(this,N,F).call(this,t)))}if(!he(this,w))return void ue(this,N,V).call(this,ue(this,N,rt).call(this,ue(this,N,F).call(this,[])));let t=[];try{const e=yield he(this,w).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ue(this,N,V).call(this,ue(this,N,rt).call(this,ue(this,N,F).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},vt=function(){const t=he(this,u)||[];he(this,E).innerHTML=t.map(t=>{const e=t.id===he(this,d),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(he(this,E).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ue(this,N,kt).call(this,t),he(this,A).focus()}),t.addEventListener("keydown",t=>ue(this,N,bt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
kt=function(t){ce(this,d,t.dataset.filter),he(this,E).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),he(this,d)===ke?(ce(this,s,""),he(this,A).value="",ue(this,N,ot).call(this)):he(this,d)===be?(ce(this,s,""),he(this,A).value="",ue(this,N,ct).call(this)):ue(this,N,$t).call(this,he(this,s))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
bt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ue(this,N,kt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
St=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const a=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=a:Array.isArray(e[i])?e[i].push(a):e[i]=[e[i],a],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},$t=function(t){return de(this,null,function*(){var e;ce(this,s,t),ue(this,N,Pt).call(this,"loading");const i=++(h=this,o=a,{set _(t){ce(h,o,t,c)},get _(){return he(h,o,p)}})._;var h,o,c,p;if(yield ue(this,N,ut).call(this),!he(this,w))return;const g=(he(this,u)||[]).find(t=>t.id===he(this,d)),{filters:f,remainingQuery:m}=ue(this,N,St).call(this,t),v=(null==g?void 0:g.filter)||f?ae(ae({},(null==g?void 0:g.filter)||{}),f||{}):null,k=ae(ae(ae({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),v?{filters:v}:{}),b=this.inlineFilters?m:t;let S;try{({results:S}=b.trim()?yield he(this,w).debouncedSearch(b,k):yield he(this,w).search(null,k))}catch(t){return ce(this,y,t),void ue(this,N,gt).call(this)}if(i!==he(this,a))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!ue(this,N,xt).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}ce(this,l,$.slice(0,this.maxResults)),ce(this,r,new Set(he(this,l).map(t=>t.url.split("#")[0])).size),ce(this,n,he(this,l).length?0:-1),ue(this,N,Mt).call(this)})},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
At=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},xt=function(t){return this.excludePages.has(ue(this,N,At).call(this,t))},Mt=function(){if(!he(this,l).length)return he(this,C).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ue(this,N,B).call(this,he(this,s)))}</div>`,he(this,C).removeAttribute("aria-activedescendant"),he(this,R).textContent=he(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,ue(this,N,Dt).call(this),void ue(this,N,Pt).call(this,"empty");he(this,R).textContent=he(this,s)?this.strings.matchingResults(he(this,l).length,he(this,r)):this.strings.entries(he(this,l).length,he(this,r)),he(this,C).innerHTML=he(this,l).map((t,e)=>{const i=this.enablePins&&ue(this,N,lt).call(this,t.url),s=Math.min(e,10),a=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===he(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===he(this,n)}" style="--hawk-row-index: ${s}${a}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${ue(this,N,Et).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),he(this,C).setAttribute("aria-activedescendant",`${this.id}-result-${he(this,n)}`),he(this,C).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ue(this,N,Rt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ue(this,N,ht).call(this,he(this,l)[s]);ue(this,N,st).call(this,he(this,l)[s]),null==(i=this.onSelect)||i.call(this,he(this,l)[s])})}),ue(this,N,Dt).call(this),ue(this,N,Pt).call(this,"ready")},
/**
 * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
 * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
 */
Pt=function(t){if(!he(this,L)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(he(this,L).hidden=!0);if(he(this,L).hidden=!1,he(this,L).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(he(this,L).innerHTML=`<div class="hawk-discovery-status" role="status">${ue(this,N,B).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:ue(this,N,Ct).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};he(this,L).innerHTML=e.map(([t,e])=>{const a=i[t].slice(0,e.maxItems),n=a.length?`<ul class="hawk-discovery-list">${a.map(t=>`\n              <li><a class="hawk-discovery-link" href="${ue(this,N,B).call(this,ue(this,N,Lt).call(this,t.url))}" aria-label="${ue(this,N,B).call(this,`${t.label}: ${t.context}`)}">${ue(this,N,B).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${ue(this,N,B).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${ue(this,N,B).call(this,e.label||s[t])}</h3>\n          ${n}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Ct=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of he(this,l)){const a=String(s.url||"").split("#")[0],n=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);a&&!i.pages.has(a)&&(i.pages.add(a),e.pages.push({label:n,context:n,url:a})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:n,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const a=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=a.toLocaleLowerCase();a&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:a,context:s.title||n,url:s.url}))}}return e},
/**
 * Formats a result date as relative time ("7 days ago", "last month") via the built-in
 * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
 * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
 * magnitude fits under. Falls back to the raw value for anything Date can't parse.
 */
Tt=function(e){const i=new Date(e);if(Number.isNaN(i.getTime()))return String(e);let s=(i.getTime()-Date.now())/1e3;const a=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:e,unit:i}of a){if(Math.abs(s)<e)return he(Me,t).format(Math.round(s),i);s/=e}return String(e)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Lt=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},Et=function(t){var e,i,s;const a=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",n=this.showResultTags&&!t.isAnchor,l=n?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);n&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!a&&!h.length)return"";const o=a&&"relative"===this.resultDateFormat?ue(this,N,Tt).call(this,a):String(a);return`<div class="hawk-result-meta">${a?`<time class="hawk-result-date" datetime="${ue(this,N,B).call(this,String(a))}">${ue(this,N,B).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${ue(this,N,B).call(this,t)}</span>`).join("")}</div></div>`},Rt=function(t,e){ce(this,n,t),he(this,C).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),he(this,C).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ue(this,N,Dt).call(this)},Dt=function(){var t;if(!this.enableSecondColumn)return;const e=he(this,l)[he(this,n)];if(!e){const t=ue(this,N,wt).call(this);return void(t.url?ue(this,N,ft).call(this,t.url,t.title):(ue(this,N,Ht).call(this),ce(this,k,null),he(this,T).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===he(this,k))return;ue(this,N,Ht).call(this),ce(this,k,s),he(this,T).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const a=he(this,T).querySelector(".hawk-preview-title"),r=he(this,T).querySelector(".hawk-preview-content");ce(this,m,he(this,i).typeTitle(a,e.title,{isAnchor:e.isAnchor})),ue(this,N,Wt).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Ht=function(){he(this,i).stop(he(this,m)),he(this,i).stop(he(this,v)),ce(this,m,null),ce(this,v,null)},Wt=function(t,e,s){return de(this,null,function*(){let a=t.excerpt||"",n=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ue(this,N,qt).call(this,e);t.isAnchor&&i?a=ue(this,N,It).call(this,s,i):this.previewSections?(n=ue(this,N,Ot).call(this,s),n.length||(a=s.innerHTML)):a=s.innerHTML}catch(e){a=t.excerpt||""}he(this,k)===e&&(n&&n.length?ue(this,N,Nt).call(this,n,t,s):ce(this,v,he(this,i).typeContent(s,a)))})},
/**
 * Breaks a page's content root into `{title, slug, excerpt}` rows, one per heading matching
 * `previewSectionSelector` — the heading's own text, its id, and a short plain-text excerpt of
 * the content between it and the next heading of *any* level (so a subsection's text doesn't
 * leak into its parent's excerpt). Pure DOM traversal over content hawk already fetched and
 * parsed for the full-content view — no extra network request, and cheap even for a long page
 * (a few dozen headings at most in practice).
 * @param {Element} root
 * @returns {{title: string, slug: string, excerpt: string}[]}
 */
Ot=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
Nt=function(t,e,s){const a=e.url.split("#")[0],n=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${a}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const n=i.target.closest(".hawk-preview-section-row");if(!n)return;const l=n.getAttribute("href"),r=t.find(t=>`${a}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};ue(this,N,st).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),ce(this,v,he(this,i).typeContent(s,n))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
qt=function(t){if(he(this,b).has(t))return he(this,b).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw he(this,b).delete(t),e});return he(this,b).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
It=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Kt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),he(this,l).length&&ue(this,N,Rt).call(this,(he(this,n)+1)%he(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),he(this,l).length&&ue(this,N,Rt).call(this,(he(this,n)-1+he(this,l).length)%he(this,l).length,!0);else if("Enter"===t.key){const t=he(this,l)[he(this,n)];t&&(ue(this,N,st).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Ut=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),he(this,A).focus(),he(this,A).value+=t.key,void he(this,A).dispatchEvent(new Event("input"));ue(this,N,Kt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Ft=function(t){"ArrowDown"===t.key?(t.preventDefault(),he(this,T).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),he(this,T).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),he(this,T).scrollTop+=he(this,T).clientHeight):"PageUp"===t.key?(t.preventDefault(),he(this,T).scrollTop-=he(this,T).clientHeight):"Home"===t.key?(t.preventDefault(),he(this,T).scrollTop=0):"End"===t.key&&(t.preventDefault(),he(this,T).scrollTop=he(this,T).scrollHeight)},jt=function(t){he(this,g)&&"Tab"===t.key&&ue(this,N,_t).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),he(this,g)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&he(this,g)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the CSS
 * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
 * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
 * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
 * without depending on real rendering (and is testable under jsdom, which never renders).
 */
Bt=function(){if(!this.enableSecondColumn)return!1;return!("true"===he(this,$).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===he(this,$).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Vt=function(){var t;return[he(this,A),...this.headerControls.density?Array.from(he(this,$).querySelectorAll(".hawk-density-btn")):[],he(this,$).querySelector(".hawk-modal-esc"),he(this,E).querySelector('.hawk-filter-pill[tabindex="0"]'),he(this,C),...ue(this,N,Bt).call(this)?[he(this,T)]:[],...Array.from((null==(t=he(this,L))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
_t=function(t){const e=ue(this,N,Vt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
zt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Jt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(he(this,D).get(t)),he(this,D).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
Qt=function(){if(!he(this,M))return;const t=he(this,g)&&!he(this,A).value;he(this,x).dataset.hawkInputActive=String(!t),t&&!he(this,P)?ce(this,P,he(this,i).rotatePlaceholder(he(this,M),this.rotatingPlaceholders)):!t&&he(this,P)&&(he(this,i).stop(he(this,P)),ce(this,P,null))},le(Me,"themes",ge),le(Me,"animations",we),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
oe(Me,t,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let Pe=Me;"undefined"!=typeof window&&(window.Hawk=Pe);export{Pe as HawkSearch,Pe as default};
//# sourceMappingURL=hawk.esm.js.map
