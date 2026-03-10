import{r as U,j as a,R as Et}from"./index-DRqEB504.js";const wm=()=>{};var Vu={};/**
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
 */const bh=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},Em=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const o=n[t++];e[s++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=n[t++],l=n[t++],h=n[t++],p=((r&7)<<18|(o&63)<<12|(l&63)<<6|h&63)-65536;e[s++]=String.fromCharCode(55296+(p>>10)),e[s++]=String.fromCharCode(56320+(p&1023))}else{const o=n[t++],l=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(o&63)<<6|l&63)}}return e.join("")},vh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const o=n[r],l=r+1<n.length,h=l?n[r+1]:0,p=r+2<n.length,b=p?n[r+2]:0,v=o>>2,I=(o&3)<<4|h>>4;let k=(h&15)<<2|b>>6,F=b&63;p||(F=64,l||(k=64)),s.push(t[v],t[I],t[k],t[F])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(bh(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Em(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const o=t[n.charAt(r++)],h=r<n.length?t[n.charAt(r)]:0;++r;const b=r<n.length?t[n.charAt(r)]:64;++r;const I=r<n.length?t[n.charAt(r)]:64;if(++r,o==null||h==null||b==null||I==null)throw new Tm;const k=o<<2|h>>4;if(s.push(k),b!==64){const F=h<<4&240|b>>2;if(s.push(F),I!==64){const B=b<<6&192|I;s.push(B)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Tm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Im=function(n){const e=bh(n);return vh.encodeByteArray(e,!0)},ka=function(n){return Im(n).replace(/\./g,"")},xh=function(n){try{return vh.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function km(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Am=()=>km().__FIREBASE_DEFAULTS__,Nm=()=>{if(typeof process>"u"||typeof Vu>"u")return;const n=Vu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Sm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&xh(n[1]);return e&&JSON.parse(e)},Ka=()=>{try{return wm()||Am()||Nm()||Sm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},_h=n=>{var e,t;return(t=(e=Ka())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Cm=n=>{const e=_h(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},wh=()=>{var n;return(n=Ka())===null||n===void 0?void 0:n.config},Eh=n=>{var e;return(e=Ka())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */function gi(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Th(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function Rm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}}},n);return[ka(JSON.stringify(t)),ka(JSON.stringify(l)),""].join(".")}const io={};function jm(){const n={prod:[],emulator:[]};for(const e of Object.keys(io))io[e]?n.emulator.push(e):n.prod.push(e);return n}function Dm(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Mu=!1;function Ih(n,e){if(typeof window>"u"||typeof document>"u"||!gi(window.location.host)||io[n]===e||io[n]||Mu)return;io[n]=e;function t(k){return`__firebase__banner__${k}`}const s="__firebase__banner",o=jm().prod.length>0;function l(){const k=document.getElementById(s);k&&k.remove()}function h(k){k.style.display="flex",k.style.background="#7faaf0",k.style.position="fixed",k.style.bottom="5px",k.style.left="5px",k.style.padding=".5em",k.style.borderRadius="5px",k.style.alignItems="center"}function p(k,F){k.setAttribute("width","24"),k.setAttribute("id",F),k.setAttribute("height","24"),k.setAttribute("viewBox","0 0 24 24"),k.setAttribute("fill","none"),k.style.marginLeft="-6px"}function b(){const k=document.createElement("span");return k.style.cursor="pointer",k.style.marginLeft="16px",k.style.fontSize="24px",k.innerHTML=" &times;",k.onclick=()=>{Mu=!0,l()},k}function v(k,F){k.setAttribute("id",F),k.innerText="Learn more",k.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",k.setAttribute("target","__blank"),k.style.paddingLeft="5px",k.style.textDecoration="underline"}function I(){const k=Dm(s),F=t("text"),B=document.getElementById(F)||document.createElement("span"),X=t("learnmore"),J=document.getElementById(X)||document.createElement("a"),xe=t("preprendIcon"),ae=document.getElementById(xe)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(k.created){const pe=k.element;h(pe),v(J,X);const de=b();p(ae,xe),pe.append(ae,B,J,de),document.body.appendChild(pe)}o?(B.innerText="Preview backend disconnected.",ae.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(ae.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,B.innerText="Preview backend running in this workspace."),B.setAttribute("id",F)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",I):I()}/**
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
 */function Ot(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Om(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ot())}function Vm(){var n;const e=(n=Ka())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Mm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Lm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function $m(){const n=Ot();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Um(){return!Vm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Bm(){try{return typeof indexedDB=="object"}catch{return!1}}function zm(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var o;e(((o=r.error)===null||o===void 0?void 0:o.message)||"")}}catch(t){e(t)}})}/**
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
 */const qm="FirebaseError";class us extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=qm,Object.setPrototypeOf(this,us.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,xo.prototype.create)}}class xo{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,o=this.errors[e],l=o?Hm(o,s):"Error",h=`${this.serviceName}: ${l} (${r}).`;return new us(r,h,s)}}function Hm(n,e){return n.replace(Wm,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Wm=/\{\$([^}]+)}/g;function Gm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function br(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const o=n[r],l=e[r];if(Fu(o)&&Fu(l)){if(!br(o,l))return!1}else if(o!==l)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function Fu(n){return n!==null&&typeof n=="object"}/**
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
 */function _o(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Km(n,e){const t=new Jm(n,e);return t.subscribe.bind(t)}class Jm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Qm(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=Nl),r.error===void 0&&(r.error=Nl),r.complete===void 0&&(r.complete=Nl);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Qm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Nl(){}/**
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
 */function Ht(n){return n&&n._delegate?n._delegate:n}class vr{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const hr="[DEFAULT]";/**
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
 */class Xm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Pm;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Zm(e))try{this.getOrInitializeService({instanceIdentifier:hr})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:r});s.resolve(o)}catch{}}}}clearInstance(e=hr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=hr){return this.instances.has(e)}getOptions(e=hr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[o,l]of this.instancesDeferred.entries()){const h=this.normalizeInstanceIdentifier(o);s===h&&l.resolve(r)}return r}onInit(e,t){var s;const r=this.normalizeInstanceIdentifier(t),o=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;o.add(e),this.onInitCallbacks.set(r,o);const l=this.instances.get(r);return l&&e(l,r),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Ym(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=hr){return this.component?this.component.multipleInstances?e:hr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ym(n){return n===hr?void 0:n}function Zm(n){return n.instantiationMode==="EAGER"}/**
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
 */var Ae;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Ae||(Ae={}));const tg={debug:Ae.DEBUG,verbose:Ae.VERBOSE,info:Ae.INFO,warn:Ae.WARN,error:Ae.ERROR,silent:Ae.SILENT},ng=Ae.INFO,sg={[Ae.DEBUG]:"log",[Ae.VERBOSE]:"log",[Ae.INFO]:"info",[Ae.WARN]:"warn",[Ae.ERROR]:"error"},rg=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=sg[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yc{constructor(e){this.name=e,this._logLevel=ng,this._logHandler=rg,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ae))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?tg[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ae.DEBUG,...e),this._logHandler(this,Ae.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ae.VERBOSE,...e),this._logHandler(this,Ae.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ae.INFO,...e),this._logHandler(this,Ae.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ae.WARN,...e),this._logHandler(this,Ae.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ae.ERROR,...e),this._logHandler(this,Ae.ERROR,...e)}}const ig=(n,e)=>e.some(t=>n instanceof t);let Lu,$u;function og(){return Lu||(Lu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ag(){return $u||($u=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const kh=new WeakMap,Bl=new WeakMap,Ah=new WeakMap,Sl=new WeakMap,bc=new WeakMap;function lg(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",o),n.removeEventListener("error",l)},o=()=>{t(Os(n.result)),r()},l=()=>{s(n.error),r()};n.addEventListener("success",o),n.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&kh.set(t,n)}).catch(()=>{}),bc.set(e,n),e}function cg(n){if(Bl.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",l),n.removeEventListener("abort",l)},o=()=>{t(),r()},l=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",o),n.addEventListener("error",l),n.addEventListener("abort",l)});Bl.set(n,e)}let zl={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Bl.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ah.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Os(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ug(n){zl=n(zl)}function dg(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(Cl(this),e,...t);return Ah.set(s,e.sort?e.sort():[e]),Os(s)}:ag().includes(n)?function(...e){return n.apply(Cl(this),e),Os(kh.get(this))}:function(...e){return Os(n.apply(Cl(this),e))}}function hg(n){return typeof n=="function"?dg(n):(n instanceof IDBTransaction&&cg(n),ig(n,og())?new Proxy(n,zl):n)}function Os(n){if(n instanceof IDBRequest)return lg(n);if(Sl.has(n))return Sl.get(n);const e=hg(n);return e!==n&&(Sl.set(n,e),bc.set(e,n)),e}const Cl=n=>bc.get(n);function fg(n,e,{blocked:t,upgrade:s,blocking:r,terminated:o}={}){const l=indexedDB.open(n,e),h=Os(l);return s&&l.addEventListener("upgradeneeded",p=>{s(Os(l.result),p.oldVersion,p.newVersion,Os(l.transaction),p)}),t&&l.addEventListener("blocked",p=>t(p.oldVersion,p.newVersion,p)),h.then(p=>{o&&p.addEventListener("close",()=>o()),r&&p.addEventListener("versionchange",b=>r(b.oldVersion,b.newVersion,b))}).catch(()=>{}),h}const pg=["get","getKey","getAll","getAllKeys","count"],mg=["put","add","delete","clear"],Pl=new Map;function Uu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Pl.get(e))return Pl.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=mg.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||pg.includes(t)))return;const o=async function(l,...h){const p=this.transaction(l,r?"readwrite":"readonly");let b=p.store;return s&&(b=b.index(h.shift())),(await Promise.all([b[t](...h),r&&p.done]))[0]};return Pl.set(e,o),o}ug(n=>({...n,get:(e,t,s)=>Uu(e,t)||n.get(e,t,s),has:(e,t)=>!!Uu(e,t)||n.has(e,t)}));/**
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
 */class gg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yg(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function yg(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ql="@firebase/app",Bu="0.13.2";/**
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
 */const os=new yc("@firebase/app"),bg="@firebase/app-compat",vg="@firebase/analytics-compat",xg="@firebase/analytics",_g="@firebase/app-check-compat",wg="@firebase/app-check",Eg="@firebase/auth",Tg="@firebase/auth-compat",Ig="@firebase/database",kg="@firebase/data-connect",Ag="@firebase/database-compat",Ng="@firebase/functions",Sg="@firebase/functions-compat",Cg="@firebase/installations",Pg="@firebase/installations-compat",Rg="@firebase/messaging",jg="@firebase/messaging-compat",Dg="@firebase/performance",Og="@firebase/performance-compat",Vg="@firebase/remote-config",Mg="@firebase/remote-config-compat",Fg="@firebase/storage",Lg="@firebase/storage-compat",$g="@firebase/firestore",Ug="@firebase/ai",Bg="@firebase/firestore-compat",zg="firebase",qg="11.10.0";/**
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
 */const Hl="[DEFAULT]",Hg={[ql]:"fire-core",[bg]:"fire-core-compat",[xg]:"fire-analytics",[vg]:"fire-analytics-compat",[wg]:"fire-app-check",[_g]:"fire-app-check-compat",[Eg]:"fire-auth",[Tg]:"fire-auth-compat",[Ig]:"fire-rtdb",[kg]:"fire-data-connect",[Ag]:"fire-rtdb-compat",[Ng]:"fire-fn",[Sg]:"fire-fn-compat",[Cg]:"fire-iid",[Pg]:"fire-iid-compat",[Rg]:"fire-fcm",[jg]:"fire-fcm-compat",[Dg]:"fire-perf",[Og]:"fire-perf-compat",[Vg]:"fire-rc",[Mg]:"fire-rc-compat",[Fg]:"fire-gcs",[Lg]:"fire-gcs-compat",[$g]:"fire-fst",[Bg]:"fire-fst-compat",[Ug]:"fire-vertex","fire-js":"fire-js",[zg]:"fire-js-all"};/**
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
 */const Aa=new Map,Wg=new Map,Wl=new Map;function zu(n,e){try{n.container.addComponent(e)}catch(t){os.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ci(n){const e=n.name;if(Wl.has(e))return os.debug(`There were multiple attempts to register component ${e}.`),!1;Wl.set(e,n);for(const t of Aa.values())zu(t,n);for(const t of Wg.values())zu(t,n);return!0}function vc(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function sn(n){return n==null?!1:n.settings!==void 0}/**
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
 */const Gg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Vs=new xo("app","Firebase",Gg);/**
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
 */class Kg{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new vr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Vs.create("app-deleted",{appName:this._name})}}/**
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
 */const yi=qg;function Nh(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Hl,automaticDataCollectionEnabled:!0},e),r=s.name;if(typeof r!="string"||!r)throw Vs.create("bad-app-name",{appName:String(r)});if(t||(t=wh()),!t)throw Vs.create("no-options");const o=Aa.get(r);if(o){if(br(t,o.options)&&br(s,o.config))return o;throw Vs.create("duplicate-app",{appName:r})}const l=new eg(r);for(const p of Wl.values())l.addComponent(p);const h=new Kg(t,s,l);return Aa.set(r,h),h}function Sh(n=Hl){const e=Aa.get(n);if(!e&&n===Hl&&wh())return Nh();if(!e)throw Vs.create("no-app",{appName:n});return e}function Ms(n,e,t){var s;let r=(s=Hg[n])!==null&&s!==void 0?s:n;t&&(r+=`-${t}`);const o=r.match(/\s|\//),l=e.match(/\s|\//);if(o||l){const h=[`Unable to register library "${r}" with version "${e}":`];o&&h.push(`library name "${r}" contains illegal characters (whitespace or "/")`),o&&l&&h.push("and"),l&&h.push(`version name "${e}" contains illegal characters (whitespace or "/")`),os.warn(h.join(" "));return}ci(new vr(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Jg="firebase-heartbeat-database",Qg=1,ho="firebase-heartbeat-store";let Rl=null;function Ch(){return Rl||(Rl=fg(Jg,Qg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(ho)}catch(t){console.warn(t)}}}}).catch(n=>{throw Vs.create("idb-open",{originalErrorMessage:n.message})})),Rl}async function Xg(n){try{const t=(await Ch()).transaction(ho),s=await t.objectStore(ho).get(Ph(n));return await t.done,s}catch(e){if(e instanceof us)os.warn(e.message);else{const t=Vs.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});os.warn(t.message)}}}async function qu(n,e){try{const s=(await Ch()).transaction(ho,"readwrite");await s.objectStore(ho).put(e,Ph(n)),await s.done}catch(t){if(t instanceof us)os.warn(t.message);else{const s=Vs.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});os.warn(s.message)}}}function Ph(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Yg=1024,Zg=30;class e0{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new n0(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Hu();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(l=>l.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats.length>Zg){const l=s0(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){os.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Hu(),{heartbeatsToSend:s,unsentEntries:r}=t0(this._heartbeatsCache.heartbeats),o=ka(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return os.warn(t),""}}}function Hu(){return new Date().toISOString().substring(0,10)}function t0(n,e=Yg){const t=[];let s=n.slice();for(const r of n){const o=t.find(l=>l.agent===r.agent);if(o){if(o.dates.push(r.date),Wu(t)>e){o.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),Wu(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class n0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Bm()?zm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Xg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return qu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return qu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Wu(n){return ka(JSON.stringify({version:2,heartbeats:n})).length}function s0(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
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
 */function r0(n){ci(new vr("platform-logger",e=>new gg(e),"PRIVATE")),ci(new vr("heartbeat",e=>new e0(e),"PRIVATE")),Ms(ql,Bu,n),Ms(ql,Bu,"esm2017"),Ms("fire-js","")}r0("");var i0="firebase",o0="11.10.0";/**
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
 */Ms(i0,o0,"app");var Gu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Fs,Rh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(j,A){function E(){}E.prototype=A.prototype,j.D=A.prototype,j.prototype=new E,j.prototype.constructor=j,j.C=function(P,N,S){for(var T=Array(arguments.length-2),et=2;et<arguments.length;et++)T[et-2]=arguments[et];return A.prototype[N].apply(P,T)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(j,A,E){E||(E=0);var P=Array(16);if(typeof A=="string")for(var N=0;16>N;++N)P[N]=A.charCodeAt(E++)|A.charCodeAt(E++)<<8|A.charCodeAt(E++)<<16|A.charCodeAt(E++)<<24;else for(N=0;16>N;++N)P[N]=A[E++]|A[E++]<<8|A[E++]<<16|A[E++]<<24;A=j.g[0],E=j.g[1],N=j.g[2];var S=j.g[3],T=A+(S^E&(N^S))+P[0]+3614090360&4294967295;A=E+(T<<7&4294967295|T>>>25),T=S+(N^A&(E^N))+P[1]+3905402710&4294967295,S=A+(T<<12&4294967295|T>>>20),T=N+(E^S&(A^E))+P[2]+606105819&4294967295,N=S+(T<<17&4294967295|T>>>15),T=E+(A^N&(S^A))+P[3]+3250441966&4294967295,E=N+(T<<22&4294967295|T>>>10),T=A+(S^E&(N^S))+P[4]+4118548399&4294967295,A=E+(T<<7&4294967295|T>>>25),T=S+(N^A&(E^N))+P[5]+1200080426&4294967295,S=A+(T<<12&4294967295|T>>>20),T=N+(E^S&(A^E))+P[6]+2821735955&4294967295,N=S+(T<<17&4294967295|T>>>15),T=E+(A^N&(S^A))+P[7]+4249261313&4294967295,E=N+(T<<22&4294967295|T>>>10),T=A+(S^E&(N^S))+P[8]+1770035416&4294967295,A=E+(T<<7&4294967295|T>>>25),T=S+(N^A&(E^N))+P[9]+2336552879&4294967295,S=A+(T<<12&4294967295|T>>>20),T=N+(E^S&(A^E))+P[10]+4294925233&4294967295,N=S+(T<<17&4294967295|T>>>15),T=E+(A^N&(S^A))+P[11]+2304563134&4294967295,E=N+(T<<22&4294967295|T>>>10),T=A+(S^E&(N^S))+P[12]+1804603682&4294967295,A=E+(T<<7&4294967295|T>>>25),T=S+(N^A&(E^N))+P[13]+4254626195&4294967295,S=A+(T<<12&4294967295|T>>>20),T=N+(E^S&(A^E))+P[14]+2792965006&4294967295,N=S+(T<<17&4294967295|T>>>15),T=E+(A^N&(S^A))+P[15]+1236535329&4294967295,E=N+(T<<22&4294967295|T>>>10),T=A+(N^S&(E^N))+P[1]+4129170786&4294967295,A=E+(T<<5&4294967295|T>>>27),T=S+(E^N&(A^E))+P[6]+3225465664&4294967295,S=A+(T<<9&4294967295|T>>>23),T=N+(A^E&(S^A))+P[11]+643717713&4294967295,N=S+(T<<14&4294967295|T>>>18),T=E+(S^A&(N^S))+P[0]+3921069994&4294967295,E=N+(T<<20&4294967295|T>>>12),T=A+(N^S&(E^N))+P[5]+3593408605&4294967295,A=E+(T<<5&4294967295|T>>>27),T=S+(E^N&(A^E))+P[10]+38016083&4294967295,S=A+(T<<9&4294967295|T>>>23),T=N+(A^E&(S^A))+P[15]+3634488961&4294967295,N=S+(T<<14&4294967295|T>>>18),T=E+(S^A&(N^S))+P[4]+3889429448&4294967295,E=N+(T<<20&4294967295|T>>>12),T=A+(N^S&(E^N))+P[9]+568446438&4294967295,A=E+(T<<5&4294967295|T>>>27),T=S+(E^N&(A^E))+P[14]+3275163606&4294967295,S=A+(T<<9&4294967295|T>>>23),T=N+(A^E&(S^A))+P[3]+4107603335&4294967295,N=S+(T<<14&4294967295|T>>>18),T=E+(S^A&(N^S))+P[8]+1163531501&4294967295,E=N+(T<<20&4294967295|T>>>12),T=A+(N^S&(E^N))+P[13]+2850285829&4294967295,A=E+(T<<5&4294967295|T>>>27),T=S+(E^N&(A^E))+P[2]+4243563512&4294967295,S=A+(T<<9&4294967295|T>>>23),T=N+(A^E&(S^A))+P[7]+1735328473&4294967295,N=S+(T<<14&4294967295|T>>>18),T=E+(S^A&(N^S))+P[12]+2368359562&4294967295,E=N+(T<<20&4294967295|T>>>12),T=A+(E^N^S)+P[5]+4294588738&4294967295,A=E+(T<<4&4294967295|T>>>28),T=S+(A^E^N)+P[8]+2272392833&4294967295,S=A+(T<<11&4294967295|T>>>21),T=N+(S^A^E)+P[11]+1839030562&4294967295,N=S+(T<<16&4294967295|T>>>16),T=E+(N^S^A)+P[14]+4259657740&4294967295,E=N+(T<<23&4294967295|T>>>9),T=A+(E^N^S)+P[1]+2763975236&4294967295,A=E+(T<<4&4294967295|T>>>28),T=S+(A^E^N)+P[4]+1272893353&4294967295,S=A+(T<<11&4294967295|T>>>21),T=N+(S^A^E)+P[7]+4139469664&4294967295,N=S+(T<<16&4294967295|T>>>16),T=E+(N^S^A)+P[10]+3200236656&4294967295,E=N+(T<<23&4294967295|T>>>9),T=A+(E^N^S)+P[13]+681279174&4294967295,A=E+(T<<4&4294967295|T>>>28),T=S+(A^E^N)+P[0]+3936430074&4294967295,S=A+(T<<11&4294967295|T>>>21),T=N+(S^A^E)+P[3]+3572445317&4294967295,N=S+(T<<16&4294967295|T>>>16),T=E+(N^S^A)+P[6]+76029189&4294967295,E=N+(T<<23&4294967295|T>>>9),T=A+(E^N^S)+P[9]+3654602809&4294967295,A=E+(T<<4&4294967295|T>>>28),T=S+(A^E^N)+P[12]+3873151461&4294967295,S=A+(T<<11&4294967295|T>>>21),T=N+(S^A^E)+P[15]+530742520&4294967295,N=S+(T<<16&4294967295|T>>>16),T=E+(N^S^A)+P[2]+3299628645&4294967295,E=N+(T<<23&4294967295|T>>>9),T=A+(N^(E|~S))+P[0]+4096336452&4294967295,A=E+(T<<6&4294967295|T>>>26),T=S+(E^(A|~N))+P[7]+1126891415&4294967295,S=A+(T<<10&4294967295|T>>>22),T=N+(A^(S|~E))+P[14]+2878612391&4294967295,N=S+(T<<15&4294967295|T>>>17),T=E+(S^(N|~A))+P[5]+4237533241&4294967295,E=N+(T<<21&4294967295|T>>>11),T=A+(N^(E|~S))+P[12]+1700485571&4294967295,A=E+(T<<6&4294967295|T>>>26),T=S+(E^(A|~N))+P[3]+2399980690&4294967295,S=A+(T<<10&4294967295|T>>>22),T=N+(A^(S|~E))+P[10]+4293915773&4294967295,N=S+(T<<15&4294967295|T>>>17),T=E+(S^(N|~A))+P[1]+2240044497&4294967295,E=N+(T<<21&4294967295|T>>>11),T=A+(N^(E|~S))+P[8]+1873313359&4294967295,A=E+(T<<6&4294967295|T>>>26),T=S+(E^(A|~N))+P[15]+4264355552&4294967295,S=A+(T<<10&4294967295|T>>>22),T=N+(A^(S|~E))+P[6]+2734768916&4294967295,N=S+(T<<15&4294967295|T>>>17),T=E+(S^(N|~A))+P[13]+1309151649&4294967295,E=N+(T<<21&4294967295|T>>>11),T=A+(N^(E|~S))+P[4]+4149444226&4294967295,A=E+(T<<6&4294967295|T>>>26),T=S+(E^(A|~N))+P[11]+3174756917&4294967295,S=A+(T<<10&4294967295|T>>>22),T=N+(A^(S|~E))+P[2]+718787259&4294967295,N=S+(T<<15&4294967295|T>>>17),T=E+(S^(N|~A))+P[9]+3951481745&4294967295,j.g[0]=j.g[0]+A&4294967295,j.g[1]=j.g[1]+(N+(T<<21&4294967295|T>>>11))&4294967295,j.g[2]=j.g[2]+N&4294967295,j.g[3]=j.g[3]+S&4294967295}s.prototype.u=function(j,A){A===void 0&&(A=j.length);for(var E=A-this.blockSize,P=this.B,N=this.h,S=0;S<A;){if(N==0)for(;S<=E;)r(this,j,S),S+=this.blockSize;if(typeof j=="string"){for(;S<A;)if(P[N++]=j.charCodeAt(S++),N==this.blockSize){r(this,P),N=0;break}}else for(;S<A;)if(P[N++]=j[S++],N==this.blockSize){r(this,P),N=0;break}}this.h=N,this.o+=A},s.prototype.v=function(){var j=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);j[0]=128;for(var A=1;A<j.length-8;++A)j[A]=0;var E=8*this.o;for(A=j.length-8;A<j.length;++A)j[A]=E&255,E/=256;for(this.u(j),j=Array(16),A=E=0;4>A;++A)for(var P=0;32>P;P+=8)j[E++]=this.g[A]>>>P&255;return j};function o(j,A){var E=h;return Object.prototype.hasOwnProperty.call(E,j)?E[j]:E[j]=A(j)}function l(j,A){this.h=A;for(var E=[],P=!0,N=j.length-1;0<=N;N--){var S=j[N]|0;P&&S==A||(E[N]=S,P=!1)}this.g=E}var h={};function p(j){return-128<=j&&128>j?o(j,function(A){return new l([A|0],0>A?-1:0)}):new l([j|0],0>j?-1:0)}function b(j){if(isNaN(j)||!isFinite(j))return I;if(0>j)return J(b(-j));for(var A=[],E=1,P=0;j>=E;P++)A[P]=j/E|0,E*=4294967296;return new l(A,0)}function v(j,A){if(j.length==0)throw Error("number format error: empty string");if(A=A||10,2>A||36<A)throw Error("radix out of range: "+A);if(j.charAt(0)=="-")return J(v(j.substring(1),A));if(0<=j.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=b(Math.pow(A,8)),P=I,N=0;N<j.length;N+=8){var S=Math.min(8,j.length-N),T=parseInt(j.substring(N,N+S),A);8>S?(S=b(Math.pow(A,S)),P=P.j(S).add(b(T))):(P=P.j(E),P=P.add(b(T)))}return P}var I=p(0),k=p(1),F=p(16777216);n=l.prototype,n.m=function(){if(X(this))return-J(this).m();for(var j=0,A=1,E=0;E<this.g.length;E++){var P=this.i(E);j+=(0<=P?P:4294967296+P)*A,A*=4294967296}return j},n.toString=function(j){if(j=j||10,2>j||36<j)throw Error("radix out of range: "+j);if(B(this))return"0";if(X(this))return"-"+J(this).toString(j);for(var A=b(Math.pow(j,6)),E=this,P="";;){var N=de(E,A).g;E=xe(E,N.j(A));var S=((0<E.g.length?E.g[0]:E.h)>>>0).toString(j);if(E=N,B(E))return S+P;for(;6>S.length;)S="0"+S;P=S+P}},n.i=function(j){return 0>j?0:j<this.g.length?this.g[j]:this.h};function B(j){if(j.h!=0)return!1;for(var A=0;A<j.g.length;A++)if(j.g[A]!=0)return!1;return!0}function X(j){return j.h==-1}n.l=function(j){return j=xe(this,j),X(j)?-1:B(j)?0:1};function J(j){for(var A=j.g.length,E=[],P=0;P<A;P++)E[P]=~j.g[P];return new l(E,~j.h).add(k)}n.abs=function(){return X(this)?J(this):this},n.add=function(j){for(var A=Math.max(this.g.length,j.g.length),E=[],P=0,N=0;N<=A;N++){var S=P+(this.i(N)&65535)+(j.i(N)&65535),T=(S>>>16)+(this.i(N)>>>16)+(j.i(N)>>>16);P=T>>>16,S&=65535,T&=65535,E[N]=T<<16|S}return new l(E,E[E.length-1]&-2147483648?-1:0)};function xe(j,A){return j.add(J(A))}n.j=function(j){if(B(this)||B(j))return I;if(X(this))return X(j)?J(this).j(J(j)):J(J(this).j(j));if(X(j))return J(this.j(J(j)));if(0>this.l(F)&&0>j.l(F))return b(this.m()*j.m());for(var A=this.g.length+j.g.length,E=[],P=0;P<2*A;P++)E[P]=0;for(P=0;P<this.g.length;P++)for(var N=0;N<j.g.length;N++){var S=this.i(P)>>>16,T=this.i(P)&65535,et=j.i(N)>>>16,ke=j.i(N)&65535;E[2*P+2*N]+=T*ke,ae(E,2*P+2*N),E[2*P+2*N+1]+=S*ke,ae(E,2*P+2*N+1),E[2*P+2*N+1]+=T*et,ae(E,2*P+2*N+1),E[2*P+2*N+2]+=S*et,ae(E,2*P+2*N+2)}for(P=0;P<A;P++)E[P]=E[2*P+1]<<16|E[2*P];for(P=A;P<2*A;P++)E[P]=0;return new l(E,0)};function ae(j,A){for(;(j[A]&65535)!=j[A];)j[A+1]+=j[A]>>>16,j[A]&=65535,A++}function pe(j,A){this.g=j,this.h=A}function de(j,A){if(B(A))throw Error("division by zero");if(B(j))return new pe(I,I);if(X(j))return A=de(J(j),A),new pe(J(A.g),J(A.h));if(X(A))return A=de(j,J(A)),new pe(J(A.g),A.h);if(30<j.g.length){if(X(j)||X(A))throw Error("slowDivide_ only works with positive integers.");for(var E=k,P=A;0>=P.l(j);)E=st(E),P=st(P);var N=Fe(E,1),S=Fe(P,1);for(P=Fe(P,2),E=Fe(E,2);!B(P);){var T=S.add(P);0>=T.l(j)&&(N=N.add(E),S=T),P=Fe(P,1),E=Fe(E,1)}return A=xe(j,N.j(A)),new pe(N,A)}for(N=I;0<=j.l(A);){for(E=Math.max(1,Math.floor(j.m()/A.m())),P=Math.ceil(Math.log(E)/Math.LN2),P=48>=P?1:Math.pow(2,P-48),S=b(E),T=S.j(A);X(T)||0<T.l(j);)E-=P,S=b(E),T=S.j(A);B(S)&&(S=k),N=N.add(S),j=xe(j,T)}return new pe(N,j)}n.A=function(j){return de(this,j).h},n.and=function(j){for(var A=Math.max(this.g.length,j.g.length),E=[],P=0;P<A;P++)E[P]=this.i(P)&j.i(P);return new l(E,this.h&j.h)},n.or=function(j){for(var A=Math.max(this.g.length,j.g.length),E=[],P=0;P<A;P++)E[P]=this.i(P)|j.i(P);return new l(E,this.h|j.h)},n.xor=function(j){for(var A=Math.max(this.g.length,j.g.length),E=[],P=0;P<A;P++)E[P]=this.i(P)^j.i(P);return new l(E,this.h^j.h)};function st(j){for(var A=j.g.length+1,E=[],P=0;P<A;P++)E[P]=j.i(P)<<1|j.i(P-1)>>>31;return new l(E,j.h)}function Fe(j,A){var E=A>>5;A%=32;for(var P=j.g.length-E,N=[],S=0;S<P;S++)N[S]=0<A?j.i(S+E)>>>A|j.i(S+E+1)<<32-A:j.i(S+E);return new l(N,j.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Rh=s,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.A,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=b,l.fromString=v,Fs=l}).apply(typeof Gu<"u"?Gu:typeof self<"u"?self:typeof window<"u"?window:{});var oa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jh,Zi,Dh,ga,Gl,Oh,Vh,Mh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,d,m){return i==Array.prototype||i==Object.prototype||(i[d]=m.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof oa=="object"&&oa];for(var d=0;d<i.length;++d){var m=i[d];if(m&&m.Math==Math)return m}throw Error("Cannot find global object")}var s=t(this);function r(i,d){if(d)e:{var m=s;i=i.split(".");for(var x=0;x<i.length-1;x++){var D=i[x];if(!(D in m))break e;m=m[D]}i=i[i.length-1],x=m[i],d=d(x),d!=x&&d!=null&&e(m,i,{configurable:!0,writable:!0,value:d})}}function o(i,d){i instanceof String&&(i+="");var m=0,x=!1,D={next:function(){if(!x&&m<i.length){var L=m++;return{value:d(L,i[L]),done:!1}}return x=!0,{done:!0,value:void 0}}};return D[Symbol.iterator]=function(){return D},D}r("Array.prototype.values",function(i){return i||function(){return o(this,function(d,m){return m})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var l=l||{},h=this||self;function p(i){var d=typeof i;return d=d!="object"?d:i?Array.isArray(i)?"array":d:"null",d=="array"||d=="object"&&typeof i.length=="number"}function b(i){var d=typeof i;return d=="object"&&i!=null||d=="function"}function v(i,d,m){return i.call.apply(i.bind,arguments)}function I(i,d,m){if(!i)throw Error();if(2<arguments.length){var x=Array.prototype.slice.call(arguments,2);return function(){var D=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(D,x),i.apply(d,D)}}return function(){return i.apply(d,arguments)}}function k(i,d,m){return k=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?v:I,k.apply(null,arguments)}function F(i,d){var m=Array.prototype.slice.call(arguments,1);return function(){var x=m.slice();return x.push.apply(x,arguments),i.apply(this,x)}}function B(i,d){function m(){}m.prototype=d.prototype,i.aa=d.prototype,i.prototype=new m,i.prototype.constructor=i,i.Qb=function(x,D,L){for(var Q=Array(arguments.length-2),$e=2;$e<arguments.length;$e++)Q[$e-2]=arguments[$e];return d.prototype[D].apply(x,Q)}}function X(i){const d=i.length;if(0<d){const m=Array(d);for(let x=0;x<d;x++)m[x]=i[x];return m}return[]}function J(i,d){for(let m=1;m<arguments.length;m++){const x=arguments[m];if(p(x)){const D=i.length||0,L=x.length||0;i.length=D+L;for(let Q=0;Q<L;Q++)i[D+Q]=x[Q]}else i.push(x)}}class xe{constructor(d,m){this.i=d,this.j=m,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function ae(i){return/^[\s\xa0]*$/.test(i)}function pe(){var i=h.navigator;return i&&(i=i.userAgent)?i:""}function de(i){return de[" "](i),i}de[" "]=function(){};var st=pe().indexOf("Gecko")!=-1&&!(pe().toLowerCase().indexOf("webkit")!=-1&&pe().indexOf("Edge")==-1)&&!(pe().indexOf("Trident")!=-1||pe().indexOf("MSIE")!=-1)&&pe().indexOf("Edge")==-1;function Fe(i,d,m){for(const x in i)d.call(m,i[x],x,i)}function j(i,d){for(const m in i)d.call(void 0,i[m],m,i)}function A(i){const d={};for(const m in i)d[m]=i[m];return d}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function P(i,d){let m,x;for(let D=1;D<arguments.length;D++){x=arguments[D];for(m in x)i[m]=x[m];for(let L=0;L<E.length;L++)m=E[L],Object.prototype.hasOwnProperty.call(x,m)&&(i[m]=x[m])}}function N(i){var d=1;i=i.split(":");const m=[];for(;0<d&&i.length;)m.push(i.shift()),d--;return i.length&&m.push(i.join(":")),m}function S(i){h.setTimeout(()=>{throw i},0)}function T(){var i=Le;let d=null;return i.g&&(d=i.g,i.g=i.g.next,i.g||(i.h=null),d.next=null),d}class et{constructor(){this.h=this.g=null}add(d,m){const x=ke.get();x.set(d,m),this.h?this.h.next=x:this.g=x,this.h=x}}var ke=new xe(()=>new Ks,i=>i.reset());class Ks{constructor(){this.next=this.g=this.h=null}set(d,m){this.h=d,this.g=m,this.next=null}reset(){this.next=this.g=this.h=null}}let ot,tt=!1,Le=new et,Wt=()=>{const i=h.Promise.resolve(void 0);ot=()=>{i.then(De)}};var De=()=>{for(var i;i=T();){try{i.h.call(i.g)}catch(m){S(m)}var d=ke;d.j(i),100>d.h&&(d.h++,i.next=d.g,d.g=i)}tt=!1};function En(){this.s=this.s,this.C=this.C}En.prototype.s=!1,En.prototype.ma=function(){this.s||(this.s=!0,this.N())},En.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function vt(i,d){this.type=i,this.g=this.target=d,this.defaultPrevented=!1}vt.prototype.h=function(){this.defaultPrevented=!0};var ou=(function(){if(!h.addEventListener||!Object.defineProperty)return!1;var i=!1,d=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const m=()=>{};h.addEventListener("test",m,d),h.removeEventListener("test",m,d)}catch{}return i})();function Nr(i,d){if(vt.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var m=this.type=i.type,x=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=d,d=i.relatedTarget){if(st){e:{try{de(d.nodeName);var D=!0;break e}catch{}D=!1}D||(d=null)}}else m=="mouseover"?d=i.fromElement:m=="mouseout"&&(d=i.toElement);this.relatedTarget=d,x?(this.clientX=x.clientX!==void 0?x.clientX:x.pageX,this.clientY=x.clientY!==void 0?x.clientY:x.pageY,this.screenX=x.screenX||0,this.screenY=x.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Pe[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&Nr.aa.h.call(this)}}B(Nr,vt);var Pe={2:"touch",3:"pen",4:"mouse"};Nr.prototype.h=function(){Nr.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Gt="closure_listenable_"+(1e6*Math.random()|0),Sr=0;function Co(i,d,m,x,D){this.listener=i,this.proxy=null,this.src=d,this.type=m,this.capture=!!x,this.ha=D,this.key=++Sr,this.da=this.fa=!1}function Y(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Tt(i){this.src=i,this.g={},this.h=0}Tt.prototype.add=function(i,d,m,x,D){var L=i.toString();i=this.g[L],i||(i=this.g[L]=[],this.h++);var Q=Cr(i,d,x,D);return-1<Q?(d=i[Q],m||(d.fa=!1)):(d=new Co(d,this.src,L,!!x,D),d.fa=m,i.push(d)),d};function Po(i,d){var m=d.type;if(m in i.g){var x=i.g[m],D=Array.prototype.indexOf.call(x,d,void 0),L;(L=0<=D)&&Array.prototype.splice.call(x,D,1),L&&(Y(d),i.g[m].length==0&&(delete i.g[m],i.h--))}}function Cr(i,d,m,x){for(var D=0;D<i.length;++D){var L=i[D];if(!L.da&&L.listener==d&&L.capture==!!m&&L.ha==x)return D}return-1}var Js="closure_lm_"+(1e6*Math.random()|0),Kt={};function rt(i,d,m,x,D){if(Array.isArray(d)){for(var L=0;L<d.length;L++)rt(i,d[L],m,x,D);return null}return m=Qs(m),i&&i[Gt]?i.K(d,m,b(x)?!!x.capture:!1,D):Nt(i,d,m,!1,x,D)}function Nt(i,d,m,x,D,L){if(!d)throw Error("Invalid event type");var Q=b(D)?!!D.capture:!!D,$e=Ti(i);if($e||(i[Js]=$e=new Tt(i)),m=$e.add(d,m,x,Q,L),m.proxy)return m;if(x=$t(),m.proxy=x,x.src=i,x.listener=m,i.addEventListener)ou||(D=Q),D===void 0&&(D=!1),i.addEventListener(d.toString(),x,D);else if(i.attachEvent)i.attachEvent(cn(d.toString()),x);else if(i.addListener&&i.removeListener)i.addListener(x);else throw Error("addEventListener and attachEvent are unavailable.");return m}function $t(){function i(m){return d.call(i.src,i.listener,m)}const d=Ro;return i}function an(i,d,m,x,D){if(Array.isArray(d))for(var L=0;L<d.length;L++)an(i,d[L],m,x,D);else x=b(x)?!!x.capture:!!x,m=Qs(m),i&&i[Gt]?(i=i.i,d=String(d).toString(),d in i.g&&(L=i.g[d],m=Cr(L,m,x,D),-1<m&&(Y(L[m]),Array.prototype.splice.call(L,m,1),L.length==0&&(delete i.g[d],i.h--)))):i&&(i=Ti(i))&&(d=i.g[d.toString()],i=-1,d&&(i=Cr(d,m,x,D)),(m=-1<i?d[i]:null)&&ln(m))}function ln(i){if(typeof i!="number"&&i&&!i.da){var d=i.src;if(d&&d[Gt])Po(d.i,i);else{var m=i.type,x=i.proxy;d.removeEventListener?d.removeEventListener(m,x,i.capture):d.detachEvent?d.detachEvent(cn(m),x):d.addListener&&d.removeListener&&d.removeListener(x),(m=Ti(d))?(Po(m,i),m.h==0&&(m.src=null,d[Js]=null)):Y(i)}}}function cn(i){return i in Kt?Kt[i]:Kt[i]="on"+i}function Ro(i,d){if(i.da)i=!0;else{d=new Nr(d,this);var m=i.listener,x=i.ha||i.src;i.fa&&ln(i),i=m.call(x,d)}return i}function Ti(i){return i=i[Js],i instanceof Tt?i:null}var ds="__closure_events_fn_"+(1e9*Math.random()>>>0);function Qs(i){return typeof i=="function"?i:(i[ds]||(i[ds]=function(d){return i.handleEvent(d)}),i[ds])}function dt(){En.call(this),this.i=new Tt(this),this.M=this,this.F=null}B(dt,En),dt.prototype[Gt]=!0,dt.prototype.removeEventListener=function(i,d,m,x){an(this,i,d,m,x)};function ht(i,d){var m,x=i.F;if(x)for(m=[];x;x=x.F)m.push(x);if(i=i.M,x=d.type||d,typeof d=="string")d=new vt(d,i);else if(d instanceof vt)d.target=d.target||i;else{var D=d;d=new vt(x,i),P(d,D)}if(D=!0,m)for(var L=m.length-1;0<=L;L--){var Q=d.g=m[L];D=zn(Q,x,!0,d)&&D}if(Q=d.g=i,D=zn(Q,x,!0,d)&&D,D=zn(Q,x,!1,d)&&D,m)for(L=0;L<m.length;L++)Q=d.g=m[L],D=zn(Q,x,!1,d)&&D}dt.prototype.N=function(){if(dt.aa.N.call(this),this.i){var i=this.i,d;for(d in i.g){for(var m=i.g[d],x=0;x<m.length;x++)Y(m[x]);delete i.g[d],i.h--}}this.F=null},dt.prototype.K=function(i,d,m,x){return this.i.add(String(i),d,!1,m,x)},dt.prototype.L=function(i,d,m,x){return this.i.add(String(i),d,!0,m,x)};function zn(i,d,m,x){if(d=i.i.g[String(d)],!d)return!0;d=d.concat();for(var D=!0,L=0;L<d.length;++L){var Q=d[L];if(Q&&!Q.da&&Q.capture==m){var $e=Q.listener,Ye=Q.ha||Q.src;Q.fa&&Po(i.i,Q),D=$e.call(Ye,x)!==!1&&D}}return D&&!x.defaultPrevented}function Ii(i,d,m){if(typeof i=="function")m&&(i=k(i,m));else if(i&&typeof i.handleEvent=="function")i=k(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:h.setTimeout(i,d||0)}function jo(i){i.g=Ii(()=>{i.g=null,i.i&&(i.i=!1,jo(i))},i.l);const d=i.h;i.h=null,i.m.apply(null,d)}class Do extends En{constructor(d,m){super(),this.m=d,this.l=m,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:jo(this)}N(){super.N(),this.g&&(h.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function hs(i){En.call(this),this.h=i,this.g={}}B(hs,En);var Tn=[];function ft(i){Fe(i.g,function(d,m){this.g.hasOwnProperty(m)&&ln(d)},i),i.g={}}hs.prototype.N=function(){hs.aa.N.call(this),ft(this)},hs.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var He=h.JSON.stringify,Ue=h.JSON.parse,Xs=class{stringify(i){return h.JSON.stringify(i,void 0)}parse(i){return h.JSON.parse(i,void 0)}};function je(){}je.prototype.h=null;function fs(i){return i.h||(i.h=i.i())}function xt(){}var un={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Pr(){vt.call(this,"d")}B(Pr,vt);function Rr(){vt.call(this,"c")}B(Rr,vt);var In={},ki=null;function Ys(){return ki=ki||new dt}In.La="serverreachability";function Ai(i){vt.call(this,In.La,i)}B(Ai,vt);function ps(i){const d=Ys();ht(d,new Ai(d))}In.STAT_EVENT="statevent";function Ni(i,d){vt.call(this,In.STAT_EVENT,i),this.stat=d}B(Ni,vt);function H(i){const d=Ys();ht(d,new Ni(d,i))}In.Ma="timingevent";function ie(i,d){vt.call(this,In.Ma,i),this.size=d}B(ie,vt);function qn(i,d){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return h.setTimeout(function(){i()},d)}function Hn(){this.g=!0}Hn.prototype.xa=function(){this.g=!1};function Si(i,d,m,x,D,L){i.info(function(){if(i.g)if(L)for(var Q="",$e=L.split("&"),Ye=0;Ye<$e.length;Ye++){var Ie=$e[Ye].split("=");if(1<Ie.length){var mt=Ie[0];Ie=Ie[1];var We=mt.split("_");Q=2<=We.length&&We[1]=="type"?Q+(mt+"="+Ie+"&"):Q+(mt+"=redacted&")}}else Q=null;else Q=L;return"XMLHTTP REQ ("+x+") [attempt "+D+"]: "+d+`
`+m+`
`+Q})}function jr(i,d,m,x,D,L,Q){i.info(function(){return"XMLHTTP RESP ("+x+") [ attempt "+D+"]: "+d+`
`+m+`
`+L+" "+Q})}function ms(i,d,m,x){i.info(function(){return"XMLHTTP TEXT ("+d+"): "+fl(i,m)+(x?" "+x:"")})}function Dr(i,d){i.info(function(){return"TIMEOUT: "+d})}Hn.prototype.info=function(){};function fl(i,d){if(!i.g)return d;if(!d)return null;try{var m=JSON.parse(d);if(m){for(i=0;i<m.length;i++)if(Array.isArray(m[i])){var x=m[i];if(!(2>x.length)){var D=x[1];if(Array.isArray(D)&&!(1>D.length)){var L=D[0];if(L!="noop"&&L!="stop"&&L!="close")for(var Q=1;Q<D.length;Q++)D[Q]=""}}}}return He(m)}catch{return d}}var Or={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Vr={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Mr;function Fr(){}B(Fr,je),Fr.prototype.g=function(){return new XMLHttpRequest},Fr.prototype.i=function(){return{}},Mr=new Fr;function kn(i,d,m,x){this.j=i,this.i=d,this.l=m,this.R=x||1,this.U=new hs(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Oo}function Oo(){this.i=null,this.g="",this.h=!1}var Be={},gs={};function Ut(i,d,m){i.L=1,i.v=Gn(Bt(d)),i.m=m,i.P=!0,ys(i,null)}function ys(i,d){i.F=Date.now(),te(i),i.A=Bt(i.v);var m=i.A,x=i.R;Array.isArray(x)||(x=[String(x)]),ir(m.i,"t",x),i.C=0,m=i.j.J,i.h=new Oo,i.g=Jo(i.j,m?d:null,!i.m),0<i.O&&(i.M=new Do(k(i.Y,i,i.g),i.O)),d=i.U,m=i.g,x=i.ca;var D="readystatechange";Array.isArray(D)||(D&&(Tn[0]=D.toString()),D=Tn);for(var L=0;L<D.length;L++){var Q=rt(m,D[L],x||d.handleEvent,!1,d.h||d);if(!Q)break;d.g[Q.key]=Q}d=i.H?A(i.H):{},i.m?(i.u||(i.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,d)):(i.u="GET",i.g.ea(i.A,i.u,null,d)),ps(),Si(i.i,i.u,i.A,i.l,i.R,i.m)}kn.prototype.ca=function(i){i=i.target;const d=this.M;d&&Ft(i)==3?d.j():this.Y(i)},kn.prototype.Y=function(i){try{if(i==this.g)e:{const We=Ft(this.g);var d=this.g.Ba();const Yn=this.g.Z();if(!(3>We)&&(We!=3||this.g&&(this.h.h||this.g.oa()||Vi(this.g)))){this.J||We!=4||d==7||(d==8||0>=Yn?ps(3):ps(2)),Vo(this);var m=this.g.Z();this.X=m;t:if(Lr(this)){var x=Vi(this.g);i="";var D=x.length,L=Ft(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){An(this),pt(this);var Q="";break t}this.h.i=new h.TextDecoder}for(d=0;d<D;d++)this.h.h=!0,i+=this.h.i.decode(x[d],{stream:!(L&&d==D-1)});x.length=0,this.h.g+=i,this.C=0,Q=this.h.g}else Q=this.g.oa();if(this.o=m==200,jr(this.i,this.u,this.A,this.l,this.R,We,m),this.o){if(this.T&&!this.K){t:{if(this.g){var $e,Ye=this.g;if(($e=Ye.g?Ye.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!ae($e)){var Ie=$e;break t}}Ie=null}if(m=Ie)ms(this.i,this.l,m,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,dn(this,m);else{this.o=!1,this.s=3,H(12),An(this),pt(this);break e}}if(this.P){m=!0;let Oe;for(;!this.J&&this.C<Q.length;)if(Oe=au(this,Q),Oe==gs){We==4&&(this.s=4,H(14),m=!1),ms(this.i,this.l,null,"[Incomplete Response]");break}else if(Oe==Be){this.s=4,H(15),ms(this.i,this.l,Q,"[Invalid Chunk]"),m=!1;break}else ms(this.i,this.l,Oe,null),dn(this,Oe);if(Lr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),We!=4||Q.length!=0||this.h.h||(this.s=1,H(16),m=!1),this.o=this.o&&m,!m)ms(this.i,this.l,Q,"[Invalid Chunked Response]"),An(this),pt(this);else if(0<Q.length&&!this.W){this.W=!0;var mt=this.j;mt.g==this&&mt.ba&&!mt.M&&(mt.j.info("Great, no buffering proxy detected. Bytes received: "+Q.length),Wr(mt),mt.M=!0,H(11))}}else ms(this.i,this.l,Q,null),dn(this,Q);We==4&&An(this),this.o&&!this.J&&(We==4?Go(this.j,this):(this.o=!1,te(this)))}else lr(this.g),m==400&&0<Q.indexOf("Unknown SID")?(this.s=3,H(12)):(this.s=0,H(13)),An(this),pt(this)}}}catch{}finally{}};function Lr(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function au(i,d){var m=i.C,x=d.indexOf(`
`,m);return x==-1?gs:(m=Number(d.substring(m,x)),isNaN(m)?Be:(x+=1,x+m>d.length?gs:(d=d.slice(x,x+m),i.C=x+m,d)))}kn.prototype.cancel=function(){this.J=!0,An(this)};function te(i){i.S=Date.now()+i.I,pl(i,i.I)}function pl(i,d){if(i.B!=null)throw Error("WatchDog timer not null");i.B=qn(k(i.ba,i),d)}function Vo(i){i.B&&(h.clearTimeout(i.B),i.B=null)}kn.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(Dr(this.i,this.A),this.L!=2&&(ps(),H(17)),An(this),this.s=2,pt(this)):pl(this,this.S-i)};function pt(i){i.j.G==0||i.J||Go(i.j,i)}function An(i){Vo(i);var d=i.M;d&&typeof d.ma=="function"&&d.ma(),i.M=null,ft(i.U),i.g&&(d=i.g,i.g=null,d.abort(),d.ma())}function dn(i,d){try{var m=i.j;if(m.G!=0&&(m.g==i||tr(m.h,i))){if(!i.K&&tr(m.h,i)&&m.G==3){try{var x=m.Da.g.parse(d)}catch{x=null}if(Array.isArray(x)&&x.length==3){var D=x;if(D[0]==0){e:if(!m.u){if(m.g)if(m.g.F+3e3<i.F)mn(m),qr(m);else break e;Hr(m),H(18)}}else m.za=D[1],0<m.za-m.T&&37500>D[2]&&m.F&&m.v==0&&!m.C&&(m.C=qn(k(m.Za,m),6e3));if(1>=er(m.h)&&m.ca){try{m.ca()}catch{}m.ca=void 0}}else Xn(m,11)}else if((i.K||m.g==i)&&mn(m),!ae(d))for(D=m.Da.g.parse(d),d=0;d<D.length;d++){let Ie=D[d];if(m.T=Ie[0],Ie=Ie[1],m.G==2)if(Ie[0]=="c"){m.K=Ie[1],m.ia=Ie[2];const mt=Ie[3];mt!=null&&(m.la=mt,m.j.info("VER="+m.la));const We=Ie[4];We!=null&&(m.Aa=We,m.j.info("SVER="+m.Aa));const Yn=Ie[5];Yn!=null&&typeof Yn=="number"&&0<Yn&&(x=1.5*Yn,m.L=x,m.j.info("backChannelRequestTimeoutMs_="+x)),x=m;const Oe=i.g;if(Oe){const tn=Oe.g?Oe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(tn){var L=x.h;L.g||tn.indexOf("spdy")==-1&&tn.indexOf("quic")==-1&&tn.indexOf("h2")==-1||(L.j=L.l,L.g=new Set,L.h&&(hn(L,L.h),L.h=null))}if(x.D){const ur=Oe.g?Oe.g.getResponseHeader("X-HTTP-Session-Id"):null;ur&&(x.ya=ur,Te(x.I,x.D,ur))}}m.G=3,m.l&&m.l.ua(),m.ba&&(m.R=Date.now()-i.F,m.j.info("Handshake RTT: "+m.R+"ms")),x=m;var Q=i;if(x.qa=Ko(x,x.J?x.ia:null,x.W),Q.K){Fo(x.h,Q);var $e=Q,Ye=x.L;Ye&&($e.I=Ye),$e.B&&(Vo($e),te($e)),x.g=Q}else pn(x);0<m.i.length&&fn(m)}else Ie[0]!="stop"&&Ie[0]!="close"||Xn(m,7);else m.G==3&&(Ie[0]=="stop"||Ie[0]=="close"?Ie[0]=="stop"?Xn(m,7):Sn(m):Ie[0]!="noop"&&m.l&&m.l.ta(Ie),m.v=0)}}ps(4)}catch{}}var Mo=class{constructor(i,d){this.g=i,this.map=d}};function Zs(i){this.l=i||10,h.PerformanceNavigationTiming?(i=h.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(h.chrome&&h.chrome.loadTimes&&h.chrome.loadTimes()&&h.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function $r(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function er(i){return i.h?1:i.g?i.g.size:0}function tr(i,d){return i.h?i.h==d:i.g?i.g.has(d):!1}function hn(i,d){i.g?i.g.add(d):i.h=d}function Fo(i,d){i.h&&i.h==d?i.h=null:i.g&&i.g.has(d)&&i.g.delete(d)}Zs.prototype.cancel=function(){if(this.i=ml(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function ml(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let d=i.i;for(const m of i.g.values())d=d.concat(m.D);return d}return X(i.i)}function lu(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(p(i)){for(var d=[],m=i.length,x=0;x<m;x++)d.push(i[x]);return d}d=[],m=0;for(x in i)d[m++]=i[x];return d}function bs(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(p(i)||typeof i=="string"){var d=[];i=i.length;for(var m=0;m<i;m++)d.push(m);return d}d=[],m=0;for(const x in i)d[m++]=x;return d}}}function nr(i,d){if(i.forEach&&typeof i.forEach=="function")i.forEach(d,void 0);else if(p(i)||typeof i=="string")Array.prototype.forEach.call(i,d,void 0);else for(var m=bs(i),x=lu(i),D=x.length,L=0;L<D;L++)d.call(void 0,x[L],m&&m[L],i)}var Ci=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Re(i,d){if(i){i=i.split("&");for(var m=0;m<i.length;m++){var x=i[m].indexOf("="),D=null;if(0<=x){var L=i[m].substring(0,x);D=i[m].substring(x+1)}else L=i[m];d(L,D?decodeURIComponent(D.replace(/\+/g," ")):"")}}}function Vt(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof Vt){this.h=i.h,Wn(this,i.j),this.o=i.o,this.g=i.g,Xt(this,i.s),this.l=i.l;var d=i.i,m=new Yt;m.i=d.i,d.g&&(m.g=new Map(d.g),m.h=d.h),sr(this,m),this.m=i.m}else i&&(d=String(i).match(Ci))?(this.h=!1,Wn(this,d[1]||"",!0),this.o=Jt(d[2]||""),this.g=Jt(d[3]||"",!0),Xt(this,d[4]),this.l=Jt(d[5]||"",!0),sr(this,d[6]||"",!0),this.m=Jt(d[7]||"")):(this.h=!1,this.i=new Yt(null,this.h))}Vt.prototype.toString=function(){var i=[],d=this.j;d&&i.push(rr(d,Lo,!0),":");var m=this.g;return(m||d=="file")&&(i.push("//"),(d=this.o)&&i.push(rr(d,Lo,!0),"@"),i.push(encodeURIComponent(String(m)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),m=this.s,m!=null&&i.push(":",String(m))),(m=this.l)&&(this.g&&m.charAt(0)!="/"&&i.push("/"),i.push(rr(m,m.charAt(0)=="/"?gl:vs,!0))),(m=this.i.toString())&&i.push("?",m),(m=this.m)&&i.push("#",rr(m,Pi)),i.join("")};function Bt(i){return new Vt(i)}function Wn(i,d,m){i.j=m?Jt(d,!0):d,i.j&&(i.j=i.j.replace(/:$/,""))}function Xt(i,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);i.s=d}else i.s=null}function sr(i,d,m){d instanceof Yt?(i.i=d,$o(i.i,i.h)):(m||(d=rr(d,yl)),i.i=new Yt(d,i.h))}function Te(i,d,m){i.i.set(d,m)}function Gn(i){return Te(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function Jt(i,d){return i?d?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function rr(i,d,m){return typeof i=="string"?(i=encodeURI(i).replace(d,zt),m&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function zt(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Lo=/[#\/\?@]/g,vs=/[#\?:]/g,gl=/[#\?]/g,yl=/[#\?@]/g,Pi=/#/g;function Yt(i,d){this.h=this.g=null,this.i=i||null,this.j=!!d}function Mt(i){i.g||(i.g=new Map,i.h=0,i.i&&Re(i.i,function(d,m){i.add(decodeURIComponent(d.replace(/\+/g," ")),m)}))}n=Yt.prototype,n.add=function(i,d){Mt(this),this.i=null,i=Kn(this,i);var m=this.g.get(i);return m||this.g.set(i,m=[]),m.push(d),this.h+=1,this};function Ur(i,d){Mt(i),d=Kn(i,d),i.g.has(d)&&(i.i=null,i.h-=i.g.get(d).length,i.g.delete(d))}function xs(i,d){return Mt(i),d=Kn(i,d),i.g.has(d)}n.forEach=function(i,d){Mt(this),this.g.forEach(function(m,x){m.forEach(function(D){i.call(d,D,x,this)},this)},this)},n.na=function(){Mt(this);const i=Array.from(this.g.values()),d=Array.from(this.g.keys()),m=[];for(let x=0;x<d.length;x++){const D=i[x];for(let L=0;L<D.length;L++)m.push(d[x])}return m},n.V=function(i){Mt(this);let d=[];if(typeof i=="string")xs(this,i)&&(d=d.concat(this.g.get(Kn(this,i))));else{i=Array.from(this.g.values());for(let m=0;m<i.length;m++)d=d.concat(i[m])}return d},n.set=function(i,d){return Mt(this),this.i=null,i=Kn(this,i),xs(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[d]),this.h+=1,this},n.get=function(i,d){return i?(i=this.V(i),0<i.length?String(i[0]):d):d};function ir(i,d,m){Ur(i,d),0<m.length&&(i.i=null,i.g.set(Kn(i,d),X(m)),i.h+=m.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],d=Array.from(this.g.keys());for(var m=0;m<d.length;m++){var x=d[m];const L=encodeURIComponent(String(x)),Q=this.V(x);for(x=0;x<Q.length;x++){var D=L;Q[x]!==""&&(D+="="+encodeURIComponent(String(Q[x]))),i.push(D)}}return this.i=i.join("&")};function Kn(i,d){return d=String(d),i.j&&(d=d.toLowerCase()),d}function $o(i,d){d&&!i.j&&(Mt(i),i.i=null,i.g.forEach(function(m,x){var D=x.toLowerCase();x!=D&&(Ur(this,x),ir(this,D,m))},i)),i.j=d}function Ri(i,d){const m=new Hn;if(h.Image){const x=new Image;x.onload=F(Zt,m,"TestLoadImage: loaded",!0,d,x),x.onerror=F(Zt,m,"TestLoadImage: error",!1,d,x),x.onabort=F(Zt,m,"TestLoadImage: abort",!1,d,x),x.ontimeout=F(Zt,m,"TestLoadImage: timeout",!1,d,x),h.setTimeout(function(){x.ontimeout&&x.ontimeout()},1e4),x.src=i}else d(!1)}function bl(i,d){const m=new Hn,x=new AbortController,D=setTimeout(()=>{x.abort(),Zt(m,"TestPingServer: timeout",!1,d)},1e4);fetch(i,{signal:x.signal}).then(L=>{clearTimeout(D),L.ok?Zt(m,"TestPingServer: ok",!0,d):Zt(m,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(D),Zt(m,"TestPingServer: error",!1,d)})}function Zt(i,d,m,x,D){try{D&&(D.onload=null,D.onerror=null,D.onabort=null,D.ontimeout=null),x(m)}catch{}}function cu(){this.g=new Xs}function Uo(i,d,m){const x=m||"";try{nr(i,function(D,L){let Q=D;b(D)&&(Q=He(D)),d.push(x+L+"="+encodeURIComponent(Q))})}catch(D){throw d.push(x+"type="+encodeURIComponent("_badmap")),D}}function _s(i){this.l=i.Ub||null,this.j=i.eb||!1}B(_s,je),_s.prototype.g=function(){return new or(this.l,this.j)},_s.prototype.i=(function(i){return function(){return i}})({});function or(i,d){dt.call(this),this.D=i,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}B(or,dt),n=or.prototype,n.open=function(i,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=d,this.readyState=1,ws(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(d.body=i),(this.D||h).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ar(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,ws(this)),this.g&&(this.readyState=3,ws(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof h.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;ji(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function ji(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var d=i.value?i.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!i.done}))&&(this.response=this.responseText+=d)}i.done?ar(this):ws(this),this.readyState==3&&ji(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,ar(this))},n.Qa=function(i){this.g&&(this.response=i,ar(this))},n.ga=function(){this.g&&ar(this)};function ar(i){i.readyState=4,i.l=null,i.j=null,i.v=null,ws(i)}n.setRequestHeader=function(i,d){this.u.append(i,d)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],d=this.h.entries();for(var m=d.next();!m.done;)m=m.value,i.push(m[0]+": "+m[1]),m=d.next();return i.join(`\r
`)};function ws(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(or.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Bo(i){let d="";return Fe(i,function(m,x){d+=x,d+=":",d+=m,d+=`\r
`}),d}function Di(i,d,m){e:{for(x in m){var x=!1;break e}x=!0}x||(m=Bo(m),typeof i=="string"?m!=null&&encodeURIComponent(String(m)):Te(i,d,m))}function ze(i){dt.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}B(ze,dt);var at=/^https?$/i,Oi=["POST","PUT"];n=ze.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,d,m,x){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);d=d?d.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Mr.g(),this.v=this.o?fs(this.o):fs(Mr),this.g.onreadystatechange=k(this.Ea,this);try{this.B=!0,this.g.open(d,String(i),!0),this.B=!1}catch(L){Br(this,L);return}if(i=m||"",m=new Map(this.headers),x)if(Object.getPrototypeOf(x)===Object.prototype)for(var D in x)m.set(D,x[D]);else if(typeof x.keys=="function"&&typeof x.get=="function")for(const L of x.keys())m.set(L,x.get(L));else throw Error("Unknown input type for opt_headers: "+String(x));x=Array.from(m.keys()).find(L=>L.toLowerCase()=="content-type"),D=h.FormData&&i instanceof h.FormData,!(0<=Array.prototype.indexOf.call(Oi,d,void 0))||x||D||m.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[L,Q]of m)this.g.setRequestHeader(L,Q);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{zr(this),this.u=!0,this.g.send(i),this.u=!1}catch(L){Br(this,L)}};function Br(i,d){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=d,i.m=5,zo(i),Nn(i)}function zo(i){i.A||(i.A=!0,ht(i,"complete"),ht(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,ht(this,"complete"),ht(this,"abort"),Nn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Nn(this,!0)),ze.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?qo(this):this.bb())},n.bb=function(){qo(this)};function qo(i){if(i.h&&typeof l<"u"&&(!i.v[1]||Ft(i)!=4||i.Z()!=2)){if(i.u&&Ft(i)==4)Ii(i.Ea,0,i);else if(ht(i,"readystatechange"),Ft(i)==4){i.h=!1;try{const Q=i.Z();e:switch(Q){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var m;if(!(m=d)){var x;if(x=Q===0){var D=String(i.D).match(Ci)[1]||null;!D&&h.self&&h.self.location&&(D=h.self.location.protocol.slice(0,-1)),x=!at.test(D?D.toLowerCase():"")}m=x}if(m)ht(i,"complete"),ht(i,"success");else{i.m=6;try{var L=2<Ft(i)?i.g.statusText:""}catch{L=""}i.l=L+" ["+i.Z()+"]",zo(i)}}finally{Nn(i)}}}}function Nn(i,d){if(i.g){zr(i);const m=i.g,x=i.v[0]?()=>{}:null;i.g=null,i.v=null,d||ht(i,"ready");try{m.onreadystatechange=x}catch{}}}function zr(i){i.I&&(h.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function Ft(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<Ft(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var d=this.g.responseText;return i&&d.indexOf(i)==0&&(d=d.substring(i.length)),Ue(d)}};function Vi(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function lr(i){const d={};i=(i.g&&2<=Ft(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let x=0;x<i.length;x++){if(ae(i[x]))continue;var m=N(i[x]);const D=m[0];if(m=m[1],typeof m!="string")continue;m=m.trim();const L=d[D]||[];d[D]=L,L.push(m)}j(d,function(x){return x.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Jn(i,d,m){return m&&m.internalChannelParams&&m.internalChannelParams[i]||d}function Mi(i){this.Aa=0,this.i=[],this.j=new Hn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Jn("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Jn("baseRetryDelayMs",5e3,i),this.cb=Jn("retryDelaySeedMs",1e4,i),this.Wa=Jn("forwardChannelMaxRetries",2,i),this.wa=Jn("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Zs(i&&i.concurrentRequestLimit),this.Da=new cu,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Mi.prototype,n.la=8,n.G=1,n.connect=function(i,d,m,x){H(0),this.W=i,this.H=d||{},m&&x!==void 0&&(this.H.OSID=m,this.H.OAID=x),this.F=this.X,this.I=Ko(this,null,this.W),fn(this)};function Sn(i){if(Fi(i),i.G==3){var d=i.U++,m=Bt(i.I);if(Te(m,"SID",i.K),Te(m,"RID",d),Te(m,"TYPE","terminate"),Qn(i,m),d=new kn(i,i.j,d),d.L=2,d.v=Gn(Bt(m)),m=!1,h.navigator&&h.navigator.sendBeacon)try{m=h.navigator.sendBeacon(d.v.toString(),"")}catch{}!m&&h.Image&&(new Image().src=d.v,m=!0),m||(d.g=Jo(d.j,null),d.g.ea(d.v)),d.F=Date.now(),te(d)}Kr(i)}function qr(i){i.g&&(Wr(i),i.g.cancel(),i.g=null)}function Fi(i){qr(i),i.u&&(h.clearTimeout(i.u),i.u=null),mn(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&h.clearTimeout(i.s),i.s=null)}function fn(i){if(!$r(i.h)&&!i.s){i.s=!0;var d=i.Ga;ot||Wt(),tt||(ot(),tt=!0),Le.add(d,i),i.B=0}}function Ho(i,d){return er(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=d.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=qn(k(i.Ga,i,d),Gr(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const D=new kn(this,this.j,i);let L=this.o;if(this.S&&(L?(L=A(L),P(L,this.S)):L=this.S),this.m!==null||this.O||(D.H=L,L=null),this.P)e:{for(var d=0,m=0;m<this.i.length;m++){t:{var x=this.i[m];if("__data__"in x.map&&(x=x.map.__data__,typeof x=="string")){x=x.length;break t}x=void 0}if(x===void 0)break;if(d+=x,4096<d){d=m;break e}if(d===4096||m===this.i.length-1){d=m+1;break e}}d=1e3}else d=1e3;d=$i(this,D,d),m=Bt(this.I),Te(m,"RID",i),Te(m,"CVER",22),this.D&&Te(m,"X-HTTP-Session-Id",this.D),Qn(this,m),L&&(this.O?d="headers="+encodeURIComponent(String(Bo(L)))+"&"+d:this.m&&Di(m,this.m,L)),hn(this.h,D),this.Ua&&Te(m,"TYPE","init"),this.P?(Te(m,"$req",d),Te(m,"SID","null"),D.T=!0,Ut(D,m,null)):Ut(D,m,d),this.G=2}}else this.G==3&&(i?Li(this,i):this.i.length==0||$r(this.h)||Li(this))};function Li(i,d){var m;d?m=d.l:m=i.U++;const x=Bt(i.I);Te(x,"SID",i.K),Te(x,"RID",m),Te(x,"AID",i.T),Qn(i,x),i.m&&i.o&&Di(x,i.m,i.o),m=new kn(i,i.j,m,i.B+1),i.m===null&&(m.H=i.o),d&&(i.i=d.D.concat(i.i)),d=$i(i,m,1e3),m.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),hn(i.h,m),Ut(m,x,d)}function Qn(i,d){i.H&&Fe(i.H,function(m,x){Te(d,x,m)}),i.l&&nr({},function(m,x){Te(d,x,m)})}function $i(i,d,m){m=Math.min(i.i.length,m);var x=i.l?k(i.l.Na,i.l,i):null;e:{var D=i.i;let L=-1;for(;;){const Q=["count="+m];L==-1?0<m?(L=D[0].g,Q.push("ofs="+L)):L=0:Q.push("ofs="+L);let $e=!0;for(let Ye=0;Ye<m;Ye++){let Ie=D[Ye].g;const mt=D[Ye].map;if(Ie-=L,0>Ie)L=Math.max(0,D[Ye].g-100),$e=!1;else try{Uo(mt,Q,"req"+Ie+"_")}catch{x&&x(mt)}}if($e){x=Q.join("&");break e}}}return i=i.i.splice(0,m),d.D=i,x}function pn(i){if(!i.g&&!i.u){i.Y=1;var d=i.Fa;ot||Wt(),tt||(ot(),tt=!0),Le.add(d,i),i.v=0}}function Hr(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=qn(k(i.Fa,i),Gr(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,Wo(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=qn(k(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,H(10),qr(this),Wo(this))};function Wr(i){i.A!=null&&(h.clearTimeout(i.A),i.A=null)}function Wo(i){i.g=new kn(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var d=Bt(i.qa);Te(d,"RID","rpc"),Te(d,"SID",i.K),Te(d,"AID",i.T),Te(d,"CI",i.F?"0":"1"),!i.F&&i.ja&&Te(d,"TO",i.ja),Te(d,"TYPE","xmlhttp"),Qn(i,d),i.m&&i.o&&Di(d,i.m,i.o),i.L&&(i.g.I=i.L);var m=i.g;i=i.ia,m.L=1,m.v=Gn(Bt(d)),m.m=null,m.P=!0,ys(m,i)}n.Za=function(){this.C!=null&&(this.C=null,qr(this),Hr(this),H(19))};function mn(i){i.C!=null&&(h.clearTimeout(i.C),i.C=null)}function Go(i,d){var m=null;if(i.g==d){mn(i),Wr(i),i.g=null;var x=2}else if(tr(i.h,d))m=d.D,Fo(i.h,d),x=1;else return;if(i.G!=0){if(d.o)if(x==1){m=d.m?d.m.length:0,d=Date.now()-d.F;var D=i.B;x=Ys(),ht(x,new ie(x,m)),fn(i)}else pn(i);else if(D=d.s,D==3||D==0&&0<d.X||!(x==1&&Ho(i,d)||x==2&&Hr(i)))switch(m&&0<m.length&&(d=i.h,d.i=d.i.concat(m)),D){case 1:Xn(i,5);break;case 4:Xn(i,10);break;case 3:Xn(i,6);break;default:Xn(i,2)}}}function Gr(i,d){let m=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(m*=2),m*d}function Xn(i,d){if(i.j.info("Error code "+d),d==2){var m=k(i.fb,i),x=i.Xa;const D=!x;x=new Vt(x||"//www.google.com/images/cleardot.gif"),h.location&&h.location.protocol=="http"||Wn(x,"https"),Gn(x),D?Ri(x.toString(),m):bl(x.toString(),m)}else H(2);i.G=0,i.l&&i.l.sa(d),Kr(i),Fi(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),H(2)):(this.j.info("Failed to ping google.com"),H(1))};function Kr(i){if(i.G=0,i.ka=[],i.l){const d=ml(i.h);(d.length!=0||i.i.length!=0)&&(J(i.ka,d),J(i.ka,i.i),i.h.i.length=0,X(i.i),i.i.length=0),i.l.ra()}}function Ko(i,d,m){var x=m instanceof Vt?Bt(m):new Vt(m);if(x.g!="")d&&(x.g=d+"."+x.g),Xt(x,x.s);else{var D=h.location;x=D.protocol,d=d?d+"."+D.hostname:D.hostname,D=+D.port;var L=new Vt(null);x&&Wn(L,x),d&&(L.g=d),D&&Xt(L,D),m&&(L.l=m),x=L}return m=i.D,d=i.ya,m&&d&&Te(x,m,d),Te(x,"VER",i.la),Qn(i,x),x}function Jo(i,d,m){if(d&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=i.Ca&&!i.pa?new ze(new _s({eb:m})):new ze(i.pa),d.Ha(i.J),d}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qo(){}n=Qo.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Lt(){}Lt.prototype.g=function(i,d){return new nt(i,d)};function nt(i,d){dt.call(this),this.g=new Mi(d),this.l=i,this.h=d&&d.messageUrlParams||null,i=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(i?i["X-WebChannel-Content-Type"]=d.messageContentType:i={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(i?i["X-WebChannel-Client-Profile"]=d.va:i={"X-WebChannel-Client-Profile":d.va}),this.g.S=i,(i=d&&d.Sb)&&!ae(i)&&(this.g.m=i),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!ae(d)&&(this.g.D=d,i=this.h,i!==null&&d in i&&(i=this.h,d in i&&delete i[d])),this.j=new gn(this)}B(nt,dt),nt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},nt.prototype.close=function(){Sn(this.g)},nt.prototype.o=function(i){var d=this.g;if(typeof i=="string"){var m={};m.__data__=i,i=m}else this.u&&(m={},m.__data__=He(i),i=m);d.i.push(new Mo(d.Ya++,i)),d.G==3&&fn(d)},nt.prototype.N=function(){this.g.l=null,delete this.j,Sn(this.g),delete this.g,nt.aa.N.call(this)};function en(i){Pr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var d=i.__sm__;if(d){e:{for(const m in d){i=m;break e}i=void 0}(this.i=i)&&(i=this.i,d=d!==null&&i in d?d[i]:void 0),this.data=d}else this.data=i}B(en,Pr);function cr(){Rr.call(this),this.status=1}B(cr,Rr);function gn(i){this.g=i}B(gn,Qo),gn.prototype.ua=function(){ht(this.g,"a")},gn.prototype.ta=function(i){ht(this.g,new en(i))},gn.prototype.sa=function(i){ht(this.g,new cr)},gn.prototype.ra=function(){ht(this.g,"b")},Lt.prototype.createWebChannel=Lt.prototype.g,nt.prototype.send=nt.prototype.o,nt.prototype.open=nt.prototype.m,nt.prototype.close=nt.prototype.close,Mh=function(){return new Lt},Vh=function(){return Ys()},Oh=In,Gl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Or.NO_ERROR=0,Or.TIMEOUT=8,Or.HTTP_ERROR=6,ga=Or,Vr.COMPLETE="complete",Dh=Vr,xt.EventType=un,un.OPEN="a",un.CLOSE="b",un.ERROR="c",un.MESSAGE="d",dt.prototype.listen=dt.prototype.K,Zi=xt,ze.prototype.listenOnce=ze.prototype.L,ze.prototype.getLastError=ze.prototype.Ka,ze.prototype.getLastErrorCode=ze.prototype.Ba,ze.prototype.getStatus=ze.prototype.Z,ze.prototype.getResponseJson=ze.prototype.Oa,ze.prototype.getResponseText=ze.prototype.oa,ze.prototype.send=ze.prototype.ea,ze.prototype.setWithCredentials=ze.prototype.Ha,jh=ze}).apply(typeof oa<"u"?oa:typeof self<"u"?self:typeof window<"u"?window:{});const Ku="@firebase/firestore",Ju="4.8.0";/**
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
 */let jt=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};jt.UNAUTHENTICATED=new jt(null),jt.GOOGLE_CREDENTIALS=new jt("google-credentials-uid"),jt.FIRST_PARTY=new jt("first-party-uid"),jt.MOCK_USER=new jt("mock-user");/**
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
 */let bi="11.10.0";/**
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
 */const xr=new yc("@firebase/firestore");function ei(){return xr.logLevel}function ee(n,...e){if(xr.logLevel<=Ae.DEBUG){const t=e.map(xc);xr.debug(`Firestore (${bi}): ${n}`,...t)}}function as(n,...e){if(xr.logLevel<=Ae.ERROR){const t=e.map(xc);xr.error(`Firestore (${bi}): ${n}`,...t)}}function Us(n,...e){if(xr.logLevel<=Ae.WARN){const t=e.map(xc);xr.warn(`Firestore (${bi}): ${n}`,...t)}}function xc(n){if(typeof n=="string")return n;try{/**
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
 */function ue(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Fh(n,s,t)}function Fh(n,e,t){let s=`FIRESTORE (${bi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw as(s),new Error(s)}function Me(n,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,n||Fh(e,r,s)}function ge(n,e){return n}/**
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
 */const q={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class re extends us{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class ss{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Lh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class a0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(jt.UNAUTHENTICATED)))}shutdown(){}}class l0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class c0{constructor(e){this.t=e,this.currentUser=jt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Me(this.o===void 0,42304);let s=this.i;const r=p=>this.i!==s?(s=this.i,t(p)):Promise.resolve();let o=new ss;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new ss,e.enqueueRetryable((()=>r(this.currentUser)))};const l=()=>{const p=o;e.enqueueRetryable((async()=>{await p.promise,await r(this.currentUser)}))},h=p=>{ee("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=p,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((p=>h(p))),setTimeout((()=>{if(!this.auth){const p=this.t.getImmediate({optional:!0});p?h(p):(ee("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new ss)}}),0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(ee("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Me(typeof s.accessToken=="string",31837,{l:s}),new Lh(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Me(e===null||typeof e=="string",2055,{h:e}),new jt(e)}}class u0{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=jt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class d0{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new u0(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(jt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Qu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class h0{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,sn(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Me(this.o===void 0,3512);const s=o=>{o.error!=null&&ee("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const l=o.token!==this.m;return this.m=o.token,ee("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>s(o)))};const r=o=>{ee("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>r(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?r(o):ee("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Qu(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Me(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Qu(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */class _c{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=f0(40);for(let o=0;o<r.length;++o)s.length<20&&r[o]<t&&(s+=e.charAt(r[o]%62))}return s}}function we(n,e){return n<e?-1:n>e?1:0}function Kl(n,e){let t=0;for(;t<n.length&&t<e.length;){const s=n.codePointAt(t),r=e.codePointAt(t);if(s!==r){if(s<128&&r<128)return we(s,r);{const o=$h(),l=p0(o.encode(Xu(n,t)),o.encode(Xu(e,t)));return l!==0?l:we(s,r)}}t+=s>65535?2:1}return we(n.length,e.length)}function Xu(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function p0(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return we(n[t],e[t]);return we(n.length,e.length)}function ui(n,e,t){return n.length===e.length&&n.every(((s,r)=>t(s,e[r])))}/**
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
 */const Yu="__name__";class Rn{constructor(e,t,s){t===void 0?t=0:t>e.length&&ue(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&ue(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Rn.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Rn?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const o=Rn.compareSegments(e.get(r),t.get(r));if(o!==0)return o}return we(e.length,t.length)}static compareSegments(e,t){const s=Rn.isNumericId(e),r=Rn.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?Rn.extractNumericId(e).compare(Rn.extractNumericId(t)):Kl(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Fs.fromString(e.substring(4,e.length-2))}}class Je extends Rn{construct(e,t,s){return new Je(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new re(q.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((r=>r.length>0)))}return new Je(t)}static emptyPath(){return new Je([])}}const m0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class kt extends Rn{construct(e,t,s){return new kt(e,t,s)}static isValidIdentifier(e){return m0.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),kt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Yu}static keyField(){return new kt([Yu])}static fromServerFormat(e){const t=[];let s="",r=0;const o=()=>{if(s.length===0)throw new re(q.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let l=!1;for(;r<e.length;){const h=e[r];if(h==="\\"){if(r+1===e.length)throw new re(q.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const p=e[r+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new re(q.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=p,r+=2}else h==="`"?(l=!l,r++):h!=="."||l?(s+=h,r++):(o(),r++)}if(o(),l)throw new re(q.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new kt(t)}static emptyPath(){return new kt([])}}/**
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
 */class ce{constructor(e){this.path=e}static fromPath(e){return new ce(Je.fromString(e))}static fromName(e){return new ce(Je.fromString(e).popFirst(5))}static empty(){return new ce(Je.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Je.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Je.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ce(new Je(e.slice()))}}/**
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
 */function Uh(n,e,t){if(!t)throw new re(q.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function g0(n,e,t,s){if(e===!0&&s===!0)throw new re(q.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Zu(n){if(!ce.isDocumentKey(n))throw new re(q.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ed(n){if(ce.isDocumentKey(n))throw new re(q.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Bh(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function wc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":ue(12329,{type:typeof n})}function _r(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new re(q.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=wc(n);throw new re(q.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */function ut(n,e){const t={typeString:n};return e&&(t.value=e),t}function wo(n,e){if(!Bh(n))throw new re(q.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,o="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const l=n[s];if(r&&typeof l!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(o!==void 0&&l!==o.value){t=`Expected '${s}' field to equal '${o.value}'`;break}}if(t)throw new re(q.INVALID_ARGUMENT,t);return!0}/**
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
 */const td=-62135596800,nd=1e6;class Qe{static now(){return Qe.fromMillis(Date.now())}static fromDate(e){return Qe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*nd);return new Qe(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new re(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new re(q.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<td)throw new re(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new re(q.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/nd}_compareTo(e){return this.seconds===e.seconds?we(this.nanoseconds,e.nanoseconds):we(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Qe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(wo(e,Qe._jsonSchema))return new Qe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-td;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Qe._jsonSchemaVersion="firestore/timestamp/1.0",Qe._jsonSchema={type:ut("string",Qe._jsonSchemaVersion),seconds:ut("number"),nanoseconds:ut("number")};/**
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
 */class me{static fromTimestamp(e){return new me(e)}static min(){return new me(new Qe(0,0))}static max(){return new me(new Qe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const fo=-1;function y0(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=me.fromTimestamp(s===1e9?new Qe(t+1,0):new Qe(t,s));return new Bs(r,ce.empty(),e)}function b0(n){return new Bs(n.readTime,n.key,fo)}class Bs{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Bs(me.min(),ce.empty(),fo)}static max(){return new Bs(me.max(),ce.empty(),fo)}}function v0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=ce.comparator(n.documentKey,e.documentKey),t!==0?t:we(n.largestBatchId,e.largestBatchId))}/**
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
 */async function vi(n){if(n.code!==q.FAILED_PRECONDITION||n.message!==x0)throw n;ee("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class z{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&ue(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new z(((s,r)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(s,r)},this.catchCallback=o=>{this.wrapFailure(t,o).next(s,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof z?t:z.resolve(t)}catch(t){return z.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):z.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):z.reject(t)}static resolve(e){return new z(((t,s)=>{t(e)}))}static reject(e){return new z(((t,s)=>{s(e)}))}static waitFor(e){return new z(((t,s)=>{let r=0,o=0,l=!1;e.forEach((h=>{++r,h.next((()=>{++o,l&&o===r&&t()}),(p=>s(p)))})),l=!0,o===r&&t()}))}static or(e){let t=z.resolve(!1);for(const s of e)t=t.next((r=>r?z.resolve(r):s()));return t}static forEach(e,t){const s=[];return e.forEach(((r,o)=>{s.push(t.call(this,r,o))})),this.waitFor(s)}static mapArray(e,t){return new z(((s,r)=>{const o=e.length,l=new Array(o);let h=0;for(let p=0;p<o;p++){const b=p;t(e[b]).next((v=>{l[b]=v,++h,h===o&&s(l)}),(v=>r(v)))}}))}static doWhile(e,t){return new z(((s,r)=>{const o=()=>{e()===!0?t().next((()=>{o()}),r):s()};o()}))}}function w0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function xi(n){return n.name==="IndexedDbTransactionError"}/**
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
 */const Ec=-1;function Qa(n){return n==null}function Na(n){return n===0&&1/n==-1/0}function E0(n){return typeof n=="number"&&Number.isInteger(n)&&!Na(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const zh="";function T0(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=sd(e)),e=I0(n.get(t),e);return sd(e)}function I0(n,e){let t=e;const s=n.length;for(let r=0;r<s;r++){const o=n.charAt(r);switch(o){case"\0":t+="";break;case zh:t+="";break;default:t+=o}}return t}function sd(n){return n+zh+""}/**
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
 */function rd(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Tr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function qh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class Ze{constructor(e,t){this.comparator=e,this.root=t||It.EMPTY}insert(e,t){return new Ze(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,It.BLACK,null,null))}remove(e){return new Ze(this.comparator,this.root.remove(e,this.comparator).copy(null,null,It.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new aa(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new aa(this.root,e,this.comparator,!1)}getReverseIterator(){return new aa(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new aa(this.root,e,this.comparator,!0)}}class aa{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?s(e.key,t):1,t&&r&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class It{constructor(e,t,s,r,o){this.key=e,this.value=t,this.color=s??It.RED,this.left=r??It.EMPTY,this.right=o??It.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,o){return new It(e??this.key,t??this.value,s??this.color,r??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const o=s(e,r.key);return r=o<0?r.copy(null,null,null,r.left.insert(e,t,s),null):o===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return It.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return It.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,It.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,It.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw ue(43730,{key:this.key,value:this.value});if(this.right.isRed())throw ue(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw ue(27949);return e+(this.isRed()?0:1)}}It.EMPTY=null,It.RED=!0,It.BLACK=!1;It.EMPTY=new class{constructor(){this.size=0}get key(){throw ue(57766)}get value(){throw ue(16141)}get color(){throw ue(16727)}get left(){throw ue(29726)}get right(){throw ue(36894)}copy(e,t,s,r,o){return this}insert(e,t,s){return new It(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class bt{constructor(e){this.comparator=e,this.data=new Ze(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new id(this.data.getIterator())}getIteratorFrom(e){return new id(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof bt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(this.comparator(r,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new bt(this.comparator);return t.data=e,t}}class id{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class xn{constructor(e){this.fields=e,e.sort(kt.comparator)}static empty(){return new xn([])}unionWith(e){let t=new bt(kt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new xn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ui(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
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
 */class At{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Hh("Invalid base64 string: "+o):o}})(e);return new At(t)}static fromUint8Array(e){const t=(function(r){let o="";for(let l=0;l<r.length;++l)o+=String.fromCharCode(r[l]);return o})(e);return new At(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return we(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}At.EMPTY_BYTE_STRING=new At("");const k0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function zs(n){if(Me(!!n,39018),typeof n=="string"){let e=0;const t=k0.exec(n);if(Me(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:it(n.seconds),nanos:it(n.nanos)}}function it(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function qs(n){return typeof n=="string"?At.fromBase64String(n):At.fromUint8Array(n)}/**
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
 */const Wh="server_timestamp",Gh="__type__",Kh="__previous_value__",Jh="__local_write_time__";function Tc(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Gh])===null||t===void 0?void 0:t.stringValue)===Wh}function Xa(n){const e=n.mapValue.fields[Kh];return Tc(e)?Xa(e):e}function po(n){const e=zs(n.mapValue.fields[Jh].timestampValue);return new Qe(e.seconds,e.nanos)}/**
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
 */class A0{constructor(e,t,s,r,o,l,h,p,b,v){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=o,this.forceLongPolling=l,this.autoDetectLongPolling=h,this.longPollingOptions=p,this.useFetchStreams=b,this.isUsingEmulator=v}}const Sa="(default)";class mo{constructor(e,t){this.projectId=e,this.database=t||Sa}static empty(){return new mo("","")}get isDefaultDatabase(){return this.database===Sa}isEqual(e){return e instanceof mo&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Qh="__type__",N0="__max__",la={mapValue:{}},Xh="__vector__",Ca="value";function Hs(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Tc(n)?4:C0(n)?9007199254740991:S0(n)?10:11:ue(28295,{value:n})}function $n(n,e){if(n===e)return!0;const t=Hs(n);if(t!==Hs(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return po(n).isEqual(po(e));case 3:return(function(r,o){if(typeof r.timestampValue=="string"&&typeof o.timestampValue=="string"&&r.timestampValue.length===o.timestampValue.length)return r.timestampValue===o.timestampValue;const l=zs(r.timestampValue),h=zs(o.timestampValue);return l.seconds===h.seconds&&l.nanos===h.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,o){return qs(r.bytesValue).isEqual(qs(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,o){return it(r.geoPointValue.latitude)===it(o.geoPointValue.latitude)&&it(r.geoPointValue.longitude)===it(o.geoPointValue.longitude)})(n,e);case 2:return(function(r,o){if("integerValue"in r&&"integerValue"in o)return it(r.integerValue)===it(o.integerValue);if("doubleValue"in r&&"doubleValue"in o){const l=it(r.doubleValue),h=it(o.doubleValue);return l===h?Na(l)===Na(h):isNaN(l)&&isNaN(h)}return!1})(n,e);case 9:return ui(n.arrayValue.values||[],e.arrayValue.values||[],$n);case 10:case 11:return(function(r,o){const l=r.mapValue.fields||{},h=o.mapValue.fields||{};if(rd(l)!==rd(h))return!1;for(const p in l)if(l.hasOwnProperty(p)&&(h[p]===void 0||!$n(l[p],h[p])))return!1;return!0})(n,e);default:return ue(52216,{left:n})}}function go(n,e){return(n.values||[]).find((t=>$n(t,e)))!==void 0}function di(n,e){if(n===e)return 0;const t=Hs(n),s=Hs(e);if(t!==s)return we(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return we(n.booleanValue,e.booleanValue);case 2:return(function(o,l){const h=it(o.integerValue||o.doubleValue),p=it(l.integerValue||l.doubleValue);return h<p?-1:h>p?1:h===p?0:isNaN(h)?isNaN(p)?0:-1:1})(n,e);case 3:return od(n.timestampValue,e.timestampValue);case 4:return od(po(n),po(e));case 5:return Kl(n.stringValue,e.stringValue);case 6:return(function(o,l){const h=qs(o),p=qs(l);return h.compareTo(p)})(n.bytesValue,e.bytesValue);case 7:return(function(o,l){const h=o.split("/"),p=l.split("/");for(let b=0;b<h.length&&b<p.length;b++){const v=we(h[b],p[b]);if(v!==0)return v}return we(h.length,p.length)})(n.referenceValue,e.referenceValue);case 8:return(function(o,l){const h=we(it(o.latitude),it(l.latitude));return h!==0?h:we(it(o.longitude),it(l.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return ad(n.arrayValue,e.arrayValue);case 10:return(function(o,l){var h,p,b,v;const I=o.fields||{},k=l.fields||{},F=(h=I[Ca])===null||h===void 0?void 0:h.arrayValue,B=(p=k[Ca])===null||p===void 0?void 0:p.arrayValue,X=we(((b=F==null?void 0:F.values)===null||b===void 0?void 0:b.length)||0,((v=B==null?void 0:B.values)===null||v===void 0?void 0:v.length)||0);return X!==0?X:ad(F,B)})(n.mapValue,e.mapValue);case 11:return(function(o,l){if(o===la.mapValue&&l===la.mapValue)return 0;if(o===la.mapValue)return 1;if(l===la.mapValue)return-1;const h=o.fields||{},p=Object.keys(h),b=l.fields||{},v=Object.keys(b);p.sort(),v.sort();for(let I=0;I<p.length&&I<v.length;++I){const k=Kl(p[I],v[I]);if(k!==0)return k;const F=di(h[p[I]],b[v[I]]);if(F!==0)return F}return we(p.length,v.length)})(n.mapValue,e.mapValue);default:throw ue(23264,{le:t})}}function od(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return we(n,e);const t=zs(n),s=zs(e),r=we(t.seconds,s.seconds);return r!==0?r:we(t.nanos,s.nanos)}function ad(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const o=di(t[r],s[r]);if(o)return o}return we(t.length,s.length)}function hi(n){return Jl(n)}function Jl(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=zs(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return qs(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return ce.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",r=!0;for(const o of t.values||[])r?r=!1:s+=",",s+=Jl(o);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let r="{",o=!0;for(const l of s)o?o=!1:r+=",",r+=`${l}:${Jl(t.fields[l])}`;return r+"}"})(n.mapValue):ue(61005,{value:n})}function ya(n){switch(Hs(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Xa(n);return e?16+ya(e):16;case 5:return 2*n.stringValue.length;case 6:return qs(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((r,o)=>r+ya(o)),0)})(n.arrayValue);case 10:case 11:return(function(s){let r=0;return Tr(s.fields,((o,l)=>{r+=o.length+ya(l)})),r})(n.mapValue);default:throw ue(13486,{value:n})}}function Ql(n){return!!n&&"integerValue"in n}function Ic(n){return!!n&&"arrayValue"in n}function ld(n){return!!n&&"nullValue"in n}function cd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function ba(n){return!!n&&"mapValue"in n}function S0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Qh])===null||t===void 0?void 0:t.stringValue)===Xh}function oo(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Tr(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=oo(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=oo(n.arrayValue.values[t]);return e}return Object.assign({},n)}function C0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===N0}/**
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
 */class rn{constructor(e){this.value=e}static empty(){return new rn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!ba(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=oo(t)}setAll(e){let t=kt.emptyPath(),s={},r=[];e.forEach(((l,h)=>{if(!t.isImmediateParentOf(h)){const p=this.getFieldsMap(t);this.applyChanges(p,s,r),s={},r=[],t=h.popLast()}l?s[h.lastSegment()]=oo(l):r.push(h.lastSegment())}));const o=this.getFieldsMap(t);this.applyChanges(o,s,r)}delete(e){const t=this.field(e.popLast());ba(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return $n(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];ba(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){Tr(t,((r,o)=>e[r]=o));for(const r of s)delete e[r]}clone(){return new rn(oo(this.value))}}function Yh(n){const e=[];return Tr(n.fields,((t,s)=>{const r=new kt([t]);if(ba(s)){const o=Yh(s.mapValue).fields;if(o.length===0)e.push(r);else for(const l of o)e.push(r.child(l))}else e.push(r)})),new xn(e)}/**
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
 */class Dt{constructor(e,t,s,r,o,l,h){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=o,this.data=l,this.documentState=h}static newInvalidDocument(e){return new Dt(e,0,me.min(),me.min(),me.min(),rn.empty(),0)}static newFoundDocument(e,t,s,r){return new Dt(e,1,t,me.min(),s,r,0)}static newNoDocument(e,t){return new Dt(e,2,t,me.min(),me.min(),rn.empty(),0)}static newUnknownDocument(e,t){return new Dt(e,3,t,me.min(),me.min(),rn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(me.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=rn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=rn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=me.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Dt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Dt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Pa{constructor(e,t){this.position=e,this.inclusive=t}}function ud(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const o=e[r],l=n.position[r];if(o.field.isKeyField()?s=ce.comparator(ce.fromName(l.referenceValue),t.key):s=di(l,t.data.field(o.field)),o.dir==="desc"&&(s*=-1),s!==0)break}return s}function dd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!$n(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Zh{}class gt extends Zh{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new j0(e,t,s):t==="array-contains"?new V0(e,s):t==="in"?new M0(e,s):t==="not-in"?new F0(e,s):t==="array-contains-any"?new L0(e,s):new gt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new D0(e,s):new O0(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(di(t,this.value)):t!==null&&Hs(this.value)===Hs(t)&&this.matchesComparison(di(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ue(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Un extends Zh{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Un(e,t)}matches(e){return ef(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function ef(n){return n.op==="and"}function tf(n){return R0(n)&&ef(n)}function R0(n){for(const e of n.filters)if(e instanceof Un)return!1;return!0}function Xl(n){if(n instanceof gt)return n.field.canonicalString()+n.op.toString()+hi(n.value);if(tf(n))return n.filters.map((e=>Xl(e))).join(",");{const e=n.filters.map((t=>Xl(t))).join(",");return`${n.op}(${e})`}}function nf(n,e){return n instanceof gt?(function(s,r){return r instanceof gt&&s.op===r.op&&s.field.isEqual(r.field)&&$n(s.value,r.value)})(n,e):n instanceof Un?(function(s,r){return r instanceof Un&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce(((o,l,h)=>o&&nf(l,r.filters[h])),!0):!1})(n,e):void ue(19439)}function sf(n){return n instanceof gt?(function(t){return`${t.field.canonicalString()} ${t.op} ${hi(t.value)}`})(n):n instanceof Un?(function(t){return t.op.toString()+" {"+t.getFilters().map(sf).join(" ,")+"}"})(n):"Filter"}class j0 extends gt{constructor(e,t,s){super(e,t,s),this.key=ce.fromName(s.referenceValue)}matches(e){const t=ce.comparator(e.key,this.key);return this.matchesComparison(t)}}class D0 extends gt{constructor(e,t){super(e,"in",t),this.keys=rf("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class O0 extends gt{constructor(e,t){super(e,"not-in",t),this.keys=rf("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function rf(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>ce.fromName(s.referenceValue)))}class V0 extends gt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ic(t)&&go(t.arrayValue,this.value)}}class M0 extends gt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&go(this.value.arrayValue,t)}}class F0 extends gt{constructor(e,t){super(e,"not-in",t)}matches(e){if(go(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!go(this.value.arrayValue,t)}}class L0 extends gt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ic(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>go(this.value.arrayValue,s)))}}/**
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
 */class $0{constructor(e,t=null,s=[],r=[],o=null,l=null,h=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=o,this.startAt=l,this.endAt=h,this.Pe=null}}function hd(n,e=null,t=[],s=[],r=null,o=null,l=null){return new $0(n,e,t,s,r,o,l)}function kc(n){const e=ge(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>Xl(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(o){return o.field.canonicalString()+o.dir})(s))).join(","),Qa(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>hi(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>hi(s))).join(",")),e.Pe=t}return e.Pe}function Ac(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!P0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!nf(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!dd(n.startAt,e.startAt)&&dd(n.endAt,e.endAt)}function Yl(n){return ce.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Ya{constructor(e,t=null,s=[],r=[],o=null,l="F",h=null,p=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=o,this.limitType=l,this.startAt=h,this.endAt=p,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function U0(n,e,t,s,r,o,l,h){return new Ya(n,e,t,s,r,o,l,h)}function Nc(n){return new Ya(n)}function fd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function B0(n){return n.collectionGroup!==null}function ao(n){const e=ge(n);if(e.Te===null){e.Te=[];const t=new Set;for(const o of e.explicitOrderBy)e.Te.push(o),t.add(o.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let h=new bt(kt.comparator);return l.filters.forEach((p=>{p.getFlattenedFilters().forEach((b=>{b.isInequality()&&(h=h.add(b.field))}))})),h})(e).forEach((o=>{t.has(o.canonicalString())||o.isKeyField()||e.Te.push(new Ra(o,s))})),t.has(kt.keyField().canonicalString())||e.Te.push(new Ra(kt.keyField(),s))}return e.Te}function On(n){const e=ge(n);return e.Ie||(e.Ie=z0(e,ao(n))),e.Ie}function z0(n,e){if(n.limitType==="F")return hd(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const o=r.dir==="desc"?"asc":"desc";return new Ra(r.field,o)}));const t=n.endAt?new Pa(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Pa(n.startAt.position,n.startAt.inclusive):null;return hd(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Zl(n,e,t){return new Ya(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Za(n,e){return Ac(On(n),On(e))&&n.limitType===e.limitType}function of(n){return`${kc(On(n))}|lt:${n.limitType}`}function ti(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((r=>sf(r))).join(", ")}]`),Qa(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((r=>(function(l){return`${l.field.canonicalString()} (${l.dir})`})(r))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((r=>hi(r))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((r=>hi(r))).join(",")),`Target(${s})`})(On(n))}; limitType=${n.limitType})`}function el(n,e){return e.isFoundDocument()&&(function(s,r){const o=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(o):ce.isDocumentKey(s.path)?s.path.isEqual(o):s.path.isImmediateParentOf(o)})(n,e)&&(function(s,r){for(const o of ao(s))if(!o.field.isKeyField()&&r.data.field(o.field)===null)return!1;return!0})(n,e)&&(function(s,r){for(const o of s.filters)if(!o.matches(r))return!1;return!0})(n,e)&&(function(s,r){return!(s.startAt&&!(function(l,h,p){const b=ud(l,h,p);return l.inclusive?b<=0:b<0})(s.startAt,ao(s),r)||s.endAt&&!(function(l,h,p){const b=ud(l,h,p);return l.inclusive?b>=0:b>0})(s.endAt,ao(s),r))})(n,e)}function q0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function af(n){return(e,t)=>{let s=!1;for(const r of ao(n)){const o=H0(r,e,t);if(o!==0)return o;s=s||r.field.isKeyField()}return 0}}function H0(n,e,t){const s=n.field.isKeyField()?ce.comparator(e.key,t.key):(function(o,l,h){const p=l.data.field(o),b=h.data.field(o);return p!==null&&b!==null?di(p,b):ue(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return ue(19790,{direction:n.dir})}}/**
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
 */class Ir{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,o]of s)if(this.equalsFn(r,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let o=0;o<r.length;o++)if(this.equalsFn(r[o][0],e))return void(r[o]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Tr(this.inner,((t,s)=>{for(const[r,o]of s)e(r,o)}))}isEmpty(){return qh(this.inner)}size(){return this.innerSize}}/**
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
 */const W0=new Ze(ce.comparator);function ls(){return W0}const lf=new Ze(ce.comparator);function eo(...n){let e=lf;for(const t of n)e=e.insert(t.key,t);return e}function cf(n){let e=lf;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function pr(){return lo()}function uf(){return lo()}function lo(){return new Ir((n=>n.toString()),((n,e)=>n.isEqual(e)))}const G0=new Ze(ce.comparator),K0=new bt(ce.comparator);function Ne(...n){let e=K0;for(const t of n)e=e.add(t);return e}const J0=new bt(we);function Q0(){return J0}/**
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
 */function Sc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Na(e)?"-0":e}}function df(n){return{integerValue:""+n}}function X0(n,e){return E0(e)?df(e):Sc(n,e)}/**
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
 */class tl{constructor(){this._=void 0}}function Y0(n,e,t){return n instanceof ja?(function(r,o){const l={fields:{[Gh]:{stringValue:Wh},[Jh]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return o&&Tc(o)&&(o=Xa(o)),o&&(l.fields[Kh]=o),{mapValue:l}})(t,e):n instanceof yo?ff(n,e):n instanceof bo?pf(n,e):(function(r,o){const l=hf(r,o),h=pd(l)+pd(r.Ee);return Ql(l)&&Ql(r.Ee)?df(h):Sc(r.serializer,h)})(n,e)}function Z0(n,e,t){return n instanceof yo?ff(n,e):n instanceof bo?pf(n,e):t}function hf(n,e){return n instanceof Da?(function(s){return Ql(s)||(function(o){return!!o&&"doubleValue"in o})(s)})(e)?e:{integerValue:0}:null}class ja extends tl{}class yo extends tl{constructor(e){super(),this.elements=e}}function ff(n,e){const t=mf(e);for(const s of n.elements)t.some((r=>$n(r,s)))||t.push(s);return{arrayValue:{values:t}}}class bo extends tl{constructor(e){super(),this.elements=e}}function pf(n,e){let t=mf(e);for(const s of n.elements)t=t.filter((r=>!$n(r,s)));return{arrayValue:{values:t}}}class Da extends tl{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function pd(n){return it(n.integerValue||n.doubleValue)}function mf(n){return Ic(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function ey(n,e){return n.field.isEqual(e.field)&&(function(s,r){return s instanceof yo&&r instanceof yo||s instanceof bo&&r instanceof bo?ui(s.elements,r.elements,$n):s instanceof Da&&r instanceof Da?$n(s.Ee,r.Ee):s instanceof ja&&r instanceof ja})(n.transform,e.transform)}class ty{constructor(e,t){this.version=e,this.transformResults=t}}class rs{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rs}static exists(e){return new rs(void 0,e)}static updateTime(e){return new rs(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function va(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class nl{}function gf(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new bf(n.key,rs.none()):new Eo(n.key,n.data,rs.none());{const t=n.data,s=rn.empty();let r=new bt(kt.comparator);for(let o of e.fields)if(!r.has(o)){let l=t.field(o);l===null&&o.length>1&&(o=o.popLast(),l=t.field(o)),l===null?s.delete(o):s.set(o,l),r=r.add(o)}return new kr(n.key,s,new xn(r.toArray()),rs.none())}}function ny(n,e,t){n instanceof Eo?(function(r,o,l){const h=r.value.clone(),p=gd(r.fieldTransforms,o,l.transformResults);h.setAll(p),o.convertToFoundDocument(l.version,h).setHasCommittedMutations()})(n,e,t):n instanceof kr?(function(r,o,l){if(!va(r.precondition,o))return void o.convertToUnknownDocument(l.version);const h=gd(r.fieldTransforms,o,l.transformResults),p=o.data;p.setAll(yf(r)),p.setAll(h),o.convertToFoundDocument(l.version,p).setHasCommittedMutations()})(n,e,t):(function(r,o,l){o.convertToNoDocument(l.version).setHasCommittedMutations()})(0,e,t)}function co(n,e,t,s){return n instanceof Eo?(function(o,l,h,p){if(!va(o.precondition,l))return h;const b=o.value.clone(),v=yd(o.fieldTransforms,p,l);return b.setAll(v),l.convertToFoundDocument(l.version,b).setHasLocalMutations(),null})(n,e,t,s):n instanceof kr?(function(o,l,h,p){if(!va(o.precondition,l))return h;const b=yd(o.fieldTransforms,p,l),v=l.data;return v.setAll(yf(o)),v.setAll(b),l.convertToFoundDocument(l.version,v).setHasLocalMutations(),h===null?null:h.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((I=>I.field)))})(n,e,t,s):(function(o,l,h){return va(o.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):h})(n,e,t)}function sy(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),o=hf(s.transform,r||null);o!=null&&(t===null&&(t=rn.empty()),t.set(s.field,o))}return t||null}function md(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&ui(s,r,((o,l)=>ey(o,l)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Eo extends nl{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class kr extends nl{constructor(e,t,s,r,o=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function yf(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function gd(n,e,t){const s=new Map;Me(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let r=0;r<t.length;r++){const o=n[r],l=o.transform,h=e.data.field(o.field);s.set(o.field,Z0(l,h,t[r]))}return s}function yd(n,e,t){const s=new Map;for(const r of n){const o=r.transform,l=t.data.field(r.field);s.set(r.field,Y0(o,l,e))}return s}class bf extends nl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ry extends nl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class iy{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const o=this.mutations[r];o.key.isEqual(e.key)&&ny(o,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=co(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=co(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=uf();return this.mutations.forEach((r=>{const o=e.get(r.key),l=o.overlayedDocument;let h=this.applyToLocalView(l,o.mutatedFields);h=t.has(r.key)?null:h;const p=gf(l,h);p!==null&&s.set(r.key,p),l.isValidDocument()||l.convertToNoDocument(me.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Ne())}isEqual(e){return this.batchId===e.batchId&&ui(this.mutations,e.mutations,((t,s)=>md(t,s)))&&ui(this.baseMutations,e.baseMutations,((t,s)=>md(t,s)))}}class Cc{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){Me(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let r=(function(){return G0})();const o=e.mutations;for(let l=0;l<o.length;l++)r=r.insert(o[l].key,s[l].version);return new Cc(e,t,s,r)}}/**
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
 */var ct,Se;function ly(n){switch(n){case q.OK:return ue(64938);case q.CANCELLED:case q.UNKNOWN:case q.DEADLINE_EXCEEDED:case q.RESOURCE_EXHAUSTED:case q.INTERNAL:case q.UNAVAILABLE:case q.UNAUTHENTICATED:return!1;case q.INVALID_ARGUMENT:case q.NOT_FOUND:case q.ALREADY_EXISTS:case q.PERMISSION_DENIED:case q.FAILED_PRECONDITION:case q.ABORTED:case q.OUT_OF_RANGE:case q.UNIMPLEMENTED:case q.DATA_LOSS:return!0;default:return ue(15467,{code:n})}}function vf(n){if(n===void 0)return as("GRPC error has no .code"),q.UNKNOWN;switch(n){case ct.OK:return q.OK;case ct.CANCELLED:return q.CANCELLED;case ct.UNKNOWN:return q.UNKNOWN;case ct.DEADLINE_EXCEEDED:return q.DEADLINE_EXCEEDED;case ct.RESOURCE_EXHAUSTED:return q.RESOURCE_EXHAUSTED;case ct.INTERNAL:return q.INTERNAL;case ct.UNAVAILABLE:return q.UNAVAILABLE;case ct.UNAUTHENTICATED:return q.UNAUTHENTICATED;case ct.INVALID_ARGUMENT:return q.INVALID_ARGUMENT;case ct.NOT_FOUND:return q.NOT_FOUND;case ct.ALREADY_EXISTS:return q.ALREADY_EXISTS;case ct.PERMISSION_DENIED:return q.PERMISSION_DENIED;case ct.FAILED_PRECONDITION:return q.FAILED_PRECONDITION;case ct.ABORTED:return q.ABORTED;case ct.OUT_OF_RANGE:return q.OUT_OF_RANGE;case ct.UNIMPLEMENTED:return q.UNIMPLEMENTED;case ct.DATA_LOSS:return q.DATA_LOSS;default:return ue(39323,{code:n})}}(Se=ct||(ct={}))[Se.OK=0]="OK",Se[Se.CANCELLED=1]="CANCELLED",Se[Se.UNKNOWN=2]="UNKNOWN",Se[Se.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Se[Se.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Se[Se.NOT_FOUND=5]="NOT_FOUND",Se[Se.ALREADY_EXISTS=6]="ALREADY_EXISTS",Se[Se.PERMISSION_DENIED=7]="PERMISSION_DENIED",Se[Se.UNAUTHENTICATED=16]="UNAUTHENTICATED",Se[Se.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Se[Se.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Se[Se.ABORTED=10]="ABORTED",Se[Se.OUT_OF_RANGE=11]="OUT_OF_RANGE",Se[Se.UNIMPLEMENTED=12]="UNIMPLEMENTED",Se[Se.INTERNAL=13]="INTERNAL",Se[Se.UNAVAILABLE=14]="UNAVAILABLE",Se[Se.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const cy=new Fs([4294967295,4294967295],0);function bd(n){const e=$h().encode(n),t=new Rh;return t.update(e),new Uint8Array(t.digest())}function vd(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new Fs([t,s],0),new Fs([r,o],0)]}class Pc{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new to(`Invalid padding: ${t}`);if(s<0)throw new to(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new to(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new to(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Fs.fromNumber(this.fe)}pe(e,t,s){let r=e.add(t.multiply(Fs.fromNumber(s)));return r.compare(cy)===1&&(r=new Fs([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=bd(e),[s,r]=vd(t);for(let o=0;o<this.hashCount;o++){const l=this.pe(s,r,o);if(!this.ye(l))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),l=new Pc(o,r,t);return s.forEach((h=>l.insert(h))),l}insert(e){if(this.fe===0)return;const t=bd(e),[s,r]=vd(t);for(let o=0;o<this.hashCount;o++){const l=this.pe(s,r,o);this.we(l)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class to extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class sl{constructor(e,t,s,r,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,To.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new sl(me.min(),r,new Ze(we),ls(),Ne())}}class To{constructor(e,t,s,r,o){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new To(s,t,Ne(),Ne(),Ne())}}/**
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
 */class xa{constructor(e,t,s,r){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=r}}class xf{constructor(e,t){this.targetId=e,this.De=t}}class _f{constructor(e,t,s=At.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class xd{constructor(){this.ve=0,this.Ce=_d(),this.Fe=At.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=Ne(),t=Ne(),s=Ne();return this.Ce.forEach(((r,o)=>{switch(o){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:ue(38017,{changeType:o})}})),new To(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=_d()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Me(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class uy{constructor(e){this.We=e,this.Ge=new Map,this.ze=ls(),this.je=ca(),this.Je=ca(),this.He=new Ze(we)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:ue(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,r)=>{this.nt(r)&&t(r)}))}it(e){const t=e.targetId,s=e.De.count,r=this.st(t);if(r){const o=r.target;if(Yl(o))if(s===0){const l=new ce(o.path);this.Xe(t,l,Dt.newNoDocument(l,me.min()))}else Me(s===1,20013,{expectedCount:s});else{const l=this.ot(t);if(l!==s){const h=this._t(e),p=h?this.ut(h,e,l):1;if(p!==0){this.rt(t);const b=p===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,b)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:o=0}=t;let l,h;try{l=qs(s).toUint8Array()}catch(p){if(p instanceof Hh)return Us("Decoding the base64 bloom filter in existence filter failed ("+p.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw p}try{h=new Pc(l,r,o)}catch(p){return Us(p instanceof to?"BloomFilter error: ":"Applying bloom filter failed: ",p),null}return h.fe===0?null:h}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let r=0;return s.forEach((o=>{const l=this.We.lt(),h=`projects/${l.projectId}/databases/${l.database}/documents/${o.path.canonicalString()}`;e.mightContain(h)||(this.Xe(t,o,null),r++)})),r}Pt(e){const t=new Map;this.Ge.forEach(((o,l)=>{const h=this.st(l);if(h){if(o.current&&Yl(h.target)){const p=new ce(h.target.path);this.Tt(p).has(l)||this.It(l,p)||this.Xe(l,p,Dt.newNoDocument(p,e))}o.Ne&&(t.set(l,o.Le()),o.ke())}}));let s=Ne();this.Je.forEach(((o,l)=>{let h=!0;l.forEachWhile((p=>{const b=this.st(p);return!b||b.purpose==="TargetPurposeLimboResolution"||(h=!1,!1)})),h&&(s=s.add(o))})),this.ze.forEach(((o,l)=>l.setReadTime(e)));const r=new sl(e,t,this.He,this.ze,s);return this.ze=ls(),this.je=ca(),this.Je=ca(),this.He=new Ze(we),r}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new xd,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new bt(we),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new bt(we),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ee("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new xd),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function ca(){return new Ze(ce.comparator)}function _d(){return new Ze(ce.comparator)}const dy={asc:"ASCENDING",desc:"DESCENDING"},hy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fy={and:"AND",or:"OR"};class py{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ec(n,e){return n.useProto3Json||Qa(e)?e:{value:e}}function Oa(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function wf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function my(n,e){return Oa(n,e.toTimestamp())}function Vn(n){return Me(!!n,49232),me.fromTimestamp((function(t){const s=zs(t);return new Qe(s.seconds,s.nanos)})(n))}function Rc(n,e){return tc(n,e).canonicalString()}function tc(n,e){const t=(function(r){return new Je(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Ef(n){const e=Je.fromString(n);return Me(Nf(e),10190,{key:e.toString()}),e}function nc(n,e){return Rc(n.databaseId,e.path)}function jl(n,e){const t=Ef(e);if(t.get(1)!==n.databaseId.projectId)throw new re(q.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new re(q.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new ce(If(t))}function Tf(n,e){return Rc(n.databaseId,e)}function gy(n){const e=Ef(n);return e.length===4?Je.emptyPath():If(e)}function sc(n){return new Je(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function If(n){return Me(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function wd(n,e,t){return{name:nc(n,e),fields:t.value.mapValue.fields}}function yy(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(b){return b==="NO_CHANGE"?0:b==="ADD"?1:b==="REMOVE"?2:b==="CURRENT"?3:b==="RESET"?4:ue(39313,{state:b})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],o=(function(b,v){return b.useProto3Json?(Me(v===void 0||typeof v=="string",58123),At.fromBase64String(v||"")):(Me(v===void 0||v instanceof Buffer||v instanceof Uint8Array,16193),At.fromUint8Array(v||new Uint8Array))})(n,e.targetChange.resumeToken),l=e.targetChange.cause,h=l&&(function(b){const v=b.code===void 0?q.UNKNOWN:vf(b.code);return new re(v,b.message||"")})(l);t=new _f(s,r,o,h||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=jl(n,s.document.name),o=Vn(s.document.updateTime),l=s.document.createTime?Vn(s.document.createTime):me.min(),h=new rn({mapValue:{fields:s.document.fields}}),p=Dt.newFoundDocument(r,o,l,h),b=s.targetIds||[],v=s.removedTargetIds||[];t=new xa(b,v,p.key,p)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=jl(n,s.document),o=s.readTime?Vn(s.readTime):me.min(),l=Dt.newNoDocument(r,o),h=s.removedTargetIds||[];t=new xa([],h,l.key,l)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=jl(n,s.document),o=s.removedTargetIds||[];t=new xa([],o,r,null)}else{if(!("filter"in e))return ue(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:o}=s,l=new ay(r,o),h=s.targetId;t=new xf(h,l)}}return t}function by(n,e){let t;if(e instanceof Eo)t={update:wd(n,e.key,e.value)};else if(e instanceof bf)t={delete:nc(n,e.key)};else if(e instanceof kr)t={update:wd(n,e.key,e.data),updateMask:Ay(e.fieldMask)};else{if(!(e instanceof ry))return ue(16599,{Rt:e.type});t={verify:nc(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(o,l){const h=l.transform;if(h instanceof ja)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(h instanceof yo)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:h.elements}};if(h instanceof bo)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:h.elements}};if(h instanceof Da)return{fieldPath:l.field.canonicalString(),increment:h.Ee};throw ue(20930,{transform:l.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(r,o){return o.updateTime!==void 0?{updateTime:my(r,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:ue(27497)})(n,e.precondition)),t}function vy(n,e){return n&&n.length>0?(Me(e!==void 0,14353),n.map((t=>(function(r,o){let l=r.updateTime?Vn(r.updateTime):Vn(o);return l.isEqual(me.min())&&(l=Vn(o)),new ty(l,r.transformResults||[])})(t,e)))):[]}function xy(n,e){return{documents:[Tf(n,e.path)]}}function _y(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Tf(n,r);const o=(function(b){if(b.length!==0)return Af(Un.create(b,"and"))})(e.filters);o&&(t.structuredQuery.where=o);const l=(function(b){if(b.length!==0)return b.map((v=>(function(k){return{field:ni(k.field),direction:Ty(k.dir)}})(v)))})(e.orderBy);l&&(t.structuredQuery.orderBy=l);const h=ec(n,e.limit);return h!==null&&(t.structuredQuery.limit=h),e.startAt&&(t.structuredQuery.startAt=(function(b){return{before:b.inclusive,values:b.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(b){return{before:!b.inclusive,values:b.position}})(e.endAt)),{Vt:t,parent:r}}function wy(n){let e=gy(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){Me(s===1,65062);const v=t.from[0];v.allDescendants?r=v.collectionId:e=e.child(v.collectionId)}let o=[];t.where&&(o=(function(I){const k=kf(I);return k instanceof Un&&tf(k)?k.getFilters():[k]})(t.where));let l=[];t.orderBy&&(l=(function(I){return I.map((k=>(function(B){return new Ra(si(B.field),(function(J){switch(J){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(B.direction))})(k)))})(t.orderBy));let h=null;t.limit&&(h=(function(I){let k;return k=typeof I=="object"?I.value:I,Qa(k)?null:k})(t.limit));let p=null;t.startAt&&(p=(function(I){const k=!!I.before,F=I.values||[];return new Pa(F,k)})(t.startAt));let b=null;return t.endAt&&(b=(function(I){const k=!I.before,F=I.values||[];return new Pa(F,k)})(t.endAt)),U0(e,r,l,o,h,"F",p,b)}function Ey(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return ue(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function kf(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=si(t.unaryFilter.field);return gt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=si(t.unaryFilter.field);return gt.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=si(t.unaryFilter.field);return gt.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=si(t.unaryFilter.field);return gt.create(l,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return ue(61313);default:return ue(60726)}})(n):n.fieldFilter!==void 0?(function(t){return gt.create(si(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return ue(58110);default:return ue(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Un.create(t.compositeFilter.filters.map((s=>kf(s))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return ue(1026)}})(t.compositeFilter.op))})(n):ue(30097,{filter:n})}function Ty(n){return dy[n]}function Iy(n){return hy[n]}function ky(n){return fy[n]}function ni(n){return{fieldPath:n.canonicalString()}}function si(n){return kt.fromServerFormat(n.fieldPath)}function Af(n){return n instanceof gt?(function(t){if(t.op==="=="){if(cd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NAN"}};if(ld(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(cd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NOT_NAN"}};if(ld(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ni(t.field),op:Iy(t.op),value:t.value}}})(n):n instanceof Un?(function(t){const s=t.getFilters().map((r=>Af(r)));return s.length===1?s[0]:{compositeFilter:{op:ky(t.op),filters:s}}})(n):ue(54877,{filter:n})}function Ay(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Nf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class Ds{constructor(e,t,s,r,o=me.min(),l=me.min(),h=At.EMPTY_BYTE_STRING,p=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=h,this.expectedCount=p}withSequenceNumber(e){return new Ds(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ds(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ds(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ds(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class Ny{constructor(e){this.gt=e}}function Sy(n){const e=wy({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Zl(e,e.limit,"L"):e}/**
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
 */class Cy{constructor(){this.Dn=new Py}addToCollectionParentIndex(e,t){return this.Dn.add(t),z.resolve()}getCollectionParents(e,t){return z.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return z.resolve()}deleteFieldIndex(e,t){return z.resolve()}deleteAllFieldIndexes(e){return z.resolve()}createTargetIndexes(e,t){return z.resolve()}getDocumentsMatchingTarget(e,t){return z.resolve(null)}getIndexType(e,t){return z.resolve(0)}getFieldIndexes(e,t){return z.resolve([])}getNextCollectionGroupToUpdate(e){return z.resolve(null)}getMinOffset(e,t){return z.resolve(Bs.min())}getMinOffsetFromCollectionGroup(e,t){return z.resolve(Bs.min())}updateCollectionGroup(e,t,s){return z.resolve()}updateIndexEntries(e,t){return z.resolve()}}class Py{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new bt(Je.comparator),o=!r.has(s);return this.index[t]=r.add(s),o}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new bt(Je.comparator)).toArray()}}/**
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
 */const Ed={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Sf=41943040;class qt{static withCacheSize(e){return new qt(e,qt.DEFAULT_COLLECTION_PERCENTILE,qt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
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
 */qt.DEFAULT_COLLECTION_PERCENTILE=10,qt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,qt.DEFAULT=new qt(Sf,qt.DEFAULT_COLLECTION_PERCENTILE,qt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),qt.DISABLED=new qt(-1,0,0);/**
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
 */class fi{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new fi(0)}static ur(){return new fi(-1)}}/**
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
 */const Td="LruGarbageCollector",Ry=1048576;function Id([n,e],[t,s]){const r=we(n,t);return r===0?we(e,s):r}class jy{constructor(e){this.Tr=e,this.buffer=new bt(Id),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();Id(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Dy{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){ee(Td,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){xi(t)?ee(Td,"Ignoring IndexedDB error during garbage collection: ",t):await vi(t)}await this.Rr(3e5)}))}}class Oy{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return z.resolve(Ja.ue);const s=new jy(t);return this.Vr.forEachTarget(e,(r=>s.Er(r.sequenceNumber))).next((()=>this.Vr.gr(e,(r=>s.Er(r))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ee("LruGarbageCollector","Garbage collection skipped; disabled"),z.resolve(Ed)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(ee("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ed):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,r,o,l,h,p,b;const v=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((I=>(I>this.params.maximumSequenceNumbersToCollect?(ee("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${I}`),r=this.params.maximumSequenceNumbersToCollect):r=I,l=Date.now(),this.nthSequenceNumber(e,r)))).next((I=>(s=I,h=Date.now(),this.removeTargets(e,s,t)))).next((I=>(o=I,p=Date.now(),this.removeOrphanedDocuments(e,s)))).next((I=>(b=Date.now(),ei()<=Ae.DEBUG&&ee("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${l-v}ms
	Determined least recently used ${r} in `+(h-l)+`ms
	Removed ${o} targets in `+(p-h)+`ms
	Removed ${I} documents in `+(b-p)+`ms
Total Duration: ${b-v}ms`),z.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:o,documentsRemoved:I}))))}}function Vy(n,e){return new Oy(n,e)}/**
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
 */class My{constructor(){this.changes=new Ir((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Dt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?z.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Ly{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(s=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(s!==null&&co(s.mutation,r,xn.empty(),Qe.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,Ne()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=Ne()){const r=pr();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,s).next((o=>{let l=eo();return o.forEach(((h,p)=>{l=l.insert(h,p.overlayedDocument)})),l}))))}getOverlayedDocuments(e,t){const s=pr();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,Ne())))}populateOverlays(e,t,s){const r=[];return s.forEach((o=>{t.has(o)||r.push(o)})),this.documentOverlayCache.getOverlays(e,r).next((o=>{o.forEach(((l,h)=>{t.set(l,h)}))}))}computeViews(e,t,s,r){let o=ls();const l=lo(),h=(function(){return lo()})();return t.forEach(((p,b)=>{const v=s.get(b.key);r.has(b.key)&&(v===void 0||v.mutation instanceof kr)?o=o.insert(b.key,b):v!==void 0?(l.set(b.key,v.mutation.getFieldMask()),co(v.mutation,b,v.mutation.getFieldMask(),Qe.now())):l.set(b.key,xn.empty())})),this.recalculateAndSaveOverlays(e,o).next((p=>(p.forEach(((b,v)=>l.set(b,v))),t.forEach(((b,v)=>{var I;return h.set(b,new Fy(v,(I=l.get(b))!==null&&I!==void 0?I:null))})),h)))}recalculateAndSaveOverlays(e,t){const s=lo();let r=new Ze(((l,h)=>l-h)),o=Ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((l=>{for(const h of l)h.keys().forEach((p=>{const b=t.get(p);if(b===null)return;let v=s.get(p)||xn.empty();v=h.applyToLocalView(b,v),s.set(p,v);const I=(r.get(h.batchId)||Ne()).add(p);r=r.insert(h.batchId,I)}))})).next((()=>{const l=[],h=r.getReverseIterator();for(;h.hasNext();){const p=h.getNext(),b=p.key,v=p.value,I=uf();v.forEach((k=>{if(!o.has(k)){const F=gf(t.get(k),s.get(k));F!==null&&I.set(k,F),o=o.add(k)}})),l.push(this.documentOverlayCache.saveOverlays(e,b,I))}return z.waitFor(l)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,r){return(function(l){return ce.isDocumentKey(l.path)&&l.collectionGroup===null&&l.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):B0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next((o=>{const l=r-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-o.size):z.resolve(pr());let h=fo,p=o;return l.next((b=>z.forEach(b,((v,I)=>(h<I.largestBatchId&&(h=I.largestBatchId),o.get(v)?z.resolve():this.remoteDocumentCache.getEntry(e,v).next((k=>{p=p.insert(v,k)}))))).next((()=>this.populateOverlays(e,b,o))).next((()=>this.computeViews(e,p,b,Ne()))).next((v=>({batchId:h,changes:cf(v)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ce(t)).next((s=>{let r=eo();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const o=t.collectionGroup;let l=eo();return this.indexManager.getCollectionParents(e,o).next((h=>z.forEach(h,(p=>{const b=(function(I,k){return new Ya(k,null,I.explicitOrderBy.slice(),I.filters.slice(),I.limit,I.limitType,I.startAt,I.endAt)})(t,p.child(o));return this.getDocumentsMatchingCollectionQuery(e,b,s,r).next((v=>{v.forEach(((I,k)=>{l=l.insert(I,k)}))}))})).next((()=>l))))}getDocumentsMatchingCollectionQuery(e,t,s,r){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((l=>(o=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,o,r)))).next((l=>{o.forEach(((p,b)=>{const v=b.getKey();l.get(v)===null&&(l=l.insert(v,Dt.newInvalidDocument(v)))}));let h=eo();return l.forEach(((p,b)=>{const v=o.get(p);v!==void 0&&co(v.mutation,b,xn.empty(),Qe.now()),el(t,b)&&(h=h.insert(p,b))})),h}))}}/**
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
 */class $y{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return z.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:Vn(r.createTime)}})(t)),z.resolve()}getNamedQuery(e,t){return z.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(r){return{name:r.name,query:Sy(r.bundledQuery),readTime:Vn(r.readTime)}})(t)),z.resolve()}}/**
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
 */class Uy{constructor(){this.overlays=new Ze(ce.comparator),this.kr=new Map}getOverlay(e,t){return z.resolve(this.overlays.get(t))}getOverlays(e,t){const s=pr();return z.forEach(t,(r=>this.getOverlay(e,r).next((o=>{o!==null&&s.set(r,o)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((r,o)=>{this.wt(e,t,o)})),z.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.kr.get(s);return r!==void 0&&(r.forEach((o=>this.overlays=this.overlays.remove(o))),this.kr.delete(s)),z.resolve()}getOverlaysForCollection(e,t,s){const r=pr(),o=t.length+1,l=new ce(t.child("")),h=this.overlays.getIteratorFrom(l);for(;h.hasNext();){const p=h.getNext().value,b=p.getKey();if(!t.isPrefixOf(b.path))break;b.path.length===o&&p.largestBatchId>s&&r.set(p.getKey(),p)}return z.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let o=new Ze(((b,v)=>b-v));const l=this.overlays.getIterator();for(;l.hasNext();){const b=l.getNext().value;if(b.getKey().getCollectionGroup()===t&&b.largestBatchId>s){let v=o.get(b.largestBatchId);v===null&&(v=pr(),o=o.insert(b.largestBatchId,v)),v.set(b.getKey(),b)}}const h=pr(),p=o.getIterator();for(;p.hasNext()&&(p.getNext().value.forEach(((b,v)=>h.set(b,v))),!(h.size()>=r)););return z.resolve(h)}wt(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const l=this.kr.get(r.largestBatchId).delete(s.key);this.kr.set(r.largestBatchId,l)}this.overlays=this.overlays.insert(s.key,new oy(t,s));let o=this.kr.get(t);o===void 0&&(o=Ne(),this.kr.set(t,o)),this.kr.set(t,o.add(s.key))}}/**
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
 */class By{constructor(){this.sessionToken=At.EMPTY_BYTE_STRING}getSessionToken(e){return z.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,z.resolve()}}/**
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
 */class jc{constructor(){this.qr=new bt(wt.Qr),this.$r=new bt(wt.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new wt(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new wt(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new ce(new Je([])),s=new wt(t,e),r=new wt(t,e+1),o=[];return this.$r.forEachInRange([s,r],(l=>{this.Wr(l),o.push(l.key)})),o}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new ce(new Je([])),s=new wt(t,e),r=new wt(t,e+1);let o=Ne();return this.$r.forEachInRange([s,r],(l=>{o=o.add(l.key)})),o}containsKey(e){const t=new wt(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class wt{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return ce.comparator(e.key,t.key)||we(e.Hr,t.Hr)}static Ur(e,t){return we(e.Hr,t.Hr)||ce.comparator(e.key,t.key)}}/**
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
 */class zy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new bt(wt.Qr)}checkEmpty(e){return z.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const o=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new iy(o,t,s,r);this.mutationQueue.push(l);for(const h of r)this.Yr=this.Yr.add(new wt(h.key,o)),this.indexManager.addToCollectionParentIndex(e,h.key.path.popLast());return z.resolve(l)}lookupMutationBatch(e,t){return z.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.Xr(s),o=r<0?0:r;return z.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return z.resolve(this.mutationQueue.length===0?Ec:this.er-1)}getAllMutationBatches(e){return z.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new wt(t,0),r=new wt(t,Number.POSITIVE_INFINITY),o=[];return this.Yr.forEachInRange([s,r],(l=>{const h=this.Zr(l.Hr);o.push(h)})),z.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new bt(we);return t.forEach((r=>{const o=new wt(r,0),l=new wt(r,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([o,l],(h=>{s=s.add(h.Hr)}))})),z.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let o=s;ce.isDocumentKey(o)||(o=o.child(""));const l=new wt(new ce(o),0);let h=new bt(we);return this.Yr.forEachWhile((p=>{const b=p.key.path;return!!s.isPrefixOf(b)&&(b.length===r&&(h=h.add(p.Hr)),!0)}),l),z.resolve(this.ei(h))}ei(e){const t=[];return e.forEach((s=>{const r=this.Zr(s);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){Me(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return z.forEach(t.mutations,(r=>{const o=new wt(r.key,t.batchId);return s=s.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new wt(t,0),r=this.Yr.firstAfterOrEqual(s);return z.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,z.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class qy{constructor(e){this.ni=e,this.docs=(function(){return new Ze(ce.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),o=r?r.size:0,l=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:l}),this.size+=l-o,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return z.resolve(s?s.document.mutableCopy():Dt.newInvalidDocument(t))}getEntries(e,t){let s=ls();return t.forEach((r=>{const o=this.docs.get(r);s=s.insert(r,o?o.document.mutableCopy():Dt.newInvalidDocument(r))})),z.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let o=ls();const l=t.path,h=new ce(l.child("__id-9223372036854775808__")),p=this.docs.getIteratorFrom(h);for(;p.hasNext();){const{key:b,value:{document:v}}=p.getNext();if(!l.isPrefixOf(b.path))break;b.path.length>l.length+1||v0(b0(v),s)<=0||(r.has(v.key)||el(t,v))&&(o=o.insert(v.key,v.mutableCopy()))}return z.resolve(o)}getAllFromCollectionGroup(e,t,s,r){ue(9500)}ri(e,t){return z.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new Hy(this)}getSize(e){return z.resolve(this.size)}}class Hy extends My{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(s)})),z.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
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
 */class Wy{constructor(e){this.persistence=e,this.ii=new Ir((t=>kc(t)),Ac),this.lastRemoteSnapshotVersion=me.min(),this.highestTargetId=0,this.si=0,this.oi=new jc,this.targetCount=0,this._i=fi.ar()}forEachTarget(e,t){return this.ii.forEach(((s,r)=>t(r))),z.resolve()}getLastRemoteSnapshotVersion(e){return z.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return z.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),z.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),z.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new fi(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,z.resolve()}updateTargetData(e,t){return this.hr(t),z.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,z.resolve()}removeTargets(e,t,s){let r=0;const o=[];return this.ii.forEach(((l,h)=>{h.sequenceNumber<=t&&s.get(h.targetId)===null&&(this.ii.delete(l),o.push(this.removeMatchingKeysForTargetId(e,h.targetId)),r++)})),z.waitFor(o).next((()=>r))}getTargetCount(e){return z.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return z.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),z.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const r=this.persistence.referenceDelegate,o=[];return r&&t.forEach((l=>{o.push(r.markPotentiallyOrphaned(e,l))})),z.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),z.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return z.resolve(s)}containsKey(e,t){return z.resolve(this.oi.containsKey(t))}}/**
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
 */class Cf{constructor(e,t){this.ai={},this.overlays={},this.ui=new Ja(0),this.ci=!1,this.ci=!0,this.li=new By,this.referenceDelegate=e(this),this.hi=new Wy(this),this.indexManager=new Cy,this.remoteDocumentCache=(function(r){return new qy(r)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new Ny(t),this.Ti=new $y(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Uy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new zy(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){ee("MemoryPersistence","Starting transaction:",e);const r=new Gy(this.ui.next());return this.referenceDelegate.Ii(),s(r).next((o=>this.referenceDelegate.di(r).next((()=>o)))).toPromise().then((o=>(r.raiseOnCommittedEvent(),o)))}Ei(e,t){return z.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class Gy extends _0{constructor(e){super(),this.currentSequenceNumber=e}}class Dc{constructor(e){this.persistence=e,this.Ai=new jc,this.Ri=null}static Vi(e){return new Dc(e)}get mi(){if(this.Ri)return this.Ri;throw ue(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),z.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),z.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),z.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((r=>this.mi.add(r.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((o=>this.mi.add(o.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return z.forEach(this.mi,(s=>{const r=ce.fromPath(s);return this.fi(e,r).next((o=>{o||t.removeEntry(r,me.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return z.or([()=>z.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Va{constructor(e,t){this.persistence=e,this.gi=new Ir((s=>T0(s.path)),((s,r)=>s.isEqual(r))),this.garbageCollector=Vy(this,t)}static Vi(e,t){return new Va(e,t)}Ii(){}di(e){return z.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((r=>s+r))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return z.forEach(this.gi,((s,r)=>this.Sr(e,s,r).next((o=>o?z.resolve():t(r)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const r=this.persistence.getRemoteDocumentCache(),o=r.newChangeBuffer();return r.ri(e,(l=>this.Sr(e,l,t).next((h=>{h||(s++,o.removeEntry(l,me.min()))})))).next((()=>o.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),z.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),z.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),z.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),z.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ya(e.data.value)),t}Sr(e,t,s){return z.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.gi.get(t);return z.resolve(r!==void 0&&r>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Oc{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=r}static Es(e,t){let s=Ne(),r=Ne();for(const o of t.docChanges)switch(o.type){case 0:s=s.add(o.doc.key);break;case 1:r=r.add(o.doc.key)}return new Oc(e,t.fromCache,s,r)}}/**
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
 */class Jy{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return Um()?8:w0(Ot())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,r){const o={result:null};return this.ps(e,t).next((l=>{o.result=l})).next((()=>{if(!o.result)return this.ys(e,t,r,s).next((l=>{o.result=l}))})).next((()=>{if(o.result)return;const l=new Ky;return this.ws(e,t,l).next((h=>{if(o.result=h,this.Rs)return this.Ss(e,t,l,h.size)}))})).next((()=>o.result))}Ss(e,t,s,r){return s.documentReadCount<this.Vs?(ei()<=Ae.DEBUG&&ee("QueryEngine","SDK will not create cache indexes for query:",ti(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),z.resolve()):(ei()<=Ae.DEBUG&&ee("QueryEngine","Query:",ti(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.fs*r?(ei()<=Ae.DEBUG&&ee("QueryEngine","The SDK decides to create cache indexes for query:",ti(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,On(t))):z.resolve())}ps(e,t){if(fd(t))return z.resolve(null);let s=On(t);return this.indexManager.getIndexType(e,s).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=Zl(t,null,"F"),s=On(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const l=Ne(...o);return this.gs.getDocuments(e,l).next((h=>this.indexManager.getMinOffset(e,s).next((p=>{const b=this.bs(t,h);return this.Ds(t,b,l,p.readTime)?this.ps(e,Zl(t,null,"F")):this.vs(e,b,t,p)}))))})))))}ys(e,t,s,r){return fd(t)||r.isEqual(me.min())?z.resolve(null):this.gs.getDocuments(e,s).next((o=>{const l=this.bs(t,o);return this.Ds(t,l,s,r)?z.resolve(null):(ei()<=Ae.DEBUG&&ee("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),ti(t)),this.vs(e,l,t,y0(r,fo)).next((h=>h)))}))}bs(e,t){let s=new bt(af(e));return t.forEach(((r,o)=>{el(e,o)&&(s=s.add(o))})),s}Ds(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(r)>0)}ws(e,t,s){return ei()<=Ae.DEBUG&&ee("QueryEngine","Using full collection scan to execute query:",ti(t)),this.gs.getDocumentsMatchingQuery(e,t,Bs.min(),s)}vs(e,t,s,r){return this.gs.getDocumentsMatchingQuery(e,s,r).next((o=>(t.forEach((l=>{o=o.insert(l.key,l)})),o)))}}/**
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
 */const Vc="LocalStore",Qy=3e8;class Xy{constructor(e,t,s,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new Ze(we),this.Ms=new Ir((o=>kc(o)),Ac),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Ly(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function Yy(n,e,t,s){return new Xy(n,e,t,s)}async function Pf(n,e){const t=ge(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next((o=>(r=o,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((o=>{const l=[],h=[];let p=Ne();for(const b of r){l.push(b.batchId);for(const v of b.mutations)p=p.add(v.key)}for(const b of o){h.push(b.batchId);for(const v of b.mutations)p=p.add(v.key)}return t.localDocuments.getDocuments(s,p).next((b=>({Bs:b,removedBatchIds:l,addedBatchIds:h})))}))}))}function Zy(n,e){const t=ge(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const r=e.batch.keys(),o=t.Os.newChangeBuffer({trackRemovals:!0});return(function(h,p,b,v){const I=b.batch,k=I.keys();let F=z.resolve();return k.forEach((B=>{F=F.next((()=>v.getEntry(p,B))).next((X=>{const J=b.docVersions.get(B);Me(J!==null,48541),X.version.compareTo(J)<0&&(I.applyToRemoteDocument(X,b),X.isValidDocument()&&(X.setReadTime(b.commitVersion),v.addEntry(X)))}))})),F.next((()=>h.mutationQueue.removeMutationBatch(p,I)))})(t,s,e,o).next((()=>o.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(h){let p=Ne();for(let b=0;b<h.mutationResults.length;++b)h.mutationResults[b].transformResults.length>0&&(p=p.add(h.batch.mutations[b].key));return p})(e)))).next((()=>t.localDocuments.getDocuments(s,r)))}))}function Rf(n){const e=ge(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function eb(n,e){const t=ge(n),s=e.snapshotVersion;let r=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const l=t.Os.newChangeBuffer({trackRemovals:!0});r=t.Fs;const h=[];e.targetChanges.forEach(((v,I)=>{const k=r.get(I);if(!k)return;h.push(t.hi.removeMatchingKeys(o,v.removedDocuments,I).next((()=>t.hi.addMatchingKeys(o,v.addedDocuments,I))));let F=k.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(I)!==null?F=F.withResumeToken(At.EMPTY_BYTE_STRING,me.min()).withLastLimboFreeSnapshotVersion(me.min()):v.resumeToken.approximateByteSize()>0&&(F=F.withResumeToken(v.resumeToken,s)),r=r.insert(I,F),(function(X,J,xe){return X.resumeToken.approximateByteSize()===0||J.snapshotVersion.toMicroseconds()-X.snapshotVersion.toMicroseconds()>=Qy?!0:xe.addedDocuments.size+xe.modifiedDocuments.size+xe.removedDocuments.size>0})(k,F,v)&&h.push(t.hi.updateTargetData(o,F))}));let p=ls(),b=Ne();if(e.documentUpdates.forEach((v=>{e.resolvedLimboDocuments.has(v)&&h.push(t.persistence.referenceDelegate.updateLimboDocument(o,v))})),h.push(tb(o,l,e.documentUpdates).next((v=>{p=v.Ls,b=v.ks}))),!s.isEqual(me.min())){const v=t.hi.getLastRemoteSnapshotVersion(o).next((I=>t.hi.setTargetsMetadata(o,o.currentSequenceNumber,s)));h.push(v)}return z.waitFor(h).next((()=>l.apply(o))).next((()=>t.localDocuments.getLocalViewOfDocuments(o,p,b))).next((()=>p))})).then((o=>(t.Fs=r,o)))}function tb(n,e,t){let s=Ne(),r=Ne();return t.forEach((o=>s=s.add(o))),e.getEntries(n,s).next((o=>{let l=ls();return t.forEach(((h,p)=>{const b=o.get(h);p.isFoundDocument()!==b.isFoundDocument()&&(r=r.add(h)),p.isNoDocument()&&p.version.isEqual(me.min())?(e.removeEntry(h,p.readTime),l=l.insert(h,p)):!b.isValidDocument()||p.version.compareTo(b.version)>0||p.version.compareTo(b.version)===0&&b.hasPendingWrites?(e.addEntry(p),l=l.insert(h,p)):ee(Vc,"Ignoring outdated watch update for ",h,". Current version:",b.version," Watch version:",p.version)})),{Ls:l,ks:r}}))}function nb(n,e){const t=ge(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=Ec),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function sb(n,e){const t=ge(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let r;return t.hi.getTargetData(s,e).next((o=>o?(r=o,z.resolve(r)):t.hi.allocateTargetId(s).next((l=>(r=new Ds(e,l,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,r).next((()=>r)))))))})).then((s=>{const r=t.Fs.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function rc(n,e,t){const s=ge(n),r=s.Fs.get(e),o=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",o,(l=>s.persistence.referenceDelegate.removeTarget(l,r)))}catch(l){if(!xi(l))throw l;ee(Vc,`Failed to update sequence numbers for target ${e}: ${l}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(r.target)}function kd(n,e,t){const s=ge(n);let r=me.min(),o=Ne();return s.persistence.runTransaction("Execute query","readwrite",(l=>(function(p,b,v){const I=ge(p),k=I.Ms.get(v);return k!==void 0?z.resolve(I.Fs.get(k)):I.hi.getTargetData(b,v)})(s,l,On(e)).next((h=>{if(h)return r=h.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(l,h.targetId).next((p=>{o=p}))})).next((()=>s.Cs.getDocumentsMatchingQuery(l,e,t?r:me.min(),t?o:Ne()))).next((h=>(rb(s,q0(e),h),{documents:h,qs:o})))))}function rb(n,e,t){let s=n.xs.get(e)||me.min();t.forEach(((r,o)=>{o.readTime.compareTo(s)>0&&(s=o.readTime)})),n.xs.set(e,s)}class Ad{constructor(){this.activeTargetIds=Q0()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ib{constructor(){this.Fo=new Ad,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Ad,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */const Nd="ConnectivityMonitor";class Sd{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){ee(Nd,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){ee(Nd,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ua=null;function ic(){return ua===null?ua=(function(){return 268435456+Math.round(2147483648*Math.random())})():ua++,"0x"+ua.toString(16)}/**
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
 */const Dl="RestConnection",ab={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class lb{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${r}`,this.Ko=this.databaseId.database===Sa?`project_id=${s}`:`project_id=${s}&database_id=${r}`}Wo(e,t,s,r,o){const l=ic(),h=this.Go(e,t.toUriEncodedString());ee(Dl,`Sending RPC '${e}' ${l}:`,h,s);const p={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(p,r,o);const{host:b}=new URL(h),v=gi(b);return this.jo(e,h,p,s,v).then((I=>(ee(Dl,`Received RPC '${e}' ${l}: `,I),I)),(I=>{throw Us(Dl,`RPC '${e}' ${l} failed with error: `,I,"url: ",h,"request:",s),I}))}Jo(e,t,s,r,o,l){return this.Wo(e,t,s,r,o)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+bi})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,o)=>e[o]=r)),s&&s.headers.forEach(((r,o)=>e[o]=r))}Go(e,t){const s=ab[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
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
 */const Rt="WebChannelConnection";class ub extends lb{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,r,o){const l=ic();return new Promise(((h,p)=>{const b=new jh;b.setWithCredentials(!0),b.listenOnce(Dh.COMPLETE,(()=>{try{switch(b.getLastErrorCode()){case ga.NO_ERROR:const I=b.getResponseJson();ee(Rt,`XHR for RPC '${e}' ${l} received:`,JSON.stringify(I)),h(I);break;case ga.TIMEOUT:ee(Rt,`RPC '${e}' ${l} timed out`),p(new re(q.DEADLINE_EXCEEDED,"Request time out"));break;case ga.HTTP_ERROR:const k=b.getStatus();if(ee(Rt,`RPC '${e}' ${l} failed with status:`,k,"response text:",b.getResponseText()),k>0){let F=b.getResponseJson();Array.isArray(F)&&(F=F[0]);const B=F==null?void 0:F.error;if(B&&B.status&&B.message){const X=(function(xe){const ae=xe.toLowerCase().replace(/_/g,"-");return Object.values(q).indexOf(ae)>=0?ae:q.UNKNOWN})(B.status);p(new re(X,B.message))}else p(new re(q.UNKNOWN,"Server responded with status "+b.getStatus()))}else p(new re(q.UNAVAILABLE,"Connection failed."));break;default:ue(9055,{c_:e,streamId:l,l_:b.getLastErrorCode(),h_:b.getLastError()})}}finally{ee(Rt,`RPC '${e}' ${l} completed.`)}}));const v=JSON.stringify(r);ee(Rt,`RPC '${e}' ${l} sending request:`,r),b.send(t,"POST",v,s,15)}))}P_(e,t,s){const r=ic(),o=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=Mh(),h=Vh(),p={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},b=this.longPollingOptions.timeoutSeconds;b!==void 0&&(p.longPollingTimeout=Math.round(1e3*b)),this.useFetchStreams&&(p.useFetchStreams=!0),this.zo(p.initMessageHeaders,t,s),p.encodeInitMessageHeaders=!0;const v=o.join("");ee(Rt,`Creating RPC '${e}' stream ${r}: ${v}`,p);const I=l.createWebChannel(v,p);this.T_(I);let k=!1,F=!1;const B=new cb({Ho:J=>{F?ee(Rt,`Not sending because RPC '${e}' stream ${r} is closed:`,J):(k||(ee(Rt,`Opening RPC '${e}' stream ${r} transport.`),I.open(),k=!0),ee(Rt,`RPC '${e}' stream ${r} sending:`,J),I.send(J))},Yo:()=>I.close()}),X=(J,xe,ae)=>{J.listen(xe,(pe=>{try{ae(pe)}catch(de){setTimeout((()=>{throw de}),0)}}))};return X(I,Zi.EventType.OPEN,(()=>{F||(ee(Rt,`RPC '${e}' stream ${r} transport opened.`),B.s_())})),X(I,Zi.EventType.CLOSE,(()=>{F||(F=!0,ee(Rt,`RPC '${e}' stream ${r} transport closed`),B.__(),this.I_(I))})),X(I,Zi.EventType.ERROR,(J=>{F||(F=!0,Us(Rt,`RPC '${e}' stream ${r} transport errored. Name:`,J.name,"Message:",J.message),B.__(new re(q.UNAVAILABLE,"The operation could not be completed")))})),X(I,Zi.EventType.MESSAGE,(J=>{var xe;if(!F){const ae=J.data[0];Me(!!ae,16349);const pe=ae,de=(pe==null?void 0:pe.error)||((xe=pe[0])===null||xe===void 0?void 0:xe.error);if(de){ee(Rt,`RPC '${e}' stream ${r} received error:`,de);const st=de.status;let Fe=(function(E){const P=ct[E];if(P!==void 0)return vf(P)})(st),j=de.message;Fe===void 0&&(Fe=q.INTERNAL,j="Unknown error status: "+st+" with message "+de.message),F=!0,B.__(new re(Fe,j)),I.close()}else ee(Rt,`RPC '${e}' stream ${r} received:`,ae),B.a_(ae)}})),X(h,Oh.STAT_EVENT,(J=>{J.stat===Gl.PROXY?ee(Rt,`RPC '${e}' stream ${r} detected buffering proxy`):J.stat===Gl.NOPROXY&&ee(Rt,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{B.o_()}),0),B}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Ol(){return typeof document<"u"?document:null}/**
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
 */const Cd="PersistentStream";class Df{constructor(e,t,s,r,o,l,h,p){this.Fi=e,this.w_=s,this.S_=r,this.connection=o,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=h,this.listener=p,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new jf(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===q.RESOURCE_EXHAUSTED?(as(t.toString()),as("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===q.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,r])=>{this.b_===t&&this.W_(s,r)}),(s=>{e((()=>{const r=new re(q.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(r)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((r=>{s((()=>this.G_(r)))})),this.stream.onMessage((r=>{s((()=>++this.C_==1?this.j_(r):this.onNext(r)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return ee(Cd,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(ee(Cd,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class db extends Df{constructor(e,t,s,r,o,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,l),this.serializer=o}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=yy(this.serializer,e),s=(function(o){if(!("targetChange"in o))return me.min();const l=o.targetChange;return l.targetIds&&l.targetIds.length?me.min():l.readTime?Vn(l.readTime):me.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=sc(this.serializer),t.addTarget=(function(o,l){let h;const p=l.target;if(h=Yl(p)?{documents:xy(o,p)}:{query:_y(o,p).Vt},h.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){h.resumeToken=wf(o,l.resumeToken);const b=ec(o,l.expectedCount);b!==null&&(h.expectedCount=b)}else if(l.snapshotVersion.compareTo(me.min())>0){h.readTime=Oa(o,l.snapshotVersion.toTimestamp());const b=ec(o,l.expectedCount);b!==null&&(h.expectedCount=b)}return h})(this.serializer,e);const s=Ey(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=sc(this.serializer),t.removeTarget=e,this.k_(t)}}class hb extends Df{constructor(e,t,s,r,o,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,l),this.serializer=o}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Me(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Me(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Me(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=vy(e.writeResults,e.commitTime),s=Vn(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=sc(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>by(this.serializer,s)))};this.k_(t)}}/**
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
 */class fb{}class pb extends fb{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new re(q.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Wo(e,tc(t,s),r,o,l))).catch((o=>{throw o.name==="FirebaseError"?(o.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new re(q.UNKNOWN,o.toString())}))}Jo(e,t,s,r,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Jo(e,tc(t,s),r,l,h,o))).catch((l=>{throw l.name==="FirebaseError"?(l.code===q.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new re(q.UNKNOWN,l.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class mb{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(as(t),this._a=!1):ee("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const wr="RemoteStore";class gb{constructor(e,t,s,r,o){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=o,this.Ea.xo((l=>{s.enqueueAndForget((async()=>{Ar(this)&&(ee(wr,"Restarting streams for network reachability change."),await(async function(p){const b=ge(p);b.Ia.add(4),await Io(b),b.Aa.set("Unknown"),b.Ia.delete(4),await il(b)})(this))}))})),this.Aa=new mb(s,r)}}async function il(n){if(Ar(n))for(const e of n.da)await e(!0)}async function Io(n){for(const e of n.da)await e(!1)}function Of(n,e){const t=ge(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),$c(t)?Lc(t):_i(t).x_()&&Fc(t,e))}function Mc(n,e){const t=ge(n),s=_i(t);t.Ta.delete(e),s.x_()&&Vf(t,e),t.Ta.size===0&&(s.x_()?s.B_():Ar(t)&&t.Aa.set("Unknown"))}function Fc(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(me.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}_i(n).H_(e)}function Vf(n,e){n.Ra.$e(e),_i(n).Y_(e)}function Lc(n){n.Ra=new uy({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),_i(n).start(),n.Aa.aa()}function $c(n){return Ar(n)&&!_i(n).M_()&&n.Ta.size>0}function Ar(n){return ge(n).Ia.size===0}function Mf(n){n.Ra=void 0}async function yb(n){n.Aa.set("Online")}async function bb(n){n.Ta.forEach(((e,t)=>{Fc(n,e)}))}async function vb(n,e){Mf(n),$c(n)?(n.Aa.la(e),Lc(n)):n.Aa.set("Unknown")}async function xb(n,e,t){if(n.Aa.set("Online"),e instanceof _f&&e.state===2&&e.cause)try{await(async function(r,o){const l=o.cause;for(const h of o.targetIds)r.Ta.has(h)&&(await r.remoteSyncer.rejectListen(h,l),r.Ta.delete(h),r.Ra.removeTarget(h))})(n,e)}catch(s){ee(wr,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ma(n,s)}else if(e instanceof xa?n.Ra.Ye(e):e instanceof xf?n.Ra.it(e):n.Ra.et(e),!t.isEqual(me.min()))try{const s=await Rf(n.localStore);t.compareTo(s)>=0&&await(function(o,l){const h=o.Ra.Pt(l);return h.targetChanges.forEach(((p,b)=>{if(p.resumeToken.approximateByteSize()>0){const v=o.Ta.get(b);v&&o.Ta.set(b,v.withResumeToken(p.resumeToken,l))}})),h.targetMismatches.forEach(((p,b)=>{const v=o.Ta.get(p);if(!v)return;o.Ta.set(p,v.withResumeToken(At.EMPTY_BYTE_STRING,v.snapshotVersion)),Vf(o,p);const I=new Ds(v.target,p,b,v.sequenceNumber);Fc(o,I)})),o.remoteSyncer.applyRemoteEvent(h)})(n,t)}catch(s){ee(wr,"Failed to raise snapshot:",s),await Ma(n,s)}}async function Ma(n,e,t){if(!xi(e))throw e;n.Ia.add(1),await Io(n),n.Aa.set("Offline"),t||(t=()=>Rf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{ee(wr,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await il(n)}))}function Ff(n,e){return e().catch((t=>Ma(n,t,e)))}async function ol(n){const e=ge(n),t=Ws(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Ec;for(;_b(e);)try{const r=await nb(e.localStore,s);if(r===null){e.Pa.length===0&&t.B_();break}s=r.batchId,wb(e,r)}catch(r){await Ma(e,r)}Lf(e)&&$f(e)}function _b(n){return Ar(n)&&n.Pa.length<10}function wb(n,e){n.Pa.push(e);const t=Ws(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Lf(n){return Ar(n)&&!Ws(n).M_()&&n.Pa.length>0}function $f(n){Ws(n).start()}async function Eb(n){Ws(n).na()}async function Tb(n){const e=Ws(n);for(const t of n.Pa)e.X_(t.mutations)}async function Ib(n,e,t){const s=n.Pa.shift(),r=Cc.from(s,e,t);await Ff(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await ol(n)}async function kb(n,e){e&&Ws(n).Z_&&await(async function(s,r){if((function(l){return ly(l)&&l!==q.ABORTED})(r.code)){const o=s.Pa.shift();Ws(s).N_(),await Ff(s,(()=>s.remoteSyncer.rejectFailedWrite(o.batchId,r))),await ol(s)}})(n,e),Lf(n)&&$f(n)}async function Pd(n,e){const t=ge(n);t.asyncQueue.verifyOperationInProgress(),ee(wr,"RemoteStore received new credentials");const s=Ar(t);t.Ia.add(3),await Io(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await il(t)}async function Ab(n,e){const t=ge(n);e?(t.Ia.delete(2),await il(t)):e||(t.Ia.add(2),await Io(t),t.Aa.set("Unknown"))}function _i(n){return n.Va||(n.Va=(function(t,s,r){const o=ge(t);return o.ia(),new db(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:yb.bind(null,n),e_:bb.bind(null,n),n_:vb.bind(null,n),J_:xb.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),$c(n)?Lc(n):n.Aa.set("Unknown")):(await n.Va.stop(),Mf(n))}))),n.Va}function Ws(n){return n.ma||(n.ma=(function(t,s,r){const o=ge(t);return o.ia(),new hb(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:Eb.bind(null,n),n_:kb.bind(null,n),ea:Tb.bind(null,n),ta:Ib.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await ol(n)):(await n.ma.stop(),n.Pa.length>0&&(ee(wr,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
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
 */class Uc{constructor(e,t,s,r,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=o,this.deferred=new ss,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,o){const l=Date.now()+s,h=new Uc(e,t,l,r,o);return h.start(s),h}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new re(q.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Bc(n,e){if(as("AsyncQueue",`${e}: ${n}`),xi(n))return new re(q.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class ri{static emptySet(e){return new ri(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||ce.comparator(t.key,s.key):(t,s)=>ce.comparator(t.key,s.key),this.keyedMap=eo(),this.sortedSet=new Ze(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ri)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(!r.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new ri;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class Rd{constructor(){this.fa=new Ze(ce.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):ue(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class pi{constructor(e,t,s,r,o,l,h,p,b){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=o,this.fromCache=l,this.syncStateChanged=h,this.excludesMetadataChanges=p,this.hasCachedResults=b}static fromInitialDocuments(e,t,s,r,o){const l=[];return t.forEach((h=>{l.push({type:0,doc:h})})),new pi(e,t,ri.emptySet(t),l,s,r,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Za(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
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
 */class Nb{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class Sb{constructor(){this.queries=jd(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const r=ge(t),o=r.queries;r.queries=jd(),o.forEach(((l,h)=>{for(const p of h.wa)p.onError(s)}))})(this,new re(q.ABORTED,"Firestore shutting down"))}}function jd(){return new Ir((n=>of(n)),Za)}async function Uf(n,e){const t=ge(n);let s=3;const r=e.query;let o=t.queries.get(r);o?!o.Sa()&&e.ba()&&(s=2):(o=new Nb,s=e.ba()?0:1);try{switch(s){case 0:o.ya=await t.onListen(r,!0);break;case 1:o.ya=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(l){const h=Bc(l,`Initialization of query '${ti(e.query)}' failed`);return void e.onError(h)}t.queries.set(r,o),o.wa.push(e),e.va(t.onlineState),o.ya&&e.Ca(o.ya)&&zc(t)}async function Bf(n,e){const t=ge(n),s=e.query;let r=3;const o=t.queries.get(s);if(o){const l=o.wa.indexOf(e);l>=0&&(o.wa.splice(l,1),o.wa.length===0?r=e.ba()?0:1:!o.Sa()&&e.ba()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function Cb(n,e){const t=ge(n);let s=!1;for(const r of e){const o=r.query,l=t.queries.get(o);if(l){for(const h of l.wa)h.Ca(r)&&(s=!0);l.ya=r}}s&&zc(t)}function Pb(n,e,t){const s=ge(n),r=s.queries.get(e);if(r)for(const o of r.wa)o.onError(t);s.queries.delete(e)}function zc(n){n.Da.forEach((e=>{e.next()}))}var oc,Dd;(Dd=oc||(oc={})).Fa="default",Dd.Cache="cache";class zf{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new pi(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=pi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==oc.Cache}}/**
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
 */class qf{constructor(e){this.key=e}}class Hf{constructor(e){this.key=e}}class Rb{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=Ne(),this.mutatedKeys=Ne(),this.Xa=af(e),this.eu=new ri(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new Rd,r=t?t.eu:this.eu;let o=t?t.mutatedKeys:this.mutatedKeys,l=r,h=!1;const p=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,b=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((v,I)=>{const k=r.get(v),F=el(this.query,I)?I:null,B=!!k&&this.mutatedKeys.has(k.key),X=!!F&&(F.hasLocalMutations||this.mutatedKeys.has(F.key)&&F.hasCommittedMutations);let J=!1;k&&F?k.data.isEqual(F.data)?B!==X&&(s.track({type:3,doc:F}),J=!0):this.iu(k,F)||(s.track({type:2,doc:F}),J=!0,(p&&this.Xa(F,p)>0||b&&this.Xa(F,b)<0)&&(h=!0)):!k&&F?(s.track({type:0,doc:F}),J=!0):k&&!F&&(s.track({type:1,doc:k}),J=!0,(p||b)&&(h=!0)),J&&(F?(l=l.add(F),o=X?o.add(v):o.delete(v)):(l=l.delete(v),o=o.delete(v)))})),this.query.limit!==null)for(;l.size>this.query.limit;){const v=this.query.limitType==="F"?l.last():l.first();l=l.delete(v.key),o=o.delete(v.key),s.track({type:1,doc:v})}return{eu:l,ru:s,Ds:h,mutatedKeys:o}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const o=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const l=e.ru.pa();l.sort(((v,I)=>(function(F,B){const X=J=>{switch(J){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return ue(20277,{At:J})}};return X(F)-X(B)})(v.type,I.type)||this.Xa(v.doc,I.doc))),this.su(s),r=r!=null&&r;const h=t&&!r?this.ou():[],p=this.Za.size===0&&this.current&&!r?1:0,b=p!==this.Ya;return this.Ya=p,l.length!==0||b?{snapshot:new pi(this.query,e.eu,o,l,e.mutatedKeys,p===0,b,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:h}:{_u:h}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Rd,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=Ne(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new Hf(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new qf(s))})),t}uu(e){this.Ha=e.qs,this.Za=Ne();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return pi.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const qc="SyncEngine";class jb{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class Db{constructor(e){this.key=e,this.lu=!1}}class Ob{constructor(e,t,s,r,o,l){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=o,this.maxConcurrentLimboResolutions=l,this.hu={},this.Pu=new Ir((h=>of(h)),Za),this.Tu=new Map,this.Iu=new Set,this.du=new Ze(ce.comparator),this.Eu=new Map,this.Au=new jc,this.Ru={},this.Vu=new Map,this.mu=fi.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function Vb(n,e,t=!0){const s=Xf(n);let r;const o=s.Pu.get(e);return o?(s.sharedClientState.addLocalQueryTarget(o.targetId),r=o.view.cu()):r=await Wf(s,e,t,!0),r}async function Mb(n,e){const t=Xf(n);await Wf(t,e,!0,!1)}async function Wf(n,e,t,s){const r=await sb(n.localStore,On(e)),o=r.targetId,l=n.sharedClientState.addLocalQueryTarget(o,t);let h;return s&&(h=await Fb(n,e,o,l==="current",r.resumeToken)),n.isPrimaryClient&&t&&Of(n.remoteStore,r),h}async function Fb(n,e,t,s,r){n.gu=(I,k,F)=>(async function(X,J,xe,ae){let pe=J.view.nu(xe);pe.Ds&&(pe=await kd(X.localStore,J.query,!1).then((({documents:j})=>J.view.nu(j,pe))));const de=ae&&ae.targetChanges.get(J.targetId),st=ae&&ae.targetMismatches.get(J.targetId)!=null,Fe=J.view.applyChanges(pe,X.isPrimaryClient,de,st);return Vd(X,J.targetId,Fe._u),Fe.snapshot})(n,I,k,F);const o=await kd(n.localStore,e,!0),l=new Rb(e,o.qs),h=l.nu(o.documents),p=To.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),b=l.applyChanges(h,n.isPrimaryClient,p);Vd(n,t,b._u);const v=new jb(e,t,l);return n.Pu.set(e,v),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),b.snapshot}async function Lb(n,e,t){const s=ge(n),r=s.Pu.get(e),o=s.Tu.get(r.targetId);if(o.length>1)return s.Tu.set(r.targetId,o.filter((l=>!Za(l,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await rc(s.localStore,r.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(r.targetId),t&&Mc(s.remoteStore,r.targetId),ac(s,r.targetId)})).catch(vi)):(ac(s,r.targetId),await rc(s.localStore,r.targetId,!0))}async function $b(n,e){const t=ge(n),s=t.Pu.get(e),r=t.Tu.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Mc(t.remoteStore,s.targetId))}async function Ub(n,e,t){const s=Kb(n);try{const r=await(function(l,h){const p=ge(l),b=Qe.now(),v=h.reduce(((F,B)=>F.add(B.key)),Ne());let I,k;return p.persistence.runTransaction("Locally write mutations","readwrite",(F=>{let B=ls(),X=Ne();return p.Os.getEntries(F,v).next((J=>{B=J,B.forEach(((xe,ae)=>{ae.isValidDocument()||(X=X.add(xe))}))})).next((()=>p.localDocuments.getOverlayedDocuments(F,B))).next((J=>{I=J;const xe=[];for(const ae of h){const pe=sy(ae,I.get(ae.key).overlayedDocument);pe!=null&&xe.push(new kr(ae.key,pe,Yh(pe.value.mapValue),rs.exists(!0)))}return p.mutationQueue.addMutationBatch(F,b,xe,h)})).next((J=>{k=J;const xe=J.applyToLocalDocumentSet(I,X);return p.documentOverlayCache.saveOverlays(F,J.batchId,xe)}))})).then((()=>({batchId:k.batchId,changes:cf(I)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),(function(l,h,p){let b=l.Ru[l.currentUser.toKey()];b||(b=new Ze(we)),b=b.insert(h,p),l.Ru[l.currentUser.toKey()]=b})(s,r.batchId,t),await ko(s,r.changes),await ol(s.remoteStore)}catch(r){const o=Bc(r,"Failed to persist write");t.reject(o)}}async function Gf(n,e){const t=ge(n);try{const s=await eb(t.localStore,e);e.targetChanges.forEach(((r,o)=>{const l=t.Eu.get(o);l&&(Me(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?l.lu=!0:r.modifiedDocuments.size>0?Me(l.lu,14607):r.removedDocuments.size>0&&(Me(l.lu,42227),l.lu=!1))})),await ko(t,s,e)}catch(s){await vi(s)}}function Od(n,e,t){const s=ge(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Pu.forEach(((o,l)=>{const h=l.view.va(e);h.snapshot&&r.push(h.snapshot)})),(function(l,h){const p=ge(l);p.onlineState=h;let b=!1;p.queries.forEach(((v,I)=>{for(const k of I.wa)k.va(h)&&(b=!0)})),b&&zc(p)})(s.eventManager,e),r.length&&s.hu.J_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function Bb(n,e,t){const s=ge(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Eu.get(e),o=r&&r.key;if(o){let l=new Ze(ce.comparator);l=l.insert(o,Dt.newNoDocument(o,me.min()));const h=Ne().add(o),p=new sl(me.min(),new Map,new Ze(we),l,h);await Gf(s,p),s.du=s.du.remove(o),s.Eu.delete(e),Hc(s)}else await rc(s.localStore,e,!1).then((()=>ac(s,e,t))).catch(vi)}async function zb(n,e){const t=ge(n),s=e.batch.batchId;try{const r=await Zy(t.localStore,e);Jf(t,s,null),Kf(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await ko(t,r)}catch(r){await vi(r)}}async function qb(n,e,t){const s=ge(n);try{const r=await(function(l,h){const p=ge(l);return p.persistence.runTransaction("Reject batch","readwrite-primary",(b=>{let v;return p.mutationQueue.lookupMutationBatch(b,h).next((I=>(Me(I!==null,37113),v=I.keys(),p.mutationQueue.removeMutationBatch(b,I)))).next((()=>p.mutationQueue.performConsistencyCheck(b))).next((()=>p.documentOverlayCache.removeOverlaysForBatchId(b,v,h))).next((()=>p.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(b,v))).next((()=>p.localDocuments.getDocuments(b,v)))}))})(s.localStore,e);Jf(s,e,t),Kf(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await ko(s,r)}catch(r){await vi(r)}}function Kf(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function Jf(n,e,t){const s=ge(n);let r=s.Ru[s.currentUser.toKey()];if(r){const o=r.get(e);o&&(t?o.reject(t):o.resolve(),r=r.remove(e)),s.Ru[s.currentUser.toKey()]=r}}function ac(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Tu.get(e))n.Pu.delete(s),t&&n.hu.pu(s,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((s=>{n.Au.containsKey(s)||Qf(n,s)}))}function Qf(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Mc(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),Hc(n))}function Vd(n,e,t){for(const s of t)s instanceof qf?(n.Au.addReference(s.key,e),Hb(n,s)):s instanceof Hf?(ee(qc,"Document no longer in limbo: "+s.key),n.Au.removeReference(s.key,e),n.Au.containsKey(s.key)||Qf(n,s.key)):ue(19791,{yu:s})}function Hb(n,e){const t=e.key,s=t.path.canonicalString();n.du.get(t)||n.Iu.has(s)||(ee(qc,"New document in limbo: "+t),n.Iu.add(s),Hc(n))}function Hc(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new ce(Je.fromString(e)),s=n.mu.next();n.Eu.set(s,new Db(t)),n.du=n.du.insert(t,s),Of(n.remoteStore,new Ds(On(Nc(t.path)),s,"TargetPurposeLimboResolution",Ja.ue))}}async function ko(n,e,t){const s=ge(n),r=[],o=[],l=[];s.Pu.isEmpty()||(s.Pu.forEach(((h,p)=>{l.push(s.gu(p,e,t).then((b=>{var v;if((b||t)&&s.isPrimaryClient){const I=b?!b.fromCache:(v=t==null?void 0:t.targetChanges.get(p.targetId))===null||v===void 0?void 0:v.current;s.sharedClientState.updateQueryState(p.targetId,I?"current":"not-current")}if(b){r.push(b);const I=Oc.Es(p.targetId,b);o.push(I)}})))})),await Promise.all(l),s.hu.J_(r),await(async function(p,b){const v=ge(p);try{await v.persistence.runTransaction("notifyLocalViewChanges","readwrite",(I=>z.forEach(b,(k=>z.forEach(k.Is,(F=>v.persistence.referenceDelegate.addReference(I,k.targetId,F))).next((()=>z.forEach(k.ds,(F=>v.persistence.referenceDelegate.removeReference(I,k.targetId,F)))))))))}catch(I){if(!xi(I))throw I;ee(Vc,"Failed to update sequence numbers: "+I)}for(const I of b){const k=I.targetId;if(!I.fromCache){const F=v.Fs.get(k),B=F.snapshotVersion,X=F.withLastLimboFreeSnapshotVersion(B);v.Fs=v.Fs.insert(k,X)}}})(s.localStore,o))}async function Wb(n,e){const t=ge(n);if(!t.currentUser.isEqual(e)){ee(qc,"User change. New user:",e.toKey());const s=await Pf(t.localStore,e);t.currentUser=e,(function(o,l){o.Vu.forEach((h=>{h.forEach((p=>{p.reject(new re(q.CANCELLED,l))}))})),o.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ko(t,s.Bs)}}function Gb(n,e){const t=ge(n),s=t.Eu.get(e);if(s&&s.lu)return Ne().add(s.key);{let r=Ne();const o=t.Tu.get(e);if(!o)return r;for(const l of o){const h=t.Pu.get(l);r=r.unionWith(h.view.tu)}return r}}function Xf(n){const e=ge(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Gb.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Bb.bind(null,e),e.hu.J_=Cb.bind(null,e.eventManager),e.hu.pu=Pb.bind(null,e.eventManager),e}function Kb(n){const e=ge(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=zb.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=qb.bind(null,e),e}class Fa{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=rl(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Yy(this.persistence,new Jy,e.initialUser,this.serializer)}Du(e){return new Cf(Dc.Vi,this.serializer)}bu(e){return new ib}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Fa.provider={build:()=>new Fa};class Jb extends Fa{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Me(this.persistence.referenceDelegate instanceof Va,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new Dy(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?qt.withCacheSize(this.cacheSizeBytes):qt.DEFAULT;return new Cf((s=>Va.Vi(s,t)),this.serializer)}}class lc{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>Od(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Wb.bind(null,this.syncEngine),await Ab(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Sb})()}createDatastore(e){const t=rl(e.databaseInfo.databaseId),s=(function(o){return new ub(o)})(e.databaseInfo);return(function(o,l,h,p){return new pb(o,l,h,p)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,r,o,l,h){return new gb(s,r,o,l,h)})(this.localStore,this.datastore,e.asyncQueue,(t=>Od(this.syncEngine,t,0)),(function(){return Sd.C()?new Sd:new ob})())}createSyncEngine(e,t){return(function(r,o,l,h,p,b,v){const I=new Ob(r,o,l,h,p,b);return v&&(I.fu=!0),I})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const o=ge(r);ee(wr,"RemoteStore shutting down."),o.Ia.add(5),await Io(o),o.Ea.shutdown(),o.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}lc.provider={build:()=>new lc};/**
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
 */class Yf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):as("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Gs="FirestoreClient";class Qb{constructor(e,t,s,r,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=r,this.user=jt.UNAUTHENTICATED,this.clientId=_c.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(s,(async l=>{ee(Gs,"Received user=",l.uid),await this.authCredentialListener(l),this.user=l})),this.appCheckCredentials.start(s,(l=>(ee(Gs,"Received new app check token=",l),this.appCheckCredentialListener(l,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ss;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Bc(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function Vl(n,e){n.asyncQueue.verifyOperationInProgress(),ee(Gs,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async r=>{s.isEqual(r)||(await Pf(e.localStore,r),s=r)})),e.persistence.setDatabaseDeletedListener((()=>{Us("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{ee("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((r=>{Us("Terminating Firestore due to IndexedDb database deletion failed",r)}))})),n._offlineComponents=e}async function Md(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Xb(n);ee(Gs,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>Pd(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,r)=>Pd(e.remoteStore,r))),n._onlineComponents=e}async function Xb(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){ee(Gs,"Using user provided OfflineComponentProvider");try{await Vl(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===q.FAILED_PRECONDITION||r.code===q.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;Us("Error using user provided cache. Falling back to memory cache: "+t),await Vl(n,new Fa)}}else ee(Gs,"Using default OfflineComponentProvider"),await Vl(n,new Jb(void 0));return n._offlineComponents}async function Zf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(ee(Gs,"Using user provided OnlineComponentProvider"),await Md(n,n._uninitializedComponentsProvider._online)):(ee(Gs,"Using default OnlineComponentProvider"),await Md(n,new lc))),n._onlineComponents}function Yb(n){return Zf(n).then((e=>e.syncEngine))}async function ep(n){const e=await Zf(n),t=e.eventManager;return t.onListen=Vb.bind(null,e.syncEngine),t.onUnlisten=Lb.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Mb.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=$b.bind(null,e.syncEngine),t}function Zb(n,e,t={}){const s=new ss;return n.asyncQueue.enqueueAndForget((async()=>(function(o,l,h,p,b){const v=new Yf({next:k=>{v.Ou(),l.enqueueAndForget((()=>Bf(o,I)));const F=k.docs.has(h);!F&&k.fromCache?b.reject(new re(q.UNAVAILABLE,"Failed to get document because the client is offline.")):F&&k.fromCache&&p&&p.source==="server"?b.reject(new re(q.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):b.resolve(k)},error:k=>b.reject(k)}),I=new zf(Nc(h.path),v,{includeMetadataChanges:!0,ka:!0});return Uf(o,I)})(await ep(n),n.asyncQueue,e,t,s))),s.promise}function ev(n,e,t={}){const s=new ss;return n.asyncQueue.enqueueAndForget((async()=>(function(o,l,h,p,b){const v=new Yf({next:k=>{v.Ou(),l.enqueueAndForget((()=>Bf(o,I))),k.fromCache&&p.source==="server"?b.reject(new re(q.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):b.resolve(k)},error:k=>b.reject(k)}),I=new zf(h,v,{includeMetadataChanges:!0,ka:!0});return Uf(o,I)})(await ep(n),n.asyncQueue,e,t,s))),s.promise}/**
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
 */const Fd=new Map;/**
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
 */const np="firestore.googleapis.com",Ld=!0;class $d{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new re(q.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=np,this.ssl=Ld}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Ld;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Sf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ry)throw new re(q.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}g0("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=tp((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(o){if(o.timeoutSeconds!==void 0){if(isNaN(o.timeoutSeconds))throw new re(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);if(o.timeoutSeconds<5)throw new re(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);if(o.timeoutSeconds>30)throw new re(q.INVALID_ARGUMENT,`invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,r){return s.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class al{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new $d({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new re(q.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new re(q.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new $d(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new a0;switch(s.type){case"firstParty":return new d0(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new re(q.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Fd.get(t);s&&(ee("ComponentProvider","Removing Datastore"),Fd.delete(t),s.terminate())})(this),Promise.resolve()}}function tv(n,e,t,s={}){var r;n=_r(n,al);const o=gi(e),l=n._getSettings(),h=Object.assign(Object.assign({},l),{emulatorOptions:n._getEmulatorOptions()}),p=`${e}:${t}`;o&&(Th(`https://${p}`),Ih("Firestore",!0)),l.host!==np&&l.host!==p&&Us("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const b=Object.assign(Object.assign({},l),{host:p,ssl:o,emulatorOptions:s});if(!br(b,h)&&(n._setSettings(b),s.mockUserToken)){let v,I;if(typeof s.mockUserToken=="string")v=s.mockUserToken,I=jt.MOCK_USER;else{v=Rm(s.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const k=s.mockUserToken.sub||s.mockUserToken.user_id;if(!k)throw new re(q.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");I=new jt(k)}n._authCredentials=new l0(new Lh(v,I))}}/**
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
 */class ll{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new ll(this.firestore,e,this._query)}}class yt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ls(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new yt(this.firestore,e,this._key)}toJSON(){return{type:yt._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(wo(t,yt._jsonSchema))return new yt(e,s||null,new ce(Je.fromString(t.referencePath)))}}yt._jsonSchemaVersion="firestore/documentReference/1.0",yt._jsonSchema={type:ut("string",yt._jsonSchemaVersion),referencePath:ut("string")};class Ls extends ll{constructor(e,t,s){super(e,t,Nc(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new yt(this.firestore,null,new ce(e))}withConverter(e){return new Ls(this.firestore,e,this._path)}}function nv(n,e,...t){if(n=Ht(n),Uh("collection","path",e),n instanceof al){const s=Je.fromString(e,...t);return ed(s),new Ls(n,null,s)}{if(!(n instanceof yt||n instanceof Ls))throw new re(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(Je.fromString(e,...t));return ed(s),new Ls(n.firestore,null,s)}}function es(n,e,...t){if(n=Ht(n),arguments.length===1&&(e=_c.newId()),Uh("doc","path",e),n instanceof al){const s=Je.fromString(e,...t);return Zu(s),new yt(n,null,new ce(s))}{if(!(n instanceof yt||n instanceof Ls))throw new re(q.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(Je.fromString(e,...t));return Zu(s),new yt(n.firestore,n instanceof Ls?n.converter:null,new ce(s))}}/**
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
 */const Ud="AsyncQueue";class Bd{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new jf(this,"async_queue_retry"),this.oc=()=>{const s=Ol();s&&ee(Ud,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=Ol();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Ol();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new ss;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!xi(e))throw e;ee(Ud,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,as("INTERNAL UNHANDLED ERROR: ",zd(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=Uc.createAndSchedule(this,e,t,s,(o=>this.lc(o)));return this.ec.push(r),r}ac(){this.tc&&ue(47125,{hc:zd(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function zd(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class cl extends al{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new Bd,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Bd(e),this._firestoreClient=void 0,await e}}}function sv(n,e){const t=typeof n=="object"?n:Sh(),s=typeof n=="string"?n:Sa,r=vc(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const o=Cm("firestore");o&&tv(r,...o)}return r}function Wc(n){if(n._terminated)throw new re(q.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||rv(n),n._firestoreClient}function rv(n){var e,t,s;const r=n._freezeSettings(),o=(function(h,p,b,v){return new A0(h,p,b,v.host,v.ssl,v.experimentalForceLongPolling,v.experimentalAutoDetectLongPolling,tp(v.experimentalLongPollingOptions),v.useFetchStreams,v.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new Qb(n._authCredentials,n._appCheckCredentials,n._queue,o,n._componentsProvider&&(function(h){const p=h==null?void 0:h._online.build();return{_offline:h==null?void 0:h._offline.build(p),_online:p}})(n._componentsProvider))}/**
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
 */class on{constructor(e){this._byteString=e}static fromBase64String(e){try{return new on(At.fromBase64String(e))}catch(t){throw new re(q.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new on(At.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:on._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(wo(e,on._jsonSchema))return on.fromBase64String(e.bytes)}}on._jsonSchemaVersion="firestore/bytes/1.0",on._jsonSchema={type:ut("string",on._jsonSchemaVersion),bytes:ut("string")};/**
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
 */class Gc{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new re(q.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new kt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Mn{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new re(q.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new re(q.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return we(this._lat,e._lat)||we(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Mn._jsonSchemaVersion}}static fromJSON(e){if(wo(e,Mn._jsonSchema))return new Mn(e.latitude,e.longitude)}}Mn._jsonSchemaVersion="firestore/geoPoint/1.0",Mn._jsonSchema={type:ut("string",Mn._jsonSchemaVersion),latitude:ut("number"),longitude:ut("number")};/**
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
 */class Fn{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,r){if(s.length!==r.length)return!1;for(let o=0;o<s.length;++o)if(s[o]!==r[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Fn._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(wo(e,Fn._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Fn(e.vectorValues);throw new re(q.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Fn._jsonSchemaVersion="firestore/vectorValue/1.0",Fn._jsonSchema={type:ut("string",Fn._jsonSchemaVersion),vectorValues:ut("object")};/**
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
 */const iv=/^__.*__$/;class ov{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new kr(e,this.data,this.fieldMask,t,this.fieldTransforms):new Eo(e,this.data,t,this.fieldTransforms)}}function rp(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ue(40011,{Ec:n})}}class Kc{constructor(e,t,s,r,o,l){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=l||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new Kc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:s,mc:!1});return r.fc(e),r}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:s,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return La(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(rp(this.Ec)&&iv.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class av{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||rl(e)}Dc(e,t,s,r=!1){return new Kc({Ec:e,methodName:t,bc:s,path:kt.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function lv(n){const e=n._freezeSettings(),t=rl(n._databaseId);return new av(n._databaseId,!!e.ignoreUndefinedProperties,t)}function cv(n,e,t,s,r,o={}){const l=n.Dc(o.merge||o.mergeFields?2:0,e,t,r);lp("Data must be an object, but it was:",l,s);const h=op(s,l);let p,b;if(o.merge)p=new xn(l.fieldMask),b=l.fieldTransforms;else if(o.mergeFields){const v=[];for(const I of o.mergeFields){const k=uv(e,I,t);if(!l.contains(k))throw new re(q.INVALID_ARGUMENT,`Field '${k}' is specified in your field mask but missing from your input data.`);hv(v,k)||v.push(k)}p=new xn(v),b=l.fieldTransforms.filter((I=>p.covers(I.field)))}else p=null,b=l.fieldTransforms;return new ov(new rn(h),p,b)}function ip(n,e){if(ap(n=Ht(n)))return lp("Unsupported field value:",e,n),op(n,e);if(n instanceof sp)return(function(s,r){if(!rp(r.Ec))throw r.wc(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.wc(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(r);o&&r.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,r){const o=[];let l=0;for(const h of s){let p=ip(h,r.yc(l));p==null&&(p={nullValue:"NULL_VALUE"}),o.push(p),l++}return{arrayValue:{values:o}}})(n,e)}return(function(s,r){if((s=Ht(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return X0(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const o=Qe.fromDate(s);return{timestampValue:Oa(r.serializer,o)}}if(s instanceof Qe){const o=new Qe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Oa(r.serializer,o)}}if(s instanceof Mn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof on)return{bytesValue:wf(r.serializer,s._byteString)};if(s instanceof yt){const o=r.databaseId,l=s.firestore._databaseId;if(!l.isEqual(o))throw r.wc(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Rc(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Fn)return(function(l,h){return{mapValue:{fields:{[Qh]:{stringValue:Xh},[Ca]:{arrayValue:{values:l.toArray().map((b=>{if(typeof b!="number")throw h.wc("VectorValues must only contain numeric values.");return Sc(h.serializer,b)}))}}}}}})(s,r);throw r.wc(`Unsupported field value: ${wc(s)}`)})(n,e)}function op(n,e){const t={};return qh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Tr(n,((s,r)=>{const o=ip(r,e.Vc(s));o!=null&&(t[s]=o)})),{mapValue:{fields:t}}}function ap(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Qe||n instanceof Mn||n instanceof on||n instanceof yt||n instanceof sp||n instanceof Fn)}function lp(n,e,t){if(!ap(t)||!Bh(t)){const s=wc(t);throw s==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+s)}}function uv(n,e,t){if((e=Ht(e))instanceof Gc)return e._internalPath;if(typeof e=="string")return cp(n,e);throw La("Field path arguments must be of type string or ",n,!1,void 0,t)}const dv=new RegExp("[~\\*/\\[\\]]");function cp(n,e,t){if(e.search(dv)>=0)throw La(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Gc(...e.split("."))._internalPath}catch{throw La(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function La(n,e,t,s,r){const o=s&&!s.isEmpty(),l=r!==void 0;let h=`Function ${e}() called with invalid data`;t&&(h+=" (via `toFirestore()`)"),h+=". ";let p="";return(o||l)&&(p+=" (found",o&&(p+=` in field ${s}`),l&&(p+=` in document ${r}`),p+=")"),new re(q.INVALID_ARGUMENT,h+n+p)}function hv(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class up{constructor(e,t,s,r,o){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new yt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new fv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(dp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class fv extends up{data(){return super.data()}}function dp(n,e){return typeof e=="string"?cp(n,e):e instanceof Gc?e._internalPath:e._delegate._internalPath}/**
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
 */function pv(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new re(q.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class mv{convertValue(e,t="none"){switch(Hs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return it(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(qs(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw ue(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return Tr(e,((r,o)=>{s[r]=this.convertValue(o,t)})),s}convertVectorValue(e){var t,s,r;const o=(r=(s=(t=e.fields)===null||t===void 0?void 0:t[Ca].arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map((l=>it(l.doubleValue)));return new Fn(o)}convertGeoPoint(e){return new Mn(it(e.latitude),it(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Xa(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(po(e));default:return null}}convertTimestamp(e){const t=zs(e);return new Qe(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=Je.fromString(e);Me(Nf(s),9688,{name:e});const r=new mo(s.get(1),s.get(3)),o=new ce(s.popFirst(5));return r.isEqual(t)||as(`Document ${o} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
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
 */function gv(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}class no{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class gr extends up{constructor(e,t,s,r,o,l){super(e,t,s,r,l),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new _a(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(dp("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new re(q.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=gr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}gr._jsonSchemaVersion="firestore/documentSnapshot/1.0",gr._jsonSchema={type:ut("string",gr._jsonSchemaVersion),bundleSource:ut("string","DocumentSnapshot"),bundleName:ut("string"),bundle:ut("string")};class _a extends gr{data(e={}){return super.data(e)}}class ii{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new no(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new _a(this._firestore,this._userDataWriter,s.key,s,new no(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new re(q.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,o){if(r._snapshot.oldDocs.isEmpty()){let l=0;return r._snapshot.docChanges.map((h=>{const p=new _a(r._firestore,r._userDataWriter,h.doc.key,h.doc,new no(r._snapshot.mutatedKeys.has(h.doc.key),r._snapshot.fromCache),r.query.converter);return h.doc,{type:"added",doc:p,oldIndex:-1,newIndex:l++}}))}{let l=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((h=>o||h.type!==3)).map((h=>{const p=new _a(r._firestore,r._userDataWriter,h.doc.key,h.doc,new no(r._snapshot.mutatedKeys.has(h.doc.key),r._snapshot.fromCache),r.query.converter);let b=-1,v=-1;return h.type!==0&&(b=l.indexOf(h.doc.key),l=l.delete(h.doc.key)),h.type!==1&&(l=l.add(h.doc),v=l.indexOf(h.doc.key)),{type:yv(h.type),doc:p,oldIndex:b,newIndex:v}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new re(q.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ii._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=_c.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach((o=>{o._document!==null&&(t.push(o._document),s.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),r.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function yv(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return ue(61501,{type:n})}}/**
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
 */function da(n){n=_r(n,yt);const e=_r(n.firestore,cl);return Zb(Wc(e),n._key).then((t=>xv(e,n,t)))}ii._jsonSchemaVersion="firestore/querySnapshot/1.0",ii._jsonSchema={type:ut("string",ii._jsonSchemaVersion),bundleSource:ut("string","QuerySnapshot"),bundleName:ut("string"),bundle:ut("string")};class hp extends mv{constructor(e){super(),this.firestore=e}convertBytes(e){return new on(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new yt(this.firestore,null,t)}}function bv(n){n=_r(n,ll);const e=_r(n.firestore,cl),t=Wc(e),s=new hp(e);return pv(n._query),ev(t,n._query).then((r=>new ii(e,s,n,r)))}function Xi(n,e,t){n=_r(n,yt);const s=_r(n.firestore,cl),r=gv(n.converter,e,t);return vv(s,[cv(lv(s),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,rs.none())])}function vv(n,e){return(function(s,r){const o=new ss;return s.asyncQueue.enqueueAndForget((async()=>Ub(await Yb(s),r,o))),o.promise})(Wc(n),e)}function xv(n,e,t){const s=t.docs.get(e._key),r=new hp(n);return new gr(n,r,e._key,s,new no(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){(function(r){bi=r})(yi),ci(new vr("firestore",((s,{instanceIdentifier:r,options:o})=>{const l=s.getProvider("app").getImmediate(),h=new cl(new c0(s.getProvider("auth-internal")),new h0(l,s.getProvider("app-check-internal")),(function(b,v){if(!Object.prototype.hasOwnProperty.apply(b.options,["projectId"]))throw new re(q.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new mo(b.options.projectId,v)})(l,r),l);return o=Object.assign({useFetchStreams:t},o),h._setSettings(o),h}),"PUBLIC").setMultipleInstances(!0)),Ms(Ku,Ju,e),Ms(Ku,Ju,"esm2017")})();function Jc(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t}function fp(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _v=fp,pp=new xo("auth","Firebase",fp());/**
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
 */const $a=new yc("@firebase/auth");function wv(n,...e){$a.logLevel<=Ae.WARN&&$a.warn(`Auth (${yi}): ${n}`,...e)}function wa(n,...e){$a.logLevel<=Ae.ERROR&&$a.error(`Auth (${yi}): ${n}`,...e)}/**
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
 */function Bn(n,...e){throw Xc(n,...e)}function wn(n,...e){return Xc(n,...e)}function Qc(n,e,t){const s=Object.assign(Object.assign({},_v()),{[e]:t});return new xo("auth","Firebase",s).create(e,{appName:n.name})}function $s(n){return Qc(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function mp(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Bn(n,"argument-error"),Qc(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Xc(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return pp.create(n,...e)}function he(n,e,...t){if(!n)throw Xc(e,...t)}function ts(n){const e="INTERNAL ASSERTION FAILED: "+n;throw wa(e),new Error(e)}function cs(n,e){n||ts(e)}/**
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
 */function cc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Ev(){return qd()==="http:"||qd()==="https:"}function qd(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */class Ao{constructor(e,t){this.shortDelay=e,this.longDelay=t,cs(t>e,"Short delay should be less than long delay!"),this.isMobile=Om()||Lm()}get(){return Tv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function Yc(n,e){cs(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class gp{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ts("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ts("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ts("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const kv={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Av=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Nv=new Ao(3e4,6e4);function Zc(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function wi(n,e,t,s,r={}){return yp(n,r,async()=>{let o={},l={};s&&(e==="GET"?l=s:o={body:JSON.stringify(s)});const h=_o(Object.assign({key:n.config.apiKey},l)).slice(1),p=await n._getAdditionalHeaders();p["Content-Type"]="application/json",n.languageCode&&(p["X-Firebase-Locale"]=n.languageCode);const b=Object.assign({method:e,headers:p},o);return Mm()||(b.referrerPolicy="no-referrer"),n.emulatorConfig&&gi(n.emulatorConfig.host)&&(b.credentials="include"),gp.fetch()(await bp(n,n.config.apiHost,t,h),b)})}async function yp(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},kv),e);try{const r=new Cv(n),o=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const l=await o.json();if("needConfirmation"in l)throw ha(n,"account-exists-with-different-credential",l);if(o.ok&&!("errorMessage"in l))return l;{const h=o.ok?l.errorMessage:l.error.message,[p,b]=h.split(" : ");if(p==="FEDERATED_USER_ID_ALREADY_LINKED")throw ha(n,"credential-already-in-use",l);if(p==="EMAIL_EXISTS")throw ha(n,"email-already-in-use",l);if(p==="USER_DISABLED")throw ha(n,"user-disabled",l);const v=s[p]||p.toLowerCase().replace(/[_\s]+/g,"-");if(b)throw Qc(n,v,b);Bn(n,v)}}catch(r){if(r instanceof us)throw r;Bn(n,"network-request-failed",{message:String(r)})}}async function Sv(n,e,t,s,r={}){const o=await wi(n,e,t,s,r);return"mfaPendingCredential"in o&&Bn(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function bp(n,e,t,s){const r=`${e}${t}?${s}`,o=n,l=o.config.emulator?Yc(n.config,r):`${n.config.apiScheme}://${r}`;return Av.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(l).toString():l}class Cv{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(wn(this.auth,"network-request-failed")),Nv.get())})}}function ha(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=wn(n,e,s);return r.customData._tokenResponse=t,r}/**
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
 */async function Pv(n,e){return wi(n,"POST","/v1/accounts:delete",e)}async function Ua(n,e){return wi(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function uo(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Rv(n,e=!1){const t=Ht(n),s=await t.getIdToken(e),r=eu(s);he(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const o=typeof r.firebase=="object"?r.firebase:void 0,l=o==null?void 0:o.sign_in_provider;return{claims:r,token:s,authTime:uo(Ml(r.auth_time)),issuedAtTime:uo(Ml(r.iat)),expirationTime:uo(Ml(r.exp)),signInProvider:l||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Ml(n){return Number(n)*1e3}function eu(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return wa("JWT malformed, contained fewer than 3 sections"),null;try{const r=xh(t);return r?JSON.parse(r):(wa("Failed to decode base64 JWT payload"),null)}catch(r){return wa("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Hd(n){const e=eu(n);return he(e,"internal-error"),he(typeof e.exp<"u","internal-error"),he(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function vo(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof us&&jv(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function jv({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class uc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=uo(this.lastLoginAt),this.creationTime=uo(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ba(n){var e;const t=n.auth,s=await n.getIdToken(),r=await vo(n,Ua(t,{idToken:s}));he(r==null?void 0:r.users.length,t,"internal-error");const o=r.users[0];n._notifyReloadListener(o);const l=!((e=o.providerUserInfo)===null||e===void 0)&&e.length?vp(o.providerUserInfo):[],h=Vv(n.providerData,l),p=n.isAnonymous,b=!(n.email&&o.passwordHash)&&!(h!=null&&h.length),v=p?b:!1,I={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:h,metadata:new uc(o.createdAt,o.lastLoginAt),isAnonymous:v};Object.assign(n,I)}async function Ov(n){const e=Ht(n);await Ba(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Vv(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function vp(n){return n.map(e=>{var{providerId:t}=e,s=Jc(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
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
 */async function Mv(n,e){const t=await yp(n,{},async()=>{const s=_o({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:o}=n.config,l=await bp(n,r,"/v1/token",`key=${o}`),h=await n._getAdditionalHeaders();h["Content-Type"]="application/x-www-form-urlencoded";const p={method:"POST",headers:h,body:s};return n.emulatorConfig&&gi(n.emulatorConfig.host)&&(p.credentials="include"),gp.fetch()(l,p)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Fv(n,e){return wi(n,"POST","/v2/accounts:revokeToken",Zc(n,e))}/**
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
 */class oi{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){he(e.idToken,"internal-error"),he(typeof e.idToken<"u","internal-error"),he(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Hd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){he(e.length!==0,"internal-error");const t=Hd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(he(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:o}=await Mv(e,t);this.updateTokensAndExpiration(s,r,Number(o))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:o}=t,l=new oi;return s&&(he(typeof s=="string","internal-error",{appName:e}),l.refreshToken=s),r&&(he(typeof r=="string","internal-error",{appName:e}),l.accessToken=r),o&&(he(typeof o=="number","internal-error",{appName:e}),l.expirationTime=o),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new oi,this.toJSON())}_performRefresh(){return ts("not implemented")}}/**
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
 */function ks(n,e){he(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class _n{constructor(e){var{uid:t,auth:s,stsTokenManager:r}=e,o=Jc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Dv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new uc(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await vo(this,this.stsTokenManager.getToken(this.auth,e));return he(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Rv(this,e)}reload(){return Ov(this)}_assign(e){this!==e&&(he(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new _n(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){he(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Ba(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(sn(this.auth.app))return Promise.reject($s(this.auth));const e=await this.getIdToken();return await vo(this,Pv(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,r,o,l,h,p,b,v;const I=(s=t.displayName)!==null&&s!==void 0?s:void 0,k=(r=t.email)!==null&&r!==void 0?r:void 0,F=(o=t.phoneNumber)!==null&&o!==void 0?o:void 0,B=(l=t.photoURL)!==null&&l!==void 0?l:void 0,X=(h=t.tenantId)!==null&&h!==void 0?h:void 0,J=(p=t._redirectEventId)!==null&&p!==void 0?p:void 0,xe=(b=t.createdAt)!==null&&b!==void 0?b:void 0,ae=(v=t.lastLoginAt)!==null&&v!==void 0?v:void 0,{uid:pe,emailVerified:de,isAnonymous:st,providerData:Fe,stsTokenManager:j}=t;he(pe&&j,e,"internal-error");const A=oi.fromJSON(this.name,j);he(typeof pe=="string",e,"internal-error"),ks(I,e.name),ks(k,e.name),he(typeof de=="boolean",e,"internal-error"),he(typeof st=="boolean",e,"internal-error"),ks(F,e.name),ks(B,e.name),ks(X,e.name),ks(J,e.name),ks(xe,e.name),ks(ae,e.name);const E=new _n({uid:pe,auth:e,email:k,emailVerified:de,displayName:I,isAnonymous:st,photoURL:B,phoneNumber:F,tenantId:X,stsTokenManager:A,createdAt:xe,lastLoginAt:ae});return Fe&&Array.isArray(Fe)&&(E.providerData=Fe.map(P=>Object.assign({},P))),J&&(E._redirectEventId=J),E}static async _fromIdTokenResponse(e,t,s=!1){const r=new oi;r.updateFromServerResponse(t);const o=new _n({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Ba(o),o}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];he(r.localId!==void 0,"internal-error");const o=r.providerUserInfo!==void 0?vp(r.providerUserInfo):[],l=!(r.email&&r.passwordHash)&&!(o!=null&&o.length),h=new oi;h.updateFromIdToken(s);const p=new _n({uid:r.localId,auth:e,stsTokenManager:h,isAnonymous:l}),b={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:o,metadata:new uc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(o!=null&&o.length)};return Object.assign(p,b),p}}/**
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
 */const Wd=new Map;function ns(n){cs(n instanceof Function,"Expected a class definition");let e=Wd.get(n);return e?(cs(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Wd.set(n,e),e)}/**
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
 */class xp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}xp.type="NONE";const Gd=xp;/**
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
 */function Ea(n,e,t){return`firebase:${n}:${e}:${t}`}class ai{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:o}=this.auth;this.fullUserKey=Ea(this.userKey,r.apiKey,o),this.fullPersistenceKey=Ea("persistence",r.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ua(this.auth,{idToken:e}).catch(()=>{});return t?_n._fromGetAccountInfoResponse(this.auth,t,e):null}return _n._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new ai(ns(Gd),e,s);const r=(await Promise.all(t.map(async b=>{if(await b._isAvailable())return b}))).filter(b=>b);let o=r[0]||ns(Gd);const l=Ea(s,e.config.apiKey,e.name);let h=null;for(const b of t)try{const v=await b._get(l);if(v){let I;if(typeof v=="string"){const k=await Ua(e,{idToken:v}).catch(()=>{});if(!k)break;I=await _n._fromGetAccountInfoResponse(e,k,v)}else I=_n._fromJSON(e,v);b!==o&&(h=I),o=b;break}}catch{}const p=r.filter(b=>b._shouldAllowMigration);return!o._shouldAllowMigration||!p.length?new ai(o,e,s):(o=p[0],h&&await o._set(l,h.toJSON()),await Promise.all(t.map(async b=>{if(b!==o)try{await b._remove(l)}catch{}})),new ai(o,e,s))}}/**
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
 */function Kd(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(_p(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(kp(e))return"Blackberry";if(Ap(e))return"Webos";if(wp(e))return"Safari";if((e.includes("chrome/")||Ep(e))&&!e.includes("edge/"))return"Chrome";if(Ip(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function _p(n=Ot()){return/firefox\//i.test(n)}function wp(n=Ot()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ep(n=Ot()){return/crios\//i.test(n)}function Tp(n=Ot()){return/iemobile/i.test(n)}function Ip(n=Ot()){return/android/i.test(n)}function kp(n=Ot()){return/blackberry/i.test(n)}function Ap(n=Ot()){return/webos/i.test(n)}function tu(n=Ot()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Lv(n=Ot()){var e;return tu(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $v(){return $m()&&document.documentMode===10}function Np(n=Ot()){return tu(n)||Ip(n)||Ap(n)||kp(n)||/windows phone/i.test(n)||Tp(n)}/**
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
 */function Sp(n,e=[]){let t;switch(n){case"Browser":t=Kd(Ot());break;case"Worker":t=`${Kd(Ot())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${yi}/${s}`}/**
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
 */async function Bv(n,e={}){return wi(n,"GET","/v2/passwordPolicy",Zc(n,e))}/**
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
 */const zv=6;class qv{constructor(e){var t,s,r,o;const l=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=l.minPasswordLength)!==null&&t!==void 0?t:zv,l.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=l.maxPasswordLength),l.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=l.containsLowercaseCharacter),l.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=l.containsUppercaseCharacter),l.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=l.containsNumericCharacter),l.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=l.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!==null&&o!==void 0?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,r,o,l,h;const p={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,p),this.validatePasswordCharacterOptions(e,p),p.isValid&&(p.isValid=(t=p.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),p.isValid&&(p.isValid=(s=p.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),p.isValid&&(p.isValid=(r=p.containsLowercaseLetter)!==null&&r!==void 0?r:!0),p.isValid&&(p.isValid=(o=p.containsUppercaseLetter)!==null&&o!==void 0?o:!0),p.isValid&&(p.isValid=(l=p.containsNumericCharacter)!==null&&l!==void 0?l:!0),p.isValid&&(p.isValid=(h=p.containsNonAlphanumericCharacter)!==null&&h!==void 0?h:!0),p}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
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
 */class Hv{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Jd(this),this.idTokenSubscription=new Jd(this),this.beforeStateQueue=new Uv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pp,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ns(t)),this._initializationPromise=this.queue(async()=>{var s,r,o;if(!this._deleted&&(this.persistenceManager=await ai.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((o=this.currentUser)===null||o===void 0?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ua(this,{idToken:e}),s=await _n._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(sn(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(h=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(h,h))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,h=r==null?void 0:r._redirectEventId,p=await this.tryRedirectSignIn(e);(!l||l===h)&&(p!=null&&p.user)&&(r=p.user,o=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(r)}catch(l){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return he(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ba(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Iv()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(sn(this.app))return Promise.reject($s(this));const t=e?Ht(e):null;return t&&he(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&he(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return sn(this.app)?Promise.reject($s(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return sn(this.app)?Promise.reject($s(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ns(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Bv(this),t=new qv(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new xo("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await Fv(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ns(e)||this._popupRedirectResolver;he(t,this,"argument-error"),this.redirectPersistenceManager=await ai.create(this,[ns(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let l=!1;const h=this._isInitialized?Promise.resolve():this._initializationPromise;if(he(h,this,"internal-error"),h.then(()=>{l||o(this.currentUser)}),typeof t=="function"){const p=e.addObserver(t,s,r);return()=>{l=!0,p()}}else{const p=e.addObserver(t);return()=>{l=!0,p()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return he(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Sp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(sn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&wv(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Ei(n){return Ht(n)}class Jd{constructor(e){this.auth=e,this.observer=null,this.addObserver=Km(t=>this.observer=t)}get next(){return he(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let nu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Wv(n){nu=n}function Gv(n){return nu.loadJS(n)}function Kv(){return nu.gapiScript}function Jv(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function Qv(n,e){const t=vc(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),o=t.getOptions();if(br(o,e??{}))return r;Bn(r,"already-initialized")}return t.initialize({options:e})}function Xv(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(ns);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Yv(n,e,t){const s=Ei(n);he(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,o=Cp(e),{host:l,port:h}=Zv(e),p=h===null?"":`:${h}`,b={url:`${o}//${l}${p}/`},v=Object.freeze({host:l,port:h,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){he(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),he(br(b,s.config.emulator)&&br(v,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=b,s.emulatorConfig=v,s.settings.appVerificationDisabledForTesting=!0,gi(l)?(Th(`${o}//${l}${p}`),Ih("Auth",!0)):ex()}function Cp(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Zv(n){const e=Cp(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const o=r[1];return{host:o,port:Qd(s.substr(o.length+1))}}else{const[o,l]=s.split(":");return{host:o,port:Qd(l)}}}function Qd(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ex(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class Pp{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ts("not implemented")}_getIdTokenResponse(e){return ts("not implemented")}_linkToIdToken(e,t){return ts("not implemented")}_getReauthenticationResolver(e){return ts("not implemented")}}/**
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
 */async function li(n,e){return Sv(n,"POST","/v1/accounts:signInWithIdp",Zc(n,e))}/**
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
 */const tx="http://localhost";class Er extends Pp{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Er(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Bn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=t,o=Jc(t,["providerId","signInMethod"]);if(!s||!r)return null;const l=new Er(s,r);return l.idToken=o.idToken||void 0,l.accessToken=o.accessToken||void 0,l.secret=o.secret,l.nonce=o.nonce,l.pendingToken=o.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return li(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,li(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,li(e,t)}buildRequest(){const e={requestUri:tx,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=_o(t)}return e}}/**
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
 */class No extends ul{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Cs extends No{constructor(){super("facebook.com")}static credential(e){return Er._fromParams({providerId:Cs.PROVIDER_ID,signInMethod:Cs.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Cs.credentialFromTaggedObject(e)}static credentialFromError(e){return Cs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Cs.credential(e.oauthAccessToken)}catch{return null}}}Cs.FACEBOOK_SIGN_IN_METHOD="facebook.com";Cs.PROVIDER_ID="facebook.com";/**
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
 */class Dn extends No{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Er._fromParams({providerId:Dn.PROVIDER_ID,signInMethod:Dn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Dn.credentialFromTaggedObject(e)}static credentialFromError(e){return Dn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Dn.credential(t,s)}catch{return null}}}Dn.GOOGLE_SIGN_IN_METHOD="google.com";Dn.PROVIDER_ID="google.com";/**
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
 */class Ps extends No{constructor(){super("github.com")}static credential(e){return Er._fromParams({providerId:Ps.PROVIDER_ID,signInMethod:Ps.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ps.credentialFromTaggedObject(e)}static credentialFromError(e){return Ps.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ps.credential(e.oauthAccessToken)}catch{return null}}}Ps.GITHUB_SIGN_IN_METHOD="github.com";Ps.PROVIDER_ID="github.com";/**
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
 */class Rs extends No{constructor(){super("twitter.com")}static credential(e,t){return Er._fromParams({providerId:Rs.PROVIDER_ID,signInMethod:Rs.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Rs.credentialFromTaggedObject(e)}static credentialFromError(e){return Rs.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Rs.credential(t,s)}catch{return null}}}Rs.TWITTER_SIGN_IN_METHOD="twitter.com";Rs.PROVIDER_ID="twitter.com";/**
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
 */class mi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const o=await _n._fromIdTokenResponse(e,s,r),l=Xd(s);return new mi({user:o,providerId:l,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Xd(s);return new mi({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Xd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class za extends us{constructor(e,t,s,r){var o;super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,za.prototype),this.customData={appName:e.name,tenantId:(o=e.tenantId)!==null&&o!==void 0?o:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new za(e,t,s,r)}}function Rp(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?za._fromErrorAndOperation(n,o,e,s):o})}async function nx(n,e,t=!1){const s=await vo(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return mi._forOperation(n,"link",s)}/**
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
 */async function sx(n,e,t=!1){const{auth:s}=n;if(sn(s.app))return Promise.reject($s(s));const r="reauthenticate";try{const o=await vo(n,Rp(s,r,e,n),t);he(o.idToken,s,"internal-error");const l=eu(o.idToken);he(l,s,"internal-error");const{sub:h}=l;return he(n.uid===h,s,"user-mismatch"),mi._forOperation(n,r,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&Bn(s,"user-mismatch"),o}}/**
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
 */async function rx(n,e,t=!1){if(sn(n.app))return Promise.reject($s(n));const s="signIn",r=await Rp(n,s,e),o=await mi._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(o.user),o}/**
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
 */function ix(n,e){return Ht(n).setPersistence(e)}function ox(n,e,t,s){return Ht(n).onIdTokenChanged(e,t,s)}function ax(n,e,t){return Ht(n).beforeAuthStateChanged(e,t)}function lx(n,e,t,s){return Ht(n).onAuthStateChanged(e,t,s)}function cx(n){return Ht(n).signOut()}const qa="__sak";/**
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
 */const ux=1e3,dx=10;class Dp extends jp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Np(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,h,p)=>{this.notifyListeners(l,p)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const l=this.storage.getItem(s);!t&&this.localCache[s]===l||this.notifyListeners(s,l)},o=this.storage.getItem(s);$v()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,dx):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},ux)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Dp.type="LOCAL";const Op=Dp;/**
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
 */function su(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class fx{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let o,l;return new Promise((h,p)=>{const b=su("",20);r.port1.start();const v=setTimeout(()=>{p(new Error("unsupported_event"))},s);l={messageChannel:r,onMessage(I){const k=I;if(k.data.eventId===b)switch(k.data.status){case"ack":clearTimeout(v),o=setTimeout(()=>{p(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),h(k.data.response);break;default:clearTimeout(v),clearTimeout(o),p(new Error("invalid_response"));break}}},this.handlers.add(l),r.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:b,data:t},[r.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
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
 */const Lp="firebaseLocalStorageDb",bx=1,Ha="firebaseLocalStorage",$p="fbase_key";class So{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hl(n,e){return n.transaction([Ha],e?"readwrite":"readonly").objectStore(Ha)}function vx(){const n=indexedDB.deleteDatabase(Lp);return new So(n).toPromise()}function dc(){const n=indexedDB.open(Lp,bx);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Ha,{keyPath:$p})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Ha)?e(s):(s.close(),await vx(),e(await dc()))})})}async function Yd(n,e,t){const s=hl(n,!0).put({[$p]:e,value:t});return new So(s).toPromise()}async function xx(n,e){const t=hl(n,!1).get(e),s=await new So(t).toPromise();return s===void 0?null:s.value}function Zd(n,e){const t=hl(n,!0).delete(e);return new So(t).toPromise()}const _x=800,wx=3;class Up{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await dc(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>wx)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Fp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=dl._getInstance(yx()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await mx(),!this.activeServiceWorker)return;this.sender=new fx(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||gx()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await dc();return await Yd(e,qa,"1"),await Zd(e,qa),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Yd(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>xx(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Zd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const o=hl(r,!1).getAll();return new So(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:o}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(o)&&(this.notifyListeners(r,o),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_x)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Up.type="LOCAL";const Ex=Up;new Ao(3e4,6e4);/**
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
 */function ru(n,e){return e?ns(e):(he(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class iu extends Pp{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return li(e,this._buildIdpRequest())}_linkToIdToken(e,t){return li(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return li(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Tx(n){return rx(n.auth,new iu(n),n.bypassAuthState)}function Ix(n){const{auth:e,user:t}=n;return he(t,e,"internal-error"),sx(t,new iu(n),n.bypassAuthState)}async function kx(n){const{auth:e,user:t}=n;return he(t,e,"internal-error"),nx(t,new iu(n),n.bypassAuthState)}/**
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
 */class Bp{constructor(e,t,s,r,o=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:o,error:l,type:h}=e;if(l){this.reject(l);return}const p={auth:this.auth,requestUri:t,sessionId:s,tenantId:o||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(h)(p))}catch(b){this.reject(b)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Tx;case"linkViaPopup":case"linkViaRedirect":return kx;case"reauthViaPopup":case"reauthViaRedirect":return Ix;default:Bn(this.auth,"internal-error")}}resolve(e){cs(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){cs(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Ax=new Ao(2e3,1e4);async function Nx(n,e,t){if(sn(n.app))return Promise.reject(wn(n,"operation-not-supported-in-this-environment"));const s=Ei(n);mp(n,e,ul);const r=ru(s,t);return new mr(s,"signInViaPopup",e,r).executeNotNull()}class mr extends Bp{constructor(e,t,s,r,o){super(e,t,r,o),this.provider=s,this.authWindow=null,this.pollId=null,mr.currentPopupAction&&mr.currentPopupAction.cancel(),mr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return he(e,this.auth,"internal-error"),e}async onExecution(){cs(this.filter.length===1,"Popup operations only handle one event");const e=su();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(wn(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(wn(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,mr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(wn(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ax.get())};e()}}mr.currentPopupAction=null;/**
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
 */const Sx="pendingRedirect",Ta=new Map;class Cx extends Bp{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Ta.get(this.auth._key());if(!e){try{const s=await Px(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Ta.set(this.auth._key(),e)}return this.bypassAuthState||Ta.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Px(n,e){const t=qp(e),s=zp(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}async function Rx(n,e){return zp(n)._set(qp(e),"true")}function jx(n,e){Ta.set(n._key(),e)}function zp(n){return ns(n._redirectPersistence)}function qp(n){return Ea(Sx,n.config.apiKey,n.name)}/**
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
 */function Dx(n,e,t){return Ox(n,e,t)}async function Ox(n,e,t){if(sn(n.app))return Promise.reject($s(n));const s=Ei(n);mp(n,e,ul),await s._initializationPromise;const r=ru(s,t);return await Rx(r,s),r._openRedirect(s,e,"signInViaRedirect")}async function Vx(n,e){return await Ei(n)._initializationPromise,Hp(n,e,!1)}async function Hp(n,e,t=!1){if(sn(n.app))return Promise.reject($s(n));const s=Ei(n),r=ru(s,e),l=await new Cx(s,r,t).execute();return l&&!t&&(delete l.user._redirectEventId,await s._persistUserIfCurrent(l.user),await s._setRedirectUser(null,e)),l}/**
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
 */const Mx=600*1e3;class Fx{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lx(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!Wp(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(wn(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Mx&&this.cachedEventUids.clear(),this.cachedEventUids.has(eh(e))}saveEventToCache(e){this.cachedEventUids.add(eh(e)),this.lastProcessedEventTime=Date.now()}}function eh(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Wp({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lx(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wp(n);default:return!1}}/**
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
 */async function $x(n,e={}){return wi(n,"GET","/v1/projects",e)}/**
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
 */const Ux=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Bx=/^https?/;async function zx(n){if(n.config.emulator)return;const{authorizedDomains:e}=await $x(n);for(const t of e)try{if(qx(t))return}catch{}Bn(n,"unauthorized-domain")}function qx(n){const e=cc(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const l=new URL(n);return l.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===s}if(!Bx.test(t))return!1;if(Ux.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Hx=new Ao(3e4,6e4);function th(){const n=Ln().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Wx(n){return new Promise((e,t)=>{var s,r,o;function l(){th(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{th(),t(wn(n,"network-request-failed"))},timeout:Hx.get()})}if(!((r=(s=Ln().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((o=Ln().gapi)===null||o===void 0)&&o.load)l();else{const h=Jv("iframefcb");return Ln()[h]=()=>{gapi.load?l():t(wn(n,"network-request-failed"))},Gv(`${Kv()}?onload=${h}`).catch(p=>t(p))}}).catch(e=>{throw Ia=null,e})}let Ia=null;function Gx(n){return Ia=Ia||Wx(n),Ia}/**
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
 */const Kx=new Ao(5e3,15e3),Jx="__/auth/iframe",Qx="emulator/auth/iframe",Xx={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Yx=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Zx(n){const e=n.config;he(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Yc(e,Qx):`https://${n.config.authDomain}/${Jx}`,s={apiKey:e.apiKey,appName:n.name,v:yi},r=Yx.get(n.config.apiHost);r&&(s.eid=r);const o=n._getFrameworks();return o.length&&(s.fw=o.join(",")),`${t}?${_o(s).slice(1)}`}async function e_(n){const e=await Gx(n),t=Ln().gapi;return he(t,n,"internal-error"),e.open({where:document.body,url:Zx(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Xx,dontclear:!0},s=>new Promise(async(r,o)=>{await s.restyle({setHideOnLeave:!1});const l=wn(n,"network-request-failed"),h=Ln().setTimeout(()=>{o(l)},Kx.get());function p(){Ln().clearTimeout(h),r(s)}s.ping(p).then(p,()=>{o(l)})}))}/**
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
 */const t_={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},n_=500,s_=600,r_="_blank",i_="http://localhost";class nh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function o_(n,e,t,s=n_,r=s_){const o=Math.max((window.screen.availHeight-r)/2,0).toString(),l=Math.max((window.screen.availWidth-s)/2,0).toString();let h="";const p=Object.assign(Object.assign({},t_),{width:s.toString(),height:r.toString(),top:o,left:l}),b=Ot().toLowerCase();t&&(h=Ep(b)?r_:t),_p(b)&&(e=e||i_,p.scrollbars="yes");const v=Object.entries(p).reduce((k,[F,B])=>`${k}${F}=${B},`,"");if(Lv(b)&&h!=="_self")return a_(e||"",h),new nh(null);const I=window.open(e||"",h,v);he(I,n,"popup-blocked");try{I.focus()}catch{}return new nh(I)}function a_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const l_="__/auth/handler",c_="emulator/auth/handler",u_=encodeURIComponent("fac");async function sh(n,e,t,s,r,o){he(n.config.authDomain,n,"auth-domain-config-required"),he(n.config.apiKey,n,"invalid-api-key");const l={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:yi,eventId:r};if(e instanceof ul){e.setDefaultLanguage(n.languageCode),l.providerId=e.providerId||"",Gm(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[v,I]of Object.entries({}))l[v]=I}if(e instanceof No){const v=e.getScopes().filter(I=>I!=="");v.length>0&&(l.scopes=v.join(","))}n.tenantId&&(l.tid=n.tenantId);const h=l;for(const v of Object.keys(h))h[v]===void 0&&delete h[v];const p=await n._getAppCheckToken(),b=p?`#${u_}=${encodeURIComponent(p)}`:"";return`${d_(n)}?${_o(h).slice(1)}${b}`}function d_({config:n}){return n.emulator?Yc(n,c_):`https://${n.authDomain}/${l_}`}/**
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
 */const Fl="webStorageSupport";class h_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Mp,this._completeRedirectFn=Hp,this._overrideRedirectResult=jx}async _openPopup(e,t,s,r){var o;cs((o=this.eventManagers[e._key()])===null||o===void 0?void 0:o.manager,"_initialize() not called before _openPopup()");const l=await sh(e,t,s,cc(),r);return o_(e,l,su())}async _openRedirect(e,t,s,r){await this._originValidation(e);const o=await sh(e,t,s,cc(),r);return px(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:o}=this.eventManagers[t];return r?Promise.resolve(r):(cs(o,"If manager is not set, promise should be"),o)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await e_(e),s=new Fx(e);return t.register("authEvent",r=>(he(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Fl,{type:Fl},r=>{var o;const l=(o=r==null?void 0:r[0])===null||o===void 0?void 0:o[Fl];l!==void 0&&t(!!l),Bn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=zx(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Np()||wp()||tu()}}const f_=h_;var rh="@firebase/auth",ih="1.10.8";/**
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
 */class p_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){he(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function m_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function g_(n){ci(new vr("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:l,authDomain:h}=s.options;he(l&&!l.includes(":"),"invalid-api-key",{appName:s.name});const p={apiKey:l,authDomain:h,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Sp(n)},b=new Hv(s,r,o,p);return Xv(b,t),b},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ci(new vr("auth-internal",e=>{const t=Ei(e.getProvider("auth").getImmediate());return(s=>new p_(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ms(rh,ih,m_(n)),Ms(rh,ih,"esm2017")}/**
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
 */const y_=300,b_=Eh("authIdTokenMaxAge")||y_;let oh=null;const v_=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>b_)return;const r=t==null?void 0:t.token;oh!==r&&(oh=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function x_(n=Sh()){const e=vc(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Qv(n,{popupRedirectResolver:f_,persistence:[Ex,Op,Mp]}),s=Eh("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(s,location.origin);if(location.origin===o.origin){const l=v_(o.toString());ax(t,l,()=>l(t.currentUser)),ox(t,h=>l(h))}}const r=_h("auth");return r&&Yv(t,`http://${r}`),t}function __(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Wv({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const o=wn("internal-error");o.customData=r,t(o)},s.type="text/javascript",s.charset="UTF-8",__().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});g_("Browser");const w_={apiKey:"AIzaSyB-URByQJZkJ0pMNJK0qTSzBsVJuy4FNk0",authDomain:"anti-planer.firebaseapp.com",projectId:"anti-planer",storageBucket:"anti-planer.firebasestorage.app",messagingSenderId:"235332843252",appId:"1:235332843252:web:8e95f47f1736017fcc50a1"},Gp=Nh(w_),Pn=sv(Gp),Xr=x_(Gp);/**
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
 */const ah=n=>{const e=T_(n);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var I_={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k_=n=>{for(const e in n)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A_=U.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:s,className:r="",children:o,iconNode:l,...h},p)=>U.createElement("svg",{ref:p,...I_,width:e,height:e,stroke:n,strokeWidth:s?Number(t)*24/Number(e):t,className:Kp("lucide",r),...!o&&!k_(h)&&{"aria-hidden":"true"},...h},[...l.map(([b,v])=>U.createElement(b,v)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=(n,e)=>{const t=U.forwardRef(({className:s,...r},o)=>U.createElement(A_,{ref:o,iconNode:e,className:Kp(`lucide-${E_(ah(n))}`,`lucide-${n}`,s),...r}));return t.displayName=ah(n),t};/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N_=[["path",{d:"M12 6v16",key:"nqf5sj"}],["path",{d:"m19 13 2-1a9 9 0 0 1-18 0l2 1",key:"y7qv08"}],["path",{d:"M9 11h6",key:"1fldmi"}],["circle",{cx:"12",cy:"4",r:"2",key:"muu5ef"}]],lh=Ce("anchor",N_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S_=[["path",{d:"M2 4v16",key:"vw9hq8"}],["path",{d:"M2 8h18a2 2 0 0 1 2 2v10",key:"1dgv2r"}],["path",{d:"M2 17h20",key:"18nfp3"}],["path",{d:"M6 8v9",key:"1yriud"}]],hc=Ce("bed",S_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C_=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],P_=Ce("calendar",C_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R_=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],Jp=Ce("camera",R_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j_=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],vn=Ce("chevron-down",j_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D_=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],fc=Ce("chevron-left",D_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O_=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],pc=Ce("chevron-right",O_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V_=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],As=Ce("chevron-up",V_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M_=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],Ll=Ce("circle-plus",M_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F_=[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]],Qp=Ce("coffee",F_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L_=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Xp=Ce("eye",L_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $_=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8",key:"1sqzm4"}],["path",{d:"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5",key:"kc0143"}],["rect",{x:"3",y:"7",width:"18",height:"4",rx:"1",key:"1hberx"}]],Yp=Ce("gift",$_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U_=[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]],Zp=Ce("hourglass",U_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B_=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]],z_=Ce("lock-open",B_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q_=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],fa=Ce("lock",q_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H_=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],W_=Ce("log-out",H_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G_=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],fr=Ce("map-pin",G_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K_=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],Yr=Ce("map",K_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J_=[["path",{d:"M5 12h14",key:"1ays0h"}]],Yi=Ce("minus",J_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q_=[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]],ch=Ce("navigation",Q_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X_=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],so=Ce("package",X_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y_=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],Z_=Ce("pencil",Y_);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e1=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Ns=Ce("plus",e1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t1=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],uh=Ce("share-2",t1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n1=[["path",{d:"M10 5H3",key:"1qgfaw"}],["path",{d:"M12 19H3",key:"yhmn1j"}],["path",{d:"M14 3v4",key:"1sua03"}],["path",{d:"M16 17v4",key:"1q0r14"}],["path",{d:"M21 12h-9",key:"1o4lsq"}],["path",{d:"M21 19h-5",key:"1rlt1p"}],["path",{d:"M21 5h-7",key:"1oszz2"}],["path",{d:"M8 10v4",key:"tgpxqk"}],["path",{d:"M8 12H3",key:"a7s4jb"}]],dh=Ce("sliders-horizontal",n1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],js=Ce("sparkles",s1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r1=[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],i1=Ce("square-check-big",r1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],a1=Ce("square",o1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],em=Ce("star",l1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],hh=Ce("timer",c1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u1=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],$l=Ce("trash-2",u1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],h1=Ce("user",d1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f1=[["path",{d:"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",key:"cjf0a3"}],["path",{d:"M7 2v20",key:"1473qp"}],["path",{d:"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",key:"j28e5"}]],tm=Ce("utensils",f1);/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p1=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],Zr=Ce("x",p1),m1="1.0.0.0",fh=[{version:"1.0.0.0",date:"2026-03-10",timeline:[{time:"23:50",emoji:"⛴️",title:"선적 종료 시간 직접 편집 가능",desc:"선박 카드에서 선적 종료 시간을 탭·드래그로 바로 수정할 수 있어요."},{time:"23:20",emoji:"⏱️",title:"이동 단위 공유",desc:"시작 시각 이동 단위(1/5/15/30분)를 선택하면 소요시간 스피너도 같은 단위로 맞춰져요."},{time:"23:05",emoji:"🔒",title:"잠금 버튼 테두리 강조",desc:"시간 셀 확장 시 잠금 상태일 때 색상 ring이 추가되어 한눈에 확인할 수 있어요."},{time:"22:40",emoji:"📱",title:"모바일 초기 사이드바 접힘",desc:"모바일 환경에서 앱 시작 시 양쪽 사이드바가 자동으로 닫혀 있어요."},{time:"22:15",emoji:"🗂️",title:"버전 시스템 도입",desc:"좌측 사이드바 하단에 버전 뱃지가 생겼어요. 눌러보시면 이 화면이 뜹니다 😄"},{time:"21:55",emoji:"📌",title:"사이드바 밀어내기 방식",desc:"사이드바를 열면 일정 영역 위에 겹치지 않고 옆으로 밀어내요."},{time:"21:30",emoji:"🅱️",title:"플랜B 셀 너비 통일",desc:"플랜B가 달린 일정 카드가 일반 카드와 동일한 너비로 표시돼요."},{time:"20:50",emoji:"🚀",title:"플랜B 드래그 개선",desc:"플랜B가 달린 일정을 드래그하면 현재 보이는 일정만 이동해요."},{time:"20:10",emoji:"🗓️",title:"카테고리 위치 변경",desc:"등록된 일정 탭에서 카테고리 뱃지가 장소 이름 아래로 이동했어요."},{time:"19:30",emoji:"00:00",title:"시간 표기 통일",desc:"시작·소요시간 모두 00:00 형식으로 표기를 통일했어요."},{time:"18:45",emoji:"🔒",title:"소요시간 잠금 표시",desc:"소요시간이 잠긴 경우에만 주황색으로 강조돼요."}]}];class g1 extends Et.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error("Runtime render error:",e,t)}render(){var e;return this.state.hasError?a.jsxs("div",{style:{minHeight:"100vh",padding:24,fontFamily:"sans-serif",background:"#F8FAFC",color:"#0F172A"},children:[a.jsx("h1",{style:{margin:0,fontSize:18,fontWeight:700},children:"앱 렌더링 오류가 발생했습니다."}),a.jsx("p",{style:{marginTop:8,fontSize:13,color:"#475569"},children:"새로고침 후에도 동일하면 콘솔 오류를 확인해주세요."}),a.jsx("pre",{style:{marginTop:12,whiteSpace:"pre-wrap",fontSize:12,background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:12},children:String(((e=this.state.error)==null?void 0:e.message)||this.state.error||"unknown error")})]}):this.props.children}}const pa=(n,e="")=>{try{return localStorage.getItem(n)||e}catch(t){return console.warn(`localStorage read failed (${n})`,t),e}},ma=(n,e)=>{try{localStorage.setItem(n,e)}catch(t){console.warn(`localStorage write failed (${n})`,t)}},y1=[{label:"식당",types:["food"],Icon:tm,className:"text-rose-500 bg-red-50 border-red-200 hover:bg-red-100"},{label:"카페",types:["cafe"],Icon:Qp,className:"text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100"},{label:"관광",types:["tour"],Icon:Jp,className:"text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100"},{label:"숙소",types:["lodge"],Icon:hc,className:"text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"},{label:"휴식",types:["rest"],Icon:Zp,className:"text-cyan-600 bg-cyan-50 border-cyan-200 hover:bg-cyan-100"},{label:"뷰맛집",types:["view"],Icon:Xp,className:"text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100"},{label:"체험",types:["experience"],Icon:em,className:"text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"},{label:"기념품샵",types:["souvenir"],Icon:Yp,className:"text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100"},{label:"픽업",types:["pickup"],Icon:so,className:"text-orange-500 bg-orange-50 border-orange-200 hover:bg-orange-100"},{label:"장소",types:["place"],Icon:fr,className:"text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100"}],Wa=[{label:"식당",value:"food"},{label:"카페",value:"cafe"},{label:"관광",value:"tour"},{label:"숙소",value:"lodge"},{label:"휴식",value:"rest"},{label:"픽업",value:"pickup"},{label:"오픈런",value:"openrun"},{label:"뷰맛집",value:"view"},{label:"체험",value:"experience"},{label:"기념품샵",value:"souvenir"},{label:"장소",value:"place"},{label:"신규",value:"new"},{label:"재방문",value:"revisit"}],b1=new Set(Wa.map(n=>n.value)),yr=new Set(["revisit","new"]),is=n=>{const e=Array.isArray(n)?n:[],t=[...new Set(e.filter(o=>yr.has(o)))],s=e.filter(o=>!yr.has(o)&&b1.has(o)),r=[...new Set(s)].slice(0,2);return r.length===0&&t.length===0?["place"]:[...r,...t]},v1=(n,e)=>{const t=is(n);if(yr.has(e))return t.includes(e)?is(t.filter(l=>l!==e)):is([...t,e]);const s=t.filter(l=>!yr.has(l)),r=t.filter(l=>yr.has(l));let o;return s.includes(e)?(o=s.filter(l=>l!==e),o.length===0&&(o=["place"])):o=s.length>=2?[s[0],e]:[...s,e],[...o,...r]},x1=(n,e)=>e?n==="food"?"text-rose-500 bg-red-50 border-red-200":n==="cafe"?"text-amber-600 bg-amber-50 border-amber-200":n==="tour"?"text-purple-600 bg-purple-50 border-purple-200":n==="lodge"?"text-indigo-600 bg-indigo-50 border-indigo-200":n==="rest"?"text-cyan-600 bg-cyan-50 border-cyan-200":n==="pickup"?"text-orange-500 bg-orange-50 border-orange-200":n==="openrun"?"text-red-500 bg-red-50 border-red-100":n==="view"?"text-sky-600 bg-sky-50 border-sky-200":n==="experience"?"text-emerald-600 bg-emerald-50 border-emerald-200":n==="souvenir"?"text-teal-600 bg-teal-50 border-teal-200":n==="new"?"text-emerald-600 bg-emerald-50 border-emerald-200":n==="revisit"?"text-blue-600 bg-blue-50 border-blue-200":"text-slate-500 bg-slate-100 border-slate-200":"bg-white text-slate-400 border-slate-200 hover:border-slate-300",mc=({value:n=["place"],onChange:e,title:t="태그",className:s=""})=>{const r=is(n),[o,l]=Et.useState(""),h=()=>{const v=o.trim();v&&!r.includes(v)&&e(is([...r,v])),l("")},p=new Set(Wa.map(v=>v.value)),b=r.filter(v=>!p.has(v)&&v!=="place");return a.jsxs("div",{className:s,children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1",children:t}),a.jsxs("div",{className:"flex flex-wrap gap-1 items-center",children:[Wa.map(v=>{const I=r.includes(v.value);return a.jsx("button",{type:"button",onClick:()=>e(v1(r,v.value)),className:`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors ${x1(v.value,I)}`,children:v.label},v.value)}),b.map(v=>a.jsxs("button",{type:"button",onClick:()=>e(is(r.filter(I=>I!==v))),className:"px-2 py-0.5 rounded-lg text-[10px] font-black border transition-colors text-slate-600 bg-slate-100 border-slate-300 hover:bg-slate-200",children:[v," ",a.jsx("span",{className:"text-slate-400 ml-0.5",children:"✕"})]},v)),a.jsx("input",{type:"text",value:o,onChange:v=>l(v.target.value),onKeyDown:v=>{v.key==="Enter"&&(v.preventDefault(),h())},onBlur:h,placeholder:"+ 직접 입력",className:"ml-1 w-20 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-200 bg-white placeholder:text-slate-300 outline-none focus:border-[#3182F6]"})]})]})},ro=[{label:"월",value:"mon"},{label:"화",value:"tue"},{label:"수",value:"wed"},{label:"목",value:"thu"},{label:"금",value:"fri"},{label:"토",value:"sat"},{label:"일",value:"sun"}],nm={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},Ul=[{date:"03.10",time:"14:50",tag:"FEAT",msg:"편집 모드 도입 — 안전한 페이지 탐색 기능"},{date:"03.10",time:"14:50",tag:"UX",msg:"플랜B 일정 상시 강조 (주황색 글로우)"},{date:"03.10",time:"14:35",tag:"FEAT",msg:"여분 시간 자동 보정 (시간 조율)"},{date:"03.10",time:"14:35",tag:"UX",msg:"컴팩트 플로팅 상단 바 디자인 개선"},{date:"03.09",time:"21:15",tag:"UX",msg:"시간 셀 — 소요시간 시작·종료 사이 배치"},{date:"03.09",time:"20:40",tag:"UX",msg:"업데이트 노트 — 사이트 UI 스타일 팝업"},{date:"03.09",time:"17:30",tag:"UX",msg:"금액 요약 셀 — 카드 내 좌우 여백 추가"},{date:"03.09",time:"16:50",tag:"FIX",msg:"내장소 수정 모달 터치 드래그 충돌 수정"},{date:"03.08",time:"19:10",tag:"FEAT",msg:"영업 시간 에디터 통합 + 프리셋 버튼"}],ph={open:["06:00","08:00","09:00","10:00","10:30","11:00"],close:["19:00","20:00","21:00","22:00","23:00","24:00"],breakStart:["12:00","13:00","14:00","15:00"],breakEnd:["13:00","14:00","15:00","16:00","17:00"],lastOrder:["19:30","20:00","20:30","21:00","21:30"],entryClose:["18:00","19:00","20:00","20:30"]},_1={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},mh=(n="")=>{const e=String(n).trim().match(/(\d{1,2})(?::(\d{2}))?/);if(!e)return"";const t=Number(e[1]),s=Number(e[2]||"0");return Number.isNaN(t)||Number.isNaN(s)||t<0||t>24||s<0||s>59||t===24&&s>0?"":`${String(t).padStart(2,"0")}:${String(s).padStart(2,"0")}`},gh=(n="")=>{const e=[],t=/(\d{1,2})\s*[:시]\s*(\d{1,2})?\s*분?/g;let s;for(;(s=t.exec(n))!==null;){const r=s[1],o=s[2]||"00",l=mh(`${r}:${o}`);l&&e.push(l)}if(e.length===0){const r=/(\d{1,2})\s*시/g;for(;(s=r.exec(n))!==null;){const o=mh(`${s[1]}:00`);o&&e.push(o)}}return[...new Set(e)]},Ga=(n="")=>{var b;const e={open:"",close:"",breakStart:"",breakEnd:"",lastOrder:"",entryClose:"",closedDays:[]},t={월:"mon",화:"tue",수:"wed",목:"thu",금:"fri",토:"sat",일:"sun"},s={};let r="";const o=String(n).split(/\r?\n/).map(v=>v.trim()).filter(Boolean);(o.length?o:[String(n).trim()].filter(Boolean)).forEach(v=>{const I=v.toLowerCase(),k=gh(v),F=v.match(/^(월|화|수|목|금|토|일)\b/);if(/^(월|화|수|목|금|토|일)$/.test(v)){r=v;return}if(r&&k.length>=2&&(s[r]=`${k[0]}-${k[1]}`,r=""),F&&/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(I)){const B=t[F[1]];B&&!e.closedDays.includes(B)&&e.closedDays.push(B);return}if(/(휴무|정기휴무|휴점|정기\s*휴일)/i.test(I)&&[...new Set(v.match(/[월화수목금토일]/g)||[])].forEach(X=>{const J=t[X];J&&!e.closedDays.includes(J)&&e.closedDays.push(J)}),F&&k.length>=2&&(s[F[1]]=`${k[0]}-${k[1]}`),k.length!==0){if(/(라스트\s*오더|last\s*order|lastorder|마감주문)/i.test(I)){e.lastOrder=k[0]||e.lastOrder;return}if(/(입장\s*마감|입장마감|마지막\s*입장|입장\s*종료|last\s*entry|lastentry|ticket\s*cutoff)/i.test(I)){e.entryClose=k[0]||e.entryClose;return}if(/(브레이크|break)/i.test(I)){e.breakStart=k[0]||e.breakStart,e.breakEnd=k[1]||e.breakEnd;return}!e.open&&k[0]&&(e.open=k[0]),!e.close&&k[1]&&(e.close=k[1])}});const h=Object.values(s);if(h.length>0){const v=h.reduce((F,B)=>({...F,[B]:(F[B]||0)+1}),{}),k=(b=Object.entries(v).sort((F,B)=>B[1]-F[1])[0])==null?void 0:b[0];if(k){const[F,B]=k.split("-");F&&(e.open=F),B&&(e.close=B)}}const p=gh(String(n));return!e.open&&p[0]&&(e.open=p[0]),!e.close&&p[1]&&(e.close=p[1]),!e.breakStart&&p[2]&&(e.breakStart=p[2]),!e.breakEnd&&p[3]&&(e.breakEnd=p[3]),!e.lastOrder&&p[4]&&(e.lastOrder=p[4]),!e.entryClose&&p[5]&&(e.entryClose=p[5]),{...e,closedDays:[...new Set(e.closedDays)]}},jn=(n="")=>{const e=String(n).split(/\r?\n/).map(l=>l.trim()).filter(Boolean);if(e.length===0)return null;const t={name:"",address:"",business:null,menus:[]};t.name=e[0];const s=e.findIndex(l=>l==="주소");s!==-1&&e[s+1]&&(t.address=e[s+1]);const r=e.findIndex(l=>l==="영업시간");if(r!==-1){const l=e.findIndex((p,b)=>b>r&&(p==="접기"||p==="전화번호"||p==="가격표"||p==="블로그")),h=e.slice(r+1,l!==-1?l:void 0).join(`
`);t.business=Ga(h)}const o=e.findIndex(l=>l==="가격표");if(o!==-1){const l=e.findIndex((p,b)=>b>o&&(p==="가격표 이미지로 보기"||p==="블로그"||p==="편의"||p==="리뷰")),h=e.slice(o+1,l!==-1?l:void 0);for(let p=0;p<h.length;p++){const b=h[p];if(b.includes("원")&&p>0){const v=parseInt(b.replace(/[^0-9]/g,""),10),I=h[p-1];I&&!I.includes("원")&&t.menus.push({name:I,price:v})}}}return t},w1=({value:n,onChange:e,onFocus:t,onBlurExtra:s,className:r="",title:o="",placeholder:l=""})=>{const h=b=>{let v=b.target.value.replace(/[^0-9:]/g,"");v.length===2&&!v.includes(":")&&(v=v+":"),v.length>5&&(v=v.slice(0,5)),e(v)},p=b=>{let v=b.target.value.trim();if(/^\d{4}$/.test(v)&&(v=v.slice(0,2)+":"+v.slice(2)),!/^\d{2}:\d{2}$/.test(v)){e(v),s==null||s();return}const[I,k]=v.split(":").map(Number);if(I>24||k>59||I===24&&k>0){e(""),s==null||s();return}e(v),s==null||s()};return a.jsx("input",{type:"text",inputMode:"numeric",value:n,onChange:h,onFocus:t,onBlur:p,placeholder:l,maxLength:5,title:o,className:r})},gc=({business:n={},onChange:e})=>{const[t,s]=Et.useState(null),r=Xe(n),o=(v,I)=>e({...r,[v]:I}),l=v=>e({...r,...v}),h="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] w-full",p={open:"오픈",close:"마감",breakStart:"브레이크 시작",breakEnd:"브레이크 종료",lastOrder:"라스트오더",entryClose:"입장 마감"},b=["open","close","breakStart","breakEnd","lastOrder","entryClose"];return a.jsxs("div",{onPaste:v=>{const I=v.clipboardData.getData("text"),k=Ga(I);(k.open||k.close||k.breakStart||k.breakEnd||k.lastOrder||k.entryClose)&&(v.preventDefault(),l(k))},children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 uppercase tracking-wider",children:"상세 영업 설정"}),a.jsxs("button",{type:"button",onClick:async()=>{try{const v=await navigator.clipboard.readText(),I=Ga(v);(I.open||I.close||I.breakStart||I.breakEnd||I.lastOrder||I.entryClose)&&l(I)}catch{}},className:"flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3182F6] shadow-[0_8px_16px_-6px_rgba(49,130,246,0.3)] text-[10px] font-black text-white hover:bg-blue-600 transition-all active:scale-95",children:[a.jsx(js,{size:11}),"영업정보 자동 붙여넣기"]})]}),a.jsx("div",{className:"grid grid-cols-2 gap-1.5 mb-1.5",children:b.map(v=>{var I;return a.jsxs("div",{className:"flex flex-col gap-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-slate-400",children:p[v]}),a.jsx(w1,{value:r[v],onChange:k=>o(v,k),onFocus:()=>s(v),onBlurExtra:()=>setTimeout(()=>s(k=>k===v?null:k),160),className:h,title:p[v]}),t===v&&((I=ph[v])==null?void 0:I.length)>0&&a.jsx("div",{className:"flex flex-wrap gap-1 mt-0.5",onMouseDown:k=>k.preventDefault(),children:ph[v].map(k=>a.jsx("button",{type:"button",onClick:()=>{o(v,k),s(null)},className:"px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 border border-blue-200 text-[#3182F6] hover:bg-blue-100 active:bg-blue-200",children:k},k))})]},v)})}),a.jsx("div",{className:"flex items-center gap-1 flex-wrap",children:ro.map(v=>{const I=(r.closedDays||[]).includes(v.value);return a.jsxs("button",{type:"button",onClick:()=>e({...r,closedDays:I?r.closedDays.filter(k=>k!==v.value):[...r.closedDays,v.value]}),className:`px-1.5 py-0.5 rounded border text-[10px] font-bold ${I?"text-red-500 bg-red-50 border-red-200":"text-slate-400 bg-white border-slate-200"}`,children:[v.label," 휴무"]},v.value)})})]})},yh=n=>`${Math.max(0,Math.round(Number(n)||0))}분`,Xe=(n={})=>({open:String(n.open||""),close:String(n.close||""),breakStart:String(n.breakStart||""),breakEnd:String(n.breakEnd||""),lastOrder:String(n.lastOrder||""),entryClose:String(n.entryClose||""),closedDays:Array.isArray(n.closedDays)?[...new Set(n.closedDays)]:[]}),E1="b312628369f47e04894f338b7fc0b318",Ss=async(n,e="",t=E1)=>{var h;const s=n.trim();if(!s)return{address:"",source:"",error:""};const r=`${(e==null?void 0:e.trim())||""} ${s}`.trim();if(t)try{const p=await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(r)}&size=1`,{headers:{Authorization:`KakaoAK ${t}`}});if(p.ok){const v=(h=(await p.json()).documents)==null?void 0:h[0];if(v){const I=v.road_address_name||v.address_name||"";if(I)return{address:I,lat:v.y,lon:v.x,source:"카카오"}}return{address:"",source:"카카오",error:"검색 결과 없음"}}}catch{}const o=p=>{if(!p)return"";const b=p.road||p.pedestrian||p.footway||"",v=p.house_number||"",I=p.quarter||p.suburb||p.neighbourhood||"",k=p.city_district||p.county||"",F=p.city||p.town||p.village||"";return b?[F||k,b,v].filter(Boolean).join(" "):I?[F,k,I].filter(Boolean).join(" "):""},l=[...new Set([r,s,e?`${e} ${s}`.trim():null].filter(Boolean))];for(const p of l){const b=new AbortController,v=setTimeout(()=>b.abort(),8e3);try{const I=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=kr&accept-language=ko&addressdetails=1&q=${encodeURIComponent(p)}`,{method:"GET",headers:{Accept:"application/json","Accept-Language":"ko"},signal:b.signal});if(!I.ok)throw new Error(`HTTP ${I.status}`);const k=await I.json();if(clearTimeout(v),!(k!=null&&k.length))continue;for(const B of k){const X=o(B.address);if(X)return{address:X,lat:B.lat,lon:B.lon,source:"Nominatim"}}const F=k[0].display_name||"";if(F)return{address:F.split(", ").filter(X=>X!=="대한민국"&&!/^\d{5}$/.test(X)).slice(0,4).reverse().join(" "),lat:k[0].lat,lon:k[0].lon,source:"Nominatim"}}catch{clearTimeout(v);continue}}try{const p="".replace(/\/$/,""),b=Array.from(new Set([p?`${p}/api/scrape`:"","/api/scrape"].filter(Boolean))),v=`https://map.naver.com/v5/search/${encodeURIComponent(r)}`;for(const I of b)try{const k=await fetch(I,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:v})});if(!k.ok)continue;const F=await k.json(),B=String((F==null?void 0:F.address)||"").trim();if(B&&/[가-힣]/.test(B)&&/\d/.test(B)&&/(로|길|대로|번길|읍|면|동|리)/.test(B))return{address:B,source:"NaverScrape"}}catch{}}catch{}return{address:"",source:"Nominatim",error:"검색 결과 없음 (카카오/네이버 보강 실패)"}},T1=({startDate:n,endDate:e,onStartChange:t,onEndChange:s,onClose:r})=>{const o=E=>E?new Date(E+"T00:00:00"):null,l=E=>`${E.getFullYear()}-${String(E.getMonth()+1).padStart(2,"0")}-${String(E.getDate()).padStart(2,"0")}`,h=o(n),p=o(e),b=h||new Date,[v,I]=Et.useState(b.getFullYear()),[k,F]=Et.useState(b.getMonth()),[B,X]=Et.useState("start"),J=new Date(v,k,1),xe=new Date(v,k+1,0),ae=[];for(let E=0;E<J.getDay();E++)ae.push(null);for(let E=1;E<=xe.getDate();E++)ae.push(new Date(v,k,E));const pe=E=>{const P=l(E);B==="start"?(t(P),p&&E>p&&s(""),X("end")):h&&E<h?(t(P),s("")):(s(P),setTimeout(r,150))},de=(E,P)=>E&&P&&l(E)===l(P),st=()=>{k===0?(I(E=>E-1),F(11)):F(E=>E-1)},Fe=()=>{k===11?(I(E=>E+1),F(0)):F(E=>E+1)},j=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],A=["일","월","화","수","목","금","토"];return a.jsxs("div",{className:"absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 z-[300]",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("button",{onClick:st,className:"w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors",children:a.jsx(fc,{size:14})}),a.jsxs("span",{className:"text-[13px] font-black text-slate-800",children:[v,"년 ",j[k]]}),a.jsx("button",{onClick:Fe,className:"w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors",children:a.jsx(pc,{size:14})})]}),a.jsx("div",{className:"grid grid-cols-7 mb-1",children:A.map((E,P)=>a.jsx("span",{className:`text-center text-[9px] font-black pb-1 ${P===0?"text-rose-400":P===6?"text-blue-400":"text-slate-400"}`,children:E},E))}),a.jsx("div",{className:"grid grid-cols-7 gap-y-0.5",children:ae.map((E,P)=>{if(!E)return a.jsx("div",{},`e-${P}`);const N=de(E,h),S=de(E,p),T=h&&p&&E>h&&E<p,et=E.getDay();return a.jsx("button",{onClick:()=>pe(E),className:`h-8 w-full text-[11px] font-bold transition-all
                ${N||S?"bg-[#3182F6] text-white font-black rounded-lg":""}
                ${T?"bg-blue-50 text-[#3182F6] rounded-none":""}
                ${!N&&!S&&!T?`hover:bg-slate-100 rounded-lg ${et===0?"text-rose-400":et===6?"text-blue-500":"text-slate-700"}`:""}
              `,children:E.getDate()},P)})}),a.jsxs("div",{className:"mt-3 pt-3 border-t border-slate-100 flex items-center justify-between",children:[a.jsxs("div",{className:`flex flex-col ${B==="start"?"opacity-100":"opacity-40"} transition-opacity`,children:[a.jsx("span",{className:"text-[8px] font-black text-[#3182F6] uppercase tracking-wider",children:"시작일"}),a.jsx("span",{className:"text-[12px] font-black text-slate-800",children:n?n.slice(5).replace("-","/"):"—"})]}),a.jsx("span",{className:"text-slate-300 font-black text-sm",children:"→"}),a.jsxs("div",{className:`flex flex-col items-end ${B==="end"?"opacity-100":"opacity-40"} transition-opacity`,children:[a.jsx("span",{className:"text-[8px] font-black text-[#3182F6] uppercase tracking-wider",children:"종료일"}),a.jsx("span",{className:"text-[12px] font-black text-slate-800",children:e?e.slice(5).replace("-","/"):"—"})]})]}),a.jsx("p",{className:"text-[9px] text-center text-slate-400 font-bold mt-1.5",children:B==="start"?"시작일을 선택하세요":"종료일을 선택하세요"})]})},I1=({newPlaceName:n,setNewPlaceName:e,newPlaceTypes:t,setNewPlaceTypes:s,regionHint:r,onAdd:o,onCancel:l})=>{const[h,p]=Et.useState(nm),[b,v]=Et.useState([]),[I,k]=Et.useState({name:"",price:""}),[F,B]=Et.useState(""),[X,J]=Et.useState(""),[xe,ae]=Et.useState(!1),[pe,de]=Et.useState(""),st=Et.useRef(""),Fe=(N="")=>{const S=String(N||"").match(/https?:\/\/(?:naver\.me|map\.naver\.com|pcmap\.place\.naver\.com|m\.place\.naver\.com)\/[^\s)>\]"']+/i);return S!=null&&S[0]?S[0].replace(/[),.;]+$/,""):""},j=()=>{I.name.trim()&&(v(N=>[...N,{name:I.name.trim(),price:Number(I.price)||0}]),k({name:"",price:""}))},A=()=>{o({types:is(t),menus:b,address:F,memo:X,business:Xe(h)})},E=async(N=!1)=>{if(!xe&&n.trim()&&!(F.trim()&&!N)){ae(!0),de("주소 검색 중...");try{const S=await Ss(n,r);if(!(S!=null&&S.address)){de("검색 결과가 없습니다.");return}B(S.address),de("주소가 자동 입력되었습니다.")}catch{de("자동 입력에 실패했습니다.")}finally{ae(!1)}}},P=async N=>{const S=String(N||"").trim();if(S&&st.current!==S){st.current=S,ae(!0),de("지도 링크 분석 중...");try{const T="".replace(/\/$/,""),et=Array.from(new Set([T?`${T}/api/scrape`:"","/api/scrape"].filter(Boolean)));let ke=null,Ks=null;for(const tt of et)try{const Le=await fetch(tt,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:S})});if(!Le.ok){const Wt=await Le.json().catch(()=>({}));throw new Error((Wt==null?void 0:Wt.details)||(Wt==null?void 0:Wt.error)||`HTTP ${Le.status}`)}if(ke=await Le.json(),ke)break}catch(Le){Ks=Le}if(!ke)throw Ks||new Error("스크래핑 응답이 없습니다.");ke!=null&&ke.title&&e(String(ke.title).trim()),ke!=null&&ke.address&&B(String(ke.address).trim());const ot=Ga(String((ke==null?void 0:ke.hours)||""));if((ot.open||ot.close||ot.breakStart||ot.breakEnd||ot.lastOrder||ot.entryClose)&&p(tt=>({...tt,...ot})),Array.isArray(ke==null?void 0:ke.menus)&&ke.menus.length>0){const tt=ke.menus.map(Le=>({name:String((Le==null?void 0:Le.name)||"").trim(),price:Number(Le==null?void 0:Le.price)||0})).filter(Le=>!(!Le.name||/(제주|서울|부산|인천|경기|강원|충북|충남|전북|전남|경북|경남)/.test(Le.name)&&/(로|길|대로|번길|동|읍|면)\s*\d/.test(Le.name)||/(이전\s*페이지|다음\s*페이지|닫기|펼치기|이미지\s*개수|translateX|translateY)/i.test(Le.name)));tt.length&&v(tt.slice(0,5))}if(de("지도 링크에서 장소 정보를 불러왔습니다."),!(ke!=null&&ke.address)&&(ke!=null&&ke.title)){const tt=await Ss(String(ke.title),r);tt!=null&&tt.address&&B(tt.address)}}catch(T){de(`지도 자동 추출 실패: ${(T==null?void 0:T.message)||"알 수 없는 오류"}`)}finally{ae(!1)}}};return a.jsxs("div",{className:"mb-4 w-full shrink-0 rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden",children:[a.jsx("div",{className:"px-4 py-3 border-b border-slate-100/60 bg-slate-50/50 flex items-center justify-between",children:a.jsx("p",{className:"text-[10px] font-black text-slate-400 uppercase tracking-widest",children:"새 장소 등록"})}),a.jsxs("div",{className:"p-3 flex flex-col gap-2.5",children:[a.jsx(mc,{value:t,onChange:s,title:"태그"}),a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-[#3182F6]/50 focus-within:bg-white transition-all",children:[a.jsx("input",{autoFocus:!0,value:n,onChange:N=>{const S=N.target.value,T=Fe(S);T?P(T):e(S)},onPaste:async N=>{const S=N.clipboardData.getData("text");if(S&&!Fe(S)&&S.length>50){const T=jn(S);T&&(T.address||T.business||T.menus.length)&&(N.preventDefault(),T.name&&e(T.name),T.address&&B(T.address),T.business&&p(T.business),T.menus.length&&v(T.menus),de("클립보드 내용을 분석하여 입력했습니다."))}},onBlur:()=>{E(!1)},onKeyDown:N=>{N.key==="Escape"&&l(),N.key==="Enter"&&(N.preventDefault(),E(!0))},placeholder:"일정 이름 입력 (지도 링크 붙여넣기 가능)",className:"flex-1 bg-transparent text-[11px] font-bold text-slate-600 leading-tight outline-none placeholder:text-slate-400"}),a.jsx("button",{type:"button",onClick:async()=>{try{const N=await navigator.clipboard.readText(),S=jn(N);S?(S.name&&e(S.name),S.address&&B(S.address),S.business&&p(S.business),S.menus.length&&v(S.menus),de("클립보드 내용을 분석하여 입력했습니다.")):de("분석할 수 없는 형식입니다.")}catch{de("클립보드 접근 권한이 필요합니다.")}},className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",title:"스마트 전체 붙여넣기",children:a.jsx(js,{size:9})})]}),a.jsxs("div",{className:"flex gap-1.5 -mt-1 mb-0.5",children:[a.jsx("button",{type:"button",onClick:async()=>{try{const N=await navigator.clipboard.readText(),S=jn(N);S!=null&&S.business&&(p(S.business),de("영업 정보를 스마트 입력했습니다."))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all",children:"🕒 영업정보만 입력"}),a.jsx("button",{type:"button",onClick:async()=>{var N;try{const S=await navigator.clipboard.readText(),T=jn(S);(N=T==null?void 0:T.menus)!=null&&N.length&&(v(T.menus),de("메뉴 정보를 스마트 입력했습니다."))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] hover:border-blue-200 transition-all",children:"📋 메뉴만 입력"})]}),a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm",children:[a.jsx(fr,{size:12,className:"text-[#3182F6]"}),a.jsx("input",{value:F,onChange:N=>B(N.target.value),placeholder:"주소를 입력하세요",className:"bg-transparent border-none outline-none text-[11px] font-bold w-full text-slate-600 placeholder:text-slate-400"}),a.jsx("button",{type:"button",onClick:()=>{E(!0)},disabled:xe||!n.trim(),className:"shrink-0 px-1.5 py-1 rounded-md text-[9px] font-black border border-slate-200 bg-white text-slate-500 disabled:opacity-50 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",title:"일정 이름으로 주소 자동 입력",children:a.jsx(js,{size:9})})]}),pe&&a.jsx("p",{className:`text-[9px] font-bold -mt-1 ${pe.includes("실패")||pe.includes("없습니다")?"text-amber-500":"text-slate-400"}`,children:pe}),a.jsx("input",{value:X,onChange:N=>J(N.target.value),placeholder:"메모를 입력하세요...",className:"w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-slate-300 focus:bg-white transition-all"}),a.jsx("div",{className:"bg-slate-50/50 border border-slate-200 rounded-xl p-2.5",children:a.jsx(gc,{business:h,onChange:N=>p(N)})}),a.jsxs("div",{className:"bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-2",children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1.5",children:"대표 메뉴"}),b.length===0&&a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold mb-2",children:"메뉴를 추가하면 일정 셀 하단 영수증과 동일하게 반영됩니다."}),b.map((N,S)=>a.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1",children:[a.jsx("span",{className:"flex-1 truncate",children:N.name}),a.jsxs("span",{className:"text-slate-400",children:["₩",N.price.toLocaleString()]}),a.jsx("button",{onClick:()=>v(T=>T.filter((et,ke)=>ke!==S)),className:"text-slate-300 hover:text-red-400 ml-1",children:"✕"})]},S)),a.jsxs("div",{className:"grid grid-cols-[minmax(0,1fr)_4.25rem_auto] gap-1",children:[a.jsx("input",{value:I.name,onChange:N=>k(S=>({...S,name:N.target.value})),onKeyDown:N=>{N.key==="Enter"&&j()},placeholder:"메뉴 이름",className:"min-w-0 text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6]"}),a.jsx("input",{value:I.price,onChange:N=>k(S=>({...S,price:N.target.value})),onKeyDown:N=>{N.key==="Enter"&&j()},placeholder:"가격",type:"number",className:"w-[4.25rem] text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("button",{onClick:j,className:"px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 hover:bg-slate-200 whitespace-nowrap",children:"+"})]})]})]}),a.jsxs("div",{className:"mt-2 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-3",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("span",{className:"text-[11px] font-bold text-blue-900/60 uppercase tracking-widest leading-none",children:"Estimated Total"}),a.jsxs("span",{className:"text-[19px] font-black text-[#3182F6] leading-none",children:["₩",b.reduce((N,S)=>N+(Number(S.price)||0),0).toLocaleString()]})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:A,className:"flex-1 py-3 bg-[#3182F6] text-white text-[13px] font-black rounded-xl shadow-[0_8px_16px_-6px_rgba(49,130,246,0.35)] hover:bg-blue-600 transition-all active:scale-[0.98]",children:"일정 추가하기"}),a.jsx("button",{onClick:l,className:"px-5 py-3 bg-white border border-slate-200 text-slate-500 text-[13px] font-black rounded-xl hover:bg-slate-50 transition-all",children:"취소"})]})]})]})},k1=()=>{var ku,Au,Nu,Su,Cu,Pu,Ru,ju;const[n,e]=U.useState(null),[t,s]=U.useState(!0),[r,o]=U.useState("");U.useEffect(()=>{let u=!0,c=!1;const y=setTimeout(()=>{u&&!c&&(console.warn("Auth initialization timeout fallback"),s(!1))},12e3);(async()=>{try{await ix(Xr,Op)}catch(w){console.warn("Auth persistence setup failed:",(w==null?void 0:w.code)||(w==null?void 0:w.message))}try{await Vx(Xr)}catch(w){u&&w.code!=="auth/redirect-cancelled-by-user"&&(console.warn("Redirect Login Note:",(w==null?void 0:w.code)||(w==null?void 0:w.message)),o(`로그인 처리 중 오류: ${(w==null?void 0:w.code)||(w==null?void 0:w.message)||"unknown"}`))}})();const g=lx(Xr,w=>{u&&(c=!0,clearTimeout(y),o(""),e(w),s(!1))});return()=>{u=!1,clearTimeout(y),g()}},[]);const l=async()=>{o("");try{const u=new Dn;u.setCustomParameters({prompt:"select_account"}),await Nx(Xr,u)}catch(u){console.error("로그인 에러 상세:",u==null?void 0:u.code,u==null?void 0:u.message);let c="로그인 과정을 시작할 수 없습니다.";if(u.code==="auth/configuration-not-found")c=`Firebase 프로젝트에서 "구글 로그인"이 활성화되지 않았습니다.

해결 방법:
1. Firebase Console 접속
2. Authentication > Sign-in method
3. [Add new provider] 클릭 후 "Google" 활성화`;else if(u.code==="auth/unauthorized-domain")c=`현재 도메인(${window.location.hostname})이 Firebase 승인 된 도메인에 없습니다.

해결 방법:
1. Firebase Console > Authentication > Settings
2. [Authorized domains]에 "${window.location.hostname}" 추가`;else if(u.code==="auth/popup-blocked"||u.code==="auth/popup-closed-by-user"||u.code==="auth/cancelled-popup-request"||u.code==="auth/operation-not-supported-in-this-environment"){const y=new Dn;y.setCustomParameters({prompt:"select_account"}),await Dx(Xr,y);return}else c+=`
(오류 코드: ${u.code||u.message})`;o(c),alert(c)}},h=()=>{window.confirm("계정 없이 시작하시겠습니까? 데이터가 서버에 저장되지 않을 수 있습니다.")&&(e({uid:"guest_user",displayName:"GUEST",isGuest:!0}),s(!1))},p=async()=>{if(window.confirm("로그아웃 하시겠습니까?"))try{await cx(Xr),ie({days:[],places:[]}),Hn([]),$r(null),Vt(null),v(!0)}catch(u){console.error("로그아웃 실패:",u)}},[b,v]=U.useState(!0),[I,k]=U.useState(null),[F,B]=U.useState("main"),[X,J]=U.useState([]),[xe,ae]=U.useState(!1),[pe,de]=U.useState(!1),[st,Fe]=U.useState(""),[j,A]=U.useState(""),[E,P]=U.useState(!1),[N,S]=U.useState(!1),[T,et]=U.useState(!1),[ke,Ks]=U.useState(!1),[ot,tt]=U.useState({visibility:"private",permission:"viewer"}),[Le,Wt]=U.useState(!1),[De,En]=U.useState(null),vt=U.useRef(!1),[ou,Nr]=U.useState(!1),[Pe,Gt]=U.useState(null),[Sr,Co]=U.useState([]),[Y,Tt]=U.useState(null),[Po,Cr]=U.useState(!1),[Js,Kt]=U.useState(""),[rt,Nt]=U.useState(null),[$t,an]=U.useState(null),[ln,cn]=U.useState(!1),[Ro,Ti]=U.useState({x:0,y:0}),ds=U.useRef(null),Qs=U.useRef(!1),[dt,ht]=U.useState(!1),[zn,Ii]=U.useState(""),[jo,Do]=U.useState(["food"]),[hs,Tn]=U.useState(null),[ft,He]=U.useState(null),[Ue,Xs]=U.useState(()=>pa("trip_region_hint","제주시")),[je,fs]=U.useState(()=>pa("trip_start_date","")),[xt,un]=U.useState(()=>pa("trip_end_date","")),[Pr,Rr]=U.useState(""),[In,ki]=U.useState(""),[Ys,Ai]=U.useState(""),[ps,Ni]=U.useState("0"),[H,ie]=U.useState({days:[],places:[]}),[qn,Hn]=U.useState([]),[Si,jr]=U.useState([]),[ms,Dr]=U.useState(!1),[fl,Or]=U.useState(""),Vr=Et.useRef(null),[Mr,Fr]=U.useState(null),[kn,Oo]=U.useState(null),[Be,gs]=U.useState(null);U.useEffect(()=>{const u=c=>{Be&&(c.target.closest('[data-time-trigger="true"]')||c.target.closest(".group\\/tower")||gs(null))};return document.addEventListener("mousedown",u),()=>document.removeEventListener("mousedown",u)},[Be]);const[Ut,ys]=U.useState(null),Lr=U.useRef(""),[au,te]=U.useState("3일차 시작 일정이 수정되었습니다."),[pl,Vo]=U.useState({}),[pt,An]=U.useState(!1),[dn,Mo]=U.useState(1),[Zs,$r]=U.useState(null),er=Et.useRef(!1),tr=Et.useRef(null);U.useRef(null),U.useRef({x:0,y:0});const hn=U.useRef(!1),Fo=U.useRef(null),[ml,lu]=U.useState(!1);U.useRef({overflow:"",touchAction:""});const bs=U.useRef(null),nr=U.useRef(null),Ci=(u,c=null)=>{var w,_,C;er.current=!0,tr.current&&clearTimeout(tr.current),u&&Mo(u);let y=c;if(!y){const O=(w=H.days)==null?void 0:w.find(G=>G.day===u),M=(_=O==null?void 0:O.plan)==null?void 0:_.find(G=>G.type!=="backup");M&&(y=M.id)}if(y){$r(y),ze(y),setTimeout(()=>ze(null),1500);let O=null;for(const M of H.days||[])if(O=(C=M.plan)==null?void 0:C.find(G=>G.id===y),O)break;if(O){const M=We(O,"to");Vt(M?{id:O.id,name:O.activity,address:M}:{id:O.id,name:O.activity,address:""})}}const f=()=>{if(y){const M=document.getElementById(y);if(M)return M}const O=document.getElementById(`day-marker-${u}`);if(O)return O;if(y){const M=document.querySelector(`[data-plan-id="${CSS.escape(String(y))}"]`);if(M)return M}return null},g=()=>{const O=f();return O?(O.scrollIntoView({behavior:"smooth",block:y?"center":"start"}),!0):!1};g()||requestAnimationFrame(()=>{g()||setTimeout(g,120)}),tr.current=setTimeout(()=>{er.current=!1},1500)},[Re,Vt]=U.useState(null),[Bt,Wn]=U.useState({}),[Xt,sr]=U.useState(()=>typeof window<"u"&&window.innerWidth<1100),[Te,Gn]=U.useState(()=>typeof window<"u"&&window.innerWidth<1100),[Jt,rr]=U.useState(()=>typeof window<"u"?window.innerWidth:1280),[zt,Lo]=U.useState(null),[vs,gl]=U.useState(null),[yl,Pi]=U.useState({}),[Yt,Mt]=U.useState(null),[Ur,xs]=U.useState({}),[ir,Kn]=U.useState(null),[$o,Ri]=U.useState(!1),[bl,Zt]=U.useState(0),[cu,Uo]=U.useState(200),_s=U.useRef(null),or=U.useRef(null),[ji,ar]=U.useState(!1),[ws,Bo]=U.useState(!1),[Di,ze]=U.useState(null),at=Jt<1100,Oi=at?Math.min(340,Math.round(Jt*.82)):260,Br=at?Math.min(360,Math.round(Jt*.86)):310,zo=at?0:44,qo=at?0:44,Nn=Xt?zo:Oi,zr=Te?qo:Br,Ft=at||Jt<1380||!Xt&&!Te&&Jt<1720,Vi=Ft?"max-w-[500px]":"max-w-[560px]",lr=U.useRef(null),Jn=U.useRef(null),Mi=U.useRef(at);U.useEffect(()=>{const u=()=>rr(window.innerWidth);return window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]),U.useEffect(()=>{at&&!Mi.current&&(sr(!0),Gn(!0)),Mi.current=at},[at]),U.useEffect(()=>{if(at)return;const u=Oi+Br+560+96;Jt>=u&&(Xt||Te)&&(sr(!1),Gn(!1))},[Jt,at,Oi,Br,Xt,Te]),U.useCallback(()=>{lr.current||(lr.current=setInterval(()=>{if(Jn.current===null)return;const u=Jn.current,c=120,y=1.2;u<c?window.scrollBy(0,-Math.pow((c-u)/8,y)-2):u>window.innerHeight-c&&window.scrollBy(0,Math.pow((u-(window.innerHeight-c))/8,y)+2)},16))},[]),U.useCallback(()=>{lr.current&&(clearInterval(lr.current),lr.current=null),Jn.current=null},[]);const Sn=(u={})=>({visibility:["private","link","public"].includes(u==null?void 0:u.visibility)?u.visibility:"private",permission:["viewer","editor"].includes(u==null?void 0:u.permission)?u.permission:"viewer"}),qr=(u,c)=>{const y=new URL(window.location.href);return y.searchParams.set("owner",u),y.searchParams.set("plan",c||"main"),y.toString()},Fi=(u="")=>{const c=String(u||"").trim().replace(/\s+/g,"");return c?c.slice(0,6).toUpperCase():"TRIP"},fn=(u="",c="")=>{const y=String(c||"").trim(),f=/^\d{4}-\d{2}/.test(y)?y.slice(0,7).replace("-",""):new Date().toISOString().slice(0,7).replace("-",""),g=String(Date.now()).slice(-4);return`${Fi(u)}-${f}-${g}`},Ho=(u="",c="",y="")=>{const f=String(c||"").trim(),g=/^\d{4}-\d{2}/.test(f)?f.slice(0,7).replace("-",""):new Date().toISOString().slice(0,7).replace("-",""),w=String(y||"main").replace(/[^a-zA-Z0-9]/g,"").slice(-4).toUpperCase().padStart(4,"0");return`${Fi(u)}-${g}-${w}`},Li=(u={})=>{const c=u.id===F,y=(c?Ue:u.region)||"여행지",f=(c?H.planTitle||"":u.title)||`${y} 일정`,g=(c?je:u.startDate)||"",w=(c?H.planCode:u.planCode)||Ho(y,g,u.id||F);return{region:y,title:f,startDate:g,code:w}},Qn=(u="")=>{const c=String(u||"").toLowerCase();return/(제주|jeju)/.test(c)?"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop":/(부산|busan)/.test(c)?"https://images.unsplash.com/photo-1526481280695-3c4696659f38?q=80&w=1600&auto=format&fit=crop":/(서울|seoul)/.test(c)?"https://images.unsplash.com/photo-1538485399081-7c897f6e6f68?q=80&w=1600&auto=format&fit=crop":/(강릉|속초|동해|gangneung|sokcho)/.test(c)?"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=1600&auto=format&fit=crop":/(도쿄|tokyo)/.test(c)?"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop":/(오사카|osaka)/.test(c)?"https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=1600&auto=format&fit=crop":/(후쿠오카|fukuoka)/.test(c)?"https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1600&auto=format&fit=crop":/(파리|paris)/.test(c)?"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop":/(뉴욕|new york|nyc)/.test(c)?"https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1600&auto=format&fit=crop":"https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop"},$i=(u="새 여행지",c="")=>({days:[{day:1,plan:[]}],places:[],maxBudget:15e5,tripRegion:u,tripStartDate:"",tripEndDate:"",planTitle:c||`${u} 여행`,planCode:fn(u,""),share:{visibility:"private",permission:"viewer"},updatedAt:Date.now()}),pn=U.useCallback(async u=>{if(u)try{const y=(await bv(nv(Pn,"users",u,"itinerary"))).docs.map(f=>{const g=f.data()||{};return{id:f.id,title:g.planTitle||`${g.tripRegion||"여행"} 일정`,region:g.tripRegion||"",planCode:g.planCode||"",startDate:g.tripStartDate||"",updatedAt:Number(g.updatedAt||0)}}).sort((f,g)=>g.updatedAt-f.updatedAt);J(y)}catch(c){console.error("일정 목록 로드 실패:",c)}},[]),Hr=async(u="")=>{if(!n||n.isGuest){te("게스트 모드에서는 새 일정 생성이 제한됩니다.");return}const c=`plan_${Date.now()}`,y=String(u||st||"").trim()||"새 여행지",f=j.trim()||`${y} 여행`,g=$i(y,f);g.planCode=fn(y,g.tripStartDate||""),await Xi(es(Pn,"users",n.uid,"itinerary",c),g),await pn(n.uid),B(c),Fe(""),A(""),ae(!1),de(!1),te(`'${f}' 일정이 생성되었습니다.`)},Wr=u=>{const c=Sn(u);tt(c),ie(y=>({...y,share:c}))},Wo=async()=>{if(!n||n.isGuest){te("게스트 모드에서는 공유 링크를 만들 수 없습니다.");return}const u=qr(n.uid,F);try{await navigator.clipboard.writeText(u),Ks(!0),setTimeout(()=>Ks(!1),1400),te("공유 링크를 복사했습니다.")}catch{te(`공유 링크: ${u}`)}};U.useEffect(()=>{T&&(Rr(Ue||""),ki(je||""),Ai(xt||""),Ni(String((H==null?void 0:H.maxBudget)||0)))},[T,Ue,je,xt,H==null?void 0:H.maxBudget]),U.useEffect(()=>{const u=y=>{y.key==="Control"&&(Qs.current=!0)},c=y=>{y.key==="Control"&&(Qs.current=!1)};return window.addEventListener("keydown",u),window.addEventListener("keyup",c),()=>{window.removeEventListener("keydown",u),window.removeEventListener("keyup",c)}},[]),U.useEffect(()=>{const u=new URLSearchParams(window.location.search),c=u.get("owner"),y=u.get("plan")||"main";c&&(En({ownerId:c,planId:y}),B(y))},[]),U.useEffect(()=>{n||!(De!=null&&De.ownerId)||(async()=>{v(!0);try{const u=await da(es(Pn,"users",De.ownerId,"itinerary",De.planId||"main"));if(!u.exists()){te("공유 일정을 찾을 수 없습니다."),v(!1);return}const c=u.data(),y=Sn(c.share||{});if(y.visibility==="private"){te("공유가 비공개라 접근할 수 없습니다."),v(!1);return}const f=(c.days||[]).map(g=>({...g,plan:(g.plan||[]).map(w=>({...w}))}));ie({days:f,places:c.places||[],maxBudget:c.maxBudget||15e5,share:y,planTitle:c.planTitle||`${c.tripRegion||"공유"} 일정`,planCode:c.planCode||fn(c.tripRegion||"공유",c.tripStartDate||"")}),tt(y),c.tripRegion&&Xs(c.tripRegion),typeof c.tripStartDate=="string"&&fs(c.tripStartDate),typeof c.tripEndDate=="string"&&un(c.tripEndDate),B(De.planId||"main"),Wt(y.permission!=="editor")}catch(u){console.error("공유 일정 로드 실패:",u)}finally{v(!1)}})()},[n,De]),U.useEffect(()=>{!n||n.isGuest||pn(n.uid)},[n,pn]),U.useEffect(()=>{if(b||Ul.length===0)return;const u=Ul[0],c=`patch_${u.date}_${u.time}`;if(localStorage.getItem(c))return;k({timeText:`${u.date} ${u.time}`}),localStorage.setItem(c,"read");const y=setTimeout(()=>k(null),6e3);return()=>clearTimeout(y)},[b]),U.useEffect(()=>{if(!n||n.isGuest||b||Le)return;const u=setTimeout(()=>{const c={planTitle:H.planTitle||`${Ue||"여행지"} 일정`,planCode:H.planCode||Ho(Ue||"여행지",je||"",F),tripRegion:Ue||"여행지",tripStartDate:je||"",tripEndDate:xt||"",updatedAt:Date.now()};Xi(es(Pn,"users",n.uid,"itinerary",F||"main"),c,{merge:!0}).then(()=>pn(n.uid)).catch(()=>{})},350);return()=>clearTimeout(u)},[n,b,Le,F,H.planTitle,H.planCode,Ue,je,xt,pn]),U.useEffect(()=>{if(!n){vt.current=!1,de(!1);return}if(n.isGuest){de(!1);return}if(De!=null&&De.ownerId){de(!1);return}},[n,b,De]),U.useEffect(()=>{const u=y=>{const f=bs.current;if(!f)return;const g=y.touches[0];if(!hn.current){const w=g.clientX-f.startX,_=g.clientY-f.startY;if(Math.sqrt(w*w+_*_)<10)return;hn.current=!0,f.kind==="library"?Gt(f.place):Tt(f.payload),document.body.style.overflow="hidden",document.body.style.touchAction="none"}if(hn.current){y.preventDefault(),Ti({x:g.clientX,y:g.clientY});const w=document.elementFromPoint(g.clientX,g.clientY),_=w==null?void 0:w.closest("[data-droptarget]"),C=w==null?void 0:w.closest("[data-dropitem]"),O=w==null?void 0:w.closest("[data-deletezone]");if(_){const[M,G]=_.dataset.droptarget.split("-").map(Number);Nt({dayIdx:M,insertAfterPIdx:G}),an(null)}else if(C){const[M,G]=C.dataset.dropitem.split("-").map(Number);an({dayIdx:M,pIdx:G}),Nt(null)}else Nt(null),an(null);Cr(!!O)}},c=y=>{var g;if(bs.current){if(hn.current){const w=y.changedTouches[0];document.body.style.overflow="",document.body.style.touchAction="",(g=nr.current)==null||g.call(nr,w.clientX,w.clientY)}bs.current=null,hn.current=!1,Gt(null),Tt(null),Nt(null),an(null),Cr(!1)}};return window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",c,{passive:!0}),window.addEventListener("touchcancel",c,{passive:!0}),()=>{window.removeEventListener("touchmove",u),window.removeEventListener("touchend",c),window.removeEventListener("touchcancel",c)}},[]),U.useEffect(()=>{if(!_s.current)return;Uo(_s.current.offsetHeight);const u=new ResizeObserver(c=>{Uo(c[0].contentRect.height)});return u.observe(_s.current),()=>u.disconnect()},[]),U.useEffect(()=>{ma("trip_region_hint",Ue)},[Ue]),U.useEffect(()=>{const u=[];if((H.days||[]).forEach((y,f)=>{(y.plan||[]).forEach((g,w)=>{g!=null&&g._timingConflict&&u.push(`${f}-${w}-${g.id}`)})}),u.length===0){Lr.current="";return}const c=u.join("|");c!==Lr.current&&(Lr.current=c,te("시간 충돌: 고정/잠금 조건으로 자동 계산이 불가한 구간이 있습니다."),window.alert(`시간 충돌이 발생했습니다.
소요시간 잠금 또는 시작시간 고정을 일부 해제해 주세요.`))},[H.days]),U.useEffect(()=>{ma("trip_start_date",je)},[je]),U.useEffect(()=>{ma("trip_end_date",xt)},[xt]),U.useEffect(()=>{let u=!1;return(async()=>{if(!(Re!=null&&Re.address)){Wn({});return}const y=await Yn(Re.address);if(!y||u)return;const f=await Promise.all((H.places||[]).map(async g=>{var C;const w=(g.address||((C=g.receipt)==null?void 0:C.address)||"").trim();if(!w)return[g.id,null];const _=await Yn(w);return _?[g.id,+x(y.lat,y.lon,_.lat,_.lon).toFixed(1)]:[g.id,null]}));u||Wn(Object.fromEntries(f))})(),()=>{u=!0}},[Re==null?void 0:Re.address,H.places]),U.useEffect(()=>{let y=!1;const f=()=>{const w=or.current;if(!w)return;const _=w.getBoundingClientRect().top;ar(C=>!C&&_<=0?!0:C&&_>=56?!1:C)},g=()=>{y||(y=!0,requestAnimationFrame(()=>{f(),y=!1}))};return g(),window.addEventListener("scroll",g,{passive:!0}),window.addEventListener("resize",g),()=>{window.removeEventListener("scroll",g),window.removeEventListener("resize",g)}},[]),U.useEffect(()=>{const u=()=>{window.innerWidth<768&&(sr(!0),Gn(!0))};return u(),window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]),U.useEffect(()=>{var c;if(!((c=H.days)!=null&&c.length))return;const u=[];return H.days.forEach(y=>{const f=document.getElementById(`day-marker-${y.day}`);if(!f)return;const g=new IntersectionObserver(([w])=>{w.isIntersecting&&!er.current&&Mo(y.day)},{rootMargin:"-30% 0px -60% 0px",threshold:0});g.observe(f),u.push(g)}),H.days.forEach(y=>{(y.plan||[]).filter(f=>f.type!=="backup").forEach((f,g)=>{const w=g===0?`day-marker-${y.day}`:f.id,_=document.getElementById(w);if(!_)return;const C=new IntersectionObserver(([O])=>{O.isIntersecting&&!er.current&&$r(f.id)},{rootMargin:"-5% 0px -85% 0px",threshold:0});C.observe(_),u.push(C)})}),()=>u.forEach(y=>y.disconnect())},[H.days]),U.useEffect(()=>{if(!Ut)return;const u=()=>ys(null),c=y=>{var g,w;const f=y.target;(g=f==null?void 0:f.closest)!=null&&g.call(f,'[data-plan-picker="true"]')||(w=f==null?void 0:f.closest)!=null&&w.call(f,'[data-plan-picker-trigger="true"]')||ys(null)};return document.addEventListener("pointerdown",c,!0),window.addEventListener("scroll",u,!0),window.addEventListener("resize",u),()=>{document.removeEventListener("pointerdown",c,!0),window.removeEventListener("scroll",u,!0),window.removeEventListener("resize",u)}},[Ut]);const mn=H.maxBudget||15e5,[Go,Gr]=U.useState(!1),[Xn,Kr]=U.useState(!1),Ko=U.useMemo(()=>(H.days||[]).reduce((u,c)=>u+((c==null?void 0:c.plan)||[]).filter(y=>y.type!=="backup").length,0),[H.days]),Jo=1700,Qo=13,Lt=1,nt=15,en=10,cr=1,gn=u=>{const c=Number(u==null?void 0:u.qty);return!Number.isFinite(c)||c<=0?1:c},i=u=>Number((u==null?void 0:u.price)||0)*gn(u),d=u=>{var f;if(typeof(u==null?void 0:u.revisit)=="boolean")return u.revisit;const c=Array.isArray((f=u==null?void 0:u.receipt)==null?void 0:f.items)?u.receipt.items.map(g=>(g==null?void 0:g.name)||"").join(" "):"",y=`${(u==null?void 0:u.memo)||""} ${c}`;return/재방문/i.test(y)},m=(u,c)=>{const y=String(u||"").match(/(\d+)/);if(!y)return c;const f=parseInt(y[1],10);return Number.isNaN(f)?c:f},x=(u,c,y,f)=>{const g=M=>M*(Math.PI/180),_=g(y-u),C=g(f-c),O=Math.sin(_/2)**2+Math.cos(g(u))*Math.cos(g(y))*Math.sin(C/2)**2;return 6371*(2*Math.atan2(Math.sqrt(O),Math.sqrt(1-O)))},D=({distanceKm:u,straightKm:c,rawDurationMins:y,isSameAddress:f})=>{const g=Math.max(0,Number(u)||0),w=Math.max(0,Number(c)||0),_=Math.max(1,Number(y)||1);if(f)return _;const C=Math.ceil(g/35*60),O=Math.ceil(w/45*60),M=g>=.25?2:1,G=g>=.25&&g<1.2?4:g<.25?2:0;return Math.max(_,C+M,O+M,G)},L=U.useRef({});U.useEffect(()=>{if(!(Re!=null&&Re.address)){Wn({});return}(async()=>{var c,y;try{te("내 장소 거리 계산 중...");const f=await Ss(Re.address);if(!(f!=null&&f.lat)||!(f!=null&&f.lon)){te("기준 일정의 좌표를 찾을 수 없습니다.");return}const g=parseFloat(f.lat),w=parseFloat(f.lon),_={},C=H.places||[];for(const O of C){if(!((c=O.receipt)!=null&&c.address)&&!O.address)continue;const M=((y=O.receipt)==null?void 0:y.address)||O.address;if(L.current[M]){const{lat:G,lon:se}=L.current[M];_[O.id]=+x(g,w,G,se).toFixed(1)}else{const G=await Ss(M);G!=null&&G.lat&&(G!=null&&G.lon)&&(L.current[M]={lat:parseFloat(G.lat),lon:parseFloat(G.lon)},_[O.id]=+x(g,w,parseFloat(G.lat),parseFloat(G.lon)).toFixed(1))}}Wn(_),te(`'${Re.name}' 기준으로 내 장소 거리를 업데이트했습니다.`)}catch(f){console.error(f)}})()},[Re==null?void 0:Re.id,Re==null?void 0:Re.address,H.places]);const Q=u=>{const c=Number(u);return!Number.isFinite(c)||c<=0?"미계산":`${c}km`},$e=(u=[])=>{const c=(Array.isArray(u)?u:[]).map(y=>String(y||"").trim().toLowerCase());return c.includes("rest")||c.includes("휴식")},Ye=(u=[])=>{const c=(Array.isArray(u)?u:[]).map(y=>String(y||"").trim().toLowerCase());return c.includes("lodge")&&!$e(c)},Ie=(u="",c="")=>{const y=`${String(u||"").trim()} ${String(c||"").trim()}`.trim();y&&window.open(`https://map.naver.com/v5/search/${encodeURIComponent(y)}`,"_blank","noopener,noreferrer")},mt=(u="",c="",y="",f="")=>{const g=`${String(u||"").trim()} ${String(c||"").trim()} ${String(y||"").trim()} ${String(f||"").trim()} 길찾기`.trim();g&&window.open(`https://map.naver.com/v5/search/${encodeURIComponent(g)}`,"_blank","noopener,noreferrer")},We=(u,c="from")=>{var y,f,g;return u?(y=u.types)!=null&&y.includes("ship")?c==="from"?(u.endAddress||u.endPoint||"").trim():(((f=u.receipt)==null?void 0:f.address)||u.startPoint||"").trim():(((g=u.receipt)==null?void 0:g.address)||u.address||"").trim():""},Yn=async u=>{const c=String(u||"").trim();if(!c)return null;if(L.current[c])return L.current[c];try{const f=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(c)}&format=json&limit=1`)).json();if(!Array.isArray(f)||f.length===0)return null;const g={lat:parseFloat(f[0].lat),lon:parseFloat(f[0].lon)};return L.current[c]=g,g}catch{return null}},Oe=u=>JSON.parse(JSON.stringify(u)),tn=(u={})=>{const c=u.receipt?Oe(u.receipt):{address:u.address||"",items:Oe(u.items||[])};return Array.isArray(c.items)||(c.items=[]),{activity:u.activity||u.name||"새로운 플랜",price:Number(u.price||0),memo:u.memo||"",revisit:typeof u.revisit=="boolean"?u.revisit:!1,business:Xe(u.business||{}),types:Array.isArray(u.types)&&u.types.length?Oe(u.types):["place"],duration:Number(u.duration||60),receipt:c}},ur=(u={})=>tn({activity:u.activity,price:u.price,memo:u.memo,revisit:typeof u.revisit=="boolean"?u.revisit:d(u),business:Xe(u.business||{}),types:u.types,duration:u.duration,receipt:u.receipt||{address:u.address||"",items:[]}}),sm=(u={})=>tn({activity:u.name,price:u.price,memo:u.memo,revisit:typeof u.revisit=="boolean"?u.revisit:!1,business:Xe(u.business||{}),types:u.types,duration:u.duration||60,receipt:u.receipt||{address:u.address||"",items:[]}}),uu=u=>Math.round(u/Qo*Jo),oe=u=>{if(!u||typeof u!="string")return 0;const c=u.split(":");if(c.length<2)return 0;const y=parseInt(c[0],10),f=parseInt(c[1],10);return y===24&&f===0?1440:(isNaN(y)?0:y)*60+(isNaN(f)?0:f)},St=u=>{if(typeof u!="number"||isNaN(u))return"00:00";let c=Math.floor(u/60);const y=u%60;return c>=24&&(c=c%24),c<0&&(c=24+c%24),`${String(c).padStart(2,"0")}:${String(y).padStart(2,"0")}`},du=u=>{if(!je)return null;const c=new Date(je);return Number.isNaN(c.getTime())?null:(c.setDate(c.getDate()+u),["sun","mon","tue","wed","thu","fri","sat"][c.getDay()])},hu=u=>{if(!je)return{primary:"날짜 미설정",secondary:""};const c=new Date(je);if(Number.isNaN(c.getTime()))return{primary:"날짜 미설정",secondary:""};c.setDate(c.getDate()+((u||1)-1));const y=c.getFullYear(),f=String(c.getMonth()+1).padStart(2,"0"),g=String(c.getDate()).padStart(2,"0"),w=["일","월","화","수","목","금","토"][c.getDay()];return{primary:`${y}.${f}.${g}`,secondary:`${w}요일`}},fu=(u,c)=>{var C;const y=Xe((u==null?void 0:u.business)||{});if(!(y.open||y.close||y.breakStart||y.breakEnd||y.lastOrder||y.entryClose||y.closedDays.length))return"";const g=oe((u==null?void 0:u.time)||"00:00"),w=g+((u==null?void 0:u.duration)||60);if(y.open&&g<oe(y.open))return`운영 시작 전 방문 (${y.open} 이후 권장)`;if(y.close&&g>=oe(y.close))return`운영 종료 후 방문 (${y.close} 이전 권장)`;if(y.lastOrder&&g>oe(y.lastOrder))return`라스트오더 이후 방문 (${y.lastOrder} 이전 권장)`;if(y.entryClose&&g>oe(y.entryClose))return`입장 마감 이후 방문 (${y.entryClose} 이전 권장)`;if(y.breakStart&&y.breakEnd){const O=oe(y.breakStart),M=oe(y.breakEnd);if(g<M&&w>O)return`브레이크 타임 겹침 (${y.breakStart}-${y.breakEnd})`}const _=du(c);return _&&y.closedDays.includes(_)?`${((C=ro.find(M=>M.value===_))==null?void 0:C.label)||_}요일 휴무일 방문`:""},rm=(u,c)=>{Ge();let y=!1;ie(f=>{var M,G,se;const g=JSON.parse(JSON.stringify(f)),w=(se=(G=(M=g.days)==null?void 0:M[u])==null?void 0:G.plan)==null?void 0:se[c];if(!w)return f;const _=Xe(w.business||{});if(!_.open)return f;const C=oe(w.time||"00:00"),O=oe(_.open);return C>=O?f:(w.time=_.open,w.isTimeFixed=!0,g.days[u].plan=qe(g.days[u].plan),Ui(g.days),y=!0,g)}),te(y?"운영 시작 시간으로 일정을 보정했습니다.":"보정할 운영 시작 전 경고가 없습니다.")},pu=(u,c,y)=>{var G,se;if(!(u!=null&&u.business))return"";const f=Xe(u.business||{});if(!(f.open||f.close||f.breakStart||f.breakEnd||f.lastOrder||f.entryClose||f.closedDays.length))return"";const w=(G=H.days)==null?void 0:G[c];if(!w)return"";const _=w.plan[y],C=w.plan[y+1],O=_?oe(_.time||"00:00")+(_.duration||60):C?oe(C.time||"00:00"):0,M=du(c);if(M&&f.closedDays.includes(M))return`${((se=ro.find(fe=>fe.value===M))==null?void 0:se.label)||M} 휴무`;if(f.open&&O<oe(f.open))return`영업 전 (${f.open}~)`;if(f.close&&O>=oe(f.close))return"영업 종료";if(f.lastOrder&&O>oe(f.lastOrder))return"라스트오더 이후";if(f.entryClose&&O>oe(f.entryClose))return"입장 마감 이후";if(f.breakStart&&f.breakEnd){const le=oe(f.breakStart),fe=oe(f.breakEnd);if(O>=le&&O<fe)return`브레이크 (${f.breakStart}~${f.breakEnd})`}return""},vl=()=>{var w,_,C,O;const u=["sun","mon","tue","wed","thu","fri","sat"];for(let M=0;M<(((w=H.days)==null?void 0:w.length)||0);M++){const se=(_=H.days[M].plan)==null?void 0:_.find(le=>le.id===Zs&&le.time);if(se){let le=u[new Date().getDay()];if(je){const fe=new Date(je);fe.setDate(fe.getDate()+M),le=u[fe.getDay()]}return{refMins:oe(se.time),todayKey:le,refTime:se.time}}}const c=(C=H.days)==null?void 0:C.find(M=>M.day===dn),y=(O=c==null?void 0:c.plan)==null?void 0:O.find(M=>M.type!=="backup"&&M.time);let f=u[new Date().getDay()];if(je&&c){const M=new Date(je);M.setDate(M.getDate()+(c.day-1)),f=u[M.getDay()]}return{refMins:y?oe(y.time):new Date().getHours()*60+new Date().getMinutes(),todayKey:f,refTime:(y==null?void 0:y.time)||null}},im=u=>{var w;const c=Xe(u||{});if(!(c.open||c.close||c.breakStart||c.breakEnd||c.lastOrder||c.entryClose||c.closedDays.length))return"";const{refMins:f,todayKey:g}=vl();if(c.closedDays.includes(g))return`${((w=ro.find(C=>C.value===g))==null?void 0:w.label)||g} 휴무일`;if(c.open&&f<oe(c.open))return`영업 전 (${c.open} 오픈)`;if(c.close&&f>=oe(c.close))return`영업 종료 (${c.close} 마감)`;if(c.lastOrder&&f>oe(c.lastOrder))return`라스트오더 이후 (${c.lastOrder})`;if(c.entryClose&&f>oe(c.entryClose))return`입장 마감 이후 (${c.entryClose})`;if(c.breakStart&&c.breakEnd){const _=oe(c.breakStart),C=oe(c.breakEnd);if(f>=_&&f<C)return`브레이크 타임 (${c.breakStart}~${c.breakEnd})`}return""},Xo=u=>{const c=Xe(u||{}),y=[];if((c.open||c.close)&&y.push(`영업 ${c.open||"--:--"}~${c.close||"--:--"}`),(c.breakStart||c.breakEnd)&&y.push(`브레이크 ${c.breakStart||"--:--"}~${c.breakEnd||"--:--"}`),c.lastOrder&&y.push(`라스트오더 ${c.lastOrder}`),c.entryClose&&y.push(`입장마감 ${c.entryClose}`),c.closedDays.length){const f=c.closedDays.map(g=>{var w;return((w=ro.find(_=>_.value===g))==null?void 0:w.label)||g}).join(",");y.push(`휴무 ${f}`)}return y.length?y.join(" · "):"미설정"},Ge=()=>{Hn(u=>{try{return[...u,JSON.parse(JSON.stringify(H))].slice(-20)}catch{return u}})},Jr=(u="변경 사항이 저장되었습니다.")=>{Or(u),Dr(!0),Vr.current&&clearTimeout(Vr.current),Vr.current=setTimeout(()=>Dr(!1),3e3)},om=()=>{if(qn.length===0){te("되돌릴 작업이 없습니다.");return}const u=qn[qn.length-1];Hn(c=>c.slice(0,-1)),ie(u),te("이전 상태로 복구했습니다.")},Ui=u=>{if(!Array.isArray(u))return u;for(let c=0;c<u.length-1;c++){const y=u[c];if(!(y!=null&&y.plan))continue;const f=y.plan.filter(fe=>fe.type!=="backup");if(!f.length)continue;const g=f[f.length-1];if(!Ye(g.types))continue;const w=u[c+1],_=((w==null?void 0:w.plan)||[]).filter(fe=>fe.type!=="backup");if(!_.length)continue;const C=_[0],O=oe(g.time||"00:00"),M=oe(C.time)-m(C.travelTimeOverride,nt)-m(C.bufferTimeOverride,en),G=M<=O?M+1440:M,se=Math.max(30,G-O),le=y.plan.find(fe=>fe.id===g.id);le&&(le.duration=se)}return u},am=u=>{if(!Array.isArray(u)||u.length===0)return!1;let c=!1;for(let y=0;y<u.length;y++){const f=u[y];if(!(f!=null&&f.plan)||f.plan.length===0)continue;let g=-1;if(f.plan.forEach((_,C)=>{(_==null?void 0:_.type)!=="backup"&&Ye(_==null?void 0:_.types)&&(g=C)}),g===-1||g>=f.plan.length-1)continue;const w=f.plan.splice(g+1);w.length&&(u[y+1]||u.splice(y+1,0,{day:y+2,plan:[]}),u[y+1].plan=[...w,...u[y+1].plan||[]],c=!0)}return c&&u.forEach((y,f)=>{y.day=f+1,Array.isArray(y.plan)||(y.plan=[])}),c},mu=u=>{if(!Array.isArray(u)||u.length===0)return!1;for(const c of u){if(!Array.isArray(c==null?void 0:c.plan)||c.plan.length===0)continue;let y=-1;if(c.plan.forEach((f,g)=>{(f==null?void 0:f.type)!=="backup"&&Ye(f==null?void 0:f.types)&&(y=g)}),y!==-1&&y<c.plan.length-1)return!0}return!1},qe=u=>{var f,g,w;if(!Array.isArray(u))return[];let c=0,y=-1;for(let _=0;_<u.length;_++){const C=u[_];if(!C||C.type==="backup")continue;if(y===-1){const _e=C.waitingTime||0;(f=C.types)!=null&&f.includes("ship")&&C.boardTime&&C.sailDuration!=null?c=oe(C.boardTime)+C.sailDuration:c=oe(C.time)+_e+(C.duration||0),y=_;continue}const O=m(C.travelTimeOverride,nt),M=m(C.bufferTimeOverride,en),G=C.waitingTime||0,se=c+O+M;if(C._timingConflict=!1,C._timingConflictReason="",C.isTimeFixed){const V=oe(C.time)-G-se;if(V!==0&&y!==-1){const Z=u[y];if(V>0){const Ve=m(C.bufferTimeOverride,en)+V;C.bufferTimeOverride=`${Ve}분`,C._isBufferCoordinated=!0,c+=V}else if(!((g=Z.types)!=null&&g.includes("ship"))&&!Z.isTimeFixed&&!Z.isDurationFixed){const be=Z.duration||0,Ve=Math.max(30,be+V);Z.duration=Ve;const Ke=Ve-be;c+=Ke}else C._timingConflict=!0,C._timingConflictReason="고정/잠금 조건으로 시간 보정 불가"}}else{const _e=se+G;C.time=St(_e)}const le=oe(C.time),fe=C.waitingTime||0;(w=C.types)!=null&&w.includes("ship")&&C.boardTime&&C.sailDuration!=null?c=oe(C.boardTime)+C.sailDuration:c=le+fe+(C.duration||0),y=_}return u};U.useEffect(()=>{mu(H==null?void 0:H.days)&&ie(u=>{if(!mu(u==null?void 0:u.days))return u;const c=JSON.parse(JSON.stringify(u));if(!Array.isArray(c.days))return u;for(;am(c.days););return c.days.forEach(y=>{y.plan=qe(y.plan||[])}),Ui(c.days),c})},[H==null?void 0:H.days]);const xl=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c],C=oe(_.time);return _.time=St(C+y),_.isTimeFixed=!0,g.days[u].plan=qe(w),Ui(g.days),g}),te("시작 시간을 조정했습니다.")},Yo=(u,c,y)=>{xl(u,c,y*60)},Zo=(u,c,y)=>{xl(u,c,y)},Qr=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c];return _.duration=Math.max(0,(_.duration||0)+y),g.days[u].plan=qe(w),g}),te("소요 시간을 변경했습니다.")},lm=(u,c,y)=>{const f=Math.max(0,Number(y)||0);Ge(),ie(g=>{const w=JSON.parse(JSON.stringify(g)),_=w.days[u].plan,C=_[c];return C.duration=f,w.days[u].plan=qe(_),w}),te(`소요 시간을 ${f}분으로 설정했습니다.`)},cm=(u,c)=>{Ge();let y=!1;ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c];return _.isDurationFixed=!_.isDurationFixed,y=!!_.isDurationFixed,g.days[u].plan=qe(w),g}),te(y?"소요시간 잠금이 켜졌습니다.":"소요시간 잠금이 해제되었습니다.")},_l=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c];let C=m(_.travelTimeOverride,nt);return C=Math.max(0,C+y),_.travelTimeOverride=`${C}분`,g.days[u].plan=qe(w),Ui(g.days),g}),te("이동 시간을 조정했습니다.")},Es=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c];let C=m(_.bufferTimeOverride,en);return C=Math.max(0,C+y),_.bufferTimeOverride=`${C}분`,_._isBufferCoordinated=!1,g.days[u].plan=qe(w),Ui(g.days),g}),te("버퍼 시간을 조정했습니다.")},gu=(u,c)=>{Ge(),ie(y=>{const f=JSON.parse(JSON.stringify(y)),g=f.days[u].plan[c].travelTimeAuto;return f.days[u].plan[c].travelTimeOverride=g||"15분",f.days[u].plan=qe(f.days[u].plan),f}),te("이동 시간을 기본값으로 초기화했습니다.")},um=(u,c)=>{let y="시작 시간 고정이 해제되었습니다.";Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan,_=w[c];return _.isTimeFixed=!_.isTimeFixed,_.isTimeFixed?(y="시작 시간이 고정되었습니다.",g.days[u].plan=qe(w)):(g.days[u].plan=qe(w),y="시작 시간 고정이 해제되었습니다."),g}),te(y)},ea=U.useMemo(()=>{let u=0;return!H||!H.days?{total:0,remaining:mn}:(H.days.forEach(c=>{var y;(y=c.plan)==null||y.forEach(f=>{f.type!=="backup"&&(u+=Number(f.price||0),f.distance&&(u+=uu(f.distance)))})}),{total:u,remaining:mn-u})},[H]),yu=U.useMemo(()=>{const u=[...H.places||[]];return Re!=null&&Re.id?u.sort((c,y)=>{const f=Bt[c.id],g=Bt[y.id];return f==null&&g==null?(c.name||"").localeCompare(y.name||"","ko"):f==null?1:g==null?-1:f-g}):u.sort((c,y)=>(c.name||"").localeCompare(y.name||"","ko"))},[H.places,Bt,Re==null?void 0:Re.id]);U.useMemo(()=>{const u=(g="")=>String(g).replace(/\s+/g," ").trim().toLowerCase(),c=new Set,y=new Set,f=new Set;return(H.days||[]).forEach(g=>{((g==null?void 0:g.plan)||[]).forEach(w=>{var O;if(!w||w.type==="backup")return;const _=u(w.activity||w.name||""),C=u(((O=w==null?void 0:w.receipt)==null?void 0:O.address)||(w==null?void 0:w.address)||"");_&&c.add(_),C&&y.add(C),(_||C)&&f.add(`${_}|${C}`)})}),{names:c,addresses:y,full:f}},[H.days]);const bu=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[u].plan[c].memo=y,g})},dm=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[u].plan[c].business=Xe(y||{}),g})},ta=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c];return w.receipt||(w.receipt={address:"",items:[]}),w.receipt.address=y,g})},na=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f));return g.days[u].plan[c].activity=y,g})},hm=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c];return w.types=is(y),g}),te("태그를 업데이트했습니다.")},Bi=(u,c,y,f,g)=>{Ge(),ie(w=>{var G;const _=JSON.parse(JSON.stringify(w)),C=_.days[u].plan[c],O=((G=C.receipt)==null?void 0:G.items)||[],M=O[y];return M&&(f==="toggle"?(M.selected=!M.selected,M.selected&&(M.qty||0)===0&&(M.qty=1)):f==="qty"?(M.qty=Math.max(0,(M.qty||0)+g),M.selected=M.qty>0):f==="name"?M.name=g:f==="price"&&(M.price=g===""?0:Number(g)),C.price=O.reduce((se,le)=>se+(le.selected?i(le):0),0)),_}),te("메뉴 정보가 저장되었습니다.")},fm=(u,c)=>{Ge(),ie(y=>{const f=JSON.parse(JSON.stringify(y)),g=f.days[u].plan[c];return g.receipt||(g.receipt={address:"",items:[]}),g.receipt.items||(g.receipt.items=[]),g.receipt.items.push({name:"새 메뉴",price:0,qty:1,selected:!0}),f})},pm=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c];return w.receipt&&w.receipt.items&&(w.receipt.items.splice(y,1),w.price=w.receipt.items.reduce((_,C)=>_+(C.selected?i(C):0),0)),g})},sa=(u,c,y,f)=>{ie(g=>{const w=JSON.parse(JSON.stringify(g));return w.days[u].plan[c][y]=f,w})},vu=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c],_=oe(w.time||"00:00"),C=oe(w.boardTime||St(_+60)),O=Math.max(_,C+y);w.boardTime=St(O);const M=w.sailDuration??240;return w.duration=O-_+M,g.days[u].plan=qe(g.days[u].plan),g})},xu=(u,c,y)=>{ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c],_=oe(w.time||"00:00"),C=oe(w.boardTime||St(_+60)),O=Math.max(30,(w.sailDuration??240)+y);return w.sailDuration=O,w.duration=C-_+O,g.days[u].plan=qe(g.days[u].plan),g})},mm=u=>{const c=u.replace(/\D/g,"").slice(0,4);if(!c)return null;let y,f;return c.length<=2?(y=parseInt(c),f=0):(y=parseInt(c.slice(0,c.length-2)),f=parseInt(c.slice(-2))),y=Math.min(23,Math.max(0,y)),f=Math.min(59,Math.max(0,f)),`${String(y).padStart(2,"0")}:${String(f).padStart(2,"0")}`},_u=(u,c,y,f)=>{if(y==="sail"){const w=Math.max(30,parseInt(f,10)||30);ie(_=>{const C=JSON.parse(JSON.stringify(_)),O=C.days[u].plan[c],M=oe(O.time||"00:00"),G=oe(O.boardTime||St(M+60));return O.sailDuration=w,O.duration=Math.max(0,G-M)+w,C.days[u].plan=qe(C.days[u].plan),C}),Mt(null);return}const g=mm(f);g&&(ie(w=>{const _=JSON.parse(JSON.stringify(w)),C=_.days[u].plan[c];if(y==="load")C.time=g,C.isTimeFixed=!0;else if(y==="depart"||y==="loadEnd"){C.boardTime=g;const O=oe(C.time||"00:00"),M=oe(g);C.duration=Math.max(0,M-O)+(C.sailDuration??240)}else if(y==="disembark"){const O=oe(C.boardTime||St(oe(C.time||"00:00")+60)),M=oe(g);C.sailDuration=Math.max(30,M-O);const G=oe(C.time||"00:00");C.duration=Math.max(0,O-G)+C.sailDuration}return _.days[u].plan=qe(_.days[u].plan),_}),Mt(null))},ra=(u,c,y)=>{const f=y!=null&&y.activity?tn(y):sm(y||{});Ge(),ie(g=>{const w=JSON.parse(JSON.stringify(g)),_=w.days[u].plan[c];return _.alternatives||(_.alternatives=[]),_.alternatives.push(f),w}),te(`'${f.activity}'이(가) 플랜 B로 추가되었습니다.`)},zi=(u,c,y)=>{const f=tn(H.days[u].plan[c].alternatives[y]);Ge(),ie(g=>{var _;const w=JSON.parse(JSON.stringify(g));return w.days[u].plan[c].alternatives.splice(y,1),w.places||(w.places=[]),w.places.push({id:`place_${Date.now()}`,name:f.activity,types:f.types||["place"],revisit:typeof f.revisit=="boolean"?f.revisit:!1,business:Xe(f.business||{}),address:((_=f.receipt)==null?void 0:_.address)||"",price:f.price||0,memo:f.memo||"",receipt:Oe(f.receipt||{address:"",items:[]})}),w}),te(`'${f.activity}'이(가) 장소 목록으로 이동되었습니다.`)},wl=(u,c,y,f,g)=>{Ge(),ie(w=>{var W,V,Z;const _=JSON.parse(JSON.stringify(w)),C=(V=(W=_.days[y])==null?void 0:W.plan)==null?void 0:V[f],O=(Z=C==null?void 0:C.alternatives)==null?void 0:Z[g];if(!O)return _;const M=tn(O);C.alternatives.splice(g,1);const G=_.days[u].plan,se=G[c];if(!se)return _;const le=oe(se.time)+(se.duration||0)+(se.waitingTime||0),fe=m(se.travelTimeOverride,nt),_e=m(se.bufferTimeOverride,en);return G.splice(c+1,0,{id:`item_${Date.now()}`,time:St(le+fe+_e),activity:M.activity,types:Oe(M.types||["place"]),revisit:typeof M.revisit=="boolean"?M.revisit:!1,business:Xe(M.business||{}),price:Number(M.price||0),duration:Number(M.duration||60),state:"unconfirmed",travelTimeOverride:`${nt}분`,bufferTimeOverride:`${en}분`,receipt:Oe(M.receipt||{address:"",items:[]}),memo:M.memo||""}),_.days[u].plan=qe(G),_}),te("플랜 B를 일정표에 추가했습니다."),jr(w=>[...w,{dayIdx:u,targetIdx:c+1}])},El=(u,c,y,f,g,w)=>{if(!g&&u===y&&c===f)return;Ge();let _=null;ie(C=>{var le,fe,_e;const O=JSON.parse(JSON.stringify(C)),M=(fe=(le=O.days[y])==null?void 0:le.plan)==null?void 0:fe[f];if(!M)return O;const G=((_e=M.alternatives)==null?void 0:_e.length)>0;let se;if(G&&w!==void 0&&!g){if(_=M.id,w===0){se=Oe(M),delete se.alternatives,se.id=`item_${Date.now()}`;const[W,...V]=M.alternatives;Object.assign(M,{activity:W.activity,price:W.price,memo:W.memo,revisit:W.revisit,business:W.business,types:W.types,duration:W.duration,receipt:W.receipt,alternatives:V})}else{const W=w-1,V=M.alternatives[W];se={id:`item_${Date.now()}`,time:M.time,duration:V.duration||M.duration,activity:V.activity,price:V.price,memo:V.memo,revisit:V.revisit,business:V.business,types:V.types,receipt:V.receipt,state:M.state,isTimeFixed:M.isTimeFixed},M.alternatives.splice(W,1)}O.days[y].plan=qe(O.days[y].plan)}else se=Oe(M),se.id=`item_${Date.now()}`,g||(O.days[y].plan.splice(f,1),O.days[y].plan=qe(O.days[y].plan),u===y&&c>f&&c--);return O.days[u].plan.splice(c+1,0,se),O.days[u].plan=qe(O.days[u].plan),O}),_&&Pi(C=>{const O={...C};return delete O[_],O}),te(g?"일정을 복사했습니다.":"일정을 이동했습니다.")},gm=(u,c,y)=>{Ge(),ie(f=>{const g=JSON.parse(JSON.stringify(f)),w=g.days[u].plan[c];if(!w.alternatives||!w.alternatives[y])return g;const _=tn(w.alternatives[y]),C=ur(w);return w.activity=_.activity,w.price=_.price,w.memo=_.memo,w.revisit=typeof _.revisit=="boolean"?_.revisit:!1,w.business=Xe(_.business||{}),w.types=Oe(_.types||["place"]),w.duration=w.duration||60,w.receipt=Oe(_.receipt||{address:"",items:[]}),w.alternatives[y]=C,g.days[u].plan=qe(g.days[u].plan),g}),jr(f=>[...f,{dayIdx:u,targetIdx:c},{dayIdx:u,targetIdx:c+1}]),te("플랜을 교체했습니다.")},ym=(u,c,y)=>{var _,C,O,M;const f=(O=(C=(_=H.days)==null?void 0:_[u])==null?void 0:C.plan)==null?void 0:O[c];if(!f)return;const g=(((M=f.alternatives)==null?void 0:M.length)||0)+1,w=Math.max(0,Math.min(g-1,Number(y)||0));if(ze(f.id),w===0){Pi(G=>({...G,[f.id]:0})),ys(null);return}gm(u,c,w-1),Pi(G=>({...G,[f.id]:w})),ys(null)},qi=(u,c)=>{Ge(),ie(y=>{const f=JSON.parse(JSON.stringify(y));return f.days[u].plan.splice(c,1),f.days[u].plan=qe(f.days[u].plan),f}),te("일정이 삭제되었습니다."),Jr("일정이 삭제되었습니다.")},wu=u=>{var c;if(Fr(y=>y===u?null:u),Mr!==u){let y=null;for(const f of H.days||[])if(y=(c=f.plan)==null?void 0:c.find(g=>g.id===u),y)break;if(y){const f=We(y,"to");f?(Vt({id:y.id,name:y.activity,address:f}),te(`'${y.activity}'을(를) 내 장소 거리 계산 기준으로 설정했습니다.`)):(Vt({id:y.id,name:y.activity,address:""}),te(`'${y.activity}'엔 주소 정보가 없어 거리를 계산할 수 없습니다.`))}}},Hi=u=>{const c="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0";switch(u){case"food":return a.jsxs("div",{className:`${c} text-rose-500 bg-red-50 border-red-100`,children:[a.jsx(tm,{size:10})," 식당"]},u);case"cafe":return a.jsxs("div",{className:`${c} text-amber-600 bg-amber-50 border-amber-100`,children:[a.jsx(Qp,{size:10})," 카페"]},u);case"tour":return a.jsxs("div",{className:`${c} text-purple-600 bg-purple-50 border-purple-100`,children:[a.jsx(Jp,{size:10})," 관광"]},u);case"lodge":return a.jsxs("div",{className:`${c} text-indigo-600 bg-indigo-50 border-indigo-100`,children:[a.jsx(hc,{size:10})," 숙소"]},u);case"rest":return a.jsxs("div",{className:`${c} text-cyan-600 bg-cyan-50 border-cyan-100`,children:[a.jsx(Zp,{size:10})," 휴식"]},u);case"ship":return a.jsxs("div",{className:`${c} text-blue-600 bg-blue-50 border-blue-100`,children:[a.jsx(lh,{size:10})," 선박"]},u);case"openrun":return a.jsxs("div",{className:`${c} text-red-500 bg-red-50 border-red-100`,children:[a.jsx(hh,{size:10})," 오픈런"]},u);case"view":return a.jsxs("div",{className:`${c} text-sky-600 bg-sky-50 border-sky-100`,children:[a.jsx(Xp,{size:10})," 뷰맛집"]},u);case"experience":return a.jsxs("div",{className:`${c} text-emerald-600 bg-emerald-50 border-emerald-100`,children:[a.jsx(em,{size:10})," 체험"]},u);case"souvenir":return a.jsxs("div",{className:`${c} text-teal-600 bg-teal-50 border-teal-100`,children:[a.jsx(Yp,{size:10})," 기념품샵"]},u);case"pickup":return a.jsxs("div",{className:`${c} text-orange-500 bg-orange-50 border-orange-100`,children:[a.jsx(so,{size:10})," 픽업"]},u);case"new":return a.jsx("span",{className:c+" text-emerald-600 bg-emerald-50 border-emerald-200",children:"신규"},"new");case"revisit":return a.jsx("span",{className:c+" text-blue-600 bg-blue-50 border-blue-200",children:"재방문"},"revisit");case"place":return a.jsxs("div",{className:`${c} text-slate-500 bg-slate-100 border-slate-200`,children:[a.jsx(Yr,{size:10})," 장소"]},u);default:return a.jsxs("div",{className:`${c} text-slate-500 bg-slate-100 border-slate-200`,children:["# ",u]},u)}},bm=u=>{if(!zn.trim())return;const{types:c=["place"],menus:y=[],address:f="",memo:g="",revisit:w=!1,business:_=nm}=u||{};ie(C=>({...C,places:[...C.places||[],{id:`place_${Date.now()}`,name:zn.trim(),types:is(c),revisit:!!w,business:Xe(_),address:f.trim(),price:y.reduce((O,M)=>O+(Number(M.price)||0),0),memo:g.trim(),receipt:{address:f.trim(),items:y.map(O=>({...O,qty:1,selected:!0}))}}]})),Ii(""),Do(["food"]),ht(!1),te(`'${zn.trim()}'이(가) 장소 목록에 추가되었습니다.`)},dr=u=>{Ge(),ie(c=>({...c,places:(c.places||[]).filter(y=>y.id!==u)})),Jr("내 장소가 삭제되었습니다.")},vm=(u,c)=>{ie(y=>({...y,places:(y.places||[]).map(f=>f.id===u?{...f,...c}:f)}))},Eu=(u,c)=>{var f,g,w;const y=(w=(g=(f=H.days)==null?void 0:f[u])==null?void 0:g.plan)==null?void 0:w[c];y&&(Ge(),ie(_=>{var O;const C=JSON.parse(JSON.stringify(_));return C.places||(C.places=[]),C.places.push({id:`place_${Date.now()}`,name:y.activity,types:y.types||["place"],revisit:typeof y.revisit=="boolean"?y.revisit:d(y),business:Xe(y.business||{}),address:((O=y.receipt)==null?void 0:O.address)||"",price:y.price||0,memo:y.memo||"",receipt:Oe(y.receipt||{items:[]})}),C}),te(`'${y.activity}' 일정을 내 장소로 복제했습니다.`))},Tu=(u,c,y)=>{var g,w,_,C,O;const f=tn((O=(C=(_=(w=(g=H.days)==null?void 0:g[u])==null?void 0:w.plan)==null?void 0:_[c])==null?void 0:C.alternatives)==null?void 0:O[y]);f&&(Ge(),ie(M=>{var se;const G=JSON.parse(JSON.stringify(M));return G.places||(G.places=[]),G.places.push({id:`place_${Date.now()}`,name:f.activity,types:f.types||["place"],revisit:typeof f.revisit=="boolean"?f.revisit:!1,business:Xe(f.business||{}),address:((se=f.receipt)==null?void 0:se.address)||"",price:f.price||0,memo:f.memo||"",receipt:Oe(f.receipt||{address:"",items:[]})}),G}),te(`'${f.activity}' 플랜 B를 내 장소로 복제했습니다.`))},Wi=(u,c)=>{var f,g,w;const y=(w=(g=(f=H.days)==null?void 0:f[u])==null?void 0:g.plan)==null?void 0:w[c];y&&(Ge(),ie(_=>{var O;const C=JSON.parse(JSON.stringify(_));return C.days[u].plan.splice(c,1),C.days[u].plan=qe(C.days[u].plan),C.places||(C.places=[]),C.places.push({id:`place_${Date.now()}`,name:y.activity,types:y.types||["place"],revisit:typeof y.revisit=="boolean"?y.revisit:d(y),business:Xe(y.business||{}),address:((O=y.receipt)==null?void 0:O.address)||"",price:y.price||0,memo:y.memo||"",receipt:Oe(y.receipt||{address:"",items:[]})}),C}),te(`'${y.activity}' 일정이 내 장소로 이동되었습니다.`))},Iu=(u=0,c=null)=>{Ge(),ie(y=>{const f=JSON.parse(JSON.stringify(y));(!Array.isArray(f.days)||f.days.length===0)&&(f.days=[{day:1,plan:[]}]),f.days[u]||(f.days[u]={day:u+1,plan:[]}),Array.isArray(f.days[u].plan)||(f.days[u].plan=[]);const g=c!=null&&c.receipt?Oe(c.receipt):{address:(c==null?void 0:c.address)||"",items:[]},w=Array.isArray(g.items)?g.items.reduce((_,C)=>_+(C.selected===!1?0:i(C)),0):0;return f.days[u].plan.push({id:`item_${Date.now()}`,time:"09:00",activity:(c==null?void 0:c.name)||"새 일정",types:(c==null?void 0:c.types)||["place"],revisit:typeof(c==null?void 0:c.revisit)=="boolean"?c.revisit:!1,business:Xe((c==null?void 0:c.business)||{}),price:c&&(w||c.price)||0,duration:60,state:"unconfirmed",travelTimeOverride:"15분",bufferTimeOverride:"10분",receipt:g,memo:(c==null?void 0:c.memo)||""}),f.days[u].plan=qe(f.days[u].plan),f}),te(c?`'${c.name}'이(가) 첫 일정으로 추가되었습니다.`:"첫 일정이 추가되었습니다.")},Tl=(u,c,y=["place"],f=null)=>{Ge(),ie(g=>{var W;const w=JSON.parse(JSON.stringify(g)),_=w.days[u].plan,C=_[c],O=oe(C.time)+(C.duration||0)+(C.waitingTime||0),M=m(C.travelTimeOverride,nt),G=m(C.bufferTimeOverride,en),se=St(O+M+G),le=((W=y1.find(V=>{var Z;return V.types[0]===(((Z=f==null?void 0:f.types)==null?void 0:Z[0])||y[0])}))==null?void 0:W.label)||"장소",fe=f!=null&&f.receipt?Oe(f.receipt):{address:(f==null?void 0:f.address)||"주소 미정",items:[]},_e=Array.isArray(fe.items)?fe.items.reduce((V,Z)=>V+(Z.selected===!1?0:i(Z)),0):0;return _.splice(c+1,0,{id:`item_${Date.now()}`,time:se,activity:(f==null?void 0:f.name)||`새 ${le}`,types:(f==null?void 0:f.types)||y,revisit:typeof(f==null?void 0:f.revisit)=="boolean"?f.revisit:!1,business:Xe((f==null?void 0:f.business)||{}),price:f&&(_e||f.price)||0,duration:60,state:"unconfirmed",travelTimeOverride:"15분",bufferTimeOverride:"10분",receipt:fe,memo:(f==null?void 0:f.memo)||""}),w.days[u].plan=qe(_),w}),te(f?`'${f.name}'이(가) 일정에 추가되었습니다.`:"새 일정이 추가되었습니다."),jr(g=>[...g,{dayIdx:u,targetIdx:c+1}])},xm=async({fromAddress:u,toAddress:c,fromName:y,toName:f})=>{const g=await fetch("/api/route-verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromAddress:u,toAddress:c,fromName:y,toName:f,region:Ue})});if(!g.ok){const _=await g.text().catch(()=>"");throw new Error(`kakao verify failed: ${g.status} ${_.slice(0,140)}`)}const w=await g.json();if(!Number.isFinite(Number(w==null?void 0:w.distanceKm))||!Number.isFinite(Number(w==null?void 0:w.durationMins)))throw new Error("kakao verify invalid payload");return{distance:+Number(w.distanceKm).toFixed(1),durationMins:Math.max(1,Math.round(Number(w.durationMins))),provider:w.provider||"kakao",review:w.review||null}},Gi=async(u,c,y={})=>{const f=!!y.silent,g=!!y.forceRefresh;let w;if(c===0&&u>0){const G=H.days[u-1].plan;w=G[G.length-1]}else w=H.days[u].plan[c-1];const _=H.days[u].plan[c],C=We(w,"from"),O=We(_,"to");if(!C||!O||C.includes("없음")||O.includes("없음")){f||te("두 장소의 올바른 주소가 필요합니다.");return}const M=`${C}|${O}`;if(!g&&Ur[M]&&!Ur[M].failed){const G=Ur[M],se=Math.max(.1,Number(G.distance)||.1),le=D({distanceKm:se,straightKm:se,rawDurationMins:Number(G.durationMins)||1,isSameAddress:C.trim()===O.trim()}),fe={distance:se,durationMins:le};fe.durationMins!==G.durationMins&&xs(_e=>({..._e,[M]:fe})),Il(u,c,fe);return}Kn(`${u}_${c}`),f||te("경로와 거리를 자동 계산 중입니다...");try{try{const W=await xm({fromAddress:C,toAddress:O,fromName:(w==null?void 0:w.activity)||"",toName:(_==null?void 0:_.activity)||""});xs(V=>({...V,[M]:W})),Il(u,c,W),f||te(`카카오 검수 경로: ${W.distance}km, ${W.durationMins}분`);return}catch{f||te("카카오 검수 경로 실패, 대체 경로로 재시도합니다.")}const G=async(W,V="")=>{const Z=[String(W||"").trim(),String(W||"").split(/[,\(]/)[0].trim(),String(W||"").replace(/제주특별자치도/g,"제주").trim(),String(W||"").replace(/특별자치도/g,"").trim(),`${Ue} ${String(V||"").trim()}`.trim(),String(V||"").trim()].filter(Boolean);for(const be of Z){const Ve=be.split(/\s+/).slice(0,8).join(" "),_t=await(await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(Ve)}&format=json&limit=1`)).json();if(_t&&_t.length>0)return{lat:_t[0].lat,lon:_t[0].lon}}return null},se=await G(C,w==null?void 0:w.activity);if(!se)throw new Error("출발지 좌표를 찾지 못했습니다.");await new Promise(W=>setTimeout(W,1e3));const le=await G(O,_==null?void 0:_.activity);if(!le)throw new Error("도착지 좌표를 찾지 못했습니다.");const _e=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${se.lon},${se.lat};${le.lon},${le.lat}?overview=false`)).json();if(_e&&_e.routes&&_e.routes.length>0){const W=_e.routes[0].distance/1e3,V=Math.ceil(_e.routes[0].duration/60),Z=x(parseFloat(se.lat),parseFloat(se.lon),parseFloat(le.lat),parseFloat(le.lon)),be=C.trim()===O.trim();if(!be&&W<.05&&Z>.3)throw new Error("osrm suspicious near-zero route");const Ke=W,_t=D({distanceKm:Ke,straightKm:Z,rawDurationMins:V,isSameAddress:be}),Ct={distance:+Ke.toFixed(1),durationMins:_t};xs(Qt=>({...Qt,[M]:Ct})),Il(u,c,Ct),f||te(`대체경로 확인: ${Ct.distance}km, ${Ct.durationMins}분`)}else throw new Error("osrm route unavailable")}catch(G){console.error(G),xs(se=>({...se,[M]:{failed:!0}})),f||te("자동차 경로 계산 실패: 주소 확인 후 다시 시도해주세요.")}finally{Kn(null)}};U.useEffect(()=>{if(!Si.length)return;const u=Si[0];jr(y=>y.slice(1)),(async()=>{var f,g,w;await Gi(u.dayIdx,u.targetIdx,{silent:!0}),!!((w=(g=(f=H.days)==null?void 0:f[u.dayIdx])==null?void 0:g.plan)!=null&&w[u.targetIdx+1])&&await Gi(u.dayIdx,u.targetIdx+1,{silent:!0})})()},[H,Si]);const _m=async()=>{var c;Ri(!0),Zt(0),xs({}),te("전체 경로 내역을 지우고 재탐색 시작...");const u=[];for(let y=0;y<H.days.length;y++){const f=H.days[y].plan||[];for(let g=0;g<f.length;g++)f[g].type==="backup"||(c=f[g].types)!=null&&c.includes("ship")||u.push({dayIdx:y,pIdx:g})}if(u.length===0){Ri(!1),te("재탐색할 경로가 없습니다.");return}for(let y=0;y<u.length;y++){const f=u[y];await Gi(f.dayIdx,f.pIdx,{forceRefresh:!0}),Zt(Math.round((y+1)/u.length*100)),await new Promise(g=>setTimeout(g,350))}Zt(100),Ri(!1),te("전체 경로 재탐색 완료!")},Il=(u,c,{distance:y,durationMins:f})=>{Ge(),ie(g=>{const w=JSON.parse(JSON.stringify(g)),_=w.days[u].plan[c];return _.distance=y,_.travelTimeOverride=`${f}분`,_.travelTimeAuto=`${f}분`,w.days[u].plan=qe(w.days[u].plan),w})};if(U.useEffect(()=>{if(!n||b||!H||!H.days||H.days.length===0||Le)return;if(n.isGuest){ma("guest_itinerary",JSON.stringify(H));return}const u=setTimeout(()=>{const c={...H,tripRegion:Ue,tripStartDate:je,tripEndDate:xt,planTitle:H.planTitle||`${Ue||"여행"} 일정`,planCode:H.planCode||fn(Ue||"여행",je||""),share:Sn(H.share||ot),updatedAt:Date.now()};Xi(es(Pn,"users",n.uid,"itinerary",F||"main"),c).catch(y=>console.error("Firestore 저장 실패:",y))},1e3);return()=>clearTimeout(u)},[H,b,n,F,Ue,je,xt,Le,ot]),U.useEffect(()=>{n&&(async()=>{if(v(!0),Wt(!1),n.isGuest)try{const y=pa("guest_itinerary",""),f=y?JSON.parse(y):null;if(f&&Array.isArray(f.days)){ie(f),v(!1);return}}catch(y){console.warn("게스트 로컬 데이터 로드 실패:",y)}try{if(De!=null&&De.ownerId&&De.ownerId!==n.uid){const w=await da(es(Pn,"users",De.ownerId,"itinerary",De.planId||"main"));if(w.exists()){const _=w.data(),C=Sn(_.share||{});if(C.visibility==="private"){te("공유가 비공개라 접근할 수 없습니다."),v(!1);return}const O=(_.days||[]).map(M=>({...M,plan:(M.plan||[]).map(G=>({...G}))}));ie({days:O,places:_.places||[],maxBudget:_.maxBudget||15e5,share:C,planTitle:_.planTitle||`${_.tripRegion||"공유"} 일정`,planCode:_.planCode||fn(_.tripRegion||"공유",_.tripStartDate||"")}),tt(C),_.tripRegion&&Xs(_.tripRegion),typeof _.tripStartDate=="string"&&fs(_.tripStartDate),typeof _.tripEndDate=="string"&&un(_.tripEndDate),B(De.planId||"main"),Wt(C.permission!=="editor"),v(!1);return}}const y=F||"main",f=await da(es(Pn,"users",n.uid,"itinerary",y));let g=null;if(f.exists())g=f.data();else if(y==="main"){const w=await da(es(Pn,"itinerary","main"));w.exists()&&(g=w.data(),await Xi(es(Pn,"users",n.uid,"itinerary","main"),g),console.log("기존 데이터를 내 계정으로 성공적으로 가져왔습니다."))}else g=$i(st||Ue||"새 여행지"),await Xi(es(Pn,"users",n.uid,"itinerary",y),g);if(g&&Array.isArray(g.days)){const w=g.days.map(_=>({..._,plan:(_.plan||[]).map(C=>{var M,G;let O={...C};if((M=O.types)!=null&&M.includes("ship")){const se=_.day===1?"목포항":"제주항",le=_.day===1?"제주항":"목포항";O.startPoint=O.startPoint||se,O.endPoint=O.endPoint||le}return(G=O.receipt)!=null&&G.items&&(O.price=O.receipt.items.reduce((se,le)=>se+(le.selected?i(le):0),0)),O})}));ie({days:w,places:g.places||[],maxBudget:g.maxBudget||15e5,share:Sn(g.share||{}),planTitle:g.planTitle||`${g.tripRegion||Ue||"여행"} 일정`,planCode:g.planCode||fn(g.tripRegion||Ue||"여행",g.tripStartDate||"")}),tt(Sn(g.share||{})),g.tripRegion&&Xs(g.tripRegion),typeof g.tripStartDate=="string"&&fs(g.tripStartDate),typeof g.tripEndDate=="string"&&un(g.tripEndDate),n.isGuest||await pn(n.uid),v(!1);return}}catch(y){console.error("Firestore 로드/마이그레이션 실패:",y)}const c={days:[{day:1,plan:[{id:"d1_s1",time:"01:00",activity:"퀸 제누비아 2호",types:["ship"],startPoint:"목포항",endPoint:"제주항",price:31e4,duration:300,state:"confirmed",isTimeFixed:!0,receipt:{address:"전남 목포시 해안로 148",shipDetails:{depart:"01:00",loading:"22:30 ~ 00:00"},items:[{name:"차량 선적",price:16e4,qty:1,selected:!0},{name:"주니어룸 (3인)",price:15e4,qty:1,selected:!0}]}},{id:"d1_p1",time:"06:30",activity:"진아떡집",types:["food","pickup"],price:24e3,duration:15,state:"confirmed",distance:2,travelTimeOverride:"5분",receipt:{address:"제주 제주시 동문로4길 7-1",items:[{name:"오메기떡 8알팩",price:12e3,qty:2,selected:!0}]},memo:"오메기떡 픽업 필수!"},{id:"d1_c1",time:"06:50",activity:"카페 듀포레",types:["cafe","view"],price:38500,duration:145,state:"confirmed",distance:8,receipt:{address:"제주시 서해안로 579",items:[{name:"아메리카노",price:6500,qty:2,selected:!0},{name:"비행기 팡도르",price:12500,qty:1,selected:!0},{name:"크로와상",price:13e3,qty:1,selected:!0}]},memo:"비행기 이착륙 뷰 맛집"},{id:"d1_f1",time:"09:30",activity:"말고기연구소",types:["food","openrun"],price:36e3,duration:60,state:"confirmed",distance:3,isTimeFixed:!0,receipt:{address:"제주시 북성로 43",items:[{name:"말육회 부각초밥",price:12e3,qty:3,selected:!0}]},memo:"10:00 영업 시작"},{id:"d1_c2",time:"12:30",activity:"만다리노카페 & 승마",types:["cafe","experience"],price:26e3,duration:120,state:"confirmed",distance:18,receipt:{address:"조천읍 함와로 585",items:[{name:"만다리노 라떼",price:8e3,qty:2,selected:!0},{name:"승마 체험",price:1e4,qty:1,selected:!0},{name:"귤 따기 체험",price:1e4,qty:1,selected:!1}]},memo:"승마 및 귤 체험 가능"},{id:"d1_t1",time:"15:00",activity:"함덕잠수함",types:["tour"],price:79e3,duration:90,state:"confirmed",distance:10,receipt:{address:"조천읍 조함해안로 378",items:[{name:"입장권",price:28e3,qty:2,selected:!0}]},memo:"사전 예약 확인 필요"},{id:"d1_f2",time:"18:30",activity:"존맛식당",types:["food"],price:69e3,duration:90,state:"confirmed",distance:2,receipt:{address:"제주시 조천읍 신북로 493",items:[{name:"문어철판볶음",price:39e3,qty:1,selected:!0}]},memo:"저녁 웨이팅 있을 수 있음"}]},{day:2,plan:[{id:"d2_c1",time:"09:00",activity:"델문도",types:["cafe","view"],price:42500,duration:60,state:"confirmed",distance:2,receipt:{address:"함덕 조함해안로 519-10",items:[{name:"문도샌드",price:12e3,qty:1,selected:!0}]}},{id:"d2_f1",time:"11:00",activity:"존맛식당",types:["food"],price:69e3,duration:90,state:"confirmed",distance:1,receipt:{address:"조천읍 신북로 493",items:[{name:"재방문",price:69e3,qty:1,selected:!0}]}},{id:"d2_l1",time:"20:00",activity:"통나무파크",types:["lodge"],price:1e5,duration:600,state:"confirmed",distance:45,receipt:{address:"애월읍 도치돌길 303",items:[{name:"숙박비",price:1e5,qty:1,selected:!0}]}}]},{day:3,plan:[{id:"d3_t1",time:"09:00",activity:"도치돌알파카",types:["tour","experience"],price:21e3,duration:120,state:"confirmed",distance:0,travelTimeOverride:"30분",receipt:{address:"애월읍 도치돌길 303",items:[{name:"입장권",price:7e3,qty:3,selected:!0}]}},{id:"d3_s1",time:"15:15",activity:"퀸 제누비아 2호",types:["ship"],startPoint:"제주항",endPoint:"목포항",price:26e4,duration:300,state:"confirmed",distance:25,isTimeFixed:!0,receipt:{address:"제주항",shipDetails:{depart:"16:45",loading:"14:45 ~ 15:45"},items:[{name:"차량 선적",price:16e4,qty:1,selected:!0},{name:"이코노미 인원권",price:1e5,qty:1,selected:!0}]},memo:"동승자 하차 후 차량 선적 (셔틀 이동) / 16:45 출항"}]}]}.days.map(y=>({...y,plan:qe(y.plan)}));ie({days:c,places:[]}),n.isGuest||await pn(n.uid),v(!1)})()},[n,F,pn,De]),t)return a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center gap-4",children:[a.jsx("div",{className:"w-12 h-12 border-4 border-[#3182F6]/20 border-t-[#3182F6] rounded-full animate-spin"}),a.jsx("div",{className:"font-black text-slate-400 text-sm animate-pulse",children:"본인 인증 확인 중..."})]});if(!n&&!(De!=null&&De.ownerId))return a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden",children:[a.jsx("div",{className:"absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse"}),a.jsx("div",{className:"absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse",style:{animationDelay:"1s"}}),a.jsxs("div",{className:"bg-white/80 backdrop-blur-2xl border border-white p-12 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] max-w-[480px] w-full text-center flex flex-col gap-8 z-10",children:[a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsx("div",{className:"w-16 h-16 bg-gradient-to-br from-[#3182F6] to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 mb-2 transform hover:scale-110 transition-transform",children:a.jsx(ch,{size:32,className:"text-white fill-white/20"})}),a.jsxs("h1",{className:"text-[32px] font-black tracking-tight text-slate-800 leading-tight",children:["나만의 여행 계획",a.jsx("br",{}),a.jsx("span",{className:"text-[#3182F6]",children:"Anti Planer"})]}),a.jsxs("p",{className:"text-slate-500 font-bold text-[15px] leading-relaxed",children:["복잡한 여행 계획은 잊으세요.",a.jsx("br",{}),"당신에게 최적화된 동선을 만들어 드립니다."]})]}),a.jsxs("div",{className:"flex flex-col gap-3",children:[a.jsxs("button",{onClick:l,className:"group relative flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-[#3182F6] hover:bg-blue-50/50 px-8 py-4.5 rounded-[24px] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-95",children:[a.jsx("img",{src:"https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",alt:"Google",className:"w-6 h-6"}),a.jsx("span",{className:"text-[17px] font-black text-slate-700 group-hover:text-[#3182F6]",children:"Google 계정으로 시작하기"})]}),a.jsxs("div",{className:"flex items-center gap-3 py-2",children:[a.jsx("div",{className:"flex-1 h-px bg-slate-100"}),a.jsx("span",{className:"text-[10px] font-black text-slate-300 uppercase tracking-widest",children:"or"}),a.jsx("div",{className:"flex-1 h-px bg-slate-100"})]}),a.jsx("button",{onClick:h,className:"text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors py-2",children:"로그인 없이 일단 둘러보기 (로컬 전용)"})]}),a.jsx("p",{className:"text-[12px] font-bold text-slate-400 tracking-wide",children:"로그인 시 개인별 맞춤 일정을 저장하고 불러올 수 있습니다."}),r&&a.jsx("div",{className:"text-left text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2 whitespace-pre-wrap",children:r})]})]});if(!H)return null;const kl=!!n&&!n.isGuest&&(!(De!=null&&De.ownerId)||De.ownerId===n.uid)&&!Le;return nr.current=(u,c)=>{var G,se,le,fe,_e,W;const y=bs.current;if(!y)return;let f=!1;const g=document.elementFromPoint(u,c),w=g==null?void 0:g.closest("[data-droptarget]"),_=g==null?void 0:g.closest("[data-dropitem]"),C=g==null?void 0:g.closest("[data-library-dropzone]"),O=g==null?void 0:g.closest("[data-deletezone]"),M=g==null?void 0:g.closest("[data-drag-action]");if(y.kind==="library"){const V=y.place;if(w){const[Z,be]=w.dataset.droptarget.split("-").map(Number);Tl(Z,be,V.types,V),dr(V.id),f=!0}else if(_){const[Z,be]=_.dataset.dropitem.split("-").map(Number);ra(Z,be,V),dr(V.id),f=!0}}else if(y.kind==="timeline"){const V=y.payload;if(M){const Z=M.getAttribute("data-drag-action");Z==="move_to_library"?(V.altIdx!==void 0?zi(V.dayIdx,V.pIdx,V.altIdx):Wi(V.dayIdx,V.pIdx),f=!0):Z==="delete"?V.altIdx===void 0&&(qi(V.dayIdx,V.pIdx),f=!0):Z==="copy_to_library"&&(V.altIdx!==void 0?Tu(V.dayIdx,V.pIdx,V.altIdx):Eu(V.dayIdx,V.pIdx),f=!0)}else if(C)if(V.altIdx!==void 0)zi(V.dayIdx,V.pIdx,V.altIdx),f=!0;else{const Z=(le=(se=(G=H.days)==null?void 0:G[V.dayIdx])==null?void 0:se.plan)==null?void 0:le[V.pIdx];Wi(V.dayIdx,V.pIdx,askPlanBMoveMode(Z)),f=!0}else if(O&&V.altIdx===void 0)qi(V.dayIdx,V.pIdx),f=!0;else if(w){const[Z,be]=w.dataset.droptarget.split("-").map(Number);V.altIdx!==void 0?(wl(Z,be,V.dayIdx,V.pIdx,V.altIdx),f=!0):(El(Z,be,V.dayIdx,V.pIdx,!1,V.planPos),f=!0)}else if(_&&V.altIdx===void 0){const[Z,be]=_.dataset.dropitem.split("-").map(Number),Ve=(W=(_e=(fe=H.days)==null?void 0:fe[V.dayIdx])==null?void 0:_e.plan)==null?void 0:W[V.pIdx];Ve&&(V.dayIdx!==Z||V.pIdx!==be)&&(ra(Z,be,ur(Ve)),qi(V.dayIdx,V.pIdx),f=!0)}}f&&Jr()},a.jsxs("div",{className:"min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans flex overflow-x-hidden font-bold flex-row relative",children:[hs&&ft&&a.jsxs("div",{className:"fixed inset-0 z-[200] flex items-center justify-center",onClick:()=>{Tn(null),He(null)},children:[a.jsx("div",{className:"absolute inset-0 bg-black/30 backdrop-blur-sm"}),a.jsxs("div",{className:"relative bg-white rounded-2xl shadow-2xl w-[440px] max-h-[85vh] overflow-y-auto no-scrollbar",onClick:u=>u.stopPropagation(),children:[a.jsxs("div",{className:"px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10",children:[a.jsx("p",{className:"text-[12px] font-black text-slate-600",children:"장소 수정"}),a.jsx("button",{onClick:()=>{Tn(null),He(null)},className:"text-slate-300 hover:text-slate-500 p-1",children:"✕"})]}),a.jsxs("div",{className:"p-4 flex flex-col gap-3",children:[a.jsx(mc,{title:"태그",value:ft.types||["place"],onChange:u=>He(c=>({...c,types:u}))}),a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-[#3182F6]/50 focus-within:bg-white transition-all",children:[a.jsx("input",{value:ft.name,onChange:u=>He(c=>({...c,name:u.target.value})),placeholder:"장소 이름",className:"flex-1 bg-transparent text-[11px] font-bold text-slate-600 outline-none focus:outline-none"}),a.jsx("button",{type:"button",onClick:async()=>{try{const u=await navigator.clipboard.readText(),c=jn(u);c&&He(y=>{var f;return{...y,name:c.name||y.name,address:c.address||y.address,business:c.business||y.business,receipt:{...y.receipt||{},items:c.menus.length?c.menus:((f=y.receipt)==null?void 0:f.items)||[]}}})}catch{}},className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",title:"스마트 전체 붙여넣기",children:a.jsx(js,{size:9})})]}),a.jsxs("div",{className:"flex gap-1.5 -mt-1 mb-0.5",children:[a.jsx("button",{type:"button",onClick:async()=>{try{const u=await navigator.clipboard.readText(),c=jn(u);c!=null&&c.business&&He(y=>({...y,business:c.business}))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all",children:"🕒 영업정보만 입력"}),a.jsx("button",{type:"button",onClick:async()=>{var u;try{const c=await navigator.clipboard.readText(),y=jn(c);(u=y==null?void 0:y.menus)!=null&&u.length&&He(f=>({...f,receipt:{...f.receipt||{},items:y.menus}}))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] hover:border-blue-200 transition-all",children:"📋 메뉴만 입력"})]}),a.jsx("input",{value:ft.address||"",onChange:u=>He(c=>({...c,address:u.target.value})),placeholder:"주소",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 outline-none focus:border-[#3182F6]"}),a.jsx("input",{value:ft.memo||"",onChange:u=>He(c=>({...c,memo:u.target.value})),placeholder:"메모",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-[#3182F6]"}),a.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3",children:[a.jsx("p",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2",children:"메뉴 / 금액"}),(((ku=ft.receipt)==null?void 0:ku.items)||[]).map((u,c)=>a.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5",children:[a.jsx("input",{value:u.name||"",onChange:y=>He(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[c]={...g[c],name:y.target.value},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"메뉴명",className:"flex-1 min-w-0 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6]"}),a.jsx("input",{type:"number",value:u.price||0,onChange:y=>He(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[c]={...g[c],price:Number(y.target.value)||0},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"가격",className:"w-20 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("input",{type:"number",value:gn(u),onChange:y=>He(f=>{var w;const g=[...((w=f.receipt)==null?void 0:w.items)||[]];return g[c]={...g[c],qty:Math.max(1,Number(y.target.value)||1)},{...f,receipt:{...f.receipt||{},items:g}}}),placeholder:"수량",className:"w-12 text-[11px] font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-[#3182F6] [appearance:textfield]"}),a.jsx("button",{type:"button",onClick:()=>He(y=>{var g;const f=[...((g=y.receipt)==null?void 0:g.items)||[]];return f.splice(c,1),{...y,receipt:{...y.receipt||{},items:f}}}),className:"text-slate-300 hover:text-red-500 px-1",children:"✕"})]},c)),a.jsx("button",{type:"button",onClick:()=>He(u=>{var c;return{...u,receipt:{...u.receipt||{},items:[...((c=u.receipt)==null?void 0:c.items)||[],{name:"",price:0,qty:1,selected:!0}]}}}),className:"w-full py-1.5 border border-dashed border-slate-300 rounded text-[11px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white mt-1",children:"+ 메뉴 추가"})]}),a.jsxs("div",{className:"bg-slate-50 border border-slate-200 rounded-lg p-3",children:[a.jsxs("button",{type:"button",onClick:()=>He(u=>({...u,showBusinessEditor:!u.showBusinessEditor})),className:"w-full flex items-center justify-between text-left mb-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-slate-400 uppercase tracking-wider",children:"영업 정보"}),!ft.showBusinessEditor&&a.jsx("span",{className:"text-[10px] font-bold text-slate-500 truncate ml-2",children:Xo(ft.business)})]}),ft.showBusinessEditor&&a.jsx("div",{className:"mt-2",children:a.jsx(gc,{business:ft.business||{},onChange:u=>He(c=>({...c,business:u}))})})]})]}),a.jsxs("div",{className:"px-4 pb-4 flex gap-2 sticky bottom-0 bg-white pt-2 border-t border-slate-100",children:[a.jsx("button",{onClick:()=>{const u=Oe(ft.receipt||{address:ft.address||"",items:[]});Array.isArray(u.items)||(u.items=[]),u.address=ft.address||u.address||"";const c=u.items.reduce((y,f)=>y+(f.selected===!1?0:i(f)),0);vm(ft.id,{...ft,business:Xe(ft.business||{}),receipt:u,price:c}),Tn(null),He(null)},className:"flex-1 py-2 bg-[#3182F6] text-white text-[12px] font-black rounded-xl",children:"저장"}),a.jsx("button",{onClick:()=>{Tn(null),He(null)},className:"flex-1 py-2 bg-slate-100 text-slate-500 text-[12px] font-black rounded-xl",children:"취소"})]})]})]}),a.jsx("div",{className:"fixed z-[141] top-1/2 transition-all duration-300",style:{left:at?Xt?12:Math.max(8,Nn-6):Nn,transform:at?"translateY(-50%)":"translateX(-50%) translateY(-50%)"},children:a.jsx("button",{onClick:()=>sr(u=>!u),className:"w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-sm hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-colors",children:Xt?a.jsx(pc,{size:11}):a.jsx(fc,{size:11})})}),a.jsx("div",{className:"fixed z-[150] top-1/2 transition-all duration-300 pointer-events-none",style:{right:at?Te?12:Math.max(8,zr-6):Te?44:310,transform:at?"translateY(-50%)":"translateX(50%) translateY(-50%)"},children:a.jsx("button",{onClick:()=>Gn(u=>!u),className:"w-5 h-10 bg-white border border-[#E5E8EB] rounded-full flex items-center justify-center shadow-lg hover:border-[#3182F6] hover:text-[#3182F6] text-slate-400 transition-all hover:scale-110 active:scale-95 group pointer-events-auto",title:Te?"내 장소 열기":"내 장소 접기",children:Te?a.jsx(fc,{size:11,className:"group-hover:-translate-x-0.5 transition-transform"}):a.jsx(pc,{size:11,className:"group-hover:translate-x-0.5 transition-transform"})})}),a.jsx("div",{className:"flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-[#E5E8EB] z-[140] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden",style:{width:Nn},children:Xt?a.jsx("div",{className:"flex-1 flex items-center justify-center",children:a.jsx(Yr,{size:14,className:"text-slate-300"})}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"px-5 pt-5 pb-3 border-b border-slate-100 bg-white shrink-0",children:a.jsxs("div",{className:"flex items-center gap-2.5 flex-1 mb-3",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0",children:a.jsx(Yr,{size:14,className:"text-[#3182F6]"})}),a.jsx("h2",{className:"text-[14px] font-black text-slate-800 tracking-tight flex-1",children:"일정 안내"}),a.jsxs("button",{onClick:_m,disabled:$o,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3182F6] text-[11px] font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:[a.jsx(ch,{size:11}),$o?`탐색 ${bl}%`:"전체경로"]})]})}),a.jsx("div",{className:"flex-1 overflow-y-auto overscroll-none no-scrollbar py-6 px-5 flex flex-col",children:a.jsx("nav",{className:"flex flex-col gap-6 relative -ml-2",children:(Au=H.days)==null?void 0:Au.map((u,c)=>a.jsxs("div",{className:`rounded-2xl border p-2.5 transition-all ${dn===u.day?"border-blue-200 bg-blue-50/40":"border-slate-100 bg-white"}`,children:[a.jsx("div",{className:`rounded-xl border px-2.5 py-2 mb-2 ${dn===u.day?"border-blue-200 bg-white":"border-slate-100 bg-slate-50/70"}`,children:a.jsx("div",{className:`rounded-lg border px-2 py-1.5 ${dn===u.day?"border-blue-200 bg-blue-50/50":"border-slate-100 bg-white/80"}`,children:a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx("button",{onClick:()=>Ci(u.day),className:`text-[14px] tracking-tight transition-colors duration-300 whitespace-nowrap ${dn===u.day?"text-[#3182F6] font-black":"text-slate-700 font-black hover:text-slate-900"}`,children:hu(u.day).primary}),a.jsx("span",{className:`text-[10px] font-black rounded-md px-1.5 py-0.5 leading-none ${dn===u.day?"text-[#3182F6] bg-white border border-blue-200":"text-slate-400 bg-slate-50 border border-slate-200"}`,children:hu(u.day).secondary||"요일"})]})})}),a.jsx("div",{className:"mb-1.5"}),a.jsx("div",{className:"flex flex-col gap-0.5",children:(u.plan||[]).filter(y=>y.type!=="backup").map((y,f,g)=>{var C,O,M,G;const w=Zs===y.id,_=(C=y.types)!=null&&C.includes("ship")?"":fu(y,c);return a.jsxs("button",{onClick:()=>Ci(u.day,y.id),className:`grid grid-cols-[2.2rem_1fr_auto] items-center gap-1 px-1.5 py-1 rounded-lg text-left transition-all ${w?"bg-blue-50":"hover:bg-slate-50"}`,children:[a.jsx("span",{className:`text-[10px] tabular-nums leading-none ${w?"font-black text-[#3182F6]":"font-bold text-slate-400"}`,children:y.time||"--:--"}),a.jsxs("div",{className:"min-w-0 flex items-center gap-1.5",children:[a.jsx("div",{className:`shrink-0 scale-90 origin-left transition-opacity ${w?"opacity-100":"opacity-60"}`,children:Hi(((O=y.types)==null?void 0:O[0])||y.type||"place")}),a.jsx("span",{className:`text-[10px] truncate leading-none ${w?"font-black text-[#3182F6]":"font-bold text-slate-500"}`,children:y.activity}),(((M=y.alternatives)==null?void 0:M.length)||0)>0&&a.jsxs("span",{className:`shrink-0 text-[8px] leading-none px-1.5 py-0.5 rounded border ${w?"text-amber-600 bg-amber-50 border-amber-200":"text-amber-500 bg-amber-50/70 border-amber-200/80"}`,children:["B ",y.alternatives.length]})]}),!((G=y.types)!=null&&G.includes("ship"))&&(()=>{const se=Ye(y.types)&&f===g.length-1;let le=y.duration;if(se){const fe=H.days[c+1],_e=((fe==null?void 0:fe.plan)||[]).filter(W=>W.type!=="backup");if(_e.length){const W=_e[0],V=oe(y.time||"00:00"),Z=oe(W.time)-m(W.travelTimeOverride,nt)-m(W.bufferTimeOverride,en);le=Math.max(30,(Z<=V?Z+1440:Z)-V)}}return le>0?a.jsxs("div",{className:"shrink-0 flex items-center gap-1",children:[_&&a.jsx("span",{className:"w-1.5 h-1.5 rounded-full bg-red-400",title:_}),a.jsx("button",{type:"button",onClick:fe=>{var _e;fe.stopPropagation(),Ie(y.activity,((_e=y.receipt)==null?void 0:_e.address)||y.address||"")},className:`text-[8px] font-black rounded px-1 py-px leading-none whitespace-nowrap ${le>=120?"text-orange-400 bg-orange-50 border border-orange-200 hover:bg-orange-100":"text-slate-300 hover:text-[#3182F6]"}`,title:"네이버 지도에서 장소 검색",children:yh(le)})]}):null})()]},y.id)})})]},u.day))})}),a.jsxs("div",{className:"p-4 border-t border-slate-100 bg-white shrink-0 mt-auto",children:[kl&&a.jsxs("div",{className:"grid grid-cols-2 gap-1.5 mb-2",children:[a.jsx("button",{onClick:()=>ae(!0),className:"px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-black text-slate-500 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:"목록보기"}),a.jsx("button",{onClick:()=>P(!0),className:"px-2 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-[10px] font-black text-[#3182F6] hover:bg-blue-100 transition-colors",children:"공유하기"})]}),n?a.jsxs("div",{className:"flex items-center gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100",children:[a.jsx("div",{className:"w-7 h-7 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm",children:n.photoURL?a.jsx("img",{src:n.photoURL,alt:"User"}):a.jsx("div",{className:"w-full h-full bg-slate-200 flex items-center justify-center",children:a.jsx(h1,{size:12,className:"text-slate-400"})})}),a.jsx("div",{className:"flex flex-col min-w-0 flex-1",children:a.jsx("span",{className:"text-[11px] font-black text-slate-700 truncate",children:n.displayName||"사용자"})}),n.isGuest?a.jsx("button",{onClick:l,className:"px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors",title:"로그인",children:"로그인"}):a.jsx("button",{onClick:p,className:"p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all",title:"로그아웃",children:a.jsx(W_,{size:12})})]}):a.jsxs("div",{className:"flex items-center justify-between gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100",children:[a.jsx("span",{className:"text-[10px] font-black text-slate-500",children:"공유 보기 모드"}),a.jsx("button",{onClick:l,className:"px-2 py-1 rounded-lg text-[10px] font-black text-[#3182F6] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors",title:"로그인",children:"로그인"})]})]})]})}),a.jsx("div",{className:"flex flex-col fixed top-0 bottom-0 bg-white/80 backdrop-blur-3xl border-l border-slate-100/60 z-[140] shadow-[-8px_0_32px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden",style:{right:0,width:zr},children:Te?a.jsx("div",{className:"flex-1 flex flex-col items-center justify-center",children:a.jsx(so,{size:14,className:"text-slate-300"})}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"px-5 pt-6 pb-4 border-b border-slate-100/50 shrink-0",children:a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0",children:a.jsx(so,{size:14,className:"text-[#3182F6]"})}),a.jsx("p",{className:"text-[14px] font-black text-slate-800 tracking-tight flex-1",children:"내 장소"}),(()=>{const{refTime:u}=vl();return u?a.jsx("span",{className:"text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md tracking-wider shrink-0",title:"영업 경고 기준 시각",children:(()=>{var g;const c={sun:"일",mon:"월",tue:"화",wed:"수",thu:"목",fri:"금",sat:"토"},{todayKey:y}=vl(),f=c[y]||"";if(je){const w=(g=H.days)==null?void 0:g.find(_=>_.day===dn);if(w){const _=new Date(je);_.setDate(_.getDate()+(w.day-1));const C=String(_.getMonth()+1).padStart(2,"0"),O=String(_.getDate()).padStart(2,"0");return`${C}/${O}(${f}) ${u}`}}return`(${f}) ${u}`})()}):null})(),a.jsx("button",{onClick:()=>ht(u=>!u),className:"w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] transition-colors shrink-0",children:a.jsx(Ns,{size:11})})]})}),a.jsxs("div",{className:"flex-1 overflow-y-auto overscroll-none no-scrollbar px-5 pt-4 pb-2 flex flex-col","data-library-dropzone":"true",onDragOver:u=>{Y&&u.preventDefault()},onDrop:u=>{var c,y,f;if(u.preventDefault(),Y){if(Y.altIdx!==void 0)zi(Y.dayIdx,Y.pIdx,Y.altIdx);else{const g=(f=(y=(c=H.days)==null?void 0:c[Y.dayIdx])==null?void 0:y.plan)==null?void 0:f[Y.pIdx];Wi(Y.dayIdx,Y.pIdx,askPlanBMoveMode(g))}Tt(null)}},children:[dt&&a.jsx(I1,{newPlaceName:zn,setNewPlaceName:Ii,newPlaceTypes:jo,setNewPlaceTypes:Do,regionHint:Ue,onAdd:bm,onCancel:()=>ht(!1)}),(()=>{var w;const u=Zs?(w=H.days)==null?void 0:w.flatMap(_=>_.plan||[]).find(_=>_.id===Zs):null,c=u?oe(u.time||"00:00"):null,y=_=>{if(c===null||!(_!=null&&_.open)||!(_!=null&&_.close))return null;const C=oe(_.open),O=oe(_.close);return O<=C?c>=C||c<O:c>=C&&c<O};let f=[...yu];Sr.length>0&&(f=f.filter(_=>{const C=_.types||[];return Sr.some(O=>C.includes(O))}));const g=(yu||[]).reduce((_,C)=>((Array.isArray(C==null?void 0:C.types)?C.types:[]).forEach(M=>{_[M]=(_[M]||0)+1}),_),{});return a.jsxs("div",{className:"w-full flex flex-col gap-1.5 items-center",children:[a.jsxs("div",{className:"w-full flex flex-col gap-1 mb-2",children:[a.jsxs("div",{className:"flex flex-wrap gap-1 px-1",children:[Wa.filter(_=>_.value!=="place"&&_.value!=="new"&&_.value!=="revisit").map(_=>{const C=Sr.includes(_.value);return a.jsxs("button",{onClick:()=>Co(O=>C?O.filter(M=>M!==_.value):[...O,_.value]),className:`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all ${C?"bg-[#3182F6] text-white border-[#3182F6] shadow-sm":"bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`,children:[a.jsx("span",{children:_.label}),a.jsx("span",{className:`ml-1 px-1 rounded text-[8px] font-black ${C?"bg-white/30 text-white":"bg-slate-100 text-slate-500"}`,children:g[_.value]||0})]},_.value)}),Sr.length>0&&a.jsx("button",{onClick:()=>Co([]),className:"px-2 py-0.5 rounded-lg text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all",children:"초기화 ✕"})]}),(Re==null?void 0:Re.id)&&a.jsxs("div",{onClick:()=>{Vt(null),te("거리순 정렬을 해제하고 이름순으로 정렬했습니다.")},className:"w-full px-3 py-2 rounded-[14px] border border-blue-100 bg-blue-50/50 text-[11px] font-black text-[#3182F6] flex items-center gap-1.5 shadow-[0_2px_8px_-2px_rgba(49,130,246,0.08)] cursor-pointer hover:bg-blue-100 transition-colors mt-1",children:[a.jsx(fr,{size:12,className:"text-blue-400"}),a.jsxs("span",{className:"truncate flex-1",children:[a.jsx("span",{className:"text-blue-700",children:Re.name})," 기준 거리순 정렬"]}),a.jsx("span",{className:"text-[9px] text-blue-300",children:"✕"})]})]}),f.length===0&&!dt&&a.jsxs("p",{className:"text-[10px] text-slate-400 text-center py-6 font-semibold leading-relaxed",children:["+ 버튼으로 장소를 추가하고",a.jsx("br",{}),"타임라인으로 드래그하세요"]}),f.map(_=>{var _e,W;const C=_.types?_.types.map(V=>Hi(V)):[Hi("place")];_.id;const O=kn===_.id,M=im(_.business),G=Xo(_.business),se=G!=="미설정",le=y(_.business),fe=Bt[_.id];return a.jsxs("div",{draggable:pt,onTouchStart:V=>{if(!pt)return;const Z=V.target instanceof Element?V.target:null;Z!=null&&Z.closest("input,button,a,textarea,[contenteditable],[data-no-drag]")||(bs.current={kind:"library",place:_,startX:V.touches[0].clientX,startY:V.touches[0].clientY},hn.current=!1)},onDragStart:V=>{if(!pt){V.preventDefault();return}const Z=Qs.current,be=V.target instanceof Element?V.target:null;if(!!(be!=null&&be.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]'))){V.preventDefault();return}ds.current={kind:"library",place:_,copy:Z},V.dataTransfer.effectAllowed=Z?"copy":"move";try{V.dataTransfer.setData("text/plain",`library:${_.id||_.name||"item"}`)}catch{}requestAnimationFrame(()=>{Gt(_),cn(Z)})},onDragEnd:()=>{ds.current=null,Gt(null),Nt(null),an(null),cn(!1)},onDragOver:V=>{Y&&(V.preventDefault(),V.stopPropagation())},onDrop:V=>{var Z,be,Ve;if(Y){if(V.preventDefault(),V.stopPropagation(),Y.altIdx!==void 0)zi(Y.dayIdx,Y.pIdx,Y.altIdx);else{const Ke=(Ve=(be=(Z=H.days)==null?void 0:Z[Y.dayIdx])==null?void 0:be.plan)==null?void 0:Ve[Y.pIdx];Wi(Y.dayIdx,Y.pIdx,askPlanBMoveMode(Ke))}Tt(null)}},className:`group relative bg-white rounded-2xl border border-slate-100 p-3 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.08)] transition-all duration-300 ${(Pe==null?void 0:Pe.id)===_.id?"opacity-40 animate-pulse":"hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.12)] hover:border-slate-200"} ${O?"scale-[1.01]":""} ${M?"border-orange-200 hover:shadow-[0_8px_24px_-4px_rgba(249,115,22,0.15)] ring-1 ring-orange-100":le===!0?"border-[#3182F6]/30 shadow-[0_4px_16px_-4px_rgba(49,130,246,0.1)] hover:shadow-[0_8px_24px_-4px_rgba(49,130,246,0.15)] ring-1 ring-[#3182F6]/10":"border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:border-slate-200"}`,children:[a.jsxs("div",{className:"p-4 flex flex-col gap-2.5",children:[a.jsx("span",{className:"text-[22px] font-black text-slate-800 leading-tight break-words whitespace-normal",children:_.name}),a.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap pr-12 cursor-pointer","data-no-drag":"true",onClick:V=>{var Z,be,Ve,Ke,_t,Ct,Qt,yn,bn;V.stopPropagation(),Tn(_.id),He({..._,address:_.address||((Z=_.receipt)==null?void 0:Z.address)||"",business:Xe(_.business||{}),receipt:Oe(_.receipt||{address:_.address||"",items:[]}),showBusinessEditor:!!((be=_.business)!=null&&be.open||(Ve=_.business)!=null&&Ve.close||(Ke=_.business)!=null&&Ke.breakStart||(_t=_.business)!=null&&_t.breakEnd||(Ct=_.business)!=null&&Ct.lastOrder||(Qt=_.business)!=null&&Qt.entryClose||(bn=(yn=_.business)==null?void 0:yn.closedDays)!=null&&bn.length)})},children:[C,fe!=null&&a.jsxs("span",{className:"px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-600",children:[fe,"km"]})]}),_.address&&a.jsxs("button",{type:"button",onClick:V=>{V.stopPropagation(),Ie(_.name,_.address)},className:"flex items-center gap-2 text-slate-500 bg-slate-50 w-full px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left",title:"네이버 지도에서 장소 검색",children:[a.jsx(fr,{size:11,className:"text-[#3182F6] shrink-0"}),a.jsx("span",{className:"text-[10px] font-bold break-words whitespace-normal",children:_.address})]}),a.jsx("div",{className:`w-full px-2.5 py-1 rounded-lg border text-[10px] font-bold break-words whitespace-normal cursor-pointer transition-all hover:shadow-sm ${M?"border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100":"border-slate-200 bg-slate-50 text-slate-500 hover:border-[#3182F6]/40 hover:bg-blue-50/40 hover:text-[#3182F6]"}`,"data-no-drag":"true",onClick:V=>{var Ve,Ke,_t,Ct,Qt,yn,bn,Ki,Ji;V.stopPropagation();const be=((Ve=_.business)==null?void 0:Ve.open)||((Ke=_.business)==null?void 0:Ke.close)||((_t=_.business)==null?void 0:_t.breakStart)||((Ct=_.business)==null?void 0:Ct.breakEnd)||((Qt=_.business)==null?void 0:Qt.lastOrder)||((yn=_.business)==null?void 0:yn.entryClose)||((Ki=(bn=_.business)==null?void 0:bn.closedDays)==null?void 0:Ki.length)?Xe(_.business||{}):{..._1};Tn(_.id),He({..._,address:_.address||((Ji=_.receipt)==null?void 0:Ji.address)||"",business:be,receipt:Oe(_.receipt||{address:_.address||"",items:[]}),showBusinessEditor:!0})},children:M?`주의 · ${se?G:"영업 정보 미설정"}`:se?G:"영업 정보 미설정"}),_.memo&&a.jsx("div",{className:"w-full bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-slate-600 break-words whitespace-normal",children:_.memo})]}),O&&a.jsx("div",{className:"px-3 py-2 border-t border-slate-100 bg-white",children:a.jsxs("div",{className:"space-y-1.5",children:[(((_e=_.receipt)==null?void 0:_e.items)||[]).map((V,Z)=>a.jsxs("div",{className:"flex items-center justify-between text-[10px]",children:[a.jsx("span",{className:"text-slate-600 font-bold truncate",children:V.name||"-"}),a.jsxs("span",{className:"text-slate-400 font-bold",children:["x",gn(V)]}),a.jsxs("span",{className:"text-[#3182F6] font-black",children:["₩",i(V).toLocaleString()]})]},Z)),(((W=_.receipt)==null?void 0:W.items)||[]).length===0&&a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold",children:"등록된 메뉴가 없습니다."})]})}),a.jsxs("div",{className:"px-3 py-2 border-t border-slate-100 flex items-center justify-between bg-white cursor-pointer hover:bg-slate-50/70",onClick:V=>{V.stopPropagation(),Oo(Z=>Z===_.id?null:_.id)},children:[a.jsxs("span",{className:"text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1",children:["Total ",a.jsx(vn,{size:12,className:`transition-transform ${O?"rotate-180":""}`})]}),a.jsxs("span",{className:"text-[14px] font-black text-[#3182F6]",children:["₩",Number(_.price||0).toLocaleString()]})]}),a.jsxs("div",{className:"absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all",children:[a.jsx("button",{onClick:V=>{var Z,be,Ve,Ke,_t,Ct,Qt,yn,bn;V.stopPropagation(),Tn(_.id),He({..._,address:_.address||((Z=_.receipt)==null?void 0:Z.address)||"",business:Xe(_.business||{}),receipt:Oe(_.receipt||{address:_.address||"",items:[]}),showBusinessEditor:!!((be=_.business)!=null&&be.open||(Ve=_.business)!=null&&Ve.close||(Ke=_.business)!=null&&Ke.breakStart||(_t=_.business)!=null&&_t.breakEnd||(Ct=_.business)!=null&&Ct.lastOrder||(Qt=_.business)!=null&&Qt.entryClose||(bn=(yn=_.business)==null?void 0:yn.closedDays)!=null&&bn.length)})},className:"p-1.5 hover:text-[#3182F6] hover:bg-blue-50 text-slate-300 rounded-md transition-all",children:a.jsx(Z_,{size:11})}),a.jsx("button",{onClick:V=>{V.stopPropagation(),dr(_.id)},className:"p-1.5 hover:text-red-500 hover:bg-red-50 text-slate-300 rounded-md transition-all",children:a.jsx($l,{size:11})})]})]},_.id)})]})})()]})]})}),a.jsxs("div",{className:"flex-1 flex flex-col items-center w-full bg-slate-50 min-h-screen",style:{marginLeft:Nn,marginRight:at?zr:Te?44:300},children:[a.jsxs("div",{className:"w-full px-4 pt-8 pb-32",children:[Le&&a.jsx("div",{className:`mx-auto mb-3 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-[11px] font-black text-amber-700 ${Ft?"max-w-[500px]":"max-w-[560px]"}`,children:"공유 일정 보기 모드입니다. (편집 권한 없음)"}),N&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[280] bg-black/30 backdrop-blur-sm",onClick:()=>S(!1)}),a.jsx("div",{className:"fixed z-[281] inset-0 flex items-center justify-center p-4 pointer-events-none",children:a.jsxs("div",{className:"pointer-events-auto w-[min(600px,96vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_40px_100px_-30px_rgba(15,23,42,0.5)] overflow-hidden",children:[a.jsx("div",{className:"bg-gradient-to-br from-[#3182F6] to-[#1a5fd4] px-6 pt-6 pb-5",children:a.jsxs("div",{className:"flex items-start justify-between",children:[a.jsxs("div",{children:[a.jsx("div",{className:"flex items-center gap-2 mb-1",children:a.jsx("span",{className:"text-white/60 text-[11px] font-black tracking-widest uppercase",children:"Anti Planer"})}),a.jsx("p",{className:"text-white text-[26px] font-black leading-none",children:"업데이트 노트"}),a.jsxs("div",{className:"flex items-center gap-2 mt-2.5",children:[a.jsxs("span",{className:"bg-white/20 text-white text-[13px] font-black px-3 py-1 rounded-full",children:["v",m1]}),a.jsx("span",{className:"text-white/60 text-[12px] font-bold",children:(Nu=fh[0])==null?void 0:Nu.date}),a.jsx("span",{className:"bg-white/15 text-white/90 text-[10px] font-black px-2 py-0.5 rounded-full",children:"최신"})]})]}),a.jsx("button",{onClick:()=>S(!1),className:"text-white/60 hover:text-white transition-colors mt-0.5",children:a.jsx(Zr,{size:20})})]})}),a.jsx("div",{className:"px-6 py-4 max-h-[55vh] overflow-y-auto",children:fh.map((u,c)=>a.jsxs("div",{className:c>0?"mt-8 pt-6 border-t border-slate-100":"",children:[c>0&&a.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[a.jsxs("span",{className:"text-[12px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg",children:["v",u.version]}),a.jsx("span",{className:"text-[11px] text-slate-400 font-bold",children:u.date})]}),a.jsxs("div",{className:"relative flex flex-col",children:[a.jsx("div",{className:"absolute left-[42px] top-3 bottom-3 w-px bg-slate-100"}),u.timeline.map((y,f)=>a.jsxs("div",{className:"flex gap-3 mb-4 last:mb-0",children:[a.jsx("div",{className:"shrink-0 w-[42px] flex flex-col items-center pt-0.5",children:a.jsx("span",{className:"text-[11px] font-black text-[#3182F6] tabular-nums leading-none bg-blue-50 border border-blue-100 rounded-lg px-1.5 py-1 text-center w-full",children:y.time})}),a.jsx("div",{className:"shrink-0 w-2 h-2 rounded-full bg-[#3182F6]/30 border-2 border-[#3182F6] mt-1.5 z-10"}),a.jsxs("div",{className:"flex-1 min-w-0 pb-1",children:[a.jsxs("div",{className:"flex items-center gap-1.5 mb-0.5",children:[a.jsx("span",{className:"text-[14px] leading-none",children:y.emoji.length<=2?y.emoji:""}),a.jsx("span",{className:"text-[13px] font-black text-slate-800",children:y.title})]}),a.jsx("p",{className:"text-[11px] text-slate-500 font-bold leading-relaxed",children:y.desc})]})]},f))]})]},u.version))}),a.jsxs("div",{className:"px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/60",children:[a.jsx("span",{className:"text-[11px] text-slate-400 font-bold",children:"문의 및 피드백은 언제든 환영해요 🙌"}),a.jsx("button",{onClick:()=>S(!1),className:"px-4 py-1.5 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-[#1a5fd4] transition-colors",children:"확인"})]})]})})]}),pe&&!(n!=null&&n.isGuest)&&!(De!=null&&De.ownerId)&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[270] bg-black/25 backdrop-blur-[1px]"}),a.jsx("div",{className:"fixed z-[271] inset-0 flex items-center justify-center p-4",children:a.jsxs("div",{className:"w-[min(640px,94vw)] bg-white border border-slate-200 rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] p-5",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[16px] font-black text-slate-800",children:"일정 선택"}),a.jsx("button",{onClick:()=>de(!1),className:"text-slate-400 hover:text-slate-600",title:"닫기",children:a.jsx(Zr,{size:18})})]}),a.jsx("p",{className:"text-[11px] text-slate-500 font-bold mb-3",children:"로그인 후에는 먼저 기존 일정을 고르거나 새 일정을 만들 수 있습니다."}),a.jsx("div",{className:"mb-3",children:a.jsx("input",{value:st,onChange:u=>Fe(u.target.value),placeholder:"도시 (예: 부산)",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})}),a.jsx("button",{onClick:()=>{Hr()},className:"w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"새 일정 생성"}),a.jsx("div",{className:"max-h-[52vh] overflow-y-auto",children:(X||[]).length===0?a.jsx("p",{className:"text-[11px] text-slate-400 font-bold p-3",children:"기존 일정이 없습니다. 새 일정을 생성하세요."}):a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:(X||[]).map(u=>{const c=Li(u);return a.jsxs("button",{onClick:()=>{B(u.id),de(!1),te(`'${c.title}' 일정을 열었습니다.`)},className:`relative overflow-hidden rounded-2xl border text-left min-h-[130px] transition-all hover:-translate-y-0.5 ${F===u.id?"border-[#3182F6] ring-2 ring-[#3182F6]/20":"border-slate-200 hover:border-slate-300"}`,children:[a.jsx("img",{src:Qn(c.region),alt:"plan cover",className:"absolute inset-0 w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55"}),a.jsxs("div",{className:"relative z-10 p-3 flex flex-col gap-1 text-white",children:[a.jsx("p",{className:"text-[14px] font-black truncate",children:c.region}),c.startDate&&a.jsx("p",{className:"text-[10px] font-bold text-white/80",children:c.startDate.replace(/-/g,".")}),c.code&&c.code!=="main"&&a.jsx("p",{className:"text-[10px] font-black text-white/95 tracking-wide",children:c.code})]})]},u.id)})})})]})})]}),xe&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>ae(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,94vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"일정 관리 (도시별 예시)"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>ae(!1),children:a.jsx(Zr,{size:16})})]}),a.jsx("button",{onClick:()=>{const u=window.prompt("새 일정 지역을 입력하세요. (예: 부산)","")||"";Hr(u)},className:"w-full mb-3 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"새 도시 일정 만들기"}),a.jsx("div",{className:"max-h-[52vh] overflow-y-auto",children:(X||[]).length===0?a.jsx("p",{className:"text-[11px] text-slate-400 font-bold p-3",children:"생성된 일정이 없습니다."}):a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:(X||[]).map(u=>{const c=Li(u);return a.jsxs("button",{onClick:()=>{B(u.id),ae(!1),te(`'${c.title}' 일정으로 전환했습니다.`)},className:`relative overflow-hidden rounded-2xl border text-left min-h-[170px] transition-all hover:-translate-y-0.5 ${F===u.id?"border-[#3182F6] ring-2 ring-[#3182F6]/20":"border-slate-200 hover:border-slate-300"}`,children:[a.jsx("img",{src:Qn(c.region),alt:"plan cover",className:"absolute inset-0 w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55"}),a.jsxs("div",{className:"relative z-10 p-4 flex flex-col gap-1.5 text-white",children:[a.jsx("p",{className:"text-[18px] font-black truncate",children:c.region}),c.startDate&&a.jsx("p",{className:"text-[11px] font-bold text-white/85",children:c.startDate.replace(/-/g,".")}),c.code&&c.code!=="main"&&a.jsx("p",{className:"text-[11px] font-black text-white/95 tracking-wide",children:c.code})]})]},u.id)})})})]})]}),T&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>et(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"일정 옵션"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>et(!1),children:a.jsx(Zr,{size:16})})]}),a.jsxs("div",{className:"space-y-2",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"여행지"}),a.jsx("input",{value:Pr,onChange:u=>Rr(u.target.value),placeholder:"여행지",className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"시작일"}),a.jsx("input",{type:"date",value:In,onChange:u=>ki(u.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"종료일"}),a.jsx("input",{type:"date",value:Ys,onChange:u=>Ai(u.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]})]}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[10px] font-black text-slate-400 mb-1",children:"총 예산"}),a.jsx("input",{type:"number",value:ps,onChange:u=>Ni(u.target.value),className:"w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]"})]})]}),a.jsxs("div",{className:"flex items-center gap-2 mt-3",children:[a.jsx("button",{onClick:()=>{et(!1),ae(!0)},className:"flex-1 py-2 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:"목록 열기"}),a.jsx("button",{onClick:()=>{Xs(String(Pr||"").trim()),fs(In||""),un(Ys||""),ie(u=>({...u,maxBudget:Number(ps)||0})),et(!1)},className:"flex-1 py-2 rounded-xl bg-[#3182F6] text-white text-[11px] font-black",children:"완료"})]})]})]}),E&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[260] bg-black/20",onClick:()=>P(!1)}),a.jsxs("div",{className:"fixed z-[261] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,92vw)] bg-white border border-slate-200 rounded-2xl shadow-xl p-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-3",children:[a.jsx("p",{className:"text-[14px] font-black text-slate-800",children:"공유 범위 / 편집 권한"}),a.jsx("button",{className:"text-slate-400 hover:text-slate-600",onClick:()=>P(!1),children:a.jsx(Zr,{size:16})})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-2 mb-3",children:[a.jsxs("select",{value:ot.visibility,onChange:u=>Wr({...ot,visibility:u.target.value}),className:"bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]",children:[a.jsx("option",{value:"private",children:"비공개"}),a.jsx("option",{value:"link",children:"링크 소지자 공개"}),a.jsx("option",{value:"public",children:"공개"})]}),a.jsxs("select",{value:ot.permission,onChange:u=>Wr({...ot,permission:u.target.value}),className:"bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-700 outline-none focus:border-[#3182F6]",children:[a.jsx("option",{value:"viewer",children:"보기만"}),a.jsx("option",{value:"editor",children:"편집 가능"})]})]}),a.jsx("button",{onClick:()=>{Wo()},className:"w-full py-2 rounded-xl border border-blue-200 bg-blue-50 text-[#3182F6] text-[11px] font-black hover:bg-blue-100 transition-colors",children:ke?"복사됨":"공유 링크 복사"}),a.jsx("p",{className:"text-[10px] text-slate-400 font-bold mt-2",children:"링크에는 현재 플랜 ID가 포함됩니다. (예: 다른 도시 일정 분리 공유)"})]})]}),(()=>{var fe,_e;const u=je&&xt?Math.max(1,Math.round((new Date(xt)-new Date(je))/864e5)+1):((fe=H.days)==null?void 0:fe.length)||0,c=Math.max(0,u-1),y=mn>0?Math.min(100,Math.round(ea.total/mn*100)):0,f=(H.days||[]).flatMap(W=>W.plan||[]).filter(W=>{var V;return W&&W.type!=="backup"&&!((V=W.types)!=null&&V.includes("ship"))}),g=f.filter(W=>typeof W.revisit=="boolean"?W.revisit:d(W)).length,w=Math.max(0,f.length-g),_=f.length>0?Math.round(g/f.length*100):0,C=f.length>0?Math.round(w/f.length*100):0,O=(H.days||[]).flatMap(W=>W.plan||[]).filter(W=>W&&W.type!=="backup"),M={ship:"선박",lodge:"숙소",food:"식당",cafe:"카페",tour:"관광",rest:"휴식",pickup:"픽업",openrun:"오픈런",view:"뷰맛집",experience:"체험",souvenir:"기념품샵",place:"장소",transport:"이동비"},G=O.reduce((W,V)=>{const Z=Array.isArray(V.types)?V.types:[],be=Z.find(Ke=>!yr.has(Ke)&&Ke!=="place")||Z.find(Ke=>!yr.has(Ke))||"place",Ve=Number(V.price)||0;return W[be]=(W[be]||0)+Ve,V.distance&&(W.transport=(W.transport||0)+uu(V.distance)),W},{}),se=Object.values(G).reduce((W,V)=>W+Number(V||0),0),le=Object.entries(G).map(([W,V])=>{const Z=M[W]||W,be=Number(V)||0,Ve=se>0?Math.round(be/se*100):0;return{key:W,label:Z,amount:be,pct:Ve}}).sort((W,V)=>V.amount-W.amount);return a.jsxs("div",{className:"mb-8 relative",children:[ji&&a.jsx("div",{className:"fixed top-0 z-[190] pointer-events-none",style:{left:at?0:Nn,right:at?0:Te?44:300},children:a.jsxs("div",{className:"w-full bg-white/98 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_4px_20px_-10px_rgba(15,23,42,0.15)] pointer-events-auto min-h-[56px] px-6 py-2 flex items-center justify-between gap-4",children:[a.jsxs("div",{className:"flex items-center gap-2.5 min-w-0 flex-1",children:[a.jsx("div",{className:"w-8 h-8 rounded-xl bg-[#3182F6] flex items-center justify-center shrink-0 shadow-sm",children:a.jsx(fr,{size:13,className:"text-white"})}),a.jsxs("div",{className:"flex flex-col min-w-0",children:[a.jsx("span",{className:"text-[14px] font-black text-slate-900 truncate tracking-tight",children:Ue||"여행지"}),a.jsx("span",{className:"text-[10px] font-bold text-slate-400 leading-none",children:je&&xt?`${je.slice(5).replace("-",".")}~${xt.slice(5).replace("-",".")}`:`${c}박 ${u}일`})]})]}),a.jsxs("div",{className:"flex items-center gap-4 shrink-0",children:[a.jsxs("div",{className:"flex flex-col items-end gap-0.5",children:[a.jsxs("span",{className:"text-[14px] font-black text-[#3182F6] tabular-nums tracking-tight",children:["₩",ea.remaining.toLocaleString()]}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("div",{className:"w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner",children:a.jsx("div",{className:"h-full bg-[#3182F6] rounded-full transition-all duration-700",style:{width:`${y}%`}})}),a.jsxs("span",{className:"text-[10px] font-black text-slate-400 tabular-nums",children:[y,"%"]})]})]}),kl&&a.jsxs("div",{className:"flex items-center gap-1.5 border-l border-slate-100 pl-4",children:[a.jsx("button",{onClick:()=>An(!pt),className:`w-8 h-8 rounded-xl border transition-all flex items-center justify-center shadow-sm ${pt?"bg-amber-50 border-amber-200 text-amber-600":"bg-white border-slate-100 text-slate-400"}`,title:pt?"편집 모드 종료":"편집 모드 시작 (드래그 활성화)",children:pt?a.jsx(Edit3,{size:13}):a.jsx(fa,{size:13})}),a.jsx("button",{onClick:()=>et(!0),className:"w-8 h-8 rounded-xl border border-slate-100 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-all flex items-center justify-center shadow-sm",children:a.jsx(dh,{size:13})}),a.jsx("button",{onClick:()=>P(!0),className:"w-8 h-8 rounded-xl border border-blue-100 bg-blue-50 text-[#3182F6] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm",children:a.jsx(uh,{size:13})})]})]})]})}),!ji&&a.jsx("section",{className:"mb-10 -mx-4 -mt-8",children:a.jsxs("div",{className:"w-full relative overflow-hidden bg-transparent",children:[kl&&a.jsxs("div",{className:"absolute top-4 right-4 z-20 flex items-center gap-2",children:[a.jsx("button",{onClick:()=>An(!pt),className:`w-10 h-10 rounded-xl border backdrop-blur transition-all flex items-center justify-center shadow-lg ${pt?"bg-amber-400/90 border-amber-300 text-white font-black":"bg-white/85 border-white/40 text-slate-700"}`,title:pt?"편집 모드 종료":"편집 모드 시작 (드래그 활성화)",children:pt?a.jsx(Edit3,{size:18}):a.jsx(fa,{size:18})}),a.jsx("button",{onClick:()=>et(!0),className:"w-10 h-10 rounded-xl border border-white/40 bg-white/85 backdrop-blur text-slate-700 hover:border-[#3182F6]/50 hover:text-[#3182F6] transition-colors flex items-center justify-center shadow-lg",title:"일정 옵션",children:a.jsx(dh,{size:16})}),a.jsx("button",{onClick:()=>P(!0),className:"w-10 h-10 rounded-xl border border-blue-200 bg-blue-50/90 backdrop-blur text-[#3182F6] hover:bg-blue-100 transition-colors flex items-center justify-center shadow-lg",title:"공유 설정",children:a.jsx(uh,{size:16})})]}),a.jsxs("div",{className:"absolute left-0 right-0 top-0 h-[430px] sm:h-[450px] overflow-hidden pointer-events-none",children:[a.jsx("img",{src:Qn(Ue),className:"w-full h-full object-cover opacity-95 scale-105",alt:"travel background"}),a.jsx("div",{className:"absolute inset-0",style:{background:"linear-gradient(to bottom, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.12) 46%, rgba(242,244,246,0.16) 62%, rgba(242,244,246,0) 76%, rgba(242,244,246,0) 100%)"}})]}),a.jsxs("div",{className:`relative z-10 flex flex-col gap-10 w-full mx-auto ${Vi}`,children:[a.jsxs("div",{className:"flex flex-col gap-5 px-6 pt-8 sm:px-8 sm:pt-10",children:[a.jsx("input",{value:Ue,onChange:W=>Xs(W.target.value),placeholder:"어디로 떠나시나요?",className:"bg-transparent border-none outline-none text-[36px] sm:text-[44px] font-extrabold text-white drop-shadow-md placeholder:text-white/50 w-full tracking-tight leading-none"}),a.jsxs("div",{className:"relative flex items-center gap-2",children:[a.jsxs("button",{onClick:()=>Kr(W=>!W),className:"flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl transition-all group hover:bg-white/30",children:[a.jsx(P_,{size:14,className:"text-white group-hover:scale-110 transition-transform shrink-0"}),a.jsxs("div",{className:"flex items-center gap-1.5 pt-0.5",children:[a.jsx("span",{className:"text-[12px] font-black text-white",children:je?je.replace(/-/g,". "):"시작일"}),a.jsx("span",{className:"text-white/50 text-[10px] font-black",children:"~"}),a.jsx("span",{className:"text-[12px] font-black text-white",children:xt?xt.replace(/-/g,". "):"종료일"})]})]}),a.jsx("div",{className:"px-4 py-2 bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl",children:a.jsx("span",{className:"text-[12px] font-black text-white/90",children:u>0?`${c}박 ${u}일`:`${((_e=H.days)==null?void 0:_e.length)||0}일 일정`})}),Xn&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[299]",onClick:()=>Kr(!1)}),a.jsx("div",{className:"absolute top-full left-0 z-[300] mt-3",children:a.jsx(T1,{startDate:je,endDate:xt,onStartChange:fs,onEndChange:un,onClose:()=>Kr(!1)})})]})]})]}),a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden flex flex-col pt-8 pb-7 px-8 items-center text-center",children:[a.jsx("p",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3",children:"Total Remaining Budget"}),a.jsxs("p",{className:"text-[48px] font-black text-[#3182F6] leading-none tabular-nums tracking-tighter mb-8",children:["₩",ea.remaining.toLocaleString()]}),a.jsxs("div",{className:"w-full flex items-stretch bg-white/50 rounded-2xl border border-white/20 overflow-hidden min-h-[72px]",children:[a.jsxs("div",{className:"flex-1 p-4 flex flex-col items-center justify-center gap-1 border-r border-slate-100",children:[a.jsx("p",{className:"text-[9px] font-black uppercase tracking-widest text-slate-400",children:"Spent"}),a.jsxs("p",{className:"text-[14px] font-black text-slate-700 tabular-nums",children:["₩",ea.total.toLocaleString()]})]}),a.jsxs("div",{className:"flex-1 p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#3182F6]/5 transition-all group",onClick:()=>Gr(!0),children:[a.jsxs("p",{className:"flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400",children:["Budget ",a.jsx(Ns,{size:9,className:"text-[#3182F6] opacity-0 group-hover:opacity-100"})]}),Go?a.jsx("input",{type:"number",defaultValue:mn,autoFocus:!0,className:"text-[14px] font-black text-[#3182F6] w-24 bg-transparent border-b border-blue-200 outline-none tabular-nums text-center",onBlur:W=>{const V=Number(W.target.value);V>0&&ie(Z=>({...Z,maxBudget:V})),Gr(!1)},onKeyDown:W=>{W.key==="Enter"&&W.target.blur(),W.key==="Escape"&&Gr(!1)}}):a.jsxs("p",{className:"text-[14px] font-black text-slate-400 tabular-nums",children:["₩",mn.toLocaleString()]})]})]}),a.jsxs("div",{className:"w-full flex items-center gap-3 mt-8",children:[a.jsx("div",{className:"flex-1 h-3 bg-slate-100/50 rounded-full overflow-hidden flex items-center shadow-inner",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-[#3182F6] via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(49,130,246,0.3)]",style:{width:`${y}%`}})}),a.jsxs("span",{className:"text-[11px] font-black text-[#3182F6] tabular-nums whitespace-nowrap",children:[y,"%"]})]}),a.jsxs("button",{type:"button",onClick:()=>Bo(W=>!W),className:"mt-4 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-black text-slate-600 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors flex items-center gap-1.5",children:["여행 요약 확장",a.jsx(vn,{size:12,className:`transition-transform ${ws?"rotate-180":""}`})]}),ws&&a.jsxs("div",{className:"mt-3 w-full p-3 rounded-2xl border border-slate-200 bg-white/85 text-left",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest",children:"신규 / 재방문 비율 비교"}),a.jsxs("div",{className:"w-full h-2 rounded-full bg-slate-100 overflow-hidden flex",children:[a.jsx("div",{className:"h-full bg-emerald-400",style:{width:`${C}%`}}),a.jsx("div",{className:"h-full bg-blue-400",style:{width:`${_}%`}})]}),a.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[a.jsxs("div",{className:"rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2",children:[a.jsx("p",{className:"text-[9px] font-black text-emerald-600",children:"신규"}),a.jsxs("p",{className:"text-[14px] font-black text-emerald-700 tabular-nums",children:[w,"개 (",C,"%)"]})]}),a.jsxs("div",{className:"rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-2",children:[a.jsx("p",{className:"text-[9px] font-black text-blue-600",children:"재방문"}),a.jsxs("p",{className:"text-[14px] font-black text-blue-700 tabular-nums",children:[g,"개 (",_,"%)"]})]})]}),a.jsxs("div",{className:"mt-3 pt-3 border-t border-slate-200",children:[a.jsx("p",{className:"text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest",children:"카테고리별 지출 비율"}),le.length===0?a.jsx("p",{className:"text-[10px] font-bold text-slate-400",children:"지출 데이터가 없습니다."}):a.jsx("div",{className:"space-y-1.5",children:le.map(W=>a.jsxs("div",{className:"rounded-xl border border-slate-200 bg-white px-2.5 py-2",children:[a.jsxs("div",{className:"flex items-center justify-between mb-1",children:[a.jsx("span",{className:"text-[10px] font-black text-slate-700",children:W.label}),a.jsxs("span",{className:"text-[10px] font-black text-[#3182F6] tabular-nums",children:["₩",W.amount.toLocaleString()," · ",W.pct,"%"]})]}),a.jsx("div",{className:"w-full h-1.5 rounded-full bg-slate-100 overflow-hidden",children:a.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-[#3182F6] to-indigo-500",style:{width:`${W.pct}%`}})})]},W.key))})]})]})]})})]})]})})]})})(),a.jsx("div",{ref:or,className:"h-px w-full"}),a.jsxs("div",{className:`w-full mx-auto flex flex-col relative z-0 ${Vi} ${Ft?"gap-4":"gap-6"}`,children:[Ko===0&&a.jsxs("div",{"data-droptarget":"empty-timeline",onDragOver:u=>{Pe&&(u.preventDefault(),Nt({dayIdx:0,insertAfterPIdx:-1}))},onDragLeave:u=>{u.currentTarget.contains(u.relatedTarget)||Nt(null)},onDrop:u=>{Pe&&(u.preventDefault(),Iu(0,Pe),ln||dr(Pe.id),Gt(null),Nt(null),cn(!1))},className:`w-full rounded-[24px] border bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.2)] p-5 flex flex-col items-center gap-3 transition-all ${Pe?"cursor-copy border-[#3182F6]/40":"border-slate-200"} ${(rt==null?void 0:rt.dayIdx)===0&&(rt==null?void 0:rt.insertAfterPIdx)===-1?"ring-2 ring-[#3182F6] bg-blue-50/40":""}`,children:[a.jsx("p",{className:"text-[12px] font-black text-slate-500",children:"아직 등록된 일정이 없습니다."}),a.jsx("button",{type:"button",onClick:()=>Iu(0),className:"px-4 py-2 rounded-xl bg-[#3182F6] text-white text-[12px] font-black hover:bg-blue-600 transition-colors",children:"+ 첫 일정 추가"}),Pe&&a.jsx("p",{className:"text-[11px] font-black text-[#3182F6]",children:"내 장소 카드를 여기로 드래그해서 바로 추가할 수 있습니다."})]}),a.jsx(Et.Fragment,{children:(Su=H.days)==null?void 0:Su.map((u,c)=>{var y;return(y=u.plan)==null?void 0:y.map((f,g)=>{var be,Ve,Ke,_t,Ct,Qt,yn,bn,Ki,Ji,Du;const w=Mr===f.id,_=Ye(f.types),C=(be=f.types)==null?void 0:be.includes("ship"),O=((Ve=f.alternatives)==null?void 0:Ve.length)||0,M=O>0,G=yl[f.id]??0,se=G>0;let le;_?le="bg-white border-slate-300 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]":C?le="bg-[#f4fafe] border-blue-200 shadow-[0_8px_24px_-8px_rgba(29,78,216,0.12)]":M?le="bg-white border-amber-300 shadow-[0_10px_30px_-8px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/20":f.isTimeFixed?le="bg-white border-[#3182F6]/40 shadow-[0_10px_30px_-8px_rgba(49,130,246,0.12)] ring-1 ring-[#3182F6]/15":le="bg-white border-slate-200 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.14)] hover:border-slate-300";const fe=f.types?f.types.map(R=>Hi(R)):f.type?[Hi(f.type)]:[],_e=C?"":fu(f,c),W=f.isAutoDuration,V=!!f.isDurationFixed||W,Z=O+1;return a.jsxs("div",{id:g===0?`day-marker-${u.day}`:f.id,"data-plan-id":f.id,className:`relative group transition-all duration-300 ${Di===f.id?"scale-[1.02]":""}`,children:[u.day>1&&g===0&&a.jsx("div",{className:"flex items-center justify-center py-3 w-full",children:a.jsxs("div",{className:"flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[f._isBufferCoordinated&&a.jsx("span",{className:"text-[8px] font-black text-orange-400 absolute -top-4 whitespace-nowrap",children:"시간 보정됨"}),a.jsx("span",{className:`min-w-[3rem] text-center tracking-tight text-xs font-black transition-colors ${f._isBufferCoordinated?"text-orange-500":f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto?"text-[#3182F6] cursor-pointer":"text-slate-800"}`,onClick:R=>{R.stopPropagation(),f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto&&gu(c,g)},title:f.travelTimeAuto&&f.travelTimeOverride!==f.travelTimeAuto?"클릭하여 경로 계산 시간으로 초기화":void 0,children:f.travelTimeOverride||"15분"})]}),a.jsx("button",{onClick:R=>{R.stopPropagation(),_l(c,g,Lt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Ns,{size:10})}),a.jsxs("button",{type:"button",className:"flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors",title:"클릭하여 네이버 길찾기 열기",onClick:R=>{var ve,nn;R.stopPropagation();let $;if(g===0&&c>0){const Pt=((ve=H.days[c-1])==null?void 0:ve.plan)||[];$=Pt[Pt.length-1]}else $=(nn=u.plan)==null?void 0:nn[g-1];const K=We($,"from"),ne=We(f,"to");if(!K||!ne){te("길찾기용 출발/도착 주소가 필요합니다.");return}mt(($==null?void 0:$.activity)||"출발지",K,f.activity||"도착지",ne)},children:[a.jsx(Yr,{size:11}),a.jsx("span",{children:Q(f.distance)})]}),(()=>{const R=`${c}_${g}`,$=ir===R;return a.jsxs("button",{onClick:K=>{K.stopPropagation(),Gi(c,g)},disabled:!!ir,className:`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${$?"bg-slate-100 text-slate-400 border-slate-200":"bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]"}`,children:[a.jsx(js,{size:10})," ",$?"계산중":"자동경로"]})})(),a.jsx("div",{className:"w-px h-4 bg-slate-200 mx-0.5"}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:R=>{R.stopPropagation(),Es(c,g,-cr)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Yi,{size:10})}),a.jsx("span",{className:"min-w-[3rem] text-center tracking-tight text-xs font-black text-slate-500",children:f.bufferTimeOverride||"10분"}),a.jsx("button",{onClick:R=>{R.stopPropagation(),Es(c,g,cr)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Ns,{size:10})})]})]})}),a.jsx("div",{"data-dropitem":`${c}-${g}`,draggable:pt,onTouchStart:R=>{if(!pt)return;const $=R.target instanceof Element?R.target:null;if($!=null&&$.closest("input,button,a,textarea,[contenteditable],[data-no-drag]"))return;const K={dayIdx:c,pIdx:g,planPos:M?G:void 0};bs.current={kind:"timeline",payload:K,startX:R.touches[0].clientX,startY:R.touches[0].clientY},hn.current=!1},onDragStart:R=>{const $=Qs.current,K=R.target instanceof Element?R.target:null;if(!!(K!=null&&K.closest('input, button, a, textarea, [contenteditable="true"], [data-no-drag="true"]'))){R.preventDefault();return}const ve={dayIdx:c,pIdx:g,planPos:M?G:void 0};ds.current={kind:"timeline",payload:ve,copy:$},R.dataTransfer.effectAllowed=$?"copy":"move";try{R.dataTransfer.setData("text/plain",`timeline:${f.id||`${c}-${g}`}`)}catch{}requestAnimationFrame(()=>{cn($),Tt(ve)})},onDragEnd:()=>{ds.current=null,Tt(null),cn(!1)},onDragOver:R=>{(Pe||Y)&&f.type!=="backup"&&(R.preventDefault(),R.stopPropagation(),an({dayIdx:c,pIdx:g}))},onDragLeave:R=>{R.currentTarget.contains(R.relatedTarget)||an(null)},onDrop:R=>{var $,K;if(($t==null?void 0:$t.dayIdx)===c&&($t==null?void 0:$t.pIdx)===g){if(R.preventDefault(),R.stopPropagation(),Pe)ra(c,g,Pe),ln||dr(Pe.id);else if(Y&&Y.altIdx===void 0){const ne=(K=($=H.days[Y.dayIdx])==null?void 0:$.plan)==null?void 0:K[Y.pIdx];ne&&(Y.dayIdx!==c||Y.pIdx!==g)&&(ra(c,g,ur(ne)),ln||qi(Y.dayIdx,Y.pIdx))}Gt(null),Tt(null),an(null),cn(!1)}},className:`relative z-10 w-full flex flex-col transition-all group ${(Y==null?void 0:Y.dayIdx)===c&&(Y==null?void 0:Y.pIdx)===g?"opacity-50 pointer-events-none scale-[0.99]":""} ${($t==null?void 0:$t.dayIdx)===c&&($t==null?void 0:$t.pIdx)===g?"ring-2 ring-[#3182F6] ring-offset-2 ring-offset-[#F2F4F6]":""}`,onClick:()=>wu(f.id),children:a.jsxs("div",{className:`relative w-full flex flex-col border overflow-hidden rounded-[24px] transition-all duration-300 ${le}`,children:[M&&a.jsx("div",{className:"absolute top-2 right-2 z-20 pointer-events-none",children:a.jsxs("button",{type:"button","data-plan-picker-trigger":"true",className:"pointer-events-auto text-[11px] font-black px-2 py-1 rounded-lg border min-w-[44px] text-center text-slate-500 bg-white/95 border-slate-200 shadow-[0_8px_16px_-10px_rgba(15,23,42,0.35)] hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",onClick:R=>{R.stopPropagation();const $=R.currentTarget.getBoundingClientRect(),K=250,ne=180,ve=Math.max(12,Math.min(window.innerWidth-K-12,$.right-K)),nn=Math.max(8,Math.min(window.innerHeight-ne-8,$.bottom+8));ys({dayIdx:c,pIdx:g,left:ve,top:nn})},title:"플랜 목록 보기",children:[G+1,"/",Z]})}),M&&(Ut==null?void 0:Ut.dayIdx)===c&&(Ut==null?void 0:Ut.pIdx)===g&&a.jsxs("div",{"data-plan-picker":"true",className:"fixed z-[170] w-[250px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_18px_36px_-18px_rgba(15,23,42,0.35)] p-2.5",style:{left:Ut.left,top:Ut.top},onClick:R=>R.stopPropagation(),children:[a.jsxs("p",{className:"text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2",children:["플랜 목록 (",Z,"개)"]}),a.jsx("div",{className:"flex flex-col gap-1 max-h-[130px] overflow-y-auto no-scrollbar",children:[f,...f.alternatives||[]].map((R,$)=>{var ne;const K=$===G;return a.jsxs("button",{type:"button",onClick:()=>ym(c,g,$),className:`w-full text-left px-2.5 py-2 rounded-xl border transition-colors ${K?"border-[#3182F6] bg-blue-50 text-[#3182F6]":"border-slate-200 bg-white text-slate-700 hover:border-[#3182F6] hover:text-[#3182F6]"}`,children:[a.jsx("p",{className:"text-[11px] font-black truncate",children:R.activity||`플랜 ${$+1}`}),a.jsx("p",{className:"text-[10px] font-bold text-slate-400 truncate",children:(((ne=R.receipt)==null?void 0:ne.address)||"").trim()||"주소 미정"})]},`${f.id}_variant_${$}`)})})]}),a.jsxs("div",{className:"flex items-stretch border-b border-slate-100 border-dashed",children:[!C&&!_&&a.jsxs("div",{onClick:R=>{R.stopPropagation(),gs($=>($==null?void 0:$.dayIdx)===c&&($==null?void 0:$.pIdx)===g?null:{dayIdx:c,pIdx:g})},className:`relative flex flex-col items-center justify-center gap-2 shrink-0 border-r border-slate-100 flex-none overflow-hidden transition-all duration-500 cursor-pointer group/tower ${(Be==null?void 0:Be.dayIdx)===c&&(Be==null?void 0:Be.pIdx)===g?"w-[200px] sm:w-[220px] bg-slate-50/80 shadow-inner":Ft?"w-[30%] py-3":"w-[30%] py-4 px-2 sm:px-3"} ${f.isTimeFixed?"bg-blue-50/40":"bg-transparent"}`,children:[f.isTimeFixed&&a.jsx(fa,{size:90,className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-[0.035] pointer-events-none"}),a.jsx("div",{"data-time-trigger":"true",className:`relative w-full px-1 py-1 rounded-2xl select-none z-10 transition-all ${(Be==null?void 0:Be.dayIdx)===c&&(Be==null?void 0:Be.pIdx)===g?"scale-100":"group-hover/tower:bg-slate-100/30"}`,children:a.jsx("div",{className:"relative flex flex-col items-center justify-center gap-3 z-10",children:(()=>{const[R="00",$="00"]=(f.time||"00:00").split(":"),K=parseInt(R,10),ne=parseInt($,10),ve=f.isTimeFixed?"text-blue-400 hover:text-blue-600 hover:bg-blue-100/60":"text-slate-400 hover:text-blue-500 hover:bg-blue-100/50";if(!((Be==null?void 0:Be.dayIdx)===c&&(Be==null?void 0:Be.pIdx)===g)){const[Ee,ye]=(f.time||"00:00").split(":"),Ts=oe(f.time||"00:00")+(f.duration||0),[Is,Zn]=St(Ts).split(":");return a.jsxs("div",{className:"flex flex-col items-center justify-center w-full h-full px-2 py-3 gap-1.5 select-none",children:[a.jsxs("div",{className:"flex flex-col items-center gap-0.5",children:[f.isTimeFixed&&a.jsx("span",{className:"text-[7px] font-black tracking-widest text-[#3182F6]/50 uppercase leading-none",children:"고정"}),a.jsxs("span",{className:`text-[28px] font-black tabular-nums tracking-tight leading-none ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:[String(Ee).padStart(2,"0"),":",String(ye).padStart(2,"0")]})]}),a.jsxs("div",{className:`flex items-center gap-0.5 px-2.5 py-1 rounded-full cursor-pointer transition-colors ${W?"bg-red-500":V?"bg-orange-400":"bg-slate-200 hover:bg-slate-300"}`,onClick:lt=>{if(lt.stopPropagation(),W){te("자동 연동 일정은 소요시간을 조절할 수 없습니다.");return}gs(Cn=>(Cn==null?void 0:Cn.dayIdx)===c&&(Cn==null?void 0:Cn.pIdx)===g?null:{dayIdx:c,pIdx:g})},children:[a.jsx("button",{onClick:lt=>{if(lt.stopPropagation(),V){te(W?"자동 연동 일정은 소요시간을 변경할 수 없습니다.":"소요시간 잠금이 켜져 있습니다.");return}Qr(c,g,-Lt)},className:`w-4 h-4 flex items-center justify-center transition-colors ${V?"text-white/60 hover:text-white":"text-slate-400 hover:text-slate-600"}`,children:a.jsx(Yi,{size:9,strokeWidth:3})}),a.jsx("span",{className:`text-[11px] font-black tabular-nums px-1 ${V?"text-white":"text-slate-600"}`,children:yh(f.duration)}),a.jsx("button",{onClick:lt=>{if(lt.stopPropagation(),V){te(W?"자동 연동 일정은 소요시간을 변경할 수 없습니다.":"소요시간 잠금이 켜져 있습니다.");return}Qr(c,g,Lt)},className:`w-4 h-4 flex items-center justify-center transition-colors ${V?"text-white/60 hover:text-white":"text-slate-400 hover:text-slate-600"}`,children:a.jsx(Ns,{size:9,strokeWidth:3})})]}),a.jsxs("span",{className:`text-[28px] font-black tabular-nums tracking-tight leading-none ${f.isTimeFixed?"text-blue-300":"text-slate-400"}`,children:[String(Is).padStart(2,"0"),":",String(Zn).padStart(2,"0")]})]})}const Pt=(Be==null?void 0:Be.step)||10;return a.jsxs("div",{className:"flex flex-col items-center w-full h-full px-2.5 py-2 gap-2 animate-in fade-in duration-200 overflow-y-auto select-none",children:[a.jsxs("div",{className:"flex items-center gap-2 w-full justify-center",children:[a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),Yo(c,g,1)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ve}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:String(isNaN(K)?0:K).padStart(2,"0")}),a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),Yo(c,g,-1)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ve}`,children:a.jsx(vn,{size:13})})]}),a.jsx("span",{className:`text-[20px] font-black pb-0.5 ${f.isTimeFixed?"text-[#3182F6]/20":"text-slate-200"}`,children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),Zo(c,g,Pt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ve}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${f.isTimeFixed?"text-[#3182F6]":"text-slate-800"}`,children:String(isNaN(ne)?0:ne).padStart(2,"0")}),a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),Zo(c,g,-Pt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${ve}`,children:a.jsx(vn,{size:13})})]})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-1 flex-1",children:[a.jsxs("button",{onClick:Ee=>{Ee.stopPropagation(),um(c,g)},className:`col-span-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${f.isTimeFixed?"bg-[#3182F6] text-white ring-2 ring-[#3182F6]/40 ring-offset-1":"bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"}`,children:[f.isTimeFixed?a.jsx(fa,{size:9}):a.jsx(z_,{size:9})," ",f.isTimeFixed?"고정됨":"고정"]}),[1,5,15,30].map(Ee=>a.jsx("button",{onClick:ye=>{ye.stopPropagation(),gs(Ts=>({...Ts,step:Ee}))},className:`w-full py-1 rounded-lg text-[9px] font-black transition-all text-center ${Pt===Ee?f.isTimeFixed?"bg-[#3182F6] text-white":"bg-slate-700 text-white":"bg-slate-50 text-slate-400 hover:bg-slate-100"}`,children:Ee},Ee))]})]}),a.jsx("div",{className:"w-full h-px bg-slate-100"}),a.jsxs("div",{className:"flex items-center gap-2 w-full justify-center",children:[a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),V||Qr(c,g,60)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${V?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${V?"text-orange-400":"text-slate-800"}`,children:String(Math.floor((f.duration||0)/60)).padStart(2,"0")}),a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),V||Qr(c,g,-60)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${V?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(vn,{size:13})})]}),a.jsx("span",{className:`text-[20px] font-black pb-0.5 ${V?"text-orange-200":"text-slate-200"}`,children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),V||Qr(c,g,Pt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${V?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(As,{size:13})}),a.jsx("span",{className:`text-[30px] font-black tracking-tight tabular-nums leading-none w-[42px] text-center ${V?"text-orange-400":"text-slate-800"}`,children:String((f.duration||0)%60).padStart(2,"0")}),a.jsx("button",{onClick:Ee=>{Ee.stopPropagation(),V||Qr(c,g,-Pt)},className:`w-8 h-6 flex items-center justify-center rounded-md transition-colors ${V?"text-orange-300 cursor-not-allowed":"text-slate-300 hover:text-[#3182F6] hover:bg-blue-50"}`,children:a.jsx(vn,{size:13})})]})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-1 flex-1",children:[a.jsxs("button",{onClick:Ee=>{Ee.stopPropagation(),cm(c,g)},className:`col-span-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${f.isDurationFixed?"bg-orange-400 text-white ring-2 ring-orange-400/40 ring-offset-1":"bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"}`,children:[a.jsx(hh,{size:9})," ",f.isDurationFixed?"고정됨":"고정"]}),[30,60,90,120].map(Ee=>a.jsx("button",{onClick:ye=>{ye.stopPropagation(),V||lm(c,g,Ee)},className:"w-full py-1 rounded-lg text-[9px] font-black transition-all text-center bg-slate-50 text-slate-500 hover:bg-orange-400 hover:text-white",children:Ee<60?`${Ee}m`:Ee%60===0?`${Ee/60}h`:"1.5h"},Ee))]})]})]})})()})})]}),a.jsx("div",{className:`${C||_?"flex-1":"w-[70%] flex-none"} min-w-0 flex flex-col justify-start gap-2 transition-all duration-500 overflow-hidden ${Ft?"p-2.5 sm:p-3":"p-3 sm:p-4"}`,children:C?a.jsxs("div",{className:"flex flex-col gap-2 py-0.5",onClick:R=>R.stopPropagation(),children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx(lh,{size:11,className:"text-blue-400 shrink-0"}),a.jsx("input",{value:f.activity,onChange:R=>na(c,g,R.target.value),onFocus:R=>R.target.select(),className:"flex-1 min-w-0 bg-transparent text-[15px] font-black text-blue-900 leading-tight focus:outline-none truncate",onClick:R=>R.stopPropagation(),placeholder:"페리 이름"})]}),a.jsxs("div",{className:"flex items-center bg-gradient-to-r from-blue-700 to-cyan-600 rounded-xl px-3 py-2 gap-2",children:[a.jsxs("div",{className:"flex flex-col items-start min-w-0",children:[a.jsx("span",{className:"text-[8px] text-blue-200 font-bold tracking-widest uppercase",children:"Departure"}),a.jsx("input",{value:f.startPoint||"목포항",onChange:R=>{R.stopPropagation(),sa(c,g,"startPoint",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:R=>R.target.select(),className:"text-[14px] font-black text-white bg-transparent outline-none w-16 focus:border-b focus:border-white/50"}),a.jsx("input",{value:((Ke=f.receipt)==null?void 0:Ke.address)||"",onChange:R=>{R.stopPropagation(),ie($=>{const K=JSON.parse(JSON.stringify($));return K.days[c].plan[g].receipt={...K.days[c].plan[g].receipt,address:R.target.value},K})},onClick:R=>R.stopPropagation(),onFocus:async R=>{if(R.target.select(),f.startPoint){const $=await Ss(f.startPoint);$!=null&&$.address&&ie(K=>{const ne=JSON.parse(JSON.stringify(K));return ne.days[c].plan[g].receipt={...ne.days[c].plan[g].receipt,address:$.address},ne})}},placeholder:"클릭 시 자동 입력",className:"text-[9px] text-blue-200/80 bg-transparent outline-none w-24 focus:border-b focus:border-white/30 truncate cursor-pointer"})]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-0.5",children:[a.jsx("div",{className:"w-full border-t border-dashed border-white/30"}),a.jsx("span",{className:"text-[9px] text-white/60 font-bold",children:(()=>{const R=f.sailDuration??240;return`${Math.floor(R/60)}h${R%60>0?` ${R%60}m`:""}`})()})]}),a.jsxs("div",{className:"flex flex-col items-end min-w-0",children:[a.jsx("span",{className:"text-[8px] text-blue-200 font-bold tracking-widest uppercase",children:"Arrival"}),a.jsx("input",{value:f.endPoint||"제주항",onChange:R=>{R.stopPropagation(),sa(c,g,"endPoint",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:R=>R.target.select(),className:"text-[14px] font-black text-white bg-transparent outline-none w-16 text-right focus:border-b focus:border-white/50"}),a.jsx("input",{value:f.endAddress||"",onChange:R=>{R.stopPropagation(),sa(c,g,"endAddress",R.target.value)},onClick:R=>R.stopPropagation(),onFocus:async R=>{if(R.target.select(),f.endPoint){const $=await Ss(f.endPoint);$!=null&&$.address&&sa(c,g,"endAddress",$.address)}},placeholder:"클릭 시 자동 입력",className:"text-[9px] text-blue-200/80 bg-transparent outline-none w-24 text-right focus:border-b focus:border-white/30 truncate cursor-pointer"})]})]}),(()=>{const R=oe(f.time||"00:00"),$=oe(f.boardTime||St(R+60)),K=f.sailDuration??240,ne=St($+K),ve=ye=>(Yt==null?void 0:Yt.pId)===f.id&&(Yt==null?void 0:Yt.field)===ye,nn=(ye,Ts=Lt)=>Is=>{Is.stopPropagation();const Zn=Is.currentTarget;Zn.setPointerCapture(Is.pointerId);const lt=Is.clientY;let Cn=0,ia=!1;const Ou=Qi=>{if(!ia&&Math.abs(Qi.clientY-lt)>6&&(ia=!0),ia){const Al=Math.round((lt-Qi.clientY)/6);Al!==Cn&&(ye((Al-Cn)*Ts),Cn=Al)}};Zn.addEventListener("pointermove",Ou),Zn.addEventListener("pointerup",()=>{Zn.removeEventListener("pointermove",Ou),ia&&Zn.addEventListener("click",Qi=>{Qi.stopPropagation(),Qi.preventDefault()},{once:!0,capture:!0})},{once:!0})},Pt=(ye,Ts,Is,Zn)=>ve(ye)?a.jsx("input",{autoFocus:!0,defaultValue:Ts.replace(":",""),onFocus:lt=>lt.target.select(),className:"w-14 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded",onBlur:lt=>_u(c,g,ye,lt.target.value),onKeyDown:lt=>{lt.key==="Enter"&&lt.target.blur(),lt.key==="Escape"&&Mt(null)},onClick:lt=>lt.stopPropagation()}):a.jsx("span",{className:"text-[13px] font-black text-blue-800 tabular-nums cursor-pointer",title:"탭: 직접 입력 / 드래그: 조절",onPointerDown:nn(Is,Zn),onClick:lt=>{lt.stopPropagation(),Mt({pId:f.id,field:ye})},children:Ts}),Ee=ve("sail")?a.jsx("input",{autoFocus:!0,defaultValue:K,onFocus:ye=>ye.target.select(),className:"w-10 text-center text-[13px] font-black text-blue-800 bg-white border-b-2 border-[#3182F6] outline-none tabular-nums rounded",onBlur:ye=>_u(c,g,"sail",ye.target.value),onKeyDown:ye=>{ye.key==="Enter"&&ye.target.blur(),ye.key==="Escape"&&Mt(null)},onClick:ye=>ye.stopPropagation(),placeholder:"분"}):a.jsx("span",{className:"text-[13px] font-black text-blue-800 tabular-nums cursor-pointer",title:"탭: 분 단위 입력 / 드래그: 조절",onPointerDown:nn(ye=>xu(c,g,ye),30),onClick:ye=>{ye.stopPropagation(),Mt({pId:f.id,field:"sail"})},children:St(K)});return a.jsxs("div",{className:"flex gap-2 select-none",children:[a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-blue-50/80 border border-blue-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-blue-400 font-black tracking-widest uppercase",children:"선적"}),a.jsxs("div",{className:"flex items-center gap-1 text-[13px] font-black text-blue-800 tabular-nums",children:[Pt("load",f.time||"00:00",ye=>xl(c,g,ye)),a.jsx("span",{className:"text-blue-400",children:"-"}),Pt("loadEnd",St($),ye=>vu(c,g,ye))]})]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-sky-50/80 border border-sky-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-sky-400 font-black tracking-widest uppercase",children:"출항"}),Pt("depart",St($),ye=>vu(c,g,ye))]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-indigo-50/80 border border-indigo-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-indigo-400 font-black tracking-widest uppercase",children:"소요"}),Ee]}),a.jsxs("div",{className:"flex-1 flex flex-col items-center gap-1 bg-violet-50/80 border border-violet-100 rounded-xl px-2 py-2.5",children:[a.jsx("span",{className:"text-[8px] text-violet-500 font-black tracking-widest uppercase",children:"하선"}),Pt("disembark",ne,ye=>xu(c,g,ye),30)]})]})})()]}):_?a.jsxs("div",{className:"flex flex-col gap-2 py-0.5",onClick:R=>R.stopPropagation(),children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx(hc,{size:11,className:"text-indigo-400 shrink-0"}),a.jsx("input",{value:f.activity,onChange:R=>na(c,g,R.target.value),onFocus:R=>R.target.select(),className:"flex-1 min-w-0 bg-transparent text-[15px] font-black text-indigo-900 leading-tight focus:outline-none truncate",onClick:R=>R.stopPropagation(),placeholder:"숙소 이름"})]}),a.jsxs("button",{type:"button",onClick:R=>{var $;R.stopPropagation(),Ie(f.activity,(($=f.receipt)==null?void 0:$.address)||f.address||"")},className:"flex items-center gap-2 text-slate-500 bg-white w-fit max-w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm hover:border-[#3182F6]/50 hover:bg-blue-50/40 transition-colors text-left",title:"네이버 지도에서 장소 검색",children:[a.jsx(fr,{size:12,className:"text-[#3182F6] shrink-0"}),a.jsx("span",{className:"text-[11px] font-bold truncate",children:((_t=f.receipt)==null?void 0:_t.address)||"주소 정보 없음"})]}),a.jsxs("div",{className:"flex gap-2",children:[a.jsxs("div",{className:"relative overflow-hidden flex-1 bg-indigo-50/70 rounded-xl border border-indigo-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]",children:[a.jsx("span",{className:"pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[56px] font-black tracking-[0.08em] text-indigo-200/55 select-none",children:"IN"}),a.jsx("div",{className:"flex items-center justify-center gap-1.5",children:(()=>{const[R="00",$="00"]=(f.time||"00:00").split(":"),K=parseInt(R,10),ne=parseInt($,10);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:ve=>{ve.stopPropagation(),Yo(c,g,1)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900",children:String(isNaN(K)?0:K).padStart(2,"0")}),a.jsx("button",{onClick:ve=>{ve.stopPropagation(),Yo(c,g,-1)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(vn,{size:11})})]}),a.jsx("span",{className:"text-[16px] font-black text-indigo-900",children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:ve=>{ve.stopPropagation(),Zo(c,g,Lt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-indigo-900",children:String(isNaN(ne)?0:ne).padStart(2,"0")}),a.jsx("button",{onClick:ve=>{ve.stopPropagation(),Zo(c,g,-Lt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100/70 transition-colors",children:a.jsx(vn,{size:11})})]})]})})()})]}),a.jsxs("div",{className:"relative overflow-hidden flex-1 bg-violet-50/70 rounded-xl border border-violet-100 p-3 flex flex-col items-center justify-center gap-1 min-h-[96px]",children:[a.jsx("span",{className:"pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[52px] font-black tracking-[0.06em] text-violet-200/55 select-none",children:"OUT"}),a.jsx("div",{className:"flex items-center justify-center gap-1.5",children:(()=>{var Ee;const R=H.days[c+1],$=(Ee=R==null?void 0:R.plan)==null?void 0:Ee[0],K=$&&$.type!=="backup"?oe($.time)-m($.travelTimeOverride,nt)-m($.bufferTimeOverride,en):oe(f.time||"00:00")+(f.duration||0),[ne="00",ve="00"]=St(K).split(":"),nn=parseInt(ne,10),Pt=parseInt(ve,10);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:ye=>{ye.stopPropagation(),$&&$.type!=="backup"&&Es(c+1,0,-60)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900",children:String(isNaN(nn)?0:nn).padStart(2,"0")}),a.jsx("button",{onClick:ye=>{ye.stopPropagation(),$&&$.type!=="backup"&&Es(c+1,0,60)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(vn,{size:11})})]}),a.jsx("span",{className:"text-[16px] font-black text-violet-900",children:":"}),a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("button",{onClick:ye=>{ye.stopPropagation(),$&&$.type!=="backup"&&Es(c+1,0,-Lt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(As,{size:11})}),a.jsx("span",{className:"min-w-[2ch] text-[18px] text-center font-black tracking-tighter leading-none py-0.5 text-violet-900",children:String(isNaN(Pt)?0:Pt).padStart(2,"0")}),a.jsx("button",{onClick:ye=>{ye.stopPropagation(),$&&$.type!=="backup"&&Es(c+1,0,Lt)},className:"w-6 h-4 flex items-center justify-center rounded-lg text-violet-300 hover:text-violet-500 hover:bg-violet-100/70 transition-colors",children:a.jsx(vn,{size:11})})]})]})})()})]})]}),a.jsx("input",{value:f.memo||"",onChange:R=>bu(c,g,R.target.value),className:"w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all",placeholder:"메모를 입력하세요..."})]}):a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[a.jsx("div",{className:`flex items-center gap-1 flex-wrap cursor-grab active:cursor-grabbing rounded-lg px-1 py-0.5 -ml-1 transition-colors ${(zt==null?void 0:zt.dayIdx)===c&&(zt==null?void 0:zt.pIdx)===g?"bg-blue-50 ring-1 ring-[#3182F6]/30":"hover:bg-slate-100/60"}`,title:"클릭하여 태그 편집",onClick:R=>{R.stopPropagation(),Lo($=>($==null?void 0:$.dayIdx)===c&&($==null?void 0:$.pIdx)===g?null:{dayIdx:c,pIdx:g})},children:fe}),M&&a.jsxs("span",{className:"text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 leading-none shadow-sm animate-in fade-in zoom-in duration-300",children:["PLAN B ",se?"ACTIVE":""]})]}),(zt==null?void 0:zt.dayIdx)===c&&(zt==null?void 0:zt.pIdx)===g&&a.jsx("div",{className:"-mt-1 mb-0.5",onClick:R=>R.stopPropagation(),children:a.jsx(mc,{title:"태그",value:f.types||["place"],onChange:R=>hm(c,g,R)})}),a.jsxs("div",{className:"w-full flex items-center gap-2 text-slate-500 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all focus-within:border-[#3182F6]/50",onClick:R=>R.stopPropagation(),children:[a.jsx("input",{value:f.activity,onChange:R=>na(c,g,R.target.value),onFocus:R=>R.target.select(),onKeyDown:async R=>{if(R.key==="Enter"&&f.activity.trim()){R.preventDefault(),te("주소 검색 중...");const $=await Ss(f.activity,Ue);$!=null&&$.address?(ta(c,g,$.address),te(`주소 자동 입력: ${$.address}`)):te("주소를 찾을 수 없습니다.")}},className:"flex-1 bg-transparent text-[13px] font-black text-slate-800 truncate leading-tight focus:outline-none min-w-0",placeholder:"일정 이름 입력 후 Enter"}),a.jsx("button",{type:"button",onClick:async()=>{try{const R=await navigator.clipboard.readText(),$=jn(R);$&&($.name&&na(c,g,$.name),$.address&&ta(c,g,$.address),$.business&&ie(K=>{const ne=JSON.parse(JSON.stringify(K));return ne.days[c].plan[g].business=$.business,ne}),$.menus.length&&ie(K=>{const ne=JSON.parse(JSON.stringify(K));return ne.days[c].plan[g].receipt={...ne.days[c].plan[g].receipt||{},items:$.menus},ne}),te("스마트 전체 붙여넣기 완료"))}catch{}},className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",title:"스마트 전체 붙여넣기",children:a.jsx(js,{size:9})})]}),a.jsxs("div",{className:"flex gap-1.5 -mt-1 mb-0.5",children:[a.jsx("button",{type:"button",onClick:async()=>{try{const R=await navigator.clipboard.readText(),$=jn(R);$!=null&&$.business&&(ie(K=>{const ne=JSON.parse(JSON.stringify(K));return ne.days[c].plan[g].business=$.business,ne}),te("영업 정보만 스마트 입력 완료"))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all",children:"🕒 영업정보만"}),a.jsx("button",{type:"button",onClick:async()=>{var R;try{const $=await navigator.clipboard.readText(),K=jn($);(R=K==null?void 0:K.menus)!=null&&R.length&&(ie(ne=>{const ve=JSON.parse(JSON.stringify(ne));return ve.days[c].plan[g].receipt={...ve.days[c].plan[g].receipt||{},items:K.menus},ve}),te("메뉴 정보만 스마트 입력 완료"))}catch{}},className:"flex-1 py-1 rounded-lg border border-slate-100 bg-slate-50 text-[9px] font-black text-slate-400 hover:bg-blue-50 hover:text-[#3182F6] hover:border-blue-200 transition-all",children:"📋 메뉴만"})]}),(()=>{var K;let R=!1;const $=async()=>{var ne;if(!(R||!((ne=f.activity)!=null&&ne.trim()))){R=!0;try{const ve=await Ss(f.activity,Ue);ve!=null&&ve.address&&ta(c,g,ve.address)}catch{}finally{R=!1}}};return a.jsxs("div",{className:"flex items-center gap-2 text-slate-500 bg-white w-full px-2 py-1 rounded-lg border border-slate-200 shadow-sm",onClick:ne=>ne.stopPropagation(),children:[a.jsx("button",{type:"button",title:"내 장소 정렬 기준 설정",onClick:ne=>{var ve;ne.stopPropagation(),Vt({id:f.id,name:f.activity,address:((ve=f.receipt)==null?void 0:ve.address)||""}),te(`'${f.activity}'을(를) 거리 계산 기준으로 설정했습니다.`)},className:"shrink-0 transition-colors hover:bg-amber-50 p-1 -ml-1 rounded-md",children:a.jsx(fr,{size:12,className:(Re==null?void 0:Re.id)===f.id?"text-amber-500":"text-[#3182F6]"})}),a.jsx("input",{value:((K=f.receipt)==null?void 0:K.address)||"",onChange:ne=>ta(c,g,ne.target.value),placeholder:"주소 정보 없음",className:"flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-300"}),a.jsx("button",{type:"button",onClick:ne=>{var ve;ne.stopPropagation(),Ie(f.activity,((ve=f.receipt)==null?void 0:ve.address)||f.address||"")},title:"네이버 지도에서 장소 검색",className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:a.jsx(Yr,{size:9})}),a.jsx("button",{type:"button",onClick:ne=>{ne.stopPropagation(),$()},title:"일정 이름으로 주소 자동 검색",className:"shrink-0 p-1 rounded-md border border-slate-200 bg-white text-slate-400 hover:border-[#3182F6] hover:text-[#3182F6] transition-colors",children:a.jsx(js,{size:9})})]})})(),_e&&a.jsx("button",{type:"button",onClick:R=>{R.stopPropagation(),_e.includes("운영 시작 전 방문")&&rm(c,g)},className:"w-full px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 text-[10px] font-black text-left hover:bg-red-100/80 transition-colors",title:_e.includes("운영 시작 전 방문")?"클릭하면 운영 시작 시간으로 보정합니다.":void 0,children:_e}),f._timingConflict&&a.jsx("div",{className:"w-full px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-black text-left",title:"고정/잠금 조건 때문에 자동 보정이 불가능한 구간입니다.",children:"시간 충돌: 고정/잠금 조건으로 자동 계산 불가"}),a.jsxs("div",{className:"w-full bg-slate-50/60 border border-slate-200 rounded-lg py-1.5 px-2.5",onClick:R=>R.stopPropagation(),children:[a.jsx("button",{type:"button",onClick:()=>gl(R=>(R==null?void 0:R.dayIdx)===c&&(R==null?void 0:R.pIdx)===g?null:{dayIdx:c,pIdx:g}),className:"w-full flex items-center gap-2 text-left",children:Xo(f.business)==="미설정"?a.jsx("span",{className:"text-[10px] font-bold text-slate-400",children:"영업 정보 (선택)"}):a.jsx("span",{className:"text-[10px] font-bold text-slate-600 truncate flex-1",children:Xo(f.business)})}),(vs==null?void 0:vs.dayIdx)===c&&(vs==null?void 0:vs.pIdx)===g&&a.jsxs("div",{className:"mt-1.5",children:[a.jsx("p",{className:"text-[9px] text-slate-400 font-semibold mb-1.5",children:"현재 일정 시간과 충돌하면 위에 빨간 경고가 표시됩니다."}),a.jsx(gc,{business:f.business||{},onChange:R=>dm(c,g,R)})]})]}),a.jsx("div",{onClick:R=>R.stopPropagation(),children:a.jsx("input",{value:f.memo||"",onChange:R=>bu(c,g,R.target.value),className:"w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-all",placeholder:"메모를 입력하세요..."})})]})})]}),f.type!=="backup"&&a.jsxs("div",{className:"mx-3 mb-3 mt-1.5 rounded-2xl overflow-hidden border border-slate-100/80",onClick:R=>R.stopPropagation(),children:[w&&a.jsxs("div",{className:"px-5 py-4 animate-in slide-in-from-top-1 bg-white border-b border-slate-100 border-dashed",children:[((Ct=f.types)==null?void 0:Ct.includes("ship"))&&a.jsxs("div",{className:"bg-blue-50/80 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-slate-600 font-bold flex flex-col gap-1.5",children:[((yn=(Qt=f.receipt)==null?void 0:Qt.shipDetails)==null?void 0:yn.loading)&&a.jsxs("div",{children:["🚗 선적 가능: ",a.jsx("span",{className:"text-red-500",children:f.receipt.shipDetails.loading})]}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("span",{children:"🧍 승선:"}),a.jsx("input",{value:((Ki=(bn=f.receipt)==null?void 0:bn.shipDetails)==null?void 0:Ki.boarding)||"",onChange:R=>{R.stopPropagation(),ie($=>{const K=JSON.parse(JSON.stringify($)),ne=K.days[c].plan[g];return ne.receipt||(ne.receipt={}),ne.receipt.shipDetails||(ne.receipt.shipDetails={}),ne.receipt.shipDetails.boarding=R.target.value,K})},onClick:R=>R.stopPropagation(),placeholder:"승선 가능 시간 입력",className:"flex-1 bg-transparent outline-none text-slate-700 font-bold focus:border-b focus:border-blue-300"})]})]}),a.jsxs("div",{className:"space-y-3 mb-3",children:[a.jsx("p",{className:"text-[10px] text-slate-400 font-semibold -mb-1",children:"메뉴명/수량/가격을 직접 수정하면 총액이 자동 계산됩니다."}),(Du=(Ji=f.receipt)==null?void 0:Ji.items)==null?void 0:Du.map((R,$)=>a.jsxs("div",{className:"flex justify-between items-center text-xs group/item",children:[a.jsxs("div",{className:"flex items-center gap-2 flex-1",children:[a.jsx("div",{className:"cursor-pointer text-slate-300 hover:text-[#3182F6]",onClick:K=>{K.stopPropagation(),Bi(c,g,$,"toggle")},children:R.selected?a.jsx(i1,{size:14,className:"text-[#3182F6]"}):a.jsx(a1,{size:14})}),a.jsx("input",{value:R.name,onChange:K=>Bi(c,g,$,"name",K.target.value),onClick:K=>K.stopPropagation(),className:"bg-transparent border-none outline-none text-slate-700 font-bold w-full"})]}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("input",{type:"number",value:R.price,onChange:K=>{K.stopPropagation(),Bi(c,g,$,"price",K.target.value)},onClick:K=>K.stopPropagation(),className:"w-16 text-right font-bold text-slate-500 bg-transparent border-none outline-none focus:border-b focus:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}),a.jsxs("div",{className:"flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm",children:[a.jsx("button",{onClick:K=>{K.stopPropagation(),Bi(c,g,$,"qty",-1)},children:a.jsx(Yi,{size:10})}),a.jsx("span",{className:"w-4 text-center text-[10px]",children:gn(R)}),a.jsx("button",{onClick:K=>{K.stopPropagation(),Bi(c,g,$,"qty",1)},children:a.jsx(Ns,{size:10})})]}),a.jsxs("span",{className:"w-20 text-right font-black text-[#3182F6]",children:["₩",i(R).toLocaleString()]}),a.jsx("button",{onClick:K=>{K.stopPropagation(),pm(c,g,$)},className:"text-slate-300 hover:text-red-500",children:a.jsx($l,{size:12})})]})]},$))]}),a.jsx("button",{onClick:R=>{R.stopPropagation(),fm(c,g)},className:"w-full py-2 border border-dashed border-slate-300 rounded-xl text-[10px] font-bold text-slate-400 hover:text-[#3182F6] hover:bg-white transition-all",children:"+ 메뉴 추가"})]}),a.jsxs("div",{onClick:R=>{R.stopPropagation(),wu(f.id)},className:`mt-auto px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all ${w?"bg-blue-50/50 border-t border-blue-100/60":"bg-[#FAFBFC] hover:bg-slate-50/80"}`,children:[a.jsx("div",{className:"flex flex-col gap-0.5 text-left",children:a.jsxs("span",{className:"text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.15em] flex items-center gap-1.5",children:["Total Estimated Cost ",a.jsx(vn,{size:12,className:`transition-transform duration-300 ${w?"rotate-180 text-[#3182F6]":""}`})]})}),a.jsx("div",{className:"flex items-center gap-2",children:a.jsxs("span",{className:`text-[21px] font-black tabular-nums transition-colors ${w?"text-[#3182F6]":"text-slate-800"}`,children:["₩",Number(f.price||0).toLocaleString()]})})]})]})]})}),g===u.plan.length-1&&f.type!=="backup"&&(Pe||Y&&Y!==null)&&(()=>{const R=(rt==null?void 0:rt.dayIdx)===c&&(rt==null?void 0:rt.insertAfterPIdx)===g,$=R&&Pe?pu(Pe,c,g):"";return a.jsx("div",{className:"relative w-full pt-6 pb-2 -mb-4 z-10 cursor-copy","data-droptarget":`${c}-${g}`,onDragOver:K=>{K.preventDefault(),Nt({dayIdx:c,insertAfterPIdx:g})},onDragLeave:K=>{K.currentTarget.contains(K.relatedTarget)||Nt(null)},onDrop:K=>{K.preventDefault(),Pe?(Tl(c,g,Pe.types,Pe),ln||dr(Pe.id)):(Y==null?void 0:Y.altIdx)!==void 0?wl(c,g,Y.dayIdx,Y.pIdx,Y.altIdx):Y&&Y.altIdx===void 0&&El(c,g,Y.dayIdx,Y.pIdx,ln,Y.planPos),Gt(null),Tt(null),Nt(null),cn(!1)},children:a.jsxs("div",{className:`w-full flex items-center justify-center gap-2 rounded-[28px] border-2 border-dashed transition-all duration-300 text-[12px] font-black ${R?$?"h-32 border-orange-500 bg-orange-50/80 text-orange-600 shadow-[0_12px_30px_-10px_rgba(251,146,60,0.55)] scale-[1.02]":"h-32 border-[#3182F6] bg-blue-50/80 text-[#3182F6] shadow-[0_12px_30px_-10px_rgba(49,130,246,0.55)] scale-[1.02]":"h-24 border-slate-300 bg-slate-50/40 text-slate-400 hover:border-slate-400"}`,children:[a.jsx(Ll,{size:14,className:"animate-pulse"})," ",R&&$?$:"이곳에 일정 추가"]})})})(),g<u.plan.length-1&&a.jsx("div",{className:"flex items-center pt-3 pb-0 -mb-3 relative w-full",children:(()=>{const R=u.plan[g+1];if(!R)return null;if(Pe||Y!==null){const $=(rt==null?void 0:rt.dayIdx)===c&&(rt==null?void 0:rt.insertAfterPIdx)===g,K=$&&Pe?pu(Pe,c,g):"";return a.jsx("div",{className:"z-10 w-full pt-6 pb-2 -mb-4 cursor-copy","data-droptarget":`${c}-${g}`,onDragOver:ne=>{ne.preventDefault(),Nt({dayIdx:c,insertAfterPIdx:g})},onDragLeave:ne=>{ne.currentTarget.contains(ne.relatedTarget)||Nt(null)},onDrop:ne=>{ne.preventDefault(),Pe?(Tl(c,g,Pe.types,Pe),ln||dr(Pe.id)):(Y==null?void 0:Y.altIdx)!==void 0?wl(c,g,Y.dayIdx,Y.pIdx,Y.altIdx):Y&&Y.altIdx===void 0&&El(c,g,Y.dayIdx,Y.pIdx,ln,Y.planPos),Gt(null),Tt(null),Nt(null),cn(!1)},children:a.jsxs("div",{className:`w-full flex items-center justify-center gap-2 rounded-[28px] border-2 border-dashed transition-all duration-300 text-[12px] font-black ${$?K?"h-32 border-orange-500 bg-orange-50/80 text-orange-600 shadow-[0_12px_30px_-10px_rgba(251,146,60,0.55)] scale-[1.02]":"h-32 border-[#3182F6] bg-blue-50/80 text-[#3182F6] shadow-[0_12px_30px_-10px_rgba(49,130,246,0.55)] scale-[1.02]":"h-24 border-slate-300 bg-slate-50/40 text-slate-400 hover:border-slate-400"}`,children:[a.jsx(Ll,{size:14,className:"animate-pulse"})," ",$&&K?K:"이곳에 일정 추가"]})})}return a.jsx("div",{className:"z-10 flex items-center justify-center w-full",children:a.jsxs("div",{className:"my-2 flex items-center bg-slate-50/95 px-3 py-1.5 rounded-full border border-slate-300 shadow-[0_8px_18px_-14px_rgba(15,23,42,0.45)] gap-2",children:[a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:$=>{$.stopPropagation(),_l(c,g+1,-Lt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Yi,{size:10})}),a.jsx("span",{className:`min-w-[3rem] text-center tracking-tight text-xs font-black ${R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto?"text-[#3182F6] cursor-pointer":"text-slate-800"}`,onClick:$=>{$.stopPropagation(),R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto&&gu(c,g+1)},title:R.travelTimeAuto&&R.travelTimeOverride!==R.travelTimeAuto?"클릭하여 경로 계산 시간으로 초기화":void 0,children:R.travelTimeOverride||"15분"}),a.jsx("button",{onClick:$=>{$.stopPropagation(),_l(c,g+1,Lt)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Ns,{size:10})})]}),a.jsxs("button",{type:"button",className:"flex items-center gap-1 text-slate-400 text-xs font-bold hover:text-[#3182F6] transition-colors",title:"구간 거리",onClick:$=>{$.stopPropagation();const K=We(f,"from"),ne=We(R,"to");if(!K||!ne){te("길찾기용 출발/도착 주소가 필요합니다.");return}mt(f.activity||"출발지",K,R.activity||"도착지",ne)},children:[a.jsx(Yr,{size:11}),a.jsx("span",{children:Q(R.distance)})]}),(()=>{const $=`${c}_${g+1}`,K=ir===$;return a.jsxs("button",{onClick:ne=>{ne.stopPropagation(),Gi(c,g+1)},disabled:!!ir,className:`flex items-center gap-1 transition-colors border rounded-lg px-2 py-1 text-[10px] font-black ${K?"bg-slate-100 text-slate-400 border-slate-200":"bg-white hover:bg-[#3182F6] hover:text-white text-slate-400 border-slate-200 hover:border-[#3182F6]"}`,children:[a.jsx(js,{size:10})," ",K?"계산중":"자동경로"]})})(),a.jsx("div",{className:"w-px h-4 bg-slate-200 mx-0.5"}),a.jsxs("div",{className:"flex items-center gap-1.5",children:[a.jsx("button",{onClick:$=>{$.stopPropagation(),Es(c,g+1,-cr)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Yi,{size:10})}),a.jsxs("div",{className:"flex flex-col items-center",children:[R._isBufferCoordinated&&a.jsx("span",{className:"text-[8px] font-black text-orange-400 absolute -top-4 whitespace-nowrap",children:"시간 보정됨"}),a.jsx("span",{className:`min-w-[3rem] text-center tracking-tight text-xs font-black transition-colors ${R._isBufferCoordinated?"text-orange-500":"text-slate-500"}`,children:R.bufferTimeOverride||"10분"})]}),a.jsx("button",{onClick:$=>{$.stopPropagation(),Es(c,g+1,cr)},className:"w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-50 text-slate-500",children:a.jsx(Ns,{size:10})})]})]})})})()})]},f.id)})})})]}),ms&&a.jsx("div",{className:"fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] animate-in",children:a.jsxs("div",{className:"flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl shadow-[0_14px_30px_-16px_rgba(15,23,42,0.45)]",children:[a.jsx("span",{className:"text-[12px] font-bold",children:fl||"변경 사항이 저장되었습니다"}),a.jsx("button",{onClick:()=>{om(),Dr(!1)},className:"text-[11px] font-black text-[#3182F6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors border border-blue-100",children:"되돌리기"}),a.jsx("button",{onClick:()=>Dr(!1),className:"text-slate-300 hover:text-slate-500 transition-colors ml-1",children:"✕"})]})}),I&&a.jsx("div",{className:"fixed top-4 right-4 z-[220] animate-in slide-in-from-right-4 fade-in duration-500",children:a.jsxs("div",{className:"bg-white border border-slate-200 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18)] rounded-[20px] overflow-hidden w-[300px]",children:[a.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-slate-100",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-2 h-2 rounded-full bg-[#3182F6] animate-pulse"}),a.jsx("span",{className:"text-[11px] font-black text-slate-700 tracking-widest uppercase",children:"업데이트 노트"})]}),a.jsx("button",{onClick:()=>k(null),className:"w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors",children:a.jsx(Zr,{size:13})})]}),a.jsx("div",{className:"px-4 py-3 flex flex-col gap-2.5",children:Ul.map((u,c)=>a.jsxs("div",{className:"flex items-start gap-2",children:[a.jsx("span",{className:`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-md leading-tight border ${u.tag==="FIX"?"bg-red-50 text-red-500 border-red-100":u.tag==="FEAT"?"bg-blue-50 text-[#3182F6] border-blue-100":"bg-emerald-50 text-emerald-600 border-emerald-100"}`,children:u.tag}),a.jsxs("div",{className:"flex flex-col gap-0.5 flex-1 min-w-0",children:[a.jsx("span",{className:"text-[11px] font-bold text-slate-700 leading-tight",children:u.msg}),a.jsxs("span",{className:"text-[9px] font-bold text-slate-400 tabular-nums",children:["03.",u.date.split(".")[1]," · ",u.time]})]})]},c))}),a.jsxs("div",{className:"px-4 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between",children:[a.jsxs("span",{className:"text-[9px] font-bold text-slate-400 tabular-nums",children:[I.timeText," 적용"]}),a.jsx("span",{className:"text-[9px] font-black text-[#3182F6]",children:"anti_planer"})]})]})}),Y&&a.jsx("div",{className:"fixed left-1/2 -translate-x-1/2 bottom-4 z-[230] w-[min(680px,94vw)]",children:a.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[a.jsxs("div",{"data-drag-action":"move_to_library",onDragOver:u=>{u.preventDefault(),Kt("move_to_library")},onDragLeave:()=>Kt(u=>u==="move_to_library"?"":u),onDrop:u=>{var y,f,g;u.preventDefault();const c=Y;if(c){if(c.altIdx!==void 0)zi(c.dayIdx,c.pIdx,c.altIdx);else{const w=(g=(f=(y=H.days)==null?void 0:y[c.dayIdx])==null?void 0:f.plan)==null?void 0:g[c.pIdx];Wi(c.dayIdx,c.pIdx,askPlanBMoveMode(w))}Jr(),Kt(""),Tt(null)}},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Js==="move_to_library"?"border-[#3182F6] bg-blue-50 text-[#3182F6]":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx(so,{size:13}),"내장소로 이동"]}),a.jsxs("div",{"data-drag-action":"delete",onDragOver:u=>{u.preventDefault(),Kt("delete")},onDragLeave:()=>Kt(u=>u==="delete"?"":u),onDrop:u=>{u.preventDefault();const c=Y;c&&(c.altIdx===void 0&&(qi(c.dayIdx,c.pIdx),Jr()),Kt(""),Tt(null))},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Js==="delete"?"border-red-400 bg-red-50 text-red-500":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx($l,{size:13}),"삭제"]}),a.jsxs("div",{"data-drag-action":"copy_to_library",onDragOver:u=>{u.preventDefault(),Kt("copy_to_library")},onDragLeave:()=>Kt(u=>u==="copy_to_library"?"":u),onDrop:u=>{u.preventDefault();const c=Y;c&&(c.altIdx!==void 0?Tu(c.dayIdx,c.pIdx,c.altIdx):Eu(c.dayIdx,c.pIdx),Jr(),Kt(""),Tt(null))},className:`h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-1.5 text-[11px] font-black transition-all ${Js==="copy_to_library"?"border-emerald-400 bg-emerald-50 text-emerald-600":"border-slate-200 bg-white text-slate-500"}`,children:[a.jsx(Ll,{size:13}),"내장소로 복제"]})]})}),(Pe||Y)&&a.jsxs("div",{ref:Fo,className:"fixed pointer-events-none z-[9999] bg-white/95 backdrop-blur-xl border-2 border-[#3182F6] rounded-2xl px-5 py-3.5 shadow-[0_20px_50px_rgba(49,130,246,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-200",style:{left:0,top:0,transform:`translate3d(${Ro.x}px, ${Ro.y}px, 0) translate(-50%, -120%)`,minWidth:"180px",willChange:"transform"},children:[a.jsx("div",{className:"w-1.5 h-10 bg-gradient-to-b from-[#3182F6] to-indigo-500 rounded-full shrink-0"}),a.jsxs("div",{className:"flex flex-col gap-0.5",children:[a.jsx("span",{className:"text-[9px] font-black text-[#3182F6] uppercase tracking-[0.15em]",children:"Dragging Object"}),a.jsx("span",{className:"text-[15px] font-black text-slate-800 truncate max-w-[140px]",children:(Pe==null?void 0:Pe.name)||((ju=(Ru=(Pu=(Cu=H.days)==null?void 0:Cu[Y==null?void 0:Y.dayIdx])==null?void 0:Pu.plan)==null?void 0:Ru[Y==null?void 0:Y.pIdx])==null?void 0:ju.activity)||"일정 이동 중"})]})]})]}),a.jsx("style",{children:`
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
      `})]})]})},P1=()=>a.jsx(g1,{children:a.jsx(k1,{})});export{P1 as default};
