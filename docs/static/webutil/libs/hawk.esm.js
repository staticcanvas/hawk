/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,h,r,o,c,d,u,p,f,w,y,v,g,k,m,b,S,$,M,x,E,L,T,P,A,C,W,q,D,H,O,N,R,j,F,K,U,I,B,G,z,V,X,_,J,Q,Y,Z,tt,et,it,st,at,nt,lt,ht,rt,ot=Object.defineProperty,ct=Object.defineProperties,dt=Object.getOwnPropertyDescriptors,ut=Object.getOwnPropertySymbols,pt=Object.prototype.hasOwnProperty,ft=Object.prototype.propertyIsEnumerable,wt=t=>{throw TypeError(t)},yt=(t,e,i)=>e in t?ot(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,vt=(t,e)=>{for(var i in e||(e={}))pt.call(e,i)&&yt(t,i,e[i]);if(ut)for(var i of ut(e))ft.call(e,i)&&yt(t,i,e[i]);return t},gt=(t,e)=>ct(t,dt(e)),kt=(t,e,i)=>yt(t,"symbol"!=typeof e?e+"":e,i),mt=(t,e,i)=>e.has(t)||wt("Cannot "+i),bt=(t,e,i)=>(mt(t,e,"read from private field"),i?i.call(t):e.get(t)),St=(t,e,i)=>e.has(t)?wt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),$t=(t,e,i,s)=>(mt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Mt=(t,e,i)=>(mt(t,e,"access private method"),i),xt=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{h(i.next(t))}catch(t){a(t)}},l=t=>{try{h(i.throw(t))}catch(t){a(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);h((i=i.apply(t,e)).next())});const Et={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Et);const Lt=new Map,Tt=new Map;Tt.set("instant",Et);const Pt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},At=new Set(["fit","medium","compact"]),Ct="hawk:density",Wt={open:!0,slash:!0,escape:!0},qt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:t=>`${t} matching result${1===t?"":"s"}`,entries:t=>`${t} entries`,unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable"};let Dt=0;class Ht{
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
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(C={}){var W,q;if(St(this,L),St(this,t),St(this,e),St(this,i),St(this,s),St(this,a),St(this,n),St(this,l),St(this,h),St(this,r),St(this,o),St(this,c),St(this,d),St(this,u),St(this,p),St(this,f),St(this,w),St(this,y),St(this,v),St(this,g),St(this,k),St(this,m),St(this,b),St(this,S),St(this,$),St(this,M),St(this,x),St(this,E),!C.index&&!C.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=C.id||`hawk-search-${Dt+=1}`,this.indexBasePath=C.index?C.index.endsWith("/")?C.index:`${C.index}/`:null,$t(this,w,C.pagefind||null),this.triggerSelector=C.triggerSelector||"[data-search-trigger]",this.container=C.container||("undefined"!=typeof document?document.body:null);const H=Mt(this,L,R).call(this);this.params=gt(vt(vt(vt({},Pt),H?{density:H}:{}),C.params),{offset:vt(vt({},Pt.offset),null==(W=C.params)?void 0:W.offset)}),this.categoryFilterName=C.categoryFilterName||"category",this.includeAllTab=!1!==C.includeAllTab,this.pagefindOptions=C.pagefindOptions||{},this.maxResults=null!=(q=C.maxResults)?q:18,this.contentSelector=C.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=C.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=C.rotatingPlaceholders||[],this.hotkeys=vt(vt({},Wt),C.hotkeys),this.strings=vt(vt({},qt),C.strings),this.defaultPreviewUrl=C.defaultPreviewUrl||null,this.defaultPreviewTitle=C.defaultPreviewTitle||"",this.eagerResults=!1!==C.eagerResults,this.onOpen=C.onOpen,this.onClose=C.onClose,this.onSelect=C.onSelect,$t(this,t,Mt(this,L,T).call(this,C.theme)),$t(this,e,Mt(this,L,P).call(this,C.animation)),$t(this,i,""),$t(this,s,-1),$t(this,a,[]),$t(this,l,C.defaultTab||"all"),$t(this,n,Mt(this,L,A).call(this,C)),$t(this,h,null!==bt(this,n)),$t(this,r,!1),$t(this,o,null),$t(this,c,null),$t(this,d,null),$t(this,u,null),$t(this,p,null),$t(this,f,new Map),this.container&&Mt(this,L,D).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Lt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Tt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:bt(this,r),query:bt(this,i),selectedIndex:bt(this,s),matches:bt(this,a),activeTab:bt(this,l),error:bt(this,d)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=gt(vt(vt({},this.params),t),{offset:vt(vt({},this.params.offset),null==t?void 0:t.offset)}),Mt(this,L,O).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;bt(this,y).hidden=!1,document.body.style.overflow="hidden",$t(this,r,!0),Mt(this,L,F).call(this),Mt(this,L,rt).call(this),setTimeout(()=>{bt(this,v).focus(),bt(this,v).select()},40),null==(t=this.onOpen)||t.call(this,bt(this,i))}
/** Closes the search modal. */close(){var t;bt(this,y).hidden=!0,document.body.style.overflow="",$t(this,r,!1),Mt(this,L,rt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;bt(this,e).stop(bt(this,u)),bt(this,m)&&bt(this,e).stop(bt(this,m)),null==(i=null==(t=bt(this,x))?void 0:t.removeEventListener)||i.call(t,"change",bt(this,E)),null==(s=bt(this,y))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,g=new WeakMap,k=new WeakMap,m=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,M=new WeakMap,x=new WeakMap,E=new WeakMap,L=new WeakSet,T=function(t){if(!t)return Lt.get("typeflow")||null;if("string"==typeof t){const e=Lt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},P=function(t){if(!1===t)return Tt.get("instant");if(!t)return Tt.get("typeflow")||Tt.get("instant");if("string"==typeof t){const e=Tt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
A=function(t){return t.tabs?Mt(this,L,C).call(this,t.tabs):t.categories?Mt(this,L,C).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
C=function(t){const e=t.map(t=>({id:t.id||Mt(this,L,W).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},W=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
q=function(t){var e,i;$t(this,n,t),t.some(t=>t.id===bt(this,l))||("all"!==bt(this,l)&&console.warn(`HawkSearch: no tab with id "${bt(this,l)}" (defaultTab); falling back to "all".`),$t(this,l,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Mt(this,L,G).call(this)},D=function(){const e=document.createElement("div");e.innerHTML=Mt(this,L,H).call(this),$t(this,y,e.firstElementChild),this.container.appendChild(bt(this,y)),$t(this,v,bt(this,y).querySelector(".hawk-modal-input")),$t(this,g,bt(this,y).querySelector(".hawk-input-wrap")),$t(this,k,bt(this,y).querySelector(".hawk-input-ghost")),bt(this,k)&&(bt(this,k).textContent=this.rotatingPlaceholders[0],Mt(this,L,rt).call(this)),$t(this,b,bt(this,y).querySelector(".hawk-results-pane")),$t(this,S,bt(this,y).querySelector(".hawk-preview-pane")),$t(this,$,bt(this,y).querySelector(".hawk-modal-filters")),$t(this,M,bt(this,y).querySelector(".hawk-modal-counter")),bt(this,t)&&(bt(this,t).apply(bt(this,y)),Object.entries(bt(this,t).tokens||{}).forEach(([t,e])=>{bt(this,y).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(bt(this,y).dataset.hawkMarkdownStyles="off"),Mt(this,L,O).call(this),bt(this,h)&&Mt(this,L,q).call(this,bt(this,n)),this.defaultPreviewUrl&&Mt(this,L,I).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),bt(this,y).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),bt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Mt(this,L,j).call(this,t.dataset.density)})}),bt(this,v).addEventListener("input",()=>{Mt(this,L,X).call(this,bt(this,v).value),Mt(this,L,rt).call(this)}),bt(this,v).addEventListener("keydown",t=>Mt(this,L,et).call(this,t)),bt(this,v).addEventListener("focus",()=>Mt(this,L,F).call(this),{once:!0}),bt(this,b).addEventListener("keydown",t=>Mt(this,L,it).call(this,t)),bt(this,S).addEventListener("keydown",t=>Mt(this,L,st).call(this,t)),bt(this,S).addEventListener("focus",()=>{bt(this,y).dataset.hawkShowPreview="true"}),bt(this,S).addEventListener("blur",()=>{bt(this,y).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Mt(this,L,at).call(this,t))},H=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},O=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:h}=this.params;bt(this,y).style.setProperty("--hawk-scale",String(i)),bt(this,y).style.setProperty("--hawk-offset-x",Mt(this,L,N).call(this,a.x)),bt(this,y).style.setProperty("--hawk-offset-y",Mt(this,L,N).call(this,a.y)),bt(this,y).dataset.hawkPosition=s,bt(this,y).dataset.hawkDensity=h,bt(this,y).querySelector(".hawk-modal-body").dataset.hawkColumns=String(n),bt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),bt(this,x)&&(null==(e=(t=bt(this,x)).removeEventListener)||e.call(t,"change",bt(this,E)),$t(this,x,null)),"function"==typeof window.matchMedia&&($t(this,x,window.matchMedia(`(max-width: ${l}px)`)),$t(this,E,()=>{bt(this,y).dataset.hawkCompact=String(bt(this,x).matches)}),bt(this,x).addEventListener("change",bt(this,E)),bt(this,E).call(this))},N=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
R=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Ct):null;return At.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
j=function(t){try{null==localStorage||localStorage.setItem(Ct,t)}catch(t){}},F=function(){return xt(this,null,function*(){return bt(this,o)?bt(this,o):bt(this,w)?($t(this,o,bt(this,w)),yield Mt(this,L,B).call(this),yield Mt(this,L,K).call(this),bt(this,o)):(bt(this,c)||$t(this,c,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>xt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),$t(this,o,t),yield Mt(this,L,B).call(this),yield Mt(this,L,K).call(this),t})).catch(t=>($t(this,d,t),Mt(this,L,U).call(this),null))),bt(this,c))})},K=function(){return xt(this,null,function*(){this.eagerResults&&!bt(this,i)&&(yield Mt(this,L,X).call(this,""))})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
U=function(){bt(this,b).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,bt(this,b).removeAttribute("aria-activedescendant"),bt(this,M).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
I=function(){const t=this.defaultPreviewUrl;$t(this,p,t),bt(this,S).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=bt(this,S).querySelector(".hawk-preview-title"),s=bt(this,S).querySelector(".hawk-preview-content");bt(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),Mt(this,L,Y).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},B=function(){return xt(this,null,function*(){if(bt(this,h))return;if(!bt(this,o))return void Mt(this,L,q).call(this,Mt(this,L,C).call(this,[]));let t=[];try{const e=yield bt(this,o).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Mt(this,L,q).call(this,Mt(this,L,C).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},G=function(){const t=bt(this,n)||[];bt(this,$).innerHTML=t.map(t=>{const e=t.id===bt(this,l);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(bt(this,$).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Mt(this,L,z).call(this,t),bt(this,v).focus()}),t.addEventListener("keydown",t=>Mt(this,L,V).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
z=function(t){$t(this,l,t.dataset.filter),bt(this,$).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Mt(this,L,X).call(this,bt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
V=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Mt(this,L,z).call(this,i[s]))},X=function(t){return xt(this,null,function*(){var e;if($t(this,i,t),yield Mt(this,L,F).call(this),!bt(this,o))return;const h=(bt(this,n)||[]).find(t=>t.id===bt(this,l)),r=vt(vt(vt({},this.pagefindOptions),(null==h?void 0:h.pagefindOptions)||{}),(null==h?void 0:h.filter)?{filters:h.filter}:{});let c;try{({results:c}=t.trim()?yield bt(this,o).debouncedSearch(t,r):yield bt(this,o).search("",r))}catch(t){return $t(this,d,t),void Mt(this,L,U).call(this)}const u=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();u.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&u.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}$t(this,a,u.slice(0,this.maxResults)),$t(this,s,bt(this,a).length?0:-1),Mt(this,L,_).call(this)})},_=function(){if(!bt(this,a).length)return bt(this,b).innerHTML=`<div class="hawk-empty">${this.strings.noResults(bt(this,i))}</div>`,bt(this,b).removeAttribute("aria-activedescendant"),bt(this,M).textContent=bt(this,i)?this.strings.matchingResults(0):this.strings.typeToSearch,void Mt(this,L,Q).call(this);bt(this,M).textContent=bt(this,i)?this.strings.matchingResults(bt(this,a).length):this.strings.entries(bt(this,a).length),bt(this,b).innerHTML=bt(this,a).map((t,e)=>`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===bt(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===bt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),bt(this,b).setAttribute("aria-activedescendant",`${this.id}-result-${bt(this,s)}`),bt(this,b).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Mt(this,L,J).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,bt(this,a)[Number(t.dataset.index)])})}),Mt(this,L,Q).call(this)},J=function(t,e){$t(this,s,t),bt(this,b).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),bt(this,b).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Mt(this,L,Q).call(this)},Q=function(){const t=bt(this,a)[bt(this,s)];if(!t)return void(bt(this,S).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const i=t.url;if(i===bt(this,p))return;$t(this,p,i),bt(this,e).stop(bt(this,u)),bt(this,S).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=bt(this,S).querySelector(".hawk-preview-title"),l=bt(this,S).querySelector(".hawk-preview-content");bt(this,e).typeTitle(n,t.title,{isAnchor:t.isAnchor}),Mt(this,L,Y).call(this,t,i,l)},Y=function(t,i,s){return xt(this,null,function*(){let a=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Mt(this,L,Z).call(this,e);a=t.isAnchor&&i?Mt(this,L,tt).call(this,s,i):s.innerHTML}catch(e){a=t.excerpt||""}bt(this,p)===i&&$t(this,u,bt(this,e).typeContent(s,a))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
Z=function(t){if(bt(this,f).has(t))return bt(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw bt(this,f).delete(t),e});return bt(this,f).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
tt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
et=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),bt(this,a).length&&Mt(this,L,J).call(this,(bt(this,s)+1)%bt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),bt(this,a).length&&Mt(this,L,J).call(this,(bt(this,s)-1+bt(this,a).length)%bt(this,a).length,!0);else if("Enter"===t.key){const t=bt(this,a)[bt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
it=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),bt(this,v).focus(),bt(this,v).value+=t.key,void bt(this,v).dispatchEvent(new Event("input"));Mt(this,L,et).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
st=function(t){"ArrowDown"===t.key?(t.preventDefault(),bt(this,S).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),bt(this,S).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),bt(this,S).scrollTop+=bt(this,S).clientHeight):"PageUp"===t.key?(t.preventDefault(),bt(this,S).scrollTop-=bt(this,S).clientHeight):"Home"===t.key?(t.preventDefault(),bt(this,S).scrollTop=0):"End"===t.key&&(t.preventDefault(),bt(this,S).scrollTop=bt(this,S).scrollHeight)},at=function(t){bt(this,r)&&"Tab"===t.key&&Mt(this,L,ht).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),bt(this,r)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&bt(this,r)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
nt=function(){return!("true"===bt(this,y).dataset.hawkCompact||"compact"===this.params.density)||"true"===bt(this,y).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
lt=function(){return[bt(this,v),...this.params.allowDensityToggle?Array.from(bt(this,y).querySelectorAll(".hawk-density-btn")):[],bt(this,y).querySelector(".hawk-modal-esc"),bt(this,$).querySelector('.hawk-filter-pill[tabindex="0"]'),bt(this,b),...Mt(this,L,nt).call(this)?[bt(this,S)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
ht=function(t){const e=Mt(this,L,lt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
rt=function(){if(!bt(this,k))return;const t=bt(this,r)&&!bt(this,v).value;bt(this,g).dataset.hawkInputActive=String(!t),t&&!bt(this,m)?$t(this,m,bt(this,e).rotatePlaceholder(bt(this,k),this.rotatingPlaceholders)):!t&&bt(this,m)&&(bt(this,e).stop(bt(this,m)),$t(this,m,null))},kt(Ht,"themes",Lt),kt(Ht,"animations",Tt),"undefined"!=typeof window&&(window.Hawk=Ht);export{Ht as HawkSearch,Ht as default};
//# sourceMappingURL=hawk.esm.js.map
