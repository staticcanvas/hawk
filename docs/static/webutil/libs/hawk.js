/*! hawk v0.1.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,m,k,g,v,b,S,x,M,E,T,$,L,A,W,C,H,O,P,q,N,j,D,F,I,R,B,U,_,K,z,V,X,G,J,Q=Object.defineProperty,Y=Object.defineProperties,Z=Object.getOwnPropertyDescriptors,tt=Object.getOwnPropertySymbols,et=Object.prototype.hasOwnProperty,it=Object.prototype.propertyIsEnumerable,st=t=>{throw TypeError(t)},nt=(t,e,i)=>e in t?Q(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,at=(t,e)=>{for(var i in e||(e={}))et.call(e,i)&&nt(t,i,e[i]);if(tt)for(var i of tt(e))it.call(e,i)&&nt(t,i,e[i]);return t},lt=(t,e)=>Y(t,Z(e)),ht=(t,e,i)=>nt(t,"symbol"!=typeof e?e+"":e,i),rt=(t,e,i)=>e.has(t)||st("Cannot "+i),ot=(t,e,i)=>(rt(t,e,"read from private field"),i?i.call(t):e.get(t)),ct=(t,e,i)=>e.has(t)?st("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),dt=(t,e,i,s)=>(rt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ut=(t,e,i)=>(rt(t,e,"access private method"),i),pt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const ft={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=ft);const wt=new Map,yt=new Map;yt.set("instant",ft);const mt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},kt=new Set(["fit","medium","compact"]),gt="hawk:density",vt={open:!0,slash:!0,escape:!0};let bt=0;class St{
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
constructor(t={}){var L,A;if(ct(this,M),ct(this,e),ct(this,i),ct(this,s),ct(this,n),ct(this,a),ct(this,l),ct(this,h),ct(this,r),ct(this,o),ct(this,c),ct(this,d),ct(this,u),ct(this,p),ct(this,f),ct(this,w),ct(this,y),ct(this,m),ct(this,k),ct(this,g),ct(this,v),ct(this,b),ct(this,S),ct(this,x),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${bt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,dt(this,w,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const W=ut(this,M,q).call(this);this.params=lt(at(at(at({},mt),W?{density:W}:{}),t.params),{offset:at(at({},mt.offset),null==(L=t.params)?void 0:L.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(A=t.maxResults)?A:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.hotkeys=at(at({},vt),t.hotkeys),this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,dt(this,e,ut(this,M,E).call(this,t.theme)),dt(this,i,ut(this,M,T).call(this,t.animation)),dt(this,s,""),dt(this,n,-1),dt(this,a,[]),dt(this,h,t.defaultTab||"all"),dt(this,l,ut(this,M,$).call(this,t)),dt(this,r,null!==ot(this,l)),dt(this,o,!1),dt(this,c,null),dt(this,d,null),dt(this,u,null),dt(this,p,null),dt(this,f,new Map),this.container&&ut(this,M,C).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){wt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){yt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ot(this,o),query:ot(this,s),selectedIndex:ot(this,n),matches:ot(this,a),activeTab:ot(this,h)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=lt(at(at({},this.params),t),{offset:at(at({},this.params.offset),null==t?void 0:t.offset)}),ut(this,M,O).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;ot(this,y).hidden=!1,document.body.style.overflow="hidden",dt(this,o,!0),ut(this,M,j).call(this),setTimeout(()=>{ot(this,m).focus(),ot(this,m).select()},40),null==(t=this.onOpen)||t.call(this,ot(this,s))}
/** Closes the search modal. */close(){var t;ot(this,y).hidden=!0,document.body.style.overflow="",dt(this,o,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;ot(this,i).stop(ot(this,u)),null==(e=null==(t=ot(this,S))?void 0:t.removeEventListener)||e.call(t,"change",ot(this,x)),null==(s=ot(this,y))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,m=new WeakMap,k=new WeakMap,g=new WeakMap,v=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakMap,M=new WeakSet,E=function(t){if(!t)return wt.get("typeflow")||null;if("string"==typeof t){const e=wt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},T=function(t){if(!1===t)return yt.get("instant");if(!t)return yt.get("typeflow")||yt.get("instant");if("string"==typeof t){const e=yt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
$=function(t){return t.tabs?ut(this,M,L).call(this,t.tabs):t.categories?ut(this,M,L).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
L=function(t){const e=t.map(t=>({id:t.id||ut(this,M,A).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},A=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
W=function(t){var e,i;dt(this,l,t),t.some(t=>t.id===ot(this,h))||("all"!==ot(this,h)&&console.warn(`HawkSearch: no tab with id "${ot(this,h)}" (defaultTab); falling back to "all".`),dt(this,h,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ut(this,M,F).call(this)},C=function(){const t=document.createElement("div");t.innerHTML=ut(this,M,H).call(this),dt(this,y,t.firstElementChild),this.container.appendChild(ot(this,y)),dt(this,m,ot(this,y).querySelector(".hawk-modal-input")),dt(this,k,ot(this,y).querySelector(".hawk-results-pane")),dt(this,g,ot(this,y).querySelector(".hawk-preview-pane")),dt(this,v,ot(this,y).querySelector(".hawk-modal-filters")),dt(this,b,ot(this,y).querySelector(".hawk-modal-counter")),ot(this,e)&&ot(this,e).apply(ot(this,y)),ut(this,M,O).call(this),ot(this,r)&&ut(this,M,W).call(this,ot(this,l)),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ot(this,y).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ot(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ut(this,M,N).call(this,t.dataset.density)})}),ot(this,m).addEventListener("input",()=>ut(this,M,B).call(this,ot(this,m).value)),ot(this,m).addEventListener("keydown",t=>ut(this,M,G).call(this,t)),ot(this,m).addEventListener("focus",()=>ut(this,M,j).call(this),{once:!0}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>ut(this,M,J).call(this,t))},H=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?'<div class="hawk-density-toggle" role="group" aria-label="Result density">\n              <button type="button" class="hawk-density-btn" data-density="fit">Fit</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">Medium</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">Compact</button>\n            </div>':""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite"></div>\n            <aside class="hawk-preview-pane" aria-live="polite">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},O=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;ot(this,y).style.setProperty("--hawk-scale",String(i)),ot(this,y).style.setProperty("--hawk-offset-x",ut(this,M,P).call(this,n.x)),ot(this,y).style.setProperty("--hawk-offset-y",ut(this,M,P).call(this,n.y)),ot(this,y).dataset.hawkPosition=s,ot(this,y).dataset.hawkDensity=h,ot(this,y).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),ot(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ot(this,S)&&(null==(e=(t=ot(this,S)).removeEventListener)||e.call(t,"change",ot(this,x)),dt(this,S,null)),"function"==typeof window.matchMedia&&(dt(this,S,window.matchMedia(`(max-width: ${l}px)`)),dt(this,x,()=>{ot(this,y).dataset.hawkCompact=String(ot(this,S).matches)}),ot(this,S).addEventListener("change",ot(this,x)),ot(this,x).call(this))},P=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(gt):null;return kt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
N=function(t){try{null==localStorage||localStorage.setItem(gt,t)}catch(t){}},j=function(){return pt(this,null,function*(){return ot(this,c)?ot(this,c):ot(this,w)?(dt(this,c,ot(this,w)),yield ut(this,M,D).call(this),ot(this,c)):(ot(this,d)||dt(this,d,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>pt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),dt(this,c,t),yield ut(this,M,D).call(this),t}))),ot(this,d))})},D=function(){return pt(this,null,function*(){if(ot(this,r))return;if(!ot(this,c))return void ut(this,M,W).call(this,ut(this,M,L).call(this,[]));let t=[];try{const e=yield ot(this,c).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ut(this,M,W).call(this,ut(this,M,L).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},F=function(){const t=ot(this,l)||[];ot(this,v).innerHTML=t.map(t=>{const e=t.id===ot(this,h);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(ot(this,v).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ut(this,M,I).call(this,t),ot(this,m).focus()}),t.addEventListener("keydown",t=>ut(this,M,R).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
I=function(t){dt(this,h,t.dataset.filter),ot(this,v).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ut(this,M,B).call(this,ot(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
R=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ut(this,M,I).call(this,i[s]))},B=function(t){return pt(this,null,function*(){var e;if(dt(this,s,t),yield ut(this,M,j).call(this),!ot(this,c))return;const i=(ot(this,l)||[]).find(t=>t.id===ot(this,h)),r=at(at(at({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),(null==i?void 0:i.filter)?{filters:i.filter}:{}),{results:o}=t.trim()?yield ot(this,c).debouncedSearch(t,r):yield ot(this,c).search("",r),d=[];for(const t of(o||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}dt(this,a,d.slice(0,this.maxResults)),dt(this,n,ot(this,a).length?0:-1),ut(this,M,U).call(this)})},U=function(){if(!ot(this,a).length)return ot(this,k).innerHTML=`<div class="hawk-empty">No results${ot(this,s)?` for "${ot(this,s)}"`:""}.</div>`,ot(this,b).textContent=ot(this,s)?"0 matching results":"Type to search",void ut(this,M,K).call(this);ot(this,b).textContent=ot(this,s)?`${ot(this,a).length} matching result${1===ot(this,a).length?"":"s"}`:`${ot(this,a).length} entries`,ot(this,k).innerHTML=ot(this,a).map((t,e)=>`\n        <a href="${t.url}" class="hawk-result-item${e===ot(this,n)?" is-selected":""}" data-index="${e}" role="option" aria-selected="${e===ot(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),ot(this,k).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ut(this,M,_).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,ot(this,a)[Number(t.dataset.index)])})}),ut(this,M,K).call(this)},_=function(t,e){dt(this,n,t),ot(this,k).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ut(this,M,K).call(this)},K=function(){const t=ot(this,a)[ot(this,n)];if(!t)return void(ot(this,g).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const e=t.url;if(e===ot(this,p))return;dt(this,p,e),ot(this,i).stop(ot(this,u)),ot(this,g).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const s=ot(this,g).querySelector(".hawk-preview-title"),l=ot(this,g).querySelector(".hawk-preview-content");ot(this,i).typeTitle(s,t.title,{isAnchor:t.isAnchor}),ut(this,M,z).call(this,t,e,l)},z=function(t,e,s){return pt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ut(this,M,V).call(this,e);n=t.isAnchor&&i?ut(this,M,X).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}ot(this,p)===e&&dt(this,u,ot(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
V=function(t){if(ot(this,f).has(t))return ot(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ot(this,f).delete(t),e});return ot(this,f).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
X=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},G=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ot(this,a).length&&ut(this,M,_).call(this,(ot(this,n)+1)%ot(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ot(this,a).length&&ut(this,M,_).call(this,(ot(this,n)-1+ot(this,a).length)%ot(this,a).length,!0);else if("Enter"===t.key){const t=ot(this,a)[ot(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},J=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ot(this,o)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ot(this,o)&&this.close()},ht(St,"themes",wt),ht(St,"animations",yt),"undefined"!=typeof window&&(window.Hawk=St),t.HawkSearch=St,t.default=St,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.js.map
