var gulp = require('gulp');

gulp.task('dist', function () {
	gulp.src('./node_modules/moment/moment.js')
		.pipe(gulp.dest('./public/js'));

	gulp.src('./node_modules/angular')
		.pipe(gulp.dest('./public/js'));
});