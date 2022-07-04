/*! @comandeer/apm v0.1.0 | (c) 2022 Comandeer | MIT license (see LICENSE) */
import{readdir as n,readFile as a}from"node:fs/promises";import{resolve as e,dirname as r}from"node:path";async function t(a,r,{endDir:o="/"}={}){if((await n(r)).includes(a))return e(r,a);if(r===o)return null;const i=e(r,"..");return i===r?null:t(a,i,{endDir:o})}const o={name:"npm",method:"fallback"};async function i(n){const e=await t("package.json",n);if(!e)return o;const i=await a(e,"utf8"),c=JSON.parse(i);if(c.packageManager){const{name:n}=function(n){const[a,e]=n.split("@");return{name:a,version:e}}(c.packageManager);return{name:n,method:"packageManager"}}const m=r(e);if(await t("package-lock.json",n,{endDir:m}))return{name:"npm",method:"lock-file"};if(await t("pnpm-lock.yaml",n,{endDir:m}))return{name:"pnpm",method:"lock-file"};return await t("yarn.lock",n,{endDir:m})?{name:"yarn",method:"lock-file"}:o}export{i as detectPackageManager};
//# sourceMappingURL=apm.mjs.map
