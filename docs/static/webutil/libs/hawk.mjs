/*! hawk v0.3.0 | https://staticcanvas.gitlab.io/hawk | MIT */
var t,e,i,s,n,a,l,r,h,o,c,d,u,p,f,g,w,y,v,m,k,b,S,$,P,M,x,L,A,E,T,C,W,H,q,D,O,N,K,B,R,j,F,I,U,z,Q,G,J,_,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t=Object.defineProperty,Pt=Object.defineProperties,Mt=Object.getOwnPropertyDescriptors,xt=Object.getOwnPropertySymbols,Lt=Object.prototype.hasOwnProperty,At=Object.prototype.propertyIsEnumerable,Et=t=>{throw TypeError(t)},Tt=(t,e,i)=>e in t?$t(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Ct=(t,e)=>{for(var i in e||(e={}))Lt.call(e,i)&&Tt(t,i,e[i]);if(xt)for(var i of xt(e))At.call(e,i)&&Tt(t,i,e[i]);return t},Wt=(t,e)=>Pt(t,Mt(e)),Ht=(t,e,i)=>Tt(t,"symbol"!=typeof e?e+"":e,i),qt=(t,e,i)=>e.has(t)||Et("Cannot "+i),Dt=(t,e,i)=>(qt(t,e,"read from private field"),i?i.call(t):e.get(t)),Ot=(t,e,i)=>e.has(t)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Nt=(t,e,i,s)=>(qt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Kt=(t,e,i)=>(qt(t,e,"access private method"),i),Bt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Rt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Rt);const jt=new Map,Ft=new Map;Ft.set("instant",Rt);const It={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Ut=new Set(["fit","medium","compact"]),zt="hawk:density",Qt="pinned",Gt={open:!0,slash:!0,escape:!0},Jt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let _t=0;class Vt{
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
constructor(D={}){var O,N,B;if(Ot(this,C),Ot(this,t),Ot(this,e),Ot(this,i),Ot(this,s),Ot(this,n),Ot(this,a),Ot(this,l),Ot(this,r),Ot(this,h),Ot(this,o),Ot(this,c),Ot(this,d),Ot(this,u),Ot(this,p),Ot(this,f),Ot(this,g),Ot(this,w),Ot(this,y),Ot(this,v),Ot(this,m),Ot(this,k),Ot(this,b),Ot(this,S),Ot(this,$),Ot(this,P),Ot(this,M),Ot(this,x),Ot(this,L),Ot(this,A),Ot(this,E),Ot(this,T),!D.index&&!D.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=D.id||`hawk-search-${_t+=1}`,this.indexBasePath=D.index?D.index.endsWith("/")?D.index:`${D.index}/`:null,Nt(this,v,D.pagefind||null),this.triggerSelector=D.triggerSelector||"[data-search-trigger]",this.container=D.container||("undefined"!=typeof document?document.body:null);const R=Kt(this,C,U).call(this);this.params=Wt(Ct(Ct(Ct({},It),R?{density:R}:{}),D.params),{offset:Ct(Ct({},It.offset),null==(O=D.params)?void 0:O.offset)}),this.categoryFilterName=D.categoryFilterName||"category",this.includeAllTab=!1!==D.includeAllTab,this.pagefindOptions=D.pagefindOptions||{},this.maxResults=null!=(N=D.maxResults)?N:18,this.contentSelector=D.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=D.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=D.rotatingPlaceholders||[],this.showPoweredBy=!1!==D.showPoweredBy,this.poweredByHref=D.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==D.enablePins,this.pinStorageKey=D.pinStorageKey||"hawk:pins",this.maxPins=null!=(B=D.maxPins)?B:20,this.inlineFilters=D.inlineFilters||!1,this.triggerConfig=D.trigger||null,this.hotkeys=Ct(Ct({},Gt),D.hotkeys),this.strings=Ct(Ct({},Jt),D.strings),this.defaultPreviewUrl=D.defaultPreviewUrl||null,this.defaultPreviewTitle=D.defaultPreviewTitle||"",this.eagerResults=!1!==D.eagerResults,this.onOpen=D.onOpen,this.onClose=D.onClose,this.onSelect=D.onSelect,Nt(this,t,Kt(this,C,W).call(this,D.theme)),Nt(this,e,Kt(this,C,H).call(this,D.animation)),Nt(this,i,""),Nt(this,s,-1),Nt(this,n,[]),Nt(this,a,0),Nt(this,l,this.enablePins?Kt(this,C,Q).call(this):[]),Nt(this,o,D.defaultTab||"all"),Nt(this,h,Kt(this,C,q).call(this,D)),Nt(this,c,null!==Dt(this,h)),Nt(this,d,!1),Nt(this,u,null),Nt(this,p,null),Nt(this,f,null),Nt(this,g,null),Nt(this,w,null),Nt(this,y,new Map),Nt(this,A,new Map),this.container&&Kt(this,C,K).call(this)}
/**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */static registerTheme(t,e){jt.set(t,e)}
/**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */static registerAnimation(t,e){Ft.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Dt(this,d),query:Dt(this,i),selectedIndex:Dt(this,s),matches:Dt(this,n),pageCount:Dt(this,a),pins:Dt(this,l),activeTab:Dt(this,o),error:Dt(this,f)}}
/**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */setParams(t){this.params=Wt(Ct(Ct({},this.params),t),{offset:Ct(Ct({},this.params.offset),null==t?void 0:t.offset)}),Kt(this,C,F).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Dt(this,m).hidden=!1,document.body.style.overflow="hidden",Nt(this,d,!0),Kt(this,C,Y).call(this),Kt(this,C,St).call(this),setTimeout(()=>{Dt(this,k).focus(),Dt(this,k).select()},40),null==(t=this.onOpen)||t.call(this,Dt(this,i))}
/** Closes the search modal. */close(){var t;Dt(this,m).hidden=!0,document.body.style.overflow="",Nt(this,d,!1),Kt(this,C,St).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,i,s,n;Dt(this,e).stop(Dt(this,g)),Dt(this,$)&&Dt(this,e).stop(Dt(this,$)),null==(i=null==(t=Dt(this,E))?void 0:t.removeEventListener)||i.call(t,"change",Dt(this,T)),Dt(this,A).forEach(t=>clearTimeout(t)),null==(s=Dt(this,m))||s.remove(),null==(n=Dt(this,r))||n.remove()}}t=new WeakMap,e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,M=new WeakMap,x=new WeakMap,L=new WeakMap,A=new WeakMap,E=new WeakMap,T=new WeakMap,C=new WeakSet,W=function(t){if(!t)return jt.get("typeflow")||null;if("string"==typeof t){const e=jt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},H=function(t){if(!1===t)return Ft.get("instant");if(!t)return Ft.get("typeflow")||Ft.get("instant");if("string"==typeof t){const e=Ft.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
 * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
 * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
 */
q=function(t){return t.tabs?Kt(this,C,D).call(this,t.tabs):t.categories?Kt(this,C,D).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
 * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
 * per `includeAllTab`.
 * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
 */
D=function(t){const e=t.map(t=>({id:t.id||Kt(this,C,O).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},O=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
 * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
 * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
 * didn't match), and re-renders the filter pills.
 * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
 */
N=function(t){var e,i;Nt(this,h,t),t.some(t=>t.id===Dt(this,o))||("all"!==Dt(this,o)&&Dt(this,o)!==Qt&&console.warn(`HawkSearch: no tab with id "${Dt(this,o)}" (defaultTab); falling back to "all".`),Nt(this,o,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Kt(this,C,st).call(this)},K=function(){Kt(this,C,B).call(this);const e=document.createElement("div");e.innerHTML=Kt(this,C,j).call(this),Nt(this,m,e.firstElementChild),this.container.appendChild(Dt(this,m)),Nt(this,k,Dt(this,m).querySelector(".hawk-modal-input")),Nt(this,b,Dt(this,m).querySelector(".hawk-input-wrap")),Nt(this,S,Dt(this,m).querySelector(".hawk-input-ghost")),Dt(this,S)&&(Dt(this,S).textContent=this.rotatingPlaceholders[0],Kt(this,C,St).call(this)),Nt(this,P,Dt(this,m).querySelector(".hawk-results-pane")),Nt(this,M,Dt(this,m).querySelector(".hawk-preview-pane")),Nt(this,x,Dt(this,m).querySelector(".hawk-modal-filters")),Nt(this,L,Dt(this,m).querySelector(".hawk-modal-counter")),[Dt(this,P),Dt(this,M),Dt(this,x)].forEach(t=>Kt(this,C,bt).call(this,t)),Dt(this,t)&&(Dt(this,t).apply(Dt(this,m)),Object.entries(Dt(this,t).tokens||{}).forEach(([t,e])=>{Dt(this,m).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Dt(this,m).dataset.hawkMarkdownStyles="off"),Kt(this,C,F).call(this),Dt(this,c)&&Kt(this,C,N).call(this,Kt(this,C,_).call(this,Dt(this,h))),this.defaultPreviewUrl&&Kt(this,C,et).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Dt(this,m).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Dt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Kt(this,C,z).call(this,t.dataset.density)})}),Dt(this,k).addEventListener("input",()=>{Kt(this,C,rt).call(this,Dt(this,k).value),Kt(this,C,St).call(this)}),Dt(this,k).addEventListener("keydown",t=>Kt(this,C,ft).call(this,t)),Dt(this,k).addEventListener("focus",()=>Kt(this,C,Y).call(this),{once:!0}),Dt(this,P).addEventListener("keydown",t=>Kt(this,C,gt).call(this,t)),Dt(this,M).addEventListener("keydown",t=>Kt(this,C,wt).call(this,t)),Dt(this,M).addEventListener("focus",()=>{Dt(this,m).dataset.hawkShowPreview="true"}),Dt(this,M).addEventListener("blur",()=>{Dt(this,m).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Kt(this,C,yt).call(this,t))},
/**
 * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
 * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
 * later in #mount() picks it up automatically, no separate listener needed. A no-op when
 * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
 */
B=function(){if(!this.triggerConfig)return;const e="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!e)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=Kt(this,C,R).call(this,i),Dt(this,t)&&(Dt(this,t).apply(s),Object.entries(Dt(this,t).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),e.appendChild(s),Nt(this,r,s)},R=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},j=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},F=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Dt(this,m).style.setProperty("--hawk-scale",String(i)),Dt(this,m).style.setProperty("--hawk-offset-x",Kt(this,C,I).call(this,n.x)),Dt(this,m).style.setProperty("--hawk-offset-y",Kt(this,C,I).call(this,n.y)),Dt(this,m).dataset.hawkPosition=s,Dt(this,m).dataset.hawkDensity=r,Dt(this,m).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Dt(this,m).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Dt(this,E)&&(null==(e=(t=Dt(this,E)).removeEventListener)||e.call(t,"change",Dt(this,T)),Nt(this,E,null)),"function"==typeof window.matchMedia&&(Nt(this,E,window.matchMedia(`(max-width: ${l}px)`)),Nt(this,T,()=>{Dt(this,m).dataset.hawkCompact=String(Dt(this,E).matches)}),Dt(this,E).addEventListener("change",Dt(this,T)),Dt(this,T).call(this))},I=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
U=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(zt):null;return Ut.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
z=function(t){try{null==localStorage||localStorage.setItem(zt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
G=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},J=function(t){return Dt(this,l).some(e=>e.url===t)},
/**
 * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
 * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
 * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
 * "All" pill only ever being one thing, not a toggle.
 */
_=function(t){return this.enablePins&&Dt(this,l).length?[{id:Qt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
 * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
 * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
 * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
 * disappeared out from under an active Pinned view, or just re-renders the current matches
 * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
 */
V=function(t){const e=Dt(this,o)===Qt;if(Kt(this,C,J).call(this,t.url))Nt(this,l,Dt(this,l).filter(e=>e.url!==t.url));else{if(!(Dt(this,l).length<this.maxPins))return;Nt(this,l,[...Dt(this,l),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Kt(this,C,G).call(this,Dt(this,l)),Kt(this,C,N).call(this,Kt(this,C,_).call(this,(Dt(this,h)||[]).filter(t=>t.id!==Qt))),Dt(this,o)===Qt?Kt(this,C,X).call(this):e?Kt(this,C,rt).call(this,Dt(this,i)):Kt(this,C,ht).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
X=function(){Nt(this,n,Dt(this,l).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Nt(this,a,new Set(Dt(this,n).map(t=>t.url.split("#")[0])).size),Nt(this,s,Dt(this,n).length?0:-1),Kt(this,C,ht).call(this)},Y=function(){return Bt(this,null,function*(){return Dt(this,u)?Dt(this,u):Dt(this,v)?(Nt(this,u,Dt(this,v)),yield Kt(this,C,it).call(this),yield Kt(this,C,Z).call(this),Dt(this,u)):(Dt(this,p)||Nt(this,p,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Bt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Nt(this,u,t),yield Kt(this,C,it).call(this),yield Kt(this,C,Z).call(this),t})).catch(t=>(Nt(this,f,t),Kt(this,C,tt).call(this),null))),Dt(this,p))})},Z=function(){return Bt(this,null,function*(){Dt(this,o)!==Qt?this.eagerResults&&!Dt(this,i)&&(yield Kt(this,C,rt).call(this,"")):Kt(this,C,X).call(this)})},
/**
 * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
 * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
 * "Type to search" state or throwing an unhandled rejection out of an event listener.
 */
tt=function(){Dt(this,P).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Dt(this,P).removeAttribute("aria-activedescendant"),Dt(this,L).textContent=this.strings.unavailableCounter},
/**
 * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
 * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
 * it's real rendered page content, not a special-cased fixture. A real selection (or an
 * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
 */
et=function(){const t=this.defaultPreviewUrl;Nt(this,w,t),Dt(this,M).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const i=Dt(this,M).querySelector(".hawk-preview-title"),s=Dt(this,M).querySelector(".hawk-preview-content");Dt(this,e).typeTitle(i,this.defaultPreviewTitle,{isAnchor:!1}),Kt(this,C,dt).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},it=function(){return Bt(this,null,function*(){if(Dt(this,c))return;if(!Dt(this,u))return void Kt(this,C,N).call(this,Kt(this,C,_).call(this,Kt(this,C,D).call(this,[])));let t=[];try{const e=yield Dt(this,u).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Kt(this,C,N).call(this,Kt(this,C,_).call(this,Kt(this,C,D).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},st=function(){const t=Dt(this,h)||[];Dt(this,x).innerHTML=t.map(t=>{const e=t.id===Dt(this,o);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Dt(this,x).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Kt(this,C,nt).call(this,t),Dt(this,k).focus()}),t.addEventListener("keydown",t=>Kt(this,C,at).call(this,t,i,e))})},
/**
 * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
 * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
 * — a page can carry more than one such marker to appear under multiple tabs.
 * @param {HTMLElement} pill
 */
nt=function(t){Nt(this,o,t.dataset.filter),Dt(this,x).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Dt(this,o)===Qt?(Nt(this,i,""),Dt(this,k).value="",Kt(this,C,X).call(this)):Kt(this,C,rt).call(this,Dt(this,i))},
/**
 * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
 * and activate the tab under focus.
 */
at=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Kt(this,C,nt).call(this,i[s]))},
/**
 * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
 * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
 * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
 * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
 * `filters: null`) when `inlineFilters` isn't enabled.
 * @param {string} query
 * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
 */
lt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},rt=function(t){return Bt(this,null,function*(){var e;if(Nt(this,i,t),yield Kt(this,C,Y).call(this),!Dt(this,u))return;const l=(Dt(this,h)||[]).find(t=>t.id===Dt(this,o)),{filters:r,remainingQuery:c}=Kt(this,C,lt).call(this,t),d=(null==l?void 0:l.filter)||r?Ct(Ct({},(null==l?void 0:l.filter)||{}),r||{}):null,p=Ct(Ct(Ct({},this.pagefindOptions),(null==l?void 0:l.pagefindOptions)||{}),d?{filters:d}:{}),g=this.inlineFilters?c:t;let w;try{({results:w}=g.trim()?yield Dt(this,u).debouncedSearch(g,p):yield Dt(this,u).search("",p))}catch(t){return Nt(this,f,t),void Kt(this,C,tt).call(this)}const y=[];for(const t of(w||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Nt(this,n,y.slice(0,this.maxResults)),Nt(this,a,new Set(Dt(this,n).map(t=>t.url.split("#")[0])).size),Nt(this,s,Dt(this,n).length?0:-1),Kt(this,C,ht).call(this)})},ht=function(){if(!Dt(this,n).length)return Dt(this,P).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Dt(this,i))}</div>`,Dt(this,P).removeAttribute("aria-activedescendant"),Dt(this,L).textContent=Dt(this,i)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Kt(this,C,ct).call(this);Dt(this,L).textContent=Dt(this,i)?this.strings.matchingResults(Dt(this,n).length,Dt(this,a)):this.strings.entries(Dt(this,n).length,Dt(this,a)),Dt(this,P).innerHTML=Dt(this,n).map((t,e)=>{var i;const n=this.enablePins&&Kt(this,C,J).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Dt(this,s)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Dt(this,s)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${n?" is-pinned":""}" role="button" aria-pressed="${n}" data-index="${e}">${n?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Dt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${Dt(this,s)}`),Dt(this,P).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Kt(this,C,ot).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Kt(this,C,V).call(this,Dt(this,n)[s]);null==(i=this.onSelect)||i.call(this,Dt(this,n)[s])})}),Kt(this,C,ct).call(this)},ot=function(t,e){Nt(this,s,t),Dt(this,P).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Dt(this,P).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Kt(this,C,ct).call(this)},ct=function(){var t;const i=Dt(this,n)[Dt(this,s)];if(!i)return void(Dt(this,M).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const a=i.url;if(a===Dt(this,w))return;Nt(this,w,a),Dt(this,e).stop(Dt(this,g)),Dt(this,M).innerHTML=`\n      <div class="hawk-preview-header">\n        ${i.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=i.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${i.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Dt(this,M).querySelector(".hawk-preview-title"),r=Dt(this,M).querySelector(".hawk-preview-content");Dt(this,e).typeTitle(l,i.title,{isAnchor:i.isAnchor}),Kt(this,C,dt).call(this,i,a,r)},dt=function(t,i,s){return Bt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Kt(this,C,ut).call(this,e);n=t.isAnchor&&i?Kt(this,C,pt).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Dt(this,w)===i&&Nt(this,g,Dt(this,e).typeContent(s,n))})},
/**
 * Fetches and parses a result page, returning (and caching, by promise, so concurrent
 * requests for the same page dedupe) the element matched by `contentSelector`.
 * @param {string} pagePath URL without the `#anchor` suffix.
 * @returns {Promise<Element>}
 */
ut=function(t){if(Dt(this,y).has(t))return Dt(this,y).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Dt(this,y).delete(t),e});return Dt(this,y).set(t,e),e},
/**
 * Extracts one heading's subsection (the heading itself plus every following sibling up to
 * the next heading of the same or higher level) from a fetched page's content root.
 * @param {Element} root
 * @param {string} slug Anchor id, without the leading `#`.
 * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
 */
pt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
 * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
 * search input and the results pane — both are valid places for the current selection to
 * change from, and neither branch reads `event.target`.
 */
ft=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Dt(this,n).length&&Kt(this,C,ot).call(this,(Dt(this,s)+1)%Dt(this,n).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Dt(this,n).length&&Kt(this,C,ot).call(this,(Dt(this,s)-1+Dt(this,n).length)%Dt(this,n).length,!0);else if("Enter"===t.key){const t=Dt(this,n)[Dt(this,s)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
 * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
 * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
 * away can resume typing without an extra click; everything else falls through to the shared
 * selection/navigation handling.
 */
gt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Dt(this,k).focus(),Dt(this,k).value+=t.key,void Dt(this,k).dispatchEvent(new Event("input"));Kt(this,C,ft).call(this,t)},
/**
 * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
 * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
 * than relying on native focused-scroll-container behavior, which isn't consistent across
 * browsers and doesn't exist in jsdom at all.
 */
wt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Dt(this,M).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Dt(this,M).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Dt(this,M).scrollTop+=Dt(this,M).clientHeight):"PageUp"===t.key?(t.preventDefault(),Dt(this,M).scrollTop-=Dt(this,M).clientHeight):"Home"===t.key?(t.preventDefault(),Dt(this,M).scrollTop=0):"End"===t.key&&(t.preventDefault(),Dt(this,M).scrollTop=Dt(this,M).scrollHeight)},yt=function(t){Dt(this,d)&&"Tab"===t.key&&Kt(this,C,kt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Dt(this,d)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Dt(this,d)&&this.close()},
/**
 * True when the preview pane is actually reachable given the current layout — mirrors the
 * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
 * in single-column layouts unless focus has already revealed it). Checked in JS, not via
 * layout/computed-style, so the focus trap stays correct without depending on real rendering
 * (and is testable under jsdom, which never renders).
 */
vt=function(){return!("true"===Dt(this,m).dataset.hawkCompact||"compact"===this.params.density)||"true"===Dt(this,m).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
mt=function(){return[Dt(this,k),...this.params.allowDensityToggle?Array.from(Dt(this,m).querySelectorAll(".hawk-density-btn")):[],Dt(this,m).querySelector(".hawk-modal-esc"),Dt(this,x).querySelector('.hawk-filter-pill[tabindex="0"]'),Dt(this,P),...Kt(this,C,vt).call(this)?[Dt(this,M)]:[]].filter(Boolean)},
/**
 * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
 * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
 */
kt=function(t){const e=Kt(this,C,mt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
 * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
 * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
 * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
 * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
 * sitting over the pane.
 */
bt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Dt(this,A).get(t)),Dt(this,A).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
 * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
 * Runs only while the modal is open and the input is empty — never in the background while
 * closed, and stops the instant there's real input value (deliberately not gated on focus:
 * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
 * before it's ever seen).
 */
St=function(){if(!Dt(this,S))return;const t=Dt(this,d)&&!Dt(this,k).value;Dt(this,b).dataset.hawkInputActive=String(!t),t&&!Dt(this,$)?Nt(this,$,Dt(this,e).rotatePlaceholder(Dt(this,S),this.rotatingPlaceholders)):!t&&Dt(this,$)&&(Dt(this,e).stop(Dt(this,$)),Nt(this,$,null))},Ht(Vt,"themes",jt),Ht(Vt,"animations",Ft),"undefined"!=typeof window&&(window.Hawk=Vt);export{Vt as HawkSearch,Vt as default};
//# sourceMappingURL=hawk.mjs.map
