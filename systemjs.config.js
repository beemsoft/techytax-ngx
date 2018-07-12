System.config({
  paths: {
    'npm:': '/node_modules/'
  },
  map: {
    app: 'dist/app',
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    'core-js': 'npm:core-js',
    'zone.js': 'npm:zone.js',
    'rxjs': 'npm:rxjs',
    'tslib': 'npm:tslib/tslib.js',
    '@swimlane/ngx-datatable':'npm:@swimlane/ngx-datatable/release/index.js',
    'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js'
  },
  transpiler: 'plugin-babel',
  packages: {
    'dist/app': {},
    'rxjs': { 'main': 'index.js', 'defaultExtension': 'js' },
    'rxjs/operators': { 'main': 'index.js', 'defaultExtension': 'js' },
    'rxjs/internal-compatibility': { 'main': 'index.js', 'defaultExtension': 'js' },
    'rxjs/testing': { 'main': 'index.js', 'defaultExtension': 'js' },
    'rxjs/ajax': { 'main': 'index.js', 'defaultExtension': 'js' },
    'rxjs/webSocket': { 'main': 'index.js', 'defaultExtension': 'js' },
    'core-js': {},
    'zone.js': {}
  }
});
