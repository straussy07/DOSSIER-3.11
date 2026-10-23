import {mkdir,copyFile,readFile} from 'node:fs/promises';
const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
if(!html.includes('</html>')||!html.includes("code==='140'"))throw new Error('index.html incomplet ou mauvaise version');
await mkdir(new URL('./dist/',import.meta.url),{recursive:true});
await copyFile(new URL('./index.html',import.meta.url),new URL('./dist/index.html',import.meta.url));
console.log('Site prêt : dist/index.html');
