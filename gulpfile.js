var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');
var remoteSrc = require('gulp-remote-src');

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
            .pipe(replace('[SCRIPTS]', config.scripts))
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
            .pipe(replace('[SCRIPTS]', typeof config.scripts == "undefined"? "" : config.scripts))
            .pipe(gulp.dest('src/'));

        gulp.src(['styles.css'])
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(gulp.dest('src/'));

        remoteSrc(['logo_banca.png'], {
            base: 'http://central.' + config.host + '/tema/'})
            .pipe(gulp.dest('src/assets/images/'));

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
        styles: "",
    });
});

gulp.task('bet1.wee.bet', function (done) {
    tasks(done, {
        host: "bet1.wee.bet",
        banca: "SPORT BOM BET",
        styles: "",
        old: true
    });
});

gulp.task('betscorrego.com', function (done) {
    tasks(done, {
        host: "betscorrego.com",
        banca: "Bets Corrego",
        styles: "--header: #000000; --foreground-header: #b1c5e0; --sidebar-right:#000000; --foreground-sidebar-right: #fff; --sidebar-left: #000000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #292b75; --foreground-odds: #fff;"
    });
});

gulp.task('betcash.club', function (done) {
    tasks(done, {
        host: "betcash.club",
        banca: "Bet Cash",
        styles: ""
    });
});

gulp.task('betgyn.com', function (done) {
    tasks(done, {
        host: "betgyn.com",
        banca: "BetGyn",
        styles: ""
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
        styles: ""
    });
});

gulp.task('betsplay.bet', function (done) {
    tasks(done, {
        host: "betsplay.bet",
        banca: "BETS PLAY",
        styles: "",
    });
});

gulp.task('betsports99.net', function (done) {
    tasks(done, {
        host: "betsports99.net",
        banca: "BET SPORTS 99",
        styles: ""
    });
});

gulp.task('betsgol.wee.bet', function (done) {
    tasks(done, {
        host: "betsgol.wee.bet",
        banca: "Bets Gol",
        styles: "--header: #14805e; --foreground-header: #b1c5e0; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #14805e; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #046eef; --foreground-odds: #fff;"
    });
});

gulp.task('betpalmas.wee.bet', function (done) {
    tasks(done, {
        host: "betpalmas.wee.bet",
        banca: "Bet Palmas",
        styles: "--header: #00465C; --foreground-header: #b1c5e0; --sidebar-right:#00465C; --foreground-sidebar-right: #fff; --sidebar-left: #00465C; --foreground-sidebar-left: #fff; --highlight: #1690b8; --foreground-highlight: #aec3d8; --odds: #FF9200; --foreground-odds: #fff;"
    });
});

gulp.task('betvegas365.wee.bet', function (done) {
    tasks(done, {
        host: "betvegas365.wee.bet",
        banca: "Bet Vegas 365",
        styles: "--header: #027b5a; --foreground-header: #b1c5e0; --sidebar-right:#027b5a; --foreground-sidebar-right: #fff; --sidebar-left: #027b5a; --foreground-sidebar-left: #fff; --highlight: #e4131a; --foreground-highlight: #aec3d8; --odds: #d0b60a; --foreground-odds: #fff;"
    });
});

gulp.task('bolbets.net', function (done) {
    tasks(done, {
        host: "bolbets.net",
        banca: "Bol Bets",
        styles: ""
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
        styles: "",
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
        styles: "",
        scripts: "<!-- BEGIN JIVOSITE CODE {literal} -->\n" +
        "<script type='text/javascript'>\n" +
        "(function(){ var widget_id = '3zYgei0Snz';var d=document;var w=window;function l(){\n" +
        "  var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;\n" +
        "  s.src = '//code.jivosite.com/script/widget/'+widget_id\n" +
        "    ; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);}\n" +
        "  if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);}\n" +
        "  else{w.addEventListener('load',l,false);}}})();\n" +
        "</script>\n" +
        "<!-- {/literal} END JIVOSITE CODE -->"
    });
});

gulp.task('esportivatop.wee.bet', function(done) {
    tasks(done, {
        host: "esportivatop.wee.bet",
        banca: "Esportiva Top",
        styles: ""
    });
});

gulp.task('eurosportbet.wee.bet', function(done) {
    tasks(done, {
        host: "eurosportbet.wee.bet",
        banca: "Euro Sport",
        styles: ""
    });
});

gulp.task('gol.vlog.br', function (done) {
    tasks(done, {
        host: "gol.vlog.br",
        banca: "BRASIL GOL",
        styles: "",
        old: true
    });
});

gulp.task('maisporte.com', function (done) {
    tasks(done, {
        host: "www.maisporte.com",
        banca: "MAISPORTE",
        styles: "",
        old: true
    });
});

gulp.task('maisportes.com', function (done) {
    tasks(done, {
        host: "maisportes.com",
        banca: "Maisportes",
        styles: "--header: #011e46; --foreground-header: #b1c5e0; --sidebar-right:#ce0000; --foreground-sidebar-right: #fff; --sidebar-left: #ce0000; --foreground-sidebar-left: #fff; --highlight:#4CAF50; --foreground-highlight: #aec3d8; --odds: #011e46; --foreground-odds: #fff;",
    });
});

gulp.task('maissports.net', function (done) {
    tasks(done, {
        host: "maissports.net",
        banca: "MaisSports",
        styles: "",
        old: true
    });
});

gulp.task('major.wee.bet', function(done) {
    tasks(done, {
        host: "major.wee.bet",
        banca: "Major",
        styles: " --league: yellow;"
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
        styles: ""
    });
});

gulp.task('pagacerto.com', function (done) {
    tasks(done, {
        host: "pagacerto.com",
        banca: "BETMAIS",
        styles: "",
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
        styles: " --league: #FFFF66;"
    });
});

gulp.task('sportsbets.wee.bet', function (done) {
    tasks(done, {
        host: "sportsbets.wee.bet",
        banca: "Sports Bets",
        styles: ""
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
        styles: "",
    });
});

gulp.task('superbetsport.com', function (done) {
    tasks(done, {
        host: "superbetsport.com",
        banca: "SUPER BET SPORT",
        styles: " --league: yellow;",
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

gulp.task('sportsweb.wee.bet', function (done) {
    tasks(done, {
        host: "sportsweb.wee.bet",
        banca: "Sports Web",
        styles: "--header: #e4131a; --foreground-header: #b1c5e0; --sidebar-right:#e4131a; --foreground-sidebar-right: #fff; --sidebar-left: #e4131a; --foreground-sidebar-left: #fff; --highlight: #aec3d8; --foreground-highlight: #aec3d8; --odds: #f58731; --foreground-odds: #fff;"
    });
});

gulp.task('starbet.bet', function (done) {
    tasks(done, {
        host: "starbet.bet",
        banca: "Star Bet",
        styles: ""
    });
});


gulp.task('wasports.wee.bet', function (done) {
    tasks(done, {
        host: "wasports.wee.bet",
        banca: "WASPORTS",
        styles: "",
        old: true
    });
});

gulp.task('ergol31.wee.bet', function (done) {
    tasks(done, {
        host: "ergol31.wee.bet",
        banca: "ER GOL BET",
        styles: ""
    });
});

gulp.task('gbaesportes.com', function (done) {
    tasks(done, {
        host: "gbaesportes.com",
        banca: "GBA Esportes",
        styles: ""
    });
});

gulp.task('labets365.com', function (done) {
    tasks(done, {
        host: "labets365.com",
        banca: "La Bets 365",
        styles: ""
    });
});

gulp.task('betsw2.com', function (done) {
    tasks(done, {
        host: "betsw2.com",
        banca: "Bets W2",
        styles: "--header: #29863b; --foreground-header: #b1c5e0; --sidebar-right:#29863b; --foreground-sidebar-right: #fff; --sidebar-left: #29863b; --foreground-sidebar-left: #fff; --highlight: #9c1915; --foreground-highlight: #aec3d8; --odds: #dbb000; --foreground-odds: #fff;"
    });
});

gulp.task('ourobets.wee.bet', function (done) {
    tasks(done, {
        host: "ourobets.wee.bet",
        banca: "Ouro Bets",
        styles: ""
    });
});

gulp.task('sumobet365.wee.bet', function (done) {
    tasks(done, {
        host: "sumobet365.wee.bet",
        banca: "Sumo Bet 365",
        styles: "--header: #00ab4f; --foreground-header: #b1c5e0; --sidebar-right:#00ab4f; --foreground-sidebar-right: #fff; --sidebar-left: #00ab4f; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #000; --odds: #73c48c; --foreground-odds: #fff;"
    });
});


gulp.task('sportebets.com.br', function (done) {
    tasks(done, {
        host: "sportebets.com.br",
        banca: "Sporte Bets",
        styles: "--header: #ff6600; --foreground-header: #fff; --sidebar-right:#ff6600; --foreground-sidebar-right: #fff; --sidebar-left: #ff6600; " +
        "--foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #000; --odds: #000; --foreground-odds: #fff; --event-time: #fd7e14;"
    });
});
