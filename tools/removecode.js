const del = require('del');
var rimraf = require('rimraf')

del(['dist/!(*.js.map|*.js|*.umd.js|*.esm.js|*.d.ts|*.umd.js.map|*.esm.js.map|package.json|*.metadata.json)']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

(function main(){
  //rimraf.sync('dist/node_modules')
})();
