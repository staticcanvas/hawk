/*! hawk v0.1.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,m,k,g,v,b,S,x,M,E,$,L,T,A,W,C,O,P,H,q,N,D,j,F,I,R,B,U,K,z,V,X,_,G,J=Object.defineProperty,Q=Object.defineProperties,Y=Object.getOwnPropertyDescriptors,Z=Object.getOwnPropertySymbols,tt=Object.prototype.hasOwnProperty,et=Object.prototype.propertyIsEnumerable,it=t=>{throw TypeError(t)},st=(t,e,i)=>e in t?J(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,nt=(t,e)=>{for(var i in e||(e={}))tt.call(e,i)&&st(t,i,e[i]);if(Z)for(var i of Z(e))et.call(e,i)&&st(t,i,e[i]);return t},at=(t,e)=>Q(t,Y(e)),lt=(t,e,i)=>st(t,"symbol"!=typeof e?e+"":e,i),ht=(t,e,i)=>e.has(t)||it("Cannot "+i),rt=(t,e,i)=>(ht(t,e,"read from private field"),i?i.call(t):e.get(t)),ot=(t,e,i)=>e.has(t)?it("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ct=(t,e,i,s)=>(ht(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),dt=(t,e,i)=>(ht(t,e,"access private method"),i),ut=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const pt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=pt);const ft=new Map,wt=new Map;wt.set("instant",pt);const yt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},mt=new Set(["fit","medium","compact"]),kt="hawk:density",gt={open:!0,slash:!0,escape:!0};let vt=0;class bt{
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
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(L={}){var T,A;if(ot(this,x),ot(this,t),ot(this,e),ot(this,i),ot(this,s),ot(this,n),ot(this,a),ot(this,l),ot(this,h),ot(this,r),ot(this,o),ot(this,c),ot(this,d),ot(this,u),ot(this,p),ot(this,f),ot(this,w),ot(this,y),ot(this,m),ot(this,k),ot(this,g),ot(this,v),ot(this,b),ot(this,S),!L.index&&!L.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=L.id||`hawk-search-${vt+=1}`,this.indexBasePath=L.index?L.index.endsWith("/")?L.index:`${L.index}/`:null,ct(this,f,L.pagefind||null),this.triggerSelector=L.triggerSelector||"[data-search-trigger]",this.container=L.container||("undefined"!=typeof document?document.body:null);const C=dt(this,x,H).call(this);this.params=at(nt(nt(nt({},yt),C?{density:C}:{}),L.params),{offset:nt(nt({},yt.offset),null==(T=L.params)?void 0:T.offset)}),this.categoryFilterName=L.categoryFilterName||"category",this.includeAllTab=!1!==L.includeAllTab,this.pagefindOptions=L.pagefindOptions||{},this.maxResults=null!=(A=L.maxResults)?A:18,this.contentSelector=L.contentSelector||"[data-pagefind-body]",this.hotkeys=nt(nt({},gt),L.hotkeys),this.onOpen=L.onOpen,this.onClose=L.onClose,this.onSelect=L.onSelect,ct(this,t,dt(this,x,M).call(this,L.theme)),ct(this,e,dt(this,x,E).call(this,L.animation)),ct(this,i,""),ct(this,s,-1),ct(this,n,[]),ct(this,l,L.defaultTab||"all"),ct(this,a,dt(this,x,$).call(this,L)),ct(this,h,null!==rt(this,a)),ct(this,r,!1),ct(this,o,null),ct(this,c,null),ct(this,d,null),ct(this,u,null),ct(this,p,new Map),this.container&&dt(this,x,W).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){ft.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){wt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:rt(this,r),query:rt(this,i),selectedIndex:rt(this,s),matches:rt(this,n),activeTab:rt(this,l)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=at(nt(nt({},this.params),t),{offset:nt(nt({},this.params.offset),null==t?void 0:t.offset)}),dt(this,x,O).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;rt(this,w).hidden=!1,document.body.style.overflow="hidden",ct(this,r,!0),dt(this,x,N).call(this),setTimeout(()=>{rt(this,y).focus(),rt(this,y).select()},40),null==(t=this.onOpen)||t.call(this,rt(this,i))}
/** Closes the search modal. */close(){var t;rt(this,w).hidden=!0,document.body.style.overflow="",ct(this,r,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;rt(this,e).stop(rt(this,d)),null==(i=null==(t=rt(this,b))?void 0:t.removeEventListener)||i.call(t,"change",rt(this,S)),null==(s=rt(this,w))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,k=new WeakMap,g=new WeakMap,v=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakSet,M=function(t){if(!t)return ft.get("typeflow")||null;if("string"==typeof t){const e=ft.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},E=function(t){if(!1===t)return wt.get("instant");if(!t)return wt.get("typeflow")||wt.get("instant");if("string"==typeof t){const e=wt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
$=function(t){return t.tabs?dt(this,x,L).call(this,t.tabs):t.categories?dt(this,x,L).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
L=function(t){const e=t.map(t=>({id:t.id||dt(this,x,T).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},T=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
A=function(t){var e,i;ct(this,a,t),t.some(t=>t.id===rt(this,l))||("all"!==rt(this,l)&&console.warn(`HawkSearch: no tab with id "${rt(this,l)}" (defaultTab); falling back to "all".`),ct(this,l,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),dt(this,x,j).call(this)},W=function(){const e=document.createElement("div");e.innerHTML=dt(this,x,C).call(this),ct(this,w,e.firstElementChild),this.container.appendChild(rt(this,w)),ct(this,y,rt(this,w).querySelector(".hawk-modal-input")),ct(this,m,rt(this,w).querySelector(".hawk-results-pane")),ct(this,k,rt(this,w).querySelector(".hawk-preview-pane")),ct(this,g,rt(this,w).querySelector(".hawk-modal-filters")),ct(this,v,rt(this,w).querySelector(".hawk-modal-counter")),rt(this,t)&&rt(this,t).apply(rt(this,w)),dt(this,x,O).call(this),rt(this,h)&&dt(this,x,A).call(this,rt(this,a)),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),rt(this,w).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),rt(this,w).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),dt(this,x,q).call(this,t.dataset.density)})}),rt(this,y).addEventListener("input",()=>dt(this,x,R).call(this,rt(this,y).value)),rt(this,y).addEventListener("keydown",t=>dt(this,x,_).call(this,t)),rt(this,y).addEventListener("focus",()=>dt(this,x,N).call(this),{once:!0}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>dt(this,x,G).call(this,t))},C=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?'<div class="hawk-density-toggle" role="group" aria-label="Result density">\n              <button type="button" class="hawk-density-btn" data-density="fit">Fit</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">Medium</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">Compact</button>\n            </div>':""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite"></div>\n            <aside class="hawk-preview-pane" aria-live="polite">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},O=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;rt(this,w).style.setProperty("--hawk-scale",String(i)),rt(this,w).style.setProperty("--hawk-offset-x",dt(this,x,P).call(this,n.x)),rt(this,w).style.setProperty("--hawk-offset-y",dt(this,x,P).call(this,n.y)),rt(this,w).dataset.hawkPosition=s,rt(this,w).dataset.hawkDensity=h,rt(this,w).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),rt(this,w).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),rt(this,b)&&(null==(e=(t=rt(this,b)).removeEventListener)||e.call(t,"change",rt(this,S)),ct(this,b,null)),"function"==typeof window.matchMedia&&(ct(this,b,window.matchMedia(`(max-width: ${l}px)`)),ct(this,S,()=>{rt(this,w).dataset.hawkCompact=String(rt(this,b).matches)}),rt(this,b).addEventListener("change",rt(this,S)),rt(this,S).call(this))},P=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
H=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(kt):null;return mt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
q=function(t){try{null==localStorage||localStorage.setItem(kt,t)}catch(t){}},N=function(){return ut(this,null,function*(){return rt(this,o)?rt(this,o):rt(this,f)?(ct(this,o,rt(this,f)),yield dt(this,x,D).call(this),rt(this,o)):(rt(this,c)||ct(this,c,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>ut(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),ct(this,o,t),yield dt(this,x,D).call(this),t}))),rt(this,c))})},D=function(){return ut(this,null,function*(){if(rt(this,h))return;if(!rt(this,o))return void dt(this,x,A).call(this,dt(this,x,L).call(this,[]));let t=[];try{const e=yield rt(this,o).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}dt(this,x,A).call(this,dt(this,x,L).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},j=function(){const t=rt(this,a)||[];rt(this,g).innerHTML=t.map(t=>{const e=t.id===rt(this,l);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(rt(this,g).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{dt(this,x,F).call(this,t),rt(this,y).focus()}),t.addEventListener("keydown",t=>dt(this,x,I).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
F=function(t){ct(this,l,t.dataset.filter),rt(this,g).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),dt(this,x,R).call(this,rt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
I=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),dt(this,x,F).call(this,i[s]))},R=function(t){return ut(this,null,function*(){var e;if(ct(this,i,t),yield dt(this,x,N).call(this),!rt(this,o))return;const h=(rt(this,a)||[]).find(t=>t.id===rt(this,l)),r=nt(nt(nt({},this.pagefindOptions),(null==h?void 0:h.pagefindOptions)||{}),(null==h?void 0:h.filter)?{filters:h.filter}:{}),{results:c}=t.trim()?yield rt(this,o).debouncedSearch(t,r):yield rt(this,o).search("",r),d=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}ct(this,n,d.slice(0,this.maxResults)),ct(this,s,rt(this,n).length?0:-1),dt(this,x,B).call(this)})},B=function(){if(!rt(this,n).length)return rt(this,m).innerHTML=`<div class="hawk-empty">No results${rt(this,i)?` for "${rt(this,i)}"`:""}.</div>`,rt(this,v).textContent=rt(this,i)?"0 matching results":"Type to search",void dt(this,x,K).call(this);rt(this,v).textContent=rt(this,i)?`${rt(this,n).length} matching result${1===rt(this,n).length?"":"s"}`:`${rt(this,n).length} entries`,rt(this,m).innerHTML=rt(this,n).map((t,e)=>`\n        <a href="${t.url}" class="hawk-result-item${e===rt(this,s)?" is-selected":""}" data-index="${e}" role="option" aria-selected="${e===rt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),rt(this,m).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>dt(this,x,U).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,rt(this,n)[Number(t.dataset.index)])})}),dt(this,x,K).call(this)},U=function(t,e){ct(this,s,t),rt(this,m).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),dt(this,x,K).call(this)},K=function(){const t=rt(this,n)[rt(this,s)];if(!t)return void(rt(this,k).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const i=t.url;if(i===rt(this,u))return;ct(this,u,i),rt(this,e).stop(rt(this,d)),rt(this,k).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const a=rt(this,k).querySelector(".hawk-preview-title"),l=rt(this,k).querySelector(".hawk-preview-content");rt(this,e).typeTitle(a,t.title,{isAnchor:t.isAnchor}),dt(this,x,z).call(this,t,i,l)},z=function(t,i,s){return ut(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield dt(this,x,V).call(this,e);n=t.isAnchor&&i?dt(this,x,X).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}rt(this,u)===i&&ct(this,d,rt(this,e).typeContent(s,n))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
V=function(t){if(rt(this,p).has(t))return rt(this,p).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw rt(this,p).delete(t),e});return rt(this,p).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
X=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},_=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),rt(this,n).length&&dt(this,x,U).call(this,(rt(this,s)+1)%rt(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),rt(this,n).length&&dt(this,x,U).call(this,(rt(this,s)-1+rt(this,n).length)%rt(this,n).length,!0);else if("Enter"===t.key){const t=rt(this,n)[rt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},G=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),rt(this,r)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&rt(this,r)&&this.close()},lt(bt,"themes",ft),lt(bt,"animations",wt),"undefined"!=typeof window&&(window.Hawk=bt);export{bt as HawkSearch,bt as default};
//# sourceMappingURL=hawk.mjs.map
