var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');
var remoteSrc = require('gulp-remote-src');

function tasks(done, config) {
    gulp.src(['config.ts'])
        .pipe(replace('[HOST]', 'central.' + config.host))
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(replace('[BANCA]', config.banca))
        .pipe(gulp.dest('src/app/shared/'));

    gulp.src(['index.html'])
        .pipe(replace('[HOST]', 'central.' + config.host))
        .pipe(replace('[S3_FOLDER]', config.host))
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
    // remoteSrc(['logo_banca.png'], {
    //     base: 'http://central.' + config.host + '/tema/'
    // })
    //     .pipe(gulp.dest('src/assets/images/'));

    // remoteSrc(['favicon.ico'], {
    //     base: 'http://central.' + config.host + '/tema/'
    // })
    //     .pipe(gulp.dest('src/'));

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
        .pipe(exec('ng build --prod', options))
        // .pipe(exec('ng build --configuration=england', options))
        // .pipe(exec('ng build --prod --outputHashing=none', options))
        .pipe(exec('cd dist && tar -czf tosend.tar * && scp -r -i ~/.keystore/weebet.pem tosend.tar ubuntu@' + config.host + ':/var/www/prod/bets/' + config.host + '/ && ssh -i ~/.keystore/weebet.pem ubuntu@' + config.host + ' sh /var/www/prod/bets/update_frontend.sh ' + config.host, options))
        .pipe(exec.reporter(reportOptions));

    done();
};

gulp.task('vipsports.wee.bet', function (done) {
    tasks(done, {
        host: "vipsports.wee.bet",
        banca: "Vip Sports",
        styles: "--header: #222d32; --foreground-header: #e50d1b; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #e50d1b; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('betsbr.club', function (done) {
    tasks(done, {
        host: "betsbr.club",
        banca: "Bets BR",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('betsports99.net', function (done) {
    tasks(done, {
        host: "betsports99.net",
        banca: "BET SPORTS 99",
        styles: "--header:#056162;--foreground-header:#fff;--sidebar-right:#056162;--foreground-sidebar-right:#fff;--sidebar-left:#056162;--foreground-sidebar-left:#fff;--odds:#648ee2;--foreground-odds: #000; --foreground-highlight:#000; --highlight:#ffca40;--league: #191970;--foreground-league: #fff;",
        aditional_styles: ".indentificacao .mais-opcoes{color: var(--event-time);}",
    });
});

gulp.task('casadinha.com', function (done) {
    tasks(done, {
        host: "casadinha.com",
        banca: "Casadinha.com",
        styles: "--header: #e1e1e1; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        aditional_styles: ".loading-app{color:#8c8c8c;} .menu-categories{background-color: #24415f;} .navbar-mobile{ background-color: #e1e1e1; } .odds .selecionado{ background: #24415f!important; } .odds .selecionado span{ color: #fff!important; } #fixed-bar-bilhete{ background: #24415f!important;color:#fff; } .navbar-mobile .menu-conta > a{color:#8c8c8c!important;}" +
            ".lds-ring div{border-color:#24415f transparent transparent transparent!important;}.btn-custom:hover,.value-informations .valores button:hover{color:var(--foreground-highlight)!important;border-color:var(--foreground-highlight);}"
    });
});

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
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

gulp.task('sertaobets.com', function (done) {
    tasks(done, {
        host: "sertaobets.com",
        banca: "Sertão Bets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
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
        aditional_styles: ".sem-evento{color: #fff;}  .jogos, .eventos{ background: #363636!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #363636!important; } .footer{ background-color:#363636!important; }" +
            " .inside-event .tipo-apostas{ background-color: #363636!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('superbetsport.com', function (done) {
    tasks(done, {
        host: "superbetsport.com",
        banca: "SUPER BET SPORT",
        styles: "--highlight:#ff0a0b;--league: yellow;",
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

gulp.task('ourobets.wee.bet', function (done) {
    tasks(done, {
        host: "ourobets.wee.bet",
        banca: "Ouro Bets",
        styles: ""
    });
});

gulp.task('jvsports.bet', function (done) {
    tasks(done, {
        host: "jvsports.bet",
        banca: "JV Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #da251c; --odds: #da251c; --foreground-odds: #fff;"
    });
});

gulp.task('esportbets.wee.bet', function (done) {
    tasks(done, {
        host: "esportbets.wee.bet",
        banca: "Esport Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;}  #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('redblue.wee.bet', function (done) {
    tasks(done, {
        host: "redblue.wee.bet",
        banca: "Red Blue",
        styles: "",
        // styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#333; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #cb151c; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
        // aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
        //     " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
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

gulp.task('apostapremiada.bet', function (done) {
    tasks(done, {
        host: "apostapremiada.bet",
        banca: "Aposta Premiada",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
    });
});

gulp.task('bet1.wee.bet', function (done) {
    tasks(done, {
        host: "bet1.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        host: "bet2.wee.bet",
        banca: "BetSports",
        styles: ""
    });
});

gulp.task('bet5.wee.bet', function (done) {
    tasks(done, {
        host: "bet5.wee.bet",
        banca: "Total Sorte",
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

gulp.task('foxbet.me', function (done) {
    tasks(done, {
        host: "foxbet.me",
        banca: "Fox Bet",
        styles: "--header: #000000; --foreground-header: #ffffff; --sidebar-right: #000000; --foreground-sidebar-right: #fff; --sidebar-left: #000000; --foreground-sidebar-left: #fff; --highlight: #f28123; --foreground-highlight: #ffffff; --odds: #0c9fa0; --foreground-odds: #fff; --event-time: #f58021;",
    });
});

gulp.task('akiapostas.wee.bet', function (done) {
    tasks(done, {
        host: "akiapostas.wee.bet",
        banca: "AKI Apostas",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;"
    });
});

gulp.task('masterbet.wee.bet', function (done) {
    tasks(done, {
        host: "masterbet.wee.bet",
        banca: "MasterBet",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #ffdf1b; --odds: #000; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('placardarodada.wee.bet', function (done) {
    tasks(done, {
        host: "placardarodada.wee.bet",
        banca: "Placar da Rodada",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#019934; --foreground-sidebar-right: #fff; --sidebar-left: #019934; --foreground-sidebar-left: #fff; --highlight:#019934; --foreground-highlight: #fff; --odds: #000; --foreground-odds: #fff; --foreground-selected-odds:#fff;",
        // aditional_styles: ".sidebar-brand{ margin-top: 0!important; } .sidebar-brand img{ max-width: 100%!important; max-height: none!important; }"
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

gulp.task('amigosdabola.wee.bet', function (done) {
    tasks(done, {
        host: "amigosdabola.wee.bet",
        banca: "Amigos da Bola",
        styles: "--header: red; --foreground-header: #fff; --sidebar-right:red; --foreground-sidebar-right: #fff; --sidebar-left: #373435; --foreground-sidebar-left: #fff; --highlight: #ffc107; --foreground-highlight: #fff; --odds: #373435; --foreground-odds: #fff; --event-time: red;",
    });
});

gulp.task('bets188.bet', function (done) {
    tasks(done, {
        host: "bets188.bet",
        banca: "Bets 188",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #000; --foreground-odds: #fff; --event-time: #777; --league: #f5a432; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;}  #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
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

gulp.task('jcapostas.wee.bet', function (done) {
    tasks(done, {
        host: "jcapostas.wee.bet",
        banca: "JC Apostas",
        styles: "--header: #292729;--sidebar-right:#292729;--sidebar-left: #292729;--highlight: #e4e4e4;--odds: #15814f;"
    });
});

gulp.task('betsgo.wee.bet', function (done) {
    tasks(done, {
        host: "betsgo.wee.bet",
        banca: "Bets Go",
        styles: "--header: #404040;--foreground-header:#fff;--sidebar-right:#404040;--sidebar-left: #404040;--highlight: #ff5900;--foreground-highlight:#fff;--odds: #999999;--event-time: #999999; --league: #ff5900;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ color:#000;border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
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

gulp.task('rexpasports.wee.bet', function (done) {
    tasks(done, {
        host: "rexpasports.wee.bet",
        banca: "REXPA Sports",
        styles: "--header:#00342a;--foreground-header:#fff;--sidebar-right:#00342a;--foreground-sidebar-right:#fff;--sidebar-left:#00342a;--foreground-sidebar-left:#fff;--odds:#ffca40;--foreground-odds: #000; --foreground-highlight:#fff; --highlight:#648ee2;--league: #367fa8;--foreground-league: #fff;",
        aditional_styles: ".indentificacao .mais-opcoes{color: var(--event-time);} .tipo-apostas .tipo-aposta h4 {background: #247451;color: #fff;padding: 5px;}",
        // styles: "--header:#5b86da;--foreground-header:#fff;--sidebar-right:#5b86da;--foreground-sidebar-right:#fff;--sidebar-left:#072550;--foreground-sidebar-left:#fff;--odds:#08254f;--foreground-odds: #fff; --foreground-highlight:#fff; --highlight:#2e82b8;"
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

gulp.task('betsplacar.club', function (done) {
    tasks(done, {
        host: "betsplacar.club",
        banca: "Bets Placar",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--league: #fc6402;--foreground-league: #fff;"
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
        host: "esportebets.io",
        banca: "Esporte Bets",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000; --odds: #003ae6; --foreground-highlight: #fff;"
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

gulp.task('betsgol.net', function (done) {
    tasks(done, {
        host: "betsgol.wee.bet",
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
        styles: "--header: #326038; --foreground-header: #fff; --sidebar-right:#2c5432; --foreground-sidebar-right: #fff; --sidebar-left: #2c5432; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #4d812a; --foreground-odds: #fff; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;"
    });
});

gulp.task('apremiada.bet', function (done) {
    tasks(done, {
        host: "apremiada.bet",
        banca: "APREMIADA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
    });
});

gulp.task('x2bet.wee.bet', function (done) {
    tasks(done, {
        host: "x2bet.wee.bet",
        banca: "X2 BET",
        styles: "--header: #333; --foreground-header: #fff;--sidebar-right:#333;--sidebar-left:#333;--odds:#3c8dbc;--foreground-highlight:#fff;"
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

gulp.task('sportpremium.wee.bet', function (done) {
    tasks(done, {
        host: "sportpremium.wee.bet",
        banca: "SPORT PREMIUM",
        styles: "--header:#000; --foreground-header: #fff;--sidebar-left: #000; --sidebar-right: #000; --odds:#ff0000;"
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
        styles: "--header:#e61919; --foreground-header: #fff;--sidebar-left: #e61919; --sidebar-right: #e61919; --odds:#000;--highlight:#ff0000;--foreground-highlight:#fff;",
        aditional_styles: ".jogo-selecionado .fa-times{color:#fff;} .fechar-pre-bilhete .fa-times{color:#fff;}"
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
        styles: "--header: #2e2e2e; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: red;",
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
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#f39200;--event-time: #000;--league: #000;--foreground-league: #fff;"
    });
});

gulp.task('betspremio.bet', function (done) {
    tasks(done, {
        host: "betspremio.bet",
        banca: "BETS PRÊMIO",
        styles: "--header:#bf3545; --foreground-header: #fff; --sidebar-left: #bf3545; --sidebar-right: #bf3545;--odds:#011e46;--foreground-highlight: #fff;"
    });
});

gulp.task('dolarbets.wee.bet', function (done) {
    tasks(done, {
        host: "dolarbets.wee.bet",
        banca: "DOLAR BETS",
        styles: "--header:#005801; --foreground-header:#fff; --sidebar-left: #005801; --sidebar-right: #005801;--odds:#000;--foreground-highlight:#fff;--league: #ffcc28;",
    });
});

gulp.task('mssportes.wee.bet', function (done) {
    tasks(done, {
        host: "mssportes.wee.bet",
        banca: "MS Sportes",
        styles: "--highlight: #008ef6; --foreground-highlight: #fff; --odds: #ffb701; --foreground-odds: #011e46; --foreground-selected-odds:#fff",
        scripts: "<script src='https://wbot.chat/index.js' token='5da557681f66c482cc8e36c57419f260'></script>"
    });
});

gulp.task('aliancabets.net', function (done) {
    tasks(done, {
        host: "aliancabets.net",
        banca: "ALIANÇA BETS",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000;--highlight:#feb701;--foreground-highlight:#fff; --odds: #002458;",
    });
});

gulp.task('betspiaui.bet', function (done) {
    tasks(done, {
        host: "betspiaui.bet",
        banca: "BETS PIAUÍ",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000;--highlight:#ffb701;--foreground-highlight:#fff; --odds: #112f61;",
    });
});

gulp.task('alsports.wee.bet', function (done) {
    tasks(done, {
        host: "alsports.wee.bet",
        banca: "AL SPORTS",
        styles: "",
    });
});

gulp.task('slsports.wee.bet', function (done) {
    tasks(done, {
        host: "slsports.wee.bet",
        banca: "SL SPORTS",
        styles: "--header: #006600; --foreground-header: #fff; --sidebar-right:#7fb96a; --foreground-sidebar-right: #fff; --sidebar-left: #7fb96a; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #4cbca3; --event-time: yellow; --fg-event-time: #000;",
    });
});

gulp.task('betdez.net', function (done) {
    tasks(done, {
        host: "betdez.net",
        banca: "BetDez",
        styles: "--header: #fff; --foreground-header: #000; --sidebar-right: #fff; --foreground-sidebar-right: #000; --sidebar-left: #fff; --foreground-sidebar-left: #000; --highlight: #232d40; --foreground-highlight: #232d40; --odds: #71b04c; --foreground-odds: #fff; --event-time: #232d40;--foreground-selected-odds:#fff;",
        aditional_styles: ".menu-categories .active a {color: #003f7f!important;} .odds .selecionado span{color:#fff!important;} .content-header h2{color:#003f7f!important;}",
    });
});

gulp.task('betshouse.wee.bet', function (done) {
    tasks(done, {
        host: "betshouse.wee.bet",
        banca: "BETS HOUSE",
        styles: "--header: #ffcc02; --foreground-header: #000; --sidebar-right: #ffcc02; --foreground-sidebar-right: #000; --sidebar-left: #ffcc02; --foreground-sidebar-left: #000; --highlight: #d46345; --foreground-highlight: #fff; --odds: #000; --foreground-odds: #fff;",
    });
});

gulp.task('betsgol.live', function (done) {
    tasks(done, {
        host: "betsgol.live",
        banca: "BETS GOL",
        styles: ""
    });
});

gulp.task('minibets.wee.bet', function (done) {
    tasks(done, {
        host: "minibets.wee.bet",
        banca: "MINI BETS",
        styles: ""
    });
});

gulp.task('palpitesbets.com', function (done) {
    tasks(done, {
        host: "palpitesbets.com",
        banca: "PALPITES BETS",
        styles: "--header: #f1af09; --foreground-header :#fff; --sidebar-right: #daa520; --sidebar-left: #daa520; --odds: #006400; --foreground-highlight: #fff;"
    });
});

gulp.task('betfut.wee.bet', function (done) {
    tasks(done, {
        host: "betfut.wee.bet",
        banca: "BETFUT",
        styles: "--header: #000; --foreground-header :#fff; --sidebar-right: #000; --sidebar-left: #000; --odds: #181a4b;"
    });
});

gulp.task('resenhaesportiva.site', function (done) {
    tasks(done, {
        host: "resenhaesportiva.site",
        banca: "RESENHA ESPORTIVA",
        styles: "",
    });
});

gulp.task('showdebola.wee.bet', function (done) {
    tasks(done, {
        host: "showdebola.wee.bet",
        banca: "SHOW DE BOLA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #008000;",
    });
});

gulp.task('topbets.website', function (done) {
    tasks(done, {
        host: "topbets.website",
        banca: "TOP BETS",
        styles: "",
    });
});

gulp.task('winbet.store', function (done) {
    tasks(done, {
        host: "winbet.store",
        banca: "WIN BET",
        styles: "--odds: #bb0000;",
    });
});

gulp.task('pazbet.com', function (done) {
    tasks(done, {
        host: "pazbet.com",
        banca: "PAZ BET",
        styles: "",
    });
});

gulp.task('bigbets.website', function (done) {
    tasks(done, {
        host: "bigbets.website",
        banca: "BIG BETS",
        styles: "--header: #000000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #62af26;"
    });
});

gulp.task('bets085.wee.bet', function (done) {
    tasks(done, {
        host: "bets085.wee.bet",
        banca: "BETS 085",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('soccer787.site', function (done) {
    tasks(done, {
        host: "soccer787.site",
        banca: "SOCCER 787",
        styles: "--header: #33546f; --foreground-header: #fff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;"
    });
});

gulp.task('superbet365.bet', function (done) {
    tasks(done, {
        host: "superbet365.bet",
        banca: "SUPER BET 365",
        styles: "",
    });
});

gulp.task('sampabet.wee.bet', function (done) {
    tasks(done, {
        host: "sampabet.wee.bet",
        banca: "SAMPA BET",
        styles: "",
    });
});

gulp.task('sportbig.wee.bet', function (done) {
    tasks(done, {
        host: "sportbig.wee.bet",
        banca: "SPORT BIG",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314; --league: #90EE90; --foreground-league: #000"
    });
});

gulp.task('betsporting.wee.bet', function (done) {
    tasks(done, {
        host: "betsporting.wee.bet",
        banca: "BET SPORTING",
        styles: "",
    });
});

gulp.task('apostasminas.site', function (done) {
    tasks(done, {
        host: "apostasminas.site",
        banca: "APOSTAS MINAS",
        styles: "--highlight: #ffd700; --odds: #ffa500; --foreground-odds: #fff;",
    });
});

gulp.task('moralbets.com', function (done) {
    tasks(done, {
        host: "moralbets.com",
        banca: "MORAL BETS",
        styles: "--header: #a9a9a9; --foreground-header: #000; --sidebar-right: #a9a9a9; --foreground-sidebar-right: #000; --sidebar-left: #a9a9a9; --foreground-sidebar-left: #000;--highlight:#68eb5a;--foreground-highlight: #000;--odds:#000;",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --><script async src='https://www.googletagmanager.com/gtag/js?id=G-4D549X8JK5'></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-4D549X8JK5');</script>"
    });
});

gulp.task('capitalsports.site', function (done) {
    tasks(done, {
        host: "capitalsports.site",
        banca: "CAPITAL SPORTS",
        styles: "--odds: #014610;",
    });
});

gulp.task('mundodasapostas.site', function (done) {
    tasks(done, {
        host: "mundodasapostas.site",
        banca: "MUNDO DAS APOSTAS",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;"
    });
});

gulp.task('arena10.site', function (done) {
    tasks(done, {
        host: "arena10.site",
        banca: "ARENA 10",
        styles: "--header: #222d32; --foreground-header: #daa520; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #daa520; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('osascosportsbet.wee.bet', function (done) {
    tasks(done, {
        host: "osascosportsbet.wee.bet",
        banca: "OSASCO SPORTS",
        styles: "",
    });
});

gulp.task('serra99.wee.bet', function (done) {
    tasks(done, {
        host: "serra99.wee.bet",
        banca: "SERRA 99",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffbf00; --odds: #00338e;",
    });
});

gulp.task('jogadacerta.wee.bet', function (done) {
    tasks(done, {
        host: "jogadacerta.wee.bet",
        banca: "JOGADA CERTA",
        styles: "--header: #c5c5c5; --foreground-header: #000; --sidebar-right:#c5c5c5; --foreground-sidebar-right: #000; --sidebar-left: #c5c5c5; --foreground-sidebar-left: #000; --foreground-highlight:#000; --highlight:#ff3232;",
    });
});

gulp.task('globoesporte.bet', function (done) {
    tasks(done, {
        host: "globoesporte.bet",
        banca: "GLOBO ESPORTE",
        styles: "--header: #505050; --foreground-header: #fff; --sidebar-right:#505050; --foreground-sidebar-right: #fff; --sidebar-left: #505050; --foreground-sidebar-left: #fff; --odds: #e32636;",
    });
});

gulp.task('chutebets.wee.bet', function (done) {
    tasks(done, {
        host: "chutebets.wee.bet",
        banca: "CHUTE BETS",
        styles: "",
    });
});

gulp.task('superbetplus.club', function (done) {
    tasks(done, {
        host: "superbetplus.club",
        banca: "SUPER BET PLUS",
        styles: "--league: yellow;",
    });
});

gulp.task('i9bets.wee.bet', function (done) {
    tasks(done, {
        host: "i9bets.wee.bet",
        banca: "I9 BETS",
        styles: "",
    });
});

gulp.task('portugabet.site', function (done) {
    tasks(done, {
        host: "portugabet.site",
        banca: "PORTUGA BET",
        styles: "--header: #008000; --foreground-header: #fff; --sidebar-right:#e50200; --foreground-sidebar-right: #fff; --sidebar-left: #e50200; --foreground-sidebar-left: #fff; --odds: #008000;--league: #ffd700;--highlight: #ffd700;--foreground-highlight:#fff;",
    });
});

gulp.task('ingamesports.wee.bet', function (done) {
    tasks(done, {
        host: "ingamesports.wee.bet",
        banca: "INGAME SPORTS",
        styles: "--header: #116D51; --foreground-header: #fff; --sidebar-right:#116D51; --foreground-sidebar-right: #fff; --sidebar-left: #116D51; --foreground-sidebar-left: #fff; --odds: #000;--highlight:red;--foreground-highlight:#fff;",
    });
});

gulp.task('gobets.wee.bet', function (done) {
    tasks(done, {
        host: "gobets.wee.bet",
        banca: "GO BETS",
        styles: "--odds: #fbb03b;--foreground-odds:#000;--foreground-selected-odds: #fff;--highlight:gray;--foreground-highlight:#fff;",
    });
});

gulp.task('imperiobonitobet.site', function (done) {
    tasks(done, {
        host: "imperiobonitobet.site",
        banca: "IMPÉRIO BONITO",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #ffd700;--foreground-odds: #000;--highlight:red;--foreground-highlight:#fff;",
    });
});

gulp.task('bet316top.wee.bet', function (done) {
    tasks(done, {
        host: "bet316top.wee.bet",
        banca: "BETS 316 TOP",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#e50d1b; --foreground-sidebar-right: #fff; --sidebar-left: #e50d1b; --foreground-sidebar-left: #fff; --odds: #d5d7d6;--foreground-odds:#000;--foreground-selected-odds: #fff;--highlight:#444444;--foreground-highlight:#fff;--league: #868686; --foreground-league: #fff;",
        aditional_styles: ".indentificacao .mais-opcoes{color: #e50d1b;} .jogo-selecionado .fa-times{color:#fff;} .fechar-pre-bilhete .fa-times{color:#fff;} .jogos, .eventos{ color: #e50d1b!important; }",
    });
});

gulp.task('brazilsportsrodon.wee.bet', function (done) {
    tasks(done, {
        host: "brazilsportsrodon.wee.bet",
        banca: "BRAZIL SPORTS RODON",
        styles: "",
    });
});

gulp.task('eisports.club', function (done) {
    tasks(done, {
        host: "eisports.club",
        banca: "EI SPORTS",
        styles: "--header: #60a443; --foreground-header: #fff; --sidebar-right:#60a443; --foreground-sidebar-right: #fff; --sidebar-left: #60a443; --foreground-sidebar-left: #fff; --odds: #000;--foreground-odds:#fff;--highlight:#7dd856;--foreground-highlight:#fff;",
    });
});

gulp.task('clubedabola.wee.bet', function (done) {
    tasks(done, {
        host: "clubedabola.wee.bet",
        banca: "CLUBE DA BOLA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #11192e;--foreground-selected-odds: #fff;--highlight:#d49011;--foreground-highlight:#fff;",
    });
});

gulp.task('lbbet.wee.bet', function (done) {
    tasks(done, {
        host: "lbbet.wee.bet",
        banca: "LBBET",
        styles: "--header: #3aaa35; --foreground-header: #fff; --sidebar-right:#3aaa35; --foreground-sidebar-right: #fff; --sidebar-left: #3aaa35; --foreground-sidebar-left: #fff; --odds: #5e5e5e;--foreground-highlight:#fff;",
    });
});

gulp.task('top10sportsvip.com', function (done) {
    tasks(done, {
        host: "top10sportsvip.com",
        banca: "TOP 10 SPORTS VIP",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;--league: #35cc96; --foreground-league: #fff;",
    });
});

gulp.task('brasilgolbets.com', function (done) {
    tasks(done, {
        host: "brasilgolbets.com",
        banca: "BRASIL GOL BETS",
        styles: "--header: #222d32; --foreground-header: #009c39; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;--league: #009c39; --foreground-league: #fff;",
    });
});

gulp.task('shopbet.wee.bet', function (done) {
    tasks(done, {
        host: "shopbet.wee.bet",
        banca: "SHOP BET",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --><script async src='https://www.googletagmanager.com/gtag/js?id=G-8X8TV3CM9T'></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-8X8TV3CM9T');</script>"
    });
});

gulp.task('esportepremium.wee.bet', function (done) {
    tasks(done, {
        host: "esportepremium.wee.bet",
        banca: "ESPORTE PREMIUM",
        styles: "",
    });
});

gulp.task('brazilbet.club', function (done) {
    tasks(done, {
        host: "brazilbet.club",
        banca: "BRAZIL BET",
        styles: "--header: #000; --foreground-header: #006d10; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #006d10;--highlight:#f29d00;--foreground-highlight:#fff;",
    });
});
gulp.task('betgol.site', function (done) {
    tasks(done, {
        host: "betgol.site",
        banca: "BET GOL",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('acsportsbets.site', function (done) {
    tasks(done, {
        host: "acsportsbets.site",
        banca: "AC SPORTS BETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #0000ff; --foreground-highlight: #fff; --odds: #191970; --foreground-odds: #fff;--foreground-selected-odds: #fff;",
    });
});

gulp.task('kinoesporte.wee.bet', function (done) {
    tasks(done, {
        host: "kinoesporte.wee.bet",
        banca: "KINO ESPORTE",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#1C1C1C; --foreground-sidebar-right: #fff; --sidebar-left: #1C1C1C; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #fff; --odds: #ffd700; --foreground-odds: #000;",
    });
});

gulp.task('7bet.wee.bet', function (done) {
    tasks(done, {
        host: "7bet.wee.bet",
        banca: "7 BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #fff; --odds: #008000;",
    });
});

gulp.task('bet99.site', function (done) {
    tasks(done, {
        host: "bet99.site",
        banca: "BET99",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --highlight: #3CB371; --odds: #008037;",
    });
});

gulp.task('garanhunsbet.site', function (done) {
    tasks(done, {
        host: "garanhunsbet.site",
        banca: "GARANHUNS BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #00008B;",
    });
});

gulp.task('cearabetsplacardarodada.wee.bet', function (done) {
    tasks(done, {
        host: "cearabetsplacardarodada.wee.bet",
        banca: "CEARÁ BETS",
        styles: "",
    });
});

gulp.task('betcoinsports.wee.bet', function (done) {
    tasks(done, {
        host: "betcoinsports.wee.bet",
        banca: "BET COIN SPORTS",
        styles: "",
    });
});

gulp.task('carecasbet.site', function (done) {
    tasks(done, {
        host: "carecasbet.site",
        banca: "CARECAS BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff;--highlight: #ff3f00; --foreground-highlight: #fff; --odds: #00008B;",
    });
});

gulp.task('apostatop.wee.bet', function (done) {
    tasks(done, {
        host: "apostatop.wee.bet",
        banca: "APOSTA TOP",
        styles: "",
    });
});

gulp.task('parabets2ufcord.wee.bet', function (done) {
    tasks(done, {
        host: "parabets2ufcord.wee.bet",
        banca: "PARÁ BETS",
        styles: "",
    });
});

gulp.task('tubaraobet.wee.bet', function (done) {
    tasks(done, {
        host: "tubaraobet.wee.bet",
        banca: "TUBARÃO BET",
        styles: "--header: #111111; --foreground-header: #fff; --sidebar-right:#000000; --foreground-sidebar-right: #fff; --sidebar-left: #000000; --foreground-sidebar-left: #fff;--highlight: #f5d328; --foreground-highlight: #fff; --odds: #191970;",
    });
});

gulp.task('allbet.pro', function (done) {
    tasks(done, {
        host: "allbet.pro",
        banca: "ALL BET",
        styles: "",
    });
});

gulp.task('primesoccer.app', function (done) {
    tasks(done, {
        host: "primesoccer.app",
        banca: "PRIME SOCCER",
        styles: "",
    });
});

gulp.task('sportbetclub7.wee.bet', function (done) {
    tasks(done, {
        host: "sportbetclub7.wee.bet",
        banca: "SPORT BET CLUB7",
        styles: "",
    });
});

gulp.task('betshow.wee.bet', function (done) {
    tasks(done, {
        host: "betshow.wee.bet",
        banca: "BET SHOW",
        styles: "",
    });
});

gulp.task('futbets.wee.bet', function (done) {
    tasks(done, {
        host: "futbets.wee.bet",
        banca: "FUT BETS",
        styles: "",
    });
});

gulp.task('pontalbet.wee.bet', function (done) {
    tasks(done, {
        host: "pontalbet.wee.bet",
        banca: "PONTAL BET",
        styles: "",
    });
});

gulp.task('primosbet.wee.bet', function (done) {
    tasks(done, {
        host: "primosbet.wee.bet",
        banca: "PRIMOS BET",
        styles: "",
    });
});

gulp.task('betvipmais.wee.bet', function (done) {
    tasks(done, {
        host: "betvipmais.wee.bet",
        banca: "BET VIP MAIS",
        styles: "",
    });
});

gulp.task('primussports.net', function (done) {
    tasks(done, {
        host: "primussports.net",
        banca: "PRIMUS SPORTS",
        styles: "",
    });
});

gulp.task('sports10.net', function (done) {
    tasks(done, {
        host: "sports10.net",
        banca: "SPORTS 10",
        styles: "",
    });
});

gulp.task('jogabet.wee.bet', function (done) {
    tasks(done, {
        host: "jogabet.wee.bet",
        banca: "JOGA BET",
        styles: "",
    });
});

gulp.task('maisporte.wee.bet', function (done) {
    tasks(done, {
        host: "maisporte.wee.bet",
        banca: "MAISPORTE",
        styles: "",
    });
});

gulp.task('onllinesports.com', function (done) {
    tasks(done, {
        host: "onllinesports.com",
        banca: "ONLLINE SPORTS",
        styles: "",
    });
});

gulp.task('paracorreabets.wee.bet', function (done) {
    tasks(done, {
        host: "paracorreabets.wee.bet",
        banca: "PARÁ CORRÊA BETS",
        styles: "",
    });
});

gulp.task('supersports.wee.bet', function (done) {
    tasks(done, {
        host: "supersports.wee.bet",
        banca: "SUPER SPORTS",
        styles: "",
    });
});

gulp.task('rrbets.wee.bet', function (done) {
    tasks(done, {
        host: "rrbets.wee.bet",
        banca: "RR BETS",
        styles: "",
    });
});

gulp.task('sportingnetvip.bet', function (done) {
    tasks(done, {
        host: "sportingnetvip.bet",
        banca: "SPORTING NET VIP",
        styles: "",
    });
});

gulp.task('techbet.wee.bet', function (done) {
    tasks(done, {
        host: "techbet.wee.bet",
        banca: "TECH BET",
        styles: "",
    });
});

gulp.task('galobets.com', function (done) {
    tasks(done, {
        host: "galobets.com",
        banca: "GALO BETS",
        styles: "",
    });
});

gulp.task('reallbet.site', function (done) {
    tasks(done, {
        host: "reallbet.site",
        banca: "REALLBET",
        styles: "",
    });
});

gulp.task('apostasms.wee.bet', function (done) {
    tasks(done, {
        host: "apostasms.wee.bet",
        banca: "APOSTAS MS",
        styles: "",
    });
});

gulp.task('olimpobetsvip.wee.bet', function (done) {
    tasks(done, {
        host: "olimpobetsvip.wee.bet",
        banca: "OLIMPO BETS VIP",
        styles: "",
    });
});

gulp.task('betsnet.me', function (done) {
    tasks(done, {
        host: "betsnet.me",
        banca: "BETS NET",
        styles: "",
    });
});

gulp.task('lobobet.net', function (done) {
    tasks(done, {
        host: "lobobet.net",
        banca: "LOBO BET",
        styles: "",
    });
});

gulp.task('texas93.bet', function (done) {
    tasks(done, {
        host: "texas93.bet",
        banca: "TEXAS 93",
        styles: "",
    });
});

gulp.task('mybets.club', function (done) {
    tasks(done, {
        host: "mybets.club",
        banca: "MY BETS",
        styles: "",
    });
});

gulp.task('topsports.wee.bet', function (done) {
    tasks(done, {
        host: "topsports.wee.bet",
        banca: "TOP SPORTS",
        styles: "",
    });
});

gulp.task('maranhaobets.net', function (done) {
    tasks(done, {
        host: "maranhaobets.net",
        banca: "MARANHÃO BETS",
        styles: "",
    });
});

gulp.task('pagadorabet.com', function (done) {
    tasks(done, {
        host: "pagadorabet.com",
        banca: "PAGADORA BET",
        styles: "",
    });
});

gulp.task('sportbetapostas.wee.bet', function (done) {
    tasks(done, {
        host: "sportbetapostas.wee.bet",
        banca: "SPORT BET APOSTAS",
        styles: "",
    });
});

gulp.task('3xbets.site', function (done) {
    tasks(done, {
        host: "3xbets.site",
        banca: "3X BETS",
        styles: "",
    });
});

gulp.task('ligavip.wee.bet', function (done) {
    tasks(done, {
        host: "ligavip.wee.bet",
        banca: "LIGA VIP",
        styles: "",
    });
});

gulp.task('diretoriasport.bet', function (done) {
    tasks(done, {
        host: "diretoriasport.bet",
        banca: "DIRETORIA SPORT",
        styles: "",
    });
});

gulp.task('aeapostas.wee.bet', function (done) {
    tasks(done, {
        host: "aeapostas.wee.bet",
        banca: "AE APOSTAS",
        styles: "",
    });
});

gulp.task('kabumbet.site', function (done) {
    tasks(done, {
        host: "kabumbet.site",
        banca: "KABUM BET",
        styles: "",
    });
});

gulp.task('betsgames.net', function (done) {
    tasks(done, {
        host: "betsgames.net",
        banca: "BETS GAMES",
        styles: "",
    });
});

gulp.task('megasports.wee.bet', function (done) {
    tasks(done, {
        host: "megasports.wee.bet",
        banca: "MEGA SPORTS",
        styles: "",
    });
});

gulp.task('quina.bet', function (done) {
    tasks(done, {
        host: "quina.bet",
        banca: "QUINA BET",
        styles: "",
    });
});

gulp.task('jbrbets.net', function (done) {
    tasks(done, {
        host: "jbrbets.net",
        banca: "JBR BETS",
        styles: "",
    });
});

gulp.task('lucrei.wee.bet', function (done) {
    tasks(done, {
        host: "lucrei.wee.bet",
        banca: "LUCREI BET",
        styles: "",
    });
});

gulp.task('pixsports.wee.bet', function (done) {
    tasks(done, {
        host: "pixsports.wee.bet",
        banca: "PIX SPORTS",
        styles: "",
    });
});

gulp.task('cariocavip.wee.bet', function (done) {
    tasks(done, {
        host: "cariocavip.wee.bet",
        banca: "CARIOCA VIP",
        styles: "",
    });
});

gulp.task('zaplances.bet', function (done) {
    tasks(done, {
        host: "zaplances.bet",
        banca: "ZAP LANCES",
        styles: "",
    });
});

gulp.task('mais1bet.com', function (done) {
    tasks(done, {
        host: "mais1bet.com",
        banca: "MAIS1BET",
        styles: "",
    });
});

gulp.task('kaiosport.wee.bet', function (done) {
    tasks(done, {
        host: "kaiosport.wee.bet",
        banca: "KAIO SPORT",
        styles: "",
    });
});

gulp.task('imperiobet.wee.bet', function (done) {
    tasks(done, {
        host: "imperiobet.wee.bet",
        banca: "IMPÉRIO BET",
        styles: "",
    });
});
