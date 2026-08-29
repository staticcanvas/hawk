/*! hawk v0.1.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,v,m,k,g,b,S,x,E,M,T,$,A,L,P,H,W,C,O,D,q,N,j,F,I,R,K,U,B,_,z,V,X,G,J,Q,Y,Z=Object.defineProperty,tt=Object.defineProperties,et=Object.getOwnPropertyDescriptors,it=Object.getOwnPropertySymbols,st=Object.prototype.hasOwnProperty,nt=Object.prototype.propertyIsEnumerable,at=t=>{throw TypeError(t)},lt=(t,e,i)=>e in t?Z(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ht=(t,e)=>{for(var i in e||(e={}))st.call(e,i)&&lt(t,i,e[i]);if(it)for(var i of it(e))nt.call(e,i)&&lt(t,i,e[i]);return t},rt=(t,e)=>tt(t,et(e)),ot=(t,e,i)=>lt(t,"symbol"!=typeof e?e+"":e,i),ct=(t,e,i)=>e.has(t)||at("Cannot "+i),dt=(t,e,i)=>(ct(t,e,"read from private field"),i?i.call(t):e.get(t)),ut=(t,e,i)=>e.has(t)?at("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),pt=(t,e,i,s)=>(ct(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ft=(t,e,i)=>(ct(t,e,"access private method"),i),wt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const yt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=yt);const vt=new Map,mt=new Map;mt.set("instant",yt);const kt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},gt=new Set(["fit","medium","compact"]),bt="hawk:density",St={open:!0,slash:!0,escape:!0};let xt=0;class Et{
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
constructor(t={}){var A,L;if(ut(this,E),ut(this,e),ut(this,i),ut(this,s),ut(this,n),ut(this,a),ut(this,l),ut(this,h),ut(this,r),ut(this,o),ut(this,c),ut(this,d),ut(this,u),ut(this,p),ut(this,f),ut(this,w),ut(this,y),ut(this,v),ut(this,m),ut(this,k),ut(this,g),ut(this,b),ut(this,S),ut(this,x),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${xt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,pt(this,w,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const P=ft(this,E,D).call(this);this.params=rt(ht(ht(ht({},kt),P?{density:P}:{}),t.params),{offset:ht(ht({},kt.offset),null==(A=t.params)?void 0:A.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(L=t.maxResults)?L:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.hotkeys=ht(ht({},St),t.hotkeys),this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,pt(this,e,ft(this,E,M).call(this,t.theme)),pt(this,i,ft(this,E,T).call(this,t.animation)),pt(this,s,""),pt(this,n,-1),pt(this,a,[]),pt(this,h,t.defaultTab||"all"),pt(this,l,ft(this,E,$).call(this,t)),pt(this,r,null!==dt(this,l)),pt(this,o,!1),pt(this,c,null),pt(this,d,null),pt(this,u,null),pt(this,p,null),pt(this,f,new Map),this.container&&ft(this,E,H).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){vt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){mt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:dt(this,o),query:dt(this,s),selectedIndex:dt(this,n),matches:dt(this,a),activeTab:dt(this,h)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=rt(ht(ht({},this.params),t),{offset:ht(ht({},this.params.offset),null==t?void 0:t.offset)}),ft(this,E,C).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;dt(this,y).hidden=!1,document.body.style.overflow="hidden",pt(this,o,!0),ft(this,E,N).call(this),setTimeout(()=>{dt(this,v).focus(),dt(this,v).select()},40),null==(t=this.onOpen)||t.call(this,dt(this,s))}
/** Closes the search modal. */close(){var t;dt(this,y).hidden=!0,document.body.style.overflow="",pt(this,o,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;dt(this,i).stop(dt(this,u)),null==(e=null==(t=dt(this,S))?void 0:t.removeEventListener)||e.call(t,"change",dt(this,x)),null==(s=dt(this,y))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,g=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakMap,E=new WeakSet,M=function(t){if(!t)return vt.get("typeflow")||null;if("string"==typeof t){const e=vt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},T=function(t){if(!1===t)return mt.get("instant");if(!t)return mt.get("typeflow")||mt.get("instant");if("string"==typeof t){const e=mt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
$=function(t){return t.tabs?ft(this,E,A).call(this,t.tabs):t.categories?ft(this,E,A).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
A=function(t){const e=t.map(t=>({id:t.id||ft(this,E,L).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},L=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
P=function(t){var e,i;pt(this,l,t),t.some(t=>t.id===dt(this,h))||("all"!==dt(this,h)&&console.warn(`HawkSearch: no tab with id "${dt(this,h)}" (defaultTab); falling back to "all".`),pt(this,h,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ft(this,E,F).call(this)},H=function(){const t=document.createElement("div");t.innerHTML=ft(this,E,W).call(this),pt(this,y,t.firstElementChild),this.container.appendChild(dt(this,y)),pt(this,v,dt(this,y).querySelector(".hawk-modal-input")),pt(this,m,dt(this,y).querySelector(".hawk-results-pane")),pt(this,k,dt(this,y).querySelector(".hawk-preview-pane")),pt(this,g,dt(this,y).querySelector(".hawk-modal-filters")),pt(this,b,dt(this,y).querySelector(".hawk-modal-counter")),dt(this,e)&&dt(this,e).apply(dt(this,y)),ft(this,E,C).call(this),dt(this,r)&&ft(this,E,P).call(this,dt(this,l)),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),dt(this,y).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),dt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),ft(this,E,q).call(this,t.dataset.density)})}),dt(this,v).addEventListener("input",()=>ft(this,E,K).call(this,dt(this,v).value)),dt(this,v).addEventListener("keydown",t=>ft(this,E,G).call(this,t)),dt(this,v).addEventListener("focus",()=>ft(this,E,N).call(this),{once:!0}),dt(this,m).addEventListener("keydown",t=>ft(this,E,J).call(this,t)),dt(this,k).addEventListener("keydown",t=>ft(this,E,Q).call(this,t)),dt(this,k).addEventListener("focus",()=>{dt(this,y).dataset.hawkShowPreview="true"}),dt(this,k).addEventListener("blur",()=>{dt(this,y).dataset.hawkShowPreview="false"}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>ft(this,E,Y).call(this,t))},W=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?'<div class="hawk-density-toggle" role="group" aria-label="Result density">\n              <button type="button" class="hawk-density-btn" data-density="fit">Fit</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">Medium</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">Compact</button>\n            </div>':""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="Preview" tabindex="0">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},C=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;dt(this,y).style.setProperty("--hawk-scale",String(i)),dt(this,y).style.setProperty("--hawk-offset-x",ft(this,E,O).call(this,n.x)),dt(this,y).style.setProperty("--hawk-offset-y",ft(this,E,O).call(this,n.y)),dt(this,y).dataset.hawkPosition=s,dt(this,y).dataset.hawkDensity=h,dt(this,y).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),dt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),dt(this,S)&&(null==(e=(t=dt(this,S)).removeEventListener)||e.call(t,"change",dt(this,x)),pt(this,S,null)),"function"==typeof window.matchMedia&&(pt(this,S,window.matchMedia(`(max-width: ${l}px)`)),pt(this,x,()=>{dt(this,y).dataset.hawkCompact=String(dt(this,S).matches)}),dt(this,S).addEventListener("change",dt(this,x)),dt(this,x).call(this))},O=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
D=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(bt):null;return gt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
q=function(t){try{null==localStorage||localStorage.setItem(bt,t)}catch(t){}},N=function(){return wt(this,null,function*(){return dt(this,c)?dt(this,c):dt(this,w)?(pt(this,c,dt(this,w)),yield ft(this,E,j).call(this),dt(this,c)):(dt(this,d)||pt(this,d,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>wt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),pt(this,c,t),yield ft(this,E,j).call(this),t}))),dt(this,d))})},j=function(){return wt(this,null,function*(){if(dt(this,r))return;if(!dt(this,c))return void ft(this,E,P).call(this,ft(this,E,A).call(this,[]));let t=[];try{const e=yield dt(this,c).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ft(this,E,P).call(this,ft(this,E,A).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},F=function(){const t=dt(this,l)||[];dt(this,g).innerHTML=t.map(t=>{const e=t.id===dt(this,h);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(dt(this,g).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ft(this,E,I).call(this,t),dt(this,v).focus()}),t.addEventListener("keydown",t=>ft(this,E,R).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
I=function(t){pt(this,h,t.dataset.filter),dt(this,g).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ft(this,E,K).call(this,dt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
R=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ft(this,E,I).call(this,i[s]))},K=function(t){return wt(this,null,function*(){var e;if(pt(this,s,t),yield ft(this,E,N).call(this),!dt(this,c))return;const i=(dt(this,l)||[]).find(t=>t.id===dt(this,h)),r=ht(ht(ht({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),(null==i?void 0:i.filter)?{filters:i.filter}:{}),{results:o}=t.trim()?yield dt(this,c).debouncedSearch(t,r):yield dt(this,c).search("",r),d=[];for(const t of(o||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}pt(this,a,d.slice(0,this.maxResults)),pt(this,n,dt(this,a).length?0:-1),ft(this,E,U).call(this)})},U=function(){if(!dt(this,a).length)return dt(this,m).innerHTML=`<div class="hawk-empty">No results${dt(this,s)?` for "${dt(this,s)}"`:""}.</div>`,dt(this,m).removeAttribute("aria-activedescendant"),dt(this,b).textContent=dt(this,s)?"0 matching results":"Type to search",void ft(this,E,_).call(this);dt(this,b).textContent=dt(this,s)?`${dt(this,a).length} matching result${1===dt(this,a).length?"":"s"}`:`${dt(this,a).length} entries`,dt(this,m).innerHTML=dt(this,a).map((t,e)=>`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===dt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===dt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),dt(this,m).setAttribute("aria-activedescendant",`${this.id}-result-${dt(this,n)}`),dt(this,m).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ft(this,E,B).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,dt(this,a)[Number(t.dataset.index)])})}),ft(this,E,_).call(this)},B=function(t,e){pt(this,n,t),dt(this,m).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),dt(this,m).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ft(this,E,_).call(this)},_=function(){const t=dt(this,a)[dt(this,n)];if(!t)return void(dt(this,k).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const e=t.url;if(e===dt(this,p))return;pt(this,p,e),dt(this,i).stop(dt(this,u)),dt(this,k).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const s=dt(this,k).querySelector(".hawk-preview-title"),l=dt(this,k).querySelector(".hawk-preview-content");dt(this,i).typeTitle(s,t.title,{isAnchor:t.isAnchor}),ft(this,E,z).call(this,t,e,l)},z=function(t,e,s){return wt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ft(this,E,V).call(this,e);n=t.isAnchor&&i?ft(this,E,X).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}dt(this,p)===e&&pt(this,u,dt(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
V=function(t){if(dt(this,f).has(t))return dt(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw dt(this,f).delete(t),e});return dt(this,f).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
X=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
G=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),dt(this,a).length&&ft(this,E,B).call(this,(dt(this,n)+1)%dt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),dt(this,a).length&&ft(this,E,B).call(this,(dt(this,n)-1+dt(this,a).length)%dt(this,a).length,!0);else if("Enter"===t.key){const t=dt(this,a)[dt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
J=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),dt(this,v).focus(),dt(this,v).value+=t.key,void dt(this,v).dispatchEvent(new Event("input"));ft(this,E,G).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
Q=function(t){"ArrowDown"===t.key?(t.preventDefault(),dt(this,k).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),dt(this,k).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),dt(this,k).scrollTop+=dt(this,k).clientHeight):"PageUp"===t.key?(t.preventDefault(),dt(this,k).scrollTop-=dt(this,k).clientHeight):"Home"===t.key?(t.preventDefault(),dt(this,k).scrollTop=0):"End"===t.key&&(t.preventDefault(),dt(this,k).scrollTop=dt(this,k).scrollHeight)},Y=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),dt(this,o)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&dt(this,o)&&this.close()},ot(Et,"themes",vt),ot(Et,"animations",mt),"undefined"!=typeof window&&(window.Hawk=Et),t.HawkSearch=Et,t.default=Et,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
