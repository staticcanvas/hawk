/*! hawk v0.11.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,l,a,r,h,o,c,u,d,p,f,g,w,y,v,m,k,b,S,$,x,A,P,M,T,C,E,L,R,D,W,O,H,q,K,N,I,U,j,B,V,F,z,J,_,Q,G,X,Y,Z,tt,et,it,st,nt,lt,at,rt,ht,ot,ct,ut,dt,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t,xt,At,Pt,Mt,Tt,Ct,Et,Lt,Rt,Dt,Wt,Ot,Ht,qt,Kt,Nt,It,Ut=Object.defineProperty,jt=Object.defineProperties,Bt=Object.getOwnPropertyDescriptors,Vt=Object.getOwnPropertySymbols,Ft=Object.prototype.hasOwnProperty,zt=Object.prototype.propertyIsEnumerable,Jt=t=>{throw TypeError(t)},_t=(t,e,i)=>e in t?Ut(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Qt=(t,e)=>{for(var i in e||(e={}))Ft.call(e,i)&&_t(t,i,e[i]);if(Vt)for(var i of Vt(e))zt.call(e,i)&&_t(t,i,e[i]);return t},Gt=(t,e)=>jt(t,Bt(e)),Xt=(t,e,i)=>_t(t,"symbol"!=typeof e?e+"":e,i),Yt=(t,e,i)=>e.has(t)||Jt("Cannot "+i),Zt=(t,e,i)=>(Yt(t,e,"read from private field"),i?i.call(t):e.get(t)),te=(t,e,i)=>e.has(t)?Jt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ee=(t,e,i,s)=>(Yt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ie=(t,e,i)=>(Yt(t,e,"access private method"),i),se=(t,e,i)=>new Promise((s,n)=>{var l=t=>{try{r(i.next(t))}catch(t){n(t)}},a=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(l,a);r((i=i.apply(t,e)).next())});const ne={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=ne);const le=new Map,ae=new Map;ae.set("instant",ne);const re={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},he=new Set(["fit","medium","compact"]),oe="hawk:density",ce="pinned",ue="recently-viewed",de={open:!0,slash:!0,escape:!0},pe={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},fe={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let ge=0;class we{
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
constructor(K={}){var N,I,U,B,V,F,z,J;if(te(this,W),te(this,t),te(this,e),te(this,i),te(this,s),te(this,n),te(this,l),te(this,a),te(this,r),te(this,h),te(this,o),te(this,c),te(this,u),te(this,d),te(this,p),te(this,f),te(this,g),te(this,w),te(this,y),te(this,v),te(this,m),te(this,k),te(this,b),te(this,S),te(this,$),te(this,x),te(this,A),te(this,P),te(this,M),te(this,T),te(this,C),te(this,E),te(this,L),te(this,R),te(this,D),!K.index&&!K.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=K.id||`hawk-search-${ge+=1}`,this.indexBasePath=K.index?K.index.endsWith("/")?K.index:`${K.index}/`:null,ee(this,k,K.pagefind||null),this.triggerSelector=K.triggerSelector||"[data-search-trigger]",this.container=K.container||("undefined"!=typeof document?document.body:null);const Q=ie(this,W,_).call(this);this.params=Gt(Qt(Qt(Qt({},re),Q?{density:Q}:{}),K.params),{offset:Qt(Qt({},re.offset),null==(N=K.params)?void 0:N.offset)}),this.categoryFilterName=K.categoryFilterName||"category",this.tabsUrl=K.tabs||K.categories?null:K.tabsUrl||null,this.includeAllTab=!1!==K.includeAllTab,this.pagefindOptions=K.pagefindOptions||{},this.pagefindInitOptions=K.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(K.pagefindMergeIndexes)?K.pagefindMergeIndexes:[],this.maxResults=null!=(I=K.maxResults)?I:18,this.showResultDate=!1!==K.showResultDate,this.resultDateMetaKey=K.resultDateMetaKey||"date",this.showResultTags=!1!==K.showResultTags,this.resultTagsMetaKey=K.resultTagsMetaKey||"tags";const Y=!1!==K.headerControls&&(K.headerControls||{});this.headerControls={density:!1!==Y&&!1!==Y.density&&this.params.allowDensityToggle,escape:!1!==Y&&!1!==Y.escape};const Z=Array.isArray(K.excludePages)?K.excludePages:K.excludePages?[K.excludePages]:[];this.excludePages=new Set(Z.map(t=>ie(this,W,kt).call(this,t))),this.contentSelector=K.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=K.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=K.rotatingPlaceholders||[],this.showPoweredBy=!1!==K.showPoweredBy,this.poweredByHref=K.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==K.enablePins,this.pinStorageKey=K.pinStorageKey||"hawk:pins",this.maxPins=null!=(U=K.maxPins)?U:20,this.enableRecentlyViewed=!1!==K.enableRecentlyViewed,this.recentlyViewedStorageKey=K.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(B=K.maxRecentlyViewed)?B:10,this.enableSecondColumn=!1!==K.enableSecondColumn,this.inlineFilters=K.inlineFilters||!1,this.previewSections=K.previewSections||!1,this.previewSectionSelector=K.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(V=K.previewSectionExcerptLength)?V:140,this.triggerConfig=K.trigger||null,this.hotkeys=Qt(Qt({},de),K.hotkeys),this.strings=Qt(Qt({},fe),K.strings),this.defaultPreviewUrl=K.defaultPreviewUrl||null,this.defaultPreviewTitle=K.defaultPreviewTitle||"",this.revealAnimation=!1!==K.revealAnimation&&(K.revealAnimation||"scale-fade"),this.revealDuration=null!=(z=null!=(F=K.revealDuration)?F:pe[this.revealAnimation])?z:220,this.resultsReveal=!1!==K.resultsReveal,this.resultsRevealDirection=K.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(J=K.resultsRevealStagger)?J:22,this.eagerResults=!1!==K.eagerResults,this.onOpen=K.onOpen,this.onClose=K.onClose,this.onSelect=K.onSelect,ee(this,t,ie(this,W,O).call(this,K.theme)),ee(this,e,ie(this,W,H).call(this,K.animation)),ee(this,i,""),ee(this,s,0),ee(this,n,-1),ee(this,l,[]),ee(this,a,0),ee(this,r,this.enablePins?ie(this,W,G).call(this):[]),ee(this,h,this.enableRecentlyViewed?ie(this,W,X).call(this):[]),ee(this,u,K.defaultTab||"all"),ee(this,c,ie(this,W,q).call(this,K)),ee(this,d,null!==Zt(this,c)),ee(this,p,!1),ee(this,f,null),ee(this,g,null),ee(this,w,null),ee(this,y,null),ee(this,v,null),ee(this,m,new Map),ee(this,E,new Map),this.container&&ie(this,W,j).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){le.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){ae.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Zt(this,p),query:Zt(this,i),selectedIndex:Zt(this,n),matches:Zt(this,l),pageCount:Zt(this,a),pins:Zt(this,r),recentlyViewed:Zt(this,h),secondColumnEnabled:this.enableSecondColumn,activeTab:Zt(this,u),error:Zt(this,w)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=Gt(Qt(Qt({},this.params),t),{offset:Qt(Qt({},this.params.offset),null==t?void 0:t.offset)}),ie(this,W,z).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(Zt(this,D)),delete Zt(this,b).dataset.hawkAnimState,Zt(this,b).hidden=!1,document.body.style.overflow="hidden",ee(this,p,!0),ie(this,W,rt).call(this),ie(this,W,It).call(this),ie(this,W,Kt).call(this)&&(Zt(this,b).dataset.hawkAnimState="opening",ee(this,D,setTimeout(()=>{delete Zt(this,b).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{Zt(this,S).focus(),Zt(this,S).select()},40),null==(t=this.onOpen)||t.call(this,Zt(this,i))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",ee(this,p,!1),ie(this,W,It).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(Zt(this,D)),ie(this,W,Kt).call(this)?(Zt(this,b).dataset.hawkAnimState="closing",ee(this,D,setTimeout(()=>{Zt(this,b).hidden=!0,delete Zt(this,b).dataset.hawkAnimState},this.revealDuration))):Zt(this,b).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;Zt(this,e).stop(Zt(this,y)),Zt(this,A)&&Zt(this,e).stop(Zt(this,A)),null==(i=null==(t=Zt(this,L))?void 0:t.removeEventListener)||i.call(t,"change",Zt(this,R)),Zt(this,E).forEach(t=>clearTimeout(t)),clearTimeout(Zt(this,D)),null==(s=Zt(this,b))||s.remove(),null==(n=Zt(this,o))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,l=new WeakMap,a=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,M=new WeakMap,T=new WeakMap,C=new WeakMap,E=new WeakMap,L=new WeakMap,R=new WeakMap,D=new WeakMap,W=new WeakSet,O=function(t){if(!t)return le.get("typeflow")||null;if("string"==typeof t){const e=le.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},H=function(t){if(!1===t)return ae.get("instant");if(!t)return ae.get("typeflow")||ae.get("instant");if("string"==typeof t){const e=ae.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
q=function(t){return t.tabs?ie(this,W,K).call(this,t.tabs):t.categories?ie(this,W,K).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
K=function(t){const e=t.map(t=>({id:t.id||ie(this,W,N).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?Gt(Qt({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},N=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
 * fetched-page-content trust boundary documented for the preview pane (that content is the
 * site's own already-built output, deliberately not sanitized) — a typed query is visitor
 * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
 * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
 * `config.strings.noResults` override too, not just the default.
 */
I=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
U=function(t){var e,i;ee(this,c,t),t.some(t=>t.id===Zt(this,u))||("all"!==Zt(this,u)&&Zt(this,u)!==ce&&Zt(this,u)!==ue&&console.warn(`HawkSearch: no tab with id "${Zt(this,u)}" (defaultTab); falling back to "all".`),ee(this,u,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ie(this,W,gt).call(this)},j=function(){ie(this,W,B).call(this);const e=document.createElement("div");e.innerHTML=ie(this,W,F).call(this),ee(this,b,e.firstElementChild),this.container.appendChild(Zt(this,b)),ee(this,S,Zt(this,b).querySelector(".hawk-modal-input")),ee(this,$,Zt(this,b).querySelector(".hawk-input-wrap")),ee(this,x,Zt(this,b).querySelector(".hawk-input-ghost")),Zt(this,x)&&(Zt(this,x).textContent=this.rotatingPlaceholders[0],ie(this,W,It).call(this)),ee(this,P,Zt(this,b).querySelector(".hawk-results-pane")),ee(this,M,Zt(this,b).querySelector(".hawk-preview-pane")),ee(this,T,Zt(this,b).querySelector(".hawk-modal-filters")),ee(this,C,Zt(this,b).querySelector(".hawk-modal-counter")),[Zt(this,P),Zt(this,M),Zt(this,T)].forEach(t=>ie(this,W,Nt).call(this,t)),Zt(this,t)&&(Zt(this,t).apply(Zt(this,b)),Object.entries(Zt(this,t).tokens||{}).forEach(([t,e])=>{Zt(this,b).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Zt(this,b).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(Zt(this,b).dataset.hawkReveal=this.revealAnimation,Zt(this,b).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(Zt(this,b).dataset.hawkResultsReveal=this.resultsRevealDirection,Zt(this,b).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),ie(this,W,z).call(this),Zt(this,d)&&ie(this,W,U).call(this,ie(this,W,st).call(this,Zt(this,c)));const i=ie(this,W,ut).call(this);this.enableSecondColumn&&i.url&&ie(this,W,dt).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Zt(this,b).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Zt(this,b).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ie(this,W,Q).call(this,t.dataset.density)})}),Zt(this,S).addEventListener("input",()=>{ie(this,W,mt).call(this,Zt(this,S).value),ie(this,W,It).call(this)}),Zt(this,S).addEventListener("keydown",t=>ie(this,W,Lt).call(this,t)),Zt(this,S).addEventListener("focus",()=>ie(this,W,rt).call(this),{once:!0}),Zt(this,P).addEventListener("keydown",t=>ie(this,W,Rt).call(this,t)),Zt(this,M).addEventListener("keydown",t=>ie(this,W,Dt).call(this,t)),Zt(this,M).addEventListener("focus",()=>{Zt(this,b).dataset.hawkShowPreview="true"}),Zt(this,M).addEventListener("blur",()=>{Zt(this,b).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ie(this,W,Wt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
B=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ie(this,W,V).call(this,i),Zt(this,t)&&(Zt(this,t).apply(s),Object.entries(Zt(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),ee(this,o,s)},V=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},F=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},z=function(){var t,e;const{scale:i,position:s,offset:n,columns:l,breakpoint:a,density:r}=this.params;Zt(this,b).style.setProperty("--hawk-scale",String(i)),Zt(this,b).style.setProperty("--hawk-offset-x",ie(this,W,J).call(this,n.x)),Zt(this,b).style.setProperty("--hawk-offset-y",ie(this,W,J).call(this,n.y)),Zt(this,b).dataset.hawkPosition=s,Zt(this,b).dataset.hawkDensity=r,Zt(this,b).dataset.hawkSecondColumn=String(this.enableSecondColumn),Zt(this,b).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?l:1),Zt(this,b).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Zt(this,L)&&(null==(e=(t=Zt(this,L)).removeEventListener)||e.call(t,"change",Zt(this,R)),ee(this,L,null)),"function"==typeof window.matchMedia&&(ee(this,L,window.matchMedia(`(max-width: ${a}px)`)),ee(this,R,()=>{Zt(this,b).dataset.hawkCompact=String(Zt(this,L).matches)}),Zt(this,L).addEventListener("change",Zt(this,R)),Zt(this,R).call(this))},J=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
_=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(oe):null;return he.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
Q=function(t){try{null==localStorage||localStorage.setItem(oe,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
G=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
X=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},Y=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
Z=function(t){if(!this.enableRecentlyViewed||!t||ie(this,W,bt).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};ee(this,h,[e,...Zt(this,h).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ie(this,W,Y).call(this,Zt(this,h)),ie(this,W,U).call(this,ie(this,W,st).call(this,ie(this,W,tt).call(this)))},tt=function(){return(Zt(this,c)||[]).filter(t=>t.id!==ce&&t.id!==ue)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
et=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},it=function(t){return Zt(this,r).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
st=function(t){const e=[];return this.enablePins&&Zt(this,r).some(t=>!ie(this,W,bt).call(this,t.url))&&e.push({id:ce,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&Zt(this,h).some(t=>!ie(this,W,bt).call(this,t.url))&&e.push({id:ue,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
nt=function(t){const e=Zt(this,u)===ce;if(ie(this,W,it).call(this,t.url))ee(this,r,Zt(this,r).filter(e=>e.url!==t.url));else{if(!(Zt(this,r).length<this.maxPins))return;ee(this,r,[...Zt(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ie(this,W,et).call(this,Zt(this,r)),ie(this,W,U).call(this,ie(this,W,st).call(this,ie(this,W,tt).call(this))),Zt(this,u)===ce?ie(this,W,lt).call(this):e?ie(this,W,mt).call(this,Zt(this,i)):ie(this,W,St).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
lt=function(){ee(this,l,Zt(this,r).filter(t=>!ie(this,W,bt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ee(this,a,new Set(Zt(this,l).map(t=>t.url.split("#")[0])).size),ee(this,n,Zt(this,l).length?0:-1),ie(this,W,St).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
at=function(){ee(this,l,Zt(this,h).filter(t=>!ie(this,W,bt).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ee(this,a,new Set(Zt(this,l).map(t=>t.url.split("#")[0])).size),ee(this,n,Zt(this,l).length?0:-1),ie(this,W,St).call(this)},rt=function(){return se(this,null,function*(){return Zt(this,f)?Zt(this,f):Zt(this,k)?(ee(this,f,Zt(this,k)),yield ie(this,W,ht).call(this,Zt(this,f)),yield ie(this,W,ft).call(this),yield ie(this,W,ot).call(this),Zt(this,f)):(Zt(this,g)||ee(this,g,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>se(this,null,function*(){return yield ie(this,W,ht).call(this,t,{basePath:this.indexBasePath}),ee(this,f,t),yield ie(this,W,ft).call(this),yield ie(this,W,ot).call(this),t})).catch(t=>(ee(this,w,t),ie(this,W,ct).call(this),null))),Zt(this,g))})},ht=function(t){return se(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,Qt(Qt({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},ot=function(){return se(this,null,function*(){Zt(this,u)!==ce?Zt(this,u)!==ue?this.eagerResults&&!Zt(this,i)&&(yield ie(this,W,mt).call(this,"")):ie(this,W,at).call(this):ie(this,W,lt).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
ct=function(){Zt(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Zt(this,P).removeAttribute("aria-activedescendant"),Zt(this,C).textContent=this.strings.unavailableCounter},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
ut=function(){const t=(Zt(this,c)||[]).find(t=>t.id===Zt(this,u));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
dt=function(t,i){if(t===Zt(this,v))return;ee(this,v,t),Zt(this,M).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=Zt(this,M).querySelector(".hawk-preview-title"),n=Zt(this,M).querySelector(".hawk-preview-content");Zt(this,e).typeTitle(s,i,{isAnchor:!1}),ie(this,W,Pt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},pt=function(){return se(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},ft=function(){return se(this,null,function*(){if(Zt(this,d))return;if(this.tabsUrl){const t=yield ie(this,W,pt).call(this);if(t)return void ie(this,W,U).call(this,ie(this,W,st).call(this,ie(this,W,K).call(this,t)))}if(!Zt(this,f))return void ie(this,W,U).call(this,ie(this,W,st).call(this,ie(this,W,K).call(this,[])));let t=[];try{const e=yield Zt(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ie(this,W,U).call(this,ie(this,W,st).call(this,ie(this,W,K).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},gt=function(){const t=Zt(this,c)||[];Zt(this,T).innerHTML=t.map(t=>{const e=t.id===Zt(this,u),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(Zt(this,T).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ie(this,W,wt).call(this,t),Zt(this,S).focus()}),t.addEventListener("keydown",t=>ie(this,W,yt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
wt=function(t){ee(this,u,t.dataset.filter),Zt(this,T).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Zt(this,u)===ce?(ee(this,i,""),Zt(this,S).value="",ie(this,W,lt).call(this)):Zt(this,u)===ue?(ee(this,i,""),Zt(this,S).value="",ie(this,W,at).call(this)):ie(this,W,mt).call(this,Zt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
yt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ie(this,W,wt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
vt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},mt=function(t){return se(this,null,function*(){var e;ee(this,i,t);const r=++(h=this,o=s,{set _(t){ee(h,o,t,d)},get _(){return Zt(h,o,p)}})._;var h,o,d,p;if(yield ie(this,W,rt).call(this),!Zt(this,f))return;const g=(Zt(this,c)||[]).find(t=>t.id===Zt(this,u)),{filters:y,remainingQuery:v}=ie(this,W,vt).call(this,t),m=(null==g?void 0:g.filter)||y?Qt(Qt({},(null==g?void 0:g.filter)||{}),y||{}):null,k=Qt(Qt(Qt({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),m?{filters:m}:{}),b=this.inlineFilters?v:t;let S;try{({results:S}=b.trim()?yield Zt(this,f).debouncedSearch(b,k):yield Zt(this,f).search(null,k))}catch(t){return ee(this,w,t),void ie(this,W,ct).call(this)}if(r!==Zt(this,s))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!ie(this,W,bt).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}ee(this,l,$.slice(0,this.maxResults)),ee(this,a,new Set(Zt(this,l).map(t=>t.url.split("#")[0])).size),ee(this,n,Zt(this,l).length?0:-1),ie(this,W,St).call(this)})},
/**
 * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
 * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
 */
kt=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},bt=function(t){return this.excludePages.has(ie(this,W,kt).call(this,t))},St=function(){if(!Zt(this,l).length)return Zt(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ie(this,W,I).call(this,Zt(this,i)))}</div>`,Zt(this,P).removeAttribute("aria-activedescendant"),Zt(this,C).textContent=Zt(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void ie(this,W,At).call(this);Zt(this,C).textContent=Zt(this,i)?this.strings.matchingResults(Zt(this,l).length,Zt(this,a)):this.strings.entries(Zt(this,l).length,Zt(this,a)),Zt(this,P).innerHTML=Zt(this,l).map((t,e)=>{const i=this.enablePins&&ie(this,W,it).call(this,t.url),s=Math.min(e,10);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor?" hawk-result-item--subpage":""}${e===Zt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Zt(this,n)}" style="--hawk-row-index: ${s}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n          ${ie(this,W,$t).call(this,t)}\n        </a>`}).join(""),Zt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${Zt(this,n)}`),Zt(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ie(this,W,xt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ie(this,W,nt).call(this,Zt(this,l)[s]);ie(this,W,Z).call(this,Zt(this,l)[s]),null==(i=this.onSelect)||i.call(this,Zt(this,l)[s])})}),ie(this,W,At).call(this)},$t=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",l=this.showResultTags?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",a=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);if(this.showResultTags&&(null==(s=t.meta)?void 0:s.section)&&!a.includes(t.meta.section)&&a.unshift(t.meta.section),!n&&!a.length)return"";return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${ie(this,W,I).call(this,String(n))}">${ie(this,W,I).call(this,String(n))}</time>`:""}<div class="hawk-result-tags">${a.map(t=>`<span class="hawk-result-tag">${ie(this,W,I).call(this,t)}</span>`).join("")}</div></div>`},xt=function(t,e){ee(this,n,t),Zt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Zt(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ie(this,W,At).call(this)},At=function(){var t;if(!this.enableSecondColumn)return;const i=Zt(this,l)[Zt(this,n)];if(!i){const t=ie(this,W,ut).call(this);return void(t.url?ie(this,W,dt).call(this,t.url,t.title):(ee(this,v,null),Zt(this,M).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=i.url;if(s===Zt(this,v))return;ee(this,v,s),Zt(this,e).stop(Zt(this,y)),Zt(this,M).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const a=Zt(this,M).querySelector(".hawk-preview-title"),r=Zt(this,M).querySelector(".hawk-preview-content");Zt(this,e).typeTitle(a,i.title,{isAnchor:i.isAnchor}),ie(this,W,Pt).call(this,i,s,r)},Pt=function(t,i,s){return se(this,null,function*(){let n=t.excerpt||"",l=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ie(this,W,Ct).call(this,e);t.isAnchor&&i?n=ie(this,W,Et).call(this,s,i):this.previewSections?(l=ie(this,W,Mt).call(this,s),l.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}Zt(this,v)===i&&(l&&l.length?ie(this,W,Tt).call(this,l,t,s):ee(this,y,Zt(this,e).typeContent(s,n)))})},
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
Mt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
Tt=function(t,i,s){const n=i.url.split("#")[0],l=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",e=>{var s;const l=e.target.closest(".hawk-preview-section-row");if(!l)return;const a=l.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===a);if(!r)return;const h={title:r.title,url:a,excerpt:r.excerpt,isAnchor:!0,meta:i.meta||{}};ie(this,W,Z).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),ee(this,y,Zt(this,e).typeContent(s,l))},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
Ct=function(t){if(Zt(this,m).has(t))return Zt(this,m).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Zt(this,m).delete(t),e});return Zt(this,m).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
Et=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let l=i.nextElementSibling;for(;l&&!(/^H[1-6]$/.test(l.tagName)&&Number(l.tagName[1])<=s);)n.push(l.outerHTML),l=l.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Lt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Zt(this,l).length&&ie(this,W,xt).call(this,(Zt(this,n)+1)%Zt(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Zt(this,l).length&&ie(this,W,xt).call(this,(Zt(this,n)-1+Zt(this,l).length)%Zt(this,l).length,!0);else if("Enter"===t.key){const t=Zt(this,l)[Zt(this,n)];t&&(ie(this,W,Z).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Rt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Zt(this,S).focus(),Zt(this,S).value+=t.key,void Zt(this,S).dispatchEvent(new Event("input"));ie(this,W,Lt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Dt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Zt(this,M).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Zt(this,M).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Zt(this,M).scrollTop+=Zt(this,M).clientHeight):"PageUp"===t.key?(t.preventDefault(),Zt(this,M).scrollTop-=Zt(this,M).clientHeight):"Home"===t.key?(t.preventDefault(),Zt(this,M).scrollTop=0):"End"===t.key&&(t.preventDefault(),Zt(this,M).scrollTop=Zt(this,M).scrollHeight)},Wt=function(t){Zt(this,p)&&"Tab"===t.key&&ie(this,W,qt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Zt(this,p)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Zt(this,p)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
Ot=function(){if(!this.enableSecondColumn)return!1;return!("true"===Zt(this,b).dataset.hawkCompact||"compact"===this.params.density)||"true"===Zt(this,b).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Ht=function(){return[Zt(this,S),...this.headerControls.density?Array.from(Zt(this,b).querySelectorAll(".hawk-density-btn")):[],Zt(this,b).querySelector(".hawk-modal-esc"),Zt(this,T).querySelector('.hawk-filter-pill[tabindex="0"]'),Zt(this,P),...ie(this,W,Ot).call(this)?[Zt(this,M)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
qt=function(t){const e=ie(this,W,Ht).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
Kt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Nt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Zt(this,E).get(t)),Zt(this,E).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
It=function(){if(!Zt(this,x))return;const t=Zt(this,p)&&!Zt(this,S).value;Zt(this,$).dataset.hawkInputActive=String(!t),t&&!Zt(this,A)?ee(this,A,Zt(this,e).rotatePlaceholder(Zt(this,x),this.rotatingPlaceholders)):!t&&Zt(this,A)&&(Zt(this,e).stop(Zt(this,A)),ee(this,A,null))},Xt(we,"themes",le),Xt(we,"animations",ae),"undefined"!=typeof window&&(window.Hawk=we);export{we as HawkSearch,we as default};
//# sourceMappingURL=hawk.mjs.map
