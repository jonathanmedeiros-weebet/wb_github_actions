var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');
var remoteSrc = require('gulp-remote-src');

function tasks(done, config) {
    if (config.old) {
        console.log("antigo");
        gulp.src(['config.ts'])
            .pipe(replace('[HOST]', config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/app/shared/'));

        gulp.src(['index.html'])
            .pipe(replace('[HOST]', config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(replace('[SCRIPTS]', config.scripts))
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined" ? "" : config.aditional_styles))
            .pipe(gulp.dest('src/'));

        /*gulp.src(['styles.css'])
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined"? "" : config.aditional_styles))
            .pipe(gulp.dest('src/'));
*/
        remoteSrc(['logo_banca.png'], {
            base: 'http://' + config.host + '/tema/'
        })
            .pipe(gulp.dest('src/assets/images/'));
    }
    else {
        console.log("novo");
        gulp.src(['config.ts'])
            .pipe(replace('[HOST]', 'central.' + config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(gulp.dest('src/app/shared/'));

        gulp.src(['index.html'])
            .pipe(replace('[HOST]', 'central.' + config.host))
            .pipe(replace('[BANCA]', config.banca))
            .pipe(replace('[SCRIPTS]', typeof config.scripts == "undefined" ? "" : config.scripts))
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined" ? "" : config.aditional_styles))
            .pipe(gulp.dest('src/'));

        /*gulp.src(['styles.css'])
            .pipe(replace('[CUSTOM]', config.styles))
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined"? "" : config.aditional_styles))
            .pipe(gulp.dest('src/'));
*/
        remoteSrc(['logo_banca.png'], {
            base: 'http://central.' + config.host + '/tema/'
        })
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
        .pipe(exec('ng build --prod --aot --buildOptimizer=true', options))
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
        styles: ""
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
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
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

gulp.task('casadinha.com', function (done) {
    tasks(done, {
        host: "casadinha.com",
        banca: "Casadinha.com",
        styles: "--header: #999999; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        aditional_styles: ".odds .selecionado{ background: #24415f!important; } .odds .selecionado span{ color: #fff!important; } #fixed-bar-bilhete{ background: #67ad5a!important; }"
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
        styles: ""
    });
});

gulp.task('esportivatop.wee.bet', function (done) {
    tasks(done, {
        host: "esportivatop.wee.bet",
        banca: "Esportiva Top",
        styles: ""
    });
});

gulp.task('eurosportbet.wee.bet', function (done) {
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
        styles: "--header: #4caf50; --foreground-header: #fff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds: #4caf50; --foreground-odds: #fff;",
    });
});

gulp.task('maisporte.com', function (done) {
    tasks(done, {
        host: "www.maisporte.com",
        banca: "MAISPORTE",
        styles: "--header: #2c5b86; --foreground-header: #fff; --sidebar-right:#052c50; --foreground-sidebar-right: #fff; --sidebar-left: #052c50; --foreground-sidebar-left: #fff; --highlight:#de2c37; --foreground-highlight: #dba000; --odds: #2c5b86; --foreground-odds: #dba000; --league: #dba00f; --foreground-league: #000;",
        old: true,
        aditional_styles: ".odds .inner-odd span { font-weight: bold!important; } "
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
        styles: "--header: #9a0003; --foreground-header: #fff; --sidebar-right:#9a0003; --foreground-sidebar-right: #fff; --sidebar-left: #f4f4f4; --foreground-sidebar-left: #000; --highlight:#ffc107; --foreground-highlight: #000; --odds: #c10d0d; --foreground-odds: #fff;"
    });
});

gulp.task('major.wee.bet', function (done) {
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
        banca: "Paga Certo",
        styles: "",
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
        scripts: "<!-- BEGIN JIVOSITE CODE {literal} --> <script type='text/javascript'> (function(){ var widget_id = 'BFi2cJVRo0';var d=document;var w=window;function l(){ var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id ; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);} if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);} else{w.addEventListener('load',l,false);}}})(); </script> <!-- {/literal} END JIVOSITE CODE -->"
    });
});

gulp.task('trevodasorte.me', function (done) {
    tasks(done, {
        host: "trevodasorte.me",
        banca: "Trevo da Sorte",
        styles: "--header: #4caf50; --foreground-header: #cce2ff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #4caf50; --foreground-odds: #fff;",
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
        styles: ""
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
        styles: "",
        aditional_styles: ".sidebar-brand{ margin-top: 0!important; } .sidebar-brand img{ max-width: 100%!important; max-height: none!important; }"
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
        styles: "--header: #ff6600; --foreground-header: #fff; --sidebar-right:#ff6600; --foreground-sidebar-right: #fff; --sidebar-left: #ff6600; --league: #21bb3f; --foreground-league: #fff;" +
            "--foreground-sidebar-left: #fff; --highlight: #ff6600; --foreground-highlight: #000; --odds: #000; --foreground-odds: #fff; --event-time: #21bb3f;",
        aditional_styles: ".pre-bilhete .div-inputs{ background-color: #21bb3f!important; } .mais-opcoes{ color: #21bb3f!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #000!important; } .remover-item .fa-times{ color: #fff!important; } "
    });
});

gulp.task('jvsports.bet', function (done) {
    tasks(done, {
        host: "jvsports.bet",
        banca: "JV Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #da251c; --odds: #da251c; --foreground-odds: #fff;"
    });
});

gulp.task('foxsport.wee.bet', function (done) {
    tasks(done, {
        host: "foxsport.wee.bet",
        banca: "Fox Sport",
        styles: "            --header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e;  --foreground-league: #000;",
        aditional_styles: ".menu-categories .active a {color: #003f7f!important;} .odds .selecionado span{color:#fff!important;} .content-header h2{color:#003f7f!important;}",
    });
});

gulp.task('moralsports.net', function (done) {
    tasks(done, {
        host: "moralsports.wee.bet",
        banca: "Moral Sports",
        styles: "--header: #006cb7; --foreground-header: #fff; --sidebar-right:#11297e; --foreground-sidebar-right: #fff; --sidebar-left: #11297e; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds: #006cb7; --foreground-odds: #fff;",
        aditional_styles: " .navbar-mobile{ background: #11297e!important } "
    });
});

gulp.task('esportbets.wee.bet', function (done) {
    tasks(done, {
        host: "esportbets.wee.bet",
        banca: "Esport Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('falcaosport.wee.bet', function (done) {
    tasks(done, {
        host: "falcaosport.wee.bet",
        banca: "Falcão Sport",
        styles: "--header: #FF0000; --foreground-header: #fff; --sidebar-right:#8B0000; --foreground-sidebar-right: #fff; --sidebar-left: #8B0000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds: #FF0000; --foreground-odds: #fff;"
    });
});

gulp.task('megapremium.wee.bet', function (done) {
    tasks(done, {
        host: "megapremium.wee.bet",
        banca: "MEGA PREMIUM",
        styles: "",
    });
});

gulp.task('lancenet.wee.bet', function (done) {
    tasks(done, {
        host: "lancenet.wee.bet",
        banca: "Lancenet",
        styles: "",
    });
});

gulp.task('redblue.wee.bet', function (done) {
    tasks(done, {
        host: "redblue.wee.bet",
        banca: "Red Blue",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#333; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('bets45.wee.bet', function (done) {
    tasks(done, {
        host: "bets45.wee.bet",
        banca: "Bets45",
        styles: "",
    });
});

gulp.task('sportchampions.bet', function (done) {
    tasks(done, {
        host: "sportchampions.bet",
        banca: "Sport Champions",
        styles: "--header: #00465C; --foreground-header: #b1c5e0; --sidebar-right:#00465C; --foreground-sidebar-right: #fff; --sidebar-left: #00465C; --foreground-sidebar-left: #fff; --highlight: #1690b8; --foreground-highlight: #aec3d8; --odds: #FF9200; --foreground-odds: #fff;",
    });
});

gulp.task('snookerbets.bet', function (done) {
    tasks(done, {
        host: "snookerbets.bet",
        banca: "Snooker Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #f0c027;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('showdoesporte.net', function (done) {
    tasks(done, {
        host: "showdoesporte.net",
        banca: "Show do Esporte",
        styles: "--header: #012459; --foreground-header: #fff; --sidebar-right:#012459; --foreground-sidebar-right: #fff; --sidebar-left: #012459; --foreground-sidebar-left: #fff; --highlight: #ec0205; --foreground-highlight: #fff;",
        aditional_styles: ".odds .selecionado span, .odds .inner-odd:hover span{ color: #fff!important; }"
    });
});

gulp.task('onbets.club', function (done) {
    tasks(done, {
        host: "onbets.club",
        banca: "On Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #f0c027;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('copaesporte.com', function (done) {
    tasks(done, {
        host: "copaesporte.com",
        banca: "Copa Esporte",
        styles: "--header: #000; --foreground-header: #ffffff;--sidebar-right: #000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #045199; --foreground-highlight: #ffffff; --odds: red; --foreground-odds: #fff; --foreground-selected-odds: #fff; --foreground-league: #000;",
    });
});

gulp.task('apostapremiada.bet', function (done) {
    tasks(done, {
        host: "apostapremiada.bet",
        banca: "Aposta Premiada",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fc6402; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #fc6402;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        host: "bet2.wee.bet",
        banca: "BetSports",
        styles: ""
    });
});

gulp.task('bet3.wee.bet', function (done) {
    tasks(done, {
        host: "bet3.wee.bet",
        banca: "Bet3",
        styles: ""
    });
});

gulp.task('bet4.wee.bet', function (done) {
    tasks(done, {
        host: "bet4.wee.bet",
        banca: "Fut Sport",
        styles: "",
        scripts: "<!-- BEGIN JIVOSITE CODE {literal} --> <script type='text/javascript'> (function(){ var widget_id = 'uC0MDVRaka';var d=document;var w=window;function l(){ var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id ; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);} if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);} else{w.addEventListener('load',l,false);}}})(); </script> <!-- {/literal} END JIVOSITE CODE -->"
    });
});

gulp.task('bet5.wee.bet', function (done) {
    tasks(done, {
        host: "bet5.wee.bet",
        banca: "Total Sorte",
        styles: ""
    });
});

gulp.task('bet6.wee.bet', function (done) {
    tasks(done, {
        host: "bet6.wee.bet",
        banca: "Bet6",
        styles: ""
    });
});

gulp.task('bet6.wee.bet', function (done) {
    tasks(done, {
        host: "bet6.wee.bet",
        banca: "Bet6",
        styles: ""
    });
});

gulp.task('copasports.wee.bet', function (done) {
    tasks(done, {
        host: "copasports.wee.bet",
        banca: "Copa Sports",
        styles: ""
    });
});

gulp.task('topbets.wee.bet', function (done) {
    tasks(done, {
        host: "topbets.wee.bet",
        banca: "Top Bets",
        styles: ""
    });
});

gulp.task('topbets.me', function (done) {
    tasks(done, {
        host: "topbets.me",
        banca: "Top Bets",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;"
    });
});

gulp.task('esportmania.net', function (done) {
    tasks(done, {
        host: "esportmania.net",
        banca: "Esport Mania",
        styles: "--header: #2c5b86; --foreground-header: #fff; --sidebar-right:#052c50; --foreground-sidebar-right: #fff; --sidebar-left: #052c50; --foreground-sidebar-left: #fff; --highlight:#de2c37; --foreground-highlight: #dba000; --odds: #2c5b86; --foreground-odds: #dba000; --league: #dba00f; --foreground-league: #000;",
        aditional_styles: ".odds .inner-odd span { font-weight: bold!important; } "
    });
});

gulp.task('xbetsports.net', function (done) {
    tasks(done, {
        host: "xbetsports.net",
        banca: "XBET SPORTS",
        styles: "--header: #002458; --foreground-header: #b1c5e0; --sidebar-right: #011e46; --foreground-sidebar-right: #b1c5e0; --sidebar-left: #011e46; --foreground-sidebar-left: #fff; --highlight: #008ef6; --foreground-highlight: #fff; --odds: #ffb701; --foreground-odds: #000; --selected-event: #000;--league: #e1e2e4;--foreground-league: #455a64;--selected-event: #002458;--foreground-selected-event: #fff;--event-time: #011e46;--fg-event-time: #fff;--foreground-selected-odds:#fff",
        scripts: '<script async data-id="12237" src="https://cdn.widgetwhats.com/script.min.js"></script>'
    });
});

gulp.task('caicobets.wee.bet', function (done) {
    tasks(done, {
        host: "caicobets.wee.bet",
        banca: "Caicó Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('foxbet.me', function (done) {
    tasks(done, {
        host: "foxbet.me",
        banca: "Fox Bet",
        styles: "--header: #000000; --foreground-header: #ffffff; --sidebar-right: #000000; --foreground-sidebar-right: #fff; --sidebar-left: #000000; --foreground-sidebar-left: #fff; --highlight: #f28123; --foreground-highlight: #ffffff; --odds: #0c9fa0; --foreground-odds: #fff; --event-time: #f58021;",
    });
});

gulp.task('club7bets.wee.bet', function (done) {
    tasks(done, {
        host: "club7bets.wee.bet",
        banca: "Club 7 Bets",
        styles: "--header: #2c5b86; --foreground-header: #fff; --sidebar-right:#052c50; --foreground-sidebar-right: #fff; --sidebar-left: #052c50; --foreground-sidebar-left: #fff; --highlight:#de2c37; --foreground-highlight: #dba000; --odds: #2c5b86; --foreground-odds: #dba000; --league: #dba00f; --foreground-league: #000;",
        aditional_styles: ".odds .inner-odd span { font-weight: bold!important; } "
    });
});

gulp.task('bet7.wee.bet', function (done) {
    tasks(done, {
        host: "bet7.wee.bet",
        banca: "Bet7",
        styles: ""
    });
});

gulp.task('bet8.wee.bet', function (done) {
    tasks(done, {
        host: "bet8.wee.bet",
        banca: "Bet8",
        styles: ""
    });
});

gulp.task('apostagyn.bet', function (done) {
    tasks(done, {
        host: "apostagyn.bet",
        banca: "Aposta Gyn",
        styles: "--header: #fff; --foreground-header: #000; --sidebar-right: #fff; --foreground-sidebar-right: #000; --sidebar-left: #fff; --foreground-sidebar-left: #000; --highlight: red; --foreground-highlight: #003f7f; --odds: #003f7f; --foreground-odds: #fff; --event-time: red;",
        aditional_styles: ".menu-categories .active a {color: #003f7f!important;} .odds .selecionado span{color:#fff!important;} .content-header h2{color:#003f7f!important;}",
        scripts: "<!-- BEGIN JIVOSITE CODE {literal} --> <script type='text/javascript'> (function(){ var widget_id = 'EgFLiIk885'; var d=document;var w=window;function l(){ var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id ; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);} if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);} else{w.addEventListener('load',l,false);}}})(); </script> <!-- {/literal} END JIVOSITE CODE -->"
    });
});

gulp.task('sportsbets.fun', function (done) {
    tasks(done, {
        host: "sportsbets.fun",
        banca: "Sports Bets",
        styles: ""
    });
});

gulp.task('trimaniabet.wee.bet', function (done) {
    tasks(done, {
        host: "trimaniabet.wee.bet",
        banca: "TriMania Bet",
        styles: "--header: #32285f; --foreground-header: #fff; --sidebar-right:#32285f; --foreground-sidebar-right: #fff; --sidebar-left: #32285f; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #fa1919; --foreground-odds: #fff;"
    });
});

gulp.task('paraibabets.com', function (done) {
    tasks(done, {
        host: "paraibabets.com",
        banca: "Paraíba Bets",
        styles: "--header: #3f3f3f; --foreground-header: #fff; --sidebar-right:#3f3f3f; --foreground-sidebar-right: #fff; --sidebar-left: #3f3f3f; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #0d87d2; --foreground-odds: #fff;"
    });
});

gulp.task('betsport.wee.bet', function (done) {
    tasks(done, {
        host: "betsport.wee.bet",
        banca: "Bet Sport",
        styles: ""
    });
});

gulp.task('akiapostas.wee.bet', function (done) {
    tasks(done, {
        host: "akiapostas.wee.bet",
        banca: "AKI Apostas",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;"
    });
});

gulp.task('arenabet199.wee.bet', function (done) {
    tasks(done, {
        host: "arenabet199.wee.bet",
        banca: "Arenabet 199",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #fff; --odds: #fe7800; --foreground-odds: #333; --event-time: #000; --league: #313131; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('camaleaobet.com', function (done) {
    tasks(done, {
        host: "camaleaobet.com",
        banca: "Camaleão Bet",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('localbets.club', function (done) {
    tasks(done, {
        host: "localbets.wee.bet",
        banca: "Local Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('futebolbetsworld.com', function (done) {
    tasks(done, {
        host: "futebolbetsworld.com",
        banca: "Futebol Bets World",
        styles: ""
    });
});

gulp.task('megasports.bet', function (done) {
    tasks(done, {
        host: "megasports.bet",
        banca: "Mega Sports",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#333; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('fanaticsports.bet', function (done) {
    tasks(done, {
        host: "fanaticsports.bet",
        banca: "Fanatic Sports",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#333; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('geraisesportenet.wee.bet', function (done) {
    tasks(done, {
        host: "geraisesportenet.wee.bet",
        banca: "GERAIS ESPORTE NET",
        styles: ""
    });
});

gulp.task('jsportbet.com', function (done) {
    tasks(done, {
        host: "jsportbet.com",
        banca: "JSport Bet",
        styles: ""
    });
});

gulp.task('acaisports.bet', function (done) {
    tasks(done, {
        host: "acaisports.bet",
        banca: "Açaí Sports",
        styles: "--header: #4e237f; --foreground-header: #fff; --sidebar-right:#4e237f; --foreground-sidebar-right: #fff; --sidebar-left: #4e237f; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #3ba437; --foreground-odds: #fff;"
    });
});

gulp.task('lance.bet', function (done) {
    tasks(done, {
        host: "lance.bet",
        banca: "Lance Bet",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #fa8512; --foreground-odds: #fff; --event-time: #fa8512; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('masterbet.wee.bet', function (done) {
    tasks(done, {
        host: "masterbet.wee.bet",
        banca: "MasterBet",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('web.betzeta.com', function (done) {
    tasks(done, {
        host: "web.betzeta.com",
        banca: "Bet Zeta",
        styles: "--header: #ffb80c; --foreground-header: #000; --sidebar-right:#ffb80c; --foreground-sidebar-right: #000; --sidebar-left: #ffb80c; --foreground-sidebar-left: #000; --highlight:red; --foreground-highlight: #000; --odds: #000; --foreground-odds: #fff;",
        scripts: "<!--Start of Tawk.to Script--> <script type='text/javascript'> var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0]; s1.async=true; s1.src='https://embed.tawk.to/5d4852bf7d27204601c964d6/default'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })(); </script> <!--End of Tawk.to Script-->"
    });
});

gulp.task('premierbets.club', function (done) {
    tasks(done, {
        host: "premierbets.club",
        banca: "Premier Bets",
        styles: ""
    });
});

gulp.task('fortunasports.bet', function (done) {
    tasks(done, {
        host: "fortunasports.bet",
        banca: "Fortuna Sports",
        styles: ""
    });
});

gulp.task('betsports.club', function (done) {
    tasks(done, {
        host: "betsports.club",
        banca: "Bet Sports",
        styles: ""
    });
});

gulp.task('trevo.wee.bet', function (done) {
    tasks(done, {
        host: "trevo.wee.bet",
        banca: "Trevo Bet",
        styles: ""
    });
});

gulp.task('gooldeplaca.com.br', function (done) {
    tasks(done, {
        host: "gooldeplaca.com.br",
        banca: "Gool de Placa",
        styles: "--header: #258aa7; --foreground-header: #fff; --sidebar-right:#258aa7; --foreground-sidebar-right: #fff; --sidebar-left: #258aa7; --foreground-sidebar-left: #fff; --odds: #000; --event-time: #e84233; --highlight: #fbef3c; --foreground-highlight: #fff;  --league: #e84233; --foreground-league: #fff;n",
        aditional_styles: ".pre-bilhete .div-inputs{ background-color: #e84233!important; } .mais-opcoes{ color: #e84233!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #000!important; } .remover-item .fa-times{ color: #e84233!important; } "
    });
});

gulp.task('futbets.wee.bet', function (done) {
    tasks(done, {
        host: "futbets.wee.bet",
        banca: "Fut Bets",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #1e941c; --foreground-odds: #fff; --event-time: #1e941c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('megabets.wee.bet', function (done) {
    tasks(done, {
        host: "megabets.wee.bet",
        banca: "Mega Bets",
        styles: "--header: #14312d; --foreground-header: #fff; --sidebar-right:#14312d; --foreground-sidebar-right: #fff; --sidebar-left: #14312d; --foreground-sidebar-left: #fff; --highlight: #ffb11a; --foreground-highlight: #fff; --odds: #2d887f; --foreground-odds: #fff; --event-time: #14312d; --league: #fade9f; --foreground-league: #000;"
    });
});

gulp.task('esportebet10.wee.bet', function (done) {
    tasks(done, {
        host: "esportebet10.wee.bet",
        banca: "Esporte Bet 10",
        styles: ""
    });
});

gulp.task('sorteline.com', function (done) {
    tasks(done, {
        host: "sorteline.com",
        banca: "Sorte Line",
        styles: "--header: #57b449; --foreground-header: #fff; --sidebar-right:#086211; --foreground-sidebar-right: #fff; --sidebar-left: #086211; --foreground-sidebar-left: #fff; --highlight:red; --foreground-highlight: #fff; --odds: #57b449; --foreground-odds: #fff;"
    });
});

gulp.task('placardarodada.wee.bet', function (done) {
    tasks(done, {
        host: "placardarodada.wee.bet",
        banca: "Placar da Rodada",
        styles: "",
        aditional_styles: ".sidebar-brand{ margin-top: 0!important; } .sidebar-brand img{ max-width: 100%!important; max-height: none!important; }"
    });
});

gulp.task('kfmbets.com', function (done) {
    tasks(done, {
        host: "kfmbets.com",
        banca: "KFM BETS",
        styles: ""
    });
});

gulp.task('tuntumesportes.wee.bet', function (done) {
    tasks(done, {
        host: "tuntumesportes.wee.bet",
        banca: "Tuntum Esportes",
        styles: "--header: #5abb39; --foreground-header: #fff; --sidebar-right:#5abb39; --foreground-sidebar-right: #fff; --sidebar-left: #5abb39; --foreground-sidebar-left: #fff; --highlight:red; --foreground-highlight: #fff; --odds: #2c600e; --foreground-odds: #fff;"
    });
});

gulp.task('wmredesports.net', function (done) {
    tasks(done, {
        host: "wmredesports.net",
        banca: "WM Rede Sports",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#333; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #da403e; --foreground-odds: #fff; --event-time: #da403e; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('sportbrasil.wee.bet', function (done) {
    tasks(done, {
        host: "sportbrasil.wee.bet",
        banca: "Sport Brasil",
        styles: "--header: #6ba763; --foreground-header: #fff; --sidebar-right:#6ba763; --foreground-sidebar-right: #fff; --sidebar-left: #6ba763; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #19afef; --foreground-odds: #fff;"
    });
});

gulp.task('maniasports.bet', function (done) {
    tasks(done, {
        host: "maniasports.bet",
        banca: "Mania Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: red; --foreground-odds: #fff;"
    });
});

gulp.task('vitoriasports.bet', function (done) {
    tasks(done, {
        host: "vitoriasports.bet",
        banca: "Vitória Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: yellow; --odds: red; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('bilhetedasorte.wee.bet', function (done) {
    tasks(done, {
        host: "bilhetedasorte.wee.bet",
        banca: "Bilhete da Sorte",
        styles: "--header: #999999; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        aditional_styles: ".odds .selecionado{ background: #24415f!important; } .odds .selecionado span{ color: #fff!important; } #fixed-bar-bilhete{ background: #67ad5a!important; }"
    });
});
