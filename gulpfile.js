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
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined"? "" : config.aditional_styles))
            .pipe(gulp.dest('src/'));

        remoteSrc(['logo_banca.png'], {
            base: 'http://' + config.host + '/tema/'})
            .pipe(gulp.dest('src/assets/images/'));
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
            .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined"? "" : config.aditional_styles))
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
        styles: "--header: #a8cf45; --foreground-header: #fff; --sidebar-right:#00a859; --sidebar-left: #00a859; --foreground-highlight: #000; --odds: #a8cf45; --event-time: #000;",
        aditional_styles: "body{ font-weight:bold; }"
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
        styles: "--header: #999999; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        old: true,
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
        styles: ""
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
        styles: "--header: #ff6600; --foreground-header: #fff; --sidebar-right:#ff6600; --foreground-sidebar-right: #fff; --sidebar-left: #ff6600; " +
        "--foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #000; --odds: #000; --foreground-odds: #fff; --event-time: #fd7e14;"
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
        styles: "--header: #00ab4f; --foreground-header: #b1c5e0; --sidebar-right:#00ab4f; --foreground-sidebar-right: #fff; --sidebar-left: #00ab4f; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #000; --odds: #73c48c; --foreground-odds: #fff;"
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
        styles: "--header: #4caf50; --foreground-header: #fff; --sidebar-right:#4caf50; --foreground-sidebar-right: #fff; --sidebar-left: #4caf50; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds: #4caf50; --foreground-odds: #fff;"
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
        styles: "--header: #2538ae; --foreground-header: #fff; --sidebar-right:#2538ae; --foreground-sidebar-right: #fff; --sidebar-left: #2538ae; --foreground-sidebar-left: #fff; --highlight: #ffc107; --foreground-highlight: #fff; --odds: #de1a42; --foreground-odds: #fff; --event-time: #000;",
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
        banca: "Bet4",
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
        scripts: "<!-- BEGIN JIVOSITE CODE {literal} --> <script type='text/javascript'> (function(){ var widget_id = 'Ot9IqOZjEP';var d=document;var w=window;function l(){ var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id ; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);} if(d.readyState=='complete'){l();}else{if(w.attachEvent){w.attachEvent('onload',l);} else{w.addEventListener('load',l,false);}}})(); </script> <!-- {/literal} END JIVOSITE CODE -->"
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
        styles: ""
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
