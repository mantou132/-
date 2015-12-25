const gulp = require('gulp');
const browserify = require('gulp-browserify');
const minify_js = require('gulp-jsmin');
const minify_css = require('gulp-minify-css');
const minify_html = require('gulp-minify-html');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const less = require('gulp-less');
const path = require('path');
 
gulp.task('script', () => {
    return gulp.src('src/*.es6')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('style', () => {
    return gulp.src('src/*.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src'));
});

gulp.task('watch', () => {
   gulp.watch('src/*.*', ['script', 'style']);
});

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['script', 'style'], () => {
    gulp.src('src/**/*.+(png|jpg)')
    .pipe(gulp.dest('build'));

    gulp.src('src/**/*.html')
    .pipe(minify_html())
    .pipe(gulp.dest('build'));

    gulp.src('src/**/*.css')
    .pipe(minify_css())
    .pipe(gulp.dest('build'));
    
    gulp.src('src/index.js')
    .pipe(browserify())
    .pipe(minify_js())
    .pipe(gulp.dest('build'));
});

gulp.task('help', () => {
    console.log('\033[31;m');
    console.log(`
        build: 将所以编译后的文件移动到build目录
        default: 在build的基础上再加监视文件任务
        watch: 发现源文件改动就进行build任务
        style: 编译less，并添加前缀和压缩
        script: 编译es6文件，并压缩
        `);
    console.log('\033[0m');
})