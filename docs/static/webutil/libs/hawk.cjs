/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,a,n,l,h,r,o,c,d,u,p,f,w,y,v,g,m,k,b,S,$,M,x,E,T,L,P,A,C,W,H,q,D,O,N,R,j,F,K,U,I,B,_,z,G,V,X,J,Q,Y,Z,tt,et,it,st,at,nt,lt,ht,rt,ot,ct,dt=Object.defineProperty,ut=Object.defineProperties,pt=Object.getOwnPropertyDescriptors,ft=Object.getOwnPropertySymbols,wt=Object.prototype.hasOwnProperty,yt=Object.prototype.propertyIsEnumerable,vt=t=>{throw TypeError(t)},gt=(t,e,i)=>e in t?dt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,mt=(t,e)=>{for(var i in e||(e={}))wt.call(e,i)&&gt(t,i,e[i]);if(ft)for(var i of ft(e))yt.call(e,i)&&gt(t,i,e[i]);return t},kt=(t,e)=>ut(t,pt(e)),bt=(t,e,i)=>gt(t,"symbol"!=typeof e?e+"":e,i),St=(t,e,i)=>e.has(t)||vt("Cannot "+i),$t=(t,e,i)=>(St(t,e,"read from private field"),i?i.call(t):e.get(t)),Mt=(t,e,i)=>e.has(t)?vt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),xt=(t,e,i,s)=>(St(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Et=(t,e,i)=>(St(t,e,"access private method"),i),Tt=(t,e,i)=>new Promise((s,a)=>{var n=t=>{try{h(i.next(t))}catch(t){a(t)}},l=t=>{try{h(i.throw(t))}catch(t){a(t)}},h=t=>t.done?s(t.value):Promise.resolve(t.value).then(n,l);h((i=i.apply(t,e)).next())});const Lt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Lt);const Pt=new Map,At=new Map;At.set("instant",Lt);const Ct={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Wt=new Set(["fit","medium","compact"]),Ht="hawk:density",qt={open:!0,slash:!0,escape:!0},Dt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable"};let Ot=0;class Nt{
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
     * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
     *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
     *   functions, not plain strings, so a locale can supply its own pluralization.
     * @param {(query: string) => void} [config.onOpen]
     * @param {() => void} [config.onClose]
     * @param {(item: object) => void} [config.onSelect]
     */
constructor(t={}){var H,q;if(Mt(this,P),Mt(this,e),Mt(this,i),Mt(this,s),Mt(this,a),Mt(this,n),Mt(this,l),Mt(this,h),Mt(this,r),Mt(this,o),Mt(this,c),Mt(this,d),Mt(this,u),Mt(this,p),Mt(this,f),Mt(this,w),Mt(this,y),Mt(this,v),Mt(this,g),Mt(this,m),Mt(this,k),Mt(this,b),Mt(this,S),Mt(this,$),Mt(this,M),Mt(this,x),Mt(this,E),Mt(this,T),Mt(this,L),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Ot+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,xt(this,v,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const D=Et(this,P,F).call(this);this.params=kt(mt(mt(mt({},Ct),D?{density:D}:{}),t.params),{offset:mt(mt({},Ct.offset),null==(H=t.params)?void 0:H.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(q=t.maxResults)?q:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.hotkeys=mt(mt({},qt),t.hotkeys),this.strings=mt(mt({},Dt),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,xt(this,e,Et(this,P,A).call(this,t.theme)),xt(this,i,Et(this,P,C).call(this,t.animation)),xt(this,s,""),xt(this,a,-1),xt(this,n,[]),xt(this,l,0),xt(this,r,t.defaultTab||"all"),xt(this,h,Et(this,P,W).call(this,t)),xt(this,o,null!==$t(this,h)),xt(this,c,!1),xt(this,d,null),xt(this,u,null),xt(this,p,null),xt(this,f,null),xt(this,w,null),xt(this,y,new Map),this.container&&Et(this,P,O).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){Pt.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){At.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:$t(this,c),query:$t(this,s),selectedIndex:$t(this,a),matches:$t(this,n),pageCount:$t(this,l),activeTab:$t(this,r),error:$t(this,p)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=kt(mt(mt({},this.params),t),{offset:mt(mt({},this.params.offset),null==t?void 0:t.offset)}),Et(this,P,R).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;$t(this,g).hidden=!1,document.body.style.overflow="hidden",xt(this,c,!0),Et(this,P,U).call(this),Et(this,P,ct).call(this),setTimeout(()=>{$t(this,m).focus(),$t(this,m).select()},40),null==(t=this.onOpen)||t.call(this,$t(this,s))}
/** Closes the search modal. */close(){var t;$t(this,g).hidden=!0,document.body.style.overflow="",xt(this,c,!1),Et(this,P,ct).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s;$t(this,i).stop($t(this,f)),$t(this,S)&&$t(this,i).stop($t(this,S)),null==(e=null==(t=$t(this,T))?void 0:t.removeEventListener)||e.call(t,"change",$t(this,L)),null==(s=$t(this,g))||s.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,a=new WeakMap,n=new WeakMap,l=new WeakMap,h=new WeakMap,r=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,g=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,M=new WeakMap,x=new WeakMap,E=new WeakMap,T=new WeakMap,L=new WeakMap,P=new WeakSet,A=function(t){if(!t)return Pt.get("typeflow")||null;if("string"==typeof t){const e=Pt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},C=function(t){if(!1===t)return At.get("instant");if(!t)return At.get("typeflow")||At.get("instant");if("string"==typeof t){const e=At.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
W=function(t){return t.tabs?Et(this,P,H).call(this,t.tabs):t.categories?Et(this,P,H).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
H=function(t){const e=t.map(t=>({id:t.id||Et(this,P,q).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},q=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
D=function(t){var e,i;xt(this,h,t),t.some(t=>t.id===$t(this,r))||("all"!==$t(this,r)&&console.warn(`HawkSearch: no tab with id "${$t(this,r)}" (defaultTab); falling back to "all".`),xt(this,r,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Et(this,P,G).call(this)},O=function(){const t=document.createElement("div");t.innerHTML=Et(this,P,N).call(this),xt(this,g,t.firstElementChild),this.container.appendChild($t(this,g)),xt(this,m,$t(this,g).querySelector(".hawk-modal-input")),xt(this,k,$t(this,g).querySelector(".hawk-input-wrap")),xt(this,b,$t(this,g).querySelector(".hawk-input-ghost")),$t(this,b)&&($t(this,b).textContent=this.rotatingPlaceholders[0],Et(this,P,ct).call(this)),xt(this,$,$t(this,g).querySelector(".hawk-results-pane")),xt(this,M,$t(this,g).querySelector(".hawk-preview-pane")),xt(this,x,$t(this,g).querySelector(".hawk-modal-filters")),xt(this,E,$t(this,g).querySelector(".hawk-modal-counter")),$t(this,e)&&($t(this,e).apply($t(this,g)),Object.entries($t(this,e).tokens||{}).forEach(([t,e])=>{$t(this,g).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&($t(this,g).dataset.hawkMarkdownStyles="off"),Et(this,P,R).call(this),$t(this,o)&&Et(this,P,D).call(this,$t(this,h)),this.defaultPreviewUrl&&Et(this,P,_).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),$t(this,g).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),$t(this,g).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Et(this,P,K).call(this,t.dataset.density)})}),$t(this,m).addEventListener("input",()=>{Et(this,P,J).call(this,$t(this,m).value),Et(this,P,ct).call(this)}),$t(this,m).addEventListener("keydown",t=>Et(this,P,st).call(this,t)),$t(this,m).addEventListener("focus",()=>Et(this,P,U).call(this),{once:!0}),$t(this,$).addEventListener("keydown",t=>Et(this,P,at).call(this,t)),$t(this,M).addEventListener("keydown",t=>Et(this,P,nt).call(this,t)),$t(this,M).addEventListener("focus",()=>{$t(this,g).dataset.hawkShowPreview="true"}),$t(this,M).addEventListener("blur",()=>{$t(this,g).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Et(this,P,lt).call(this,t))},N=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n          </div>\n        </div>\n      </div>\n    `.trim()},R=function(){var t,e;const{scale:i,position:s,offset:a,columns:n,breakpoint:l,density:h}=this.params;$t(this,g).style.setProperty("--hawk-scale",String(i)),$t(this,g).style.setProperty("--hawk-offset-x",Et(this,P,j).call(this,a.x)),$t(this,g).style.setProperty("--hawk-offset-y",Et(this,P,j).call(this,a.y)),$t(this,g).dataset.hawkPosition=s,$t(this,g).dataset.hawkDensity=h,$t(this,g).querySelector(".hawk-modal-body").dataset.hawkColumns=String(n),$t(this,g).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===h;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),$t(this,T)&&(null==(e=(t=$t(this,T)).removeEventListener)||e.call(t,"change",$t(this,L)),xt(this,T,null)),"function"==typeof window.matchMedia&&(xt(this,T,window.matchMedia(`(max-width: ${l}px)`)),xt(this,L,()=>{$t(this,g).dataset.hawkCompact=String($t(this,T).matches)}),$t(this,T).addEventListener("change",$t(this,L)),$t(this,L).call(this))},j=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
F=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Ht):null;return Wt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
K=function(t){try{null==localStorage||localStorage.setItem(Ht,t)}catch(t){}},U=function(){return Tt(this,null,function*(){return $t(this,d)?$t(this,d):$t(this,v)?(xt(this,d,$t(this,v)),yield Et(this,P,z).call(this),yield Et(this,P,I).call(this),$t(this,d)):($t(this,u)||xt(this,u,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Tt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),xt(this,d,t),yield Et(this,P,z).call(this),yield Et(this,P,I).call(this),t})).catch(t=>(xt(this,p,t),Et(this,P,B).call(this),null))),$t(this,u))})},I=function(){return Tt(this,null,function*(){this.eagerResults&&!$t(this,s)&&(yield Et(this,P,J).call(this,""))})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
B=function(){$t(this,$).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,$t(this,$).removeAttribute("aria-activedescendant"),$t(this,E).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
_=function(){const t=this.defaultPreviewUrl;xt(this,w,t),$t(this,M).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=$t(this,M).querySelector(".hawk-preview-title"),s=$t(this,M).querySelector(".hawk-preview-content");$t(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),Et(this,P,tt).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},z=function(){return Tt(this,null,function*(){if($t(this,o))return;if(!$t(this,d))return void Et(this,P,D).call(this,Et(this,P,H).call(this,[]));let t=[];try{const e=yield $t(this,d).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Et(this,P,D).call(this,Et(this,P,H).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))))})},G=function(){const t=$t(this,h)||[];$t(this,x).innerHTML=t.map(t=>{const e=t.id===$t(this,r);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from($t(this,x).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Et(this,P,V).call(this,t),$t(this,m).focus()}),t.addEventListener("keydown",t=>Et(this,P,X).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
V=function(t){xt(this,r,t.dataset.filter),$t(this,x).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Et(this,P,J).call(this,$t(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
X=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Et(this,P,V).call(this,i[s]))},J=function(t){return Tt(this,null,function*(){var e;if(xt(this,s,t),yield Et(this,P,U).call(this),!$t(this,d))return;const i=($t(this,h)||[]).find(t=>t.id===$t(this,r)),o=mt(mt(mt({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),(null==i?void 0:i.filter)?{filters:i.filter}:{});let c;try{({results:c}=t.trim()?yield $t(this,d).debouncedSearch(t,o):yield $t(this,d).search("",o))}catch(t){return xt(this,p,t),void Et(this,P,B).call(this)}const u=[];for(const t of(c||[]).slice(0,this.maxResults)){const i=yield t.data();u.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&u.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}xt(this,n,u.slice(0,this.maxResults)),xt(this,l,new Set($t(this,n).map(t=>t.url.split("#")[0])).size),xt(this,a,$t(this,n).length?0:-1),Et(this,P,Q).call(this)})},Q=function(){if(!$t(this,n).length)return $t(this,$).innerHTML=`<div class="hawk-empty">${this.strings.noResults($t(this,s))}</div>`,$t(this,$).removeAttribute("aria-activedescendant"),$t(this,E).textContent=$t(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Et(this,P,Z).call(this);$t(this,E).textContent=$t(this,s)?this.strings.matchingResults($t(this,n).length,$t(this,l)):this.strings.entries($t(this,n).length,$t(this,l)),$t(this,$).innerHTML=$t(this,n).map((t,e)=>{var i;return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===$t(this,a)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===$t(this,a)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),$t(this,$).setAttribute("aria-activedescendant",`${this.id}-result-${$t(this,a)}`),$t(this,$).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Et(this,P,Y).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",()=>{var e;return null==(e=this.onSelect)?void 0:e.call(this,$t(this,n)[Number(t.dataset.index)])})}),Et(this,P,Z).call(this)},Y=function(t,e){xt(this,a,t),$t(this,$).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),$t(this,$).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const a=Number(i.dataset.index)===t;i.classList.toggle("is-selected",a),i.setAttribute("aria-selected",String(a)),a&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Et(this,P,Z).call(this)},Z=function(){var t;const e=$t(this,n)[$t(this,a)];if(!e)return void($t(this,M).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===$t(this,w))return;xt(this,w,s),$t(this,i).stop($t(this,f)),$t(this,M).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=$t(this,M).querySelector(".hawk-preview-title"),h=$t(this,M).querySelector(".hawk-preview-content");$t(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),Et(this,P,tt).call(this,e,s,h)},tt=function(t,e,s){return Tt(this,null,function*(){let a=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Et(this,P,et).call(this,e);a=t.isAnchor&&i?Et(this,P,it).call(this,s,i):s.innerHTML}catch(e){a=t.excerpt||""}$t(this,w)===e&&xt(this,f,$t(this,i).typeContent(s,a))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
et=function(t){if($t(this,y).has(t))return $t(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw $t(this,y).delete(t),e});return $t(this,y).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
it=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,a=[i.outerHTML];let n=i.nextElementSibling;for(;n&&!(/^H[1-6]$/.test(n.tagName)&&Number(n.tagName[1])<=s);)a.push(n.outerHTML),n=n.nextElementSibling;return a.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
st=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),$t(this,n).length&&Et(this,P,Y).call(this,($t(this,a)+1)%$t(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),$t(this,n).length&&Et(this,P,Y).call(this,($t(this,a)-1+$t(this,n).length)%$t(this,n).length,!0);else if("Enter"===t.key){const t=$t(this,n)[$t(this,a)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
at=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),$t(this,m).focus(),$t(this,m).value+=t.key,void $t(this,m).dispatchEvent(new Event("input"));Et(this,P,st).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
nt=function(t){"ArrowDown"===t.key?(t.preventDefault(),$t(this,M).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),$t(this,M).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),$t(this,M).scrollTop+=$t(this,M).clientHeight):"PageUp"===t.key?(t.preventDefault(),$t(this,M).scrollTop-=$t(this,M).clientHeight):"Home"===t.key?(t.preventDefault(),$t(this,M).scrollTop=0):"End"===t.key&&(t.preventDefault(),$t(this,M).scrollTop=$t(this,M).scrollHeight)},lt=function(t){$t(this,c)&&"Tab"===t.key&&Et(this,P,ot).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),$t(this,c)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&$t(this,c)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
ht=function(){return!("true"===$t(this,g).dataset.hawkCompact||"compact"===this.params.density)||"true"===$t(this,g).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
rt=function(){return[$t(this,m),...this.params.allowDensityToggle?Array.from($t(this,g).querySelectorAll(".hawk-density-btn")):[],$t(this,g).querySelector(".hawk-modal-esc"),$t(this,x).querySelector('.hawk-filter-pill[tabindex="0"]'),$t(this,$),...Et(this,P,ht).call(this)?[$t(this,M)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
ot=function(t){const e=Et(this,P,rt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
ct=function(){if(!$t(this,b))return;const t=$t(this,c)&&!$t(this,m).value;$t(this,k).dataset.hawkInputActive=String(!t),t&&!$t(this,S)?xt(this,S,$t(this,i).rotatePlaceholder($t(this,b),this.rotatingPlaceholders)):!t&&$t(this,S)&&($t(this,i).stop($t(this,S)),xt(this,S,null))},bt(Nt,"themes",Pt),bt(Nt,"animations",At),"undefined"!=typeof window&&(window.Hawk=Nt),t.HawkSearch=Nt,t.default=Nt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
