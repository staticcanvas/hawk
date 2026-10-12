/*! hawk v0.43.6 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,r,h,o,c,u,d,p,g,f,w,y,m,v,k,b,S,$,A,x,C,M,P,T,L,E,R,D,H,W,N,O,q,I,K,F,U,j,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,at,nt,lt,rt,ht,ot,ct,ut,dt,pt,gt,ft,wt,yt,mt,vt,kt,bt,St,$t,At,xt,Ct,Mt,Pt,Tt,Lt,Et,Rt,Dt,Ht,Wt,Nt,Ot,qt,It,Kt,Ft,Ut,jt,Bt,Vt,_t,zt,Jt,Qt,Gt,Xt,Yt=Object.defineProperty,Zt=Object.defineProperties,te=Object.getOwnPropertyDescriptors,ee=Object.getOwnPropertySymbols,ie=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable,ae=t=>{throw TypeError(t)},ne=(t,e,i)=>e in t?Yt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,le=(t,e)=>{for(var i in e||(e={}))ie.call(e,i)&&ne(t,i,e[i]);if(ee)for(var i of ee(e))se.call(e,i)&&ne(t,i,e[i]);return t},re=(t,e)=>Zt(t,te(e)),he=(t,e,i)=>ne(t,"symbol"!=typeof e?e+"":e,i),oe=(t,e,i)=>e.has(t)||ae("Cannot "+i),ce=(t,e,i)=>(oe(t,e,"read from private field"),i?i.call(t):e.get(t)),ue=(t,e,i)=>e.has(t)?ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),de=(t,e,i,s)=>(oe(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),pe=(t,e,i)=>(oe(t,e,"access private method"),i),ge=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{r(i.next(t))}catch(t){a(t)}},l=t=>{try{r(i.throw(t))}catch(t){a(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);r((i=i.apply(t,e)).next())});const fe={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=fe);const we=new Map,ye=new Map;ye.set("instant",fe);const me=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],ve={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},ke=new Set(["fit","medium","compact"]),be="hawk:density",Se="pinned",$e="recently-viewed",Ae={open:!0,slash:!0,escape:!0},xe={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},Ce={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Me=0;const Pe=class{
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
constructor(t={}){var U,j,V,_,J,Q,G;if(ue(this,O),ue(this,e),ue(this,i),ue(this,s),ue(this,a),ue(this,n),ue(this,l),ue(this,r),ue(this,h),ue(this,o),ue(this,c),ue(this,u),ue(this,d),ue(this,p),ue(this,g),ue(this,f),ue(this,w),ue(this,y),ue(this,m),ue(this,v),ue(this,k),ue(this,b),ue(this,S),ue(this,$),ue(this,A),ue(this,x),ue(this,C),ue(this,M),ue(this,P),ue(this,T),ue(this,L),ue(this,E),ue(this,R),ue(this,D),ue(this,H),ue(this,W),ue(this,N),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Me+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,de(this,S,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const X=pe(this,O,Z).call(this);this.params=re(le(le(le({},ve),X?{density:X}:{}),t.params),{offset:le(le({},ve.offset),null==(U=t.params)?void 0:U.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=pe(this,O,B).call(this,t.maxResults,18),this.resultHydrationConcurrency=Math.max(1,pe(this,O,B).call(this,t.resultHydrationConcurrency,6)),this.maxCandidateResults=pe(this,O,B).call(this,t.maxCandidateResults,3*this.maxResults),this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):me,this.showSubpageConnector=!1!==t.showSubpageConnector;const Y=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==Y&&!1!==Y.density&&this.params.allowDensityToggle,escape:!1!==Y&&!1!==Y.escape};const tt=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(tt.map(t=>pe(this,O,Ct).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=t.maxPins)?j:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(V=t.maxRecentlyViewed)?V:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(_=t.previewSectionExcerptLength)?_:140,this.discoveryRow=pe(this,O,K).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=le(le({},Ae),t.hotkeys),this.strings=le(le({},Ce),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Q=null!=(J=t.revealDuration)?J:xe[this.revealAnimation])?Q:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(G=t.resultsRevealStagger)?G:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,de(this,e,pe(this,O,q).call(this,t.theme)),de(this,i,pe(this,O,I).call(this,t.animation)),de(this,s,""),de(this,a,0),de(this,n,-1),de(this,l,[]),de(this,r,0),de(this,h,this.enablePins?pe(this,O,et).call(this):[]),de(this,o,this.enableRecentlyViewed?pe(this,O,it).call(this):[]),de(this,d,t.defaultTab||"all"),de(this,u,pe(this,O,F).call(this,t)),de(this,p,null!==ce(this,u)),de(this,g,!1),de(this,f,null),de(this,w,null),de(this,y,null),de(this,m,null),de(this,v,null),de(this,k,null),de(this,b,new Map),de(this,D,new Map),this.container&&pe(this,O,z).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){we.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){ye.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ce(this,g),query:ce(this,s),selectedIndex:ce(this,n),matches:ce(this,l),pageCount:ce(this,r),pins:ce(this,h),recentlyViewed:ce(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:ce(this,d),error:ce(this,y)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=re(le(le({},this.params),t),{offset:le(le({},this.params.offset),null==t?void 0:t.offset)}),pe(this,O,X).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(ce(this,N)),delete ce(this,$).dataset.hawkAnimState,ce(this,$).hidden=!1,document.body.style.overflow="hidden",de(this,g,!0),pe(this,O,dt).call(this),pe(this,O,Xt).call(this),pe(this,O,Qt).call(this)&&(ce(this,$).dataset.hawkAnimState="opening",de(this,N,setTimeout(()=>{delete ce(this,$).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{ce(this,A).focus(),ce(this,A).select()},40),null==(t=this.onOpen)||t.call(this,ce(this,s))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",de(this,g,!1),pe(this,O,Xt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(ce(this,N)),pe(this,O,Qt).call(this)?(ce(this,$).dataset.hawkAnimState="closing",de(this,N,setTimeout(()=>{ce(this,$).hidden=!0,delete ce(this,$).dataset.hawkAnimState},this.revealDuration))):ce(this,$).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,a;pe(this,O,Nt).call(this),ce(this,M)&&ce(this,i).stop(ce(this,M)),null==(e=null==(t=ce(this,H))?void 0:t.removeEventListener)||e.call(t,"change",ce(this,W)),ce(this,D).forEach(t=>clearTimeout(t)),clearTimeout(ce(this,N)),null==(s=ce(this,$))||s.remove(),null==(a=ce(this,c))||a.remove()}};t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,A=new WeakMap,x=new WeakMap,C=new WeakMap,M=new WeakMap,P=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,N=new WeakMap,O=new WeakSet,q=function(t){if(!t)return we.get("typeflow")||null;if("string"==typeof t){const e=we.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},I=function(t){if(!1===t)return ye.get("instant");if(!t)return ye.get("typeflow")||ye.get("instant");if("string"==typeof t){const e=ye.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
K=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
F=function(t){return t.tabs?pe(this,O,U).call(this,t.tabs):t.categories?pe(this,O,U).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
U=function(t){const e=t.map(t=>({id:t.id||pe(this,O,j).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?re(le({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},j=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/** Returns a finite non-negative integer, or `fallback` for an invalid value. */
B=function(t,e){const i=Number(null!=t?t:e);return Number.isFinite(i)&&i>=0?Math.floor(i):e},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
V=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
_=function(t){var e,i;de(this,u,t),t.some(t=>t.id===ce(this,d))||("all"!==ce(this,d)&&ce(this,d)!==Se&&ce(this,d)!==$e&&console.warn(`HawkSearch: no tab with id "${ce(this,d)}" (defaultTab); falling back to "all".`),de(this,d,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),pe(this,O,kt).call(this)},z=function(){pe(this,O,J).call(this);const t=document.createElement("div");t.innerHTML=pe(this,O,G).call(this),de(this,$,t.firstElementChild),this.container.appendChild(ce(this,$)),de(this,A,ce(this,$).querySelector(".hawk-modal-input")),de(this,x,ce(this,$).querySelector(".hawk-input-wrap")),de(this,C,ce(this,$).querySelector(".hawk-input-ghost")),ce(this,C)&&(ce(this,C).textContent=this.rotatingPlaceholders[0],pe(this,O,Xt).call(this)),de(this,P,ce(this,$).querySelector(".hawk-results-pane")),de(this,T,ce(this,$).querySelector(".hawk-preview-pane")),de(this,L,ce(this,$).querySelector(".hawk-discovery-row")),de(this,E,ce(this,$).querySelector(".hawk-modal-filters")),de(this,R,ce(this,$).querySelector(".hawk-modal-counter")),[ce(this,P),ce(this,T),ce(this,E),ce(this,L)].filter(Boolean).forEach(t=>pe(this,O,Gt).call(this,t)),ce(this,e)&&(ce(this,e).apply(ce(this,$)),Object.entries(ce(this,e).tokens||{}).forEach(([t,e])=>{ce(this,$).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(ce(this,$).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(ce(this,$).dataset.hawkReveal=this.revealAnimation,ce(this,$).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(ce(this,$).dataset.hawkResultsReveal=this.resultsRevealDirection,ce(this,$).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&ce(this,$).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&ce(this,$).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&ce(this,$).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&ce(this,$).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),pe(this,O,X).call(this),pe(this,O,Tt).call(this,"empty"),ce(this,p)&&pe(this,O,_).call(this,pe(this,O,ht).call(this,ce(this,u)));const i=pe(this,O,wt).call(this);this.enableSecondColumn&&i.url&&pe(this,O,yt).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ce(this,$).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ce(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),pe(this,O,tt).call(this,t.dataset.density)})}),ce(this,A).addEventListener("input",()=>{pe(this,O,At).call(this,ce(this,A).value),pe(this,O,Xt).call(this)}),ce(this,A).addEventListener("keydown",t=>pe(this,O,Ut).call(this,t)),ce(this,A).addEventListener("focus",()=>pe(this,O,dt).call(this),{once:!0}),ce(this,P).addEventListener("keydown",t=>pe(this,O,jt).call(this,t)),ce(this,T).addEventListener("keydown",t=>pe(this,O,Bt).call(this,t)),ce(this,T).addEventListener("focus",()=>{ce(this,$).dataset.hawkShowPreview="true"}),ce(this,T).addEventListener("blur",()=>{ce(this,$).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>pe(this,O,Vt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
J=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=pe(this,O,Q).call(this,i),ce(this,e)&&(ce(this,e).apply(s),Object.entries(ce(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),de(this,c,s)},Q=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const a=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${a}`},G=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${pe(this,O,V).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},X=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:r,verticalFit:h}=this.params;ce(this,$).style.setProperty("--hawk-scale",String(i)),ce(this,$).style.setProperty("--hawk-offset-x",pe(this,O,Y).call(this,a.x)),ce(this,$).style.setProperty("--hawk-offset-y",pe(this,O,Y).call(this,a.y)),ce(this,$).dataset.hawkPosition=s,ce(this,$).dataset.hawkDensity=r,ce(this,$).dataset.hawkVerticalFit=String(!0===h),ce(this,$).dataset.hawkSecondColumn=String(this.enableSecondColumn),ce(this,$).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?n:1),ce(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ce(this,H)&&(null==(e=(t=ce(this,H)).removeEventListener)||e.call(t,"change",ce(this,W)),de(this,H,null)),"function"==typeof window.matchMedia&&(de(this,H,window.matchMedia(`(max-width: ${l}px)`)),de(this,W,()=>{ce(this,$).dataset.hawkCompact=String(ce(this,H).matches)}),ce(this,H).addEventListener("change",ce(this,W)),ce(this,W).call(this))},Y=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
Z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(be):null;return ke.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
tt=function(t){try{null==localStorage||localStorage.setItem(be,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
et=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
it=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},st=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
at=function(t){if(!this.enableRecentlyViewed||!t||pe(this,O,Mt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};de(this,o,[e,...ce(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),pe(this,O,st).call(this,ce(this,o)),pe(this,O,_).call(this,pe(this,O,ht).call(this,pe(this,O,nt).call(this)))},nt=function(){return(ce(this,u)||[]).filter(t=>t.id!==Se&&t.id!==$e)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
lt=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},rt=function(t){return ce(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
ht=function(t){const e=[];return this.enablePins&&ce(this,h).some(t=>!pe(this,O,Mt).call(this,t.url))&&e.push({id:Se,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&ce(this,o).some(t=>!pe(this,O,Mt).call(this,t.url))&&e.push({id:$e,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
ot=function(t){const e=ce(this,d)===Se;if(pe(this,O,rt).call(this,t.url))de(this,h,ce(this,h).filter(e=>e.url!==t.url));else{if(!(ce(this,h).length<this.maxPins))return;de(this,h,[...ce(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}pe(this,O,lt).call(this,ce(this,h)),pe(this,O,_).call(this,pe(this,O,ht).call(this,pe(this,O,nt).call(this))),ce(this,d)===Se?pe(this,O,ct).call(this):e?pe(this,O,At).call(this,ce(this,s)):pe(this,O,Pt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ct=function(){de(this,l,ce(this,h).filter(t=>!pe(this,O,Mt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),de(this,r,new Set(ce(this,l).map(t=>t.url.split("#")[0])).size),de(this,n,ce(this,l).length?0:-1),pe(this,O,Pt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ut=function(){de(this,l,ce(this,o).filter(t=>!pe(this,O,Mt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),de(this,r,new Set(ce(this,l).map(t=>t.url.split("#")[0])).size),de(this,n,ce(this,l).length?0:-1),pe(this,O,Pt).call(this)},dt=function(){return ge(this,null,function*(){return ce(this,f)?ce(this,f):ce(this,S)?(de(this,f,ce(this,S)),yield pe(this,O,pt).call(this,ce(this,f)),yield pe(this,O,vt).call(this),yield pe(this,O,gt).call(this),ce(this,f)):(ce(this,w)||de(this,w,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>ge(this,null,function*(){return yield pe(this,O,pt).call(this,t,{basePath:this.indexBasePath}),de(this,f,t),yield pe(this,O,vt).call(this),yield pe(this,O,gt).call(this),t})).catch(t=>(de(this,y,t),pe(this,O,ft).call(this),null))),ce(this,w))})},pt=function(t){return ge(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,le(le({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},gt=function(){return ge(this,null,function*(){ce(this,d)!==Se?ce(this,d)!==$e?this.eagerResults&&!ce(this,s)&&(yield pe(this,O,At).call(this,"")):pe(this,O,ut).call(this):pe(this,O,ct).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
ft=function(){ce(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,ce(this,P).removeAttribute("aria-activedescendant"),ce(this,R).textContent=this.strings.unavailableCounter,pe(this,O,Tt).call(this,"empty")},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
wt=function(){const t=(ce(this,u)||[]).find(t=>t.id===ce(this,d));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
yt=function(t,e){if(t===ce(this,k))return;pe(this,O,Nt).call(this),de(this,k,t),ce(this,T).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=ce(this,T).querySelector(".hawk-preview-title"),a=ce(this,T).querySelector(".hawk-preview-content");de(this,m,ce(this,i).typeTitle(s,e,{isAnchor:!1})),pe(this,O,Ot).call(this,{url:t,excerpt:"",isAnchor:!1},t,a)},mt=function(){return ge(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},vt=function(){return ge(this,null,function*(){if(ce(this,p))return;if(this.tabsUrl){const t=yield pe(this,O,mt).call(this);if(t)return void pe(this,O,_).call(this,pe(this,O,ht).call(this,pe(this,O,U).call(this,t)))}if(!ce(this,f))return void pe(this,O,_).call(this,pe(this,O,ht).call(this,pe(this,O,U).call(this,[])));let t=[];try{const e=yield ce(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}pe(this,O,_).call(this,pe(this,O,ht).call(this,pe(this,O,U).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},kt=function(){const t=ce(this,u)||[];ce(this,E).innerHTML=t.map(t=>{const e=t.id===ce(this,d),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(ce(this,E).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{pe(this,O,bt).call(this,t),ce(this,A).focus()}),t.addEventListener("keydown",t=>pe(this,O,St).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
bt=function(t){de(this,d,t.dataset.filter),ce(this,E).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ce(this,d)===Se?(de(this,s,""),ce(this,A).value="",pe(this,O,ct).call(this)):ce(this,d)===$e?(de(this,s,""),ce(this,A).value="",pe(this,O,ut).call(this)):pe(this,O,At).call(this,ce(this,s))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
St=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),pe(this,O,bt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
$t=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const a=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=a:Array.isArray(e[i])?e[i].push(a):e[i]=[e[i],a],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},At=function(t){return ge(this,null,function*(){var e;de(this,s,t),pe(this,O,Tt).call(this,"loading");const i=++(n=this,r=a,{set _(t){de(n,r,t,h)},get _(){return ce(n,r,o)}})._;var n,r,h,o;if(yield pe(this,O,dt).call(this),!ce(this,f))return;const c=(ce(this,u)||[]).find(t=>t.id===ce(this,d)),{filters:p,remainingQuery:g}=pe(this,O,$t).call(this,t),w=(null==c?void 0:c.filter)||p?le(le({},(null==c?void 0:c.filter)||{}),p||{}):null,m=le(le(le({},this.pagefindOptions),(null==c?void 0:c.pagefindOptions)||{}),w?{filters:w}:{}),v=this.inlineFilters?g:t;let k;try{({results:k}=v.trim()?yield ce(this,f).debouncedSearch(v,m):yield ce(this,f).search(null,m))}catch(t){if(i!==ce(this,a))return;return de(this,y,t),void pe(this,O,ft).call(this)}if(i!==ce(this,a))return;const b=(k||[]).slice(0,this.maxCandidateResults),S=[];let $=-1;for(let t=0;t<b.length&&S.length<this.maxResults;t+=this.resultHydrationConcurrency){const s=b.slice(t,t+this.resultHydrationConcurrency);let n;try{n=yield Promise.all(s.map(t=>t.data()))}catch(t){if(i!==ce(this,a))return;return de(this,y,t),void pe(this,O,ft).call(this)}if(i!==ce(this,a))return;for(const t of n)if(!pe(this,O,Mt).call(this,t.url)){S.push({title:(null==(e=t.meta)?void 0:e.title)||this.strings.untitled,url:t.url,excerpt:t.excerpt,isAnchor:!1,meta:t.meta||{}});for(const e of t.sub_results||[])if(e.url!==t.url&&(S.push({title:e.title,url:e.url,excerpt:e.excerpt,isAnchor:!0,meta:t.meta||{}}),S.length>=this.maxResults))break;if(S.length>=this.maxResults)break}S.length&&S.length!==$&&(pe(this,O,xt).call(this,S),$=ce(this,l).length)}i===ce(this,a)&&$!==Math.min(S.length,this.maxResults)&&pe(this,O,xt).call(this,S)})},
/** Commits one ordered progressive search batch and updates every result-derived surface. */
xt=function(t){de(this,l,t.slice(0,this.maxResults)),de(this,r,new Set(ce(this,l).map(t=>t.url.split("#")[0])).size),de(this,n,ce(this,l).length?0:-1),pe(this,O,Pt).call(this)},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
Ct=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},Mt=function(t){return this.excludePages.has(pe(this,O,Ct).call(this,t))},Pt=function(){if(!ce(this,l).length)return ce(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(pe(this,O,V).call(this,ce(this,s)))}</div>`,ce(this,P).removeAttribute("aria-activedescendant"),ce(this,R).textContent=ce(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,pe(this,O,Wt).call(this),void pe(this,O,Tt).call(this,"empty");ce(this,R).textContent=ce(this,s)?this.strings.matchingResults(ce(this,l).length,ce(this,r)):this.strings.entries(ce(this,l).length,ce(this,r)),ce(this,P).innerHTML=ce(this,l).map((t,e)=>{const i=this.enablePins&&pe(this,O,rt).call(this,t.url),s=Math.min(e,10),a=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===ce(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===ce(this,n)}" style="--hawk-row-index: ${s}${a}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${pe(this,O,Dt).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),ce(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${ce(this,n)}`),ce(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>pe(this,O,Ht).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void pe(this,O,ot).call(this,ce(this,l)[s]);pe(this,O,at).call(this,ce(this,l)[s]),null==(i=this.onSelect)||i.call(this,ce(this,l)[s])})}),pe(this,O,Wt).call(this),pe(this,O,Tt).call(this,"ready")},
/**
 * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
 * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
 */
Tt=function(t){if(!ce(this,L)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(ce(this,L).hidden=!0);if(ce(this,L).hidden=!1,ce(this,L).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(ce(this,L).innerHTML=`<div class="hawk-discovery-status" role="status">${pe(this,O,V).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:pe(this,O,Lt).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};ce(this,L).innerHTML=e.map(([t,e])=>{const a=i[t].slice(0,e.maxItems),n=a.length?`<ul class="hawk-discovery-list">${a.map(t=>`\n              <li><a class="hawk-discovery-link" href="${pe(this,O,V).call(this,pe(this,O,Rt).call(this,t.url))}" aria-label="${pe(this,O,V).call(this,`${t.label}: ${t.context}`)}">${pe(this,O,V).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${pe(this,O,V).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${pe(this,O,V).call(this,e.label||s[t])}</h3>\n          ${n}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Lt=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of ce(this,l)){const a=String(s.url||"").split("#")[0],n=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);a&&!i.pages.has(a)&&(i.pages.add(a),e.pages.push({label:n,context:n,url:a})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:n,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const a=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=a.toLocaleLowerCase();a&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:a,context:s.title||n,url:s.url}))}}return e},
/**
 * Formats a result date as relative time ("7 days ago", "last month") via the built-in
 * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
 * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
 * magnitude fits under. Falls back to the raw value for anything Date can't parse.
 */
Et=function(e){const i=new Date(e);if(Number.isNaN(i.getTime()))return String(e);let s=(i.getTime()-Date.now())/1e3;const a=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:e,unit:i}of a){if(Math.abs(s)<e)return ce(Pe,t).format(Math.round(s),i);s/=e}return String(e)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Rt=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},Dt=function(t){var e,i,s;const a=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",n=this.showResultTags&&!t.isAnchor,l=n?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);n&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!a&&!h.length)return"";const o=a&&"relative"===this.resultDateFormat?pe(this,O,Et).call(this,a):String(a);return`<div class="hawk-result-meta">${a?`<time class="hawk-result-date" datetime="${pe(this,O,V).call(this,String(a))}">${pe(this,O,V).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${pe(this,O,V).call(this,t)}</span>`).join("")}</div></div>`},Ht=function(t,e){de(this,n,t),ce(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),ce(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),pe(this,O,Wt).call(this)},Wt=function(){var t;if(!this.enableSecondColumn)return;const e=ce(this,l)[ce(this,n)];if(!e){const t=pe(this,O,wt).call(this);return void(t.url?pe(this,O,yt).call(this,t.url,t.title):(pe(this,O,Nt).call(this),de(this,k,null),ce(this,T).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===ce(this,k))return;pe(this,O,Nt).call(this),de(this,k,s),ce(this,T).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const a=ce(this,T).querySelector(".hawk-preview-title"),r=ce(this,T).querySelector(".hawk-preview-content");de(this,m,ce(this,i).typeTitle(a,e.title,{isAnchor:e.isAnchor})),pe(this,O,Ot).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Nt=function(){ce(this,i).stop(ce(this,m)),ce(this,i).stop(ce(this,v)),de(this,m,null),de(this,v,null)},Ot=function(t,e,s){return ge(this,null,function*(){let a=t.excerpt||"",n=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield pe(this,O,Kt).call(this,e);t.isAnchor&&i?a=pe(this,O,Ft).call(this,s,i):this.previewSections?(n=pe(this,O,qt).call(this,s),n.length||(a=s.innerHTML)):a=s.innerHTML}catch(e){a=t.excerpt||""}ce(this,k)===e&&(n&&n.length?pe(this,O,It).call(this,n,t,s):de(this,v,ce(this,i).typeContent(s,a)))})},
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
qt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
It=function(t,e,s){const a=e.url.split("#")[0],n=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${a}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const n=i.target.closest(".hawk-preview-section-row");if(!n)return;const l=n.getAttribute("href"),r=t.find(t=>`${a}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};pe(this,O,at).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),de(this,v,ce(this,i).typeContent(s,n))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
Kt=function(t){if(ce(this,b).has(t))return ce(this,b).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ce(this,b).delete(t),e});return ce(this,b).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
Ft=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Ut=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ce(this,l).length&&pe(this,O,Ht).call(this,(ce(this,n)+1)%ce(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ce(this,l).length&&pe(this,O,Ht).call(this,(ce(this,n)-1+ce(this,l).length)%ce(this,l).length,!0);else if("Enter"===t.key){const t=ce(this,l)[ce(this,n)];t&&(pe(this,O,at).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
jt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),ce(this,A).focus(),ce(this,A).value+=t.key,void ce(this,A).dispatchEvent(new Event("input"));pe(this,O,Ut).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Bt=function(t){"ArrowDown"===t.key?(t.preventDefault(),ce(this,T).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),ce(this,T).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),ce(this,T).scrollTop+=ce(this,T).clientHeight):"PageUp"===t.key?(t.preventDefault(),ce(this,T).scrollTop-=ce(this,T).clientHeight):"Home"===t.key?(t.preventDefault(),ce(this,T).scrollTop=0):"End"===t.key&&(t.preventDefault(),ce(this,T).scrollTop=ce(this,T).scrollHeight)},Vt=function(t){ce(this,g)&&"Tab"===t.key&&pe(this,O,Jt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ce(this,g)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ce(this,g)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the CSS
 * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
 * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
 * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
 * without depending on real rendering (and is testable under jsdom, which never renders).
 */
_t=function(){if(!this.enableSecondColumn)return!1;return!("true"===ce(this,$).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===ce(this,$).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
zt=function(){var t;return[ce(this,A),...this.headerControls.density?Array.from(ce(this,$).querySelectorAll(".hawk-density-btn")):[],ce(this,$).querySelector(".hawk-modal-esc"),ce(this,E).querySelector('.hawk-filter-pill[tabindex="0"]'),ce(this,P),...pe(this,O,_t).call(this)?[ce(this,T)]:[],...Array.from((null==(t=ce(this,L))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
Jt=function(t){const e=pe(this,O,zt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
Qt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Gt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(ce(this,D).get(t)),ce(this,D).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
Xt=function(){if(!ce(this,C))return;const t=ce(this,g)&&!ce(this,A).value;ce(this,x).dataset.hawkInputActive=String(!t),t&&!ce(this,M)?de(this,M,ce(this,i).rotatePlaceholder(ce(this,C),this.rotatingPlaceholders)):!t&&ce(this,M)&&(ce(this,i).stop(ce(this,M)),de(this,M,null))},he(Pe,"themes",we),he(Pe,"animations",ye),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
ue(Pe,t,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let Te=Pe;"undefined"!=typeof window&&(window.Hawk=Te);export{Te as HawkSearch,Te as default};
//# sourceMappingURL=hawk.esm.js.map
