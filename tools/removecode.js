const del = require('del');
var rimraf = require('rimraf');
var fs = require('fs');


(function copy() {
    let path = './dist/tmp/lib-inlined/';
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            fs.createReadStream(path + file).pipe(fs.createWriteStream('./dist/' + file));
        });
    });
})();

del(['dist/!(*.js.map|*.js|*.umd.js|*.esm.js|*.d.ts|*.umd.js.map|*.esm.js.map|package.json|*.metadata.json)']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

(function main(){
  //rimraf.sync('dist/node_modules')
})();
