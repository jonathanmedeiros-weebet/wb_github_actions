var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');
var remoteSrc = require('gulp-remote-src');

function tasks(done, config) {
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

    gulp.src(['/'])
        .pipe(exec('flutter doctor', options))
        .pipe(exec('flutter pub get', options))
        .pipe(exec('flutter pub run flutter_launcher_icons:main', options))
        .pipe(exec('flutter pub run flutter_native_splash:create', options))
        .pipe(exec('flutter build apk --split-per-abi', options))
        .pipe(exec.reporter(reportOptions));

    done();
}

async function prepare(config) {
    try {
        gulp.src(['gulp/my_app.dart'])
            .pipe(replace('[HOST]', config.url))
            .pipe(replace('[NOME_BANCA]', config.nome))
            .pipe(replace('[SPLASH_COLOR]', config.splash_color.replace('#', '')))
            .pipe(gulp.dest('lib/'));

        gulp.src(['gulp/AndroidManifest.xml'])
            .pipe(replace('[PKG_NAME]', config.app_id))
            .pipe(replace('[NOME_BANCA]', config.nome))
            .pipe(gulp.dest('android/app/src/main/'));

        gulp.src(['gulp/local.properties'])
            .pipe(replace('[PKG_NAME]', config.app_id))
            .pipe(gulp.dest('android/'));

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

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

/* Gulp Build */
gulp.task('prepare-build', function () {
    return prepare({
        app_id: process.env.APP_ID,
        url: process.env.CLIENT_URL,
        nome: process.env.CLIENT_NAME,
        slug: process.env.APP_SLUG,
        splash_color: process.env.APP_SPLASH_COLOR,
        pkg_folder: (process.env.APP_ID).split('.').join('/')
    });
});

gulp.task('debug-build', function (done) {
    return prepare({
        app_id: "bet.wee.debug.app",
        url: "http://192.168.0.87:4200",
        nome: "DEBUG WEEBET",
        slug: "weebet.local",
        splash_color: "#000000",
        pkg_folder: ('bet.wee.debug.app').split('.').join('/')
    });
});

gulp.task('build-betnazebra', function (done) {
    return prepare({
        app_id: "br.com.betnazebra.app",
        url: "https://betnazebra.com.br",
        nome: "BetNaZebra",
        slug: "betnazebra.com.br",
        splash_color: "#000000",
        pkg_folder: ('br.com.betnazebra.app').split('.').join('/')
    });
});

gulp.task('build-a7bet.fun', function (done) {
    return prepare({
        app_id: "com.a7bet.app",
        url: "https://a7bet.fun",
        nome: "A7bet",
        slug: "a7bet.fun",
        splash_color: "#222d32",
        pkg_folder: ('com.a7bet.app').split('.').join('/')
    });
});

gulp.task('build-lite-alfa', function (done) {
    return prepare({
        app_id: "net.alfasports.app.lite",
        url: "https://alfasports.net",
        nome: "Alfa Sports Lite",
        slug: "alfasports.net",
        splash_color: "#002458",
        pkg_folder: ('net.alfasports.app.lite').split('.').join('/')
    });
});

gulp.task('build-appjetbet365.com', function (done) {
    return prepare({
        app_id: "com.appjetbet365.app",
        url: "https://appjetbet365.com",
        nome: "APP JETBET365",
        slug: "appjetbet365.com",
        splash_color: "#002458",
        pkg_folder: ('com.appjetbet365.app').split('.').join('/')
    });
});