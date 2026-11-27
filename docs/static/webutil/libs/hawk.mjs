/*! hawk v0.43.9 | https://staticcanvas.github.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,u,d,p,g,f,w,y,m,v,k,b,S,$,A,x,C,M,P,T,L,E,R,D,H,W,N,O,q,I,K,j,F,U,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,ut,dt,pt,gt,ft,wt,yt,mt,vt,kt,bt,St,$t,At,xt,Ct,Mt,Pt,Tt,Lt,Et,Rt,Dt,Ht,Wt,Nt,Ot,qt,It,Kt,jt,Ft,Ut,Bt,Vt,_t,zt,Jt,Qt,Gt,Xt,Yt,Zt,te,ee,ie,se,ne=Object.defineProperty,ae=Object.defineProperties,le=Object.getOwnPropertyDescriptors,re=Object.getOwnPropertySymbols,he=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable,ce=t=>{throw TypeError(t)},ue=(t,e,i)=>e in t?ne(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,de=(t,e)=>{for(var i in e||(e={}))he.call(e,i)&&ue(t,i,e[i]);if(re)for(var i of re(e))oe.call(e,i)&&ue(t,i,e[i]);return t},pe=(t,e)=>ae(t,le(e)),ge=(t,e,i)=>ue(t,"symbol"!=typeof e?e+"":e,i),fe=(t,e,i)=>e.has(t)||ce("Cannot "+i),we=(t,e,i)=>(fe(t,e,"read from private field"),i?i.call(t):e.get(t)),ye=(t,e,i)=>e.has(t)?ce("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),me=(t,e,i,s)=>(fe(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ve=(t,e,i)=>(fe(t,e,"access private method"),i),ke=(t,e,i,s)=>({set _(s){me(t,e,s,i)},get _(){return we(t,e,s)}}),be=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Se={
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
stop(t){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Se);const $e=new Map,Ae=new Map;Ae.set("instant",Se);let xe=0;const Ce=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],Me={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},Pe=new Set(["fit","medium","compact"]),Te="hawk:density",Le="pinned",Ee="recently-viewed",Re={open:!0,slash:!0,escape:!0},De={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},He={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let We=0;const Ne=class{
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
constructor(t={}){var _,z,Q,G,Y,Z,tt;if(ye(this,j),ye(this,e),ye(this,i),ye(this,s),ye(this,n),ye(this,a),ye(this,l),ye(this,r),ye(this,h),ye(this,o),ye(this,c),ye(this,u),ye(this,d),ye(this,p),ye(this,g),ye(this,f),ye(this,w),ye(this,y),ye(this,m,0),ye(this,v),ye(this,k,!1),ye(this,b),ye(this,S),ye(this,$),ye(this,A),ye(this,x),ye(this,C),ye(this,M),ye(this,P),ye(this,T),ye(this,L),ye(this,E),ye(this,R),ye(this,D),ye(this,H),ye(this,W),ye(this,N),ye(this,O),ye(this,q),ye(this,I),ye(this,K),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${We+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,me(this,C,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const et=ve(this,j,nt).call(this);this.params=pe(de(de(de({},Me),et?{density:et}:{}),t.params),{offset:de(de({},Me.offset),null==(_=t.params)?void 0:_.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=ve(this,j,J).call(this,t.maxResults,18),this.resultHydrationConcurrency=Math.max(1,ve(this,j,J).call(this,t.resultHydrationConcurrency,6)),this.maxCandidateResults=ve(this,j,J).call(this,t.maxCandidateResults,3*this.maxResults),this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):Ce,this.showSubpageConnector=!1!==t.showSubpageConnector;const it=!1!==t.headerControls&&(t.headerControls||{});this.densityChoices=[...Pe].filter(t=>{var e;return!1!==(null==(e=it.density)?void 0:e[t])}),this.headerControls={density:!1!==it&&!1!==it.density&&this.densityChoices.length>0,escape:!1!==it&&!1!==it.escape};const st=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(st.map(t=>ve(this,j,Rt).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(z=t.maxPins)?z:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(Q=t.maxRecentlyViewed)?Q:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(G=t.previewSectionExcerptLength)?G:140,this.discoveryRow=ve(this,j,B).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=de(de({},Re),t.hotkeys),this.strings=de(de({},He),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Z=null!=(Y=t.revealDuration)?Y:De[this.revealAnimation])?Z:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(tt=t.resultsRevealStagger)?tt:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,me(this,e,ve(this,j,F).call(this,t.theme)),me(this,i,ve(this,j,U).call(this,t.animation)),me(this,s,""),me(this,n,0),me(this,a,-1),me(this,l,[]),me(this,r,0),me(this,h,this.enablePins?ve(this,j,lt).call(this):[]),me(this,o,this.enableRecentlyViewed?ve(this,j,rt).call(this):[]),me(this,d,t.defaultTab||"all"),me(this,u,ve(this,j,V).call(this,t)),me(this,p,null!==we(this,u)),me(this,g,!1),me(this,f,null),me(this,w,null),me(this,b,null),me(this,S,null),me(this,$,null),me(this,A,null),me(this,x,new Map),me(this,O,new Map),this.container&&(ve(this,j,X).call(this),!0===t.preload&&ve(this,j,yt).call(this))}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){$e.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Ae.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:we(this,g),query:we(this,s),selectedIndex:we(this,a),matches:we(this,l),pageCount:we(this,r),pins:we(this,h),recentlyViewed:we(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:we(this,d),error:we(this,b)}}
/**
   * Updates layout params after construction, including density-button visibility.
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=pe(de(de({},this.params),t),{offset:de(de({},this.params.offset),null==t?void 0:t.offset)}),ve(this,j,it).call(this)}
/**
   * Warms Pagefind and the initial listing without opening or focusing the dialog.
   * Concurrent calls and an overlapping open share the same initialization.
   * @returns {Promise<boolean>} Whether Pagefind loaded; false after failure or destruction.
   */preload(){var t;return null==(t=we(this,v))||t.call(this),me(this,v,null),we(this,k)||!we(this,M)?Promise.resolve(!1):(we(this,y)||me(this,y,ve(this,j,mt).call(this).then(t=>(t||we(this,k)||(me(this,w,null),me(this,y,null)),Boolean(t)&&!we(this,k)))),we(this,y))}
/** Opens the search modal and focuses the input. */open(){var t,e;we(this,k)||(null==(t=we(this,v))||t.call(this),me(this,v,null),clearTimeout(we(this,K)),delete we(this,M).dataset.hawkAnimState,we(this,M).hidden=!1,document.body.style.overflow="hidden",me(this,g,!0),ve(this,j,mt).call(this),ve(this,j,se).call(this),ve(this,j,ee).call(this)&&(we(this,M).dataset.hawkAnimState="opening",me(this,K,setTimeout(()=>{delete we(this,M).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{we(this,P).focus(),we(this,P).select()},40),null==(e=this.onOpen)||e.call(this,we(this,s)))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",me(this,g,!1),ve(this,j,se).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(we(this,K)),ve(this,j,ee).call(this)?(we(this,M).dataset.hawkAnimState="closing",me(this,K,setTimeout(()=>{we(this,M).hidden=!0,delete we(this,M).dataset.hawkAnimState},this.revealDuration))):we(this,M).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,a,l;me(this,k,!0),ke(this,n)._++,null==(t=we(this,v))||t.call(this),me(this,v,null),ve(this,j,Ft).call(this),we(this,E)&&we(this,i).stop(we(this,E)),null==(s=null==(e=we(this,q))?void 0:e.removeEventListener)||s.call(e,"change",we(this,I)),we(this,O).forEach(t=>clearTimeout(t)),clearTimeout(we(this,K)),null==(a=we(this,M))||a.remove(),null==(l=we(this,c))||l.remove()}};t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,A=new WeakMap,x=new WeakMap,C=new WeakMap,M=new WeakMap,P=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,N=new WeakMap,O=new WeakMap,q=new WeakMap,I=new WeakMap,K=new WeakMap,j=new WeakSet,F=function(t){if(!t)return $e.get("typeflow")||null;if("string"==typeof t){const e=$e.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},U=function(t){if(!1===t)return Ae.get("instant");if(!t)return Ae.get("typeflow")||Ae.get("instant");if("string"==typeof t){const e=Ae.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
B=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
V=function(t){return t.tabs?ve(this,j,_).call(this,t.tabs):t.categories?ve(this,j,_).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
_=function(t){const e=t.map(t=>({id:t.id||ve(this,j,z).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?pe(de({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},z=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/** Returns a finite non-negative integer, or `fallback` for an invalid value. */
J=function(t,e){const i=Number(null!=t?t:e);return Number.isFinite(i)&&i>=0?Math.floor(i):e},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
Q=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
G=function(t){var e,i;me(this,u,t),t.some(t=>t.id===we(this,d))||("all"!==we(this,d)&&we(this,d)!==Le&&we(this,d)!==Ee&&console.warn(`HawkSearch: no tab with id "${we(this,d)}" (defaultTab); falling back to "all".`),me(this,d,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ve(this,j,Ct).call(this)},X=function(){ve(this,j,Y).call(this);const t=document.createElement("div");t.innerHTML=ve(this,j,et).call(this),me(this,M,t.firstElementChild),this.container.appendChild(we(this,M)),me(this,P,we(this,M).querySelector(".hawk-modal-input")),me(this,T,we(this,M).querySelector(".hawk-input-wrap")),me(this,L,we(this,M).querySelector(".hawk-input-ghost")),we(this,L)&&(we(this,L).textContent=this.rotatingPlaceholders[0],ve(this,j,se).call(this)),me(this,R,we(this,M).querySelector(".hawk-results-pane")),me(this,D,we(this,M).querySelector(".hawk-preview-pane")),me(this,H,we(this,M).querySelector(".hawk-discovery-row")),me(this,W,we(this,M).querySelector(".hawk-modal-filters")),me(this,N,we(this,M).querySelector(".hawk-modal-counter")),[we(this,R),we(this,D),we(this,W),we(this,H)].filter(Boolean).forEach(t=>ve(this,j,ie).call(this,t)),we(this,e)&&(we(this,e).apply(we(this,M)),Object.entries(we(this,e).tokens||{}).forEach(([t,e])=>{we(this,M).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(we(this,M).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(we(this,M).dataset.hawkReveal=this.revealAnimation,we(this,M).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(we(this,M).dataset.hawkResultsReveal=this.resultsRevealDirection,we(this,M).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&we(this,M).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&we(this,M).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&we(this,M).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&we(this,M).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),ve(this,j,it).call(this),ve(this,j,Wt).call(this,"empty"),we(this,p)&&ve(this,j,G).call(this,ve(this,j,pt).call(this,we(this,u)));const i=ve(this,j,St).call(this);this.enableSecondColumn&&i.url&&ve(this,j,$t).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),we(this,M).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),we(this,M).addEventListener("click",t=>{const e=t.target.closest(".hawk-density-btn");e&&we(this,M).contains(e)&&(this.setParams({density:e.dataset.density}),ve(this,j,at).call(this,e.dataset.density))}),we(this,P).addEventListener("input",()=>{ve(this,j,Lt).call(this,we(this,P).value),ve(this,j,se).call(this)}),we(this,P).addEventListener("keydown",t=>ve(this,j,Jt).call(this,t)),we(this,P).addEventListener("focus",()=>ve(this,j,mt).call(this),{once:!0}),we(this,R).addEventListener("keydown",t=>ve(this,j,Qt).call(this,t)),we(this,D).addEventListener("keydown",t=>ve(this,j,Gt).call(this,t)),we(this,D).addEventListener("focus",()=>{we(this,M).dataset.hawkShowPreview="true"}),we(this,D).addEventListener("blur",()=>{we(this,M).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ve(this,j,Xt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
Y=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ve(this,j,Z).call(this,i),we(this,e)&&(we(this,e).apply(s),Object.entries(we(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),me(this,c,s)},Z=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},tt=function(){if(!this.headerControls.density||!this.params.allowDensityToggle)return"";const t=this.strings,e={fit:t.densityFit,medium:t.densityMedium,compact:t.densityCompact};return`<div class="hawk-density-toggle" role="group" aria-label="${ve(this,j,Q).call(this,t.densityGroupLabel)}">${this.densityChoices.map(t=>`<button type="button" class="hawk-density-btn" data-density="${t}">${ve(this,j,Q).call(this,e[t])}</button>`).join("")}</div>`},et=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${ve(this,j,tt).call(this)}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${ve(this,j,Q).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},it=function(){var t,e;const i=we(this,M).querySelector(".hawk-density-toggle"),s=this.headerControls.density&&this.params.allowDensityToggle;i&&!s?(i.contains(document.activeElement)&&we(this,P).focus(),i.remove()):!i&&s&&we(this,M).querySelector(".hawk-input-wrap").insertAdjacentHTML("afterend",ve(this,j,tt).call(this));const{scale:n,position:a,offset:l,columns:r,breakpoint:h,density:o,verticalFit:c}=this.params;we(this,M).style.setProperty("--hawk-scale",String(n)),we(this,M).style.setProperty("--hawk-offset-x",ve(this,j,st).call(this,l.x)),we(this,M).style.setProperty("--hawk-offset-y",ve(this,j,st).call(this,l.y)),we(this,M).dataset.hawkPosition=a,we(this,M).dataset.hawkDensity=o,we(this,M).dataset.hawkVerticalFit=String(!0===c),we(this,M).dataset.hawkSecondColumn=String(this.enableSecondColumn),we(this,M).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?r:1),we(this,M).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===o;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),we(this,q)&&(null==(e=(t=we(this,q)).removeEventListener)||e.call(t,"change",we(this,I)),me(this,q,null)),"function"==typeof window.matchMedia&&(me(this,q,window.matchMedia(`(max-width: ${h}px)`)),me(this,I,()=>{we(this,M).dataset.hawkCompact=String(we(this,q).matches)}),we(this,q).addEventListener("change",we(this,I)),we(this,I).call(this))},st=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
nt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Te):null;return Pe.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
at=function(t){try{null==localStorage||localStorage.setItem(Te,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
lt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
rt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},ht=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
ot=function(t){if(!this.enableRecentlyViewed||!t||ve(this,j,Dt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};me(this,o,[e,...we(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ve(this,j,ht).call(this,we(this,o)),ve(this,j,G).call(this,ve(this,j,pt).call(this,ve(this,j,ct).call(this)))},ct=function(){return(we(this,u)||[]).filter(t=>t.id!==Le&&t.id!==Ee)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
ut=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},dt=function(t){return we(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
pt=function(t){const e=[];return this.enablePins&&we(this,h).some(t=>!ve(this,j,Dt).call(this,t.url))&&e.push({id:Le,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&we(this,o).some(t=>!ve(this,j,Dt).call(this,t.url))&&e.push({id:Ee,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
gt=function(t){const e=we(this,d)===Le;if(ve(this,j,dt).call(this,t.url))me(this,h,we(this,h).filter(e=>e.url!==t.url));else{if(!(we(this,h).length<this.maxPins))return;me(this,h,[...we(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ve(this,j,ut).call(this,we(this,h)),ve(this,j,G).call(this,ve(this,j,pt).call(this,ve(this,j,ct).call(this))),we(this,d)===Le?ve(this,j,ft).call(this):e?ve(this,j,Lt).call(this,we(this,s)):ve(this,j,Ht).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ft=function(){me(this,l,we(this,h).filter(t=>!ve(this,j,Dt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),me(this,r,new Set(we(this,l).map(t=>t.url.split("#")[0])).size),me(this,a,we(this,l).length?0:-1),ve(this,j,Ht).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
wt=function(){me(this,l,we(this,o).filter(t=>!ve(this,j,Dt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),me(this,r,new Set(we(this,l).map(t=>t.url.split("#")[0])).size),me(this,a,we(this,l).length?0:-1),ve(this,j,Ht).call(this)},yt=function(){var t;if(null==(t=navigator.connection)?void 0:t.saveData)return;const e=()=>{if(we(this,k))return;const t=()=>{me(this,v,null),this.preload()};if("function"==typeof window.requestIdleCallback){const e=window.requestIdleCallback(t,{timeout:2e3});me(this,v,()=>{var t;return null==(t=window.cancelIdleCallback)?void 0:t.call(window,e)})}else{const e=setTimeout(t,0);me(this,v,()=>clearTimeout(e))}};"complete"===document.readyState?e():(window.addEventListener("load",e,{once:!0}),me(this,v,()=>window.removeEventListener("load",e)))},mt=function(){return be(this,null,function*(){if(we(this,k))return null;if(we(this,f))return we(this,f);if(!we(this,w)){const t=we(this,m)?`?hawk-retry=${we(this,m)}`:"",e=we(this,C)?Promise.resolve(we(this,C)):import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js${t}`).catch(t=>{throw me(this,m,++xe),t});me(this,w,e.then(t=>be(this,null,function*(){return we(this,k)?null:(yield ve(this,j,vt).call(this,t,we(this,C)?{}:{basePath:this.indexBasePath}),we(this,k)?null:(me(this,b,null),me(this,f,t),yield ve(this,j,xt).call(this),we(this,k)?null:(yield ve(this,j,kt).call(this),t)))})).catch(t=>(we(this,k)||(me(this,f,null),me(this,b,t),ve(this,j,bt).call(this)),null)))}return we(this,w)})},vt=function(t){return be(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,de(de({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},kt=function(){return be(this,null,function*(){we(this,d)!==Le?we(this,d)!==Ee?this.eagerResults&&!we(this,s)&&(yield ve(this,j,Lt).call(this,"")):ve(this,j,wt).call(this):ve(this,j,ft).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
bt=function(){we(this,R).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,we(this,R).removeAttribute("aria-activedescendant"),we(this,N).textContent=this.strings.unavailableCounter,ve(this,j,Wt).call(this,"empty")},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
St=function(){const t=(we(this,u)||[]).find(t=>t.id===we(this,d));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
$t=function(t,e){if(t===we(this,A))return;ve(this,j,Ft).call(this),me(this,A,t),we(this,D).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=we(this,D).querySelector(".hawk-preview-title"),n=we(this,D).querySelector(".hawk-preview-content");me(this,S,we(this,i).typeTitle(s,e,{isAnchor:!1})),ve(this,j,Ut).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},At=function(){return be(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},xt=function(){return be(this,null,function*(){if(we(this,p))return;if(this.tabsUrl){const t=yield ve(this,j,At).call(this);if(t)return void ve(this,j,G).call(this,ve(this,j,pt).call(this,ve(this,j,_).call(this,t)))}if(!we(this,f))return void ve(this,j,G).call(this,ve(this,j,pt).call(this,ve(this,j,_).call(this,[])));let t=[];try{const e=yield we(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ve(this,j,G).call(this,ve(this,j,pt).call(this,ve(this,j,_).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},Ct=function(){const t=we(this,u)||[];we(this,W).innerHTML=t.map(t=>{const e=t.id===we(this,d),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(we(this,W).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ve(this,j,Mt).call(this,t),we(this,P).focus()}),t.addEventListener("keydown",t=>ve(this,j,Pt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
Mt=function(t){me(this,d,t.dataset.filter),we(this,W).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),we(this,d)===Le?(me(this,s,""),we(this,P).value="",ve(this,j,ft).call(this)):we(this,d)===Ee?(me(this,s,""),we(this,P).value="",ve(this,j,wt).call(this)):ve(this,j,Lt).call(this,we(this,s))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
Pt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ve(this,j,Mt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
Tt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},Lt=function(t){return be(this,null,function*(){var e;if(we(this,k))return;me(this,s,t),ve(this,j,Wt).call(this,"loading");const i=++ke(this,n)._;if(yield ve(this,j,mt).call(this),!we(this,f)||we(this,k))return;const a=(we(this,u)||[]).find(t=>t.id===we(this,d)),{filters:r,remainingQuery:h}=ve(this,j,Tt).call(this,t),o=(null==a?void 0:a.filter)||r?de(de({},(null==a?void 0:a.filter)||{}),r||{}):null,c=de(de(de({},this.pagefindOptions),(null==a?void 0:a.pagefindOptions)||{}),o?{filters:o}:{}),p=this.inlineFilters?h:t;let g;try{({results:g}=p.trim()?yield we(this,f).debouncedSearch(p,c):yield we(this,f).search(null,c))}catch(t){if(i!==we(this,n))return;return me(this,b,t),void ve(this,j,bt).call(this)}if(i!==we(this,n))return;const w=(g||[]).slice(0,this.maxCandidateResults),y=[];let m=-1;for(let t=0;t<w.length&&y.length<this.maxResults;t+=this.resultHydrationConcurrency){const s=w.slice(t,t+this.resultHydrationConcurrency);let a;try{a=yield Promise.all(s.map(t=>t.data()))}catch(t){if(i!==we(this,n))return;return me(this,b,t),void ve(this,j,bt).call(this)}if(i!==we(this,n))return;for(const t of a)if(!ve(this,j,Dt).call(this,t.url)){y.push({title:(null==(e=t.meta)?void 0:e.title)||this.strings.untitled,url:t.url,excerpt:t.excerpt,isAnchor:!1,meta:t.meta||{}});for(const e of t.sub_results||[])if(e.url!==t.url&&(y.push({title:e.title,url:e.url,excerpt:e.excerpt,isAnchor:!0,meta:t.meta||{}}),y.length>=this.maxResults))break;if(y.length>=this.maxResults)break}y.length&&y.length!==m&&(ve(this,j,Et).call(this,y),m=we(this,l).length)}i===we(this,n)&&m!==Math.min(y.length,this.maxResults)&&ve(this,j,Et).call(this,y)})},
/** Commits one ordered progressive search batch and updates every result-derived surface. */
Et=function(t){me(this,l,t.slice(0,this.maxResults)),me(this,r,new Set(we(this,l).map(t=>t.url.split("#")[0])).size),me(this,a,we(this,l).length?0:-1),ve(this,j,Ht).call(this)},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
Rt=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},Dt=function(t){return this.excludePages.has(ve(this,j,Rt).call(this,t))},Ht=function(){if(!we(this,l).length)return we(this,R).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ve(this,j,Q).call(this,we(this,s)))}</div>`,we(this,R).removeAttribute("aria-activedescendant"),we(this,N).textContent=we(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,ve(this,j,jt).call(this),void ve(this,j,Wt).call(this,"empty");we(this,N).textContent=we(this,s)?this.strings.matchingResults(we(this,l).length,we(this,r)):this.strings.entries(we(this,l).length,we(this,r)),we(this,R).innerHTML=we(this,l).map((t,e)=>{const i=this.enablePins&&ve(this,j,dt).call(this,t.url),s=Math.min(e,10),n=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===we(this,a)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===we(this,a)}" style="--hawk-row-index: ${s}${n}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${ve(this,j,It).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),we(this,R).setAttribute("aria-activedescendant",`${this.id}-result-${we(this,a)}`),we(this,R).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ve(this,j,Kt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ve(this,j,gt).call(this,we(this,l)[s]);ve(this,j,ot).call(this,we(this,l)[s]),null==(i=this.onSelect)||i.call(this,we(this,l)[s])})}),ve(this,j,jt).call(this),ve(this,j,Wt).call(this,"ready")},
/**
 * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
 * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
 */
Wt=function(t){if(!we(this,H)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(we(this,H).hidden=!0);if(we(this,H).hidden=!1,we(this,H).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(we(this,H).innerHTML=`<div class="hawk-discovery-status" role="status">${ve(this,j,Q).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:ve(this,j,Nt).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};we(this,H).innerHTML=e.map(([t,e])=>{const n=i[t].slice(0,e.maxItems),a=n.length?`<ul class="hawk-discovery-list">${n.map(t=>`\n              <li><a class="hawk-discovery-link" href="${ve(this,j,Q).call(this,ve(this,j,qt).call(this,t.url))}" aria-label="${ve(this,j,Q).call(this,`${t.label}: ${t.context}`)}">${ve(this,j,Q).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${ve(this,j,Q).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${ve(this,j,Q).call(this,e.label||s[t])}</h3>\n          ${a}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Nt=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of we(this,l)){const n=String(s.url||"").split("#")[0],a=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);n&&!i.pages.has(n)&&(i.pages.add(n),e.pages.push({label:a,context:a,url:n})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:a,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const n=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=n.toLocaleLowerCase();n&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:n,context:s.title||a,url:s.url}))}}return e},
/**
 * Formats a result date as relative time ("7 days ago", "last month") via the built-in
 * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
 * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
 * magnitude fits under. Falls back to the raw value for anything Date can't parse.
 */
Ot=function(e){const i=new Date(e);if(Number.isNaN(i.getTime()))return String(e);let s=(i.getTime()-Date.now())/1e3;const n=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:e,unit:i}of n){if(Math.abs(s)<e)return we(Ne,t).format(Math.round(s),i);s/=e}return String(e)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
qt=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},It=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",a=this.showResultTags&&!t.isAnchor,l=a?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);a&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!n&&!h.length)return"";const o=n&&"relative"===this.resultDateFormat?ve(this,j,Ot).call(this,n):String(n);return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${ve(this,j,Q).call(this,String(n))}">${ve(this,j,Q).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${ve(this,j,Q).call(this,t)}</span>`).join("")}</div></div>`},Kt=function(t,e){me(this,a,t),we(this,R).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),we(this,R).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ve(this,j,jt).call(this)},jt=function(){var t;if(!this.enableSecondColumn)return;const e=we(this,l)[we(this,a)];if(!e){const t=ve(this,j,St).call(this);return void(t.url?ve(this,j,$t).call(this,t.url,t.title):(ve(this,j,Ft).call(this),me(this,A,null),we(this,D).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===we(this,A))return;ve(this,j,Ft).call(this),me(this,A,s),we(this,D).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=we(this,D).querySelector(".hawk-preview-title"),r=we(this,D).querySelector(".hawk-preview-content");me(this,S,we(this,i).typeTitle(n,e.title,{isAnchor:e.isAnchor})),ve(this,j,Ut).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Ft=function(){we(this,i).stop(we(this,S)),we(this,i).stop(we(this,$)),me(this,S,null),me(this,$,null)},Ut=function(t,e,s){return be(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ve(this,j,_t).call(this,e);t.isAnchor&&i?n=ve(this,j,zt).call(this,s,i):this.previewSections?(a=ve(this,j,Bt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}we(this,A)===e&&(a&&a.length?ve(this,j,Vt).call(this,a,t,s):me(this,$,we(this,i).typeContent(s,n)))})},
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
Bt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
Vt=function(t,e,s){const n=e.url.split("#")[0],a=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const a=i.target.closest(".hawk-preview-section-row");if(!a)return;const l=a.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};ve(this,j,ot).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),me(this,$,we(this,i).typeContent(s,a))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
_t=function(t){if(we(this,x).has(t))return we(this,x).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw we(this,x).delete(t),e});return we(this,x).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
zt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Jt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),we(this,l).length&&ve(this,j,Kt).call(this,(we(this,a)+1)%we(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),we(this,l).length&&ve(this,j,Kt).call(this,(we(this,a)-1+we(this,l).length)%we(this,l).length,!0);else if("Enter"===t.key){const t=we(this,l)[we(this,a)];t&&(ve(this,j,ot).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Qt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),we(this,P).focus(),we(this,P).value+=t.key,void we(this,P).dispatchEvent(new Event("input"));ve(this,j,Jt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Gt=function(t){"ArrowDown"===t.key?(t.preventDefault(),we(this,D).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),we(this,D).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),we(this,D).scrollTop+=we(this,D).clientHeight):"PageUp"===t.key?(t.preventDefault(),we(this,D).scrollTop-=we(this,D).clientHeight):"Home"===t.key?(t.preventDefault(),we(this,D).scrollTop=0):"End"===t.key&&(t.preventDefault(),we(this,D).scrollTop=we(this,D).scrollHeight)},Xt=function(t){we(this,g)&&"Tab"===t.key&&ve(this,j,te).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),we(this,g)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&we(this,g)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the CSS
 * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
 * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
 * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
 * without depending on real rendering (and is testable under jsdom, which never renders).
 */
Yt=function(){if(!this.enableSecondColumn)return!1;return!("true"===we(this,M).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===we(this,M).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Zt=function(){var t;return[we(this,P),...this.headerControls.density?Array.from(we(this,M).querySelectorAll(".hawk-density-btn")):[],we(this,M).querySelector(".hawk-modal-esc"),we(this,W).querySelector('.hawk-filter-pill[tabindex="0"]'),we(this,R),...ve(this,j,Yt).call(this)?[we(this,D)]:[],...Array.from((null==(t=we(this,H))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
te=function(t){const e=ve(this,j,Zt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
ee=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
ie=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(we(this,O).get(t)),we(this,O).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
se=function(){if(!we(this,L))return;const t=we(this,g)&&!we(this,P).value;we(this,T).dataset.hawkInputActive=String(!t),t&&!we(this,E)?me(this,E,we(this,i).rotatePlaceholder(we(this,L),this.rotatingPlaceholders)):!t&&we(this,E)&&(we(this,i).stop(we(this,E)),me(this,E,null))},ge(Ne,"themes",$e),ge(Ne,"animations",Ae),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
ye(Ne,t,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let Oe=Ne;"undefined"!=typeof window&&(window.Hawk=Oe);export{Oe as HawkSearch,Oe as default};
//# sourceMappingURL=hawk.mjs.map
