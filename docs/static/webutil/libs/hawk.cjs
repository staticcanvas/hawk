/*! hawk v0.43.2 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,u,d,p,g,f,w,y,m,v,k,b,S,$,A,x,M,P,C,T,L,E,R,D,H,W,O,N,q,I,K,j,U,F,B,V,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,ut,dt,pt,gt,ft,wt,yt,mt,vt,kt,bt,St,$t,At,xt,Mt,Pt,Ct,Tt,Lt,Et,Rt,Dt,Ht,Wt,Ot,Nt,qt,It,Kt,jt,Ut,Ft,Bt,Vt,_t,zt,Jt,Qt,Gt,Xt=Object.defineProperty,Yt=Object.defineProperties,Zt=Object.getOwnPropertyDescriptors,te=Object.getOwnPropertySymbols,ee=Object.prototype.hasOwnProperty,ie=Object.prototype.propertyIsEnumerable,se=t=>{throw TypeError(t)},ne=(t,e,i)=>e in t?Xt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ae=(t,e)=>{for(var i in e||(e={}))ee.call(e,i)&&ne(t,i,e[i]);if(te)for(var i of te(e))ie.call(e,i)&&ne(t,i,e[i]);return t},le=(t,e)=>Yt(t,Zt(e)),re=(t,e,i)=>ne(t,"symbol"!=typeof e?e+"":e,i),he=(t,e,i)=>e.has(t)||se("Cannot "+i),oe=(t,e,i)=>(he(t,e,"read from private field"),i?i.call(t):e.get(t)),ce=(t,e,i)=>e.has(t)?se("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ue=(t,e,i,s)=>(he(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),de=(t,e,i)=>(he(t,e,"access private method"),i),pe=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const ge={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=ge);const fe=new Map,we=new Map;we.set("instant",ge);const ye=["#f5c2e7","#cba6f7","#94e2d5","#a6e3a1","#fab387","#89dceb"],me={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0,verticalFit:!1},ve=new Set(["fit","medium","compact"]),ke="hawk:density",be="pinned",Se="recently-viewed",$e={open:!0,slash:!0,escape:!0},Ae={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},xe={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Me=0;const Pe=class{
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
constructor(t={}){var e,F,B,V,_,J,Q,G;if(ce(this,q),ce(this,i),ce(this,s),ce(this,n),ce(this,a),ce(this,l),ce(this,r),ce(this,h),ce(this,o),ce(this,c),ce(this,u),ce(this,d),ce(this,p),ce(this,g),ce(this,f),ce(this,w),ce(this,y),ce(this,m),ce(this,v),ce(this,k),ce(this,b),ce(this,S),ce(this,$),ce(this,A),ce(this,x),ce(this,M),ce(this,P),ce(this,C),ce(this,T),ce(this,L),ce(this,E),ce(this,R),ce(this,D),ce(this,H),ce(this,W),ce(this,O),ce(this,N),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Me+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,ue(this,$,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const X=de(this,q,Z).call(this);this.params=le(ae(ae(ae({},me),X?{density:X}:{}),t.params),{offset:ae(ae({},me.offset),null==(e=t.params)?void 0:e.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=null!=(F=t.maxResults)?F:18,this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.resultDateFormat="relative"===t.resultDateFormat?"relative":"timestamp",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags",this.resultAccentColors=Array.isArray(t.resultAccentColors)?t.resultAccentColors.filter(Boolean):[],this.tagAccentColors=!1===t.tagAccentColors?[]:Array.isArray(t.tagAccentColors)?t.tagAccentColors.filter(Boolean):ye,this.showSubpageConnector=!1!==t.showSubpageConnector;const Y=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==Y&&!1!==Y.density&&this.params.allowDensityToggle,escape:!1!==Y&&!1!==Y.escape};const tt=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(tt.map(t=>de(this,q,xt).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(B=t.maxPins)?B:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(V=t.maxRecentlyViewed)?V:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(_=t.previewSectionExcerptLength)?_:140,this.discoveryRow=de(this,q,j).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=ae(ae({},$e),t.hotkeys),this.strings=ae(ae({},xe),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Q=null!=(J=t.revealDuration)?J:Ae[this.revealAnimation])?Q:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(G=t.resultsRevealStagger)?G:22,this.backdrop=t.backdrop||{},this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,ue(this,i,de(this,q,I).call(this,t.theme)),ue(this,s,de(this,q,K).call(this,t.animation)),ue(this,n,""),ue(this,a,0),ue(this,l,-1),ue(this,r,[]),ue(this,h,0),ue(this,o,this.enablePins?de(this,q,et).call(this):[]),ue(this,c,this.enableRecentlyViewed?de(this,q,it).call(this):[]),ue(this,p,t.defaultTab||"all"),ue(this,d,de(this,q,U).call(this,t)),ue(this,g,null!==oe(this,d)),ue(this,f,!1),ue(this,w,null),ue(this,y,null),ue(this,m,null),ue(this,v,null),ue(this,k,null),ue(this,b,null),ue(this,S,new Map),ue(this,H,new Map),this.container&&de(this,q,z).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){fe.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){we.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:oe(this,f),query:oe(this,n),selectedIndex:oe(this,l),matches:oe(this,r),pageCount:oe(this,h),pins:oe(this,o),recentlyViewed:oe(this,c),secondColumnEnabled:this.enableSecondColumn,activeTab:oe(this,p),error:oe(this,m)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=le(ae(ae({},this.params),t),{offset:ae(ae({},this.params.offset),null==t?void 0:t.offset)}),de(this,q,X).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(oe(this,N)),delete oe(this,A).dataset.hawkAnimState,oe(this,A).hidden=!1,document.body.style.overflow="hidden",ue(this,f,!0),de(this,q,dt).call(this),de(this,q,Gt).call(this),de(this,q,Jt).call(this)&&(oe(this,A).dataset.hawkAnimState="opening",ue(this,N,setTimeout(()=>{delete oe(this,A).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{oe(this,x).focus(),oe(this,x).select()},40),null==(t=this.onOpen)||t.call(this,oe(this,n))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",ue(this,f,!1),de(this,q,Gt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(oe(this,N)),de(this,q,Jt).call(this)?(oe(this,A).dataset.hawkAnimState="closing",ue(this,N,setTimeout(()=>{oe(this,A).hidden=!0,delete oe(this,A).dataset.hawkAnimState},this.revealDuration))):oe(this,A).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,i,n;de(this,q,Wt).call(this),oe(this,C)&&oe(this,s).stop(oe(this,C)),null==(e=null==(t=oe(this,W))?void 0:t.removeEventListener)||e.call(t,"change",oe(this,O)),oe(this,H).forEach(t=>clearTimeout(t)),clearTimeout(oe(this,N)),null==(i=oe(this,A))||i.remove(),null==(n=oe(this,u))||n.remove()}};e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,v=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,A=new WeakMap,x=new WeakMap,M=new WeakMap,P=new WeakMap,C=new WeakMap,T=new WeakMap,L=new WeakMap,E=new WeakMap,R=new WeakMap,D=new WeakMap,H=new WeakMap,W=new WeakMap,O=new WeakMap,N=new WeakMap,q=new WeakSet,I=function(t){if(!t)return fe.get("typeflow")||null;if("string"==typeof t){const e=fe.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},K=function(t){if(!1===t)return we.get("instant");if(!t)return we.get("typeflow")||we.get("instant");if("string"==typeof t){const e=we.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
j=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
U=function(t){return t.tabs?de(this,q,F).call(this,t.tabs):t.categories?de(this,q,F).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
F=function(t){const e=t.map(t=>({id:t.id||de(this,q,B).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?le(ae({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},B=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
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
_=function(t){var e,i;ue(this,d,t),t.some(t=>t.id===oe(this,p))||("all"!==oe(this,p)&&oe(this,p)!==be&&oe(this,p)!==Se&&console.warn(`HawkSearch: no tab with id "${oe(this,p)}" (defaultTab); falling back to "all".`),ue(this,p,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),de(this,q,kt).call(this)},z=function(){de(this,q,J).call(this);const t=document.createElement("div");t.innerHTML=de(this,q,G).call(this),ue(this,A,t.firstElementChild),this.container.appendChild(oe(this,A)),ue(this,x,oe(this,A).querySelector(".hawk-modal-input")),ue(this,M,oe(this,A).querySelector(".hawk-input-wrap")),ue(this,P,oe(this,A).querySelector(".hawk-input-ghost")),oe(this,P)&&(oe(this,P).textContent=this.rotatingPlaceholders[0],de(this,q,Gt).call(this)),ue(this,T,oe(this,A).querySelector(".hawk-results-pane")),ue(this,L,oe(this,A).querySelector(".hawk-preview-pane")),ue(this,E,oe(this,A).querySelector(".hawk-discovery-row")),ue(this,R,oe(this,A).querySelector(".hawk-modal-filters")),ue(this,D,oe(this,A).querySelector(".hawk-modal-counter")),[oe(this,T),oe(this,L),oe(this,R),oe(this,E)].filter(Boolean).forEach(t=>de(this,q,Qt).call(this,t)),oe(this,i)&&(oe(this,i).apply(oe(this,A)),Object.entries(oe(this,i).tokens||{}).forEach(([t,e])=>{oe(this,A).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(oe(this,A).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(oe(this,A).dataset.hawkReveal=this.revealAnimation,oe(this,A).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(oe(this,A).dataset.hawkResultsReveal=this.resultsRevealDirection,oe(this,A).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),this.backdrop.color&&oe(this,A).style.setProperty("--hawk-backdrop",this.backdrop.color),this.backdrop.gradient&&oe(this,A).style.setProperty("--hawk-backdrop-gradient",this.backdrop.gradient),void 0!==this.backdrop.opacity&&oe(this,A).style.setProperty("--hawk-backdrop-opacity",String(this.backdrop.opacity)),this.backdrop.blur&&oe(this,A).style.setProperty("--hawk-backdrop-blur",this.backdrop.blur),de(this,q,X).call(this),de(this,q,Ct).call(this,"empty"),oe(this,g)&&de(this,q,_).call(this,de(this,q,ht).call(this,oe(this,d)));const e=de(this,q,wt).call(this);this.enableSecondColumn&&e.url&&de(this,q,yt).call(this,e.url,e.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),oe(this,A).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),oe(this,A).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),de(this,q,tt).call(this,t.dataset.density)})}),oe(this,x).addEventListener("input",()=>{de(this,q,At).call(this,oe(this,x).value),de(this,q,Gt).call(this)}),oe(this,x).addEventListener("keydown",t=>de(this,q,jt).call(this,t)),oe(this,x).addEventListener("focus",()=>de(this,q,dt).call(this),{once:!0}),oe(this,T).addEventListener("keydown",t=>de(this,q,Ut).call(this,t)),oe(this,L).addEventListener("keydown",t=>de(this,q,Ft).call(this,t)),oe(this,L).addEventListener("focus",()=>{oe(this,A).dataset.hawkShowPreview="true"}),oe(this,L).addEventListener("blur",()=>{oe(this,A).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>de(this,q,Bt).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
J=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const e=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${e}`,s.setAttribute("data-search-trigger",""),"minimal"===e&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=de(this,q,Q).call(this,e),oe(this,i)&&(oe(this,i).apply(s),Object.entries(oe(this,i).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),ue(this,u,s)},Q=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},G=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${de(this,q,V).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},X=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r,verticalFit:h}=this.params;oe(this,A).style.setProperty("--hawk-scale",String(i)),oe(this,A).style.setProperty("--hawk-offset-x",de(this,q,Y).call(this,n.x)),oe(this,A).style.setProperty("--hawk-offset-y",de(this,q,Y).call(this,n.y)),oe(this,A).dataset.hawkPosition=s,oe(this,A).dataset.hawkDensity=r,oe(this,A).dataset.hawkVerticalFit=String(!0===h),oe(this,A).dataset.hawkSecondColumn=String(this.enableSecondColumn),oe(this,A).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?a:1),oe(this,A).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),oe(this,W)&&(null==(e=(t=oe(this,W)).removeEventListener)||e.call(t,"change",oe(this,O)),ue(this,W,null)),"function"==typeof window.matchMedia&&(ue(this,W,window.matchMedia(`(max-width: ${l}px)`)),ue(this,O,()=>{oe(this,A).dataset.hawkCompact=String(oe(this,W).matches)}),oe(this,W).addEventListener("change",oe(this,O)),oe(this,O).call(this))},Y=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
Z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(ke):null;return ve.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
tt=function(t){try{null==localStorage||localStorage.setItem(ke,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
et=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
it=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},st=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
nt=function(t){if(!this.enableRecentlyViewed||!t||de(this,q,Mt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};ue(this,c,[e,...oe(this,c).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),de(this,q,st).call(this,oe(this,c)),de(this,q,_).call(this,de(this,q,ht).call(this,de(this,q,at).call(this)))},at=function(){return(oe(this,d)||[]).filter(t=>t.id!==be&&t.id!==Se)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
lt=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},rt=function(t){return oe(this,o).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
ht=function(t){const e=[];return this.enablePins&&oe(this,o).some(t=>!de(this,q,Mt).call(this,t.url))&&e.push({id:be,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&oe(this,c).some(t=>!de(this,q,Mt).call(this,t.url))&&e.push({id:Se,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
ot=function(t){const e=oe(this,p)===be;if(de(this,q,rt).call(this,t.url))ue(this,o,oe(this,o).filter(e=>e.url!==t.url));else{if(!(oe(this,o).length<this.maxPins))return;ue(this,o,[...oe(this,o),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}de(this,q,lt).call(this,oe(this,o)),de(this,q,_).call(this,de(this,q,ht).call(this,de(this,q,at).call(this))),oe(this,p)===be?de(this,q,ct).call(this):e?de(this,q,At).call(this,oe(this,n)):de(this,q,Pt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ct=function(){ue(this,r,oe(this,o).filter(t=>!de(this,q,Mt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ue(this,h,new Set(oe(this,r).map(t=>t.url.split("#")[0])).size),ue(this,l,oe(this,r).length?0:-1),de(this,q,Pt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ut=function(){ue(this,r,oe(this,c).filter(t=>!de(this,q,Mt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ue(this,h,new Set(oe(this,r).map(t=>t.url.split("#")[0])).size),ue(this,l,oe(this,r).length?0:-1),de(this,q,Pt).call(this)},dt=function(){return pe(this,null,function*(){return oe(this,w)?oe(this,w):oe(this,$)?(ue(this,w,oe(this,$)),yield de(this,q,pt).call(this,oe(this,w)),yield de(this,q,vt).call(this),yield de(this,q,gt).call(this),oe(this,w)):(oe(this,y)||ue(this,y,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>pe(this,null,function*(){return yield de(this,q,pt).call(this,t,{basePath:this.indexBasePath}),ue(this,w,t),yield de(this,q,vt).call(this),yield de(this,q,gt).call(this),t})).catch(t=>(ue(this,m,t),de(this,q,ft).call(this),null))),oe(this,y))})},pt=function(t){return pe(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,ae(ae({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},gt=function(){return pe(this,null,function*(){oe(this,p)!==be?oe(this,p)!==Se?this.eagerResults&&!oe(this,n)&&(yield de(this,q,At).call(this,"")):de(this,q,ut).call(this):de(this,q,ct).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
ft=function(){oe(this,T).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,oe(this,T).removeAttribute("aria-activedescendant"),oe(this,D).textContent=this.strings.unavailableCounter,de(this,q,Ct).call(this,"empty")},
/**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
wt=function(){const t=(oe(this,d)||[]).find(t=>t.id===oe(this,p));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
yt=function(t,e){if(t===oe(this,b))return;de(this,q,Wt).call(this),ue(this,b,t),oe(this,L).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=oe(this,L).querySelector(".hawk-preview-title"),n=oe(this,L).querySelector(".hawk-preview-content");ue(this,v,oe(this,s).typeTitle(i,e,{isAnchor:!1})),de(this,q,Ot).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},mt=function(){return pe(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},vt=function(){return pe(this,null,function*(){if(oe(this,g))return;if(this.tabsUrl){const t=yield de(this,q,mt).call(this);if(t)return void de(this,q,_).call(this,de(this,q,ht).call(this,de(this,q,F).call(this,t)))}if(!oe(this,w))return void de(this,q,_).call(this,de(this,q,ht).call(this,de(this,q,F).call(this,[])));let t=[];try{const e=yield oe(this,w).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}de(this,q,_).call(this,de(this,q,ht).call(this,de(this,q,F).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},kt=function(){const t=oe(this,d)||[];oe(this,R).innerHTML=t.map(t=>{const e=t.id===oe(this,p),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(oe(this,R).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{de(this,q,bt).call(this,t),oe(this,x).focus()}),t.addEventListener("keydown",t=>de(this,q,St).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
bt=function(t){ue(this,p,t.dataset.filter),oe(this,R).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),oe(this,p)===be?(ue(this,n,""),oe(this,x).value="",de(this,q,ct).call(this)):oe(this,p)===Se?(ue(this,n,""),oe(this,x).value="",de(this,q,ut).call(this)):de(this,q,At).call(this,oe(this,n))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
St=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),de(this,q,bt).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
$t=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},At=function(t){return pe(this,null,function*(){var e;ue(this,n,t),de(this,q,Ct).call(this,"loading");const i=++(s=this,o=a,{set _(t){ue(s,o,t,c)},get _(){return oe(s,o,u)}})._;var s,o,c,u;if(yield de(this,q,dt).call(this),!oe(this,w))return;const g=(oe(this,d)||[]).find(t=>t.id===oe(this,p)),{filters:f,remainingQuery:y}=de(this,q,$t).call(this,t),v=(null==g?void 0:g.filter)||f?ae(ae({},(null==g?void 0:g.filter)||{}),f||{}):null,k=ae(ae(ae({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),v?{filters:v}:{}),b=this.inlineFilters?y:t;let S;try{({results:S}=b.trim()?yield oe(this,w).debouncedSearch(b,k):yield oe(this,w).search(null,k))}catch(t){return ue(this,m,t),void de(this,q,ft).call(this)}if(i!==oe(this,a))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!de(this,q,Mt).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}ue(this,r,$.slice(0,this.maxResults)),ue(this,h,new Set(oe(this,r).map(t=>t.url.split("#")[0])).size),ue(this,l,oe(this,r).length?0:-1),de(this,q,Pt).call(this)})},
/**
   * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
   * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
   */
xt=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},Mt=function(t){return this.excludePages.has(de(this,q,xt).call(this,t))},Pt=function(){if(!oe(this,r).length)return oe(this,T).innerHTML=`<div class="hawk-empty">${this.strings.noResults(de(this,q,V).call(this,oe(this,n)))}</div>`,oe(this,T).removeAttribute("aria-activedescendant"),oe(this,D).textContent=oe(this,n)?this.strings.matchingResults(0,0):this.strings.typeToSearch,de(this,q,Ht).call(this),void de(this,q,Ct).call(this,"empty");oe(this,D).textContent=oe(this,n)?this.strings.matchingResults(oe(this,r).length,oe(this,h)):this.strings.entries(oe(this,r).length,oe(this,h)),oe(this,T).innerHTML=oe(this,r).map((t,e)=>{const i=this.enablePins&&de(this,q,rt).call(this,t.url),s=Math.min(e,10),n=this.resultAccentColors.length?`;--hawk-result-accent:${this.resultAccentColors[e%this.resultAccentColors.length]}`:"";return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor&&this.showSubpageConnector?" hawk-result-item--subpage":""}${e===oe(this,l)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===oe(this,l)}" style="--hawk-row-index: ${s}${n}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          ${de(this,q,Rt).call(this,t)}\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),oe(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${oe(this,l)}`),oe(this,T).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>de(this,q,Dt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void de(this,q,ot).call(this,oe(this,r)[s]);de(this,q,nt).call(this,oe(this,r)[s]),null==(i=this.onSelect)||i.call(this,oe(this,r)[s])})}),de(this,q,Ht).call(this),de(this,q,Ct).call(this,"ready")},
/**
   * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
   * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
   */
Ct=function(t){if(!oe(this,E)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(oe(this,E).hidden=!0);if(oe(this,E).hidden=!1,oe(this,E).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(oe(this,E).innerHTML=`<div class="hawk-discovery-status" role="status">${de(this,q,V).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:de(this,q,Tt).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};oe(this,E).innerHTML=e.map(([t,e])=>{const n=i[t].slice(0,e.maxItems),a=n.length?`<ul class="hawk-discovery-list">${n.map(t=>`\n              <li><a class="hawk-discovery-link" href="${de(this,q,V).call(this,de(this,q,Et).call(this,t.url))}" aria-label="${de(this,q,V).call(this,`${t.label}: ${t.context}`)}">${de(this,q,V).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${de(this,q,V).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${de(this,q,V).call(this,e.label||s[t])}</h3>\n          ${a}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Tt=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of oe(this,r)){const n=String(s.url||"").split("#")[0],a=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);n&&!i.pages.has(n)&&(i.pages.add(n),e.pages.push({label:a,context:a,url:n})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:a,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const n=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=n.toLocaleLowerCase();n&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:n,context:s.title||a,url:s.url}))}}return e},
/**
   * Formats a result date as relative time ("7 days ago", "last month") via the built-in
   * Intl.RelativeTimeFormat — no date library needed. Division ladder from MDN's own
   * RelativeTimeFormat example: walks up from seconds to years, picking the first unit the
   * magnitude fits under. Falls back to the raw value for anything Date can't parse.
   */
Lt=function(t){const i=new Date(t);if(Number.isNaN(i.getTime()))return String(t);let s=(i.getTime()-Date.now())/1e3;const n=[{amount:60,unit:"second"},{amount:60,unit:"minute"},{amount:24,unit:"hour"},{amount:30,unit:"day"},{amount:12,unit:"month"},{amount:Number.POSITIVE_INFINITY,unit:"year"}];for(const{amount:t,unit:i}of n){if(Math.abs(s)<t)return oe(Pe,e).format(Math.round(s),i);s/=t}return String(t)},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Et=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},Rt=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",a=this.showResultTags&&!t.isAnchor,l=a?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",r=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);a&&(null==(s=t.meta)?void 0:s.section)&&r.unshift(t.meta.section);const h=Array.from(new Set(r));if(!n&&!h.length)return"";const o=n&&"relative"===this.resultDateFormat?de(this,q,Lt).call(this,n):String(n);return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${de(this,q,V).call(this,String(n))}">${de(this,q,V).call(this,o)}</time>`:""}<div class="hawk-result-tags">${h.map((t,e)=>`<span class="hawk-result-tag"${this.tagAccentColors.length?` style="--hawk-tag-accent:${this.tagAccentColors[e%this.tagAccentColors.length]}"`:""}>${de(this,q,V).call(this,t)}</span>`).join("")}</div></div>`},Dt=function(t,e){ue(this,l,t),oe(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),oe(this,T).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),de(this,q,Ht).call(this)},Ht=function(){var t;if(!this.enableSecondColumn)return;const e=oe(this,r)[oe(this,l)];if(!e){const t=de(this,q,wt).call(this);return void(t.url?de(this,q,yt).call(this,t.url,t.title):(de(this,q,Wt).call(this),ue(this,b,null),oe(this,L).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const i=e.url;if(i===oe(this,b))return;de(this,q,Wt).call(this),ue(this,b,i),oe(this,L).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=oe(this,L).querySelector(".hawk-preview-title"),a=oe(this,L).querySelector(".hawk-preview-content");ue(this,v,oe(this,s).typeTitle(n,e.title,{isAnchor:e.isAnchor})),de(this,q,Ot).call(this,e,i,a)},
/** Stops both independently controlled preview animation surfaces. */
Wt=function(){oe(this,s).stop(oe(this,v)),oe(this,s).stop(oe(this,k)),ue(this,v,null),ue(this,k,null)},Ot=function(t,e,i){return pe(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield de(this,q,It).call(this,e);t.isAnchor&&i?n=de(this,q,Kt).call(this,s,i):this.previewSections?(a=de(this,q,Nt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}oe(this,b)===e&&(a&&a.length?de(this,q,qt).call(this,a,t,i):ue(this,k,oe(this,s).typeContent(i,n)))})},
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
Nt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
qt=function(t,e,i){const n=e.url.split("#")[0],a=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");i.addEventListener("click",i=>{var s;const a=i.target.closest(".hawk-preview-section-row");if(!a)return;const l=a.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};de(this,q,nt).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),ue(this,k,oe(this,s).typeContent(i,a))},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
It=function(t){if(oe(this,S).has(t))return oe(this,S).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw oe(this,S).delete(t),e});return oe(this,S).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
Kt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
jt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),oe(this,r).length&&de(this,q,Dt).call(this,(oe(this,l)+1)%oe(this,r).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),oe(this,r).length&&de(this,q,Dt).call(this,(oe(this,l)-1+oe(this,r).length)%oe(this,r).length,!0);else if("Enter"===t.key){const t=oe(this,r)[oe(this,l)];t&&(de(this,q,nt).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
Ut=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),oe(this,x).focus(),oe(this,x).value+=t.key,void oe(this,x).dispatchEvent(new Event("input"));de(this,q,jt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
Ft=function(t){"ArrowDown"===t.key?(t.preventDefault(),oe(this,L).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),oe(this,L).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),oe(this,L).scrollTop+=oe(this,L).clientHeight):"PageUp"===t.key?(t.preventDefault(),oe(this,L).scrollTop-=oe(this,L).clientHeight):"Home"===t.key?(t.preventDefault(),oe(this,L).scrollTop=0):"End"===t.key&&(t.preventDefault(),oe(this,L).scrollTop=oe(this,L).scrollHeight)},Bt=function(t){oe(this,f)&&"Tab"===t.key&&de(this,q,zt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),oe(this,f)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&oe(this,f)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the CSS
   * conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact']/
   * [data-hawk-columns='1'] rules (hidden in single-column layouts unless focus has already
   * revealed it). Checked in JS, not via layout/computed-style, so the focus trap stays correct
   * without depending on real rendering (and is testable under jsdom, which never renders).
   */
Vt=function(){if(!this.enableSecondColumn)return!1;return!("true"===oe(this,A).dataset.hawkCompact||"compact"===this.params.density||1===this.params.columns)||"true"===oe(this,A).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
_t=function(){var t;return[oe(this,x),...this.headerControls.density?Array.from(oe(this,A).querySelectorAll(".hawk-density-btn")):[],oe(this,A).querySelector(".hawk-modal-esc"),oe(this,R).querySelector('.hawk-filter-pill[tabindex="0"]'),oe(this,T),...de(this,q,Vt).call(this)?[oe(this,L)]:[],...Array.from((null==(t=oe(this,E))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
zt=function(t){const e=de(this,q,_t).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
Jt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
Qt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(oe(this,H).get(t)),oe(this,H).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Gt=function(){if(!oe(this,P))return;const t=oe(this,f)&&!oe(this,x).value;oe(this,M).dataset.hawkInputActive=String(!t),t&&!oe(this,C)?ue(this,C,oe(this,s).rotatePlaceholder(oe(this,P),this.rotatingPlaceholders)):!t&&oe(this,C)&&(oe(this,s).stop(oe(this,C)),ue(this,C,null))},re(Pe,"themes",fe),re(Pe,"animations",we),
// Shared across every instance/call — constructing Intl.RelativeTimeFormat isn't free, and its
// output depends only on the host's locale, never on instance config.
// numeric: 'always' (not 'auto') so every value reads as "X ago"/"in X" consistently — 'auto'
// would substitute "yesterday"/"last month" at exact unit boundaries, which doesn't match what
// was actually requested ("7 days ago", "1 month ago", not "last week"/"last month").
ce(Pe,e,new Intl.RelativeTimeFormat(void 0,{numeric:"always"}));let Ce=Pe;"undefined"!=typeof window&&(window.Hawk=Ce),t.HawkSearch=Ce,t.default=Ce,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
