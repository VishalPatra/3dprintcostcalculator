const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');
const webpack = require('webpack-stream');

// Compile SCSS
gulp.task('scss', () => {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(gulp.dest('dist/assets/css/'))
		.pipe(browserSync.stream());
});

// Compile JavaScript
gulp.task('js', () => {
	return gulp.src('src/js/app.js')
		.pipe(webpack({
			mode: 'production',
			output: {
				filename: 'app.js'
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			}
		}))
		.pipe(gulp.dest('dist/assets/js/'))
		.pipe(browserSync.stream());
});

// Copy vendor scripts
gulp.task('vendor', () => {
	return gulp.src([
		'node_modules/particles.js/particles.js',
		'node_modules/sweet-scroll/sweet-scroll.min.js',
		'node_modules/d3/dist/d3.min.js'
	], { allowEmpty: true })
	.pipe(gulp.dest('dist/assets/js/vendor/'));
});

// Optimize Images
gulp.task('images', () => {
	return gulp.src('src/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest('dist/assets/img'));
});

// Copy HTML
gulp.task('html', () => {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

// Watch files
gulp.task('serve', () => {
	browserSync.init({
		server: "./dist"
	});

	gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/*.html', gulp.series('html'));
	gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Clean dist
gulp.task('clean', () => {
	return del(['dist/**/*']);
});

// Build task
gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('scss', 'js', 'vendor', 'images', 'html')
));

// Default task
gulp.task('default', gulp.series('build', 'serve'));
