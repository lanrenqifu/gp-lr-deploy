# gp-lr-deploy
deploy static resource

## A Simple Example
可以直接这样调用
```js
var deploy = require('gp-lr-deploy');
var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy())
  .pipe(gulp.dest('dist/'));


Features
------------------
1、支持相对路径配置。opts.relativePath = opts.relativePath || '';
2、支持配置后缀的文件，不仅限于html文件。opts.exts = opts.exts || ['.html'];
Bug Fixed
------------------
无


