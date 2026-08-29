/*! hawk v0.2.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,d,u,p,f,g,w,y,v,m,k,b,S,$,P,x,M,L,A,T,E,C,W,H,O,q,D,N,K,j,B,R,F,I,U,_,z,Q,G,J,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,gt,wt,yt,vt,mt,kt,bt,St=Object.defineProperty,$t=Object.defineProperties,Pt=Object.getOwnPropertyDescriptors,xt=Object.getOwnPropertySymbols,Mt=Object.prototype.hasOwnProperty,Lt=Object.prototype.propertyIsEnumerable,At=t=>{throw TypeError(t)},Tt=(t,e,i)=>e in t?St(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,Et=(t,e)=>{for(var i in e||(e={}))Mt.call(e,i)&&Tt(t,i,e[i]);if(xt)for(var i of xt(e))Lt.call(e,i)&&Tt(t,i,e[i]);return t},Ct=(t,e)=>$t(t,Pt(e)),Wt=(t,e,i)=>Tt(t,"symbol"!=typeof e?e+"":e,i),Ht=(t,e,i)=>e.has(t)||At("Cannot "+i),Ot=(t,e,i)=>(Ht(t,e,"read from private field"),i?i.call(t):e.get(t)),qt=(t,e,i)=>e.has(t)?At("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Dt=(t,e,i,s)=>(Ht(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Nt=(t,e,i)=>(Ht(t,e,"access private method"),i),Kt=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const jt={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=jt);const Bt=new Map,Rt=new Map;Rt.set("instant",jt);const Ft={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},It=new Set(["fit","medium","compact"]),Ut="hawk:density",_t="pinned",zt={open:!0,slash:!0,escape:!0},Qt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Gt=0;class Jt{
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
constructor(t={}){var q,D,N;if(qt(this,C),qt(this,e),qt(this,i),qt(this,s),qt(this,n),qt(this,a),qt(this,l),qt(this,r),qt(this,h),qt(this,o),qt(this,c),qt(this,d),qt(this,u),qt(this,p),qt(this,f),qt(this,g),qt(this,w),qt(this,y),qt(this,v),qt(this,m),qt(this,k),qt(this,b),qt(this,S),qt(this,$),qt(this,P),qt(this,x),qt(this,M),qt(this,L),qt(this,A),qt(this,T),qt(this,E),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Gt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,Dt(this,m,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const j=Nt(this,C,U).call(this);this.params=Ct(Et(Et(Et({},Ft),j?{density:j}:{}),t.params),{offset:Et(Et({},Ft.offset),null==(q=t.params)?void 0:q.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(D=t.maxResults)?D:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(N=t.maxPins)?N:20,this.inlineFilters=t.inlineFilters||!1,this.triggerConfig=t.trigger||null,this.hotkeys=Et(Et({},zt),t.hotkeys),this.strings=Et(Et({},Qt),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,Dt(this,e,Nt(this,C,W).call(this,t.theme)),Dt(this,i,Nt(this,C,H).call(this,t.animation)),Dt(this,s,""),Dt(this,n,-1),Dt(this,a,[]),Dt(this,l,0),Dt(this,r,this.enablePins?Nt(this,C,z).call(this):[]),Dt(this,c,t.defaultTab||"all"),Dt(this,o,Nt(this,C,O).call(this,t)),Dt(this,d,null!==Ot(this,o)),Dt(this,u,!1),Dt(this,p,null),Dt(this,f,null),Dt(this,g,null),Dt(this,w,null),Dt(this,y,null),Dt(this,v,new Map),this.container&&Nt(this,C,K).call(this)}
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
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:Ot(this,u),query:Ot(this,s),selectedIndex:Ot(this,n),matches:Ot(this,a),pageCount:Ot(this,l),pins:Ot(this,r),activeTab:Ot(this,c),error:Ot(this,g)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Ct(Et(Et({},this.params),t),{offset:Et(Et({},this.params.offset),null==t?void 0:t.offset)}),Nt(this,C,F).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;Ot(this,k).hidden=!1,document.body.style.overflow="hidden",Dt(this,u,!0),Nt(this,C,Y).call(this),Nt(this,C,bt).call(this),setTimeout(()=>{Ot(this,b).focus(),Ot(this,b).select()},40),null==(t=this.onOpen)||t.call(this,Ot(this,s))}
/** Closes the search modal. */close(){var t;Ot(this,k).hidden=!0,document.body.style.overflow="",Dt(this,u,!1),Nt(this,C,bt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;Ot(this,i).stop(Ot(this,w)),Ot(this,P)&&Ot(this,i).stop(Ot(this,P)),null==(e=null==(t=Ot(this,T))?void 0:t.removeEventListener)||e.call(t,"change",Ot(this,E)),null==(s=Ot(this,k))||s.remove(),null==(n=Ot(this,h))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,P=new WeakMap,x=new WeakMap,M=new WeakMap,L=new WeakMap,A=new WeakMap,T=new WeakMap,E=new WeakMap,C=new WeakSet,W=function(t){if(!t)return Bt.get("typeflow")||null;if("string"==typeof t){const e=Bt.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},H=function(t){if(!1===t)return Rt.get("instant");if(!t)return Rt.get("typeflow")||Rt.get("instant");if("string"==typeof t){const e=Rt.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
O=function(t){return t.tabs?Nt(this,C,q).call(this,t.tabs):t.categories?Nt(this,C,q).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
q=function(t){const e=t.map(t=>({id:t.id||Nt(this,C,D).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},D=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
N=function(t){var e,i;Dt(this,o,t),t.some(t=>t.id===Ot(this,c))||("all"!==Ot(this,c)&&Ot(this,c)!==_t&&console.warn(`HawkSearch: no tab with id "${Ot(this,c)}" (defaultTab); falling back to "all".`),Dt(this,c,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Nt(this,C,st).call(this)},K=function(){Nt(this,C,j).call(this);const t=document.createElement("div");t.innerHTML=Nt(this,C,R).call(this),Dt(this,k,t.firstElementChild),this.container.appendChild(Ot(this,k)),Dt(this,b,Ot(this,k).querySelector(".hawk-modal-input")),Dt(this,S,Ot(this,k).querySelector(".hawk-input-wrap")),Dt(this,$,Ot(this,k).querySelector(".hawk-input-ghost")),Ot(this,$)&&(Ot(this,$).textContent=this.rotatingPlaceholders[0],Nt(this,C,bt).call(this)),Dt(this,x,Ot(this,k).querySelector(".hawk-results-pane")),Dt(this,M,Ot(this,k).querySelector(".hawk-preview-pane")),Dt(this,L,Ot(this,k).querySelector(".hawk-modal-filters")),Dt(this,A,Ot(this,k).querySelector(".hawk-modal-counter")),Ot(this,e)&&(Ot(this,e).apply(Ot(this,k)),Object.entries(Ot(this,e).tokens||{}).forEach(([t,e])=>{Ot(this,k).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(Ot(this,k).dataset.hawkMarkdownStyles="off"),Nt(this,C,F).call(this),Ot(this,d)&&Nt(this,C,N).call(this,Nt(this,C,J).call(this,Ot(this,o))),this.defaultPreviewUrl&&Nt(this,C,et).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),Ot(this,k).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),Ot(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Nt(this,C,_).call(this,t.dataset.density)})}),Ot(this,b).addEventListener("input",()=>{Nt(this,C,rt).call(this,Ot(this,b).value),Nt(this,C,bt).call(this)}),Ot(this,b).addEventListener("keydown",t=>Nt(this,C,ft).call(this,t)),Ot(this,b).addEventListener("focus",()=>Nt(this,C,Y).call(this),{once:!0}),Ot(this,x).addEventListener("keydown",t=>Nt(this,C,gt).call(this,t)),Ot(this,M).addEventListener("keydown",t=>Nt(this,C,wt).call(this,t)),Ot(this,M).addEventListener("focus",()=>{Ot(this,k).dataset.hawkShowPreview="true"}),Ot(this,M).addEventListener("blur",()=>{Ot(this,k).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Nt(this,C,yt).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
j=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=Nt(this,C,B).call(this,i),Ot(this,e)&&(Ot(this,e).apply(s),Object.entries(Ot(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),Dt(this,h,s)},B=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},R=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},F=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;Ot(this,k).style.setProperty("--hawk-scale",String(i)),Ot(this,k).style.setProperty("--hawk-offset-x",Nt(this,C,I).call(this,n.x)),Ot(this,k).style.setProperty("--hawk-offset-y",Nt(this,C,I).call(this,n.y)),Ot(this,k).dataset.hawkPosition=s,Ot(this,k).dataset.hawkDensity=r,Ot(this,k).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),Ot(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),Ot(this,T)&&(null==(e=(t=Ot(this,T)).removeEventListener)||e.call(t,"change",Ot(this,E)),Dt(this,T,null)),"function"==typeof window.matchMedia&&(Dt(this,T,window.matchMedia(`(max-width: ${l}px)`)),Dt(this,E,()=>{Ot(this,k).dataset.hawkCompact=String(Ot(this,T).matches)}),Ot(this,T).addEventListener("change",Ot(this,E)),Ot(this,E).call(this))},I=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
U=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Ut):null;return It.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
_=function(t){try{null==localStorage||localStorage.setItem(Ut,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
z=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
Q=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},G=function(t){return Ot(this,r).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
J=function(t){return this.enablePins&&Ot(this,r).length?[{id:_t,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
V=function(t){const e=Ot(this,c)===_t;if(Nt(this,C,G).call(this,t.url))Dt(this,r,Ot(this,r).filter(e=>e.url!==t.url));else{if(!(Ot(this,r).length<this.maxPins))return;Dt(this,r,[...Ot(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Nt(this,C,Q).call(this,Ot(this,r)),Nt(this,C,N).call(this,Nt(this,C,J).call(this,(Ot(this,o)||[]).filter(t=>t.id!==_t))),Ot(this,c)===_t?Nt(this,C,X).call(this):e?Nt(this,C,rt).call(this,Ot(this,s)):Nt(this,C,ht).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
X=function(){Dt(this,a,Ot(this,r).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Dt(this,l,new Set(Ot(this,a).map(t=>t.url.split("#")[0])).size),Dt(this,n,Ot(this,a).length?0:-1),Nt(this,C,ht).call(this)},Y=function(){return Kt(this,null,function*(){return Ot(this,p)?Ot(this,p):Ot(this,m)?(Dt(this,p,Ot(this,m)),yield Nt(this,C,it).call(this),yield Nt(this,C,Z).call(this),Ot(this,p)):(Ot(this,f)||Dt(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Kt(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Dt(this,p,t),yield Nt(this,C,it).call(this),yield Nt(this,C,Z).call(this),t})).catch(t=>(Dt(this,g,t),Nt(this,C,tt).call(this),null))),Ot(this,f))})},Z=function(){return Kt(this,null,function*(){Ot(this,c)!==_t?this.eagerResults&&!Ot(this,s)&&(yield Nt(this,C,rt).call(this,"")):Nt(this,C,X).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
tt=function(){Ot(this,x).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,Ot(this,x).removeAttribute("aria-activedescendant"),Ot(this,A).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
et=function(){const t=this.defaultPreviewUrl;Dt(this,y,t),Ot(this,M).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=Ot(this,M).querySelector(".hawk-preview-title"),s=Ot(this,M).querySelector(".hawk-preview-content");Ot(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),Nt(this,C,dt).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},it=function(){return Kt(this,null,function*(){if(Ot(this,d))return;if(!Ot(this,p))return void Nt(this,C,N).call(this,Nt(this,C,J).call(this,Nt(this,C,q).call(this,[])));let t=[];try{const e=yield Ot(this,p).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Nt(this,C,N).call(this,Nt(this,C,J).call(this,Nt(this,C,q).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},st=function(){const t=Ot(this,o)||[];Ot(this,L).innerHTML=t.map(t=>{const e=t.id===Ot(this,c);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(Ot(this,L).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Nt(this,C,nt).call(this,t),Ot(this,b).focus()}),t.addEventListener("keydown",t=>Nt(this,C,at).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
nt=function(t){Dt(this,c,t.dataset.filter),Ot(this,L).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),Ot(this,c)===_t?(Dt(this,s,""),Ot(this,b).value="",Nt(this,C,X).call(this)):Nt(this,C,rt).call(this,Ot(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
at=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Nt(this,C,nt).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
lt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},rt=function(t){return Kt(this,null,function*(){var e;if(Dt(this,s,t),yield Nt(this,C,Y).call(this),!Ot(this,p))return;const i=(Ot(this,o)||[]).find(t=>t.id===Ot(this,c)),{filters:r,remainingQuery:h}=Nt(this,C,lt).call(this,t),d=(null==i?void 0:i.filter)||r?Et(Et({},(null==i?void 0:i.filter)||{}),r||{}):null,u=Et(Et(Et({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),d?{filters:d}:{}),f=this.inlineFilters?h:t;let w;try{({results:w}=f.trim()?yield Ot(this,p).debouncedSearch(f,u):yield Ot(this,p).search("",u))}catch(t){return Dt(this,g,t),void Nt(this,C,tt).call(this)}const y=[];for(const t of(w||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Dt(this,a,y.slice(0,this.maxResults)),Dt(this,l,new Set(Ot(this,a).map(t=>t.url.split("#")[0])).size),Dt(this,n,Ot(this,a).length?0:-1),Nt(this,C,ht).call(this)})},ht=function(){if(!Ot(this,a).length)return Ot(this,x).innerHTML=`<div class="hawk-empty">${this.strings.noResults(Ot(this,s))}</div>`,Ot(this,x).removeAttribute("aria-activedescendant"),Ot(this,A).textContent=Ot(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Nt(this,C,ct).call(this);Ot(this,A).textContent=Ot(this,s)?this.strings.matchingResults(Ot(this,a).length,Ot(this,l)):this.strings.entries(Ot(this,a).length,Ot(this,l)),Ot(this,x).innerHTML=Ot(this,a).map((t,e)=>{var i;const s=this.enablePins&&Nt(this,C,G).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===Ot(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===Ot(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),Ot(this,x).setAttribute("aria-activedescendant",`${this.id}-result-${Ot(this,n)}`),Ot(this,x).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Nt(this,C,ot).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Nt(this,C,V).call(this,Ot(this,a)[s]);null==(i=this.onSelect)||i.call(this,Ot(this,a)[s])})}),Nt(this,C,ct).call(this)},ot=function(t,e){Dt(this,n,t),Ot(this,x).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),Ot(this,x).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Nt(this,C,ct).call(this)},ct=function(){var t;const e=Ot(this,a)[Ot(this,n)];if(!e)return void(Ot(this,M).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===Ot(this,y))return;Dt(this,y,s),Ot(this,i).stop(Ot(this,w)),Ot(this,M).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=Ot(this,M).querySelector(".hawk-preview-title"),r=Ot(this,M).querySelector(".hawk-preview-content");Ot(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),Nt(this,C,dt).call(this,e,s,r)},dt=function(t,e,s){return Kt(this,null,function*(){let n=t.excerpt||"";if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Nt(this,C,ut).call(this,e);n=t.isAnchor&&i?Nt(this,C,pt).call(this,s,i):s.innerHTML}catch(e){n=t.excerpt||""}Ot(this,y)===e&&Dt(this,w,Ot(this,i).typeContent(s,n))})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
ut=function(t){if(Ot(this,v).has(t))return Ot(this,v).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw Ot(this,v).delete(t),e});return Ot(this,v).set(t,e),e},
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
ft=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),Ot(this,a).length&&Nt(this,C,ot).call(this,(Ot(this,n)+1)%Ot(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),Ot(this,a).length&&Nt(this,C,ot).call(this,(Ot(this,n)-1+Ot(this,a).length)%Ot(this,a).length,!0);else if("Enter"===t.key){const t=Ot(this,a)[Ot(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
gt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),Ot(this,b).focus(),Ot(this,b).value+=t.key,void Ot(this,b).dispatchEvent(new Event("input"));Nt(this,C,ft).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
wt=function(t){"ArrowDown"===t.key?(t.preventDefault(),Ot(this,M).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),Ot(this,M).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),Ot(this,M).scrollTop+=Ot(this,M).clientHeight):"PageUp"===t.key?(t.preventDefault(),Ot(this,M).scrollTop-=Ot(this,M).clientHeight):"Home"===t.key?(t.preventDefault(),Ot(this,M).scrollTop=0):"End"===t.key&&(t.preventDefault(),Ot(this,M).scrollTop=Ot(this,M).scrollHeight)},yt=function(t){Ot(this,u)&&"Tab"===t.key&&Nt(this,C,kt).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),Ot(this,u)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&Ot(this,u)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
vt=function(){return!("true"===Ot(this,k).dataset.hawkCompact||"compact"===this.params.density)||"true"===Ot(this,k).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
mt=function(){return[Ot(this,b),...this.params.allowDensityToggle?Array.from(Ot(this,k).querySelectorAll(".hawk-density-btn")):[],Ot(this,k).querySelector(".hawk-modal-esc"),Ot(this,L).querySelector('.hawk-filter-pill[tabindex="0"]'),Ot(this,x),...Nt(this,C,vt).call(this)?[Ot(this,M)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
kt=function(t){const e=Nt(this,C,mt).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
bt=function(){if(!Ot(this,$))return;const t=Ot(this,u)&&!Ot(this,b).value;Ot(this,S).dataset.hawkInputActive=String(!t),t&&!Ot(this,P)?Dt(this,P,Ot(this,i).rotatePlaceholder(Ot(this,$),this.rotatingPlaceholders)):!t&&Ot(this,P)&&(Ot(this,i).stop(Ot(this,P)),Dt(this,P,null))},Wt(Jt,"themes",Bt),Wt(Jt,"animations",Rt),"undefined"!=typeof window&&(window.Hawk=Jt),t.HawkSearch=Jt,t.default=Jt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
