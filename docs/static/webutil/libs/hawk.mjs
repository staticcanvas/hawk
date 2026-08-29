/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,h,r,o,c,d,u,p,f,w,y,v,g,m,k,b,S,$,x,E,L,T,M,A,P,C,H,W,q,D,O,N,R,j,F,K,U,I,B,G,z,V,X,_,J,Q,Y,Z,tt,et,it,st,at,nt=Object.defineProperty,lt=Object.defineProperties,ht=Object.getOwnPropertyDescriptors,rt=Object.getOwnPropertySymbols,ot=Object.prototype.hasOwnProperty,ct=Object.prototype.propertyIsEnumerable,dt=t=>{throw TypeError(t)},ut=(t,e,i)=>e in t?nt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,pt=(t,e)=>{for(var i in e||(e={}))ot.call(e,i)&&ut(t,i,e[i]);if(rt)for(var i of rt(e))ct.call(e,i)&&ut(t,i,e[i]);return t},ft=(t,e)=>lt(t,ht(e)),wt=(t,e,i)=>ut(t,"symbol"!=typeof e?e+"":e,i),yt=(t,e,i)=>e.has(t)||dt("Cannot "+i),vt=(t,e,i)=>(yt(t,e,"read from private field"),i?i.call(t):e.get(t)),gt=(t,e,i)=>e.has(t)?dt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),mt=(t,e,i,s)=>(yt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),kt=(t,e,i)=>(yt(t,e,"access private method"),i),bt=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{h(i.next(t))}catch(t){a(t)}},l=t=>{try{h(i.throw(t))}catch(t){a(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);h((i=i.apply(t,e)).next())});const St={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=St);const $t=new Map,xt=new Map;xt.set("instant",St);const Et={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Lt=new Set(["fit","medium","compact"]),Tt="hawk:density",Mt={open:!0,slash:!0,escape:!0},At={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:t=>`${t} matching result${1===t?"":"s"}`,entries:t=>`${t} entries`,unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable"};let Pt=0;class Ct{
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
   * @param {string} [config.defaultPreviewUrl] Shows this page's content in the preview pane as soon as the
   *   modal mounts, before any result is selected — fetched/extracted via the same path a real selection
   *   uses. Replaced the instant real results exist (from a selection, or from `eagerResults`).
   * @param {string} [config.defaultPreviewTitle=''] Title shown above `defaultPreviewUrl`'s content.
   * @param {boolean} [config.eagerResults=true] Runs an empty-query search as soon as Pagefind loads, so the
   *   results pane shows a default listing instead of "Type to search". Set `false` to keep the results pane
   *   empty until the visitor types.
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(M={}){var A,P;if(gt(this,x),gt(this,t),gt(this,e),gt(this,i),gt(this,s),gt(this,a),gt(this,n),gt(this,l),gt(this,h),gt(this,r),gt(this,o),gt(this,c),gt(this,d),gt(this,u),gt(this,p),gt(this,f),gt(this,w),gt(this,y),gt(this,v),gt(this,g),gt(this,m),gt(this,k),gt(this,b),gt(this,S),gt(this,$),!M.index&&!M.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=M.id||`hawk-search-${Pt+=1}`,this.indexBasePath=M.index?M.index.endsWith("/")?M.index:`${M.index}/`:null,mt(this,w,M.pagefind||null),this.triggerSelector=M.triggerSelector||"[data-search-trigger]",this.container=M.container||("undefined"!=typeof document?document.body:null);const H=kt(this,x,D).call(this);this.params=ft(pt(pt(pt({},Et),H?{density:H}:{}),M.params),{offset:pt(pt({},Et.offset),null==(A=M.params)?void 0:A.offset)}),this.categoryFilterName=M.categoryFilterName||"category",this.includeAllTab=!1!==M.includeAllTab,this.pagefindOptions=M.pagefindOptions||{},this.maxResults=null!=(P=M.maxResults)?P:18,this.contentSelector=M.contentSelector||"[data-pagefind-body]",this.hotkeys=pt(pt({},Mt),M.hotkeys),this.strings=pt(pt({},At),M.strings),this.defaultPreviewUrl=M.defaultPreviewUrl||null,this.defaultPreviewTitle=M.defaultPreviewTitle||"",this.eagerResults=!1!==M.eagerResults,this.onOpen=M.onOpen,this.onClose=M.onClose,this.onSelect=M.onSelect,mt(this,t,kt(this,x,E).call(this,M.theme)),mt(this,e,kt(this,x,L).call(this,M.animation)),mt(this,i,""),mt(this,s,-1),mt(this,a,[]),mt(this,l,M.defaultTab||"all"),mt(this,n,kt(this,x,T).call(this,M)),mt(this,h,null!==vt(this,n)),mt(this,r,!1),mt(this,o,null),mt(this,c,null),mt(this,d,null),mt(this,u,null),mt(this,p,null),mt(this,f,new Map),this.container&&kt(this,x,C).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){$t.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){xt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:vt(this,r),query:vt(this,i),selectedIndex:vt(this,s),matches:vt(this,a),activeTab:vt(this,l),error:vt(this,d)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=ft(pt(pt({},this.params),t),{offset:pt(pt({},this.params.offset),null==t?void 0:t.offset)}),kt(this,x,W).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;vt(this,y).hidden=!1,document.body.style.overflow="hidden",mt(this,r,!0),kt(this,x,N).call(this),setTimeout(()=>{vt(this,v).focus(),vt(this,v).select()},40),null==(t=this.onOpen)||t.call(this,vt(this,i))}
/** Closes the search modal. */close(){var t;vt(this,y).hidden=!0,document.body.style.overflow="",mt(this,r,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;vt(this,e).stop(vt(this,u)),null==(i=null==(t=vt(this,S))?void 0:t.removeEventListener)||i.call(t,"change",vt(this,$)),null==(s=vt(this,y))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,g=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakSet,E=function(t){if(!t)return $t.get("typeflow")||null;if("string"==typeof t){const e=$t.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},L=function(t){if(!1===t)return xt.get("instant");if(!t)return xt.get("typeflow")||xt.get("instant");if("string"==typeof t){const e=xt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
T=function(t){return t.tabs?kt(this,x,M).call(this,t.tabs):t.categories?kt(this,x,M).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
M=function(t){const e=t.map(t=>({id:t.id||kt(this,x,A).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},A=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
P=function(t){var e,i;mt(this,n,t),t.some(t=>t.id===vt(this,l))||("all"!==vt(this,l)&&console.warn(`HawkSearch: no tab with id "${vt(this,l)}" (defaultTab); falling back to "all".`),mt(this,l,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),kt(this,x,U).call(this)},C=function(){const e=document.createElement("div");e.innerHTML=kt(this,x,H).call(this),mt(this,y,e.firstElementChild),this.container.appendChild(vt(this,y)),mt(this,v,vt(this,y).querySelector(".hawk-modal-input")),mt(this,g,vt(this,y).querySelector(".hawk-results-pane")),mt(this,m,vt(this,y).querySelector(".hawk-preview-pane")),mt(this,k,vt(this,y).querySelector(".hawk-modal-filters")),mt(this,b,vt(this,y).querySelector(".hawk-modal-counter")),vt(this,t)&&vt(this,t).apply(vt(this,y)),kt(this,x,W).call(this),vt(this,h)&&kt(this,x,P).call(this,vt(this,n)),this.defaultPreviewUrl&&kt(this,x,F).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),vt(this,y).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),vt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),kt(this,x,O).call(this,t.dataset.density)})}),vt(this,v).addEventListener("input",()=>kt(this,x,G).call(this,vt(this,v).value)),vt(this,v).addEventListener("keydown",t=>kt(this,x,Y).call(this,t)),vt(this,v).addEventListener("focus",()=>kt(this,x,N).call(this),{once:!0}),vt(this,g).addEventListener("keydown",t=>kt(this,x,Z).call(this,t)),vt(this,m).addEventListener("keydown",t=>kt(this,x,tt).call(this,t)),vt(this,m).addEventListener("focus",()=>{vt(this,y).dataset.hawkShowPreview="true"}),vt(this,m).addEventListener("blur",()=>{vt(this,y).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>kt(this,x,et).call(this,t))},H=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="${t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},W=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:h}=this.params;vt(this,y).style.setProperty("--hawk-scale",String(i)),vt(this,y).style.setProperty("--hawk-offset-x",kt(this,x,q).call(this,a.x)),vt(this,y).style.setProperty("--hawk-offset-y",kt(this,x,q).call(this,a.y)),vt(this,y).dataset.hawkPosition=s,vt(this,y).dataset.hawkDensity=h,vt(this,y).querySelector(".hawk-modal-body").dataset.hawkColumns=String(n),vt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),vt(this,S)&&(null==(e=(t=vt(this,S)).removeEventListener)||e.call(t,"change",vt(this,$)),mt(this,S,null)),"function"==typeof window.matchMedia&&(mt(this,S,window.matchMedia(`(max-width: ${l}px)`)),mt(this,$,()=>{vt(this,y).dataset.hawkCompact=String(vt(this,S).matches)}),vt(this,S).addEventListener("change",vt(this,$)),vt(this,$).call(this))},q=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
D=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Tt):null;return Lt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
O=function(t){try{null==localStorage||localStorage.setItem(Tt,t)}catch(t){}},N=function(){return bt(this,null,function*(){return vt(this,o)?vt(this,o):vt(this,w)?(mt(this,o,vt(this,w)),yield kt(this,x,K).call(this),yield kt(this,x,R).call(this),vt(this,o)):(vt(this,c)||mt(this,c,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>bt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),mt(this,o,t),yield kt(this,x,K).call(this),yield kt(this,x,R).call(this),t})).catch(t=>(mt(this,d,t),kt(this,x,j).call(this),null))),vt(this,c))})},R=function(){return bt(this,null,function*(){this.eagerResults&&!vt(this,i)&&(yield kt(this,x,G).call(this,""))})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
j=function(){vt(this,g).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,vt(this,g).removeAttribute("aria-activedescendant"),vt(this,b).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
F=function(){const t=this.defaultPreviewUrl;mt(this,p,t),vt(this,m).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=vt(this,m).querySelector(".hawk-preview-title"),s=vt(this,m).querySelector(".hawk-preview-content");vt(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),kt(this,x,_).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},K=function(){return bt(this,null,function*(){if(vt(this,h))return;if(!vt(this,o))return void kt(this,x,P).call(this,kt(this,x,M).call(this,[]));let t=[];try{const e=yield vt(this,o).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}kt(this,x,P).call(this,kt(this,x,M).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},U=function(){const t=vt(this,n)||[];vt(this,k).innerHTML=t.map(t=>{const e=t.id===vt(this,l);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(vt(this,k).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{kt(this,x,I).call(this,t),vt(this,v).focus()}),t.addEventListener("keydown",t=>kt(this,x,B).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
I=function(t){mt(this,l,t.dataset.filter),vt(this,k).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),kt(this,x,G).call(this,vt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
B=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),kt(this,x,I).call(this,i[s]))},G=function(t){return bt(this,null,function*(){var e;if(mt(this,i,t),yield kt(this,x,N).call(this),!vt(this,o))return;const h=(vt(this,n)||[]).find(t=>t.id===vt(this,l)),r=pt(pt(pt({},this.pagefindOptions),(null==h?void 0:h.pagefindOptions)||{}),(null==h?void 0:h.filter)?{filters:h.filter}:{});let c;try{({results:c}=t.trim()?yield vt(this,o).debouncedSearch(t,r):yield vt(this,o).search("",r))}catch(t){return mt(this,d,t),void kt(this,x,j).call(this)}const u=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();u.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&u.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}mt(this,a,u.slice(0,this.maxResults)),mt(this,s,vt(this,a).length?0:-1),kt(this,x,z).call(this)})},z=function(){if(!vt(this,a).length)return vt(this,g).innerHTML=`<div class="hawk-empty">${this.strings.noResults(vt(this,i))}</div>`,vt(this,g).removeAttribute("aria-activedescendant"),vt(this,b).textContent=vt(this,i)?this.strings.matchingResults(0):this.strings.typeToSearch,void kt(this,x,X).call(this);vt(this,b).textContent=vt(this,i)?this.strings.matchingResults(vt(this,a).length):this.strings.entries(vt(this,a).length),vt(this,g).innerHTML=vt(this,a).map((t,e)=>`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===vt(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===vt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),vt(this,g).setAttribute("aria-activedescendant",`${this.id}-result-${vt(this,s)}`),vt(this,g).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>kt(this,x,V).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,vt(this,a)[Number(t.dataset.index)])})}),kt(this,x,X).call(this)},V=function(t,e){mt(this,s,t),vt(this,g).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),vt(this,g).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),kt(this,x,X).call(this)},X=function(){const t=vt(this,a)[vt(this,s)];if(!t)return void(vt(this,m).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const i=t.url;if(i===vt(this,p))return;mt(this,p,i),vt(this,e).stop(vt(this,u)),vt(this,m).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const n=vt(this,m).querySelector(".hawk-preview-title"),l=vt(this,m).querySelector(".hawk-preview-content");vt(this,e).typeTitle(n,t.title,{isAnchor:t.isAnchor}),kt(this,x,_).call(this,t,i,l)},_=function(t,i,s){return bt(this,null,function*(){let a=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield kt(this,x,J).call(this,e);a=t.isAnchor&&i?kt(this,x,Q).call(this,s,i):s.innerHTML}catch(e){a=t.excerpt||""}vt(this,p)===i&&mt(this,u,vt(this,e).typeContent(s,a))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
J=function(t){if(vt(this,f).has(t))return vt(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw vt(this,f).delete(t),e});return vt(this,f).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
Q=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
Y=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),vt(this,a).length&&kt(this,x,V).call(this,(vt(this,s)+1)%vt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),vt(this,a).length&&kt(this,x,V).call(this,(vt(this,s)-1+vt(this,a).length)%vt(this,a).length,!0);else if("Enter"===t.key){const t=vt(this,a)[vt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Z=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),vt(this,v).focus(),vt(this,v).value+=t.key,void vt(this,v).dispatchEvent(new Event("input"));kt(this,x,Y).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
tt=function(t){"ArrowDown"===t.key?(t.preventDefault(),vt(this,m).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),vt(this,m).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),vt(this,m).scrollTop+=vt(this,m).clientHeight):"PageUp"===t.key?(t.preventDefault(),vt(this,m).scrollTop-=vt(this,m).clientHeight):"Home"===t.key?(t.preventDefault(),vt(this,m).scrollTop=0):"End"===t.key&&(t.preventDefault(),vt(this,m).scrollTop=vt(this,m).scrollHeight)},et=function(t){vt(this,r)&&"Tab"===t.key&&kt(this,x,at).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),vt(this,r)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&vt(this,r)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
it=function(){return!("true"===vt(this,y).dataset.hawkCompact||"compact"===this.params.density)||"true"===vt(this,y).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
st=function(){return[vt(this,v),...this.params.allowDensityToggle?Array.from(vt(this,y).querySelectorAll(".hawk-density-btn")):[],vt(this,y).querySelector(".hawk-modal-esc"),vt(this,k).querySelector('.hawk-filter-pill[tabindex="0"]'),vt(this,g),...kt(this,x,it).call(this)?[vt(this,m)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
at=function(t){const e=kt(this,x,st).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},wt(Ct,"themes",$t),wt(Ct,"animations",xt),"undefined"!=typeof window&&(window.Hawk=Ct);export{Ct as HawkSearch,Ct as default};
//# sourceMappingURL=hawk.mjs.map
