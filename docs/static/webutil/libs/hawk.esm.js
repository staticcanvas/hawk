/*! hawk v0.11.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,l,a,r,h,o,c,u,d,p,f,g,w,y,v,m,k,b,S,$,x,A,P,M,T,C,E,L,R,D,W,O,H,q,K,N,I,U,j,B,V,F,z,J,_,Q,G,X,Y,Z,tt,et,it,st,nt,lt,at,rt,ht,ot,ct,ut,dt,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t,xt,At,Pt,Mt,Tt,Ct,Et,Lt,Rt,Dt,Wt,Ot,Ht,qt,Kt,Nt,It,Ut,jt,Bt=Object.defineProperty,Vt=Object.defineProperties,Ft=Object.getOwnPropertyDescriptors,zt=Object.getOwnPropertySymbols,Jt=Object.prototype.hasOwnProperty,_t=Object.prototype.propertyIsEnumerable,Qt=t=>{throw TypeError(t)},Gt=(t,e,i)=>e in t?Bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Xt=(t,e)=>{for(var i in e||(e={}))Jt.call(e,i)&&Gt(t,i,e[i]);if(zt)for(var i of zt(e))_t.call(e,i)&&Gt(t,i,e[i]);return t},Yt=(t,e)=>Vt(t,Ft(e)),Zt=(t,e,i)=>Gt(t,"symbol"!=typeof e?e+"":e,i),te=(t,e,i)=>e.has(t)||Qt("Cannot "+i),ee=(t,e,i)=>(te(t,e,"read from private field"),i?i.call(t):e.get(t)),ie=(t,e,i)=>e.has(t)?Qt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),se=(t,e,i,s)=>(te(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ne=(t,e,i)=>(te(t,e,"access private method"),i),le=(t,e,i)=>new Promise((s,n)=>{var l=t=>{try{r(i.next(t))}catch(t){n(t)}},a=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(l,a);r((i=i.apply(t,e)).next())});const ae={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=ae);const re=new Map,he=new Map;he.set("instant",ae);const oe={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},ce=new Set(["fit","medium","compact"]),ue="hawk:density",de="pinned",pe="recently-viewed",fe={open:!0,slash:!0,escape:!0},ge={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},we={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let ye=0;class ve{
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
   * @param {boolean} [config.showResultTags=true] Renders comma-separated Pagefind metadata from
   *   resultTagsMetaKey as tags below the result excerpt. meta.section joins this row when present.
   * @param {string} [config.resultTagsMetaKey='tags'] Pagefind metadata key used for result tags.
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
constructor(N={}){var I,U,j,V,F,z,J,_;if(ie(this,O),ie(this,t),ie(this,e),ie(this,i),ie(this,s),ie(this,n),ie(this,l),ie(this,a),ie(this,r),ie(this,h),ie(this,o),ie(this,c),ie(this,u),ie(this,d),ie(this,p),ie(this,f),ie(this,g),ie(this,w),ie(this,y),ie(this,v),ie(this,m),ie(this,k),ie(this,b),ie(this,S),ie(this,$),ie(this,x),ie(this,A),ie(this,P),ie(this,M),ie(this,T),ie(this,C),ie(this,E),ie(this,L),ie(this,R),ie(this,D),ie(this,W),!N.index&&!N.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=N.id||`hawk-search-${ye+=1}`,this.indexBasePath=N.index?N.index.endsWith("/")?N.index:`${N.index}/`:null,se(this,b,N.pagefind||null),this.triggerSelector=N.triggerSelector||"[data-search-trigger]",this.container=N.container||("undefined"!=typeof document?document.body:null);const G=ne(this,O,Q).call(this);this.params=Yt(Xt(Xt(Xt({},oe),G?{density:G}:{}),N.params),{offset:Xt(Xt({},oe.offset),null==(I=N.params)?void 0:I.offset)}),this.categoryFilterName=N.categoryFilterName||"category",this.tabsUrl=N.tabs||N.categories?null:N.tabsUrl||null,this.includeAllTab=!1!==N.includeAllTab,this.pagefindOptions=N.pagefindOptions||{},this.pagefindInitOptions=N.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(N.pagefindMergeIndexes)?N.pagefindMergeIndexes:[],this.maxResults=null!=(U=N.maxResults)?U:18,this.showResultDate=!1!==N.showResultDate,this.resultDateMetaKey=N.resultDateMetaKey||"date",this.showResultTags=!1!==N.showResultTags,this.resultTagsMetaKey=N.resultTagsMetaKey||"tags";const Z=!1!==N.headerControls&&(N.headerControls||{});this.headerControls={density:!1!==Z&&!1!==Z.density&&this.params.allowDensityToggle,escape:!1!==Z&&!1!==Z.escape};const tt=Array.isArray(N.excludePages)?N.excludePages:N.excludePages?[N.excludePages]:[];this.excludePages=new Set(tt.map(t=>ne(this,O,bt).call(this,t))),this.contentSelector=N.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=N.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=N.rotatingPlaceholders||[],this.showPoweredBy=!1!==N.showPoweredBy,this.poweredByHref=N.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==N.enablePins,this.pinStorageKey=N.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=N.maxPins)?j:20,this.enableRecentlyViewed=!1!==N.enableRecentlyViewed,this.recentlyViewedStorageKey=N.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(V=N.maxRecentlyViewed)?V:10,this.enableSecondColumn=!1!==N.enableSecondColumn,this.inlineFilters=N.inlineFilters||!1,this.previewSections=N.previewSections||!1,this.previewSectionSelector=N.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(F=N.previewSectionExcerptLength)?F:140,this.triggerConfig=N.trigger||null,this.hotkeys=Xt(Xt({},fe),N.hotkeys),this.strings=Xt(Xt({},we),N.strings),this.defaultPreviewUrl=N.defaultPreviewUrl||null,this.defaultPreviewTitle=N.defaultPreviewTitle||"",this.revealAnimation=!1!==N.revealAnimation&&(N.revealAnimation||"scale-fade"),this.revealDuration=null!=(J=null!=(z=N.revealDuration)?z:ge[this.revealAnimation])?J:220,this.resultsReveal=!1!==N.resultsReveal,this.resultsRevealDirection=N.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(_=N.resultsRevealStagger)?_:22,this.eagerResults=!1!==N.eagerResults,this.onOpen=N.onOpen,this.onClose=N.onClose,this.onSelect=N.onSelect,se(this,t,ne(this,O,H).call(this,N.theme)),se(this,e,ne(this,O,q).call(this,N.animation)),se(this,i,""),se(this,s,0),se(this,n,-1),se(this,l,[]),se(this,a,0),se(this,r,this.enablePins?ne(this,O,X).call(this):[]),se(this,h,this.enableRecentlyViewed?ne(this,O,Y).call(this):[]),se(this,u,N.defaultTab||"all"),se(this,c,ne(this,O,K).call(this,N)),se(this,d,null!==ee(this,c)),se(this,p,!1),se(this,f,null),se(this,g,null),se(this,w,null),se(this,y,null),se(this,v,null),se(this,m,null),se(this,k,new Map),se(this,L,new Map),this.container&&ne(this,O,B).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){re.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){he.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ee(this,p),query:ee(this,i),selectedIndex:ee(this,n),matches:ee(this,l),pageCount:ee(this,a),pins:ee(this,r),recentlyViewed:ee(this,h),secondColumnEnabled:this.enableSecondColumn,activeTab:ee(this,u),error:ee(this,w)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=Yt(Xt(Xt({},this.params),t),{offset:Xt(Xt({},this.params.offset),null==t?void 0:t.offset)}),ne(this,O,J).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(ee(this,W)),delete ee(this,S).dataset.hawkAnimState,ee(this,S).hidden=!1,document.body.style.overflow="hidden",se(this,p,!0),ne(this,O,ht).call(this),ne(this,O,jt).call(this),ne(this,O,It).call(this)&&(ee(this,S).dataset.hawkAnimState="opening",se(this,W,setTimeout(()=>{delete ee(this,S).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{ee(this,$).focus(),ee(this,$).select()},40),null==(t=this.onOpen)||t.call(this,ee(this,i))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",se(this,p,!1),ne(this,O,jt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(ee(this,W)),ne(this,O,It).call(this)?(ee(this,S).dataset.hawkAnimState="closing",se(this,W,setTimeout(()=>{ee(this,S).hidden=!0,delete ee(this,S).dataset.hawkAnimState},this.revealDuration))):ee(this,S).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;ne(this,O,Mt).call(this),ee(this,P)&&ee(this,e).stop(ee(this,P)),null==(i=null==(t=ee(this,R))?void 0:t.removeEventListener)||i.call(t,"change",ee(this,D)),ee(this,L).forEach(t=>clearTimeout(t)),clearTimeout(ee(this,W)),null==(s=ee(this,S))||s.remove(),null==(n=ee(this,o))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,l=new WeakMap,a=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,M=new WeakMap,T=new WeakMap,C=new WeakMap,E=new WeakMap,L=new WeakMap,R=new WeakMap,D=new WeakMap,W=new WeakMap,O=new WeakSet,H=function(t){if(!t)return re.get("typeflow")||null;if("string"==typeof t){const e=re.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},q=function(t){if(!1===t)return he.get("instant");if(!t)return he.get("typeflow")||he.get("instant");if("string"==typeof t){const e=he.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
K=function(t){return t.tabs?ne(this,O,N).call(this,t.tabs):t.categories?ne(this,O,N).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
N=function(t){const e=t.map(t=>({id:t.id||ne(this,O,I).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?Yt(Xt({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},I=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
U=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
j=function(t){var e,i;se(this,c,t),t.some(t=>t.id===ee(this,u))||("all"!==ee(this,u)&&ee(this,u)!==de&&ee(this,u)!==pe&&console.warn(`HawkSearch: no tab with id "${ee(this,u)}" (defaultTab); falling back to "all".`),se(this,u,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ne(this,O,wt).call(this)},B=function(){ne(this,O,V).call(this);const e=document.createElement("div");e.innerHTML=ne(this,O,z).call(this),se(this,S,e.firstElementChild),this.container.appendChild(ee(this,S)),se(this,$,ee(this,S).querySelector(".hawk-modal-input")),se(this,x,ee(this,S).querySelector(".hawk-input-wrap")),se(this,A,ee(this,S).querySelector(".hawk-input-ghost")),ee(this,A)&&(ee(this,A).textContent=this.rotatingPlaceholders[0],ne(this,O,jt).call(this)),se(this,M,ee(this,S).querySelector(".hawk-results-pane")),se(this,T,ee(this,S).querySelector(".hawk-preview-pane")),se(this,C,ee(this,S).querySelector(".hawk-modal-filters")),se(this,E,ee(this,S).querySelector(".hawk-modal-counter")),[ee(this,M),ee(this,T),ee(this,C)].forEach(t=>ne(this,O,Ut).call(this,t)),ee(this,t)&&(ee(this,t).apply(ee(this,S)),Object.entries(ee(this,t).tokens||{}).forEach(([t,e])=>{ee(this,S).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(ee(this,S).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(ee(this,S).dataset.hawkReveal=this.revealAnimation,ee(this,S).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(ee(this,S).dataset.hawkResultsReveal=this.resultsRevealDirection,ee(this,S).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),ne(this,O,J).call(this),ee(this,d)&&ne(this,O,j).call(this,ne(this,O,nt).call(this,ee(this,c)));const i=ne(this,O,dt).call(this);this.enableSecondColumn&&i.url&&ne(this,O,pt).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ee(this,S).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ee(this,S).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ne(this,O,G).call(this,t.dataset.density)})}),ee(this,$).addEventListener("input",()=>{ne(this,O,kt).call(this,ee(this,$).value),ne(this,O,jt).call(this)}),ee(this,$).addEventListener("keydown",t=>ne(this,O,Dt).call(this,t)),ee(this,$).addEventListener("focus",()=>ne(this,O,ht).call(this),{once:!0}),ee(this,M).addEventListener("keydown",t=>ne(this,O,Wt).call(this,t)),ee(this,T).addEventListener("keydown",t=>ne(this,O,Ot).call(this,t)),ee(this,T).addEventListener("focus",()=>{ee(this,S).dataset.hawkShowPreview="true"}),ee(this,T).addEventListener("blur",()=>{ee(this,S).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ne(this,O,Ht).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
V=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ne(this,O,F).call(this,i),ee(this,t)&&(ee(this,t).apply(s),Object.entries(ee(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),se(this,o,s)},F=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},z=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},J=function(){var t,e;const{scale:i,position:s,offset:n,columns:l,breakpoint:a,density:r}=this.params;ee(this,S).style.setProperty("--hawk-scale",String(i)),ee(this,S).style.setProperty("--hawk-offset-x",ne(this,O,_).call(this,n.x)),ee(this,S).style.setProperty("--hawk-offset-y",ne(this,O,_).call(this,n.y)),ee(this,S).dataset.hawkPosition=s,ee(this,S).dataset.hawkDensity=r,ee(this,S).dataset.hawkSecondColumn=String(this.enableSecondColumn),ee(this,S).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?l:1),ee(this,S).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ee(this,R)&&(null==(e=(t=ee(this,R)).removeEventListener)||e.call(t,"change",ee(this,D)),se(this,R,null)),"function"==typeof window.matchMedia&&(se(this,R,window.matchMedia(`(max-width: ${a}px)`)),se(this,D,()=>{ee(this,S).dataset.hawkCompact=String(ee(this,R).matches)}),ee(this,R).addEventListener("change",ee(this,D)),ee(this,D).call(this))},_=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(ue):null;return ce.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
G=function(t){try{null==localStorage||localStorage.setItem(ue,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
X=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
Y=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},Z=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
tt=function(t){if(!this.enableRecentlyViewed||!t||ne(this,O,St).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};se(this,h,[e,...ee(this,h).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ne(this,O,Z).call(this,ee(this,h)),ne(this,O,j).call(this,ne(this,O,nt).call(this,ne(this,O,et).call(this)))},et=function(){return(ee(this,c)||[]).filter(t=>t.id!==de&&t.id!==pe)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
it=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},st=function(t){return ee(this,r).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
nt=function(t){const e=[];return this.enablePins&&ee(this,r).some(t=>!ne(this,O,St).call(this,t.url))&&e.push({id:de,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&ee(this,h).some(t=>!ne(this,O,St).call(this,t.url))&&e.push({id:pe,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
lt=function(t){const e=ee(this,u)===de;if(ne(this,O,st).call(this,t.url))se(this,r,ee(this,r).filter(e=>e.url!==t.url));else{if(!(ee(this,r).length<this.maxPins))return;se(this,r,[...ee(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ne(this,O,it).call(this,ee(this,r)),ne(this,O,j).call(this,ne(this,O,nt).call(this,ne(this,O,et).call(this))),ee(this,u)===de?ne(this,O,at).call(this):e?ne(this,O,kt).call(this,ee(this,i)):ne(this,O,$t).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
at=function(){se(this,l,ee(this,r).filter(t=>!ne(this,O,St).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),se(this,a,new Set(ee(this,l).map(t=>t.url.split("#")[0])).size),se(this,n,ee(this,l).length?0:-1),ne(this,O,$t).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
rt=function(){se(this,l,ee(this,h).filter(t=>!ne(this,O,St).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),se(this,a,new Set(ee(this,l).map(t=>t.url.split("#")[0])).size),se(this,n,ee(this,l).length?0:-1),ne(this,O,$t).call(this)},ht=function(){return le(this,null,function*(){return ee(this,f)?ee(this,f):ee(this,b)?(se(this,f,ee(this,b)),yield ne(this,O,ot).call(this,ee(this,f)),yield ne(this,O,gt).call(this),yield ne(this,O,ct).call(this),ee(this,f)):(ee(this,g)||se(this,g,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>le(this,null,function*(){return yield ne(this,O,ot).call(this,t,{basePath:this.indexBasePath}),se(this,f,t),yield ne(this,O,gt).call(this),yield ne(this,O,ct).call(this),t})).catch(t=>(se(this,w,t),ne(this,O,ut).call(this),null))),ee(this,g))})},ot=function(t){return le(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,Xt(Xt({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},ct=function(){return le(this,null,function*(){ee(this,u)!==de?ee(this,u)!==pe?this.eagerResults&&!ee(this,i)&&(yield ne(this,O,kt).call(this,"")):ne(this,O,rt).call(this):ne(this,O,at).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
ut=function(){ee(this,M).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,ee(this,M).removeAttribute("aria-activedescendant"),ee(this,E).textContent=this.strings.unavailableCounter},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
dt=function(){const t=(ee(this,c)||[]).find(t=>t.id===ee(this,u));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
pt=function(t,i){if(t===ee(this,m))return;ne(this,O,Mt).call(this),se(this,m,t),ee(this,T).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=ee(this,T).querySelector(".hawk-preview-title"),n=ee(this,T).querySelector(".hawk-preview-content");se(this,y,ee(this,e).typeTitle(s,i,{isAnchor:!1})),ne(this,O,Tt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},ft=function(){return le(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},gt=function(){return le(this,null,function*(){if(ee(this,d))return;if(this.tabsUrl){const t=yield ne(this,O,ft).call(this);if(t)return void ne(this,O,j).call(this,ne(this,O,nt).call(this,ne(this,O,N).call(this,t)))}if(!ee(this,f))return void ne(this,O,j).call(this,ne(this,O,nt).call(this,ne(this,O,N).call(this,[])));let t=[];try{const e=yield ee(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ne(this,O,j).call(this,ne(this,O,nt).call(this,ne(this,O,N).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},wt=function(){const t=ee(this,c)||[];ee(this,C).innerHTML=t.map(t=>{const e=t.id===ee(this,u),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(ee(this,C).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ne(this,O,yt).call(this,t),ee(this,$).focus()}),t.addEventListener("keydown",t=>ne(this,O,vt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
yt=function(t){se(this,u,t.dataset.filter),ee(this,C).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ee(this,u)===de?(se(this,i,""),ee(this,$).value="",ne(this,O,at).call(this)):ee(this,u)===pe?(se(this,i,""),ee(this,$).value="",ne(this,O,rt).call(this)):ne(this,O,kt).call(this,ee(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
vt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ne(this,O,yt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
mt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},kt=function(t){return le(this,null,function*(){var e;se(this,i,t);const r=++(h=this,o=s,{set _(t){se(h,o,t,d)},get _(){return ee(h,o,p)}})._;var h,o,d,p;if(yield ne(this,O,ht).call(this),!ee(this,f))return;const g=(ee(this,c)||[]).find(t=>t.id===ee(this,u)),{filters:y,remainingQuery:v}=ne(this,O,mt).call(this,t),m=(null==g?void 0:g.filter)||y?Xt(Xt({},(null==g?void 0:g.filter)||{}),y||{}):null,k=Xt(Xt(Xt({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),m?{filters:m}:{}),b=this.inlineFilters?v:t;let S;try{({results:S}=b.trim()?yield ee(this,f).debouncedSearch(b,k):yield ee(this,f).search(null,k))}catch(t){return se(this,w,t),void ne(this,O,ut).call(this)}if(r!==ee(this,s))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!ne(this,O,St).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}se(this,l,$.slice(0,this.maxResults)),se(this,a,new Set(ee(this,l).map(t=>t.url.split("#")[0])).size),se(this,n,ee(this,l).length?0:-1),ne(this,O,$t).call(this)})},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
bt=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},St=function(t){return this.excludePages.has(ne(this,O,bt).call(this,t))},$t=function(){if(!ee(this,l).length)return ee(this,M).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ne(this,O,U).call(this,ee(this,i)))}</div>`,ee(this,M).removeAttribute("aria-activedescendant"),ee(this,E).textContent=ee(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void ne(this,O,Pt).call(this);ee(this,E).textContent=ee(this,i)?this.strings.matchingResults(ee(this,l).length,ee(this,a)):this.strings.entries(ee(this,l).length,ee(this,a)),ee(this,M).innerHTML=ee(this,l).map((t,e)=>{const i=this.enablePins&&ne(this,O,st).call(this,t.url),s=Math.min(e,10);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor?" hawk-result-item--subpage":""}${e===ee(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===ee(this,n)}" style="--hawk-row-index: ${s}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n          ${ne(this,O,xt).call(this,t)}\n        </a>`}).join(""),ee(this,M).setAttribute("aria-activedescendant",`${this.id}-result-${ee(this,n)}`),ee(this,M).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ne(this,O,At).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ne(this,O,lt).call(this,ee(this,l)[s]);ne(this,O,tt).call(this,ee(this,l)[s]),null==(i=this.onSelect)||i.call(this,ee(this,l)[s])})}),ne(this,O,Pt).call(this)},xt=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",l=this.showResultTags?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",a=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);this.showResultTags&&(null==(s=t.meta)?void 0:s.section)&&a.unshift(t.meta.section);const r=Array.from(new Set(a));if(!n&&!r.length)return"";return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${ne(this,O,U).call(this,String(n))}">${ne(this,O,U).call(this,String(n))}</time>`:""}<div class="hawk-result-tags">${r.map(t=>`<span class="hawk-result-tag">${ne(this,O,U).call(this,t)}</span>`).join("")}</div></div>`},At=function(t,e){se(this,n,t),ee(this,M).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),ee(this,M).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ne(this,O,Pt).call(this)},Pt=function(){var t;if(!this.enableSecondColumn)return;const i=ee(this,l)[ee(this,n)];if(!i){const t=ne(this,O,dt).call(this);return void(t.url?ne(this,O,pt).call(this,t.url,t.title):(ne(this,O,Mt).call(this),se(this,m,null),ee(this,T).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=i.url;if(s===ee(this,m))return;ne(this,O,Mt).call(this),se(this,m,s),ee(this,T).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const a=ee(this,T).querySelector(".hawk-preview-title"),r=ee(this,T).querySelector(".hawk-preview-content");se(this,y,ee(this,e).typeTitle(a,i.title,{isAnchor:i.isAnchor})),ne(this,O,Tt).call(this,i,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Mt=function(){ee(this,e).stop(ee(this,y)),ee(this,e).stop(ee(this,v)),se(this,y,null),se(this,v,null)},Tt=function(t,i,s){return le(this,null,function*(){let n=t.excerpt||"",l=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ne(this,O,Lt).call(this,e);t.isAnchor&&i?n=ne(this,O,Rt).call(this,s,i):this.previewSections?(l=ne(this,O,Ct).call(this,s),l.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}ee(this,m)===i&&(l&&l.length?ne(this,O,Et).call(this,l,t,s):se(this,v,ee(this,e).typeContent(s,n)))})},
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
Ct=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
Et=function(t,i,s){const n=i.url.split("#")[0],l=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",e=>{var s;const l=e.target.closest(".hawk-preview-section-row");if(!l)return;const a=l.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===a);if(!r)return;const h={title:r.title,url:a,excerpt:r.excerpt,isAnchor:!0,meta:i.meta||{}};ne(this,O,tt).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),se(this,v,ee(this,e).typeContent(s,l))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
Lt=function(t){if(ee(this,k).has(t))return ee(this,k).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ee(this,k).delete(t),e});return ee(this,k).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
Rt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let l=i.nextElementSibling;for(;l&&!(/^H[1-6]$/.test(l.tagName)&&Number(l.tagName[1])<=s);)n.push(l.outerHTML),l=l.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Dt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ee(this,l).length&&ne(this,O,At).call(this,(ee(this,n)+1)%ee(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ee(this,l).length&&ne(this,O,At).call(this,(ee(this,n)-1+ee(this,l).length)%ee(this,l).length,!0);else if("Enter"===t.key){const t=ee(this,l)[ee(this,n)];t&&(ne(this,O,tt).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Wt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),ee(this,$).focus(),ee(this,$).value+=t.key,void ee(this,$).dispatchEvent(new Event("input"));ne(this,O,Dt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Ot=function(t){"ArrowDown"===t.key?(t.preventDefault(),ee(this,T).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),ee(this,T).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),ee(this,T).scrollTop+=ee(this,T).clientHeight):"PageUp"===t.key?(t.preventDefault(),ee(this,T).scrollTop-=ee(this,T).clientHeight):"Home"===t.key?(t.preventDefault(),ee(this,T).scrollTop=0):"End"===t.key&&(t.preventDefault(),ee(this,T).scrollTop=ee(this,T).scrollHeight)},Ht=function(t){ee(this,p)&&"Tab"===t.key&&ne(this,O,Nt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ee(this,p)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ee(this,p)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
qt=function(){if(!this.enableSecondColumn)return!1;return!("true"===ee(this,S).dataset.hawkCompact||"compact"===this.params.density)||"true"===ee(this,S).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Kt=function(){return[ee(this,$),...this.headerControls.density?Array.from(ee(this,S).querySelectorAll(".hawk-density-btn")):[],ee(this,S).querySelector(".hawk-modal-esc"),ee(this,C).querySelector('.hawk-filter-pill[tabindex="0"]'),ee(this,M),...ne(this,O,qt).call(this)?[ee(this,T)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
Nt=function(t){const e=ne(this,O,Kt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
It=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Ut=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(ee(this,L).get(t)),ee(this,L).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
jt=function(){if(!ee(this,A))return;const t=ee(this,p)&&!ee(this,$).value;ee(this,x).dataset.hawkInputActive=String(!t),t&&!ee(this,P)?se(this,P,ee(this,e).rotatePlaceholder(ee(this,A),this.rotatingPlaceholders)):!t&&ee(this,P)&&(ee(this,e).stop(ee(this,P)),se(this,P,null))},Zt(ve,"themes",re),Zt(ve,"animations",he),"undefined"!=typeof window&&(window.Hawk=ve);export{ve as HawkSearch,ve as default};
//# sourceMappingURL=hawk.esm.js.map
