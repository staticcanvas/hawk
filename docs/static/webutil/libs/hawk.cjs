/*! hawk v0.5.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,d,u,p,f,w,g,y,v,m,k,b,S,$,x,A,P,T,M,E,L,C,H,W,D,O,q,N,U,j,K,B,R,F,I,z,_,J,Q,G,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,wt,gt,yt,vt,mt,kt,bt,St,$t,xt,At,Pt,Tt,Mt,Et,Lt=Object.defineProperty,Ct=Object.defineProperties,Ht=Object.getOwnPropertyDescriptors,Wt=Object.getOwnPropertySymbols,Dt=Object.prototype.hasOwnProperty,Ot=Object.prototype.propertyIsEnumerable,qt=t=>{throw TypeError(t)},Nt=(t,e,i)=>e in t?Lt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Ut=(t,e)=>{for(var i in e||(e={}))Dt.call(e,i)&&Nt(t,i,e[i]);if(Wt)for(var i of Wt(e))Ot.call(e,i)&&Nt(t,i,e[i]);return t},jt=(t,e)=>Ct(t,Ht(e)),Kt=(t,e,i)=>Nt(t,"symbol"!=typeof e?e+"":e,i),Bt=(t,e,i)=>e.has(t)||qt("Cannot "+i),Rt=(t,e,i)=>(Bt(t,e,"read from private field"),i?i.call(t):e.get(t)),Ft=(t,e,i)=>e.has(t)?qt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),It=(t,e,i,s)=>(Bt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),zt=(t,e,i)=>(Bt(t,e,"access private method"),i),_t=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Jt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Jt);const Qt=new Map,Gt=new Map;Gt.set("instant",Jt);const Vt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Xt=new Set(["fit","medium","compact"]),Yt="hawk:density",Zt="pinned",te={open:!0,slash:!0,escape:!0},ee={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},ie={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let se=0;class ne{
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
     * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, sort?: Record<string, 'asc'|'desc'>, pagefindOptions?: Record<string, unknown>, defaultPreviewUrl?: string, defaultPreviewTitle?: string}>} [config.tabs]
     *   Explicit tab list. `filter` is a raw Pagefind `filters` object (passed to `search()`/`debouncedSearch()`
     *   verbatim) — omit it for a filterless tab (e.g. "All"). `sort` is shorthand for
     *   `pagefindOptions: { sort }` — Pagefind's own sort object (e.g. `{ date: 'desc' }`), which needs the
     *   sorted field marked on every page via `data-pagefind-sort="date"` (see Pagefind's own docs); a tab
     *   using `sort` is a listing, not ranked search, so it's most useful paired with an otherwise-filterless
     *   or category-filtered tab a visitor browses rather than searches. `defaultPreviewUrl`/`defaultPreviewTitle`
     *   override `config.defaultPreviewUrl`/`config.defaultPreviewTitle` while this tab is active and nothing is
     *   selected (zero matches, or before a query is typed) — see the top-level options below for the
     *   fetch/extract behavior those share. Replaces auto-derivation from Pagefind's `filters()` entirely and
     *   renders synchronously on mount instead of waiting for Pagefind to load. Ignored if `config.tabsUrl` is
     *   also given (this wins, being available with zero latency).
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
     *   `search()`/`debouncedSearch()` call (e.g. `sort`, `ranking`, `language`) — an escape hatch for Pagefind
     *   tuning hawk doesn't otherwise wrap. A tab's own `pagefindOptions` merges over this per-tab.
     * @param {string} [config.categoryFilterName='category'] The Pagefind filter dimension used for the
     *   auto-derived tabs and the `categories` shorthand (see `data-pagefind-filter`).
     * @param {number} [config.maxResults=18] Maximum rendered result rows.
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
constructor(t={}){var N,U,j,B,R,F;if(Ft(this,W),Ft(this,e),Ft(this,i),Ft(this,s),Ft(this,n),Ft(this,a),Ft(this,l),Ft(this,r),Ft(this,h),Ft(this,o),Ft(this,c),Ft(this,d),Ft(this,u),Ft(this,p),Ft(this,f),Ft(this,w),Ft(this,g),Ft(this,y),Ft(this,v),Ft(this,m),Ft(this,k),Ft(this,b),Ft(this,S),Ft(this,$),Ft(this,x),Ft(this,A),Ft(this,P),Ft(this,T),Ft(this,M),Ft(this,E),Ft(this,L),Ft(this,C),Ft(this,H),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${se+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,It(this,m,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const I=zt(this,W,_).call(this);this.params=jt(Ut(Ut(Ut({},Vt),I?{density:I}:{}),t.params),{offset:Ut(Ut({},Vt.offset),null==(N=t.params)?void 0:N.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.tabsUrl=t.tabs||t.categories?null:t.tabsUrl||null,this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(U=t.maxResults)?U:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=t.maxPins)?j:20,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(B=t.previewSectionExcerptLength)?B:140,this.triggerConfig=t.trigger||null,this.hotkeys=Ut(Ut({},te),t.hotkeys),this.strings=Ut(Ut({},ie),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.revealAnimation=!1!==t.revealAnimation&&(t.revealAnimation||"scale-fade"),this.revealDuration=null!=(F=null!=(R=t.revealDuration)?R:ee[this.revealAnimation])?F:220,this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,It(this,e,zt(this,W,D).call(this,t.theme)),It(this,i,zt(this,W,O).call(this,t.animation)),It(this,s,""),It(this,n,-1),It(this,a,[]),It(this,l,0),It(this,r,this.enablePins?zt(this,W,Q).call(this):[]),It(this,c,t.defaultTab||"all"),It(this,o,zt(this,W,q).call(this,t)),It(this,d,null!==Rt(this,o)),It(this,u,!1),It(this,p,null),It(this,f,null),It(this,w,null),It(this,g,null),It(this,y,null),It(this,v,new Map),It(this,E,new Map),this.container&&zt(this,W,K).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){Qt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){Gt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Rt(this,u),query:Rt(this,s),selectedIndex:Rt(this,n),matches:Rt(this,a),pageCount:Rt(this,l),pins:Rt(this,r),activeTab:Rt(this,c),error:Rt(this,w)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=jt(Ut(Ut({},this.params),t),{offset:Ut(Ut({},this.params.offset),null==t?void 0:t.offset)}),zt(this,W,I).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(Rt(this,H)),delete Rt(this,k).dataset.hawkAnimState,Rt(this,k).hidden=!1,document.body.style.overflow="hidden",It(this,u,!0),zt(this,W,tt).call(this),zt(this,W,Et).call(this),zt(this,W,Tt).call(this)&&(Rt(this,k).dataset.hawkAnimState="opening",It(this,H,setTimeout(()=>{delete Rt(this,k).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{Rt(this,b).focus(),Rt(this,b).select()},40),null==(t=this.onOpen)||t.call(this,Rt(this,s))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",It(this,u,!1),zt(this,W,Et).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(Rt(this,H)),zt(this,W,Tt).call(this)?(Rt(this,k).dataset.hawkAnimState="closing",It(this,H,setTimeout(()=>{Rt(this,k).hidden=!0,delete Rt(this,k).dataset.hawkAnimState},this.revealDuration))):Rt(this,k).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;Rt(this,i).stop(Rt(this,g)),Rt(this,x)&&Rt(this,i).stop(Rt(this,x)),null==(e=null==(t=Rt(this,L))?void 0:t.removeEventListener)||e.call(t,"change",Rt(this,C)),Rt(this,E).forEach(t=>clearTimeout(t)),clearTimeout(Rt(this,H)),null==(s=Rt(this,k))||s.remove(),null==(n=Rt(this,h))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,g=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,T=new WeakMap,M=new WeakMap,E=new WeakMap,L=new WeakMap,C=new WeakMap,H=new WeakMap,W=new WeakSet,D=function(t){if(!t)return Qt.get("typeflow")||null;if("string"==typeof t){const e=Qt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},O=function(t){if(!1===t)return Gt.get("instant");if(!t)return Gt.get("typeflow")||Gt.get("instant");if("string"==typeof t){const e=Gt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
q=function(t){return t.tabs?zt(this,W,N).call(this,t.tabs):t.categories?zt(this,W,N).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
N=function(t){const e=t.map(t=>({id:t.id||zt(this,W,U).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?jt(Ut({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||""}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},U=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
j=function(t){var e,i;It(this,o,t),t.some(t=>t.id===Rt(this,c))||("all"!==Rt(this,c)&&Rt(this,c)!==Zt&&console.warn(`HawkSearch: no tab with id "${Rt(this,c)}" (defaultTab); falling back to "all".`),It(this,c,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),zt(this,W,rt).call(this)},K=function(){zt(this,W,B).call(this);const t=document.createElement("div");t.innerHTML=zt(this,W,F).call(this),It(this,k,t.firstElementChild),this.container.appendChild(Rt(this,k)),It(this,b,Rt(this,k).querySelector(".hawk-modal-input")),It(this,S,Rt(this,k).querySelector(".hawk-input-wrap")),It(this,$,Rt(this,k).querySelector(".hawk-input-ghost")),Rt(this,$)&&(Rt(this,$).textContent=this.rotatingPlaceholders[0],zt(this,W,Et).call(this)),It(this,A,Rt(this,k).querySelector(".hawk-results-pane")),It(this,P,Rt(this,k).querySelector(".hawk-preview-pane")),It(this,T,Rt(this,k).querySelector(".hawk-modal-filters")),It(this,M,Rt(this,k).querySelector(".hawk-modal-counter")),[Rt(this,A),Rt(this,P),Rt(this,T)].forEach(t=>zt(this,W,Mt).call(this,t)),Rt(this,e)&&(Rt(this,e).apply(Rt(this,k)),Object.entries(Rt(this,e).tokens||{}).forEach(([t,e])=>{Rt(this,k).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Rt(this,k).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(Rt(this,k).dataset.hawkReveal=this.revealAnimation,Rt(this,k).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),zt(this,W,I).call(this),Rt(this,d)&&zt(this,W,j).call(this,zt(this,W,X).call(this,Rt(this,o)));const i=zt(this,W,st).call(this);i.url&&zt(this,W,nt).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Rt(this,k).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Rt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),zt(this,W,J).call(this,t.dataset.density)})}),Rt(this,b).addEventListener("input",()=>{zt(this,W,dt).call(this,Rt(this,b).value),zt(this,W,Et).call(this)}),Rt(this,b).addEventListener("keydown",t=>zt(this,W,kt).call(this,t)),Rt(this,b).addEventListener("focus",()=>zt(this,W,tt).call(this),{once:!0}),Rt(this,A).addEventListener("keydown",t=>zt(this,W,bt).call(this,t)),Rt(this,P).addEventListener("keydown",t=>zt(this,W,St).call(this,t)),Rt(this,P).addEventListener("focus",()=>{Rt(this,k).dataset.hawkShowPreview="true"}),Rt(this,P).addEventListener("blur",()=>{Rt(this,k).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>zt(this,W,$t).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
B=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=zt(this,W,R).call(this,i),Rt(this,e)&&(Rt(this,e).apply(s),Object.entries(Rt(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),It(this,h,s)},R=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},F=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},I=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Rt(this,k).style.setProperty("--hawk-scale",String(i)),Rt(this,k).style.setProperty("--hawk-offset-x",zt(this,W,z).call(this,n.x)),Rt(this,k).style.setProperty("--hawk-offset-y",zt(this,W,z).call(this,n.y)),Rt(this,k).dataset.hawkPosition=s,Rt(this,k).dataset.hawkDensity=r,Rt(this,k).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Rt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Rt(this,L)&&(null==(e=(t=Rt(this,L)).removeEventListener)||e.call(t,"change",Rt(this,C)),It(this,L,null)),"function"==typeof window.matchMedia&&(It(this,L,window.matchMedia(`(max-width: ${l}px)`)),It(this,C,()=>{Rt(this,k).dataset.hawkCompact=String(Rt(this,L).matches)}),Rt(this,L).addEventListener("change",Rt(this,C)),Rt(this,C).call(this))},z=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
_=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Yt):null;return Xt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
J=function(t){try{null==localStorage||localStorage.setItem(Yt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
G=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},V=function(t){return Rt(this,r).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
X=function(t){return this.enablePins&&Rt(this,r).length?[{id:Zt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
Y=function(t){const e=Rt(this,c)===Zt;if(zt(this,W,V).call(this,t.url))It(this,r,Rt(this,r).filter(e=>e.url!==t.url));else{if(!(Rt(this,r).length<this.maxPins))return;It(this,r,[...Rt(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}zt(this,W,G).call(this,Rt(this,r)),zt(this,W,j).call(this,zt(this,W,X).call(this,(Rt(this,o)||[]).filter(t=>t.id!==Zt))),Rt(this,c)===Zt?zt(this,W,Z).call(this):e?zt(this,W,dt).call(this,Rt(this,s)):zt(this,W,ut).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
Z=function(){It(this,a,Rt(this,r).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),It(this,l,new Set(Rt(this,a).map(t=>t.url.split("#")[0])).size),It(this,n,Rt(this,a).length?0:-1),zt(this,W,ut).call(this)},tt=function(){return _t(this,null,function*(){return Rt(this,p)?Rt(this,p):Rt(this,m)?(It(this,p,Rt(this,m)),yield zt(this,W,lt).call(this),yield zt(this,W,et).call(this),Rt(this,p)):(Rt(this,f)||It(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>_t(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),It(this,p,t),yield zt(this,W,lt).call(this),yield zt(this,W,et).call(this),t})).catch(t=>(It(this,w,t),zt(this,W,it).call(this),null))),Rt(this,f))})},et=function(){return _t(this,null,function*(){Rt(this,c)!==Zt?this.eagerResults&&!Rt(this,s)&&(yield zt(this,W,dt).call(this,"")):zt(this,W,Z).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
it=function(){Rt(this,A).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Rt(this,A).removeAttribute("aria-activedescendant"),Rt(this,M).textContent=this.strings.unavailableCounter},
/**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
st=function(){const t=(Rt(this,o)||[]).find(t=>t.id===Rt(this,c));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
nt=function(t,e){if(t===Rt(this,y))return;It(this,y,t),Rt(this,P).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=Rt(this,P).querySelector(".hawk-preview-title"),n=Rt(this,P).querySelector(".hawk-preview-content");Rt(this,i).typeTitle(s,e,{isAnchor:!1}),zt(this,W,wt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},at=function(){return _t(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},lt=function(){return _t(this,null,function*(){if(Rt(this,d))return;if(this.tabsUrl){const t=yield zt(this,W,at).call(this);if(t)return void zt(this,W,j).call(this,zt(this,W,X).call(this,zt(this,W,N).call(this,t)))}if(!Rt(this,p))return void zt(this,W,j).call(this,zt(this,W,X).call(this,zt(this,W,N).call(this,[])));let t=[];try{const e=yield Rt(this,p).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}zt(this,W,j).call(this,zt(this,W,X).call(this,zt(this,W,N).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},rt=function(){const t=Rt(this,o)||[];Rt(this,T).innerHTML=t.map(t=>{const e=t.id===Rt(this,c);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Rt(this,T).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{zt(this,W,ht).call(this,t),Rt(this,b).focus()}),t.addEventListener("keydown",t=>zt(this,W,ot).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
ht=function(t){It(this,c,t.dataset.filter),Rt(this,T).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Rt(this,c)===Zt?(It(this,s,""),Rt(this,b).value="",zt(this,W,Z).call(this)):zt(this,W,dt).call(this,Rt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
ot=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),zt(this,W,ht).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
ct=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},dt=function(t){return _t(this,null,function*(){var e;if(It(this,s,t),yield zt(this,W,tt).call(this),!Rt(this,p))return;const i=(Rt(this,o)||[]).find(t=>t.id===Rt(this,c)),{filters:r,remainingQuery:h}=zt(this,W,ct).call(this,t),d=(null==i?void 0:i.filter)||r?Ut(Ut({},(null==i?void 0:i.filter)||{}),r||{}):null,u=Ut(Ut(Ut({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),d?{filters:d}:{}),f=this.inlineFilters?h:t;let g;try{({results:g}=f.trim()?yield Rt(this,p).debouncedSearch(f,u):yield Rt(this,p).search(null,u))}catch(t){return It(this,w,t),void zt(this,W,it).call(this)}const y=[];for(const t of(g||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}It(this,a,y.slice(0,this.maxResults)),It(this,l,new Set(Rt(this,a).map(t=>t.url.split("#")[0])).size),It(this,n,Rt(this,a).length?0:-1),zt(this,W,ut).call(this)})},ut=function(){if(!Rt(this,a).length)return Rt(this,A).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Rt(this,s))}</div>`,Rt(this,A).removeAttribute("aria-activedescendant"),Rt(this,M).textContent=Rt(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void zt(this,W,ft).call(this);Rt(this,M).textContent=Rt(this,s)?this.strings.matchingResults(Rt(this,a).length,Rt(this,l)):this.strings.entries(Rt(this,a).length,Rt(this,l)),Rt(this,A).innerHTML=Rt(this,a).map((t,e)=>{var i;const s=this.enablePins&&zt(this,W,V).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Rt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Rt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Rt(this,A).setAttribute("aria-activedescendant",`${this.id}-result-${Rt(this,n)}`),Rt(this,A).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>zt(this,W,pt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void zt(this,W,Y).call(this,Rt(this,a)[s]);null==(i=this.onSelect)||i.call(this,Rt(this,a)[s])})}),zt(this,W,ft).call(this)},pt=function(t,e){It(this,n,t),Rt(this,A).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Rt(this,A).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),zt(this,W,ft).call(this)},ft=function(){var t;const e=Rt(this,a)[Rt(this,n)];if(!e){const t=zt(this,W,st).call(this);return void(t.url?zt(this,W,nt).call(this,t.url,t.title):(It(this,y,null),Rt(this,P).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=e.url;if(s===Rt(this,y))return;It(this,y,s),Rt(this,i).stop(Rt(this,g)),Rt(this,P).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Rt(this,P).querySelector(".hawk-preview-title"),r=Rt(this,P).querySelector(".hawk-preview-content");Rt(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),zt(this,W,wt).call(this,e,s,r)},wt=function(t,e,s){return _t(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield zt(this,W,vt).call(this,e);t.isAnchor&&i?n=zt(this,W,mt).call(this,s,i):this.previewSections?(a=zt(this,W,gt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}Rt(this,y)===e&&(a&&a.length?zt(this,W,yt).call(this,a,t,s):It(this,g,Rt(this,i).typeContent(s,n)))})},
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
gt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
yt=function(t,e,i){const s=e.url.split("#")[0];i.innerHTML=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${s}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join(""),i.querySelectorAll(".hawk-preview-section-row").forEach((i,n)=>{i.addEventListener("click",()=>{var i;const a=t[n];null==(i=this.onSelect)||i.call(this,{title:a.title,url:`${s}#${a.slug}`,excerpt:a.excerpt,isAnchor:!0,meta:e.meta||{}})})})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
vt=function(t){if(Rt(this,v).has(t))return Rt(this,v).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Rt(this,v).delete(t),e});return Rt(this,v).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
mt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
kt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Rt(this,a).length&&zt(this,W,pt).call(this,(Rt(this,n)+1)%Rt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Rt(this,a).length&&zt(this,W,pt).call(this,(Rt(this,n)-1+Rt(this,a).length)%Rt(this,a).length,!0);else if("Enter"===t.key){const t=Rt(this,a)[Rt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
bt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Rt(this,b).focus(),Rt(this,b).value+=t.key,void Rt(this,b).dispatchEvent(new Event("input"));zt(this,W,kt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
St=function(t){"ArrowDown"===t.key?(t.preventDefault(),Rt(this,P).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Rt(this,P).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Rt(this,P).scrollTop+=Rt(this,P).clientHeight):"PageUp"===t.key?(t.preventDefault(),Rt(this,P).scrollTop-=Rt(this,P).clientHeight):"Home"===t.key?(t.preventDefault(),Rt(this,P).scrollTop=0):"End"===t.key&&(t.preventDefault(),Rt(this,P).scrollTop=Rt(this,P).scrollHeight)},$t=function(t){Rt(this,u)&&"Tab"===t.key&&zt(this,W,Pt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Rt(this,u)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Rt(this,u)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
xt=function(){return!("true"===Rt(this,k).dataset.hawkCompact||"compact"===this.params.density)||"true"===Rt(this,k).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
At=function(){return[Rt(this,b),...this.params.allowDensityToggle?Array.from(Rt(this,k).querySelectorAll(".hawk-density-btn")):[],Rt(this,k).querySelector(".hawk-modal-esc"),Rt(this,T).querySelector('.hawk-filter-pill[tabindex="0"]'),Rt(this,A),...zt(this,W,xt).call(this)?[Rt(this,P)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
Pt=function(t){const e=zt(this,W,At).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
Tt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
Mt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Rt(this,E).get(t)),Rt(this,E).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Et=function(){if(!Rt(this,$))return;const t=Rt(this,u)&&!Rt(this,b).value;Rt(this,S).dataset.hawkInputActive=String(!t),t&&!Rt(this,x)?It(this,x,Rt(this,i).rotatePlaceholder(Rt(this,$),this.rotatingPlaceholders)):!t&&Rt(this,x)&&(Rt(this,i).stop(Rt(this,x)),It(this,x,null))},Kt(ne,"themes",Qt),Kt(ne,"animations",Gt),"undefined"!=typeof window&&(window.Hawk=ne),t.HawkSearch=ne,t.default=ne,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
