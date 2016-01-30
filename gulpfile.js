const gulp = require('gulp')
const plumber = require('gulp-plumber')
const webserver = require('gulp-webserver')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

// Base directory for source files
const base = 'src/'

// Development server host and port
const host = 'localhost'
const port = 8080

gulp.task('server', () => {
  gulp.src('dist/')
    .pipe(webserver({
      host,
      port,
      livereload: true,
      directoryListing: true
    }))
})

gulp.task('js', () => {
  gulp.src('src/**/*.js', { base })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps/'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('css', () => {
  gulp.src('src/**/*.css', { base })
  .pipe(plumber())
  .pipe(gulp.dest('dist/'))
})

gulp.task('html', () => {
  gulp.src('src/**/*.html', { base })
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['server', 'js', 'css', 'html'], () => {
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/**/*.css', ['css'])
  gulp.watch('src/**/*.html', ['html'])
})
