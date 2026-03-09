import{r as $,j as a,R as wt}from"./index-C4Q8ebaK.js";const wm=()=>{};var ju={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bh=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},Em=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const o=n[t++];e[s++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=n[t++],l=n[t++],h=n[t++],p=((r&7)<<18|(o&63)<<12|(l&63)<<6|h&63)-65536;e[s++]=String.fromCharCode(55296+(p>>10)),e[s++]=String.fromCharCode(56320+(p&1023))}else{const o=n[t++],l=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(o&63)<<6|l&63)}}return e.join("")},vh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const o=n[r],l=r+1<n.length,h=l?n[r+1]:0,p=r+2<n.length,b=p?n[r+2]:0,v=o>>2,I=(o&3)<<4|h>>4;let A=(h&15)<<2|b>>6,M=b&63;p||(M=64,l||(A=64)),s.push(t[v],t[I],t[A],t[M])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(bh(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Em(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const o=t[n.charAt(r++)],h=r<n.length?t[n.charAt(r)]:0;++r;const b=r<n.length?t[n.charAt(r)]:64;++r;const I=r<n.length?t[n.charAt(r)]:64;if(++r,o==null||h==null||b==null||I==null)throw new Tm;const A=o<<2|h>>4;if(s.push(A),b!==64){const M=h<<4&240|b>>2;if(s.push(M),I!==64){const z=b<<6&192|I;s.push(z)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Tm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Im=function(n){const e=bh(n);return vh.encodeByteArray(e,!0)},Aa=function(n){return Im(n).replace(/\./g,"")},xh=function(n){try{return vh.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Am(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km=()=>Am().__FIREBASE_DEFAULTS__,Sm=()=>{if(typeof process>"u"||typeof ju>"u")return;const n=ju.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Nm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&xh(n[1]);return e&&JSON.parse(e)},Ka=()=>{try{return wm()||km()||Sm()||Nm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},_h=n=>{var e,t;return(t=(e=Ka())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Cm=n=>{const e=_h(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},wh=()=>{var n;return(n=Ka())===null||n===void 0?void 0:n.config},Eh=n=>{var e;return(e=Ka())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Th(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Aa(JSON.stringify(t)),Aa(JSON.stringify(l)),""].join(".")}const co={};function jm(){const n={prod:[],emulator:[]};for(const e of Object.keys(co))co[e]?n.emulator.push(e):n.prod.push(e);return n}function Dm(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Du=!1;function Ih(n,e){if(typeof window>"u"||typeof document>"u"||!mi(window.location.host)||co[n]===e||co[n]||Du)return;co[n]=e;function t(A){return`__firebase__banner__${A}`}const s="__firebase__banner",o=jm().prod.length>0;function l(){const A=document.getElementById(s);A&&A.remove()}function h(A){A.style.display="flex",A.style.background="#7faaf0",A.style.position="fixed",A.style.bottom="5px",A.style.left="5px",A.style.padding=".5em",A.style.borderRadius="5px",A.style.alignItems="center"}function p(A,M){A.setAttribute("width","24"),A.setAttribute("id",M),A.setAttribute("height","24"),A.setAttribute("viewBox","0 0 24 24"),A.setAttribute("fill","none"),A.style.marginLeft="-6px"}function b(){const A=document.createElement("span");return A.style.cursor="pointer",A.style.marginLeft="16px",A.style.fontSize="24px",A.innerHTML=" &times;",A.onclick=()=>{Du=!0,l()},A}function v(A,M){A.setAttribute("id",M),A.innerText="Learn more",A.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",A.setAttribute("target","__blank"),A.style.paddingLeft="5px",A.style.textDecoration="underline"}function I(){const A=Dm(s),M=t("text"),z=document.getElementById(M)||document.createElement("span"),Q=t("learnmore"),J=document.getElementById(Q)||document.createElement("a"),_e=t("preprendIcon"),oe=document.getElementById(_e)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(A.created){const pe=A.element;h(pe),v(J,Q);const me=b();p(oe,_e),pe.append(oe,z,J,me),document.body.appendChild(pe)}o?(z.innerText="Preview backend disconnected.",oe.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(oe.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,z.innerText="Preview backend running in this workspace."),z.setAttribute("id",M)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",I):I()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Om(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Mt())}function Vm(){var n;const e=(n=Ka())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Mm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Lm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function $m(){const n=Mt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Um(){return!Vm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function zm(){try{return typeof indexedDB=="object"}catch{return!1}}function Bm(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var o;e(((o=r.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qm="FirebaseError";class cs extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=qm,Object.setPrototypeOf(this,cs.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,To.prototype.create)}}class To{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,o=this.errors[e],l=o?Hm(o,s):"Error",h=`${this.serviceName}: ${l} (${r}).`;return new cs(r,h,s)}}function Hm(n,e){return n.replace(Wm,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Wm=/\{\$([^}]+)}/g;function Gm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function pr(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const o=n[r],l=e[r];if(Ou(o)&&Ou(l)){if(!pr(o,l))return!1}else if(o!==l)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function Ou(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Io(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Km(n,e){const t=new Jm(n,e);return t.subscribe.bind(t)}class Jm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Qm(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=Nl),r.error===void 0&&(r.error=Nl),r.complete===void 0&&(r.complete=Nl);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Qm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Nl(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wt(n){return n&&n._delegate?n._delegate:n}class mr{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Pm;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Zm(e))try{this.getOrInitializeService({instanceIdentifier:lr})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:r});s.resolve(o)}catch{}}}}clearInstance(e=lr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=lr){return this.instances.has(e)}getOptions(e=lr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[o,l]of this.instancesDeferred.entries()){const h=this.normalizeInstanceIdentifier(o);s===h&&l.resolve(r)}return r}onInit(e,t){var s;const r=this.normalizeInstanceIdentifier(t),o=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;o.add(e),this.onInitCallbacks.set(r,o);const l=this.instances.get(r);return l&&e(l,r),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Ym(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=lr){return this.component?this.component.multipleInstances?e:lr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ym(n){return n===lr?void 0:n}function Zm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Xm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ke;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ke||(ke={}));const tg={debug:ke.DEBUG,verbose:ke.VERBOSE,info:ke.INFO,warn:ke.WARN,error:ke.ERROR,silent:ke.SILENT},ng=ke.INFO,sg={[ke.DEBUG]:"log",[ke.VERBOSE]:"log",[ke.INFO]:"info",[ke.WARN]:"warn",[ke.ERROR]:"error"},rg=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=sg[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mc{constructor(e){this.name=e,this._logLevel=ng,this._logHandler=rg,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ke))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?tg[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ke.DEBUG,...e),this._logHandler(this,ke.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ke.VERBOSE,...e),this._logHandler(this,ke.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ke.INFO,...e),this._logHandler(this,ke.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ke.WARN,...e),this._logHandler(this,ke.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ke.ERROR,...e),this._logHandler(this,ke.ERROR,...e)}}const ig=(n,e)=>e.some(t=>n instanceof t);let Vu,Mu;function og(){return Vu||(Vu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ag(){return Mu||(Mu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ah=new WeakMap,zl=new WeakMap,kh=new WeakMap,Cl=new WeakMap,gc=new WeakMap;function lg(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",o),n.removeEventListener("error",l)},o=()=>{t(js(n.result)),r()},l=()=>{s(n.error),r()};n.addEventListener("success",o),n.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Ah.set(t,n)}).catch(()=>{}),gc.set(e,n),e}function cg(n){if(zl.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",l),n.removeEventListener("abort",l)},o=()=>{t(),r()},l=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",o),n.addEventListener("error",l),n.addEventListener("abort",l)});zl.set(n,e)}let Bl={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return zl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||kh.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return js(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ug(n){Bl=n(Bl)}function dg(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(Pl(this),e,...t);return kh.set(s,e.sort?e.sort():[e]),js(s)}:ag().includes(n)?function(...e){return n.apply(Pl(this),e),js(Ah.get(this))}:function(...e){return js(n.apply(Pl(this),e))}}function hg(n){return typeof n=="function"?dg(n):(n instanceof IDBTransaction&&cg(n),ig(n,og())?new Proxy(n,Bl):n)}function js(n){if(n instanceof IDBRequest)return lg(n);if(Cl.has(n))return Cl.get(n);const e=hg(n);return e!==n&&(Cl.set(n,e),gc.set(e,n)),e}const Pl=n=>gc.get(n);function fg(n,e,{blocked:t,upgrade:s,blocking:r,terminated:o}={}){const l=indexedDB.open(n,e),h=js(l);return s&&l.addEventListener("upgradeneeded",p=>{s(js(l.result),p.oldVersion,p.newVersion,js(l.transaction),p)}),t&&l.addEventListener("blocked",p=>t(p.oldVersion,p.newVersion,p)),h.then(p=>{o&&p.addEventListener("close",()=>o()),r&&p.addEventListener("versionchange",b=>r(b.oldVersion,b.newVersion,b))}).catch(()=>{}),h}const pg=["get","getKey","getAll","getAllKeys","count"],mg=["put","add","delete","clear"],Rl=new Map;function Fu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Rl.get(e))return Rl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=mg.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||pg.includes(t)))return;const o=async function(l,...h){const p=this.transaction(l,r?"readwrite":"readonly");let b=p.store;return s&&(b=b.index(h.shift())),(await Promise.all([b[t](...h),r&&p.done]))[0]};return Rl.set(e,o),o}ug(n=>({...n,get:(e,t,s)=>Fu(e,t)||n.get(e,t,s),has:(e,t)=>!!Fu(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yg(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function yg(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ql="@firebase/app",Lu="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is=new mc("@firebase/app"),bg="@firebase/app-compat",vg="@firebase/analytics-compat",xg="@firebase/analytics",_g="@firebase/app-check-compat",wg="@firebase/app-check",Eg="@firebase/auth",Tg="@firebase/auth-compat",Ig="@firebase/database",Ag="@firebase/data-connect",kg="@firebase/database-compat",Sg="@firebase/functions",Ng="@firebase/functions-compat",Cg="@firebase/installations",Pg="@firebase/installations-compat",Rg="@firebase/messaging",jg="@firebase/messaging-compat",Dg="@firebase/performance",Og="@firebase/performance-compat",Vg="@firebase/remote-config",Mg="@firebase/remote-config-compat",Fg="@firebase/storage",Lg="@firebase/storage-compat",$g="@firebase/firestore",Ug="@firebase/ai",zg="@firebase/firestore-compat",Bg="firebase",qg="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl="[DEFAULT]",Hg={[ql]:"fire-core",[bg]:"fire-core-compat",[xg]:"fire-analytics",[vg]:"fire-analytics-compat",[wg]:"fire-app-check",[_g]:"fire-app-check-compat",[Eg]:"fire-auth",[Tg]:"fire-auth-compat",[Ig]:"fire-rtdb",[Ag]:"fire-data-connect",[kg]:"fire-rtdb-compat",[Sg]:"fire-fn",[Ng]:"fire-fn-compat",[Cg]:"fire-iid",[Pg]:"fire-iid-compat",[Rg]:"fire-fcm",[jg]:"fire-fcm-compat",[Dg]:"fire-perf",[Og]:"fire-perf-compat",[Vg]:"fire-rc",[Mg]:"fire-rc-compat",[Fg]:"fire-gcs",[Lg]:"fire-gcs-compat",[$g]:"fire-fst",[zg]:"fire-fst-compat",[Ug]:"fire-vertex","fire-js":"fire-js",[Bg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ka=new Map,Wg=new Map,Wl=new Map;function $u(n,e){try{n.container.addComponent(e)}catch(t){is.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function li(n){const e=n.name;if(Wl.has(e))return is.debug(`There were multiple attempts to register component ${e}.`),!1;Wl.set(e,n);for(const t of ka.values())$u(t,n);for(const t of Wg.values())$u(t,n);return!0}function yc(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function sn(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ds=new To("app","Firebase",Gg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kg{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new mr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ds.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=qg;function Sh(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Hl,automaticDataCollectionEnabled:!0},e),r=s.name;if(typeof r!="string"||!r)throw Ds.create("bad-app-name",{appName:String(r)});if(t||(t=wh()),!t)throw Ds.create("no-options");const o=ka.get(r);if(o){if(pr(t,o.options)&&pr(s,o.config))return o;throw Ds.create("duplicate-app",{appName:r})}const l=new eg(r);for(const p of Wl.values())l.addComponent(p);const h=new Kg(t,s,l);return ka.set(r,h),h}function Nh(n=Hl){const e=ka.get(n);if(!e&&n===Hl&&wh())return Sh();if(!e)throw Ds.create("no-app",{appName:n});return e}function Os(n,e,t){var s;let r=(s=Hg[n])!==null&&s!==void 0?s:n;t&&(r+=`-${t}`);const o=r.match(/\s|\//),l=e.match(/\s|\//);if(o||l){const h=[`Unable to register library "${r}" with version "${e}":`];o&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),o&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),is.warn(h.join(" "));return}li(new mr(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg="firebase-heartbeat-database",Qg=1,go="firebase-heartbeat-store";let jl=null;function Ch(){return jl||(jl=fg(Jg,Qg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(go)}catch(t){console.warn(t)}}}}).catch(n=>{throw Ds.create("idb-open",{originalErrorMessage:n.message})})),jl}async function Xg(n){try{const t=(await Ch()).transaction(go),s=await t.objectStore(go).get(Ph(n));return await t.done,s}catch(e){if(e instanceof cs)is.warn(e.message);else{const t=Ds.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});is.warn(t.message)}}}async function Uu(n,e){try{const s=(await Ch()).transaction(go,"readwrite");await s.objectStore(go).put(e,Ph(n)),await s.done}catch(t){if(t instanceof cs)is.warn(t.message);else{const s=Ds.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});is.warn(s.message)}}}function Ph(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yg=1024,Zg=30;class e0{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new n0(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=zu();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(l=>l.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats.length>Zg){const l=s0(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){is.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=zu(),{heartbeatsToSend:s,unsentEntries:r}=t0(this._heartbeatsCache.heartbeats),o=Aa(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return is.warn(t),""}}}function zu(){return new Date().toISOString().substring(0,10)}function t0(n,e=Yg){const t=[];let s=n.slice();for(const r of n){const o=t.find(l=>l.agent===r.agent);if(o){if(o.dates.push(r.date),Bu(t)>e){o.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),Bu(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class n0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return zm()?Bm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Xg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Uu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Uu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Bu(n){return Aa(JSON.stringify({version:2,heartbeats:n})).length}function s0(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r0(n){li(new mr("platform-logger",e=>new gg(e),"PRIVATE")),li(new mr("heartbeat",e=>new e0(e),"PRIVATE")),Os(ql,Lu,n),Os(ql,Lu,"esm2017"),Os("fire-js","")}r0("");var i0="firebase",o0="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Os(i0,o0,"app");var qu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Vs,Rh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(j,k){function E(){}E.prototype=k.prototype,j.D=k.prototype,j.prototype=new E,j.prototype.constructor=j,j.C=function(N,S,C){for(var T=Array(arguments.length-2),Xe=2;Xe<arguments.length;Xe++)T[Xe-2]=arguments[Xe];return k.prototype[S].apply(N,T)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(j,k,E){E||(E=0);var N=Array(16);if(typeof k=="string")for(var S=0;16>S;++S)N[S]=k.charCodeAt(E++)|k.charCodeAt(E++)<<8|k.charCodeAt(E++)<<16|k.charCodeAt(E++)<<24;else for(S=0;16>S;++S)N[S]=k[E++]|k[E++]<<8|k[E++]<<16|k[E++]<<24;k=j.g[0],E=j.g[1],S=j.g[2];var C=j.g[3],T=k+(C^E&(S^C))+N[0]+3614090360&4294967295;k=E+(T<<7&4294967295|T>>>25),T=C+(S^k&(E^S))+N[1]+3905402710&4294967295,C=k+(T<<12&4294967295|T>>>20),T=S+(E^C&(k^E))+N[2]+606105819&4294967295,S=C+(T<<17&4294967295|T>>>15),T=E+(k^S&(C^k))+N[3]+3250441966&4294967295,E=S+(T<<22&4294967295|T>>>10),T=k+(C^E&(S^C))+N[4]+4118548399&4294967295,k=E+(T<<7&4294967295|T>>>25),T=C+(S^k&(E^S))+N[5]+1200080426&4294967295,C=k+(T<<12&4294967295|T>>>20),T=S+(E^C&(k^E))+N[6]+2821735955&4294967295,S=C+(T<<17&4294967295|T>>>15),T=E+(k^S&(C^k))+N[7]+4249261313&4294967295,E=S+(T<<22&4294967295|T>>>10),T=k+(C^E&(S^C))+N[8]+1770035416&4294967295,k=E+(T<<7&4294967295|T>>>25),T=C+(S^k&(E^S))+N[9]+2336552879&4294967295,C=k+(T<<12&4294967295|T>>>20),T=S+(E^C&(k^E))+N[10]+4294925233&4294967295,S=C+(T<<17&4294967295|T>>>15),T=E+(k^S&(C^k))+N[11]+2304563134&4294967295,E=S+(T<<22&4294967295|T>>>10),T=k+(C^E&(S^C))+N[12]+1804603682&4294967295,k=E+(T<<7&4294967295|T>>>25),T=C+(S^k&(E^S))+N[13]+4254626195&4294967295,C=k+(T<<12&4294967295|T>>>20),T=S+(E^C&(k^E))+N[14]+2792965006&4294967295,S=C+(T<<17&4294967295|T>>>15),T=E+(k^S&(C^k))+N[15]+1236535329&4294967295,E=S+(T<<22&4294967295|T>>>10),T=k+(S^C&(E^S))+N[1]+4129170786&4294967295,k=E+(T<<5&4294967295|T>>>27),T=C+(E^S&(k^E))+N[6]+3225465664&4294967295,C=k+(T<<9&4294967295|T>>>23),T=S+(k^E&(C^k))+N[11]+643717713&4294967295,S=C+(T<<14&4294967295|T>>>18),T=E+(C^k&(S^C))+N[0]+3921069994&4294967295,E=S+(T<<20&4294967295|T>>>12),T=k+(S^C&(E^S))+N[5]+3593408605&4294967295,k=E+(T<<5&4294967295|T>>>27),T=C+(E^S&(k^E))+N[10]+38016083&4294967295,C=k+(T<<9&4294967295|T>>>23),T=S+(k^E&(C^k))+N[15]+3634488961&4294967295,S=C+(T<<14&4294967295|T>>>18),T=E+(C^k&(S^C))+N[4]+3889429448&4294967295,E=S+(T<<20&4294967295|T>>>12),T=k+(S^C&(E^S))+N[9]+568446438&4294967295,k=E+(T<<5&4294967295|T>>>27),T=C+(E^S&(k^E))+N[14]+3275163606&4294967295,C=k+(T<<9&4294967295|T>>>23),T=S+(k^E&(C^k))+N[3]+4107603335&4294967295,S=C+(T<<14&4294967295|T>>>18),T=E+(C^k&(S^C))+N[8]+1163531501&4294967295,E=S+(T<<20&4294967295|T>>>12),T=k+(S^C&(E^S))+N[13]+2850285829&4294967295,k=E+(T<<5&4294967295|T>>>27),T=C+(E^S&(k^E))+N[2]+4243563512&4294967295,C=k+(T<<9&4294967295|T>>>23),T=S+(k^E&(C^k))+N[7]+1735328473&4294967295,S=C+(T<<14&4294967295|T>>>18),T=E+(C^k&(S^C))+N[12]+2368359562&4294967295,E=S+(T<<20&4294967295|T>>>12),T=k+(E^S^C)+N[5]+4294588738&4294967295,k=E+(T<<4&4294967295|T>>>28),T=C+(k^E^S)+N[8]+2272392833&4294967295,C=k+(T<<11&4294967295|T>>>21),T=S+(C^k^E)+N[11]+1839030562&4294967295,S=C+(T<<16&4294967295|T>>>16),T=E+(S^C^k)+N[14]+4259657740&4294967295,E=S+(T<<23&4294967295|T>>>9),T=k+(E^S^C)+N[1]+2763975236&4294967295,k=E+(T<<4&4294967295|T>>>28),T=C+(k^E^S)+N[4]+1272893353&4294967295,C=k+(T<<11&4294967295|T>>>21),T=S+(C^k^E)+N[7]+4139469664&4294967295,S=C+(T<<16&4294967295|T>>>16),T=E+(S^C^k)+N[10]+3200236656&4294967295,E=S+(T<<23&4294967295|T>>>9),T=k+(E^S^C)+N[13]+681279174&4294967295,k=E+(T<<4&4294967295|T>>>28),T=C+(k^E^S)+N[0]+3936430074&4294967295,C=k+(T<<11&4294967295|T>>>21),T=S+(C^k^E)+N[3]+3572445317&4294967295,S=C+(T<<16&4294967295|T>>>16),T=E+(S^C^k)+N[6]+76029189&4294967295,E=S+(T<<23&4294967295|T>>>9),T=k+(E^S^C)+N[9]+3654602809&4294967295,k=E+(T<<4&4294967295|T>>>28),T=C+(k^E^S)+N[12]+3873151461&4294967295,C=k+(T<<11&4294967295|T>>>21),T=S+(C^k^E)+N[15]+530742520&4294967295,S=C+(T<<16&4294967295|T>>>16),T=E+(S^C^k)+N[2]+3299628645&4294967295,E=S+(T<<23&4294967295|T>>>9),T=k+(S^(E|~C))+N[0]+4096336452&4294967295,k=E+(T<<6&4294967295|T>>>26),T=C+(E^(k|~S))+N[7]+1126891415&4294967295,C=k+(T<<10&4294967295|T>>>22),T=S+(k^(C|~E))+N[14]+2878612391&4294967295,S=C+(T<<15&4294967295|T>>>17),T=E+(C^(S|~k))+N[5]+4237533241&4294967295,E=S+(T<<21&4294967295|T>>>11),T=k+(S^(E|~C))+N[12]+1700485571&4294967295,k=E+(T<<6&4294967295|T>>>26),T=C+(E^(k|~S))+N[3]+2399980690&4294967295,C=k+(T<<10&4294967295|T>>>22),T=S+(k^(C|~E))+N[10]+4293915773&4294967295,S=C+(T<<15&4294967295|T>>>17),T=E+(C^(S|~k))+N[1]+2240044497&4294967295,E=S+(T<<21&4294967295|T>>>11),T=k+(S^(E|~C))+N[8]+1873313359&4294967295,k=E+(T<<6&4294967295|T>>>26),T=C+(E^(k|~S))+N[15]+4264355552&4294967295,C=k+(T<<10&4294967295|T>>>22),T=S+(k^(C|~E))+N[6]+2734768916&4294967295,S=C+(T<<15&4294967295|T>>>17),T=E+(C^(S|~k))+N[13]+1309151649&4294967295,E=S+(T<<21&4294967295|T>>>11),T=k+(S^(E|~C))+N[4]+4149444226&4294967295,k=E+(T<<6&4294967295|T>>>26),T=C+(E^(k|~S))+N[11]+3174756917&4294967295,C=k+(T<<10&4294967295|T>>>22),T=S+(k^(C|~E))+N[2]+718787259&4294967295,S=C+(T<<15&4294967295|T>>>17),T=E+(C^(S|~k))+N[9]+3951481745&4294967295,j.g[0]=j.g[0]+k&4294967295,j.g[1]=j.g[1]+(S+(T<<21&4294967295|T>>>11))&4294967295,j.g[2]=j.g[2]+S&4294967295,j.g[3]=j.g[3]+C&4294967295}s.prototype.u=function(j,k){k===void 0&&(k=j.length);for(var E=k-this.blockSize,N=this.B,S=this.h,C=0;C<k;){if(S==0)for(;C<=E;)r(this,j,C),C+=this.blockSize;if(typeof j=="string"){for(;C<k;)if(N[S++]=j.charCodeAt(C++),S==this.blockSize){r(this,N),S=0;break}}else for(;C<k;)if(N[S++]=j[C++],S==this.blockSize){r(this,N),S=0;break}}this.h=S,this.o+=k},s.prototype.v=function(){var j=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);j[0]=128;for(var k=1;k<j.length-8;++k)j[k]=0;var E=8*this.o;for(k=j.length-8;k<j.length;++k)j[k]=E&255,E/=256;for(this.u(j),j=Array(16),k=E=0;4>k;++k)for(var N=0;32>N;N+=8)j[E++]=this.g[k]>>>N&255;return j};function o(j,k){var E=h;return Object.prototype.hasOwnProperty.call(E,j)?E[j]:E[j]=k(j)}function l(j,k){this.h=k;for(var E=[],N=!0,S=j.length-1;0<=S;S--){var C=j[S]|0;N&&C==k||(E[S]=C,N=!1)}this.g=E}var h={};function p(j){return-128<=j&&128>j?o(j,function(k){return new l([k|0],0>k?-1:0)}):new l([j|0],0>j?-1:0)}function b(j){if(isNaN(j)||!isFinite(j))return I;if(0>j)return J(b(-j));for(var k=[],E=1,N=0;j>=E;N++)k[N]=j/E|0,E*=4294967296;return new l(k,0)}function v(j,k){if(j.length==0)throw Error("number format error: empty string");if(k=k||10,2>k||36<k)throw Error("radix out of range: "+k);if(j.charAt(0)=="-")return J(v(j.substring(1),k));if(0<=j.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=b(Math.pow(k,8)),N=I,S=0;S<j.length;S+=8){var C=Math.min(8,j.length-S),T=parseInt(j.substring(S,S+C),k);8>C?(C=b(Math.pow(k,C)),N=N.j(C).add(b(T))):(N=N.j(E),N=N.add(b(T)))}return N}var I=p(0),A=p(1),M=p(16777216);n=l.prototype,n.m=function(){if(Q(this))return-J(this).m();for(var j=0,k=1,E=0;E<this.g.length;E++){var N=this.i(E);j+=(0<=N?N:4294967296+N)*k,k*=4294967296}return j},n.toString=function(j){if(j=j||10,2>j||36<j)throw Error("radix out of range: "+j);if(z(this))return"0";if(Q(this))return"-"+J(this).toString(j);for(var k=b(Math.pow(j,6)),E=this,N="";;){var S=me(E,k).g;E=_e(E,S.j(k));var C=((0<E.g.length?E.g[0]:E.h)>>>0).toString(j);if(E=S,z(E))return C+N;for(;6>C.length;)C="0"+C;N=C+N}},n.i=function(j){return 0>j?0:j<this.g.length?this.g[j]:this.h};function z(j){if(j.h!=0)return!1;for(var k=0;k<j.g.length;k++)if(j.g[k]!=0)return!1;return!0}function Q(j){return j.h==-1}n.l=function(j){return j=_e(this,j),Q(j)?-1:z(j)?0:1};function J(j){for(var k=j.g.length,E=[],N=0;N<k;N++)E[N]=~j.g[N];return new l(E,~j.h).add(A)}n.abs=function(){return Q(this)?J(this):this},n.add=function(j){for(var k=Math.max(this.g.length,j.g.length),E=[],N=0,S=0;S<=k;S++){var C=N+(this.i(S)&65535)+(j.i(S)&65535),T=(C>>>16)+(this.i(S)>>>16)+(j.i(S)>>>16);N=T>>>16,C&=65535,T&=65535,E[S]=T<<16|C}return new l(E,E[E.length-1]&-2147483648?-1:0)};function _e(j,k){return j.add(J(k))}n.j=function(j){if(z(this)||z(j))return I;if(Q(this))return Q(j)?J(this).j(J(j)):J(J(this).j(j));if(Q(j))return J(this.j(J(j)));if(0>this.l(M)&&0>j.l(M))return b(this.m()*j.m());for(var k=this.g.length+j.g.length,E=[],N=0;N<2*k;N++)E[N]=0;for(N=0;N<this.g.length;N++)for(var S=0;S<j.g.length;S++){var C=this.i(N)>>>16,T=this.i(N)&65535,Xe=j.i(S)>>>16,Ae=j.i(S)&65535;E[2*N+2*S]+=T*Ae,oe(E,2*N+2*S),E[2*N+2*S+1]+=C*Ae,oe(E,2*N+2*S+1),E[2*N+2*S+1]+=T*Xe,oe(E,2*N+2*S+1),E[2*N+2*S+2]+=C*Xe,oe(E,2*N+2*S+2)}for(N=0;N<k;N++)E[N]=E[2*N+1]<<16|E[2*N];for(N=k;N<2*k;N++)E[N]=0;return new l(E,0)};function oe(j,k){for(;(j[k]&65535)!=j[k];)j[k+1]+=j[k]>>>16,j[k]&=65535,k++}function pe(j,k){this.g=j,this.h=k}function me(j,k){if(z(k))throw Error("division by zero");if(z(j))return new pe(I,I);if(Q(j))return k=me(J(j),k),new pe(J(k.g),J(k.h));if(Q(k))return k=me(j,J(k)),new pe(J(k.g),k.h);if(30<j.g.length){if(Q(j)||Q(k))throw Error("slowDivide_ only works with positive integers.");for(var E=A,N=k;0>=N.l(j);)E=tt(E),N=tt(N);var S=Fe(E,1),C=Fe(N,1);for(N=Fe(N,2),E=Fe(E,2);!z(N);){var T=C.add(N);0>=T.l(j)&&(S=S.add(E),C=T),N=Fe(N,1),E=Fe(E,1)}return k=_e(j,S.j(k)),new pe(S,k)}for(S=I;0<=j.l(k);){for(E=Math.max(1,Math.floor(j.m()/k.m())),N=Math.ceil(Math.log(E)/Math.LN2),N=48>=N?1:Math.pow(2,N-48),C=b(E),T=C.j(k);Q(T)||0<T.l(j);)E-=N,C=b(E),T=C.j(k);z(C)&&(C=A),S=S.add(C),j=_e(j,T)}return new pe(S,j)}n.A=function(j){return me(this,j).h},n.and=function(j){for(var k=Math.max(this.g.length,j.g.length),E=[],N=0;N<k;N++)E[N]=this.i(N)&j.i(N);return new l(E,this.h&j.h)},n.or=function(j){for(var k=Math.max(this.g.length,j.g.length),E=[],N=0;N<k;N++)E[N]=this.i(N)|j.i(N);return new l(E,this.h|j.h)},n.xor=function(j){for(var k=Math.max(this.g.length,j.g.length),E=[],N=0;N<k;N++)E[N]=this.i(N)^j.i(N);return new l(E,this.h^j.h)};function tt(j){for(var k=j.g.length+1,E=[],N=0;N<k;N++)E[N]=j.i(N)<<1|j.i(N-1)>>>31;return new l(E,j.h)}function Fe(j,k){var E=k>>5;k%=32;for(var N=j.g.length-E,S=[],C=0;C<N;C++)S[C]=0<k?j.i(C+E)>>>k|j.i(C+E+1)<<32-k:j.i(C+E);return new l(S,j.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Rh=s,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=b,l.fromString=v,Vs=l}).apply(typeof qu<"u"?qu:typeof self<"u"?self:typeof window<"u"?window:{});var ia=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jh,so,Dh,pa,Gl,Oh,Vh,Mh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,d,m){return i==Array.prototype||i==Object.prototype||(i[d]=m.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof ia=="object"&&ia];for(var d=0;d<i.length;++d){var m=i[d];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var s=t(this);function r(i,d){if(d)e:{var m=s;i=i.split(".");for(var _=0;_<i.length-1;_++){var D=i[_];if(!(D in m))break e;m=m[D]}i=i[i.length-1],_=m[i],d=d(_),d!=_&&d!=null&&e(m,i,{configurable:!0,writable:!0,value:d})}}function o(i,d){i instanceof String&&(i+="");var m=0,_=!1,D={next:function(){if(!_&&m<i.length){var F=m++;return{value:d(F,i[F]),done:!1}}return _=!0,{done:!0,value:void 0}}};return D[Symbol.iterator]=function(){return D},D}r("Array.prototype.values",function(i){return i||function(){return o(this,function(d,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function p(i){var d=typeof i;return d=d!="object"?d:i?Array.isArray(i)?"array":d:"null",d=="array"||d=="object"&&typeof i.length=="number"}function b(i){var d=typeof i;return d=="object"&&i!=null||d=="function"}function v(i,d,m){return i.call.apply(i.bind,arguments)}function I(i,d,m){if(!i)throw Error();if(2<arguments.length){var _=Array.prototype.slice.call(arguments,2);return function(){var D=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(D,_),i.apply(d,D)}}return function(){return i.apply(d,arguments)}}function A(i,d,m){return A=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?v:I,A.apply(null,arguments)}function M(i,d){var m=Array.prototype.slice.call(arguments,1);return function(){var _=m.slice();return _.push.apply(_,arguments),i.apply(this,_)}}function z(i,d){function m(){}m.prototype=d.prototype,i.aa=d.prototype,i.prototype=new m,i.prototype.constructor=i,i.Qb=function(_,D,F){for(var K=Array(arguments.length-2),Oe=2;Oe<arguments.length;Oe++)K[Oe-2]=arguments[Oe];return d.prototype[D].apply(_,K)}}function Q(i){const d=i.length;if(0<d){const m=Array(d);for(let _=0;_<d;_++)m[_]=i[_];return m}return[]}function J(i,d){for(let m=1;m<arguments.length;m++){const _=arguments[m];if(p(_)){const D=i.length||0,F=_.length||0;i.length=D+F;for(let K=0;K<F;K++)i[D+K]=_[K]}else i.push(_)}}class _e{constructor(d,m){this.i=d,this.j=m,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function oe(i){return/^[\s\xa0]*$/.test(i)}function pe(){var i=h.navigator;return i&&(i=i.userAgent)?i:""}function me(i){return me[" "](i),i}me[" "]=function(){};var tt=pe().indexOf("Gecko")!=-1&&!(pe().toLowerCase().indexOf("webkit")!=-1&&pe().indexOf("Edge")==-1)&&!(pe().indexOf("Trident")!=-1||pe().indexOf("MSIE")!=-1)&&pe().indexOf("Edge")==-1;function Fe(i,d,m){for(const _ in i)d.call(m,i[_],_,i)}function j(i,d){for(const m in i)d.call(void 0,i[m],m,i)}function k(i){const d={};for(const m in i)d[m]=i[m];return d}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function N(i,d){let m,_;for(let D=1;D<arguments.length;D++){_=arguments[D];for(m in _)i[m]=_[m];for(let F=0;F<E.length;F++)m=E[F],Object.prototype.hasOwnProperty.call(_,m)&&(i[m]=_[m])}}function S(i){var d=1;i=i.split(":");const m=[];for(;0<d&&i.length;)m.push(i.shift()),d--;return i.length&&m.push(i.join(":")),m}function C(i){h.setTimeout(()=>{throw i},0)}function T(){var i=Le;let d=null;return i.g&&(d=i.g,i.g=i.g.next,i.g||(i.h=null),d.next=null),d}class Xe{constructor(){this.h=this.g=null}add(d,m){const _=Ae.get();_.set(d,m),this.h?this.h.next=_:this.g=_,this.h=_}}var Ae=new _e(()=>new Ws,i=>i.reset());class Ws{constructor(){this.next=this.g=this.h=null}set(d,m){this.h=d,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let rt,Ye=!1,Le=new Xe,Gt=()=>{const i=h.Promise.resolve(void 0);rt=()=>{i.then(Ve)}};var Ve=()=>{for(var i;i=T();){try{i.h.call(i.g)}catch(m){C(m)}var d=Ae;d.j(i),100>d.h&&(d.h++,i.next=d.g,d.g=i)}Ye=!1};function _n(){this.s=this.s,this.C=this.C}_n.prototype.s=!1,_n.prototype.ma=function(){this.s||(this.s=!0,this.N())},_n.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function yt(i,d){this.type=i,this.g=this.target=d,this.defaultPrevented=!1}yt.prototype.h=function(){this.defaultPrevented=!0};var ru=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var i=!1,d=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const m=()=>{};h.addEventListener("test",m,d),h.removeEventListener("test",m,d)}catch{}return i})();function Tr(i,d){if(yt.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var m=this.type=i.type,_=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=d,d=i.relatedTarget){if(tt){e:{try{me(d.nodeName);var D=!0;break e}catch{}D=!1}D||(d=null)}}else m=="mouseover"?d=i.fromElement:m=="mouseout"&&(d=i.toElement);this.relatedTarget=d,_?(this.clientX=_.clientX!==void 0?_.clientX:_.pageX,this.clientY=_.clientY!==void 0?_.clientY:_.pageY,this.screenX=_.screenX||0,this.screenY=_.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Re[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Tr.aa.h.call(this)}}z(Tr,yt);var Re={2:"touch",3:"pen",4:"mouse"};Tr.prototype.h=function(){Tr.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Kt="closure_listenable_"+(1e6*Math.random()|0),Ir=0;function Do(i,d,m,_,D){this.listener=i,this.proxy=null,this.src=d,this.type=m,this.capture=!!_,this.ha=D,this.key=++Ir,this.da=this.fa=!1}function Y(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Et(i){this.src=i,this.g={},this.h=0}Et.prototype.add=function(i,d,m,_,D){var F=i.toString();i=this.g[F],i||(i=this.g[F]=[],this.h++);var K=Ar(i,d,_,D);return-1<K?(d=i[K],m||(d.fa=!1)):(d=new Do(d,this.src,F,!!_,D),d.fa=m,i.push(d)),d};function Oo(i,d){var m=d.type;if(m in i.g){var _=i.g[m],D=Array.prototype.indexOf.call(_,d,void 0),F;(F=0<=D)&&Array.prototype.splice.call(_,D,1),F&&(Y(d),i.g[m].length==0&&(delete i.g[m],i.h--))}}function Ar(i,d,m,_){for(var D=0;D<i.length;++D){var F=i[D];if(!F.da&&F.listener==d&&F.capture==!!m&&F.ha==_)return D}return-1}var Gs="closure_lm_"+(1e6*Math.random()|0),Jt={};function nt(i,d,m,_,D){if(Array.isArray(d)){for(var F=0;F<d.length;F++)nt(i,d[F],m,_,D);return null}return m=Ks(m),i&&i[Kt]?i.K(d,m,b(_)?!!_.capture:!1,D):St(i,d,m,!1,_,D)}function St(i,d,m,_,D,F){if(!d)throw Error("Invalid event type");var K=b(D)?!!D.capture:!!D,Oe=Ei(i);if(Oe||(i[Gs]=Oe=new Et(i)),m=Oe.add(d,m,_,K,F),m.proxy)return m;if(_=$t(),m.proxy=_,_.src=i,_.listener=m,i.addEventListener)ru||(D=K),D===void 0&&(D=!1),i.addEventListener(d.toString(),_,D);else if(i.attachEvent)i.attachEvent(cn(d.toString()),_);else if(i.addListener&&i.removeListener)i.addListener(_);else throw Error("addEventListener and attachEvent are unavailable.");return m}function $t(){function i(m){return d.call(i.src,i.listener,m)}const d=Vo;return i}function an(i,d,m,_,D){if(Array.isArray(d))for(var F=0;F<d.length;F++)an(i,d[F],m,_,D);else _=b(_)?!!_.capture:!!_,m=Ks(m),i&&i[Kt]?(i=i.i,d=String(d).toString(),d in i.g&&(F=i.g[d],m=Ar(F,m,_,D),-1<m&&(Y(F[m]),Array.prototype.splice.call(F,m,1),F.length==0&&(delete i.g[d],i.h--)))):i&&(i=Ei(i))&&(d=i.g[d.toString()],i=-1,d&&(i=Ar(d,m,_,D)),(m=-1<i?d[i]:null)&&ln(m))}function ln(i){if(typeof i!="number"&&i&&!i.da){var d=i.src;if(d&&d[Kt])Oo(d.i,i);else{var m=i.type,_=i.proxy;d.removeEventListener?d.removeEventListener(m,_,i.capture):d.detachEvent?d.detachEvent(cn(m),_):d.addListener&&d.removeListener&&d.removeListener(_),(m=Ei(d))?(Oo(m,i),m.h==0&&(m.src=null,d[Gs]=null)):Y(i)}}}function cn(i){return i in Jt?Jt[i]:Jt[i]="on"+i}function Vo(i,d){if(i.da)i=!0;else{d=new Tr(d,this);var m=i.listener,_=i.ha||i.src;i.fa&&ln(i),i=m.call(_,d)}return i}function Ei(i){return i=i[Gs],i instanceof Et?i:null}var us="__closure_events_fn_"+(1e9*Math.random()>>>0);function Ks(i){return typeof i=="function"?i:(i[us]||(i[us]=function(d){return i.handleEvent(d)}),i[us])}function ct(){_n.call(this),this.i=new Et(this),this.M=this,this.F=null}z(ct,_n),ct.prototype[Kt]=!0,ct.prototype.removeEventListener=function(i,d,m,_){an(this,i,d,m,_)};function ut(i,d){var m,_=i.F;if(_)for(m=[];_;_=_.F)m.push(_);if(i=i.M,_=d.type||d,typeof d=="string")d=new yt(d,i);else if(d instanceof yt)d.target=d.target||i;else{var D=d;d=new yt(_,i),N(d,D)}if(D=!0,m)for(var F=m.length-1;0<=F;F--){var K=d.g=m[F];D=Bn(K,_,!0,d)&&D}if(K=d.g=i,D=Bn(K,_,!0,d)&&D,D=Bn(K,_,!1,d)&&D,m)for(F=0;F<m.length;F++)K=d.g=m[F],D=Bn(K,_,!1,d)&&D}ct.prototype.N=function(){if(ct.aa.N.call(this),this.i){var i=this.i,d;for(d in i.g){for(var m=i.g[d],_=0;_<m.length;_++)Y(m[_]);delete i.g[d],i.h--}}this.F=null},ct.prototype.K=function(i,d,m,_){return this.i.add(String(i),d,!1,m,_)},ct.prototype.L=function(i,d,m,_){return this.i.add(String(i),d,!0,m,_)};function Bn(i,d,m,_){if(d=i.i.g[String(d)],!d)return!0;d=d.concat();for(var D=!0,F=0;F<d.length;++F){var K=d[F];if(K&&!K.da&&K.capture==m){var Oe=K.listener,it=K.ha||K.src;K.fa&&Oo(i.i,K),D=Oe.call(it,_)!==!1&&D}}return D&&!_.defaultPrevented}function Ti(i,d,m){if(typeof i=="function")m&&(i=A(i,m));else if(i&&typeof i.handleEvent=="function")i=A(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:h.setTimeout(i,d||0)}function Mo(i){i.g=Ti(()=>{i.g=null,i.i&&(i.i=!1,Mo(i))},i.l);const d=i.h;i.h=null,i.m.apply(null,d)}class Fo extends _n{constructor(d,m){super(),this.m=d,this.l=m,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:Mo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ds(i){_n.call(this),this.h=i,this.g={}}z(ds,_n);var wn=[];function dt(i){Fe(i.g,function(d,m){this.g.hasOwnProperty(m)&&ln(d)},i),i.g={}}ds.prototype.N=function(){ds.aa.N.call(this),dt(this)},ds.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ze=h.JSON.stringify,ze=h.JSON.parse,Js=class{stringify(i){return h.JSON.stringify(i,void 0)}parse(i){return h.JSON.parse(i,void 0)}};function je(){}je.prototype.h=null;function qn(i){return i.h||(i.h=i.i())}function ht(){}var Zt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function kr(){yt.call(this,"d")}z(kr,yt);function Sr(){yt.call(this,"c")}z(Sr,yt);var En={},Ii=null;function Qs(){return Ii=Ii||new ct}En.La="serverreachability";function Ai(i){yt.call(this,En.La,i)}z(Ai,yt);function hs(i){const d=Qs();ut(d,new Ai(d))}En.STAT_EVENT="statevent";function ki(i,d){yt.call(this,En.STAT_EVENT,i),this.stat=d}z(ki,yt);function H(i){const d=Qs();ut(d,new ki(d,i))}En.Ma="timingevent";function ae(i,d){yt.call(this,En.Ma,i),this.size=d}z(ae,yt);function Hn(i,d){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){i()},d)}function Wn(){this.g=!0}Wn.prototype.xa=function(){this.g=!1};function Si(i,d,m,_,D,F){i.info(function(){if(i.g)if(F)for(var K="",Oe=F.split("&"),it=0;it<Oe.length;it++){var ve=Oe[it].split("=");if(1<ve.length){var ft=ve[0];ve=ve[1];var Ee=ft.split("_");K=2<=Ee.length&&Ee[1]=="type"?K+(ft+"="+ve+"&"):K+(ft+"=redacted&")}}else K=null;else K=F;return"XMLHTTP REQ ("+_+") [attempt "+D+"]: "+d+`
`+m+`
`+K})}function Xs(i,d,m,_,D,F,K){i.info(function(){return"XMLHTTP RESP ("+_+") [ attempt "+D+"]: "+d+`
`+m+`
`+F+" "+K})}function fs(i,d,m,_){i.info(function(){return"XMLHTTP TEXT ("+d+"): "+fl(i,m)+(_?" "+_:"")})}function Nr(i,d){i.info(function(){return"TIMEOUT: "+d})}Wn.prototype.info=function(){};function fl(i,d){if(!i.g)return d;if(!d)return null;try{var m=JSON.parse(d);if(m){for(i=0;i<m.length;i++)if(Array.isArray(m[i])){var _=m[i];if(!(2>_.length)){var D=_[1];if(Array.isArray(D)&&!(1>D.length)){var F=D[0];if(F!="noop"&&F!="stop"&&F!="close")for(var K=1;K<D.length;K++)D[K]=""}}}}return Ze(m)}catch{return d}}var Cr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Pr={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Rr;function jr(){}z(jr,je),jr.prototype.g=function(){return new XMLHttpRequest},jr.prototype.i=function(){return{}},Rr=new jr;function Tn(i,d,m,_){this.j=i,this.i=d,this.l=m,this.R=_||1,this.U=new ds(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Lo}function Lo(){this.i=null,this.g="",this.h=!1}var Be={},ps={};function Ut(i,d,m){i.L=1,i.v=Fr(Tt(d)),i.m=m,i.P=!0,ms(i,null)}function ms(i,d){i.F=Date.now(),ne(i),i.A=Tt(i.v);var m=i.A,_=i.R;Array.isArray(_)||(_=[String(_)]),Ri(m.i,"t",_),i.C=0,m=i.j.J,i.h=new Lo,i.g=qt(i.j,m?d:null,!i.m),0<i.O&&(i.M=new Fo(A(i.Y,i,i.g),i.O)),d=i.U,m=i.g,_=i.ca;var D="readystatechange";Array.isArray(D)||(D&&(wn[0]=D.toString()),D=wn);for(var F=0;F<D.length;F++){var K=nt(m,D[F],_||d.handleEvent,!1,d.h||d);if(!K)break;d.g[K.key]=K}d=i.H?k(i.H):{},i.m?(i.u||(i.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,d)):(i.u="GET",i.g.ea(i.A,i.u,null,d)),hs(),Si(i.i,i.u,i.A,i.l,i.R,i.m)}Tn.prototype.ca=function(i){i=i.target;const d=this.M;d&&Ft(i)==3?d.j():this.Y(i)},Tn.prototype.Y=function(i){try{if(i==this.g)e:{const Ee=Ft(this.g);var d=this.g.Ba();const Lt=this.g.Z();if(!(3>Ee)&&(Ee!=3||this.g&&(this.h.h||this.g.oa()||zr(this.g)))){this.J||Ee!=4||d==7||(d==8||0>=Lt?hs(3):hs(2)),$o(this);var m=this.g.Z();this.X=m;t:if(Dr(this)){var _=zr(this.g);i="";var D=_.length,F=Ft(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){In(this),Qt(this);var K="";break t}this.h.i=new h.TextDecoder}for(d=0;d<D;d++)this.h.h=!0,i+=this.h.i.decode(_[d],{stream:!(F&&d==D-1)});_.length=0,this.h.g+=i,this.C=0,K=this.h.g}else K=this.g.oa();if(this.o=m==200,Xs(this.i,this.u,this.A,this.l,this.R,Ee,m),this.o){if(this.T&&!this.K){t:{if(this.g){var Oe,it=this.g;if((Oe=it.g?it.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!oe(Oe)){var ve=Oe;break t}}ve=null}if(m=ve)fs(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,gs(this,m);else{this.o=!1,this.s=3,H(12),In(this),Qt(this);break e}}if(this.P){m=!0;let Ct;for(;!this.J&&this.C<K.length;)if(Ct=iu(this,K),Ct==ps){Ee==4&&(this.s=4,H(14),m=!1),fs(this.i,this.l,null,"[Incomplete Response]");break}else if(Ct==Be){this.s=4,H(15),fs(this.i,this.l,K,"[Invalid Chunk]"),m=!1;break}else fs(this.i,this.l,Ct,null),gs(this,Ct);if(Dr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ee!=4||K.length!=0||this.h.h||(this.s=1,H(16),m=!1),this.o=this.o&&m,!m)fs(this.i,this.l,K,"[Invalid Chunked Response]"),In(this),Qt(this);else if(0<K.length&&!this.W){this.W=!0;var ft=this.j;ft.g==this&&ft.ba&&!ft.M&&(ft.j.info("Great, no buffering proxy detected. Bytes received: "+K.length),Cn(ft),ft.M=!0,H(11))}}else fs(this.i,this.l,K,null),gs(this,K);Ee==4&&In(this),this.o&&!this.J&&(Ee==4?Hi(this.j,this):(this.o=!1,ne(this)))}else Wo(this.g),m==400&&0<K.indexOf("Unknown SID")?(this.s=3,H(12)):(this.s=0,H(13)),In(this),Qt(this)}}}catch{}finally{}};function Dr(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function iu(i,d){var m=i.C,_=d.indexOf(`
`,m);return _==-1?ps:(m=Number(d.substring(m,_)),isNaN(m)?Be:(_+=1,_+m>d.length?ps:(d=d.slice(_,_+m),i.C=_+m,d)))}Tn.prototype.cancel=function(){this.J=!0,In(this)};function ne(i){i.S=Date.now()+i.I,pl(i,i.I)}function pl(i,d){if(i.B!=null)throw Error("WatchDog timer not null");i.B=Hn(A(i.ba,i),d)}function $o(i){i.B&&(h.clearTimeout(i.B),i.B=null)}Tn.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Nr(this.i,this.A),this.L!=2&&(hs(),H(17)),In(this),this.s=2,Qt(this)):pl(this,this.S-i)};function Qt(i){i.j.G==0||i.J||Hi(i.j,i)}function In(i){$o(i);var d=i.M;d&&typeof d.ma=="function"&&d.ma(),i.M=null,dt(i.U),i.g&&(d=i.g,i.g=null,d.abort(),d.ma())}function gs(i,d){try{var m=i.j;if(m.G!=0&&(m.g==i||Ci(m.h,i))){if(!i.K&&Ci(m.h,i)&&m.G==3){try{var _=m.Da.g.parse(d)}catch{_=null}if(Array.isArray(_)&&_.length==3){var D=_;if(D[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<i.F)_s(m),dn(m);else break e;qi(m),H(18)}}else m.za=D[1],0<m.za-m.T&&37500>D[2]&&m.F&&m.v==0&&!m.C&&(m.C=Hn(A(m.Za,m),6e3));if(1>=An(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else Xn(m,11)}else if((i.K||m.g==i)&&_s(m),!oe(d))for(D=m.Da.g.parse(d),d=0;d<D.length;d++){let ve=D[d];if(m.T=ve[0],ve=ve[1],m.G==2)if(ve[0]=="c"){m.K=ve[1],m.ia=ve[2];const ft=ve[3];ft!=null&&(m.la=ft,m.j.info("VER="+m.la));const Ee=ve[4];Ee!=null&&(m.Aa=Ee,m.j.info("SVER="+m.Aa));const Lt=ve[5];Lt!=null&&typeof Lt=="number"&&0<Lt&&(_=1.5*Lt,m.L=_,m.j.info("backChannelRequestTimeoutMs_="+_)),_=m;const Ct=i.g;if(Ct){const qr=Ct.g?Ct.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(qr){var F=_.h;F.g||qr.indexOf("spdy")==-1&&qr.indexOf("quic")==-1&&qr.indexOf("h2")==-1||(F.j=F.l,F.g=new Set,F.h&&(Uo(F,F.h),F.h=null))}if(_.D){const Hr=Ct.g?Ct.g.getResponseHeader("X-HTTP-Session-Id"):null;Hr&&(_.ya=Hr,De(_.I,_.D,Hr))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-i.F,m.j.info("Handshake RTT: "+m.R+"ms")),_=m;var K=i;if(_.qa=Qo(_,_.J?_.ia:null,_.W),K.K){ml(_.h,K);var Oe=K,it=_.L;it&&(Oe.I=it),Oe.B&&($o(Oe),ne(Oe)),_.g=K}else Bi(_);0<m.i.length&&ir(m)}else ve[0]!="stop"&&ve[0]!="close"||Xn(m,7);else m.G==3&&(ve[0]=="stop"||ve[0]=="close"?ve[0]=="stop"?Xn(m,7):Br(m):ve[0]!="noop"&&m.l&&m.l.ta(ve),m.v=0)}}hs(4)}catch{}}var Ni=class{constructor(i,d){this.g=i,this.map=d}};function Ys(i){this.l=i||10,h.PerformanceNavigationTiming?(i=h.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Or(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function An(i){return i.h?1:i.g?i.g.size:0}function Ci(i,d){return i.h?i.h==d:i.g?i.g.has(d):!1}function Uo(i,d){i.g?i.g.add(d):i.h=d}function ml(i,d){i.h&&i.h==d?i.h=null:i.g&&i.g.has(d)&&i.g.delete(d)}Ys.prototype.cancel=function(){if(this.i=Gn(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Gn(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let d=i.i;for(const m of i.g.values())d=d.concat(m.D);return d}return Q(i.i)}function Vr(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(p(i)){for(var d=[],m=i.length,_=0;_<m;_++)d.push(i[_]);return d}d=[],m=0;for(_ in i)d[m++]=i[_];return d}function zo(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(p(i)||typeof i=="string"){var d=[];i=i.length;for(var m=0;m<i;m++)d.push(m);return d}d=[],m=0;for(const _ in i)d[m++]=_;return d}}}function Ne(i,d){if(i.forEach&&typeof i.forEach=="function")i.forEach(d,void 0);else if(p(i)||typeof i=="string")Array.prototype.forEach.call(i,d,void 0);else for(var m=zo(i),_=Vr(i),D=_.length,F=0;F<D;F++)d.call(void 0,_[F],m&&m[F],i)}var kn=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Mr(i,d){if(i){i=i.split("&");for(var m=0;m<i.length;m++){var _=i[m].indexOf("="),D=null;if(0<=_){var F=i[m].substring(0,_);D=i[m].substring(_+1)}else F=i[m];d(F,D?decodeURIComponent(D.replace(/\+/g," ")):"")}}}function en(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof en){this.h=i.h,Kn(this,i.j),this.o=i.o,this.g=i.g,Nt(this,i.s),this.l=i.l;var d=i.i,m=new Jn;m.i=d.i,d.g&&(m.g=new Map(d.g),m.h=d.h),Zs(this,m),this.m=i.m}else i&&(d=String(i).match(kn))?(this.h=!1,Kn(this,d[1]||"",!0),this.o=bt(d[2]||""),this.g=bt(d[3]||"",!0),Nt(this,d[4]),this.l=bt(d[5]||"",!0),Zs(this,d[6]||"",!0),this.m=bt(d[7]||"")):(this.h=!1,this.i=new Jn(null,this.h))}en.prototype.toString=function(){var i=[],d=this.j;d&&i.push(er(d,Bo,!0),":");var m=this.g;return(m||d=="file")&&(i.push("//"),(d=this.o)&&i.push(er(d,Bo,!0),"@"),i.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&i.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&i.push("/"),i.push(er(m,m.charAt(0)=="/"?Lr:gl,!0))),(m=this.i.toString())&&i.push("?",m),(m=this.m)&&i.push("#",er(m,vs)),i.join("")};function Tt(i){return new en(i)}function Kn(i,d,m){i.j=m?bt(d,!0):d,i.j&&(i.j=i.j.replace(/:$/,""))}function Nt(i,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);i.s=d}else i.s=null}function Zs(i,d,m){d instanceof Jn?(i.i=d,yl(i.i,i.h)):(m||(d=er(d,bs)),i.i=new Jn(d,i.h))}function De(i,d,m){i.i.set(d,m)}function Fr(i){return De(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function bt(i,d){return i?d?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function er(i,d,m){return typeof i=="string"?(i=encodeURI(i).replace(d,ys),m&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function ys(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Bo=/[#\/\?@]/g,gl=/[#\?:]/g,Lr=/[#\?]/g,bs=/[#\?@]/g,vs=/#/g;function Jn(i,d){this.h=this.g=null,this.i=i||null,this.j=!!d}function zt(i){i.g||(i.g=new Map,i.h=0,i.i&&Mr(i.i,function(d,m){i.add(decodeURIComponent(d.replace(/\+/g," ")),m)}))}n=Jn.prototype,n.add=function(i,d){zt(this),this.i=null,i=Sn(this,i);var m=this.g.get(i);return m||this.g.set(i,m=[]),m.push(d),this.h+=1,this};function tr(i,d){zt(i),d=Sn(i,d),i.g.has(d)&&(i.i=null,i.h-=i.g.get(d).length,i.g.delete(d))}function Pi(i,d){return zt(i),d=Sn(i,d),i.g.has(d)}n.forEach=function(i,d){zt(this),this.g.forEach(function(m,_){m.forEach(function(D){i.call(d,D,_,this)},this)},this)},n.na=function(){zt(this);const i=Array.from(this.g.values()),d=Array.from(this.g.keys()),m=[];for(let _=0;_<d.length;_++){const D=i[_];for(let F=0;F<D.length;F++)m.push(d[_])}return m},n.V=function(i){zt(this);let d=[];if(typeof i=="string")Pi(this,i)&&(d=d.concat(this.g.get(Sn(this,i))));else{i=Array.from(this.g.values());for(let m=0;m<i.length;m++)d=d.concat(i[m])}return d},n.set=function(i,d){return zt(this),this.i=null,i=Sn(this,i),Pi(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[d]),this.h+=1,this},n.get=function(i,d){return i?(i=this.V(i),0<i.length?String(i[0]):d):d};function Ri(i,d,m){tr(i,d),0<m.length&&(i.i=null,i.g.set(Sn(i,d),Q(m)),i.h+=m.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],d=Array.from(this.g.keys());for(var m=0;m<d.length;m++){var _=d[m];const F=encodeURIComponent(String(_)),K=this.V(_);for(_=0;_<K.length;_++){var D=F;K[_]!==""&&(D+="="+encodeURIComponent(String(K[_]))),i.push(D)}}return this.i=i.join("&")};function Sn(i,d){return d=String(d),i.j&&(d=d.toLowerCase()),d}function yl(i,d){d&&!i.j&&(zt(i),i.i=null,i.g.forEach(function(m,_){var D=_.toLowerCase();_!=D&&(tr(this,_),Ri(this,D,m))},i)),i.j=d}function ji(i,d){const m=new Wn;if(h.Image){const _=new Image;_.onload=M(un,m,"TestLoadImage: loaded",!0,d,_),_.onerror=M(un,m,"TestLoadImage: error",!1,d,_),_.onabort=M(un,m,"TestLoadImage: abort",!1,d,_),_.ontimeout=M(un,m,"TestLoadImage: timeout",!1,d,_),h.setTimeout(function(){_.ontimeout&&_.ontimeout()},1e4),_.src=i}else d(!1)}function ou(i,d){const m=new Wn,_=new AbortController,D=setTimeout(()=>{_.abort(),un(m,"TestPingServer: timeout",!1,d)},1e4);fetch(i,{signal:_.signal}).then(F=>{clearTimeout(D),F.ok?un(m,"TestPingServer: ok",!0,d):un(m,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(D),un(m,"TestPingServer: error",!1,d)})}function un(i,d,m,_,D){try{D&&(D.onload=null,D.onerror=null,D.onabort=null,D.ontimeout=null),_(m)}catch{}}function Di(){this.g=new Js}function qo(i,d,m){const _=m||"";try{Ne(i,function(D,F){let K=D;b(D)&&(K=Ze(D)),d.push(_+F+"="+encodeURIComponent(K))})}catch(D){throw d.push(_+"type="+encodeURIComponent("_badmap")),D}}function nr(i){this.l=i.Ub||null,this.j=i.eb||!1}z(nr,je),nr.prototype.g=function(){return new $r(this.l,this.j)},nr.prototype.i=(function(i){return function(){return i}})({});function $r(i,d){ct.call(this),this.D=i,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}z($r,ct),n=$r.prototype,n.open=function(i,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=d,this.readyState=1,rr(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(d.body=i),(this.D||h).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,sr(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,rr(this)),this.g&&(this.readyState=3,rr(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Oi(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function Oi(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var d=i.value?i.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!i.done}))&&(this.response=this.responseText+=d)}i.done?sr(this):rr(this),this.readyState==3&&Oi(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,sr(this))},n.Qa=function(i){this.g&&(this.response=i,sr(this))},n.ga=function(){this.g&&sr(this)};function sr(i){i.readyState=4,i.l=null,i.j=null,i.v=null,rr(i)}n.setRequestHeader=function(i,d){this.u.append(i,d)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],d=this.h.entries();for(var m=d.next();!m.done;)m=m.value,i.push(m[0]+": "+m[1]),m=d.next();return i.join(`\r
`)};function rr(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty($r.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Vi(i){let d="";return Fe(i,function(m,_){d+=_,d+=":",d+=m,d+=`\r
`}),d}function et(i,d,m){e:{for(_ in m){var _=!1;break e}_=!0}_||(m=Vi(m),typeof i=="string"?m!=null&&encodeURIComponent(String(m)):De(i,d,m))}function qe(i){ct.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}z(qe,ct);var Mi=/^https?$/i,bl=["POST","PUT"];n=qe.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,d,m,_){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);d=d?d.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Rr.g(),this.v=this.o?qn(this.o):qn(Rr),this.g.onreadystatechange=A(this.Ea,this);try{this.B=!0,this.g.open(d,String(i),!0),this.B=!1}catch(F){Ho(this,F);return}if(i=m||"",m=new Map(this.headers),_)if(Object.getPrototypeOf(_)===Object.prototype)for(var D in _)m.set(D,_[D]);else if(typeof _.keys=="function"&&typeof _.get=="function")for(const F of _.keys())m.set(F,_.get(F));else throw Error("Unknown input type for opt_headers: "+String(_));_=Array.from(m.keys()).find(F=>F.toLowerCase()=="content-type"),D=h.FormData&&i instanceof h.FormData,!(0<=Array.prototype.indexOf.call(bl,d,void 0))||_||D||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[F,K]of m)this.g.setRequestHeader(F,K);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Fi(this),this.u=!0,this.g.send(i),this.u=!1}catch(F){Ho(this,F)}};function Ho(i,d){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=d,i.m=5,xs(i),Nn(i)}function xs(i){i.A||(i.A=!0,ut(i,"complete"),ut(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ut(this,"complete"),ut(this,"abort"),Nn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Nn(this,!0)),qe.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Ur(this):this.bb())},n.bb=function(){Ur(this)};function Ur(i){if(i.h&&typeof l<"u"&&(!i.v[1]||Ft(i)!=4||i.Z()!=2)){if(i.u&&Ft(i)==4)Ti(i.Ea,0,i);else if(ut(i,"readystatechange"),Ft(i)==4){i.h=!1;try{const K=i.Z();e:switch(K){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var m;if(!(m=d)){var _;if(_=K===0){var D=String(i.D).match(kn)[1]||null;!D&&h.self&&h.self.location&&(D=h.self.location.protocol.slice(0,-1)),_=!Mi.test(D?D.toLowerCase():"")}m=_}if(m)ut(i,"complete"),ut(i,"success");else{i.m=6;try{var F=2<Ft(i)?i.g.statusText:""}catch{F=""}i.l=F+" ["+i.Z()+"]",xs(i)}}finally{Nn(i)}}}}function Nn(i,d){if(i.g){Fi(i);const m=i.g,_=i.v[0]?()=>{}:null;i.g=null,i.v=null,d||ut(i,"ready");try{m.onreadystatechange=_}catch{}}}function Fi(i){i.I&&(h.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function Ft(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<Ft(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var d=this.g.responseText;return i&&d.indexOf(i)==0&&(d=d.substring(i.length)),ze(d)}};function zr(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Wo(i){const d={};i=(i.g&&2<=Ft(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let _=0;_<i.length;_++){if(oe(i[_]))continue;var m=S(i[_]);const D=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const F=d[D]||[];d[D]=F,F.push(m)}j(d,function(_){return _.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function tn(i,d,m){return m&&m.internalChannelParams&&m.internalChannelParams[i]||d}function Go(i){this.Aa=0,this.i=[],this.j=new Wn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tn("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tn("baseRetryDelayMs",5e3,i),this.cb=tn("retryDelaySeedMs",1e4,i),this.Wa=tn("forwardChannelMaxRetries",2,i),this.wa=tn("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Ys(i&&i.concurrentRequestLimit),this.Da=new Di,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Go.prototype,n.la=8,n.G=1,n.connect=function(i,d,m,_){H(0),this.W=i,this.H=d||{},m&&_!==void 0&&(this.H.OSID=m,this.H.OAID=_),this.F=this.X,this.I=Qo(this,null,this.W),ir(this)};function Br(i){if(Li(i),i.G==3){var d=i.U++,m=Tt(i.I);if(De(m,"SID",i.K),De(m,"RID",d),De(m,"TYPE","terminate"),Bt(i,m),d=new Tn(i,i.j,d),d.L=2,d.v=Fr(Tt(m)),m=!1,h.navigator&&h.navigator.sendBeacon)try{m=h.navigator.sendBeacon(d.v.toString(),"")}catch{}!m&&h.Image&&(new Image().src=d.v,m=!0),m||(d.g=qt(d.j,null),d.g.ea(d.v)),d.F=Date.now(),ne(d)}Jo(i)}function dn(i){i.g&&(Cn(i),i.g.cancel(),i.g=null)}function Li(i){dn(i),i.u&&(h.clearTimeout(i.u),i.u=null),_s(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&h.clearTimeout(i.s),i.s=null)}function ir(i){if(!Or(i.h)&&!i.s){i.s=!0;var d=i.Ga;rt||Gt(),Ye||(rt(),Ye=!0),Le.add(d,i),i.B=0}}function $i(i,d){return An(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=d.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=Hn(A(i.Ga,i,d),Qn(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const D=new Tn(this,this.j,i);let F=this.o;if(this.S&&(F?(F=k(F),N(F,this.S)):F=this.S),this.m!==null||this.O||(D.H=F,F=null),this.P)e:{for(var d=0,m=0;m<this.i.length;m++){t:{var _=this.i[m];if("__data__"in _.map&&(_=_.map.__data__,typeof _=="string")){_=_.length;break t}_=void 0}if(_===void 0)break;if(d+=_,4096<d){d=m;break e}if(d===4096||m===this.i.length-1){d=m+1;break e}}d=1e3}else d=1e3;d=zi(this,D,d),m=Tt(this.I),De(m,"RID",i),De(m,"CVER",22),this.D&&De(m,"X-HTTP-Session-Id",this.D),Bt(this,m),F&&(this.O?d="headers="+encodeURIComponent(String(Vi(F)))+"&"+d:this.m&&et(m,this.m,F)),Uo(this.h,D),this.Ua&&De(m,"TYPE","init"),this.P?(De(m,"$req",d),De(m,"SID","null"),D.T=!0,Ut(D,m,null)):Ut(D,m,d),this.G=2}}else this.G==3&&(i?Ui(this,i):this.i.length==0||Or(this.h)||Ui(this))};function Ui(i,d){var m;d?m=d.l:m=i.U++;const _=Tt(i.I);De(_,"SID",i.K),De(_,"RID",m),De(_,"AID",i.T),Bt(i,_),i.m&&i.o&&et(_,i.m,i.o),m=new Tn(i,i.j,m,i.B+1),i.m===null&&(m.H=i.o),d&&(i.i=d.D.concat(i.i)),d=zi(i,m,1e3),m.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),Uo(i.h,m),Ut(m,_,d)}function Bt(i,d){i.H&&Fe(i.H,function(m,_){De(d,_,m)}),i.l&&Ne({},function(m,_){De(d,_,m)})}function zi(i,d,m){m=Math.min(i.i.length,m);var _=i.l?A(i.l.Na,i.l,i):null;e:{var D=i.i;let F=-1;for(;;){const K=["count="+m];F==-1?0<m?(F=D[0].g,K.push("ofs="+F)):F=0:K.push("ofs="+F);let Oe=!0;for(let it=0;it<m;it++){let ve=D[it].g;const ft=D[it].map;if(ve-=F,0>ve)F=Math.max(0,D[it].g-100),Oe=!1;else try{qo(ft,K,"req"+ve+"_")}catch{_&&_(ft)}}if(Oe){_=K.join("&");break e}}}return i=i.i.splice(0,m),d.D=i,_}function Bi(i){if(!i.g&&!i.u){i.Y=1;var d=i.Fa;rt||Gt(),Ye||(rt(),Ye=!0),Le.add(d,i),i.v=0}}function qi(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=Hn(A(i.Fa,i),Qn(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Ko(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=Hn(A(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,H(10),dn(this),Ko(this))};function Cn(i){i.A!=null&&(h.clearTimeout(i.A),i.A=null)}function Ko(i){i.g=new Tn(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var d=Tt(i.qa);De(d,"RID","rpc"),De(d,"SID",i.K),De(d,"AID",i.T),De(d,"CI",i.F?"0":"1"),!i.F&&i.ja&&De(d,"TO",i.ja),De(d,"TYPE","xmlhttp"),Bt(i,d),i.m&&i.o&&et(d,i.m,i.o),i.L&&(i.g.I=i.L);var m=i.g;i=i.ia,m.L=1,m.v=Fr(Tt(d)),m.m=null,m.P=!0,ms(m,i)}n.Za=function(){this.C!=null&&(this.C=null,dn(this),qi(this),H(19))};function _s(i){i.C!=null&&(h.clearTimeout(i.C),i.C=null)}function Hi(i,d){var m=null;if(i.g==d){_s(i),Cn(i),i.g=null;var _=2}else if(Ci(i.h,d))m=d.D,ml(i.h,d),_=1;else return;if(i.G!=0){if(d.o)if(_==1){m=d.m?d.m.length:0,d=Date.now()-d.F;var D=i.B;_=Qs(),ut(_,new ae(_,m)),ir(i)}else Bi(i);else if(D=d.s,D==3||D==0&&0<d.X||!(_==1&&$i(i,d)||_==2&&qi(i)))switch(m&&0<m.length&&(d=i.h,d.i=d.i.concat(m)),D){case 1:Xn(i,5);break;case 4:Xn(i,10);break;case 3:Xn(i,6);break;default:Xn(i,2)}}}function Qn(i,d){let m=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(m*=2),m*d}function Xn(i,d){if(i.j.info("Error code "+d),d==2){var m=A(i.fb,i),_=i.Xa;const D=!_;_=new en(_||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Kn(_,"https"),Fr(_),D?ji(_.toString(),m):ou(_.toString(),m)}else H(2);i.G=0,i.l&&i.l.sa(d),Jo(i),Li(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),H(2)):(this.j.info("Failed to ping google.com"),H(1))};function Jo(i){if(i.G=0,i.ka=[],i.l){const d=Gn(i.h);(d.length!=0||i.i.length!=0)&&(J(i.ka,d),J(i.ka,i.i),i.h.i.length=0,Q(i.i),i.i.length=0),i.l.ra()}}function Qo(i,d,m){var _=m instanceof en?Tt(m):new en(m);if(_.g!="")d&&(_.g=d+"."+_.g),Nt(_,_.s);else{var D=h.location;_=D.protocol,d=d?d+"."+D.hostname:D.hostname,D=+D.port;var F=new en(null);_&&Kn(F,_),d&&(F.g=d),D&&Nt(F,D),m&&(F.l=m),_=F}return m=i.D,d=i.ya,m&&d&&De(_,m,d),De(_,"VER",i.la),Bt(i,_),_}function qt(i,d,m){if(d&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=i.Ca&&!i.pa?new qe(new nr({eb:m})):new qe(i.pa),d.Ha(i.J),d}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function hn(){}n=hn.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Xt(){}Xt.prototype.g=function(i,d){return new vt(i,d)};function vt(i,d){ct.call(this),this.g=new Go(d),this.l=i,this.h=d&&d.messageUrlParams||null,i=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(i?i["X-WebChannel-Content-Type"]=d.messageContentType:i={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(i?i["X-WebChannel-Client-Profile"]=d.va:i={"X-WebChannel-Client-Profile":d.va}),this.g.S=i,(i=d&&d.Sb)&&!oe(i)&&(this.g.m=i),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!oe(d)&&(this.g.D=d,i=this.h,i!==null&&d in i&&(i=this.h,d in i&&delete i[d])),this.j=new pn(this)}z(vt,ct),vt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},vt.prototype.close=function(){Br(this.g)},vt.prototype.o=function(i){var d=this.g;if(typeof i=="string"){var m={};m.__data__=i,i=m}else this.u&&(m={},m.__data__=Ze(i),i=m);d.i.push(new Ni(d.Ya++,i)),d.G==3&&ir(d)},vt.prototype.N=function(){this.g.l=null,delete this.j,Br(this.g),delete this.g,vt.aa.N.call(this)};function or(i){kr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var d=i.__sm__;if(d){e:{for(const m in d){i=m;break e}i=void 0}(this.i=i)&&(i=this.i,d=d!==null&&i in d?d[i]:void 0),this.data=d}else this.data=i}z(or,kr);function fn(){Sr.call(this),this.status=1}z(fn,Sr);function pn(i){this.g=i}z(pn,hn),pn.prototype.ua=function(){ut(this.g,"a")},pn.prototype.ta=function(i){ut(this.g,new or(i))},pn.prototype.sa=function(i){ut(this.g,new fn)},pn.prototype.ra=function(){ut(this.g,"b")},Xt.prototype.createWebChannel=Xt.prototype.g,vt.prototype.send=vt.prototype.o,vt.prototype.open=vt.prototype.m,vt.prototype.close=vt.prototype.close,Mh=function(){return new Xt},Vh=function(){return Qs()},Oh=En,Gl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Cr.NO_ERROR=0,Cr.TIMEOUT=8,Cr.HTTP_ERROR=6,pa=Cr,Pr.COMPLETE="complete",Dh=Pr,ht.EventType=Zt,Zt.OPEN="a",Zt.CLOSE="b",Zt.ERROR="c",Zt.MESSAGE="d",ct.prototype.listen=ct.prototype.K,so=ht,qe.prototype.listenOnce=qe.prototype.L,qe.prototype.getLastError=qe.prototype.Ka,qe.prototype.getLastErrorCode=qe.prototype.Ba,qe.prototype.getStatus=qe.prototype.Z,qe.prototype.getResponseJson=qe.prototype.Oa,qe.prototype.getResponseText=qe.prototype.oa,qe.prototype.send=qe.prototype.ea,qe.prototype.setWithCredentials=qe.prototype.Ha,jh=qe}).apply(typeof ia<"u"?ia:typeof self<"u"?self:typeof window<"u"?window:{});const Hu="@firebase/firestore",Wu="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ot=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};Ot.UNAUTHENTICATED=new Ot(null),Ot.GOOGLE_CREDENTIALS=new Ot("google-credentials-uid"),Ot.FIRST_PARTY=new Ot("first-party-uid"),Ot.MOCK_USER=new Ot("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yi="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr=new mc("@firebase/firestore");function Yr(){return gr.logLevel}function ee(n,...e){if(gr.logLevel<=ke.DEBUG){const t=e.map(bc);gr.debug(`Firestore (${yi}): ${n}`,...t)}}function os(n,...e){if(gr.logLevel<=ke.ERROR){const t=e.map(bc);gr.error(`Firestore (${yi}): ${n}`,...t)}}function Ls(n,...e){if(gr.logLevel<=ke.WARN){const t=e.map(bc);gr.warn(`Firestore (${yi}): ${n}`,...t)}}function bc(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Fh(n,s,t)}function Fh(n,e,t){let s=`FIRESTORE (${yi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw os(s),new Error(s)}function Me(n,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,n||Fh(e,r,s)}function ye(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class se extends cs{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class a0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ot.UNAUTHENTICATED)))}shutdown(){}}class l0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class c0{constructor(e){this.t=e,this.currentUser=Ot.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Me(this.o===void 0,42304);let s=this.i;const r=p=>this.i!==s?(s=this.i,t(p)):Promise.resolve();let o=new ns;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new ns,e.enqueueRetryable((()=>r(this.currentUser)))};const l=()=>{const p=o;e.enqueueRetryable((async()=>{await p.promise,await r(this.currentUser)}))},h=p=>{ee("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=p,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((p=>h(p))),setTimeout((()=>{if(!this.auth){const p=this.t.getImmediate({optional:!0});p?h(p):(ee("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new ns)}}),0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(ee("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Me(typeof s.accessToken=="string",31837,{l:s}),new Lh(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Me(e===null||typeof e=="string",2055,{h:e}),new Ot(e)}}class u0{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Ot.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class d0{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new u0(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Ot.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Gu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class h0{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,sn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Me(this.o===void 0,3512);const s=o=>{o.error!=null&&ee("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const l=o.token!==this.m;return this.m=o.token,ee("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>s(o)))};const r=o=>{ee("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>r(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?r(o):ee("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Gu(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Me(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Gu(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $h(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=f0(40);for(let o=0;o<r.length;++o)s.length<20&&r[o]<t&&(s+=e.charAt(r[o]%62))}return s}}function we(n,e){return n<e?-1:n>e?1:0}function Kl(n,e){let t=0;for(;t<n.length&&t<e.length;){const s=n.codePointAt(t),r=e.codePointAt(t);if(s!==r){if(s<128&&r<128)return we(s,r);{const o=$h(),l=p0(o.encode(Ku(n,t)),o.encode(Ku(e,t)));return l!==0?l:we(s,r)}}t+=s>65535?2:1}return we(n.length,e.length)}function Ku(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function p0(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return we(n[t],e[t]);return we(n.length,e.length)}function ci(n,e,t){return n.length===e.length&&n.every(((s,r)=>t(s,e[r])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju="__name__";class jn{constructor(e,t,s){t===void 0?t=0:t>e.length&&he(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&he(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return jn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof jn?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const o=jn.compareSegments(e.get(r),t.get(r));if(o!==0)return o}return we(e.length,t.length)}static compareSegments(e,t){const s=jn.isNumericId(e),r=jn.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?jn.extractNumericId(e).compare(jn.extractNumericId(t)):Kl(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Vs.fromString(e.substring(4,e.length-2))}}class Ke extends jn{construct(e,t,s){return new Ke(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new se(q.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((r=>r.length>0)))}return new Ke(t)}static emptyPath(){return new Ke([])}}const m0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class At extends jn{construct(e,t,s){return new At(e,t,s)}static isValidIdentifier(e){return m0.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),At.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ju}static keyField(){return new At([Ju])}static fromServerFormat(e){const t=[];let s="",r=0;const o=()=>{if(s.length===0)throw new se(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let l=!1;for(;r<e.length;){const h=e[r];if(h==="\\"){if(r+1===e.length)throw new se(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const p=e[r+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new se(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=p,r+=2}else h==="`"?(l=!l,r++):h!=="."||l?(s+=h,r++):(o(),r++)}if(o(),l)throw new se(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new At(t)}static emptyPath(){return new At([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this.path=e}static fromPath(e){return new ue(Ke.fromString(e))}static fromName(e){return new ue(Ke.fromString(e).popFirst(5))}static empty(){return new ue(Ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ke.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ue(new Ke(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uh(n,e,t){if(!t)throw new se(q.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function g0(n,e,t,s){if(e===!0&&s===!0)throw new se(q.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Qu(n){if(!ue.isDocumentKey(n))throw new se(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Xu(n){if(ue.isDocumentKey(n))throw new se(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function zh(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function xc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":he(12329,{type:typeof n})}function yr(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new se(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=xc(n);throw new se(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(n,e){const t={typeString:n};return e&&(t.value=e),t}function Ao(n,e){if(!zh(n))throw new se(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,o="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const l=n[s];if(r&&typeof l!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(o!==void 0&&l!==o.value){t=`Expected '${s}' field to equal '${o.value}'`;break}}if(t)throw new se(q.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yu=-62135596800,Zu=1e6;class Je{static now(){return Je.fromMillis(Date.now())}static fromDate(e){return Je.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Zu);return new Je(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new se(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new se(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Yu)throw new se(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new se(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Zu}_compareTo(e){return this.seconds===e.seconds?we(this.nanoseconds,e.nanoseconds):we(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Je._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ao(e,Je._jsonSchema))return new Je(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Yu;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Je._jsonSchemaVersion="firestore/timestamp/1.0",Je._jsonSchema={type:lt("string",Je._jsonSchemaVersion),seconds:lt("number"),nanoseconds:lt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{static fromTimestamp(e){return new ge(e)}static min(){return new ge(new Je(0,0))}static max(){return new ge(new Je(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo=-1;function y0(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=ge.fromTimestamp(s===1e9?new Je(t+1,0):new Je(t,s));return new $s(r,ue.empty(),e)}function b0(n){return new $s(n.readTime,n.key,yo)}class $s{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new $s(ge.min(),ue.empty(),yo)}static max(){return new $s(ge.max(),ue.empty(),yo)}}function v0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=ue.comparator(n.documentKey,e.documentKey),t!==0?t:we(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class _0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bi(n){if(n.code!==q.FAILED_PRECONDITION||n.message!==x0)throw n;ee("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&he(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new B(((s,r)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(s,r)},this.catchCallback=o=>{this.wrapFailure(t,o).next(s,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof B?t:B.resolve(t)}catch(t){return B.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):B.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):B.reject(t)}static resolve(e){return new B(((t,s)=>{t(e)}))}static reject(e){return new B(((t,s)=>{s(e)}))}static waitFor(e){return new B(((t,s)=>{let r=0,o=0,l=!1;e.forEach((h=>{++r,h.next((()=>{++o,l&&o===r&&t()}),(p=>s(p)))})),l=!0,o===r&&t()}))}static or(e){let t=B.resolve(!1);for(const s of e)t=t.next((r=>r?B.resolve(r):s()));return t}static forEach(e,t){const s=[];return e.forEach(((r,o)=>{s.push(t.call(this,r,o))})),this.waitFor(s)}static mapArray(e,t){return new B(((s,r)=>{const o=e.length,l=new Array(o);let h=0;for(let p=0;p<o;p++){const b=p;t(e[b]).next((v=>{l[b]=v,++h,h===o&&s(l)}),(v=>r(v)))}}))}static doWhile(e,t){return new B(((s,r)=>{const o=()=>{e()===!0?t().next((()=>{o()}),r):s()};o()}))}}function w0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function vi(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Ja.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _c=-1;function Qa(n){return n==null}function Sa(n){return n===0&&1/n==-1/0}function E0(n){return typeof n=="number"&&Number.isInteger(n)&&!Sa(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh="";function T0(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=ed(e)),e=I0(n.get(t),e);return ed(e)}function I0(n,e){let t=e;const s=n.length;for(let r=0;r<s;r++){const o=n.charAt(r);switch(o){case"\0":t+="";break;case Bh:t+="";break;default:t+=o}}return t}function ed(n){return n+Bh+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function td(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function xr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function qh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,t){this.comparator=e,this.root=t||It.EMPTY}insert(e,t){return new Qe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,It.BLACK,null,null))}remove(e){return new Qe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,It.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new oa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new oa(this.root,e,this.comparator,!1)}getReverseIterator(){return new oa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new oa(this.root,e,this.comparator,!0)}}class oa{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?s(e.key,t):1,t&&r&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class It{constructor(e,t,s,r,o){this.key=e,this.value=t,this.color=s??It.RED,this.left=r??It.EMPTY,this.right=o??It.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,o){return new It(e??this.key,t??this.value,s??this.color,r??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const o=s(e,r.key);return r=o<0?r.copy(null,null,null,r.left.insert(e,t,s),null):o===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return It.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return It.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,It.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,It.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw he(43730,{key:this.key,value:this.value});if(this.right.isRed())throw he(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw he(27949);return e+(this.isRed()?0:1)}}It.EMPTY=null,It.RED=!0,It.BLACK=!1;It.EMPTY=new class{constructor(){this.size=0}get key(){throw he(57766)}get value(){throw he(16141)}get color(){throw he(16727)}get left(){throw he(29726)}get right(){throw he(36894)}copy(e,t,s,r,o){return this}insert(e,t,s){return new It(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.comparator=e,this.data=new Qe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new nd(this.data.getIterator())}getIteratorFrom(e){return new nd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof gt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(this.comparator(r,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new gt(this.comparator);return t.data=e,t}}class nd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e){this.fields=e,e.sort(At.comparator)}static empty(){return new bn([])}unionWith(e){let t=new gt(At.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new bn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ci(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Hh("Invalid base64 string: "+o):o}})(e);return new kt(t)}static fromUint8Array(e){const t=(function(r){let o="";for(let l=0;l<r.length;++l)o+=String.fromCharCode(r[l]);return o})(e);return new kt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return we(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}kt.EMPTY_BYTE_STRING=new kt("");const A0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Us(n){if(Me(!!n,39018),typeof n=="string"){let e=0;const t=A0.exec(n);if(Me(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:st(n.seconds),nanos:st(n.nanos)}}function st(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function zs(n){return typeof n=="string"?kt.fromBase64String(n):kt.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wh="server_timestamp",Gh="__type__",Kh="__previous_value__",Jh="__local_write_time__";function wc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Gh])===null||t===void 0?void 0:t.stringValue)===Wh}function Xa(n){const e=n.mapValue.fields[Kh];return wc(e)?Xa(e):e}function bo(n){const e=Us(n.mapValue.fields[Jh].timestampValue);return new Je(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k0{constructor(e,t,s,r,o,l,h,p,b,v){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=o,this.forceLongPolling=l,this.autoDetectLongPolling=h,this.longPollingOptions=p,this.useFetchStreams=b,this.isUsingEmulator=v}}const Na="(default)";class vo{constructor(e,t){this.projectId=e,this.database=t||Na}static empty(){return new vo("","")}get isDefaultDatabase(){return this.database===Na}isEqual(e){return e instanceof vo&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qh="__type__",S0="__max__",aa={mapValue:{}},Xh="__vector__",Ca="value";function Bs(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?wc(n)?4:C0(n)?9007199254740991:N0(n)?10:11:he(28295,{value:n})}function $n(n,e){if(n===e)return!0;const t=Bs(n);if(t!==Bs(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return bo(n).isEqual(bo(e));case 3:return(function(r,o){if(typeof r.timestampValue=="string"&&typeof o.timestampValue=="string"&&r.timestampValue.length===o.timestampValue.length)return r.timestampValue===o.timestampValue;const l=Us(r.timestampValue),h=Us(o.timestampValue);return l.seconds===h.seconds&&l.nanos===h.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,o){return zs(r.bytesValue).isEqual(zs(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,o){return st(r.geoPointValue.latitude)===st(o.geoPointValue.latitude)&&st(r.geoPointValue.longitude)===st(o.geoPointValue.longitude)})(n,e);case 2:return(function(r,o){if("integerValue"in r&&"integerValue"in o)return st(r.integerValue)===st(o.integerValue);if("doubleValue"in r&&"doubleValue"in o){const l=st(r.doubleValue),h=st(o.doubleValue);return l===h?Sa(l)===Sa(h):isNaN(l)&&isNaN(h)}return!1})(n,e);case 9:return ci(n.arrayValue.values||[],e.arrayValue.values||[],$n);case 10:case 11:return(function(r,o){const l=r.mapValue.fields||{},h=o.mapValue.fields||{};if(td(l)!==td(h))return!1;for(const p in l)if(l.hasOwnProperty(p)&&(h[p]===void 0||!$n(l[p],h[p])))return!1;return!0})(n,e);default:return he(52216,{left:n})}}function xo(n,e){return(n.values||[]).find((t=>$n(t,e)))!==void 0}function ui(n,e){if(n===e)return 0;const t=Bs(n),s=Bs(e);if(t!==s)return we(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return we(n.booleanValue,e.booleanValue);case 2:return(function(o,l){const h=st(o.integerValue||o.doubleValue),p=st(l.integerValue||l.doubleValue);return h<p?-1:h>p?1:h===p?0:isNaN(h)?isNaN(p)?0:-1:1})(n,e);case 3:return sd(n.timestampValue,e.timestampValue);case 4:return sd(bo(n),bo(e));case 5:return Kl(n.stringValue,e.stringValue);case 6:return(function(o,l){const h=zs(o),p=zs(l);return h.compareTo(p)})(n.bytesValue,e.bytesValue);case 7:return(function(o,l){const h=o.split("/"),p=l.split("/");for(let b=0;b<h.length&&b<p.length;b++){const v=we(h[b],p[b]);if(v!==0)return v}return we(h.length,p.length)})(n.referenceValue,e.referenceValue);case 8:return(function(o,l){const h=we(st(o.latitude),st(l.latitude));return h!==0?h:we(st(o.longitude),st(l.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return rd(n.arrayValue,e.arrayValue);case 10:return(function(o,l){var h,p,b,v;const I=o.fields||{},A=l.fields||{},M=(h=I[Ca])===null||h===void 0?void 0:h.arrayValue,z=(p=A[Ca])===null||p===void 0?void 0:p.arrayValue,Q=we(((b=M==null?void 0:M.values)===null||b===void 0?void 0:b.length)||0,((v=z==null?void 0:z.values)===null||v===void 0?void 0:v.length)||0);return Q!==0?Q:rd(M,z)})(n.mapValue,e.mapValue);case 11:return(function(o,l){if(o===aa.mapValue&&l===aa.mapValue)return 0;if(o===aa.mapValue)return 1;if(l===aa.mapValue)return-1;const h=o.fields||{},p=Object.keys(h),b=l.fields||{},v=Object.keys(b);p.sort(),v.sort();for(let I=0;I<p.length&&I<v.length;++I){const A=Kl(p[I],v[I]);if(A!==0)return A;const M=ui(h[p[I]],b[v[I]]);if(M!==0)return M}return we(p.length,v.length)})(n.mapValue,e.mapValue);default:throw he(23264,{le:t})}}function sd(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return we(n,e);const t=Us(n),s=Us(e),r=we(t.seconds,s.seconds);return r!==0?r:we(t.nanos,s.nanos)}function rd(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const o=ui(t[r],s[r]);if(o)return o}return we(t.length,s.length)}function di(n){return Jl(n)}function Jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=Us(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return zs(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return ue.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",r=!0;for(const o of t.values||[])r?r=!1:s+=",",s+=Jl(o);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let r="{",o=!0;for(const l of s)o?o=!1:r+=",",r+=`${l}:${Jl(t.fields[l])}`;return r+"}"})(n.mapValue):he(61005,{value:n})}function ma(n){switch(Bs(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Xa(n);return e?16+ma(e):16;case 5:return 2*n.stringValue.length;case 6:return zs(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((r,o)=>r+ma(o)),0)})(n.arrayValue);case 10:case 11:return(function(s){let r=0;return xr(s.fields,((o,l)=>{r+=o.length+ma(l)})),r})(n.mapValue);default:throw he(13486,{value:n})}}function Ql(n){return!!n&&"integerValue"in n}function Ec(n){return!!n&&"arrayValue"in n}function id(n){return!!n&&"nullValue"in n}function od(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ga(n){return!!n&&"mapValue"in n}function N0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Qh])===null||t===void 0?void 0:t.stringValue)===Xh}function uo(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return xr(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=uo(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=uo(n.arrayValue.values[t]);return e}return Object.assign({},n)}function C0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===S0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e){this.value=e}static empty(){return new rn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!ga(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=uo(t)}setAll(e){let t=At.emptyPath(),s={},r=[];e.forEach(((l,h)=>{if(!t.isImmediateParentOf(h)){const p=this.getFieldsMap(t);this.applyChanges(p,s,r),s={},r=[],t=h.popLast()}l?s[h.lastSegment()]=uo(l):r.push(h.lastSegment())}));const o=this.getFieldsMap(t);this.applyChanges(o,s,r)}delete(e){const t=this.field(e.popLast());ga(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return $n(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];ga(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){xr(t,((r,o)=>e[r]=o));for(const r of s)delete e[r]}clone(){return new rn(uo(this.value))}}function Yh(n){const e=[];return xr(n.fields,((t,s)=>{const r=new At([t]);if(ga(s)){const o=Yh(s.mapValue).fields;if(o.length===0)e.push(r);else for(const l of o)e.push(r.child(l))}else e.push(r)})),new bn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e,t,s,r,o,l,h){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=o,this.data=l,this.documentState=h}static newInvalidDocument(e){return new Vt(e,0,ge.min(),ge.min(),ge.min(),rn.empty(),0)}static newFoundDocument(e,t,s,r){return new Vt(e,1,t,ge.min(),s,r,0)}static newNoDocument(e,t){return new Vt(e,2,t,ge.min(),ge.min(),rn.empty(),0)}static newUnknownDocument(e,t){return new Vt(e,3,t,ge.min(),ge.min(),rn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ge.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=rn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=rn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ge.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Vt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Vt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pa{constructor(e,t){this.position=e,this.inclusive=t}}function ad(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const o=e[r],l=n.position[r];if(o.field.isKeyField()?s=ue.comparator(ue.fromName(l.referenceValue),t.key):s=ui(l,t.data.field(o.field)),o.dir==="desc"&&(s*=-1),s!==0)break}return s}function ld(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!$n(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e,t="asc"){this.field=e,this.dir=t}}function P0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{}class pt extends Zh{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new j0(e,t,s):t==="array-contains"?new V0(e,s):t==="in"?new M0(e,s):t==="not-in"?new F0(e,s):t==="array-contains-any"?new L0(e,s):new pt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new D0(e,s):new O0(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(ui(t,this.value)):t!==null&&Bs(this.value)===Bs(t)&&this.matchesComparison(ui(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return he(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Un extends Zh{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Un(e,t)}matches(e){return ef(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function ef(n){return n.op==="and"}function tf(n){return R0(n)&&ef(n)}function R0(n){for(const e of n.filters)if(e instanceof Un)return!1;return!0}function Xl(n){if(n instanceof pt)return n.field.canonicalString()+n.op.toString()+di(n.value);if(tf(n))return n.filters.map((e=>Xl(e))).join(",");{const e=n.filters.map((t=>Xl(t))).join(",");return`${n.op}(${e})`}}function nf(n,e){return n instanceof pt?(function(s,r){return r instanceof pt&&s.op===r.op&&s.field.isEqual(r.field)&&$n(s.value,r.value)})(n,e):n instanceof Un?(function(s,r){return r instanceof Un&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce(((o,l,h)=>o&&nf(l,r.filters[h])),!0):!1})(n,e):void he(19439)}function sf(n){return n instanceof pt?(function(t){return`${t.field.canonicalString()} ${t.op} ${di(t.value)}`})(n):n instanceof Un?(function(t){return t.op.toString()+" {"+t.getFilters().map(sf).join(" ,")+"}"})(n):"Filter"}class j0 extends pt{constructor(e,t,s){super(e,t,s),this.key=ue.fromName(s.referenceValue)}matches(e){const t=ue.comparator(e.key,this.key);return this.matchesComparison(t)}}class D0 extends pt{constructor(e,t){super(e,"in",t),this.keys=rf("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class O0 extends pt{constructor(e,t){super(e,"not-in",t),this.keys=rf("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function rf(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>ue.fromName(s.referenceValue)))}class V0 extends pt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ec(t)&&xo(t.arrayValue,this.value)}}class M0 extends pt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&xo(this.value.arrayValue,t)}}class F0 extends pt{constructor(e,t){super(e,"not-in",t)}matches(e){if(xo(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!xo(this.value.arrayValue,t)}}class L0 extends pt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ec(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>xo(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $0{constructor(e,t=null,s=[],r=[],o=null,l=null,h=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=o,this.startAt=l,this.endAt=h,this.Pe=null}}function cd(n,e=null,t=[],s=[],r=null,o=null,l=null){return new $0(n,e,t,s,r,o,l)}function Tc(n){const e=ye(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Xl(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(o){return o.field.canonicalString()+o.dir})(s))).join(","),Qa(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>di(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>di(s))).join(",")),e.Pe=t}return e.Pe}function Ic(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!P0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!nf(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!ld(n.startAt,e.startAt)&&ld(n.endAt,e.endAt)}function Yl(n){return ue.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e,t=null,s=[],r=[],o=null,l="F",h=null,p=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=o,this.limitType=l,this.startAt=h,this.endAt=p,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function U0(n,e,t,s,r,o,l,h){return new Ya(n,e,t,s,r,o,l,h)}function Ac(n){return new Ya(n)}function ud(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function z0(n){return n.collectionGroup!==null}function ho(n){const e=ye(n);if(e.Te===null){e.Te=[];const t=new Set;for(const o of e.explicitOrderBy)e.Te.push(o),t.add(o.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let h=new gt(At.comparator);return l.filters.forEach((p=>{p.getFlattenedFilters().forEach((b=>{b.isInequality()&&(h=h.add(b.field))}))})),h})(e).forEach((o=>{t.has(o.canonicalString())||o.isKeyField()||e.Te.push(new Ra(o,s))})),t.has(At.keyField().canonicalString())||e.Te.push(new Ra(At.keyField(),s))}return e.Te}function On(n){const e=ye(n);return e.Ie||(e.Ie=B0(e,ho(n))),e.Ie}function B0(n,e){if(n.limitType==="F")return cd(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const o=r.dir==="desc"?"asc":"desc";return new Ra(r.field,o)}));const t=n.endAt?new Pa(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Pa(n.startAt.position,n.startAt.inclusive):null;return cd(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Zl(n,e,t){return new Ya(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Za(n,e){return Ic(On(n),On(e))&&n.limitType===e.limitType}function of(n){return`${Tc(On(n))}|lt:${n.limitType}`}function Zr(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((r=>sf(r))).join(", ")}]`),Qa(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((r=>(function(l){return`${l.field.canonicalString()} (${l.dir})`})(r))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((r=>di(r))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((r=>di(r))).join(",")),`Target(${s})`})(On(n))}; limitType=${n.limitType})`}function el(n,e){return e.isFoundDocument()&&(function(s,r){const o=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(o):ue.isDocumentKey(s.path)?s.path.isEqual(o):s.path.isImmediateParentOf(o)})(n,e)&&(function(s,r){for(const o of ho(s))if(!o.field.isKeyField()&&r.data.field(o.field)===null)return!1;return!0})(n,e)&&(function(s,r){for(const o of s.filters)if(!o.matches(r))return!1;return!0})(n,e)&&(function(s,r){return!(s.startAt&&!(function(l,h,p){const b=ad(l,h,p);return l.inclusive?b<=0:b<0})(s.startAt,ho(s),r)||s.endAt&&!(function(l,h,p){const b=ad(l,h,p);return l.inclusive?b>=0:b>0})(s.endAt,ho(s),r))})(n,e)}function q0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function af(n){return(e,t)=>{let s=!1;for(const r of ho(n)){const o=H0(r,e,t);if(o!==0)return o;s=s||r.field.isKeyField()}return 0}}function H0(n,e,t){const s=n.field.isKeyField()?ue.comparator(e.key,t.key):(function(o,l,h){const p=l.data.field(o),b=h.data.field(o);return p!==null&&b!==null?ui(p,b):he(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return he(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,o]of s)if(this.equalsFn(r,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let o=0;o<r.length;o++)if(this.equalsFn(r[o][0],e))return void(r[o]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){xr(this.inner,((t,s)=>{for(const[r,o]of s)e(r,o)}))}isEmpty(){return qh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W0=new Qe(ue.comparator);function as(){return W0}const lf=new Qe(ue.comparator);function ro(...n){let e=lf;for(const t of n)e=e.insert(t.key,t);return e}function cf(n){let e=lf;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function ur(){return fo()}function uf(){return fo()}function fo(){return new _r((n=>n.toString()),((n,e)=>n.isEqual(e)))}const G0=new Qe(ue.comparator),K0=new gt(ue.comparator);function Se(...n){let e=K0;for(const t of n)e=e.add(t);return e}const J0=new gt(we);function Q0(){return J0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sa(e)?"-0":e}}function df(n){return{integerValue:""+n}}function X0(n,e){return E0(e)?df(e):kc(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(){this._=void 0}}function Y0(n,e,t){return n instanceof ja?(function(r,o){const l={fields:{[Gh]:{stringValue:Wh},[Jh]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return o&&wc(o)&&(o=Xa(o)),o&&(l.fields[Kh]=o),{mapValue:l}})(t,e):n instanceof _o?ff(n,e):n instanceof wo?pf(n,e):(function(r,o){const l=hf(r,o),h=dd(l)+dd(r.Ee);return Ql(l)&&Ql(r.Ee)?df(h):kc(r.serializer,h)})(n,e)}function Z0(n,e,t){return n instanceof _o?ff(n,e):n instanceof wo?pf(n,e):t}function hf(n,e){return n instanceof Da?(function(s){return Ql(s)||(function(o){return!!o&&"doubleValue"in o})(s)})(e)?e:{integerValue:0}:null}class ja extends tl{}class _o extends tl{constructor(e){super(),this.elements=e}}function ff(n,e){const t=mf(e);for(const s of n.elements)t.some((r=>$n(r,s)))||t.push(s);return{arrayValue:{values:t}}}class wo extends tl{constructor(e){super(),this.elements=e}}function pf(n,e){let t=mf(e);for(const s of n.elements)t=t.filter((r=>!$n(r,s)));return{arrayValue:{values:t}}}class Da extends tl{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function dd(n){return st(n.integerValue||n.doubleValue)}function mf(n){return Ec(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function ey(n,e){return n.field.isEqual(e.field)&&(function(s,r){return s instanceof _o&&r instanceof _o||s instanceof wo&&r instanceof wo?ci(s.elements,r.elements,$n):s instanceof Da&&r instanceof Da?$n(s.Ee,r.Ee):s instanceof ja&&r instanceof ja})(n.transform,e.transform)}class ty{constructor(e,t){this.version=e,this.transformResults=t}}class ss{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ss}static exists(e){return new ss(void 0,e)}static updateTime(e){return new ss(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ya(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class nl{}function gf(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new bf(n.key,ss.none()):new ko(n.key,n.data,ss.none());{const t=n.data,s=rn.empty();let r=new gt(At.comparator);for(let o of e.fields)if(!r.has(o)){let l=t.field(o);l===null&&o.length>1&&(o=o.popLast(),l=t.field(o)),l===null?s.delete(o):s.set(o,l),r=r.add(o)}return new wr(n.key,s,new bn(r.toArray()),ss.none())}}function ny(n,e,t){n instanceof ko?(function(r,o,l){const h=r.value.clone(),p=fd(r.fieldTransforms,o,l.transformResults);h.setAll(p),o.convertToFoundDocument(l.version,h).setHasCommittedMutations()})(n,e,t):n instanceof wr?(function(r,o,l){if(!ya(r.precondition,o))return void o.convertToUnknownDocument(l.version);const h=fd(r.fieldTransforms,o,l.transformResults),p=o.data;p.setAll(yf(r)),p.setAll(h),o.convertToFoundDocument(l.version,p).setHasCommittedMutations()})(n,e,t):(function(r,o,l){o.convertToNoDocument(l.version).setHasCommittedMutations()})(0,e,t)}function po(n,e,t,s){return n instanceof ko?(function(o,l,h,p){if(!ya(o.precondition,l))return h;const b=o.value.clone(),v=pd(o.fieldTransforms,p,l);return b.setAll(v),l.convertToFoundDocument(l.version,b).setHasLocalMutations(),null})(n,e,t,s):n instanceof wr?(function(o,l,h,p){if(!ya(o.precondition,l))return h;const b=pd(o.fieldTransforms,p,l),v=l.data;return v.setAll(yf(o)),v.setAll(b),l.convertToFoundDocument(l.version,v).setHasLocalMutations(),h===null?null:h.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((I=>I.field)))})(n,e,t,s):(function(o,l,h){return ya(o.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):h})(n,e,t)}function sy(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),o=hf(s.transform,r||null);o!=null&&(t===null&&(t=rn.empty()),t.set(s.field,o))}return t||null}function hd(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&ci(s,r,((o,l)=>ey(o,l)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ko extends nl{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class wr extends nl{constructor(e,t,s,r,o=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function yf(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function fd(n,e,t){const s=new Map;Me(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let r=0;r<t.length;r++){const o=n[r],l=o.transform,h=e.data.field(o.field);s.set(o.field,Z0(l,h,t[r]))}return s}function pd(n,e,t){const s=new Map;for(const r of n){const o=r.transform,l=t.data.field(r.field);s.set(r.field,Y0(o,l,e))}return s}class bf extends nl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ry extends nl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const o=this.mutations[r];o.key.isEqual(e.key)&&ny(o,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=po(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=po(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=uf();return this.mutations.forEach((r=>{const o=e.get(r.key),l=o.overlayedDocument;let h=this.applyToLocalView(l,o.mutatedFields);h=t.has(r.key)?null:h;const p=gf(l,h);p!==null&&s.set(r.key,p),l.isValidDocument()||l.convertToNoDocument(ge.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Se())}isEqual(e){return this.batchId===e.batchId&&ci(this.mutations,e.mutations,((t,s)=>hd(t,s)))&&ci(this.baseMutations,e.baseMutations,((t,s)=>hd(t,s)))}}class Sc{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){Me(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let r=(function(){return G0})();const o=e.mutations;for(let l=0;l<o.length;l++)r=r.insert(o[l].key,s[l].version);return new Sc(e,t,s,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var at,Ce;function ly(n){switch(n){case q.OK:return he(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return he(15467,{code:n})}}function vf(n){if(n===void 0)return os("GRPC error has no .code"),q.UNKNOWN;switch(n){case at.OK:return q.OK;case at.CANCELLED:return q.CANCELLED;case at.UNKNOWN:return q.UNKNOWN;case at.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case at.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case at.INTERNAL:return q.INTERNAL;case at.UNAVAILABLE:return q.UNAVAILABLE;case at.UNAUTHENTICATED:return q.UNAUTHENTICATED;case at.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case at.NOT_FOUND:return q.NOT_FOUND;case at.ALREADY_EXISTS:return q.ALREADY_EXISTS;case at.PERMISSION_DENIED:return q.PERMISSION_DENIED;case at.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case at.ABORTED:return q.ABORTED;case at.OUT_OF_RANGE:return q.OUT_OF_RANGE;case at.UNIMPLEMENTED:return q.UNIMPLEMENTED;case at.DATA_LOSS:return q.DATA_LOSS;default:return he(39323,{code:n})}}(Ce=at||(at={}))[Ce.OK=0]="OK",Ce[Ce.CANCELLED=1]="CANCELLED",Ce[Ce.UNKNOWN=2]="UNKNOWN",Ce[Ce.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ce[Ce.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ce[Ce.NOT_FOUND=5]="NOT_FOUND",Ce[Ce.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ce[Ce.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ce[Ce.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ce[Ce.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ce[Ce.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ce[Ce.ABORTED=10]="ABORTED",Ce[Ce.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ce[Ce.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ce[Ce.INTERNAL=13]="INTERNAL",Ce[Ce.UNAVAILABLE=14]="UNAVAILABLE",Ce[Ce.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cy=new Vs([4294967295,4294967295],0);function md(n){const e=$h().encode(n),t=new Rh;return t.update(e),new Uint8Array(t.digest())}function gd(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new Vs([t,s],0),new Vs([r,o],0)]}class Nc{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new io(`Invalid padding: ${t}`);if(s<0)throw new io(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new io(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new io(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Vs.fromNumber(this.fe)}pe(e,t,s){let r=e.add(t.multiply(Vs.fromNumber(s)));return r.compare(cy)===1&&(r=new Vs([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=md(e),[s,r]=gd(t);for(let o=0;o<this.hashCount;o++){const l=this.pe(s,r,o);if(!this.ye(l))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),l=new Nc(o,r,t);return s.forEach((h=>l.insert(h))),l}insert(e){if(this.fe===0)return;const t=md(e),[s,r]=gd(t);for(let o=0;o<this.hashCount;o++){const l=this.pe(s,r,o);this.we(l)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class io extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl{constructor(e,t,s,r,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,So.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new sl(ge.min(),r,new Qe(we),as(),Se())}}class So{constructor(e,t,s,r,o){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new So(s,t,Se(),Se(),Se())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ba{constructor(e,t,s,r){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=r}}class xf{constructor(e,t){this.targetId=e,this.De=t}}class _f{constructor(e,t,s=kt.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class yd{constructor(){this.ve=0,this.Ce=bd(),this.Fe=kt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Se(),t=Se(),s=Se();return this.Ce.forEach(((r,o)=>{switch(o){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:he(38017,{changeType:o})}})),new So(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=bd()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Me(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class uy{constructor(e){this.We=e,this.Ge=new Map,this.ze=as(),this.je=la(),this.Je=la(),this.He=new Qe(we)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:he(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,r)=>{this.nt(r)&&t(r)}))}it(e){const t=e.targetId,s=e.De.count,r=this.st(t);if(r){const o=r.target;if(Yl(o))if(s===0){const l=new ue(o.path);this.Xe(t,l,Vt.newNoDocument(l,ge.min()))}else Me(s===1,20013,{expectedCount:s});else{const l=this.ot(t);if(l!==s){const h=this._t(e),p=h?this.ut(h,e,l):1;if(p!==0){this.rt(t);const b=p===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,b)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:o=0}=t;let l,h;try{l=zs(s).toUint8Array()}catch(p){if(p instanceof Hh)return Ls("Decoding the base64 bloom filter in existence filter failed ("+p.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw p}try{h=new Nc(l,r,o)}catch(p){return Ls(p instanceof io?"BloomFilter error: ":"Applying bloom filter failed: ",p),null}return h.fe===0?null:h}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let r=0;return s.forEach((o=>{const l=this.We.lt(),h=`projects/${l.projectId}/databases/${l.database}/documents/${o.path.canonicalString()}`;e.mightContain(h)||(this.Xe(t,o,null),r++)})),r}Pt(e){const t=new Map;this.Ge.forEach(((o,l)=>{const h=this.st(l);if(h){if(o.current&&Yl(h.target)){const p=new ue(h.target.path);this.Tt(p).has(l)||this.It(l,p)||this.Xe(l,p,Vt.newNoDocument(p,e))}o.Ne&&(t.set(l,o.Le()),o.ke())}}));let s=Se();this.Je.forEach(((o,l)=>{let h=!0;l.forEachWhile((p=>{const b=this.st(p);return!b||b.purpose==="TargetPurposeLimboResolution"||(h=!1,!1)})),h&&(s=s.add(o))})),this.ze.forEach(((o,l)=>l.setReadTime(e)));const r=new sl(e,t,this.He,this.ze,s);return this.ze=as(),this.je=la(),this.Je=la(),this.He=new Qe(we),r}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new yd,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new gt(we),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new gt(we),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ee("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new yd),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function la(){return new Qe(ue.comparator)}function bd(){return new Qe(ue.comparator)}const dy={asc:"ASCENDING",desc:"DESCENDING"},hy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fy={and:"AND",or:"OR"};class py{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ec(n,e){return n.useProto3Json||Qa(e)?e:{value:e}}function Oa(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function wf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function my(n,e){return Oa(n,e.toTimestamp())}function Vn(n){return Me(!!n,49232),ge.fromTimestamp((function(t){const s=Us(t);return new Je(s.seconds,s.nanos)})(n))}function Cc(n,e){return tc(n,e).canonicalString()}function tc(n,e){const t=(function(r){return new Ke(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Ef(n){const e=Ke.fromString(n);return Me(Sf(e),10190,{key:e.toString()}),e}function nc(n,e){return Cc(n.databaseId,e.path)}function Dl(n,e){const t=Ef(e);if(t.get(1)!==n.databaseId.projectId)throw new se(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new se(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new ue(If(t))}function Tf(n,e){return Cc(n.databaseId,e)}function gy(n){const e=Ef(n);return e.length===4?Ke.emptyPath():If(e)}function sc(n){return new Ke(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function If(n){return Me(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function vd(n,e,t){return{name:nc(n,e),fields:t.value.mapValue.fields}}function yy(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(b){return b==="NO_CHANGE"?0:b==="ADD"?1:b==="REMOVE"?2:b==="CURRENT"?3:b==="RESET"?4:he(39313,{state:b})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],o=(function(b,v){return b.useProto3Json?(Me(v===void 0||typeof v=="string",58123),kt.fromBase64String(v||"")):(Me(v===void 0||v instanceof Buffer||v instanceof Uint8Array,16193),kt.fromUint8Array(v||new Uint8Array))})(n,e.targetChange.resumeToken),l=e.targetChange.cause,h=l&&(function(b){const v=b.code===void 0?q.UNKNOWN:vf(b.code);return new se(v,b.message||"")})(l);t=new _f(s,r,o,h||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Dl(n,s.document.name),o=Vn(s.document.updateTime),l=s.document.createTime?Vn(s.document.createTime):ge.min(),h=new rn({mapValue:{fields:s.document.fields}}),p=Vt.newFoundDocument(r,o,l,h),b=s.targetIds||[],v=s.removedTargetIds||[];t=new ba(b,v,p.key,p)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Dl(n,s.document),o=s.readTime?Vn(s.readTime):ge.min(),l=Vt.newNoDocument(r,o),h=s.removedTargetIds||[];t=new ba([],h,l.key,l)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Dl(n,s.document),o=s.removedTargetIds||[];t=new ba([],o,r,null)}else{if(!("filter"in e))return he(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:o}=s,l=new ay(r,o),h=s.targetId;t=new xf(h,l)}}return t}function by(n,e){let t;if(e instanceof ko)t={update:vd(n,e.key,e.value)};else if(e instanceof bf)t={delete:nc(n,e.key)};else if(e instanceof wr)t={update:vd(n,e.key,e.data),updateMask:ky(e.fieldMask)};else{if(!(e instanceof ry))return he(16599,{Rt:e.type});t={verify:nc(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(o,l){const h=l.transform;if(h instanceof ja)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(h instanceof _o)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:h.elements}};if(h instanceof wo)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:h.elements}};if(h instanceof Da)return{fieldPath:l.field.canonicalString(),increment:h.Ee};throw he(20930,{transform:l.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(r,o){return o.updateTime!==void 0?{updateTime:my(r,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:he(27497)})(n,e.precondition)),t}function vy(n,e){return n&&n.length>0?(Me(e!==void 0,14353),n.map((t=>(function(r,o){let l=r.updateTime?Vn(r.updateTime):Vn(o);return l.isEqual(ge.min())&&(l=Vn(o)),new ty(l,r.transformResults||[])})(t,e)))):[]}function xy(n,e){return{documents:[Tf(n,e.path)]}}function _y(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Tf(n,r);const o=(function(b){if(b.length!==0)return kf(Un.create(b,"and"))})(e.filters);o&&(t.structuredQuery.where=o);const l=(function(b){if(b.length!==0)return b.map((v=>(function(A){return{field:ei(A.field),direction:Ty(A.dir)}})(v)))})(e.orderBy);l&&(t.structuredQuery.orderBy=l);const h=ec(n,e.limit);return h!==null&&(t.structuredQuery.limit=h),e.startAt&&(t.structuredQuery.startAt=(function(b){return{before:b.inclusive,values:b.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(b){return{before:!b.inclusive,values:b.position}})(e.endAt)),{Vt:t,parent:r}}function wy(n){let e=gy(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){Me(s===1,65062);const v=t.from[0];v.allDescendants?r=v.collectionId:e=e.child(v.collectionId)}let o=[];t.where&&(o=(function(I){const A=Af(I);return A instanceof Un&&tf(A)?A.getFilters():[A]})(t.where));let l=[];t.orderBy&&(l=(function(I){return I.map((A=>(function(z){return new Ra(ti(z.field),(function(J){switch(J){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(z.direction))})(A)))})(t.orderBy));let h=null;t.limit&&(h=(function(I){let A;return A=typeof I=="object"?I.value:I,Qa(A)?null:A})(t.limit));let p=null;t.startAt&&(p=(function(I){const A=!!I.before,M=I.values||[];return new Pa(M,A)})(t.startAt));let b=null;return t.endAt&&(b=(function(I){const A=!I.before,M=I.values||[];return new Pa(M,A)})(t.endAt)),U0(e,r,l,o,h,"F",p,b)}function Ey(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return he(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Af(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=ti(t.unaryFilter.field);return pt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=ti(t.unaryFilter.field);return pt.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=ti(t.unaryFilter.field);return pt.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=ti(t.unaryFilter.field);return pt.create(l,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return he(61313);default:return he(60726)}})(n):n.fieldFilter!==void 0?(function(t){return pt.create(ti(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return he(58110);default:return he(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Un.create(t.compositeFilter.filters.map((s=>Af(s))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return he(1026)}})(t.compositeFilter.op))})(n):he(30097,{filter:n})}function Ty(n){return dy[n]}function Iy(n){return hy[n]}function Ay(n){return fy[n]}function ei(n){return{fieldPath:n.canonicalString()}}function ti(n){return At.fromServerFormat(n.fieldPath)}function kf(n){return n instanceof pt?(function(t){if(t.op==="=="){if(od(t.value))return{unaryFilter:{field:ei(t.field),op:"IS_NAN"}};if(id(t.value))return{unaryFilter:{field:ei(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(od(t.value))return{unaryFilter:{field:ei(t.field),op:"IS_NOT_NAN"}};if(id(t.value))return{unaryFilter:{field:ei(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ei(t.field),op:Iy(t.op),value:t.value}}})(n):n instanceof Un?(function(t){const s=t.getFilters().map((r=>kf(r)));return s.length===1?s[0]:{compositeFilter:{op:Ay(t.op),filters:s}}})(n):he(54877,{filter:n})}function ky(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Sf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(e,t,s,r,o=ge.min(),l=ge.min(),h=kt.EMPTY_BYTE_STRING,p=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=h,this.expectedCount=p}withSequenceNumber(e){return new Rs(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Rs(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Rs(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Rs(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sy{constructor(e){this.gt=e}}function Ny(n){const e=wy({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Zl(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(){this.Dn=new Py}addToCollectionParentIndex(e,t){return this.Dn.add(t),B.resolve()}getCollectionParents(e,t){return B.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return B.resolve()}deleteFieldIndex(e,t){return B.resolve()}deleteAllFieldIndexes(e){return B.resolve()}createTargetIndexes(e,t){return B.resolve()}getDocumentsMatchingTarget(e,t){return B.resolve(null)}getIndexType(e,t){return B.resolve(0)}getFieldIndexes(e,t){return B.resolve([])}getNextCollectionGroupToUpdate(e){return B.resolve(null)}getMinOffset(e,t){return B.resolve($s.min())}getMinOffsetFromCollectionGroup(e,t){return B.resolve($s.min())}updateCollectionGroup(e,t,s){return B.resolve()}updateIndexEntries(e,t){return B.resolve()}}class Py{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new gt(Ke.comparator),o=!r.has(s);return this.index[t]=r.add(s),o}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new gt(Ke.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xd={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Nf=41943040;class Ht{static withCacheSize(e){return new Ht(e,Ht.DEFAULT_COLLECTION_PERCENTILE,Ht.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ht.DEFAULT_COLLECTION_PERCENTILE=10,Ht.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ht.DEFAULT=new Ht(Nf,Ht.DEFAULT_COLLECTION_PERCENTILE,Ht.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ht.DISABLED=new Ht(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new hi(0)}static ur(){return new hi(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d="LruGarbageCollector",Ry=1048576;function wd([n,e],[t,s]){const r=we(n,t);return r===0?we(e,s):r}class jy{constructor(e){this.Tr=e,this.buffer=new gt(wd),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();wd(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Dy{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){ee(_d,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){vi(t)?ee(_d,"Ignoring IndexedDB error during garbage collection: ",t):await bi(t)}await this.Rr(3e5)}))}}class Oy{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return B.resolve(Ja.ue);const s=new jy(t);return this.Vr.forEachTarget(e,(r=>s.Er(r.sequenceNumber))).next((()=>this.Vr.gr(e,(r=>s.Er(r))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ee("LruGarbageCollector","Garbage collection skipped; disabled"),B.resolve(xd)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(ee("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),xd):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,r,o,l,h,p,b;const v=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((I=>(I>this.params.maximumSequenceNumbersToCollect?(ee("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${I}`),r=this.params.maximumSequenceNumbersToCollect):r=I,l=Date.now(),this.nthSequenceNumber(e,r)))).next((I=>(s=I,h=Date.now(),this.removeTargets(e,s,t)))).next((I=>(o=I,p=Date.now(),this.removeOrphanedDocuments(e,s)))).next((I=>(b=Date.now(),Yr()<=ke.DEBUG&&ee("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${l-v}ms
	Determined least recently used ${r} in `+(h-l)+`ms
	Removed ${o} targets in `+(p-h)+`ms
	Removed ${I} documents in `+(b-p)+`ms
Total Duration: ${b-v}ms`),B.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:o,documentsRemoved:I}))))}}function Vy(n,e){return new Oy(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class My{constructor(){this.changes=new _r((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Vt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?B.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(s=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(s!==null&&po(s.mutation,r,bn.empty(),Je.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,Se()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=Se()){const r=ur();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,s).next((o=>{let l=ro();return o.forEach(((h,p)=>{l=l.insert(h,p.overlayedDocument)})),l}))))}getOverlayedDocuments(e,t){const s=ur();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,Se())))}populateOverlays(e,t,s){const r=[];return s.forEach((o=>{t.has(o)||r.push(o)})),this.documentOverlayCache.getOverlays(e,r).next((o=>{o.forEach(((l,h)=>{t.set(l,h)}))}))}computeViews(e,t,s,r){let o=as();const l=fo(),h=(function(){return fo()})();return t.forEach(((p,b)=>{const v=s.get(b.key);r.has(b.key)&&(v===void 0||v.mutation instanceof wr)?o=o.insert(b.key,b):v!==void 0?(l.set(b.key,v.mutation.getFieldMask()),po(v.mutation,b,v.mutation.getFieldMask(),Je.now())):l.set(b.key,bn.empty())})),this.recalculateAndSaveOverlays(e,o).next((p=>(p.forEach(((b,v)=>l.set(b,v))),t.forEach(((b,v)=>{var I;return h.set(b,new Fy(v,(I=l.get(b))!==null&&I!==void 0?I:null))})),h)))}recalculateAndSaveOverlays(e,t){const s=fo();let r=new Qe(((l,h)=>l-h)),o=Se();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((l=>{for(const h of l)h.keys().forEach((p=>{const b=t.get(p);if(b===null)return;let v=s.get(p)||bn.empty();v=h.applyToLocalView(b,v),s.set(p,v);const I=(r.get(h.batchId)||Se()).add(p);r=r.insert(h.batchId,I)}))})).next((()=>{const l=[],h=r.getReverseIterator();for(;h.hasNext();){const p=h.getNext(),b=p.key,v=p.value,I=uf();v.forEach((A=>{if(!o.has(A)){const M=gf(t.get(A),s.get(A));M!==null&&I.set(A,M),o=o.add(A)}})),l.push(this.documentOverlayCache.saveOverlays(e,b,I))}return B.waitFor(l)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,r){return(function(l){return ue.isDocumentKey(l.path)&&l.collectionGroup===null&&l.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):z0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next((o=>{const l=r-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-o.size):B.resolve(ur());let h=yo,p=o;return l.next((b=>B.forEach(b,((v,I)=>(h<I.largestBatchId&&(h=I.largestBatchId),o.get(v)?B.resolve():this.remoteDocumentCache.getEntry(e,v).next((A=>{p=p.insert(v,A)}))))).next((()=>this.populateOverlays(e,b,o))).next((()=>this.computeViews(e,p,b,Se()))).next((v=>({batchId:h,changes:cf(v)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ue(t)).next((s=>{let r=ro();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const o=t.collectionGroup;let l=ro();return this.indexManager.getCollectionParents(e,o).next((h=>B.forEach(h,(p=>{const b=(function(I,A){return new Ya(A,null,I.explicitOrderBy.slice(),I.filters.slice(),I.limit,I.limitType,I.startAt,I.endAt)})(t,p.child(o));return this.getDocumentsMatchingCollectionQuery(e,b,s,r).next((v=>{v.forEach(((I,A)=>{l=l.insert(I,A)}))}))})).next((()=>l))))}getDocumentsMatchingCollectionQuery(e,t,s,r){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((l=>(o=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,o,r)))).next((l=>{o.forEach(((p,b)=>{const v=b.getKey();l.get(v)===null&&(l=l.insert(v,Vt.newInvalidDocument(v)))}));let h=ro();return l.forEach(((p,b)=>{const v=o.get(p);v!==void 0&&po(v.mutation,b,bn.empty(),Je.now()),el(t,b)&&(h=h.insert(p,b))})),h}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return B.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:Vn(r.createTime)}})(t)),B.resolve()}getNamedQuery(e,t){return B.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(r){return{name:r.name,query:Ny(r.bundledQuery),readTime:Vn(r.readTime)}})(t)),B.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(){this.overlays=new Qe(ue.comparator),this.kr=new Map}getOverlay(e,t){return B.resolve(this.overlays.get(t))}getOverlays(e,t){const s=ur();return B.forEach(t,(r=>this.getOverlay(e,r).next((o=>{o!==null&&s.set(r,o)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((r,o)=>{this.wt(e,t,o)})),B.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.kr.get(s);return r!==void 0&&(r.forEach((o=>this.overlays=this.overlays.remove(o))),this.kr.delete(s)),B.resolve()}getOverlaysForCollection(e,t,s){const r=ur(),o=t.length+1,l=new ue(t.child("")),h=this.overlays.getIteratorFrom(l);for(;h.hasNext();){const p=h.getNext().value,b=p.getKey();if(!t.isPrefixOf(b.path))break;b.path.length===o&&p.largestBatchId>s&&r.set(p.getKey(),p)}return B.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let o=new Qe(((b,v)=>b-v));const l=this.overlays.getIterator();for(;l.hasNext();){const b=l.getNext().value;if(b.getKey().getCollectionGroup()===t&&b.largestBatchId>s){let v=o.get(b.largestBatchId);v===null&&(v=ur(),o=o.insert(b.largestBatchId,v)),v.set(b.getKey(),b)}}const h=ur(),p=o.getIterator();for(;p.hasNext()&&(p.getNext().value.forEach(((b,v)=>h.set(b,v))),!(h.size()>=r)););return B.resolve(h)}wt(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const l=this.kr.get(r.largestBatchId).delete(s.key);this.kr.set(r.largestBatchId,l)}this.overlays=this.overlays.insert(s.key,new oy(t,s));let o=this.kr.get(t);o===void 0&&(o=Se(),this.kr.set(t,o)),this.kr.set(t,o.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(){this.sessionToken=kt.EMPTY_BYTE_STRING}getSessionToken(e){return B.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,B.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(){this.qr=new gt(_t.Qr),this.$r=new gt(_t.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new _t(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new _t(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new ue(new Ke([])),s=new _t(t,e),r=new _t(t,e+1),o=[];return this.$r.forEachInRange([s,r],(l=>{this.Wr(l),o.push(l.key)})),o}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new ue(new Ke([])),s=new _t(t,e),r=new _t(t,e+1);let o=Se();return this.$r.forEachInRange([s,r],(l=>{o=o.add(l.key)})),o}containsKey(e){const t=new _t(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class _t{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return ue.comparator(e.key,t.key)||we(e.Hr,t.Hr)}static Ur(e,t){return we(e.Hr,t.Hr)||ue.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new gt(_t.Qr)}checkEmpty(e){return B.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const o=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new iy(o,t,s,r);this.mutationQueue.push(l);for(const h of r)this.Yr=this.Yr.add(new _t(h.key,o)),this.indexManager.addToCollectionParentIndex(e,h.key.path.popLast());return B.resolve(l)}lookupMutationBatch(e,t){return B.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.Xr(s),o=r<0?0:r;return B.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return B.resolve(this.mutationQueue.length===0?_c:this.er-1)}getAllMutationBatches(e){return B.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new _t(t,0),r=new _t(t,Number.POSITIVE_INFINITY),o=[];return this.Yr.forEachInRange([s,r],(l=>{const h=this.Zr(l.Hr);o.push(h)})),B.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new gt(we);return t.forEach((r=>{const o=new _t(r,0),l=new _t(r,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([o,l],(h=>{s=s.add(h.Hr)}))})),B.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let o=s;ue.isDocumentKey(o)||(o=o.child(""));const l=new _t(new ue(o),0);let h=new gt(we);return this.Yr.forEachWhile((p=>{const b=p.key.path;return!!s.isPrefixOf(b)&&(b.length===r&&(h=h.add(p.Hr)),!0)}),l),B.resolve(this.ei(h))}ei(e){const t=[];return e.forEach((s=>{const r=this.Zr(s);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){Me(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return B.forEach(t.mutations,(r=>{const o=new _t(r.key,t.batchId);return s=s.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new _t(t,0),r=this.Yr.firstAfterOrEqual(s);return B.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,B.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(e){this.ni=e,this.docs=(function(){return new Qe(ue.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),o=r?r.size:0,l=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:l}),this.size+=l-o,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return B.resolve(s?s.document.mutableCopy():Vt.newInvalidDocument(t))}getEntries(e,t){let s=as();return t.forEach((r=>{const o=this.docs.get(r);s=s.insert(r,o?o.document.mutableCopy():Vt.newInvalidDocument(r))})),B.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let o=as();const l=t.path,h=new ue(l.child("__id-9223372036854775808__")),p=this.docs.getIteratorFrom(h);for(;p.hasNext();){const{key:b,value:{document:v}}=p.getNext();if(!l.isPrefixOf(b.path))break;b.path.length>l.length+1||v0(b0(v),s)<=0||(r.has(v.key)||el(t,v))&&(o=o.insert(v.key,v.mutableCopy()))}return B.resolve(o)}getAllFromCollectionGroup(e,t,s,r){he(9500)}ri(e,t){return B.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new Hy(this)}getSize(e){return B.resolve(this.size)}}class Hy extends My{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(s)})),B.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(e){this.persistence=e,this.ii=new _r((t=>Tc(t)),Ic),this.lastRemoteSnapshotVersion=ge.min(),this.highestTargetId=0,this.si=0,this.oi=new Pc,this.targetCount=0,this._i=hi.ar()}forEachTarget(e,t){return this.ii.forEach(((s,r)=>t(r))),B.resolve()}getLastRemoteSnapshotVersion(e){return B.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return B.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),B.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),B.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new hi(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,B.resolve()}updateTargetData(e,t){return this.hr(t),B.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,B.resolve()}removeTargets(e,t,s){let r=0;const o=[];return this.ii.forEach(((l,h)=>{h.sequenceNumber<=t&&s.get(h.targetId)===null&&(this.ii.delete(l),o.push(this.removeMatchingKeysForTargetId(e,h.targetId)),r++)})),B.waitFor(o).next((()=>r))}getTargetCount(e){return B.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return B.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),B.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const r=this.persistence.referenceDelegate,o=[];return r&&t.forEach((l=>{o.push(r.markPotentiallyOrphaned(e,l))})),B.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),B.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return B.resolve(s)}containsKey(e,t){return B.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(e,t){this.ai={},this.overlays={},this.ui=new Ja(0),this.ci=!1,this.ci=!0,this.li=new zy,this.referenceDelegate=e(this),this.hi=new Wy(this),this.indexManager=new Cy,this.remoteDocumentCache=(function(r){return new qy(r)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new Sy(t),this.Ti=new $y(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Uy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new By(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){ee("MemoryPersistence","Starting transaction:",e);const r=new Gy(this.ui.next());return this.referenceDelegate.Ii(),s(r).next((o=>this.referenceDelegate.di(r).next((()=>o)))).toPromise().then((o=>(r.raiseOnCommittedEvent(),o)))}Ei(e,t){return B.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class Gy extends _0{constructor(e){super(),this.currentSequenceNumber=e}}class Rc{constructor(e){this.persistence=e,this.Ai=new Pc,this.Ri=null}static Vi(e){return new Rc(e)}get mi(){if(this.Ri)return this.Ri;throw he(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),B.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),B.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),B.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((r=>this.mi.add(r.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((o=>this.mi.add(o.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return B.forEach(this.mi,(s=>{const r=ue.fromPath(s);return this.fi(e,r).next((o=>{o||t.removeEntry(r,ge.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return B.or([()=>B.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Va{constructor(e,t){this.persistence=e,this.gi=new _r((s=>T0(s.path)),((s,r)=>s.isEqual(r))),this.garbageCollector=Vy(this,t)}static Vi(e,t){return new Va(e,t)}Ii(){}di(e){return B.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((r=>s+r))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return B.forEach(this.gi,((s,r)=>this.Sr(e,s,r).next((o=>o?B.resolve():t(r)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const r=this.persistence.getRemoteDocumentCache(),o=r.newChangeBuffer();return r.ri(e,(l=>this.Sr(e,l,t).next((h=>{h||(s++,o.removeEntry(l,ge.min()))})))).next((()=>o.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),B.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),B.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),B.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),B.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ma(e.data.value)),t}Sr(e,t,s){return B.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.gi.get(t);return B.resolve(r!==void 0&&r>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=r}static Es(e,t){let s=Se(),r=Se();for(const o of t.docChanges)switch(o.type){case 0:s=s.add(o.doc.key);break;case 1:r=r.add(o.doc.key)}return new jc(e,t.fromCache,s,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Um()?8:w0(Mt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,r){const o={result:null};return this.ps(e,t).next((l=>{o.result=l})).next((()=>{if(!o.result)return this.ys(e,t,r,s).next((l=>{o.result=l}))})).next((()=>{if(o.result)return;const l=new Ky;return this.ws(e,t,l).next((h=>{if(o.result=h,this.Rs)return this.Ss(e,t,l,h.size)}))})).next((()=>o.result))}Ss(e,t,s,r){return s.documentReadCount<this.Vs?(Yr()<=ke.DEBUG&&ee("QueryEngine","SDK will not create cache indexes for query:",Zr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),B.resolve()):(Yr()<=ke.DEBUG&&ee("QueryEngine","Query:",Zr(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.fs*r?(Yr()<=ke.DEBUG&&ee("QueryEngine","The SDK decides to create cache indexes for query:",Zr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,On(t))):B.resolve())}ps(e,t){if(ud(t))return B.resolve(null);let s=On(t);return this.indexManager.getIndexType(e,s).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=Zl(t,null,"F"),s=On(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const l=Se(...o);return this.gs.getDocuments(e,l).next((h=>this.indexManager.getMinOffset(e,s).next((p=>{const b=this.bs(t,h);return this.Ds(t,b,l,p.readTime)?this.ps(e,Zl(t,null,"F")):this.vs(e,b,t,p)}))))})))))}ys(e,t,s,r){return ud(t)||r.isEqual(ge.min())?B.resolve(null):this.gs.getDocuments(e,s).next((o=>{const l=this.bs(t,o);return this.Ds(t,l,s,r)?B.resolve(null):(Yr()<=ke.DEBUG&&ee("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Zr(t)),this.vs(e,l,t,y0(r,yo)).next((h=>h)))}))}bs(e,t){let s=new gt(af(e));return t.forEach(((r,o)=>{el(e,o)&&(s=s.add(o))})),s}Ds(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(r)>0)}ws(e,t,s){return Yr()<=ke.DEBUG&&ee("QueryEngine","Using full collection scan to execute query:",Zr(t)),this.gs.getDocumentsMatchingQuery(e,t,$s.min(),s)}vs(e,t,s,r){return this.gs.getDocumentsMatchingQuery(e,s,r).next((o=>(t.forEach((l=>{o=o.insert(l.key,l)})),o)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc="LocalStore",Qy=3e8;class Xy{constructor(e,t,s,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new Qe(we),this.Ms=new _r((o=>Tc(o)),Ic),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Ly(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function Yy(n,e,t,s){return new Xy(n,e,t,s)}async function Pf(n,e){const t=ye(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next((o=>(r=o,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((o=>{const l=[],h=[];let p=Se();for(const b of r){l.push(b.batchId);for(const v of b.mutations)p=p.add(v.key)}for(const b of o){h.push(b.batchId);for(const v of b.mutations)p=p.add(v.key)}return t.localDocuments.getDocuments(s,p).next((b=>({Bs:b,removedBatchIds:l,addedBatchIds:h})))}))}))}function Zy(n,e){const t=ye(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const r=e.batch.keys(),o=t.Os.newChangeBuffer({trackRemovals:!0});return(function(h,p,b,v){const I=b.batch,A=I.keys();let M=B.resolve();return A.forEach((z=>{M=M.next((()=>v.getEntry(p,z))).next((Q=>{const J=b.docVersions.get(z);Me(J!==null,48541),Q.version.compareTo(J)<0&&(I.applyToRemoteDocument(Q,b),Q.isValidDocument()&&(Q.setReadTime(b.commitVersion),v.addEntry(Q)))}))})),M.next((()=>h.mutationQueue.removeMutationBatch(p,I)))})(t,s,e,o).next((()=>o.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(h){let p=Se();for(let b=0;b<h.mutationResults.length;++b)h.mutationResults[b].transformResults.length>0&&(p=p.add(h.batch.mutations[b].key));return p})(e)))).next((()=>t.localDocuments.getDocuments(s,r)))}))}function Rf(n){const e=ye(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function eb(n,e){const t=ye(n),s=e.snapshotVersion;let r=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const l=t.Os.newChangeBuffer({trackRemovals:!0});r=t.Fs;const h=[];e.targetChanges.forEach(((v,I)=>{const A=r.get(I);if(!A)return;h.push(t.hi.removeMatchingKeys(o,v.removedDocuments,I).next((()=>t.hi.addMatchingKeys(o,v.addedDocuments,I))));let M=A.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(I)!==null?M=M.withResumeToken(kt.EMPTY_BYTE_STRING,ge.min()).withLastLimboFreeSnapshotVersion(ge.min()):v.resumeToken.approximateByteSize()>0&&(M=M.withResumeToken(v.resumeToken,s)),r=r.insert(I,M),(function(Q,J,_e){return Q.resumeToken.approximateByteSize()===0||J.snapshotVersion.toMicroseconds()-Q.snapshotVersion.toMicroseconds()>=Qy?!0:_e.addedDocuments.size+_e.modifiedDocuments.size+_e.removedDocuments.size>0})(A,M,v)&&h.push(t.hi.updateTargetData(o,M))}));let p=as(),b=Se();if(e.documentUpdates.forEach((v=>{e.resolvedLimboDocuments.has(v)&&h.push(t.persistence.referenceDelegate.updateLimboDocument(o,v))})),h.push(tb(o,l,e.documentUpdates).next((v=>{p=v.Ls,b=v.ks}))),!s.isEqual(ge.min())){const v=t.hi.getLastRemoteSnapshotVersion(o).next((I=>t.hi.setTargetsMetadata(o,o.currentSequenceNumber,s)));h.push(v)}return B.waitFor(h).next((()=>l.apply(o))).next((()=>t.localDocuments.getLocalViewOfDocuments(o,p,b))).next((()=>p))})).then((o=>(t.Fs=r,o)))}function tb(n,e,t){let s=Se(),r=Se();return t.forEach((o=>s=s.add(o))),e.getEntries(n,s).next((o=>{let l=as();return t.forEach(((h,p)=>{const b=o.get(h);p.isFoundDocument()!==b.isFoundDocument()&&(r=r.add(h)),p.isNoDocument()&&p.version.isEqual(ge.min())?(e.removeEntry(h,p.readTime),l=l.insert(h,p)):!b.isValidDocument()||p.version.compareTo(b.version)>0||p.version.compareTo(b.version)===0&&b.hasPendingWrites?(e.addEntry(p),l=l.insert(h,p)):ee(Dc,"Ignoring outdated watch update for ",h,". Current version:",b.version," Watch version:",p.version)})),{Ls:l,ks:r}}))}function nb(n,e){const t=ye(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=_c),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function sb(n,e){const t=ye(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let r;return t.hi.getTargetData(s,e).next((o=>o?(r=o,B.resolve(r)):t.hi.allocateTargetId(s).next((l=>(r=new Rs(e,l,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,r).next((()=>r)))))))})).then((s=>{const r=t.Fs.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function rc(n,e,t){const s=ye(n),r=s.Fs.get(e),o=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",o,(l=>s.persistence.referenceDelegate.removeTarget(l,r)))}catch(l){if(!vi(l))throw l;ee(Dc,`Failed to update sequence numbers for target ${e}: ${l}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(r.target)}function Ed(n,e,t){const s=ye(n);let r=ge.min(),o=Se();return s.persistence.runTransaction("Execute query","readwrite",(l=>(function(p,b,v){const I=ye(p),A=I.Ms.get(v);return A!==void 0?B.resolve(I.Fs.get(A)):I.hi.getTargetData(b,v)})(s,l,On(e)).next((h=>{if(h)return r=h.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(l,h.targetId).next((p=>{o=p}))})).next((()=>s.Cs.getDocumentsMatchingQuery(l,e,t?r:ge.min(),t?o:Se()))).next((h=>(rb(s,q0(e),h),{documents:h,qs:o})))))}function rb(n,e,t){let s=n.xs.get(e)||ge.min();t.forEach(((r,o)=>{o.readTime.compareTo(s)>0&&(s=o.readTime)})),n.xs.set(e,s)}class Td{constructor(){this.activeTargetIds=Q0()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ib{constructor(){this.Fo=new Td,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Td,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Id="ConnectivityMonitor";class Ad{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){ee(Id,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){ee(Id,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ca=null;function ic(){return ca===null?ca=(function(){return 268435456+Math.round(2147483648*Math.random())})():ca++,"0x"+ca.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ol="RestConnection",ab={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class lb{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${r}`,this.Ko=this.databaseId.database===Na?`project_id=${s}`:`project_id=${s}&database_id=${r}`}Wo(e,t,s,r,o){const l=ic(),h=this.Go(e,t.toUriEncodedString());ee(Ol,`Sending RPC '${e}' ${l}:`,h,s);const p={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(p,r,o);const{host:b}=new URL(h),v=mi(b);return this.jo(e,h,p,s,v).then((I=>(ee(Ol,`Received RPC '${e}' ${l}: `,I),I)),(I=>{throw Ls(Ol,`RPC '${e}' ${l} failed with error: `,I,"url: ",h,"request:",s),I}))}Jo(e,t,s,r,o,l){return this.Wo(e,t,s,r,o)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+yi})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,o)=>e[o]=r)),s&&s.headers.forEach(((r,o)=>e[o]=r))}Go(e,t){const s=ab[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cb{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt="WebChannelConnection";class ub extends lb{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,r,o){const l=ic();return new Promise(((h,p)=>{const b=new jh;b.setWithCredentials(!0),b.listenOnce(Dh.COMPLETE,(()=>{try{switch(b.getLastErrorCode()){case pa.NO_ERROR:const I=b.getResponseJson();ee(Dt,`XHR for RPC '${e}' ${l} received:`,JSON.stringify(I)),h(I);break;case pa.TIMEOUT:ee(Dt,`RPC '${e}' ${l} timed out`),p(new se(q.DEADLINE_EXCEEDED,"Request time out"));break;case pa.HTTP_ERROR:const A=b.getStatus();if(ee(Dt,`RPC '${e}' ${l} failed with status:`,A,"response text:",b.getResponseText()),A>0){let M=b.getResponseJson();Array.isArray(M)&&(M=M[0]);const z=M==null?void 0:M.error;if(z&&z.status&&z.message){const Q=(function(_e){const oe=_e.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(oe)>=0?oe:q.UNKNOWN})(z.status);p(new se(Q,z.message))}else p(new se(q.UNKNOWN,"Server responded with status "+b.getStatus()))}else p(new se(q.UNAVAILABLE,"Connection failed."));break;default:he(9055,{c_:e,streamId:l,l_:b.getLastErrorCode(),h_:b.getLastError()})}}finally{ee(Dt,`RPC '${e}' ${l} completed.`)}}));const v=JSON.stringify(r);ee(Dt,`RPC '${e}' ${l} sending request:`,r),b.send(t,"POST",v,s,15)}))}P_(e,t,s){const r=ic(),o=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=Mh(),h=Vh(),p={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},b=this.longPollingOptions.timeoutSeconds;b!==void 0&&(p.longPollingTimeout=Math.round(1e3*b)),this.useFetchStreams&&(p.useFetchStreams=!0),this.zo(p.initMessageHeaders,t,s),p.encodeInitMessageHeaders=!0;const v=o.join("");ee(Dt,`Creating RPC '${e}' stream ${r}: ${v}`,p);const I=l.createWebChannel(v,p);this.T_(I);let A=!1,M=!1;const z=new cb({Ho:J=>{M?ee(Dt,`Not sending because RPC '${e}' stream ${r} is closed:`,J):(A||(ee(Dt,`Opening RPC '${e}' stream ${r} transport.`),I.open(),A=!0),ee(Dt,`RPC '${e}' stream ${r} sending:`,J),I.send(J))},Yo:()=>I.close()}),Q=(J,_e,oe)=>{J.listen(_e,(pe=>{try{oe(pe)}catch(me){setTimeout((()=>{throw me}),0)}}))};return Q(I,so.EventType.OPEN,(()=>{M||(ee(Dt,`RPC '${e}' stream ${r} transport opened.`),z.s_())})),Q(I,so.EventType.CLOSE,(()=>{M||(M=!0,ee(Dt,`RPC '${e}' stream ${r} transport closed`),z.__(),this.I_(I))})),Q(I,so.EventType.ERROR,(J=>{M||(M=!0,Ls(Dt,`RPC '${e}' stream ${r} transport errored. Name:`,J.name,"Message:",J.message),z.__(new se(q.UNAVAILABLE,"The operation could not be completed")))})),Q(I,so.EventType.MESSAGE,(J=>{var _e;if(!M){const oe=J.data[0];Me(!!oe,16349);const pe=oe,me=(pe==null?void 0:pe.error)||((_e=pe[0])===null||_e===void 0?void 0:_e.error);if(me){ee(Dt,`RPC '${e}' stream ${r} received error:`,me);const tt=me.status;let Fe=(function(E){const N=at[E];if(N!==void 0)return vf(N)})(tt),j=me.message;Fe===void 0&&(Fe=q.INTERNAL,j="Unknown error status: "+tt+" with message "+me.message),M=!0,z.__(new se(Fe,j)),I.close()}else ee(Dt,`RPC '${e}' stream ${r} received:`,oe),z.a_(oe)}})),Q(h,Oh.STAT_EVENT,(J=>{J.stat===Gl.PROXY?ee(Dt,`RPC '${e}' stream ${r} detected buffering proxy`):J.stat===Gl.NOPROXY&&ee(Dt,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{z.o_()}),0),z}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Vl(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rl(n){return new py(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jf{constructor(e,t,s=1e3,r=1.5,o=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=r,this.A_=o,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),r=Math.max(0,t-s);r>0&&ee("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,r,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kd="PersistentStream";class Df{constructor(e,t,s,r,o,l,h,p){this.Fi=e,this.w_=s,this.S_=r,this.connection=o,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=h,this.listener=p,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new jf(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(os(t.toString()),os("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,r])=>{this.b_===t&&this.W_(s,r)}),(s=>{e((()=>{const r=new se(q.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(r)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((r=>{s((()=>this.G_(r)))})),this.stream.onMessage((r=>{s((()=>++this.C_==1?this.j_(r):this.onNext(r)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return ee(kd,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(ee(kd,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class db extends Df{constructor(e,t,s,r,o,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,l),this.serializer=o}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=yy(this.serializer,e),s=(function(o){if(!("targetChange"in o))return ge.min();const l=o.targetChange;return l.targetIds&&l.targetIds.length?ge.min():l.readTime?Vn(l.readTime):ge.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=sc(this.serializer),t.addTarget=(function(o,l){let h;const p=l.target;if(h=Yl(p)?{documents:xy(o,p)}:{query:_y(o,p).Vt},h.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){h.resumeToken=wf(o,l.resumeToken);const b=ec(o,l.expectedCount);b!==null&&(h.expectedCount=b)}else if(l.snapshotVersion.compareTo(ge.min())>0){h.readTime=Oa(o,l.snapshotVersion.toTimestamp());const b=ec(o,l.expectedCount);b!==null&&(h.expectedCount=b)}return h})(this.serializer,e);const s=Ey(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=sc(this.serializer),t.removeTarget=e,this.k_(t)}}class hb extends Df{constructor(e,t,s,r,o,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,l),this.serializer=o}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Me(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Me(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Me(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=vy(e.writeResults,e.commitTime),s=Vn(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=sc(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>by(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fb{}class pb extends fb{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new se(q.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Wo(e,tc(t,s),r,o,l))).catch((o=>{throw o.name==="FirebaseError"?(o.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new se(q.UNKNOWN,o.toString())}))}Jo(e,t,s,r,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Jo(e,tc(t,s),r,l,h,o))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new se(q.UNKNOWN,l.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class mb{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(os(t),this._a=!1):ee("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const br="RemoteStore";class gb{constructor(e,t,s,r,o){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=o,this.Ea.xo((l=>{s.enqueueAndForget((async()=>{Er(this)&&(ee(br,"Restarting streams for network reachability change."),await(async function(p){const b=ye(p);b.Ia.add(4),await No(b),b.Aa.set("Unknown"),b.Ia.delete(4),await il(b)})(this))}))})),this.Aa=new mb(s,r)}}async function il(n){if(Er(n))for(const e of n.da)await e(!0)}async function No(n){for(const e of n.da)await e(!1)}function Of(n,e){const t=ye(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),Fc(t)?Mc(t):xi(t).x_()&&Vc(t,e))}function Oc(n,e){const t=ye(n),s=xi(t);t.Ta.delete(e),s.x_()&&Vf(t,e),t.Ta.size===0&&(s.x_()?s.B_():Er(t)&&t.Aa.set("Unknown"))}function Vc(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ge.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}xi(n).H_(e)}function Vf(n,e){n.Ra.$e(e),xi(n).Y_(e)}function Mc(n){n.Ra=new uy({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),xi(n).start(),n.Aa.aa()}function Fc(n){return Er(n)&&!xi(n).M_()&&n.Ta.size>0}function Er(n){return ye(n).Ia.size===0}function Mf(n){n.Ra=void 0}async function yb(n){n.Aa.set("Online")}async function bb(n){n.Ta.forEach(((e,t)=>{Vc(n,e)}))}async function vb(n,e){Mf(n),Fc(n)?(n.Aa.la(e),Mc(n)):n.Aa.set("Unknown")}async function xb(n,e,t){if(n.Aa.set("Online"),e instanceof _f&&e.state===2&&e.cause)try{await(async function(r,o){const l=o.cause;for(const h of o.targetIds)r.Ta.has(h)&&(await r.remoteSyncer.rejectListen(h,l),r.Ta.delete(h),r.Ra.removeTarget(h))})(n,e)}catch(s){ee(br,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ma(n,s)}else if(e instanceof ba?n.Ra.Ye(e):e instanceof xf?n.Ra.it(e):n.Ra.et(e),!t.isEqual(ge.min()))try{const s=await Rf(n.localStore);t.compareTo(s)>=0&&await(function(o,l){const h=o.Ra.Pt(l);return h.targetChanges.forEach(((p,b)=>{if(p.resumeToken.approximateByteSize()>0){const v=o.Ta.get(b);v&&o.Ta.set(b,v.withResumeToken(p.resumeToken,l))}})),h.targetMismatches.forEach(((p,b)=>{const v=o.Ta.get(p);if(!v)return;o.Ta.set(p,v.withResumeToken(kt.EMPTY_BYTE_STRING,v.snapshotVersion)),Vf(o,p);const I=new Rs(v.target,p,b,v.sequenceNumber);Vc(o,I)})),o.remoteSyncer.applyRemoteEvent(h)})(n,t)}catch(s){ee(br,"Failed to raise snapshot:",s),await Ma(n,s)}}async function Ma(n,e,t){if(!vi(e))throw e;n.Ia.add(1),await No(n),n.Aa.set("Offline"),t||(t=()=>Rf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{ee(br,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await il(n)}))}function Ff(n,e){return e().catch((t=>Ma(n,t,e)))}async function ol(n){const e=ye(n),t=qs(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:_c;for(;_b(e);)try{const r=await nb(e.localStore,s);if(r===null){e.Pa.length===0&&t.B_();break}s=r.batchId,wb(e,r)}catch(r){await Ma(e,r)}Lf(e)&&$f(e)}function _b(n){return Er(n)&&n.Pa.length<10}function wb(n,e){n.Pa.push(e);const t=qs(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Lf(n){return Er(n)&&!qs(n).M_()&&n.Pa.length>0}function $f(n){qs(n).start()}async function Eb(n){qs(n).na()}async function Tb(n){const e=qs(n);for(const t of n.Pa)e.X_(t.mutations)}async function Ib(n,e,t){const s=n.Pa.shift(),r=Sc.from(s,e,t);await Ff(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await ol(n)}async function Ab(n,e){e&&qs(n).Z_&&await(async function(s,r){if((function(l){return ly(l)&&l!==q.ABORTED})(r.code)){const o=s.Pa.shift();qs(s).N_(),await Ff(s,(()=>s.remoteSyncer.rejectFailedWrite(o.batchId,r))),await ol(s)}})(n,e),Lf(n)&&$f(n)}async function Sd(n,e){const t=ye(n);t.asyncQueue.verifyOperationInProgress(),ee(br,"RemoteStore received new credentials");const s=Er(t);t.Ia.add(3),await No(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await il(t)}async function kb(n,e){const t=ye(n);e?(t.Ia.delete(2),await il(t)):e||(t.Ia.add(2),await No(t),t.Aa.set("Unknown"))}function xi(n){return n.Va||(n.Va=(function(t,s,r){const o=ye(t);return o.ia(),new db(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:yb.bind(null,n),e_:bb.bind(null,n),n_:vb.bind(null,n),J_:xb.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),Fc(n)?Mc(n):n.Aa.set("Unknown")):(await n.Va.stop(),Mf(n))}))),n.Va}function qs(n){return n.ma||(n.ma=(function(t,s,r){const o=ye(t);return o.ia(),new hb(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:Eb.bind(null,n),n_:Ab.bind(null,n),ea:Tb.bind(null,n),ta:Ib.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await ol(n)):(await n.ma.stop(),n.Pa.length>0&&(ee(br,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,t,s,r,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=o,this.deferred=new ns,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,o){const l=Date.now()+s,h=new Lc(e,t,l,r,o);return h.start(s),h}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new se(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function $c(n,e){if(os("AsyncQueue",`${e}: ${n}`),vi(n))return new se(q.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni{static emptySet(e){return new ni(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||ue.comparator(t.key,s.key):(t,s)=>ue.comparator(t.key,s.key),this.keyedMap=ro(),this.sortedSet=new Qe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ni)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(!r.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new ni;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(){this.fa=new Qe(ue.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):he(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class fi{constructor(e,t,s,r,o,l,h,p,b){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=o,this.fromCache=l,this.syncStateChanged=h,this.excludesMetadataChanges=p,this.hasCachedResults=b}static fromInitialDocuments(e,t,s,r,o){const l=[];return t.forEach((h=>{l.push({type:0,doc:h})})),new fi(e,t,ni.emptySet(t),l,s,r,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Za(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sb{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class Nb{constructor(){this.queries=Cd(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const r=ye(t),o=r.queries;r.queries=Cd(),o.forEach(((l,h)=>{for(const p of h.wa)p.onError(s)}))})(this,new se(q.ABORTED,"Firestore shutting down"))}}function Cd(){return new _r((n=>of(n)),Za)}async function Uf(n,e){const t=ye(n);let s=3;const r=e.query;let o=t.queries.get(r);o?!o.Sa()&&e.ba()&&(s=2):(o=new Sb,s=e.ba()?0:1);try{switch(s){case 0:o.ya=await t.onListen(r,!0);break;case 1:o.ya=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(l){const h=$c(l,`Initialization of query '${Zr(e.query)}' failed`);return void e.onError(h)}t.queries.set(r,o),o.wa.push(e),e.va(t.onlineState),o.ya&&e.Ca(o.ya)&&Uc(t)}async function zf(n,e){const t=ye(n),s=e.query;let r=3;const o=t.queries.get(s);if(o){const l=o.wa.indexOf(e);l>=0&&(o.wa.splice(l,1),o.wa.length===0?r=e.ba()?0:1:!o.Sa()&&e.ba()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function Cb(n,e){const t=ye(n);let s=!1;for(const r of e){const o=r.query,l=t.queries.get(o);if(l){for(const h of l.wa)h.Ca(r)&&(s=!0);l.ya=r}}s&&Uc(t)}function Pb(n,e,t){const s=ye(n),r=s.queries.get(e);if(r)for(const o of r.wa)o.onError(t);s.queries.delete(e)}function Uc(n){n.Da.forEach((e=>{e.next()}))}var oc,Pd;(Pd=oc||(oc={})).Fa="default",Pd.Cache="cache";class Bf{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new fi(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=fi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==oc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qf{constructor(e){this.key=e}}class Hf{constructor(e){this.key=e}}class Rb{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Se(),this.mutatedKeys=Se(),this.Xa=af(e),this.eu=new ni(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new Nd,r=t?t.eu:this.eu;let o=t?t.mutatedKeys:this.mutatedKeys,l=r,h=!1;const p=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,b=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((v,I)=>{const A=r.get(v),M=el(this.query,I)?I:null,z=!!A&&this.mutatedKeys.has(A.key),Q=!!M&&(M.hasLocalMutations||this.mutatedKeys.has(M.key)&&M.hasCommittedMutations);let J=!1;A&&M?A.data.isEqual(M.data)?z!==Q&&(s.track({type:3,doc:M}),J=!0):this.iu(A,M)||(s.track({type:2,doc:M}),J=!0,(p&&this.Xa(M,p)>0||b&&this.Xa(M,b)<0)&&(h=!0)):!A&&M?(s.track({type:0,doc:M}),J=!0):A&&!M&&(s.track({type:1,doc:A}),J=!0,(p||b)&&(h=!0)),J&&(M?(l=l.add(M),o=Q?o.add(v):o.delete(v)):(l=l.delete(v),o=o.delete(v)))})),this.query.limit!==null)for(;l.size>this.query.limit;){const v=this.query.limitType==="F"?l.last():l.first();l=l.delete(v.key),o=o.delete(v.key),s.track({type:1,doc:v})}return{eu:l,ru:s,Ds:h,mutatedKeys:o}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const o=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const l=e.ru.pa();l.sort(((v,I)=>(function(M,z){const Q=J=>{switch(J){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return he(20277,{At:J})}};return Q(M)-Q(z)})(v.type,I.type)||this.Xa(v.doc,I.doc))),this.su(s),r=r!=null&&r;const h=t&&!r?this.ou():[],p=this.Za.size===0&&this.current&&!r?1:0,b=p!==this.Ya;return this.Ya=p,l.length!==0||b?{snapshot:new fi(this.query,e.eu,o,l,e.mutatedKeys,p===0,b,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:h}:{_u:h}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Nd,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Se(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Hf(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new qf(s))})),t}uu(e){this.Ha=e.qs,this.Za=Se();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return fi.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const zc="SyncEngine";class jb{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class Db{constructor(e){this.key=e,this.lu=!1}}class Ob{constructor(e,t,s,r,o,l){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=o,this.maxConcurrentLimboResolutions=l,this.hu={},this.Pu=new _r((h=>of(h)),Za),this.Tu=new Map,this.Iu=new Set,this.du=new Qe(ue.comparator),this.Eu=new Map,this.Au=new Pc,this.Ru={},this.Vu=new Map,this.mu=hi.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function Vb(n,e,t=!0){const s=Xf(n);let r;const o=s.Pu.get(e);return o?(s.sharedClientState.addLocalQueryTarget(o.targetId),r=o.view.cu()):r=await Wf(s,e,t,!0),r}async function Mb(n,e){const t=Xf(n);await Wf(t,e,!0,!1)}async function Wf(n,e,t,s){const r=await sb(n.localStore,On(e)),o=r.targetId,l=n.sharedClientState.addLocalQueryTarget(o,t);let h;return s&&(h=await Fb(n,e,o,l==="current",r.resumeToken)),n.isPrimaryClient&&t&&Of(n.remoteStore,r),h}async function Fb(n,e,t,s,r){n.gu=(I,A,M)=>(async function(Q,J,_e,oe){let pe=J.view.nu(_e);pe.Ds&&(pe=await Ed(Q.localStore,J.query,!1).then((({documents:j})=>J.view.nu(j,pe))));const me=oe&&oe.targetChanges.get(J.targetId),tt=oe&&oe.targetMismatches.get(J.targetId)!=null,Fe=J.view.applyChanges(pe,Q.isPrimaryClient,me,tt);return jd(Q,J.targetId,Fe._u),Fe.snapshot})(n,I,A,M);const o=await Ed(n.localStore,e,!0),l=new Rb(e,o.qs),h=l.nu(o.documents),p=So.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),b=l.applyChanges(h,n.isPrimaryClient,p);jd(n,t,b._u);const v=new jb(e,t,l);return n.Pu.set(e,v),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),b.snapshot}async function Lb(n,e,t){const s=ye(n),r=s.Pu.get(e),o=s.Tu.get(r.targetId);if(o.length>1)return s.Tu.set(r.targetId,o.filter((l=>!Za(l,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await rc(s.localStore,r.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(r.targetId),t&&Oc(s.remoteStore,r.targetId),ac(s,r.targetId)})).catch(bi)):(ac(s,r.targetId),await rc(s.localStore,r.targetId,!0))}async function $b(n,e){const t=ye(n),s=t.Pu.get(e),r=t.Tu.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Oc(t.remoteStore,s.targetId))}async function Ub(n,e,t){const s=Kb(n);try{const r=await(function(l,h){const p=ye(l),b=Je.now(),v=h.reduce(((M,z)=>M.add(z.key)),Se());let I,A;return p.persistence.runTransaction("Locally write mutations","readwrite",(M=>{let z=as(),Q=Se();return p.Os.getEntries(M,v).next((J=>{z=J,z.forEach(((_e,oe)=>{oe.isValidDocument()||(Q=Q.add(_e))}))})).next((()=>p.localDocuments.getOverlayedDocuments(M,z))).next((J=>{I=J;const _e=[];for(const oe of h){const pe=sy(oe,I.get(oe.key).overlayedDocument);pe!=null&&_e.push(new wr(oe.key,pe,Yh(pe.value.mapValue),ss.exists(!0)))}return p.mutationQueue.addMutationBatch(M,b,_e,h)})).next((J=>{A=J;const _e=J.applyToLocalDocumentSet(I,Q);return p.documentOverlayCache.saveOverlays(M,J.batchId,_e)}))})).then((()=>({batchId:A.batchId,changes:cf(I)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),(function(l,h,p){let b=l.Ru[l.currentUser.toKey()];b||(b=new Qe(we)),b=b.insert(h,p),l.Ru[l.currentUser.toKey()]=b})(s,r.batchId,t),await Co(s,r.changes),await ol(s.remoteStore)}catch(r){const o=$c(r,"Failed to persist write");t.reject(o)}}async function Gf(n,e){const t=ye(n);try{const s=await eb(t.localStore,e);e.targetChanges.forEach(((r,o)=>{const l=t.Eu.get(o);l&&(Me(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?l.lu=!0:r.modifiedDocuments.size>0?Me(l.lu,14607):r.removedDocuments.size>0&&(Me(l.lu,42227),l.lu=!1))})),await Co(t,s,e)}catch(s){await bi(s)}}function Rd(n,e,t){const s=ye(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Pu.forEach(((o,l)=>{const h=l.view.va(e);h.snapshot&&r.push(h.snapshot)})),(function(l,h){const p=ye(l);p.onlineState=h;let b=!1;p.queries.forEach(((v,I)=>{for(const A of I.wa)A.va(h)&&(b=!0)})),b&&Uc(p)})(s.eventManager,e),r.length&&s.hu.J_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function zb(n,e,t){const s=ye(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Eu.get(e),o=r&&r.key;if(o){let l=new Qe(ue.comparator);l=l.insert(o,Vt.newNoDocument(o,ge.min()));const h=Se().add(o),p=new sl(ge.min(),new Map,new Qe(we),l,h);await Gf(s,p),s.du=s.du.remove(o),s.Eu.delete(e),Bc(s)}else await rc(s.localStore,e,!1).then((()=>ac(s,e,t))).catch(bi)}async function Bb(n,e){const t=ye(n),s=e.batch.batchId;try{const r=await Zy(t.localStore,e);Jf(t,s,null),Kf(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Co(t,r)}catch(r){await bi(r)}}async function qb(n,e,t){const s=ye(n);try{const r=await(function(l,h){const p=ye(l);return p.persistence.runTransaction("Reject batch","readwrite-primary",(b=>{let v;return p.mutationQueue.lookupMutationBatch(b,h).next((I=>(Me(I!==null,37113),v=I.keys(),p.mutationQueue.removeMutationBatch(b,I)))).next((()=>p.mutationQueue.performConsistencyCheck(b))).next((()=>p.documentOverlayCache.removeOverlaysForBatchId(b,v,h))).next((()=>p.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(b,v))).next((()=>p.localDocuments.getDocuments(b,v)))}))})(s.localStore,e);Jf(s,e,t),Kf(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Co(s,r)}catch(r){await bi(r)}}function Kf(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function Jf(n,e,t){const s=ye(n);let r=s.Ru[s.currentUser.toKey()];if(r){const o=r.get(e);o&&(t?o.reject(t):o.resolve(),r=r.remove(e)),s.Ru[s.currentUser.toKey()]=r}}function ac(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Tu.get(e))n.Pu.delete(s),t&&n.hu.pu(s,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((s=>{n.Au.containsKey(s)||Qf(n,s)}))}function Qf(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Oc(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),Bc(n))}function jd(n,e,t){for(const s of t)s instanceof qf?(n.Au.addReference(s.key,e),Hb(n,s)):s instanceof Hf?(ee(zc,"Document no longer in limbo: "+s.key),n.Au.removeReference(s.key,e),n.Au.containsKey(s.key)||Qf(n,s.key)):he(19791,{yu:s})}function Hb(n,e){const t=e.key,s=t.path.canonicalString();n.du.get(t)||n.Iu.has(s)||(ee(zc,"New document in limbo: "+t),n.Iu.add(s),Bc(n))}function Bc(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new ue(Ke.fromString(e)),s=n.mu.next();n.Eu.set(s,new Db(t)),n.du=n.du.insert(t,s),Of(n.remoteStore,new Rs(On(Ac(t.path)),s,"TargetPurposeLimboResolution",Ja.ue))}}async function Co(n,e,t){const s=ye(n),r=[],o=[],l=[];s.Pu.isEmpty()||(s.Pu.forEach(((h,p)=>{l.push(s.gu(p,e,t).then((b=>{var v;if((b||t)&&s.isPrimaryClient){const I=b?!b.fromCache:(v=t==null?void 0:t.targetChanges.get(p.targetId))===null||v===void 0?void 0:v.current;s.sharedClientState.updateQueryState(p.targetId,I?"current":"not-current")}if(b){r.push(b);const I=jc.Es(p.targetId,b);o.push(I)}})))})),await Promise.all(l),s.hu.J_(r),await(async function(p,b){const v=ye(p);try{await v.persistence.runTransaction("notifyLocalViewChanges","readwrite",(I=>B.forEach(b,(A=>B.forEach(A.Is,(M=>v.persistence.referenceDelegate.addReference(I,A.targetId,M))).next((()=>B.forEach(A.ds,(M=>v.persistence.referenceDelegate.removeReference(I,A.targetId,M)))))))))}catch(I){if(!vi(I))throw I;ee(Dc,"Failed to update sequence numbers: "+I)}for(const I of b){const A=I.targetId;if(!I.fromCache){const M=v.Fs.get(A),z=M.snapshotVersion,Q=M.withLastLimboFreeSnapshotVersion(z);v.Fs=v.Fs.insert(A,Q)}}})(s.localStore,o))}async function Wb(n,e){const t=ye(n);if(!t.currentUser.isEqual(e)){ee(zc,"User change. New user:",e.toKey());const s=await Pf(t.localStore,e);t.currentUser=e,(function(o,l){o.Vu.forEach((h=>{h.forEach((p=>{p.reject(new se(q.CANCELLED,l))}))})),o.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Co(t,s.Bs)}}function Gb(n,e){const t=ye(n),s=t.Eu.get(e);if(s&&s.lu)return Se().add(s.key);{let r=Se();const o=t.Tu.get(e);if(!o)return r;for(const l of o){const h=t.Pu.get(l);r=r.unionWith(h.view.tu)}return r}}function Xf(n){const e=ye(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Gb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=zb.bind(null,e),e.hu.J_=Cb.bind(null,e.eventManager),e.hu.pu=Pb.bind(null,e.eventManager),e}function Kb(n){const e=ye(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Bb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=qb.bind(null,e),e}class Fa{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=rl(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Yy(this.persistence,new Jy,e.initialUser,this.serializer)}Du(e){return new Cf(Rc.Vi,this.serializer)}bu(e){return new ib}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Fa.provider={build:()=>new Fa};class Jb extends Fa{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Me(this.persistence.referenceDelegate instanceof Va,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new Dy(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?Ht.withCacheSize(this.cacheSizeBytes):Ht.DEFAULT;return new Cf((s=>Va.Vi(s,t)),this.serializer)}}class lc{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Rd(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Wb.bind(null,this.syncEngine),await kb(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Nb})()}createDatastore(e){const t=rl(e.databaseInfo.databaseId),s=(function(o){return new ub(o)})(e.databaseInfo);return(function(o,l,h,p){return new pb(o,l,h,p)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,r,o,l,h){return new gb(s,r,o,l,h)})(this.localStore,this.datastore,e.asyncQueue,(t=>Rd(this.syncEngine,t,0)),(function(){return Ad.C()?new Ad:new ob})())}createSyncEngine(e,t){return(function(r,o,l,h,p,b,v){const I=new Ob(r,o,l,h,p,b);return v&&(I.fu=!0),I})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const o=ye(r);ee(br,"RemoteStore shutting down."),o.Ia.add(5),await No(o),o.Ea.shutdown(),o.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}lc.provider={build:()=>new lc};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):os("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hs="FirestoreClient";class Qb{constructor(e,t,s,r,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=r,this.user=Ot.UNAUTHENTICATED,this.clientId=vc.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(s,(async l=>{ee(Hs,"Received user=",l.uid),await this.authCredentialListener(l),this.user=l})),this.appCheckCredentials.start(s,(l=>(ee(Hs,"Received new app check token=",l),this.appCheckCredentialListener(l,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ns;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=$c(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Ml(n,e){n.asyncQueue.verifyOperationInProgress(),ee(Hs,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async r=>{s.isEqual(r)||(await Pf(e.localStore,r),s=r)})),e.persistence.setDatabaseDeletedListener((()=>{Ls("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{ee("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((r=>{Ls("Terminating Firestore due to IndexedDb database deletion failed",r)}))})),n._offlineComponents=e}async function Dd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Xb(n);ee(Hs,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>Sd(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,r)=>Sd(e.remoteStore,r))),n._onlineComponents=e}async function Xb(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){ee(Hs,"Using user provided OfflineComponentProvider");try{await Ml(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===q.FAILED_PRECONDITION||r.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;Ls("Error using user provided cache. Falling back to memory cache: "+t),await Ml(n,new Fa)}}else ee(Hs,"Using default OfflineComponentProvider"),await Ml(n,new Jb(void 0));return n._offlineComponents}async function Zf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(ee(Hs,"Using user provided OnlineComponentProvider"),await Dd(n,n._uninitializedComponentsProvider._online)):(ee(Hs,"Using default OnlineComponentProvider"),await Dd(n,new lc))),n._onlineComponents}function Yb(n){return Zf(n).then((e=>e.syncEngine))}async function ep(n){const e=await Zf(n),t=e.eventManager;return t.onListen=Vb.bind(null,e.syncEngine),t.onUnlisten=Lb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Mb.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=$b.bind(null,e.syncEngine),t}function Zb(n,e,t={}){const s=new ns;return n.asyncQueue.enqueueAndForget((async()=>(function(o,l,h,p,b){const v=new Yf({next:A=>{v.Ou(),l.enqueueAndForget((()=>zf(o,I)));const M=A.docs.has(h);!M&&A.fromCache?b.reject(new se(q.UNAVAILABLE,"Failed to get document because the client is offline.")):M&&A.fromCache&&p&&p.source==="server"?b.reject(new se(q.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):b.resolve(A)},error:A=>b.reject(A)}),I=new Bf(Ac(h.path),v,{includeMetadataChanges:!0,ka:!0});return Uf(o,I)})(await ep(n),n.asyncQueue,e,t,s))),s.promise}function ev(n,e,t={}){const s=new ns;return n.asyncQueue.enqueueAndForget((async()=>(function(o,l,h,p,b){const v=new Yf({next:A=>{v.Ou(),l.enqueueAndForget((()=>zf(o,I))),A.fromCache&&p.source==="server"?b.reject(new se(q.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):b.resolve(A)},error:A=>b.reject(A)}),I=new Bf(h,v,{includeMetadataChanges:!0,ka:!0});return Uf(o,I)})(await ep(n),n.asyncQueue,e,t,s))),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const np="firestore.googleapis.com",Vd=!0;class Md{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new se(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=np,this.ssl=Vd}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Vd;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Nf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ry)throw new se(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}g0("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=tp((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new se(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,r){return s.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class al{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Md({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new se(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new se(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Md(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new a0;switch(s.type){case"firstParty":return new d0(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new se(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Od.get(t);s&&(ee("ComponentProvider","Removing Datastore"),Od.delete(t),s.terminate())})(this),Promise.resolve()}}function tv(n,e,t,s={}){var r;n=yr(n,al);const o=mi(e),l=n._getSettings(),h=Object.assign(Object.assign({},l),{emulatorOptions:n._getEmulatorOptions()}),p=`${e}:${t}`;o&&(Th(`https://${p}`),Ih("Firestore",!0)),l.host!==np&&l.host!==p&&Ls("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const b=Object.assign(Object.assign({},l),{host:p,ssl:o,emulatorOptions:s});if(!pr(b,h)&&(n._setSettings(b),s.mockUserToken)){let v,I;if(typeof s.mockUserToken=="string")v=s.mockUserToken,I=Ot.MOCK_USER;else{v=Rm(s.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const A=s.mockUserToken.sub||s.mockUserToken.user_id;if(!A)throw new se(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");I=new Ot(A)}n._authCredentials=new l0(new Lh(v,I))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ll(this.firestore,e,this._query)}}class mt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ms(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new mt(this.firestore,e,this._key)}toJSON(){return{type:mt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(Ao(t,mt._jsonSchema))return new mt(e,s||null,new ue(Ke.fromString(t.referencePath)))}}mt._jsonSchemaVersion="firestore/documentReference/1.0",mt._jsonSchema={type:lt("string",mt._jsonSchemaVersion),referencePath:lt("string")};class Ms extends ll{constructor(e,t,s){super(e,t,Ac(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new mt(this.firestore,null,new ue(e))}withConverter(e){return new Ms(this.firestore,e,this._path)}}function nv(n,e,...t){if(n=Wt(n),Uh("collection","path",e),n instanceof al){const s=Ke.fromString(e,...t);return Xu(s),new Ms(n,null,s)}{if(!(n instanceof mt||n instanceof Ms))throw new se(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(Ke.fromString(e,...t));return Xu(s),new Ms(n.firestore,null,s)}}function Zn(n,e,...t){if(n=Wt(n),arguments.length===1&&(e=vc.newId()),Uh("doc","path",e),n instanceof al){const s=Ke.fromString(e,...t);return Qu(s),new mt(n,null,new ue(s))}{if(!(n instanceof mt||n instanceof Ms))throw new se(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(Ke.fromString(e,...t));return Qu(s),new mt(n.firestore,n instanceof Ms?n.converter:null,new ue(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd="AsyncQueue";class Ld{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new jf(this,"async_queue_retry"),this.oc=()=>{const s=Vl();s&&ee(Fd,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=Vl();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Vl();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new ns;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!vi(e))throw e;ee(Fd,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,os("INTERNAL UNHANDLED ERROR: ",$d(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=Lc.createAndSchedule(this,e,t,s,(o=>this.lc(o)));return this.ec.push(r),r}ac(){this.tc&&he(47125,{hc:$d(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function $d(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class cl extends al{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new Ld,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ld(e),this._firestoreClient=void 0,await e}}}function sv(n,e){const t=typeof n=="object"?n:Nh(),s=typeof n=="string"?n:Na,r=yc(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const o=Cm("firestore");o&&tv(r,...o)}return r}function qc(n){if(n._terminated)throw new se(q.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||rv(n),n._firestoreClient}function rv(n){var e,t,s;const r=n._freezeSettings(),o=(function(h,p,b,v){return new k0(h,p,b,v.host,v.ssl,v.experimentalForceLongPolling,v.experimentalAutoDetectLongPolling,tp(v.experimentalLongPollingOptions),v.useFetchStreams,v.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new Qb(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&(function(h){const p=h==null?void 0:h._online.build();return{_offline:h==null?void 0:h._offline.build(p),_online:p}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e){this._byteString=e}static fromBase64String(e){try{return new on(kt.fromBase64String(e))}catch(t){throw new se(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new on(kt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:on._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ao(e,on._jsonSchema))return on.fromBase64String(e.bytes)}}on._jsonSchemaVersion="firestore/bytes/1.0",on._jsonSchema={type:lt("string",on._jsonSchemaVersion),bytes:lt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new se(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new At(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new se(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new se(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return we(this._lat,e._lat)||we(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Mn._jsonSchemaVersion}}static fromJSON(e){if(Ao(e,Mn._jsonSchema))return new Mn(e.latitude,e.longitude)}}Mn._jsonSchemaVersion="firestore/geoPoint/1.0",Mn._jsonSchema={type:lt("string",Mn._jsonSchemaVersion),latitude:lt("number"),longitude:lt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,r){if(s.length!==r.length)return!1;for(let o=0;o<s.length;++o)if(s[o]!==r[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Fn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ao(e,Fn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Fn(e.vectorValues);throw new se(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Fn._jsonSchemaVersion="firestore/vectorValue/1.0",Fn._jsonSchema={type:lt("string",Fn._jsonSchemaVersion),vectorValues:lt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=/^__.*__$/;class ov{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new wr(e,this.data,this.fieldMask,t,this.fieldTransforms):new ko(e,this.data,t,this.fieldTransforms)}}function rp(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw he(40011,{Ec:n})}}class Wc{constructor(e,t,s,r,o,l){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=l||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Wc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:s,mc:!1});return r.fc(e),r}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:s,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return La(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(rp(this.Ec)&&iv.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class av{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||rl(e)}Dc(e,t,s,r=!1){return new Wc({Ec:e,methodName:t,bc:s,path:At.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function lv(n){const e=n._freezeSettings(),t=rl(n._databaseId);return new av(n._databaseId,!!e.ignoreUndefinedProperties,t)}function cv(n,e,t,s,r,o={}){const l=n.Dc(o.merge||o.mergeFields?2:0,e,t,r);lp("Data must be an object, but it was:",l,s);const h=op(s,l);let p,b;if(o.merge)p=new bn(l.fieldMask),b=l.fieldTransforms;else if(o.mergeFields){const v=[];for(const I of o.mergeFields){const A=uv(e,I,t);if(!l.contains(A))throw new se(q.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);hv(v,A)||v.push(A)}p=new bn(v),b=l.fieldTransforms.filter((I=>p.covers(I.field)))}else p=null,b=l.fieldTransforms;return new ov(new rn(h),p,b)}function ip(n,e){if(ap(n=Wt(n)))return lp("Unsupported field value:",e,n),op(n,e);if(n instanceof sp)return(function(s,r){if(!rp(r.Ec))throw r.wc(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.wc(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(r);o&&r.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,r){const o=[];let l=0;for(const h of s){let p=ip(h,r.yc(l));p==null&&(p={nullValue:"NULL_VALUE"}),o.push(p),l++}return{arrayValue:{values:o}}})(n,e)}return(function(s,r){if((s=Wt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return X0(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const o=Je.fromDate(s);return{timestampValue:Oa(r.serializer,o)}}if(s instanceof Je){const o=new Je(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Oa(r.serializer,o)}}if(s instanceof Mn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof on)return{bytesValue:wf(r.serializer,s._byteString)};if(s instanceof mt){const o=r.databaseId,l=s.firestore._databaseId;if(!l.isEqual(o))throw r.wc(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Cc(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Fn)return(function(l,h){return{mapValue:{fields:{[Qh]:{stringValue:Xh},[Ca]:{arrayValue:{values:l.toArray().map((b=>{if(typeof b!="number")throw h.wc("VectorValues must only contain numeric values.");return kc(h.serializer,b)}))}}}}}})(s,r);throw r.wc(`Unsupported field value: ${xc(s)}`)})(n,e)}function op(n,e){const t={};return qh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):xr(n,((s,r)=>{const o=ip(r,e.Vc(s));o!=null&&(t[s]=o)})),{mapValue:{fields:t}}}function ap(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Je||n instanceof Mn||n instanceof on||n instanceof mt||n instanceof sp||n instanceof Fn)}function lp(n,e,t){if(!ap(t)||!zh(t)){const s=xc(t);throw s==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+s)}}function uv(n,e,t){if((e=Wt(e))instanceof Hc)return e._internalPath;if(typeof e=="string")return cp(n,e);throw La("Field path arguments must be of type string or ",n,!1,void 0,t)}const dv=new RegExp("[~\\*/\\[\\]]");function cp(n,e,t){if(e.search(dv)>=0)throw La(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Hc(...e.split("."))._internalPath}catch{throw La(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function La(n,e,t,s,r){const o=s&&!s.isEmpty(),l=r!==void 0;let h=`Function ${e}() called with invalid data`;t&&(h+=" (via `toFirestore()`)"),h+=". ";let p="";return(o||l)&&(p+=" (found",o&&(p+=` in field ${s}`),l&&(p+=` in document ${r}`),p+=")"),new se(q.INVALID_ARGUMENT,h+n+p)}function hv(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e,t,s,r,o){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new mt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new fv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(dp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class fv extends up{data(){return super.data()}}function dp(n,e){return typeof e=="string"?cp(n,e):e instanceof Hc?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new se(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class mv{convertValue(e,t="none"){switch(Bs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return st(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(zs(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw he(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return xr(e,((r,o)=>{s[r]=this.convertValue(o,t)})),s}convertVectorValue(e){var t,s,r;const o=(r=(s=(t=e.fields)===null||t===void 0?void 0:t[Ca].arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map((l=>st(l.doubleValue)));return new Fn(o)}convertGeoPoint(e){return new Mn(st(e.latitude),st(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Xa(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(bo(e));default:return null}}convertTimestamp(e){const t=Us(e);return new Je(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=Ke.fromString(e);Me(Sf(s),9688,{name:e});const r=new vo(s.get(1),s.get(3)),o=new ue(s.popFirst(5));return r.isEqual(t)||os(`Document ${o} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gv(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class oo{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class hr extends up{constructor(e,t,s,r,o,l){super(e,t,s,r,l),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new va(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(dp("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new se(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=hr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}hr._jsonSchemaVersion="firestore/documentSnapshot/1.0",hr._jsonSchema={type:lt("string",hr._jsonSchemaVersion),bundleSource:lt("string","DocumentSnapshot"),bundleName:lt("string"),bundle:lt("string")};class va extends hr{data(e={}){return super.data(e)}}class si{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new oo(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new va(this._firestore,this._userDataWriter,s.key,s,new oo(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new se(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,o){if(r._snapshot.oldDocs.isEmpty()){let l=0;return r._snapshot.docChanges.map((h=>{const p=new va(r._firestore,r._userDataWriter,h.doc.key,h.doc,new oo(r._snapshot.mutatedKeys.has(h.doc.key),r._snapshot.fromCache),r.query.converter);return h.doc,{type:"added",doc:p,oldIndex:-1,newIndex:l++}}))}{let l=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((h=>o||h.type!==3)).map((h=>{const p=new va(r._firestore,r._userDataWriter,h.doc.key,h.doc,new oo(r._snapshot.mutatedKeys.has(h.doc.key),r._snapshot.fromCache),r.query.converter);let b=-1,v=-1;return h.type!==0&&(b=l.indexOf(h.doc.key),l=l.delete(h.doc.key)),h.type!==1&&(l=l.add(h.doc),v=l.indexOf(h.doc.key)),{type:yv(h.type),doc:p,oldIndex:b,newIndex:v}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new se(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=si._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=vc.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach((o=>{o._document!==null&&(t.push(o._document),s.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),r.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function yv(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return he(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ua(n){n=yr(n,mt);const e=yr(n.firestore,cl);return Zb(qc(e),n._key).then((t=>xv(e,n,t)))}si._jsonSchemaVersion="firestore/querySnapshot/1.0",si._jsonSchema={type:lt("string",si._jsonSchemaVersion),bundleSource:lt("string","QuerySnapshot"),bundleName:lt("string"),bundle:lt("string")};class hp extends mv{constructor(e){super(),this.firestore=e}convertBytes(e){return new on(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new mt(this.firestore,null,t)}}function bv(n){n=yr(n,ll);const e=yr(n.firestore,cl),t=qc(e),s=new hp(e);return pv(n._query),ev(t,n._query).then((r=>new si(e,s,n,r)))}function no(n,e,t){n=yr(n,mt);const s=yr(n.firestore,cl),r=gv(n.converter,e,t);return vv(s,[cv(lv(s),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,ss.none())])}function vv(n,e){return(function(s,r){const o=new ns;return s.asyncQueue.enqueueAndForget((async()=>Ub(await Yb(s),r,o))),o.promise})(qc(n),e)}function xv(n,e,t){const s=t.docs.get(e._key),r=new hp(n);return new hr(n,r,e._key,s,new oo(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(r){yi=r})(gi),li(new mr("firestore",((s,{instanceIdentifier:r,options:o})=>{const l=s.getProvider("app").getImmediate(),h=new cl(new c0(s.getProvider("auth-internal")),new h0(l,s.getProvider("app-check-internal")),(function(b,v){if(!Object.prototype.hasOwnProperty.apply(b.options,["projectId"]))throw new se(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new vo(b.options.projectId,v)})(l,r),l);return o=Object.assign({useFetchStreams:t},o),h._setSettings(o),h}),"PUBLIC").setMultipleInstances(!0)),Os(Hu,Wu,e),Os(Hu,Wu,"esm2017")})();function Gc(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t}function fp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _v=fp,pp=new To("auth","Firebase",fp());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a=new mc("@firebase/auth");function wv(n,...e){$a.logLevel<=ke.WARN&&$a.warn(`Auth (${gi}): ${n}`,...e)}function xa(n,...e){$a.logLevel<=ke.ERROR&&$a.error(`Auth (${gi}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zn(n,...e){throw Jc(n,...e)}function xn(n,...e){return Jc(n,...e)}function Kc(n,e,t){const s=Object.assign(Object.assign({},_v()),{[e]:t});return new To("auth","Firebase",s).create(e,{appName:n.name})}function Fs(n){return Kc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function mp(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&zn(n,"argument-error"),Kc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jc(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return pp.create(n,...e)}function fe(n,e,...t){if(!n)throw Jc(e,...t)}function es(n){const e="INTERNAL ASSERTION FAILED: "+n;throw xa(e),new Error(e)}function ls(n,e){n||es(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ev(){return Ud()==="http:"||Ud()==="https:"}function Ud(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ev()||Fm()||"connection"in navigator)?navigator.onLine:!0}function Iv(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e,t){this.shortDelay=e,this.longDelay=t,ls(t>e,"Short delay should be less than long delay!"),this.isMobile=Om()||Lm()}get(){return Tv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qc(n,e){ls(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gp{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;es("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;es("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;es("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kv=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Sv=new Po(3e4,6e4);function Xc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function _i(n,e,t,s,r={}){return yp(n,r,async()=>{let o={},l={};s&&(e==="GET"?l=s:o={body:JSON.stringify(s)});const h=Io(Object.assign({key:n.config.apiKey},l)).slice(1),p=await n._getAdditionalHeaders();p["Content-Type"]="application/json",n.languageCode&&(p["X-Firebase-Locale"]=n.languageCode);const b=Object.assign({method:e,headers:p},o);return Mm()||(b.referrerPolicy="no-referrer"),n.emulatorConfig&&mi(n.emulatorConfig.host)&&(b.credentials="include"),gp.fetch()(await bp(n,n.config.apiHost,t,h),b)})}async function yp(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},Av),e);try{const r=new Cv(n),o=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const l=await o.json();if("needConfirmation"in l)throw da(n,"account-exists-with-different-credential",l);if(o.ok&&!("errorMessage"in l))return l;{const h=o.ok?l.errorMessage:l.error.message,[p,b]=h.split(" : ");if(p==="FEDERATED_USER_ID_ALREADY_LINKED")throw da(n,"credential-already-in-use",l);if(p==="EMAIL_EXISTS")throw da(n,"email-already-in-use",l);if(p==="USER_DISABLED")throw da(n,"user-disabled",l);const v=s[p]||p.toLowerCase().replace(/[_\s]+/g,"-");if(b)throw Kc(n,v,b);zn(n,v)}}catch(r){if(r instanceof cs)throw r;zn(n,"network-request-failed",{message:String(r)})}}async function Nv(n,e,t,s,r={}){const o=await _i(n,e,t,s,r);return"mfaPendingCredential"in o&&zn(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function bp(n,e,t,s){const r=`${e}${t}?${s}`,o=n,l=o.config.emulator?Qc(n.config,r):`${n.config.apiScheme}://${r}`;return kv.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(l).toString():l}class Cv{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(xn(this.auth,"network-request-failed")),Sv.get())})}}function da(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=xn(n,e,s);return r.customData._tokenResponse=t,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pv(n,e){return _i(n,"POST","/v1/accounts:delete",e)}async function Ua(n,e){return _i(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mo(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rv(n,e=!1){const t=Wt(n),s=await t.getIdToken(e),r=Yc(s);fe(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const o=typeof r.firebase=="object"?r.firebase:void 0,l=o==null?void 0:o.sign_in_provider;return{claims:r,token:s,authTime:mo(Fl(r.auth_time)),issuedAtTime:mo(Fl(r.iat)),expirationTime:mo(Fl(r.exp)),signInProvider:l||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Fl(n){return Number(n)*1e3}function Yc(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return xa("JWT malformed, contained fewer than 3 sections"),null;try{const r=xh(t);return r?JSON.parse(r):(xa("Failed to decode base64 JWT payload"),null)}catch(r){return xa("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function zd(n){const e=Yc(n);return fe(e,"internal-error"),fe(typeof e.exp<"u","internal-error"),fe(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Eo(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof cs&&jv(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function jv({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dv{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=mo(this.lastLoginAt),this.creationTime=mo(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function za(n){var e;const t=n.auth,s=await n.getIdToken(),r=await Eo(n,Ua(t,{idToken:s}));fe(r==null?void 0:r.users.length,t,"internal-error");const o=r.users[0];n._notifyReloadListener(o);const l=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?vp(o.providerUserInfo):[],h=Vv(n.providerData,l),p=n.isAnonymous,b=!(n.email&&o.passwordHash)&&!(h!=null&&h.length),v=p?b:!1,I={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new uc(o.createdAt,o.lastLoginAt),isAnonymous:v};Object.assign(n,I)}async function Ov(n){const e=Wt(n);await za(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Vv(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function vp(n){return n.map(e=>{var{providerId:t}=e,s=Gc(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mv(n,e){const t=await yp(n,{},async()=>{const s=Io({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:o}=n.config,l=await bp(n,r,"/v1/token",`key=${o}`),h=await n._getAdditionalHeaders();h["Content-Type"]="application/x-www-form-urlencoded";const p={method:"POST",headers:h,body:s};return n.emulatorConfig&&mi(n.emulatorConfig.host)&&(p.credentials="include"),gp.fetch()(l,p)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Fv(n,e){return _i(n,"POST","/v2/accounts:revokeToken",Xc(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){fe(e.idToken,"internal-error"),fe(typeof e.idToken<"u","internal-error"),fe(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):zd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){fe(e.length!==0,"internal-error");const t=zd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(fe(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:o}=await Mv(e,t);this.updateTokensAndExpiration(s,r,Number(o))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:o}=t,l=new ri;return s&&(fe(typeof s=="string","internal-error",{appName:e}),l.refreshToken=s),r&&(fe(typeof r=="string","internal-error",{appName:e}),l.accessToken=r),o&&(fe(typeof o=="number","internal-error",{appName:e}),l.expirationTime=o),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ri,this.toJSON())}_performRefresh(){return es("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(n,e){fe(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class vn{constructor(e){var{uid:t,auth:s,stsTokenManager:r}=e,o=Gc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Dv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new uc(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await Eo(this,this.stsTokenManager.getToken(this.auth,e));return fe(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rv(this,e)}reload(){return Ov(this)}_assign(e){this!==e&&(fe(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new vn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){fe(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await za(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(sn(this.auth.app))return Promise.reject(Fs(this.auth));const e=await this.getIdToken();return await Eo(this,Pv(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,r,o,l,h,p,b,v;const I=(s=t.displayName)!==null&&s!==void 0?s:void 0,A=(r=t.email)!==null&&r!==void 0?r:void 0,M=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,z=(l=t.photoURL)!==null&&l!==void 0?l:void 0,Q=(h=t.tenantId)!==null&&h!==void 0?h:void 0,J=(p=t._redirectEventId)!==null&&p!==void 0?p:void 0,_e=(b=t.createdAt)!==null&&b!==void 0?b:void 0,oe=(v=t.lastLoginAt)!==null&&v!==void 0?v:void 0,{uid:pe,emailVerified:me,isAnonymous:tt,providerData:Fe,stsTokenManager:j}=t;fe(pe&&j,e,"internal-error");const k=ri.fromJSON(this.name,j);fe(typeof pe=="string",e,"internal-error"),Is(I,e.name),Is(A,e.name),fe(typeof me=="boolean",e,"internal-error"),fe(typeof tt=="boolean",e,"internal-error"),Is(M,e.name),Is(z,e.name),Is(Q,e.name),Is(J,e.name),Is(_e,e.name),Is(oe,e.name);const E=new vn({uid:pe,auth:e,email:A,emailVerified:me,displayName:I,isAnonymous:tt,photoURL:z,phoneNumber:M,tenantId:Q,stsTokenManager:k,createdAt:_e,lastLoginAt:oe});return Fe&&Array.isArray(Fe)&&(E.providerData=Fe.map(N=>Object.assign({},N))),J&&(E._redirectEventId=J),E}static async _fromIdTokenResponse(e,t,s=!1){const r=new ri;r.updateFromServerResponse(t);const o=new vn({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await za(o),o}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];fe(r.localId!==void 0,"internal-error");const o=r.providerUserInfo!==void 0?vp(r.providerUserInfo):[],l=!(r.email&&r.passwordHash)&&!(o!=null&&o.length),h=new ri;h.updateFromIdToken(s);const p=new vn({uid:r.localId,auth:e,stsTokenManager:h,isAnonymous:l}),b={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:o,metadata:new uc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(o!=null&&o.length)};return Object.assign(p,b),p}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bd=new Map;function ts(n){ls(n instanceof Function,"Expected a class definition");let e=Bd.get(n);return e?(ls(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Bd.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}xp.type="NONE";const qd=xp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(n,e,t){return`firebase:${n}:${e}:${t}`}class ii{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:o}=this.auth;this.fullUserKey=_a(this.userKey,r.apiKey,o),this.fullPersistenceKey=_a("persistence",r.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ua(this.auth,{idToken:e}).catch(()=>{});return t?vn._fromGetAccountInfoResponse(this.auth,t,e):null}return vn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new ii(ts(qd),e,s);const r=(await Promise.all(t.map(async b=>{if(await b._isAvailable())return b}))).filter(b=>b);let o=r[0]||ts(qd);const l=_a(s,e.config.apiKey,e.name);let h=null;for(const b of t)try{const v=await b._get(l);if(v){let I;if(typeof v=="string"){const A=await Ua(e,{idToken:v}).catch(()=>{});if(!A)break;I=await vn._fromGetAccountInfoResponse(e,A,v)}else I=vn._fromJSON(e,v);b!==o&&(h=I),o=b;break}}catch{}const p=r.filter(b=>b._shouldAllowMigration);return!o._shouldAllowMigration||!p.length?new ii(o,e,s):(o=p[0],h&&await o._set(l,h.toJSON()),await Promise.all(t.map(async b=>{if(b!==o)try{await b._remove(l)}catch{}})),new ii(o,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(_p(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ap(e))return"Blackberry";if(kp(e))return"Webos";if(wp(e))return"Safari";if((e.includes("chrome/")||Ep(e))&&!e.includes("edge/"))return"Chrome";if(Ip(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function _p(n=Mt()){return/firefox\//i.test(n)}function wp(n=Mt()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ep(n=Mt()){return/crios\//i.test(n)}function Tp(n=Mt()){return/iemobile/i.test(n)}function Ip(n=Mt()){return/android/i.test(n)}function Ap(n=Mt()){return/blackberry/i.test(n)}function kp(n=Mt()){return/webos/i.test(n)}function Zc(n=Mt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Lv(n=Mt()){var e;return Zc(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $v(){return $m()&&document.documentMode===10}function Sp(n=Mt()){return Zc(n)||Ip(n)||kp(n)||Ap(n)||/windows phone/i.test(n)||Tp(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Np(n,e=[]){let t;switch(n){case"Browser":t=Hd(Mt());break;case"Worker":t=`${Hd(Mt())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${gi}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=o=>new Promise((l,h)=>{try{const p=e(o);l(p)}catch(p){h(p)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zv(n,e={}){return _i(n,"GET","/v2/passwordPolicy",Xc(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bv=6;class qv{constructor(e){var t,s,r,o;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:Bv,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!==null&&o!==void 0?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,r,o,l,h;const p={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,p),this.validatePasswordCharacterOptions(e,p),p.isValid&&(p.isValid=(t=p.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),p.isValid&&(p.isValid=(s=p.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),p.isValid&&(p.isValid=(r=p.containsLowercaseLetter)!==null&&r!==void 0?r:!0),p.isValid&&(p.isValid=(o=p.containsUppercaseLetter)!==null&&o!==void 0?o:!0),p.isValid&&(p.isValid=(l=p.containsNumericCharacter)!==null&&l!==void 0?l:!0),p.isValid&&(p.isValid=(h=p.containsNonAlphanumericCharacter)!==null&&h!==void 0?h:!0),p}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hv{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Wd(this),this.idTokenSubscription=new Wd(this),this.beforeStateQueue=new Uv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ts(t)),this._initializationPromise=this.queue(async()=>{var s,r,o;if(!this._deleted&&(this.persistenceManager=await ii.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((o=this.currentUser)===null||o===void 0?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ua(this,{idToken:e}),s=await vn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(sn(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(h=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(h,h))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,h=r==null?void 0:r._redirectEventId,p=await this.tryRedirectSignIn(e);(!l||l===h)&&(p!=null&&p.user)&&(r=p.user,o=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(r)}catch(l){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return fe(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await za(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Iv()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(sn(this.app))return Promise.reject(Fs(this));const t=e?Wt(e):null;return t&&fe(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&fe(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return sn(this.app)?Promise.reject(Fs(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return sn(this.app)?Promise.reject(Fs(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ts(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await zv(this),t=new qv(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new To("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await Fv(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ts(e)||this._popupRedirectResolver;fe(t,this,"argument-error"),this.redirectPersistenceManager=await ii.create(this,[ts(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let l=!1;const h=this._isInitialized?Promise.resolve():this._initializationPromise;if(fe(h,this,"internal-error"),h.then(()=>{l||o(this.currentUser)}),typeof t=="function"){const p=e.addObserver(t,s,r);return()=>{l=!0,p()}}else{const p=e.addObserver(t);return()=>{l=!0,p()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return fe(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Np(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(sn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wv(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function wi(n){return Wt(n)}class Wd{constructor(e){this.auth=e,this.observer=null,this.addObserver=Km(t=>this.observer=t)}get next(){return fe(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Wv(n){eu=n}function Gv(n){return eu.loadJS(n)}function Kv(){return eu.gapiScript}function Jv(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qv(n,e){const t=yc(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),o=t.getOptions();if(pr(o,e??{}))return r;zn(r,"already-initialized")}return t.initialize({options:e})}function Xv(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(ts);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Yv(n,e,t){const s=wi(n);fe(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,o=Cp(e),{host:l,port:h}=Zv(e),p=h===null?"":`:${h}`,b={url:`${o}//${l}${p}/`},v=Object.freeze({host:l,port:h,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){fe(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),fe(pr(b,s.config.emulator)&&pr(v,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=b,s.emulatorConfig=v,s.settings.appVerificationDisabledForTesting=!0,mi(l)?(Th(`${o}//${l}${p}`),Ih("Auth",!0)):ex()}function Cp(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Zv(n){const e=Cp(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const o=r[1];return{host:o,port:Gd(s.substr(o.length+1))}}else{const[o,l]=s.split(":");return{host:o,port:Gd(l)}}}function Gd(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ex(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return es("not implemented")}_getIdTokenResponse(e){return es("not implemented")}_linkToIdToken(e,t){return es("not implemented")}_getReauthenticationResolver(e){return es("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oi(n,e){return Nv(n,"POST","/v1/accounts:signInWithIdp",Xc(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tx="http://localhost";class vr extends Pp{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new vr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):zn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=t,o=Gc(t,["providerId","signInMethod"]);if(!s||!r)return null;const l=new vr(s,r);return l.idToken=o.idToken||void 0,l.accessToken=o.accessToken||void 0,l.secret=o.secret,l.nonce=o.nonce,l.pendingToken=o.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return oi(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,oi(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,oi(e,t)}buildRequest(){const e={requestUri:tx,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Io(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ul{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro extends ul{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns extends Ro{constructor(){super("facebook.com")}static credential(e){return vr._fromParams({providerId:Ns.PROVIDER_ID,signInMethod:Ns.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ns.credentialFromTaggedObject(e)}static credentialFromError(e){return Ns.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ns.credential(e.oauthAccessToken)}catch{return null}}}Ns.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ns.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn extends Ro{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return vr._fromParams({providerId:Dn.PROVIDER_ID,signInMethod:Dn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Dn.credentialFromTaggedObject(e)}static credentialFromError(e){return Dn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Dn.credential(t,s)}catch{return null}}}Dn.GOOGLE_SIGN_IN_METHOD="google.com";Dn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs extends Ro{constructor(){super("github.com")}static credential(e){return vr._fromParams({providerId:Cs.PROVIDER_ID,signInMethod:Cs.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Cs.credentialFromTaggedObject(e)}static credentialFromError(e){return Cs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Cs.credential(e.oauthAccessToken)}catch{return null}}}Cs.GITHUB_SIGN_IN_METHOD="github.com";Cs.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps extends Ro{constructor(){super("twitter.com")}static credential(e,t){return vr._fromParams({providerId:Ps.PROVIDER_ID,signInMethod:Ps.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ps.credentialFromTaggedObject(e)}static credentialFromError(e){return Ps.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Ps.credential(t,s)}catch{return null}}}Ps.TWITTER_SIGN_IN_METHOD="twitter.com";Ps.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const o=await vn._fromIdTokenResponse(e,s,r),l=Kd(s);return new pi({user:o,providerId:l,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Kd(s);return new pi({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Kd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba extends cs{constructor(e,t,s,r){var o;super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,Ba.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new Ba(e,t,s,r)}}function Rp(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Ba._fromErrorAndOperation(n,o,e,s):o})}async function nx(n,e,t=!1){const s=await Eo(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return pi._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sx(n,e,t=!1){const{auth:s}=n;if(sn(s.app))return Promise.reject(Fs(s));const r="reauthenticate";try{const o=await Eo(n,Rp(s,r,e,n),t);fe(o.idToken,s,"internal-error");const l=Yc(o.idToken);fe(l,s,"internal-error");const{sub:h}=l;return fe(n.uid===h,s,"user-mismatch"),pi._forOperation(n,r,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&zn(s,"user-mismatch"),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rx(n,e,t=!1){if(sn(n.app))return Promise.reject(Fs(n));const s="signIn",r=await Rp(n,s,e),o=await pi._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(o.user),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ix(n,e){return Wt(n).setPersistence(e)}function ox(n,e,t,s){return Wt(n).onIdTokenChanged(e,t,s)}function ax(n,e,t){return Wt(n).beforeAuthStateChanged(e,t)}function lx(n,e,t,s){return Wt(n).onAuthStateChanged(e,t,s)}function cx(n){return Wt(n).signOut()}const qa="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(qa,"1"),this.storage.removeItem(qa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ux=1e3,dx=10;class Dp extends jp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Sp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,h,p)=>{this.notifyListeners(l,p)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const l=this.storage.getItem(s);!t&&this.localCache[s]===l||this.notifyListeners(s,l)},o=this.storage.getItem(s);$v()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,dx):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},ux)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Dp.type="LOCAL";const Op=Dp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp extends jp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Vp.type="SESSION";const Mp=Vp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hx(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new dl(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:o}=t.data,l=this.handlersMap[r];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const h=Array.from(l).map(async b=>b(t.origin,o)),p=await hx(h);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:p})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}dl.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fx{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let o,l;return new Promise((h,p)=>{const b=tu("",20);r.port1.start();const v=setTimeout(()=>{p(new Error("unsupported_event"))},s);l={messageChannel:r,onMessage(I){const A=I;if(A.data.eventId===b)switch(A.data.status){case"ack":clearTimeout(v),o=setTimeout(()=>{p(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),h(A.data.response);break;default:clearTimeout(v),clearTimeout(o),p(new Error("invalid_response"));break}}},this.handlers.add(l),r.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:b,data:t},[r.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ln(){return window}function px(n){Ln().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fp(){return typeof Ln().WorkerGlobalScope<"u"&&typeof Ln().importScripts=="function"}async function mx(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function gx(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function yx(){return Fp()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lp="firebaseLocalStorageDb",bx=1,Ha="firebaseLocalStorage",$p="fbase_key";class jo{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hl(n,e){return n.transaction([Ha],e?"readwrite":"readonly").objectStore(Ha)}function vx(){const n=indexedDB.deleteDatabase(Lp);return new jo(n).toPromise()}function dc(){const n=indexedDB.open(Lp,bx);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Ha,{keyPath:$p})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Ha)?e(s):(s.close(),await vx(),e(await dc()))})})}async function Jd(n,e,t){const s=hl(n,!0).put({[$p]:e,value:t});return new jo(s).toPromise()}async function xx(n,e){const t=hl(n,!1).get(e),s=await new jo(t).toPromise();return s===void 0?null:s.value}function Qd(n,e){const t=hl(n,!0).delete(e);return new jo(t).toPromise()}const _x=800,wx=3;class Up{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await dc(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>wx)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Fp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=dl._getInstance(yx()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await mx(),!this.activeServiceWorker)return;this.sender=new fx(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||gx()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await dc();return await Jd(e,qa,"1"),await Qd(e,qa),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Jd(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>xx(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Qd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const o=hl(r,!1).getAll();return new jo(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:o}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(o)&&(this.notifyListeners(r,o),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_x)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Up.type="LOCAL";const Ex=Up;new Po(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nu(n,e){return e?ts(e):(fe(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su extends Pp{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return oi(e,this._buildIdpRequest())}_linkToIdToken(e,t){return oi(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return oi(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Tx(n){return rx(n.auth,new su(n),n.bypassAuthState)}function Ix(n){const{auth:e,user:t}=n;return fe(t,e,"internal-error"),sx(t,new su(n),n.bypassAuthState)}async function Ax(n){const{auth:e,user:t}=n;return fe(t,e,"internal-error"),nx(t,new su(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e,t,s,r,o=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:o,error:l,type:h}=e;if(l){this.reject(l);return}const p={auth:this.auth,requestUri:t,sessionId:s,tenantId:o||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(h)(p))}catch(b){this.reject(b)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Tx;case"linkViaPopup":case"linkViaRedirect":return Ax;case"reauthViaPopup":case"reauthViaRedirect":return Ix;default:zn(this.auth,"internal-error")}}resolve(e){ls(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ls(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kx=new Po(2e3,1e4);async function Sx(n,e,t){if(sn(n.app))return Promise.reject(xn(n,"operation-not-supported-in-this-environment"));const s=wi(n);mp(n,e,ul);const r=nu(s,t);return new dr(s,"signInViaPopup",e,r).executeNotNull()}class dr extends zp{constructor(e,t,s,r,o){super(e,t,r,o),this.provider=s,this.authWindow=null,this.pollId=null,dr.currentPopupAction&&dr.currentPopupAction.cancel(),dr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return fe(e,this.auth,"internal-error"),e}async onExecution(){ls(this.filter.length===1,"Popup operations only handle one event");const e=tu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(xn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(xn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,dr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(xn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,kx.get())};e()}}dr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nx="pendingRedirect",wa=new Map;class Cx extends zp{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=wa.get(this.auth._key());if(!e){try{const s=await Px(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}wa.set(this.auth._key(),e)}return this.bypassAuthState||wa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Px(n,e){const t=qp(e),s=Bp(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}async function Rx(n,e){return Bp(n)._set(qp(e),"true")}function jx(n,e){wa.set(n._key(),e)}function Bp(n){return ts(n._redirectPersistence)}function qp(n){return _a(Nx,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dx(n,e,t){return Ox(n,e,t)}async function Ox(n,e,t){if(sn(n.app))return Promise.reject(Fs(n));const s=wi(n);mp(n,e,ul),await s._initializationPromise;const r=nu(s,t);return await Rx(r,s),r._openRedirect(s,e,"signInViaRedirect")}async function Vx(n,e){return await wi(n)._initializationPromise,Hp(n,e,!1)}async function Hp(n,e,t=!1){if(sn(n.app))return Promise.reject(Fs(n));const s=wi(n),r=nu(s,e),l=await new Cx(s,r,t).execute();return l&&!t&&(delete l.user._redirectEventId,await s._persistUserIfCurrent(l.user),await s._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mx=600*1e3;class Fx{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lx(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!Wp(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(xn(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Mx&&this.cachedEventUids.clear(),this.cachedEventUids.has(Xd(e))}saveEventToCache(e){this.cachedEventUids.add(Xd(e)),this.lastProcessedEventTime=Date.now()}}function Xd(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Wp({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lx(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wp(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $x(n,e={}){return _i(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ux=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,zx=/^https?/;async function Bx(n){if(n.config.emulator)return;const{authorizedDomains:e}=await $x(n);for(const t of e)try{if(qx(t))return}catch{}zn(n,"unauthorized-domain")}function qx(n){const e=cc(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const l=new URL(n);return l.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===s}if(!zx.test(t))return!1;if(Ux.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hx=new Po(3e4,6e4);function Yd(){const n=Ln().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Wx(n){return new Promise((e,t)=>{var s,r,o;function l(){Yd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yd(),t(xn(n,"network-request-failed"))},timeout:Hx.get()})}if(!((r=(s=Ln().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((o=Ln().gapi)===null||o===void 0)&&o.load)l();else{const h=Jv("iframefcb");return Ln()[h]=()=>{gapi.load?l():t(xn(n,"network-request-failed"))},Gv(`${Kv()}?onload=${h}`).catch(p=>t(p))}}).catch(e=>{throw Ea=null,e})}let Ea=null;function Gx(n){return Ea=Ea||Wx(n),Ea}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kx=new Po(5e3,15e3),Jx="__/auth/iframe",Qx="emulator/auth/iframe",Xx={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Yx=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Zx(n){const e=n.config;fe(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Qc(e,Qx):`https://${n.config.authDomain}/${Jx}`,s={apiKey:e.apiKey,appName:n.name,v:gi},r=Yx.get(n.config.apiHost);r&&(s.eid=r);const o=n._getFrameworks();return o.length&&(s.fw=o.join(",")),`${t}?${Io(s).slice(1)}`}async function e_(n){const e=await Gx(n),t=Ln().gapi;return fe(t,n,"internal-error"),e.open({where:document.body,url:Zx(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Xx,dontclear:!0},s=>new Promise(async(r,o)=>{await s.restyle({setHideOnLeave:!1});const l=xn(n,"network-request-failed"),h=Ln().setTimeout(()=>{o(l)},Kx.get());function p(){Ln().clearTimeout(h),r(s)}s.ping(p).then(p,()=>{o(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},n_=500,s_=600,r_="_blank",i_="http://localhost";class Zd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function o_(n,e,t,s=n_,r=s_){const o=Math.max((window.screen.availHeight-r)/2,0).toString(),l=Math.max((window.screen.availWidth-s)/2,0).toString();let h="";const p=Object.assign(Object.assign({},t_),{width:s.toString(),height:r.toString(),top:o,left:l}),b=Mt().toLowerCase();t&&(h=Ep(b)?r_:t),_p(b)&&(e=e||i_,p.scrollbars="yes");const v=Object.entries(p).reduce((A,[M,z])=>`${A}${M}=${z},`,"");if(Lv(b)&&h!=="_self")return a_(e||"",h),new Zd(null);const I=window.open(e||"",h,v);fe(I,n,"popup-blocked");try{I.focus()}catch{}return new Zd(I)}function a_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l_="__/auth/handler",c_="emulator/auth/handler",u_=encodeURIComponent("fac");async function eh(n,e,t,s,r,o){fe(n.config.authDomain,n,"auth-domain-config-required"),fe(n.config.apiKey,n,"invalid-api-key");const l={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:gi,eventId:r};if(e instanceof ul){e.setDefaultLanguage(n.languageCode),l.providerId=e.providerId||"",Gm(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[v,I]of Object.entries({}))l[v]=I}if(e instanceof Ro){const v=e.getScopes().filter(I=>I!=="");v.length>0&&(l.scopes=v.join(","))}n.tenantId&&(l.tid=n.tenantId);const h=l;for(const v of Object.keys(h))h[v]===void 0&&delete h[v];const p=await n._getAppCheckToken(),b=p?`#${u_}=${encodeURIComponent(p)}`:"";return`${d_(n)}?${Io(h).slice(1)}${b}`}function d_({config:n}){return n.emulator?Qc(n,c_):`https://${n.authDomain}/${l_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ll="webStorageSupport";class h_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Mp,this._completeRedirectFn=Hp,this._overrideRedirectResult=jx}async _openPopup(e,t,s,r){var o;ls((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");const l=await eh(e,t,s,cc(),r);return o_(e,l,tu())}async _openRedirect(e,t,s,r){await this._originValidation(e);const o=await eh(e,t,s,cc(),r);return px(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:o}=this.eventManagers[t];return r?Promise.resolve(r):(ls(o,"If manager is not set, promise should be"),o)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await e_(e),s=new Fx(e);return t.register("authEvent",r=>(fe(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ll,{type:Ll},r=>{var o;const l=(o=r==null?void 0:r[0])===null||o===void 0?void 0:o[Ll];l!==void 0&&t(!!l),zn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Bx(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Sp()||wp()||Zc()}}const f_=h_;var th="@firebase/auth",nh="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){fe(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function g_(n){li(new mr("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:l,authDomain:h}=s.options;fe(l&&!l.includes(":"),"invalid-api-key",{appName:s.name});const p={apiKey:l,authDomain:h,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Np(n)},b=new Hv(s,r,o,p);return Xv(b,t),b},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),li(new mr("auth-internal",e=>{const t=wi(e.getProvider("auth").getImmediate());return(s=>new p_(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Os(th,nh,m_(n)),Os(th,nh,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y_=300,b_=Eh("authIdTokenMaxAge")||y_;let sh=null;const v_=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>b_)return;const r=t==null?void 0:t.token;sh!==r&&(sh=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function x_(n=Nh()){const e=yc(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Qv(n,{popupRedirectResolver:f_,persistence:[Ex,Op,Mp]}),s=Eh("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(s,location.origin);if(location.origin===o.origin){const l=v_(o.toString());ax(t,l,()=>l(t.currentUser)),ox(t,h=>l(h))}}const r=_h("auth");return r&&Yv(t,`http://${r}`),t}function __(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Wv({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const o=xn("internal-error");o.customData=r,t(o)},s.type="text/javascript",s.charset="UTF-8",__().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});g_("Browser");const w_={apiKey:"AIzaSyB-URByQJZkJ0pMNJK0qTSzBsVJuy4FNk0",authDomain:"anti-planer.firebaseapp.com",projectId:"anti-planer",storageBucket:"anti-planer.firebasestorage.app",messagingSenderId:"235332843252",appId:"1:235332843252:web:8e95f47f1736017fcc50a1"},Gp=Sh(w_),Rn=sv(Gp),Kr=x_(Gp);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kp=(...n)=>n.filter((e,t,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E_=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T_=n=>n.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,s)=>s?s.toUpperCase():t.toLowerCase());/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rh=n=>{const e=T_(n);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var I_={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A_=n=>{for(const e in n)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k_=$.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:s,className:r="",children:o,iconNode:l,...h},p)=>$.createElement("svg",{ref:p,...I_,width:e,height:e,stroke:n,strokeWidth:s?Number(t)*24/Number(e):t,className:Kp("lucide",r),...!o&&!A_(h)&&{"aria-hidden":"true"},...h},[...l.map(([b,v])=>$.createElement(b,v)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=(n,e)=>{const t=$.forwardRef(({className:s,...r},o)=>$.createElement(k_,{ref:o,iconNode:e,className:Kp(`lucide-${E_(rh(n))}`,`lucide-${n}`,s),...r}));return t.displayName=rh(n),t};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S_=[["path",{d:"M12 6v16",key:"nqf5sj"}],["path",{d:"m19 13 2-1a9 9 0 0 1-18 0l2 1",key:"y7qv08"}],["path",{d:"M9 11h6",key:"1fldmi"}],["circle",{cx:"12",cy:"4",r:"2",key:"muu5ef"}]],ih=Pe("anchor",S_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N_=[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]],hc=Pe("bed",N_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C_=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],P_=Pe("calendar",C_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R_=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],Jp=Pe("camera",R_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j_=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],yn=Pe("chevron-down",j_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D_=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Ta=Pe("chevron-left",D_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O_=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],Ia=Pe("chevron-right",O_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V_=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],As=Pe("chevron-up",V_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M_=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],$l=Pe("circle-plus",M_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F_=[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]],Qp=Pe("coffee",F_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L_=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Xp=Pe("eye",L_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $_=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"1sqzm4"}],["path",{d:"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",key:"kc0143"}],["rect",{x:"3",y:"7",width:"18",height:"4",rx:"1",key:"1hberx"}]],Yp=Pe("gift",$_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U_=[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]],Zp=Pe("hourglass",U_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z_=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],B_=Pe("lock-open",z_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q_=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],oh=Pe("lock",q_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H_=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],W_=Pe("log-out",H_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G_=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],cr=Pe("map-pin",G_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K_=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],Jr=Pe("map",K_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J_=[["path",{d:"M5 12h14",key:"1ays0h"}]],Qr=Pe("minus",J_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q_=[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]],ah=Pe("navigation",Q_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X_=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],ao=Pe("package",X_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y_=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],Z_=Pe("pencil",Y_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],ks=Pe("plus",e1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],lh=Pe("share-2",t1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=[["path",{d:"M10 5H3",key:"1qgfaw"}],["path",{d:"M12 19H3",key:"yhmn1j"}],["path",{d:"M14 3v4",key:"1sua03"}],["path",{d:"M16 17v4",key:"1q0r14"}],["path",{d:"M21 12h-9",key:"1o4lsq"}],["path",{d:"M21 19h-5",key:"1rlt1p"}],["path",{d:"M21 5h-7",key:"1oszz2"}],["path",{d:"M8 10v4",key:"tgpxqk"}],["path",{d:"M8 12H3",key:"a7s4jb"}]],ch=Pe("sliders-horizontal",n1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],ai=Pe("sparkles",s1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],i1=Pe("square-check-big",r1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],a1=Pe("square",o1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],em=Pe("star",l1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],uh=Pe("timer",c1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u1=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],Ul=Pe("trash-2",u1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],h1=Pe("user",d1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f1=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]],tm=Pe("utensils",f1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p1=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Xr=Pe("x",p1),m1="1.0.0.0",dh=[{version:"1.0.0.0",date:"2026-03-10",timeline:[{time:"23:50",emoji:"⛴️",title:"선적 종료 시간 직접 편집 가능",desc:"선박 카드에서 선적 종료 시간을 탭·드래그로 바로 수정할 수 있어요."},{time:"23:20",emoji:"⏱️",title:"이동 단위 공유",desc:"시작 시각 이동 단위(1/5/15/30분)를 선택하면 소요시간 스피너도 같은 단위로 맞춰져요."},{time:"23:05",emoji:"🔒",title:"잠금 버튼 테두리 강조",desc:"시간 셀 확장 시 잠금 상태일 때 색상 ring이 추가되어 한눈에 확인할 수 있어요."},{time:"22:40",emoji:"📱",title:"모바일 초기 사이드바 접힘",desc:"모바일 환경에서 앱 시작 시 양쪽 사이드바가 자동으로 닫혀 있어요."},{time:"22:15",emoji:"🗂️",title:"버전 시스템 도입",desc:"좌측 사이드바 하단에 버전 뱃지가 생겼어요. 눌러보시면 이 화면이 뜹니다 😄"},{time:"21:55",emoji:"📌",title:"사이드바 밀어내기 방식",desc:"사이드바를 열면 일정 영역 위에 겹치지 않고 옆으로 밀어내요."},{time:"21:30",emoji:"🅱️",title:"플랜B 셀 너비 통일",desc:"플랜B가 달린 일정 카드가 일반 카드와 동일한 너비로 표시돼요."},{time:"20:50",emoji:"🚀",title:"플랜B 드래그 개선",desc:"플랜B가 달린 일정을 드래그하면 현재 보이는 일정만 이동해요."},{time:"20:10",emoji:"🗓️",title:"카테고리 위치 변경",desc:"등록된 일정 탭에서 카테고리 뱃지가 장소 이름 아래로 이동했어요."},{time:"19:30",emoji:"00:00",title:"시간 표기 통일",desc:"시작·소요시간 모두 00:00 형식으로 표기를 통일했어요."},{time:"18:45",emoji:"🔒",title:"소요시간 잠금 표시",desc:"소요시간이 잠긴 경우에만 주황색으로 강조돼요."}]}];class g1 extends wt.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error("Runtime render error:",e,t)}render(){var e;return this.state.hasError?a.jsxs("div",{style:{minHeight:"100vh",padding:24,fontFamily:"sans-serif",background:"#F8FAFC",color:"#0F172A"},children:[a.jsx("h1",{style:{margin:0,fontSize:18,fontWeight:700},children:"앱 렌더링 오류가 발생했습니다."}),a.jsx("p",{style:{marginTop:8,fontSize:13,color:"#475569"},children:"새로고침 후에도 동일하면 콘솔 오류를 확인해주세요."}),a.jsx("pre",{style:{marginTop:12,whiteSpace:"pre-wrap",fontSize:12,background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:12},children:String(((e=this.state.error)==null?void 0:e.message)||this.state.error||"unknown error")})]}):this.props.children}}const ha=(n,e="")=>{try{return localStorage.getItem(n)||e}catch(t){return console.warn(`localStorage read failed (${n})`,t),e}},fa=(n,e)=>{try{localStorage.setItem(n,e)}catch(t){console.warn(`localStorage write failed (${n})`,t)}},y1=[{label:"식당",types:["food"],Icon:tm,className:"text-rose-500 bg-red-50 border-red-200 hover:bg-red-100"},{label:"카페",types:["cafe"],Icon:Qp,className:"text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100"},{label:"관광",types:["tour"],Icon:Jp,className:"text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100"},{label:"숙소",types:["lodge"],Icon:hc,className:"text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"},{label:"휴식",types:["rest"],Icon:Zp,className:"text-cyan-600 bg-cyan-50 border-cyan-200 hover:bg-cyan-100"},{label:"뷰맛집",types:["view"],Icon:Xp,className:"text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100"},{label:"체험",types:["experience"],Icon:em,className:"text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"},{label:"기념품샵",types:["souvenir"],Icon:Yp,className:"text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100"},{label:"픽업",types:["pickup"],Icon:ao,className:"text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100"},{label:"장소",types:["place"],Icon:cr,className:"text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100"}],Wa=[{label:"식당",value:"food"},{label:"카페",value:"cafe"},{label:"관광",value:"tour"},{label:"숙소",value:"lodge"},{label:"휴식",value:"rest"},{label:"픽업",value:"pickup"},{label:"오픈런",value:"openrun"},{label:"뷰맛집",value:"view"},{label:"체험",value:"experience"},{label:"기념품샵",value:"souvenir"},{label:"장소",value:"place"},{label:"신규",value:"new"},{label:"재방문",value:"revisit"}],b1=new Set(Wa.map(n=>n.value)),fr=new Set(["revisit","new"]),rs=n=>{const e=Array.isArray(n)?n:[],t=[...new Set(e.filter(o=>fr.has(o)))],s=e.filter(o=>!fr.has(o)&&b1.has(o)),r=[...new Set(s)].slice(0,2);return r.length===0&&t.length===0?["place"]:[...r,...t]},v1=(n,e)=>{const t=rs(n);if(fr.has(e))return t.includes(e)?rs(t.filter(l=>l!==e)):rs([...t,e]);const s=t.filter(l=>!fr.has(l)),r=t.filter(l=>fr.has(l));let o;return s.includes(e)?(o=s.filter(l=>l!==e),o.length===0&&(o=["place"])):o=s.length>=2?[s[0],e]:[...s,e],[...o,...r]},x1=(n,e)=>e?n==="food"?"text-rose-500 bg-red-50 border-red-200":n==="cafe"?"text-amber-600 bg-amber-50 border-amber-200":n==="tour"?"text-purple-600 bg-purple-50 border-purple-200":n==="lodge"?"text-indigo-600 bg-indigo-50 border-indigo-200":n==="rest"?"text-cyan-600 bg-cyan-50 border-cyan-200":n==="pickup"?"text-orange-500 bg-orange-50 border-orange-200":n==="openrun"?"text-red-500 bg-red-50 border-red-100":n==="view"?"text-sky-600 bg-sky-50 border-sky-200":n==="experience"?"text-emerald-600 bg-emerald-50 border-emerald-200":n==="souvenir"?"text-teal-600 bg-teal-50 border-teal-200":n==="new"?"text-emerald-600 bg-emerald-50 border-emerald-200":n==="revisit"?"text-blue-600 bg-blue-50 border-blue-200":"text-slate-500 bg-slate-100 border-slate-200":"bg-white text-slate-400 border-slate-200 hover:border-slate-300",fc=({value:n=["place"],onChange:e,title:t="태그",className:s=""})=>{const r=rs(n),[o,l]=wt.useState(""),h=()=>{const v=o.trim();v&&!r.includes(v)&&e(rs([...r,v])),l("")},p=new Set(Wa.map(v=>v.value)),b=r.filter(v=>!p.has(v)&&v!=="place");return a.jsxs("div",{className:s,children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1",children:t}),a.jsxs("div",{className:"flex flex-wrap gap-1 items-center",children:[Wa.map(v=>{const I=r.includes(v.value);return a.jsx("button",{type:"button",onClick:()=>e(v1(r,v.value)),className:`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${x1(v.value,I)}`,children:v.label},v.value)}),b.map(v=>a.jsxs("button",{type:"button",onClick:()=>e(rs(r.filter(I=>I!==v))),className:"px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200",children:[v," ",a.jsx("span",{className:"text-slate-400 ml-0.5",children:"✕"})]},v)),a.jsx("input",{type:"text",value:o,onChange:v=>l(v.target.value),onKeyDown:v=>{v.key==="Enter"&&(v.preventDefault(),h())},onBlur:h,placeholder:"+ 직접 입력",className:"ml-1 w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-200 bg-white placeholder:text-slate-300 outline-none focus:border-[#3182F6]"})]})]})},lo=[{label:"월",value:"mon"},{label:"화",value:"tue"},{label:"수",value:"wed"},{label:"목",value:"thu"},{label:"금",value:"fri"},{label:"토",value:"sat"},{label:"일",value:"sun"}],nm={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},_1=[{date:"03.09",time:"21:15",tag:"UX",msg:"시간 셀 — 소요시간 시작·종료 사이 배치"},{date:"03.09",time:"20:40",tag:"UX",msg:"업데이트 노트 — 사이트 UI 스타일 팝업"},{date:"03.09",time:"17:30",tag:"UX",msg:"금액 요약 셀 — 카드 내 좌우 여백 추가"},{date:"03.09",time:"16:50",tag:"FIX",msg:"내장소 수정 모달 터치 드래그 충돌 수정"},{date:"03.08",time:"19:10",tag:"FEAT",msg:"영업 시간 에디터 통합 + 프리셋 버튼"},{date:"03.08",time:"18:05",tag:"FEAT",msg:"24:00 마감 시간 입력 지원"},{date:"03.08",time:"14:20",tag:"FIX",msg:"고정 일정 사이 소요시간 최소 30분 보장"}],hh={open:["06:00","08:00","09:00","10:00","10:30","11:00"],close:["19:00","20:00","21:00","22:00","23:00","24:00"],breakStart:["12:00","13:00","14:00","15:00"],breakEnd:["13:00","14:00","15:00","16:00","17:00"],lastOrder:["19:30","20:00","20:30","21:00","21:30"],entryClose:["18:00","19:00","20:00","20:30"]},w1={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},fh=(n="")=>{const e=String(n).trim().match(/(\d{1,2})(?::(\d{2}))?/);if(!e)return"";const t=Number(e[1]),s=Number(e[2]||"0");return Number.isNaN(t)||Number.isNaN(s)||t<0||t>24||s<0||s>59||t===24&&s>0?"":`${String(t).padStart(2,"0")}:${String(s).padStart(2,"0")}`},ph=(n="")=>{const e=[],t=/(\d{1,2})\s*[:시]\s*(\d{1,2})?\s*분?/g;let s;for(;(s=t.exec(n))!==null;){const r=s[1],o=s[2]||"00",l=fh(`${r}:${o}`);l&&e.push(l)}if(e.length===0){const r=/(\d{1,2})\s*시/g;for(;(s=r.exec(n))!==null;){const o=fh(`${s[1]}:00`);o&&e.push(o)}}return[...new Set(e)]},Ga=(n="")=>{var b;const e={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},t={월:"mon",화:"tue",수:"wed",목:"thu",금:"fri",토:"sat",일:"sun"},s={};let r="";const o=String(n).split(/\r?\n/).map(v=>v.trim()).filter(Boolean);(o.length?o:[String(n).trim()].filter(Boolean)).forEach(v=>{const I=v.toLowerCase(),A=ph(v),M=v.match(/^(월|화|수|목|금|토|일)\b/);if(/^(월|화|수|목|금|토|일)$/.test(v)){r=v;return}if(r&&A.length>=2&&(s[r]=`${A[0]}-${A[1]}`,r=""),M&&/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(I)){const z=t[M[1]];z&&!e.closedDays.includes(z)&&e.closedDays.push(z);return}if(/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(I)&&[...new Set(v.match(/[월화수목금토일]/g)||[])].forEach(Q=>{const J=t[Q];J&&!e.closedDays.includes(J)&&e.closedDays.push(J)}),M&&A.length>=2&&(s[M[1]]=`${A[0]}-${A[1]}`),A.length!==0){if(/(라스트\s*오더|last\s*order|lastorder|마감주문)/i.test(I)){e.lastOrder=A[0]||e.lastOrder;return}if(/(입장\s*마감|입장마감|마지막\s*입장|입장\s*종료|last\s*entry|lastentry|ticket\s*cutoff)/i.test(I)){e.entryClose=A[0]||e.entryClose;return}if(/(브레이크|break)/i.test(I)){e.breakStart=A[0]||e.breakStart,e.breakEnd=A[1]||e.breakEnd;return}!e.open&&A[0]&&(e.open=A[0]),!e.close&&A[1]&&(e.close=A[1])}});const h=Object.values(s);if(h.length>0){const v=h.reduce((M,z)=>({...M,[z]:(M[z]||0)+1}),{}),A=(b=Object.entries(v).sort((M,z)=>z[1]-M[1])[0])==null?void 0:b[0];if(A){const[M,z]=A.split("-");M&&(e.open=M),z&&(e.close=z)}}const p=ph(String(n));return!e.open&&p[0]&&(e.open=p[0]),!e.close&&p[1]&&(e.close=p[1]),!e.breakStart&&p[2]&&(e.breakStart=p[2]),!e.breakEnd&&p[3]&&(e.breakEnd=p[3]),!e.lastOrder&&p[4]&&(e.lastOrder=p[4]),!e.entryClose&&p[5]&&(e.entryClose=p[5]),{...e,closedDays:[...new Set(e.closedDays)]}},mh=(n="")=>{const e=String(n).split(/\r?\n/).map(l=>l.trim()).filter(Boolean);if(e.length===0)return null;const t={name:"",address:"",business:null,menus:[]};t.name=e[0];const s=e.findIndex(l=>l==="주소");s!==-1&&e[s+1]&&(t.address=e[s+1]);const r=e.findIndex(l=>l==="영업시간");if(r!==-1){const l=e.findIndex((p,b)=>b>r&&(p==="접기"||p==="전화번호"||p==="가격표"||p==="블로그")),h=e.slice(r+1,l!==-1?l:void 0).join(`
`);t.business=Ga(h)}const o=e.findIndex(l=>l==="가격표");if(o!==-1){const l=e.findIndex((p,b)=>b>o&&(p==="가격표 이미지로 보기"||p==="블로그"||p==="편의"||p==="리뷰")),h=e.slice(o+1,l!==-1?l:void 0);for(let p=0;p<h.length;p++){const b=h[p];if(b.includes("원")&&p>0){const v=parseInt(b.replace(/[^0-9]/g,""),10),I=h[p-1];I&&!I.includes("원")&&t.menus.push({name:I,price:v})}}}return t},E1=({value:n,onChange:e,onFocus:t,onBlurExtra:s,className:r="",title:o="",placeholder:l=""})=>{const h=b=>{let v=b.target.value.replace(/[^0-9:]/g,"");v.length===2&&!v.includes(":")&&(v=v+":"),v.length>5&&(v=v.slice(0,5)),e(v)},p=b=>{let v=b.target.value.trim();if(/^\d{4}$/.test(v)&&(v=v.slice(0,2)+":"+v.slice(2)),!/^\d{2}:\d{2}$/.test(v)){e(v),s==null||s();return}const[I,A]=v.split(":").map(Number);if(I>24||A>59||I===24&&A>0){e(""),s==null||s();return}e(v),s==null||s()};return a.jsx("input",{type:"text",inputMode:"numeric",value:n,onChange:h,onFocus:t,onBlur:p,placeholder:l,maxLength:5,title:o,className:r})},pc=({business:n={},onChange:e})=>{const[t,s]=wt.useState(null),r=Ge(n),o=(v,I)=>e({...r,[v]:I}),l=v=>e({...r,...v}),h="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] w-full",p={open:"오픈",close:"마감",breakStart:"브레이크 시작",breakEnd:"브레이크 종료",lastOrder:"라스트오더",entryClose:"입장 마감"},b=["open","close","breakStart","breakEnd","lastOrder","entryClose"];return a.jsxs("div",{onPaste:v=>{const I=v.clipboardData.getData("text"),A=Ga(I);(A.open||A.close||A.breakStart||A.breakEnd||A.lastOrder||A.entryClose)&&(v.preventDefault(),l(A))},children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 uppercase tracking-wider",children:"상세 영업 설정"}),a.jsxs("button",{type:"button",onClick:async()=>{try{const v=await navigator.clipboard.readText(),I=Ga(v);(I.open||I.close||I.breakStart||I.breakEnd||I.lastOrder||I.entryClose)&&l(I)}catch{}},className:"flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3182F6] shadow-[0_8px_16px_-6px_rgba(49,130,246,0.3)] text-[10px] font-black text-white hover:bg-blue-600 transition-all active:scale-95",children:[a.jsx(ai,{size:11}),"영업정보 자동 붙여넣기"]})]}),a.jsx("div",{className:"grid grid-cols-2 gap-1.5 mb-1.5",children:b.map(v=>{var I;return a.jsxs("div",{className:"flex flex-col gap-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-slate-400",children:p[v]}),a.jsx(E1,{value:r[v],onChange:A=>o(v,A),onFocus:()=>s(v),onBlurExtra:()=>setTimeout(()=>s(A=>A===v?null:A),160),className:h,title:p[v]}),t===v&&((I=hh[v])==null?void 0:I.length)>0&&a.jsx("div",{className:"flex flex-wrap gap-1 mt-0.5",onMouseDown:A=>A.preventDefault(),children:hh[v].map(A=>a.jsx("button",{type:"button",onClick:()=>{o(v,A),s(null)},className:"px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 border border-blue-200 text-[#3182F6] hover:bg-blue-100 active:bg-blue-200",children:A},A))})]},v)})}),a.jsx("div",{className:"flex items-center gap-1 flex-wrap",children:lo.map(v=>{const I=(r.closedDays||[]).includes(v.value);return a.jsxs("button",{type:"button",onClick:()=>e({...r,closedDays:I?r.closedDays.filter(A=>A!==v.value):[...r.closedDays,v.value]}),className:`px-1.5 py-0.5 rounded border text-[10px] font-bold ${I?"text-red-500 bg-red-50 border-red-200":"text-slate-400 bg-white border-slate-200"}`,children:[v.label," 휴무"]},v.value)})})]})},gh=n=>`${Math.max(0,Math.round(Number(n)||0))}분`,Ge=(n={})=>({open:String(n.open||""),close:String(n.close||""),breakStart:String(n.breakStart||""),breakEnd:String(n.breakEnd||""),lastOrder:String(n.lastOrder||""),entryClose:String(n.entryClose||""),closedDays:Array.isArray(n.closedDays)?[...new Set(n.closedDays)]:[]}),T1="b312628369f47e04894f338b7fc0b318",Ss=async(n,e="",t=T1)=>{var h;const s=n.trim();if(!s)return{address:"",source:"",error:""};const r=`${(e==null?void 0:e.trim())||""} ${s}`.trim();if(t)try{const p=await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(r)}&size=1`,{headers:{Authorization:`KakaoAK ${t}`}});if(p.ok){const v=(h=(await p.json()).documents)==null?void 0:h[0];if(v){const I=v.road_address_name||v.address_name||"";if(I)return{address:I,lat:v.y,lon:v.x,source:"카카오"}}return{address:"",source:"카카오",error:"검색 결과 없음"}}}catch{}const o=p=>{if(!p)return"";const b=p.road||p.pedestrian||p.footway||"",v=p.house_number||"",I=p.quarter||p.suburb||p.neighbourhood||"",A=p.city_district||p.county||"",M=p.city||p.town||p.village||"";return b?[M||A,b,v].filter(Boolean).join(" "):I?[M,A,I].filter(Boolean).join(" "):""},l=[...new Set([r,s,e?`${e} ${s}`.trim():null].filter(Boolean))];for(const p of l){const b=new AbortController,v=setTimeout(()=>b.abort(),8e3);try{const I=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=kr&accept-language=ko&addressdetails=1&q=${encodeURIComponent(p)}`,{method:"GET",headers:{Accept:"application/json","Accept-Language":"ko"},signal:b.signal});if(!I.ok)throw new Error(`HTTP ${I.status}`);const A=await I.json();if(clearTimeout(v),!(A!=null&&A.length))continue;for(const z of A){const Q=o(z.address);if(Q)return{address:Q,lat:z.lat,lon:z.lon,source:"Nominatim"}}const M=A[0].display_name||"";if(M)return{address:M.split(", ").filter(Q=>Q!=="대한민국"&&!/^\d{5}$/.test(Q)).slice(0,4).reverse().join(" "),lat:A[0].lat,lon:A[0].lon,source:"Nominatim"}}catch{clearTimeout(v);continue}}try{const p="".replace(/\/$/,""),b=Array.from(new Set([p?`${p}/api/scrape`:"","/api/scrape"].filter(Boolean))),v=`https://map.naver.com/v5/search/${encodeURIComponent(r)}`;for(const I of b)try{const A=await fetch(I,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:v})});if(!A.ok)continue;const M=await A.json(),z=String((M==null?void 0:M.address)||"").trim();if(z&&/[가-힣]/.test(z)&&/\d/.test(z)&&/(로|길|대로|번길|읍|면|동|리)/.test(z))return{address:z,source:"NaverScrape"}}catch{}}catch{}return{address:"",source:"Nominatim",error:"검색 결과 없음 (카카오/네이버 보강 실패)"}},yh=({startDate:n,endDate:e,onStartChange:t,onEndChange:s,onClose:r})=>{const o=E=>E?new Date(E+"T00:00:00"):null,l=E=>`${E.getFullYear()}-${String(E.getMonth()+1).padStart(2,"0")}-${String(E.getDate()).padStart(2,"0")}`,h=o(n),p=o(e),b=h||new Date,[v,I]=wt.useState(b.getFullYear()),[A,M]=wt.useState(b.getMonth()),[z,Q]=wt.useState("start"),J=new Date(v,A,1),_e=new Date(v,A+1,0),oe=[];for(let E=0;E<J.getDay();E++)oe.push(null);for(let E=1;E<=_e.getDate();E++)oe.push(new Date(v,A,E));const pe=E=>{const N=l(E);z==="start"?(t(N),p&&E>p&&s(""),Q("end")):h&&E<h?(t(N),s("")):(s(N),setTimeout(r,150))},me=(E,N)=>E&&N&&l(E)===l(N),tt=()=>{A===0?(I(E=>E-1),M(11)):M(E=>E-1)},Fe=()=>{A===11?(I(E=>E+1),M(0)):M(E=>E+1)},j=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],k=["일","월","화","수","목","금","토"];return a.jsxs("div",{className:"absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 z-[300]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("button",{onClick:tt,className:"w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors",children:a.jsx(Ta,{size:14})}),a.jsxs("span",{className:"text-[13px] font-black text-slate-800",children:[v,"년 ",j[A]]}),a.jsx("button",{onClick:Fe,className:"w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors",children:a.jsx(Ia,{size:14})})]}),a.jsx("div",{className:"grid grid-cols-7 mb-1",children:k.map((E,N)=>a.jsx("span",{className:`text-center text-[9px] font-black pb-1 ${N===0?"text-rose-400":N===6?"text-blue-400":"text-slate-400"}`,children:E},E))}),a.jsx("div",{className:"grid grid-cols-7 gap-y-0.5",children:oe.map((E,N)=>{if(!E)return a.jsx("div",{},`e-${N}`);const S=me(E,h),C=me(E,p),T=h&&p&&E>h&&E<p,Xe=E.getDay();return a.jsx("button",{onClick:()=>pe(E),className:`h-8 w-full text-[11px] font-bold transition-all
                ${S||C?"bg-[#3182F6] text-white font-black rounded-lg":""}
                ${T?"bg-blue-50 text-[#3182F6] rounded-none":""}
                ${!S&&!C&&!T?`hover:bg-slate-100 rounded-lg ${Xe===0?"text-rose-400":Xe===6?"text-blue-500":"text-slate-700"}`:""}
              `,children:E.getDate()},N)})}),a.jsxs("div",{className:"mt-3 pt-3 border-t border-slate-100 flex items-center justify-between",children:[a.jsxs("div",{className:`flex flex-col ${z==="start"?"opacity-100":"opacity-40"} transition-opacity`,children:[a.jsx("span",{className:"text-[8px] font-black text-[#3182F6] uppercase tracking-wider",children:"시작일"}),a.jsx("span",{className:"text-[12px] font-black text-slate-800",children:n?n.slice(5).replace("-","/"):"—"})]}),a.jsx("span",{className:"text-slate-300 font-black text-sm",children:"→"}),a.jsxs("div",{className:`flex flex-col items-end ${z==="end"?"opacity-100":"opacity-40"} transition-opacity`,children:[a.jsx("span",{className:"text-[8px] font-black text-[#3182F6] uppercase tracking-wider",children:"종료일"}),a.jsx("span",{className:"text-[12px] font-black text-slate-800",children:e?e.slice(5).replace("-","/"):"—"})]})]}),a.jsx("p",{className:"text-[9px] text-center text-slate-400 font-bold mt-1.5",children:z==="start"?"시작일을 선택하세요":"종료일을 선택하세요"})]})},I1=({newPlaceName:n,setNewPlaceName:e,newPlaceTypes:t,setNewPlaceTypes:s,regionHint:r,onAdd:o,onCancel:l})=>{const[h,p]=wt.useState(nm),[b,v]=wt.useState([]),[I,A]=wt.useState({name:"",price:""}),[M,z]=wt.useState(""),[Q,J]=wt.useState(""),[_e,oe]=wt.useState(!1),[pe,me]=wt.useState(""),tt=wt.useRef(""),Fe=(S="")=>{const C=String(S||"").match(/https?:\/\/(?:naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\/[^\s)>\]"']+/i);return C!=null&&C[0]?C[0].replace(/[),.;]+$/,""):""},j=()=>{I.name.trim()&&(v(S=>[...S,{name:I.name.trim(),price:Number(I.price)||0}]),A({name:"",price:""}))},k=()=>{o({types:rs(t),menus:b,address:M,memo:Q,business:Ge(h)})},E=async(S=!1)=>{if(!_e&&n.trim()&&!(M.trim()&&!S)){oe(!0),me("주소 검색 중...");try{const C=await Ss(n,r);if(!(C!=null&&C.address)){me("검색 결과가 없습니다.");return}z(C.address),me("주소가 자동 입력되었습니다.")}catch{me("자동 입력에 실패했습니다.")}finally{oe(!1)}}},N=async S=>{const C=String(S||"").trim();if(C&&tt.current!==C){tt.current=C,oe(!0),me("지도 링크 분석 중...");try{const T="".replace(/\/$/,""),Xe=Array.from(new Set([T?`${T}/api/scrape`:"","/api/scrape"].filter(Boolean)));let Ae=null,Ws=null;for(const Ye of Xe)try{const Le=await fetch(Ye,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:C})});if(!Le.ok){const Gt=await Le.json().catch(()=>({}));throw new Error((Gt==null?void 0:Gt.details)||(Gt==null?void 0:Gt.error)||`HTTP ${Le.status}`)}if(Ae=await Le.json(),Ae)break}catch(Le){Ws=Le}if(!Ae)throw Ws||new Error("스크래핑 응답이 없습니다.");Ae!=null&&Ae.title&&e(String(Ae.title).trim()),Ae!=null&&Ae.address&&z(String(Ae.address).trim());const rt=Ga(String((Ae==null?void 0:Ae.hours)||""));if((rt.open||rt.close||rt.breakStart||rt.breakEnd||rt.lastOrder||rt.entryClose)&&p(Ye=>({...Ye,...rt})),Array.isArray(Ae==null?void 0:Ae.menus)&&Ae.menus.length>0){const Ye=Ae.menus.map(Le=>({name:String((Le==null?void 0:Le.name)||"").trim(),price:Number(Le==null?void 0:Le.price)||0})).filter(Le=>!(!Le.name||/(제주|서울|부산|인천|경기|강원|충북|충남|전북|전남|경북|경남)/.test(Le.name)&&/(로|길|대로|번길|동|읍|면)\s*\d/.test(Le.name)||/(이전\s*페이지|다음\s*페이지|닫기|펼치기|이미지\s*개수|translateX|translateY)/i.test(Le.name)));Ye.length&&v(Ye.slice(0,5))}if(me("지도 링크에서 장소 정보를 불러왔습니다."),!(Ae!=null&&Ae.address)&&(Ae!=null&&Ae.title)){const Ye=await Ss(String(Ae.title),r);Ye!=null&&Ye.address&&z(Ye.address)}}catch(T){me(`지도 자동 추출 실패: ${(T==null?void 0:T.message)||"알 수 없는 오류"}`)}finally{oe(!1)}}};return a.jsxs("div",{className:"mb-4 w-full shrink-0 rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden",children:[a.jsx("div",{className:"px-4 py-3 border-b border-slate-100/60 bg-slate-50/50 flex items-center justify-between",children:a.jsx("p",{className:"text-[10px] font-black text-slate-400 uppercase tracking-widest",children:"새 장소 등록"})}),a.jsxs("div",{className:"p-3 flex flex-col gap-2.5",children:[a.jsx(fc,{value:t,onChange:s,title:"태그"}),a.jsx("div",{className:"relative group/name-input",children:a.jsxs("div",{className:"flex items-center gap-2 bg-slate-50 border-2 border-slate-100 focus-within:border-[#3182F6] focus-within:bg-white transition-all rounded-2xl px-4 py-3 shadow-sm",children:[a.jsx("input",{autoFocus:!0,value:n,onChange:S=>{const C=S.target.value,T=Fe(C);T?N(T):e(C)},onPaste:async S=>{const C=S.clipboardData.getData("text");if(C&&!Fe(C)&&C.length>50){const T=mh(C);T&&(T.address||T.business||T.menus.length)&&(S.preventDefault(),T.name&&e(T.name),T.address&&z(T.address),T.business&&p(T.business),T.menus.length&&v(T.menus),me("클립보드 내용을 분석하여 입력했습니다."))}},onBlur:()=>{E(!1)},onKeyDown:S=>{S.key==="Escape"&&l(),S.key==="Enter"&&(S.preventDefault(),E(!0))},placeholder:"일정 이름 입력 (지도 링크 붙여넣기 가능)",className:"flex-1 bg-transparent text-[17px] font-black text-slate-800 leading-tight outline-none placeholder:text-slate-300"}),a.jsx("button",{type:"button",onClick:async()=>{try{const S=await navigator.clipboard.readText(),C=mh(S);C?(C.name&&e(C.name),C.address&&z(C.address),C.business&&p(C.business),C.menus.length&&v(C.menus),me("클립보드 내용을 분석하여 입력했습니다.")):me("분석할 수 없는 형식입니다.")}catch{me("클립보드 접근 권한이 필요합니다.")}},className:"shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-[#3182F6] hover:bg-[#3182F6] hover:text-white transition-all active:scale-95",title:"스마트 붙여넣기",children:a.jsx(ai,{size:14})})]})}),a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm",children:[a.jsx(cr,{size:12,className:"text-[#3182F6]"}),a.jsx("input",{value:M,onChange:S=>z(S.target.value),placeholder:"주소를 입력하세요",className:"bg-transparent border-none outline-none text-[11px] font-bold w-full text-slate-600 placeholder:text-slate-400"}),a.jsx("button",{type:"button",onClick:()=>{E(!0)},disabled:_e||!n.trim(),className:"shrink-0 px-1.5 py-1 rounded-md text-[9px] font-black border border-slate-200 bg-white text-slate-500 disabled:opacity-50 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",title:"일정 이름으로 주소 자동 입력",children:a.jsx(ai,{size:9})})]}),pe&&a.jsx("p",{className:`text-[9px] font-bold -mt-1 ${pe.includes("실패")||pe.includes("없습니다")?"text-amber-500":"text-slate-400"}`,children:pe}),a.jsx("input",{value:Q,onChange:S=>J(S.target.value),placeholder:"메모를 입력하세요...",className:"w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-slate-300 focus:bg-white transition-all"}),a.jsx("div",{className:"bg-slate-50/50 border border-slate-200 rounded-xl p-2.5",children:a.jsx(pc,{business:h,onChange:S=>p(S)})}),a.jsxs("div",{className:"bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-2",children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5",children:"대표 메뉴"}),b.length===0&&a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold mb-2",children:"메뉴를 추가하면 일정 셀 하단 영수증과 동일하게 반영됩니다."}),b.map((S,C)=>a.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1",children:[a.jsx("span",{className:"flex-1 truncate",children:S.name}),a.jsxs("span",{className:"text-slate-400",children:["₩",S.price.toLocaleString()]}),a.jsx("button",{onClick:()=>v(T=>T.filter((Xe,Ae)=>Ae!==C)),className:"text-slate-300 hover:text-red-400 ml-1",children:"✕"})]},C)),a.jsxs("div",{className:"grid grid-cols-[minmax(0,1fr)_4.25rem_auto] gap-1",children:[a.jsx("input",{value:I.name,onChange:S=>A(C=>({...C,name:S.target.value})),onKeyDown:S=>{S.key==="Enter"&&j()},placeholder:"메뉴 이름",className:"min-w-0 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"}),a.jsx("input",{value:I.price,onChange:S=>A(C=>({...C,price:S.target.value})),onKeyDown:S=>{S.key==="Enter"&&j()},placeholder:"가격",type:"number",className:"w-[4.25rem] text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("button",{onClick:j,className:"px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 hover:bg-slate-200 whitespace-nowrap",children:"+"})]})]})]}),a.jsxs("div",{className:"mt-2 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-3",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"text-[11px] font-bold text-blue-900/60 uppercase tracking-widest leading-none",children:"Estimated Total"}),a.jsxs("span",{className:"text-[19px] font-black text-[#3182F6] leading-none",children:["₩",b.reduce((S,C)=>S+(Number(C.price)||0),0).toLocaleString()]})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:k,className:"flex-1 py-3 bg-[#3182F6] text-white text-[13px] font-black rounded-xl shadow-[0_8px_16px_-6px_rgba(49,130,246,0.35)] hover:bg-blue-600 transition-all active:scale-[0.98]",children:"일정 추가하기"}),a.jsx("button",{onClick:l,className:"px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[13px] font-black rounded-xl hover:bg-slate-50 transition-all",children:"취소"})]})]})]})},A1=()=>{var wu,Eu,Tu,Iu,Au,ku,Su,Nu;const[n,e]=$.useState(null),[t,s]=$.useState(!0),[r,o]=$.useState("");$.useEffect(()=>{let c=!0,u=!1;const y=setTimeout(()=>{c&&!u&&(console.warn("Auth initialization timeout fallback"),s(!1))},12e3);(async()=>{try{await ix(Kr,Op)}catch(w){console.warn("Auth persistence setup failed:",(w==null?void 0:w.code)||(w==null?void 0:w.message))}try{await Vx(Kr)}catch(w){c&&w.code!=="auth/redirect-cancelled-by-user"&&(console.warn("Redirect Login Note:",(w==null?void 0:w.code)||(w==null?void 0:w.message)),o(`로그인 처리 중 오류: ${(w==null?void 0:w.code)||(w==null?void 0:w.message)||"unknown"}`))}})();const g=lx(Kr,w=>{c&&(u=!0,clearTimeout(y),o(""),e(w),s(!1))});return()=>{c=!1,clearTimeout(y),g()}},[]);const l=async()=>{o("");try{const c=new Dn;c.setCustomParameters({prompt:"select_account"}),await Sx(Kr,c)}catch(c){console.error("로그인 에러 상세:",c==null?void 0:c.code,c==null?void 0:c.message);let u="로그인 과정을 시작할 수 없습니다.";if(c.code==="auth/configuration-not-found")u=`Firebase 프로젝트에서 "구글 로그인"이 활성화되지 않았습니다.

해결 방법:
1. Firebase Console 접속
2. Authentication > Sign-in method
3. [Add new provider] 클릭 후 "Google" 활성화`;else if(c.code==="auth/unauthorized-domain")u=`현재 도메인(${window.location.hostname})이 Firebase 승인 된 도메인에 없습니다.

해결 방법:
1. Firebase Console > Authentication > Settings
2. [Authorized domains]에 "${window.location.hostname}" 추가`;else if(c.code==="auth/popup-blocked"||c.code==="auth/popup-closed-by-user"||c.code==="auth/cancelled-popup-request"||c.code==="auth/operation-not-supported-in-this-environment"){const y=new Dn;y.setCustomParameters({prompt:"select_account"}),await Dx(Kr,y);return}else u+=`
(오류 코드: ${c.code||c.message})`;o(u),alert(u)}},h=()=>{window.confirm("계정 없이 시작하시겠습니까? 데이터가 서버에 저장되지 않을 수 있습니다.")&&(e({uid:"guest_user",displayName:"GUEST",isGuest:!0}),s(!1))},p=async()=>{if(window.confirm("로그아웃 하시겠습니까?"))try{await cx(Kr),ae({days:[],places:[]}),Wn([]),Ni(null),kn(null),v(!0)}catch(c){console.error("로그아웃 실패:",c)}},[b,v]=$.useState(!0),[I,A]=$.useState(null),[M,z]=$.useState("main"),[Q,J]=$.useState([]),[_e,oe]=$.useState(!1),[pe,me]=$.useState(!1),[tt,Fe]=$.useState(""),[j,k]=$.useState(""),[E,N]=$.useState(!1),[S,C]=$.useState(!1),[T,Xe]=$.useState(!1),[Ae,Ws]=$.useState(!1),[rt,Ye]=$.useState({visibility:"private",permission:"viewer"}),[Le,Gt]=$.useState(!1),[Ve,_n]=$.useState(null),yt=$.useRef(!1),[ru,Tr]=$.useState(!1),[Re,Kt]=$.useState(null),[Ir,Do]=$.useState([]),[Y,Et]=$.useState(null),[Oo,Ar]=$.useState(!1),[Gs,Jt]=$.useState(""),[nt,St]=$.useState(null),[$t,an]=$.useState(null),[ln,cn]=$.useState(!1),[Vo,Ei]=$.useState({x:0,y:0}),us=$.useRef(null),Ks=$.useRef(!1),[ct,ut]=$.useState(!1),[Bn,Ti]=$.useState(""),[Mo,Fo]=$.useState(["food"]),[ds,wn]=$.useState(null),[dt,Ze]=$.useState(null),[ze,Js]=$.useState(()=>ha("trip_region_hint","제주시")),[je,qn]=$.useState(()=>ha("trip_start_date","")),[ht,Zt]=$.useState(()=>ha("trip_end_date","")),[kr,Sr]=$.useState(""),[En,Ii]=$.useState(""),[Qs,Ai]=$.useState(""),[hs,ki]=$.useState("0"),[H,ae]=$.useState({days:[],places:[]}),[Hn,Wn]=$.useState([]),[Si,Xs]=$.useState([]),[fs,Nr]=$.useState(!1),[fl,Cr]=$.useState(""),Pr=wt.useRef(null),[Rr,jr]=$.useState(null),[Tn,Lo]=$.useState(null),[Be,ps]=$.useState(null);$.useEffect(()=>{const c=u=>{Be&&(u.target.closest('[data-time-trigger="true"]')||u.target.closest(".group\\/tower")||ps(null))};return document.addEventListener("mousedown",c),()=>document.removeEventListener("mousedown",c)},[Be]);const[Ut,ms]=$.useState(null),Dr=$.useRef(""),[iu,ne]=$.useState("3일차 시작 일정이 수정되었습니다."),[pl,$o]=$.useState({}),[Qt,In]=$.useState(1),[gs,Ni]=$.useState(null),Ys=wt.useRef(!1),Or=wt.useRef(null);$.useRef(null),$.useRef({x:0,y:0});const An=$.useRef(!1),Ci=$.useRef(null),[Uo,ml]=$.useState(!1);$.useRef({overflow:"",touchAction:""});const Gn=$.useRef(null),Vr=$.useRef(null),zo=(c,u=null)=>{var w,x,P;Ys.current=!0,Or.current&&clearTimeout(Or.current),c&&In(c);let y=u;if(!y){const O=(w=H.days)==null?void 0:w.find(G=>G.day===c),V=(x=O==null?void 0:O.plan)==null?void 0:x.find(G=>G.type!=="backup");V&&(y=V.id)}if(y){Ni(y),Vi(y),setTimeout(()=>Vi(null),1500);let O=null;for(const V of H.days||[])if(O=(P=V.plan)==null?void 0:P.find(G=>G.id===y),O)break;if(O){const V=ve(O,"to");kn(V?{id:O.id,name:O.activity,address:V}:{id:O.id,name:O.activity,address:""})}}const f=()=>{if(y){const V=document.getElementById(y);if(V)return V}const O=document.getElementById(`day-marker-${c}`);if(O)return O;if(y){const V=document.querySelector(`[data-plan-id="${CSS.escape(String(y))}"]`);if(V)return V}return null},g=()=>{const O=f();return O?(O.scrollIntoView({behavior:"smooth",block:y?"center":"start"}),!0):!1};g()||requestAnimationFrame(()=>{g()||setTimeout(g,120)}),Or.current=setTimeout(()=>{Ys.current=!1},1500)},[Ne,kn]=$.useState(null),[Mr,en]=$.useState({}),[Tt,Kn]=$.useState(()=>typeof window<"u"&&window.innerWidth<1100),[Nt,Zs]=$.useState(()=>typeof window<"u"&&window.innerWidth<1100),[De,Fr]=$.useState(()=>typeof window<"u"?window.innerWidth:1280),[bt,er]=$.useState(null),[ys,Bo]=$.useState(null),[gl,Lr]=$.useState({}),[bs,vs]=$.useState(null),[Jn,zt]=$.useState({}),[tr,Pi]=$.useState(null),[Ri,Sn]=$.useState(!1),[yl,ji]=$.useState(0),[ou,un]=$.useState(200),Di=$.useRef(null),qo=$.useRef(null),[nr,$r]=$.useState(!1),[Oi,sr]=$.useState(!1),[rr,Vi]=$.useState(null),et=De<1100,qe=et?Math.min(340,Math.round(De*.82)):260,Mi=et?Math.min(360,Math.round(De*.86)):310,bl=et?0:44,Ho=et?0:44,xs=Tt?bl:qe,Ur=Nt?Ho:Mi,Nn=et||De<1380||!Tt&&!Nt&&De<1720,Fi=Nn?"max-w-[500px]":"max-w-[560px]",Ft=$.useRef(null),zr=$.useRef(null),Wo=$.useRef(et);$.useEffect(()=>{const c=()=>Fr(window.innerWidth);return window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[]),$.useEffect(()=>{et&&!Wo.current&&(Kn(!0),Zs(!0)),Wo.current=et},[et]),$.useEffect(()=>{if(et)return;const c=qe+Mi+560+96;De>=c&&(Tt||Nt)&&(Kn(!1),Zs(!1))},[De,et,qe,Mi,Tt,Nt]),$.useCallback(()=>{Ft.current||(Ft.current=setInterval(()=>{if(zr.current===null)return;const c=zr.current,u=120,y=1.2;c<u?window.scrollBy(0,-Math.pow((u-c)/8,y)-2):c>window.innerHeight-u&&window.scrollBy(0,Math.pow((c-(window.innerHeight-u))/8,y)+2)},16))},[]),$.useCallback(()=>{Ft.current&&(clearInterval(Ft.current),Ft.current=null),zr.current=null},[]);const tn=(c={})=>({visibility:["private","link","public"].includes(c==null?void 0:c.visibility)?c.visibility:"private",permission:["viewer","editor"].includes(c==null?void 0:c.permission)?c.permission:"viewer"}),Go=(c,u)=>{const y=new URL(window.location.href);return y.searchParams.set("owner",c),y.searchParams.set("plan",u||"main"),y.toString()},Br=(c="")=>{const u=String(c||"").trim().replace(/\s+/g,"");return u?u.slice(0,6).toUpperCase():"TRIP"},dn=(c="",u="")=>{const y=String(u||"").trim(),f=/^\d{4}-\d{2}/.test(y)?y.slice(0,7).replace("-",""):new Date().toISOString().slice(0,7).replace("-",""),g=String(Date.now()).slice(-4);return`${Br(c)}-${f}-${g}`},Li=(c="",u="",y="")=>{const f=String(u||"").trim(),g=/^\d{4}-\d{2}/.test(f)?f.slice(0,7).replace("-",""):new Date().toISOString().slice(0,7).replace("-",""),w=String(y||"main").replace(/[^a-zA-Z0-9]/g,"").slice(-4).toUpperCase().padStart(4,"0");return`${Br(c)}-${g}-${w}`},ir=(c={})=>{const u=c.id===M,y=(u?ze:c.region)||"여행지",f=(u?H.planTitle||"":c.title)||`${y} 일정`,g=(u?je:c.startDate)||"",w=(u?H.planCode:c.planCode)||Li(y,g,c.id||M);return{region:y,title:f,startDate:g,code:w}},$i=(c="")=>{const u=String(c||"").toLowerCase();return/(제주|jeju)/.test(u)?"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop":/(부산|busan)/.test(u)?"https://images.unsplash.com/photo-1526481280695-3c4696659f38?q=80&w=1600&auto=format&fit=crop":/(서울|seoul)/.test(u)?"https://images.unsplash.com/photo-1538485399081-7c897f6e6f68?q=80&w=1600&auto=format&fit=crop":/(강릉|속초|동해|gangneung|sokcho)/.test(u)?"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1600&auto=format&fit=crop":/(도쿄|tokyo)/.test(u)?"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop":/(오사카|osaka)/.test(u)?"https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=1600&auto=format&fit=crop":/(후쿠오카|fukuoka)/.test(u)?"https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1600&auto=format&fit=crop":/(파리|paris)/.test(u)?"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop":/(뉴욕|new york|nyc)/.test(u)?"https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1600&auto=format&fit=crop":"https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop"},Ui=(c="새 여행지",u="")=>({days:[{day:1,plan:[]}],places:[],maxBudget:15e5,tripRegion:c,tripStartDate:"",tripEndDate:"",planTitle:u||`${c} 여행`,planCode:dn(c,""),share:{visibility:"private",permission:"viewer"},updatedAt:Date.now()}),Bt=$.useCallback(async c=>{if(c)try{const y=(await bv(nv(Rn,"users",c,"itinerary"))).docs.map(f=>{const g=f.data()||{};return{id:f.id,title:g.planTitle||`${g.tripRegion||"여행"} 일정`,region:g.tripRegion||"",planCode:g.planCode||"",startDate:g.tripStartDate||"",updatedAt:Number(g.updatedAt||0)}}).sort((f,g)=>g.updatedAt-f.updatedAt);J(y)}catch(u){console.error("일정 목록 로드 실패:",u)}},[]),zi=async(c="")=>{if(!n||n.isGuest){ne("게스트 모드에서는 새 일정 생성이 제한됩니다.");return}const u=`plan_${Date.now()}`,y=String(c||tt||"").trim()||"새 여행지",f=j.trim()||`${y} 여행`,g=Ui(y,f);g.planCode=dn(y,g.tripStartDate||""),await no(Zn(Rn,"users",n.uid,"itinerary",u),g),await Bt(n.uid),z(u),Fe(""),k(""),oe(!1),me(!1),ne(`'${f}' 일정이 생성되었습니다.`)},Bi=c=>{const u=tn(c);Ye(u),ae(y=>({...y,share:u}))},qi=async()=>{if(!n||n.isGuest){ne("게스트 모드에서는 공유 링크를 만들 수 없습니다.");return}const c=Go(n.uid,M);try{await navigator.clipboard.writeText(c),Ws(!0),setTimeout(()=>Ws(!1),1400),ne("공유 링크를 복사했습니다.")}catch{ne(`공유 링크: ${c}`)}};$.useEffect(()=>{T&&(Sr(ze||""),Ii(je||""),Ai(ht||""),ki(String((H==null?void 0:H.maxBudget)||0)))},[T,ze,je,ht,H==null?void 0:H.maxBudget]),$.useEffect(()=>{const c=y=>{y.key==="Control"&&(Ks.current=!0)},u=y=>{y.key==="Control"&&(Ks.current=!1)};return window.addEventListener("keydown",c),window.addEventListener("keyup",u),()=>{window.removeEventListener("keydown",c),window.removeEventListener("keyup",u)}},[]),$.useEffect(()=>{const c=new URLSearchParams(window.location.search),u=c.get("owner"),y=c.get("plan")||"main";u&&(_n({ownerId:u,planId:y}),z(y))},[]),$.useEffect(()=>{n||!(Ve!=null&&Ve.ownerId)||(async()=>{v(!0);try{const c=await ua(Zn(Rn,"users",Ve.ownerId,"itinerary",Ve.planId||"main"));if(!c.exists()){ne("공유 일정을 찾을 수 없습니다."),v(!1);return}const u=c.data(),y=tn(u.share||{});if(y.visibility==="private"){ne("공유가 비공개라 접근할 수 없습니다."),v(!1);return}const f=(u.days||[]).map(g=>({...g,plan:(g.plan||[]).map(w=>({...w}))}));ae({days:f,places:u.places||[],maxBudget:u.maxBudget||15e5,share:y,planTitle:u.planTitle||`${u.tripRegion||"공유"} 일정`,planCode:u.planCode||dn(u.tripRegion||"공유",u.tripStartDate||"")}),Ye(y),u.tripRegion&&Js(u.tripRegion),typeof u.tripStartDate=="string"&&qn(u.tripStartDate),typeof u.tripEndDate=="string"&&Zt(u.tripEndDate),z(Ve.planId||"main"),Gt(y.permission!=="editor")}catch(c){console.error("공유 일정 로드 실패:",c)}finally{v(!1)}})()},[n,Ve]),$.useEffect(()=>{!n||n.isGuest||Bt(n.uid)},[n,Bt]),$.useEffect(()=>{if(!n||n.isGuest||b||Le)return;const c=setTimeout(()=>{const u={planTitle:H.planTitle||`${ze||"여행지"} 일정`,planCode:H.planCode||Li(ze||"여행지",je||"",M),tripRegion:ze||"여행지",tripStartDate:je||"",tripEndDate:ht||"",updatedAt:Date.now()};no(Zn(Rn,"users",n.uid,"itinerary",M||"main"),u,{merge:!0}).then(()=>Bt(n.uid)).catch(()=>{})},350);return()=>clearTimeout(c)},[n,b,Le,M,H.planTitle,H.planCode,ze,je,ht,Bt]),$.useEffect(()=>{if(!n){yt.current=!1,me(!1);return}if(n.isGuest){me(!1);return}if(Ve!=null&&Ve.ownerId){me(!1);return}},[n,b,Ve]),$.useEffect(()=>{const c=y=>{const f=Gn.current;if(!f)return;const g=y.touches[0];if(!An.current){const w=g.clientX-f.startX,x=g.clientY-f.startY;if(Math.sqrt(w*w+x*x)<10)return;An.current=!0,f.kind==="library"?Kt(f.place):Et(f.payload),document.body.style.overflow="hidden",document.body.style.touchAction="none"}if(An.current){y.preventDefault(),Ei({x:g.clientX,y:g.clientY});const w=document.elementFromPoint(g.clientX,g.clientY),x=w==null?void 0:w.closest("[data-droptarget]"),P=w==null?void 0:w.closest("[data-dropitem]"),O=w==null?void 0:w.closest("[data-deletezone]");if(x){const[V,G]=x.dataset.droptarget.split("-").map(Number);St({dayIdx:V,insertAfterPIdx:G}),an(null)}else if(P){const[V,G]=P.dataset.dropitem.split("-").map(Number);an({dayIdx:V,pIdx:G}),St(null)}else St(null),an(null);Ar(!!O)}},u=y=>{var g;if(Gn.current){if(An.current){const w=y.changedTouches[0];document.body.style.overflow="",document.body.style.touchAction="",(g=Vr.current)==null||g.call(Vr,w.clientX,w.clientY)}Gn.current=null,An.current=!1,Kt(null),Et(null),St(null),an(null),Ar(!1)}};return window.addEventListener("touchmove",c,{passive:!1}),window.addEventListener("touchend",u,{passive:!0}),window.addEventListener("touchcancel",u,{passive:!0}),()=>{window.removeEventListener("touchmove",c),window.removeEventListener("touchend",u),window.removeEventListener("touchcancel",u)}},[]),$.useEffect(()=>{if(!Di.current)return;un(Di.current.offsetHeight);const c=new ResizeObserver(u=>{un(u[0].contentRect.height)});return c.observe(Di.current),()=>c.disconnect()},[]),$.useEffect(()=>{fa("trip_region_hint",ze)},[ze]),$.useEffect(()=>{const c=[];if((H.days||[]).forEach((y,f)=>{(y.plan||[]).forEach((g,w)=>{g!=null&&g._timingConflict&&c.push(`${f}-${w}-${g.id}`)})}),c.length===0){Dr.current="";return}const u=c.join("|");u!==Dr.current&&(Dr.current=u,ne("시간 충돌: 고정/잠금 조건으로 자동 계산이 불가한 구간이 있습니다."),window.alert(`시간 충돌이 발생했습니다.
소요시간 잠금 또는 시작시간 고정을 일부 해제해 주세요.`))},[H.days]),$.useEffect(()=>{fa("trip_start_date",je)},[je]),$.useEffect(()=>{fa("trip_end_date",ht)},[ht]),$.useEffect(()=>{let c=!1;return(async()=>{if(!(Ne!=null&&Ne.address)){en({});return}const y=await ft(Ne.address);if(!y||c)return;const f=await Promise.all((H.places||[]).map(async g=>{var P;const w=(g.address||((P=g.receipt)==null?void 0:P.address)||"").trim();if(!w)return[g.id,null];const x=await ft(w);return x?[g.id,+d(y.lat,y.lon,x.lat,x.lon).toFixed(1)]:[g.id,null]}));c||en(Object.fromEntries(f))})(),()=>{c=!0}},[Ne==null?void 0:Ne.address,H.places]),$.useEffect(()=>{let y=!1;const f=()=>{const w=qo.current;if(!w)return;const x=w.getBoundingClientRect().top;$r(P=>!P&&x<=0?!0:P&&x>=56?!1:P)},g=()=>{y||(y=!0,requestAnimationFrame(()=>{f(),y=!1}))};return g(),window.addEventListener("scroll",g,{passive:!0}),window.addEventListener("resize",g),()=>{window.removeEventListener("scroll",g),window.removeEventListener("resize",g)}},[]),$.useEffect(()=>{const c=()=>{window.innerWidth<768&&(Kn(!0),Zs(!0))};return c(),window.addEventListener("resize",c),()=>window.removeEventListener("resize",c)},[]),$.useEffect(()=>{var u;if(!((u=H.days)!=null&&u.length))return;const c=[];return H.days.forEach(y=>{const f=document.getElementById(`day-marker-${y.day}`);if(!f)return;const g=new IntersectionObserver(([w])=>{w.isIntersecting&&!Ys.current&&In(y.day)},{rootMargin:"-30% 0px -60% 0px",threshold:0});g.observe(f),c.push(g)}),H.days.forEach(y=>{(y.plan||[]).filter(f=>f.type!=="backup").forEach((f,g)=>{const w=g===0?`day-marker-${y.day}`:f.id,x=document.getElementById(w);if(!x)return;const P=new IntersectionObserver(([O])=>{O.isIntersecting&&!Ys.current&&Ni(f.id)},{rootMargin:"-5% 0px -85% 0px",threshold:0});P.observe(x),c.push(P)})}),()=>c.forEach(y=>y.disconnect())},[H.days]),$.useEffect(()=>{if(!Ut)return;const c=()=>ms(null),u=y=>{var g,w;const f=y.target;(g=f==null?void 0:f.closest)!=null&&g.call(f,'[data-plan-picker="true"]')||(w=f==null?void 0:f.closest)!=null&&w.call(f,'[data-plan-picker-trigger="true"]')||ms(null)};return document.addEventListener("pointerdown",u,!0),window.addEventListener("scroll",c,!0),window.addEventListener("resize",c),()=>{document.removeEventListener("pointerdown",u,!0),window.removeEventListener("scroll",c,!0),window.removeEventListener("resize",c)}},[Ut]);const Cn=H.maxBudget||15e5,[Ko,_s]=$.useState(!1),[Hi,Qn]=$.useState(!1),Xn=$.useMemo(()=>(H.days||[]).reduce((c,u)=>c+((u==null?void 0:u.plan)||[]).filter(y=>y.type!=="backup").length,0),[H.days]),Jo=1700,Qo=13,qt=1,hn=15,Xt=10,vt=1,or=c=>{const u=Number(c==null?void 0:c.qty);return!Number.isFinite(u)||u<=0?1:u},fn=c=>Number((c==null?void 0:c.price)||0)*or(c),pn=c=>{var f;if(typeof(c==null?void 0:c.revisit)=="boolean")return c.revisit;const u=Array.isArray((f=c==null?void 0:c.receipt)==null?void 0:f.items)?c.receipt.items.map(g=>(g==null?void 0:g.name)||"").join(" "):"",y=`${(c==null?void 0:c.memo)||""} ${u}`;return/재방문/i.test(y)},i=(c,u)=>{const y=String(c||"").match(/(\d+)/);if(!y)return u;const f=parseInt(y[1],10);return Number.isNaN(f)?u:f},d=(c,u,y,f)=>{const g=V=>V*(Math.PI/180),x=g(y-c),P=g(f-u),O=Math.sin(x/2)**2+Math.cos(g(c))*Math.cos(g(y))*Math.sin(P/2)**2;return 6371*(2*Math.atan2(Math.sqrt(O),Math.sqrt(1-O)))},m=({distanceKm:c,straightKm:u,rawDurationMins:y,isSameAddress:f})=>{const g=Math.max(0,Number(c)||0),w=Math.max(0,Number(u)||0),x=Math.max(1,Number(y)||1);if(f)return x;const P=Math.ceil(g/35*60),O=Math.ceil(w/45*60),V=g>=.25?2:1,G=g>=.25&&g<1.2?4:g<.25?2:0;return Math.max(x,P+V,O+V,G)},_=$.useRef({});$.useEffect(()=>{if(!(Ne!=null&&Ne.address)){en({});return}(async()=>{var u,y;try{ne("내 장소 거리 계산 중...");const f=await Ss(Ne.address);if(!(f!=null&&f.lat)||!(f!=null&&f.lon)){ne("기준 일정의 좌표를 찾을 수 없습니다.");return}const g=parseFloat(f.lat),w=parseFloat(f.lon),x={},P=H.places||[];for(const O of P){if(!((u=O.receipt)!=null&&u.address)&&!O.address)continue;const V=((y=O.receipt)==null?void 0:y.address)||O.address;if(_.current[V]){const{lat:G,lon:te}=_.current[V];x[O.id]=+d(g,w,G,te).toFixed(1)}else{const G=await Ss(V);G!=null&&G.lat&&(G!=null&&G.lon)&&(_.current[V]={lat:parseFloat(G.lat),lon:parseFloat(G.lon)},x[O.id]=+d(g,w,parseFloat(G.lat),parseFloat(G.lon)).toFixed(1))}}en(x),ne(`'${Ne.name}' 기준으로 내 장소 거리를 업데이트했습니다.`)}catch(f){console.error(f)}})()},[Ne==null?void 0:Ne.id,Ne==null?void 0:Ne.address,H.places]);const D=c=>{const u=Number(c);return!Number.isFinite(u)||u<=0?"미계산":`${u}km`},F=(c=[])=>{const u=(Array.isArray(c)?c:[]).map(y=>String(y||"").trim().toLowerCase());return u.includes("rest")||u.includes("휴식")},K=(c=[])=>{const u=(Array.isArray(c)?c:[]).map(y=>String(y||"").trim().toLowerCase());return u.includes("lodge")&&!F(u)},Oe=(c="",u="")=>{const y=`${String(c||"").trim()} ${String(u||"").trim()}`.trim();y&&window.open(`https://map.naver.com/v5/search/${encodeURIComponent(y)}`,"_blank","noopener,noreferrer")},it=(c="",u="",y="",f="")=>{const g=`${String(c||"").trim()} ${String(u||"").trim()} ${String(y||"").trim()} ${String(f||"").trim()} 길찾기`.trim();g&&window.open(`https://map.naver.com/v5/search/${encodeURIComponent(g)}`,"_blank","noopener,noreferrer")},ve=(c,u="from")=>{var y,f,g;return c?(y=c.types)!=null&&y.includes("ship")?u==="from"?(c.endAddress||c.endPoint||"").trim():(((f=c.receipt)==null?void 0:f.address)||c.startPoint||"").trim():(((g=c.receipt)==null?void 0:g.address)||c.address||"").trim():""},ft=async c=>{const u=String(c||"").trim();if(!u)return null;if(_.current[u])return _.current[u];try{const f=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(u)}&format=json&limit=1`)).json();if(!Array.isArray(f)||f.length===0)return null;const g={lat:parseFloat(f[0].lat),lon:parseFloat(f[0].lon)};return _.current[u]=g,g}catch{return null}},Ee=c=>JSON.parse(JSON.stringify(c)),Lt=(c={})=>{const u=c.receipt?Ee(c.receipt):{address:c.address||"",items:Ee(c.items||[])};return Array.isArray(u.items)||(u.items=[]),{activity:c.activity||c.name||"새로운 플랜",price:Number(c.price||0),memo:c.memo||"",revisit:typeof c.revisit=="boolean"?c.revisit:!1,business:Ge(c.business||{}),types:Array.isArray(c.types)&&c.types.length?Ee(c.types):["place"],duration:Number(c.duration||60),receipt:u}},Ct=(c={})=>Lt({activity:c.activity,price:c.price,memo:c.memo,revisit:typeof c.revisit=="boolean"?c.revisit:pn(c),business:Ge(c.business||{}),types:c.types,duration:c.duration,receipt:c.receipt||{address:c.address||"",items:[]}}),qr=(c={})=>Lt({activity:c.name,price:c.price,memo:c.memo,revisit:typeof c.revisit=="boolean"?c.revisit:!1,business:Ge(c.business||{}),types:c.types,duration:c.duration||60,receipt:c.receipt||{address:c.address||"",items:[]}}),Hr=c=>Math.round(c/Qo*Jo),ie=c=>{if(!c||typeof c!="string")return 0;const u=c.split(":");if(u.length<2)return 0;const y=parseInt(u[0],10),f=parseInt(u[1],10);return y===24&&f===0?1440:(isNaN(y)?0:y)*60+(isNaN(f)?0:f)},Pt=c=>{if(typeof c!="number"||isNaN(c))return"00:00";let u=Math.floor(c/60);const y=c%60;return u>=24&&(u=u%24),u<0&&(u=24+u%24),`${String(u).padStart(2,"0")}:${String(y).padStart(2,"0")}`},au=c=>{if(!je)return null;const u=new Date(je);return Number.isNaN(u.getTime())?null:(u.setDate(u.getDate()+c),["sun","mon","tue","wed","thu","fri","sat"][u.getDay()])},lu=c=>{if(!je)return{primary:"날짜 미설정",secondary:""};const u=new Date(je);if(Number.isNaN(u.getTime()))return{primary:"날짜 미설정",secondary:""};u.setDate(u.getDate()+((c||1)-1));const y=u.getFullYear(),f=String(u.getMonth()+1).padStart(2,"0"),g=String(u.getDate()).padStart(2,"0"),w=["일","월","화","수","목","금","토"][u.getDay()];return{primary:`${y}.${f}.${g}`,secondary:`${w}요일`}},cu=(c,u)=>{var P;const y=Ge((c==null?void 0:c.business)||{});if(!(y.open||y.close||y.breakStart||y.breakEnd||y.lastOrder||y.entryClose||y.closedDays.length))return"";const g=ie((c==null?void 0:c.time)||"00:00"),w=g+((c==null?void 0:c.duration)||60);if(y.open&&g<ie(y.open))return`운영 시작 전 방문 (${y.open} 이후 권장)`;if(y.close&&g>=ie(y.close))return`운영 종료 후 방문 (${y.close} 이전 권장)`;if(y.lastOrder&&g>ie(y.lastOrder))return`라스트오더 이후 방문 (${y.lastOrder} 이전 권장)`;if(y.entryClose&&g>ie(y.entryClose))return`입장 마감 이후 방문 (${y.entryClose} 이전 권장)`;if(y.breakStart&&y.breakEnd){const O=ie(y.breakStart),V=ie(y.breakEnd);if(g<V&&w>O)return`브레이크 타임 겹침 (${y.breakStart}-${y.breakEnd})`}const x=au(u);return x&&y.closedDays.includes(x)?`${((P=lo.find(V=>V.value===x))==null?void 0:P.label)||x}요일 휴무일 방문`:""},sm=(c,u)=>{He();let y=!1;ae(f=>{var V,G,te;const g=JSON.parse(JSON.stringify(f)),w=(te=(G=(V=g.days)==null?void 0:V[c])==null?void 0:G.plan)==null?void 0:te[u];if(!w)return f;const x=Ge(w.business||{});if(!x.open)return f;const P=ie(w.time||"00:00"),O=ie(x.open);return P>=O?f:(w.time=x.open,w.isTimeFixed=!0,g.days[c].plan=Ue(g.days[c].plan),Wi(g.days),y=!0,g)}),ne(y?"운영 시작 시간으로 일정을 보정했습니다.":"보정할 운영 시작 전 경고가 없습니다.")},uu=(c,u,y)=>{var G,te;if(!(c!=null&&c.business))return"";const f=Ge(c.business||{});if(!(f.open||f.close||f.breakStart||f.breakEnd||f.lastOrder||f.entryClose||f.closedDays.length))return"";const w=(G=H.days)==null?void 0:G[u];if(!w)return"";const x=w.plan[y],P=w.plan[y+1],O=x?ie(x.time||"00:00")+(x.duration||60):P?ie(P.time||"00:00"):0,V=au(u);if(V&&f.closedDays.includes(V))return`${((te=lo.find(de=>de.value===V))==null?void 0:te.label)||V} 휴무`;if(f.open&&O<ie(f.open))return`영업 전 (${f.open}~)`;if(f.close&&O>=ie(f.close))return"영업 종료";if(f.lastOrder&&O>ie(f.lastOrder))return"라스트오더 이후";if(f.entryClose&&O>ie(f.entryClose))return"입장 마감 이후";if(f.breakStart&&f.breakEnd){const le=ie(f.breakStart),de=ie(f.breakEnd);if(O>=le&&O<de)return`브레이크 (${f.breakStart}~${f.breakEnd})`}return""},vl=()=>{var w,x,P,O;const c=["sun","mon","tue","wed","thu","fri","sat"];for(let V=0;V<(((w=H.days)==null?void 0:w.length)||0);V++){const te=(x=H.days[V].plan)==null?void 0:x.find(le=>le.id===gs&&le.time);if(te){let le=c[new Date().getDay()];if(je){const de=new Date(je);de.setDate(de.getDate()+V),le=c[de.getDay()]}return{refMins:ie(te.time),todayKey:le,refTime:te.time}}}const u=(P=H.days)==null?void 0:P.find(V=>V.day===Qt),y=(O=u==null?void 0:u.plan)==null?void 0:O.find(V=>V.type!=="backup"&&V.time);let f=c[new Date().getDay()];if(je&&u){const V=new Date(je);V.setDate(V.getDate()+(u.day-1)),f=c[V.getDay()]}return{refMins:y?ie(y.time):new Date().getHours()*60+new Date().getMinutes(),todayKey:f,refTime:(y==null?void 0:y.time)||null}},rm=c=>{var w;const u=Ge(c||{});if(!(u.open||u.close||u.breakStart||u.breakEnd||u.lastOrder||u.entryClose||u.closedDays.length))return"";const{refMins:f,todayKey:g}=vl();if(u.closedDays.includes(g))return`${((w=lo.find(P=>P.value===g))==null?void 0:w.label)||g} 휴무일`;if(u.open&&f<ie(u.open))return`영업 전 (${u.open} 오픈)`;if(u.close&&f>=ie(u.close))return`영업 종료 (${u.close} 마감)`;if(u.lastOrder&&f>ie(u.lastOrder))return`라스트오더 이후 (${u.lastOrder})`;if(u.entryClose&&f>ie(u.entryClose))return`입장 마감 이후 (${u.entryClose})`;if(u.breakStart&&u.breakEnd){const x=ie(u.breakStart),P=ie(u.breakEnd);if(f>=x&&f<P)return`브레이크 타임 (${u.breakStart}~${u.breakEnd})`}return""},Xo=c=>{const u=Ge(c||{}),y=[];if((u.open||u.close)&&y.push(`영업 ${u.open||"--:--"}~${u.close||"--:--"}`),(u.breakStart||u.breakEnd)&&y.push(`브레이크 ${u.breakStart||"--:--"}~${u.breakEnd||"--:--"}`),u.lastOrder&&y.push(`라스트오더 ${u.lastOrder}`),u.entryClose&&y.push(`입장마감 ${u.entryClose}`),u.closedDays.length){const f=u.closedDays.map(g=>{var w;return((w=lo.find(x=>x.value===g))==null?void 0:w.label)||g}).join(",");y.push(`휴무 ${f}`)}return y.length?y.join(" · "):"미설정"},He=()=>{Wn(c=>{try{return[...c,JSON.parse(JSON.stringify(H))].slice(-20)}catch{return c}})},Wr=(c="변경 사항이 저장되었습니다.")=>{Cr(c),Nr(!0),Pr.current&&clearTimeout(Pr.current),Pr.current=setTimeout(()=>Nr(!1),3e3)},im=()=>{if(Hn.length===0){ne("되돌릴 작업이 없습니다.");return}const c=Hn[Hn.length-1];Wn(u=>u.slice(0,-1)),ae(c),ne("이전 상태로 복구했습니다.")},Wi=c=>{if(!Array.isArray(c))return c;for(let u=0;u<c.length-1;u++){const y=c[u];if(!(y!=null&&y.plan))continue;const f=y.plan.filter(de=>de.type!=="backup");if(!f.length)continue;const g=f[f.length-1];if(!K(g.types))continue;const w=c[u+1],x=((w==null?void 0:w.plan)||[]).filter(de=>de.type!=="backup");if(!x.length)continue;const P=x[0],O=ie(g.time||"00:00"),V=ie(P.time)-i(P.travelTimeOverride,hn)-i(P.bufferTimeOverride,Xt),G=V<=O?V+1440:V,te=Math.max(30,G-O),le=y.plan.find(de=>de.id===g.id);le&&(le.duration=te)}return c},om=c=>{if(!Array.isArray(c)||c.length===0)return!1;let u=!1;for(let y=0;y<c.length;y++){const f=c[y];if(!(f!=null&&f.plan)||f.plan.length===0)continue;let g=-1;if(f.plan.forEach((x,P)=>{(x==null?void 0:x.type)!=="backup"&&K(x==null?void 0:x.types)&&(g=P)}),g===-1||g>=f.plan.length-1)continue;const w=f.plan.splice(g+1);w.length&&(c[y+1]||c.splice(y+1,0,{day:y+2,plan:[]}),c[y+1].plan=[...w,...c[y+1].plan||[]],u=!0)}return u&&c.forEach((y,f)=>{y.day=f+1,Array.isArray(y.plan)||(y.plan=[])}),u},du=c=>{if(!Array.isArray(c)||c.length===0)return!1;for(const u of c){if(!Array.isArray(u==null?void 0:u.plan)||u.plan.length===0)continue;let y=-1;if(u.plan.forEach((f,g)=>{(f==null?void 0:f.type)!=="backup"&&K(f==null?void 0:f.types)&&(y=g)}),y!==-1&&y<u.plan.length-1)return!0}return!1},Ue=c=>{var f,g,w;if(!Array.isArray(c))return[];let u=0,y=-1;for(let x=0;x<c.length;x++){const P=c[x];if(!P||P.type==="backup")continue;if(y===-1){const ce=P.waitingTime||0;(f=P.types)!=null&&f.includes("ship")&&P.boardTime&&P.sailDuration!=null?u=ie(P.boardTime)+P.sailDuration:u=ie(P.time)+ce+(P.duration||0),y=x;continue}const O=i(P.travelTimeOverride,hn),V=i(P.bufferTimeOverride,Xt),G=P.waitingTime||0,te=u+O+V;if(P._timingConflict=!1,P._timingConflictReason="",P.isTimeFixed){const L=ie(P.time)-G-te;if(L!==0&&y!==-1){const Z=c[y];if(!((g=Z.types)!=null&&g.includes("ship"))&&!Z.isTimeFixed&&!Z.isDurationFixed){const xe=Z.duration||0,$e=Math.max(30,xe+L);Z.duration=$e;const We=$e-xe;u+=We}else P._timingConflict=!0,P._timingConflictReason="고정/잠금 조건으로 시간 보정 불가"}}else{const ce=te+G;P.time=Pt(ce)}const le=ie(P.time),de=P.waitingTime||0;(w=P.types)!=null&&w.includes("ship")&&P.boardTime&&P.sailDuration!=null?u=ie(P.boardTime)+P.sailDuration:u=le+de+(P.duration||0),y=x}return c};$.useEffect(()=>{du(H==null?void 0:H.days)&&ae(c=>{if(!du(c==null?void 0:c.days))return c;const u=JSON.parse(JSON.stringify(c));if(!Array.isArray(u.days))return c;for(;om(u.days););return u.days.forEach(y=>{y.plan=Ue(y.plan||[])}),Wi(u.days),u})},[H==null?void 0:H.days]);const xl=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u],P=ie(x.time);return x.time=Pt(P+y),x.isTimeFixed=!0,g.days[c].plan=Ue(w),Wi(g.days),g}),ne("시작 시간을 조정했습니다.")},Yo=(c,u,y)=>{xl(c,u,y*60)},Zo=(c,u,y)=>{xl(c,u,y)},Gr=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u];return x.duration=Math.max(0,(x.duration||0)+y),g.days[c].plan=Ue(w),g}),ne("소요 시간을 변경했습니다.")},am=(c,u,y)=>{const f=Math.max(0,Number(y)||0);He(),ae(g=>{const w=JSON.parse(JSON.stringify(g)),x=w.days[c].plan,P=x[u];return P.duration=f,w.days[c].plan=Ue(x),w}),ne(`소요 시간을 ${f}분으로 설정했습니다.`)},lm=(c,u)=>{He();let y=!1;ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u];return x.isDurationFixed=!x.isDurationFixed,y=!!x.isDurationFixed,g.days[c].plan=Ue(w),g}),ne(y?"소요시간 잠금이 켜졌습니다.":"소요시간 잠금이 해제되었습니다.")},ea=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u];let P=i(x.travelTimeOverride,hn);return P=Math.max(0,P+y),x.travelTimeOverride=`${P}분`,g.days[c].plan=Ue(w),Wi(g.days),g}),ne("이동 시간을 조정했습니다.")},ws=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u];let P=i(x.bufferTimeOverride,Xt);return P=Math.max(0,P+y),x.bufferTimeOverride=`${P}분`,g.days[c].plan=Ue(w),Wi(g.days),g}),ne("버퍼 시간을 조정했습니다.")},hu=(c,u)=>{He(),ae(y=>{const f=JSON.parse(JSON.stringify(y)),g=f.days[c].plan[u].travelTimeAuto;return f.days[c].plan[u].travelTimeOverride=g||"15분",f.days[c].plan=Ue(f.days[c].plan),f}),ne("이동 시간을 기본값으로 초기화했습니다.")},cm=(c,u)=>{let y="시작 시간 고정이 해제되었습니다.";He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan,x=w[u];return x.isTimeFixed=!x.isTimeFixed,x.isTimeFixed?(y="시작 시간이 고정되었습니다.",g.days[c].plan=Ue(w)):(g.days[c].plan=Ue(w),y="시작 시간 고정이 해제되었습니다."),g}),ne(y)},ta=$.useMemo(()=>{let c=0;return!H||!H.days?{total:0,remaining:Cn}:(H.days.forEach(u=>{var y;(y=u.plan)==null||y.forEach(f=>{f.type!=="backup"&&(c+=Number(f.price||0),f.distance&&(c+=Hr(f.distance)))})}),{total:c,remaining:Cn-c})},[H]),fu=$.useMemo(()=>{const c=[...H.places||[]];return Ne!=null&&Ne.id?c.sort((u,y)=>{const f=Mr[u.id],g=Mr[y.id];return f==null&&g==null?(u.name||"").localeCompare(y.name||"","ko"):f==null?1:g==null?-1:f-g}):c.sort((u,y)=>(u.name||"").localeCompare(y.name||"","ko"))},[H.places,Mr,Ne==null?void 0:Ne.id]);$.useMemo(()=>{const c=(g="")=>String(g).replace(/\s+/g," ").trim().toLowerCase(),u=new Set,y=new Set,f=new Set;return(H.days||[]).forEach(g=>{((g==null?void 0:g.plan)||[]).forEach(w=>{var O;if(!w||w.type==="backup")return;const x=c(w.activity||w.name||""),P=c(((O=w==null?void 0:w.receipt)==null?void 0:O.address)||(w==null?void 0:w.address)||"");x&&u.add(x),P&&y.add(P),(x||P)&&f.add(`${x}|${P}`)})}),{names:u,addresses:y,full:f}},[H.days]);const pu=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[c].plan[u].memo=y,g})},um=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[c].plan[u].business=Ge(y||{}),g})},_l=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u];return w.receipt||(w.receipt={address:"",items:[]}),w.receipt.address=y,g})},wl=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[c].plan[u].activity=y,g})},dm=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u];return w.types=rs(y),g}),ne("태그를 업데이트했습니다.")},Gi=(c,u,y,f,g)=>{He(),ae(w=>{var G;const x=JSON.parse(JSON.stringify(w)),P=x.days[c].plan[u],O=((G=P.receipt)==null?void 0:G.items)||[],V=O[y];return V&&(f==="toggle"?(V.selected=!V.selected,V.selected&&(V.qty||0)===0&&(V.qty=1)):f==="qty"?(V.qty=Math.max(0,(V.qty||0)+g),V.selected=V.qty>0):f==="name"?V.name=g:f==="price"&&(V.price=g===""?0:Number(g)),P.price=O.reduce((te,le)=>te+(le.selected?fn(le):0),0)),x}),ne("메뉴 정보가 저장되었습니다.")},hm=(c,u)=>{He(),ae(y=>{const f=JSON.parse(JSON.stringify(y)),g=f.days[c].plan[u];return g.receipt||(g.receipt={address:"",items:[]}),g.receipt.items||(g.receipt.items=[]),g.receipt.items.push({name:"새 메뉴",price:0,qty:1,selected:!0}),f})},fm=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u];return w.receipt&&w.receipt.items&&(w.receipt.items.splice(y,1),w.price=w.receipt.items.reduce((x,P)=>x+(P.selected?fn(P):0),0)),g})},na=(c,u,y,f)=>{ae(g=>{const w=JSON.parse(JSON.stringify(g));return w.days[c].plan[u][y]=f,w})},mu=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u],x=ie(w.time||"00:00"),P=ie(w.boardTime||Pt(x+60)),O=Math.max(x,P+y);w.boardTime=Pt(O);const V=w.sailDuration??240;return w.duration=O-x+V,g.days[c].plan=Ue(g.days[c].plan),g})},gu=(c,u,y)=>{ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u],x=ie(w.time||"00:00"),P=ie(w.boardTime||Pt(x+60)),O=Math.max(30,(w.sailDuration??240)+y);return w.sailDuration=O,w.duration=P-x+O,g.days[c].plan=Ue(g.days[c].plan),g})},pm=c=>{const u=c.replace(/\D/g,"").slice(0,4);if(!u)return null;let y,f;return u.length<=2?(y=parseInt(u),f=0):(y=parseInt(u.slice(0,u.length-2)),f=parseInt(u.slice(-2))),y=Math.min(23,Math.max(0,y)),f=Math.min(59,Math.max(0,f)),`${String(y).padStart(2,"0")}:${String(f).padStart(2,"0")}`},yu=(c,u,y,f)=>{if(y==="sail"){const w=Math.max(30,parseInt(f,10)||30);ae(x=>{const P=JSON.parse(JSON.stringify(x)),O=P.days[c].plan[u],V=ie(O.time||"00:00"),G=ie(O.boardTime||Pt(V+60));return O.sailDuration=w,O.duration=Math.max(0,G-V)+w,P.days[c].plan=Ue(P.days[c].plan),P}),vs(null);return}const g=pm(f);g&&(ae(w=>{const x=JSON.parse(JSON.stringify(w)),P=x.days[c].plan[u];if(y==="load")P.time=g,P.isTimeFixed=!0;else if(y==="depart"||y==="loadEnd"){P.boardTime=g;const O=ie(P.time||"00:00"),V=ie(g);P.duration=Math.max(0,V-O)+(P.sailDuration??240)}else if(y==="disembark"){const O=ie(P.boardTime||Pt(ie(P.time||"00:00")+60)),V=ie(g);P.sailDuration=Math.max(30,V-O);const G=ie(P.time||"00:00");P.duration=Math.max(0,O-G)+P.sailDuration}return x.days[c].plan=Ue(x.days[c].plan),x}),vs(null))},sa=(c,u,y)=>{const f=y!=null&&y.activity?Lt(y):qr(y||{});He(),ae(g=>{const w=JSON.parse(JSON.stringify(g)),x=w.days[c].plan[u];return x.alternatives||(x.alternatives=[]),x.alternatives.push(f),w}),ne(`'${f.activity}'이(가) 플랜 B로 추가되었습니다.`)},Ki=(c,u,y)=>{const f=Lt(H.days[c].plan[u].alternatives[y]);He(),ae(g=>{var x;const w=JSON.parse(JSON.stringify(g));return w.days[c].plan[u].alternatives.splice(y,1),w.places||(w.places=[]),w.places.push({id:`place_${Date.now()}`,name:f.activity,types:f.types||["place"],revisit:typeof f.revisit=="boolean"?f.revisit:!1,business:Ge(f.business||{}),address:((x=f.receipt)==null?void 0:x.address)||"",price:f.price||0,memo:f.memo||"",receipt:Ee(f.receipt||{address:"",items:[]})}),w}),ne(`'${f.activity}'이(가) 장소 목록으로 이동되었습니다.`)},El=(c,u,y,f,g)=>{He(),ae(w=>{var W,L,Z;const x=JSON.parse(JSON.stringify(w)),P=(L=(W=x.days[y])==null?void 0:W.plan)==null?void 0:L[f],O=(Z=P==null?void 0:P.alternatives)==null?void 0:Z[g];if(!O)return x;const V=Lt(O);P.alternatives.splice(g,1);const G=x.days[c].plan,te=G[u];if(!te)return x;const le=ie(te.time)+(te.duration||0)+(te.waitingTime||0),de=i(te.travelTimeOverride,hn),ce=i(te.bufferTimeOverride,Xt);return G.splice(u+1,0,{id:`item_${Date.now()}`,time:Pt(le+de+ce),activity:V.activity,types:Ee(V.types||["place"]),revisit:typeof V.revisit=="boolean"?V.revisit:!1,business:Ge(V.business||{}),price:Number(V.price||0),duration:Number(V.duration||60),state:"unconfirmed",travelTimeOverride:`${hn}분`,bufferTimeOverride:`${Xt}분`,receipt:Ee(V.receipt||{address:"",items:[]}),memo:V.memo||""}),x.days[c].plan=Ue(G),x}),ne("플랜 B를 일정표에 추가했습니다."),Xs(w=>[...w,{dayIdx:c,targetIdx:u+1}])},Tl=(c,u,y,f,g,w)=>{if(!g&&c===y&&u===f)return;He();let x=null;ae(P=>{var le,de,ce;const O=JSON.parse(JSON.stringify(P)),V=(de=(le=O.days[y])==null?void 0:le.plan)==null?void 0:de[f];if(!V)return O;const G=((ce=V.alternatives)==null?void 0:ce.length)>0;let te;if(G&&w!==void 0&&!g){if(x=V.id,w===0){te=Ee(V),delete te.alternatives,te.id=`item_${Date.now()}`;const[W,...L]=V.alternatives;Object.assign(V,{activity:W.activity,price:W.price,memo:W.memo,revisit:W.revisit,business:W.business,types:W.types,duration:W.duration,receipt:W.receipt,alternatives:L})}else{const W=w-1,L=V.alternatives[W];te={id:`item_${Date.now()}`,time:V.time,duration:L.duration||V.duration,activity:L.activity,price:L.price,memo:L.memo,revisit:L.revisit,business:L.business,types:L.types,receipt:L.receipt,state:V.state,isTimeFixed:V.isTimeFixed},V.alternatives.splice(W,1)}O.days[y].plan=Ue(O.days[y].plan)}else te=Ee(V),te.id=`item_${Date.now()}`,g||(O.days[y].plan.splice(f,1),O.days[y].plan=Ue(O.days[y].plan),c===y&&u>f&&u--);return O.days[c].plan.splice(u+1,0,te),O.days[c].plan=Ue(O.days[c].plan),O}),x&&Lr(P=>{const O={...P};return delete O[x],O}),ne(g?"일정을 복사했습니다.":"일정을 이동했습니다.")},mm=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u];if(!w.alternatives||!w.alternatives[y])return g;const x=Lt(w.alternatives[y]),P=Ct(w);return w.activity=x.activity,w.price=x.price,w.memo=x.memo,w.revisit=typeof x.revisit=="boolean"?x.revisit:!1,w.business=Ge(x.business||{}),w.types=Ee(x.types||["place"]),w.duration=w.duration||60,w.receipt=Ee(x.receipt||{address:"",items:[]}),w.alternatives[y]=P,g.days[c].plan=Ue(g.days[c].plan),g}),Xs(f=>[...f,{dayIdx:c,targetIdx:u},{dayIdx:c,targetIdx:u+1}]),ne("플랜을 교체했습니다.")},gm=(c,u,y)=>{He(),ae(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[c].plan[u];if(!w.alternatives||w.alternatives.length===0)return g;const x=w.alternatives,P=Ct(w),O=Lt(y>0?x[0]:x[x.length-1]);return w.activity=O.activity,w.price=O.price,w.memo=O.memo,w.revisit=typeof O.revisit=="boolean"?O.revisit:!1,w.business=Ge(O.business||{}),w.types=Ee(O.types||["place"]),w.duration=w.duration||60,w.receipt=Ee(O.receipt||{address:"",items:[]}),w.alternatives=y>0?[...x.slice(1),P]:[P,...x.slice(0,-1)],g.days[c].plan=Ue(g.days[c].plan),g}),Xs(f=>[...f,{dayIdx:c,targetIdx:u},{dayIdx:c,targetIdx:u+1}]),ne("플랜을 변경했습니다.")},ym=(c,u,y)=>{var x,P,O,V;const f=(O=(P=(x=H.days)==null?void 0:x[c])==null?void 0:P.plan)==null?void 0:O[u];if(!f)return;const g=(((V=f.alternatives)==null?void 0:V.length)||0)+1,w=Math.max(0,Math.min(g-1,Number(y)||0));if(w===0){Lr(G=>({...G,[f.id]:0})),ms(null);return}mm(c,u,w-1),Lr(G=>({...G,[f.id]:w})),ms(null)},Ji=(c,u)=>{He(),ae(y=>{const f=JSON.parse(JSON.stringify(y));return f.days[c].plan.splice(u,1),f.days[c].plan=Ue(f.days[c].plan),f}),ne("일정이 삭제되었습니다."),Wr("일정이 삭제되었습니다.")},bu=c=>{var u;if(jr(y=>y===c?null:c),Rr!==c){let y=null;for(const f of H.days||[])if(y=(u=f.plan)==null?void 0:u.find(g=>g.id===c),y)break;if(y){const f=ve(y,"to");f?(kn({id:y.id,name:y.activity,address:f}),ne(`'${y.activity}'을(를) 내 장소 거리 계산 기준으로 설정했습니다.`)):(kn({id:y.id,name:y.activity,address:""}),ne(`'${y.activity}'엔 주소 정보가 없어 거리를 계산할 수 없습니다.`))}}},Qi=c=>{const u="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0";switch(c){case"food":return a.jsxs("div",{className:`${u} text-rose-500 bg-red-50 border-red-100`,children:[a.jsx(tm,{size:10})," 식당"]},c);case"cafe":return a.jsxs("div",{className:`${u} text-amber-600 bg-amber-50 border-amber-100`,children:[a.jsx(Qp,{size:10})," 카페"]},c);case"tour":return a.jsxs("div",{className:`${u} text-purple-600 bg-purple-50 border-purple-100`,children:[a.jsx(Jp,{size:10})," 관광"]},c);case"lodge":return a.jsxs("div",{className:`${u} text-indigo-600 bg-indigo-50 border-indigo-100`,children:[a.jsx(hc,{size:10})," 숙소"]},c);case"rest":return a.jsxs("div",{className:`${u} text-cyan-600 bg-cyan-50 border-cyan-100`,children:[a.jsx(Zp,{size:10})," 휴식"]},c);case"ship":return a.jsxs("div",{className:`${u} text-blue-600 bg-blue-50 border-blue-100`,children:[a.jsx(ih,{size:10})," 선박"]},c);case"openrun":return a.jsxs("div",{className:`${u} text-red-500 bg-red-50 border-red-100`,children:[a.jsx(uh,{size:10})," 오픈런"]},c);case"view":return a.jsxs("div",{className:`${u} text-sky-600 bg-sky-50 border-sky-100`,children:[a.jsx(Xp,{size:10})," 뷰맛집"]},c);case"experience":return a.jsxs("div",{className:`${u} text-emerald-600 bg-emerald-50 border-emerald-100`,children:[a.jsx(em,{size:10})," 체험"]},c);case"souvenir":return a.jsxs("div",{className:`${u} text-teal-600 bg-teal-50 border-teal-100`,children:[a.jsx(Yp,{size:10})," 기념품샵"]},c);case"pickup":return a.jsxs("div",{className:`${u} text-orange-500 bg-orange-50 border-orange-100`,children:[a.jsx(ao,{size:10})," 픽업"]},c);case"new":return a.jsx("span",{className:u+" text-emerald-600 bg-emerald-50 border-emerald-200",children:"신규"},"new");case"revisit":return a.jsx("span",{className:u+" text-blue-600 bg-blue-50 border-blue-200",children:"재방문"},"revisit");case"place":return a.jsxs("div",{className:`${u} text-slate-500 bg-slate-100 border-slate-200`,children:[a.jsx(Jr,{size:10})," 장소"]},c);default:return a.jsxs("div",{className:`${u} text-slate-500 bg-slate-100 border-slate-200`,children:["# ",c]},c)}},bm=c=>{if(!Bn.trim())return;const{types:u=["place"],menus:y=[],address:f="",memo:g="",revisit:w=!1,business:x=nm}=c||{};ae(P=>({...P,places:[...P.places||[],{id:`place_${Date.now()}`,name:Bn.trim(),types:rs(u),revisit:!!w,business:Ge(x),address:f.trim(),price:y.reduce((O,V)=>O+(Number(V.price)||0),0),memo:g.trim(),receipt:{address:f.trim(),items:y.map(O=>({...O,qty:1,selected:!0}))}}]})),Ti(""),Fo(["food"]),ut(!1),ne(`'${Bn.trim()}'이(가) 장소 목록에 추가되었습니다.`)},ar=c=>{He(),ae(u=>({...u,places:(u.places||[]).filter(y=>y.id!==c)})),Wr("내 장소가 삭제되었습니다.")},vm=(c,u)=>{ae(y=>({...y,places:(y.places||[]).map(f=>f.id===c?{...f,...u}:f)}))},vu=(c,u)=>{var f,g,w;const y=(w=(g=(f=H.days)==null?void 0:f[c])==null?void 0:g.plan)==null?void 0:w[u];y&&(He(),ae(x=>{var O;const P=JSON.parse(JSON.stringify(x));return P.places||(P.places=[]),P.places.push({id:`place_${Date.now()}`,name:y.activity,types:y.types||["place"],revisit:typeof y.revisit=="boolean"?y.revisit:pn(y),business:Ge(y.business||{}),address:((O=y.receipt)==null?void 0:O.address)||"",price:y.price||0,memo:y.memo||"",receipt:Ee(y.receipt||{items:[]})}),P}),ne(`'${y.activity}' 일정을 내 장소로 복제했습니다.`))},xu=(c,u,y)=>{var g,w,x,P,O;const f=Lt((O=(P=(x=(w=(g=H.days)==null?void 0:g[c])==null?void 0:w.plan)==null?void 0:x[u])==null?void 0:P.alternatives)==null?void 0:O[y]);f&&(He(),ae(V=>{var te;const G=JSON.parse(JSON.stringify(V));return G.places||(G.places=[]),G.places.push({id:`place_${Date.now()}`,name:f.activity,types:f.types||["place"],revisit:typeof f.revisit=="boolean"?f.revisit:!1,business:Ge(f.business||{}),address:((te=f.receipt)==null?void 0:te.address)||"",price:f.price||0,memo:f.memo||"",receipt:Ee(f.receipt||{address:"",items:[]})}),G}),ne(`'${f.activity}' 플랜 B를 내 장소로 복제했습니다.`))},Xi=(c,u)=>{var f,g,w;const y=(w=(g=(f=H.days)==null?void 0:f[c])==null?void 0:g.plan)==null?void 0:w[u];y&&(He(),ae(x=>{var O;const P=JSON.parse(JSON.stringify(x));return P.days[c].plan.splice(u,1),P.days[c].plan=Ue(P.days[c].plan),P.places||(P.places=[]),P.places.push({id:`place_${Date.now()}`,name:y.activity,types:y.types||["place"],revisit:typeof y.revisit=="boolean"?y.revisit:pn(y),business:Ge(y.business||{}),address:((O=y.receipt)==null?void 0:O.address)||"",price:y.price||0,memo:y.memo||"",receipt:Ee(y.receipt||{address:"",items:[]})}),P}),ne(`'${y.activity}' 일정이 내 장소로 이동되었습니다.`))},_u=(c=0,u=null)=>{He(),ae(y=>{const f=JSON.parse(JSON.stringify(y));(!Array.isArray(f.days)||f.days.length===0)&&(f.days=[{day:1,plan:[]}]),f.days[c]||(f.days[c]={day:c+1,plan:[]}),Array.isArray(f.days[c].plan)||(f.days[c].plan=[]);const g=u!=null&&u.receipt?Ee(u.receipt):{address:(u==null?void 0:u.address)||"",items:[]},w=Array.isArray(g.items)?g.items.reduce((x,P)=>x+(P.selected===!1?0:fn(P)),0):0;return f.days[c].plan.push({id:`item_${Date.now()}`,time:"09:00",activity:(u==null?void 0:u.name)||"새 일정",types:(u==null?void 0:u.types)||["place"],revisit:typeof(u==null?void 0:u.revisit)=="boolean"?u.revisit:!1,business:Ge((u==null?void 0:u.business)||{}),price:u&&(w||u.price)||0,duration:60,state:"unconfirmed",travelTimeOverride:"15분",bufferTimeOverride:"10분",receipt:g,memo:(u==null?void 0:u.memo)||""}),f.days[c].plan=Ue(f.days[c].plan),f}),ne(u?`'${u.name}'이(가) 첫 일정으로 추가되었습니다.`:"첫 일정이 추가되었습니다.")},Il=(c,u,y=["place"],f=null)=>{He(),ae(g=>{var W;const w=JSON.parse(JSON.stringify(g)),x=w.days[c].plan,P=x[u],O=ie(P.time)+(P.duration||0)+(P.waitingTime||0),V=i(P.travelTimeOverride,hn),G=i(P.bufferTimeOverride,Xt),te=Pt(O+V+G),le=((W=y1.find(L=>{var Z;return L.types[0]===(((Z=f==null?void 0:f.types)==null?void 0:Z[0])||y[0])}))==null?void 0:W.label)||"장소",de=f!=null&&f.receipt?Ee(f.receipt):{address:(f==null?void 0:f.address)||"주소 미정",items:[]},ce=Array.isArray(de.items)?de.items.reduce((L,Z)=>L+(Z.selected===!1?0:fn(Z)),0):0;return x.splice(u+1,0,{id:`item_${Date.now()}`,time:te,activity:(f==null?void 0:f.name)||`새 ${le}`,types:(f==null?void 0:f.types)||y,revisit:typeof(f==null?void 0:f.revisit)=="boolean"?f.revisit:!1,business:Ge((f==null?void 0:f.business)||{}),price:f&&(ce||f.price)||0,duration:60,state:"unconfirmed",travelTimeOverride:"15분",bufferTimeOverride:"10분",receipt:de,memo:(f==null?void 0:f.memo)||""}),w.days[c].plan=Ue(x),w}),ne(f?`'${f.name}'이(가) 일정에 추가되었습니다.`:"새 일정이 추가되었습니다."),Xs(g=>[...g,{dayIdx:c,targetIdx:u+1}])},xm=async({fromAddress:c,toAddress:u,fromName:y,toName:f})=>{const g=await fetch("/api/route-verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromAddress:c,toAddress:u,fromName:y,toName:f,region:ze})});if(!g.ok){const x=await g.text().catch(()=>"");throw new Error(`kakao verify failed: ${g.status} ${x.slice(0,140)}`)}const w=await g.json();if(!Number.isFinite(Number(w==null?void 0:w.distanceKm))||!Number.isFinite(Number(w==null?void 0:w.durationMins)))throw new Error("kakao verify invalid payload");return{distance:+Number(w.distanceKm).toFixed(1),durationMins:Math.max(1,Math.round(Number(w.durationMins))),provider:w.provider||"kakao",review:w.review||null}},Yi=async(c,u,y={})=>{const f=!!y.silent,g=!!y.forceRefresh;let w;if(u===0&&c>0){const G=H.days[c-1].plan;w=G[G.length-1]}else w=H.days[c].plan[u-1];const x=H.days[c].plan[u],P=ve(w,"from"),O=ve(x,"to");if(!P||!O||P.includes("없음")||O.includes("없음")){f||ne("두 장소의 올바른 주소가 필요합니다.");return}const V=`${P}|${O}`;if(!g&&Jn[V]&&!Jn[V].failed){const G=Jn[V],te=Math.max(.1,Number(G.distance)||.1),le=m({distanceKm:te,straightKm:te,rawDurationMins:Number(G.durationMins)||1,isSameAddress:P.trim()===O.trim()}),de={distance:te,durationMins:le};de.durationMins!==G.durationMins&&zt(ce=>({...ce,[V]:de})),Al(c,u,de);return}Pi(`${c}_${u}`),f||ne("경로와 거리를 자동 계산 중입니다...");try{try{const W=await xm({fromAddress:P,toAddress:O,fromName:(w==null?void 0:w.activity)||"",toName:(x==null?void 0:x.activity)||""});zt(L=>({...L,[V]:W})),Al(c,u,W),f||ne(`카카오 검수 경로: ${W.distance}km, ${W.durationMins}분`);return}catch{f||ne("카카오 검수 경로 실패, 대체 경로로 재시도합니다.")}const G=async(W,L="")=>{const Z=[String(W||"").trim(),String(W||"").split(/[,\(]/)[0].trim(),String(W||"").replace(/제주특별자치도/g,"제주").trim(),String(W||"").replace(/특별자치도/g,"").trim(),`${ze} ${String(L||"").trim()}`.trim(),String(L||"").trim()].filter(Boolean);for(const xe of Z){const $e=xe.split(/\s+/).slice(0,8).join(" "),xt=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent($e)}&format=json&limit=1`)).json();if(xt&&xt.length>0)return{lat:xt[0].lat,lon:xt[0].lon}}return null},te=await G(P,w==null?void 0:w.activity);if(!te)throw new Error("출발지 좌표를 찾지 못했습니다.");await new Promise(W=>setTimeout(W,1e3));const le=await G(O,x==null?void 0:x.activity);if(!le)throw new Error("도착지 좌표를 찾지 못했습니다.");const ce=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${te.lon},${te.lat};${le.lon},${le.lat}?overview=false`)).json();if(ce&&ce.routes&&ce.routes.length>0){const W=ce.routes[0].distance/1e3,L=Math.ceil(ce.routes[0].duration/60),Z=d(parseFloat(te.lat),parseFloat(te.lon),parseFloat(le.lat),parseFloat(le.lon)),xe=P.trim()===O.trim();if(!xe&&W<.05&&Z>.3)throw new Error("osrm suspicious near-zero route");const We=W,xt=m({distanceKm:We,straightKm:Z,rawDurationMins:L,isSameAddress:xe}),Rt={distance:+We.toFixed(1),durationMins:xt};zt(Yt=>({...Yt,[V]:Rt})),Al(c,u,Rt),f||ne(`대체경로 확인: ${Rt.distance}km, ${Rt.durationMins}분`)}else throw new Error("osrm route unavailable")}catch(G){console.error(G),zt(te=>({...te,[V]:{failed:!0}})),f||ne("자동차 경로 계산 실패: 주소 확인 후 다시 시도해주세요.")}finally{Pi(null)}};$.useEffect(()=>{if(!Si.length)return;const c=Si[0];Xs(y=>y.slice(1)),(async()=>{var f,g,w;await Yi(c.dayIdx,c.targetIdx,{silent:!0}),!!((w=(g=(f=H.days)==null?void 0:f[c.dayIdx])==null?void 0:g.plan)!=null&&w[c.targetIdx+1])&&await Yi(c.dayIdx,c.targetIdx+1,{silent:!0})})()},[H,Si]);const _m=async()=>{var u;Sn(!0),ji(0),zt({}),ne("전체 경로 내역을 지우고 재탐색 시작...");const c=[];for(let y=0;y<H.days.length;y++){const f=H.days[y].plan||[];for(let g=0;g<f.length;g++)f[g].type==="backup"||(u=f[g].types)!=null&&u.includes("ship")||c.push({dayIdx:y,pIdx:g})}if(c.length===0){Sn(!1),ne("재탐색할 경로가 없습니다.");return}for(let y=0;y<c.length;y++){const f=c[y];await Yi(f.dayIdx,f.pIdx,{forceRefresh:!0}),ji(Math.round((y+1)/c.length*100)),await new Promise(g=>setTimeout(g,350))}ji(100),Sn(!1),ne("전체 경로 재탐색 완료!")},Al=(c,u,{distance:y,durationMins:f})=>{He(),ae(g=>{const w=JSON.parse(JSON.stringify(g)),x=w.days[c].plan[u];return x.distance=y,x.travelTimeOverride=`${f}분`,x.travelTimeAuto=`${f}분`,w.days[c].plan=Ue(w.days[c].plan),w})};if($.useEffect(()=>{if(!n||b||!H||!H.days||H.days.length===0||Le)return;if(n.isGuest){fa("guest_itinerary",JSON.stringify(H));return}const c=setTimeout(()=>{const u={...H,tripRegion:ze,tripStartDate:je,tripEndDate:ht,planTitle:H.planTitle||`${ze||"여행"} 일정`,planCode:H.planCode||dn(ze||"여행",je||""),share:tn(H.share||rt),updatedAt:Date.now()};no(Zn(Rn,"users",n.uid,"itinerary",M||"main"),u).catch(y=>console.error("Firestore 저장 실패:",y))},1e3);return()=>clearTimeout(c)},[H,b,n,M,ze,je,ht,Le,rt]),$.useEffect(()=>{n&&(async()=>{if(v(!0),Gt(!1),n.isGuest)try{const y=ha("guest_itinerary",""),f=y?JSON.parse(y):null;if(f&&Array.isArray(f.days)){ae(f),v(!1);return}}catch(y){console.warn("게스트 로컬 데이터 로드 실패:",y)}try{if(Ve!=null&&Ve.ownerId&&Ve.ownerId!==n.uid){const w=await ua(Zn(Rn,"users",Ve.ownerId,"itinerary",Ve.planId||"main"));if(w.exists()){const x=w.data(),P=tn(x.share||{});if(P.visibility==="private"){ne("공유가 비공개라 접근할 수 없습니다."),v(!1);return}const O=(x.days||[]).map(V=>({...V,plan:(V.plan||[]).map(G=>({...G}))}));ae({days:O,places:x.places||[],maxBudget:x.maxBudget||15e5,share:P,planTitle:x.planTitle||`${x.tripRegion||"공유"} 일정`,planCode:x.planCode||dn(x.tripRegion||"공유",x.tripStartDate||"")}),Ye(P),x.tripRegion&&Js(x.tripRegion),typeof x.tripStartDate=="string"&&qn(x.tripStartDate),typeof x.tripEndDate=="string"&&Zt(x.tripEndDate),z(Ve.planId||"main"),Gt(P.permission!=="editor"),v(!1);return}}const y=M||"main",f=await ua(Zn(Rn,"users",n.uid,"itinerary",y));let g=null;if(f.exists())g=f.data();else if(y==="main"){const w=await ua(Zn(Rn,"itinerary","main"));w.exists()&&(g=w.data(),await no(Zn(Rn,"users",n.uid,"itinerary","main"),g),console.log("기존 데이터를 내 계정으로 성공적으로 가져왔습니다."))}else g=Ui(tt||ze||"새 여행지"),await no(Zn(Rn,"users",n.uid,"itinerary",y),g);if(g&&Array.isArray(g.days)){const w=g.days.map(x=>({...x,plan:(x.plan||[]).map(P=>{var V,G;let O={...P};if((V=O.types)!=null&&V.includes("ship")){const te=x.day===1?"목포항":"제주항",le=x.day===1?"제주항":"목포항";O.startPoint=O.startPoint||te,O.endPoint=O.endPoint||le}return(G=O.receipt)!=null&&G.items&&(O.price=O.receipt.items.reduce((te,le)=>te+(le.selected?fn(le):0),0)),O})}));ae({days:w,places:g.places||[],maxBudget:g.maxBudget||15e5,share:tn(g.share||{}),planTitle:g.planTitle||`${g.tripRegion||ze||"여행"} 일정`,planCode:g.planCode||dn(g.tripRegion||ze||"여행",g.tripStartDate||"")}),Ye(tn(g.share||{})),g.tripRegion&&Js(g.tripRegion),typeof g.tripStartDate=="string"&&qn(g.tripStartDate),typeof g.tripEndDate=="string"&&Zt(g.tripEndDate),n.isGuest||await Bt(n.uid),v(!1);return}}catch(y){console.error("Firestore 로드/마이그레이션 실패:",y)}const u={days:[{day:1,plan:[{id:"d1_s1",time:"01:00",activity:"퀸 제누비아 2호",types:["ship"],startPoint:"목포항",endPoint:"제주항",price:31e4,duration:300,state:"confirmed",isTimeFixed:!0,receipt:{address:"전남 목포시 해안로 148",shipDetails:{depart:"01:00",loading:"22:30 ~ 00:00"},items:[{name:"차량 선적",price:16e4,qty:1,selected:!0},{name:"주니어룸 (3인)",price:15e4,qty:1,selected:!0}]}},{id:"d1_p1",time:"06:30",activity:"진아떡집",types:["food","pickup"],price:24e3,duration:15,state:"confirmed",distance:2,travelTimeOverride:"5분",receipt:{address:"제주 제주시 동문로4길 7-1",items:[{name:"오메기떡 8알팩",price:12e3,qty:2,selected:!0}]},memo:"오메기떡 픽업 필수!"},{id:"d1_c1",time:"06:50",activity:"카페 듀포레",types:["cafe","view"],price:38500,duration:145,state:"confirmed",distance:8,receipt:{address:"제주시 서해안로 579",items:[{name:"아메리카노",price:6500,qty:2,selected:!0},{name:"비행기 팡도르",price:12500,qty:1,selected:!0},{name:"크로와상",price:13e3,qty:1,selected:!0}]},memo:"비행기 이착륙 뷰 맛집"},{id:"d1_f1",time:"09:30",activity:"말고기연구소",types:["food","openrun"],price:36e3,duration:60,state:"confirmed",distance:3,isTimeFixed:!0,receipt:{address:"제주시 북성로 43",items:[{name:"말육회 부각초밥",price:12e3,qty:3,selected:!0}]},memo:"10:00 영업 시작"},{id:"d1_c2",time:"12:30",activity:"만다리노카페 & 승마",types:["cafe","experience"],price:26e3,duration:120,state:"confirmed",distance:18,receipt:{address:"조천읍 함와로 585",items:[{name:"만다리노 라떼",price:8e3,qty:2,selected:!0},{name:"승마 체험",price:1e4,qty:1,selected:!0},{name:"귤 따기 체험",price:1e4,qty:1,selected:!1}]},memo:"승마 및 귤 체험 가능"},{id:"d1_t1",time:"15:00",activity:"함덕잠수함",types:["tour"],price:79e3,duration:90,state:"confirmed",distance:10,receipt:{address:"조천읍 조함해안로 378",items:[{name:"입장권",price:28e3,qty:2,selected:!0}]},memo:"사전 예약 확인 필요"},{id:"d1_f2",time:"18:30",activity:"존맛식당",types:["food"],price:69e3,duration:90,state:"confirmed",distance:2,receipt:{address:"제주시 조천읍 신북로 493",items:[{name:"문어철판볶음",price:39e3,qty:1,selected:!0}]},memo:"저녁 웨이팅 있을 수 있음"}]},{day:2,plan:[{id:"d2_c1",time:"09:00",activity:"델문도",types:["cafe","view"],price:42500,duration:60,state:"confirmed",distance:2,receipt:{address:"함덕 조함해안로 519-10",items:[{name:"문도샌드",price:12e3,qty:1,selected:!0}]}},{id:"d2_f1",time:"11:00",activity:"존맛식당",types:["food"],price:69e3,duration:90,state:"confirmed",distance:1,receipt:{address:"조천읍 신북로 493",items:[{name:"재방문",price:69e3,qty:1,selected:!0}]}},{id:"d2_l1",time:"20:00",activity:"통나무파크",types:["lodge"],price:1e5,duration:600,state:"confirmed",distance:45,receipt:{address:"애월읍 도치돌길 303",items:[{name:"숙박비",price:1e5,qty:1,selected:!0}]}}]},{day:3,plan:[{id:"d3_t1",time:"09:00",activity:"도치돌알파카",types:["tour","experience"],price:21e3,duration:120,state:"confirmed",distance:0,travelTimeOverride:"30분",receipt:{address:"애월읍 도치돌길 303",items:[{name:"입장권",price:7e3,qty:3,selected:!0}]}},{id:"d3_s1",time:"15:15",activity:"퀸 제누비아 2호",types:["ship"],startPoint:"제주항",endPoint:"목포항",price:26e4,duration:300,state:"confirmed",distance:25,isTimeFixed:!0,receipt:{address:"제주항",shipDetails:{depart:"16:45",loading:"14:45 ~ 15:45"},items:[{name:"차량 선적",price:16e4,qty:1,selected:!0},{name:"이코노미 인원권",price:1e5,qty:1,selected:!0}]},memo:"동승자 하차 후 차량 선적 (셔틀 이동) / 16:45 출항"}]}]}.days.map(y=>({...y,plan:Ue(y.plan)}));ae({days:u,places:[]}),n.isGuest||await Bt(n.uid),v(!1)})()},[n,M,Bt,Ve]),t)return a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4",children:[a.jsx("div",{className:"w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin"}),a.jsx("div",{className:"font-black text-slate-400 text-sm animate-pulse",children:"본인 인증 확인 중..."})]});if(!n&&!(Ve!=null&&Ve.ownerId))return a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden",children:[a.jsx("div",{className:"absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse"}),a.jsx("div",{className:"absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse",style:{animationDelay:"1s"}}),a.jsxs("div",{className:"bg-white/80 backdrop-blur-2xl border border-white p-12 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] max-w-[480px] w-full text-center flex flex-col gap-8 z-10",children:[a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-[#3182F6] to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-110 transition-transform",children:a.jsx(ah,{size:32,className:"text-white fill-white/20"})}),a.jsxs("h1",{className:"text-[32px] font-black tracking-tight text-slate-800 leading-tight",children:["나만의 여행 계획",a.jsx("br",{}),a.jsx("span",{className:"text-[#3182F6]",children:"Anti Planer"})]}),a.jsxs("p",{className:"text-slate-500 font-bold text-[15px] leading-relaxed",children:["복잡한 여행 계획은 잊으세요.",a.jsx("br",{}),"당신에게 최적화된 동선을 만들어 드립니다."]})]}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsxs("button",{onClick:l,className:"group relative flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#3182F6] hover:bg-blue-50/50 px-8 py-4.5 rounded-[24px] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95",children:[a.jsx("img",{src:"https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",alt:"Google",className:"w-6 h-6"}),a.jsx("span",{className:"text-[17px] font-black text-slate-700 group-hover:text-[#3182F6]",children:"Google 계정으로 시작하기"})]}),a.jsxs("div",{className:"flex items-center gap-3 py-2",children:[a.jsx("div",{className:"flex-1 h-px bg-slate-100"}),a.jsx("span",{className:"text-[10px] font-black text-slate-300 uppercase tracking-widest",children:"or"}),a.jsx("div",{className:"flex-1 h-px bg-slate-100"})]}),a.jsx("button",{onClick:h,className:"text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-2",children:"로그인 없이 일단 둘러보기 (로컬 전용)"})]}),a.jsx("p",{className:"text-[12px] font-bold text-slate-400 tracking-wide",children:"로그인 시 개인별 맞춤 일정을 저장하고 불러올 수 있습니다."}),r&&a.jsx("div",{className:"text-left text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 whitespace-pre-wrap",children:r})]})]});if(!H)return null;const kl=!!n&&!n.isGuest&&(!(Ve!=null&&Ve.ownerId)||Ve.ownerId===n.uid)&&!Le;return Vr.current=(c,u)=>{var G,te,le,de,ce,W;const y=Gn.current;if(!y)return;let f=!1;const g=document.elementFromPoint(c,u),w=g==null?void 0:g.closest("[data-droptarget]"),x=g==null?void 0:g.closest("[data-dropitem]"),P=g==null?void 0:g.closest("[data-library-dropzone]"),O=g==null?void 0:g.closest("[data-deletezone]"),V=g==null?void 0:g.closest("[data-drag-action]");if(y.kind==="library"){const L=y.place;if(w){const[Z,xe]=w.dataset.droptarget.split("-").map(Number);Il(Z,xe,L.types,L),ar(L.id),f=!0}else if(x){const[Z,xe]=x.dataset.dropitem.split("-").map(Number);sa(Z,xe,L),ar(L.id),f=!0}}else if(y.kind==="timeline"){const L=y.payload;if(V){const Z=V.getAttribute("data-drag-action");Z==="move_to_library"?(L.altIdx!==void 0?Ki(L.dayIdx,L.pIdx,L.altIdx):Xi(L.dayIdx,L.pIdx),f=!0):Z==="delete"?L.altIdx===void 0&&(Ji(L.dayIdx,L.pIdx),f=!0):Z==="copy_to_library"&&(L.altIdx!==void 0?xu(L.dayIdx,L.pIdx,L.altIdx):vu(L.dayIdx,L.pIdx),f=!0)}else if(P)if(L.altIdx!==void 0)Ki(L.dayIdx,L.pIdx,L.altIdx),f=!0;else{const Z=(le=(te=(G=H.days)==null?void 0:G[L.dayIdx])==null?void 0:te.plan)==null?void 0:le[L.pIdx];Xi(L.dayIdx,L.pIdx,askPlanBMoveMode(Z)),f=!0}else if(O&&L.altIdx===void 0)Ji(L.dayIdx,L.pIdx),f=!0;else if(w){const[Z,xe]=w.dataset.droptarget.split("-").map(Number);L.altIdx!==void 0?(El(Z,xe,L.dayIdx,L.pIdx,L.altIdx),f=!0):(Tl(Z,xe,L.dayIdx,L.pIdx,!1,L.planPos),f=!0)}else if(x&&L.altIdx===void 0){const[Z,xe]=x.dataset.dropitem.split("-").map(Number),$e=(W=(ce=(de=H.days)==null?void 0:de[L.dayIdx])==null?void 0:ce.plan)==null?void 0:W[L.pIdx];$e&&(L.dayIdx!==Z||L.pIdx!==xe)&&(sa(Z,xe,Ct($e)),Ji(L.dayIdx,L.pIdx),f=!0)}}f&&Wr()},a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative",children:[ds&&dt&&a.jsxs("div",{className:"fixed inset-0 z-[200] flex items-center justify-center",onClick:()=>{wn(null),Ze(null)},children:[a.jsx("div",{className:"absolute inset-0 bg-black/30 backdrop-blur-sm"}),a.jsxs("div",{className:"relative bg-white rounded-2xl shadow-2xl w-[440px] max-h-[85vh] overflow-y-auto no-scrollbar",onClick:c=>c.stopPropagation(),children:[a.jsxs("div",{className:"px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10",children:[a.jsx("p",{className:"text-[12px] font-black text-slate-600",children:"장소 수정"}),a.jsx("button",{onClick:()=>{wn(null),Ze(null)},className:"text-slate-300 hover:text-slate-500 p-1",children:"✕"})]}),a.jsxs("div",{className:"p-4 flex flex-col gap-3",children:[a.jsx(fc,{title:"태그",value:dt.types||["place"],onChange:c=>Ze(u=>({...u,types:c}))}),a.jsx("input",{value:dt.name,onChange:c=>Ze(u=>({...u,name:c.target.value})),placeholder:"장소 이름",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-black text-slate-800 outline-none focus:border-[#3182F6]"}),a.jsx("input",{value:dt.address||"",onChange:c=>Ze(u=>({...u,address:c.target.value})),placeholder:"주소",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 outline-none focus:border-[#3182F6]"}),a.jsx("input",{value:dt.memo||"",onChange:c=>Ze(u=>({...u,memo:c.target.value})),placeholder:"메모",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-[#3182F6]"}),a.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3",children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2",children:"메뉴 / 금액"}),(((wu=dt.receipt)==null?void 0:wu.items)||[]).map((c,u)=>a.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5",children:[a.jsx("input",{value:c.name||"",onChange:y=>Ze(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[u]={...g[u],name:y.target.value},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"메뉴명",className:"flex-1 min-w-0 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6]"}),a.jsx("input",{type:"number",value:c.price||0,onChange:y=>Ze(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[u]={...g[u],price:Number(y.target.value)||0},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"가격",className:"w-20 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("input",{type:"number",value:or(c),onChange:y=>Ze(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[u]={...g[u],qty:Math.max(1,Number(y.target.value)||1)},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"수량",className:"w-12 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("button",{type:"button",onClick:()=>Ze(y=>{var g;const f=[...((g=y.receipt)==null?void 0:g.items)||[]];return f.splice(u,1),{...y,receipt:{...y.receipt||{},items:f}}}),className:"text-slate-300 hover:text-red-500 px-1",children:"✕"})]},u)),a.jsx("button",{type:"button",onClick:()=>Ze(c=>{var u;return{...c,receipt:{...c.receipt||{},items:[...((u=c.receipt)==null?void 0:u.items)||[],{name:"",price:0,qty:1,selected:!0}]}}}),className:"w-full py-1.5 border border-dashed border-slate-300 rounded text-[11px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white mt-1",children:"+ 메뉴 추가"})]}),a.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3",children:[a.jsxs("button",{type:"button",onClick:()=>Ze(c=>({...c,showBusinessEditor:!c.showBusinessEditor})),className:"w-full flex items-center justify-between text-left mb-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider",children:"영업 정보"}),!dt.showBusinessEditor&&a.jsx("span",{className:"text-[10px] font-bold text-slate-500 truncate ml-2",children:Xo(dt.business)})]}),dt.showBusinessEditor&&a.jsx("div",{className:"mt-2",children:a.jsx(pc,{business:dt.business||{},onChange:c=>Ze(u=>({...u,business:c}))})})]})]}),a.jsxs("div",{className:"px-4 pb-4 flex gap-2 sticky bottom-0 bg-white pt-2 border-t border-slate-100",children:[a.jsx("button",{onClick:()=>{const c=Ee(dt.receipt||{address:dt.address||"",items:[]});Array.isArray(c.items)||(c.items=[]),c.address=dt.address||c.address||"";const u=c.items.reduce((y,f)=>y+(f.selected===!1?0:fn(f)),0);vm(dt.id,{...dt,business:Ge(dt.business||{}),receipt:c,price:u}),wn(null),Ze(null)},className:"flex-1 py-2 bg-[#3182F6] text-white text-[12px] font-black rounded-xl",children:"저장"}),a.jsx("button",{onClick:()=>{wn(null),Ze(null)},className:"flex-1 py-2 bg-slate-100 text-slate-500 text-[12px] font-black rounded-xl",children:"취소"})]})]})]}),a.jsx("div",{className:"fixed z-[141] top-1/2 transition-all duration-300",style:{left:et?Tt?12:Math.max(8,xs-6):xs,transform:et?"translateY(-50%)":"translateX(-50%) translateY(-50%)"},children:a.jsx("button",{onClick:()=>Kn(c=>!c),className:"w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-sm hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-colors",children:Tt?a.jsx(Ia,{size:11}):a.jsx(Ta,{size:11})})}),a.jsx("div",{className:"fixed z-[150] top-1/2 transition-all duration-300 pointer-events-none",style:{right:et?Nt?12:Math.max(8,Ur-6):Nt?44:310,transform:et?"translateY(-50%)":"translateX(50%) translateY(-50%)"},children:a.jsx("button",{onClick:()=>Zs(c=>!c),className:"w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-lg hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-all hover:scale-110 active:scale-95 group pointer-events-auto",title:Nt?"내 장소 열기":"내 장소 접기",children:Nt?a.jsx(Ta,{size:11,className:"group-hover:-translate-x-0.5 transition-transform"}):a.jsx(Ia,{size:11,className:"group-hover:translate-x-0.5 transition-transform"})})}),a.jsx("div",{className:"flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-[#E5E8EB] z-[140] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden",style:{width:xs},children:Tt?a.jsx("div",{className:"flex-1 flex items-center justify-center",children:a.jsx(Jr,{size:14,className:"text-slate-300"})}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"px-5 pt-5 pb-3 border-b border-slate-100 bg-white shrink-0",children:a.jsxs("div",{className:"flex items-center gap-2.5 flex-1 mb-3",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0",children:a.jsx(Jr,{size:14,className:"text-[#3182F6]"})}),a.jsx("h2",{className:"text-[14px] font-black text-slate-800 tracking-tight flex-1",children:"일정 안내"}),a.jsxs("button",{onClick:_m,disabled:Ri,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3182F6] text-[11px] font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:[a.jsx(ah,{size:11}),Ri?`탐색 ${yl}%`:"전체경로"]})]})}),a.jsx("div",{className:"flex-1 overflow-y-auto overscroll-none no-scrollbar py-6 px-5 flex flex-col",children:a.jsx("nav",{className:"flex flex-col gap-6 relative -ml-2",children:(Eu=H.days)==null?void 0:Eu.map((c,u)=>a.jsxs("div",{className:`rounded-2xl border p-2.5 transition-all ${Qt===c.day?"border-blue-200 bg-blue-50/40":"border-slate-100 bg-white"}`,children:[a.jsx("div",{className:`rounded-xl border px-2.5 py-2 mb-2 ${Qt===c.day?"border-blue-200 bg-white":"border-slate-100 bg-slate-50/70"}`,children:a.jsx("div",{className:`rounded-lg border px-2 py-1.5 ${Qt===c.day?"border-blue-200 bg-blue-50/50":"border-slate-100 bg-white/80"}`,children:a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx("button",{onClick:()=>zo(c.day),className:`text-[14px] tracking-tight transition-colors duration-300 whitespace-nowrap ${Qt===c.day?"text-[#3182F6] font-black":"text-slate-700 font-black hover:text-slate-900"}`,children:lu(c.day).primary}),a.jsx("span",{className:`text-[10px] font-black rounded-md px-1.5 py-0.5 leading-none ${Qt===c.day?"text-[#3182F6] bg-white border border-blue-200":"text-slate-400 bg-slate-50 border border-slate-200"}`,children:lu(c.day).secondary||"요일"})]})})}),a.jsx("div",{className:"mb-1.5"}),a.jsx("div",{className:"flex flex-col gap-0.5",children:(c.plan||[]).filter(y=>y.type!=="backup").map((y,f,g)=>{var P,O,V,G;const w=gs===y.id,x=(P=y.types)!=null&&P.includes("ship")?"":cu(y,u);return a.jsxs("button",{onClick:()=>zo(c.day,y.id),className:`grid grid-cols-[2.2rem_1fr_auto] items-center gap-1 px-1.5 py-1 rounded-lg text-left transition-all ${w?"bg-blue-50":"hover:bg-slate-50"}`,children:[a.jsx("span",{className:`text-[10px] tabular-nums leading-none ${w?"font-black text-[#3182F6]":"font-bold text-slate-400"}`,children:y.time||"--:--"}),a.jsxs("div",{className:"min-w-0 flex items-center gap-1.5",children:[a.jsx("div",{className:`shrink-0 scale-90 origin-left transition-opacity ${w?"opacity-100":"opacity-60"}`,children:Qi(((O=y.types)==null?void 0:O[0])||y.type||"place")}),a.jsx("span",{className:`text-[10px] truncate leading-none ${w?"font-black text-[#3182F6]":"font-bold text-slate-500"}`,children:y.activity}),(((V=y.alternatives)==null?void 0:V.length)||0)>0&&a.jsxs("span",{className:`shrink-0 text-[8px] leading-none px-1.5 py-0.5 rounded border ${w?"text-amber-600 bg-amber-50 border-amber-200":"text-amber-500 bg-amber-50/70 border-amber-200/80"}`,children:["B ",y.alternatives.length]})]}),!((G=y.types)!=null&&G.includes("ship"))&&(()=>{const te=K(y.types)&&f===g.length-1;let le=y.duration;if(te){const de=H.days[u+1],ce=((de==null?void 0:de.plan)||[]).filter(W=>W.type!=="backup");if(ce.length){const W=ce[0],L=ie(y.time||"00:00"),Z=ie(W.time)-i(W.travelTimeOverride,hn)-i(W.bufferTimeOverride,Xt);le=Math.max(30,(Z<=L?Z+1440:Z)-L)}}return le>0?a.jsxs("div",{className:"shrink-0 flex items-center gap-1",children:[x&&a.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-red-400",title:x}),a.jsx("button",{type:"button",onClick:de=>{var ce;de.stopPropagation(),Oe(y.activity,((ce=y.receipt)==null?void 0:ce.address)||y.address||"")},className:`text-[8px] font-black rounded px-1 py-px leading-none whitespace-nowrap ${le>=120?"text-orange-400 bg-orange-50 border border-orange-200 hover:bg-orange-100":"text-slate-300 hover:text-[#3182F6]"}`,title:"네이버 지도에서 장소 검색",children:gh(le)})]}):null})()]},y.id)})})]},c.day))})}),a.jsxs("div",{className:"p-4 border-t border-slate-100 bg-white shrink-0 mt-auto",children:[kl&&a.jsxs("div",{className:"grid grid-cols-2 gap-1.5 mb-2",children:[a.jsx("button",{onClick:()=>oe(!0),className:"px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:"목록보기"}),a.jsx("button",{onClick:()=>N(!0),className:"px-2 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-[10px] font-black text-[#3182F6] hover:bg-blue-100 transition-colors",children:"공유하기"})]}),n?a.jsxs("div",{className:"flex items-center gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100",children:[a.jsx("div",{className:"w-7 h-7 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm",children:n.photoURL?a.jsx("img",{src:n.photoURL,alt:"User"}):a.jsx("div",{className:"w-full h-full bg-slate-200 flex items-center justify-center",children:a.jsx(h1,{size:12,className:"text-slate-400"})})}),a.jsx("div",{className:"flex flex-col min-w-0 flex-1",children:a.jsx("span",{className:"text-[11px] font-black text-slate-700 truncate",children:n.displayName||"사용자"})}),n.isGuest?a.jsx("button",{onClick:l,className:"px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors",title:"로그인",children:"로그인"}):a.jsx("button",{onClick:p,className:"p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all",title:"로그아웃",children:a.jsx(W_,{size:12})})]}):a.jsxs("div",{className:"flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100",children:[a.jsx("span",{className:"text-[10px] font-black text-slate-500",children:"공유 보기 모드"}),a.jsx("button",{onClick:l,className:"px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors",title:"로그인",children:"로그인"})]})]})]})}),a.jsx("div",{className:"flex flex-col fixed top-0 bottom-0 bg-white/80 backdrop-blur-3xl border-l border-slate-100/60 z-[140] shadow-[-8px_0_32px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden",style:{right:0,width:Ur},children:Nt?a.jsx("div",{className:"flex-1 flex flex-col items-center justify-center",children:a.jsx(ao,{size:14,className:"text-slate-300"})}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"px-5 pt-6 pb-4 border-b border-slate-100/50 shrink-0",children:a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0",children:a.jsx(ao,{size:14,className:"text-[#3182F6]"})}),a.jsx("p",{className:"text-[14px] font-black text-slate-800 tracking-tight flex-1",children:"내 장소"}),(()=>{const{refTime:c}=vl();return c?a.jsx("span",{className:"text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-wider shrink-0",title:"영업 경고 기준 시각",children:(()=>{var g;const u={sun:"일",mon:"월",tue:"화",wed:"수",thu:"목",fri:"금",sat:"토"},{todayKey:y}=vl(),f=u[y]||"";if(je){const w=(g=H.days)==null?void 0:g.find(x=>x.day===Qt);if(w){const x=new Date(je);x.setDate(x.getDate()+(w.day-1));const P=String(x.getMonth()+1).padStart(2,"0"),O=String(x.getDate()).padStart(2,"0");return`${P}/${O}(${f}) ${c}`}}return`(${f}) ${c}`})()}):null})(),a.jsx("button",{onClick:()=>ut(c=>!c),className:"w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] transition-colors shrink-0",children:a.jsx(ks,{size:11})})]})}),a.jsxs("div",{className:"flex-1 overflow-y-auto overscroll-none no-scrollbar px-5 pt-4 pb-2 flex flex-col","data-library-dropzone":"true",onDragOver:c=>{Y&&c.preventDefault()},onDrop:c=>{var u,y,f;if(c.preventDefault(),Y){if(Y.altIdx!==void 0)Ki(Y.dayIdx,Y.pIdx,Y.altIdx);else{const g=(f=(y=(u=H.days)==null?void 0:u[Y.dayIdx])==null?void 0:y.plan)==null?void 0:f[Y.pIdx];Xi(Y.dayIdx,Y.pIdx,askPlanBMoveMode(g))}Et(null)}},children:[ct&&a.jsx(I1,{newPlaceName:Bn,setNewPlaceName:Ti,newPlaceTypes:Mo,setNewPlaceTypes:Fo,regionHint:ze,onAdd:bm,onCancel:()=>ut(!1)}),(()=>{var w;const c=gs?(w=H.days)==null?void 0:w.flatMap(x=>x.plan||[]).find(x=>x.id===gs):null,u=c?ie(c.time||"00:00"):null,y=x=>{if(u===null||!(x!=null&&x.open)||!(x!=null&&x.close))return null;const P=ie(x.open),O=ie(x.close);return O<=P?u>=P||u<O:u>=P&&u<O};let f=[...fu];Ir.length>0&&(f=f.filter(x=>{const P=x.types||[];return Ir.some(O=>P.includes(O))}));const g=(fu||[]).reduce((x,P)=>((Array.isArray(P==null?void 0:P.types)?P.types:[]).forEach(V=>{x[V]=(x[V]||0)+1}),x),{});return a.jsxs("div",{className:"w-full flex flex-col gap-1.5 items-center",children:[a.jsxs("div",{className:"w-full flex flex-col gap-1 mb-2",children:[a.jsxs("div",{className:"flex flex-wrap gap-1 px-1",children:[Wa.filter(x=>x.value!=="place"&&x.value!=="new"&&x.value!=="revisit").map(x=>{const P=Ir.includes(x.value);return a.jsxs("button",{onClick:()=>Do(O=>P?O.filter(V=>V!==x.value):[...O,x.value]),className:`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${P?"bg-[#3182F6] text-white border-[#3182F6] shadow-sm":"bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`,children:[a.jsx("span",{children:x.label}),a.jsx("span",{className:`ml-1 px-1 rounded text-[8px] font-black ${P?"bg-white/30 text-white":"bg-slate-100 text-slate-500"}`,children:g[x.value]||0})]},x.value)}),Ir.length>0&&a.jsx("button",{onClick:()=>Do([]),className:"px-2 py-0.5 rounded-lg text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all",children:"초기화 ✕"})]}),(Ne==null?void 0:Ne.id)&&a.jsxs("div",{onClick:()=>{kn(null),ne("거리순 정렬을 해제하고 이름순으로 정렬했습니다.")},className:"w-full px-3 py-2 rounded-[14px] border border-blue-100 bg-blue-50/50 text-[11px] font-black text-[#3182F6] flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(49,130,246,0.08)] cursor-pointer hover:bg-blue-100 transition-colors mt-1",children:[a.jsx(cr,{size:12,className:"text-blue-400"}),a.jsxs("span",{className:"truncate flex-1",children:[a.jsx("span",{className:"text-blue-700",children:Ne.name})," 기준 거리순 정렬"]}),a.jsx("span",{className:"text-[9px] text-blue-300",children:"✕"})]})]}),f.length===0&&!ct&&a.jsxs("p",{className:"text-[10px] text-slate-400 text-center py-6 font-semibold leading-relaxed",children:["+ 버튼으로 장소를 추가하고",a.jsx("br",{}),"타임라인으로 드래그하세요"]}),f.map(x=>{var ce,W;const P=x.types?x.types.map(L=>Qi(L)):[Qi("place")];x.id;const O=Tn===x.id,V=rm(x.business),G=Xo(x.business),te=G!=="미설정",le=y(x.business),de=Mr[x.id];return a.jsxs("div",{draggable:!0,onTouchStart:L=>{const Z=L.target instanceof Element?L.target:null;Z!=null&&Z.closest("input,button,a,textarea,[contenteditable],[data-no-drag]")||(Gn.current={kind:"library",place:x,startX:L.touches[0].clientX,startY:L.touches[0].clientY},An.current=!1)},onDragStart:L=>{const Z=Ks.current,xe=L.target instanceof Element?L.target:null;if(!!(xe!=null&&xe.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]'))){L.preventDefault();return}us.current={kind:"library",place:x,copy:Z},L.dataTransfer.effectAllowed=Z?"copy":"move";try{L.dataTransfer.setData("text/plain",`library:${x.id||x.name||"item"}`)}catch{}requestAnimationFrame(()=>{Kt(x),cn(Z)})},onDragEnd:()=>{us.current=null,Kt(null),St(null),an(null),cn(!1)},onDragOver:L=>{Y&&(L.preventDefault(),L.stopPropagation())},onDrop:L=>{var Z,xe,$e;if(Y){if(L.preventDefault(),L.stopPropagation(),Y.altIdx!==void 0)Ki(Y.dayIdx,Y.pIdx,Y.altIdx);else{const We=($e=(xe=(Z=H.days)==null?void 0:Z[Y.dayIdx])==null?void 0:xe.plan)==null?void 0:$e[Y.pIdx];Xi(Y.dayIdx,Y.pIdx,askPlanBMoveMode(We))}Et(null)}},className:`relative w-full shrink-0 rounded-[20px] border bg-white cursor-grab active:cursor-grabbing select-none transition-all duration-300 group overflow-hidden hover:-translate-y-0.5
                    ${(Re==null?void 0:Re.id)===x.id?"pointer-events-none opacity-50":""}
                    ${V?"border-orange-200 hover:shadow-[0_8px_24px_-4px_rgba(249,115,22,0.15)] ring-1 ring-orange-100":le===!0?"border-[#3182F6]/30 shadow-[0_4px_16px_-4px_rgba(49,130,246,0.1)] hover:shadow-[0_8px_24px_-4px_rgba(49,130,246,0.15)] ring-1 ring-[#3182F6]/10":"border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200"}`,children:[a.jsxs("div",{className:"p-4 flex flex-col gap-2.5",children:[a.jsx("span",{className:"text-[22px] font-black text-slate-800 leading-tight break-words whitespace-normal",children:x.name}),a.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap pr-12 cursor-pointer","data-no-drag":"true",onClick:L=>{var Z,xe,$e,We,xt,Rt,Yt,mn,gn;L.stopPropagation(),wn(x.id),Ze({...x,address:x.address||((Z=x.receipt)==null?void 0:Z.address)||"",business:Ge(x.business||{}),receipt:Ee(x.receipt||{address:x.address||"",items:[]}),showBusinessEditor:!!((xe=x.business)!=null&&xe.open||($e=x.business)!=null&&$e.close||(We=x.business)!=null&&We.breakStart||(xt=x.business)!=null&&xt.breakEnd||(Rt=x.business)!=null&&Rt.lastOrder||(Yt=x.business)!=null&&Yt.entryClose||(gn=(mn=x.business)==null?void 0:mn.closedDays)!=null&&gn.length)})},children:[P,de!=null&&a.jsxs("span",{className:"px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-600",children:[de,"km"]})]}),x.address&&a.jsxs("button",{type:"button",onClick:L=>{L.stopPropagation(),Oe(x.name,x.address)},className:"flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left",title:"네이버 지도에서 장소 검색",children:[a.jsx(cr,{size:11,className:"text-[#3182F6] shrink-0"}),a.jsx("span",{className:"text-[10px] font-bold break-words whitespace-normal",children:x.address})]}),a.jsx("div",{className:`w-full px-2.5 py-1 rounded-lg border text-[10px] font-bold break-words whitespace-normal cursor-pointer transition-all hover:shadow-sm ${V?"border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100":"border-slate-200 bg-slate-50 text-slate-500 hover:border-[#3182F6]/40 hover:bg-blue-50/40 hover:text-[#3182F6]"}`,"data-no-drag":"true",onClick:L=>{var $e,We,xt,Rt,Yt,mn,gn,Zi,eo;L.stopPropagation();const xe=(($e=x.business)==null?void 0:$e.open)||((We=x.business)==null?void 0:We.close)||((xt=x.business)==null?void 0:xt.breakStart)||((Rt=x.business)==null?void 0:Rt.breakEnd)||((Yt=x.business)==null?void 0:Yt.lastOrder)||((mn=x.business)==null?void 0:mn.entryClose)||((Zi=(gn=x.business)==null?void 0:gn.closedDays)==null?void 0:Zi.length)?Ge(x.business||{}):{...w1};wn(x.id),Ze({...x,address:x.address||((eo=x.receipt)==null?void 0:eo.address)||"",business:xe,receipt:Ee(x.receipt||{address:x.address||"",items:[]}),showBusinessEditor:!0})},children:V?`주의 · ${te?G:"영업 정보 미설정"}`:te?G:"영업 정보 미설정"}),x.memo&&a.jsx("div",{className:"w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-slate-600 break-words whitespace-normal",children:x.memo})]}),O&&a.jsx("div",{className:"px-3 py-2 border-t border-slate-100 bg-white",children:a.jsxs("div",{className:"space-y-1.5",children:[(((ce=x.receipt)==null?void 0:ce.items)||[]).map((L,Z)=>a.jsxs("div",{className:"flex items-center justify-between text-[10px]",children:[a.jsx("span",{className:"text-slate-600 font-bold truncate",children:L.name||"-"}),a.jsxs("span",{className:"text-slate-400 font-bold",children:["x",or(L)]}),a.jsxs("span",{className:"text-[#3182F6] font-black",children:["₩",fn(L).toLocaleString()]})]},Z)),(((W=x.receipt)==null?void 0:W.items)||[]).length===0&&a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold",children:"등록된 메뉴가 없습니다."})]})}),a.jsxs("div",{className:"px-3 py-2 border-t border-slate-100 flex items-center justify-between bg-white cursor-pointer hover:bg-slate-50/70",onClick:L=>{L.stopPropagation(),Lo(Z=>Z===x.id?null:x.id)},children:[a.jsxs("span",{className:"text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1",children:["Total ",a.jsx(yn,{size:12,className:`transition-transform ${O?"rotate-180":""}`})]}),a.jsxs("span",{className:"text-[14px] font-black text-[#3182F6]",children:["₩",Number(x.price||0).toLocaleString()]})]}),a.jsxs("div",{className:"absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all",children:[a.jsx("button",{onClick:L=>{var Z,xe,$e,We,xt,Rt,Yt,mn,gn;L.stopPropagation(),wn(x.id),Ze({...x,address:x.address||((Z=x.receipt)==null?void 0:Z.address)||"",business:Ge(x.business||{}),receipt:Ee(x.receipt||{address:x.address||"",items:[]}),showBusinessEditor:!!((xe=x.business)!=null&&xe.open||($e=x.business)!=null&&$e.close||(We=x.business)!=null&&We.breakStart||(xt=x.business)!=null&&xt.breakEnd||(Rt=x.business)!=null&&Rt.lastOrder||(Yt=x.business)!=null&&Yt.entryClose||(gn=(mn=x.business)==null?void 0:mn.closedDays)!=null&&gn.length)})},className:"p-1.5 hover:text-[#3182F6] hover:bg-blue-50 text-slate-300 rounded-md transition-all",children:a.jsx(Z_,{size:11})}),a.jsx("button",{onClick:L=>{L.stopPropagation(),ar(x.id)},className:"p-1.5 hover:text-red-500 hover:bg-red-50 text-slate-300 rounded-md transition-all",children:a.jsx(Ul,{size:11})})]})]},x.id)})]})})()]})]})}),a.jsxs("div",{className:"flex-1 flex flex-col items-center w-full bg-slate-50 min-h-screen",style:{marginLeft:xs,marginRight:et?Ur:Nt?44:300},children:[a.jsxs("div",{className:"w-full px-4 pt-8 pb-32",children:[Le&&a.jsx("div",{className:`mx-auto mb-3 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-[11px] font-black text-amber-700 ${Nn?"max-w-[500px]":"max-w-[560px]"}`,children:"공유 일정 보기 모드입니다. (편집 권한 없음)"}),S&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[280] bg-black/30 backdrop-blur-sm",onClick:()=>C(!1)}),a.jsx("div",{className:"fixed z-[281] inset-0 flex items-center justify-center p-4 pointer-events-none",children:a.jsxs("div",{className:"pointer-events-auto w-[min(600px,96vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_40px_100px_-30px_rgba(15,23,42,0.5)] overflow-hidden",children:[a.jsx("div",{className:"bg-gradient-to-br from-[#3182F6] to-[#1a5fd4] px-6 pt-6 pb-5",children:a.jsxs("div",{className:"flex items-start justify-between",children:[a.jsxs("div",{children:[a.jsx("div",{className:"flex items-center gap-2 mb-1",children:a.jsx("span",{className:"text-white/60 text-[11px] font-black tracking-widest uppercase",children:"Anti Planer"})}),a.jsx("p",{className:"text-white text-[26px] font-black leading-none",children:"업데이트 노트"}),a.jsxs("div",{className:"flex items-center gap-2 mt-2.5",children:[a.jsxs("span",{className:"bg-white/20 text-white text-[13px] font-black px-3 py-1 rounded-full",children:["v",m1]}),a.jsx("span",{className:"text-white/60 text-[12px] font-bold",children:(Tu=dh[0])==null?void 0:Tu.date}),a.jsx("span",{className:"bg-white/15 text-white/90 text-[10px] font-black px-2 py-0.5 rounded-full",children:"최신"})]})]}),a.jsx("button",{onClick:()=>C(!1),className:"text-white/60 hover:text-white transition-colors mt-0.5",children:a.jsx(Xr,{size:20})})]})}),a.jsx("div",{className:"px-6 py-4 max-h-[55vh] overflow-y-auto",children:dh.map((c,u)=>a.jsxs("div",{className:u>0?"mt-8 pt-6 border-t border-slate-100":"",children:[u>0&&a.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[a.jsxs("span",{className:"text-[12px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg",children:["v",c.version]}),a.jsx("span",{className:"text-[11px] text-slate-400 font-bold",children:c.date})]}),a.jsxs("div",{className:"relative flex flex-col",children:[a.jsx("div",{className:"absolute left-[42px] top-3 bottom-3 w-px bg-slate-100"}),c.timeline.map((y,f)=>a.jsxs("div",{className:"flex gap-3 mb-4 last:mb-0",children:[a.jsx("div",{className:"shrink-0 w-[42px] flex flex-col items-center pt-0.5",children:a.jsx("span",{className:"text-[11px] font-black text-[#3182F6] tabular-nums leading-none bg-blue-50 border border-blue-100 rounded-lg px-1.5 py-1 text-center w-full",children:y.time})}),a.jsx("div",{className:"shrink-0 w-2 h-2 rounded-full bg-[#3182F6]/30 border-2 border-[#3182F6] mt-1.5 z-10"}),a.jsxs("div",{className:"flex-1 min-w-0 pb-1",children:[a.jsxs("div",{className:"flex items-center gap-1.5 mb-0.5",children:[a.jsx("span",{className:"text-[14px] leading-none",children:y.emoji.length<=2?y.emoji:""}),a.jsx("span",{className:"text-[13px] font-black text-slate-800",children:y.title})]}),a.jsx("p",{className:"text-[11px] text-slate-500 font-bold leading-relaxed",children:y.desc})]})]},f))]})]},c.version))}),a.jsxs("div",{className:"px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/60",children:[a.jsx("span",{className:"text-[11px] text-slate-400 font-bold",children:"문의 및 피드백은 언제든 환영해요 🙌"}),a.jsx("button",{onClick:()=>C(!1),className:"px-4 py-1.5 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-[#1a5fd4] transition-colors",children:"확인"})]})]})})]}),pe&&!(n!=null&&n.isGuest)&&!(Ve!=null&&Ve.ownerId)&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[270] bg-black/25 backdrop-blur-[1px]"}),a.jsx("div",{className:"fixed z-[271] inset-0 flex items-center justify-center p-4",children:a.jsxs("div",{className:"w-[min(640px,94vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] p-5",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[16px] font-black text-slate-800",children:"일정 선택"}),a.jsx("button",{onClick:()=>me(!1),className:"text-slate-400 hover:text-slate-600",title:"닫기",children:a.jsx(Xr,{size:18})})]}),a.jsx("p",{className:"text-[11px] text-slate-500 font-bold mb-3",children:"로그인 후에는 먼저 기존 일정을 고르거나 새 일정을 만들 수 있습니다."}),a.jsx("div",{className:"mb-3",children:a.jsx("input",{value:tt,onChange:c=>Fe(c.target.value),placeholder:"도시 (예: 부산)",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})}),a.jsx("button",{onClick:()=>{zi()},className:"w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"새 일정 생성"}),a.jsx("div",{className:"max-h-[52vh] overflow-y-auto",children:(Q||[]).length===0?a.jsx("p",{className:"text-[11px] text-slate-400 font-bold p-3",children:"기존 일정이 없습니다. 새 일정을 생성하세요."}):a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:(Q||[]).map(c=>{const u=ir(c);return a.jsxs("button",{onClick:()=>{z(c.id),me(!1),ne(`'${u.title}' 일정을 열었습니다.`)},className:`relative overflow-hidden rounded-2xl border text-left min-h-[130px] transition-all hover:-translate-y-0.5 ${M===c.id?"border-[#3182F6] ring-2 ring-[#3182F6]/20":"border-slate-200 hover:border-slate-300"}`,children:[a.jsx("img",{src:$i(u.region),alt:"plan cover",className:"absolute inset-0 w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55"}),a.jsxs("div",{className:"relative z-10 p-3 flex flex-col gap-1 text-white",children:[a.jsx("p",{className:"text-[14px] font-black truncate",children:u.region}),u.startDate&&a.jsx("p",{className:"text-[10px] font-bold text-white/80",children:u.startDate.replace(/-/g,".")}),u.code&&u.code!=="main"&&a.jsx("p",{className:"text-[10px] font-black text-white/95 tracking-wide",children:u.code})]})]},c.id)})})})]})})]}),_e&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>oe(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,94vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"일정 관리 (도시별 예시)"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>oe(!1),children:a.jsx(Xr,{size:16})})]}),a.jsx("button",{onClick:()=>{const c=window.prompt("새 일정 지역을 입력하세요. (예: 부산)","")||"";zi(c)},className:"w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"새 도시 일정 만들기"}),a.jsx("div",{className:"max-h-[52vh] overflow-y-auto",children:(Q||[]).length===0?a.jsx("p",{className:"text-[11px] text-slate-400 font-bold p-3",children:"생성된 일정이 없습니다."}):a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:(Q||[]).map(c=>{const u=ir(c);return a.jsxs("button",{onClick:()=>{z(c.id),oe(!1),ne(`'${u.title}' 일정으로 전환했습니다.`)},className:`relative overflow-hidden rounded-2xl border text-left min-h-[170px] transition-all hover:-translate-y-0.5 ${M===c.id?"border-[#3182F6] ring-2 ring-[#3182F6]/20":"border-slate-200 hover:border-slate-300"}`,children:[a.jsx("img",{src:$i(u.region),alt:"plan cover",className:"absolute inset-0 w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55"}),a.jsxs("div",{className:"relative z-10 p-4 flex flex-col gap-1.5 text-white",children:[a.jsx("p",{className:"text-[18px] font-black truncate",children:u.region}),u.startDate&&a.jsx("p",{className:"text-[11px] font-bold text-white/85",children:u.startDate.replace(/-/g,".")}),u.code&&u.code!=="main"&&a.jsx("p",{className:"text-[11px] font-black text-white/95 tracking-wide",children:u.code})]})]},c.id)})})})]})]}),T&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>Xe(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"일정 옵션"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>Xe(!1),children:a.jsx(Xr,{size:16})})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"여행지"}),a.jsx("input",{value:kr,onChange:c=>Sr(c.target.value),placeholder:"여행지",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"시작일"}),a.jsx("input",{type:"date",value:En,onChange:c=>Ii(c.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"종료일"}),a.jsx("input",{type:"date",value:Qs,onChange:c=>Ai(c.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"총 예산"}),a.jsx("input",{type:"number",value:hs,onChange:c=>ki(c.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]})]}),a.jsxs("div",{className:"flex items-center gap-2 mt-3",children:[a.jsx("button",{onClick:()=>{Xe(!1),oe(!0)},className:"flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:"목록 열기"}),a.jsx("button",{onClick:()=>{Js(String(kr||"").trim()),qn(En||""),Zt(Qs||""),ae(c=>({...c,maxBudget:Number(hs)||0})),Xe(!1)},className:"flex-1 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"완료"})]})]})]}),E&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>N(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"공유 범위 / 편집 권한"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>N(!1),children:a.jsx(Xr,{size:16})})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2 mb-3",children:[a.jsxs("select",{value:rt.visibility,onChange:c=>Bi({...rt,visibility:c.target.value}),className:"bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]",children:[a.jsx("option",{value:"private",children:"비공개"}),a.jsx("option",{value:"link",children:"링크 소지자 공개"}),a.jsx("option",{value:"public",children:"공개"})]}),a.jsxs("select",{value:rt.permission,onChange:c=>Bi({...rt,permission:c.target.value}),className:"bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]",children:[a.jsx("option",{value:"viewer",children:"보기만"}),a.jsx("option",{value:"editor",children:"편집 가능"})]})]}),a.jsx("button",{onClick:()=>{qi()},className:"w-full py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#3182F6] text-[11px] font-black hover:bg-blue-100 transition-colors",children:Ae?"복사됨":"공유 링크 복사"}),a.jsx("p",{className:"text-[10px] text-slate-400 font-bold mt-2",children:"링크에는 현재 플랜 ID가 포함됩니다. (예: 다른 도시 일정 분리 공유)"})]})]}),(()=>{var de,ce;const c=je&&ht?Math.max(1,Math.round((new Date(ht)-new Date(je))/864e5)+1):((de=H.days)==null?void 0:de.length)||0,u=Math.max(0,c-1),y=Cn>0?Math.min(100,Math.round(ta.total/Cn*100)):0,f=(H.days||[]).flatMap(W=>W.plan||[]).filter(W=>{var L;return W&&W.type!=="backup"&&!((L=W.types)!=null&&L.includes("ship"))}),g=f.filter(W=>typeof W.revisit=="boolean"?W.revisit:pn(W)).length,w=Math.max(0,f.length-g),x=f.length>0?Math.round(g/f.length*100):0,P=f.length>0?Math.round(w/f.length*100):0,O=(H.days||[]).flatMap(W=>W.plan||[]).filter(W=>W&&W.type!=="backup"),V={ship:"선박",lodge:"숙소",food:"식당",cafe:"카페",tour:"관광",rest:"휴식",pickup:"픽업",openrun:"오픈런",view:"뷰맛집",experience:"체험",souvenir:"기념품샵",place:"장소",transport:"이동비"},G=O.reduce((W,L)=>{const Z=Array.isArray(L.types)?L.types:[],xe=Z.find(We=>!fr.has(We)&&We!=="place")||Z.find(We=>!fr.has(We))||"place",$e=Number(L.price)||0;return W[xe]=(W[xe]||0)+$e,L.distance&&(W.transport=(W.transport||0)+Hr(L.distance)),W},{}),te=Object.values(G).reduce((W,L)=>W+Number(L||0),0),le=Object.entries(G).map(([W,L])=>{const Z=V[W]||W,xe=Number(L)||0,$e=te>0?Math.round(xe/te*100):0;return{key:W,label:Z,amount:xe,pct:$e}}).sort((W,L)=>L.amount-W.amount);return a.jsxs("div",{className:"mb-8 relative",children:[nr&&a.jsx("div",{className:"fixed top-0 z-[190] pointer-events-none",style:{left:et?12:xs,right:et?12:Nt?44:300},children:a.jsxs("div",{className:"w-full bg-white/96 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.5)] pointer-events-auto min-h-[88px] px-4 py-2.5 flex flex-col justify-center gap-2",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100",children:a.jsx(cr,{size:11,className:"text-[#3182F6]"})}),a.jsx("span",{className:"text-[13px] font-black text-slate-800 truncate flex-1",children:ze||"여행지"}),a.jsxs("div",{className:"relative shrink-0",children:[a.jsx("button",{type:"button",onClick:()=>Qn(W=>!W),className:"text-[11px] font-black text-slate-400 tabular-nums px-2 py-1 rounded-md hover:bg-slate-100 transition-colors",title:"기간 설정",children:je&&ht?`${je.slice(5).replace("-",".")}~${ht.slice(5).replace("-",".")}`:`${u}박 ${c}일`}),Hi&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[299]",onClick:()=>Qn(!1)}),a.jsx("div",{className:"absolute top-full right-0 z-[300] mt-2",children:a.jsx(yh,{startDate:je,endDate:ht,onStartChange:qn,onEndChange:Zt,onClose:()=>Qn(!1)})})]})]}),kl&&a.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[a.jsx("button",{onClick:()=>Xe(!0),className:"w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center justify-center",title:"일정 옵션",children:a.jsx(ch,{size:13})}),a.jsx("button",{onClick:()=>N(!0),className:"w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-[#3182F6] hover:bg-blue-100 transition-colors flex items-center justify-center",title:"공유 설정",children:a.jsx(lh,{size:13})})]})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"flex-1 h-2 bg-slate-100 rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-[#3182F6] to-indigo-500 rounded-full",style:{width:`${y}%`}})}),a.jsxs("span",{className:"text-[11px] font-black text-slate-500 tabular-nums shrink-0",children:[y,"%"]}),a.jsxs("span",{className:"text-[14px] font-black text-[#3182F6] tabular-nums tracking-tight shrink-0",children:["₩",ta.remaining.toLocaleString()]})]})]})}),!nr&&a.jsx("section",{className:"mb-10 -mx-4 -mt-8",children:a.jsxs("div",{className:"w-full relative overflow-hidden bg-transparent",children:[kl&&a.jsxs("div",{className:"absolute top-4 right-4 z-20 flex items-center gap-2",children:[a.jsx("button",{onClick:()=>Xe(!0),className:"w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center",title:"일정 옵션",children:a.jsx(ch,{size:16})}),a.jsx("button",{onClick:()=>N(!0),className:"w-10 h-10 rounded-xl border border-blue-200 bg-blue-50/90 backdrop-blur text-[#3182F6] hover:bg-blue-100 transition-colors flex items-center justify-center",title:"공유 설정",children:a.jsx(lh,{size:16})})]}),a.jsxs("div",{className:"absolute left-0 right-0 top-0 h-[430px] sm:h-[450px] overflow-hidden pointer-events-none",children:[a.jsx("img",{src:$i(ze),className:"w-full h-full object-cover opacity-95 scale-105",alt:"travel background"}),a.jsx("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.12) 46%, rgba(242,244,246,0.16) 62%, rgba(242,244,246,0) 76%, rgba(242,244,246,0) 100%)"}})]}),a.jsxs("div",{className:`relative z-10 flex flex-col gap-10 w-full mx-auto ${Fi}`,children:[a.jsxs("div",{className:"flex flex-col gap-5 px-6 pt-8 sm:px-8 sm:pt-10",children:[a.jsx("input",{value:ze,onChange:W=>Js(W.target.value),placeholder:"어디로 떠나시나요?",className:"bg-transparent border-none outline-none text-[36px] sm:text-[44px] font-extrabold text-white drop-shadow-md placeholder:text-white/50 w-full tracking-tight leading-none"}),a.jsxs("div",{className:"relative flex items-center gap-2",children:[a.jsxs("button",{onClick:()=>Qn(W=>!W),className:"flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl transition-all group hover:bg-white/30",children:[a.jsx(P_,{size:14,className:"text-white group-hover:scale-110 transition-transform shrink-0"}),a.jsxs("div",{className:"flex items-center gap-1.5 pt-0.5",children:[a.jsx("span",{className:"text-[12px] font-black text-white",children:je?je.replace(/-/g,". "):"시작일"}),a.jsx("span",{className:"text-white/50 text-[10px] font-black",children:"~"}),a.jsx("span",{className:"text-[12px] font-black text-white",children:ht?ht.replace(/-/g,". "):"종료일"})]})]}),a.jsx("div",{className:"px-4 py-2 bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl",children:a.jsx("span",{className:"text-[12px] font-black text-white/90",children:c>0?`${u}박 ${c}일`:`${((ce=H.days)==null?void 0:ce.length)||0}일 일정`})}),Hi&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[299]",onClick:()=>Qn(!1)}),a.jsx("div",{className:"absolute top-full left-0 z-[300] mt-3",children:a.jsx(yh,{startDate:je,endDate:ht,onStartChange:qn,onEndChange:Zt,onClose:()=>Qn(!1)})})]})]})]}),a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden flex flex-col pt-8 pb-7 px-8 items-center text-center",children:[a.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3",children:"Total Remaining Budget"}),a.jsxs("p",{className:"text-[48px] font-black text-[#3182F6] leading-none tabular-nums tracking-tighter mb-8",children:["₩",ta.remaining.toLocaleString()]}),a.jsxs("div",{className:"w-full flex items-stretch bg-white/50 rounded-2xl border border-white/20 overflow-hidden min-h-[72px]",children:[a.jsxs("div",{className:"flex-1 p-4 flex flex-col items-center justify-center gap-1 border-r border-slate-100",children:[a.jsx("p",{className:"text-[9px] font-black uppercase tracking-widest text-slate-400",children:"Spent"}),a.jsxs("p",{className:"text-[14px] font-black text-slate-700 tabular-nums",children:["₩",ta.total.toLocaleString()]})]}),a.jsxs("div",{className:"flex-1 p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#3182F6]/5 transition-all group",onClick:()=>_s(!0),children:[a.jsxs("p",{className:"flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400",children:["Budget ",a.jsx(ks,{size:9,className:"text-[#3182F6] opacity-0 group-hover:opacity-100"})]}),Ko?a.jsx("input",{type:"number",defaultValue:Cn,autoFocus:!0,className:"text-[14px] font-black text-[#3182F6] w-24 bg-transparent border-b border-blue-200 outline-none tabular-nums text-center",onBlur:W=>{const L=Number(W.target.value);L>0&&ae(Z=>({...Z,maxBudget:L})),_s(!1)},onKeyDown:W=>{W.key==="Enter"&&W.target.blur(),W.key==="Escape"&&_s(!1)}}):a.jsxs("p",{className:"text-[14px] font-black text-slate-400 tabular-nums",children:["₩",Cn.toLocaleString()]})]})]}),a.jsxs("div",{className:"w-full flex items-center gap-3 mt-8",children:[a.jsx("div",{className:"flex-1 h-3 bg-slate-100/50 rounded-full overflow-hidden flex items-center shadow-inner",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-[#3182F6] via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(49,130,246,0.3)]",style:{width:`${y}%`}})}),a.jsxs("span",{className:"text-[11px] font-black text-[#3182F6] tabular-nums whitespace-nowrap",children:[y,"%"]})]}),a.jsxs("button",{type:"button",onClick:()=>sr(W=>!W),className:"mt-4 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center gap-1.5",children:["여행 요약 확장",a.jsx(yn,{size:12,className:`transition-transform ${Oi?"rotate-180":""}`})]}),Oi&&a.jsxs("div",{className:"mt-3 w-full p-3 rounded-2xl border border-slate-200 bg-white/85 text-left",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest",children:"신규 / 재방문 비율 비교"}),a.jsxs("div",{className:"w-full h-2 rounded-full bg-slate-100 overflow-hidden flex",children:[a.jsx("div",{className:"h-full bg-emerald-400",style:{width:`${P}%`}}),a.jsx("div",{className:"h-full bg-blue-400",style:{width:`${x}%`}})]}),a.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[a.jsxs("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2",children:[a.jsx("p",{className:"text-[9px] font-black text-emerald-600",children:"신규"}),a.jsxs("p",{className:"text-[14px] font-black text-emerald-700 tabular-nums",children:[w,"개 (",P,"%)"]})]}),a.jsxs("div",{className:"rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-2",children:[a.jsx("p",{className:"text-[9px] font-black text-blue-600",children:"재방문"}),a.jsxs("p",{className:"text-[14px] font-black text-blue-700 tabular-nums",children:[g,"개 (",x,"%)"]})]})]}),a.jsxs("div",{className:"mt-3 pt-3 border-t border-slate-200",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest",children:"카테고리별 지출 비율"}),le.length===0?a.jsx("p",{className:"text-[10px] font-bold text-slate-400",children:"지출 데이터가 없습니다."}):a.jsx("div",{className:"space-y-1.5",children:le.map(W=>a.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white px-2.5 py-2",children:[a.jsxs("div",{className:"flex items-center justify-between mb-1",children:[a.jsx("span",{className:"text-[10px] font-black text-slate-700",children:W.label}),a.jsxs("span",{className:"text-[10px] font-black text-[#3182F6] tabular-nums",children:["₩",W.amount.toLocaleString()," · ",W.pct,"%"]})]}),a.jsx("div",{className:"w-full h-1.5 rounded-full bg-slate-100 overflow-hidden",children:a.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-[#3182F6] to-indigo-500",style:{width:`${W.pct}%`}})})]},W.key))})]})]})]})})]})]})})]})})(),a.jsx("div",{ref:qo,className:"h-px w-full"}),a.jsxs("div",{className:`w-full mx-auto flex flex-col relative z-0 ${Fi} ${Nn?"gap-4":"gap-6"}`,children:[Xn===0&&a.jsxs("div",{"data-droptarget":"empty-timeline",onDragOver:c=>{Re&&(c.preventDefault(),St({dayIdx:0,insertAfterPIdx:-1}))},onDragLeave:c=>{c.currentTarget.contains(c.relatedTarget)||St(null)},onDrop:c=>{Re&&(c.preventDefault(),_u(0,Re),ln||ar(Re.id),Kt(null),St(null),cn(!1))},className:`w-full rounded-[24px] border bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.2)] p-5 flex flex-col items-center gap-3 transition-all ${Re?"cursor-copy border-[#3182F6]/40":"border-slate-200"} ${(nt==null?void 0:nt.dayIdx)===0&&(nt==null?void 0:nt.insertAfterPIdx)===-1?"ring-2 ring-[#3182F6] bg-blue-50/40":""}`,children:[a.jsx("p",{className:"text-[12px] font-black text-slate-500",children:"아직 등록된 일정이 없습니다."}),a.jsx("button",{type:"button",onClick:()=>_u(0),className:"px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors",children:"+ 첫 일정 추가"}),Re&&a.jsx("p",{className:"text-[11px] font-black text-[#3182F6]",children:"내 장소 카드를 여기로 드래그해서 바로 추가할 수 있습니다."})]}),a.jsx(wt.Fragment,{children:(Iu=H.days)==null?void 0:Iu.map((c,u)=>{var y;return(y=c.plan)==null?void 0:y.map((f,g)=>{var xe,$e,We,xt,Rt,Yt,mn,gn,Zi,eo,Cu,Pu;const w=Rr===f.id;let x;K(f.types)?x="bg-white border-slate-300 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]":(xe=f.types)!=null&&xe.includes("ship")?x="bg-[#f4fafe] border-blue-200 shadow-[0_8px_24px_-8px_rgba(29,78,216,0.12)]":f.isTimeFixed?x="bg-white border-[#3182F6]/40 shadow-[0_10px_30px_-8px_rgba(49,130,246,0.12)] ring-1 ring-[#3182F6]/15":x="bg-white border-slate-200 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)] hover:border-slate-300";const P=f.types?f.types.map(R=>Qi(R)):f.type?[Qi(f.type)]:[],O=K(f.types),V=($e=f.types)==null?void 0:$e.includes("ship"),G=V?"":cu(f,u),te=((We=f.alternatives)==null?void 0:We.length)||0,le=te>0,de=f.isAutoDuration,ce=!!f.isDurationFixed||de,W=gl[f.id]??0,L=te+1,Z=R=>{gm(u,g,R),Lr(U=>{const re=(((U[f.id]??0)+R)%L+L)%L;return{...U,[f.id]:re}})};return a.jsxs("div",{id:g===0?`day-marker-${c.day}`:f.id,"data-plan-id":f.id,className:`relative group transition-all duration-300 ${rr===f.id?"scale-[1.02]":""}`,children:[c.day>1&&g===0&&a.jsx("div",{className:"flex items-center justify-center py-3 w-full",children:a.jsxs("div",{className:"flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2",children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:R=>{R.stopPropagation(),ea(u,g,-qt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Qr,{size:10})}),a.jsx("span",{className:`min-w-[3rem] text-center tracking-tight text-xs font-black ${f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto?"text-[#3182F6] cursor-pointer":"text-slate-800"}`,onClick:R=>{R.stopPropagation(),f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto&&hu(u,g)},title:f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto?"클릭하여 경로 계산 시간으로 초기화":void 0,children:f.travelTimeOverride||"15분"}),a.jsx("button",{onClick:R=>{R.stopPropagation(),ea(u,g,qt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(ks,{size:10})})]}),a.jsxs("button",{type:"button",className:"flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors",title:"클릭하여 네이버 길찾기 열기",onClick:R=>{var Ie,nn;R.stopPropagation();let U;if(g===0&&u>0){const jt=((Ie=H.days[u-1])==null?void 0:Ie.plan)||[];U=jt[jt.length-1]}else U=(nn=c.plan)==null?void 0:nn[g-1];const X=ve(U,"from"),re=ve(f,"to");if(!X||!re){ne("길찾기용 출발/도착 주소가 필요합니다.");return}it((U==null?void 0:U.activity)||"출발지",X,f.activity||"도착지",re)},children:[a.jsx(Jr,{size:11}),a.jsx("span",{children:D(f.distance)})]}),(()=>{const R=`${u}_${g}`,U=tr===R;return a.jsxs("button",{onClick:X=>{X.stopPropagation(),Yi(u,g)},disabled:!!tr,className:`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${U?"bg-slate-100 text-slate-400 border-slate-200":"bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]"}`,children:[a.jsx(ai,{size:10})," ",U?"계산중":"자동경로"]})})(),a.jsx("div",{className:"w-px h-4 bg-slate-200 mx-0.5"}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:R=>{R.stopPropagation(),ws(u,g,-vt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Qr,{size:10})}),a.jsx("span",{className:"min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500",children:f.bufferTimeOverride||"10분"}),a.jsx("button",{onClick:R=>{R.stopPropagation(),ws(u,g,vt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(ks,{size:10})})]})]})}),a.jsxs("div",{"data-dropitem":`${u}-${g}`,draggable:!0,onTouchStart:R=>{const U=R.target instanceof Element?R.target:null;if(U!=null&&U.closest("input,button,a,textarea,[contenteditable],[data-no-drag]"))return;const X={dayIdx:u,pIdx:g,planPos:le?W:void 0};Gn.current={kind:"timeline",payload:X,startX:R.touches[0].clientX,startY:R.touches[0].clientY},An.current=!1},onDragStart:R=>{const U=Ks.current,X=R.target instanceof Element?R.target:null;if(!!(X!=null&&X.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]'))){R.preventDefault();return}const Ie={dayIdx:u,pIdx:g,planPos:le?W:void 0};us.current={kind:"timeline",payload:Ie,copy:U},R.dataTransfer.effectAllowed=U?"copy":"move";try{R.dataTransfer.setData("text/plain",`timeline:${f.id||`${u}-${g}`}`)}catch{}requestAnimationFrame(()=>{cn(U),Et(Ie)})},onDragEnd:()=>{us.current=null,Et(null),cn(!1)},onDragOver:R=>{(Re||Y)&&f.type!=="backup"&&(R.preventDefault(),R.stopPropagation(),an({dayIdx:u,pIdx:g}))},onDragLeave:R=>{R.currentTarget.contains(R.relatedTarget)||an(null)},onDrop:R=>{var U,X;if(($t==null?void 0:$t.dayIdx)===u&&($t==null?void 0:$t.pIdx)===g){if(R.preventDefault(),R.stopPropagation(),Re)sa(u,g,Re),ln||ar(Re.id);else if(Y&&Y.altIdx===void 0){const re=(X=(U=H.days[Y.dayIdx])==null?void 0:U.plan)==null?void 0:X[Y.pIdx];re&&(Y.dayIdx!==u||Y.pIdx!==g)&&(sa(u,g,Ct(re)),ln||Ji(Y.dayIdx,Y.pIdx))}Kt(null),Et(null),an(null),cn(!1)}},className:`relative z-10 w-full flex flex-col transition-all group ${(Y==null?void 0:Y.dayIdx)===u&&(Y==null?void 0:Y.pIdx)===g?"opacity-50 pointer-events-none scale-[0.99]":""} ${($t==null?void 0:$t.dayIdx)===u&&($t==null?void 0:$t.pIdx)===g?"ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]":""}`,onClick:()=>bu(f.id),children:[le&&a.jsxs(a.Fragment,{children:[a.jsx("div",{"data-no-drag":"true",onClick:R=>{R.stopPropagation(),Z(-1)},className:"absolute left-1 top-0 bottom-0 z-20 w-7 flex items-center justify-center cursor-pointer transition-all group/nav",title:"이전 플랜",children:a.jsx("div",{className:"w-6 h-6 rounded-full bg-white/90 shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 group-hover/nav:text-[#3182F6] group-hover/nav:border-blue-200 group-hover/nav:scale-110 transition-all",children:a.jsx(Ta,{size:14})})}),a.jsx("div",{"data-no-drag":"true",onClick:R=>{R.stopPropagation(),Z(1)},className:"absolute right-1 top-0 bottom-0 z-20 w-7 flex items-center justify-center cursor-pointer transition-all group/nav",title:"다음 플랜",children:a.jsx("div",{className:"w-6 h-6 rounded-full bg-white/90 shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 group-hover/nav:text-[#3182F6] group-hover/nav:border-blue-200 group-hover/nav:scale-110 transition-all",children:a.jsx(Ia,{size:14})})})]}),a.jsxs("div",{className:`relative w-full flex flex-col border overflow-hidden rounded-[24px] transition-all duration-300 ${x}`,children:[le&&a.jsx("div",{className:"absolute top-2 right-2 z-20 pointer-events-none",children:a.jsxs("button",{type:"button","data-plan-picker-trigger":"true",className:"pointer-events-auto text-[11px] font-black px-2 py-1 rounded-lg border min-w-[44px] text-center text-slate-500 bg-white/95 border-slate-200 shadow-[0_8px_16px_-10px_rgba(15,23,42,0.35)] hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",onClick:R=>{R.stopPropagation();const U=R.currentTarget.getBoundingClientRect(),X=250,re=180,Ie=Math.max(12,Math.min(window.innerWidth-X-12,U.right-X)),nn=Math.max(8,Math.min(window.innerHeight-re-8,U.bottom+8));ms({dayIdx:u,pIdx:g,left:Ie,top:nn})},title:"플랜 목록 보기",children:[W+1,"/",L]})}),le&&(Ut==null?void 0:Ut.dayIdx)===u&&(Ut==null?void 0:Ut.pIdx)===g&&a.jsxs("div",{"data-plan-picker":"true",className:"fixed z-[170] w-[250px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_18px_36px_-18px_rgba(15,23,42,0.35)] p-2.5",style:{left:Ut.left,top:Ut.top},onClick:R=>R.stopPropagation(),children:[a.jsxs("p",{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2",children:["플랜 목록 (",L,"개)"]}),a.jsx("div",{className:"flex flex-col gap-1 max-h-[130px] overflow-y-auto no-scrollbar",children:[f,...f.alternatives||[]].map((R,U)=>{var re;const X=U===W;return a.jsxs("button",{type:"button",onClick:()=>ym(u,g,U),className:`w-full text-left px-2.5 py-2 rounded-xl border transition-colors ${X?"border-[#3182F6] bg-blue-50 text-[#3182F6]":"border-slate-200 bg-white text-slate-700 hover:border-[#3182F6] hover:text-[#3182F6]"}`,children:[a.jsx("p",{className:"text-[11px] font-black truncate",children:R.activity||`플랜 ${U+1}`}),a.jsx("p",{className:"text-[10px] font-bold text-slate-400 truncate",children:(((re=R.receipt)==null?void 0:re.address)||"").trim()||"주소 미정"})]},`${f.id}_variant_${U}`)})})]}),a.jsxs("div",{className:"flex items-stretch border-b border-slate-100 border-dashed",children:[!V&&!O&&a.jsxs("div",{onClick:R=>{R.stopPropagation(),ps(U=>(U==null?void 0:U.dayIdx)===u&&(U==null?void 0:U.pIdx)===g?null:{dayIdx:u,pIdx:g})},className:`relative flex flex-col items-center justify-center gap-2 shrink-0 border-r border-slate-100 flex-none overflow-hidden transition-all duration-500 cursor-pointer group/tower ${(Be==null?void 0:Be.dayIdx)===u&&(Be==null?void 0:Be.pIdx)===g?"w-[200px] sm:w-[220px] bg-slate-50/80 shadow-inner":Nn?"w-[30%] py-3":"w-[30%] py-4 px-2 sm:px-3"} ${f.isTimeFixed?"bg-blue-50/40":"bg-transparent"}`,children:[f.isTimeFixed&&a.jsx(oh,{size:90,className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-[0.035] pointer-events-none"}),a.jsx("div",{"data-time-trigger":"true",className:`relative w-full px-1 py-1 rounded-2xl select-none z-10 transition-all ${(Be==null?void 0:Be.dayIdx)===u&&(Be==null?void 0:Be.pIdx)===g?"scale-100":"group-hover/tower:bg-slate-100/30"}`,children:a.jsx("div",{className:"relative flex flex-col items-center justify-center gap-3 z-10",children:(()=>{const[R="00",U="00"]=(f.time||"00:00").split(":"),X=parseInt(R,10),re=parseInt(U,10),Ie=f.isTimeFixed?"text-blue-400 hover:text-blue-600 hover:bg-blue-100/60":"text-slate-400 hover:text-blue-500 hover:bg-blue-100/50";if(!((Be==null?void 0:Be.dayIdx)===u&&(Be==null?void 0:Be.pIdx)===g)){const[Te,be]=(f.time||"00:00").split(":"),Es=ie(f.time||"00:00")+(f.duration||0),[Ts,Yn]=Pt(Es).split(":");return a.jsxs("div",{className:"flex flex-col items-center justify-center w-full h-full px-2 py-3 gap-1.5 select-none",children:[a.jsxs("div",{className:"flex flex-col items-center gap-0.5",children:[f.isTimeFixed&&a.jsx("span",{className:"text-[7px] font-black tracking-widest text-[#3182F6]/50 uppercase leading-none",children:"고정"}),a.jsxs("span",{className:`text-[28px] font-black tabular-nums tracking-tight leading-none ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:[String(Te).padStart(2,"0"),":",String(be).padStart(2,"0")]})]}),a.jsxs("div",{className:`flex items-center gap-0.5 px-2.5 py-1 rounded-full cursor-pointer transition-colors ${de?"bg-red-500":ce?"bg-orange-400":"bg-slate-200 hover:bg-slate-300"}`,onClick:ot=>{if(ot.stopPropagation(),de){ne("자동 연동 일정은 소요시간을 조절할 수 없습니다.");return}ps(Pn=>(Pn==null?void 0:Pn.dayIdx)===u&&(Pn==null?void 0:Pn.pIdx)===g?null:{dayIdx:u,pIdx:g})},children:[a.jsx("button",{onClick:ot=>{if(ot.stopPropagation(),ce){ne(de?"자동 연동 일정은 소요시간을 변경할 수 없습니다.":"소요시간 잠금이 켜져 있습니다.");return}Gr(u,g,-qt)},className:`w-4 h-4 flex items-center justify-center transition-colors ${ce?"text-white/60 hover:text-white":"text-slate-400 hover:text-slate-600"}`,children:a.jsx(Qr,{size:9,strokeWidth:3})}),a.jsx("span",{className:`text-[11px] font-black tabular-nums px-1 ${ce?"text-white":"text-slate-600"}`,children:gh(f.duration)}),a.jsx("button",{onClick:ot=>{if(ot.stopPropagation(),ce){ne(de?"자동 연동 일정은 소요시간을 변경할 수 없습니다.":"소요시간 잠금이 켜져 있습니다.");return}Gr(u,g,qt)},className:`w-4 h-4 flex items-center justify-center transition-colors ${ce?"text-white/60 hover:text-white":"text-slate-400 hover:text-slate-600"}`,children:a.jsx(ks,{size:9,strokeWidth:3})})]}),a.jsxs("span",{className:`text-[28px] font-black tabular-nums tracking-tight leading-none ${f.isTimeFixed?"text-blue-300":"text-slate-400"}`,children:[String(Ts).padStart(2,"0"),":",String(Yn).padStart(2,"0")]})]})}const jt=(Be==null?void 0:Be.step)||10;return a.jsxs("div",{className:"flex flex-col items-center w-full h-full px-2.5 py-2 gap-2 animate-in fade-in duration-200 overflow-y-auto select-none",children:[a.jsxs("div",{className:"flex items-center gap-2 w-full justify-center",children:[a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Te=>{Te.stopPropagation(),Yo(u,g,1)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${Ie}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:String(isNaN(X)?0:X).padStart(2,"0")}),a.jsx("button",{onClick:Te=>{Te.stopPropagation(),Yo(u,g,-1)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${Ie}`,children:a.jsx(yn,{size:13})})]}),a.jsx("span",{className:`text-[20px] font-black pb-0.5 ${f.isTimeFixed?"text-[#3182F6]/20":"text-slate-200"}`,children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Te=>{Te.stopPropagation(),Zo(u,g,jt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${Ie}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:String(isNaN(re)?0:re).padStart(2,"0")}),a.jsx("button",{onClick:Te=>{Te.stopPropagation(),Zo(u,g,-jt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${Ie}`,children:a.jsx(yn,{size:13})})]})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-1 flex-1",children:[a.jsxs("button",{onClick:Te=>{Te.stopPropagation(),cm(u,g)},className:`col-span-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${f.isTimeFixed?"bg-[#3182F6] text-white ring-2 ring-[#3182F6]/40 ring-offset-1":"bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"}`,children:[f.isTimeFixed?a.jsx(oh,{size:9}):a.jsx(B_,{size:9})," ",f.isTimeFixed?"고정됨":"고정"]}),[1,5,15,30].map(Te=>a.jsx("button",{onClick:be=>{be.stopPropagation(),ps(Es=>({...Es,step:Te}))},className:`w-full py-1 rounded-lg text-[9px] font-black transition-all text-center ${jt===Te?f.isTimeFixed?"bg-[#3182F6] text-white":"bg-slate-700 text-white":"bg-slate-50 text-slate-400 hover:bg-slate-100"}`,children:Te},Te))]})]}),a.jsx("div",{className:"w-full h-px bg-slate-100"}),a.jsxs("div",{className:"flex items-center gap-2 w-full justify-center",children:[a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Te=>{Te.stopPropagation(),ce||Gr(u,g,60)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ce?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${ce?"text-orange-400":"text-slate-800"}`,children:String(Math.floor((f.duration||0)/60)).padStart(2,"0")}),a.jsx("button",{onClick:Te=>{Te.stopPropagation(),ce||Gr(u,g,-60)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ce?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(yn,{size:13})})]}),a.jsx("span",{className:`text-[20px] font-black pb-0.5 ${ce?"text-orange-200":"text-slate-200"}`,children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Te=>{Te.stopPropagation(),ce||Gr(u,g,jt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ce?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${ce?"text-orange-400":"text-slate-800"}`,children:String((f.duration||0)%60).padStart(2,"0")}),a.jsx("button",{onClick:Te=>{Te.stopPropagation(),ce||Gr(u,g,-jt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ce?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(yn,{size:13})})]})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-1 flex-1",children:[a.jsxs("button",{onClick:Te=>{Te.stopPropagation(),lm(u,g)},className:`col-span-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${f.isDurationFixed?"bg-orange-400 text-white ring-2 ring-orange-400/40 ring-offset-1":"bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"}`,children:[a.jsx(uh,{size:9})," ",f.isDurationFixed?"고정됨":"고정"]}),[30,60,90,120].map(Te=>a.jsx("button",{onClick:be=>{be.stopPropagation(),ce||am(u,g,Te)},className:"w-full py-1 rounded-lg text-[9px] font-black transition-all text-center bg-slate-50 text-slate-500 hover:bg-orange-400 hover:text-white",children:Te<60?`${Te}m`:Te%60===0?`${Te/60}h`:"1.5h"},Te))]})]})]})})()})})]}),a.jsx("div",{className:`${V||O?"flex-1":"w-[70%] flex-none"} min-w-0 flex flex-col justify-start gap-2 transition-all duration-500 overflow-hidden ${Nn?"p-2.5 sm:p-3":"p-3 sm:p-4"}`,children:V?a.jsxs("div",{className:"flex flex-col gap-2 py-0.5",onClick:R=>R.stopPropagation(),children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx(ih,{size:11,className:"text-blue-400 shrink-0"}),a.jsx("input",{value:f.activity,onChange:R=>wl(u,g,R.target.value),onFocus:R=>R.target.select(),className:"flex-1 min-w-0 bg-transparent text-[15px] font-black text-blue-900 leading-tight focus:outline-none truncate",onClick:R=>R.stopPropagation(),placeholder:"페리 이름"})]}),a.jsxs("div",{className:"flex items-center bg-gradient-to-r from-blue-700 to-cyan-600 rounded-xl px-3 py-2 gap-2",children:[a.jsxs("div",{className:"flex flex-col items-start min-w-0",children:[a.jsx("span",{className:"text-[8px] text-blue-200 font-bold tracking-widest uppercase",children:"Departure"}),a.jsx("input",{value:f.startPoint||"목포항",onChange:R=>{R.stopPropagation(),na(u,g,"startPoint",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:R=>R.target.select(),className:"text-[14px] font-black text-white bg-transparent outline-none w-16 focus:border-b focus:border-white/50"}),a.jsx("input",{value:((xt=f.receipt)==null?void 0:xt.address)||"",onChange:R=>{R.stopPropagation(),ae(U=>{const X=JSON.parse(JSON.stringify(U));return X.days[u].plan[g].receipt={...X.days[u].plan[g].receipt,address:R.target.value},X})},onClick:R=>R.stopPropagation(),onFocus:async R=>{if(R.target.select(),f.startPoint){const U=await Ss(f.startPoint);U!=null&&U.address&&ae(X=>{const re=JSON.parse(JSON.stringify(X));return re.days[u].plan[g].receipt={...re.days[u].plan[g].receipt,address:U.address},re})}},placeholder:"클릭 시 자동 입력",className:"text-[9px] text-blue-200/80 bg-transparent outline-none w-24 focus:border-b focus:border-white/30 truncate cursor-pointer"})]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-0.5",children:[a.jsx("div",{className:"w-full border-t border-dashed border-white/30"}),a.jsx("span",{className:"text-[9px] text-white/60 font-bold",children:(()=>{const R=f.sailDuration??240;return`${Math.floor(R/60)}h${R%60>0?` ${R%60}m`:""}`})()})]}),a.jsxs("div",{className:"flex flex-col items-end min-w-0",children:[a.jsx("span",{className:"text-[8px] text-blue-200 font-bold tracking-widest uppercase",children:"Arrival"}),a.jsx("input",{value:f.endPoint||"제주항",onChange:R=>{R.stopPropagation(),na(u,g,"endPoint",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:R=>R.target.select(),className:"text-[14px] font-black text-white bg-transparent outline-none w-16 text-right focus:border-b focus:border-white/50"}),a.jsx("input",{value:f.endAddress||"",onChange:R=>{R.stopPropagation(),na(u,g,"endAddress",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:async R=>{if(R.target.select(),f.endPoint){const U=await Ss(f.endPoint);U!=null&&U.address&&na(u,g,"endAddress",U.address)}},placeholder:"클릭 시 자동 입력",className:"text-[9px] text-blue-200/80 bg-transparent outline-none w-24 text-right focus:border-b focus:border-white/30 truncate cursor-pointer"})]})]}),(()=>{const R=ie(f.time||"00:00"),U=ie(f.boardTime||Pt(R+60)),X=f.sailDuration??240,re=Pt(U+X),Ie=be=>(bs==null?void 0:bs.pId)===f.id&&(bs==null?void 0:bs.field)===be,nn=(be,Es=qt)=>Ts=>{Ts.stopPropagation();const Yn=Ts.currentTarget;Yn.setPointerCapture(Ts.pointerId);const ot=Ts.clientY;let Pn=0,ra=!1;const Ru=to=>{if(!ra&&Math.abs(to.clientY-ot)>6&&(ra=!0),ra){const Sl=Math.round((ot-to.clientY)/6);Sl!==Pn&&(be((Sl-Pn)*Es),Pn=Sl)}};Yn.addEventListener("pointermove",Ru),Yn.addEventListener("pointerup",()=>{Yn.removeEventListener("pointermove",Ru),ra&&Yn.addEventListener("click",to=>{to.stopPropagation(),to.preventDefault()},{once:!0,capture:!0})},{once:!0})},jt=(be,Es,Ts,Yn)=>Ie(be)?a.jsx("input",{autoFocus:!0,defaultValue:Es.replace(":",""),onFocus:ot=>ot.target.select(),className:"w-14 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded",onBlur:ot=>yu(u,g,be,ot.target.value),onKeyDown:ot=>{ot.key==="Enter"&&ot.target.blur(),ot.key==="Escape"&&vs(null)},onClick:ot=>ot.stopPropagation()}):a.jsx("span",{className:"text-[13px] font-black text-blue-800 tabular-nums cursor-pointer",title:"탭: 직접 입력 / 드래그: 조절",onPointerDown:nn(Ts,Yn),onClick:ot=>{ot.stopPropagation(),vs({pId:f.id,field:be})},children:Es}),Te=Ie("sail")?a.jsx("input",{autoFocus:!0,defaultValue:X,onFocus:be=>be.target.select(),className:"w-10 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded",onBlur:be=>yu(u,g,"sail",be.target.value),onKeyDown:be=>{be.key==="Enter"&&be.target.blur(),be.key==="Escape"&&vs(null)},onClick:be=>be.stopPropagation(),placeholder:"분"}):a.jsx("span",{className:"text-[13px] font-black text-blue-800 tabular-nums cursor-pointer",title:"탭: 분 단위 입력 / 드래그: 조절",onPointerDown:nn(be=>gu(u,g,be),30),onClick:be=>{be.stopPropagation(),vs({pId:f.id,field:"sail"})},children:Pt(X)});return a.jsxs("div",{className:"flex gap-2 select-none",children:[a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-blue-50/80 border border-blue-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-blue-400 font-black tracking-widest uppercase",children:"선적"}),a.jsxs("div",{className:"flex items-center gap-1 text-[13px] font-black text-blue-800 tabular-nums",children:[jt("load",f.time||"00:00",be=>xl(u,g,be)),a.jsx("span",{className:"text-blue-400",children:"-"}),jt("loadEnd",Pt(U),be=>mu(u,g,be))]})]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-sky-50/80 border border-sky-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-sky-400 font-black tracking-widest uppercase",children:"출항"}),jt("depart",Pt(U),be=>mu(u,g,be))]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-indigo-50/80 border border-indigo-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-indigo-400 font-black tracking-widest uppercase",children:"소요"}),Te]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-violet-50/80 border border-violet-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-violet-500 font-black tracking-widest uppercase",children:"하선"}),jt("disembark",re,be=>gu(u,g,be),30)]})]})})()]}):O?a.jsxs("div",{className:"flex flex-col gap-2 py-0.5",onClick:R=>R.stopPropagation(),children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx(hc,{size:11,className:"text-indigo-400 shrink-0"}),a.jsx("input",{value:f.activity,onChange:R=>wl(u,g,R.target.value),onFocus:R=>R.target.select(),className:"flex-1 min-w-0 bg-transparent text-[15px] font-black text-indigo-900 leading-tight focus:outline-none truncate",onClick:R=>R.stopPropagation(),placeholder:"숙소 이름"})]}),a.jsxs("button",{type:"button",onClick:R=>{var U;R.stopPropagation(),Oe(f.activity,((U=f.receipt)==null?void 0:U.address)||f.address||"")},className:"flex items-center gap-2 text-slate-500 bg-white w-fit max-w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left",title:"네이버 지도에서 장소 검색",children:[a.jsx(cr,{size:12,className:"text-[#3182F6] shrink-0"}),a.jsx("span",{className:"text-[11px] font-bold truncate",children:((Rt=f.receipt)==null?void 0:Rt.address)||"주소 정보 없음"})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsxs("div",{className:"relative overflow-hidden flex-1 bg-indigo-50/70 rounded-xl border border-indigo-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]",children:[a.jsx("span",{className:"pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[56px] font-black tracking-[0.08em] text-indigo-200/55 select-none",children:"IN"}),a.jsx("div",{className:"flex items-center justify-center gap-1.5",children:(()=>{const[R="00",U="00"]=(f.time||"00:00").split(":"),X=parseInt(R,10),re=parseInt(U,10);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ie=>{Ie.stopPropagation(),Yo(u,g,1)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900",children:String(isNaN(X)?0:X).padStart(2,"0")}),a.jsx("button",{onClick:Ie=>{Ie.stopPropagation(),Yo(u,g,-1)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(yn,{size:11})})]}),a.jsx("span",{className:"text-[16px] font-black text-indigo-900",children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ie=>{Ie.stopPropagation(),Zo(u,g,qt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900",children:String(isNaN(re)?0:re).padStart(2,"0")}),a.jsx("button",{onClick:Ie=>{Ie.stopPropagation(),Zo(u,g,-qt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(yn,{size:11})})]})]})})()})]}),a.jsxs("div",{className:"relative overflow-hidden flex-1 bg-violet-50/70 rounded-xl border border-violet-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]",children:[a.jsx("span",{className:"pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[52px] font-black tracking-[0.06em] text-violet-200/55 select-none",children:"OUT"}),a.jsx("div",{className:"flex items-center justify-center gap-1.5",children:(()=>{var Te;const R=H.days[u+1],U=(Te=R==null?void 0:R.plan)==null?void 0:Te[0],X=U&&U.type!=="backup"?ie(U.time)-i(U.travelTimeOverride,hn)-i(U.bufferTimeOverride,Xt):ie(f.time||"00:00")+(f.duration||0),[re="00",Ie="00"]=Pt(X).split(":"),nn=parseInt(re,10),jt=parseInt(Ie,10);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:be=>{be.stopPropagation(),U&&U.type!=="backup"&&ws(u+1,0,-60)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900",children:String(isNaN(nn)?0:nn).padStart(2,"0")}),a.jsx("button",{onClick:be=>{be.stopPropagation(),U&&U.type!=="backup"&&ws(u+1,0,60)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(yn,{size:11})})]}),a.jsx("span",{className:"text-[16px] font-black text-violet-900",children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:be=>{be.stopPropagation(),U&&U.type!=="backup"&&ws(u+1,0,-qt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900",children:String(isNaN(jt)?0:jt).padStart(2,"0")}),a.jsx("button",{onClick:be=>{be.stopPropagation(),U&&U.type!=="backup"&&ws(u+1,0,qt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(yn,{size:11})})]})]})})()})]})]}),a.jsx("input",{value:f.memo||"",onChange:R=>pu(u,g,R.target.value),className:"w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all",placeholder:"메모를 입력하세요..."})]}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:a.jsx("div",{className:`flex items-center gap-1 flex-wrap cursor-grab active:cursor-grabbing rounded-lg px-1 py-0.5 -ml-1 transition-colors ${(bt==null?void 0:bt.dayIdx)===u&&(bt==null?void 0:bt.pIdx)===g?"bg-blue-50 ring-1 ring-[#3182F6]/30":"hover:bg-slate-100/60"}`,title:"클릭하여 태그 편집",onClick:R=>{R.stopPropagation(),er(U=>(U==null?void 0:U.dayIdx)===u&&(U==null?void 0:U.pIdx)===g?null:{dayIdx:u,pIdx:g})},children:P})}),(bt==null?void 0:bt.dayIdx)===u&&(bt==null?void 0:bt.pIdx)===g&&a.jsx("div",{className:"-mt-1 mb-0.5",onClick:R=>R.stopPropagation(),children:a.jsx(fc,{title:"태그",value:f.types||["place"],onChange:R=>dm(u,g,R)})}),a.jsx("div",{className:"w-full flex items-center gap-2",onClick:R=>R.stopPropagation(),children:a.jsx("input",{value:f.activity,onChange:R=>wl(u,g,R.target.value),onFocus:R=>R.target.select(),onKeyDown:async R=>{if(R.key==="Enter"&&f.activity.trim()){R.preventDefault(),ne("주소 검색 중...");const U=await Ss(f.activity,ze);U!=null&&U.address?(_l(u,g,U.address),ne(`주소 자동 입력: ${U.address}`)):ne("주소를 찾을 수 없습니다.")}},className:"flex-1 bg-transparent text-xl font-black text-slate-800 truncate leading-tight focus:outline-none focus:border-b focus:border-slate-300 transition-colors min-w-0",placeholder:"일정 이름 입력 후 Enter"})}),(()=>{var X;let R=!1;const U=async()=>{var re;if(!(R||!((re=f.activity)!=null&&re.trim()))){R=!0;try{const Ie=await Ss(f.activity,ze);Ie!=null&&Ie.address&&_l(u,g,Ie.address)}catch{}finally{R=!1}}};return a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-white w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm",onClick:re=>re.stopPropagation(),children:[a.jsx("button",{type:"button",title:"내 장소 정렬 기준 설정",onClick:re=>{var Ie;re.stopPropagation(),kn({id:f.id,name:f.activity,address:((Ie=f.receipt)==null?void 0:Ie.address)||""}),ne(`'${f.activity}'을(를) 거리 계산 기준으로 설정했습니다.`)},className:"shrink-0 transition-colors hover:bg-amber-50 p-1 -ml-1 rounded-md",children:a.jsx(cr,{size:12,className:(Ne==null?void 0:Ne.id)===f.id?"text-amber-500":"text-[#3182F6]"})}),a.jsx("input",{value:((X=f.receipt)==null?void 0:X.address)||"",onChange:re=>_l(u,g,re.target.value),placeholder:"주소 정보 없음",className:"flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-300"}),a.jsx("button",{type:"button",onClick:re=>{var Ie;re.stopPropagation(),Oe(f.activity,((Ie=f.receipt)==null?void 0:Ie.address)||f.address||"")},title:"네이버 지도에서 장소 검색",className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:a.jsx(Jr,{size:9})}),a.jsx("button",{type:"button",onClick:re=>{re.stopPropagation(),U()},title:"일정 이름으로 주소 자동 검색",className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:a.jsx(ai,{size:9})})]})})(),G&&a.jsx("button",{type:"button",onClick:R=>{R.stopPropagation(),G.includes("운영 시작 전 방문")&&sm(u,g)},className:"w-full px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[10px] font-black text-left hover:bg-red-100/80 transition-colors",title:G.includes("운영 시작 전 방문")?"클릭하면 운영 시작 시간으로 보정합니다.":void 0,children:G}),f._timingConflict&&a.jsx("div",{className:"w-full px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black text-left",title:"고정/잠금 조건 때문에 자동 보정이 불가능한 구간입니다.",children:"시간 충돌: 고정/잠금 조건으로 자동 계산 불가"}),a.jsxs("div",{className:"w-full bg-slate-50/60 border border-slate-200 rounded-lg py-1.5 px-2.5",onClick:R=>R.stopPropagation(),children:[a.jsx("button",{type:"button",onClick:()=>Bo(R=>(R==null?void 0:R.dayIdx)===u&&(R==null?void 0:R.pIdx)===g?null:{dayIdx:u,pIdx:g}),className:"w-full flex items-center gap-2 text-left",children:Xo(f.business)==="미설정"?a.jsx("span",{className:"text-[10px] font-bold text-slate-400",children:"영업 정보 (선택)"}):a.jsx("span",{className:"text-[10px] font-bold text-slate-600 truncate flex-1",children:Xo(f.business)})}),(ys==null?void 0:ys.dayIdx)===u&&(ys==null?void 0:ys.pIdx)===g&&a.jsxs("div",{className:"mt-1.5",children:[a.jsx("p",{className:"text-[9px] text-slate-400 font-semibold mb-1.5",children:"현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다."}),a.jsx(pc,{business:f.business||{},onChange:R=>um(u,g,R)})]})]}),a.jsx("div",{onClick:R=>R.stopPropagation(),children:a.jsx("input",{value:f.memo||"",onChange:R=>pu(u,g,R.target.value),className:"w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all",placeholder:"메모를 입력하세요..."})})]})})]}),f.type!=="backup"&&a.jsxs("div",{className:"mx-3 mb-3 mt-1.5 rounded-2xl overflow-hidden border border-slate-100/80",onClick:R=>R.stopPropagation(),children:[w&&a.jsxs("div",{className:"px-5 py-4 animate-in slide-in-from-top-1 bg-white border-b border-slate-100 border-dashed",children:[((Yt=f.types)==null?void 0:Yt.includes("ship"))&&a.jsxs("div",{className:"bg-blue-50/80 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-slate-600 font-bold flex flex-col gap-1.5",children:[((gn=(mn=f.receipt)==null?void 0:mn.shipDetails)==null?void 0:gn.loading)&&a.jsxs("div",{children:["🚗 선적 가능: ",a.jsx("span",{className:"text-red-500",children:f.receipt.shipDetails.loading})]}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("span",{children:"🧍 승선:"}),a.jsx("input",{value:((eo=(Zi=f.receipt)==null?void 0:Zi.shipDetails)==null?void 0:eo.boarding)||"",onChange:R=>{R.stopPropagation(),ae(U=>{const X=JSON.parse(JSON.stringify(U)),re=X.days[u].plan[g];return re.receipt||(re.receipt={}),re.receipt.shipDetails||(re.receipt.shipDetails={}),re.receipt.shipDetails.boarding=R.target.value,X})},onClick:R=>R.stopPropagation(),placeholder:"승선 가능 시간 입력",className:"flex-1 bg-transparent outline-none text-slate-700 font-bold focus:border-b focus:border-blue-300"})]})]}),a.jsxs("div",{className:"space-y-3 mb-3",children:[a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold -mb-1",children:"메뉴명/수량/가격을 직접 수정하면 총액이 자동 계산됩니다."}),(Pu=(Cu=f.receipt)==null?void 0:Cu.items)==null?void 0:Pu.map((R,U)=>a.jsxs("div",{className:"flex justify-between items-center text-xs group/item",children:[a.jsxs("div",{className:"flex items-center gap-2 flex-1",children:[a.jsx("div",{className:"cursor-pointer text-slate-300 hover:text-[#3182F6]",onClick:X=>{X.stopPropagation(),Gi(u,g,U,"toggle")},children:R.selected?a.jsx(i1,{size:14,className:"text-[#3182F6]"}):a.jsx(a1,{size:14})}),a.jsx("input",{value:R.name,onChange:X=>Gi(u,g,U,"name",X.target.value),onClick:X=>X.stopPropagation(),className:"bg-transparent border-none outline-none text-slate-700 font-bold w-full"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"number",value:R.price,onChange:X=>{X.stopPropagation(),Gi(u,g,U,"price",X.target.value)},onClick:X=>X.stopPropagation(),className:"w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none focus:border-b focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}),a.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm",children:[a.jsx("button",{onClick:X=>{X.stopPropagation(),Gi(u,g,U,"qty",-1)},children:a.jsx(Qr,{size:10})}),a.jsx("span",{className:"w-4 text-center text-[10px]",children:or(R)}),a.jsx("button",{onClick:X=>{X.stopPropagation(),Gi(u,g,U,"qty",1)},children:a.jsx(ks,{size:10})})]}),a.jsxs("span",{className:"w-20 text-right font-black text-[#3182F6]",children:["₩",fn(R).toLocaleString()]}),a.jsx("button",{onClick:X=>{X.stopPropagation(),fm(u,g,U)},className:"text-slate-300 hover:text-red-500",children:a.jsx(Ul,{size:12})})]})]},U))]}),a.jsx("button",{onClick:R=>{R.stopPropagation(),hm(u,g)},className:"w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white transition-all",children:"+ 메뉴 추가"})]}),a.jsxs("div",{onClick:R=>{R.stopPropagation(),bu(f.id)},className:`mt-auto px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${w?"bg-blue-50/50 border-t border-blue-100/60":"bg-[#FAFBFC] hover:bg-slate-50/80"}`,children:[a.jsx("div",{className:"flex flex-col gap-0.5 text-left",children:a.jsxs("span",{className:"text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.15em] flex items-center gap-1.5",children:["Total Estimated Cost ",a.jsx(yn,{size:12,className:`transition-transform duration-300 ${w?"rotate-180 text-[#3182F6]":""}`})]})}),a.jsx("div",{className:"flex items-center gap-2",children:a.jsxs("span",{className:`text-[21px] font-black tabular-nums transition-colors ${w?"text-[#3182F6]":"text-slate-800"}`,children:["₩",Number(f.price||0).toLocaleString()]})})]})]})]})]}),g===c.plan.length-1&&f.type!=="backup"&&(Re||Y!==null)&&(()=>{const R=(nt==null?void 0:nt.dayIdx)===u&&(nt==null?void 0:nt.insertAfterPIdx)===g,U=R&&Re?uu(Re,u,g):"";return a.jsx("div",{className:"relative w-full pt-6 pb-2 -mb-4 z-10 cursor-copy","data-droptarget":`${u}-${g}`,onDragOver:X=>{X.preventDefault(),St({dayIdx:u,insertAfterPIdx:g})},onDragLeave:X=>{X.currentTarget.contains(X.relatedTarget)||St(null)},onDrop:X=>{X.preventDefault(),Re?(Il(u,g,Re.types,Re),ln||ar(Re.id)):(Y==null?void 0:Y.altIdx)!==void 0?El(u,g,Y.dayIdx,Y.pIdx,Y.altIdx):Y&&Y.altIdx===void 0&&Tl(u,g,Y.dayIdx,Y.pIdx,ln,Y.planPos),Kt(null),Et(null),St(null),cn(!1)},children:a.jsxs("div",{className:`w-full flex items-center justify-center gap-2 rounded-[28px] border-2 border-dashed transition-all duration-300 text-[12px] font-black ${R?U?"h-32 border-orange-500 bg-orange-50/80 text-orange-600 shadow-[0_12px_30px_-10px_rgba(251,146,60,0.55)] scale-[1.02]":"h-32 border-[#3182F6] bg-blue-50/80 text-[#3182F6] shadow-[0_12px_30px_-10px_rgba(49,130,246,0.55)] scale-[1.02]":"h-24 border-slate-300 bg-slate-50/40 text-slate-400 hover:border-slate-400"}`,children:[a.jsx($l,{size:14,className:"animate-pulse"})," ",R&&U?U:"이곳에 일정 추가"]})})})(),g<c.plan.length-1&&a.jsx("div",{className:"flex items-center pt-3 pb-0 -mb-3 relative w-full",children:(()=>{const R=c.plan[g+1];if(!R)return null;if(Re||Y!==null){const U=(nt==null?void 0:nt.dayIdx)===u&&(nt==null?void 0:nt.insertAfterPIdx)===g,X=U&&Re?uu(Re,u,g):"";return a.jsx("div",{className:"z-10 w-full pt-6 pb-2 -mb-4 cursor-copy","data-droptarget":`${u}-${g}`,onDragOver:re=>{re.preventDefault(),St({dayIdx:u,insertAfterPIdx:g})},onDragLeave:re=>{re.currentTarget.contains(re.relatedTarget)||St(null)},onDrop:re=>{re.preventDefault(),Re?(Il(u,g,Re.types,Re),ln||ar(Re.id)):(Y==null?void 0:Y.altIdx)!==void 0?El(u,g,Y.dayIdx,Y.pIdx,Y.altIdx):Y&&Y.altIdx===void 0&&Tl(u,g,Y.dayIdx,Y.pIdx,ln,Y.planPos),Kt(null),Et(null),St(null),cn(!1)},children:a.jsxs("div",{className:`w-full flex items-center justify-center gap-2 rounded-[28px] border-2 border-dashed transition-all duration-300 text-[12px] font-black ${U?X?"h-32 border-orange-500 bg-orange-50/80 text-orange-600 shadow-[0_12px_30px_-10px_rgba(251,146,60,0.55)] scale-[1.02]":"h-32 border-[#3182F6] bg-blue-50/80 text-[#3182F6] shadow-[0_12px_30px_-10px_rgba(49,130,246,0.55)] scale-[1.02]":"h-24 border-slate-300 bg-slate-50/40 text-slate-400 hover:border-slate-400"}`,children:[a.jsx($l,{size:14,className:"animate-pulse"})," ",U&&X?X:"이곳에 일정 추가"]})})}return a.jsx("div",{className:"z-10 flex items-center justify-center w-full",children:a.jsxs("div",{className:"my-2 flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2",children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:U=>{U.stopPropagation(),ea(u,g+1,-qt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Qr,{size:10})}),a.jsx("span",{className:`min-w-[3rem] text-center tracking-tight text-xs font-black ${R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto?"text-[#3182F6] cursor-pointer":"text-slate-800"}`,onClick:U=>{U.stopPropagation(),R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto&&hu(u,g+1)},title:R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto?"클릭하여 경로 계산 시간으로 초기화":void 0,children:R.travelTimeOverride||"15분"}),a.jsx("button",{onClick:U=>{U.stopPropagation(),ea(u,g+1,qt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(ks,{size:10})})]}),a.jsxs("button",{type:"button",className:"flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors",title:"구간 거리",onClick:U=>{U.stopPropagation();const X=ve(f,"from"),re=ve(R,"to");if(!X||!re){ne("길찾기용 출발/도착 주소가 필요합니다.");return}it(f.activity||"출발지",X,R.activity||"도착지",re)},children:[a.jsx(Jr,{size:11}),a.jsx("span",{children:D(R.distance)})]}),(()=>{const U=`${u}_${g+1}`,X=tr===U;return a.jsxs("button",{onClick:re=>{re.stopPropagation(),Yi(u,g+1)},disabled:!!tr,className:`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${X?"bg-slate-100 text-slate-400 border-slate-200":"bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]"}`,children:[a.jsx(ai,{size:10})," ",X?"계산중":"자동경로"]})})(),a.jsx("div",{className:"w-px h-4 bg-slate-200 mx-0.5"}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:U=>{U.stopPropagation(),ws(u,g+1,-vt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Qr,{size:10})}),a.jsx("span",{className:"min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500",children:R.bufferTimeOverride||"10분"}),a.jsx("button",{onClick:U=>{U.stopPropagation(),ws(u,g+1,vt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(ks,{size:10})})]})]})})})()})]},f.id)})})})]}),fs&&a.jsx("div",{className:"fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] animate-in",children:a.jsxs("div",{className:"flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]",children:[a.jsx("span",{className:"text-[12px] font-bold",children:fl||"변경 사항이 저장되었습니다"}),a.jsx("button",{onClick:()=>{im(),Nr(!1)},className:"text-[11px] font-black text-[#3182F6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-100",children:"되돌리기"}),a.jsx("button",{onClick:()=>Nr(!1),className:"text-slate-300 hover:text-slate-500 transition-colors ml-1",children:"✕"})]})}),I&&a.jsx("div",{className:"fixed top-4 right-4 z-[220] animate-in slide-in-from-right-4 fade-in duration-500",children:a.jsxs("div",{className:"bg-white border border-slate-200 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)] rounded-[20px] overflow-hidden w-[300px]",children:[a.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-slate-100",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-2 h-2 rounded-full bg-[#3182F6] animate-pulse"}),a.jsx("span",{className:"text-[11px] font-black text-slate-700 tracking-widest uppercase",children:"업데이트 노트"})]}),a.jsx("button",{onClick:()=>A(null),className:"w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors",children:a.jsx(Xr,{size:13})})]}),a.jsx("div",{className:"px-4 py-3 flex flex-col gap-2.5",children:_1.map((c,u)=>a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx("span",{className:`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-md leading-tight border ${c.tag==="FIX"?"bg-red-50 text-red-500 border-red-100":c.tag==="FEAT"?"bg-blue-50 text-[#3182F6] border-blue-100":"bg-emerald-50 text-emerald-600 border-emerald-100"}`,children:c.tag}),a.jsxs("div",{className:"flex flex-col gap-0.5 flex-1 min-w-0",children:[a.jsx("span",{className:"text-[11px] font-bold text-slate-700 leading-tight",children:c.msg}),a.jsxs("span",{className:"text-[9px] font-bold text-slate-400 tabular-nums",children:["03.",c.date.split(".")[1]," · ",c.time]})]})]},u))}),a.jsxs("div",{className:"px-4 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between",children:[a.jsxs("span",{className:"text-[9px] font-bold text-slate-400 tabular-nums",children:[I.timeText," 적용"]}),a.jsx("span",{className:"text-[9px] font-black text-[#3182F6]",children:"anti_planer"})]})]})}),Y&&a.jsx("div",{className:"fixed left-1/2 -translate-x-1/2 bottom-4 z-[230] w-[min(680px,94vw)]",children:a.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[a.jsxs("div",{"data-drag-action":"move_to_library",onDragOver:c=>{c.preventDefault(),Jt("move_to_library")},onDragLeave:()=>Jt(c=>c==="move_to_library"?"":c),onDrop:c=>{var y,f,g;c.preventDefault();const u=Y;if(u){if(u.altIdx!==void 0)Ki(u.dayIdx,u.pIdx,u.altIdx);else{const w=(g=(f=(y=H.days)==null?void 0:y[u.dayIdx])==null?void 0:f.plan)==null?void 0:g[u.pIdx];Xi(u.dayIdx,u.pIdx,askPlanBMoveMode(w))}Wr(),Jt(""),Et(null)}},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Gs==="move_to_library"?"border-[#3182F6] bg-blue-50 text-[#3182F6]":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx(ao,{size:13}),"내장소로 이동"]}),a.jsxs("div",{"data-drag-action":"delete",onDragOver:c=>{c.preventDefault(),Jt("delete")},onDragLeave:()=>Jt(c=>c==="delete"?"":c),onDrop:c=>{c.preventDefault();const u=Y;u&&(u.altIdx===void 0&&(Ji(u.dayIdx,u.pIdx),Wr()),Jt(""),Et(null))},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Gs==="delete"?"border-red-400 bg-red-50 text-red-500":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx(Ul,{size:13}),"삭제"]}),a.jsxs("div",{"data-drag-action":"copy_to_library",onDragOver:c=>{c.preventDefault(),Jt("copy_to_library")},onDragLeave:()=>Jt(c=>c==="copy_to_library"?"":c),onDrop:c=>{c.preventDefault();const u=Y;u&&(u.altIdx!==void 0?xu(u.dayIdx,u.pIdx,u.altIdx):vu(u.dayIdx,u.pIdx),Wr(),Jt(""),Et(null))},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Gs==="copy_to_library"?"border-emerald-400 bg-emerald-50 text-emerald-600":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx($l,{size:13}),"내장소로 복제"]})]})}),(Re||Y)&&a.jsxs("div",{ref:Ci,className:"fixed pointer-events-none z-[9999] bg-white/95 backdrop-blur-xl border-2 border-[#3182F6] rounded-2xl px-5 py-3.5 shadow-[0_20px_50px_rgba(49,130,246,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-200",style:{left:0,top:0,transform:`translate3d(${Vo.x}px, ${Vo.y}px, 0) translate(-50%, -120%)`,minWidth:"180px",willChange:"transform"},children:[a.jsx("div",{className:"w-1.5 h-10 bg-gradient-to-b from-[#3182F6] to-indigo-500 rounded-full shrink-0"}),a.jsxs("div",{className:"flex flex-col gap-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-[#3182F6] uppercase tracking-[0.15em]",children:"Dragging Object"}),a.jsx("span",{className:"text-[15px] font-black text-slate-800 truncate max-w-[140px]",children:(Re==null?void 0:Re.name)||((Nu=(Su=(ku=(Au=H.days)==null?void 0:Au[Y==null?void 0:Y.dayIdx])==null?void 0:ku.plan)==null?void 0:Su[Y==null?void 0:Y.pIdx])==null?void 0:Nu.activity)||"일정 이동 중"})]})]})]}),a.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;600;700;900&display=swap');
        body { font-family: 'Pretendard', -apple-system, sans-serif; letter-spacing: -0.02em; margin: 0; background-color: #F2F4F6; }
        .animate-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        /* input number 스피너 숨기기 */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `})]})]})},P1=()=>a.jsx(g1,{children:a.jsx(A1,{})});export{P1 as default};
