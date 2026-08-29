/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,g,v,m,k,b,S,$,P,x,M,A,E,T,L,W,C,H,D,q,O,N,R,B,F,K,j,I,U,z,Q,G,J,_,V,X,Y,Z,tt,et,it,st,nt,at,lt,ht,rt,ot,ct,dt,ut,pt,ft,wt,yt,gt,vt=Object.defineProperty,mt=Object.defineProperties,kt=Object.getOwnPropertyDescriptors,bt=Object.getOwnPropertySymbols,St=Object.prototype.hasOwnProperty,$t=Object.prototype.propertyIsEnumerable,Pt=t=>{throw TypeError(t)},xt=(t,e,i)=>e in t?vt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Mt=(t,e)=>{for(var i in e||(e={}))St.call(e,i)&&xt(t,i,e[i]);if(bt)for(var i of bt(e))$t.call(e,i)&&xt(t,i,e[i]);return t},At=(t,e)=>mt(t,kt(e)),Et=(t,e,i)=>xt(t,"symbol"!=typeof e?e+"":e,i),Tt=(t,e,i)=>e.has(t)||Pt("Cannot "+i),Lt=(t,e,i)=>(Tt(t,e,"read from private field"),i?i.call(t):e.get(t)),Wt=(t,e,i)=>e.has(t)?Pt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Ct=(t,e,i,s)=>(Tt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Ht=(t,e,i)=>(Tt(t,e,"access private method"),i),Dt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const qt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=qt);const Ot=new Map,Nt=new Map;Nt.set("instant",qt);const Rt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Bt=new Set(["fit","medium","compact"]),Ft="hawk:density",Kt="pinned",jt={open:!0,slash:!0,escape:!0},It={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin"};let Ut=0;class zt{
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
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(H={}){var D,q,N;if(Wt(this,T),Wt(this,t),Wt(this,e),Wt(this,i),Wt(this,s),Wt(this,n),Wt(this,a),Wt(this,l),Wt(this,h),Wt(this,r),Wt(this,o),Wt(this,c),Wt(this,d),Wt(this,u),Wt(this,p),Wt(this,f),Wt(this,w),Wt(this,y),Wt(this,g),Wt(this,v),Wt(this,m),Wt(this,k),Wt(this,b),Wt(this,S),Wt(this,$),Wt(this,P),Wt(this,x),Wt(this,M),Wt(this,A),Wt(this,E),!H.index&&!H.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=H.id||`hawk-search-${Ut+=1}`,this.indexBasePath=H.index?H.index.endsWith("/")?H.index:`${H.index}/`:null,Ct(this,g,H.pagefind||null),this.triggerSelector=H.triggerSelector||"[data-search-trigger]",this.container=H.container||("undefined"!=typeof document?document.body:null);const R=Ht(this,T,F).call(this);this.params=At(Mt(Mt(Mt({},Rt),R?{density:R}:{}),H.params),{offset:Mt(Mt({},Rt.offset),null==(D=H.params)?void 0:D.offset)}),this.categoryFilterName=H.categoryFilterName||"category",this.includeAllTab=!1!==H.includeAllTab,this.pagefindOptions=H.pagefindOptions||{},this.maxResults=null!=(q=H.maxResults)?q:18,this.contentSelector=H.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=H.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=H.rotatingPlaceholders||[],this.showPoweredBy=!1!==H.showPoweredBy,this.poweredByHref=H.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==H.enablePins,this.pinStorageKey=H.pinStorageKey||"hawk:pins",this.maxPins=null!=(N=H.maxPins)?N:20,this.inlineFilters=H.inlineFilters||!1,this.hotkeys=Mt(Mt({},jt),H.hotkeys),this.strings=Mt(Mt({},It),H.strings),this.defaultPreviewUrl=H.defaultPreviewUrl||null,this.defaultPreviewTitle=H.defaultPreviewTitle||"",this.eagerResults=!1!==H.eagerResults,this.onOpen=H.onOpen,this.onClose=H.onClose,this.onSelect=H.onSelect,Ct(this,t,Ht(this,T,L).call(this,H.theme)),Ct(this,e,Ht(this,T,W).call(this,H.animation)),Ct(this,i,""),Ct(this,s,-1),Ct(this,n,[]),Ct(this,a,0),Ct(this,l,this.enablePins?Ht(this,T,j).call(this):[]),Ct(this,r,H.defaultTab||"all"),Ct(this,h,Ht(this,T,C).call(this,H)),Ct(this,o,null!==Lt(this,h)),Ct(this,c,!1),Ct(this,d,null),Ct(this,u,null),Ct(this,p,null),Ct(this,f,null),Ct(this,w,null),Ct(this,y,new Map),this.container&&Ht(this,T,O).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Ot.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Nt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Lt(this,c),query:Lt(this,i),selectedIndex:Lt(this,s),matches:Lt(this,n),pageCount:Lt(this,a),pins:Lt(this,l),activeTab:Lt(this,r),error:Lt(this,p)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=At(Mt(Mt({},this.params),t),{offset:Mt(Mt({},this.params.offset),null==t?void 0:t.offset)}),Ht(this,T,R).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Lt(this,v).hidden=!1,document.body.style.overflow="hidden",Ct(this,c,!0),Ht(this,T,J).call(this),Ht(this,T,gt).call(this),setTimeout(()=>{Lt(this,m).focus(),Lt(this,m).select()},40),null==(t=this.onOpen)||t.call(this,Lt(this,i))}
/** Closes the search modal. */close(){var t;Lt(this,v).hidden=!0,document.body.style.overflow="",Ct(this,c,!1),Ht(this,T,gt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s;Lt(this,e).stop(Lt(this,f)),Lt(this,S)&&Lt(this,e).stop(Lt(this,S)),null==(i=null==(t=Lt(this,A))?void 0:t.removeEventListener)||i.call(t,"change",Lt(this,E)),null==(s=Lt(this,v))||s.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,g=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,x=new WeakMap,M=new WeakMap,A=new WeakMap,E=new WeakMap,T=new WeakSet,L=function(t){if(!t)return Ot.get("typeflow")||null;if("string"==typeof t){const e=Ot.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},W=function(t){if(!1===t)return Nt.get("instant");if(!t)return Nt.get("typeflow")||Nt.get("instant");if("string"==typeof t){const e=Nt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
C=function(t){return t.tabs?Ht(this,T,H).call(this,t.tabs):t.categories?Ht(this,T,H).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
H=function(t){const e=t.map(t=>({id:t.id||Ht(this,T,D).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},D=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
q=function(t){var e,i;Ct(this,h,t),t.some(t=>t.id===Lt(this,r))||("all"!==Lt(this,r)&&Lt(this,r)!==Kt&&console.warn(`HawkSearch: no tab with id "${Lt(this,r)}" (defaultTab); falling back to "all".`),Ct(this,r,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Ht(this,T,Z).call(this)},O=function(){const e=document.createElement("div");e.innerHTML=Ht(this,T,N).call(this),Ct(this,v,e.firstElementChild),this.container.appendChild(Lt(this,v)),Ct(this,m,Lt(this,v).querySelector(".hawk-modal-input")),Ct(this,k,Lt(this,v).querySelector(".hawk-input-wrap")),Ct(this,b,Lt(this,v).querySelector(".hawk-input-ghost")),Lt(this,b)&&(Lt(this,b).textContent=this.rotatingPlaceholders[0],Ht(this,T,gt).call(this)),Ct(this,$,Lt(this,v).querySelector(".hawk-results-pane")),Ct(this,P,Lt(this,v).querySelector(".hawk-preview-pane")),Ct(this,x,Lt(this,v).querySelector(".hawk-modal-filters")),Ct(this,M,Lt(this,v).querySelector(".hawk-modal-counter")),Lt(this,t)&&(Lt(this,t).apply(Lt(this,v)),Object.entries(Lt(this,t).tokens||{}).forEach(([t,e])=>{Lt(this,v).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Lt(this,v).dataset.hawkMarkdownStyles="off"),Ht(this,T,R).call(this),Lt(this,o)&&Ht(this,T,q).call(this,Ht(this,T,z).call(this,Lt(this,h))),this.defaultPreviewUrl&&Ht(this,T,X).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Lt(this,v).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Lt(this,v).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Ht(this,T,K).call(this,t.dataset.density)})}),Lt(this,m).addEventListener("input",()=>{Ht(this,T,st).call(this,Lt(this,m).value),Ht(this,T,gt).call(this)}),Lt(this,m).addEventListener("keydown",t=>Ht(this,T,ct).call(this,t)),Lt(this,m).addEventListener("focus",()=>Ht(this,T,J).call(this),{once:!0}),Lt(this,$).addEventListener("keydown",t=>Ht(this,T,dt).call(this,t)),Lt(this,P).addEventListener("keydown",t=>Ht(this,T,ut).call(this,t)),Lt(this,P).addEventListener("focus",()=>{Lt(this,v).dataset.hawkShowPreview="true"}),Lt(this,P).addEventListener("blur",()=>{Lt(this,v).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Ht(this,T,pt).call(this,t))},N=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},R=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;Lt(this,v).style.setProperty("--hawk-scale",String(i)),Lt(this,v).style.setProperty("--hawk-offset-x",Ht(this,T,B).call(this,n.x)),Lt(this,v).style.setProperty("--hawk-offset-y",Ht(this,T,B).call(this,n.y)),Lt(this,v).dataset.hawkPosition=s,Lt(this,v).dataset.hawkDensity=h,Lt(this,v).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Lt(this,v).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Lt(this,A)&&(null==(e=(t=Lt(this,A)).removeEventListener)||e.call(t,"change",Lt(this,E)),Ct(this,A,null)),"function"==typeof window.matchMedia&&(Ct(this,A,window.matchMedia(`(max-width: ${l}px)`)),Ct(this,E,()=>{Lt(this,v).dataset.hawkCompact=String(Lt(this,A).matches)}),Lt(this,A).addEventListener("change",Lt(this,E)),Lt(this,E).call(this))},B=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
F=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Ft):null;return Bt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
K=function(t){try{null==localStorage||localStorage.setItem(Ft,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
j=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
I=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},U=function(t){return Lt(this,l).some(e=>e.url===t)},
/**
 * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
 * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
 * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
 * "All" pill only ever being one thing, not a toggle.
 */
z=function(t){return this.enablePins&&Lt(this,l).length?[{id:Kt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
Q=function(t){const e=Lt(this,r)===Kt;if(Ht(this,T,U).call(this,t.url))Ct(this,l,Lt(this,l).filter(e=>e.url!==t.url));else{if(!(Lt(this,l).length<this.maxPins))return;Ct(this,l,[...Lt(this,l),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Ht(this,T,I).call(this,Lt(this,l)),Ht(this,T,q).call(this,Ht(this,T,z).call(this,(Lt(this,h)||[]).filter(t=>t.id!==Kt))),Lt(this,r)===Kt?Ht(this,T,G).call(this):e?Ht(this,T,st).call(this,Lt(this,i)):Ht(this,T,nt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
G=function(){Ct(this,n,Lt(this,l).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Ct(this,a,new Set(Lt(this,n).map(t=>t.url.split("#")[0])).size),Ct(this,s,Lt(this,n).length?0:-1),Ht(this,T,nt).call(this)},J=function(){return Dt(this,null,function*(){return Lt(this,d)?Lt(this,d):Lt(this,g)?(Ct(this,d,Lt(this,g)),yield Ht(this,T,Y).call(this),yield Ht(this,T,_).call(this),Lt(this,d)):(Lt(this,u)||Ct(this,u,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Dt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Ct(this,d,t),yield Ht(this,T,Y).call(this),yield Ht(this,T,_).call(this),t})).catch(t=>(Ct(this,p,t),Ht(this,T,V).call(this),null))),Lt(this,u))})},_=function(){return Dt(this,null,function*(){Lt(this,r)!==Kt?this.eagerResults&&!Lt(this,i)&&(yield Ht(this,T,st).call(this,"")):Ht(this,T,G).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
V=function(){Lt(this,$).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Lt(this,$).removeAttribute("aria-activedescendant"),Lt(this,M).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
X=function(){const t=this.defaultPreviewUrl;Ct(this,w,t),Lt(this,P).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=Lt(this,P).querySelector(".hawk-preview-title"),s=Lt(this,P).querySelector(".hawk-preview-content");Lt(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),Ht(this,T,ht).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},Y=function(){return Dt(this,null,function*(){if(Lt(this,o))return;if(!Lt(this,d))return void Ht(this,T,q).call(this,Ht(this,T,z).call(this,Ht(this,T,H).call(this,[])));let t=[];try{const e=yield Lt(this,d).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Ht(this,T,q).call(this,Ht(this,T,z).call(this,Ht(this,T,H).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},Z=function(){const t=Lt(this,h)||[];Lt(this,x).innerHTML=t.map(t=>{const e=t.id===Lt(this,r);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Lt(this,x).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Ht(this,T,tt).call(this,t),Lt(this,m).focus()}),t.addEventListener("keydown",t=>Ht(this,T,et).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
tt=function(t){Ct(this,r,t.dataset.filter),Lt(this,x).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Lt(this,r)===Kt?(Ct(this,i,""),Lt(this,m).value="",Ht(this,T,G).call(this)):Ht(this,T,st).call(this,Lt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
et=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Ht(this,T,tt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
it=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},st=function(t){return Dt(this,null,function*(){var e;if(Ct(this,i,t),yield Ht(this,T,J).call(this),!Lt(this,d))return;const l=(Lt(this,h)||[]).find(t=>t.id===Lt(this,r)),{filters:o,remainingQuery:c}=Ht(this,T,it).call(this,t),u=(null==l?void 0:l.filter)||o?Mt(Mt({},(null==l?void 0:l.filter)||{}),o||{}):null,f=Mt(Mt(Mt({},this.pagefindOptions),(null==l?void 0:l.pagefindOptions)||{}),u?{filters:u}:{}),w=this.inlineFilters?c:t;let y;try{({results:y}=w.trim()?yield Lt(this,d).debouncedSearch(w,f):yield Lt(this,d).search("",f))}catch(t){return Ct(this,p,t),void Ht(this,T,V).call(this)}const g=[];for(const t of(y||[]).slice(0,this.maxResults)){const i=yield t.data();g.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&g.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Ct(this,n,g.slice(0,this.maxResults)),Ct(this,a,new Set(Lt(this,n).map(t=>t.url.split("#")[0])).size),Ct(this,s,Lt(this,n).length?0:-1),Ht(this,T,nt).call(this)})},nt=function(){if(!Lt(this,n).length)return Lt(this,$).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Lt(this,i))}</div>`,Lt(this,$).removeAttribute("aria-activedescendant"),Lt(this,M).textContent=Lt(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Ht(this,T,lt).call(this);Lt(this,M).textContent=Lt(this,i)?this.strings.matchingResults(Lt(this,n).length,Lt(this,a)):this.strings.entries(Lt(this,n).length,Lt(this,a)),Lt(this,$).innerHTML=Lt(this,n).map((t,e)=>{var i;const n=this.enablePins&&Ht(this,T,U).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Lt(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Lt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${n?" is-pinned":""}" role="button" aria-pressed="${n}" data-index="${e}">${n?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Lt(this,$).setAttribute("aria-activedescendant",`${this.id}-result-${Lt(this,s)}`),Lt(this,$).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Ht(this,T,at).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Ht(this,T,Q).call(this,Lt(this,n)[s]);null==(i=this.onSelect)||i.call(this,Lt(this,n)[s])})}),Ht(this,T,lt).call(this)},at=function(t,e){Ct(this,s,t),Lt(this,$).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Lt(this,$).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Ht(this,T,lt).call(this)},lt=function(){var t;const i=Lt(this,n)[Lt(this,s)];if(!i)return void(Lt(this,P).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const a=i.url;if(a===Lt(this,w))return;Ct(this,w,a),Lt(this,e).stop(Lt(this,f)),Lt(this,P).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Lt(this,P).querySelector(".hawk-preview-title"),h=Lt(this,P).querySelector(".hawk-preview-content");Lt(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),Ht(this,T,ht).call(this,i,a,h)},ht=function(t,i,s){return Dt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Ht(this,T,rt).call(this,e);n=t.isAnchor&&i?Ht(this,T,ot).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Lt(this,w)===i&&Ct(this,f,Lt(this,e).typeContent(s,n))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
rt=function(t){if(Lt(this,y).has(t))return Lt(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Lt(this,y).delete(t),e});return Lt(this,y).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
ot=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
ct=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Lt(this,n).length&&Ht(this,T,at).call(this,(Lt(this,s)+1)%Lt(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Lt(this,n).length&&Ht(this,T,at).call(this,(Lt(this,s)-1+Lt(this,n).length)%Lt(this,n).length,!0);else if("Enter"===t.key){const t=Lt(this,n)[Lt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
dt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Lt(this,m).focus(),Lt(this,m).value+=t.key,void Lt(this,m).dispatchEvent(new Event("input"));Ht(this,T,ct).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
ut=function(t){"ArrowDown"===t.key?(t.preventDefault(),Lt(this,P).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Lt(this,P).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Lt(this,P).scrollTop+=Lt(this,P).clientHeight):"PageUp"===t.key?(t.preventDefault(),Lt(this,P).scrollTop-=Lt(this,P).clientHeight):"Home"===t.key?(t.preventDefault(),Lt(this,P).scrollTop=0):"End"===t.key&&(t.preventDefault(),Lt(this,P).scrollTop=Lt(this,P).scrollHeight)},pt=function(t){Lt(this,c)&&"Tab"===t.key&&Ht(this,T,yt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Lt(this,c)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Lt(this,c)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
ft=function(){return!("true"===Lt(this,v).dataset.hawkCompact||"compact"===this.params.density)||"true"===Lt(this,v).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
wt=function(){return[Lt(this,m),...this.params.allowDensityToggle?Array.from(Lt(this,v).querySelectorAll(".hawk-density-btn")):[],Lt(this,v).querySelector(".hawk-modal-esc"),Lt(this,x).querySelector('.hawk-filter-pill[tabindex="0"]'),Lt(this,$),...Ht(this,T,ft).call(this)?[Lt(this,P)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
yt=function(t){const e=Ht(this,T,wt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
gt=function(){if(!Lt(this,b))return;const t=Lt(this,c)&&!Lt(this,m).value;Lt(this,k).dataset.hawkInputActive=String(!t),t&&!Lt(this,S)?Ct(this,S,Lt(this,e).rotatePlaceholder(Lt(this,b),this.rotatingPlaceholders)):!t&&Lt(this,S)&&(Lt(this,e).stop(Lt(this,S)),Ct(this,S,null))},Et(zt,"themes",Ot),Et(zt,"animations",Nt),"undefined"!=typeof window&&(window.Hawk=zt);export{zt as HawkSearch,zt as default};
//# sourceMappingURL=hawk.esm.js.map
