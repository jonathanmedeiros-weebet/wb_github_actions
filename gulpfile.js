var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');
var remoteSrc = require('gulp-remote-src');

function tasks(done, config) {
    gulp.src(['gulp/main.dart'])
        .pipe(replace('[HOST]', config.url))
        .pipe(replace('[NOME_BANCA]', config.nome))
        .pipe(gulp.dest('lib/'));

    gulp.src(['gulp/androidManifest/main/AndroidManifest.xml'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(replace('[NOME_BANCA]', config.nome))
        .pipe(gulp.dest('android/app/src/main/'));

    gulp.src(['gulp/androidManifest/profile/AndroidManifest.xml'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(gulp.dest('android/app/src/profile/'));

    gulp.src(['gulp/androidManifest/debug/AndroidManifest.xml'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(gulp.dest('android/app/src/debug/'));

    gulp.src(['gulp/build.gradle'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(gulp.dest('android/app/'));

    remoteSrc(['logo_banca.png'], {
        base: 'https://weebet.s3.amazonaws.com/' + config.url + '/logos/'
    })
        .pipe(gulp.dest('assets/'));

    remoteSrc(['icone_app.png'], {
        base: 'https://weebet.s3.amazonaws.com/' + config.url + '/logos/'
    })
        .pipe(gulp.dest('assets/'));


    var options = {
        continueOnError: false, // default = false, true means don't emit error event
        pipeStdout: false, // default = false, true means stdout is written to file.contents
        customTemplatingThing: "test" // content passed to lodash.template()
    };
    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };

    gulp.src('/')
        .pipe(exec('rm -Rvf android/app/src/main/kotlin/', options))
        .pipe(exec.reporter(reportOptions));

    gulp.src(['gulp/MainActivity.kt'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(gulp.dest('android/app/src/main/kotlin/' + config.pkg_folder + '/'));

    // Flutter Build commands
    gulp.src(['/'])
        .pipe(exec('flutter pub get', options))
        .pipe(exec('flutter pub run flutter_launcher_icons:main', options))
        .pipe(exec('flutter pub run flutter_native_splash:create', options))
        .pipe(exec('flutter build apk --split-per-abi', options))
        .pipe(exec.reporter(reportOptions));


    done();
}

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        url: 'demo.wee.bet',
        nome: 'Weebet Demo',
        app_id: ('demo.wee.bet').split('.').reverse().join('.'),
        pkg_folder: ('demo.wee.bet').split('.').reverse().join('/')
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        url: 'bet2.wee.bet',
        nome: 'BetSports',
        app_id: ('bet2.wee.bet').split('.').reverse().join('.'),
        pkg_folder: ('bet2.wee.bet').split('.').reverse().join('/')
    });
});