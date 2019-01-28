var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');

function tasks(done, config) {
    if(config.old) {
        console.log("antigo");
        gulp.src(['config.ts'])
            .pipe(replace('[HOST]', config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/app/shared/'));

        gulp.src(['index.html'])
            .pipe(replace('[HOST]', config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/'));

        gulp.src(['styles.css'])
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(gulp.dest('src/'));
    }
    else{
        console.log("novo");
        gulp.src(['config.ts'])
            .pipe(replace('[HOST]', 'central.' + config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/app/shared/'));

        gulp.src(['index.html'])
            .pipe(replace('[HOST]', 'central.' + config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/'));

        gulp.src(['styles.css'])
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(gulp.dest('src/'));
    }

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
        .pipe(exec('ng build --prod --aot', options))
        .pipe(exec('scp -r -i ~/.keystore/weebet.pem dist/* ubuntu@'+config.host+':/var/www/prod/bets/'+config.host+'/app/', options))
        .pipe(exec.reporter(reportOptions));

    done();

};

gulp.task('betcash.club', function(done) {
    tasks(done, {
        host: "betcash.club",
        banca: "Bet Cash",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betgyn.com', function(done) {
    tasks(done, {
        host: "betgyn.com",
        banca: "BetGyn",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('ciabets.wee.bet', function(done) {
    tasks(done, {
        host: "ciabets.wee.bet",
        banca: "CiaBets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('demo.wee.bet', function(done) {
    tasks(done, {
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('maisportes.com', function(done) {
    tasks(done, {
        host: "maisportes.com",
        banca: "Maisportes",
        styles: "--header: #011e46; --foreground-header: #b1c5e0; --sidebar-right:#ce0000; --foreground-sidebar-right: #fff; --sidebar-left: #ce0000; --foreground-sidebar-left: #fff; --highlight:#4CAF50; --foreground-highlight: #aec3d8; --odds: #011e46; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('mjrsports.com', function(done) {
    tasks(done, {
        host: "mjrsports.com",
        banca: "MJR SPORTS",
        styles: "--header: #3F6826; --foreground-header: #b1c5e0; --sidebar-right: #3B5323; --foreground-sidebar-right: #fff; --sidebar-left: #3B5323; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: #dab600; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('netmaniasports.wee.bet', function(done) {
    tasks(done, {
        host: "netmaniasports.wee.bet",
        banca: "Net Mania Sports",
        styles: "--header: black; --foreground-header: #b1c5e0; --sidebar-right: black; --foreground-sidebar-right: #fff; --sidebar-left: black; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: black; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('trevodasorte.me', function(done) {
    tasks(done, {
        host: "trevodasorte.me",
        banca: "Trevo da Sorte",
        styles: "--header: #4caf50; --foreground-header: #cce2ff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #4caf50; --foreground-odds: #fff;",
        old: true
    });
});
