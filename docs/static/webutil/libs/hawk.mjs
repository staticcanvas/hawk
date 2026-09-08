/*! hawk v0.10.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,u,d,p,f,w,g,v,y,m,k,b,S,$,x,A,P,M,E,L,T,C,W,H,D,q,O,R,N,U,j,K,B,F,I,_,z,J,Q,G,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,ut,dt,pt,ft,wt,gt,vt,yt,mt,kt,bt,St,$t,xt,At,Pt,Mt,Et,Lt,Tt,Ct=Object.defineProperty,Wt=Object.defineProperties,Ht=Object.getOwnPropertyDescriptors,Dt=Object.getOwnPropertySymbols,qt=Object.prototype.hasOwnProperty,Ot=Object.prototype.propertyIsEnumerable,Rt=t=>{throw TypeError(t)},Nt=(t,e,i)=>e in t?Ct(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Ut=(t,e)=>{for(var i in e||(e={}))qt.call(e,i)&&Nt(t,i,e[i]);if(Dt)for(var i of Dt(e))Ot.call(e,i)&&Nt(t,i,e[i]);return t},jt=(t,e)=>Wt(t,Ht(e)),Kt=(t,e,i)=>Nt(t,"symbol"!=typeof e?e+"":e,i),Bt=(t,e,i)=>e.has(t)||Rt("Cannot "+i),Ft=(t,e,i)=>(Bt(t,e,"read from private field"),i?i.call(t):e.get(t)),It=(t,e,i)=>e.has(t)?Rt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),_t=(t,e,i,s)=>(Bt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),zt=(t,e,i)=>(Bt(t,e,"access private method"),i),Jt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Qt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Qt);const Gt=new Map,Vt=new Map;Vt.set("instant",Qt);const Xt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Yt=new Set(["fit","medium","compact"]),Zt="hawk:density",te="pinned",ee={open:!0,slash:!0,escape:!0},ie={fade:160,"scale-fade":200,"slide-down":220,"blur-zoom":260,spring:340},se={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let ne=0;class ae{
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
constructor(R={}){var N,U,j,B,F,I,_;if(It(this,H),It(this,t),It(this,e),It(this,i),It(this,s),It(this,n),It(this,a),It(this,l),It(this,r),It(this,h),It(this,o),It(this,c),It(this,u),It(this,d),It(this,p),It(this,f),It(this,w),It(this,g),It(this,v),It(this,y),It(this,m),It(this,k),It(this,b),It(this,S),It(this,$),It(this,x),It(this,A),It(this,P),It(this,M),It(this,E),It(this,L),It(this,T),It(this,C),It(this,W),!R.index&&!R.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=R.id||`hawk-search-${ne+=1}`,this.indexBasePath=R.index?R.index.endsWith("/")?R.index:`${R.index}/`:null,_t(this,m,R.pagefind||null),this.triggerSelector=R.triggerSelector||"[data-search-trigger]",this.container=R.container||("undefined"!=typeof document?document.body:null);const z=zt(this,H,J).call(this);this.params=jt(Ut(Ut(Ut({},Xt),z?{density:z}:{}),R.params),{offset:Ut(Ut({},Xt.offset),null==(N=R.params)?void 0:N.offset)}),this.categoryFilterName=R.categoryFilterName||"category",this.tabsUrl=R.tabs||R.categories?null:R.tabsUrl||null,this.includeAllTab=!1!==R.includeAllTab,this.pagefindOptions=R.pagefindOptions||{},this.maxResults=null!=(U=R.maxResults)?U:18,this.contentSelector=R.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=R.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=R.rotatingPlaceholders||[],this.showPoweredBy=!1!==R.showPoweredBy,this.poweredByHref=R.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==R.enablePins,this.pinStorageKey=R.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=R.maxPins)?j:20,this.inlineFilters=R.inlineFilters||!1,this.previewSections=R.previewSections||!1,this.previewSectionSelector=R.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(B=R.previewSectionExcerptLength)?B:140,this.triggerConfig=R.trigger||null,this.hotkeys=Ut(Ut({},ee),R.hotkeys),this.strings=Ut(Ut({},se),R.strings),this.defaultPreviewUrl=R.defaultPreviewUrl||null,this.defaultPreviewTitle=R.defaultPreviewTitle||"",this.revealAnimation=!1!==R.revealAnimation&&(R.revealAnimation||"scale-fade"),this.revealDuration=null!=(I=null!=(F=R.revealDuration)?F:ie[this.revealAnimation])?I:220,this.resultsReveal=!1!==R.resultsReveal,this.resultsRevealDirection=R.resultsRevealDirection||"up",this.resultsRevealStagger=null!=(_=R.resultsRevealStagger)?_:22,this.eagerResults=!1!==R.eagerResults,this.onOpen=R.onOpen,this.onClose=R.onClose,this.onSelect=R.onSelect,_t(this,t,zt(this,H,D).call(this,R.theme)),_t(this,e,zt(this,H,q).call(this,R.animation)),_t(this,i,""),_t(this,s,0),_t(this,n,-1),_t(this,a,[]),_t(this,l,0),_t(this,r,this.enablePins?zt(this,H,G).call(this):[]),_t(this,c,R.defaultTab||"all"),_t(this,o,zt(this,H,O).call(this,R)),_t(this,u,null!==Ft(this,o)),_t(this,d,!1),_t(this,p,null),_t(this,f,null),_t(this,w,null),_t(this,g,null),_t(this,v,null),_t(this,y,new Map),_t(this,L,new Map),this.container&&zt(this,H,K).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Gt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Vt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Ft(this,d),query:Ft(this,i),selectedIndex:Ft(this,n),matches:Ft(this,a),pageCount:Ft(this,l),pins:Ft(this,r),activeTab:Ft(this,c),error:Ft(this,w)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=jt(Ut(Ut({},this.params),t),{offset:Ut(Ut({},this.params.offset),null==t?void 0:t.offset)}),zt(this,H,_).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;clearTimeout(Ft(this,W)),delete Ft(this,k).dataset.hawkAnimState,Ft(this,k).hidden=!1,document.body.style.overflow="hidden",_t(this,d,!0),zt(this,H,et).call(this),zt(this,H,Tt).call(this),zt(this,H,Et).call(this)&&(Ft(this,k).dataset.hawkAnimState="opening",_t(this,W,setTimeout(()=>{delete Ft(this,k).dataset.hawkAnimState},this.revealDuration))),setTimeout(()=>{Ft(this,b).focus(),Ft(this,b).select()},40),null==(t=this.onOpen)||t.call(this,Ft(this,i))}
/** Closes the search modal. */close(){var t;document.body.style.overflow="",_t(this,d,!1),zt(this,H,Tt).call(this),null==(t=this.onClose)||t.call(this),clearTimeout(Ft(this,W)),zt(this,H,Et).call(this)?(Ft(this,k).dataset.hawkAnimState="closing",_t(this,W,setTimeout(()=>{Ft(this,k).hidden=!0,delete Ft(this,k).dataset.hawkAnimState},this.revealDuration))):Ft(this,k).hidden=!0}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;Ft(this,e).stop(Ft(this,g)),Ft(this,x)&&Ft(this,e).stop(Ft(this,x)),null==(i=null==(t=Ft(this,T))?void 0:t.removeEventListener)||i.call(t,"change",Ft(this,C)),Ft(this,L).forEach(t=>clearTimeout(t)),clearTimeout(Ft(this,W)),null==(s=Ft(this,k))||s.remove(),null==(n=Ft(this,h))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,g=new WeakMap,v=new WeakMap,y=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,A=new WeakMap,P=new WeakMap,M=new WeakMap,E=new WeakMap,L=new WeakMap,T=new WeakMap,C=new WeakMap,W=new WeakMap,H=new WeakSet,D=function(t){if(!t)return Gt.get("typeflow")||null;if("string"==typeof t){const e=Gt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},q=function(t){if(!1===t)return Vt.get("instant");if(!t)return Vt.get("typeflow")||Vt.get("instant");if("string"==typeof t){const e=Vt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
O=function(t){return t.tabs?zt(this,H,R).call(this,t.tabs):t.categories?zt(this,H,R).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
R=function(t){const e=t.map(t=>({id:t.id||zt(this,H,N).call(this,t.label),label:t.label,filter:t.filter||null,
// t.sort is sugar for pagefindOptions.sort — merged in rather than replacing the rest of
// a tab's own pagefindOptions, so e.g. { sort, ranking } can both be set at once.
pagefindOptions:t.sort?jt(Ut({},t.pagefindOptions||{}),{sort:t.sort}):t.pagefindOptions||null,defaultPreviewUrl:t.defaultPreviewUrl||null,defaultPreviewTitle:t.defaultPreviewTitle||"",accentColor:t.accentColor||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},N=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
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
j=function(t){var e,i;_t(this,o,t),t.some(t=>t.id===Ft(this,c))||("all"!==Ft(this,c)&&Ft(this,c)!==te&&console.warn(`HawkSearch: no tab with id "${Ft(this,c)}" (defaultTab); falling back to "all".`),_t(this,c,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),zt(this,H,ht).call(this)},K=function(){zt(this,H,B).call(this);const e=document.createElement("div");e.innerHTML=zt(this,H,I).call(this),_t(this,k,e.firstElementChild),this.container.appendChild(Ft(this,k)),_t(this,b,Ft(this,k).querySelector(".hawk-modal-input")),_t(this,S,Ft(this,k).querySelector(".hawk-input-wrap")),_t(this,$,Ft(this,k).querySelector(".hawk-input-ghost")),Ft(this,$)&&(Ft(this,$).textContent=this.rotatingPlaceholders[0],zt(this,H,Tt).call(this)),_t(this,A,Ft(this,k).querySelector(".hawk-results-pane")),_t(this,P,Ft(this,k).querySelector(".hawk-preview-pane")),_t(this,M,Ft(this,k).querySelector(".hawk-modal-filters")),_t(this,E,Ft(this,k).querySelector(".hawk-modal-counter")),[Ft(this,A),Ft(this,P),Ft(this,M)].forEach(t=>zt(this,H,Lt).call(this,t)),Ft(this,t)&&(Ft(this,t).apply(Ft(this,k)),Object.entries(Ft(this,t).tokens||{}).forEach(([t,e])=>{Ft(this,k).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Ft(this,k).dataset.hawkMarkdownStyles="off"),this.revealAnimation&&(Ft(this,k).dataset.hawkReveal=this.revealAnimation,Ft(this,k).style.setProperty("--hawk-reveal-duration",`${this.revealDuration}ms`)),this.resultsReveal&&(Ft(this,k).dataset.hawkResultsReveal=this.resultsRevealDirection,Ft(this,k).style.setProperty("--hawk-results-stagger",`${this.resultsRevealStagger}ms`)),zt(this,H,_).call(this),Ft(this,u)&&zt(this,H,j).call(this,zt(this,H,Y).call(this,Ft(this,o)));const i=zt(this,H,nt).call(this);i.url&&zt(this,H,at).call(this,i.url,i.title),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Ft(this,k).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Ft(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),zt(this,H,Q).call(this,t.dataset.density)})}),Ft(this,b).addEventListener("input",()=>{zt(this,H,dt).call(this,Ft(this,b).value),zt(this,H,Tt).call(this)}),Ft(this,b).addEventListener("keydown",t=>zt(this,H,bt).call(this,t)),Ft(this,b).addEventListener("focus",()=>zt(this,H,et).call(this),{once:!0}),Ft(this,A).addEventListener("keydown",t=>zt(this,H,St).call(this,t)),Ft(this,P).addEventListener("keydown",t=>zt(this,H,$t).call(this,t)),Ft(this,P).addEventListener("focus",()=>{Ft(this,k).dataset.hawkShowPreview="true"}),Ft(this,P).addEventListener("blur",()=>{Ft(this,k).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>zt(this,H,xt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
B=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=zt(this,H,F).call(this,i),Ft(this,t)&&(Ft(this,t).apply(s),Object.entries(Ft(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),_t(this,h,s)},F=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},I=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},_=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Ft(this,k).style.setProperty("--hawk-scale",String(i)),Ft(this,k).style.setProperty("--hawk-offset-x",zt(this,H,z).call(this,n.x)),Ft(this,k).style.setProperty("--hawk-offset-y",zt(this,H,z).call(this,n.y)),Ft(this,k).dataset.hawkPosition=s,Ft(this,k).dataset.hawkDensity=r,Ft(this,k).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Ft(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Ft(this,T)&&(null==(e=(t=Ft(this,T)).removeEventListener)||e.call(t,"change",Ft(this,C)),_t(this,T,null)),"function"==typeof window.matchMedia&&(_t(this,T,window.matchMedia(`(max-width: ${l}px)`)),_t(this,C,()=>{Ft(this,k).dataset.hawkCompact=String(Ft(this,T).matches)}),Ft(this,T).addEventListener("change",Ft(this,C)),Ft(this,C).call(this))},z=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
J=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Zt):null;return Yt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
Q=function(t){try{null==localStorage||localStorage.setItem(Zt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
G=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
V=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},X=function(t){return Ft(this,r).some(e=>e.url===t)},
/**
 * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
 * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
 * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
 * "All" pill only ever being one thing, not a toggle.
 */
Y=function(t){return this.enablePins&&Ft(this,r).length?[{id:te,label:this.strings.pinnedTab,filter:null,pagefindOptions:null,defaultPreviewUrl:null,defaultPreviewTitle:""},...t]:t},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
Z=function(t){const e=Ft(this,c)===te;if(zt(this,H,X).call(this,t.url))_t(this,r,Ft(this,r).filter(e=>e.url!==t.url));else{if(!(Ft(this,r).length<this.maxPins))return;_t(this,r,[...Ft(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}zt(this,H,V).call(this,Ft(this,r)),zt(this,H,j).call(this,zt(this,H,Y).call(this,(Ft(this,o)||[]).filter(t=>t.id!==te))),Ft(this,c)===te?zt(this,H,tt).call(this):e?zt(this,H,dt).call(this,Ft(this,i)):zt(this,H,pt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
tt=function(){_t(this,a,Ft(this,r).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),_t(this,l,new Set(Ft(this,a).map(t=>t.url.split("#")[0])).size),_t(this,n,Ft(this,a).length?0:-1),zt(this,H,pt).call(this)},et=function(){return Jt(this,null,function*(){return Ft(this,p)?Ft(this,p):Ft(this,m)?(_t(this,p,Ft(this,m)),yield zt(this,H,rt).call(this),yield zt(this,H,it).call(this),Ft(this,p)):(Ft(this,f)||_t(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Jt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),_t(this,p,t),yield zt(this,H,rt).call(this),yield zt(this,H,it).call(this),t})).catch(t=>(_t(this,w,t),zt(this,H,st).call(this),null))),Ft(this,f))})},it=function(){return Jt(this,null,function*(){Ft(this,c)!==te?this.eagerResults&&!Ft(this,i)&&(yield zt(this,H,dt).call(this,"")):zt(this,H,tt).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
st=function(){Ft(this,A).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Ft(this,A).removeAttribute("aria-activedescendant"),Ft(this,E).textContent=this.strings.unavailableCounter},
/**
 * The default preview to show when nothing is selected: the active tab's own
 * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
 * `config.defaultPreviewTitle`, else neither.
 * @returns {{url: string|null, title: string}}
 */
nt=function(){const t=(Ft(this,o)||[]).find(t=>t.id===Ft(this,c));return(null==t?void 0:t.defaultPreviewUrl)?{url:t.defaultPreviewUrl,title:t.defaultPreviewTitle}:{url:this.defaultPreviewUrl,title:this.defaultPreviewTitle}},
/**
 * Renders `url`'s content into the preview pane in place of a real selection — on mount before
 * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
 * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
 * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
 * `#matches` is non-empty.
 * @param {string} url
 * @param {string} title
 */
at=function(t,i){if(t===Ft(this,v))return;_t(this,v,t),Ft(this,P).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const s=Ft(this,P).querySelector(".hawk-preview-title"),n=Ft(this,P).querySelector(".hawk-preview-content");Ft(this,e).typeTitle(s,i,{isAnchor:!1}),zt(this,H,gt).call(this,{url:t,excerpt:"",isAnchor:!1},t,n)},lt=function(){return Jt(this,null,function*(){if("function"!=typeof fetch)return console.warn("HawkSearch: config.tabsUrl was set but fetch() isn't available in this environment — falling back to auto-derived tabs."),null;try{const t=yield fetch(this.tabsUrl),e=yield t.json();if(!Array.isArray(e))throw new Error("expected a JSON array of tab objects");return e}catch(t){return console.warn(`HawkSearch: failed to load config.tabsUrl ("${this.tabsUrl}") — falling back to auto-derived tabs.`,t),null}})},rt=function(){return Jt(this,null,function*(){if(Ft(this,u))return;if(this.tabsUrl){const t=yield zt(this,H,lt).call(this);if(t)return void zt(this,H,j).call(this,zt(this,H,Y).call(this,zt(this,H,R).call(this,t)))}if(!Ft(this,p))return void zt(this,H,j).call(this,zt(this,H,Y).call(this,zt(this,H,R).call(this,[])));let t=[];try{const e=yield Ft(this,p).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}zt(this,H,j).call(this,zt(this,H,Y).call(this,zt(this,H,R).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},ht=function(){const t=Ft(this,o)||[];Ft(this,M).innerHTML=t.map(t=>{const e=t.id===Ft(this,c),i=t.accentColor?` style="--hawk-tab-accent: ${String(t.accentColor).replace(/"/g,"&quot;")}"`:"";return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}"${i}>${t.label}</button>`}).join("");const e=Array.from(Ft(this,M).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{zt(this,H,ot).call(this,t),Ft(this,b).focus()}),t.addEventListener("keydown",t=>zt(this,H,ct).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
ot=function(t){_t(this,c,t.dataset.filter),Ft(this,M).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Ft(this,c)===te?(_t(this,i,""),Ft(this,b).value="",zt(this,H,tt).call(this)):zt(this,H,dt).call(this,Ft(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
ct=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),zt(this,H,ot).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
ut=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},dt=function(t){return Jt(this,null,function*(){var e;_t(this,i,t);const r=++(h=this,u=s,{set _(t){_t(h,u,t,d)},get _(){return Ft(h,u,f)}})._;var h,u,d,f;if(yield zt(this,H,et).call(this),!Ft(this,p))return;const g=(Ft(this,o)||[]).find(t=>t.id===Ft(this,c)),{filters:v,remainingQuery:y}=zt(this,H,ut).call(this,t),m=(null==g?void 0:g.filter)||v?Ut(Ut({},(null==g?void 0:g.filter)||{}),v||{}):null,k=Ut(Ut(Ut({},this.pagefindOptions),(null==g?void 0:g.pagefindOptions)||{}),m?{filters:m}:{}),b=this.inlineFilters?y:t;let S;try{({results:S}=b.trim()?yield Ft(this,p).debouncedSearch(b,k):yield Ft(this,p).search(null,k))}catch(t){return _t(this,w,t),void zt(this,H,st).call(this)}if(r!==Ft(this,s))return;const $=[];for(const t of(S||[]).slice(0,this.maxResults)){const i=yield t.data();$.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&$.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}_t(this,a,$.slice(0,this.maxResults)),_t(this,l,new Set(Ft(this,a).map(t=>t.url.split("#")[0])).size),_t(this,n,Ft(this,a).length?0:-1),zt(this,H,pt).call(this)})},pt=function(){if(!Ft(this,a).length)return Ft(this,A).innerHTML=`<div class="hawk-empty">${this.strings.noResults(zt(this,H,U).call(this,Ft(this,i)))}</div>`,Ft(this,A).removeAttribute("aria-activedescendant"),Ft(this,E).textContent=Ft(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void zt(this,H,wt).call(this);Ft(this,E).textContent=Ft(this,i)?this.strings.matchingResults(Ft(this,a).length,Ft(this,l)):this.strings.entries(Ft(this,a).length,Ft(this,l)),Ft(this,A).innerHTML=Ft(this,a).map((t,e)=>{var i;const s=this.enablePins&&zt(this,H,X).call(this,t.url),a=Math.min(e,10);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Ft(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Ft(this,n)}" style="--hawk-row-index: ${a}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Ft(this,A).setAttribute("aria-activedescendant",`${this.id}-result-${Ft(this,n)}`),Ft(this,A).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>zt(this,H,ft).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void zt(this,H,Z).call(this,Ft(this,a)[s]);null==(i=this.onSelect)||i.call(this,Ft(this,a)[s])})}),zt(this,H,wt).call(this)},ft=function(t,e){_t(this,n,t),Ft(this,A).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Ft(this,A).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),zt(this,H,wt).call(this)},wt=function(){var t;const i=Ft(this,a)[Ft(this,n)];if(!i){const t=zt(this,H,nt).call(this);return void(t.url?zt(this,H,at).call(this,t.url,t.title):(_t(this,v,null),Ft(this,P).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`))}const s=i.url;if(s===Ft(this,v))return;_t(this,v,s),Ft(this,e).stop(Ft(this,g)),Ft(this,P).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Ft(this,P).querySelector(".hawk-preview-title"),r=Ft(this,P).querySelector(".hawk-preview-content");Ft(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),zt(this,H,gt).call(this,i,s,r)},gt=function(t,i,s){return Jt(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield zt(this,H,mt).call(this,e);t.isAnchor&&i?n=zt(this,H,kt).call(this,s,i):this.previewSections?(a=zt(this,H,vt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}Ft(this,v)===i&&(a&&a.length?zt(this,H,yt).call(this,a,t,s):_t(this,g,Ft(this,e).typeContent(s,n)))})},
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
vt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
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
mt=function(t){if(Ft(this,y).has(t))return Ft(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Ft(this,y).delete(t),e});return Ft(this,y).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
kt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
bt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Ft(this,a).length&&zt(this,H,ft).call(this,(Ft(this,n)+1)%Ft(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Ft(this,a).length&&zt(this,H,ft).call(this,(Ft(this,n)-1+Ft(this,a).length)%Ft(this,a).length,!0);else if("Enter"===t.key){const t=Ft(this,a)[Ft(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
St=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Ft(this,b).focus(),Ft(this,b).value+=t.key,void Ft(this,b).dispatchEvent(new Event("input"));zt(this,H,bt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
$t=function(t){"ArrowDown"===t.key?(t.preventDefault(),Ft(this,P).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Ft(this,P).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Ft(this,P).scrollTop+=Ft(this,P).clientHeight):"PageUp"===t.key?(t.preventDefault(),Ft(this,P).scrollTop-=Ft(this,P).clientHeight):"Home"===t.key?(t.preventDefault(),Ft(this,P).scrollTop=0):"End"===t.key&&(t.preventDefault(),Ft(this,P).scrollTop=Ft(this,P).scrollHeight)},xt=function(t){Ft(this,d)&&"Tab"===t.key&&zt(this,H,Mt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Ft(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Ft(this,d)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
At=function(){return!("true"===Ft(this,k).dataset.hawkCompact||"compact"===this.params.density)||"true"===Ft(this,k).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
Pt=function(){return[Ft(this,b),...this.params.allowDensityToggle?Array.from(Ft(this,k).querySelectorAll(".hawk-density-btn")):[],Ft(this,k).querySelector(".hawk-modal-esc"),Ft(this,M).querySelector('.hawk-filter-pill[tabindex="0"]'),Ft(this,A),...zt(this,H,At).call(this)?[Ft(this,P)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
Mt=function(t){const e=zt(this,H,Pt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
 * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
 */
Et=function(){return Boolean(this.revealAnimation)&&!("undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
Lt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Ft(this,L).get(t)),Ft(this,L).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
Tt=function(){if(!Ft(this,$))return;const t=Ft(this,d)&&!Ft(this,b).value;Ft(this,S).dataset.hawkInputActive=String(!t),t&&!Ft(this,x)?_t(this,x,Ft(this,e).rotatePlaceholder(Ft(this,$),this.rotatingPlaceholders)):!t&&Ft(this,x)&&(Ft(this,e).stop(Ft(this,x)),_t(this,x,null))},Kt(ae,"themes",Gt),Kt(ae,"animations",Vt),"undefined"!=typeof window&&(window.Hawk=ae);export{ae as HawkSearch,ae as default};
//# sourceMappingURL=hawk.mjs.map
