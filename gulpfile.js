const gulp = require('gulp');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const stylus = require('gulp-stylus');
const watch = require('gulp-watch');
const data = require('gulp-data');
const minify = require('gulp-minify');
const fs = require('fs');
const browserSync = require('browser-sync').create();


gulp.task('pug', function() {
   return gulp.src('./src/views/*.pug')
       .pipe(data(function(file) {
          return JSON.parse(fs.readFileSync('./src/locals/en.json'))
       }))
       .pipe(pug({
           doctype: 'html',
           pretty: true
       }))
       .pipe(gulp.dest('build/'))
});

// Get one .styl file and render
gulp.task('stylus', function () {
    return gulp.src('./src/styles/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('build/css/'))

});

gulp.task('imagemin', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images/'))
);

gulp.task('minify', function() {
    gulp.src('./src/js/*.js')
        .pipe(minify())
        .pipe(gulp.dest('build/js/'))
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
        'src/fonts/**/*'])
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('browser-sync', function () {
    const files = [
        'build/**/*.html',
        'build/css/**/*.css',
        'build/img/**/*',
        'build/js/**/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: './build/'
        }
    });
});

// Call Watch
gulp.task('watch', function () {
    gulp.watch('src/**/*.pug', ['pug']);
    gulp.watch('src/locals/*.json', ['pug']);
    gulp.watch('src/styles/*.styl', ['stylus']);
    gulp.watch('src/js/**/*.js', ['minify']);
    gulp.watch('src/img/**/*.{jpg,png,gif,mp4}', ['imagemin']);
});

gulp.task('default', ['watch','pug', 'minify','stylus','imagemin', 'fonts','browser-sync']);