/*! hawk v0.5.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,d,u,p,f,w,g,y,v,m,k,b,S,$,x,A,P,E,L,M,T,C,H,W,D,q,O,N,U,j,K,B,R,F,I,z,J,Q,G,_,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,wt,gt,yt,vt,mt,kt,bt,St,$t,xt,At,Pt,Et,Lt,Mt=Object.defineProperty,Tt=Object.defineProperties,Ct=Object.getOwnPropertyDescriptors,Ht=Object.getOwnPropertySymbols,Wt=Object.prototype.hasOwnProperty,Dt=Object.prototype.propertyIsEnumerable,qt=t=>{throw TypeError(t)},Ot=(t,e,i)=>e in t?Mt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Nt=(t,e)=>{for(var i in e||(e={}))Wt.call(e,i)&&Ot(t,i,e[i]);if(Ht)for(var i of Ht(e))Dt.call(e,i)&&Ot(t,i,e[i]);return t},Ut=(t,e)=>Tt(t,Ct(e)),jt=(t,e,i)=>Ot(t,"symbol"!=typeof e?e+"":e,i),Kt=(t,e,i)=>e.has(t)||qt("Cannot "+i),Bt=(t,e,i)=>(Kt(t,e,"read from private field"),i?i.call(t):e.get(t)),Rt=(t,e,i)=>e.has(t)?qt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Ft=(t,e,i,s)=>(Kt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),It=(t,e,i)=>(Kt(t,e,"access private method"),i),zt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Jt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Jt);const Qt=new Map,Gt=new Map;Gt.set("instant",Jt);const _t={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Vt=new Set(["fit","medium","compact"]),Xt="hawk:density",Yt="pinned",Zt={open:!0,slash:!0,escape:!0},te={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},ee={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let ie=0;class se{
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
constructor(O={}){var N,U,K,B,R,F;if(Rt(this,H),Rt(this,t),Rt(this,e),Rt(this,i),Rt(this,s),Rt(this,n),Rt(this,a),Rt(this,l),Rt(this,r),Rt(this,h),Rt(this,o),Rt(this,c),Rt(this,d),Rt(this,u),Rt(this,p),Rt(this,f),Rt(this,w),Rt(this,g),Rt(this,y),Rt(this,v),Rt(this,m),Rt(this,k),Rt(this,b),Rt(this,S),Rt(this,$),Rt(this,x),Rt(this,A),Rt(this,P),Rt(this,E),Rt(this,L),Rt(this,M),Rt(this,T),Rt(this,C),!O.index&&!O.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=O.id||`hawk-search-${ie+=1}`,this.indexBasePath=O.index?O.index.endsWith("/")?O.index:`${O.index}/`:null,Ft(this,v,O.pagefind||null),this.triggerSelector=O.triggerSelector||"[data-search-trigger]",this.container=O.container||("undefined"!=typeof document?document.body:null);const I=It(this,H,z).call(this);this.params=Ut(Nt(Nt(Nt({},_t),I?{density:I}:{}),O.params),{offset:Nt(Nt({},_t.offset),null==(N=O.params)?void 0:N.offset)}),this.categoryFilterName=O.categoryFilterName||"category",this.tabsUrl=O.tabs||O.categories?null:O.tabsUrl||null,this.includeAllTab=!1!==O.includeAllTab,this.pagefindOptions=O.pagefindOptions||{},this.maxResults=null!=(U=O.maxResults)?U:18,this.contentSelector=O.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=O.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=O.rotatingPlaceholders||[],this.showPoweredBy=!1!==O.showPoweredBy,this.poweredByHref=O.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==O.enablePins,this.pinStorageKey=O.pinStorageKey||"hawk:pins",this.maxPins=null!=(K=O.maxPins)?K:20,this.inlineFilters=O.inlineFilters||!1,this.previewSections=O.previewSections||!1,this.previewSectionSelector=O.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(B=O.previewSectionExcerptLength)?B:140,this.triggerConfig=O.trigger||null,this.hotkeys=Nt(Nt({},Zt),O.hotkeys),this.strings=Nt(Nt({},ee),O.strings),this.defaultPreviewUrl=O.defaultPreviewUrl||null,this.defaultPreviewTitle=O.defaultPreviewTitle||"",this.revealAnimation=!1!==O.revealAnimation&&(O.revealAnimation||"scale-fade"),this.revealDuration=null!=(F=null!=(R=O.revealDuration)?R:te[this.revealAnimation])?F:220,this.eagerResults=!1!==O.eagerResults,this.onOpen=O.onOpen,this.onClose=O.onClose,this.onSelect=O.onSelect,Ft(this,t,It(this,H,W).call(this,O.theme)),Ft(this,e,It(this,H,D).call(this,O.animation)),Ft(this,i,""),Ft(this,s,-1),Ft(this,n,[]),Ft(this,a,0),Ft(this,l,this.enablePins?It(this,H,Q).call(this):[]),Ft(this,o,O.defaultTab||"all"),Ft(this,h,It(this,H,q).call(this,O)),Ft(this,c,null!==Bt(this,h)),Ft(this,d,!1),Ft(this,u,null),Ft(this,p,null),Ft(this,f,null),Ft(this,w,null),Ft(this,g,null),Ft(this,y,new Map),Ft(this,L,new Map),this.container&&It(this,H,j).call(this)}
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
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Bt(this,d),query:Bt(this,i),selectedIndex:Bt(this,s),matches:Bt(this,n),pageCount:Bt(this,a),pins:Bt(this,l),activeTab:Bt(this,o),error:Bt(this,f)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=Ut(Nt(Nt({},this.params),t),{offset:Nt(Nt({},this.params.offset),null==t?void 0:t.offset)}),It(this,H,F).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(Bt(this,C)),delete Bt(this,m).dataset.hawkAnimState,Bt(this,m).hidden=!1,document.body.style.overflow="hidden",Ft(this,d,!0),It(this,H,Z).call(this),It(this,H,Lt).call(this),It(this,H,Pt).call(this)&&(Bt(this,m).dataset.hawkAnimState="opening",Ft(this,C,setTimeout(()=>{delete Bt(this,m).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{Bt(this,k).focus(),Bt(this,k).select()},40),null==(t=this.onOpen)||t.call(this,Bt(this,i))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",Ft(this,d,!1),It(this,H,Lt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(Bt(this,C)),It(this,H,Pt).call(this)?(Bt(this,m).dataset.hawkAnimState="closing",Ft(this,C,setTimeout(()=>{Bt(this,m).hidden=!0,delete Bt(this,m).dataset.hawkAnimState},this.revealDuration))):Bt(this,m).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;Bt(this,e).stop(Bt(this,w)),Bt(this,$)&&Bt(this,e).stop(Bt(this,$)),null==(i=null==(t=Bt(this,M))?void 0:t.removeEventListener)||i.call(t,"change",Bt(this,T)),Bt(this,L).forEach(t=>clearTimeout(t)),clearTimeout(Bt(this,C)),null==(s=Bt(this,m))||s.remove(),null==(n=Bt(this,r))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,g=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,E=new WeakMap,L=new WeakMap,M=new WeakMap,T=new WeakMap,C=new WeakMap,H=new WeakSet,W=function(t){if(!t)return Qt.get("typeflow")||null;if("string"==typeof t){const e=Qt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},D=function(t){if(!1===t)return Gt.get("instant");if(!t)return Gt.get("typeflow")||Gt.get("instant");if("string"==typeof t){const e=Gt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
q=function(t){return t.tabs?It(this,H,O).call(this,t.tabs):t.categories?It(this,H,O).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
O=function(t){const e=t.map(t=>({id:t.id||It(this,H,N).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?Ut(Nt({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||""}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},N=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
U=function(t){var e,i;Ft(this,h,t),t.some(t=>t.id===Bt(this,o))||("all"!==Bt(this,o)&&Bt(this,o)!==Yt&&console.warn(`HawkSearch: no tab with id "${Bt(this,o)}" (defaultTab); falling back to "all".`),Ft(this,o,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),It(this,H,lt).call(this)},j=function(){It(this,H,K).call(this);const e=document.createElement("div");e.innerHTML=It(this,H,R).call(this),Ft(this,m,e.firstElementChild),this.container.appendChild(Bt(this,m)),Ft(this,k,Bt(this,m).querySelector(".hawk-modal-input")),Ft(this,b,Bt(this,m).querySelector(".hawk-input-wrap")),Ft(this,S,Bt(this,m).querySelector(".hawk-input-ghost")),Bt(this,S)&&(Bt(this,S).textContent=this.rotatingPlaceholders[0],It(this,H,Lt).call(this)),Ft(this,x,Bt(this,m).querySelector(".hawk-results-pane")),Ft(this,A,Bt(this,m).querySelector(".hawk-preview-pane")),Ft(this,P,Bt(this,m).querySelector(".hawk-modal-filters")),Ft(this,E,Bt(this,m).querySelector(".hawk-modal-counter")),[Bt(this,x),Bt(this,A),Bt(this,P)].forEach(t=>It(this,H,Et).call(this,t)),Bt(this,t)&&(Bt(this,t).apply(Bt(this,m)),Object.entries(Bt(this,t).tokens||{}).forEach(([t,e])=>{Bt(this,m).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Bt(this,m).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(Bt(this,m).dataset.hawkReveal=this.revealAnimation,Bt(this,m).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),It(this,H,F).call(this),Bt(this,c)&&It(this,H,U).call(this,It(this,H,V).call(this,Bt(this,h)));const i=It(this,H,it).call(this);i.url&&It(this,H,st).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Bt(this,m).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Bt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),It(this,H,J).call(this,t.dataset.density)})}),Bt(this,k).addEventListener("input",()=>{It(this,H,ct).call(this,Bt(this,k).value),It(this,H,Lt).call(this)}),Bt(this,k).addEventListener("keydown",t=>It(this,H,mt).call(this,t)),Bt(this,k).addEventListener("focus",()=>It(this,H,Z).call(this),{once:!0}),Bt(this,x).addEventListener("keydown",t=>It(this,H,kt).call(this,t)),Bt(this,A).addEventListener("keydown",t=>It(this,H,bt).call(this,t)),Bt(this,A).addEventListener("focus",()=>{Bt(this,m).dataset.hawkShowPreview="true"}),Bt(this,A).addEventListener("blur",()=>{Bt(this,m).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>It(this,H,St).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
K=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=It(this,H,B).call(this,i),Bt(this,t)&&(Bt(this,t).apply(s),Object.entries(Bt(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),Ft(this,r,s)},B=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},R=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},F=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Bt(this,m).style.setProperty("--hawk-scale",String(i)),Bt(this,m).style.setProperty("--hawk-offset-x",It(this,H,I).call(this,n.x)),Bt(this,m).style.setProperty("--hawk-offset-y",It(this,H,I).call(this,n.y)),Bt(this,m).dataset.hawkPosition=s,Bt(this,m).dataset.hawkDensity=r,Bt(this,m).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Bt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Bt(this,M)&&(null==(e=(t=Bt(this,M)).removeEventListener)||e.call(t,"change",Bt(this,T)),Ft(this,M,null)),"function"==typeof window.matchMedia&&(Ft(this,M,window.matchMedia(`(max-width: ${l}px)`)),Ft(this,T,()=>{Bt(this,m).dataset.hawkCompact=String(Bt(this,M).matches)}),Bt(this,M).addEventListener("change",Bt(this,T)),Bt(this,T).call(this))},I=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Xt):null;return Vt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
J=function(t){try{null==localStorage||localStorage.setItem(Xt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
G=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},_=function(t){return Bt(this,l).some(e=>e.url===t)},
/**
 * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
 * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
 * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
 * "All" pill only ever being one thing, not a toggle.
 */
V=function(t){return this.enablePins&&Bt(this,l).length?[{id:Yt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""},...t]:t},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
X=function(t){const e=Bt(this,o)===Yt;if(It(this,H,_).call(this,t.url))Ft(this,l,Bt(this,l).filter(e=>e.url!==t.url));else{if(!(Bt(this,l).length<this.maxPins))return;Ft(this,l,[...Bt(this,l),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}It(this,H,G).call(this,Bt(this,l)),It(this,H,U).call(this,It(this,H,V).call(this,(Bt(this,h)||[]).filter(t=>t.id!==Yt))),Bt(this,o)===Yt?It(this,H,Y).call(this):e?It(this,H,ct).call(this,Bt(this,i)):It(this,H,dt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
Y=function(){Ft(this,n,Bt(this,l).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Ft(this,a,new Set(Bt(this,n).map(t=>t.url.split("#")[0])).size),Ft(this,s,Bt(this,n).length?0:-1),It(this,H,dt).call(this)},Z=function(){return zt(this,null,function*(){return Bt(this,u)?Bt(this,u):Bt(this,v)?(Ft(this,u,Bt(this,v)),yield It(this,H,at).call(this),yield It(this,H,tt).call(this),Bt(this,u)):(Bt(this,p)||Ft(this,p,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>zt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Ft(this,u,t),yield It(this,H,at).call(this),yield It(this,H,tt).call(this),t})).catch(t=>(Ft(this,f,t),It(this,H,et).call(this),null))),Bt(this,p))})},tt=function(){return zt(this,null,function*(){Bt(this,o)!==Yt?this.eagerResults&&!Bt(this,i)&&(yield It(this,H,ct).call(this,"")):It(this,H,Y).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
et=function(){Bt(this,x).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Bt(this,x).removeAttribute("aria-activedescendant"),Bt(this,E).textContent=this.strings.unavailableCounter},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
it=function(){const t=(Bt(this,h)||[]).find(t=>t.id===Bt(this,o));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
st=function(t,i){if(t===Bt(this,g))return;Ft(this,g,t),Bt(this,A).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=Bt(this,A).querySelector(".hawk-preview-title"),n=Bt(this,A).querySelector(".hawk-preview-content");Bt(this,e).typeTitle(s,i,{isAnchor:!1}),It(this,H,ft).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},nt=function(){return zt(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},at=function(){return zt(this,null,function*(){if(Bt(this,c))return;if(this.tabsUrl){const t=yield It(this,H,nt).call(this);if(t)return void It(this,H,U).call(this,It(this,H,V).call(this,It(this,H,O).call(this,t)))}if(!Bt(this,u))return void It(this,H,U).call(this,It(this,H,V).call(this,It(this,H,O).call(this,[])));let t=[];try{const e=yield Bt(this,u).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}It(this,H,U).call(this,It(this,H,V).call(this,It(this,H,O).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},lt=function(){const t=Bt(this,h)||[];Bt(this,P).innerHTML=t.map(t=>{const e=t.id===Bt(this,o);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Bt(this,P).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{It(this,H,rt).call(this,t),Bt(this,k).focus()}),t.addEventListener("keydown",t=>It(this,H,ht).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
rt=function(t){Ft(this,o,t.dataset.filter),Bt(this,P).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Bt(this,o)===Yt?(Ft(this,i,""),Bt(this,k).value="",It(this,H,Y).call(this)):It(this,H,ct).call(this,Bt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
ht=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),It(this,H,rt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
ot=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},ct=function(t){return zt(this,null,function*(){var e;if(Ft(this,i,t),yield It(this,H,Z).call(this),!Bt(this,u))return;const l=(Bt(this,h)||[]).find(t=>t.id===Bt(this,o)),{filters:r,remainingQuery:c}=It(this,H,ot).call(this,t),d=(null==l?void 0:l.filter)||r?Nt(Nt({},(null==l?void 0:l.filter)||{}),r||{}):null,p=Nt(Nt(Nt({},this.pagefindOptions),(null==l?void 0:l.pagefindOptions)||{}),d?{filters:d}:{}),w=this.inlineFilters?c:t;let g;try{({results:g}=w.trim()?yield Bt(this,u).debouncedSearch(w,p):yield Bt(this,u).search(null,p))}catch(t){return Ft(this,f,t),void It(this,H,et).call(this)}const y=[];for(const t of(g||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Ft(this,n,y.slice(0,this.maxResults)),Ft(this,a,new Set(Bt(this,n).map(t=>t.url.split("#")[0])).size),Ft(this,s,Bt(this,n).length?0:-1),It(this,H,dt).call(this)})},dt=function(){if(!Bt(this,n).length)return Bt(this,x).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Bt(this,i))}</div>`,Bt(this,x).removeAttribute("aria-activedescendant"),Bt(this,E).textContent=Bt(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void It(this,H,pt).call(this);Bt(this,E).textContent=Bt(this,i)?this.strings.matchingResults(Bt(this,n).length,Bt(this,a)):this.strings.entries(Bt(this,n).length,Bt(this,a)),Bt(this,x).innerHTML=Bt(this,n).map((t,e)=>{var i;const n=this.enablePins&&It(this,H,_).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Bt(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Bt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${n?" is-pinned":""}" role="button" aria-pressed="${n}" data-index="${e}">${n?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Bt(this,x).setAttribute("aria-activedescendant",`${this.id}-result-${Bt(this,s)}`),Bt(this,x).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>It(this,H,ut).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void It(this,H,X).call(this,Bt(this,n)[s]);null==(i=this.onSelect)||i.call(this,Bt(this,n)[s])})}),It(this,H,pt).call(this)},ut=function(t,e){Ft(this,s,t),Bt(this,x).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Bt(this,x).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),It(this,H,pt).call(this)},pt=function(){var t;const i=Bt(this,n)[Bt(this,s)];if(!i){const t=It(this,H,it).call(this);return void(t.url?It(this,H,st).call(this,t.url,t.title):(Ft(this,g,null),Bt(this,A).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const a=i.url;if(a===Bt(this,g))return;Ft(this,g,a),Bt(this,e).stop(Bt(this,w)),Bt(this,A).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Bt(this,A).querySelector(".hawk-preview-title"),r=Bt(this,A).querySelector(".hawk-preview-content");Bt(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),It(this,H,ft).call(this,i,a,r)},ft=function(t,i,s){return zt(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield It(this,H,yt).call(this,e);t.isAnchor&&i?n=It(this,H,vt).call(this,s,i):this.previewSections?(a=It(this,H,wt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}Bt(this,g)===i&&(a&&a.length?It(this,H,gt).call(this,a,t,s):Ft(this,w,Bt(this,e).typeContent(s,n)))})},
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
wt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
 * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
 * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
 * selection.
 */
gt=function(t,e,i){const s=e.url.split("#")[0];i.innerHTML=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${s}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join(""),i.querySelectorAll(".hawk-preview-section-row").forEach((i,n)=>{i.addEventListener("click",()=>{var i;const a=t[n];null==(i=this.onSelect)||i.call(this,{title:a.title,url:`${s}#${a.slug}`,excerpt:a.excerpt,isAnchor:!0,meta:e.meta||{}})})})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
yt=function(t){if(Bt(this,y).has(t))return Bt(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Bt(this,y).delete(t),e});return Bt(this,y).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
vt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
mt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Bt(this,n).length&&It(this,H,ut).call(this,(Bt(this,s)+1)%Bt(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Bt(this,n).length&&It(this,H,ut).call(this,(Bt(this,s)-1+Bt(this,n).length)%Bt(this,n).length,!0);else if("Enter"===t.key){const t=Bt(this,n)[Bt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
kt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Bt(this,k).focus(),Bt(this,k).value+=t.key,void Bt(this,k).dispatchEvent(new Event("input"));It(this,H,mt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
bt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Bt(this,A).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Bt(this,A).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Bt(this,A).scrollTop+=Bt(this,A).clientHeight):"PageUp"===t.key?(t.preventDefault(),Bt(this,A).scrollTop-=Bt(this,A).clientHeight):"Home"===t.key?(t.preventDefault(),Bt(this,A).scrollTop=0):"End"===t.key&&(t.preventDefault(),Bt(this,A).scrollTop=Bt(this,A).scrollHeight)},St=function(t){Bt(this,d)&&"Tab"===t.key&&It(this,H,At).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Bt(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Bt(this,d)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
$t=function(){return!("true"===Bt(this,m).dataset.hawkCompact||"compact"===this.params.density)||"true"===Bt(this,m).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
xt=function(){return[Bt(this,k),...this.params.allowDensityToggle?Array.from(Bt(this,m).querySelectorAll(".hawk-density-btn")):[],Bt(this,m).querySelector(".hawk-modal-esc"),Bt(this,P).querySelector('.hawk-filter-pill[tabindex="0"]'),Bt(this,x),...It(this,H,$t).call(this)?[Bt(this,A)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
At=function(t){const e=It(this,H,xt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
Pt=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Et=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Bt(this,L).get(t)),Bt(this,L).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
Lt=function(){if(!Bt(this,S))return;const t=Bt(this,d)&&!Bt(this,k).value;Bt(this,b).dataset.hawkInputActive=String(!t),t&&!Bt(this,$)?Ft(this,$,Bt(this,e).rotatePlaceholder(Bt(this,S),this.rotatingPlaceholders)):!t&&Bt(this,$)&&(Bt(this,e).stop(Bt(this,$)),Ft(this,$,null))},jt(se,"themes",Qt),jt(se,"animations",Gt),"undefined"!=typeof window&&(window.Hawk=se);export{se as HawkSearch,se as default};
//# sourceMappingURL=hawk.esm.js.map
