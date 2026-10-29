import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const name of ['index.html','base-door.webp','base-room.webp','casino-door.webp','casino-room.webp','concert-door.webp','concert-room.webp','halloween-door.webp','halloween-room.webp','submarine-door.webp','submarine-room.webp','studio-door.webp','studio-room.webp']) await copyFile(name,'dist/'+name);
console.log('Build prêt : horloge réelle, indices programmés et scènes datées.');
