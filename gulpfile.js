var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');

function tasks(done, config) {
    let sharedUrl = config.host;

    if (config.shared_url) {
        sharedUrl = config.shared_url;
    }

    gulp.src(['base-build/config.ts'])
        .pipe(replace('[HOST]', 'central.' + config.host))
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(replace('[SHARED_URL]', sharedUrl))
        .pipe(replace('[BANCA]', config.banca))
        .pipe(gulp.dest('src/app/shared/'));

    gulp.src(['base-build/index.html'])
        .pipe(replace('[HOST]', 'central.' + config.host))
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(replace('[BANCA]', config.banca))
        .pipe(replace('[SCRIPTS]', typeof config.scripts == "undefined" ? "" : config.scripts))
        .pipe(replace('[GOOGLE_TAG_PART_1]', typeof config.google_tag_part_1 == "undefined" ? "" : config.google_tag_part_1))
        .pipe(replace('[GOOGLE_TAG_PART_2]', typeof config.google_tag_part_2 == "undefined" ? "" : config.google_tag_part_2))
        .pipe(replace('[PIXEL]', typeof config.pixel == "undefined" ? "" : config.pixel))
        .pipe(replace('[CUSTOM]', config.styles))
        .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined" ? "" : config.aditional_styles))
        .pipe(gulp.dest('src/'));

    gulp.src(['base-build/bilhete/index.html'])
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(gulp.dest('src/bilhete/'));

    gulp.src(['base-build/bilhete/app-service.js'])
        .pipe(replace('[HOST]', config.host))
        .pipe(gulp.dest('src/bilhete/'));

    let currency = 'BRL';
    if (config.currency) {
        currency = config.currency;
    }

    gulp.src(['base-build/bilhete/app.js'])
        .pipe(replace('[CURRENCY]', currency))
        .pipe(gulp.dest('src/bilhete/'));

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

    let environment = 'production';
    if (config.environment) {
        environment = config.environment;
    }

    gulp.src(['/'])
        .pipe(exec(`ng build --configuration ${environment}`, options))
        .pipe(exec('cd dist && tar -czf tosend.tar * && scp -r -i ~/.keystore/weebet.pem tosend.tar ubuntu@' + config.server + ':/var/www/prod/bets/' + config.host + '/ && ssh -i ~/.keystore/weebet.pem ubuntu@' + config.server + ' sh /var/www/prod/bets/update_frontend.sh ' + config.host, options))
        .pipe(exec.reporter(reportOptions));

    done();
};

gulp.task('vipsports.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "vipsports.wee.bet",
        banca: "Vip Sports",
        styles: "--header: #222d32; --foreground-header: #e50d1b; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #e50d1b; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('betsbr.club', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betsbr.club",
        banca: "Bets BR",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('casadinha.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "casadinha.com",
        banca: "Casadinha.com",
        styles: "--header: #e1e1e1; --foreground-header: #fff; --sidebar-right:#e1e1e1; --foreground-sidebar-right: #555555; --sidebar-left: #e1e1e1; --foreground-sidebar-left: #555555; --highlight: #67ad5a; --foreground-highlight: #24415f; --odds: #67ad5a; --foreground-odds: #fff; --league: #e1e1e1; --foreground-league: #002458;",
        aditional_styles: "#footer-bar{background-color: #24415f!important;} .foot-button .cupom-badge{color: #24415f!important;} .loading-app{color:#8c8c8c;} .menu-categories{background-color: #24415f;} .navbar-mobile{ background-color: #e1e1e1; } .odds .selecionado{ background: #24415f!important; } .odds .selecionado span{ color: #fff!important; } #fixed-bar-bilhete{ background: #24415f!important;color:#fff; } .navbar-mobile .menu-conta > a{color:#8c8c8c!important;}" +
            ".lds-ring div{border-color:#24415f transparent transparent transparent!important;}.btn-custom:hover,.value-informations .valores button:hover{color:var(--foreground-highlight)!important;border-color:var(--foreground-highlight);}"
    });
});

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('vitrine.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "vitrine.wee.bet",
        banca: "Vitrine",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
    });
});

gulp.task('sandbox.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sandbox.wee.bet",
        banca: "SANDBOX",
        styles: "",
    });
});

gulp.task('esportivatop.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "esportivatop.wee.bet",
        banca: "Esportiva Top",
        styles: ""
    });
});

gulp.task('eurosportbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "eurosportbet.wee.bet",
        banca: "Euro Sport",
        styles: ""
    });
});

gulp.task('major.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "major.wee.bet",
        banca: "Major",
        styles: "--header:#046eef;--sidebar-right:#046eef;--sidebar-left:#046eef;--odds:#011e46;"
    });
});


gulp.task('mjrsports.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "mjrsports.com",
        banca: "MJR SPORTS",
        styles: "--header: #3F6826; --foreground-header: #b1c5e0; --sidebar-right: #3B5323; --foreground-sidebar-right: #fff; --sidebar-left: #3B5323; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: #dab600; --foreground-odds: #fff; --selected-event: #000;",
        pixel: "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>"
    });
});

gulp.task('oliverbet.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "oliverbet.com",
        banca: "Oliver Bet",
        styles: ""
    });
});

gulp.task('sertaobets.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sertaobets.com",
        banca: "Sertão Bets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('sportsshow.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "sportsshow.wee.bet",
        banca: "Sports Show",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: yellow; --odds: red; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #cb151c; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('superbets.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "superbets.bet",
        banca: "SUPERBETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --sidebar-left: #000;"
    });
});

gulp.task('superbetsport.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "superbetsport.com",
        banca: "SUPER BET SPORT",
        styles: "--highlight:#ff0a0b;--league: yellow;",
    });
});

gulp.task('trevodasorte.me', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "trevodasorte.me",
        banca: "Trevo da Sorte",
        styles: "--header: #4caf50; --foreground-header: #cce2ff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #4caf50; --foreground-odds: #fff;",
    });
});

gulp.task('ourobets.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ourobets.wee.bet",
        banca: "Ouro Bets",
        styles: ""
    });
});

gulp.task('jvsports.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "jvsports.bet",
        banca: "JV Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #da251c; --odds: #da251c; --foreground-odds: #fff;"
    });
});

gulp.task('esportbets.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "esportbets.wee.bet",
        banca: "Esport Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;}  #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('redblue.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "redblue.wee.bet",
        banca: "Red Blue",
        styles: "",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #jogo-default-wrapper{ background: #0f0f11!important } .jogos, .eventos{ background: #0f0f11!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #0f0f11!important; } .footer{ background-color:#0f0f11!important; }" +
            ".jogo-container .indentificacao-mobile, .jogo-container .indentificacao, .jogo-container .campeonato-nome{background: #e1e2e4;} .indentificacao .tempo{color: #fff!important;} .inside-event .tipo-apostas{ background-color: #0f0f11!important; color: white!important; } #esportes-footer{ color:white; } ",
    });
});

gulp.task('onbets.club', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "onbets.club",
        banca: "On Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #f0c027;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('apostapremiada.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "apostapremiada.bet",
        banca: "Aposta Premiada",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
    });
});

gulp.task('bet1.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bet1.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bet2.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('bet4.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bet4.wee.bet",
        banca: "BET",
        styles: ""
    });
});

gulp.task('bet5.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bet5.wee.bet",
        banca: "Total Sorte",
        styles: ""
    });
});

gulp.task('topbets.me', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "topbets.me",
        banca: "Top Bets",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;"
    });
});

gulp.task('esportmania.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "esportmania.net",
        banca: "Esport Mania",
        styles: "--header: #2c5b86; --foreground-header: #fff; --sidebar-right:#052c50; --foreground-sidebar-right: #fff; --sidebar-left: #052c50; --foreground-sidebar-left: #fff; --highlight:#de2c37; --foreground-highlight: #dba000; --odds: #2c5b86; --foreground-odds: #dba000; --league: #dba00f; --foreground-league: #000;",
        aditional_styles: ".odds .inner-odd span { font-weight: bold!important; } "
    });
});

gulp.task('akiapostas.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "akiapostas.wee.bet",
        banca: "AKI Apostas",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;"
    });
});

gulp.task('masterbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "masterbet.wee.bet",
        banca: "MasterBet",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #ffdf1b; --odds: #000; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('placardarodada.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "placardarodada.wee.bet",
        banca: "Placar da Rodada",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#019934; --foreground-sidebar-right: #fff; --sidebar-left: #019934; --foreground-sidebar-left: #fff; --highlight:#019934; --foreground-highlight: #fff; --odds: #000; --foreground-odds: #fff; --foreground-selected-odds:#fff;",
        // aditional_styles: ".sidebar-brand{ margin-top: 0!important; } .sidebar-brand img{ max-width: 100%!important; max-height: none!important; }"
    });
});

gulp.task('vitoriasports.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "vitoriasports.bet",
        banca: "Vitória Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: yellow; --odds: #292b75; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('amigosdabola.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "amigosdabola.wee.bet",
        banca: "Amigos da Bola",
        styles: "--header: red; --foreground-header: #fff; --sidebar-right:red; --foreground-sidebar-right: #fff; --sidebar-left: #373435; --foreground-sidebar-left: #fff; --highlight: #ffc107; --foreground-highlight: #fff; --odds: #373435; --foreground-odds: #fff; --event-time: red;",
    });
});

gulp.task('footbets.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "footbets.wee.bet",
        banca: "footbets",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:red; --foreground-odds: #fff; --event-time: #312782",
        aditional_styles: ".mais-opcoes{ color: var(--event-time)!important; }",
    });
});

gulp.task('imperiosportve.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "imperiosportve.com",
        banca: "imperio sportve",
        styles: "--header: #42050a; --foreground-header: #fff; --sidebar-right:#42050a; --foreground-sidebar-right: #fff; --sidebar-left: #42050a; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:#d91c16; --foreground-odds: #fff; --event-time: #d91c16",
    });
});

gulp.task('jcapostas.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "jcapostas.wee.bet",
        banca: "JC Apostas",
        styles: "--header: #292729;--sidebar-right:#292729;--sidebar-left: #292729;--highlight: #e4e4e4;--odds: #15814f;"
    });
});

gulp.task('rubinhosports.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "rubinhosports.wee.bet",
        banca: "Rubinho Sports",
        styles: "",
    });
});

gulp.task('sportingnet.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sportingnet.bet",
        banca: "Sporting Net",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--league: #333; --foreground-league: #fff;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #dab600; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('betsplacar.club', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betsplacar.club",
        banca: "Bets Placar",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--league: #fc6402;--foreground-league: #fff;"
    });
});

gulp.task('bet358.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "bet358.wee.bet",
        banca: "Bet 358",
        styles: "--header:#016534;--foreground-header:#fff;--sidebar-right:#016534;--foreground-sidebar-right:#fff;--sidebar-left:#016534;--foreground-sidebar-left:#fff;--foreground-highlight:#fff;--odds:#000;--foreground-odds:#fff;--foreground-selected-odds:#000;"
    });
});

gulp.task('esportebetsvip.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "esportebets.io",
        banca: "Esporte Bets",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000; --odds: #003ae6; --foreground-highlight: #fff;"
    });
});

gulp.task('betsgol.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betsgol.wee.bet",
        banca: "BETS GOL",
        styles: "--header:#ff0000; --foreground-header:#000; --sidebar-left: #000; --sidebar-right: #000; --odds:#ff0000;",
    });
});

gulp.task('mastersports.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "mastersports.wee.bet",
        banca: "MASTER SPORTS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #9b001d; --foreground-odds: #fff;",
    });
});

gulp.task('betsbs.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betsbs.net",
        banca: "BETS BS",
        styles: ""
    });
});

gulp.task('redelsports.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "redelsports.com",
        banca: "REDE LSPORTS",
        styles: ""
    });
});

gulp.task('megasports.club', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "megasports.club",
        banca: "MEGA SPORTS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;--highlight:red;"
    });
});

gulp.task('alfasports.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "alfasports.net",
        banca: "ALFA SPORTS",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--highlight:red;"
    });
});

gulp.task('recifeesportes.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "recifeesportes.wee.bet",
        banca: "RECIFE ESPORTES",
        styles: "--header:#f26225;--foreground-header:#fff;--sidebar-right:#f26225;--sidebar-left:#f26225;--odds:#828282;--highlight:#390051;--foreground-highlight: #fff;--foreground-selected-odds: #fff;--selected-odds: #f26225; --event-time:#390051; --league: #390051; --foreground-league: #fff;",
        aditional_styles: "body{ background-color: #390051!important;  } .mais-opcoes{ color: #390051!important; } .indentificacao .nome, .indentificacao .nome-mobile{ color: #390051!important; } .sidebar-brand{ margin-top: 0!important; padding-top: 15px; padding-bottom: 20px; background-color: #390051; } .sidebar-menu{ background-color: #390051; margin-top: 0!important; } .navbar-mobile{ background-color: #390051; } .pre-bilhete .div-inputs, .pre-bilhete .valores button, .pre-bilhete .form-group button { background-color: #390051!important; } .pre-bilhete .form-group button:hover { color:#fff!important; } .odds .selecionado{ background-color: #f26225!important; } .jogo-selecionado .fa-times{color:#390051!important;} .fechar-pre-bilhete .fa-times{color:#390051!important;}"
    });
});

gulp.task('sportbet7.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sportbet7.net",
        banca: "SPORT BET 7",
        styles: ""
    });
});

gulp.task('masterjogos.club', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "masterjogos.club",
        banca: "MASTER JOGOS",
        styles: ""
    });
});

gulp.task('jrsports.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "jrsports.bet",
        banca: "JR SPORTS",
        styles: "--header:#631508;--foreground-header:#fff;--sidebar-right:#631508;--sidebar-left:#631508;--odds:#a07417; --foreground-highlight: #fff;"
    });
});

gulp.task('jardimbets.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "jardimbets.com",
        banca: "JARDIM BETS",
        styles: "--header: #326038; --foreground-header: #fff; --sidebar-right:#2c5432; --foreground-sidebar-right: #fff; --sidebar-left: #2c5432; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #4d812a; --foreground-odds: #fff; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;"
    });
});

gulp.task('apremiada.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "apremiada.bet",
        banca: "APREMIADA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #fc6402; --foreground-highlight: #fff; --odds: #9a9a9a; --foreground-odds: #fff; --event-time: #777; --league: #fc6402; --foreground-league: #fff;"
    });
});

gulp.task('x2bet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "x2bet.wee.bet",
        banca: "X2 BET",
        styles: "--header: #333; --foreground-header: #fff;--sidebar-right:#333;--sidebar-left:#333;--odds:#3c8dbc;--foreground-highlight:#fff;"
    });
});

gulp.task('betsplay.club', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsplay.club",
        banca: "BETSPLAY",
        styles: "--header: #000; --foreground-header: #fff;--sidebar-right:#000;--foreground-sidebar-right:#fff;--sidebar-left:#000;--foreground-sidebar-left:#fff;--odds:#ff8730;--foreground-highlight:#fff;"
    });
});

gulp.task('betsports.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsports.wee.bet",
        banca: "BET SPORTS",
        styles: ""
    });
});

gulp.task('citybets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "citybets.wee.bet",
        banca: "CITY BETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #5a130f; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('lancebet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "lancebet.wee.bet",
        banca: "LANCE BET",
        styles: ""
    });
});

gulp.task('betsgol.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsgol.bet",
        banca: "BETS GOL",
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#4d4d4d;"
    });
});

gulp.task('betspremio.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betspremio.bet",
        banca: "BETS PRÊMIO",
        styles: "--header:#bf3545; --foreground-header: #fff; --sidebar-left: #bf3545; --sidebar-right: #bf3545;--odds:#011e46;--foreground-highlight: #fff;"
    });
});

gulp.task('dolarbets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "dolarbets.wee.bet",
        banca: "DOLAR BETS",
        styles: "--header:#005801; --foreground-header:#fff; --sidebar-left: #005801; --sidebar-right: #005801;--odds:#000;--foreground-highlight:#fff;--league: #ffcc28;",
    });
});

gulp.task('mssportes.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "mssportes.wee.bet",
        banca: "MS Sportes",
        styles: "--highlight: #008ef6; --foreground-highlight: #fff; --odds: #ffb701; --foreground-odds: #011e46; --foreground-selected-odds:#fff",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #jogo-default-wrapper{ background: #0f0f11!important } .jogos, .eventos{ background: #0f0f11!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #0f0f11!important; } .footer{ background-color:#0f0f11!important; }" +
            ".jogo-container .indentificacao-mobile, .jogo-container .indentificacao, .jogo-container .campeonato-nome{background: #e1e2e4;} .indentificacao .tempo{color: #fff!important;} .inside-event .tipo-apostas{ background-color: #0f0f11!important; color: white!important; } #esportes-footer{ color:white; } ",
        scripts: "<!--Start of Tawk.to Script--> <script type='text/javascript'> var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0]; s1.async=true; s1.src='https://embed.tawk.to/5f6b3ee6f0e7167d001303f3/default'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })(); </script> <!--End of Tawk.to Script-->"
    });
});

gulp.task('alsports.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "alsports.wee.bet",
        banca: "AL SPORTS",
        styles: "",
    });
});

gulp.task('slsports.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "slsports.wee.bet",
        banca: "SL SPORTS",
        styles: "--header: #006600; --foreground-header: #fff; --sidebar-right:#7fb96a; --foreground-sidebar-right: #fff; --sidebar-left: #7fb96a; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #4cbca3; --event-time: yellow; --fg-event-time: #000;",
        scripts: "<!--Start of Tawk.to Script--> <script type='text/javascript'> var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0]; s1.async=true; s1.src='https://embed.tawk.to/5efb694c9e5f69442291993e/default'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })(); </script> <!--End of Tawk.to Script-->"
    });
});

gulp.task('betdez.net', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betdez.net",
        banca: "BetDez",
        styles: "--header: #fff; --foreground-header: #000; --sidebar-right: #fff; --foreground-sidebar-right: #000; --sidebar-left: #fff; --foreground-sidebar-left: #000; --highlight: #232d40; --foreground-highlight: #232d40; --odds: #71b04c; --foreground-odds: #fff; --event-time: #232d40;--foreground-selected-odds:#fff;",
        aditional_styles: ".menu-categories .active a {color: #003f7f!important;} .odds .selecionado span{color:#fff!important;} .content-header h2{color:#003f7f!important;}",
    });
});

gulp.task('minibets.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "minibets.wee.bet",
        banca: "MINI BETS",
        styles: ""
    });
});

gulp.task('resenhaesportiva.site', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "resenhaesportiva.site",
        banca: "RESENHA ESPORTIVA",
        styles: "",
    });
});

gulp.task('showdebola.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "showdebola.wee.bet",
        banca: "SHOW DE BOLA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #008000;",
        google_tag_part_1: "<!-- Google Tag Manager --> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-5684P8F');</script> <!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --> <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5684P8F' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <!-- End Google Tag Manager (noscript) -->",

    });
});

gulp.task('topbets.website', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "topbets.website",
        banca: "TOP BETS",
        styles: "",
    });
});

gulp.task('superbet365.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "superbet365.bet",
        banca: "SUPER BET 365",
        styles: "",
    });
});

gulp.task('sampabet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "sampabet.wee.bet",
        banca: "SAMPA BET",
        styles: "",
    });
});

gulp.task('moralbets.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "moralbets.com",
        banca: "MORAL BETS",
        styles: "--header: #a9a9a9; --foreground-header: #000; --sidebar-right: #a9a9a9; --foreground-sidebar-right: #000; --sidebar-left: #a9a9a9; --foreground-sidebar-left: #000;--highlight:#68eb5a;--foreground-highlight: #000;--odds:#000;",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --><script async src='https://www.googletagmanager.com/gtag/js?id=G-4D549X8JK5'></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-4D549X8JK5');</script>",
        pixel: "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '814670293101190'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=814670293101190&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code --><!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '667022238352468'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=667022238352468&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code --><!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '1307724826734399'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=1307724826734399&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code --><!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '431191212500414'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=431191212500414&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
    });
});

gulp.task('capitalsports.site', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "capitalsports.site",
        banca: "CAPITAL SPORTS",
        styles: "--odds: #014610;",
    });
});

gulp.task('osascosportsbet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "osascosportsbet.wee.bet",
        banca: "OSASCO SPORTS",
        styles: "",
    });
});

gulp.task('globoesporte.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "globoesporte.bet",
        banca: "GLOBO ESPORTE",
        styles: "--header: #505050; --foreground-header: #fff; --sidebar-right:#505050; --foreground-sidebar-right: #fff; --sidebar-left: #505050; --foreground-sidebar-left: #fff; --odds: #e32636;",
    });
});

gulp.task('chutebets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "chutebets.wee.bet",
        banca: "CHUTE BETS",
        styles: "",
    });
});

gulp.task('superbetplus.club', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "superbetplus.club",
        banca: "SUPER BET PLUS",
        styles: "--league: yellow;",
    });
});

gulp.task('i9bets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "i9bets.wee.bet",
        banca: "I9 BETS",
        styles: "",
    });
});

gulp.task('ingamesport.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ingamesport.com",
        banca: "INGAME SPORT",
        styles: ""
    });
});

gulp.task('gobets.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "gobets.wee.bet",
        banca: "GO BETS",
        styles: "--odds: #fbb03b;--foreground-odds:#000;--foreground-selected-odds: #fff;--highlight:gray;--foreground-highlight:#fff;",
    });
});

gulp.task('eisports.club', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "eisports.club",
        banca: "EI SPORTS",
        styles: "--header: #60a443; --foreground-header: #fff; --sidebar-right:#60a443; --foreground-sidebar-right: #fff; --sidebar-left: #60a443; --foreground-sidebar-left: #fff; --odds: #000;--foreground-odds:#fff;--highlight:#7dd856;--foreground-highlight:#fff;",
    });
});

gulp.task('clubedabola.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "clubedabola.wee.bet",
        banca: "CLUBE DA BOLA",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --odds: #11192e;--foreground-selected-odds: #fff;--highlight:#d49011;--foreground-highlight:#fff;",
    });
});

gulp.task('lbbet.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "lbbet.wee.bet",
        banca: "LBBET",
        styles: "--header: #3aaa35; --foreground-header: #fff; --sidebar-right:#3aaa35; --foreground-sidebar-right: #fff; --sidebar-left: #3aaa35; --foreground-sidebar-left: #fff; --odds: #5e5e5e;--foreground-highlight:#fff;",
    });
});

gulp.task('top10sportsvip.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "top10sportsvip.com",
        banca: "TOP 10 SPORTS VIP",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;--league: #35cc96; --foreground-league: #fff;",
    });
});

gulp.task('esportepremium.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "esportepremium.wee.bet",
        banca: "ESPORTE PREMIUM",
        styles: "",
    });
});

gulp.task('acsportsbets.site', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "acsportsbets.site",
        banca: "AC SPORTS BETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: #0000ff; --foreground-highlight: #fff; --odds: #191970; --foreground-odds: #fff;--foreground-selected-odds: #fff;",
    });
});

gulp.task('7bet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "7bet.wee.bet",
        banca: "7 BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #fff; --odds: #008000;",
    });
});

gulp.task('garanhunsbet.site', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "garanhunsbet.site",
        banca: "GARANHUNS BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #00008B;",
    });
});

gulp.task('cearabetsplacardarodada.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "cearabetsplacardarodada.wee.bet",
        banca: "CEARÁ BETS",
        styles: "",
    });
});

gulp.task('tubaraobet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "tubaraobet.wee.bet",
        banca: "TUBARÃO BET",
        styles: "--header: #111111; --foreground-header: #fff; --sidebar-right:#000000; --foreground-sidebar-right: #fff; --sidebar-left: #000000; --foreground-sidebar-left: #fff;--highlight: #f5d328; --foreground-highlight: #fff; --odds: #191970;",
    });
});

gulp.task('primesoccer.app', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "primesoccer.app",
        banca: "PRIME SOCCER",
        styles: "",
    });
});

gulp.task('sportbetclub7.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sportbetclub7.wee.bet",
        banca: "SPORT BET CLUB7",
        styles: "",
    });
});

gulp.task('betshow.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betshow.wee.bet",
        banca: "BET SHOW",
        styles: "",
    });
});

gulp.task('primosbet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "primosbet.wee.bet",
        banca: "PRIMOS BET",
        styles: "",
    });
});

gulp.task('betvipmais.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betvipmais.wee.bet",
        banca: "BET VIP MAIS",
        styles: "",
        pixel: "<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '460861756074509');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=460861756074509&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code --><meta name='facebook-domain-verification' content='88rnxdfhkq110nremnaccmbqgxbwt0' />"
    });
});

gulp.task('rrbets.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "rrbets.wee.bet",
        banca: "RR BETS",
        styles: "",
    });
});

gulp.task('techbet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "techbet.wee.bet",
        banca: "TECH BET",
        styles: "",
    });
});

gulp.task('reallbet.site', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "reallbet.site",
        banca: "REALLBET",
        styles: "",
    });
});

gulp.task('olimpobetsvip.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "olimpobetsvip.wee.bet",
        banca: "OLIMPO BETS VIP",
        styles: "",
    });
});

gulp.task('lobobet.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "lobobet.net",
        banca: "LOBO BET",
        styles: "",
    });
});

gulp.task('maranhaobets.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "maranhaobets.net",
        banca: "MARANHÃO BETS",
        styles: "",
    });
});

gulp.task('pagadorabet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "pagadorabet.com",
        banca: "PAGADORA BET",
        styles: "",
    });
});

gulp.task('ligavip.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ligavip.wee.bet",
        banca: "LIGA VIP",
        styles: "",
    });
});

gulp.task('aeapostas.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "aeapostas.wee.bet",
        banca: "AE APOSTAS",
        styles: "",
    });
});

gulp.task('betsgames.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsgames.net",
        banca: "BETS GAMES",
        styles: "",
        scripts: "",
    });
});

gulp.task('mdsports.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "mdsports.wee.bet",
        banca: "MD SPORTS",
        styles: "",
    });
});

gulp.task('jbrbets.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "jbrbets.net",
        banca: "JBR BETS",
        styles: "",
    });
});

gulp.task('ligabet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ligabet.wee.bet",
        banca: "LIGA BET",
        styles: "",
    });
});

gulp.task('pernambucoesportes.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "pernambucoesportes.wee.bet",
        banca: "PE ESPORTES",
        styles: "",
    });
});

gulp.task('futsport.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "futsport.net",
        banca: "FUT SPORT",
        styles: "",
    });
});

gulp.task('novobetsamericabr.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "novobetsamericabr.com",
        banca: "BETS AMERICA",
        styles: "",
    });
});

gulp.task('trandbets.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "trandbets.com",
        banca: "TRAND BETS",
        styles: "",
    });
});

gulp.task('betmed.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betmed.wee.bet",
        banca: "Bet Med",
        styles: "",
    });
});

gulp.task('wbets.com.br', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "wbets.com.br",
        banca: "WBETS",
        styles: "",
    });
});

gulp.task('ilhabet.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ilhabet.net",
        banca: "ILHA BET",
        styles: "",
    });
});

gulp.task('megabetsport.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "megabetsport.com",
        banca: "MEGA BET SPORT",
        styles: "",
    });
});

gulp.task('betsmaranhao.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betsmaranhao.wee.bet",
        shared_url: "betsmaranhao.com",
        banca: "BETS MARANHÃO",
        styles: "",
    });
});

gulp.task('premiersport.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "premiersport.wee.bet",
        banca: "PREMIER SPORT",
        styles: "",
    });
});

gulp.task('megabetrn.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "megabetrn.wee.bet",
        banca: "MEGA BET RN",
        styles: "",
    });
});

gulp.task('nortaobet.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "nortaobet.com",
        banca: "NORTÃO BET",
        styles: "",
    });
});

gulp.task('rodadabets.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "rodadabets.wee.bet",
        banca: "RODADA BETS",
        styles: "",
    });
});

gulp.task('betfut.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betfut.net",
        banca: "BETFUT",
        styles: "",
    });
});

gulp.task('betclub.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betclub.wee.bet",
        banca: "BET CLUB",
        styles: "",
    });
});

gulp.task('jmxbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "jmxbet.com",
        banca: "JMX BET",
        styles: "",
    });
});

gulp.task('uzzebet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "uzzebet.com",
        banca: "UZZE BET",
        styles: "",
    });
});

gulp.task('paratodosbet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "paratodosbet.com",
        banca: "PARATODOS.BET",
        styles: "",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --> <script async src='https://www.googletagmanager.com/gtag/js?id=UA-225184552-1'></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-225184552-1'); </script>",
    });
});

gulp.task('boto-fe.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "boto-fe.com",
        banca: "BOTO FÉ",
        styles: "",
        scripts: "<script src='//code-sa1.jivosite.com/widget/qXJV3cn8tQ' async></script>",
    });
});

gulp.task('boaesportes.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "boaesportes.com",
        banca: "BOA ESPORTES",
        styles: "",
    });
});

gulp.task('starbets.online', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "starbets.online",
        banca: "STAR BETS",
        styles: "",
    });
});

gulp.task('betcompany.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betcompany.wee.bet",
        banca: "BET COMPANY",
        styles: "",
    });
});

gulp.task('futbet7.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "futbet7.com",
        banca: "FUTBET7",
        styles: "",
    });
});

gulp.task('trevoone.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "trevoone.bet",
        banca: "TREVO ONE",
        styles: "",
    });
});

gulp.task('dfsportsbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "dfsportsbet.wee.bet",
        banca: "DF SPORTS BET",
        styles: "",
    });
});

gulp.task('betpixbrasil.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betpixbrasil.com",
        banca: "BET PIX BRASIL",
        styles: "",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/EVUivhQSxN' async></script>",
        pixel: "<meta name='facebook-domain-verification' content='7v5vjxw4e0l3rgyt2uqet8ik71n41u' /><link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'><!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '477724757578863');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=477724757578863&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"
    });
});

gulp.task('esportenetreipele.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "esportenetreipele.com",
        banca: "ESPORTE NET",
        styles: "",
        scripts: "<!--Start of Tawk.to Script--> <script type='text/javascript'> var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0]; s1.async=true; s1.src='https://embed.tawk.to/623500f51ffac05b1d7f4f2c/1fufgnh2n'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })(); </script> <!--End of Tawk.to Script-->"
    });
});

gulp.task('betfacil123.app', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betfacil123.app",
        banca: "BET FÁCIL 123",
        styles: "",
        pixel: "<meta name='facebook-domain-verification' content='91h9n5i6r0qfg3w8tupmcobu4p3k9x' /> <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '4910465152363836'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=4910465152363836&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
    });
});

gulp.task('megabet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "megabet.wee.bet",
        banca: "MEGA BET",
        styles: "",
    });
});

gulp.task('bolanarede.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bolanarede.wee.bet",
        banca: "BOLA NA REDE",
        styles: "",
    });
});

gulp.task('startbetbrasil.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "startbetbrasil.com",
        banca: "START BET BRASIL",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-MC4BCH9');</script> <!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --> <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-MC4BCH9' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('goldeplaca.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "goldeplaca.wee.bet",
        banca: "GOL DE PLACA",
        styles: "",
    });
});

gulp.task('xbetsports.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "xbetsports.net",
        banca: "XBETSPORTS",
        styles: "",
    });
});

gulp.task('realbets.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "realbets.wee.bet",
        banca: "REAL BETS",
        styles: "",
    });
});

gulp.task('esportcampeao.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "esportcampeao.wee.bet",
        banca: "ESPORT CAMPEÃO",
        shared_url: "esportcampeao.com",
        styles: "",
    });
});

gulp.task('betsnordeste.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsnordeste.wee.bet",
        banca: "BETS NORDESTE",
        styles: "",
    });
});

gulp.task('sportbrasilvip.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "sportbrasilvip.com",
        banca: "SPORT BRASIL VIP",
        styles: "",
    });
});

gulp.task('dobowxbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "dobowxbet.wee.bet",
        banca: "DOBOW XBET",
        styles: "",
    });
});

gulp.task('bets084.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bets084.com",
        banca: "BETS 084",
        styles: "",
    });
});

gulp.task('betson.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betson.wee.bet",
        banca: "BETSON",
        styles: "",
    });
});

gulp.task('esportebet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "esportebet.wee.bet",
        banca: "ESPORTE BET",
        styles: "",
    });
});

gulp.task('123gol.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "123gol.bet",
        banca: "123GOL",
        styles: "",
    });
});

gulp.task('megaesports.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "megaesports.wee.bet",
        banca: "MEGA ESPORTS",
        styles: "",
        scripts: ""
    });
});

gulp.task('i2bets.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "i2bets.com",
        banca: "I2 BETS",
        styles: "",
    });
});

gulp.task('betgol88.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betgol88.wee.bet",
        banca: "BET GOL 88",
        styles: "",
    });
});

gulp.task('ltbets.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ltbets.wee.bet",
        banca: "LT BETS",
        styles: "",
    });
});

gulp.task('sportbec.online', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sportbec.online",
        banca: "SPORT BEC",
        styles: "",
        pixel: "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '1147701886026749'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=1147701886026749&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
    });
});

gulp.task('lancesports.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "lancesports.wee.bet",
        banca: "LANCE SPORTS",
        styles: "",
    });
});

gulp.task('betceara.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betceara.net",
        banca: "BET CEARÁ",
        styles: "",
    });
});

gulp.task('betes98.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betes98.wee.bet",
        banca: "BETES98",
        styles: "",
    });
});

gulp.task('betimperativo.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betimperativo.wee.bet",
        shared_url: "betimperativo.com.br",
        banca: "Bet Imperativo",
        styles: "",
    });
});

gulp.task('kbet.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "kbet.wee.bet",
        shared_url: "kbet.com.br",
        banca: "Kbet - Jogos Online",
        styles: "",
        aditional_styles: ".sem-evento{color: #fff;} #futebol-default-wrapper, #futebol-live-wrapper, #jogo-default-wrapper{ background: #5C5C5C!important } .jogos, .eventos{ background: #5C5C5C!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #5C5C5C!important; } .footer{ background-color:#5C5C5C!important; }" +
            ".jogo-container .indentificacao-mobile, .jogo-container .indentificacao, .jogo-container .campeonato-nome{background: #e1e2e4;} .indentificacao .tempo{color: #fff!important;} .inside-event .tipo-apostas{ background-color: #5C5C5C!important; color: white!important; } #esportes-footer{ color:white; }",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --> <script async src='https://www.googletagmanager.com/gtag/js?id=UA-230643592-1'> </script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-230643592-1'); </script>"
    });
});

gulp.task('vencedorbet.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "vencedorbet.bet",
        banca: "VENCEDOR BET",
        styles: "",
    });
});

gulp.task('mundialsport.com.br', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "mundialsport.com.br",
        banca: "MUNDIAL SPORT",
        styles: "",
        pixel: "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '664481668577874'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=664481668577874&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
    });
});

gulp.task('shopbet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "shopbet.wee.bet",
        banca: "SHOP BET",
        styles: "",
    });
});

gulp.task('clubedasapostas.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "clubedasapostas.wee.bet",
        banca: "CLUBE DAS APOSTAS",
        styles: "",
    });
});

gulp.task('futebets.net', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "futebets.net",
        banca: "FUTEBETS",
        styles: "",
    });
});

gulp.task('rondobet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "rondobet.com",
        banca: "RONDO BET",
        styles: "",
    });
});

gulp.task('golbets.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "golbets.wee.bet",
        banca: "GOL BETS",
        styles: "",
    });
});

gulp.task('goldavirada.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "goldavirada.bet",
        banca: "GOL DA VIRADA",
        styles: "",
    });
});

gulp.task('bets60.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bets60.wee.bet",
        banca: "BETS 60",
        styles: "",
    });
});

gulp.task('premiosbet.net', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "premiosbet.net",
        banca: "PRÊMIOS BET",
        styles: "",
    });
});

gulp.task('lincesports.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "lincesports.wee.bet",
        banca: "LINCE SPORTS",
        styles: "",
    });
});

gulp.task('pixsportbet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "pixsportbet.com",
        banca: "PIX SPORT BET",
        styles: "",
    });
});

gulp.task('finasport.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "finasport.wee.bet",
        banca: "FINA SPORT",
        styles: "",
    });
});

gulp.task('aposta99.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "aposta99.wee.bet",
        banca: "APOSTA 99",
        styles: "",
    });
});

gulp.task('volpsport.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "volpsport.com",
        banca: "VOLP SPORT",
        styles: "",
    });
});

gulp.task('uai.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "uai.bet",
        banca: "UAI BET",
        styles: "",
    });
});

gulp.task('topbetgames.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "topbetgames.wee.bet",
        banca: "TOP BET GAMES",
        styles: "",
    });
});

gulp.task('spn-sports.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "spn-sports.net",
        banca: "SPN SPORTS",
        styles: "",
    });
});

gulp.task('sm7.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sm7.wee.bet",
        banca: "SM7",
        styles: "",
    });
});

gulp.task('brotherr.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "brotherr.bet",
        banca: "BROTHERS BET",
        styles: "",
    });
});

gulp.task('paraibapixbet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "paraibapixbet.wee.bet",
        banca: "PB PIX BET",
        styles: "",
    });
});

gulp.task('visabet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "visabet.wee.bet",
        banca: "VISA BET",
        styles: "",
    });
});

gulp.task('infinitybet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "infinitybet.wee.bet",
        banca: "INFINITY BET",
        styles: "",
    });
});

gulp.task('pixtop.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "pixtop.bet",
        banca: "PIX TOP",
        styles: "",
    });
});

gulp.task('xbetpix.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "xbetpix.wee.bet",
        shared_url: "xbetpix.com.br",
        banca: "X BETPIX",
        styles: "",
    });
});

gulp.task('facbet.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "facbet.net",
        banca: "FACBET",
        styles: "",
    });
});

gulp.task('futpix.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "futpix.wee.bet",
        shared_url: "futpix.com.br",
        banca: "FUTPIX",
        styles: "",
    });
});

gulp.task('betshelby.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betshelby.net",
        banca: "BET SHELBY",
        styles: "",
    });
});

gulp.task('betminas.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betminas.wee.bet",
        banca: "BET MINAS",
        styles: "",
    });
});

gulp.task('xomanobet.com.br', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "xomanobet.com.br",
        banca: "XOMANOBET",
        styles: "",
    });
});

gulp.task('bet83.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bet83.wee.bet",
        banca: "BET83",
        styles: "",
    });
});

gulp.task('camisa12.online', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "camisa12.online",
        banca: "CAMISA12",
        styles: "",
    });
});

gulp.task('greenway.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "greenway.bet",
        banca: "GREEN WAY",
        styles: "",
    });
});

gulp.task('costabets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "costabets.wee.bet",
        banca: "COSTA BETS",
        styles: "",
    });
});

gulp.task('betnordestesports.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betnordestesports.wee.bet",
        banca: "BET NORDESTE SPORTS",
        styles: "",
    });
});

gulp.task('betboladavez.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betboladavez.wee.bet",
        banca: "BET BOLA DA VEZ",
        styles: "",
    });
});

gulp.task('aabet83.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "aabet83.wee.bet",
        banca: "AABET83",
        styles: "",
    });
});

gulp.task('blitzbet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "blitzbet.wee.bet",
        banca: "BLITZ BET",
        styles: "",
    });
});

gulp.task('betsports91.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsports91.net",
        banca: "BETSPORTS91",
        styles: "",
    });
});

gulp.task('superpix.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "superpix.bet",
        banca: "SUPER PIX",
        styles: "",
    });
});

gulp.task('sportingol.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sportingol.bet",
        banca: "SPORTINGOL",
        styles: "",
    });
});

gulp.task('betcomvoce.com.br', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betcomvoce.com.br",
        banca: "BET COM VOCÊ",
        styles: "",
    });
});

gulp.task('nmbets.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "nmbets.wee.bet",
        banca: "NMBETS",
        styles: "",
    });
});

gulp.task('jaesporte.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "jaesporte.com",
        banca: "JA ESPORTE",
        styles: "",
    });
});

gulp.task('deugreen.me', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "deugreen.me",
        banca: "DEU GREEN",
        styles: "",
    });
});

gulp.task('betsmaniavip.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betsmaniavip.com",
        banca: "BETS MANIA VIP",
        styles: "",
    });
});

gulp.task('i7esportes.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "i7esportes.bet",
        banca: "I7 ESPORTES",
        styles: "",
    });
});

gulp.task('betsesporte.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betsesporte.com",
        banca: "BETS ESPORTE",
        styles: "",
    });
});

gulp.task('primesport.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "primesport.bet",
        banca: "PRIME SPORT",
        styles: "",
    });
});

gulp.task('eshowdebola.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "eshowdebola.bet",
        banca: "É SHOW DE BOLA",
        styles: "",
    });
});

gulp.task('bets536.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bets536.wee.bet",
        banca: "BETS 536",
        styles: "",
    });
});

gulp.task('brlesportiva.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "brlesportiva.bet",
        banca: "BRL ESPORTIVA",
        styles: "",
    });
});

gulp.task('betsmania.live', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsmania.live",
        banca: "BETS MANIA",
        styles: "",
    });
});

gulp.task('ggdasorte.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ggdasorte.bet",
        banca: "GG DA SORTE",
        styles: "",
    });
});

gulp.task('bets2you.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bets2you.com",
        banca: "BETS2YOU",
        styles: "",
    });
});

gulp.task('tigrebet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "tigrebet.wee.bet",
        banca: "TIGRE BET",
        styles: "",
    });
});

gulp.task('casadeapostas.club', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "casadeapostas.club",
        banca: "CASA DE APOSTAS",
        styles: "",
    });
});

gulp.task('ster.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ster.wee.bet",
        banca: "STER.WEE.BET",
        styles: "",
    });
});

gulp.task('ricardo.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ricardo.wee.bet",
        banca: "RICARDO.WEE.BET",
        styles: "",
    });
});

gulp.task('vipersports.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "vipersports.bet",
        banca: "VIPER SPORTS",
        styles: "",
    });
});

gulp.task('atleticbet.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "atleticbet.com",
        banca: "ATLETIC BET",
        styles: ""
    });
});

gulp.task('nautsports.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "nautsports.wee.bet",
        banca: "NAUTSPORTS",
        styles: "",
    });
});

gulp.task('betpixlider.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betpixlider.wee.bet",
        banca: "BET PIX LIDER",
        styles: "",
    });
});

gulp.task('grenbet.net', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "grenbet.net",
        banca: "GRENBET",
        styles: "",
    });
});

gulp.task('futtop.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "futtop.bet",
        banca: "FUTTOP",
        styles: "",
    });
});

gulp.task('rjbets.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "rjbets.wee.bet",
        banca: "RJ BETS",
        styles: "",
    });
});

gulp.task('soumaisbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "soumaisbet.com",
        banca: "SOU MAIS BET",
        styles: "",
    });
});

gulp.task('bets12.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bets12.net",
        banca: "BETS 12",
        styles: "",
    });
});

gulp.task('bet73.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bet73.wee.bet",
        banca: "BET 73",
        styles: "",
    });
});

gulp.task('megasorte.website', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "megasorte.website",
        banca: "MEGA SORTE",
        styles: "",
    });
});

gulp.task('sportsgames.io', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sportsgames.io",
        banca: "SPORTS GAMES",
        styles: "",
    });
});

gulp.task('onbets.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "onbets.bet",
        banca: "ON BETS",
        styles: "",
        scripts: "<script> window.__lc = window.__lc || {}; window.__lc.license = 14655855; ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:'2.0',on:function(){i(['on',c.call(arguments)])},once:function(){i(['once',c.call(arguments)])},off:function(){i(['off',c.call(arguments)])},get:function(){if(!e._h)throw new Error('[LiveChatWidget] You cant use getters before load.');return i(['get',c.call(arguments)])},call:function(){i(['call',c.call(arguments)])},init:function(){var n=t.createElement('script');n.async=!0,n.type='text/javascript',n.src='https://cdn.livechatinc.com/tracking.js',t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice)) </script> <noscript><a href='https://www.livechat.com/chat-with/14655855/' rel='nofollow'>Chat with us</a>, powered by <a href='https://www.livechat.com/?welcome' rel='noopener nofollow' target='_blank'>LiveChat</a></noscript>"
    });
});

gulp.task('betei.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betei.bet",
        banca: "BETEI",
        styles: "",
        scripts: "<!-- Start of LiveChat (www.livechat.com) code --> <script> window.__lc = window.__lc || {}; window.__lc.license = 14693070; ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:'2.0',on:function(){i(['on',c.call(arguments)])},once:function(){i(['once',c.call(arguments)])},off:function(){i(['off',c.call(arguments)])},get:function(){if(!e._h)throw new Error('[LiveChatWidget] You cant use getters before load.');return i(['get',c.call(arguments)])},call:function(){i(['call',c.call(arguments)])},init:function(){var n=t.createElement('script');n.async=!0,n.type='text/javascript',n.src='https://cdn.livechatinc.com/tracking.js',t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice)) </script> <noscript><a href='https://www.livechat.com/chat-with/14693070/' rel='nofollow'>Chat with us</a>, powered by <a href='https://www.livechat.com/?welcome' rel='noopener nofollow' target='_blank'>LiveChat</a></noscript> <!-- End of LiveChat code -->"
    });
});

gulp.task('sortepix.vip', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "sortepix.vip",
        banca: "SORTE PIX",
        styles: "",
    });
});

gulp.task('betsport.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betsport.wee.bet",
        banca: "BET SPORT",
        styles: "",
    });
});

gulp.task('betbetix.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betbetix.com",
        banca: "BETBETIX",
        styles: "",
        pixel: "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/5WSOiOS6b1' async></script>"
    });
});

gulp.task('bravos.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bravos.bet",
        banca: "BRAVOS",
        styles: "",
    });
});

gulp.task('arena365.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "arena365.wee.bet",
        banca: "ARENA 365",
        styles: "",
    });
});

gulp.task('cr7bet.online', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "cr7bet.online",
        banca: "CR7 BET",
        styles: "",
    });
});

gulp.task('supremodasorte.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "supremodasorte.wee.bet",
        banca: "SUPREMO DA SORTE",
        styles: "",
    });
});

gulp.task('amesportesbets.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "amesportesbets.com",
        banca: "AM ESPORTES BETS",
        styles: "",
    });
});

gulp.task('narigasports.com.br', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "narigasports.com.br",
        banca: "NARIGA SPORTS",
        styles: "",
    });
});

gulp.task('spmaster.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "spmaster.net",
        banca: "SP MASTER",
        styles: "",
    });
});

gulp.task('redeonline.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "redeonline.bet",
        banca: "REDEONLINE.BET",
        styles: "",
    });
});

gulp.task('betmax.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betmax.wee.bet",
        banca: "BETMAX",
        styles: "",
    });
});

gulp.task('multbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "multbet.wee.bet",
        banca: "MULTBET",
        styles: "",
    });
});

gulp.task('prowin.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "prowin.bet",
        banca: "PROWIN",
        styles: "",
    });
});

gulp.task('betsnews.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betsnews.wee.bet",
        banca: "BETS NEWS",
        styles: "",
    });
});

gulp.task('bet10.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "bet10.wee.bet",
        shared_url: "bet10.bet",
        banca: "BET10",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WSNRRPX');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WSNRRPX'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
    });
});

gulp.task('premierbet.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "premierbet.wee.bet",
        banca: "PREMIER BET",
        styles: "",
    });
});

gulp.task('trevobet.net', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "trevobet.net",
        banca: "TREVO BET",
        styles: "",
    });
});

gulp.task('easybets.club', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "easybets.club",
        banca: "EASY BETS",
        styles: "",
    });
});
