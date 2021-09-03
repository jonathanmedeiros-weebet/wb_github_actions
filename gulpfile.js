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
        .pipe(gulp.dest('./'));

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

gulp.task('mjrsports.com', function () {
    tasks(done, {
        url: "http://mjrsports.com",
        nome: "MJR Sports",
        slug: "mjrsports.com",
        splash_color: "#024004",
        app_id: "com.mjrsports.app",
        pkg_folder: ("com.mjrsports.app").split('.').join('/')
    });
});

gulp.task('casadinha.com', function () {
    tasks(done, {
        url: "http://casadinha.com",
        nome: "Casadinha.com",
        slug: "casadinha.com",
        splash_color: "#e1e1e1",
        app_id: "com.casadinha.app",
        pkg_folder: ("com.casadinha.app").split('.').join('/')
    });
});

gulp.task('recifeesportes.wee.bet', function () {
    tasks(done, {
        url: "https://recifeesportes.wee.bet",
        nome: "RECIFE ESPORTES",
        slug: "recifeesportes.wee.bet",
        splash_color: "#f26225",
        app_id: "bet.wee.recifeesportes",
        pkg_folder: ("bet.wee.recifeesportes").split('.').join('/')
    });
});

gulp.task('alfasports.net', function () {
    tasks(done, {
        url: "https://alfasports.net",
        nome: "ALFA SPORTS",
        slug: "alfasports.net",
        splash_color: "#000000",
        app_id: "net.alfasports",
        pkg_folder: ("net.alfasports").split('.').join('/')
    });
});

gulp.task('amigosdabola.wee.bet', function () {
    tasks(done, {
        url: "http://amigosdabola.wee.bet",
        nome: "Amigos da Bola",
        slug: "amigosdabola.wee.bet",
        splash_color: "#002458",
        app_id: "bet.wee.amigosdabola.app",
        pkg_folder: ("bet.wee.amigosdabola.app").split('.').join('/')
    });
});

gulp.task('bet358.wee.bet', function () {
    tasks(done, {
        url: "http://bet358.wee.bet",
        nome: "Bet 358",
        slug: "bet358.wee.bet",
        splash_color: "#016534",
        app_id: "bet.wee.bet358.app",
        pkg_folder: ("bet.wee.bet358.app").split('.').join('/')
    });
});

gulp.task('betgyn.com', function () {
    tasks(done, {
        url: "https://betgyn.com",
        nome: "Bet",
        app_id: "com.betgyn.app",
        pkg_folder: ("com.betgyn.app").split('.').join('/'),
        slug: "betgyn.com",
        splash_color: "#002458"
    });
});

gulp.task('bets188.bet', function () {
    tasks(done, {
        url: "http://bets188.bet",
        nome: "Bets 188",
        app_id: "bet.bets188.app",
        pkg_folder: ("bet.bets188.app").split('.').join('/'),
        slug: "bets188.bet",
        splash_color: "#000000",
    });
});

gulp.task('betsbrasil.net', function () {
    tasks(done, {
        url: "https://betsbrasil.net",
        nome: "BETS BRASIL",
        app_id: "net.betsbrasil",
        pkg_folder: ("net.betsbrasil").split('.').join('/'),
        slug: "betsbrasil.net",
        splash_color: "#002458",
    });
});

gulp.task('betsbs.net', function () {
    tasks(done, {
        url: "http://betsbs.net",
        nome: "BETS BS",
        app_id: "net.betsbs",
        pkg_folder: ("net.betsbs").split('.').join('/'),
        slug: "betsbs.net",
        splash_color: "#002458",
    });
});

gulp.task('betsgol.net', function () {
    tasks(done, {
        url: "https://betsgol.wee.bet",
        nome: "BETS GOL",
        app_id: "net.betsgol",
        pkg_folder: ("net.betsgol").split('.').join('/'),
        slug: "betsgol.net",
        splash_color: "#002458",
    });
});

gulp.task('betsplacar.club', function () {
    tasks(done, {
        url: "http://betsplacar.club",
        nome: "Bets Placar",
        app_id: "club.betsplacar.app",
        pkg_folder: ("club.betsplacar.app").split('.').join('/'),
        slug: "betsplacar.club",
        splash_color: "#000000",
    });
});

gulp.task('esportmania.net', function () {
    tasks(done, {
        url: "https://esportmania.net",
        nome: "Esport Mania",
        app_id: "net.esportmania.app",
        pkg_folder: ("net.esportmania.app").split('.').join('/'),
        slug: "esportmania.net",
        splash_color: "#2c5b86",
    });
});

gulp.task('footbets.wee.bet', function () {
    tasks(done, {
        url: "http://footbets.wee.bet",
        nome: "footbets",
        app_id: "bet.wee.footbets.app",
        pkg_folder: ("bet.wee.footbets.app").split('.').join('/'),
        slug: "footbets.wee.bet",
        splash_color: "#000000",
    });
});


gulp.task('imperiosportve.com', function () {
    tasks(done, {
        url: "https://imperiosportve.com",
        nome: "imperio sportve",
        app_id: "com.imperiosportve.app",
        pkg_folder: ("com.imperiosportve.app").split('.').join('/'),
        slug: "imperiosportve.com",
        splash_color: "#5e0000",
    });
});

gulp.task('ligavip.wee.bet', function (done) {
    tasks(done, {
        url: "https://ligavip.wee.bet",
        nome: "LIGA VIP",
        app_id: "bet.wee.ligavip.app",
        pkg_folder: ("bet.wee.ligavip.app").split('.').join('/'),
        slug: "ligavip.wee.bet",
        splash_color: "#000000",
    });
});

gulp.task('3xbets.site', function (done) {
    tasks(done, {
        url: "https://3xbets.site",
        nome: "3X BETS",
        app_id: "site.tresxbets.app",
        pkg_folder: ("site.tresxbets.app").split('.').join('/'),
        slug: "3xbets.site",
        splash_color: "#002458",
    });
});


gulp.task('diretoriasport.bet', function (done) {
    tasks(done, {
        url: "https://diretoriasport.bet",
        nome: "3X BETS",
        app_id: "bet.diretoriasport.app",
        pkg_folder: ("bet.diretoriasport.app").split('.').join('/'),
        slug: "diretoriasport.bet",
        splash_color: "#002458",
    });
});

/* Gulp Build */

gulp.task('custom-build', function (done) {
    tasks(done, {
        url: process.env.CLIENT_URL,
        nome: process.env.CLIENT_NAME,
        app_id: process.env.APP_ID,
        pkg_folder: (process.env.APP_ID).split('.').join('/'),
        slug: process.env.APP_SLUG,
        splash_color: process.env.APP_SPLASH_COLOR
    });
});
























// hjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

gulp.task('esportbets.wee.bet', function (done) {
    tasks(done, {
        url: "https://esportbets.wee.bet",
        nome: "Esport Bets",
        slug: "esportbets.wee.bet",
        splash_color: "#004d59",
        app_id: "bet.wee.esportbets.app",
        pkg_folder: ("bet.wee.esportbets.app").split('.').join('/')
    });
});


gulp.task('scorpionsbet.wee.bet', function (done) {
    tasks(done, {
        url: "https://scorpionsbet.wee.bet",
        nome: "Scorpions Bet",
        slug: "scorpionsbet.wee.bet",
        splash_color: "#004211",
        app_id: "bet.wee.scorpionsbet.app",
        pkg_folder: ("bet.wee.scorpionsbet.app").split('.').join('/')
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