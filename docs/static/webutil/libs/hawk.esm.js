/*! hawk v0.43.9 | https://staticcanvas.github.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,u,d,p,g,f,w,y,m,v,k,b,S,$,A,x,C,M,P,T,L,E,R,D,H,W,N,O,q,I,K,j,F,U,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,ut,dt,pt,gt,ft,wt,yt,mt,vt,kt,bt,St,$t,At,xt,Ct,Mt,Pt,Tt,Lt,Et,Rt,Dt,Ht,Wt,Nt,Ot,qt,It,Kt,jt,Ft,Ut,Bt,Vt,_t,zt,Jt,Qt,Gt,Xt,Yt,Zt,te,ee,ie,se=Object.defineProperty,ne=Object.defineProperties,ae=Object.getOwnPropertyDescriptors,le=Object.getOwnPropertySymbols,re=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable,oe=t=>{throw TypeError(t)},ce=(t,e,i)=>e in t?se(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ue=(t,e)=>{for(var i in e||(e={}))re.call(e,i)&&ce(t,i,e[i]);if(le)for(var i of le(e))he.call(e,i)&&ce(t,i,e[i]);return t},de=(t,e)=>ne(t,ae(e)),pe=(t,e,i)=>ce(t,"symbol"!=typeof e?e+"":e,i),ge=(t,e,i)=>e.has(t)||oe("Cannot "+i),fe=(t,e,i)=>(ge(t,e,"read from private field"),i?i.call(t):e.get(t)),we=(t,e,i)=>e.has(t)?oe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ye=(t,e,i,s)=>(ge(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),me=(t,e,i)=>(ge(t,e,"access private method"),i),ve=(t,e,i,s)=>({set _(s){ye(t,e,s,i)},get _(){return fe(t,e,s)}}),ke=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const be={
/**
   * Writes a title synchronously as text; markup in the title is not interpreted.
   * @param {HTMLElement} el Result-title element owned by Hawk.
   * @param {string} text Plain page or anchor title.
   * @returns {null} No animation controller is created.
   */
typeTitle:(t,e)=>(t.textContent=e,null),
/**
   * Writes preview HTML synchronously, preserving its structure and links.
   * @param {HTMLElement} el Preview-content container owned by Hawk.
   * @param {string} html Preview HTML prepared by the caller.
   * @returns {null} No animation controller is created.
   */
typeContent:(t,e)=>(t.innerHTML=e,null),
/**
   * Shows the first placeholder as text without scheduling rotation timers.
   * @param {HTMLElement} el Placeholder overlay element owned by Hawk.
   * @param {string[]} strings Configured placeholders; an empty list clears the overlay.
   * @returns {null} No rotation controller is created.
   */
rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},
/**
   * Accepts a previous controller without work because all writes are synchronous.
   * @param {unknown} _controller Previous driver return value, including null.
   * @returns {void}
   */
stop(t){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=be);const Se=new Map,$e=new Map;$e.set("instant",be);const Ae=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],xe={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},Ce=new Set(["fit","medium","compact"]),Me="hawk:density",Pe="pinned",Te="recently-viewed",Le={open:!0,slash:!0,escape:!0},Ee={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},Re={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let De=0;const He=class{
/**
   * @param {object} [config]
   * @param {string} [config.index] Base path (URL, trailing slash) to a Pagefind bundle — the
   *   directory `pagefind --site <dir>` wrote `pagefind.js` into. Required unless `config.pagefind` is given.
   * @param {object} [config.pagefind] A pre-loaded Pagefind module (or compatible mock) to use
   *   instead of dynamically importing one from `config.index` — e.g. when the consumer already
   *   bundles Pagefind, or in tests.
   * @param {boolean} [config.preload=false] Loads Pagefind during idle time after page load,
   *   warming the initial listing when eagerResults is enabled without opening the dialog.
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
   * @param {number} [config.resultHydrationConcurrency=6] Maximum Pagefind result fragments hydrated
   *   at once. Results are still committed in Pagefind order and rendered after each completed batch.
   * @param {number} [config.maxCandidateResults=maxResults*3] Maximum Pagefind result handles Hawk will
   *   hydrate for one search while backfilling exclusions and expanding heading sub-results.
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
   * @param {boolean|{density?: boolean|{fit?: boolean, medium?: boolean, compact?: boolean}, escape?: boolean}} [config.headerControls]
   *   Controls the Fit/Medium/Compact group and Escape button at the right of the search input.
   *   Pass false for a minimal input-only header, or disable either control independently.
   *   A density object can hide individual size buttons; omitted choices remain enabled.
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
constructor(t={}){var V,_,J,Q,X,Y,Z;if(we(this,K),we(this,e),we(this,i),we(this,s),we(this,n),we(this,a),we(this,l),we(this,r),we(this,h),we(this,o),we(this,c),we(this,u),we(this,d),we(this,p),we(this,g),we(this,f),we(this,w),we(this,y),we(this,m),we(this,v,!1),we(this,k),we(this,b),we(this,S),we(this,$),we(this,A),we(this,x),we(this,C),we(this,M),we(this,P),we(this,T),we(this,L),we(this,E),we(this,R),we(this,D),we(this,H),we(this,W),we(this,N),we(this,O),we(this,q),we(this,I),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${De+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,ye(this,x,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const tt=me(this,K,st).call(this);this.params=de(ue(ue(ue({},xe),tt?{density:tt}:{}),t.params),{offset:ue(ue({},xe.offset),null==(V=t.params)?void 0:V.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=me(this,K,z).call(this,t.maxResults,18),this.resultHydrationConcurrency=Math.max(1,me(this,K,z).call(this,t.resultHydrationConcurrency,6)),this.maxCandidateResults=me(this,K,z).call(this,t.maxCandidateResults,3*this.maxResults),this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):Ae,this.showSubpageConnector=!1!==t.showSubpageConnector;const et=!1!==t.headerControls&&(t.headerControls||{});this.densityChoices=[...Ce].filter(t=>{var e;return!1!==(null==(e=et.density)?void 0:e[t])}),this.headerControls={density:!1!==et&&!1!==et.density&&this.densityChoices.length>0,escape:!1!==et&&!1!==et.escape};const it=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(it.map(t=>me(this,K,Et).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(_=t.maxPins)?_:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(J=t.maxRecentlyViewed)?J:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(Q=t.previewSectionExcerptLength)?Q:140,this.discoveryRow=me(this,K,U).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=ue(ue({},Le),t.hotkeys),this.strings=ue(ue({},Re),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Y=null!=(X=t.revealDuration)?X:Ee[this.revealAnimation])?Y:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(Z=t.resultsRevealStagger)?Z:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,ye(this,e,me(this,K,j).call(this,t.theme)),ye(this,i,me(this,K,F).call(this,t.animation)),ye(this,s,""),ye(this,n,0),ye(this,a,-1),ye(this,l,[]),ye(this,r,0),ye(this,h,this.enablePins?me(this,K,at).call(this):[]),ye(this,o,this.enableRecentlyViewed?me(this,K,lt).call(this):[]),ye(this,d,t.defaultTab||"all"),ye(this,u,me(this,K,B).call(this,t)),ye(this,p,null!==fe(this,u)),ye(this,g,!1),ye(this,f,null),ye(this,w,null),ye(this,k,null),ye(this,b,null),ye(this,S,null),ye(this,$,null),ye(this,A,new Map),ye(this,N,new Map),this.container&&(me(this,K,G).call(this),!0===t.preload&&me(this,K,wt).call(this))}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Se.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){$e.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:fe(this,g),query:fe(this,s),selectedIndex:fe(this,a),matches:fe(this,l),pageCount:fe(this,r),pins:fe(this,h),recentlyViewed:fe(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:fe(this,d),error:fe(this,k)}}
/**
   * Updates layout params after construction, including density-button visibility.
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=de(ue(ue({},this.params),t),{offset:ue(ue({},this.params.offset),null==t?void 0:t.offset)}),me(this,K,et).call(this)}
/**
   * Warms Pagefind and the initial listing without opening or focusing the dialog.
   * Concurrent calls and an overlapping open share the same initialization.
   * @returns {Promise<boolean>} Whether Pagefind loaded; false after failure or destruction.
   */preload(){var t;return null==(t=fe(this,m))||t.call(this),ye(this,m,null),fe(this,v)||!fe(this,C)?Promise.resolve(!1):(fe(this,y)||ye(this,y,me(this,K,yt).call(this).then(t=>(t||fe(this,v)||(ye(this,w,null),ye(this,y,null)),Boolean(t)&&!fe(this,v)))),fe(this,y))}
/** Opens the search modal and focuses the input. */open(){var t,e;fe(this,v)||(null==(t=fe(this,m))||t.call(this),ye(this,m,null),clearTimeout(fe(this,I)),delete fe(this,C).dataset.hawkAnimState,fe(this,C).hidden=!1,document.body.style.overflow="hidden",ye(this,g,!0),me(this,K,yt).call(this),me(this,K,ie).call(this),me(this,K,te).call(this)&&(fe(this,C).dataset.hawkAnimState="opening",ye(this,I,setTimeout(()=>{delete fe(this,C).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{fe(this,M).focus(),fe(this,M).select()},40),null==(e=this.onOpen)||e.call(this,fe(this,s)))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",ye(this,g,!1),me(this,K,ie).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(fe(this,I)),me(this,K,te).call(this)?(fe(this,C).dataset.hawkAnimState="closing",ye(this,I,setTimeout(()=>{fe(this,C).hidden=!0,delete fe(this,C).dataset.hawkAnimState},this.revealDuration))):fe(this,C).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,a,l;ye(this,v,!0),ve(this,n)._++,null==(t=fe(this,m))||t.call(this),ye(this,m,null),me(this,K,jt).call(this),fe(this,L)&&fe(this,i).stop(fe(this,L)),null==(s=null==(e=fe(this,O))?void 0:e.removeEventListener)||s.call(e,"change",fe(this,q)),fe(this,N).forEach(t=>clearTimeout(t)),clearTimeout(fe(this,I)),null==(a=fe(this,C))||a.remove(),null==(l=fe(this,c))||l.remove()}};t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,A=new WeakMap,x=new WeakMap,C=new WeakMap,M=new WeakMap,P=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,N=new WeakMap,O=new WeakMap,q=new WeakMap,I=new WeakMap,K=new WeakSet,j=function(t){if(!t)return Se.get("typeflow")||null;if("string"==typeof t){const e=Se.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},F=function(t){if(!1===t)return $e.get("instant");if(!t)return $e.get("typeflow")||$e.get("instant");if("string"==typeof t){const e=$e.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
U=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
B=function(t){return t.tabs?me(this,K,V).call(this,t.tabs):t.categories?me(this,K,V).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
V=function(t){const e=t.map(t=>({id:t.id||me(this,K,_).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?de(ue({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},_=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/** Returns a finite non-negative integer, or `fallback` for an invalid value. */
z=function(t,e){const i=Number(null!=t?t:e);return Number.isFinite(i)&&i>=0?Math.floor(i):e},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
J=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
Q=function(t){var e,i;ye(this,u,t),t.some(t=>t.id===fe(this,d))||("all"!==fe(this,d)&&fe(this,d)!==Pe&&fe(this,d)!==Te&&console.warn(`HawkSearch: no tab with id "${fe(this,d)}" (defaultTab); falling back to "all".`),ye(this,d,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),me(this,K,xt).call(this)},G=function(){me(this,K,X).call(this);const t=document.createElement("div");t.innerHTML=me(this,K,tt).call(this),ye(this,C,t.firstElementChild),this.container.appendChild(fe(this,C)),ye(this,M,fe(this,C).querySelector(".hawk-modal-input")),ye(this,P,fe(this,C).querySelector(".hawk-input-wrap")),ye(this,T,fe(this,C).querySelector(".hawk-input-ghost")),fe(this,T)&&(fe(this,T).textContent=this.rotatingPlaceholders[0],me(this,K,ie).call(this)),ye(this,E,fe(this,C).querySelector(".hawk-results-pane")),ye(this,R,fe(this,C).querySelector(".hawk-preview-pane")),ye(this,D,fe(this,C).querySelector(".hawk-discovery-row")),ye(this,H,fe(this,C).querySelector(".hawk-modal-filters")),ye(this,W,fe(this,C).querySelector(".hawk-modal-counter")),[fe(this,E),fe(this,R),fe(this,H),fe(this,D)].filter(Boolean).forEach(t=>me(this,K,ee).call(this,t)),fe(this,e)&&(fe(this,e).apply(fe(this,C)),Object.entries(fe(this,e).tokens||{}).forEach(([t,e])=>{fe(this,C).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(fe(this,C).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(fe(this,C).dataset.hawkReveal=this.revealAnimation,fe(this,C).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(fe(this,C).dataset.hawkResultsReveal=this.resultsRevealDirection,fe(this,C).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&fe(this,C).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&fe(this,C).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&fe(this,C).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&fe(this,C).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),me(this,K,et).call(this),me(this,K,Ht).call(this,"empty"),fe(this,p)&&me(this,K,Q).call(this,me(this,K,dt).call(this,fe(this,u)));const i=me(this,K,bt).call(this);this.enableSecondColumn&&i.url&&me(this,K,St).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),fe(this,C).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),fe(this,C).addEventListener("click",t=>{const e=t.target.closest(".hawk-density-btn");e&&fe(this,C).contains(e)&&(this.setParams({density:e.dataset.density}),me(this,K,nt).call(this,e.dataset.density))}),fe(this,M).addEventListener("input",()=>{me(this,K,Tt).call(this,fe(this,M).value),me(this,K,ie).call(this)}),fe(this,M).addEventListener("keydown",t=>me(this,K,zt).call(this,t)),fe(this,M).addEventListener("focus",()=>me(this,K,yt).call(this),{once:!0}),fe(this,E).addEventListener("keydown",t=>me(this,K,Jt).call(this,t)),fe(this,R).addEventListener("keydown",t=>me(this,K,Qt).call(this,t)),fe(this,R).addEventListener("focus",()=>{fe(this,C).dataset.hawkShowPreview="true"}),fe(this,R).addEventListener("blur",()=>{fe(this,C).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>me(this,K,Gt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
X=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=me(this,K,Y).call(this,i),fe(this,e)&&(fe(this,e).apply(s),Object.entries(fe(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),ye(this,c,s)},Y=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},Z=function(){if(!this.headerControls.density||!this.params.allowDensityToggle)return"";const t=this.strings,e={fit:t.densityFit,medium:t.densityMedium,compact:t.densityCompact};return`<div class="hawk-density-toggle" role="group" aria-label="${me(this,K,J).call(this,t.densityGroupLabel)}">${this.densityChoices.map(t=>`<button type="button" class="hawk-density-btn" data-density="${t}">${me(this,K,J).call(this,e[t])}</button>`).join("")}</div>`},tt=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${me(this,K,Z).call(this)}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${me(this,K,J).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},et=function(){var t,e;const i=fe(this,C).querySelector(".hawk-density-toggle"),s=this.headerControls.density&&this.params.allowDensityToggle;i&&!s?(i.contains(document.activeElement)&&fe(this,M).focus(),i.remove()):!i&&s&&fe(this,C).querySelector(".hawk-input-wrap").insertAdjacentHTML("afterend",me(this,K,Z).call(this));const{scale:n,position:a,offset:l,columns:r,breakpoint:h,density:o,verticalFit:c}=this.params;fe(this,C).style.setProperty("--hawk-scale",String(n)),fe(this,C).style.setProperty("--hawk-offset-x",me(this,K,it).call(this,l.x)),fe(this,C).style.setProperty("--hawk-offset-y",me(this,K,it).call(this,l.y)),fe(this,C).dataset.hawkPosition=a,fe(this,C).dataset.hawkDensity=o,fe(this,C).dataset.hawkVerticalFit=String(!0===c),fe(this,C).dataset.hawkSecondColumn=String(this.enableSecondColumn),fe(this,C).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?r:1),fe(this,C).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===o;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),fe(this,O)&&(null==(e=(t=fe(this,O)).removeEventListener)||e.call(t,"change",fe(this,q)),ye(this,O,null)),"function"==typeof window.matchMedia&&(ye(this,O,window.matchMedia(`(max-width: ${h}px)`)),ye(this,q,()=>{fe(this,C).dataset.hawkCompact=String(fe(this,O).matches)}),fe(this,O).addEventListener("change",fe(this,q)),fe(this,q).call(this))},it=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
st=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Me):null;return Ce.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
nt=function(t){try{null==localStorage||localStorage.setItem(Me,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
at=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
lt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},rt=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
ht=function(t){if(!this.enableRecentlyViewed||!t||me(this,K,Rt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};ye(this,o,[e,...fe(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),me(this,K,rt).call(this,fe(this,o)),me(this,K,Q).call(this,me(this,K,dt).call(this,me(this,K,ot).call(this)))},ot=function(){return(fe(this,u)||[]).filter(t=>t.id!==Pe&&t.id!==Te)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
ct=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},ut=function(t){return fe(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
dt=function(t){const e=[];return this.enablePins&&fe(this,h).some(t=>!me(this,K,Rt).call(this,t.url))&&e.push({id:Pe,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&fe(this,o).some(t=>!me(this,K,Rt).call(this,t.url))&&e.push({id:Te,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
pt=function(t){const e=fe(this,d)===Pe;if(me(this,K,ut).call(this,t.url))ye(this,h,fe(this,h).filter(e=>e.url!==t.url));else{if(!(fe(this,h).length<this.maxPins))return;ye(this,h,[...fe(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}me(this,K,ct).call(this,fe(this,h)),me(this,K,Q).call(this,me(this,K,dt).call(this,me(this,K,ot).call(this))),fe(this,d)===Pe?me(this,K,gt).call(this):e?me(this,K,Tt).call(this,fe(this,s)):me(this,K,Dt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
gt=function(){ye(this,l,fe(this,h).filter(t=>!me(this,K,Rt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ye(this,r,new Set(fe(this,l).map(t=>t.url.split("#")[0])).size),ye(this,a,fe(this,l).length?0:-1),me(this,K,Dt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ft=function(){ye(this,l,fe(this,o).filter(t=>!me(this,K,Rt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ye(this,r,new Set(fe(this,l).map(t=>t.url.split("#")[0])).size),ye(this,a,fe(this,l).length?0:-1),me(this,K,Dt).call(this)},wt=function(){var t;if(null==(t=navigator.connection)?void 0:t.saveData)return;const e=()=>{if(fe(this,v))return;const t=()=>{ye(this,m,null),this.preload()};if("function"==typeof window.requestIdleCallback){const e=window.requestIdleCallback(t,{timeout:2e3});ye(this,m,()=>{var t;return null==(t=window.cancelIdleCallback)?void 0:t.call(window,e)})}else{const e=setTimeout(t,0);ye(this,m,()=>clearTimeout(e))}};"complete"===document.readyState?e():(window.addEventListener("load",e,{once:!0}),ye(this,m,()=>window.removeEventListener("load",e)))},yt=function(){return ke(this,null,function*(){if(fe(this,v))return null;if(fe(this,f))return fe(this,f);if(!fe(this,w)){const t=fe(this,x)?Promise.resolve(fe(this,x)):import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`);ye(this,w,t.then(t=>ke(this,null,function*(){return fe(this,v)?null:(yield me(this,K,mt).call(this,t,fe(this,x)?{}:{basePath:this.indexBasePath}),fe(this,v)?null:(ye(this,k,null),ye(this,f,t),yield me(this,K,At).call(this),fe(this,v)?null:(yield me(this,K,vt).call(this),t)))})).catch(t=>(fe(this,v)||(ye(this,f,null),ye(this,k,t),me(this,K,kt).call(this)),null)))}return fe(this,w)})},mt=function(t){return ke(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,ue(ue({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},vt=function(){return ke(this,null,function*(){fe(this,d)!==Pe?fe(this,d)!==Te?this.eagerResults&&!fe(this,s)&&(yield me(this,K,Tt).call(this,"")):me(this,K,ft).call(this):me(this,K,gt).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
kt=function(){fe(this,E).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,fe(this,E).removeAttribute("aria-activedescendant"),fe(this,W).textContent=this.strings.unavailableCounter,me(this,K,Ht).call(this,"empty")},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
bt=function(){const t=(fe(this,u)||[]).find(t=>t.id===fe(this,d));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
St=function(t,e){if(t===fe(this,$))return;me(this,K,jt).call(this),ye(this,$,t),fe(this,R).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=fe(this,R).querySelector(".hawk-preview-title"),n=fe(this,R).querySelector(".hawk-preview-content");ye(this,b,fe(this,i).typeTitle(s,e,{isAnchor:!1})),me(this,K,Ft).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},$t=function(){return ke(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},At=function(){return ke(this,null,function*(){if(fe(this,p))return;if(this.tabsUrl){const t=yield me(this,K,$t).call(this);if(t)return void me(this,K,Q).call(this,me(this,K,dt).call(this,me(this,K,V).call(this,t)))}if(!fe(this,f))return void me(this,K,Q).call(this,me(this,K,dt).call(this,me(this,K,V).call(this,[])));let t=[];try{const e=yield fe(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}me(this,K,Q).call(this,me(this,K,dt).call(this,me(this,K,V).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},xt=function(){const t=fe(this,u)||[];fe(this,H).innerHTML=t.map(t=>{const e=t.id===fe(this,d),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(fe(this,H).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{me(this,K,Ct).call(this,t),fe(this,M).focus()}),t.addEventListener("keydown",t=>me(this,K,Mt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
Ct=function(t){ye(this,d,t.dataset.filter),fe(this,H).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),fe(this,d)===Pe?(ye(this,s,""),fe(this,M).value="",me(this,K,gt).call(this)):fe(this,d)===Te?(ye(this,s,""),fe(this,M).value="",me(this,K,ft).call(this)):me(this,K,Tt).call(this,fe(this,s))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
Mt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),me(this,K,Ct).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
Pt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},Tt=function(t){return ke(this,null,function*(){var e;if(fe(this,v))return;ye(this,s,t),me(this,K,Ht).call(this,"loading");const i=++ve(this,n)._;if(yield me(this,K,yt).call(this),!fe(this,f)||fe(this,v))return;const a=(fe(this,u)||[]).find(t=>t.id===fe(this,d)),{filters:r,remainingQuery:h}=me(this,K,Pt).call(this,t),o=(null==a?void 0:a.filter)||r?ue(ue({},(null==a?void 0:a.filter)||{}),r||{}):null,c=ue(ue(ue({},this.pagefindOptions),(null==a?void 0:a.pagefindOptions)||{}),o?{filters:o}:{}),p=this.inlineFilters?h:t;let g;try{({results:g}=p.trim()?yield fe(this,f).debouncedSearch(p,c):yield fe(this,f).search(null,c))}catch(t){if(i!==fe(this,n))return;return ye(this,k,t),void me(this,K,kt).call(this)}if(i!==fe(this,n))return;const w=(g||[]).slice(0,this.maxCandidateResults),y=[];let m=-1;for(let t=0;t<w.length&&y.length<this.maxResults;t+=this.resultHydrationConcurrency){const s=w.slice(t,t+this.resultHydrationConcurrency);let a;try{a=yield Promise.all(s.map(t=>t.data()))}catch(t){if(i!==fe(this,n))return;return ye(this,k,t),void me(this,K,kt).call(this)}if(i!==fe(this,n))return;for(const t of a)if(!me(this,K,Rt).call(this,t.url)){y.push({title:(null==(e=t.meta)?void 0:e.title)||this.strings.untitled,url:t.url,excerpt:t.excerpt,isAnchor:!1,meta:t.meta||{}});for(const e of t.sub_results||[])if(e.url!==t.url&&(y.push({title:e.title,url:e.url,excerpt:e.excerpt,isAnchor:!0,meta:t.meta||{}}),y.length>=this.maxResults))break;if(y.length>=this.maxResults)break}y.length&&y.length!==m&&(me(this,K,Lt).call(this,y),m=fe(this,l).length)}i===fe(this,n)&&m!==Math.min(y.length,this.maxResults)&&me(this,K,Lt).call(this,y)})},
/** Commits one ordered progressive search batch and updates every result-derived surface. */
Lt=function(t){ye(this,l,t.slice(0,this.maxResults)),ye(this,r,new Set(fe(this,l).map(t=>t.url.split("#")[0])).size),ye(this,a,fe(this,l).length?0:-1),me(this,K,Dt).call(this)},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
Et=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},Rt=function(t){return this.excludePages.has(me(this,K,Et).call(this,t))},Dt=function(){if(!fe(this,l).length)return fe(this,E).innerHTML=`<div class="hawk-empty">${this.strings.noResults(me(this,K,J).call(this,fe(this,s)))}</div>`,fe(this,E).removeAttribute("aria-activedescendant"),fe(this,W).textContent=fe(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,me(this,K,Kt).call(this),void me(this,K,Ht).call(this,"empty");fe(this,W).textContent=fe(this,s)?this.strings.matchingResults(fe(this,l).length,fe(this,r)):this.strings.entries(fe(this,l).length,fe(this,r)),fe(this,E).innerHTML=fe(this,l).map((t,e)=>{const i=this.enablePins&&me(this,K,ut).call(this,t.url),s=Math.min(e,10),n=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===fe(this,a)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===fe(this,a)}" style="--hawk-row-index: ${s}${n}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${me(this,K,qt).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),fe(this,E).setAttribute("aria-activedescendant",`${this.id}-result-${fe(this,a)}`),fe(this,E).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>me(this,K,It).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void me(this,K,pt).call(this,fe(this,l)[s]);me(this,K,ht).call(this,fe(this,l)[s]),null==(i=this.onSelect)||i.call(this,fe(this,l)[s])})}),me(this,K,Kt).call(this),me(this,K,Ht).call(this,"ready")},
/**
 * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
 * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
 */
Ht=function(t){if(!fe(this,D)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(fe(this,D).hidden=!0);if(fe(this,D).hidden=!1,fe(this,D).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(fe(this,D).innerHTML=`<div class="hawk-discovery-status" role="status">${me(this,K,J).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:me(this,K,Wt).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};fe(this,D).innerHTML=e.map(([t,e])=>{const n=i[t].slice(0,e.maxItems),a=n.length?`<ul class="hawk-discovery-list">${n.map(t=>`\n              <li><a class="hawk-discovery-link" href="${me(this,K,J).call(this,me(this,K,Ot).call(this,t.url))}" aria-label="${me(this,K,J).call(this,`${t.label}: ${t.context}`)}">${me(this,K,J).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${me(this,K,J).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${me(this,K,J).call(this,e.label||s[t])}</h3>\n          ${a}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Wt=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of fe(this,l)){const n=String(s.url||"").split("#")[0],a=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);n&&!i.pages.has(n)&&(i.pages.add(n),e.pages.push({label:a,context:a,url:n})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:a,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const n=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=n.toLocaleLowerCase();n&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:n,context:s.title||a,url:s.url}))}}return e},
/**
 * Formats a result date as relative time ("7 days ago", "last month") via the built-in
 * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
 * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
 * magnitude fits under. Falls back to the raw value for anything Date can't parse.
 */
Nt=function(e){const i=new Date(e);if(Number.isNaN(i.getTime()))return String(e);let s=(i.getTime()-Date.now())/1e3;const n=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:e,unit:i}of n){if(Math.abs(s)<e)return fe(He,t).format(Math.round(s),i);s/=e}return String(e)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Ot=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},qt=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",a=this.showResultTags&&!t.isAnchor,l=a?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);a&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!n&&!h.length)return"";const o=n&&"relative"===this.resultDateFormat?me(this,K,Nt).call(this,n):String(n);return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${me(this,K,J).call(this,String(n))}">${me(this,K,J).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${me(this,K,J).call(this,t)}</span>`).join("")}</div></div>`},It=function(t,e){ye(this,a,t),fe(this,E).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),fe(this,E).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),me(this,K,Kt).call(this)},Kt=function(){var t;if(!this.enableSecondColumn)return;const e=fe(this,l)[fe(this,a)];if(!e){const t=me(this,K,bt).call(this);return void(t.url?me(this,K,St).call(this,t.url,t.title):(me(this,K,jt).call(this),ye(this,$,null),fe(this,R).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===fe(this,$))return;me(this,K,jt).call(this),ye(this,$,s),fe(this,R).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=fe(this,R).querySelector(".hawk-preview-title"),r=fe(this,R).querySelector(".hawk-preview-content");ye(this,b,fe(this,i).typeTitle(n,e.title,{isAnchor:e.isAnchor})),me(this,K,Ft).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
jt=function(){fe(this,i).stop(fe(this,b)),fe(this,i).stop(fe(this,S)),ye(this,b,null),ye(this,S,null)},Ft=function(t,e,s){return ke(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield me(this,K,Vt).call(this,e);t.isAnchor&&i?n=me(this,K,_t).call(this,s,i):this.previewSections?(a=me(this,K,Ut).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}fe(this,$)===e&&(a&&a.length?me(this,K,Bt).call(this,a,t,s):ye(this,S,fe(this,i).typeContent(s,n)))})},
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
Ut=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
Bt=function(t,e,s){const n=e.url.split("#")[0],a=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const a=i.target.closest(".hawk-preview-section-row");if(!a)return;const l=a.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};me(this,K,ht).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),ye(this,S,fe(this,i).typeContent(s,a))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
Vt=function(t){if(fe(this,A).has(t))return fe(this,A).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw fe(this,A).delete(t),e});return fe(this,A).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
_t=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
zt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),fe(this,l).length&&me(this,K,It).call(this,(fe(this,a)+1)%fe(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),fe(this,l).length&&me(this,K,It).call(this,(fe(this,a)-1+fe(this,l).length)%fe(this,l).length,!0);else if("Enter"===t.key){const t=fe(this,l)[fe(this,a)];t&&(me(this,K,ht).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Jt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),fe(this,M).focus(),fe(this,M).value+=t.key,void fe(this,M).dispatchEvent(new Event("input"));me(this,K,zt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Qt=function(t){"ArrowDown"===t.key?(t.preventDefault(),fe(this,R).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),fe(this,R).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),fe(this,R).scrollTop+=fe(this,R).clientHeight):"PageUp"===t.key?(t.preventDefault(),fe(this,R).scrollTop-=fe(this,R).clientHeight):"Home"===t.key?(t.preventDefault(),fe(this,R).scrollTop=0):"End"===t.key&&(t.preventDefault(),fe(this,R).scrollTop=fe(this,R).scrollHeight)},Gt=function(t){fe(this,g)&&"Tab"===t.key&&me(this,K,Zt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),fe(this,g)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&fe(this,g)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the CSS
 * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
 * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
 * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
 * without depending on real rendering (and is testable under jsdom, which never renders).
 */
Xt=function(){if(!this.enableSecondColumn)return!1;return!("true"===fe(this,C).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===fe(this,C).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Yt=function(){var t;return[fe(this,M),...this.headerControls.density?Array.from(fe(this,C).querySelectorAll(".hawk-density-btn")):[],fe(this,C).querySelector(".hawk-modal-esc"),fe(this,H).querySelector('.hawk-filter-pill[tabindex="0"]'),fe(this,E),...me(this,K,Xt).call(this)?[fe(this,R)]:[],...Array.from((null==(t=fe(this,D))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
Zt=function(t){const e=me(this,K,Yt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
te=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
ee=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(fe(this,N).get(t)),fe(this,N).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
ie=function(){if(!fe(this,T))return;const t=fe(this,g)&&!fe(this,M).value;fe(this,P).dataset.hawkInputActive=String(!t),t&&!fe(this,L)?ye(this,L,fe(this,i).rotatePlaceholder(fe(this,T),this.rotatingPlaceholders)):!t&&fe(this,L)&&(fe(this,i).stop(fe(this,L)),ye(this,L,null))},pe(He,"themes",Se),pe(He,"animations",$e),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
we(He,t,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let We=He;"undefined"!=typeof window&&(window.Hawk=We);export{We as HawkSearch,We as default};
//# sourceMappingURL=hawk.esm.js.map
