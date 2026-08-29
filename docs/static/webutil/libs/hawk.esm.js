/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,a,n,l,h,r,o,c,d,u,p,f,w,y,v,k,m,g,b,S,x,E,T,M,$,A,L,P,H,W,C,q,O,D,N,j,R,U,F,I,K,B,z,V,X,_,G,J,Q,Y,Z,tt=Object.defineProperty,et=Object.defineProperties,it=Object.getOwnPropertyDescriptors,st=Object.getOwnPropertySymbols,at=Object.prototype.hasOwnProperty,nt=Object.prototype.propertyIsEnumerable,lt=t=>{throw TypeError(t)},ht=(t,e,i)=>e in t?tt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,rt=(t,e)=>{for(var i in e||(e={}))at.call(e,i)&&ht(t,i,e[i]);if(st)for(var i of st(e))nt.call(e,i)&&ht(t,i,e[i]);return t},ot=(t,e)=>et(t,it(e)),ct=(t,e,i)=>ht(t,"symbol"!=typeof e?e+"":e,i),dt=(t,e,i)=>e.has(t)||lt("Cannot "+i),ut=(t,e,i)=>(dt(t,e,"read from private field"),i?i.call(t):e.get(t)),pt=(t,e,i)=>e.has(t)?lt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),ft=(t,e,i,s)=>(dt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),wt=(t,e,i)=>(dt(t,e,"access private method"),i),yt=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{h(i.next(t))}catch(t){a(t)}},l=t=>{try{h(i.throw(t))}catch(t){a(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);h((i=i.apply(t,e)).next())});const vt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=vt);const kt=new Map,mt=new Map;mt.set("instant",vt);const gt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},bt=new Set(["fit","medium","compact"]),St="hawk:density",xt={open:!0,slash:!0,escape:!0};let Et=0;class Tt{
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
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor($={}){var A,L;if(pt(this,x),pt(this,t),pt(this,e),pt(this,i),pt(this,s),pt(this,a),pt(this,n),pt(this,l),pt(this,h),pt(this,r),pt(this,o),pt(this,c),pt(this,d),pt(this,u),pt(this,p),pt(this,f),pt(this,w),pt(this,y),pt(this,v),pt(this,k),pt(this,m),pt(this,g),pt(this,b),pt(this,S),!$.index&&!$.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=$.id||`hawk-search-${Et+=1}`,this.indexBasePath=$.index?$.index.endsWith("/")?$.index:`${$.index}/`:null,ft(this,f,$.pagefind||null),this.triggerSelector=$.triggerSelector||"[data-search-trigger]",this.container=$.container||("undefined"!=typeof document?document.body:null);const H=wt(this,x,q).call(this);this.params=ot(rt(rt(rt({},gt),H?{density:H}:{}),$.params),{offset:rt(rt({},gt.offset),null==(A=$.params)?void 0:A.offset)}),this.categoryFilterName=$.categoryFilterName||"category",this.includeAllTab=!1!==$.includeAllTab,this.pagefindOptions=$.pagefindOptions||{},this.maxResults=null!=(L=$.maxResults)?L:18,this.contentSelector=$.contentSelector||"[data-pagefind-body]",this.hotkeys=rt(rt({},xt),$.hotkeys),this.defaultPreviewUrl=$.defaultPreviewUrl||null,this.defaultPreviewTitle=$.defaultPreviewTitle||"",this.eagerResults=!1!==$.eagerResults,this.onOpen=$.onOpen,this.onClose=$.onClose,this.onSelect=$.onSelect,ft(this,t,wt(this,x,E).call(this,$.theme)),ft(this,e,wt(this,x,T).call(this,$.animation)),ft(this,i,""),ft(this,s,-1),ft(this,a,[]),ft(this,l,$.defaultTab||"all"),ft(this,n,wt(this,x,M).call(this,$)),ft(this,h,null!==ut(this,n)),ft(this,r,!1),ft(this,o,null),ft(this,c,null),ft(this,d,null),ft(this,u,null),ft(this,p,new Map),this.container&&wt(this,x,P).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){kt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){mt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:ut(this,r),query:ut(this,i),selectedIndex:ut(this,s),matches:ut(this,a),activeTab:ut(this,l)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=ot(rt(rt({},this.params),t),{offset:rt(rt({},this.params.offset),null==t?void 0:t.offset)}),wt(this,x,W).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;ut(this,w).hidden=!1,document.body.style.overflow="hidden",ft(this,r,!0),wt(this,x,D).call(this),setTimeout(()=>{ut(this,y).focus(),ut(this,y).select()},40),null==(t=this.onOpen)||t.call(this,ut(this,i))}
/** Closes the search modal. */close(){var t;ut(this,w).hidden=!0,document.body.style.overflow="",ft(this,r,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;ut(this,e).stop(ut(this,d)),null==(i=null==(t=ut(this,b))?void 0:t.removeEventListener)||i.call(t,"change",ut(this,S)),null==(s=ut(this,w))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,k=new WeakMap,m=new WeakMap,g=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakSet,E=function(t){if(!t)return kt.get("typeflow")||null;if("string"==typeof t){const e=kt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},T=function(t){if(!1===t)return mt.get("instant");if(!t)return mt.get("typeflow")||mt.get("instant");if("string"==typeof t){const e=mt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
M=function(t){return t.tabs?wt(this,x,$).call(this,t.tabs):t.categories?wt(this,x,$).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
$=function(t){const e=t.map(t=>({id:t.id||wt(this,x,A).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},A=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
L=function(t){var e,i;ft(this,n,t),t.some(t=>t.id===ut(this,l))||("all"!==ut(this,l)&&console.warn(`HawkSearch: no tab with id "${ut(this,l)}" (defaultTab); falling back to "all".`),ft(this,l,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),wt(this,x,U).call(this)},P=function(){const e=document.createElement("div");e.innerHTML=wt(this,x,H).call(this),ft(this,w,e.firstElementChild),this.container.appendChild(ut(this,w)),ft(this,y,ut(this,w).querySelector(".hawk-modal-input")),ft(this,v,ut(this,w).querySelector(".hawk-results-pane")),ft(this,k,ut(this,w).querySelector(".hawk-preview-pane")),ft(this,m,ut(this,w).querySelector(".hawk-modal-filters")),ft(this,g,ut(this,w).querySelector(".hawk-modal-counter")),ut(this,t)&&ut(this,t).apply(ut(this,w)),wt(this,x,W).call(this),ut(this,h)&&wt(this,x,L).call(this,ut(this,n)),this.defaultPreviewUrl&&wt(this,x,j).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),ut(this,w).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),ut(this,w).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),wt(this,x,O).call(this,t.dataset.density)})}),ut(this,y).addEventListener("input",()=>wt(this,x,K).call(this,ut(this,y).value)),ut(this,y).addEventListener("keydown",t=>wt(this,x,J).call(this,t)),ut(this,y).addEventListener("focus",()=>wt(this,x,D).call(this),{once:!0}),ut(this,v).addEventListener("keydown",t=>wt(this,x,Q).call(this,t)),ut(this,k).addEventListener("keydown",t=>wt(this,x,Y).call(this,t)),ut(this,k).addEventListener("focus",()=>{ut(this,w).dataset.hawkShowPreview="true"}),ut(this,k).addEventListener("blur",()=>{ut(this,w).dataset.hawkShowPreview="false"}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>wt(this,x,Z).call(this,t))},H=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?'<div class="hawk-density-toggle" role="group" aria-label="Result density">\n              <button type="button" class="hawk-density-btn" data-density="fit">Fit</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">Medium</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">Compact</button>\n            </div>':""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="Preview" tabindex="0">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},W=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:h}=this.params;ut(this,w).style.setProperty("--hawk-scale",String(i)),ut(this,w).style.setProperty("--hawk-offset-x",wt(this,x,C).call(this,a.x)),ut(this,w).style.setProperty("--hawk-offset-y",wt(this,x,C).call(this,a.y)),ut(this,w).dataset.hawkPosition=s,ut(this,w).dataset.hawkDensity=h,ut(this,w).querySelector(".hawk-modal-body").dataset.hawkColumns=String(n),ut(this,w).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),ut(this,b)&&(null==(e=(t=ut(this,b)).removeEventListener)||e.call(t,"change",ut(this,S)),ft(this,b,null)),"function"==typeof window.matchMedia&&(ft(this,b,window.matchMedia(`(max-width: ${l}px)`)),ft(this,S,()=>{ut(this,w).dataset.hawkCompact=String(ut(this,b).matches)}),ut(this,b).addEventListener("change",ut(this,S)),ut(this,S).call(this))},C=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(St):null;return bt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
O=function(t){try{null==localStorage||localStorage.setItem(St,t)}catch(t){}},D=function(){return yt(this,null,function*(){return ut(this,o)?ut(this,o):ut(this,f)?(ft(this,o,ut(this,f)),yield wt(this,x,R).call(this),yield wt(this,x,N).call(this),ut(this,o)):(ut(this,c)||ft(this,c,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>yt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),ft(this,o,t),yield wt(this,x,R).call(this),yield wt(this,x,N).call(this),t}))),ut(this,c))})},N=function(){return yt(this,null,function*(){this.eagerResults&&!ut(this,i)&&(yield wt(this,x,K).call(this,""))})},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
j=function(){const t=this.defaultPreviewUrl;ft(this,u,t),ut(this,k).innerHTML='\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    ';const i=ut(this,k).querySelector(".hawk-preview-title"),s=ut(this,k).querySelector(".hawk-preview-content");ut(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),wt(this,x,X).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},R=function(){return yt(this,null,function*(){if(ut(this,h))return;if(!ut(this,o))return void wt(this,x,L).call(this,wt(this,x,$).call(this,[]));let t=[];try{const e=yield ut(this,o).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}wt(this,x,L).call(this,wt(this,x,$).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},U=function(){const t=ut(this,n)||[];ut(this,m).innerHTML=t.map(t=>{const e=t.id===ut(this,l);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(ut(this,m).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{wt(this,x,F).call(this,t),ut(this,y).focus()}),t.addEventListener("keydown",t=>wt(this,x,I).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
F=function(t){ft(this,l,t.dataset.filter),ut(this,m).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),wt(this,x,K).call(this,ut(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
I=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),wt(this,x,F).call(this,i[s]))},K=function(t){return yt(this,null,function*(){var e;if(ft(this,i,t),yield wt(this,x,D).call(this),!ut(this,o))return;const h=(ut(this,n)||[]).find(t=>t.id===ut(this,l)),r=rt(rt(rt({},this.pagefindOptions),(null==h?void 0:h.pagefindOptions)||{}),(null==h?void 0:h.filter)?{filters:h.filter}:{}),{results:c}=t.trim()?yield ut(this,o).debouncedSearch(t,r):yield ut(this,o).search("",r),d=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}ft(this,a,d.slice(0,this.maxResults)),ft(this,s,ut(this,a).length?0:-1),wt(this,x,B).call(this)})},B=function(){if(!ut(this,a).length)return ut(this,v).innerHTML=`<div class="hawk-empty">No results${ut(this,i)?` for "${ut(this,i)}"`:""}.</div>`,ut(this,v).removeAttribute("aria-activedescendant"),ut(this,g).textContent=ut(this,i)?"0 matching results":"Type to search",void wt(this,x,V).call(this);ut(this,g).textContent=ut(this,i)?`${ut(this,a).length} matching result${1===ut(this,a).length?"":"s"}`:`${ut(this,a).length} entries`,ut(this,v).innerHTML=ut(this,a).map((t,e)=>`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===ut(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===ut(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),ut(this,v).setAttribute("aria-activedescendant",`${this.id}-result-${ut(this,s)}`),ut(this,v).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>wt(this,x,z).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,ut(this,a)[Number(t.dataset.index)])})}),wt(this,x,V).call(this)},z=function(t,e){ft(this,s,t),ut(this,v).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),ut(this,v).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),wt(this,x,V).call(this)},V=function(){const t=ut(this,a)[ut(this,s)];if(!t)return void(ut(this,k).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const i=t.url;if(i===ut(this,u))return;ft(this,u,i),ut(this,e).stop(ut(this,d)),ut(this,k).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const n=ut(this,k).querySelector(".hawk-preview-title"),l=ut(this,k).querySelector(".hawk-preview-content");ut(this,e).typeTitle(n,t.title,{isAnchor:t.isAnchor}),wt(this,x,X).call(this,t,i,l)},X=function(t,i,s){return yt(this,null,function*(){let a=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield wt(this,x,_).call(this,e);a=t.isAnchor&&i?wt(this,x,G).call(this,s,i):s.innerHTML}catch(e){a=t.excerpt||""}ut(this,u)===i&&ft(this,d,ut(this,e).typeContent(s,a))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
_=function(t){if(ut(this,p).has(t))return ut(this,p).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw ut(this,p).delete(t),e});return ut(this,p).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
G=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
J=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),ut(this,a).length&&wt(this,x,z).call(this,(ut(this,s)+1)%ut(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),ut(this,a).length&&wt(this,x,z).call(this,(ut(this,s)-1+ut(this,a).length)%ut(this,a).length,!0);else if("Enter"===t.key){const t=ut(this,a)[ut(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
Q=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),ut(this,y).focus(),ut(this,y).value+=t.key,void ut(this,y).dispatchEvent(new Event("input"));wt(this,x,J).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
Y=function(t){"ArrowDown"===t.key?(t.preventDefault(),ut(this,k).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),ut(this,k).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),ut(this,k).scrollTop+=ut(this,k).clientHeight):"PageUp"===t.key?(t.preventDefault(),ut(this,k).scrollTop-=ut(this,k).clientHeight):"Home"===t.key?(t.preventDefault(),ut(this,k).scrollTop=0):"End"===t.key&&(t.preventDefault(),ut(this,k).scrollTop=ut(this,k).scrollHeight)},Z=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),ut(this,r)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&ut(this,r)&&this.close()},ct(Tt,"themes",kt),ct(Tt,"animations",mt),"undefined"!=typeof window&&(window.Hawk=Tt);export{Tt as HawkSearch,Tt as default};
//# sourceMappingURL=hawk.esm.js.map
