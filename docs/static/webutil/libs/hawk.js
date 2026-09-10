/*! hawk v0.11.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,d,u,p,g,f,w,y,v,m,k,b,S,$,x,A,M,P,T,L,C,E,R,H,D,W,O,q,N,I,K,j,U,B,V,F,_,z,J,Q,G,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,gt,ft,wt,yt,vt,mt,kt,bt,St,$t,xt,At,Mt,Pt,Tt,Lt,Ct,Et,Rt,Ht,Dt,Wt,Ot,qt,Nt,It,Kt,jt,Ut,Bt,Vt,Ft,_t,zt,Jt,Qt=Object.defineProperty,Gt=Object.defineProperties,Xt=Object.getOwnPropertyDescriptors,Yt=Object.getOwnPropertySymbols,Zt=Object.prototype.hasOwnProperty,te=Object.prototype.propertyIsEnumerable,ee=t=>{throw TypeError(t)},ie=(t,e,i)=>e in t?Qt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,se=(t,e)=>{for(var i in e||(e={}))Zt.call(e,i)&&ie(t,i,e[i]);if(Yt)for(var i of Yt(e))te.call(e,i)&&ie(t,i,e[i]);return t},ne=(t,e)=>Gt(t,Xt(e)),ae=(t,e,i)=>ie(t,"symbol"!=typeof e?e+"":e,i),le=(t,e,i)=>e.has(t)||ee("Cannot "+i),re=(t,e,i)=>(le(t,e,"read from private field"),i?i.call(t):e.get(t)),he=(t,e,i)=>e.has(t)?ee("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),oe=(t,e,i,s)=>(le(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ce=(t,e,i)=>(le(t,e,"access private method"),i),de=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const ue={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=ue);const pe=new Map,ge=new Map;ge.set("instant",ue);const fe={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},we=new Set(["fit","medium","compact"]),ye="hawk:density",ve="pinned",me="recently-viewed",ke={open:!0,slash:!0,escape:!0},be={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},Se={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",discoveryLabel:"Discover related content",discoveryMatches:"Query matches",discoveryPages:"Related pages",discoveryHeadings:"Headings",discoveryEmpty:"No links available.",discoveryLoading:"Finding links…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",recentlyViewedTab:"Recently viewed",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let $e=0;class xe{
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
constructor(t={}){var U,B,V,F,z,J,Q,G;if(he(this,q),he(this,e),he(this,i),he(this,s),he(this,n),he(this,a),he(this,l),he(this,r),he(this,h),he(this,o),he(this,c),he(this,d),he(this,u),he(this,p),he(this,g),he(this,f),he(this,w),he(this,y),he(this,v),he(this,m),he(this,k),he(this,b),he(this,S),he(this,$),he(this,x),he(this,A),he(this,M),he(this,P),he(this,T),he(this,L),he(this,C),he(this,E),he(this,R),he(this,H),he(this,D),he(this,W),he(this,O),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${$e+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,oe(this,S,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const X=ce(this,q,Y).call(this);this.params=ne(se(se(se({},fe),X?{density:X}:{}),t.params),{offset:se(se({},fe.offset),null==(U=t.params)?void 0:U.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.pagefindInitOptions=t.pagefindInitOptions||{},this.pagefindMergeIndexes=Array.isArray(t.pagefindMergeIndexes)?t.pagefindMergeIndexes:[],this.maxResults=null!=(B=t.maxResults)?B:18,this.showResultDate=!1!==t.showResultDate,this.resultDateMetaKey=t.resultDateMetaKey||"date",this.showResultTags=!1!==t.showResultTags,this.resultTagsMetaKey=t.resultTagsMetaKey||"tags";const Z=!1!==t.headerControls&&(t.headerControls||{});this.headerControls={density:!1!==Z&&!1!==Z.density&&this.params.allowDensityToggle,escape:!1!==Z&&!1!==Z.escape};const it=Array.isArray(t.excludePages)?t.excludePages:t.excludePages?[t.excludePages]:[];this.excludePages=new Set(it.map(t=>ce(this,q,xt).call(this,t))),this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(V=t.maxPins)?V:20,this.enableRecentlyViewed=!1!==t.enableRecentlyViewed,this.recentlyViewedStorageKey=t.recentlyViewedStorageKey||"hawk:recently-viewed",this.maxRecentlyViewed=null!=(F=t.maxRecentlyViewed)?F:10,this.enableSecondColumn=!1!==t.enableSecondColumn,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(z=t.previewSectionExcerptLength)?z:140,this.discoveryRow=ce(this,q,K).call(this,t.discoveryRow),this.triggerConfig=t.trigger||null,this.hotkeys=se(se({},ke),t.hotkeys),this.strings=se(se({},Se),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(Q=null!=(J=t.revealDuration)?J:be[this.revealAnimation])?Q:220,this.resultsReveal=!1!==t.resultsReveal,this.resultsRevealDirection=t.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(G=t.resultsRevealStagger)?G:22,this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,oe(this,e,ce(this,q,N).call(this,t.theme)),oe(this,i,ce(this,q,I).call(this,t.animation)),oe(this,s,""),oe(this,n,0),oe(this,a,-1),oe(this,l,[]),oe(this,r,0),oe(this,h,this.enablePins?ce(this,q,tt).call(this):[]),oe(this,o,this.enableRecentlyViewed?ce(this,q,et).call(this):[]),oe(this,u,t.defaultTab||"all"),oe(this,d,ce(this,q,j).call(this,t)),oe(this,p,null!==re(this,d)),oe(this,g,!1),oe(this,f,null),oe(this,w,null),oe(this,y,null),oe(this,v,null),oe(this,m,null),oe(this,k,null),oe(this,b,new Map),oe(this,H,new Map),this.container&&ce(this,q,_).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){pe.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){ge.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:re(this,g),query:re(this,s),selectedIndex:re(this,a),matches:re(this,l),pageCount:re(this,r),pins:re(this,h),recentlyViewed:re(this,o),secondColumnEnabled:this.enableSecondColumn,activeTab:re(this,u),error:re(this,y)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=ne(se(se({},this.params),t),{offset:se(se({},this.params.offset),null==t?void 0:t.offset)}),ce(this,q,G).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(re(this,O)),delete re(this,$).dataset.hawkAnimState,re(this,$).hidden=!1,document.body.style.overflow="hidden",oe(this,g,!0),ce(this,q,dt).call(this),ce(this,q,Jt).call(this),ce(this,q,_t).call(this)&&(re(this,$).dataset.hawkAnimState="opening",oe(this,O,setTimeout(()=>{delete re(this,$).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{re(this,x).focus(),re(this,x).select()},40),null==(t=this.onOpen)||t.call(this,re(this,s))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",oe(this,g,!1),ce(this,q,Jt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(re(this,O)),ce(this,q,_t).call(this)?(re(this,$).dataset.hawkAnimState="closing",oe(this,O,setTimeout(()=>{re(this,$).hidden=!0,delete re(this,$).dataset.hawkAnimState},this.revealDuration))):re(this,$).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;ce(this,q,Ht).call(this),re(this,P)&&re(this,i).stop(re(this,P)),null==(e=null==(t=re(this,D))?void 0:t.removeEventListener)||e.call(t,"change",re(this,W)),re(this,H).forEach(t=>clearTimeout(t)),clearTimeout(re(this,O)),null==(s=re(this,$))||s.remove(),null==(n=re(this,c))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,g=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,M=new WeakMap,P=new WeakMap,T=new WeakMap,L=new WeakMap,C=new WeakMap,E=new WeakMap,R=new WeakMap,H=new WeakMap,D=new WeakMap,W=new WeakMap,O=new WeakMap,q=new WeakSet,N=function(t){if(!t)return pe.get("typeflow")||null;if("string"==typeof t){const e=pe.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},I=function(t){if(!1===t)return ge.get("instant");if(!t)return ge.get("typeflow")||ge.get("instant");if("string"==typeof t){const e=ge.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/** Normalizes the opt-in discovery row while keeping each group independently configurable. */
K=function(t){if(!t)return null;const e=!0===t?{}:t,i=t=>{if(!1===t)return null;const e=t&&"object"==typeof t?t:{},i=Number(e.maxItems);return{label:e.label||"",maxItems:Number.isFinite(i)&&i>=0?Math.floor(i):4}};return{matches:i(e.matches),pages:i(e.pages),headings:i(e.headings)}},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
j=function(t){return t.tabs?ce(this,q,U).call(this,t.tabs):t.categories?ce(this,q,U).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
U=function(t){const e=t.map(t=>({id:t.id||ce(this,q,B).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?ne(se({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},B=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
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
F=function(t){var e,i;oe(this,d,t),t.some(t=>t.id===re(this,u))||("all"!==re(this,u)&&re(this,u)!==ve&&re(this,u)!==me&&console.warn(`HawkSearch: no tab with id "${re(this,u)}" (defaultTab); falling back to "all".`),oe(this,u,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ce(this,q,mt).call(this)},_=function(){ce(this,q,z).call(this);const t=document.createElement("div");t.innerHTML=ce(this,q,Q).call(this),oe(this,$,t.firstElementChild),this.container.appendChild(re(this,$)),oe(this,x,re(this,$).querySelector(".hawk-modal-input")),oe(this,A,re(this,$).querySelector(".hawk-input-wrap")),oe(this,M,re(this,$).querySelector(".hawk-input-ghost")),re(this,M)&&(re(this,M).textContent=this.rotatingPlaceholders[0],ce(this,q,Jt).call(this)),oe(this,T,re(this,$).querySelector(".hawk-results-pane")),oe(this,L,re(this,$).querySelector(".hawk-preview-pane")),oe(this,C,re(this,$).querySelector(".hawk-discovery-row")),oe(this,E,re(this,$).querySelector(".hawk-modal-filters")),oe(this,R,re(this,$).querySelector(".hawk-modal-counter")),[re(this,T),re(this,L),re(this,E),re(this,C)].filter(Boolean).forEach(t=>ce(this,q,zt).call(this,t)),re(this,e)&&(re(this,e).apply(re(this,$)),Object.entries(re(this,e).tokens||{}).forEach(([t,e])=>{re(this,$).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(re(this,$).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(re(this,$).dataset.hawkReveal=this.revealAnimation,re(this,$).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(re(this,$).dataset.hawkResultsReveal=this.resultsRevealDirection,re(this,$).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),ce(this,q,G).call(this),ce(this,q,Pt).call(this,"empty"),re(this,p)&&ce(this,q,F).call(this,ce(this,q,rt).call(this,re(this,d)));const i=ce(this,q,ft).call(this);this.enableSecondColumn&&i.url&&ce(this,q,wt).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),re(this,$).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),re(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ce(this,q,Z).call(this,t.dataset.density)})}),re(this,x).addEventListener("input",()=>{ce(this,q,$t).call(this,re(this,x).value),ce(this,q,Jt).call(this)}),re(this,x).addEventListener("keydown",t=>ce(this,q,It).call(this,t)),re(this,x).addEventListener("focus",()=>ce(this,q,dt).call(this),{once:!0}),re(this,T).addEventListener("keydown",t=>ce(this,q,Kt).call(this,t)),re(this,L).addEventListener("keydown",t=>ce(this,q,jt).call(this,t)),re(this,L).addEventListener("focus",()=>{re(this,$).dataset.hawkShowPreview="true"}),re(this,L).addEventListener("blur",()=>{re(this,$).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>ce(this,q,Ut).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
z=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=ce(this,q,J).call(this,i),re(this,e)&&(re(this,e).apply(s),Object.entries(re(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),oe(this,c,s)},J=function(t){var e;const i=this.strings,s=(null==(e=this.triggerConfig)?void 0:e.icon)||'<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return s;if("compact"===t)return`${s}<span class="hawk-trigger-label">${i.triggerLabel}</span>`;const n=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${i.triggerKbd}</kbd>`:"";return`${s}<span class="hawk-trigger-label">${i.triggerLabelLong}</span>${n}`},Q=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.headerControls.density?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            ${this.headerControls.escape?`<button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>`:""}\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}" data-hawk-discovery="${Boolean(this.discoveryRow)}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n            ${this.discoveryRow?`<section class="hawk-discovery-row" aria-label="${ce(this,q,V).call(this,t.discoveryLabel)}" aria-live="polite"></section>`:""}\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},G=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;re(this,$).style.setProperty("--hawk-scale",String(i)),re(this,$).style.setProperty("--hawk-offset-x",ce(this,q,X).call(this,n.x)),re(this,$).style.setProperty("--hawk-offset-y",ce(this,q,X).call(this,n.y)),re(this,$).dataset.hawkPosition=s,re(this,$).dataset.hawkDensity=r,re(this,$).dataset.hawkSecondColumn=String(this.enableSecondColumn),re(this,$).querySelector(".hawk-modal-body").dataset.hawkColumns=String(this.enableSecondColumn?a:1),re(this,$).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),re(this,D)&&(null==(e=(t=re(this,D)).removeEventListener)||e.call(t,"change",re(this,W)),oe(this,D,null)),"function"==typeof window.matchMedia&&(oe(this,D,window.matchMedia(`(max-width: ${l}px)`)),oe(this,W,()=>{re(this,$).dataset.hawkCompact=String(re(this,D).matches)}),re(this,D).addEventListener("change",re(this,W)),re(this,W).call(this))},X=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
Y=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(ye):null;return we.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
Z=function(t){try{null==localStorage||localStorage.setItem(ye,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
tt=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Reads the newest-first recently viewed list. Invalid or unavailable storage is empty. */
et=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.recentlyViewedStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e.slice(0,this.maxRecentlyViewed):[]}catch(t){return[]}},it=function(t){try{null==localStorage||localStorage.setItem(this.recentlyViewedStorageKey,JSON.stringify(t))}catch(t){}},
/** Moves a selected result to the head of the bounded recent-history list. */
st=function(t){if(!this.enableRecentlyViewed||!t||ce(this,q,At).call(this,t.url))return;const e={url:t.url,title:t.title,isAnchor:Boolean(t.isAnchor),viewedAt:(new Date).toISOString()};oe(this,o,[e,...re(this,o).filter(e=>e.url!==t.url)].slice(0,this.maxRecentlyViewed)),ce(this,q,it).call(this,re(this,o)),ce(this,q,F).call(this,ce(this,q,rt).call(this,ce(this,q,nt).call(this)))},nt=function(){return(re(this,d)||[]).filter(t=>t.id!==ve&&t.id!==me)},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
at=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},lt=function(t){return re(this,h).some(e=>e.url===t)},
/** Prepends persisted utility tabs when they contain at least one visible entry. */
rt=function(t){const e=[];return this.enablePins&&re(this,h).some(t=>!ce(this,q,At).call(this,t.url))&&e.push({id:ve,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),this.enableRecentlyViewed&&re(this,o).some(t=>!ce(this,q,At).call(this,t.url))&&e.push({id:me,label:this.strings.recentlyViewedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""}),[...e,...t]},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
ht=function(t){const e=re(this,u)===ve;if(ce(this,q,lt).call(this,t.url))oe(this,h,re(this,h).filter(e=>e.url!==t.url));else{if(!(re(this,h).length<this.maxPins))return;oe(this,h,[...re(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}ce(this,q,at).call(this,re(this,h)),ce(this,q,F).call(this,ce(this,q,rt).call(this,ce(this,q,nt).call(this))),re(this,u)===ve?ce(this,q,ot).call(this):e?ce(this,q,$t).call(this,re(this,s)):ce(this,q,Mt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
ot=function(){oe(this,l,re(this,h).filter(t=>!ce(this,q,At).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),oe(this,r,new Set(re(this,l).map(t=>t.url.split("#")[0])).size),oe(this,a,re(this,l).length?0:-1),ce(this,q,Mt).call(this)},
/** Lists recently selected entries directly, newest first, without a Pagefind request. */
ct=function(){oe(this,l,re(this,o).filter(t=>!ce(this,q,At).call(this,t.url)).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),oe(this,r,new Set(re(this,l).map(t=>t.url.split("#")[0])).size),oe(this,a,re(this,l).length?0:-1),ce(this,q,Mt).call(this)},dt=function(){return de(this,null,function*(){return re(this,f)?re(this,f):re(this,S)?(oe(this,f,re(this,S)),yield ce(this,q,ut).call(this,re(this,f)),yield ce(this,q,vt).call(this),yield ce(this,q,pt).call(this),re(this,f)):(re(this,w)||oe(this,w,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>de(this,null,function*(){return yield ce(this,q,ut).call(this,t,{basePath:this.indexBasePath}),oe(this,f,t),yield ce(this,q,vt).call(this),yield ce(this,q,pt).call(this),t})).catch(t=>(oe(this,y,t),ce(this,q,gt).call(this),null))),re(this,w))})},ut=function(t){return de(this,arguments,function*(t,e={}){var i,s;if(yield null==(i=t.options)?void 0:i.call(t,se(se({},e),this.pagefindInitOptions)),yield null==(s=t.init)?void 0:s.call(t),"function"==typeof t.mergeIndex)for(const e of this.pagefindMergeIndexes)(null==e?void 0:e.bundlePath)&&(yield t.mergeIndex(e.bundlePath,e.options||{}))})},pt=function(){return de(this,null,function*(){re(this,u)!==ve?re(this,u)!==me?this.eagerResults&&!re(this,s)&&(yield ce(this,q,$t).call(this,"")):ce(this,q,ct).call(this):ce(this,q,ot).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
gt=function(){re(this,T).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,re(this,T).removeAttribute("aria-activedescendant"),re(this,R).textContent=this.strings.unavailableCounter,ce(this,q,Pt).call(this,"empty")},
/**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
ft=function(){const t=(re(this,d)||[]).find(t=>t.id===re(this,u));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
wt=function(t,e){if(t===re(this,k))return;ce(this,q,Ht).call(this),oe(this,k,t),re(this,L).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=re(this,L).querySelector(".hawk-preview-title"),n=re(this,L).querySelector(".hawk-preview-content");oe(this,v,re(this,i).typeTitle(s,e,{isAnchor:!1})),ce(this,q,Dt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},yt=function(){return de(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},vt=function(){return de(this,null,function*(){if(re(this,p))return;if(this.tabsUrl){const t=yield ce(this,q,yt).call(this);if(t)return void ce(this,q,F).call(this,ce(this,q,rt).call(this,ce(this,q,U).call(this,t)))}if(!re(this,f))return void ce(this,q,F).call(this,ce(this,q,rt).call(this,ce(this,q,U).call(this,[])));let t=[];try{const e=yield re(this,f).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ce(this,q,F).call(this,ce(this,q,rt).call(this,ce(this,q,U).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},mt=function(){const t=re(this,d)||[];re(this,E).innerHTML=t.map(t=>{const e=t.id===re(this,u),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(re(this,E).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ce(this,q,kt).call(this,t),re(this,x).focus()}),t.addEventListener("keydown",t=>ce(this,q,bt).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
kt=function(t){oe(this,u,t.dataset.filter),re(this,E).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),re(this,u)===ve?(oe(this,s,""),re(this,x).value="",ce(this,q,ot).call(this)):re(this,u)===me?(oe(this,s,""),re(this,x).value="",ce(this,q,ct).call(this)):ce(this,q,$t).call(this,re(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
bt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ce(this,q,kt).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
St=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},$t=function(t){return de(this,null,function*(){var e;oe(this,s,t),ce(this,q,Pt).call(this,"loading");const i=++(h=this,o=n,{set _(t){oe(h,o,t,c)},get _(){return re(h,o,p)}})._;var h,o,c,p;if(yield ce(this,q,dt).call(this),!re(this,f))return;const g=(re(this,d)||[]).find(t=>t.id===re(this,u)),{filters:w,remainingQuery:v}=ce(this,q,St).call(this,t),m=(null==g?void 0:g.filter)||w?se(se({},(null==g?void 0:g.filter)||{}),w||{}):null,k=se(se(se({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),m?{filters:m}:{}),b=this.inlineFilters?v:t;let S;try{({results:S}=b.trim()?yield re(this,f).debouncedSearch(b,k):yield re(this,f).search(null,k))}catch(t){return oe(this,y,t),void ce(this,q,gt).call(this)}if(i!==re(this,n))return;const $=[];for(const t of S||[]){const i=yield t.data();if(!ce(this,q,At).call(this,i.url)){$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}});if($.length>=this.maxResults)break}}oe(this,l,$.slice(0,this.maxResults)),oe(this,r,new Set(re(this,l).map(t=>t.url.split("#")[0])).size),oe(this,a,re(this,l).length?0:-1),ce(this,q,Mt).call(this)})},
/**
   * Normalizes a result URL to page identity for `excludePages`: origin, search, hash, and a
   * trailing slash are irrelevant. A fixed base keeps relative paths deterministic everywhere.
   */
xt=function(t){try{const e=new URL(String(t),"https://hawk.local/").pathname;return"/"===e?"/":e.replace(/\/$/,"")}catch(e){return String(t).split(/[?#]/,1)[0].replace(/\/$/,"")||"/"}},At=function(t){return this.excludePages.has(ce(this,q,xt).call(this,t))},Mt=function(){if(!re(this,l).length)return re(this,T).innerHTML=`<div class="hawk-empty">${this.strings.noResults(ce(this,q,V).call(this,re(this,s)))}</div>`,re(this,T).removeAttribute("aria-activedescendant"),re(this,R).textContent=re(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,ce(this,q,Rt).call(this),void ce(this,q,Pt).call(this,"empty");re(this,R).textContent=re(this,s)?this.strings.matchingResults(re(this,l).length,re(this,r)):this.strings.entries(re(this,l).length,re(this,r)),re(this,T).innerHTML=re(this,l).map((t,e)=>{const i=this.enablePins&&ce(this,q,lt).call(this,t.url),s=Math.min(e,10);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${t.isAnchor?" hawk-result-item--subpage":""}${e===re(this,a)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===re(this,a)}" style="--hawk-row-index: ${s}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.title}</span>\n            ${this.enablePins?`<span class="hawk-pin-btn${i?" is-pinned":""}" role="button" aria-pressed="${i}" data-index="${e}">${i?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n          ${ce(this,q,Ct).call(this,t)}\n        </a>`}).join(""),re(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${re(this,a)}`),re(this,T).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ce(this,q,Et).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void ce(this,q,ht).call(this,re(this,l)[s]);ce(this,q,st).call(this,re(this,l)[s]),null==(i=this.onSelect)||i.call(this,re(this,l)[s])})}),ce(this,q,Rt).call(this),ce(this,q,Pt).call(this,"ready")},
/**
   * Renders the optional discovery row exclusively from Pagefind's indexed result payload.
   * Iteration order is unchanged, so the compact links preserve Pagefind's ranking.
   */
Pt=function(t){if(!re(this,C)||!this.discoveryRow)return;const e=Object.entries(this.discoveryRow).filter(([,t])=>t);if(!e.length)return void(re(this,C).hidden=!0);if(re(this,C).hidden=!1,re(this,C).setAttribute("aria-busy",String("loading"===t)),"loading"===t)return void(re(this,C).innerHTML=`<div class="hawk-discovery-status" role="status">${ce(this,q,V).call(this,this.strings.discoveryLoading)}</div>`);const i="empty"===t?{matches:[],pages:[],headings:[]}:ce(this,q,Tt).call(this),s={matches:this.strings.discoveryMatches,pages:this.strings.discoveryPages,headings:this.strings.discoveryHeadings};re(this,C).innerHTML=e.map(([t,e])=>{const n=i[t].slice(0,e.maxItems),a=n.length?`<ul class="hawk-discovery-list">${n.map(t=>`\n              <li><a class="hawk-discovery-link" href="${ce(this,q,V).call(this,ce(this,q,Lt).call(this,t.url))}" aria-label="${ce(this,q,V).call(this,`${t.label}: ${t.context}`)}">${ce(this,q,V).call(this,t.label)}</a></li>`).join("")}</ul>`:`<p class="hawk-discovery-empty">${ce(this,q,V).call(this,this.strings.discoveryEmpty)}</p>`;return`<div class="hawk-discovery-group" data-hawk-discovery-group="${t}">\n          <h3 class="hawk-discovery-title">${ce(this,q,V).call(this,e.label||s[t])}</h3>\n          ${a}\n        </div>`}).join("")},
/** Produces stable, de-duplicated link groups without fetching or parsing source pages. */
Tt=function(){var t;const e={matches:[],pages:[],headings:[]},i={matches:new Set,pages:new Set,headings:new Set};for(const s of re(this,l)){const n=String(s.url||"").split("#")[0],a=(null==(t=s.meta)?void 0:t.title)||(s.isAnchor?this.strings.untitled:s.title);n&&!i.pages.has(n)&&(i.pages.add(n),e.pages.push({label:a,context:a,url:n})),s.isAnchor&&s.url&&!i.headings.has(s.url)&&(i.headings.add(s.url),e.headings.push({label:s.title,context:a,url:s.url}));const l=document.createElement("div");l.innerHTML=s.excerpt||"";for(const t of l.querySelectorAll("mark")){const n=t.textContent.trim().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,""),l=n.toLocaleLowerCase();n&&!i.matches.has(l)&&(i.matches.add(l),e.matches.push({label:n,context:s.title||a,url:s.url}))}}return e},
/** Converts same-origin Pagefind URLs to path-relative navigation targets, preserving fragments. */
Lt=function(t){try{const e=new URL(String(t),document.baseURI);return e.origin===window.location.origin?`${e.pathname}${e.search}${e.hash}`:e.href}catch(e){return String(t)}},Ct=function(t){var e,i,s;const n=this.showResultDate?null==(e=t.meta)?void 0:e[this.resultDateMetaKey]:"",a=this.showResultTags?null==(i=t.meta)?void 0:i[this.resultTagsMetaKey]:"",l=String(a||"").split(",").map(t=>t.trim()).filter(Boolean);this.showResultTags&&(null==(s=t.meta)?void 0:s.section)&&l.unshift(t.meta.section);const r=Array.from(new Set(l));if(!n&&!r.length)return"";return`<div class="hawk-result-meta">${n?`<time class="hawk-result-date" datetime="${ce(this,q,V).call(this,String(n))}">${ce(this,q,V).call(this,String(n))}</time>`:""}<div class="hawk-result-tags">${r.map(t=>`<span class="hawk-result-tag">${ce(this,q,V).call(this,t)}</span>`).join("")}</div></div>`},Et=function(t,e){oe(this,a,t),re(this,T).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),re(this,T).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ce(this,q,Rt).call(this)},Rt=function(){var t;if(!this.enableSecondColumn)return;const e=re(this,l)[re(this,a)];if(!e){const t=ce(this,q,ft).call(this);return void(t.url?ce(this,q,wt).call(this,t.url,t.title):(ce(this,q,Ht).call(this),oe(this,k,null),re(this,L).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===re(this,k))return;ce(this,q,Ht).call(this),oe(this,k,s),re(this,L).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${this.showResultTags&&(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=re(this,L).querySelector(".hawk-preview-title"),r=re(this,L).querySelector(".hawk-preview-content");oe(this,v,re(this,i).typeTitle(n,e.title,{isAnchor:e.isAnchor})),ce(this,q,Dt).call(this,e,s,r)},
/** Stops both independently controlled preview animation surfaces. */
Ht=function(){re(this,i).stop(re(this,v)),re(this,i).stop(re(this,m)),oe(this,v,null),oe(this,m,null)},Dt=function(t,e,s){return de(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ce(this,q,qt).call(this,e);t.isAnchor&&i?n=ce(this,q,Nt).call(this,s,i):this.previewSections?(a=ce(this,q,Wt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}re(this,k)===e&&(a&&a.length?ce(this,q,Ot).call(this,a,t,s):oe(this,m,re(this,i).typeContent(s,n)))})},
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
Wt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
Ot=function(t,e,s){const n=e.url.split("#")[0],a=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${n}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join("");s.addEventListener("click",i=>{var s;const a=i.target.closest(".hawk-preview-section-row");if(!a)return;const l=a.getAttribute("href"),r=t.find(t=>`${n}#${t.slug}`===l);if(!r)return;const h={title:r.title,url:l,excerpt:r.excerpt,isAnchor:!0,meta:e.meta||{}};ce(this,q,st).call(this,h),null==(s=this.onSelect)||s.call(this,h)}),oe(this,m,re(this,i).typeContent(s,a))},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
qt=function(t){if(re(this,b).has(t))return re(this,b).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw re(this,b).delete(t),e});return re(this,b).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
Nt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
It=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),re(this,l).length&&ce(this,q,Et).call(this,(re(this,a)+1)%re(this,l).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),re(this,l).length&&ce(this,q,Et).call(this,(re(this,a)-1+re(this,l).length)%re(this,l).length,!0);else if("Enter"===t.key){const t=re(this,l)[re(this,a)];t&&(ce(this,q,st).call(this,t),null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
Kt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),re(this,x).focus(),re(this,x).value+=t.key,void re(this,x).dispatchEvent(new Event("input"));ce(this,q,It).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
jt=function(t){"ArrowDown"===t.key?(t.preventDefault(),re(this,L).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),re(this,L).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),re(this,L).scrollTop+=re(this,L).clientHeight):"PageUp"===t.key?(t.preventDefault(),re(this,L).scrollTop-=re(this,L).clientHeight):"Home"===t.key?(t.preventDefault(),re(this,L).scrollTop=0):"End"===t.key&&(t.preventDefault(),re(this,L).scrollTop=re(this,L).scrollHeight)},Ut=function(t){re(this,g)&&"Tab"===t.key&&ce(this,q,Ft).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),re(this,g)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&re(this,g)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
Bt=function(){if(!this.enableSecondColumn)return!1;return!("true"===re(this,$).dataset.hawkCompact||"compact"===this.params.density)||"true"===re(this,$).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Vt=function(){var t;return[re(this,x),...this.headerControls.density?Array.from(re(this,$).querySelectorAll(".hawk-density-btn")):[],re(this,$).querySelector(".hawk-modal-esc"),re(this,E).querySelector('.hawk-filter-pill[tabindex="0"]'),re(this,T),...ce(this,q,Bt).call(this)?[re(this,L)]:[],...Array.from((null==(t=re(this,C))?void 0:t.querySelectorAll(".hawk-discovery-link"))||[])].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
Ft=function(t){const e=ce(this,q,Vt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
_t=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
zt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(re(this,H).get(t)),re(this,H).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Jt=function(){if(!re(this,M))return;const t=re(this,g)&&!re(this,x).value;re(this,A).dataset.hawkInputActive=String(!t),t&&!re(this,P)?oe(this,P,re(this,i).rotatePlaceholder(re(this,M),this.rotatingPlaceholders)):!t&&re(this,P)&&(re(this,i).stop(re(this,P)),oe(this,P,null))},ae(xe,"themes",pe),ae(xe,"animations",ge),"undefined"!=typeof window&&(window.Hawk=xe),t.HawkSearch=xe,t.default=xe,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.js.map
