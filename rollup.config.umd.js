import resolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
var sass = require('node-sass');
//import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'lib/at-grid-source.ts',
    format: 'umd',
    moduleName: 'at-grid',
    sourceMap: true,
    external: [
        '@angular/common',
        '@angular/compiler',
        '@angular/forms',
        '@angular/core',
        "@angular/platform-browser",
    ],
    dest: 'dist/at-grid.umd.js',

    plugins: [
        angular(
            {
                preprocessors: {
                    template: template => template,
                    style: scss => {
                        let css;
                        if(scss){
                            css = sass.renderSync({ data: scss }).css.toString();
                        }else{
                            css = '';
                        }
                        return css;
                    },
                }
            }
        ),
        typescript({
            typescript:require('typescript')
        }),
        resolve({
            module: true,
            main: true
}),
        commonjs({
            include: 'node_modules/**',
        })
        //uglify()
    ],
    onwarn: warning => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};
