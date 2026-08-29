/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,g,v,m,k,b,S,$,P,x,M,T,A,E,L,C,H,W,D,q,O,N,R,j,B,K,I,U,F,_,z,G,J,V,X,Q,Y,Z,tt,et,it,st,nt,at,lt,ht,rt,ot,ct,dt,ut,pt,ft,wt,yt,gt,vt=Object.defineProperty,mt=Object.defineProperties,kt=Object.getOwnPropertyDescriptors,bt=Object.getOwnPropertySymbols,St=Object.prototype.hasOwnProperty,$t=Object.prototype.propertyIsEnumerable,Pt=t=>{throw TypeError(t)},xt=(t,e,i)=>e in t?vt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Mt=(t,e)=>{for(var i in e||(e={}))St.call(e,i)&&xt(t,i,e[i]);if(bt)for(var i of bt(e))$t.call(e,i)&&xt(t,i,e[i]);return t},Tt=(t,e)=>mt(t,kt(e)),At=(t,e,i)=>xt(t,"symbol"!=typeof e?e+"":e,i),Et=(t,e,i)=>e.has(t)||Pt("Cannot "+i),Lt=(t,e,i)=>(Et(t,e,"read from private field"),i?i.call(t):e.get(t)),Ct=(t,e,i)=>e.has(t)?Pt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Ht=(t,e,i,s)=>(Et(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Wt=(t,e,i)=>(Et(t,e,"access private method"),i),Dt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const qt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=qt);const Ot=new Map,Nt=new Map;Nt.set("instant",qt);const Rt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},jt=new Set(["fit","medium","compact"]),Bt="hawk:density",Kt="pinned",It={open:!0,slash:!0,escape:!0},Ut={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin"};let Ft=0;class _t{
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
     * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
     *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
     *   functions, not plain strings, so a locale can supply its own pluralization.
     * @param {(query: string) => void} [config.onOpen]
     * @param {() => void} [config.onClose]
     * @param {(item: object) => void} [config.onSelect]
     */
constructor(t={}){var D,q,O;if(Ct(this,L),Ct(this,e),Ct(this,i),Ct(this,s),Ct(this,n),Ct(this,a),Ct(this,l),Ct(this,h),Ct(this,r),Ct(this,o),Ct(this,c),Ct(this,d),Ct(this,u),Ct(this,p),Ct(this,f),Ct(this,w),Ct(this,y),Ct(this,g),Ct(this,v),Ct(this,m),Ct(this,k),Ct(this,b),Ct(this,S),Ct(this,$),Ct(this,P),Ct(this,x),Ct(this,M),Ct(this,T),Ct(this,A),Ct(this,E),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Ft+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,Ht(this,v,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const R=Wt(this,L,K).call(this);this.params=Tt(Mt(Mt(Mt({},Rt),R?{density:R}:{}),t.params),{offset:Mt(Mt({},Rt.offset),null==(D=t.params)?void 0:D.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(q=t.maxResults)?q:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(O=t.maxPins)?O:20,this.hotkeys=Mt(Mt({},It),t.hotkeys),this.strings=Mt(Mt({},Ut),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,Ht(this,e,Wt(this,L,C).call(this,t.theme)),Ht(this,i,Wt(this,L,H).call(this,t.animation)),Ht(this,s,""),Ht(this,n,-1),Ht(this,a,[]),Ht(this,l,0),Ht(this,h,this.enablePins?Wt(this,L,U).call(this):[]),Ht(this,o,t.defaultTab||"all"),Ht(this,r,Wt(this,L,W).call(this,t)),Ht(this,c,null!==Lt(this,r)),Ht(this,d,!1),Ht(this,u,null),Ht(this,p,null),Ht(this,f,null),Ht(this,w,null),Ht(this,y,null),Ht(this,g,new Map),this.container&&Wt(this,L,N).call(this)}
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
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Lt(this,d),query:Lt(this,s),selectedIndex:Lt(this,n),matches:Lt(this,a),pageCount:Lt(this,l),pins:Lt(this,h),activeTab:Lt(this,o),error:Lt(this,f)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Tt(Mt(Mt({},this.params),t),{offset:Mt(Mt({},this.params.offset),null==t?void 0:t.offset)}),Wt(this,L,j).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Lt(this,m).hidden=!1,document.body.style.overflow="hidden",Ht(this,d,!0),Wt(this,L,V).call(this),Wt(this,L,gt).call(this),setTimeout(()=>{Lt(this,k).focus(),Lt(this,k).select()},40),null==(t=this.onOpen)||t.call(this,Lt(this,s))}
/** Closes the search modal. */close(){var t;Lt(this,m).hidden=!0,document.body.style.overflow="",Ht(this,d,!1),Wt(this,L,gt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;Lt(this,i).stop(Lt(this,w)),Lt(this,$)&&Lt(this,i).stop(Lt(this,$)),null==(e=null==(t=Lt(this,A))?void 0:t.removeEventListener)||e.call(t,"change",Lt(this,E)),null==(s=Lt(this,m))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,g=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,x=new WeakMap,M=new WeakMap,T=new WeakMap,A=new WeakMap,E=new WeakMap,L=new WeakSet,C=function(t){if(!t)return Ot.get("typeflow")||null;if("string"==typeof t){const e=Ot.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},H=function(t){if(!1===t)return Nt.get("instant");if(!t)return Nt.get("typeflow")||Nt.get("instant");if("string"==typeof t){const e=Nt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
W=function(t){return t.tabs?Wt(this,L,D).call(this,t.tabs):t.categories?Wt(this,L,D).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
D=function(t){const e=t.map(t=>({id:t.id||Wt(this,L,q).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},q=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
O=function(t){var e,i;Ht(this,r,t),t.some(t=>t.id===Lt(this,o))||("all"!==Lt(this,o)&&Lt(this,o)!==Kt&&console.warn(`HawkSearch: no tab with id "${Lt(this,o)}" (defaultTab); falling back to "all".`),Ht(this,o,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Wt(this,L,tt).call(this)},N=function(){const t=document.createElement("div");t.innerHTML=Wt(this,L,R).call(this),Ht(this,m,t.firstElementChild),this.container.appendChild(Lt(this,m)),Ht(this,k,Lt(this,m).querySelector(".hawk-modal-input")),Ht(this,b,Lt(this,m).querySelector(".hawk-input-wrap")),Ht(this,S,Lt(this,m).querySelector(".hawk-input-ghost")),Lt(this,S)&&(Lt(this,S).textContent=this.rotatingPlaceholders[0],Wt(this,L,gt).call(this)),Ht(this,P,Lt(this,m).querySelector(".hawk-results-pane")),Ht(this,x,Lt(this,m).querySelector(".hawk-preview-pane")),Ht(this,M,Lt(this,m).querySelector(".hawk-modal-filters")),Ht(this,T,Lt(this,m).querySelector(".hawk-modal-counter")),Lt(this,e)&&(Lt(this,e).apply(Lt(this,m)),Object.entries(Lt(this,e).tokens||{}).forEach(([t,e])=>{Lt(this,m).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Lt(this,m).dataset.hawkMarkdownStyles="off"),Wt(this,L,j).call(this),Lt(this,c)&&Wt(this,L,O).call(this,Wt(this,L,z).call(this,Lt(this,r))),this.defaultPreviewUrl&&Wt(this,L,Y).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Lt(this,m).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Lt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Wt(this,L,I).call(this,t.dataset.density)})}),Lt(this,k).addEventListener("input",()=>{Wt(this,L,st).call(this,Lt(this,k).value),Wt(this,L,gt).call(this)}),Lt(this,k).addEventListener("keydown",t=>Wt(this,L,ct).call(this,t)),Lt(this,k).addEventListener("focus",()=>Wt(this,L,V).call(this),{once:!0}),Lt(this,P).addEventListener("keydown",t=>Wt(this,L,dt).call(this,t)),Lt(this,x).addEventListener("keydown",t=>Wt(this,L,ut).call(this,t)),Lt(this,x).addEventListener("focus",()=>{Lt(this,m).dataset.hawkShowPreview="true"}),Lt(this,x).addEventListener("blur",()=>{Lt(this,m).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Wt(this,L,pt).call(this,t))},R=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},j=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;Lt(this,m).style.setProperty("--hawk-scale",String(i)),Lt(this,m).style.setProperty("--hawk-offset-x",Wt(this,L,B).call(this,n.x)),Lt(this,m).style.setProperty("--hawk-offset-y",Wt(this,L,B).call(this,n.y)),Lt(this,m).dataset.hawkPosition=s,Lt(this,m).dataset.hawkDensity=h,Lt(this,m).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Lt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Lt(this,A)&&(null==(e=(t=Lt(this,A)).removeEventListener)||e.call(t,"change",Lt(this,E)),Ht(this,A,null)),"function"==typeof window.matchMedia&&(Ht(this,A,window.matchMedia(`(max-width: ${l}px)`)),Ht(this,E,()=>{Lt(this,m).dataset.hawkCompact=String(Lt(this,A).matches)}),Lt(this,A).addEventListener("change",Lt(this,E)),Lt(this,E).call(this))},B=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
K=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Bt):null;return jt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
I=function(t){try{null==localStorage||localStorage.setItem(Bt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
U=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
F=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},_=function(t){return Lt(this,h).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
z=function(t){return this.enablePins&&Lt(this,h).length?[{id:Kt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
G=function(t){const e=Lt(this,o)===Kt;if(Wt(this,L,_).call(this,t.url))Ht(this,h,Lt(this,h).filter(e=>e.url!==t.url));else{if(!(Lt(this,h).length<this.maxPins))return;Ht(this,h,[...Lt(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Wt(this,L,F).call(this,Lt(this,h)),Wt(this,L,O).call(this,Wt(this,L,z).call(this,(Lt(this,r)||[]).filter(t=>t.id!==Kt))),Lt(this,o)===Kt?Wt(this,L,J).call(this):e?Wt(this,L,st).call(this,Lt(this,s)):Wt(this,L,nt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
J=function(){Ht(this,a,Lt(this,h).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Ht(this,l,new Set(Lt(this,a).map(t=>t.url.split("#")[0])).size),Ht(this,n,Lt(this,a).length?0:-1),Wt(this,L,nt).call(this)},V=function(){return Dt(this,null,function*(){return Lt(this,u)?Lt(this,u):Lt(this,v)?(Ht(this,u,Lt(this,v)),yield Wt(this,L,Z).call(this),yield Wt(this,L,X).call(this),Lt(this,u)):(Lt(this,p)||Ht(this,p,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Dt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Ht(this,u,t),yield Wt(this,L,Z).call(this),yield Wt(this,L,X).call(this),t})).catch(t=>(Ht(this,f,t),Wt(this,L,Q).call(this),null))),Lt(this,p))})},X=function(){return Dt(this,null,function*(){Lt(this,o)!==Kt?this.eagerResults&&!Lt(this,s)&&(yield Wt(this,L,st).call(this,"")):Wt(this,L,J).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
Q=function(){Lt(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Lt(this,P).removeAttribute("aria-activedescendant"),Lt(this,T).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
Y=function(){const t=this.defaultPreviewUrl;Ht(this,y,t),Lt(this,x).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=Lt(this,x).querySelector(".hawk-preview-title"),s=Lt(this,x).querySelector(".hawk-preview-content");Lt(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),Wt(this,L,ht).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},Z=function(){return Dt(this,null,function*(){if(Lt(this,c))return;if(!Lt(this,u))return void Wt(this,L,O).call(this,Wt(this,L,z).call(this,Wt(this,L,D).call(this,[])));let t=[];try{const e=yield Lt(this,u).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Wt(this,L,O).call(this,Wt(this,L,z).call(this,Wt(this,L,D).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},tt=function(){const t=Lt(this,r)||[];Lt(this,M).innerHTML=t.map(t=>{const e=t.id===Lt(this,o);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Lt(this,M).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Wt(this,L,et).call(this,t),Lt(this,k).focus()}),t.addEventListener("keydown",t=>Wt(this,L,it).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
et=function(t){Ht(this,o,t.dataset.filter),Lt(this,M).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Lt(this,o)===Kt?(Ht(this,s,""),Lt(this,k).value="",Wt(this,L,J).call(this)):Wt(this,L,st).call(this,Lt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
it=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Wt(this,L,et).call(this,i[s]))},st=function(t){return Dt(this,null,function*(){var e;if(Ht(this,s,t),yield Wt(this,L,V).call(this),!Lt(this,u))return;const i=(Lt(this,r)||[]).find(t=>t.id===Lt(this,o)),h=Mt(Mt(Mt({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),(null==i?void 0:i.filter)?{filters:i.filter}:{});let c;try{({results:c}=t.trim()?yield Lt(this,u).debouncedSearch(t,h):yield Lt(this,u).search("",h))}catch(t){return Ht(this,f,t),void Wt(this,L,Q).call(this)}const d=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();d.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&d.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Ht(this,a,d.slice(0,this.maxResults)),Ht(this,l,new Set(Lt(this,a).map(t=>t.url.split("#")[0])).size),Ht(this,n,Lt(this,a).length?0:-1),Wt(this,L,nt).call(this)})},nt=function(){if(!Lt(this,a).length)return Lt(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Lt(this,s))}</div>`,Lt(this,P).removeAttribute("aria-activedescendant"),Lt(this,T).textContent=Lt(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Wt(this,L,lt).call(this);Lt(this,T).textContent=Lt(this,s)?this.strings.matchingResults(Lt(this,a).length,Lt(this,l)):this.strings.entries(Lt(this,a).length,Lt(this,l)),Lt(this,P).innerHTML=Lt(this,a).map((t,e)=>{var i;const s=this.enablePins&&Wt(this,L,_).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Lt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Lt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Lt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${Lt(this,n)}`),Lt(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Wt(this,L,at).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Wt(this,L,G).call(this,Lt(this,a)[s]);null==(i=this.onSelect)||i.call(this,Lt(this,a)[s])})}),Wt(this,L,lt).call(this)},at=function(t,e){Ht(this,n,t),Lt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Lt(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Wt(this,L,lt).call(this)},lt=function(){var t;const e=Lt(this,a)[Lt(this,n)];if(!e)return void(Lt(this,x).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===Lt(this,y))return;Ht(this,y,s),Lt(this,i).stop(Lt(this,w)),Lt(this,x).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Lt(this,x).querySelector(".hawk-preview-title"),h=Lt(this,x).querySelector(".hawk-preview-content");Lt(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),Wt(this,L,ht).call(this,e,s,h)},ht=function(t,e,s){return Dt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Wt(this,L,rt).call(this,e);n=t.isAnchor&&i?Wt(this,L,ot).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Lt(this,y)===e&&Ht(this,w,Lt(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
rt=function(t){if(Lt(this,g).has(t))return Lt(this,g).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Lt(this,g).delete(t),e});return Lt(this,g).set(t,e),e},
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
ct=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Lt(this,a).length&&Wt(this,L,at).call(this,(Lt(this,n)+1)%Lt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Lt(this,a).length&&Wt(this,L,at).call(this,(Lt(this,n)-1+Lt(this,a).length)%Lt(this,a).length,!0);else if("Enter"===t.key){const t=Lt(this,a)[Lt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
dt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Lt(this,k).focus(),Lt(this,k).value+=t.key,void Lt(this,k).dispatchEvent(new Event("input"));Wt(this,L,ct).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
ut=function(t){"ArrowDown"===t.key?(t.preventDefault(),Lt(this,x).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Lt(this,x).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Lt(this,x).scrollTop+=Lt(this,x).clientHeight):"PageUp"===t.key?(t.preventDefault(),Lt(this,x).scrollTop-=Lt(this,x).clientHeight):"Home"===t.key?(t.preventDefault(),Lt(this,x).scrollTop=0):"End"===t.key&&(t.preventDefault(),Lt(this,x).scrollTop=Lt(this,x).scrollHeight)},pt=function(t){Lt(this,d)&&"Tab"===t.key&&Wt(this,L,yt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Lt(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Lt(this,d)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
ft=function(){return!("true"===Lt(this,m).dataset.hawkCompact||"compact"===this.params.density)||"true"===Lt(this,m).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
wt=function(){return[Lt(this,k),...this.params.allowDensityToggle?Array.from(Lt(this,m).querySelectorAll(".hawk-density-btn")):[],Lt(this,m).querySelector(".hawk-modal-esc"),Lt(this,M).querySelector('.hawk-filter-pill[tabindex="0"]'),Lt(this,P),...Wt(this,L,ft).call(this)?[Lt(this,x)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
yt=function(t){const e=Wt(this,L,wt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
gt=function(){if(!Lt(this,S))return;const t=Lt(this,d)&&!Lt(this,k).value;Lt(this,b).dataset.hawkInputActive=String(!t),t&&!Lt(this,$)?Ht(this,$,Lt(this,i).rotatePlaceholder(Lt(this,S),this.rotatingPlaceholders)):!t&&Lt(this,$)&&(Lt(this,i).stop(Lt(this,$)),Ht(this,$,null))},At(_t,"themes",Ot),At(_t,"animations",Nt),"undefined"!=typeof window&&(window.Hawk=_t),t.HawkSearch=_t,t.default=_t,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
