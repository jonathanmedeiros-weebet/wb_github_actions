var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('demo.wee.bet', function(done) {
    gulp.src(['config.ts'])
        .pipe(replace('[HOST]', 'demo.wee.bet2'))
        .pipe(replace('[BANCA]', 'DeMo'))
        .pipe(gulp.dest('src/app/shared/'));
    done();
});
