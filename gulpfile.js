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
        // .pipe(exec('ng build --prod --aot --buildOptimizer=true', options))
        .pipe(exec('ng build --prod', options))
        // .pipe(exec('ng build --prod --outputHashing=none', options))
        //.pipe(exec('scp -r -i ~/.keystore/weebet.pem dist/* ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/app/', options))
        //.pipe(exec('tar -cf dist/* | ssh -i ~/.keystore/weebet.pem ubuntu@' + config.host + ' "cat >  dist/* ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/app/', options))
        .pipe(exec('cd dist && tar -czf tosend.tar * && scp -r -i ~/.keystore/weebet.pem tosend.tar ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/ && ssh -i ~/.keystore/weebet.pem ubuntu@' + config.host + ' sh /var/www/prod/bets/update_frontend.sh ' + config.host, options))
        .pipe(exec.reporter(reportOptions));

    done();

};

gulp.task('vipsports.wee.bet', function (done) {
    tasks(done, {
        host: "vipsports.wee.bet",
        banca: "Vip Sports",
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
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
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
        styles: "--header: #e1e1e1; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        aditional_styles: ".loading-app{color:#8c8c8c;} .menu-categories{background-color: #24415f;} .navbar-mobile{ background-color: #e1e1e1; } .odds .selecionado{ background: #24415f!important; } .odds .selecionado span{ color: #fff!important; } #fixed-bar-bilhete{ background: #24415f!important;color:#fff; } .navbar-mobile .menu-conta > a{color:#8c8c8c!important;}"
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

gulp.task('gol.wee.bet', function (done) {
    tasks(done, {
        host: "gol.wee.bet",
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

gulp.task('bdcbets.com', function (done) {
    tasks(done, {
        host: "bdcbets.com",
        banca: "BDC Bets",
        styles: "--header: #ff6600; --foreground-header: #fff; --sidebar-right:#ff6600; --foreground-sidebar-right: #fff; --sidebar-left: #ff6600; --foreground-sidebar-left: #fff; --highlight: #fa231b; --foreground-highlight: #fff; --odds: #000; --foreground-odds: #fff; --event-time: #fa231b;",
        //aditional_styles: ".pre-bilhete .div-inputs{ background-color: #21bb3f!important; } .mais-opcoes{ color: #21bb3f!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #000!important; } .remover-item .fa-times{ color: #000!important; } "
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
        styles: "--header:#046eef;--sidebar-right:#046eef;--sidebar-left:#046eef;--odds:#011e46;"
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
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: yellow; --odds: red; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('superbets.bet', function (done) {
    tasks(done, {
        host: "superbets.bet",
        banca: "SUPERBETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --sidebar-left: #000;",
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
        styles: "--header: #00ab4f; --foreground-header: #b1c5e0; --sidebar-right:#00ab4f; --foreground-sidebar-right: #fff; --sidebar-left: #00ab4f; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #000; --odds: #73c48c; --foreground-odds: #fff;",
        aditional_styles: ".campeonato-header{ background-color: red!important;color:#fff!important; }"
    });
});


gulp.task('sportebets.com.br', function (done) {
    tasks(done, {
        host: "sportebets.com.br",
        banca: "Sporte Bets",
        styles: "--header: #ff6600; --foreground-header: #fff; --sidebar-right:#ff6600; --foreground-sidebar-right: #fff; --sidebar-left: #ff6600; --league: #21bb3f; --foreground-league: #fff;" +
            "--foreground-sidebar-left: #fff; --highlight: #d7d079; --foreground-highlight: #000; --odds: #000; --foreground-odds: #fff; --event-time: #21bb3f;",
        aditional_styles: ".pre-bilhete .div-inputs{ background-color: #21bb3f!important; } .mais-opcoes{ color: #21bb3f!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #000!important; } .remover-item .fa-times{ color: #000!important; } "
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
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
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
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
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
        host: "esportbets10.wee.bet",
        banca: "Esport Bets 10",
        styles: "--header: #263238; --sidebar-right:#424242; --sidebar-left: #424242; --odds: #212121;",
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

gulp.task('sportingool.com', function (done) {
    tasks(done, {
        host: "sportingool.com",
        banca: "Sporting Gool",
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
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
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
        styles: ""
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
        styles: "--header: #012549; --foreground-header: #fff; --sidebar-right:#012549; --foreground-sidebar-right: #fff; --sidebar-left: #012549; --foreground-sidebar-left: #fff; --odds: #4c4c4e; --event-time: #e84233; --highlight: #fbef3c; --foreground-highlight: #fff;  --league: #494e4a; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #7f7d7e!important } .jogos, .eventos{ background: #7f7d7e!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #7f7d7e!important; } .footer{ background-color:#7f7d7e!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #4c4c4e; color: white; } .inside-event .tipo-apostas{ background-color: #7f7d7e!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } .tipo-apostas .nav-link{ color:#fff!important; }.mais-opcoes{ color: #fff!important; }"
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
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #E9967A; --foreground-highlight: #fff; --odds: #ff0100; --foreground-odds: #fff; --event-time: #14312d;--foreground-league: #000;"
    });
});

gulp.task('megabets.online', function (done) {
    tasks(done, {
        host: "megabets.online",
        banca: "Mega Bets",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:#ff3c00; --foreground-highlight: #fff; --odds: #4f4f4f; --foreground-odds: #fff; --foreground-selected-odds: #fff; --selected-odds: #ff3c00; --event-time: #000; --league: #ff3c00;--foreground-league: #fff;",
        aditional_styles: ".remover-item .fa-times{ color: #4f4f4f!important; } .pre-bilhete-esportes .fa-times{ color: #4f4f4f!important; } .odds .selecionado{ background-color: #ff3c00!important; } "
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
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: yellow; --odds: #292b75; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('rico.wee.bet', function (done) {
    tasks(done, {
        host: "rico.wee.bet",
        banca: "Rico",
        styles: "--header: #043052; --foreground-header: #fff; --sidebar-right:#043052; --foreground-sidebar-right: #fff; --sidebar-left: #043052; --foreground-sidebar-left: #fff; --highlight: #a1ebfe; --foreground-highlight: #fff; --odds: #017eb4; --foreground-odds: #fff; --event-time: #000",
    });
});

gulp.task('top10sports.wee.bet', function (done) {
    tasks(done, {
        host: "top10sports.wee.bet",
        banca: "Top 10 Sports",
        styles: "--header: #373435; --foreground-header: #fff; --sidebar-right:#373435; --foreground-sidebar-right: #fff; --sidebar-left: #373435; --foreground-sidebar-left: #fff; --highlight: #ffc107; --foreground-highlight: #fff; --odds: #000; --foreground-odds: #fff; --event-time:#000;--league:#ed3237;--foreground-league:#fff;",
    });
});

gulp.task('bets211.wee.bet', function (done) {
    tasks(done, {
        host: "bets211.wee.bet",
        banca: "Bets 211",
        styles: "--header: #37328c; --foreground-header: #fff; --sidebar-right:#37328c; --foreground-sidebar-right: #fff; --sidebar-left: #37328c; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #fff; --odds: #f4b52a; --foreground-odds: #fff;",
    });
});

gulp.task('amigosdabola.wee.bet', function (done) {
    tasks(done, {
        host: "amigosdabola.wee.bet",
        banca: "Amigos da Bola",
        styles: "--header: red; --foreground-header: #fff; --sidebar-right:red; --foreground-sidebar-right: #fff; --sidebar-left: #373435; --foreground-sidebar-left: #fff; --highlight: #ffc107; --foreground-highlight: #fff; --odds: #373435; --foreground-odds: #fff; --event-time: red;",
    });
});

gulp.task('onllinesports.com', function (done) {
    tasks(done, {
        host: "onllinesports.com",
        banca: "Onlline Sports",
        styles: "",
    });
});

gulp.task('liderancaesportes.wee.bet', function (done) {
    tasks(done, {
        host: "liderancaesportes.wee.bet",
        banca: "Liderança Esportes",
        styles: "",
    });
});

gulp.task('cokinhodabanca.wee.bet', function (done) {
    tasks(done, {
        host: "cokinhodabanca.wee.bet",
        banca: "Cokinho da Banca",
        styles: "--header: #043052; --foreground-header: #fff; --sidebar-right:#043052; --foreground-sidebar-right: #fff; --sidebar-left: #043052; --foreground-sidebar-left: #fff; --highlight: #a1ebfe; --foreground-highlight: #fff; --odds: #017eb4; --foreground-odds: #fff; --event-time: #000",
    });
});

gulp.task('clubbets.wee.bet', function (done) {
    tasks(done, {
        host: "clubbets.wee.bet",
        banca: "Club Bets",
        styles: "",
    });
});

gulp.task('bet24h.wee.bet', function (done) {
    tasks(done, {
        host: "bet24h.wee.bet",
        banca: "Bet 24h",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ed3237; --foreground-highlight: #fff; --odds: #941f22; --foreground-odds: #fff; --event-time: #941f22",
    });
});

gulp.task('tm5sports.wee.bet', function (done) {
    tasks(done, {
        host: "tm5sports.wee.bet",
        banca: "TM5 Sports",
        styles: "--header: #d7d7d8; --foreground-header: #292929; --sidebar-right:#d7d7d8; --foreground-sidebar-right: #292929; --sidebar-left: #d7d7d8; --foreground-sidebar-left: #292929; --highlight: #21a9d8; --foreground-highlight: #a47b41; --odds: #292929; --foreground-odds: #d7d7d8; --event-time: #a47b41",
    });
});

gulp.task('bancadofrade.com', function (done) {
    tasks(done, {
        host: "bancadofrade.com",
        banca: "Banca do Frade",
        styles: ""
    });
});

gulp.task('pitbull.bet', function (done) {
    tasks(done, {
        host: "pitbull.bet",
        banca: "PITBULL",
        styles: "--header: #060606; --foreground-header: #fff; --sidebar-right:#060606; --foreground-sidebar-right: #fff; --sidebar-left: #060606; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds: #ff8100; --foreground-odds: #fff; --event-time: #ff8100"
    });
});

gulp.task('amazonsports.bet', function (done) {
    tasks(done, {
        host: "amazonsports.bet",
        banca: "Amazon Sports",
        styles: "--highlight: red;--odds: #006634; --foreground-odds: #fff;"
        // styles: "--header: #019934; --foreground-header: #fff; --sidebar-right:#019934; --foreground-sidebar-right: #fff; --sidebar-left: #019934; --foreground-sidebar-left: #fff; --highlight: #c93334; --foreground-highlight: #fff; --odds: #006634; --foreground-odds: #fff; --event-time: #c93334"
    });
});

gulp.task('bets188.bet', function (done) {
    tasks(done, {
        host: "bets188.bet",
        banca: "Bets 188",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #f0c027;",
        aditional_styles: ".sem-evento{color: #fff;}  #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('esportegol.com', function (done) {
    tasks(done, {
        host: "esportegol.com",
        banca: "Esporte Gol",
        styles: ""
    });
});

gulp.task('futebolmania.wee.bet', function (done) {
    tasks(done, {
        host: "futebolmania.wee.bet",
        banca: "Futebol Mania",
        styles: "",
    });
});

gulp.task('pointbets.net', function (done) {
    tasks(done, {
        host: "pointbets.net",
        banca: "Point Bets",
        styles: "--header: #e20145; --foreground-header: #fff; --sidebar-right:#e20145; --foreground-sidebar-right: #fff; --sidebar-left: #e20145; --foreground-sidebar-left: #fff; --highlight: #ffdd00; --foreground-highlight: #fff; --odds: #033d58; --foreground-odds: #fff; --event-time: #e20145"
    });
});

gulp.task('arena365.wee.bet', function (done) {
    tasks(done, {
        host: "arena365.wee.bet",
        banca: "Arena 365",
        styles: "--header: #040327; --foreground-header: #fff; --sidebar-right:#ff0000; --foreground-sidebar-right: #fff; --sidebar-left: #ff0000; --foreground-sidebar-left: #fff; --highlight: #040327; --foreground-highlight: #fff; --odds: #d83418; --foreground-odds: #fff; --event-time: #040327",
        aditional_styles: ".odds .selecionado span, .odds .inner-odd:hover span{ color: #fff!important; } #fixed-bar-bilhete{ background: #040327!important; } .remover-item .fa-times, .fechar-pre-bilhete{ color: #fff!important; } .sidebar-brand img{ max-height: 150px!important; max-width: 250px!important; padding-right: 25px!important; }"
    });
});

gulp.task('clickaposte.wee.bet', function (done) {
    tasks(done, {
        host: "clickaposte.wee.bet",
        banca: "Click Aposte",
        styles: "--header: #9bb301; --foreground-header: #fff; --sidebar-right:#9bb301; --foreground-sidebar-right: #fff; --sidebar-left: #9bb301; --foreground-sidebar-left: #fff; --highlight: #03b1f6; --foreground-highlight: #fff; --odds: #154a6b; --foreground-odds: #fff; --event-time: #154a6b",
    });
});

gulp.task('esportbets10.wee.bet', function (done) {
    tasks(done, {
        host: "esportbets10.wee.bet",
        banca: "Esport Bets 10",
        styles: "--header: #263238; --sidebar-right:#424242; --sidebar-left: #424242; --odds: #212121;",
    });
});

gulp.task('betslobo.wee.bet', function (done) {
    tasks(done, {
        host: "betslobo.wee.bet",
        banca: "Bets Lobo",
        styles: "--header: #14312d; --foreground-header: #fff; --sidebar-right:#14312d; --foreground-sidebar-right: #fff; --sidebar-left: #14312d; --foreground-sidebar-left: #fff; --highlight: #ffb11a; --foreground-highlight: #fff; --odds: #2d887f; --foreground-odds: #fff; --event-time: #14312d; --league: #fade9f; --foreground-league: #000;"
    });
});

gulp.task('betsluck.wee.bet', function (done) {
    tasks(done, {
        host: "betsluck.wee.bet",
        banca: "Bets Luck",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:#292b74; --foreground-odds: #fff; --event-time: #292b74",
    });
});

gulp.task('footbets.wee.bet', function (done) {
    tasks(done, {
        host: "footbets.wee.bet",
        banca: "footbets",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:red; --foreground-odds: #fff; --event-time: #312782",
        aditional_styles: ".mais-opcoes{ color: var(--event-time)!important; }",
    });
});

gulp.task('imperiosportve.com', function (done) {
    tasks(done, {
        host: "imperiosportve.com",
        banca: "imperio sportve",
        styles: "--header: #42050a; --foreground-header: #fff; --sidebar-right:#42050a; --foreground-sidebar-right: #fff; --sidebar-left: #42050a; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:#d91c16; --foreground-odds: #fff; --event-time: #d91c16",
    });
});

gulp.task('cpsports.wee.bet', function (done) {
    tasks(done, {
        host: "cpsports.wee.bet",
        banca: "CP Sports",
        styles: ""
    });
});

gulp.task('betsports81.wee.bet', function (done) {
    tasks(done, {
        host: "betsports81.wee.bet",
        banca: "Bet Sports 81",
        styles: "--header: #000;--sidebar-right:#000;--sidebar-left: #000;--highlight: #e4e4e4;--odds: #0fc100;"
    });
});

gulp.task('jcapostas.wee.bet', function (done) {
    tasks(done, {
        host: "jcapostas.wee.bet",
        banca: "JC Apostas",
        styles: "--header: #292729;--sidebar-right:#292729;--sidebar-left: #292729;--highlight: #e4e4e4;--odds: #15814f;"
    });
});

gulp.task('sportmais.wee.bet', function (done) {
    tasks(done, {
        host: "sportmais.wee.bet",
        banca: "Sport Mais",
        styles: ""
    });
});

gulp.task('boodog.wee.bet', function (done) {
    tasks(done, {
        host: "boodog.wee.bet",
        banca: "Boodog",
        styles: "--header: #0138a5;--highlight: #c60b31;--odds: #0138a5;"
    });
});

gulp.task('betsgo.wee.bet', function (done) {
    tasks(done, {
        host: "betsgo.wee.bet",
        banca: "Bets Go",
        styles: "--header: #404040;--foreground-header:#fff;--sidebar-right:#404040;--sidebar-left: #404040;--highlight: #ff5900;--foreground-highlight:#fff;--odds: #999999;--event-time: #999999; --league: #ff5900;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ color:#000;border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #ff5900; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } .pre-bilhete h4{color:#fff} .div-back .fa-times{ color: #fff!important; }"
    });
});

gulp.task('rubinhosports.wee.bet', function (done) {
    tasks(done, {
        host: "rubinhosports.wee.bet",
        banca: "Rubinho Sports",
        styles: "",
    });
});

gulp.task('betspremio.net', function (done) {
    tasks(done, {
        host: "betspremio.net",
        banca: "Bets Prêmio",
        styles: "--header: #3F6826; --foreground-header: #b1c5e0; --sidebar-right: #3B5323; --foreground-sidebar-right: #fff; --sidebar-left: #3B5323; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: #dab600; --foreground-odds: #fff; --selected-event: #000;",
    });
});

gulp.task('goobet.wee.bet', function (done) {
    tasks(done, {
        host: "goobet.wee.bet",
        banca: "Goo Bet",
        styles: "",
    });
});

gulp.task('kingesporte.wee.bet', function (done) {
    tasks(done, {
        host: "kingesporte.wee.bet",
        banca: "King Esporte",
        styles: "",
    });
});

gulp.task('centraldosesportes.wee.bet', function (done) {
    tasks(done, {
        host: "centraldosesportes.wee.bet",
        banca: "Central dos Esportes",
        styles: "",
    });
});

gulp.task('betdez.com', function (done) {
    tasks(done, {
        host: "betdez.com",
        banca: "BetDez",
        styles: "--header: #fff; --foreground-header: #000; --sidebar-right: #fff; --foreground-sidebar-right: #000; --sidebar-left: #fff; --foreground-sidebar-left: #000; --highlight: red; --foreground-highlight: #003f7f; --odds: #d9a535; --foreground-odds: #fff; --event-time: red;",
        aditional_styles: ".menu-categories .active a {color: #003f7f!important;} .odds .selecionado span{color:#fff!important;} .content-header h2{color:#003f7f!important;}",
    });
});

gulp.task('ibiapababets.wee.bet', function (done) {
    tasks(done, {
        host: "ibiapababets.wee.bet",
        banca: "Ibiapaba Bets",
        styles: "--header:#fdcc29;--foreground-header:#000;--sidebar-right:#88918c;--foreground-sidebar-right:#fff;--sidebar-left:#88918c;--foreground-sidebar-left:#fff;--odds:#fdcc29;--foreground-odds: #000;--highlight:#faa954;--foreground-highlight:#000;"
    });
});

gulp.task('petrolinabets.wee.bet', function (done) {
    tasks(done, {
        host: "petrolinabets.wee.bet",
        banca: "Petrolina Bets",
        styles: "--header:#e20145;--foreground-header:#fff;--sidebar-right:#e20145;--foreground-sidebar-right:#fff;--sidebar-left:#e20145;--foreground-sidebar-left:#fff;--odds:#043d57;--foreground-odds: #fff;--highlight:#faa954;--foreground-highlight:#fff;--event-time:#e00144"
    });
});

gulp.task('sportenetmania365.wee.bet', function (done) {
    tasks(done, {
        host: "sportenetmania365.wee.bet",
        banca: "Sporte Net Mania 365",
        styles: ""
    });
});

gulp.task('mhbets.wee.bet', function (done) {
    tasks(done, {
        host: "mhbets.wee.bet",
        banca: "MH Bets",
        styles: "--header:#6a0f0a;--foreground-header:#fff;--sidebar-right:#6a0f0a;--foreground-sidebar-right:#fff;--sidebar-left:#6a0f0a;--foreground-sidebar-left:#fff;--odds:#0c204a;--foreground-odds: #fff; --foreground-highlight:#000;"
    });
});

gulp.task('caciquesports.com', function (done) {
    tasks(done, {
        host: "caciquesports.com",
        banca: "Cacique Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffb74c; --foreground-highlight: #ffb74c; --odds: #ef4539; --foreground-odds: #fff; --event-time: #324c78; --league: #324c78; --foreground-league: #fff;",
        aditional_styles: " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #324c78; color: white; } #esportes-footer{ color:white; } .sidebar-brand img { max-width: 242px!important; } "
    });
});

gulp.task('rexpasports.wee.bet', function (done) {
    tasks(done, {
        host: "rexpasports.wee.bet",
        banca: "REXPA Sports",
        styles: "--header:#00342a;--foreground-header:#fff;--sidebar-right:#00342a;--foreground-sidebar-right:#fff;--sidebar-left:#00342a;--foreground-sidebar-left:#fff;--odds:#ffca40;--foreground-odds: #000; --foreground-highlight:#fff; --highlight:#648ee2;--league: #367fa8;--foreground-league: #fff;",
        aditional_styles: ".indentificacao .mais-opcoes{color: var(--event-time);} .tipo-apostas .tipo-aposta h4 {background: #247451;color: #fff;padding: 5px;}",
        // styles: "--header:#5b86da;--foreground-header:#fff;--sidebar-right:#5b86da;--foreground-sidebar-right:#fff;--sidebar-left:#072550;--foreground-sidebar-left:#fff;--odds:#08254f;--foreground-odds: #fff; --foreground-highlight:#fff; --highlight:#2e82b8;"
    });
});

gulp.task('betsporte.wee.bet', function (done) {
    tasks(done, {
        host: "betsporte.wee.bet",
        banca: "Bet Sporte",
        styles: "--header:#030248;--foreground-header:#fff;--sidebar-right:#030248;--foreground-sidebar-right:#fff;--sidebar-left:#030248;--foreground-sidebar-left:#fff;--odds:#008701;--foreground-odds: #fff; --highlight:#000; --foreground-highlight:#fff; --foreground-selected-odds:#fff ;"
    });
});

gulp.task('quininhadasorte.wee.bet', function (done) {
    tasks(done, {
        host: "quininhadasorte.wee.bet",
        banca: "Quininha da Sorte",
        styles: ""
    });
});

gulp.task('brsports365.com', function (done) {
    tasks(done, {
        host: "brsports365.com",
        banca: "BR Sports 365",
        styles: ""
    });
});

gulp.task('esportebetvip.wee.bet', function (done) {
    tasks(done, {
        host: "esportebetvip.wee.bet",
        banca: "Esporte Bet Vip",
        styles: ""
    });
});

gulp.task('sportingnet.bet', function (done) {
    tasks(done, {
        host: "sportingnet.bet",
        banca: "Sporting Net",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #dab600; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('tribetsports.com', function (done) {
    tasks(done, {
        host: "tribetsports.com",
        banca: "TriBet Sports",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--foreground-sidebar-right:#fff;--sidebar-left:#000;--foreground-sidebar-left:#fff;--highlight:#a31312;--foreground-highlight:#fff;--odds:#ff0100;--foreground-odds:#fff;--foreground-selected-odds:#fff;"
    });
});

gulp.task('sportshow.wee.bet', function (done) {
    tasks(done, {
        host: "sportshow.wee.bet",
        banca: "Sport Show",
        styles: ""
    });
});

gulp.task('betsplacar.club', function (done) {
    tasks(done, {
        host: "betsplacar.club",
        banca: "Bets Placar",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;"
    });
});

gulp.task('futebolbet.wee.bet', function (done) {
    tasks(done, {
        host: "futebolbet.wee.bet",
        banca: "Futebol Bet",
        styles: ""
    });
});

gulp.task('bet358.wee.bet', function (done) {
    tasks(done, {
        host: "bet358.wee.bet",
        banca: "Bet 358",
        styles: "--header:#016534;--foreground-header:#fff;--sidebar-right:#016534;--foreground-sidebar-right:#fff;--sidebar-left:#016534;--foreground-sidebar-left:#fff;--foreground-highlight:#fff;--odds:#000;--foreground-odds:#fff;--foreground-selected-odds:#000;"
    });
});

gulp.task('esportebetsvip.com', function (done) {
    tasks(done, {
        host: "esportebetsvip.com",
        banca: "Esporte Bets Vip",
        styles: "--header:#f44236; --foreground-header:#fff; --sidebar-left: #f44236; --sidebar-right: #f44236; --odds: #003ae6; --foreground-highlight: #fff;",
        aditional_styles: ".jogo-selecionado .fa-times{color:#000;} .fechar-pre-bilhete .fa-times{color:#000;}"
    });
});

gulp.task('betsma.club', function (done) {
    tasks(done, {
        host: "betsma.club",
        banca: "betsma",
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#4d4d4d;"
    });
});

gulp.task('eurobet333.wee.bet', function (done) {
    tasks(done, {
        host: "eurobet333.wee.bet",
        banca: "EUROBET 333",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000; --odds: #d70101; --highlight: #f8c803; --foreground-highlight: #fff;--event-time:#000",
        aditional_styles: ".navbar-mobile{background-color:#fff!important;} @media only screen and (max-width: 600px) {.menu-conta #navbarDropdown{color:#000;}}"
    });
});

gulp.task('elitebet.wee.bet', function (done) {
    tasks(done, {
        host: "elitebet.wee.bet",
        banca: "ELITEBET",
        styles: ""
    });
});

gulp.task('maxxbets.club', function (done) {
    tasks(done, {
        host: "maxxbets.club",
        banca: "MAXX BETS",
        styles: "--header:#f14c1c; --foreground-header:#fff; --sidebar-left: #f14c1c; --sidebar-right: #f14c1c; --odds: #172462; --highlight: #f8c803;",
    });
});

gulp.task('betsgol.net', function (done) {
    tasks(done, {
        host: "betsgol.net",
        banca: "BETS GOL",
        styles: "--header:#ff0000; --foreground-header:#000; --sidebar-left: #000; --sidebar-right: #000; --odds:#ff0000;",
    });
});

gulp.task('mastersports.wee.bet', function (done) {
    tasks(done, {
        host: "mastersports.wee.bet",
        banca: "MASTER SPORTS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #9b001d; --foreground-odds: #fff;",
    });
});

gulp.task('centralbets.club', function (done) {
    tasks(done, {
        host: "centralbets.club",
        banca: "CENTRAL BETS",
        styles: "--header: #0b2947; --foreground-header: #fff; --sidebar-right:#0e1e31; --foreground-sidebar-right: #fff; --sidebar-left: #0e1e31; --foreground-sidebar-left: #fff; --highlight: #8bc53f; --odds: #ffab03; --foreground-odds: #000;",
    });
});

gulp.task('betsbs.net', function (done) {
    tasks(done, {
        host: "betsbs.net",
        banca: "BETS BS",
        styles: ""
    });
});

gulp.task('firebet.fun', function (done) {
    tasks(done, {
        host: "firebet.fun",
        banca: "FIREBET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff;--odds: red; --foreground-odds: #fff;--foreground-highlight: #fff;--event-time:#777777",
    });
});

gulp.task('redelsports.com', function (done) {
    tasks(done, {
        host: "redelsports.com",
        banca: "REDE LSPORTS",
        styles: ""
    });
});

gulp.task('megasports.club', function (done) {
    tasks(done, {
        host: "megasports.club",
        banca: "MEGA SPORTS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;--highlight:red;"
    });
});

gulp.task('alfasports.net', function (done) {
    tasks(done, {
        host: "alfasports.net",
        banca: "ALFA SPORTS",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--highlight:red;"
    });
});

gulp.task('novo.maisporte.com', function (done) {
    tasks(done, {
        host: "novo.maisporte.com",
        banca: "MAISPORTE",
        styles: ""
    });
});

gulp.task('ebsloteriasonline.fun', function (done) {
    tasks(done, {
        host: "ebsloteriasonline.fun",
        banca: "EBS LOTERIAS",
        styles: "--header:#373435;--foreground-header:#fff;--sidebar-right:#373435;--sidebar-left:#373435;--odds:#66bc50;--highlight:#36f909;"
    });
});

gulp.task('betturbinado.com', function (done) {
    tasks(done, {
        host: "betturbinado.com",
        banca: "BET TURBINADO",
        styles: "--header:#dd3c30;--foreground-header:#fff;--sidebar-right:#691709;--sidebar-left:#691709;--odds:#f4bf29;--highlight:yellow;--foreground-highlight: #fff;"
    });
});

gulp.task('recifeesportes.wee.bet', function (done) {
    tasks(done, {
        host: "recifeesportes.wee.bet",
        banca: "RECIFE ESPORTES",
        styles: "--header:#f26225;--foreground-header:#fff;--sidebar-right:#f26225;--sidebar-left:#f26225;--odds:#828282;--highlight:#390051;--foreground-highlight: #fff;--foreground-selected-odds: #fff;--selected-odds: #f26225; --event-time:#390051; --league: #390051; --foreground-league: #fff;",
        aditional_styles: "body{ background-color: #390051!important;  } .mais-opcoes{ color: #390051!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #390051!important; } .sidebar-brand{ margin-top: 0!important; padding-top: 15px; padding-bottom: 20px; background-color: #390051; } .sidebar-menu{ background-color: #390051; margin-top: 0!important; } .navbar-mobile{ background-color: #390051; } .pre-bilhete .div-inputs, .pre-bilhete .valores button, .pre-bilhete .form-group button { background-color: #390051!important; } .pre-bilhete .form-group button:hover { color:#fff!important; } .odds .selecionado{ background-color: #f26225!important; } .jogo-selecionado .fa-times{color:#390051!important;} .fechar-pre-bilhete .fa-times{color:#390051!important;}"
    });
});

gulp.task('sportbet7.net', function (done) {
    tasks(done, {
        host: "sportbet7.net",
        banca: "SPORT BET 7",
        styles: ""
    });
});

gulp.task('masterjogos.club', function (done) {
    tasks(done, {
        host: "masterjogos.club",
        banca: "MASTER JOGOS",
        styles: ""
    });
});

gulp.task('jrsports.bet', function (done) {
    tasks(done, {
        host: "jrsports.bet",
        banca: "JR SPORTS",
        styles: "--header:#631508;--foreground-header:#fff;--sidebar-right:#631508;--sidebar-left:#631508;--odds:#a07417; --foreground-highlight: #fff;"
    });
});

gulp.task('jardimbets.com', function (done) {
    tasks(done, {
        host: "jardimbets.com",
        banca: "JARDIM BETS",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('apremiada.bet', function (done) {
    tasks(done, {
        host: "apremiada.bet",
        banca: "APREMIADA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
    });
});

gulp.task('superpremio.club', function (done) {
    tasks(done, {
        host: "superpremio.club",
        banca: "SUPER PRÊMIO",
        styles: ""
    });
});

gulp.task('x2bet.wee.bet', function (done) {
    tasks(done, {
        host: "x2bet.wee.bet",
        banca: "X2 BET",
        styles: "--header: #333; --foreground-header: #fff;--sidebar-right:#333;--sidebar-left:#333;--odds:#3c8dbc;--foreground-highlight:#fff;"
    });
});

gulp.task('fenixesportes.wee.bet', function (done) {
    tasks(done, {
        host: "fenixesportes.wee.bet",
        banca: "FÊNIX ESPORTES",
        styles: ""
    });
});

gulp.task('ricoesportes.wee.bet', function (done) {
    tasks(done, {
        host: "ricoesportes.wee.bet",
        banca: "RICO ESPORTES",
        styles: ""
    });
});

gulp.task('betsplay.club', function (done) {
    tasks(done, {
        host: "betsplay.club",
        banca: "BETSPLAY",
        styles: "--header: #000; --foreground-header: #fff;--sidebar-right:#000;--foreground-sidebar-right:#fff;--sidebar-left:#000;--foreground-sidebar-left:#fff;--odds:#ff8730;--foreground-highlight:#fff;"
    });
});

gulp.task('camisa13.wee.bet', function (done) {
    tasks(done, {
        host: "camisa13.wee.bet",
        banca: "CAMISA 13",
        styles: "--header:#999999; --foreground-header: #fff; --sidebar-left: #999999; --sidebar-right: #999999; --odds:#4d4d4d;"
    });
});

gulp.task('championsbet.club', function (done) {
    tasks(done, {
        host: "championsbet.club",
        banca: "CHAMPIONS BET",
        styles: ""
    });
});

gulp.task('monteirobets.com', function (done) {
    tasks(done, {
        host: "monteirobets.com",
        banca: "MONTEIRO BETS",
        styles: "--header:#12369e; --foreground-header: #fff; --odds:#d8262d;--foreground-highlight:#fff;"
    });
});

gulp.task('sportpremium.wee.bet', function (done) {
    tasks(done, {
        host: "sportpremium.wee.bet",
        banca: "SPORT PREMIUM",
        styles: "--header:#000; --foreground-header: #fff;--sidebar-left: #000; --sidebar-right: #000; --odds:#ff0000;"
    });
});

gulp.task('r6sport.com', function (done) {
    tasks(done, {
        host: "r6sport.com",
        banca: "R6 SPORT",
        styles: ""
    });
});

gulp.task('betsports.wee.bet', function (done) {
    tasks(done, {
        host: "betsports.wee.bet",
        banca: "BET SPORTS",
        styles: ""
    });
});

gulp.task('milagressports.wee.bet', function (done) {
    tasks(done, {
        host: "milagressports.wee.bet",
        banca: "MILAGRES SPORTS",
        styles: ""
    });
});

gulp.task('citybets.wee.bet', function (done) {
    tasks(done, {
        host: "citybets.wee.bet",
        banca: "CITY BETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #5a130f; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('esportsmt.net', function (done) {
    tasks(done, {
        host: "esportsmt.net",
        banca: "ESPORTESMT.NET",
        styles: ""
    });
});

gulp.task('lancebet.wee.bet', function (done) {
    tasks(done, {
        host: "lancebet.wee.bet",
        banca: "LANCE BET",
        styles: ""
    });
});

gulp.task('betsgol.bet', function (done) {
    tasks(done, {
        host: "betsgol.bet",
        banca: "BETS GOL",
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#4d4d4d;"
    });
});

gulp.task('playbets.wee.bet', function (done) {
    tasks(done, {
        host: "playbets.wee.bet",
        banca: "PLAY BETS",
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#f39200;"
    });
});

gulp.task('starbets.wee.bet', function (done) {
    tasks(done, {
        host: "starbets.wee.bet",
        banca: "STAR BETS",
        styles: ""
    });
});

gulp.task('betspremium.wee.bet', function (done) {
    tasks(done, {
        host: "betspremium.wee.bet",
        banca: "BETS PREMIUM",
        styles: "--header:#17619a; --foreground-header: #fff; --sidebar-left: #17619a; --sidebar-right: #17619a; --foreground-odds:#fff;"
    });
});

gulp.task('skycassino.wee.bet', function (done) {
    tasks(done, {
        host: "skycassino.wee.bet",
        banca: "SKY CASSINO",
        styles: ""
    });
});

gulp.task('tapabets380.wee.bet', function (done) {
    tasks(done, {
        host: "tapabets380.wee.bet",
        banca: "TAPA BETS 380",
        styles: ""
    });
});

gulp.task('marechalsports.wee.bet', function (done) {
    tasks(done, {
        host: "marechalsports.wee.bet",
        banca: "MARECHAL SPORTS",
        styles: "--header: #012549; --foreground-header: #fff; --sidebar-right:#012549; --foreground-sidebar-right: #fff; --sidebar-left: #012549; --foreground-sidebar-left: #fff; --odds: #4c4c4e; --event-time: #e84233; --highlight: #fbef3c; --foreground-highlight: #fff;  --league: #494e4a; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #7f7d7e!important } .jogos, .eventos{ background: #7f7d7e!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #7f7d7e!important; } .footer{ background-color:#7f7d7e!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #4c4c4e; color: white; } .inside-event .tipo-apostas{ background-color: #7f7d7e!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } .tipo-apostas .nav-link{ color:#fff!important; }.mais-opcoes{ color: #fff!important; }"
    });
});

gulp.task('betspremio.bet', function (done) {
    tasks(done, {
        host: "betspremio.bet",
        banca: "BETS PRÊMIO",
        styles: "--header:#bf3545; --foreground-header: #fff; --sidebar-left: #bf3545; --sidebar-right: #bf3545;--odds:#011e46;--foreground-highlight: #fff;"
    });
});

gulp.task('centralbet.wee.bet', function (done) {
    tasks(done, {
        host: "centralbet.wee.bet",
        banca: "CENTRAL BET",
        styles: ""
    });
});

gulp.task('centralmixdeesportes.com', function (done) {
    tasks(done, {
        host: "centralmixdeesportes.com",
        banca: "CENTRAL MIX DE ESPORTES",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000;",
    });
});

gulp.task('dolarbets.wee.bet', function (done) {
    tasks(done, {
        host: "dolarbets.wee.bet",
        banca: "DOLAR BETS",
        styles: "--header:#005801; --foreground-header:#fff; --sidebar-left: #005801; --sidebar-right: #005801;--odds:#000;--foreground-highlight:#fff;",
    });
});

gulp.task('palmasbetsonline.wee.bet', function (done) {
    tasks(done, {
        host: "palmasbetsonline.wee.bet",
        banca: "PALMAS BETS",
        styles: "--header:#e61919; --foreground-header:#fff; --sidebar-left: #ff0000; --sidebar-right: #ff0000;--foreground-highlight:#fff;",
        aditional_styles: ".jogo-selecionado .fa-times{color:#fff;} .fechar-pre-bilhete .fa-times{color:#fff;}"
    });
});
