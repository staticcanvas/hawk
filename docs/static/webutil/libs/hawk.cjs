/*! hawk v0.3.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,d,u,p,f,g,w,y,v,m,k,b,S,$,P,M,x,L,T,A,E,C,W,H,O,q,D,N,K,j,B,R,F,I,U,_,z,Q,G,J,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t,Pt=Object.defineProperty,Mt=Object.defineProperties,xt=Object.getOwnPropertyDescriptors,Lt=Object.getOwnPropertySymbols,Tt=Object.prototype.hasOwnProperty,At=Object.prototype.propertyIsEnumerable,Et=t=>{throw TypeError(t)},Ct=(t,e,i)=>e in t?Pt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Wt=(t,e)=>{for(var i in e||(e={}))Tt.call(e,i)&&Ct(t,i,e[i]);if(Lt)for(var i of Lt(e))At.call(e,i)&&Ct(t,i,e[i]);return t},Ht=(t,e)=>Mt(t,xt(e)),Ot=(t,e,i)=>Ct(t,"symbol"!=typeof e?e+"":e,i),qt=(t,e,i)=>e.has(t)||Et("Cannot "+i),Dt=(t,e,i)=>(qt(t,e,"read from private field"),i?i.call(t):e.get(t)),Nt=(t,e,i)=>e.has(t)?Et("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Kt=(t,e,i,s)=>(qt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),jt=(t,e,i)=>(qt(t,e,"access private method"),i),Bt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const Rt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=Rt);const Ft=new Map,It=new Map;It.set("instant",Rt);const Ut={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},_t=new Set(["fit","medium","compact"]),zt="hawk:density",Qt="pinned",Gt={open:!0,slash:!0,escape:!0},Jt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Vt=0;class Xt{
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
constructor(t={}){var D,N,K;if(Nt(this,W),Nt(this,e),Nt(this,i),Nt(this,s),Nt(this,n),Nt(this,a),Nt(this,l),Nt(this,r),Nt(this,h),Nt(this,o),Nt(this,c),Nt(this,d),Nt(this,u),Nt(this,p),Nt(this,f),Nt(this,g),Nt(this,w),Nt(this,y),Nt(this,v),Nt(this,m),Nt(this,k),Nt(this,b),Nt(this,S),Nt(this,$),Nt(this,P),Nt(this,M),Nt(this,x),Nt(this,L),Nt(this,T),Nt(this,A),Nt(this,E),Nt(this,C),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Vt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,Kt(this,m,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const B=jt(this,W,_).call(this);this.params=Ht(Wt(Wt(Wt({},Ut),B?{density:B}:{}),t.params),{offset:Wt(Wt({},Ut.offset),null==(D=t.params)?void 0:D.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(N=t.maxResults)?N:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(K=t.maxPins)?K:20,this.inlineFilters=t.inlineFilters||!1,this.triggerConfig=t.trigger||null,this.hotkeys=Wt(Wt({},Gt),t.hotkeys),this.strings=Wt(Wt({},Jt),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,Kt(this,e,jt(this,W,H).call(this,t.theme)),Kt(this,i,jt(this,W,O).call(this,t.animation)),Kt(this,s,""),Kt(this,n,-1),Kt(this,a,[]),Kt(this,l,0),Kt(this,r,this.enablePins?jt(this,W,Q).call(this):[]),Kt(this,c,t.defaultTab||"all"),Kt(this,o,jt(this,W,q).call(this,t)),Kt(this,d,null!==Dt(this,o)),Kt(this,u,!1),Kt(this,p,null),Kt(this,f,null),Kt(this,g,null),Kt(this,w,null),Kt(this,y,null),Kt(this,v,new Map),Kt(this,A,new Map),this.container&&jt(this,W,j).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){Ft.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){It.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Dt(this,u),query:Dt(this,s),selectedIndex:Dt(this,n),matches:Dt(this,a),pageCount:Dt(this,l),pins:Dt(this,r),activeTab:Dt(this,c),error:Dt(this,g)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Ht(Wt(Wt({},this.params),t),{offset:Wt(Wt({},this.params.offset),null==t?void 0:t.offset)}),jt(this,W,I).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Dt(this,k).hidden=!1,document.body.style.overflow="hidden",Kt(this,u,!0),jt(this,W,Z).call(this),jt(this,W,$t).call(this),setTimeout(()=>{Dt(this,b).focus(),Dt(this,b).select()},40),null==(t=this.onOpen)||t.call(this,Dt(this,s))}
/** Closes the search modal. */close(){var t;Dt(this,k).hidden=!0,document.body.style.overflow="",Kt(this,u,!1),jt(this,W,$t).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;Dt(this,i).stop(Dt(this,w)),Dt(this,P)&&Dt(this,i).stop(Dt(this,P)),null==(e=null==(t=Dt(this,E))?void 0:t.removeEventListener)||e.call(t,"change",Dt(this,C)),Dt(this,A).forEach(t=>clearTimeout(t)),null==(s=Dt(this,k))||s.remove(),null==(n=Dt(this,h))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,M=new WeakMap,x=new WeakMap,L=new WeakMap,T=new WeakMap,A=new WeakMap,E=new WeakMap,C=new WeakMap,W=new WeakSet,H=function(t){if(!t)return Ft.get("typeflow")||null;if("string"==typeof t){const e=Ft.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},O=function(t){if(!1===t)return It.get("instant");if(!t)return It.get("typeflow")||It.get("instant");if("string"==typeof t){const e=It.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
q=function(t){return t.tabs?jt(this,W,D).call(this,t.tabs):t.categories?jt(this,W,D).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
D=function(t){const e=t.map(t=>({id:t.id||jt(this,W,N).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},N=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
K=function(t){var e,i;Kt(this,o,t),t.some(t=>t.id===Dt(this,c))||("all"!==Dt(this,c)&&Dt(this,c)!==Qt&&console.warn(`HawkSearch: no tab with id "${Dt(this,c)}" (defaultTab); falling back to "all".`),Kt(this,c,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),jt(this,W,nt).call(this)},j=function(){jt(this,W,B).call(this);const t=document.createElement("div");t.innerHTML=jt(this,W,F).call(this),Kt(this,k,t.firstElementChild),this.container.appendChild(Dt(this,k)),Kt(this,b,Dt(this,k).querySelector(".hawk-modal-input")),Kt(this,S,Dt(this,k).querySelector(".hawk-input-wrap")),Kt(this,$,Dt(this,k).querySelector(".hawk-input-ghost")),Dt(this,$)&&(Dt(this,$).textContent=this.rotatingPlaceholders[0],jt(this,W,$t).call(this)),Kt(this,M,Dt(this,k).querySelector(".hawk-results-pane")),Kt(this,x,Dt(this,k).querySelector(".hawk-preview-pane")),Kt(this,L,Dt(this,k).querySelector(".hawk-modal-filters")),Kt(this,T,Dt(this,k).querySelector(".hawk-modal-counter")),[Dt(this,M),Dt(this,x),Dt(this,L)].forEach(t=>jt(this,W,St).call(this,t)),Dt(this,e)&&(Dt(this,e).apply(Dt(this,k)),Object.entries(Dt(this,e).tokens||{}).forEach(([t,e])=>{Dt(this,k).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Dt(this,k).dataset.hawkMarkdownStyles="off"),jt(this,W,I).call(this),Dt(this,d)&&jt(this,W,K).call(this,jt(this,W,V).call(this,Dt(this,o))),this.defaultPreviewUrl&&jt(this,W,it).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Dt(this,k).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Dt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),jt(this,W,z).call(this,t.dataset.density)})}),Dt(this,b).addEventListener("input",()=>{jt(this,W,ht).call(this,Dt(this,b).value),jt(this,W,$t).call(this)}),Dt(this,b).addEventListener("keydown",t=>jt(this,W,gt).call(this,t)),Dt(this,b).addEventListener("focus",()=>jt(this,W,Z).call(this),{once:!0}),Dt(this,M).addEventListener("keydown",t=>jt(this,W,wt).call(this,t)),Dt(this,x).addEventListener("keydown",t=>jt(this,W,yt).call(this,t)),Dt(this,x).addEventListener("focus",()=>{Dt(this,k).dataset.hawkShowPreview="true"}),Dt(this,x).addEventListener("blur",()=>{Dt(this,k).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>jt(this,W,vt).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
B=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=jt(this,W,R).call(this,i),Dt(this,e)&&(Dt(this,e).apply(s),Object.entries(Dt(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),Kt(this,h,s)},R=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},F=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},I=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Dt(this,k).style.setProperty("--hawk-scale",String(i)),Dt(this,k).style.setProperty("--hawk-offset-x",jt(this,W,U).call(this,n.x)),Dt(this,k).style.setProperty("--hawk-offset-y",jt(this,W,U).call(this,n.y)),Dt(this,k).dataset.hawkPosition=s,Dt(this,k).dataset.hawkDensity=r,Dt(this,k).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Dt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Dt(this,E)&&(null==(e=(t=Dt(this,E)).removeEventListener)||e.call(t,"change",Dt(this,C)),Kt(this,E,null)),"function"==typeof window.matchMedia&&(Kt(this,E,window.matchMedia(`(max-width: ${l}px)`)),Kt(this,C,()=>{Dt(this,k).dataset.hawkCompact=String(Dt(this,E).matches)}),Dt(this,E).addEventListener("change",Dt(this,C)),Dt(this,C).call(this))},U=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
_=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(zt):null;return _t.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
z=function(t){try{null==localStorage||localStorage.setItem(zt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
G=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},J=function(t){return Dt(this,r).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
V=function(t){return this.enablePins&&Dt(this,r).length?[{id:Qt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
X=function(t){const e=Dt(this,c)===Qt;if(jt(this,W,J).call(this,t.url))Kt(this,r,Dt(this,r).filter(e=>e.url!==t.url));else{if(!(Dt(this,r).length<this.maxPins))return;Kt(this,r,[...Dt(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}jt(this,W,G).call(this,Dt(this,r)),jt(this,W,K).call(this,jt(this,W,V).call(this,(Dt(this,o)||[]).filter(t=>t.id!==Qt))),Dt(this,c)===Qt?jt(this,W,Y).call(this):e?jt(this,W,ht).call(this,Dt(this,s)):jt(this,W,ot).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
Y=function(){Kt(this,a,Dt(this,r).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Kt(this,l,new Set(Dt(this,a).map(t=>t.url.split("#")[0])).size),Kt(this,n,Dt(this,a).length?0:-1),jt(this,W,ot).call(this)},Z=function(){return Bt(this,null,function*(){return Dt(this,p)?Dt(this,p):Dt(this,m)?(Kt(this,p,Dt(this,m)),yield jt(this,W,st).call(this),yield jt(this,W,tt).call(this),Dt(this,p)):(Dt(this,f)||Kt(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Bt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Kt(this,p,t),yield jt(this,W,st).call(this),yield jt(this,W,tt).call(this),t})).catch(t=>(Kt(this,g,t),jt(this,W,et).call(this),null))),Dt(this,f))})},tt=function(){return Bt(this,null,function*(){Dt(this,c)!==Qt?this.eagerResults&&!Dt(this,s)&&(yield jt(this,W,ht).call(this,"")):jt(this,W,Y).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
et=function(){Dt(this,M).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Dt(this,M).removeAttribute("aria-activedescendant"),Dt(this,T).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
it=function(){const t=this.defaultPreviewUrl;Kt(this,y,t),Dt(this,x).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=Dt(this,x).querySelector(".hawk-preview-title"),s=Dt(this,x).querySelector(".hawk-preview-content");Dt(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),jt(this,W,ut).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},st=function(){return Bt(this,null,function*(){if(Dt(this,d))return;if(!Dt(this,p))return void jt(this,W,K).call(this,jt(this,W,V).call(this,jt(this,W,D).call(this,[])));let t=[];try{const e=yield Dt(this,p).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}jt(this,W,K).call(this,jt(this,W,V).call(this,jt(this,W,D).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},nt=function(){const t=Dt(this,o)||[];Dt(this,L).innerHTML=t.map(t=>{const e=t.id===Dt(this,c);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Dt(this,L).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{jt(this,W,at).call(this,t),Dt(this,b).focus()}),t.addEventListener("keydown",t=>jt(this,W,lt).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
at=function(t){Kt(this,c,t.dataset.filter),Dt(this,L).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Dt(this,c)===Qt?(Kt(this,s,""),Dt(this,b).value="",jt(this,W,Y).call(this)):jt(this,W,ht).call(this,Dt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
lt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),jt(this,W,at).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
rt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},ht=function(t){return Bt(this,null,function*(){var e;if(Kt(this,s,t),yield jt(this,W,Z).call(this),!Dt(this,p))return;const i=(Dt(this,o)||[]).find(t=>t.id===Dt(this,c)),{filters:r,remainingQuery:h}=jt(this,W,rt).call(this,t),d=(null==i?void 0:i.filter)||r?Wt(Wt({},(null==i?void 0:i.filter)||{}),r||{}):null,u=Wt(Wt(Wt({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),d?{filters:d}:{}),f=this.inlineFilters?h:t;let w;try{({results:w}=f.trim()?yield Dt(this,p).debouncedSearch(f,u):yield Dt(this,p).search("",u))}catch(t){return Kt(this,g,t),void jt(this,W,et).call(this)}const y=[];for(const t of(w||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Kt(this,a,y.slice(0,this.maxResults)),Kt(this,l,new Set(Dt(this,a).map(t=>t.url.split("#")[0])).size),Kt(this,n,Dt(this,a).length?0:-1),jt(this,W,ot).call(this)})},ot=function(){if(!Dt(this,a).length)return Dt(this,M).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Dt(this,s))}</div>`,Dt(this,M).removeAttribute("aria-activedescendant"),Dt(this,T).textContent=Dt(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void jt(this,W,dt).call(this);Dt(this,T).textContent=Dt(this,s)?this.strings.matchingResults(Dt(this,a).length,Dt(this,l)):this.strings.entries(Dt(this,a).length,Dt(this,l)),Dt(this,M).innerHTML=Dt(this,a).map((t,e)=>{var i;const s=this.enablePins&&jt(this,W,J).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Dt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Dt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Dt(this,M).setAttribute("aria-activedescendant",`${this.id}-result-${Dt(this,n)}`),Dt(this,M).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>jt(this,W,ct).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void jt(this,W,X).call(this,Dt(this,a)[s]);null==(i=this.onSelect)||i.call(this,Dt(this,a)[s])})}),jt(this,W,dt).call(this)},ct=function(t,e){Kt(this,n,t),Dt(this,M).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Dt(this,M).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),jt(this,W,dt).call(this)},dt=function(){var t;const e=Dt(this,a)[Dt(this,n)];if(!e)return void(Dt(this,x).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===Dt(this,y))return;Kt(this,y,s),Dt(this,i).stop(Dt(this,w)),Dt(this,x).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Dt(this,x).querySelector(".hawk-preview-title"),r=Dt(this,x).querySelector(".hawk-preview-content");Dt(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),jt(this,W,ut).call(this,e,s,r)},ut=function(t,e,s){return Bt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield jt(this,W,pt).call(this,e);n=t.isAnchor&&i?jt(this,W,ft).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Dt(this,y)===e&&Kt(this,w,Dt(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
pt=function(t){if(Dt(this,v).has(t))return Dt(this,v).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Dt(this,v).delete(t),e});return Dt(this,v).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
ft=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
gt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Dt(this,a).length&&jt(this,W,ct).call(this,(Dt(this,n)+1)%Dt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Dt(this,a).length&&jt(this,W,ct).call(this,(Dt(this,n)-1+Dt(this,a).length)%Dt(this,a).length,!0);else if("Enter"===t.key){const t=Dt(this,a)[Dt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
wt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Dt(this,b).focus(),Dt(this,b).value+=t.key,void Dt(this,b).dispatchEvent(new Event("input"));jt(this,W,gt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
yt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Dt(this,x).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Dt(this,x).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Dt(this,x).scrollTop+=Dt(this,x).clientHeight):"PageUp"===t.key?(t.preventDefault(),Dt(this,x).scrollTop-=Dt(this,x).clientHeight):"Home"===t.key?(t.preventDefault(),Dt(this,x).scrollTop=0):"End"===t.key&&(t.preventDefault(),Dt(this,x).scrollTop=Dt(this,x).scrollHeight)},vt=function(t){Dt(this,u)&&"Tab"===t.key&&jt(this,W,bt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Dt(this,u)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Dt(this,u)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
mt=function(){return!("true"===Dt(this,k).dataset.hawkCompact||"compact"===this.params.density)||"true"===Dt(this,k).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
kt=function(){return[Dt(this,b),...this.params.allowDensityToggle?Array.from(Dt(this,k).querySelectorAll(".hawk-density-btn")):[],Dt(this,k).querySelector(".hawk-modal-esc"),Dt(this,L).querySelector('.hawk-filter-pill[tabindex="0"]'),Dt(this,M),...jt(this,W,mt).call(this)?[Dt(this,x)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
bt=function(t){const e=jt(this,W,kt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
St=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(Dt(this,A).get(t)),Dt(this,A).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
$t=function(){if(!Dt(this,$))return;const t=Dt(this,u)&&!Dt(this,b).value;Dt(this,S).dataset.hawkInputActive=String(!t),t&&!Dt(this,P)?Kt(this,P,Dt(this,i).rotatePlaceholder(Dt(this,$),this.rotatingPlaceholders)):!t&&Dt(this,P)&&(Dt(this,i).stop(Dt(this,P)),Kt(this,P,null))},Ot(Xt,"themes",Ft),Ot(Xt,"animations",It),"undefined"!=typeof window&&(window.Hawk=Xt),t.HawkSearch=Xt,t.default=Xt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
