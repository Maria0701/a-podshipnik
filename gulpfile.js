"use strict"

import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import browserSync from 'browser-sync';
browserSync.create();
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
// import csso from 'gulp-csso';
import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';
import {deleteAsync} from 'del';
import webpack from 'webpack-stream';
import { stacksvg } from "gulp-stacksvg"
const isDev = false;
const isProd = !isDev;

gulp.task('css', function() {
  return gulp.src('app/scss/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  //.pipe(csso())
  //.pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src('app/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest('build'));
});

gulp.task('sprite', function() {
  return gulp.src('app/svg/**/*.svg')
  .pipe(stacksvg({ output: `sprite` }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
});

  gulp.task('js', function() {
    return gulp.src('app/js/index.js')
    .pipe(webpack({
        output: {
            filename: 'index.js',
        },
        module: {
            rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        "plugins": [
                          ["@babel/plugin-transform-runtime", {
                          "regenerator": true
                          }]
                        ]
                    }
                }
            }
        ]
    },
    mode: isDev ? 'development' : 'production',
    optimization: {
      minimize: false
    }
  }))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.stream());
});

gulp.task('server', function () {
  browserSync.init({
    server:'build/',
    notify: false
  });

    gulp.watch('app/scss/**/*.scss', gulp.series('css'));
    gulp.watch('app/html/**/*.scss', gulp.series('css'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    gulp.watch('app/**/*.html', gulp.series('html','refresh'));
});

gulp.task('refresh', function (done) {
  browserSync.reload();
  done();
});

gulp.task('copy', function () {
  return gulp.src([
    'app/fonts/**/*.{woff,woff2,ttf,otf}',
    'app/*.ico',
    'app/img/**/*.{png,jpg,svg,webp}',
    'app/js/*.json',
  ], {
    base: 'app'
  })
  .pipe(gulp.dest('build'));
});
  
gulp.task('clear', function () {
  return deleteAsync('build');
});
  
gulp.task('build', gulp.series(
  'clear',
  'copy',
  'js',
  'css',
  'sprite',
  'html'
));
  
gulp.task('start', gulp.series('build', 'server'));