import{mkdir,copyFile,rm}from'node:fs/promises';await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await copyFile('index.html','dist/index.html');
for(const name of ['halloween-door.webp','halloween-room.webp']) await copyFile(name,'dist/'+name);console.log('Build prêt : index unique + décors Halloween.');
