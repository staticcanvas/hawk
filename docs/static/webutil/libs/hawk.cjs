/*! hawk v0.3.0 | https://staticcanvas.gitlab.io/hawk | MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).Hawk={})}(this,function(t){"use strict";var e,i,s,n,a,l,r,h,o,c,d,u,p,f,g,w,y,v,m,k,b,S,$,x,L,E,M,P,A,T,C,H,W,q,O,D,N,j,K,B,R,F,I,U,_,z,Q,G,J,V,X,Y,Z,tt,et,it,st,nt,at,lt,rt,ht,ot,ct,dt,ut,pt,ft,gt,wt,yt,vt,mt,kt,bt,St,$t,xt,Lt,Et=Object.defineProperty,Mt=Object.defineProperties,Pt=Object.getOwnPropertyDescriptors,At=Object.getOwnPropertySymbols,Tt=Object.prototype.hasOwnProperty,Ct=Object.prototype.propertyIsEnumerable,Ht=t=>{throw TypeError(t)},Wt=(t,e,i)=>e in t?Et(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,qt=(t,e)=>{for(var i in e||(e={}))Tt.call(e,i)&&Wt(t,i,e[i]);if(At)for(var i of At(e))Ct.call(e,i)&&Wt(t,i,e[i]);return t},Ot=(t,e)=>Mt(t,Pt(e)),Dt=(t,e,i)=>Wt(t,"symbol"!=typeof e?e+"":e,i),Nt=(t,e,i)=>e.has(t)||Ht("Cannot "+i),jt=(t,e,i)=>(Nt(t,e,"read from private field"),i?i.call(t):e.get(t)),Kt=(t,e,i)=>e.has(t)?Ht("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Bt=(t,e,i,s)=>(Nt(t,e,"write to private field"),s?s.call(t,i):e.set(t,i),i),Rt=(t,e,i)=>(Nt(t,e,"access private method"),i),Ft=(t,e,i)=>new Promise((s,n)=>{var a=t=>{try{r(i.next(t))}catch(t){n(t)}},l=t=>{try{r(i.throw(t))}catch(t){n(t)}},r=t=>t.done?s(t.value):Promise.resolve(t.value).then(a,l);r((i=i.apply(t,e)).next())});const It={typeTitle:(t,e)=>(t.textContent=e,null),typeContent:(t,e)=>(t.innerHTML=e,null),rotatePlaceholder(t,e){var i;return t.textContent=null!=(i=null==e?void 0:e[0])?i:"",null},stop(){}};"undefined"!=typeof window&&(window.HawkAnimationInstant=It);const Ut=new Map,_t=new Map;_t.set("instant",It);const zt={scale:1,position:"top-center",
// 'top-center' | 'center' | 'top-left' | 'top-right'
offset:{x:"1rem",y:"6vh"},alignment:"stretch",
// 'stretch' | 'start' | 'center'
columns:2,
// 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
breakpoint:768,
// px
density:"medium",
// 'fit' | 'medium' | 'compact'
allowDensityToggle:!0},Qt=new Set(["fit","medium","compact"]),Gt="hawk:density",Jt="pinned",Vt={open:!0,slash:!0,escape:!0},Xt={dialogLabel:"Search",inputPlaceholder:"Search...",densityGroupLabel:"Result density",densityFit:"Fit",densityMedium:"Medium",densityCompact:"Compact",escKey:"ESC",filtersLabel:"Filter by category",previewLabel:"Preview",hintNavigate:"Navigate",hintSelect:"Select",hintClose:"Close",previewEmpty:"Type to search, or select a result to preview it here.",previewLoading:"Loading…",sectionBadge:"Section",untitled:"Untitled",typeToSearch:"Type to search",noResults:t=>`No results${t?` for "${t}"`:""}.`,matchingResults:(t,e)=>{const i=`${t} matching result${1===t?"":"s"}`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},entries:(t,e)=>{const i=`${t} entries`;return e&&e!==t?`${i} across ${e} page${1===e?"":"s"}`:i},unavailable:"Search is unavailable right now. Try again later.",unavailableCounter:"Search unavailable",poweredBy:"Search powered by Pagefind",pinnedTab:"Pinned",pinAction:"Pin",unpinAction:"Unpin",triggerLabel:"Search",triggerLabelLong:"Search...",triggerKbd:"Ctrl+K"};let Yt=0;class Zt{
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
     * @param {boolean} [config.previewSections=false] For a page-level match (not an anchor/sub_result — those
     *   already show their one matched section in full), breaks the preview into clickable rows — one per
     *   heading matching `previewSectionSelector`, each with the heading text and a short plain-text excerpt
     *   of the content up to the next heading — instead of dumping the whole page. Falls back to the full
     *   content view if the page has no matching headings. Reuses the same fetched/cached page content the
     *   full view uses — no extra network request.
     * @param {string} [config.previewSectionSelector='h2, h3'] Which headings count as a "section" for
     *   `previewSections`.
     * @param {number} [config.previewSectionExcerptLength=140] Max characters of a `previewSections` row's
     *   excerpt before truncating with an ellipsis.
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
constructor(t={}){var D,N,j,B;if(Kt(this,H),Kt(this,e),Kt(this,i),Kt(this,s),Kt(this,n),Kt(this,a),Kt(this,l),Kt(this,r),Kt(this,h),Kt(this,o),Kt(this,c),Kt(this,d),Kt(this,u),Kt(this,p),Kt(this,f),Kt(this,g),Kt(this,w),Kt(this,y),Kt(this,v),Kt(this,m),Kt(this,k),Kt(this,b),Kt(this,S),Kt(this,$),Kt(this,x),Kt(this,L),Kt(this,E),Kt(this,M),Kt(this,P),Kt(this,A),Kt(this,T),Kt(this,C),!t.index&&!t.pagefind)throw new Error("HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.");this.id=t.id||`hawk-search-${Yt+=1}`,this.indexBasePath=t.index?t.index.endsWith("/")?t.index:`${t.index}/`:null,Bt(this,m,t.pagefind||null),this.triggerSelector=t.triggerSelector||"[data-search-trigger]",this.container=t.container||("undefined"!=typeof document?document.body:null);const R=Rt(this,H,_).call(this);this.params=Ot(qt(qt(qt({},zt),R?{density:R}:{}),t.params),{offset:qt(qt({},zt.offset),null==(D=t.params)?void 0:D.offset)}),this.categoryFilterName=t.categoryFilterName||"category",this.includeAllTab=!1!==t.includeAllTab,this.pagefindOptions=t.pagefindOptions||{},this.maxResults=null!=(N=t.maxResults)?N:18,this.contentSelector=t.contentSelector||"[data-pagefind-body]",this.disableDefaultMarkdownStyles=t.disableDefaultMarkdownStyles||!1,this.rotatingPlaceholders=t.rotatingPlaceholders||[],this.showPoweredBy=!1!==t.showPoweredBy,this.poweredByHref=t.poweredByHref||"https://pagefind.app/",this.enablePins=!1!==t.enablePins,this.pinStorageKey=t.pinStorageKey||"hawk:pins",this.maxPins=null!=(j=t.maxPins)?j:20,this.inlineFilters=t.inlineFilters||!1,this.previewSections=t.previewSections||!1,this.previewSectionSelector=t.previewSectionSelector||"h2, h3",this.previewSectionExcerptLength=null!=(B=t.previewSectionExcerptLength)?B:140,this.triggerConfig=t.trigger||null,this.hotkeys=qt(qt({},Vt),t.hotkeys),this.strings=qt(qt({},Xt),t.strings),this.defaultPreviewUrl=t.defaultPreviewUrl||null,this.defaultPreviewTitle=t.defaultPreviewTitle||"",this.eagerResults=!1!==t.eagerResults,this.onOpen=t.onOpen,this.onClose=t.onClose,this.onSelect=t.onSelect,Bt(this,e,Rt(this,H,W).call(this,t.theme)),Bt(this,i,Rt(this,H,q).call(this,t.animation)),Bt(this,s,""),Bt(this,n,-1),Bt(this,a,[]),Bt(this,l,0),Bt(this,r,this.enablePins?Rt(this,H,Q).call(this):[]),Bt(this,c,t.defaultTab||"all"),Bt(this,o,Rt(this,H,O).call(this,t)),Bt(this,d,null!==jt(this,o)),Bt(this,u,!1),Bt(this,p,null),Bt(this,f,null),Bt(this,g,null),Bt(this,w,null),Bt(this,y,null),Bt(this,v,new Map),Bt(this,A,new Map),this.container&&Rt(this,H,K).call(this)}
/**
     * Registers a theme plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
     */static registerTheme(t,e){Ut.set(t,e)}
/**
     * Registers an animation driver plugin so it can be selected by name.
     * @param {string} name
     * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
     */static registerAnimation(t,e){_t.set(t,e)}
/** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */get state(){return{open:jt(this,u),query:jt(this,s),selectedIndex:jt(this,n),matches:jt(this,a),pageCount:jt(this,l),pins:jt(this,r),activeTab:jt(this,c),error:jt(this,g)}}
/**
     * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
     * @param {Partial<typeof DEFAULT_PARAMS>} params
     */setParams(t){this.params=Ot(qt(qt({},this.params),t),{offset:qt(qt({},this.params.offset),null==t?void 0:t.offset)}),Rt(this,H,I).call(this)}
/** Opens the search modal and focuses the input. */open(){var t;jt(this,k).hidden=!1,document.body.style.overflow="hidden",Bt(this,u,!0),Rt(this,H,Z).call(this),Rt(this,H,Lt).call(this),setTimeout(()=>{jt(this,b).focus(),jt(this,b).select()},40),null==(t=this.onOpen)||t.call(this,jt(this,s))}
/** Closes the search modal. */close(){var t;jt(this,k).hidden=!0,document.body.style.overflow="",Bt(this,u,!1),Rt(this,H,Lt).call(this),null==(t=this.onClose)||t.call(this)}
/** Removes the modal from the DOM and detaches listeners. */destroy(){var t,e,s,n;jt(this,i).stop(jt(this,w)),jt(this,x)&&jt(this,i).stop(jt(this,x)),null==(e=null==(t=jt(this,T))?void 0:t.removeEventListener)||e.call(t,"change",jt(this,C)),jt(this,A).forEach(t=>clearTimeout(t)),null==(s=jt(this,k))||s.remove(),null==(n=jt(this,h))||n.remove()}}e=new WeakMap,i=new WeakMap,s=new WeakMap,n=new WeakMap,a=new WeakMap,l=new WeakMap,r=new WeakMap,h=new WeakMap,o=new WeakMap,c=new WeakMap,d=new WeakMap,u=new WeakMap,p=new WeakMap,f=new WeakMap,g=new WeakMap,w=new WeakMap,y=new WeakMap,v=new WeakMap,m=new WeakMap,k=new WeakMap,b=new WeakMap,S=new WeakMap,$=new WeakMap,x=new WeakMap,L=new WeakMap,E=new WeakMap,M=new WeakMap,P=new WeakMap,A=new WeakMap,T=new WeakMap,C=new WeakMap,H=new WeakSet,W=function(t){if(!t)return Ut.get("typeflow")||null;if("string"==typeof t){const e=Ut.get(t);if(!e)throw new Error(`HawkSearch: no theme registered as "${t}". Call HawkSearch.registerTheme first.`);return e}return t},q=function(t){if(!1===t)return _t.get("instant");if(!t)return _t.get("typeflow")||_t.get("instant");if("string"==typeof t){const e=_t.get(t);if(!e)throw new Error(`HawkSearch: no animation driver registered as "${t}". Call HawkSearch.registerAnimation first.`);return e}return t},
/**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
O=function(t){return t.tabs?Rt(this,H,D).call(this,t.tabs):t.categories?Rt(this,H,D).call(this,t.categories.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}}))):null},
/**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
D=function(t){const e=t.map(t=>({id:t.id||Rt(this,H,N).call(this,t.label),label:t.label,filter:t.filter||null,pagefindOptions:t.pagefindOptions||null}));return this.includeAllTab?[{id:"all",label:"All",filter:null,pagefindOptions:null},...e]:e},N=function(t){return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"tab"},
/**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
j=function(t){var e,i;Bt(this,o,t),t.some(t=>t.id===jt(this,c))||("all"!==jt(this,c)&&jt(this,c)!==Jt&&console.warn(`HawkSearch: no tab with id "${jt(this,c)}" (defaultTab); falling back to "all".`),Bt(this,c,t.some(t=>"all"===t.id)?"all":null!=(i=null==(e=t[0])?void 0:e.id)?i:"all")),Rt(this,H,nt).call(this)},K=function(){Rt(this,H,B).call(this);const t=document.createElement("div");t.innerHTML=Rt(this,H,F).call(this),Bt(this,k,t.firstElementChild),this.container.appendChild(jt(this,k)),Bt(this,b,jt(this,k).querySelector(".hawk-modal-input")),Bt(this,S,jt(this,k).querySelector(".hawk-input-wrap")),Bt(this,$,jt(this,k).querySelector(".hawk-input-ghost")),jt(this,$)&&(jt(this,$).textContent=this.rotatingPlaceholders[0],Rt(this,H,Lt).call(this)),Bt(this,L,jt(this,k).querySelector(".hawk-results-pane")),Bt(this,E,jt(this,k).querySelector(".hawk-preview-pane")),Bt(this,M,jt(this,k).querySelector(".hawk-modal-filters")),Bt(this,P,jt(this,k).querySelector(".hawk-modal-counter")),[jt(this,L),jt(this,E),jt(this,M)].forEach(t=>Rt(this,H,xt).call(this,t)),jt(this,e)&&(jt(this,e).apply(jt(this,k)),Object.entries(jt(this,e).tokens||{}).forEach(([t,e])=>{jt(this,k).style.setProperty(t,e)})),this.disableDefaultMarkdownStyles&&(jt(this,k).dataset.hawkMarkdownStyles="off"),Rt(this,H,I).call(this),jt(this,d)&&Rt(this,H,j).call(this,Rt(this,H,V).call(this,jt(this,o))),this.defaultPreviewUrl&&Rt(this,H,it).call(this),document.querySelectorAll(this.triggerSelector).forEach(t=>{t.addEventListener("click",()=>this.open())}),jt(this,k).querySelectorAll("[data-search-close]").forEach(t=>{t.addEventListener("click",()=>this.close())}),jt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{t.addEventListener("click",()=>{this.setParams({density:t.dataset.density}),Rt(this,H,z).call(this,t.dataset.density)})}),jt(this,b).addEventListener("input",()=>{Rt(this,H,ht).call(this,jt(this,b).value),Rt(this,H,Lt).call(this)}),jt(this,b).addEventListener("keydown",t=>Rt(this,H,yt).call(this,t)),jt(this,b).addEventListener("focus",()=>Rt(this,H,Z).call(this),{once:!0}),jt(this,L).addEventListener("keydown",t=>Rt(this,H,vt).call(this,t)),jt(this,E).addEventListener("keydown",t=>Rt(this,H,mt).call(this,t)),jt(this,E).addEventListener("focus",()=>{jt(this,k).dataset.hawkShowPreview="true"}),jt(this,E).addEventListener("blur",()=>{jt(this,k).dataset.hawkShowPreview="false"}),document.addEventListener("keydown",t=>Rt(this,H,kt).call(this,t))},
/**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
B=function(){if(!this.triggerConfig)return;const t="string"==typeof this.triggerConfig.container?document.querySelector(this.triggerConfig.container):this.triggerConfig.container;if(!t)return void console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);const i=this.triggerConfig.kind||"default",s=document.createElement("button");s.type="button",s.className=`hawk-trigger hawk-trigger-${i}`,s.setAttribute("data-search-trigger",""),"minimal"===i&&s.setAttribute("aria-label",this.strings.dialogLabel),s.innerHTML=Rt(this,H,R).call(this,i),jt(this,e)&&(jt(this,e).apply(s),Object.entries(jt(this,e).tokens||{}).forEach(([t,e])=>{s.style.setProperty(t,e)})),t.appendChild(s),Bt(this,h,s)},R=function(t){const e=this.strings,i='<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';if("minimal"===t)return i;if("compact"===t)return`${i}<span class="hawk-trigger-label">${e.triggerLabel}</span>`;const s=this.hotkeys.open?`<kbd class="hawk-trigger-kbd">${e.triggerKbd}</kbd>`:"";return`${i}<span class="hawk-trigger-label">${e.triggerLabelLong}</span>${s}`},F=function(){const t=this.strings;return`\n      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${t.dialogLabel}" hidden>\n        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>\n        <div class="hawk-modal-dialog">\n          <div class="hawk-modal-header">\n            <div class="hawk-input-wrap">\n              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length?"":t.inputPlaceholder}" autocomplete="off" spellcheck="false"\n                aria-autocomplete="list" aria-controls="${this.id}-results" />\n              ${this.rotatingPlaceholders.length?'<span class="hawk-input-ghost" aria-hidden="true"></span>':""}\n            </div>\n            ${this.params.allowDensityToggle?`<div class="hawk-density-toggle" role="group" aria-label="${t.densityGroupLabel}">\n              <button type="button" class="hawk-density-btn" data-density="fit">${t.densityFit}</button>\n              <button type="button" class="hawk-density-btn" data-density="medium">${t.densityMedium}</button>\n              <button type="button" class="hawk-density-btn" data-density="compact">${t.densityCompact}</button>\n            </div>`:""}\n            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${t.escKey}</kbd></button>\n          </div>\n          <div class="hawk-modal-filters" role="tablist" aria-label="${t.filtersLabel}"></div>\n          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">\n            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>\n            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${t.previewLabel}" tabindex="0">\n              <div class="hawk-preview-empty">${t.previewEmpty}</div>\n            </aside>\n          </div>\n          <div class="hawk-modal-footer">\n            <span class="hawk-hint">&uarr;&darr; ${t.hintNavigate}</span>\n            <span class="hawk-hint">&crarr; ${t.hintSelect}</span>\n            <span class="hawk-hint">${t.escKey} ${t.hintClose}</span>\n            <div class="hawk-modal-counter">${t.typeToSearch}</div>\n            ${this.showPoweredBy?`<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${t.poweredBy}</a>`:""}\n          </div>\n        </div>\n      </div>\n    `.trim()},I=function(){var t,e;const{scale:i,position:s,offset:n,columns:a,breakpoint:l,density:r}=this.params;jt(this,k).style.setProperty("--hawk-scale",String(i)),jt(this,k).style.setProperty("--hawk-offset-x",Rt(this,H,U).call(this,n.x)),jt(this,k).style.setProperty("--hawk-offset-y",Rt(this,H,U).call(this,n.y)),jt(this,k).dataset.hawkPosition=s,jt(this,k).dataset.hawkDensity=r,jt(this,k).querySelector(".hawk-modal-body").dataset.hawkColumns=String(a),jt(this,k).querySelectorAll(".hawk-density-btn").forEach(t=>{const e=t.dataset.density===r;t.classList.toggle("active",e),t.setAttribute("aria-pressed",String(e))}),jt(this,T)&&(null==(e=(t=jt(this,T)).removeEventListener)||e.call(t,"change",jt(this,C)),Bt(this,T,null)),"function"==typeof window.matchMedia&&(Bt(this,T,window.matchMedia(`(max-width: ${l}px)`)),Bt(this,C,()=>{jt(this,k).dataset.hawkCompact=String(jt(this,T).matches)}),jt(this,T).addEventListener("change",jt(this,C)),jt(this,C).call(this))},U=function(t){return"number"==typeof t?`${t}px`:String(t)},
/** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
_=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(Gt):null;return Qt.has(t)?t:null}catch(t){return null}},
/** Persists a density preference so it survives modal close/reopen and page reloads. */
z=function(t){try{null==localStorage||localStorage.setItem(Gt,t)}catch(t){}},
/** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
Q=function(){try{const t="undefined"!=typeof localStorage?localStorage.getItem(this.pinStorageKey):null,e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch(t){return[]}},
/** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
G=function(t){try{null==localStorage||localStorage.setItem(this.pinStorageKey,JSON.stringify(t))}catch(t){}},J=function(t){return jt(this,r).some(e=>e.url===t)},
/**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
V=function(t){return this.enablePins&&jt(this,r).length?[{id:Jt,label:this.strings.pinnedTab,filter:null,pagefindOptions:null},...t]:t},
/**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
X=function(t){const e=jt(this,c)===Jt;if(Rt(this,H,J).call(this,t.url))Bt(this,r,jt(this,r).filter(e=>e.url!==t.url));else{if(!(jt(this,r).length<this.maxPins))return;Bt(this,r,[...jt(this,r),{url:t.url,title:t.title,isAnchor:t.isAnchor}])}Rt(this,H,G).call(this,jt(this,r)),Rt(this,H,j).call(this,Rt(this,H,V).call(this,(jt(this,o)||[]).filter(t=>t.id!==Jt))),jt(this,c)===Jt?Rt(this,H,Y).call(this):e?Rt(this,H,ht).call(this,jt(this,s)):Rt(this,H,ot).call(this)},
/** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
Y=function(){Bt(this,a,jt(this,r).map(t=>({title:t.title,url:t.url,excerpt:"",isAnchor:t.isAnchor,meta:{}}))),Bt(this,l,new Set(jt(this,a).map(t=>t.url.split("#")[0])).size),Bt(this,n,jt(this,a).length?0:-1),Rt(this,H,ot).call(this)},Z=function(){return Ft(this,null,function*(){return jt(this,p)?jt(this,p):jt(this,m)?(Bt(this,p,jt(this,m)),yield Rt(this,H,st).call(this),yield Rt(this,H,tt).call(this),jt(this,p)):(jt(this,f)||Bt(this,f,import(
/* @vite-ignore */
`${this.indexBasePath}pagefind.js`).then(t=>Ft(this,null,function*(){return yield t.options({basePath:this.indexBasePath}),Bt(this,p,t),yield Rt(this,H,st).call(this),yield Rt(this,H,tt).call(this),t})).catch(t=>(Bt(this,g,t),Rt(this,H,et).call(this),null))),jt(this,f))})},tt=function(){return Ft(this,null,function*(){jt(this,c)!==Jt?this.eagerResults&&!jt(this,s)&&(yield Rt(this,H,ht).call(this,"")):Rt(this,H,Y).call(this)})},
/**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
et=function(){jt(this,L).innerHTML=`<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`,jt(this,L).removeAttribute("aria-activedescendant"),jt(this,P).textContent=this.strings.unavailableCounter},
/**
   * Renders `defaultPreviewUrl`'s content into the preview pane on mount, before any result is
   * selected — reuses the same fetch/extract path `#loadPreviewContent` uses for a real match, so
   * it's real rendered page content, not a special-cased fixture. A real selection (or an
   * `eagerResults` listing) replaces it the moment `#matches` is non-empty.
   */
it=function(){const t=this.defaultPreviewUrl;Bt(this,y,t),jt(this,E).innerHTML=`\n      <div class="hawk-preview-header"></div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const e=jt(this,E).querySelector(".hawk-preview-title"),s=jt(this,E).querySelector(".hawk-preview-content");jt(this,i).typeTitle(e,this.defaultPreviewTitle,{isAnchor:!1}),Rt(this,H,ut).call(this,{url:this.defaultPreviewUrl,excerpt:"",isAnchor:!1},t,s)},st=function(){return Ft(this,null,function*(){if(jt(this,d))return;if(!jt(this,p))return void Rt(this,H,j).call(this,Rt(this,H,V).call(this,Rt(this,H,D).call(this,[])));let t=[];try{const e=yield jt(this,p).filters(),i=null==e?void 0:e[this.categoryFilterName];t=i?Object.keys(i):[]}catch(e){t=[]}Rt(this,H,j).call(this,Rt(this,H,V).call(this,Rt(this,H,D).call(this,t.map(t=>({id:t,label:t,filter:{[this.categoryFilterName]:t}})))))})},nt=function(){const t=jt(this,o)||[];jt(this,M).innerHTML=t.map(t=>{const e=t.id===jt(this,c);return`<button type="button" class="hawk-filter-pill${e?" active":""}" data-filter="${t.id}" role="tab" aria-selected="${e}" aria-controls="${this.id}-results" tabindex="${e?0:-1}">${t.label}</button>`}).join("");const e=Array.from(jt(this,M).querySelectorAll(".hawk-filter-pill"));e.forEach((t,i)=>{t.addEventListener("click",()=>{Rt(this,H,at).call(this,t),jt(this,b).focus()}),t.addEventListener("keydown",t=>Rt(this,H,lt).call(this,t,i,e))})},
/**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
at=function(t){Bt(this,c,t.dataset.filter),jt(this,M).querySelectorAll(".hawk-filter-pill").forEach(e=>{const i=e===t;e.classList.toggle("active",i),e.setAttribute("aria-selected",String(i)),e.tabIndex=i?0:-1}),jt(this,c)===Jt?(Bt(this,s,""),jt(this,b).value="",Rt(this,H,Y).call(this)):Rt(this,H,ht).call(this,jt(this,s))},
/**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
lt=function(t,e,i){let s=null;"ArrowRight"===t.key?s=(e+1)%i.length:"ArrowLeft"===t.key?s=(e-1+i.length)%i.length:"Home"===t.key?s=0:"End"===t.key&&(s=i.length-1),null!==s&&(t.preventDefault(),i[s].focus(),Rt(this,H,at).call(this,i[s]))},
/**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
rt=function(t){if(!this.inlineFilters)return{filters:null,remainingQuery:t};const e={},i=t.replace(/(\w+):("[^"]*"|\S+)/g,(t,i,s)=>{const n=s.startsWith('"')&&s.endsWith('"')?s.slice(1,-1):s;return void 0===e[i]?e[i]=n:Array.isArray(e[i])?e[i].push(n):e[i]=[e[i],n],""}).replace(/\s+/g," ").trim();return{filters:Object.keys(e).length?e:null,remainingQuery:i}},ht=function(t){return Ft(this,null,function*(){var e;if(Bt(this,s,t),yield Rt(this,H,Z).call(this),!jt(this,p))return;const i=(jt(this,o)||[]).find(t=>t.id===jt(this,c)),{filters:r,remainingQuery:h}=Rt(this,H,rt).call(this,t),d=(null==i?void 0:i.filter)||r?qt(qt({},(null==i?void 0:i.filter)||{}),r||{}):null,u=qt(qt(qt({},this.pagefindOptions),(null==i?void 0:i.pagefindOptions)||{}),d?{filters:d}:{}),f=this.inlineFilters?h:t;let w;try{({results:w}=f.trim()?yield jt(this,p).debouncedSearch(f,u):yield jt(this,p).search("",u))}catch(t){return Bt(this,g,t),void Rt(this,H,et).call(this)}const y=[];for(const t of(w||[]).slice(0,this.maxResults)){const i=yield t.data();y.push({title:(null==(e=i.meta)?void 0:e.title)||this.strings.untitled,url:i.url,excerpt:i.excerpt,isAnchor:!1,meta:i.meta||{}});for(const t of i.sub_results||[])t.url!==i.url&&y.push({title:t.title,url:t.url,excerpt:t.excerpt,isAnchor:!0,meta:i.meta||{}})}Bt(this,a,y.slice(0,this.maxResults)),Bt(this,l,new Set(jt(this,a).map(t=>t.url.split("#")[0])).size),Bt(this,n,jt(this,a).length?0:-1),Rt(this,H,ot).call(this)})},ot=function(){if(!jt(this,a).length)return jt(this,L).innerHTML=`<div class="hawk-empty">${this.strings.noResults(jt(this,s))}</div>`,jt(this,L).removeAttribute("aria-activedescendant"),jt(this,P).textContent=jt(this,s)?this.strings.matchingResults(0,0):this.strings.typeToSearch,void Rt(this,H,dt).call(this);jt(this,P).textContent=jt(this,s)?this.strings.matchingResults(jt(this,a).length,jt(this,l)):this.strings.entries(jt(this,a).length,jt(this,l)),jt(this,L).innerHTML=jt(this,a).map((t,e)=>{var i;const s=this.enablePins&&Rt(this,H,J).call(this,t.url);return`\n        <a href="${t.url}" id="${this.id}-result-${e}" class="hawk-result-item${e===jt(this,n)?" is-selected":""}" data-index="${e}" role="option" tabindex="-1" aria-selected="${e===jt(this,n)}">\n          <div class="hawk-result-header">\n            <span class="hawk-result-title">${t.isAnchor?"&sect; ":""}${t.title}</span>\n            ${(null==(i=t.meta)?void 0:i.section)?`<span class="hawk-meta-badge">${t.meta.section}</span>`:""}\n            ${this.enablePins?`<span class="hawk-pin-btn${s?" is-pinned":""}" role="button" aria-pressed="${s}" data-index="${e}">${s?this.strings.unpinAction:this.strings.pinAction}</span>`:""}\n          </div>\n          <div class="hawk-result-desc">${t.excerpt||""}</div>\n        </a>`}).join(""),jt(this,L).setAttribute("aria-activedescendant",`${this.id}-result-${jt(this,n)}`),jt(this,L).querySelectorAll(".hawk-result-item").forEach(t=>{t.addEventListener("mouseenter",()=>Rt(this,H,ct).call(this,Number(t.dataset.index),!1)),t.addEventListener("click",e=>{var i;const s=Number(t.dataset.index);if(e.target.closest(".hawk-pin-btn"))return e.preventDefault(),e.stopPropagation(),void Rt(this,H,X).call(this,jt(this,a)[s]);null==(i=this.onSelect)||i.call(this,jt(this,a)[s])})}),Rt(this,H,dt).call(this)},ct=function(t,e){Bt(this,n,t),jt(this,L).setAttribute("aria-activedescendant",`${this.id}-result-${t}`),jt(this,L).querySelectorAll(".hawk-result-item").forEach(i=>{var s;const n=Number(i.dataset.index)===t;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n)),n&&e&&(null==(s=i.scrollIntoView)||s.call(i,{block:"nearest"}))}),Rt(this,H,dt).call(this)},dt=function(){var t;const e=jt(this,a)[jt(this,n)];if(!e)return void(jt(this,E).innerHTML=`<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`);const s=e.url;if(s===jt(this,y))return;Bt(this,y,s),jt(this,i).stop(jt(this,w)),jt(this,E).innerHTML=`\n      <div class="hawk-preview-header">\n        ${e.isAnchor?`<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>`:""}\n        ${(null==(t=e.meta)?void 0:t.section)?`<span class="hawk-meta-badge">${e.meta.section}</span>`:""}\n      </div>\n      <h3 class="hawk-preview-title"></h3>\n      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>\n    `;const l=jt(this,E).querySelector(".hawk-preview-title"),r=jt(this,E).querySelector(".hawk-preview-content");jt(this,i).typeTitle(l,e.title,{isAnchor:e.isAnchor}),Rt(this,H,ut).call(this,e,s,r)},ut=function(t,e,s){return Ft(this,null,function*(){let n=t.excerpt||"",a=null;if("function"==typeof fetch&&"undefined"!=typeof DOMParser)try{const[e,i]=t.url.split("#"),s=yield Rt(this,H,gt).call(this,e);t.isAnchor&&i?n=Rt(this,H,wt).call(this,s,i):this.previewSections?(a=Rt(this,H,pt).call(this,s),a.length||(n=s.innerHTML)):n=s.innerHTML}catch(e){n=t.excerpt||""}jt(this,y)===e&&(a&&a.length?Rt(this,H,ft).call(this,a,t,s):Bt(this,w,jt(this,i).typeContent(s,n)))})},
/**
   * Breaks a page's content root into `{title, slug, excerpt}` rows, one per heading matching
   * `previewSectionSelector` — the heading's own text, its id, and a short plain-text excerpt of
   * the content between it and the next heading of *any* level (so a subsection's text doesn't
   * leak into its parent's excerpt). Pure DOM traversal over content hawk already fetched and
   * parsed for the full-content view — no extra network request, and cheap even for a long page
   * (a few dozen headings at most in practice).
   * @param {Element} root
   * @returns {{title: string, slug: string, excerpt: string}[]}
   */
pt=function(t){return Array.from(t.querySelectorAll(this.previewSectionSelector)).filter(t=>t.id).map(t=>{const e=[];let i=t.nextElementSibling;for(;i&&!/^H[1-6]$/.test(i.tagName);){const t=i.textContent.trim();t&&e.push(t),i=i.nextElementSibling}let s=e.join(" ").replace(/\s+/g," ").trim();return s.length>this.previewSectionExcerptLength&&(s=`${s.slice(0,this.previewSectionExcerptLength).trimEnd()}…`),{title:t.textContent.trim(),slug:t.id,excerpt:s}})},
/**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
ft=function(t,e,i){const s=e.url.split("#")[0];i.innerHTML=t.map(t=>`\n        <a class="hawk-preview-section-row" href="${s}#${t.slug}">\n          <span class="hawk-preview-section-title">${t.title}</span>\n          ${t.excerpt?`<span class="hawk-preview-section-excerpt">${t.excerpt}</span>`:""}\n        </a>`).join(""),i.querySelectorAll(".hawk-preview-section-row").forEach((i,n)=>{i.addEventListener("click",()=>{var i;const a=t[n];null==(i=this.onSelect)||i.call(this,{title:a.title,url:`${s}#${a.slug}`,excerpt:a.excerpt,isAnchor:!0,meta:e.meta||{}})})})},
/**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
gt=function(t){if(jt(this,v).has(t))return jt(this,v).get(t);const e=fetch(t).then(t=>t.text()).then(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return e.querySelector(this.contentSelector)||e.body}).catch(e=>{throw jt(this,v).delete(t),e});return jt(this,v).set(t,e),e},
/**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
wt=function(t,e){const i=t.querySelector(`[id="${String(e).replace(/"/g,'\\"')}"]`);if(!i)return t.innerHTML;const s=Number(i.tagName[1])||6,n=[i.outerHTML];let a=i.nextElementSibling;for(;a&&!(/^H[1-6]$/.test(a.tagName)&&Number(a.tagName[1])<=s);)n.push(a.outerHTML),a=a.nextElementSibling;return n.join("")},
/**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
yt=function(t){var e;if("ArrowDown"===t.key)t.preventDefault(),jt(this,a).length&&Rt(this,H,ct).call(this,(jt(this,n)+1)%jt(this,a).length,!0);else if("ArrowUp"===t.key)t.preventDefault(),jt(this,a).length&&Rt(this,H,ct).call(this,(jt(this,n)-1+jt(this,a).length)%jt(this,a).length,!0);else if("Enter"===t.key){const t=jt(this,a)[jt(this,n)];t&&(null==(e=this.onSelect)||e.call(this,t),window.location.href=t.url)}},
/**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
vt=function(t){if(1===t.key.length&&!t.metaKey&&!t.ctrlKey&&!t.altKey)return t.preventDefault(),jt(this,b).focus(),jt(this,b).value+=t.key,void jt(this,b).dispatchEvent(new Event("input"));Rt(this,H,yt).call(this,t)},
/**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
mt=function(t){"ArrowDown"===t.key?(t.preventDefault(),jt(this,E).scrollTop+=48):"ArrowUp"===t.key?(t.preventDefault(),jt(this,E).scrollTop-=48):"PageDown"===t.key?(t.preventDefault(),jt(this,E).scrollTop+=jt(this,E).clientHeight):"PageUp"===t.key?(t.preventDefault(),jt(this,E).scrollTop-=jt(this,E).clientHeight):"Home"===t.key?(t.preventDefault(),jt(this,E).scrollTop=0):"End"===t.key&&(t.preventDefault(),jt(this,E).scrollTop=jt(this,E).scrollHeight)},kt=function(t){jt(this,u)&&"Tab"===t.key&&Rt(this,H,$t).call(this,t);const e=t.target,i=e&&["INPUT","TEXTAREA","SELECT"].includes(e.tagName);this.hotkeys.open&&(t.metaKey||t.ctrlKey)&&"k"===t.key.toLowerCase()?(t.preventDefault(),jt(this,u)?this.close():this.open()):this.hotkeys.slash&&"/"===t.key&&!i?(t.preventDefault(),this.open()):this.hotkeys.escape&&"Escape"===t.key&&jt(this,u)&&this.close()},
/**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
bt=function(){return!("true"===jt(this,k).dataset.hawkCompact||"compact"===this.params.density)||"true"===jt(this,k).dataset.hawkShowPreview},
/** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
St=function(){return[jt(this,b),...this.params.allowDensityToggle?Array.from(jt(this,k).querySelectorAll(".hawk-density-btn")):[],jt(this,k).querySelector(".hawk-modal-esc"),jt(this,M).querySelector('.hawk-filter-pill[tabindex="0"]'),jt(this,L),...Rt(this,H,bt).call(this)?[jt(this,E)]:[]].filter(Boolean)},
/**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
$t=function(t){const e=Rt(this,H,St).call(this);if(!e.length)return;const i=e[0],s=e[e.length-1];t.shiftKey&&document.activeElement===i?(t.preventDefault(),s.focus()):t.shiftKey||document.activeElement!==s||(t.preventDefault(),i.focus())},
/**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
xt=function(t){t.addEventListener("scroll",()=>{t.dataset.hawkScrolling="true",clearTimeout(jt(this,A).get(t)),jt(this,A).set(t,setTimeout(()=>{t.dataset.hawkScrolling="false"},500))},{passive:!0})},
/**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
Lt=function(){if(!jt(this,$))return;const t=jt(this,u)&&!jt(this,b).value;jt(this,S).dataset.hawkInputActive=String(!t),t&&!jt(this,x)?Bt(this,x,jt(this,i).rotatePlaceholder(jt(this,$),this.rotatingPlaceholders)):!t&&jt(this,x)&&(jt(this,i).stop(jt(this,x)),Bt(this,x,null))},Dt(Zt,"themes",Ut),Dt(Zt,"animations",_t),"undefined"!=typeof window&&(window.Hawk=Zt),t.HawkSearch=Zt,t.default=Zt,Object.defineProperties(t,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk.cjs.map
