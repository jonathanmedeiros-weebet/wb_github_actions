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
            .pipe(replace('[SLUG]', config.slug))
            .pipe(replace('[CENTRAL_URL]', config.centralUrl))
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
        url: "https://app.weebet.tech",
        centralUrl: process.env.CLIENT_CENTER_URL,
        nome: process.env.CLIENT_NAME,
        slug: process.env.APP_SLUG,
        splash_color: process.env.APP_SPLASH_COLOR,
        pkg_folder: (process.env.APP_ID).split('.').join('/')
    });
});

gulp.task('bet9.wee.bet', function (done) {
    return prepare({
        app_id: "bet.wee.bet9",
        url: "https://app.weebet.tech",
        nome: "APP BET9",
        slug: "bet9.wee.bet",
        centralUrl: 'https://central.bet9.wee.bet',
        splash_color: "#002458",
        pkg_folder: ('bet.wee.bet9').split('.').join('/')
    });
});

gulp.task('ragnar.bet', function (done) {
    return prepare({
        app_id: "bet.ragnar",
        url: "https://app.weebet.tech",
        nome: "APP ragnar",
        slug: "ragnar.bet",
        centralUrl: 'https://central.ragnar.bet',
        splash_color: "#002458",
        pkg_folder: ('bet.ragnar').split('.').join('/')
    });
});

gulp.task('betboladavez.wee.bet', function (done) {
    return prepare({
        app_id: "bet.wee.betboladavez",
        url: "https://app.weebet.tech",
        nome: "APP Betboladavez",
        slug: "betboladavez.wee.bet",
        centralUrl: 'https://central.betboladavez.online',
        splash_color: "#002458",
        pkg_folder: ('bet.wee.betboladavez').split('.').join('/')
    });
});

gulp.task('redblue.bet', function (done) {
    return prepare({
        app_id: "bet.wee.redblue",
        url: "https://app.weebet.tech",
        nome: "Red Blue",
        slug: "redblue.wee.bet",
        centralUrl: 'https://central.redblue.bet',
        splash_color: "#002458",
        pkg_folder: ('bet.wee.redblue').split('.').join('/')
    });
});

gulp.task('majovip.net', function (done) {
    return prepare({
        app_id: "net.majovip",
        url: "https://app.weebet.tech",
        nome: "Majo Vip",
        slug: "majovip.net",
        centralUrl: 'https://central.majovip.net',
        splash_color: "#002458",
        pkg_folder: ('net.majovip').split('.').join('/')
    });
});

gulp.task('asortebets.com', function (done) {
    return prepare({
        app_id: "com.asortebets",
        url: "https://app.weebet.tech",
        nome: "A Sorte Bets",
        slug: "asortebets.com",
        centralUrl: 'https://central.asortebets.com',
        splash_color: "#002458",
        pkg_folder: ('com.asortebets').split('.').join('/')
    });
});