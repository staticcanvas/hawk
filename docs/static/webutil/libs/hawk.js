/*! hawk v0.43.6 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,u,d,p,g,f,w,y,m,v,k,b,S,$,x,A,M,C,P,T,L,E,R,D,H,W,O,N,q,I,K,j,F,U,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,ut,dt,pt,gt,ft,wt,yt,mt,vt,kt,bt,St,$t,xt,At,Mt,Ct,Pt,Tt,Lt,Et,Rt,Dt,Ht,Wt,Ot,Nt,qt,It,Kt,jt,Ft,Ut,Bt,Vt,_t,zt,Jt,Qt,Gt,Xt,Yt,Zt=Object.defineProperty,te=Object.defineProperties,ee=Object.getOwnPropertyDescriptors,ie=Object.getOwnPropertySymbols,se=Object.prototype.hasOwnProperty,ne=Object.prototype.propertyIsEnumerable,ae=t=>{throw TypeError(t)},le=(t,e,i)=>e in t?Zt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,re=(t,e)=>{for(var i in e||(e={}))se.call(e,i)&&le(t,i,e[i]);if(ie)for(var i of ie(e))ne.call(e,i)&&le(t,i,e[i]);return t},he=(t,e)=>te(t,ee(e)),oe=(t,e,i)=>le(t,"symbol"!=typeof e?e+"":e,i),ce=(t,e,i)=>e.has(t)||ae("Cannot "+i),ue=(t,e,i)=>(ce(t,e,"read from private field"),i?i.call(t):e.get(t)),de=(t,e,i)=>e.has(t)?ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),pe=(t,e,i,s)=>(ce(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ge=(t,e,i)=>(ce(t,e,"access private method"),i),fe=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const we={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=we);const ye=new Map,me=new Map;me.set("instant",we);const ve=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],ke={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},be=new Set(["fit","medium","compact"]),Se="hawk:density",$e="pinned",xe="recently-viewed",Ae={open:!0,slash:!0,escape:!0},Me={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},Ce={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Pe=0;const Te=class{
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
constructor(t={}){var e,U,B,_,z,Q,G;if(de(this,q),de(this,i),de(this,s),de(this,n),de(this,a),de(this,l),de(this,r),de(this,h),de(this,o),de(this,c),de(this,u),de(this,d),de(this,p),de(this,g),de(this,f),de(this,w),de(this,y),de(this,m),de(this,v),de(this,k),de(this,b),de(this,S),de(this,$),de(this,x),de(this,A),de(this,M),de(this,C),de(this,P),de(this,T),de(this,L),de(this,E),de(this,R),de(this,D),de(this,H),de(this,W),de(this,O),de(this,N),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Pe+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,pe(this,$,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const X=ge(this,q,tt).call(this);this.params=he(re(re(re({},ke),X?{density:X}:{}),t.params),{offset:re(re({},ke.offset),null==(e=t.params)?void 0:e.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=ge(this,q,V).call(this,t.maxResults,18),this.resultHydrationConcurrency=Math.max(1,ge(this,q,V).call(this,t.resultHydrationConcurrency,6)),this.maxCandidateResults=ge(this,q,V).call(this,t.maxCandidateResults,3*this.maxResults),this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):ve,this.showSubpageConnector=!1!==t.showSubpageConnector;const Y=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==Y&&!1!==Y.density&&this.params.allowDensityToggle,escape:!1!==Y&&!1!==Y.escape};const Z=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(Z.map(t=>ge(this,q,Ct).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(U=t.maxPins)?U:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(B=t.maxRecentlyViewed)?B:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(_=t.previewSectionExcerptLength)?_:140,this.discoveryRow=ge(this,q,j).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=re(re({},Ae),t.hotkeys),this.strings=re(re({},Ce),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Q=null!=(z=t.revealDuration)?z:Me[this.revealAnimation])?Q:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(G=t.resultsRevealStagger)?G:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,pe(this,i,ge(this,q,I).call(this,t.theme)),pe(this,s,ge(this,q,K).call(this,t.animation)),pe(this,n,""),pe(this,a,0),pe(this,l,-1),pe(this,r,[]),pe(this,h,0),pe(this,o,this.enablePins?ge(this,q,it).call(this):[]),pe(this,c,this.enableRecentlyViewed?ge(this,q,st).call(this):[]),pe(this,p,t.defaultTab||"all"),pe(this,d,ge(this,q,F).call(this,t)),pe(this,g,null!==ue(this,d)),pe(this,f,!1),pe(this,w,null),pe(this,y,null),pe(this,m,null),pe(this,v,null),pe(this,k,null),pe(this,b,null),pe(this,S,new Map),pe(this,H,new Map),this.container&&ge(this,q,J).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){ye.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){me.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ue(this,f),query:ue(this,n),selectedIndex:ue(this,l),matches:ue(this,r),pageCount:ue(this,h),pins:ue(this,o),recentlyViewed:ue(this,c),secondColumnEnabled:this.enableSecondColumn,activeTab:ue(this,p),error:ue(this,m)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=he(re(re({},this.params),t),{offset:re(re({},this.params.offset),null==t?void 0:t.offset)}),ge(this,q,Y).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(ue(this,N)),delete ue(this,x).dataset.hawkAnimState,ue(this,x).hidden=!1,document.body.style.overflow="hidden",pe(this,f,!0),ge(this,q,pt).call(this),ge(this,q,Yt).call(this),ge(this,q,Gt).call(this)&&(ue(this,x).dataset.hawkAnimState="opening",pe(this,N,setTimeout(()=>{delete ue(this,x).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{ue(this,A).focus(),ue(this,A).select()},40),null==(t=this.onOpen)||t.call(this,ue(this,n))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",pe(this,f,!1),ge(this,q,Yt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(ue(this,N)),ge(this,q,Gt).call(this)?(ue(this,x).dataset.hawkAnimState="closing",pe(this,N,setTimeout(()=>{ue(this,x).hidden=!0,delete ue(this,x).dataset.hawkAnimState},this.revealDuration))):ue(this,x).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,i,n;ge(this,q,Nt).call(this),ue(this,P)&&ue(this,s).stop(ue(this,P)),null==(e=null==(t=ue(this,W))?void 0:t.removeEventListener)||e.call(t,"change",ue(this,O)),ue(this,H).forEach(t=>clearTimeout(t)),clearTimeout(ue(this,N)),null==(i=ue(this,x))||i.remove(),null==(n=ue(this,u))||n.remove()}};e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,M=new WeakMap,C=new WeakMap,P=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,O=new WeakMap,N=new WeakMap,q=new WeakSet,I=function(t){if(!t)return ye.get("typeflow")||null;if("string"==typeof t){const e=ye.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},K=function(t){if(!1===t)return me.get("instant");if(!t)return me.get("typeflow")||me.get("instant");if("string"==typeof t){const e=me.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
j=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
F=function(t){return t.tabs?ge(this,q,U).call(this,t.tabs):t.categories?ge(this,q,U).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
U=function(t){const e=t.map(t=>({id:t.id||ge(this,q,B).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?he(re({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},B=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/** Returns a finite non-negative integer, or `fallback` for an invalid value. */
V=function(t,e){const i=Number(null!=t?t:e);return Number.isFinite(i)&&i>=0?Math.floor(i):e},
/**
   * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
   * fetched-page-content trust boundary documented for the preview pane (that content is the
   * site's own already-built output, deliberately not sanitized) — a typed query is visitor
   * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
   * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
   * `config.strings.noResults` override too, not just the default.
   */
_=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
z=function(t){var e,i;pe(this,d,t),t.some(t=>t.id===ue(this,p))||("all"!==ue(this,p)&&ue(this,p)!==$e&&ue(this,p)!==xe&&console.warn(`HawkSearch: no tab with id "${ue(this,p)}" (defaultTab); falling back to "all".`),pe(this,p,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ge(this,q,bt).call(this)},J=function(){ge(this,q,Q).call(this);const t=document.createElement("div");t.innerHTML=ge(this,q,X).call(this),pe(this,x,t.firstElementChild),this.container.appendChild(ue(this,x)),pe(this,A,ue(this,x).querySelector(".hawk-modal-input")),pe(this,M,ue(this,x).querySelector(".hawk-input-wrap")),pe(this,C,ue(this,x).querySelector(".hawk-input-ghost")),ue(this,C)&&(ue(this,C).textContent=this.rotatingPlaceholders[0],ge(this,q,Yt).call(this)),pe(this,T,ue(this,x).querySelector(".hawk-results-pane")),pe(this,L,ue(this,x).querySelector(".hawk-preview-pane")),pe(this,E,ue(this,x).querySelector(".hawk-discovery-row")),pe(this,R,ue(this,x).querySelector(".hawk-modal-filters")),pe(this,D,ue(this,x).querySelector(".hawk-modal-counter")),[ue(this,T),ue(this,L),ue(this,R),ue(this,E)].filter(Boolean).forEach(t=>ge(this,q,Xt).call(this,t)),ue(this,i)&&(ue(this,i).apply(ue(this,x)),Object.entries(ue(this,i).tokens||{}).forEach(([t,e])=>{ue(this,x).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(ue(this,x).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(ue(this,x).dataset.hawkReveal=this.revealAnimation,ue(this,x).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(ue(this,x).dataset.hawkResultsReveal=this.resultsRevealDirection,ue(this,x).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&ue(this,x).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&ue(this,x).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&ue(this,x).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&ue(this,x).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),ge(this,q,Y).call(this),ge(this,q,Lt).call(this,"empty"),ue(this,g)&&ge(this,q,z).call(this,ge(this,q,ot).call(this,ue(this,d)));const e=ge(this,q,yt).call(this);this.enableSecondColumn&&e.url&&ge(this,q,mt).call(this,e.url,e.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ue(this,x).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ue(this,x).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ge(this,q,et).call(this,t.dataset.density)})}),ue(this,A).addEventListener("input",()=>{ge(this,q,At).call(this,ue(this,A).value),ge(this,q,Yt).call(this)}),ue(this,A).addEventListener("keydown",t=>ge(this,q,Ut).call(this,t)),ue(this,A).addEventListener("focus",()=>ge(this,q,pt).call(this),{once:!0}),ue(this,T).addEventListener("keydown",t=>ge(this,q,Bt).call(this,t)),ue(this,L).addEventListener("keydown",t=>ge(this,q,Vt).call(this,t)),ue(this,L).addEventListener("focus",()=>{ue(this,x).dataset.hawkShowPreview="true"}),ue(this,L).addEventListener("blur",()=>{ue(this,x).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ge(this,q,_t).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
Q=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const e=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${e}`,s.setAttribute("data-search-trigger",""),"minimal"===e&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ge(this,q,G).call(this,e),ue(this,i)&&(ue(this,i).apply(s),Object.entries(ue(this,i).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),pe(this,u,s)},G=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},X=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${ge(this,q,_).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},Y=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r,verticalFit:h}=this.params;ue(this,x).style.setProperty("--hawk-scale",String(i)),ue(this,x).style.setProperty("--hawk-offset-x",ge(this,q,Z).call(this,n.x)),ue(this,x).style.setProperty("--hawk-offset-y",ge(this,q,Z).call(this,n.y)),ue(this,x).dataset.hawkPosition=s,ue(this,x).dataset.hawkDensity=r,ue(this,x).dataset.hawkVerticalFit=String(!0===h),ue(this,x).dataset.hawkSecondColumn=String(this.enableSecondColumn),ue(this,x).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?a:1),ue(this,x).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ue(this,W)&&(null==(e=(t=ue(this,W)).removeEventListener)||e.call(t,"change",ue(this,O)),pe(this,W,null)),"function"==typeof window.matchMedia&&(pe(this,W,window.matchMedia(`(max-width: ${l}px)`)),pe(this,O,()=>{ue(this,x).dataset.hawkCompact=String(ue(this,W).matches)}),ue(this,W).addEventListener("change",ue(this,O)),ue(this,O).call(this))},Z=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
tt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Se):null;return be.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
et=function(t){try{null==localStorage||localStorage.setItem(Se,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
it=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
st=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},nt=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
at=function(t){if(!this.enableRecentlyViewed||!t||ge(this,q,Pt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};pe(this,c,[e,...ue(this,c).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ge(this,q,nt).call(this,ue(this,c)),ge(this,q,z).call(this,ge(this,q,ot).call(this,ge(this,q,lt).call(this)))},lt=function(){return(ue(this,d)||[]).filter(t=>t.id!==$e&&t.id!==xe)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
rt=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},ht=function(t){return ue(this,o).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
ot=function(t){const e=[];return this.enablePins&&ue(this,o).some(t=>!ge(this,q,Pt).call(this,t.url))&&e.push({id:$e,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&ue(this,c).some(t=>!ge(this,q,Pt).call(this,t.url))&&e.push({id:xe,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
ct=function(t){const e=ue(this,p)===$e;if(ge(this,q,ht).call(this,t.url))pe(this,o,ue(this,o).filter(e=>e.url!==t.url));else{if(!(ue(this,o).length<this.maxPins))return;pe(this,o,[...ue(this,o),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ge(this,q,rt).call(this,ue(this,o)),ge(this,q,z).call(this,ge(this,q,ot).call(this,ge(this,q,lt).call(this))),ue(this,p)===$e?ge(this,q,ut).call(this):e?ge(this,q,At).call(this,ue(this,n)):ge(this,q,Tt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ut=function(){pe(this,r,ue(this,o).filter(t=>!ge(this,q,Pt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),pe(this,h,new Set(ue(this,r).map(t=>t.url.split("#")[0])).size),pe(this,l,ue(this,r).length?0:-1),ge(this,q,Tt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
dt=function(){pe(this,r,ue(this,c).filter(t=>!ge(this,q,Pt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),pe(this,h,new Set(ue(this,r).map(t=>t.url.split("#")[0])).size),pe(this,l,ue(this,r).length?0:-1),ge(this,q,Tt).call(this)},pt=function(){return fe(this,null,function*(){return ue(this,w)?ue(this,w):ue(this,$)?(pe(this,w,ue(this,$)),yield ge(this,q,gt).call(this,ue(this,w)),yield ge(this,q,kt).call(this),yield ge(this,q,ft).call(this),ue(this,w)):(ue(this,y)||pe(this,y,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>fe(this,null,function*(){return yield ge(this,q,gt).call(this,t,{basePath:this.indexBasePath}),pe(this,w,t),yield ge(this,q,kt).call(this),yield ge(this,q,ft).call(this),t})).catch(t=>(pe(this,m,t),ge(this,q,wt).call(this),null))),ue(this,y))})},gt=function(t){return fe(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,re(re({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},ft=function(){return fe(this,null,function*(){ue(this,p)!==$e?ue(this,p)!==xe?this.eagerResults&&!ue(this,n)&&(yield ge(this,q,At).call(this,"")):ge(this,q,dt).call(this):ge(this,q,ut).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
wt=function(){ue(this,T).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,ue(this,T).removeAttribute("aria-activedescendant"),ue(this,D).textContent=this.strings.unavailableCounter,ge(this,q,Lt).call(this,"empty")},
/**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
yt=function(){const t=(ue(this,d)||[]).find(t=>t.id===ue(this,p));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
mt=function(t,e){if(t===ue(this,b))return;ge(this,q,Nt).call(this),pe(this,b,t),ue(this,L).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=ue(this,L).querySelector(".hawk-preview-title"),n=ue(this,L).querySelector(".hawk-preview-content");pe(this,v,ue(this,s).typeTitle(i,e,{isAnchor:!1})),ge(this,q,qt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},vt=function(){return fe(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},kt=function(){return fe(this,null,function*(){if(ue(this,g))return;if(this.tabsUrl){const t=yield ge(this,q,vt).call(this);if(t)return void ge(this,q,z).call(this,ge(this,q,ot).call(this,ge(this,q,U).call(this,t)))}if(!ue(this,w))return void ge(this,q,z).call(this,ge(this,q,ot).call(this,ge(this,q,U).call(this,[])));let t=[];try{const e=yield ue(this,w).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ge(this,q,z).call(this,ge(this,q,ot).call(this,ge(this,q,U).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},bt=function(){const t=ue(this,d)||[];ue(this,R).innerHTML=t.map(t=>{const e=t.id===ue(this,p),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(ue(this,R).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ge(this,q,St).call(this,t),ue(this,A).focus()}),t.addEventListener("keydown",t=>ge(this,q,$t).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
St=function(t){pe(this,p,t.dataset.filter),ue(this,R).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ue(this,p)===$e?(pe(this,n,""),ue(this,A).value="",ge(this,q,ut).call(this)):ue(this,p)===xe?(pe(this,n,""),ue(this,A).value="",ge(this,q,dt).call(this)):ge(this,q,At).call(this,ue(this,n))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
$t=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ge(this,q,St).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
xt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},At=function(t){return fe(this,null,function*(){var e;pe(this,n,t),ge(this,q,Lt).call(this,"loading");const i=++(s=this,l=a,{set _(t){pe(s,l,t,h)},get _(){return ue(s,l,o)}})._;var s,l,h,o;if(yield ge(this,q,pt).call(this),!ue(this,w))return;const c=(ue(this,d)||[]).find(t=>t.id===ue(this,p)),{filters:u,remainingQuery:g}=ge(this,q,xt).call(this,t),f=(null==c?void 0:c.filter)||u?re(re({},(null==c?void 0:c.filter)||{}),u||{}):null,y=re(re(re({},this.pagefindOptions),(null==c?void 0:c.pagefindOptions)||{}),f?{filters:f}:{}),v=this.inlineFilters?g:t;let k;try{({results:k}=v.trim()?yield ue(this,w).debouncedSearch(v,y):yield ue(this,w).search(null,y))}catch(t){if(i!==ue(this,a))return;return pe(this,m,t),void ge(this,q,wt).call(this)}if(i!==ue(this,a))return;const b=(k||[]).slice(0,this.maxCandidateResults),S=[];let $=-1;for(let t=0;t<b.length&&S.length<this.maxResults;t+=this.resultHydrationConcurrency){const s=b.slice(t,t+this.resultHydrationConcurrency);let n;try{n=yield Promise.all(s.map(t=>t.data()))}catch(t){if(i!==ue(this,a))return;return pe(this,m,t),void ge(this,q,wt).call(this)}if(i!==ue(this,a))return;for(const t of n)if(!ge(this,q,Pt).call(this,t.url)){S.push({title:(null==(e=t.meta)?void 0:e.title)||this.strings.untitled,url:t.url,excerpt:t.excerpt,isAnchor:!1,meta:t.meta||{}});for(const e of t.sub_results||[])if(e.url!==t.url&&(S.push({title:e.title,url:e.url,excerpt:e.excerpt,isAnchor:!0,meta:t.meta||{}}),S.length>=this.maxResults))break;if(S.length>=this.maxResults)break}S.length&&S.length!==$&&(ge(this,q,Mt).call(this,S),$=ue(this,r).length)}i===ue(this,a)&&$!==Math.min(S.length,this.maxResults)&&ge(this,q,Mt).call(this,S)})},
/** Commits one ordered progressive search batch and updates every result-derived surface. */
Mt=function(t){pe(this,r,t.slice(0,this.maxResults)),pe(this,h,new Set(ue(this,r).map(t=>t.url.split("#")[0])).size),pe(this,l,ue(this,r).length?0:-1),ge(this,q,Tt).call(this)},
/**
   * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
   * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
   */
Ct=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},Pt=function(t){return this.excludePages.has(ge(this,q,Ct).call(this,t))},Tt=function(){if(!ue(this,r).length)return ue(this,T).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ge(this,q,_).call(this,ue(this,n)))}</div>`,ue(this,T).removeAttribute("aria-activedescendant"),ue(this,D).textContent=ue(this,n)?this.strings.matchingResults(0,0):this.strings.typeToSearch,ge(this,q,Ot).call(this),void ge(this,q,Lt).call(this,"empty");ue(this,D).textContent=ue(this,n)?this.strings.matchingResults(ue(this,r).length,ue(this,h)):this.strings.entries(ue(this,r).length,ue(this,h)),ue(this,T).innerHTML=ue(this,r).map((t,e)=>{const i=this.enablePins&&ge(this,q,ht).call(this,t.url),s=Math.min(e,10),n=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===ue(this,l)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===ue(this,l)}" style="--hawk-row-index: ${s}${n}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${ge(this,q,Ht).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),ue(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${ue(this,l)}`),ue(this,T).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ge(this,q,Wt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ge(this,q,ct).call(this,ue(this,r)[s]);ge(this,q,at).call(this,ue(this,r)[s]),null==(i=this.onSelect)||i.call(this,ue(this,r)[s])})}),ge(this,q,Ot).call(this),ge(this,q,Lt).call(this,"ready")},
/**
   * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
   * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
   */
Lt=function(t){if(!ue(this,E)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(ue(this,E).hidden=!0);if(ue(this,E).hidden=!1,ue(this,E).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(ue(this,E).innerHTML=`<div class="hawk-discovery-status" role="status">${ge(this,q,_).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:ge(this,q,Et).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};ue(this,E).innerHTML=e.map(([t,e])=>{const n=i[t].slice(0,e.maxItems),a=n.length?`<ul class="hawk-discovery-list">${n.map(t=>`\n              <li><a class="hawk-discovery-link" href="${ge(this,q,_).call(this,ge(this,q,Dt).call(this,t.url))}" aria-label="${ge(this,q,_).call(this,`${t.label}: ${t.context}`)}">${ge(this,q,_).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${ge(this,q,_).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${ge(this,q,_).call(this,e.label||s[t])}</h3>\n          ${a}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Et=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of ue(this,r)){const n=String(s.url||"").split("#")[0],a=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);n&&!i.pages.has(n)&&(i.pages.add(n),e.pages.push({label:a,context:a,url:n})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:a,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const n=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=n.toLocaleLowerCase();n&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:n,context:s.title||a,url:s.url}))}}return e},
/**
   * Formats a result date as relative time ("7 days ago", "last month") via the built-in
   * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
   * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
   * magnitude fits under. Falls back to the raw value for anything Date can't parse.
   */
Rt=function(t){const i=new Date(t);if(Number.isNaN(i.getTime()))return String(t);let s=(i.getTime()-Date.now())/1e3;const n=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:t,unit:i}of n){if(Math.abs(s)<t)return ue(Te,e).format(Math.round(s),i);s/=t}return String(t)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Dt=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},Ht=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",a=this.showResultTags&&!t.isAnchor,l=a?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);a&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!n&&!h.length)return"";const o=n&&"relative"===this.resultDateFormat?ge(this,q,Rt).call(this,n):String(n);return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${ge(this,q,_).call(this,String(n))}">${ge(this,q,_).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${ge(this,q,_).call(this,t)}</span>`).join("")}</div></div>`},Wt=function(t,e){pe(this,l,t),ue(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),ue(this,T).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ge(this,q,Ot).call(this)},Ot=function(){var t;if(!this.enableSecondColumn)return;const e=ue(this,r)[ue(this,l)];if(!e){const t=ge(this,q,yt).call(this);return void(t.url?ge(this,q,mt).call(this,t.url,t.title):(ge(this,q,Nt).call(this),pe(this,b,null),ue(this,L).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const i=e.url;if(i===ue(this,b))return;ge(this,q,Nt).call(this),pe(this,b,i),ue(this,L).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=ue(this,L).querySelector(".hawk-preview-title"),a=ue(this,L).querySelector(".hawk-preview-content");pe(this,v,ue(this,s).typeTitle(n,e.title,{isAnchor:e.isAnchor})),ge(this,q,qt).call(this,e,i,a)},
/** Stops both independently controlled preview animation surfaces. */
Nt=function(){ue(this,s).stop(ue(this,v)),ue(this,s).stop(ue(this,k)),pe(this,v,null),pe(this,k,null)},qt=function(t,e,i){return fe(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ge(this,q,jt).call(this,e);t.isAnchor&&i?n=ge(this,q,Ft).call(this,s,i):this.previewSections?(a=ge(this,q,It).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}ue(this,b)===e&&(a&&a.length?ge(this,q,Kt).call(this,a,t,i):pe(this,k,ue(this,s).typeContent(i,n)))})},
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
It=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
Kt=function(t,e,i){const n=e.url.split("#")[0],a=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");i.addEventListener("click",i=>{var s;const a=i.target.closest(".hawk-preview-section-row");if(!a)return;const l=a.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};ge(this,q,at).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),pe(this,k,ue(this,s).typeContent(i,a))},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
jt=function(t){if(ue(this,S).has(t))return ue(this,S).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ue(this,S).delete(t),e});return ue(this,S).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
Ft=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
Ut=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ue(this,r).length&&ge(this,q,Wt).call(this,(ue(this,l)+1)%ue(this,r).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ue(this,r).length&&ge(this,q,Wt).call(this,(ue(this,l)-1+ue(this,r).length)%ue(this,r).length,!0);else if("Enter"===t.key){const t=ue(this,r)[ue(this,l)];t&&(ge(this,q,at).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
Bt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),ue(this,A).focus(),ue(this,A).value+=t.key,void ue(this,A).dispatchEvent(new Event("input"));ge(this,q,Ut).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
Vt=function(t){"ArrowDown"===t.key?(t.preventDefault(),ue(this,L).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),ue(this,L).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),ue(this,L).scrollTop+=ue(this,L).clientHeight):"PageUp"===t.key?(t.preventDefault(),ue(this,L).scrollTop-=ue(this,L).clientHeight):"Home"===t.key?(t.preventDefault(),ue(this,L).scrollTop=0):"End"===t.key&&(t.preventDefault(),ue(this,L).scrollTop=ue(this,L).scrollHeight)},_t=function(t){ue(this,f)&&"Tab"===t.key&&ge(this,q,Qt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ue(this,f)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ue(this,f)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the CSS
   * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
   * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
   * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
   * without depending on real rendering (and is testable under jsdom, which never renders).
   */
zt=function(){if(!this.enableSecondColumn)return!1;return!("true"===ue(this,x).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===ue(this,x).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Jt=function(){var t;return[ue(this,A),...this.headerControls.density?Array.from(ue(this,x).querySelectorAll(".hawk-density-btn")):[],ue(this,x).querySelector(".hawk-modal-esc"),ue(this,R).querySelector('.hawk-filter-pill[tabindex="0"]'),ue(this,T),...ge(this,q,zt).call(this)?[ue(this,L)]:[],...Array.from((null==(t=ue(this,E))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
Qt=function(t){const e=ge(this,q,Jt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
Gt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
Xt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(ue(this,H).get(t)),ue(this,H).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Yt=function(){if(!ue(this,C))return;const t=ue(this,f)&&!ue(this,A).value;ue(this,M).dataset.hawkInputActive=String(!t),t&&!ue(this,P)?pe(this,P,ue(this,s).rotatePlaceholder(ue(this,C),this.rotatingPlaceholders)):!t&&ue(this,P)&&(ue(this,s).stop(ue(this,P)),pe(this,P,null))},oe(Te,"themes",ye),oe(Te,"animations",me),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
de(Te,e,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let Le=Te;"undefined"!=typeof window&&(window.Hawk=Le),t.HawkSearch=Le,t.default=Le,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.js.map
