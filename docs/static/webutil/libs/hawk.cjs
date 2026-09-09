/*! hawk v0.11.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,l,a,r,h,o,c,u,d,p,f,g,w,y,v,m,k,b,S,$,x,A,P,M,T,C,E,L,R,D,W,H,O,q,K,N,I,U,j,B,V,F,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,lt,at,rt,ht,ot,ct,ut,dt,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t,xt,At,Pt,Mt,Tt,Ct,Et,Lt,Rt,Dt,Wt,Ht,Ot,qt,Kt,Nt,It,Ut,jt,Bt,Vt=Object.defineProperty,Ft=Object.defineProperties,_t=Object.getOwnPropertyDescriptors,zt=Object.getOwnPropertySymbols,Jt=Object.prototype.hasOwnProperty,Qt=Object.prototype.propertyIsEnumerable,Gt=t=>{throw TypeError(t)},Xt=(t,e,i)=>e in t?Vt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Yt=(t,e)=>{for(var i in e||(e={}))Jt.call(e,i)&&Xt(t,i,e[i]);if(zt)for(var i of zt(e))Qt.call(e,i)&&Xt(t,i,e[i]);return t},Zt=(t,e)=>Ft(t,_t(e)),te=(t,e,i)=>Xt(t,"symbol"!=typeof e?e+"":e,i),ee=(t,e,i)=>e.has(t)||Gt("Cannot "+i),ie=(t,e,i)=>(ee(t,e,"read from private field"),i?i.call(t):e.get(t)),se=(t,e,i)=>e.has(t)?Gt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ne=(t,e,i,s)=>(ee(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),le=(t,e,i)=>(ee(t,e,"access private method"),i),ae=(t,e,i)=>new Promise((s,n)=>{var l=t=>{try{r(i.next(t))}catch(t){n(t)}},a=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(l,a);r((i=i.apply(t,e)).next())});const re={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=re);const he=new Map,oe=new Map;oe.set("instant",re);const ce={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},ue=new Set(["fit","medium","compact"]),de="hawk:density",pe="pinned",fe="recently-viewed",ge={open:!0,slash:!0,escape:!0},we={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},ye={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let ve=0;class me{
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
constructor(t={}){var I,U,j,B,F,_,z,J;if(se(this,O),se(this,e),se(this,i),se(this,s),se(this,n),se(this,l),se(this,a),se(this,r),se(this,h),se(this,o),se(this,c),se(this,u),se(this,d),se(this,p),se(this,f),se(this,g),se(this,w),se(this,y),se(this,v),se(this,m),se(this,k),se(this,b),se(this,S),se(this,$),se(this,x),se(this,A),se(this,P),se(this,M),se(this,T),se(this,C),se(this,E),se(this,L),se(this,R),se(this,D),se(this,W),se(this,H),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${ve+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,ne(this,S,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const Q=le(this,O,G).call(this);this.params=Zt(Yt(Yt(Yt({},ce),Q?{density:Q}:{}),t.params),{offset:Yt(Yt({},ce.offset),null==(I=t.params)?void 0:I.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=null!=(U=t.maxResults)?U:18,this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags";const X=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==X&&!1!==X.density&&this.params.allowDensityToggle,escape:!1!==X&&!1!==X.escape};const tt=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(tt.map(t=>le(this,O,St).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=t.maxPins)?j:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(B=t.maxRecentlyViewed)?B:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(F=t.previewSectionExcerptLength)?F:140,this.triggerConfig=t.trigger||null,this.hotkeys=Yt(Yt({},ge),t.hotkeys),this.strings=Yt(Yt({},ye),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(z=null!=(_=t.revealDuration)?_:we[this.revealAnimation])?z:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(J=t.resultsRevealStagger)?J:22,this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,ne(this,e,le(this,O,q).call(this,t.theme)),ne(this,i,le(this,O,K).call(this,t.animation)),ne(this,s,""),ne(this,n,0),ne(this,l,-1),ne(this,a,[]),ne(this,r,0),ne(this,h,this.enablePins?le(this,O,Y).call(this):[]),ne(this,o,this.enableRecentlyViewed?le(this,O,Z).call(this):[]),ne(this,d,t.defaultTab||"all"),ne(this,u,le(this,O,N).call(this,t)),ne(this,p,null!==ie(this,u)),ne(this,f,!1),ne(this,g,null),ne(this,w,null),ne(this,y,null),ne(this,v,null),ne(this,m,null),ne(this,k,null),ne(this,b,new Map),ne(this,R,new Map),this.container&&le(this,O,V).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){he.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){oe.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ie(this,f),query:ie(this,s),selectedIndex:ie(this,l),matches:ie(this,a),pageCount:ie(this,r),pins:ie(this,h),recentlyViewed:ie(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:ie(this,d),error:ie(this,y)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Zt(Yt(Yt({},this.params),t),{offset:Yt(Yt({},this.params.offset),null==t?void 0:t.offset)}),le(this,O,J).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(ie(this,H)),delete ie(this,$).dataset.hawkAnimState,ie(this,$).hidden=!1,document.body.style.overflow="hidden",ne(this,f,!0),le(this,O,ot).call(this),le(this,O,Bt).call(this),le(this,O,Ut).call(this)&&(ie(this,$).dataset.hawkAnimState="opening",ne(this,H,setTimeout(()=>{delete ie(this,$).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{ie(this,x).focus(),ie(this,x).select()},40),null==(t=this.onOpen)||t.call(this,ie(this,s))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",ne(this,f,!1),le(this,O,Bt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(ie(this,H)),le(this,O,Ut).call(this)?(ie(this,$).dataset.hawkAnimState="closing",ne(this,H,setTimeout(()=>{ie(this,$).hidden=!0,delete ie(this,$).dataset.hawkAnimState},this.revealDuration))):ie(this,$).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;le(this,O,Tt).call(this),ie(this,M)&&ie(this,i).stop(ie(this,M)),null==(e=null==(t=ie(this,D))?void 0:t.removeEventListener)||e.call(t,"change",ie(this,W)),ie(this,R).forEach(t=>clearTimeout(t)),clearTimeout(ie(this,H)),null==(s=ie(this,$))||s.remove(),null==(n=ie(this,c))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,l=new WeakMap,a=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,M=new WeakMap,T=new WeakMap,C=new WeakMap,E=new WeakMap,L=new WeakMap,R=new WeakMap,D=new WeakMap,W=new WeakMap,H=new WeakMap,O=new WeakSet,q=function(t){if(!t)return he.get("typeflow")||null;if("string"==typeof t){const e=he.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},K=function(t){if(!1===t)return oe.get("instant");if(!t)return oe.get("typeflow")||oe.get("instant");if("string"==typeof t){const e=oe.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
N=function(t){return t.tabs?le(this,O,I).call(this,t.tabs):t.categories?le(this,O,I).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
I=function(t){const e=t.map(t=>({id:t.id||le(this,O,U).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?Zt(Yt({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},U=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Escapes `str` for safe interpolation into an `innerHTML` template literal. Unlike the
   * fetched-page-content trust boundary documented for the preview pane (that content is the
   * site's own already-built output, deliberately not sanitized) — a typed query is visitor
   * input, always untrusted, and `strings.noResults(query)` is the one place it reaches
   * `innerHTML`. Escaping the argument here (not the string `noResults` returns) protects any
   * `config.strings.noResults` override too, not just the default.
   */
j=function(t){return String(t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[t]))},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
B=function(t){var e,i;ne(this,u,t),t.some(t=>t.id===ie(this,d))||("all"!==ie(this,d)&&ie(this,d)!==pe&&ie(this,d)!==fe&&console.warn(`HawkSearch: no tab with id "${ie(this,d)}" (defaultTab); falling back to "all".`),ne(this,d,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),le(this,O,yt).call(this)},V=function(){le(this,O,F).call(this);const t=document.createElement("div");t.innerHTML=le(this,O,z).call(this),ne(this,$,t.firstElementChild),this.container.appendChild(ie(this,$)),ne(this,x,ie(this,$).querySelector(".hawk-modal-input")),ne(this,A,ie(this,$).querySelector(".hawk-input-wrap")),ne(this,P,ie(this,$).querySelector(".hawk-input-ghost")),ie(this,P)&&(ie(this,P).textContent=this.rotatingPlaceholders[0],le(this,O,Bt).call(this)),ne(this,T,ie(this,$).querySelector(".hawk-results-pane")),ne(this,C,ie(this,$).querySelector(".hawk-preview-pane")),ne(this,E,ie(this,$).querySelector(".hawk-modal-filters")),ne(this,L,ie(this,$).querySelector(".hawk-modal-counter")),[ie(this,T),ie(this,C),ie(this,E)].forEach(t=>le(this,O,jt).call(this,t)),ie(this,e)&&(ie(this,e).apply(ie(this,$)),Object.entries(ie(this,e).tokens||{}).forEach(([t,e])=>{ie(this,$).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(ie(this,$).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(ie(this,$).dataset.hawkReveal=this.revealAnimation,ie(this,$).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(ie(this,$).dataset.hawkResultsReveal=this.resultsRevealDirection,ie(this,$).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),le(this,O,J).call(this),ie(this,p)&&le(this,O,B).call(this,le(this,O,lt).call(this,ie(this,u)));const i=le(this,O,pt).call(this);this.enableSecondColumn&&i.url&&le(this,O,ft).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ie(this,$).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ie(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),le(this,O,X).call(this,t.dataset.density)})}),ie(this,x).addEventListener("input",()=>{le(this,O,bt).call(this,ie(this,x).value),le(this,O,Bt).call(this)}),ie(this,x).addEventListener("keydown",t=>le(this,O,Wt).call(this,t)),ie(this,x).addEventListener("focus",()=>le(this,O,ot).call(this),{once:!0}),ie(this,T).addEventListener("keydown",t=>le(this,O,Ht).call(this,t)),ie(this,C).addEventListener("keydown",t=>le(this,O,Ot).call(this,t)),ie(this,C).addEventListener("focus",()=>{ie(this,$).dataset.hawkShowPreview="true"}),ie(this,C).addEventListener("blur",()=>{ie(this,$).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>le(this,O,qt).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
F=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=le(this,O,_).call(this,i),ie(this,e)&&(ie(this,e).apply(s),Object.entries(ie(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),ne(this,c,s)},_=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},z=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},J=function(){var t,e;const{scale:i,position:s,offset:n,columns:l,breakpoint:a,density:r}=this.params;ie(this,$).style.setProperty("--hawk-scale",String(i)),ie(this,$).style.setProperty("--hawk-offset-x",le(this,O,Q).call(this,n.x)),ie(this,$).style.setProperty("--hawk-offset-y",le(this,O,Q).call(this,n.y)),ie(this,$).dataset.hawkPosition=s,ie(this,$).dataset.hawkDensity=r,ie(this,$).dataset.hawkSecondColumn=String(this.enableSecondColumn),ie(this,$).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?l:1),ie(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ie(this,D)&&(null==(e=(t=ie(this,D)).removeEventListener)||e.call(t,"change",ie(this,W)),ne(this,D,null)),"function"==typeof window.matchMedia&&(ne(this,D,window.matchMedia(`(max-width: ${a}px)`)),ne(this,W,()=>{ie(this,$).dataset.hawkCompact=String(ie(this,D).matches)}),ie(this,D).addEventListener("change",ie(this,W)),ie(this,W).call(this))},Q=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
G=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(de):null;return ue.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
X=function(t){try{null==localStorage||localStorage.setItem(de,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Y=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
Z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},tt=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
et=function(t){if(!this.enableRecentlyViewed||!t||le(this,O,$t).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};ne(this,o,[e,...ie(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),le(this,O,tt).call(this,ie(this,o)),le(this,O,B).call(this,le(this,O,lt).call(this,le(this,O,it).call(this)))},it=function(){return(ie(this,u)||[]).filter(t=>t.id!==pe&&t.id!==fe)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
st=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},nt=function(t){return ie(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
lt=function(t){const e=[];return this.enablePins&&ie(this,h).some(t=>!le(this,O,$t).call(this,t.url))&&e.push({id:pe,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&ie(this,o).some(t=>!le(this,O,$t).call(this,t.url))&&e.push({id:fe,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
at=function(t){const e=ie(this,d)===pe;if(le(this,O,nt).call(this,t.url))ne(this,h,ie(this,h).filter(e=>e.url!==t.url));else{if(!(ie(this,h).length<this.maxPins))return;ne(this,h,[...ie(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}le(this,O,st).call(this,ie(this,h)),le(this,O,B).call(this,le(this,O,lt).call(this,le(this,O,it).call(this))),ie(this,d)===pe?le(this,O,rt).call(this):e?le(this,O,bt).call(this,ie(this,s)):le(this,O,xt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
rt=function(){ne(this,a,ie(this,h).filter(t=>!le(this,O,$t).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ne(this,r,new Set(ie(this,a).map(t=>t.url.split("#")[0])).size),ne(this,l,ie(this,a).length?0:-1),le(this,O,xt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ht=function(){ne(this,a,ie(this,o).filter(t=>!le(this,O,$t).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),ne(this,r,new Set(ie(this,a).map(t=>t.url.split("#")[0])).size),ne(this,l,ie(this,a).length?0:-1),le(this,O,xt).call(this)},ot=function(){return ae(this,null,function*(){return ie(this,g)?ie(this,g):ie(this,S)?(ne(this,g,ie(this,S)),yield le(this,O,ct).call(this,ie(this,g)),yield le(this,O,wt).call(this),yield le(this,O,ut).call(this),ie(this,g)):(ie(this,w)||ne(this,w,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>ae(this,null,function*(){return yield le(this,O,ct).call(this,t,{basePath:this.indexBasePath}),ne(this,g,t),yield le(this,O,wt).call(this),yield le(this,O,ut).call(this),t})).catch(t=>(ne(this,y,t),le(this,O,dt).call(this),null))),ie(this,w))})},ct=function(t){return ae(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,Yt(Yt({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},ut=function(){return ae(this,null,function*(){ie(this,d)!==pe?ie(this,d)!==fe?this.eagerResults&&!ie(this,s)&&(yield le(this,O,bt).call(this,"")):le(this,O,ht).call(this):le(this,O,rt).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
dt=function(){ie(this,T).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,ie(this,T).removeAttribute("aria-activedescendant"),ie(this,L).textContent=this.strings.unavailableCounter},
/**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
pt=function(){const t=(ie(this,u)||[]).find(t=>t.id===ie(this,d));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
ft=function(t,e){if(t===ie(this,k))return;le(this,O,Tt).call(this),ne(this,k,t),ie(this,C).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=ie(this,C).querySelector(".hawk-preview-title"),n=ie(this,C).querySelector(".hawk-preview-content");ne(this,v,ie(this,i).typeTitle(s,e,{isAnchor:!1})),le(this,O,Ct).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},gt=function(){return ae(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},wt=function(){return ae(this,null,function*(){if(ie(this,p))return;if(this.tabsUrl){const t=yield le(this,O,gt).call(this);if(t)return void le(this,O,B).call(this,le(this,O,lt).call(this,le(this,O,I).call(this,t)))}if(!ie(this,g))return void le(this,O,B).call(this,le(this,O,lt).call(this,le(this,O,I).call(this,[])));let t=[];try{const e=yield ie(this,g).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}le(this,O,B).call(this,le(this,O,lt).call(this,le(this,O,I).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},yt=function(){const t=ie(this,u)||[];ie(this,E).innerHTML=t.map(t=>{const e=t.id===ie(this,d),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(ie(this,E).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{le(this,O,vt).call(this,t),ie(this,x).focus()}),t.addEventListener("keydown",t=>le(this,O,mt).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
vt=function(t){ne(this,d,t.dataset.filter),ie(this,E).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ie(this,d)===pe?(ne(this,s,""),ie(this,x).value="",le(this,O,rt).call(this)):ie(this,d)===fe?(ne(this,s,""),ie(this,x).value="",le(this,O,ht).call(this)):le(this,O,bt).call(this,ie(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
mt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),le(this,O,vt).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
kt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},bt=function(t){return ae(this,null,function*(){var e;ne(this,s,t);const i=++(h=this,o=n,{set _(t){ne(h,o,t,c)},get _(){return ie(h,o,p)}})._;var h,o,c,p;if(yield le(this,O,ot).call(this),!ie(this,g))return;const f=(ie(this,u)||[]).find(t=>t.id===ie(this,d)),{filters:w,remainingQuery:v}=le(this,O,kt).call(this,t),m=(null==f?void 0:f.filter)||w?Yt(Yt({},(null==f?void 0:f.filter)||{}),w||{}):null,k=Yt(Yt(Yt({},this.pagefindOptions),(null==f?void 0:f.pagefindOptions)||{}),m?{filters:m}:{}),b=this.inlineFilters?v:t;let S;try{({results:S}=b.trim()?yield ie(this,g).debouncedSearch(b,k):yield ie(this,g).search(null,k))}catch(t){return ne(this,y,t),void le(this,O,dt).call(this)}if(i!==ie(this,n))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!le(this,O,$t).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}ne(this,a,$.slice(0,this.maxResults)),ne(this,r,new Set(ie(this,a).map(t=>t.url.split("#")[0])).size),ne(this,l,ie(this,a).length?0:-1),le(this,O,xt).call(this)})},
/**
   * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
   * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
   */
St=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},$t=function(t){return this.excludePages.has(le(this,O,St).call(this,t))},xt=function(){if(!ie(this,a).length)return ie(this,T).innerHTML=`<div class="hawk-empty">${this.strings.noResults(le(this,O,j).call(this,ie(this,s)))}</div>`,ie(this,T).removeAttribute("aria-activedescendant"),ie(this,L).textContent=ie(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void le(this,O,Mt).call(this);ie(this,L).textContent=ie(this,s)?this.strings.matchingResults(ie(this,a).length,ie(this,r)):this.strings.entries(ie(this,a).length,ie(this,r)),ie(this,T).innerHTML=ie(this,a).map((t,e)=>{const i=this.enablePins&&le(this,O,nt).call(this,t.url),s=Math.min(e,10);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor?" hawk-result-item--subpage":""}${e===ie(this,l)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===ie(this,l)}" style="--hawk-row-index: ${s}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n          ${le(this,O,At).call(this,t)}\n        </a>`}).join(""),ie(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${ie(this,l)}`),ie(this,T).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>le(this,O,Pt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void le(this,O,at).call(this,ie(this,a)[s]);le(this,O,et).call(this,ie(this,a)[s]),null==(i=this.onSelect)||i.call(this,ie(this,a)[s])})}),le(this,O,Mt).call(this)},At=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",l=this.showResultTags?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",a=String(l||"").split(",").map(t=>t.trim()).filter(Boolean);this.showResultTags&&(null==(s=t.meta)?void 0:s.section)&&a.unshift(t.meta.section);const r=Array.from(new Set(a));if(!n&&!r.length)return"";return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${le(this,O,j).call(this,String(n))}">${le(this,O,j).call(this,String(n))}</time>`:""}<div class="hawk-result-tags">${r.map(t=>`<span class="hawk-result-tag">${le(this,O,j).call(this,t)}</span>`).join("")}</div></div>`},Pt=function(t,e){ne(this,l,t),ie(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),ie(this,T).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),le(this,O,Mt).call(this)},Mt=function(){var t;if(!this.enableSecondColumn)return;const e=ie(this,a)[ie(this,l)];if(!e){const t=le(this,O,pt).call(this);return void(t.url?le(this,O,ft).call(this,t.url,t.title):(le(this,O,Tt).call(this),ne(this,k,null),ie(this,C).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===ie(this,k))return;le(this,O,Tt).call(this),ne(this,k,s),ie(this,C).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=ie(this,C).querySelector(".hawk-preview-title"),r=ie(this,C).querySelector(".hawk-preview-content");ne(this,v,ie(this,i).typeTitle(n,e.title,{isAnchor:e.isAnchor})),le(this,O,Ct).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Tt=function(){ie(this,i).stop(ie(this,v)),ie(this,i).stop(ie(this,m)),ne(this,v,null),ne(this,m,null)},Ct=function(t,e,s){return ae(this,null,function*(){let n=t.excerpt||"",l=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield le(this,O,Rt).call(this,e);t.isAnchor&&i?n=le(this,O,Dt).call(this,s,i):this.previewSections?(l=le(this,O,Et).call(this,s),l.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}ie(this,k)===e&&(l&&l.length?le(this,O,Lt).call(this,l,t,s):ne(this,m,ie(this,i).typeContent(s,n)))})},
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
Et=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
Lt=function(t,e,s){const n=e.url.split("#")[0],l=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const l=i.target.closest(".hawk-preview-section-row");if(!l)return;const a=l.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===a);if(!r)return;const h={title:r.title,url:a,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};le(this,O,et).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),ne(this,m,ie(this,i).typeContent(s,l))},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
Rt=function(t){if(ie(this,b).has(t))return ie(this,b).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ie(this,b).delete(t),e});return ie(this,b).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
Dt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let l=i.nextElementSibling;for(;l&&!(/^H[1-6]$/.test(l.tagName)&&Number(l.tagName[1])<=s);)n.push(l.outerHTML),l=l.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
Wt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ie(this,a).length&&le(this,O,Pt).call(this,(ie(this,l)+1)%ie(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ie(this,a).length&&le(this,O,Pt).call(this,(ie(this,l)-1+ie(this,a).length)%ie(this,a).length,!0);else if("Enter"===t.key){const t=ie(this,a)[ie(this,l)];t&&(le(this,O,et).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
Ht=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),ie(this,x).focus(),ie(this,x).value+=t.key,void ie(this,x).dispatchEvent(new Event("input"));le(this,O,Wt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
Ot=function(t){"ArrowDown"===t.key?(t.preventDefault(),ie(this,C).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),ie(this,C).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),ie(this,C).scrollTop+=ie(this,C).clientHeight):"PageUp"===t.key?(t.preventDefault(),ie(this,C).scrollTop-=ie(this,C).clientHeight):"Home"===t.key?(t.preventDefault(),ie(this,C).scrollTop=0):"End"===t.key&&(t.preventDefault(),ie(this,C).scrollTop=ie(this,C).scrollHeight)},qt=function(t){ie(this,f)&&"Tab"===t.key&&le(this,O,It).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ie(this,f)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ie(this,f)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
Kt=function(){if(!this.enableSecondColumn)return!1;return!("true"===ie(this,$).dataset.hawkCompact||"compact"===this.params.density)||"true"===ie(this,$).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Nt=function(){return[ie(this,x),...this.headerControls.density?Array.from(ie(this,$).querySelectorAll(".hawk-density-btn")):[],ie(this,$).querySelector(".hawk-modal-esc"),ie(this,E).querySelector('.hawk-filter-pill[tabindex="0"]'),ie(this,T),...le(this,O,Kt).call(this)?[ie(this,C)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
It=function(t){const e=le(this,O,Nt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
Ut=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
jt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(ie(this,R).get(t)),ie(this,R).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Bt=function(){if(!ie(this,P))return;const t=ie(this,f)&&!ie(this,x).value;ie(this,A).dataset.hawkInputActive=String(!t),t&&!ie(this,M)?ne(this,M,ie(this,i).rotatePlaceholder(ie(this,P),this.rotatingPlaceholders)):!t&&ie(this,M)&&(ie(this,i).stop(ie(this,M)),ne(this,M,null))},te(me,"themes",he),te(me,"animations",oe),"undefined"!=typeof window&&(window.Hawk=me),t.HawkSearch=me,t.default=me,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
