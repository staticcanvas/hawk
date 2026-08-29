/*! hawk v0.3.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,d,u,p,f,g,w,y,v,m,k,b,S,$,P,x,L,M,A,E,T,C,W,H,q,D,O,N,K,B,R,j,F,I,U,z,Q,G,J,_,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,gt,wt,yt,vt,mt,kt,bt=Object.defineProperty,St=Object.defineProperties,$t=Object.getOwnPropertyDescriptors,Pt=Object.getOwnPropertySymbols,xt=Object.prototype.hasOwnProperty,Lt=Object.prototype.propertyIsEnumerable,Mt=t=>{throw TypeError(t)},At=(t,e,i)=>e in t?bt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Et=(t,e)=>{for(var i in e||(e={}))xt.call(e,i)&&At(t,i,e[i]);if(Pt)for(var i of Pt(e))Lt.call(e,i)&&At(t,i,e[i]);return t},Tt=(t,e)=>St(t,$t(e)),Ct=(t,e,i)=>At(t,"symbol"!=typeof e?e+"":e,i),Wt=(t,e,i)=>e.has(t)||Mt("Cannot "+i),Ht=(t,e,i)=>(Wt(t,e,"read from private field"),i?i.call(t):e.get(t)),qt=(t,e,i)=>e.has(t)?Mt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Dt=(t,e,i,s)=>(Wt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Ot=(t,e,i)=>(Wt(t,e,"access private method"),i),Nt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Kt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Kt);const Bt=new Map,Rt=new Map;Rt.set("instant",Kt);const jt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Ft=new Set(["fit","medium","compact"]),It="hawk:density",Ut="pinned",zt={open:!0,slash:!0,escape:!0},Qt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Gt=0;class Jt{
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
   * @param {object} [config.trigger] Renders hawk's own trigger button instead of requiring the consumer to
   *   build one — omit entirely to keep today's behavior (`triggerSelector` pointing at hand-built markup).
   * @param {'minimal'|'compact'|'default'} [config.trigger.kind='default'] `'minimal'`: icon only. `'compact'`:
   *   icon + "Search". `'default'`: icon + "Search..." + a Ctrl/Cmd+K hint (omitted if `hotkeys.open` is off).
   * @param {string|HTMLElement} config.trigger.container Required — selector or element the trigger button is
   *   appended into. Always marked `[data-search-trigger]` regardless of a customized `triggerSelector`.
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
constructor(q={}){var D,O,K;if(qt(this,T),qt(this,t),qt(this,e),qt(this,i),qt(this,s),qt(this,n),qt(this,a),qt(this,l),qt(this,r),qt(this,h),qt(this,o),qt(this,c),qt(this,d),qt(this,u),qt(this,p),qt(this,f),qt(this,g),qt(this,w),qt(this,y),qt(this,v),qt(this,m),qt(this,k),qt(this,b),qt(this,S),qt(this,$),qt(this,P),qt(this,x),qt(this,L),qt(this,M),qt(this,A),qt(this,E),!q.index&&!q.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=q.id||`hawk-search-${Gt+=1}`,this.indexBasePath=q.index?q.index.endsWith("/")?q.index:`${q.index}/`:null,Dt(this,v,q.pagefind||null),this.triggerSelector=q.triggerSelector||"[data-search-trigger]",this.container=q.container||("undefined"!=typeof document?document.body:null);const B=Ot(this,T,I).call(this);this.params=Tt(Et(Et(Et({},jt),B?{density:B}:{}),q.params),{offset:Et(Et({},jt.offset),null==(D=q.params)?void 0:D.offset)}),this.categoryFilterName=q.categoryFilterName||"category",this.includeAllTab=!1!==q.includeAllTab,this.pagefindOptions=q.pagefindOptions||{},this.maxResults=null!=(O=q.maxResults)?O:18,this.contentSelector=q.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=q.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=q.rotatingPlaceholders||[],this.showPoweredBy=!1!==q.showPoweredBy,this.poweredByHref=q.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==q.enablePins,this.pinStorageKey=q.pinStorageKey||"hawk:pins",this.maxPins=null!=(K=q.maxPins)?K:20,this.inlineFilters=q.inlineFilters||!1,this.triggerConfig=q.trigger||null,this.hotkeys=Et(Et({},zt),q.hotkeys),this.strings=Et(Et({},Qt),q.strings),this.defaultPreviewUrl=q.defaultPreviewUrl||null,this.defaultPreviewTitle=q.defaultPreviewTitle||"",this.eagerResults=!1!==q.eagerResults,this.onOpen=q.onOpen,this.onClose=q.onClose,this.onSelect=q.onSelect,Dt(this,t,Ot(this,T,C).call(this,q.theme)),Dt(this,e,Ot(this,T,W).call(this,q.animation)),Dt(this,i,""),Dt(this,s,-1),Dt(this,n,[]),Dt(this,a,0),Dt(this,l,this.enablePins?Ot(this,T,z).call(this):[]),Dt(this,o,q.defaultTab||"all"),Dt(this,h,Ot(this,T,H).call(this,q)),Dt(this,c,null!==Ht(this,h)),Dt(this,d,!1),Dt(this,u,null),Dt(this,p,null),Dt(this,f,null),Dt(this,g,null),Dt(this,w,null),Dt(this,y,new Map),this.container&&Ot(this,T,N).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){Bt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Rt.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Ht(this,d),query:Ht(this,i),selectedIndex:Ht(this,s),matches:Ht(this,n),pageCount:Ht(this,a),pins:Ht(this,l),activeTab:Ht(this,o),error:Ht(this,f)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=Tt(Et(Et({},this.params),t),{offset:Et(Et({},this.params.offset),null==t?void 0:t.offset)}),Ot(this,T,j).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Ht(this,m).hidden=!1,document.body.style.overflow="hidden",Dt(this,d,!0),Ot(this,T,X).call(this),Ot(this,T,kt).call(this),setTimeout(()=>{Ht(this,k).focus(),Ht(this,k).select()},40),null==(t=this.onOpen)||t.call(this,Ht(this,i))}
/** Closes the search modal. */close(){var t;Ht(this,m).hidden=!0,document.body.style.overflow="",Dt(this,d,!1),Ot(this,T,kt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;Ht(this,e).stop(Ht(this,g)),Ht(this,$)&&Ht(this,e).stop(Ht(this,$)),null==(i=null==(t=Ht(this,A))?void 0:t.removeEventListener)||i.call(t,"change",Ht(this,E)),null==(s=Ht(this,m))||s.remove(),null==(n=Ht(this,r))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,x=new WeakMap,L=new WeakMap,M=new WeakMap,A=new WeakMap,E=new WeakMap,T=new WeakSet,C=function(t){if(!t)return Bt.get("typeflow")||null;if("string"==typeof t){const e=Bt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},W=function(t){if(!1===t)return Rt.get("instant");if(!t)return Rt.get("typeflow")||Rt.get("instant");if("string"==typeof t){const e=Rt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
H=function(t){return t.tabs?Ot(this,T,q).call(this,t.tabs):t.categories?Ot(this,T,q).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
q=function(t){const e=t.map(t=>({id:t.id||Ot(this,T,D).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},D=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
O=function(t){var e,i;Dt(this,h,t),t.some(t=>t.id===Ht(this,o))||("all"!==Ht(this,o)&&Ht(this,o)!==Ut&&console.warn(`HawkSearch: no tab with id "${Ht(this,o)}" (defaultTab); falling back to "all".`),Dt(this,o,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Ot(this,T,it).call(this)},N=function(){Ot(this,T,K).call(this);const e=document.createElement("div");e.innerHTML=Ot(this,T,R).call(this),Dt(this,m,e.firstElementChild),this.container.appendChild(Ht(this,m)),Dt(this,k,Ht(this,m).querySelector(".hawk-modal-input")),Dt(this,b,Ht(this,m).querySelector(".hawk-input-wrap")),Dt(this,S,Ht(this,m).querySelector(".hawk-input-ghost")),Ht(this,S)&&(Ht(this,S).textContent=this.rotatingPlaceholders[0],Ot(this,T,kt).call(this)),Dt(this,P,Ht(this,m).querySelector(".hawk-results-pane")),Dt(this,x,Ht(this,m).querySelector(".hawk-preview-pane")),Dt(this,L,Ht(this,m).querySelector(".hawk-modal-filters")),Dt(this,M,Ht(this,m).querySelector(".hawk-modal-counter")),Ht(this,t)&&(Ht(this,t).apply(Ht(this,m)),Object.entries(Ht(this,t).tokens||{}).forEach(([t,e])=>{Ht(this,m).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Ht(this,m).dataset.hawkMarkdownStyles="off"),Ot(this,T,j).call(this),Ht(this,c)&&Ot(this,T,O).call(this,Ot(this,T,J).call(this,Ht(this,h))),this.defaultPreviewUrl&&Ot(this,T,tt).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Ht(this,m).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Ht(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Ot(this,T,U).call(this,t.dataset.density)})}),Ht(this,k).addEventListener("input",()=>{Ot(this,T,lt).call(this,Ht(this,k).value),Ot(this,T,kt).call(this)}),Ht(this,k).addEventListener("keydown",t=>Ot(this,T,pt).call(this,t)),Ht(this,k).addEventListener("focus",()=>Ot(this,T,X).call(this),{once:!0}),Ht(this,P).addEventListener("keydown",t=>Ot(this,T,ft).call(this,t)),Ht(this,x).addEventListener("keydown",t=>Ot(this,T,gt).call(this,t)),Ht(this,x).addEventListener("focus",()=>{Ht(this,m).dataset.hawkShowPreview="true"}),Ht(this,x).addEventListener("blur",()=>{Ht(this,m).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Ot(this,T,wt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
K=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=Ot(this,T,B).call(this,i),Ht(this,t)&&(Ht(this,t).apply(s),Object.entries(Ht(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),Dt(this,r,s)},B=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},R=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},j=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Ht(this,m).style.setProperty("--hawk-scale",String(i)),Ht(this,m).style.setProperty("--hawk-offset-x",Ot(this,T,F).call(this,n.x)),Ht(this,m).style.setProperty("--hawk-offset-y",Ot(this,T,F).call(this,n.y)),Ht(this,m).dataset.hawkPosition=s,Ht(this,m).dataset.hawkDensity=r,Ht(this,m).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Ht(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Ht(this,A)&&(null==(e=(t=Ht(this,A)).removeEventListener)||e.call(t,"change",Ht(this,E)),Dt(this,A,null)),"function"==typeof window.matchMedia&&(Dt(this,A,window.matchMedia(`(max-width: ${l}px)`)),Dt(this,E,()=>{Ht(this,m).dataset.hawkCompact=String(Ht(this,A).matches)}),Ht(this,A).addEventListener("change",Ht(this,E)),Ht(this,E).call(this))},F=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
I=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(It):null;return Ft.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
U=function(t){try{null==localStorage||localStorage.setItem(It,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
Q=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},G=function(t){return Ht(this,l).some(e=>e.url===t)},
/**
 * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
 * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
 * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
 * "All" pill only ever being one thing, not a toggle.
 */
J=function(t){return this.enablePins&&Ht(this,l).length?[{id:Ut,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
_=function(t){const e=Ht(this,o)===Ut;if(Ot(this,T,G).call(this,t.url))Dt(this,l,Ht(this,l).filter(e=>e.url!==t.url));else{if(!(Ht(this,l).length<this.maxPins))return;Dt(this,l,[...Ht(this,l),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Ot(this,T,Q).call(this,Ht(this,l)),Ot(this,T,O).call(this,Ot(this,T,J).call(this,(Ht(this,h)||[]).filter(t=>t.id!==Ut))),Ht(this,o)===Ut?Ot(this,T,V).call(this):e?Ot(this,T,lt).call(this,Ht(this,i)):Ot(this,T,rt).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
V=function(){Dt(this,n,Ht(this,l).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Dt(this,a,new Set(Ht(this,n).map(t=>t.url.split("#")[0])).size),Dt(this,s,Ht(this,n).length?0:-1),Ot(this,T,rt).call(this)},X=function(){return Nt(this,null,function*(){return Ht(this,u)?Ht(this,u):Ht(this,v)?(Dt(this,u,Ht(this,v)),yield Ot(this,T,et).call(this),yield Ot(this,T,Y).call(this),Ht(this,u)):(Ht(this,p)||Dt(this,p,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Nt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Dt(this,u,t),yield Ot(this,T,et).call(this),yield Ot(this,T,Y).call(this),t})).catch(t=>(Dt(this,f,t),Ot(this,T,Z).call(this),null))),Ht(this,p))})},Y=function(){return Nt(this,null,function*(){Ht(this,o)!==Ut?this.eagerResults&&!Ht(this,i)&&(yield Ot(this,T,lt).call(this,"")):Ot(this,T,V).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
Z=function(){Ht(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Ht(this,P).removeAttribute("aria-activedescendant"),Ht(this,M).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
tt=function(){const t=this.defaultPreviewUrl;Dt(this,w,t),Ht(this,x).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=Ht(this,x).querySelector(".hawk-preview-title"),s=Ht(this,x).querySelector(".hawk-preview-content");Ht(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),Ot(this,T,ct).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},et=function(){return Nt(this,null,function*(){if(Ht(this,c))return;if(!Ht(this,u))return void Ot(this,T,O).call(this,Ot(this,T,J).call(this,Ot(this,T,q).call(this,[])));let t=[];try{const e=yield Ht(this,u).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Ot(this,T,O).call(this,Ot(this,T,J).call(this,Ot(this,T,q).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},it=function(){const t=Ht(this,h)||[];Ht(this,L).innerHTML=t.map(t=>{const e=t.id===Ht(this,o);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Ht(this,L).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Ot(this,T,st).call(this,t),Ht(this,k).focus()}),t.addEventListener("keydown",t=>Ot(this,T,nt).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
st=function(t){Dt(this,o,t.dataset.filter),Ht(this,L).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Ht(this,o)===Ut?(Dt(this,i,""),Ht(this,k).value="",Ot(this,T,V).call(this)):Ot(this,T,lt).call(this,Ht(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
nt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Ot(this,T,st).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
at=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},lt=function(t){return Nt(this,null,function*(){var e;if(Dt(this,i,t),yield Ot(this,T,X).call(this),!Ht(this,u))return;const l=(Ht(this,h)||[]).find(t=>t.id===Ht(this,o)),{filters:r,remainingQuery:c}=Ot(this,T,at).call(this,t),d=(null==l?void 0:l.filter)||r?Et(Et({},(null==l?void 0:l.filter)||{}),r||{}):null,p=Et(Et(Et({},this.pagefindOptions),(null==l?void 0:l.pagefindOptions)||{}),d?{filters:d}:{}),g=this.inlineFilters?c:t;let w;try{({results:w}=g.trim()?yield Ht(this,u).debouncedSearch(g,p):yield Ht(this,u).search("",p))}catch(t){return Dt(this,f,t),void Ot(this,T,Z).call(this)}const y=[];for(const t of(w||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Dt(this,n,y.slice(0,this.maxResults)),Dt(this,a,new Set(Ht(this,n).map(t=>t.url.split("#")[0])).size),Dt(this,s,Ht(this,n).length?0:-1),Ot(this,T,rt).call(this)})},rt=function(){if(!Ht(this,n).length)return Ht(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Ht(this,i))}</div>`,Ht(this,P).removeAttribute("aria-activedescendant"),Ht(this,M).textContent=Ht(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Ot(this,T,ot).call(this);Ht(this,M).textContent=Ht(this,i)?this.strings.matchingResults(Ht(this,n).length,Ht(this,a)):this.strings.entries(Ht(this,n).length,Ht(this,a)),Ht(this,P).innerHTML=Ht(this,n).map((t,e)=>{var i;const n=this.enablePins&&Ot(this,T,G).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Ht(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Ht(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${n?" is-pinned":""}" role="button" aria-pressed="${n}" data-index="${e}">${n?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Ht(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${Ht(this,s)}`),Ht(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Ot(this,T,ht).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Ot(this,T,_).call(this,Ht(this,n)[s]);null==(i=this.onSelect)||i.call(this,Ht(this,n)[s])})}),Ot(this,T,ot).call(this)},ht=function(t,e){Dt(this,s,t),Ht(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Ht(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Ot(this,T,ot).call(this)},ot=function(){var t;const i=Ht(this,n)[Ht(this,s)];if(!i)return void(Ht(this,x).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const a=i.url;if(a===Ht(this,w))return;Dt(this,w,a),Ht(this,e).stop(Ht(this,g)),Ht(this,x).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Ht(this,x).querySelector(".hawk-preview-title"),r=Ht(this,x).querySelector(".hawk-preview-content");Ht(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),Ot(this,T,ct).call(this,i,a,r)},ct=function(t,i,s){return Nt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Ot(this,T,dt).call(this,e);n=t.isAnchor&&i?Ot(this,T,ut).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Ht(this,w)===i&&Dt(this,g,Ht(this,e).typeContent(s,n))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
dt=function(t){if(Ht(this,y).has(t))return Ht(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Ht(this,y).delete(t),e});return Ht(this,y).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
ut=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
pt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Ht(this,n).length&&Ot(this,T,ht).call(this,(Ht(this,s)+1)%Ht(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Ht(this,n).length&&Ot(this,T,ht).call(this,(Ht(this,s)-1+Ht(this,n).length)%Ht(this,n).length,!0);else if("Enter"===t.key){const t=Ht(this,n)[Ht(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
ft=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Ht(this,k).focus(),Ht(this,k).value+=t.key,void Ht(this,k).dispatchEvent(new Event("input"));Ot(this,T,pt).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
gt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Ht(this,x).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Ht(this,x).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Ht(this,x).scrollTop+=Ht(this,x).clientHeight):"PageUp"===t.key?(t.preventDefault(),Ht(this,x).scrollTop-=Ht(this,x).clientHeight):"Home"===t.key?(t.preventDefault(),Ht(this,x).scrollTop=0):"End"===t.key&&(t.preventDefault(),Ht(this,x).scrollTop=Ht(this,x).scrollHeight)},wt=function(t){Ht(this,d)&&"Tab"===t.key&&Ot(this,T,mt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Ht(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Ht(this,d)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
yt=function(){return!("true"===Ht(this,m).dataset.hawkCompact||"compact"===this.params.density)||"true"===Ht(this,m).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
vt=function(){return[Ht(this,k),...this.params.allowDensityToggle?Array.from(Ht(this,m).querySelectorAll(".hawk-density-btn")):[],Ht(this,m).querySelector(".hawk-modal-esc"),Ht(this,L).querySelector('.hawk-filter-pill[tabindex="0"]'),Ht(this,P),...Ot(this,T,yt).call(this)?[Ht(this,x)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
mt=function(t){const e=Ot(this,T,vt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
kt=function(){if(!Ht(this,S))return;const t=Ht(this,d)&&!Ht(this,k).value;Ht(this,b).dataset.hawkInputActive=String(!t),t&&!Ht(this,$)?Dt(this,$,Ht(this,e).rotatePlaceholder(Ht(this,S),this.rotatingPlaceholders)):!t&&Ht(this,$)&&(Ht(this,e).stop(Ht(this,$)),Dt(this,$,null))},Ct(Jt,"themes",Bt),Ct(Jt,"animations",Rt),"undefined"!=typeof window&&(window.Hawk=Jt);export{Jt as HawkSearch,Jt as default};
//# sourceMappingURL=hawk.esm.js.map
