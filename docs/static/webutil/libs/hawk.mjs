/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,h,r,o,c,d,u,p,w,f,y,v,g,m,k,b,S,$,M,x,E,L,P,T,A,C,W,H,q,D,O,N,R,B,j,F,K,U,I,z,G,_,V,X,J,Q,Y,Z,tt,et,it,st,at,nt,lt,ht,rt,ot,ct=Object.defineProperty,dt=Object.defineProperties,ut=Object.getOwnPropertyDescriptors,pt=Object.getOwnPropertySymbols,wt=Object.prototype.hasOwnProperty,ft=Object.prototype.propertyIsEnumerable,yt=t=>{throw TypeError(t)},vt=(t,e,i)=>e in t?ct(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,gt=(t,e)=>{for(var i in e||(e={}))wt.call(e,i)&&vt(t,i,e[i]);if(pt)for(var i of pt(e))ft.call(e,i)&&vt(t,i,e[i]);return t},mt=(t,e)=>dt(t,ut(e)),kt=(t,e,i)=>vt(t,"symbol"!=typeof e?e+"":e,i),bt=(t,e,i)=>e.has(t)||yt("Cannot "+i),St=(t,e,i)=>(bt(t,e,"read from private field"),i?i.call(t):e.get(t)),$t=(t,e,i)=>e.has(t)?yt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Mt=(t,e,i,s)=>(bt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),xt=(t,e,i)=>(bt(t,e,"access private method"),i),Et=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{h(i.next(t))}catch(t){a(t)}},l=t=>{try{h(i.throw(t))}catch(t){a(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);h((i=i.apply(t,e)).next())});const Lt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Lt);const Pt=new Map,Tt=new Map;Tt.set("instant",Lt);const At={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Ct=new Set(["fit","medium","compact"]),Wt="hawk:density",Ht={open:!0,slash:!0,escape:!0},qt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind"};let Dt=0;class Ot{
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
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} [config.tabs]
   *   Explicit tab list. `filter` is a raw Pagefind `filters` object (passed to `search()`/`debouncedSearch()`
   *   verbatim) — omit it for a filterless tab (e.g. "All"). Replaces auto-derivation from Pagefind's
   *   `filters()` entirely and renders synchronously on mount instead of waiting for Pagefind to load.
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
   *   uses. Replaced the instant real results exist (from a selection, or from `eagerResults`).
   * @param {string} [config.defaultPreviewTitle=''] Title shown above `defaultPreviewUrl`'s content.
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
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(W={}){var H,q;if($t(this,P),$t(this,t),$t(this,e),$t(this,i),$t(this,s),$t(this,a),$t(this,n),$t(this,l),$t(this,h),$t(this,r),$t(this,o),$t(this,c),$t(this,d),$t(this,u),$t(this,p),$t(this,w),$t(this,f),$t(this,y),$t(this,v),$t(this,g),$t(this,m),$t(this,k),$t(this,b),$t(this,S),$t(this,$),$t(this,M),$t(this,x),$t(this,E),$t(this,L),!W.index&&!W.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=W.id||`hawk-search-${Dt+=1}`,this.indexBasePath=W.index?W.index.endsWith("/")?W.index:`${W.index}/`:null,Mt(this,y,W.pagefind||null),this.triggerSelector=W.triggerSelector||"[data-search-trigger]",this.container=W.container||("undefined"!=typeof document?document.body:null);const O=xt(this,P,B).call(this);this.params=mt(gt(gt(gt({},At),O?{density:O}:{}),W.params),{offset:gt(gt({},At.offset),null==(H=W.params)?void 0:H.offset)}),this.categoryFilterName=W.categoryFilterName||"category",this.includeAllTab=!1!==W.includeAllTab,this.pagefindOptions=W.pagefindOptions||{},this.maxResults=null!=(q=W.maxResults)?q:18,this.contentSelector=W.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=W.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=W.rotatingPlaceholders||[],this.showPoweredBy=!1!==W.showPoweredBy,this.poweredByHref=W.poweredByHref||"https://pagefind.app/",this.hotkeys=gt(gt({},Ht),W.hotkeys),this.strings=gt(gt({},qt),W.strings),this.defaultPreviewUrl=W.defaultPreviewUrl||null,this.defaultPreviewTitle=W.defaultPreviewTitle||"",this.eagerResults=!1!==W.eagerResults,this.onOpen=W.onOpen,this.onClose=W.onClose,this.onSelect=W.onSelect,Mt(this,t,xt(this,P,T).call(this,W.theme)),Mt(this,e,xt(this,P,A).call(this,W.animation)),Mt(this,i,""),Mt(this,s,-1),Mt(this,a,[]),Mt(this,n,0),Mt(this,h,W.defaultTab||"all"),Mt(this,l,xt(this,P,C).call(this,W)),Mt(this,r,null!==St(this,l)),Mt(this,o,!1),Mt(this,c,null),Mt(this,d,null),Mt(this,u,null),Mt(this,p,null),Mt(this,w,null),Mt(this,f,new Map),this.container&&xt(this,P,D).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Pt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Tt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:St(this,o),query:St(this,i),selectedIndex:St(this,s),matches:St(this,a),pageCount:St(this,n),activeTab:St(this,h),error:St(this,u)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=mt(gt(gt({},this.params),t),{offset:gt(gt({},this.params.offset),null==t?void 0:t.offset)}),xt(this,P,N).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;St(this,v).hidden=!1,document.body.style.overflow="hidden",Mt(this,o,!0),xt(this,P,F).call(this),xt(this,P,ot).call(this),setTimeout(()=>{St(this,g).focus(),St(this,g).select()},40),null==(t=this.onOpen)||t.call(this,St(this,i))}
/** Closes the search modal. */close(){var t;St(this,v).hidden=!0,document.body.style.overflow="",Mt(this,o,!1),xt(this,P,ot).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;St(this,e).stop(St(this,p)),St(this,b)&&St(this,e).stop(St(this,b)),null==(i=null==(t=St(this,E))?void 0:t.removeEventListener)||i.call(t,"change",St(this,L)),null==(s=St(this,v))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,w=new WeakMap,f=new WeakMap,y=new WeakMap,v=new WeakMap,g=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,M=new WeakMap,x=new WeakMap,E=new WeakMap,L=new WeakMap,P=new WeakSet,T=function(t){if(!t)return Pt.get("typeflow")||null;if("string"==typeof t){const e=Pt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},A=function(t){if(!1===t)return Tt.get("instant");if(!t)return Tt.get("typeflow")||Tt.get("instant");if("string"==typeof t){const e=Tt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
C=function(t){return t.tabs?xt(this,P,W).call(this,t.tabs):t.categories?xt(this,P,W).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
W=function(t){const e=t.map(t=>({id:t.id||xt(this,P,H).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},H=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
q=function(t){var e,i;Mt(this,l,t),t.some(t=>t.id===St(this,h))||("all"!==St(this,h)&&console.warn(`HawkSearch: no tab with id "${St(this,h)}" (defaultTab); falling back to "all".`),Mt(this,h,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),xt(this,P,G).call(this)},D=function(){const e=document.createElement("div");e.innerHTML=xt(this,P,O).call(this),Mt(this,v,e.firstElementChild),this.container.appendChild(St(this,v)),Mt(this,g,St(this,v).querySelector(".hawk-modal-input")),Mt(this,m,St(this,v).querySelector(".hawk-input-wrap")),Mt(this,k,St(this,v).querySelector(".hawk-input-ghost")),St(this,k)&&(St(this,k).textContent=this.rotatingPlaceholders[0],xt(this,P,ot).call(this)),Mt(this,S,St(this,v).querySelector(".hawk-results-pane")),Mt(this,$,St(this,v).querySelector(".hawk-preview-pane")),Mt(this,M,St(this,v).querySelector(".hawk-modal-filters")),Mt(this,x,St(this,v).querySelector(".hawk-modal-counter")),St(this,t)&&(St(this,t).apply(St(this,v)),Object.entries(St(this,t).tokens||{}).forEach(([t,e])=>{St(this,v).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(St(this,v).dataset.hawkMarkdownStyles="off"),xt(this,P,N).call(this),St(this,r)&&xt(this,P,q).call(this,St(this,l)),this.defaultPreviewUrl&&xt(this,P,I).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),St(this,v).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),St(this,v).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),xt(this,P,j).call(this,t.dataset.density)})}),St(this,g).addEventListener("input",()=>{xt(this,P,X).call(this,St(this,g).value),xt(this,P,ot).call(this)}),St(this,g).addEventListener("keydown",t=>xt(this,P,it).call(this,t)),St(this,g).addEventListener("focus",()=>xt(this,P,F).call(this),{once:!0}),St(this,S).addEventListener("keydown",t=>xt(this,P,st).call(this,t)),St(this,$).addEventListener("keydown",t=>xt(this,P,at).call(this,t)),St(this,$).addEventListener("focus",()=>{St(this,v).dataset.hawkShowPreview="true"}),St(this,$).addEventListener("blur",()=>{St(this,v).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>xt(this,P,nt).call(this,t))},O=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},N=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:h}=this.params;St(this,v).style.setProperty("--hawk-scale",String(i)),St(this,v).style.setProperty("--hawk-offset-x",xt(this,P,R).call(this,a.x)),St(this,v).style.setProperty("--hawk-offset-y",xt(this,P,R).call(this,a.y)),St(this,v).dataset.hawkPosition=s,St(this,v).dataset.hawkDensity=h,St(this,v).querySelector(".hawk-modal-body").dataset.hawkColumns=String(n),St(this,v).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),St(this,E)&&(null==(e=(t=St(this,E)).removeEventListener)||e.call(t,"change",St(this,L)),Mt(this,E,null)),"function"==typeof window.matchMedia&&(Mt(this,E,window.matchMedia(`(max-width: ${l}px)`)),Mt(this,L,()=>{St(this,v).dataset.hawkCompact=String(St(this,E).matches)}),St(this,E).addEventListener("change",St(this,L)),St(this,L).call(this))},R=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
B=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Wt):null;return Ct.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
j=function(t){try{null==localStorage||localStorage.setItem(Wt,t)}catch(t){}},F=function(){return Et(this,null,function*(){return St(this,c)?St(this,c):St(this,y)?(Mt(this,c,St(this,y)),yield xt(this,P,z).call(this),yield xt(this,P,K).call(this),St(this,c)):(St(this,d)||Mt(this,d,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Et(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Mt(this,c,t),yield xt(this,P,z).call(this),yield xt(this,P,K).call(this),t})).catch(t=>(Mt(this,u,t),xt(this,P,U).call(this),null))),St(this,d))})},K=function(){return Et(this,null,function*(){this.eagerResults&&!St(this,i)&&(yield xt(this,P,X).call(this,""))})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
U=function(){St(this,S).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,St(this,S).removeAttribute("aria-activedescendant"),St(this,x).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
I=function(){const t=this.defaultPreviewUrl;Mt(this,w,t),St(this,$).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=St(this,$).querySelector(".hawk-preview-title"),s=St(this,$).querySelector(".hawk-preview-content");St(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),xt(this,P,Z).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},z=function(){return Et(this,null,function*(){if(St(this,r))return;if(!St(this,c))return void xt(this,P,q).call(this,xt(this,P,W).call(this,[]));let t=[];try{const e=yield St(this,c).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}xt(this,P,q).call(this,xt(this,P,W).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},G=function(){const t=St(this,l)||[];St(this,M).innerHTML=t.map(t=>{const e=t.id===St(this,h);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(St(this,M).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{xt(this,P,_).call(this,t),St(this,g).focus()}),t.addEventListener("keydown",t=>xt(this,P,V).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
_=function(t){Mt(this,h,t.dataset.filter),St(this,M).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),xt(this,P,X).call(this,St(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
V=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),xt(this,P,_).call(this,i[s]))},X=function(t){return Et(this,null,function*(){var e;if(Mt(this,i,t),yield xt(this,P,F).call(this),!St(this,c))return;const r=(St(this,l)||[]).find(t=>t.id===St(this,h)),o=gt(gt(gt({},this.pagefindOptions),(null==r?void 0:r.pagefindOptions)||{}),(null==r?void 0:r.filter)?{filters:r.filter}:{});let d;try{({results:d}=t.trim()?yield St(this,c).debouncedSearch(t,o):yield St(this,c).search("",o))}catch(t){return Mt(this,u,t),void xt(this,P,U).call(this)}const p=[];for(const t of(d||[]).slice(0,this.maxResults)){const i=yield t.data();p.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&p.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Mt(this,a,p.slice(0,this.maxResults)),Mt(this,n,new Set(St(this,a).map(t=>t.url.split("#")[0])).size),Mt(this,s,St(this,a).length?0:-1),xt(this,P,J).call(this)})},J=function(){if(!St(this,a).length)return St(this,S).innerHTML=`<div class="hawk-empty">${this.strings.noResults(St(this,i))}</div>`,St(this,S).removeAttribute("aria-activedescendant"),St(this,x).textContent=St(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void xt(this,P,Y).call(this);St(this,x).textContent=St(this,i)?this.strings.matchingResults(St(this,a).length,St(this,n)):this.strings.entries(St(this,a).length,St(this,n)),St(this,S).innerHTML=St(this,a).map((t,e)=>{var i;return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===St(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===St(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),St(this,S).setAttribute("aria-activedescendant",`${this.id}-result-${St(this,s)}`),St(this,S).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>xt(this,P,Q).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,St(this,a)[Number(t.dataset.index)])})}),xt(this,P,Y).call(this)},Q=function(t,e){Mt(this,s,t),St(this,S).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),St(this,S).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),xt(this,P,Y).call(this)},Y=function(){var t;const i=St(this,a)[St(this,s)];if(!i)return void(St(this,$).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const n=i.url;if(n===St(this,w))return;Mt(this,w,n),St(this,e).stop(St(this,p)),St(this,$).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=St(this,$).querySelector(".hawk-preview-title"),h=St(this,$).querySelector(".hawk-preview-content");St(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),xt(this,P,Z).call(this,i,n,h)},Z=function(t,i,s){return Et(this,null,function*(){let a=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield xt(this,P,tt).call(this,e);a=t.isAnchor&&i?xt(this,P,et).call(this,s,i):s.innerHTML}catch(e){a=t.excerpt||""}St(this,w)===i&&Mt(this,p,St(this,e).typeContent(s,a))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
tt=function(t){if(St(this,f).has(t))return St(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw St(this,f).delete(t),e});return St(this,f).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
et=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
it=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),St(this,a).length&&xt(this,P,Q).call(this,(St(this,s)+1)%St(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),St(this,a).length&&xt(this,P,Q).call(this,(St(this,s)-1+St(this,a).length)%St(this,a).length,!0);else if("Enter"===t.key){const t=St(this,a)[St(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
st=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),St(this,g).focus(),St(this,g).value+=t.key,void St(this,g).dispatchEvent(new Event("input"));xt(this,P,it).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
at=function(t){"ArrowDown"===t.key?(t.preventDefault(),St(this,$).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),St(this,$).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),St(this,$).scrollTop+=St(this,$).clientHeight):"PageUp"===t.key?(t.preventDefault(),St(this,$).scrollTop-=St(this,$).clientHeight):"Home"===t.key?(t.preventDefault(),St(this,$).scrollTop=0):"End"===t.key&&(t.preventDefault(),St(this,$).scrollTop=St(this,$).scrollHeight)},nt=function(t){St(this,o)&&"Tab"===t.key&&xt(this,P,rt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),St(this,o)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&St(this,o)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
lt=function(){return!("true"===St(this,v).dataset.hawkCompact||"compact"===this.params.density)||"true"===St(this,v).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
ht=function(){return[St(this,g),...this.params.allowDensityToggle?Array.from(St(this,v).querySelectorAll(".hawk-density-btn")):[],St(this,v).querySelector(".hawk-modal-esc"),St(this,M).querySelector('.hawk-filter-pill[tabindex="0"]'),St(this,S),...xt(this,P,lt).call(this)?[St(this,$)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
rt=function(t){const e=xt(this,P,ht).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
ot=function(){if(!St(this,k))return;const t=St(this,o)&&!St(this,g).value;St(this,m).dataset.hawkInputActive=String(!t),t&&!St(this,b)?Mt(this,b,St(this,e).rotatePlaceholder(St(this,k),this.rotatingPlaceholders)):!t&&St(this,b)&&(St(this,e).stop(St(this,b)),Mt(this,b,null))},kt(Ot,"themes",Pt),kt(Ot,"animations",Tt),"undefined"!=typeof window&&(window.Hawk=Ot);export{Ot as HawkSearch,Ot as default};
//# sourceMappingURL=hawk.mjs.map
