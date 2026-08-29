/*! hawk v0.1.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,m,y,k,v,g,b,S,x,M,E,$,L,T,A,W,C,O,H,P,q,N,j,D,F,I,R,B,U,K,z,V,X,_=Object.defineProperty,G=Object.defineProperties,J=Object.getOwnPropertyDescriptors,Q=Object.getOwnPropertySymbols,Y=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable,tt=t=>{throw TypeError(t)},et=(t,e,i)=>e in t?_(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,it=(t,e)=>{for(var i in e||(e={}))Y.call(e,i)&&et(t,i,e[i]);if(Q)for(var i of Q(e))Z.call(e,i)&&et(t,i,e[i]);return t},st=(t,e)=>G(t,J(e)),nt=(t,e,i)=>et(t,"symbol"!=typeof e?e+"":e,i),at=(t,e,i)=>e.has(t)||tt("Cannot "+i),lt=(t,e,i)=>(at(t,e,"read from private field"),i?i.call(t):e.get(t)),ht=(t,e,i)=>e.has(t)?tt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),rt=(t,e,i,s)=>(at(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),ot=(t,e,i)=>(at(t,e,"access private method"),i),ct=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const dt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=dt);const ut=new Map,pt=new Map;pt.set("instant",dt);const ft={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` regardless of this value
breakpoint:768},wt={open:!0,slash:!0,escape:!0};let mt=0;class yt{
/**
   * @param {object} [config]
   * @param {string} [config.index] Base path (URL, trailing slash) to a Pagefind bundle — the
   *   directory `pagefind --site <dir>` wrote `pagefind.js` into. Required unless `config.pagefind` is given.
   * @param {object} [config.pagefind] A pre-loaded Pagefind module (or compatible mock) to use
   *   instead of dynamically importing one from `config.index` — e.g. when the consumer already
   *   bundles Pagefind, or in tests.
   * @param {string} [config.triggerSelector='[data-search-trigger]'] Elements that open the modal on click.
   * @param {HTMLElement} [config.container=document.body] Where the modal is mounted.
   * @param {Partial<typeof DEFAULT_PARAMS>} [config.params] Layout params (scale/position/offset/alignment/columns/breakpoint).
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
constructor(L={}){var T,A;if(ht(this,x),ht(this,t),ht(this,e),ht(this,i),ht(this,s),ht(this,n),ht(this,a),ht(this,l),ht(this,h),ht(this,r),ht(this,o),ht(this,c),ht(this,d),ht(this,u),ht(this,p),ht(this,f),ht(this,w),ht(this,m),ht(this,y),ht(this,k),ht(this,v),ht(this,g),ht(this,b),ht(this,S),!L.index&&!L.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=L.id||`hawk-search-${mt+=1}`,this.indexBasePath=L.index?L.index.endsWith("/")?L.index:`${L.index}/`:null,rt(this,f,L.pagefind||null),this.triggerSelector=L.triggerSelector||"[data-search-trigger]",this.container=L.container||("undefined"!=typeof document?document.body:null),this.params=st(it(it({},ft),L.params),{offset:it(it({},ft.offset),null==(T=L.params)?void 0:T.offset)}),this.categoryFilterName=L.categoryFilterName||"category",this.includeAllTab=!1!==L.includeAllTab,this.pagefindOptions=L.pagefindOptions||{},this.maxResults=null!=(A=L.maxResults)?A:18,this.contentSelector=L.contentSelector||"[data-pagefind-body]",this.hotkeys=it(it({},wt),L.hotkeys),this.onOpen=L.onOpen,this.onClose=L.onClose,this.onSelect=L.onSelect,rt(this,t,ot(this,x,M).call(this,L.theme)),rt(this,e,ot(this,x,E).call(this,L.animation)),rt(this,i,""),rt(this,s,-1),rt(this,n,[]),rt(this,l,L.defaultTab||"all"),rt(this,a,ot(this,x,$).call(this,L)),rt(this,h,null!==lt(this,a)),rt(this,r,!1),rt(this,o,null),rt(this,c,null),rt(this,d,null),rt(this,u,null),rt(this,p,new Map),this.container&&ot(this,x,W).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){ut.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){pt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:lt(this,r),query:lt(this,i),selectedIndex:lt(this,s),matches:lt(this,n),activeTab:lt(this,l)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=st(it(it({},this.params),t),{offset:it(it({},this.params.offset),null==t?void 0:t.offset)}),ot(this,x,O).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;lt(this,w).hidden=!1,document.body.style.overflow="hidden",rt(this,r,!0),ot(this,x,P).call(this),setTimeout(()=>{lt(this,m).focus(),lt(this,m).select()},40),null==(t=this.onOpen)||t.call(this,lt(this,i))}
/** Closes the search modal. */close(){var t;lt(this,w).hidden=!0,document.body.style.overflow="",rt(this,r,!1),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;lt(this,e).stop(lt(this,d)),null==(i=null==(t=lt(this,b))?void 0:t.removeEventListener)||i.call(t,"change",lt(this,S)),null==(s=lt(this,w))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,m=new WeakMap,y=new WeakMap,k=new WeakMap,v=new WeakMap,g=new WeakMap,b=new WeakMap,S=new WeakMap,x=new WeakSet,M=function(t){if(!t)return ut.get("typeflow")||null;if("string"==typeof t){const e=ut.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},E=function(t){if(!1===t)return pt.get("instant");if(!t)return pt.get("typeflow")||pt.get("instant");if("string"==typeof t){const e=pt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
$=function(t){return t.tabs?ot(this,x,L).call(this,t.tabs):t.categories?ot(this,x,L).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
L=function(t){const e=t.map(t=>({id:t.id||ot(this,x,T).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},T=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
A=function(t){var e,i;rt(this,a,t),t.some(t=>t.id===lt(this,l))||("all"!==lt(this,l)&&console.warn(`HawkSearch: no tab with id "${lt(this,l)}" (defaultTab); falling back to "all".`),rt(this,l,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),ot(this,x,N).call(this)},W=function(){const e=document.createElement("div");e.innerHTML=ot(this,x,C).call(this),rt(this,w,e.firstElementChild),this.container.appendChild(lt(this,w)),rt(this,m,lt(this,w).querySelector(".hawk-modal-input")),rt(this,y,lt(this,w).querySelector(".hawk-results-pane")),rt(this,k,lt(this,w).querySelector(".hawk-preview-pane")),rt(this,v,lt(this,w).querySelector(".hawk-modal-filters")),rt(this,g,lt(this,w).querySelector(".hawk-modal-counter")),lt(this,t)&&lt(this,t).apply(lt(this,w)),ot(this,x,O).call(this),lt(this,h)&&ot(this,x,A).call(this,lt(this,a)),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),lt(this,w).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),lt(this,m).addEventListener("input",()=>ot(this,x,F).call(this,lt(this,m).value)),lt(this,m).addEventListener("keydown",t=>ot(this,x,V).call(this,t)),lt(this,m).addEventListener("focus",()=>ot(this,x,P).call(this),{once:!0}),(this.hotkeys.open||this.hotkeys.slash||this.hotkeys.escape)&&document.addEventListener("keydown",t=>ot(this,x,X).call(this,t))},C=function(){return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"\n              aria-autocomplete="list" aria-controls="${this.id}-results" />\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite"></div>\n            <aside class="hawk-preview-pane" aria-live="polite">\n              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; Navigate</span>\n            <span class="hawk-hint">&crarr; Select</span>\n            <span class="hawk-hint">ESC Close</span>\n            <div class="hawk-modal-counter">Type to search</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},O=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l}=this.params;lt(this,w).style.setProperty("--hawk-scale",String(i)),lt(this,w).style.setProperty("--hawk-offset-x",ot(this,x,H).call(this,n.x)),lt(this,w).style.setProperty("--hawk-offset-y",ot(this,x,H).call(this,n.y)),lt(this,w).dataset.hawkPosition=s,lt(this,w).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),lt(this,b)&&(null==(e=(t=lt(this,b)).removeEventListener)||e.call(t,"change",lt(this,S)),rt(this,b,null)),"function"==typeof window.matchMedia&&(rt(this,b,window.matchMedia(`(max-width: ${l}px)`)),rt(this,S,()=>{lt(this,w).dataset.hawkCompact=String(lt(this,b).matches)}),lt(this,b).addEventListener("change",lt(this,S)),lt(this,S).call(this))},H=function(t){return"number"==typeof t?`${t}px`:String(t)},P=function(){return ct(this,null,function*(){return lt(this,o)?lt(this,o):lt(this,f)?(rt(this,o,lt(this,f)),yield ot(this,x,q).call(this),lt(this,o)):(lt(this,c)||rt(this,c,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>ct(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),rt(this,o,t),yield ot(this,x,q).call(this),t}))),lt(this,c))})},q=function(){return ct(this,null,function*(){if(lt(this,h))return;if(!lt(this,o))return void ot(this,x,A).call(this,ot(this,x,L).call(this,[]));let t=[];try{const e=yield lt(this,o).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}ot(this,x,A).call(this,ot(this,x,L).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},N=function(){const t=lt(this,a)||[];lt(this,v).innerHTML=t.map(t=>{const e=t.id===lt(this,l);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(lt(this,v).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{ot(this,x,j).call(this,t),lt(this,m).focus()}),t.addEventListener("keydown",t=>ot(this,x,D).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
j=function(t){rt(this,l,t.dataset.filter),lt(this,v).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),ot(this,x,F).call(this,lt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
D=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),ot(this,x,j).call(this,i[s]))},F=function(t){return ct(this,null,function*(){var e;if(rt(this,i,t),yield ot(this,x,P).call(this),!lt(this,o))return;const h=(lt(this,a)||[]).find(t=>t.id===lt(this,l)),r=it(it(it({},this.pagefindOptions),(null==h?void 0:h.pagefindOptions)||{}),(null==h?void 0:h.filter)?{filters:h.filter}:{}),{results:c}=t.trim()?yield lt(this,o).debouncedSearch(t,r):yield lt(this,o).search("",r),d=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||"Untitled",url:i.url,excerpt:i.excerpt,isAnchor:!1});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0})}rt(this,n,d.slice(0,this.maxResults)),rt(this,s,lt(this,n).length?0:-1),ot(this,x,I).call(this)})},I=function(){if(!lt(this,n).length)return lt(this,y).innerHTML=`<div class="hawk-empty">No results${lt(this,i)?` for "${lt(this,i)}"`:""}.</div>`,lt(this,g).textContent=lt(this,i)?"0 matching results":"Type to search",void ot(this,x,B).call(this);lt(this,g).textContent=lt(this,i)?`${lt(this,n).length} matching result${1===lt(this,n).length?"":"s"}`:`${lt(this,n).length} entries`,lt(this,y).innerHTML=lt(this,n).map((t,e)=>`\n        <a href="${t.url}" class="hawk-result-item${e===lt(this,s)?" is-selected":""}" data-index="${e}" role="option" aria-selected="${e===lt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`).join(""),lt(this,y).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>ot(this,x,R).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,lt(this,n)[Number(t.dataset.index)])})}),ot(this,x,B).call(this)},R=function(t,e){rt(this,s,t),lt(this,y).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),ot(this,x,B).call(this)},B=function(){const t=lt(this,n)[lt(this,s)];if(!t)return void(lt(this,k).innerHTML='<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>');const i=t.url;if(i===lt(this,u))return;rt(this,u,i),lt(this,e).stop(lt(this,d)),lt(this,k).innerHTML=`\n      <div class="hawk-preview-header">\n        ${t.isAnchor?'<span class="hawk-anchor-badge">Section</span>':""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>\n    `;const a=lt(this,k).querySelector(".hawk-preview-title"),l=lt(this,k).querySelector(".hawk-preview-content");lt(this,e).typeTitle(a,t.title,{isAnchor:t.isAnchor}),ot(this,x,U).call(this,t,i,l)},U=function(t,i,s){return ct(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield ot(this,x,K).call(this,e);n=t.isAnchor&&i?ot(this,x,z).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}lt(this,u)===i&&rt(this,d,lt(this,e).typeContent(s,n))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
K=function(t){if(lt(this,p).has(t))return lt(this,p).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw lt(this,p).delete(t),e});return lt(this,p).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
z=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},V=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),lt(this,n).length&&ot(this,x,R).call(this,(lt(this,s)+1)%lt(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),lt(this,n).length&&ot(this,x,R).call(this,(lt(this,s)-1+lt(this,n).length)%lt(this,n).length,!0);else if("Enter"===t.key){const t=lt(this,n)[lt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},X=function(t){const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),lt(this,r)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&lt(this,r)&&this.close()},nt(yt,"themes",ut),nt(yt,"animations",pt),"undefined"!=typeof window&&(window.Hawk=yt);export{yt as HawkSearch,yt as default};
//# sourceMappingURL=hawk.esm.js.map
