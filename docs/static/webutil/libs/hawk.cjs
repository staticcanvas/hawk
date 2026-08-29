/*! hawk v0.1.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,v,k,m,g,b,S,x,E,T,M,$,A,L,P,H,W,C,O,q,D,N,j,R,U,F,I,K,B,_,z,V,X,G,J,Q,Y,Z,tt,et=Object.defineProperty,it=Object.defineProperties,st=Object.getOwnPropertyDescriptors,nt=Object.getOwnPropertySymbols,at=Object.prototype.hasOwnProperty,lt=Object.prototype.propertyIsEnumerable,ht=t=>{throw TypeError(t)},rt=(t,e,i)=>e in t?et(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,ot=(t,e)=>{for(var i in e||(e={}))at.call(e,i)&&rt(t,i,e[i]);if(nt)for(var i of nt(e))lt.call(e,i)&&rt(t,i,e[i]);return t},ct=(t,e)=>it(t,st(e)),dt=(t,e,i)=>rt(t,"symbol"!=typeof e?e+"":e,i),ut=(t,e,i)=>e.has(t)||ht("Cannot "+i),pt=(t,e,i)=>(ut(t,e,"read from private field"),i?i.call(t):e.get(t)),ft=(t,e,i)=>e.has(t)?ht("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),wt=(t,e,i,s)=>(ut(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),yt=(t,e,i)=>(ut(t,e,"access private method"),i),vt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const kt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=kt);const mt=new Map,gt=new Map;gt.set("instant",kt);const bt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},St=new Set(["fit","medium","compact"]),xt="hawk:density",Et={open:!0,slash:!0,escape:!0};let Tt=0;class Mt{
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
constructor(t={}){var A,L;if(ft(this,E),ft(this,e),ft(this,i),ft(this,s),ft(this,n),ft(this,a),ft(this,l),ft(this,h),ft(this,r),ft(this,o),ft(this,c),ft(this,d),ft(this,u),ft(this,p),ft(this,f),ft(this,w),ft(this,y),ft(this,v),ft(this,k),ft(this,m),ft(this,g),ft(this,b),ft(this,S),ft(this,x),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Tt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,wt(this,w,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const P=yt(this,E,q).call(this);this.params=ct(ot(ot(ot({},bt),P?{density:P}:{}),t.params),{offset:ot(ot({},bt.offset),null==(A=t.params)?void 0:A.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(L=t.maxResults)?L:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.hotkeys=ot(ot({},Et),t.hotkeys),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,wt(this,e,yt(this,E,T).call(this,t.theme)),wt(this,i,yt(this,E,M).call(this,t.animation)),wt(this,s,""),wt(this,n,-1),wt(this,a,[]),wt(this,h,t.defaultTab||"all"),wt(this,l,yt(this,E,$).call(this,t)),wt(this,r,null!==pt(this,l)),wt(this,o,!1),wt(this,c,null),wt(this,d,null),wt(this,u,null),wt(this,p,null),wt(this,f,new Map),this.container&&yt(this,E,H).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){mt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){gt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:pt(this,o),query:pt(this,s),selectedIndex:pt(this,n),matches:pt(this,a),activeTab:pt(this,h)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=ct(ot(ot({},this.params),t),{offset:ot(ot({},this.params.offset),null==t?void 0:t.offset)}),yt(this,E,C).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;pt(this,y).hidden=!1,document.body.style.overflow="hidden",wt(this,o,!0),yt(this,E,N).call(this),setTimeout(()=>{pt(this,v).focus(),pt(this,v).select()},40),null==(t=this.onOpen)||t.call(this,pt(this,s))}
/** Closes the search modal. */close(){var t;pt(this,y).hidden=!0,document.body.style.overflow="",wt(this,o,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;pt(this,i).stop(pt(this,u)),null==(e=null==(t=pt(this,S))?void 0:t.removeEventListener)||e.call(t,"change",pt(this,x)),null==(s=pt(this,y))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,k=new WeakMap,m=new WeakMap,g=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakMap,E=new WeakSet,T=function(t){if(!t)return mt.get("typeflow")||null;if("string"==typeof t){const e=mt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},M=function(t){if(!1===t)return gt.get("instant");if(!t)return gt.get("typeflow")||gt.get("instant");if("string"==typeof t){const e=gt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
$=function(t){return t.tabs?yt(this,E,A).call(this,t.tabs):t.categories?yt(this,E,A).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
A=function(t){const e=t.map(t=>({id:t.id||yt(this,E,L).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},L=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
P=function(t){var e,i;wt(this,l,t),t.some(t=>t.id===pt(this,h))||("all"!==pt(this,h)&&console.warn(`HawkSearch: no tab with id "${pt(this,h)}" (defaultTab); falling back to "all".`),wt(this,h,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),yt(this,E,F).call(this)},H=function(){const t=document.createElement("div");t.innerHTML=yt(this,E,W).call(this),wt(this,y,t.firstElementChild),this.container.appendChild(pt(this,y)),wt(this,v,pt(this,y).querySelector(".hawk-modal-input")),wt(this,k,pt(this,y).querySelector(".hawk-results-pane")),wt(this,m,pt(this,y).querySelector(".hawk-preview-pane")),wt(this,g,pt(this,y).querySelector(".hawk-modal-filters")),wt(this,b,pt(this,y).querySelector(".hawk-modal-counter")),pt(this,e)&&pt(this,e).apply(pt(this,y)),yt(this,E,C).call(this),pt(this,r)&&yt(this,E,P).call(this,pt(this,l)),this.defaultPreviewUrl&&yt(this,E,R).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),pt(this,y).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),pt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),yt(this,E,D).call(this,t.dataset.density)})}),pt(this,v).addEventListener("input",()=>yt(this,E,B).call(this,pt(this,v).value)),pt(this,v).addEventListener("keydown",t=>yt(this,E,Q).call(this,t)),pt(this,v).addEventListener("focus",()=>yt(this,E,N).call(this),{once:!0}),pt(this,k).addEventListener("keydown",t=>yt(this,E,Y).call(this,t)),pt(this,m).addEventListener("keydown",t=>yt(this,E,Z).call(this,t)),pt(this,m).addEventListener("focus",()=>{pt(this,y).dataset.hawkShowPreview="true"}),pt(this,m).addEventListener("blur",()=>{pt(this,y).dataset.hawkShowPreview="false"}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>yt(this,E,tt).call(this,t))},W=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            ${this.params.allowDensityToggle?'<div class="hawk-density-toggle" role="group" aria-label="Result density">\n              <button type="button" class="hawk-density-btn" data-density="fit">Fit</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">Medium</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">Compact</button>\n            </div>':""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="Preview" tabindex="0">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},C=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;pt(this,y).style.setProperty("--hawk-scale",String(i)),pt(this,y).style.setProperty("--hawk-offset-x",yt(this,E,O).call(this,n.x)),pt(this,y).style.setProperty("--hawk-offset-y",yt(this,E,O).call(this,n.y)),pt(this,y).dataset.hawkPosition=s,pt(this,y).dataset.hawkDensity=h,pt(this,y).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),pt(this,y).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),pt(this,S)&&(null==(e=(t=pt(this,S)).removeEventListener)||e.call(t,"change",pt(this,x)),wt(this,S,null)),"function"==typeof window.matchMedia&&(wt(this,S,window.matchMedia(`(max-width: ${l}px)`)),wt(this,x,()=>{pt(this,y).dataset.hawkCompact=String(pt(this,S).matches)}),pt(this,S).addEventListener("change",pt(this,x)),pt(this,x).call(this))},O=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(xt):null;return St.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
D=function(t){try{null==localStorage||localStorage.setItem(xt,t)}catch(t){}},N=function(){return vt(this,null,function*(){return pt(this,c)?pt(this,c):pt(this,w)?(wt(this,c,pt(this,w)),yield yt(this,E,U).call(this),yield yt(this,E,j).call(this),pt(this,c)):(pt(this,d)||wt(this,d,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>vt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),wt(this,c,t),yield yt(this,E,U).call(this),yield yt(this,E,j).call(this),t}))),pt(this,d))})},j=function(){return vt(this,null,function*(){this.eagerResults&&!pt(this,s)&&(yield yt(this,E,B).call(this,""))})},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
R=function(){const t=this.defaultPreviewUrl;wt(this,p,t),pt(this,m).innerHTML='\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    ';const e=pt(this,m).querySelector(".hawk-preview-title"),s=pt(this,m).querySelector(".hawk-preview-content");pt(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),yt(this,E,X).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},U=function(){return vt(this,null,function*(){if(pt(this,r))return;if(!pt(this,c))return void yt(this,E,P).call(this,yt(this,E,A).call(this,[]));let t=[];try{const e=yield pt(this,c).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}yt(this,E,P).call(this,yt(this,E,A).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},F=function(){const t=pt(this,l)||[];pt(this,g).innerHTML=t.map(t=>{const e=t.id===pt(this,h);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(pt(this,g).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{yt(this,E,I).call(this,t),pt(this,v).focus()}),t.addEventListener("keydown",t=>yt(this,E,K).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
I=function(t){wt(this,h,t.dataset.filter),pt(this,g).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),yt(this,E,B).call(this,pt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
K=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),yt(this,E,I).call(this,i[s]))},B=function(t){return vt(this,null,function*(){var e;if(wt(this,s,t),yield yt(this,E,N).call(this),!pt(this,c))return;const i=(pt(this,l)||[]).find(t=>t.id===pt(this,h)),r=ot(ot(ot({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),(null==i?void 0:i.filter)?{filters:i.filter}:{}),{results:o}=t.trim()?yield pt(this,c).debouncedSearch(t,r):yield pt(this,c).search("",r),d=[];for(const t of(o||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}wt(this,a,d.slice(0,this.maxResults)),wt(this,n,pt(this,a).length?0:-1),yt(this,E,_).call(this)})},_=function(){if(!pt(this,a).length)return pt(this,k).innerHTML=`<div class="hawk-empty">No results${pt(this,s)?` for "${pt(this,s)}"`:""}.</div>`,pt(this,k).removeAttribute("aria-activedescendant"),pt(this,b).textContent=pt(this,s)?"0 matching results":"Type to search",void yt(this,E,V).call(this);pt(this,b).textContent=pt(this,s)?`${pt(this,a).length} matching result${1===pt(this,a).length?"":"s"}`:`${pt(this,a).length} entries`,pt(this,k).innerHTML=pt(this,a).map((t,e)=>`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===pt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===pt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),pt(this,k).setAttribute("aria-activedescendant",`${this.id}-result-${pt(this,n)}`),pt(this,k).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>yt(this,E,z).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,pt(this,a)[Number(t.dataset.index)])})}),yt(this,E,V).call(this)},z=function(t,e){wt(this,n,t),pt(this,k).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),pt(this,k).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),yt(this,E,V).call(this)},V=function(){const t=pt(this,a)[pt(this,n)];if(!t)return void(pt(this,m).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const e=t.url;if(e===pt(this,p))return;wt(this,p,e),pt(this,i).stop(pt(this,u)),pt(this,m).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const s=pt(this,m).querySelector(".hawk-preview-title"),l=pt(this,m).querySelector(".hawk-preview-content");pt(this,i).typeTitle(s,t.title,{isAnchor:t.isAnchor}),yt(this,E,X).call(this,t,e,l)},X=function(t,e,s){return vt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield yt(this,E,G).call(this,e);n=t.isAnchor&&i?yt(this,E,J).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}pt(this,p)===e&&wt(this,u,pt(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
G=function(t){if(pt(this,f).has(t))return pt(this,f).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw pt(this,f).delete(t),e});return pt(this,f).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
J=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
Q=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),pt(this,a).length&&yt(this,E,z).call(this,(pt(this,n)+1)%pt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),pt(this,a).length&&yt(this,E,z).call(this,(pt(this,n)-1+pt(this,a).length)%pt(this,a).length,!0);else if("Enter"===t.key){const t=pt(this,a)[pt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
Y=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),pt(this,v).focus(),pt(this,v).value+=t.key,void pt(this,v).dispatchEvent(new Event("input"));yt(this,E,Q).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
Z=function(t){"ArrowDown"===t.key?(t.preventDefault(),pt(this,m).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),pt(this,m).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),pt(this,m).scrollTop+=pt(this,m).clientHeight):"PageUp"===t.key?(t.preventDefault(),pt(this,m).scrollTop-=pt(this,m).clientHeight):"Home"===t.key?(t.preventDefault(),pt(this,m).scrollTop=0):"End"===t.key&&(t.preventDefault(),pt(this,m).scrollTop=pt(this,m).scrollHeight)},tt=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),pt(this,o)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&pt(this,o)&&this.close()},dt(Mt,"themes",mt),dt(Mt,"animations",gt),"undefined"!=typeof window&&(window.Hawk=Mt),t.HawkSearch=Mt,t.default=Mt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
