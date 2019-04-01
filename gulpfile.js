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
        //.pipe(exec('scp -r -i ~/.keystore/weebet.pem dist/* ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/app/', options))
        //.pipe(exec('tar -cf dist/* | ssh -i ~/.keystore/weebet.pem ubuntu@' + config.host + ' "cat >  dist/* ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/app/', options))
        .pipe(exec('cd dist && tar -cf tosend.tar * && scp -r -i ~/.keystore/weebet.pem tosend.tar ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/app/ && ssh -i ~/.keystore/weebet.pem ubuntu@' + config.host + ' tar -xvf /var/www/prod/bets/' + config.host + '/app/tosend.tar -C /var/www/prod/bets/' + config.host + '/app', options))
        .pipe(exec.reporter(reportOptions));

    done();

};

gulp.task('baraosports.wee.bet', function (done) {
    tasks(done, {
        host: "baraosports.wee.bet",
        banca: "Barão Sports",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
    });
});

gulp.task('bet1.wee.bet', function (done) {
    tasks(done, {
        host: "bet1.wee.bet",
        banca: "SPORT BOM BET",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('betcash.club', function (done) {
    tasks(done, {
        host: "betcash.club",
        banca: "Bet Cash",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betgyn.com', function (done) {
    tasks(done, {
        host: "betgyn.com",
        banca: "BetGyn",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betsbr.club', function (done) {
    tasks(done, {
        host: "betsbr.club",
        banca: "Bets BR",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('betsgame.wee.bet', function (done) {
    tasks(done, {
        host: "betsgame.wee.bet",
        banca: "Bet$game",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betsplay.bet', function (done) {
    tasks(done, {
        host: "betsplay.bet",
        banca: "BETS PLAY",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
    });
});

gulp.task('betsports99.net', function (done) {
    tasks(done, {
        host: "betsports99.net",
        banca: "BET SPORTS 99",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('bestgol.wee.bet', function (done) {
    tasks(done, {
        host: "bestgol.wee.bet",
        banca: "Best Gol",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betpalmas.wee.bet', function (done) {
    tasks(done, {
        host: "betpalmas.wee.bet",
        banca: "Bet Palmas",
        styles: "--header: #00465C; --foreground-header: #b1c5e0; --sidebar-right:#00465C; --foreground-sidebar-right: #fff; --sidebar-left: #00465C; --foreground-sidebar-left: #fff; --highlight: #FF9200; --foreground-highlight: #aec3d8; --odds: #FF9200; --foreground-odds: #fff;"
    });
});

gulp.task('betvegas365.wee.bet', function (done) {
    tasks(done, {
        host: "betvegas365.wee.bet",
        banca: "Bet Vegas 365",
        styles: "--header: #027b5a; --foreground-header: #b1c5e0; --sidebar-right:#027b5a; --foreground-sidebar-right: #fff; --sidebar-left: #027b5a; --foreground-sidebar-left: #fff; --highlight: #d0b60a; --foreground-highlight: #aec3d8; --odds: #d0b60a; --foreground-odds: #fff;"
    });
});

gulp.task('bolbets.net', function (done) {
    tasks(done, {
        host: "bolbets.net",
        banca: "Bol Bets",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('casadinha.wee.bet', function(done) {
    tasks(done, {
        host: "casadinha.wee.bet",
        banca: "Casadinha.com",
        styles: "--header: #999999; --foreground-header: #b1c5e0; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #fd7e14; --foreground-highlight: #011e46; --odds: #046eef; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        old: true
    });
});

gulp.task('chutecerto.club', function (done) {
    tasks(done, {
        host: "chutecerto.club",
        banca: "Chute Certo",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('ciabets.wee.bet', function (done) {
    tasks(done, {
        host: "ciabets.wee.bet",
        banca: "CiaBets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('esportivatop.wee.bet', function(done) {
    tasks(done, {
        host: "esportivatop.wee.bet",
        banca: "Esportiva Top",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('eurosportbet.wee.bet', function(done) {
    tasks(done, {
        host: "eurosportbet.wee.bet",
        banca: "Euro Sport",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('gol.vlog.br', function (done) {
    tasks(done, {
        host: "gol.vlog.br",
        banca: "BRASIL GOL",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('maisporte.com', function (done) {
    tasks(done, {
        host: "www.maisporte.com",
        banca: "MAISPORTE",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('maisportes.com', function (done) {
    tasks(done, {
        host: "maisportes.com",
        banca: "Maisportes",
        styles: "--header: #011e46; --foreground-header: #b1c5e0; --sidebar-right:#ce0000; --foreground-sidebar-right: #fff; --sidebar-left: #ce0000; --foreground-sidebar-left: #fff; --highlight:#4CAF50; --foreground-highlight: #aec3d8; --odds: #011e46; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('maissports.net', function (done) {
    tasks(done, {
        host: "maissports.net",
        banca: "MaisSports",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('major.wee.bet', function(done) {
    tasks(done, {
        host: "major.wee.bet",
        banca: "Major",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});


gulp.task('mjrsports.com', function (done) {
    tasks(done, {
        host: "mjrsports.com",
        banca: "MJR SPORTS",
        styles: "--header: #3F6826; --foreground-header: #b1c5e0; --sidebar-right: #3B5323; --foreground-sidebar-right: #fff; --sidebar-left: #3B5323; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: #dab600; --foreground-odds: #fff; --selected-event: #000;",
    });
});

gulp.task('oliverbet.com', function (done) {
    tasks(done, {
        host: "oliverbet.com",
        banca: "Oliver Bet",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('pagacerto.com', function (done) {
    tasks(done, {
        host: "pagacerto.com",
        banca: "BETMAIS",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('sertaobets.com', function (done) {
    tasks(done, {
        host: "sertaobets.com",
        banca: "Sertão Bets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('soccerbetting.wee.bet', function (done) {
    tasks(done, {
        host: "soccerbetting.wee.bet",
        banca: "Soccer Betting",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff; --league: #FFFF66;"
    });
});

gulp.task('sportsbets.wee.bet', function (done) {
    tasks(done, {
        host: "sportsbets.wee.bet",
        banca: "Sports Bets",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('sportsshow.wee.bet', function (done) {
    tasks(done, {
        host: "sportsshow.wee.bet",
        banca: "Sports Show",
        styles: "--header: #89221a; --foreground-header: #b1c5e0; --sidebar-right:#89221a; --foreground-sidebar-right: #fff; --sidebar-left: #89221a; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #711912; --foreground-odds: #fff;"
    });
});

gulp.task('superbets.bet', function (done) {
    tasks(done, {
        host: "superbets.bet",
        banca: "SUPERBETS",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
    });
});

gulp.task('superbetsport.com', function (done) {
    tasks(done, {
        host: "superbetsport.com",
        banca: "SUPER BET SPORT",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff; --league: yellow;",
    });
});

gulp.task('trevodasorte.me', function (done) {
    tasks(done, {
        host: "trevodasorte.me",
        banca: "Trevo da Sorte",
        styles: "--header: #4caf50; --foreground-header: #cce2ff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #4caf50; --foreground-odds: #fff;",
        old: true
    });
});

gulp.task('starbet.bet', function (done) {
    tasks(done, {
        host: "starbet.bet",
        banca: "Star Bet",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});


gulp.task('wasports.wee.bet', function (done) {
    tasks(done, {
        host: "wasports.wee.bet",
        banca: "WASPORTS",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right:#011e46; --foreground-sidebar-right: #fff; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;",
        old: true
    });
});
