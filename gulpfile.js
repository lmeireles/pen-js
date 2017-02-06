var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpWatch = require('gulp-watch');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    gulp.src([
        'src/pen-js.js'
    ])
        .pipe(concat('pen-js.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default', function() {
    gulp.start('scripts');

    gulpWatch('src/**/*.js', function(event) {
        gulp.start('scripts');
    });
});