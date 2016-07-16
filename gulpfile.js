var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var connect = require('gulp-connect');
var webpack = require('webpack-stream');

gulp.task('lib', function () {
    const jsFilter = filter('**/*.js');
    const cssFilter = filter('**/*.css');

    gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist/vendor'))
        .pipe(connect.reload());

    gulp.src(mainBowerFiles())
        .pipe(cssFilter)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('./dist/vendor'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    return gulp.src('./scripts/**/*.js')
        .pipe(webpack({
            module: {
                loaders: [
                    {
                        loader: 'babel',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            }
        }))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    return gulp.src('./styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename("style.css"))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('connectDist', function () {
    connect.server({
        root: './dist',
        port: '8080',
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src(['./dist/**/*.html', './dist**/*htm'])
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./dist/**/*.html', './dist**/*htm'], ['html']);
    gulp.watch(['./styles/**/*.scss'], ['sass']);
    gulp.watch(['./scripts/**/*.js'], ['js']);
});

gulp.task('default', ['connectDist', 'watch']);