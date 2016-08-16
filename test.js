var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
    .pipe(deploy(puburl, {
        relativePath: './',
        exts: ['.html', '.php'],
        host: 'res.lanrenqifu.com',
        protocol: 'https'
    }))
    .pipe(gulp.dest('./test/dist'));
