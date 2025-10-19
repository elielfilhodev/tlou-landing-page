const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

// ==============================================
// CAMINHOS DOS ARQUIVOS
// ==============================================
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    main: 'src/scss/styles.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  html: {
    src: '*.html'
  }
};

// ==============================================
// TAREFA: LIMPAR DIST
// ==============================================
function clean() {
  return del(['dist']);
}

// ==============================================
// TAREFA: COMPILAR SASS
// ==============================================
function styles() {
  return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      overrideBrowserslist: ['last 2 versions', '> 1%', 'IE 11']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// ==============================================
// TAREFA: PROCESSAR JAVASCRIPT
// ==============================================
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// ==============================================
// TAREFA: OTIMIZAR IMAGENS
// ==============================================
function images() {
  return gulp.src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest(paths.images.dest));
}

// ==============================================
// TAREFA: BROWSER SYNC (DEV SERVER)
// ==============================================
function serve() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000,
    notify: false
  });

  // Watch files
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// ==============================================
// TAREFA: WATCH (SEM SERVER)
// ==============================================
function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

// ==============================================
// TAREFAS COMPLEXAS
// ==============================================
const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, images)
);

const dev = gulp.series(
  build,
  serve
);

const watch = gulp.series(
  build,
  watchFiles
);

// ==============================================
// EXPORTS
// ==============================================
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.serve = serve;
exports.watch = watch;
exports.build = build;
exports.dev = dev;
exports.default = dev;