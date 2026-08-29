/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,h,r,o,c,d,u,p,f,w,y,g,v,m,k,b,S,$,P,x,M,A,T,E,L,W,C,H,D,O,q,N,j,R,B,F,K,I,U,_,z,Q,G,J,V,X,Y,Z,tt,et,it,st,nt,at,lt,ht,rt,ot,ct,dt,ut,pt,ft,wt,yt,gt,vt,mt=Object.defineProperty,kt=Object.defineProperties,bt=Object.getOwnPropertyDescriptors,St=Object.getOwnPropertySymbols,$t=Object.prototype.hasOwnProperty,Pt=Object.prototype.propertyIsEnumerable,xt=t=>{throw TypeError(t)},Mt=(t,e,i)=>e in t?mt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,At=(t,e)=>{for(var i in e||(e={}))$t.call(e,i)&&Mt(t,i,e[i]);if(St)for(var i of St(e))Pt.call(e,i)&&Mt(t,i,e[i]);return t},Tt=(t,e)=>kt(t,bt(e)),Et=(t,e,i)=>Mt(t,"symbol"!=typeof e?e+"":e,i),Lt=(t,e,i)=>e.has(t)||xt("Cannot "+i),Wt=(t,e,i)=>(Lt(t,e,"read from private field"),i?i.call(t):e.get(t)),Ct=(t,e,i)=>e.has(t)?xt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Ht=(t,e,i,s)=>(Lt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Dt=(t,e,i)=>(Lt(t,e,"access private method"),i),Ot=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{h(i.next(t))}catch(t){n(t)}},l=t=>{try{h(i.throw(t))}catch(t){n(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);h((i=i.apply(t,e)).next())});const qt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=qt);const Nt=new Map,jt=new Map;jt.set("instant",qt);const Rt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Bt=new Set(["fit","medium","compact"]),Ft="hawk:density",Kt="pinned",It={open:!0,slash:!0,escape:!0},Ut={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin"};let _t=0;class zt{
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
constructor(t={}){var D,O,q;if(Ct(this,L),Ct(this,e),Ct(this,i),Ct(this,s),Ct(this,n),Ct(this,a),Ct(this,l),Ct(this,h),Ct(this,r),Ct(this,o),Ct(this,c),Ct(this,d),Ct(this,u),Ct(this,p),Ct(this,f),Ct(this,w),Ct(this,y),Ct(this,g),Ct(this,v),Ct(this,m),Ct(this,k),Ct(this,b),Ct(this,S),Ct(this,$),Ct(this,P),Ct(this,x),Ct(this,M),Ct(this,A),Ct(this,T),Ct(this,E),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${_t+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,Ht(this,v,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const j=Dt(this,L,F).call(this);this.params=Tt(At(At(At({},Rt),j?{density:j}:{}),t.params),{offset:At(At({},Rt.offset),null==(D=t.params)?void 0:D.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(O=t.maxResults)?O:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(q=t.maxPins)?q:20,this.inlineFilters=t.inlineFilters||!1,this.hotkeys=At(At({},It),t.hotkeys),this.strings=At(At({},Ut),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,Ht(this,e,Dt(this,L,W).call(this,t.theme)),Ht(this,i,Dt(this,L,C).call(this,t.animation)),Ht(this,s,""),Ht(this,n,-1),Ht(this,a,[]),Ht(this,l,0),Ht(this,h,this.enablePins?Dt(this,L,I).call(this):[]),Ht(this,o,t.defaultTab||"all"),Ht(this,r,Dt(this,L,H).call(this,t)),Ht(this,c,null!==Wt(this,r)),Ht(this,d,!1),Ht(this,u,null),Ht(this,p,null),Ht(this,f,null),Ht(this,w,null),Ht(this,y,null),Ht(this,g,new Map),this.container&&Dt(this,L,N).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){Nt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){jt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Wt(this,d),query:Wt(this,s),selectedIndex:Wt(this,n),matches:Wt(this,a),pageCount:Wt(this,l),pins:Wt(this,h),activeTab:Wt(this,o),error:Wt(this,f)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Tt(At(At({},this.params),t),{offset:At(At({},this.params.offset),null==t?void 0:t.offset)}),Dt(this,L,R).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Wt(this,m).hidden=!1,document.body.style.overflow="hidden",Ht(this,d,!0),Dt(this,L,J).call(this),Dt(this,L,vt).call(this),setTimeout(()=>{Wt(this,k).focus(),Wt(this,k).select()},40),null==(t=this.onOpen)||t.call(this,Wt(this,s))}
/** Closes the search modal. */close(){var t;Wt(this,m).hidden=!0,document.body.style.overflow="",Ht(this,d,!1),Dt(this,L,vt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;Wt(this,i).stop(Wt(this,w)),Wt(this,$)&&Wt(this,i).stop(Wt(this,$)),null==(e=null==(t=Wt(this,T))?void 0:t.removeEventListener)||e.call(t,"change",Wt(this,E)),null==(s=Wt(this,m))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,g=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,x=new WeakMap,M=new WeakMap,A=new WeakMap,T=new WeakMap,E=new WeakMap,L=new WeakSet,W=function(t){if(!t)return Nt.get("typeflow")||null;if("string"==typeof t){const e=Nt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},C=function(t){if(!1===t)return jt.get("instant");if(!t)return jt.get("typeflow")||jt.get("instant");if("string"==typeof t){const e=jt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
H=function(t){return t.tabs?Dt(this,L,D).call(this,t.tabs):t.categories?Dt(this,L,D).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
D=function(t){const e=t.map(t=>({id:t.id||Dt(this,L,O).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},O=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
q=function(t){var e,i;Ht(this,r,t),t.some(t=>t.id===Wt(this,o))||("all"!==Wt(this,o)&&Wt(this,o)!==Kt&&console.warn(`HawkSearch: no tab with id "${Wt(this,o)}" (defaultTab); falling back to "all".`),Ht(this,o,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Dt(this,L,tt).call(this)},N=function(){const t=document.createElement("div");t.innerHTML=Dt(this,L,j).call(this),Ht(this,m,t.firstElementChild),this.container.appendChild(Wt(this,m)),Ht(this,k,Wt(this,m).querySelector(".hawk-modal-input")),Ht(this,b,Wt(this,m).querySelector(".hawk-input-wrap")),Ht(this,S,Wt(this,m).querySelector(".hawk-input-ghost")),Wt(this,S)&&(Wt(this,S).textContent=this.rotatingPlaceholders[0],Dt(this,L,vt).call(this)),Ht(this,P,Wt(this,m).querySelector(".hawk-results-pane")),Ht(this,x,Wt(this,m).querySelector(".hawk-preview-pane")),Ht(this,M,Wt(this,m).querySelector(".hawk-modal-filters")),Ht(this,A,Wt(this,m).querySelector(".hawk-modal-counter")),Wt(this,e)&&(Wt(this,e).apply(Wt(this,m)),Object.entries(Wt(this,e).tokens||{}).forEach(([t,e])=>{Wt(this,m).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Wt(this,m).dataset.hawkMarkdownStyles="off"),Dt(this,L,R).call(this),Wt(this,c)&&Dt(this,L,q).call(this,Dt(this,L,z).call(this,Wt(this,r))),this.defaultPreviewUrl&&Dt(this,L,Y).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Wt(this,m).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Wt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Dt(this,L,K).call(this,t.dataset.density)})}),Wt(this,k).addEventListener("input",()=>{Dt(this,L,nt).call(this,Wt(this,k).value),Dt(this,L,vt).call(this)}),Wt(this,k).addEventListener("keydown",t=>Dt(this,L,dt).call(this,t)),Wt(this,k).addEventListener("focus",()=>Dt(this,L,J).call(this),{once:!0}),Wt(this,P).addEventListener("keydown",t=>Dt(this,L,ut).call(this,t)),Wt(this,x).addEventListener("keydown",t=>Dt(this,L,pt).call(this,t)),Wt(this,x).addEventListener("focus",()=>{Wt(this,m).dataset.hawkShowPreview="true"}),Wt(this,x).addEventListener("blur",()=>{Wt(this,m).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Dt(this,L,ft).call(this,t))},j=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},R=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:h}=this.params;Wt(this,m).style.setProperty("--hawk-scale",String(i)),Wt(this,m).style.setProperty("--hawk-offset-x",Dt(this,L,B).call(this,n.x)),Wt(this,m).style.setProperty("--hawk-offset-y",Dt(this,L,B).call(this,n.y)),Wt(this,m).dataset.hawkPosition=s,Wt(this,m).dataset.hawkDensity=h,Wt(this,m).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Wt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Wt(this,T)&&(null==(e=(t=Wt(this,T)).removeEventListener)||e.call(t,"change",Wt(this,E)),Ht(this,T,null)),"function"==typeof window.matchMedia&&(Ht(this,T,window.matchMedia(`(max-width: ${l}px)`)),Ht(this,E,()=>{Wt(this,m).dataset.hawkCompact=String(Wt(this,T).matches)}),Wt(this,T).addEventListener("change",Wt(this,E)),Wt(this,E).call(this))},B=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
F=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Ft):null;return Bt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
K=function(t){try{null==localStorage||localStorage.setItem(Ft,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
I=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
U=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},_=function(t){return Wt(this,h).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
z=function(t){return this.enablePins&&Wt(this,h).length?[{id:Kt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
Q=function(t){const e=Wt(this,o)===Kt;if(Dt(this,L,_).call(this,t.url))Ht(this,h,Wt(this,h).filter(e=>e.url!==t.url));else{if(!(Wt(this,h).length<this.maxPins))return;Ht(this,h,[...Wt(this,h),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Dt(this,L,U).call(this,Wt(this,h)),Dt(this,L,q).call(this,Dt(this,L,z).call(this,(Wt(this,r)||[]).filter(t=>t.id!==Kt))),Wt(this,o)===Kt?Dt(this,L,G).call(this):e?Dt(this,L,nt).call(this,Wt(this,s)):Dt(this,L,at).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
G=function(){Ht(this,a,Wt(this,h).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Ht(this,l,new Set(Wt(this,a).map(t=>t.url.split("#")[0])).size),Ht(this,n,Wt(this,a).length?0:-1),Dt(this,L,at).call(this)},J=function(){return Ot(this,null,function*(){return Wt(this,u)?Wt(this,u):Wt(this,v)?(Ht(this,u,Wt(this,v)),yield Dt(this,L,Z).call(this),yield Dt(this,L,V).call(this),Wt(this,u)):(Wt(this,p)||Ht(this,p,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Ot(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Ht(this,u,t),yield Dt(this,L,Z).call(this),yield Dt(this,L,V).call(this),t})).catch(t=>(Ht(this,f,t),Dt(this,L,X).call(this),null))),Wt(this,p))})},V=function(){return Ot(this,null,function*(){Wt(this,o)!==Kt?this.eagerResults&&!Wt(this,s)&&(yield Dt(this,L,nt).call(this,"")):Dt(this,L,G).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
X=function(){Wt(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Wt(this,P).removeAttribute("aria-activedescendant"),Wt(this,A).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
Y=function(){const t=this.defaultPreviewUrl;Ht(this,y,t),Wt(this,x).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=Wt(this,x).querySelector(".hawk-preview-title"),s=Wt(this,x).querySelector(".hawk-preview-content");Wt(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),Dt(this,L,rt).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},Z=function(){return Ot(this,null,function*(){if(Wt(this,c))return;if(!Wt(this,u))return void Dt(this,L,q).call(this,Dt(this,L,z).call(this,Dt(this,L,D).call(this,[])));let t=[];try{const e=yield Wt(this,u).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Dt(this,L,q).call(this,Dt(this,L,z).call(this,Dt(this,L,D).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},tt=function(){const t=Wt(this,r)||[];Wt(this,M).innerHTML=t.map(t=>{const e=t.id===Wt(this,o);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Wt(this,M).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Dt(this,L,et).call(this,t),Wt(this,k).focus()}),t.addEventListener("keydown",t=>Dt(this,L,it).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
et=function(t){Ht(this,o,t.dataset.filter),Wt(this,M).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Wt(this,o)===Kt?(Ht(this,s,""),Wt(this,k).value="",Dt(this,L,G).call(this)):Dt(this,L,nt).call(this,Wt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
it=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Dt(this,L,et).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
st=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},nt=function(t){return Ot(this,null,function*(){var e;if(Ht(this,s,t),yield Dt(this,L,J).call(this),!Wt(this,u))return;const i=(Wt(this,r)||[]).find(t=>t.id===Wt(this,o)),{filters:h,remainingQuery:c}=Dt(this,L,st).call(this,t),d=(null==i?void 0:i.filter)||h?At(At({},(null==i?void 0:i.filter)||{}),h||{}):null,p=At(At(At({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),d?{filters:d}:{}),w=this.inlineFilters?c:t;let y;try{({results:y}=w.trim()?yield Wt(this,u).debouncedSearch(w,p):yield Wt(this,u).search("",p))}catch(t){return Ht(this,f,t),void Dt(this,L,X).call(this)}const g=[];for(const t of(y||[]).slice(0,this.maxResults)){const i=yield t.data();g.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&g.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Ht(this,a,g.slice(0,this.maxResults)),Ht(this,l,new Set(Wt(this,a).map(t=>t.url.split("#")[0])).size),Ht(this,n,Wt(this,a).length?0:-1),Dt(this,L,at).call(this)})},at=function(){if(!Wt(this,a).length)return Wt(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Wt(this,s))}</div>`,Wt(this,P).removeAttribute("aria-activedescendant"),Wt(this,A).textContent=Wt(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Dt(this,L,ht).call(this);Wt(this,A).textContent=Wt(this,s)?this.strings.matchingResults(Wt(this,a).length,Wt(this,l)):this.strings.entries(Wt(this,a).length,Wt(this,l)),Wt(this,P).innerHTML=Wt(this,a).map((t,e)=>{var i;const s=this.enablePins&&Dt(this,L,_).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Wt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Wt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Wt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${Wt(this,n)}`),Wt(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Dt(this,L,lt).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Dt(this,L,Q).call(this,Wt(this,a)[s]);null==(i=this.onSelect)||i.call(this,Wt(this,a)[s])})}),Dt(this,L,ht).call(this)},lt=function(t,e){Ht(this,n,t),Wt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Wt(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Dt(this,L,ht).call(this)},ht=function(){var t;const e=Wt(this,a)[Wt(this,n)];if(!e)return void(Wt(this,x).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===Wt(this,y))return;Ht(this,y,s),Wt(this,i).stop(Wt(this,w)),Wt(this,x).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Wt(this,x).querySelector(".hawk-preview-title"),h=Wt(this,x).querySelector(".hawk-preview-content");Wt(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),Dt(this,L,rt).call(this,e,s,h)},rt=function(t,e,s){return Ot(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Dt(this,L,ot).call(this,e);n=t.isAnchor&&i?Dt(this,L,ct).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Wt(this,y)===e&&Ht(this,w,Wt(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
ot=function(t){if(Wt(this,g).has(t))return Wt(this,g).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Wt(this,g).delete(t),e});return Wt(this,g).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
ct=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
dt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Wt(this,a).length&&Dt(this,L,lt).call(this,(Wt(this,n)+1)%Wt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Wt(this,a).length&&Dt(this,L,lt).call(this,(Wt(this,n)-1+Wt(this,a).length)%Wt(this,a).length,!0);else if("Enter"===t.key){const t=Wt(this,a)[Wt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
ut=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Wt(this,k).focus(),Wt(this,k).value+=t.key,void Wt(this,k).dispatchEvent(new Event("input"));Dt(this,L,dt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
pt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Wt(this,x).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Wt(this,x).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Wt(this,x).scrollTop+=Wt(this,x).clientHeight):"PageUp"===t.key?(t.preventDefault(),Wt(this,x).scrollTop-=Wt(this,x).clientHeight):"Home"===t.key?(t.preventDefault(),Wt(this,x).scrollTop=0):"End"===t.key&&(t.preventDefault(),Wt(this,x).scrollTop=Wt(this,x).scrollHeight)},ft=function(t){Wt(this,d)&&"Tab"===t.key&&Dt(this,L,gt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Wt(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Wt(this,d)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
wt=function(){return!("true"===Wt(this,m).dataset.hawkCompact||"compact"===this.params.density)||"true"===Wt(this,m).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
yt=function(){return[Wt(this,k),...this.params.allowDensityToggle?Array.from(Wt(this,m).querySelectorAll(".hawk-density-btn")):[],Wt(this,m).querySelector(".hawk-modal-esc"),Wt(this,M).querySelector('.hawk-filter-pill[tabindex="0"]'),Wt(this,P),...Dt(this,L,wt).call(this)?[Wt(this,x)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
gt=function(t){const e=Dt(this,L,yt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
vt=function(){if(!Wt(this,S))return;const t=Wt(this,d)&&!Wt(this,k).value;Wt(this,b).dataset.hawkInputActive=String(!t),t&&!Wt(this,$)?Ht(this,$,Wt(this,i).rotatePlaceholder(Wt(this,S),this.rotatingPlaceholders)):!t&&Wt(this,$)&&(Wt(this,i).stop(Wt(this,$)),Ht(this,$,null))},Et(zt,"themes",Nt),Et(zt,"animations",jt),"undefined"!=typeof window&&(window.Hawk=zt),t.HawkSearch=zt,t.default=zt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
