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

    gulp.src(['gulp/flutter_native_splash.yaml'])
        .pipe(replace('[SPLASH_COLOR]', config.splash_color))
        .pipe(gulp.dest('.'));

    remoteSrc(['logo_banca.png'], {
        base: 'https://weebet.s3.amazonaws.com/' + config.slug + '/logos/'
    })
        .pipe(gulp.dest('assets/'));

    remoteSrc(['icone_app.png'], {
        base: 'https://weebet.s3.amazonaws.com/' + config.slug + '/logos/'
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
        .pipe(exec('rm -Rvf android/app/src/main/kotlin/*', options))
        .pipe(exec('mkdir -p android/app/src/main/kotlin/' + config.pkg_folder), options)
        .pipe(exec.reporter(reportOptions));

    gulp.src(['gulp/MainActivity.kt'])
        .pipe(replace('[PKG_NAME]', config.app_id))
        .pipe(gulp.dest('android/app/src/main/kotlin/' + config.pkg_folder + '/'));

    // Flutter Build commands
    gulp.src(['/'])
        .pipe(exec('flutter doctor', options))
        .pipe(exec('flutter pub get', options))
        .pipe(exec('flutter pub run flutter_launcher_icons:main', options))
        .pipe(exec('flutter pub run flutter_native_splash:create', options))
        .pipe(exec('flutter build apk --split-per-abi', options))
        .pipe(exec.reporter(reportOptions));


    done();
}
// -------------------------------------------------------------------------------------//
gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        url: "https://demo.wee.bet",
        nome: "Demo Weebet",
        slug: "demo.wee.bet",
        splash_color: "#222d32",
        app_id: "bet.wee.demo.app",
        pkg_folder: ("bet.wee.demo.app").split('.').join('/')
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        url: 'bet2.wee.bet',
        nome: 'BetSports',
        slug: 'bet2.wee.bet',
        app_id: ('bet.wee.bet2.app'),
        pkg_folder: ('bet2.wee.bet.app').split('.').reverse().join('/')
    });
});

/* Gulp Build */

gulp.task('custom-build', function (done) {
    tasks(done, {
        app_id: process.env.APP_ID,
        url: process.env.CLIENT_URL,
        nome: process.env.CLIENT_NAME,
        slug: process.env.APP_SLUG,
        splash_color: process.env.APP_SPLASH_COLOR,
        pkg_folder: (process.env.APP_ID).split('.').join('/')
    });
});
