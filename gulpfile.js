let gulp = require('gulp'),
  sass = require('gulp-sass'),
  babel = require('gulp-babel'),
  webserver = require('gulp-server-io'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  source = './process',
  dest = './builds/masteringcode'

function html() {
  return gulp.src(dest + '**/*.html')
}

function js() {
  return gulp
    .src(source + '/js/script.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(gulp.dest(dest + '/js'))
}

function processSass() {
  return gulp
    .src(source + '/scss/style.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(dest + '/css'))
}

function styles() {
  return gulp
    .src(source + '/postcss/style.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(dest + '/css'))
}

function watch() {
  gulp.watch(source + '/js/**/*.js', js)
  gulp.watch(source + '/postcss/**/*.css', styles)
  gulp.watch(source + '/scss/style.scss', processSass)
  gulp.watch(source + '/index.html', html)
}

function server() {
  return gulp.src(dest).pipe(
    webserver({
      serverReload: {
        dir: dest,
      },
      open: true,
    })
  )
}

var build = gulp.series(gulp.parallel(js, styles, processSass, html), server, watch)

gulp.task('default', build)
