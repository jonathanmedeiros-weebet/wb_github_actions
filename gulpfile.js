var gulp = require('gulp');
var replace = require('gulp-replace');
var exec = require('gulp-exec');

function tasks(done, config) {
    let sharedUrl = config.host;

    if (config.shared_url) {
        sharedUrl = config.shared_url;
    }

    const defaultDescription = `${config.banca} é um site de entretenimento online que oferece a seus usuários uma experiência única em apostas. Ao acessar, continuar a utilizar ou navegar no website ${config.banca}, você aceita que utilizemos certos cookies de navegador visando melhorar a sua experiência enquanto utiliza nosso site. ${config.banca} apenas usa cookies para melhorar a sua experiência e não interferem com sua privacidade.`;
    const defaultAndroidVersion = "7";

    gulp.src(['base-build/config.ts'])
        .pipe(replace('[HOST]', 'central.' + (config.dominioTemp ?? config.host)))
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(replace('[SHARED_URL]', sharedUrl))
        .pipe(replace('[BANCA]', config.banca))
        .pipe(gulp.dest('src/app/shared/'));

    gulp.src(['base-build/index.html'])
        .pipe(replace('[HOST]', 'central.' + config.host))
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(replace('[BANCA]', config.banca))
        .pipe(replace('[DESCRIPTION]', config.description ?? defaultDescription))
        .pipe(replace('[ANDROID_VERSION]', config.android_version ?? defaultAndroidVersion))
        .pipe(replace('[SCRIPTS]', typeof config.scripts == "undefined" ? "" : config.scripts))
        .pipe(replace('[GOOGLE_TAG_PART_1]', typeof config.google_tag_part_1 == "undefined" ? "" : config.google_tag_part_1))
        .pipe(replace('[GOOGLE_TAG_PART_2]', typeof config.google_tag_part_2 == "undefined" ? "" : config.google_tag_part_2))
        .pipe(replace('[PIXEL]', typeof config.pixel == "undefined" ? "" : config.pixel))
        .pipe(replace('[CUSTOM]', config.styles))
        .pipe(replace('[ADITIONAL_STYLE]', typeof config.aditional_styles == "undefined" ? "" : config.aditional_styles))
        .pipe(replace('[TIMESTAMP]', Math.floor((new Date().getTime() / 1000))))
        .pipe(gulp.dest('src/'));

    gulp.src(['base-build/bilhete/index.html'])
        .pipe(replace('[S3_FOLDER]', config.host))
        .pipe(gulp.dest('src/bilhete/'));

    gulp.src(['base-build/bilhete/app-service.js'])
        .pipe(replace('[HOST]', config.host))
        .pipe(gulp.dest('src/bilhete/'));

    if (config.xtremepush_sdk) {
        gulp.src(['base-build/xtremepush/subscribe.html'])
            .pipe(replace('[XTREMEPUSH_SDK_KEY]', config.xtremepush_sdk))
            .pipe(gulp.dest('src/assets/'));

        gulp.src(['base-build/xtremepush/frame.html'])
            .pipe(replace('[XTREMEPUSH_SDK_KEY]', config.xtremepush_sdk))
            .pipe(gulp.dest('src/assets/'));

        gulp.src(['base-build/xtremepush/service-worker.js'])
            .pipe(gulp.dest('src/assets/'));
    }

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
        customTemplatingThing: "test" // content passed to lodash.template()rep
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
}

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

gulp.task('casadinha.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "casadinha.bet",
        banca: "CASADINHA.BET",
        styles: "",
       });
});

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
        scripts: "<script type='text/javascript' src='  https://webchat.voll360.com/voll-webchat.umd.cjs'></script><script>  VollWebChat.init({    subdomain: 'sportive',    width: 300,    height: 400,    token: 'YjhjNDQwNjktYTQ1MC00MDg0LWEyYjItZDNjNmM4MTcxYWViOmRiYmFkMDFk\\nZDYwYjkwODE1YTM5MTNkMjQ4ZjllMWJmNmNjMDc2MzY1NUJQazRrdTR6S0I4\\ndnBURGh1MkhTRThiOUlPdURPSVpROXdGUGlPS3Q=',  });</script>"
    })
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
        styles: ""
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
        styles: ""
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
        server: "front5.wee.bet",
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

gulp.task('bet9.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "bet9.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('topbets.me', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "topbets.me",
        banca: "Top Bets",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WTZFR5F');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WTZFR5F'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        pixel: "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/J6Td0uavlU' async></script>",
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

gulp.task('vitoriasports.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "vitoriasports.bet",
        banca: "Vitória Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: yellow; --odds: #292b75; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
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
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T7XRTDXQ');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-T7XRTDXQ'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
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
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #dab600; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } ",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MK7SQ3SN');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-MK7SQ3SN'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
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

gulp.task('mastersports.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "mastersports.wee.bet",
        banca: "MASTER SPORTS",
        styles: "",
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

gulp.task('esportebets.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "esportebets.bet",
        banca: "ESPORTE BETS",
        styles: ""
    });
});

gulp.task('sportbets7.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "sportbets7.net",
        banca: "SPORT BETS 7",
        styles: "",
    });
});

gulp.task('jrsports.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "jrsports.bet",
        banca: "JR SPORTS",
        styles: "--header:#631508;--foreground-header:#fff;--sidebar-right:#631508;--sidebar-left:#631508;--odds:#a07417; --foreground-highlight: #fff;",
        scripts: "<!-- Start of LiveChat (www.livechat.com) code --> <script> window.__lc = window.__lc || {}; window.__lc.license = 14896188; ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:'2.0',on:function(){i(['on',c.call(arguments)])},once:function(){i(['once',c.call(arguments)])},off:function(){i(['off',c.call(arguments)])},get:function(){if(!e._h)throw new Error('[LiveChatWidget] You cant use getters before load.');return i(['get',c.call(arguments)])},call:function(){i(['call',c.call(arguments)])},init:function(){var n=t.createElement('script');n.async=!0,n.type='text/javascript',n.src='https://cdn.livechatinc.com/tracking.js',t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice)) </script> <noscript><a href='https://www.livechat.com/chat-with/14896188/' rel='nofollow'>Chat with us</a>, powered by <a href='https://www.livechat.com/?welcome' rel='noopener nofollow' target='_blank'>LiveChat</a></noscript> <!-- End of LiveChat code -->",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5NR33QW');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5NR33QW'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
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

gulp.task('dolarbets.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "dolarbets.wee.bet",
        banca: "DOLAR BETS",
        styles: "--header:#005801; --foreground-header:#fff; --sidebar-left: #005801; --sidebar-right: #005801;--odds:#000;--foreground-highlight:#fff;--league: #ffcc28;",
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
        scripts: "<script type='text/javascript' async src='https://d335luupugsy2.cloudfront.net/js/loader-scripts/fd31469f-c1a4-4d85-a1a3-765366f02ce0-loader.js' ></script>"
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

gulp.task('moralbets.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "moralbets.com",
        banca: "MORAL BETS",
        styles: "--header: #a9a9a9; --foreground-header: #000; --sidebar-right: #a9a9a9; --foreground-sidebar-right: #000; --sidebar-left: #a9a9a9; --foreground-sidebar-left: #000;--highlight:#68eb5a;--foreground-highlight: #000;--odds:#000;",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --><script async src='https://www.googletagmanager.com/gtag/js?id=G-4D549X8JK5'></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-4D549X8JK5');</script>",
        pixel: "<!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1966014593746054');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1966014593746054&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '814670293101190'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=814670293101190&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '431191212500414'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=431191212500414&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '667022238352468'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=667022238352468&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '498204865168023'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=498204865168023&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1135773527120449');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1135773527120449&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1589508724795812');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1589508724795812&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
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

gulp.task('ingamesport.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ingamesport.com",
        banca: "INGAME SPORT",
        styles: ""
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

gulp.task('maranhaobets.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "maranhaobets.net",
        banca: "MARANHÃO BETS",
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

gulp.task('ligabet.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "ligabet.wee.bet",
        banca: "LIGA BET",
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

gulp.task('trandbets.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "trandbets.com",
        banca: "TRAND BETS",
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

gulp.task('jmxbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "jmxbet.com",
        banca: "JMX BET",
        styles: "",
    });
});

gulp.task('saqbet.tv', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "saqbet.tv",
        banca: "SAQBET.TV",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-57ZDQ9Q');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-57ZDQ9Q'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
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
        scripts: "",
        pixel: "<meta name='facebook-domain-verification' content='7v5vjxw4e0l3rgyt2uqet8ik71n41u' /><!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '477724757578863');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=477724757578863&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T95Z4TVG');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-T95Z4TVG'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('betfacil123.app', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betfacil123.app",
        banca: "BET FÁCIL 123",
        styles: "",
        pixel: "<meta name='facebook-domain-verification' content='91h9n5i6r0qfg3w8tupmcobu4p3k9x' /> <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '4910465152363836'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=4910465152363836&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google tag (gtag.js) --><script async src='https://www.googletagmanager.com/gtag/js?id=G-ZZJQ4F1X8X'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-ZZJQ4F1X8X');</script>"
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

gulp.task('betsnordeste.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsnordeste.wee.bet",
        banca: "BETS NORDESTE",
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

gulp.task('i2bets.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "i2bets.com",
        banca: "I2 BETS",
        styles: "",
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

gulp.task('betimperativo.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betimperativo.wee.bet",
        shared_url: "betimperativo.com.br",
        banca: "Bet Imperativo",
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

gulp.task('bets60.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bets60.wee.bet",
        banca: "BETS 60",
        styles: "",
    });
});

gulp.task('pixsportbet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "pixsportbet.com",
        banca: "PIX SPORT BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MLPCJ56');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-MLPCJ56'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
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

gulp.task('topbetgames.wee.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "topbetgames.wee.bet",
        banca: "TOP BET GAMES",
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

gulp.task('futpix.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "futpix.wee.bet",
        shared_url: "futpix.com.br",
        banca: "FUTPIX",
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

gulp.task('bet83.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bet83.wee.bet",
        banca: "BET83",
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

gulp.task('betnordeste.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betnordeste.net",
        banca: "BET NORDESTE SPORTS",
        styles: "",
    });
});

gulp.task('betboladavez.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betboladavez.wee.bet",
        shared_url: "betboladavez.online",
        banca: "BET BOLA DA VEZ",
        styles: "",
    });
});

gulp.task('iconebet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "iconebet.com",
        banca: "ÍconeBet",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '6441889142559689');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=6441889142559689&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        scripts: "<!-- Google tag (gtag.js) --><script async src='https://www.googletagmanager.com/gtag/js?id=G-HKVTNNSPJ4'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-HKVTNNSPJ4');</script>"
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

gulp.task('betsesporte.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betsesporte.com",
        banca: "LASVEGAS SPORT",
        styles: "",
    });
});

gulp.task('eshowdebola.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "eshowdebola.bet",
        banca: "É SHOW DE BOLA",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M7BC6K77');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-M7BC6K77'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
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

gulp.task('nautsports.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "nautsports.wee.bet",
        banca: "NAUTSPORTS",
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
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NVZSTLVL');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-NVZSTLVL'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
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

gulp.task('betmax.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betmax.wee.bet",
        banca: "BETMAX",
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

gulp.task('belabets.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "belabets.com",
        banca: "BELA BETS",
        styles: "",
    });
});

gulp.task('apostasmax.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "apostasmax.com",
        banca: "APOSTAS MAX",
        styles: "",
    });
});

gulp.task('ritsbet.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "ritsbet.wee.bet",
        banca: "RITS BET",
        styles: "",
    });
});

gulp.task('brsports.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "brsports.bet",
        banca: "BR SPORTS",
        styles: "",
    });
});

gulp.task('santissports.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "santissports.com",
        banca: "SANTIS SPORTS",
        styles: "",
    });
});

gulp.task('bomba.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bomba.bet",
        banca: "BOMBA.BET",
        styles: "",
    });
});

gulp.task('pointbet.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "pointbet.bet",
        banca: "POINTBET",
        styles: "",
    });
});

gulp.task('moneysports.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "moneysports.bet",
        banca: "MONEY SPORTS",
        pixel: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KJJQBZ4');</script><!-- End Google Tag Manager --><!-- Google Tag Manager (noscript) --><noscript><iframe src='ns'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        styles: "",
    });
});

gulp.task('megasporte.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "megasporte.com",
        banca: "MEGASPORTE",
        styles: "",
    });
});

gulp.task('openbets.vip', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "openbets.vip",
        banca: "OPEN BETS",
        styles: "",
    });
});

gulp.task('imperiopix.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "imperiopix.bet",
        banca: "IMPÉRIO PIX",
        styles: "",
    });
});

gulp.task('primoos.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "primoos.bet",
        banca: "PRIMOOS.BET",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '3466718803573085');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=3466718803573085&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        styles: "",
    });
});

gulp.task('realsport.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "realsport.wee.bet",
        banca: "REAL SPORT",
        styles: "",
    });
});

gulp.task('betsplay.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betsplay.bet",
        banca: "BETS PLAY",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TK43J75');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-TK43J75'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
    });
});

gulp.task('pointbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "pointbet.wee.bet",
        banca: "POINT BET",
        styles: "",
    });
});

gulp.task('3tbet.com.br', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "3tbet.com.br",
        banca: "3T BET",
        styles: "",
    });
});

gulp.task('lutbet.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "lutbet.net",
        banca: "LUTBET",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '770268101097247');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=770268101097247&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"+
        "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '541896364747754'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=541896364747754&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"+
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '4273662536192492');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=4273662536192492&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"+
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '586943919882415');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=586943919882415&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"+
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '1177052002968035');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=1177052002968035&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"+
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '963641168110553');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=963641168110553&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"
    });
});

gulp.task('cassinomania.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "cassinomania.com",
        banca: "CASSINO MANIA",
        styles: "",
    });
});

gulp.task('mzsports.pro', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "mzsports.pro",
        banca: "MZ SPORTS",
        styles: "",
        pixel: "",
        scripts: ""
    });
});

gulp.task('betsmilionaria.com.br', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betsmilionaria.com.br",
        banca: "BETS MILIONÁRIA",
        styles: "",
        pixel: "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/ZJxAw9E4Ei' async></script>",
        dominioTemp: "betsmilionaria.com"
    });
});

gulp.task('aguiasport.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "aguiasport.bet",
        banca: "ÁGUIA SPORT",
        styles: "",
    });
});

gulp.task('megasports.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "megasports.bet",
        banca: "MEGA SPORTS",
        styles: "",
    });
});

gulp.task('81betpix.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "81betpix.wee.bet",
        banca: "81 BET PIX",
        styles: "",
    });
});

gulp.task('sportpix.vip', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sportpix.vip",
        banca: "SPORTPIX",
        styles: "",
    });
});

gulp.task('alfasports.online', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "alfasports.online",
        banca: "ALFA SPORTS",
        styles: "",
    });
});

gulp.task('novabet.site', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "novabet.site",
        banca: "NOVA BET",
        styles: "",
        pixel: "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '991527785504009'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=991527785504009&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->" +
        "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '6185972464845414'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=6185972464845414&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KF8VM7ZD');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KF8VM7ZD'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('profit2.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "profit2.bet",
        banca: "PROFIT2.BET",
        styles: "",
        pixel: "",
        scripts: "",
    });
});

gulp.task('vemprabet.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "vemprabet.com",
        banca: "VEM PRA BET",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '267162419017327');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=267162419017327&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->" +
        "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '3428785817374794'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=3428785817374794&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->" +
        "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/3TMdCRtVsW' async></script>",
    });
});

gulp.task('esportenetreipele.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "esportenetreipele.com",
        banca: "ESPORTE NET REI PELÉ",
        styles: "",
    });
});

gulp.task('powerbets.vip', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "powerbets.vip",
        banca: "POWER BETS",
        styles: "",
    });
});

gulp.task('ragnar.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ragnar.bet",
        banca: "RAGNAR.BET",
        styles: "",
        // xtremepush_sdk: "IiG7anngT2KQjqlbEve0zEVJlmSWIBHi"
    });
});

gulp.task('cassinoaovivo.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "cassinoaovivo.bet",
        banca: "Cassino Ao Vivo – Cassino Online e Aposta Esportiva com Cashback!",
        styles: "",
        pixel: "<meta name='google-site-verification' content='8hcSk8ilek9Xlj8OwxRXOARr-ka3PMWJtS_z85FedNY' />",
        description: "No Cassino Ao Vivo você se diverte com o melhor do cassino online e apostas esportivas com cashback e bônus de primeiro deposito.",
        scripts: "<!-- Google tag (gtag.js) --><script async src='https://www.googletagmanager.com/gtag/js?id=G-69QY0X8SYT'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-69QY0X8SYT');</script>",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5B2BHPD');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5B2BHPD'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('n7futmix.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "n7futmix.com",
        banca: "N7 FUTMIX",
        styles: "",
    });
});

gulp.task('sortebet777.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "sortebet777.com",
        banca: "SORTE BET 777",
        styles: "",
    });
});

gulp.task('fizabet.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "fizabet.com",
        banca: "FIZ A BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N2RZCF5S');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-N2RZCF5S'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        description: "Explore a emoção das apostas esportivas e divirta-se com os melhores jogos de aposta online na FIZABET - Cadastre-se agora e faça sua jogada! E você, já fez a sua bet hoje? #AposteComFIZABET",
    });
});

gulp.task('sorteesportiva.app', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "sorteesportiva.app",
        banca: "SORTE ESPORTIVA",
        styles: "",
    });
});

gulp.task('nacionalbet.club', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "nacionalbet.club",
        banca: "NACIONAL BET",
        styles: "",
        description: "A melhor maneira de fazer apostas online nos seus esportes favoritos e ganhar até R$3000 em bônus ao se registrar. Aproveite a experiência da NacionalBET e as melhores ODDS. Site de apostas 100% confiável. Faça sua aposta!",
    });
});

gulp.task('betplusbr.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betplusbr.com",
        banca: "BET PLUS BR",
        styles: "",
    });
});

gulp.task('futvale.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "futvale.net",
        banca: "FUTVALE",
        styles: "",
    });
});

gulp.task('treinamento.wee.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "treinamento.wee.bet",
        banca: "Treinamento Weebet",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N5PB557T');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-N5PB557T'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"

    });
});

gulp.task('arena-esportiva.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "arena-esportiva.com",
        banca: "ARENA ESPORTIVA",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '812289590464482');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=812289590464482&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->" +
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '1124276531742097');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=1124276531742097&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
    });
});

gulp.task('faithbets.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "faithbets.bet",
        banca: "FAITH BETS",
        styles: "",
    });
});

gulp.task('chama.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "chama.bet",
        banca: "CHAMA.BET",
        styles: "",
    });
});

gulp.task('sportilha.online', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sportilha.online",
        banca: "SPORTILHA",
        styles: "",
    });
});

gulp.task('ccaesportes.club', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "ccaesportes.club",
        banca: "CCA ESPORTES",
        styles: "",
    });
});

gulp.task('lucromaster.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "lucromaster.net",
        banca: "LUCRO MASTER",
        styles: "",
    });
});

gulp.task('favelabett.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "favelabett.com",
        banca: "FAVELA BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5DZV99XN');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5DZV99XN'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('kwbet.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "kwbet.bet",
        banca: "KW BET",
        styles: "",
        pixel: "",
        scripts: "<script type='text/javascript' src='//tags.fulllab.com.br/scripts/produto_kwbet.js' async></script>",
    });
});

gulp.task('vitoriasports.vip', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "vitoriasports.vip",
        banca: "VITÓRIA SPORTS",
        styles: "",
    });
});

gulp.task('favoritao.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "favoritao.com",
        banca: "Favoritão.bet - Onde os favoritos se encontram!",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '2339542659563497');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=2339542659563497&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google Tag Manager --> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-PGFP53W');</script> <!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --> <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-PGFP53W' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <!-- End Google Tag Manager (noscript) -->"
    });
});

gulp.task('085.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "085.bet",
        banca: "085.BET",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '243787891795745');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=243787891795745&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->" +
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '241367635506168');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=241367635506168&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->" +
        "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '301526292376433');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=301526292376433&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
    });
});

gulp.task('blubet.site', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "blubet.site",
        banca: "BLUEBET",
        styles: "",
    });
});

gulp.task('playgreen.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "playgreen.bet",
        banca: "PLAY GREEN",
        styles: "",
    });
});

gulp.task('apostacerta.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "apostacerta.bet",
        banca: "APOSTA CERTA",
        styles: "",
    });
});

gulp.task('apostenasorte.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "apostenasorte.bet",
        banca: "APOSTE NA SORTE",
        styles: "",
    });
});

gulp.task('betmaniapix.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betmaniapix.com",
        banca: "BET MANIA PIX",
        styles: "",
    });
});

gulp.task('jogue.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "jogue.bet",
        banca: "JOGUE.BET",
        styles: "",
    });
});

gulp.task('ultrabetss.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "ultrabetss.com",
        banca: "ULTRA BETSS",
        styles: "",
    });
});

gulp.task('vegasbrasilbet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "vegasbrasilbet.com",
        banca: "VEGAS BRASIL BET",
        styles: "",
    });
});

gulp.task('palpitei.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "palpitei.bet",
        banca: "PALPITEI.BET",
        styles: "",
    });
});

gulp.task('apostai.net', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "apostai.net",
        banca: "APOSTAI",
        styles: "",
    });
});

gulp.task('winsport.vip', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "winsport.vip",
        banca: "WIN SPORT",
        styles: "",
    });
});

gulp.task('betbras.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "betbras.com",
        banca: "BET BRAS",
        styles: "",
    });
});

gulp.task('capitalbets.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "capitalbets.bet",
        banca: "CAPITAL BETS",
        styles: "",
    });
});

gulp.task('playnabet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "playnabet.com",
        banca: "PLAY NA BET",
        styles: "",
        pixel: "<link rel='stylesheet' href='https://cdn.wee.bet/jivosite/jivosite.css'>",
        scripts: "<script src='https://cdn.wee.bet/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/URtzoUUjPd' async></script>",
    });
});

gulp.task('betinvestidor.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "betinvestidor.com",
        banca: "BET INVESTIDOR",
        styles: "",
    });
});

gulp.task('winvegas.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "winvegas.bet",
        banca: "WIN VEGAS",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-PZG7KV79');</script> <!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --> <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-PZG7KV79 ' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <!-- End Google Tag Manager (noscript) -->",
        scripts: "<script>        !function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t():'function'==typeof define&&define.amd?define([],t):'object'==typeof exports?exports.install=t():e.install=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){'undefined'!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:'Module'}),Object.defineProperty(e,'__esModule',{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&'object'==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,'default',{enumerable:!0,value:e}),2&t&&'string'!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,'a',t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p='',n(n.s=0)}([function(e,t,n){'use strict';var r=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};!function(e){var t=window;t.KwaiAnalyticsObject=e,t[e]=t[e]||[];var n=t[e];n.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];var o=function(e,t){e[t]=function(){var n=Array.from(arguments),o=r([t],n,!0);e.push(o)}};n.methods.forEach((function(e){o(n,e)})),n.instance=function(e){var t=n._i[e]||[];return n.methods.forEach((function(e){o(t,e)})),t},n.load=function(t,r){n._i=n._i||{},n._i[t]=[],n._i[t]._u='https://s1.kwai.net/kos/s101/nlav11187/pixel/events.js',n._t=n._t||{},n._t[t]=+new Date,n._o=n._o||{},n._o[t]=r||{};var o=document.createElement('script');o.type='text/javascript',o.async=!0,o.src='https://s1.kwai.net/kos/s101/nlav11187/pixel/events.js?sdkid='+t+'&lib='+e;var i=document.getElementsByTagName('script')[0];i.parentNode.insertBefore(o,i)}}('kwaiq')}])}));        </script>        <script>        kwaiq.load('524043992565809187');        kwaiq.page();        </script>",
    });
});

gulp.task('pbpixbet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "pbpixbet.com",
        banca: "PB PIX BET",
        styles: "",
    });
});

gulp.task('pixcassino999.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "pixcassino999.com",
        banca: "PIX CASSINO 99",
        styles: "",
    });
});

gulp.task('betsnordeste.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "betsnordeste.bet",
        banca: "BETS NORDESTE",
        styles: "",
    });
});

gulp.task('suasortebet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "suasortebet.com",
        banca: "SUA SORTE BET",
        styles: "",
    });
});

gulp.task('betsrio.online', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "betsrio.online",
        banca: "BETS RIO",
        styles: "",
    });
});

gulp.task('rc.wee.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "rc.wee.bet",
        banca: "Weebet RC",
        styles: "",
    });
});

gulp.task('valebets.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "valebets.bet",
        banca: "VALE BETS",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --> <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-KSGZT37L');</script> <!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --> <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KSGZT37L ' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript> <!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('jogateka.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "jogateka.com",
        banca: "JOGATEKA",
        styles: "",
    });
});

gulp.task('amazonsport.io', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "amazonsport.io",
        banca: "AMAZON SPORT",
        styles: "",
        pixel: "",
        scripts: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MBK6MJ7P');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-MBK6MJ7P'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('federalsports.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "federalsports.bet",
        banca: "FEDERAL SPORTS",
        styles: "",
    });
});

gulp.task('eskybet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "eskybet.com",
        banca: "Casa de Apostas Eskybet | Os Melhores Jogos de Cassino Online com Bônus de Cadastro",
        styles: "",
        description: "Cadastre-se e Jogue os Melhores Jogos de Cassino Online, realize sua Aposta Online na Eskybet a Melhor Plataforma com Pagamento via Pix",
    });
});

gulp.task('showbets21.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "showbets21.com",
        banca: "SHOW BETS 21",
        styles: "",
    });
});

gulp.task('agorabets.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "agorabets.com",
        banca: "AGORA BETS",
        styles: "",
    });
});

gulp.task('fortalezabets.online', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "fortalezabets.online",
        banca: "FORTALEZA BETS",
        styles: "",
    });
});

gulp.task('apostabrasil.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "apostabrasil.com",
        banca: "APOSTA BRASIL",
        styles: "",
    });
});

gulp.task('lottomaster.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "lottomaster.bet",
        banca: "LOTTO MASTER",
        styles: "",
    });
});

gulp.task('jbnacional.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "jbnacional.bet",
        banca: "JB NACIONAL",
        styles: "",
    });
});

gulp.task('jetbet365.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "jetbet365.com",
        banca: "JET BET 365",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P65H9KK8');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-P65H9KK8'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        xtremepush_sdk: "eevBAQ-IGn6GrAGzjOBRlWA7_q37u3Pa"
    });
});

gulp.task('betbetix.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betbetix.com",
        banca: "BET BETIX",
        styles: ""
    });
});

gulp.task('pix777.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "pix777.bet",
        banca: "PIX 777",
        styles: "",
    });
});

gulp.task('moneybets.net', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "moneybets.net",
        banca: "MONEY BETS",
        styles: "",
    });
});

gulp.task('bnrbet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bnrbet.com",
        banca: "BNR BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KVT8RKHH');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KVT8RKHH'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('valeno.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "valeno.bet",
        banca: "VALENO",
        styles: "",
        description: "Viva a emoção do jogo em nosso universo de apostas esportivas e cassino, oferecemos a combinação perfeita de diversão e oportunidades de vitória"
    });
});

gulp.task('dentrodaaposta.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "dentrodaaposta.com",
        banca: "DENTRO DA APOSTA",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WXPHXCMZ');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WXPHXCMZ'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('xico.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "xico.bet",
        banca: "XICO.BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WMS92R2Q');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WMS92R2Q'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('nortedasorte.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "nortedasorte.bet",
        banca: "NORTE DA SORTE",
        styles: "",
    });
});

gulp.task('faturabet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "faturabet.com",
        banca: "FATURA BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WDHLXMF6');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WDHLXMF6'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('mczbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "mczbet.com",
        banca: "MCZ BET",
        styles: ""
    });
});

gulp.task('supertop3.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "supertop3.bet",
        banca: "SUPERTOP3.BET",
        styles: "",
    });
});

gulp.task('bullbets.com.br', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bullbets.com.br",
        banca: "BULL BETS",
        styles: "",
    });
});

gulp.task('starbetfc.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "starbetfc.com",
        banca: "Starbet FC",
        styles: "",
    });
});

gulp.task('betypix.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betypix.bet",
        banca: "BETYPIX",
        styles: "",
    });
});

gulp.task('betpix3r.online', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "betpix3r.online",
        banca: "BETPIX3R",
        styles: "",
    });
});

gulp.task('apostaminas.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "apostaminas.com",
        banca: "APOSTA MINAS",
        styles: "",
    });
});

gulp.task('trevocassino.vip', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "trevocassino.vip",
        banca: "TREVO CASSINO",
        styles: "",
    });
});

gulp.task('beton.club', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "beton.club",
        banca: "BETON",
        styles: "",
    });
});

gulp.task('maxbet.wee.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "maxbet.wee.bet",
        shared_url: "maxbetbrasil.com",
        banca: "MAX BET",
        styles: "",
    });
});

gulp.task('greenp1x.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "greenp1x.com",
        banca: "GREEN P1X",
        styles: "",
    });
});

gulp.task('lidersport.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "lidersport.bet",
        banca: "LÍDER SPORT",
        styles: "",
    });
});

gulp.task('betrapida.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "betrapida.com",
        banca: "BET RÁPIDA",
        styles: "",
    });
});

gulp.task('bruxo888.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bruxo888.com",
        banca: "BRUXO 888",
        styles: "",
    });
});

gulp.task('bosscassino.bet', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "bosscassino.bet",
        banca: "BOSS CASSINO",
        styles: "",
    });
});

gulp.task('baraocassino.com', function (done) {
    tasks(done, {
        server: "front1.wee.bet",
        host: "baraocassino.com",
        banca: "BARÃO CASSINO",
        styles: "",
    });
});

gulp.task('brotanabet.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "brotanabet.com",
        banca: "BrotaNaBet",
        styles: "",
    });
});

gulp.task('mdsports.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "mdsports.bet",
        banca: "MD SPORTS",
        styles: "",
    });
});

gulp.task('sortepix.tv', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "sortepix.tv",
        banca: "SORTE PIX",
        styles: "",
    });
});

gulp.task('betbolt.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betbolt.net",
        banca: "BET BOLT",
        styles: "",
    });
});

gulp.task('lovebetz.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "lovebetz.com",
        banca: "LOVE BETZ",
        styles: "",
    });
});

gulp.task('winbetcassino.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "winbetcassino.com",
        banca: "WIN BET CASSINO",
        styles: "",
    });
});

gulp.task('playnopix.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "playnopix.com",
        banca: "Play no PIX",
        styles: "",
    });
});

gulp.task('superesportiva.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "superesportiva.com",
        banca: "SUPER ESPORTIVA",
        styles: "",
    });
});

gulp.task('bet10.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "bet10.bet",
        banca: "BET 10",
        styles: "",
    });
});

gulp.task('luckybets.vip', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "luckybets.vip",
        banca: "LUCKYBETS",
        styles: "",
    });
});

gulp.task('decolar.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "decolar.bet",
        banca: "DECOLAR.BET",
        styles: "",
    });
});

gulp.task('betstar.vip', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betstar.vip",
        banca: "BETSTAR",
        styles: "",
    });
});

gulp.task('multisports.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "multisports.bet",
        banca: "MULTISPORTS",
        styles: "",
        dominioTemp: "multisports.wee.bet"
    });
});

gulp.task('betcampea.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betcampea.com",
        banca: "BET CAMPEÃ",
        styles: "",
        scripts: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '470832182024876');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=470832182024876&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->"
    });
});

gulp.task('brinksbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "brinksbet.com",
        banca: "BRINKS BET",
        styles: ""
    });
});

gulp.task('betbastet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betbastet.com",
        banca: "BET BASTET",
        styles: ""
    });
});

gulp.task('probetx1.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "probetx1.com",
        banca: "PROBET X1",
        styles: ""
    });
});

gulp.task('asortebets.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "asortebets.com",
        banca: "A SORTE BETS",
        styles: ""
    });
});

gulp.task('ativabet.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "ativabet.bet",
        banca: "ATIVA BET",
        styles: ""
    });
});

gulp.task('proesporte.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "proesporte.net",
        banca: "PRO ESPORTE",
        styles: ""
    });
});

gulp.task('unibets.com.br', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "unibets.com.br",
        banca: "UNI BETS",
        styles: ""
    });
});

gulp.task('zilionz.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "zilionz.com",
        banca: "ZILIONZ",
        styles: "",
        scripts: "<script type='text/javascript' src='https://cd823ed6-bffb-4764-9e1b-05566f369c8c.snippet.anjouangaming.org/anj-seal.js'></script><script></script>",
        xtremepush_sdk: "oZQxbVqAu8kYxv_ElwCFWxaevtLjzMi_"
    });
});

gulp.task('newbets.com.br', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "newbets.com.br",
        banca: "NEW BETS",
        styles: ""
    });
});

gulp.task('jupterbet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "jupterbet.com",
        banca: "JUPTERBET",
        styles: ""
    });
});

gulp.task('jrsports.io', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "jrsports.io",
        banca: "JR SPORTS",
        styles: ""
    });
});

gulp.task('camaraobet.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "camaraobet.com",
        banca: "CAMARÃO BET",
        styles: ""
    });
});

gulp.task('miamipix.net', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "miamipix.net",
        banca: "MIAMI PIX",
        styles: ""
    });
});

gulp.task('pixplay.io', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "pixplay.io",
        banca: "PIX PLAY",
        styles: ""
    });
});

gulp.task('sortegol.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "sortegol.bet",
        banca: "SORTE GOL",
        styles: ""
    });
});

gulp.task('betcombinada.net', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "betcombinada.net",
        banca: "BET COMBINADA",
        styles: ""
    });
});

gulp.task('gramado.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "gramado.bet",
        banca: "GRAMADO.BET",
        styles: ""
    });
});

gulp.task('avante.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "avante.bet",
        banca: "AVANTE.BET",
        styles: ""
    });
});

gulp.task('26sports.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "26sports.bet",
        banca: "26 SPORTS",
        styles: ""
    });
});

gulp.task('stargoldbet.app', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "stargoldbet.app",
        banca: "STAR GOLD BET",
        styles: ""
    });
});

// Old goalbet.com.br
gulp.task('goalb.net', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "goalb.net",
        banca: "GOAL BET",
        styles: ""
    });
});

gulp.task('sortegol.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "sortegol.com",
        banca: "SORTE GOL",
        styles: "",
        dominioTemp: "sortegol.wee.bet"
    });
});

gulp.task('canela.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "canela.bet",
        banca: "CANELA BET",
        styles: ""
    });
});

gulp.task('curitiba.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "curitiba.bet",
        banca: "CURITIBA BET",
        styles: ""
    });
});

gulp.task('portoalegre.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "portoalegre.bet",
        banca: "PORTO ALEGRE BET",
        styles: ""
    });
});

gulp.task('rio.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "rio.bet",
        banca: "RIO BET",
        styles: ""
    });
});

gulp.task('riojogos.com', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "riojogos.com",
        banca: "Rio Jogos",
        styles: "",
        scripts: "<!-- Start of LiveChat (www.livechatinc.com) code --><script type='text/javascript'>  window.__lc = window.__lc || {};  window.__lc.license = 14406369;  window.__lc.chat_between_groups = false; ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)};  var e={_q:[],_h:null,_v:'2.0',on:function(){i(['on',c.call(arguments)])},once:function(){  i(['once',c.call(arguments)])},off:function(){i(['off',c.call(arguments)])},  get:function(){if(!e._h)throw new Error('[LiveChatWidget] You cant use getters before load.');  return i(['get',c.call(arguments)])},call:function(){i(['call',c.call(arguments)])},init:function(){  var n=t.createElement('script');  n.async=!0,n.type='text/javascript',  n.src='https://cdn.livechatinc.com/tracking.js',t.head.appendChild(n)}};  !n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))</script><noscript><a href='https://www.livechatinc.com/chat-with/14406369/' rel='nofollow'>Chat with us</a>,powered by <a href='https://www.livechatinc.com/?welcome' rel='noopener nofollow' target='_blank'>LiveChat</a></noscript><!-- End of LiveChat code -->",
        xtremepush_sdk: "WQRciE4QqacZFCg2gAUq1shLOVSiRa-n"
    });
});

gulp.task('gli.wee.bet', function (done) {
    tasks(done, {
        server: "54.147.182.240",
        host: "gli.wee.bet",
        banca: "GLI - Sandbox",
        styles: ""
    });
});

gulp.task('deupix.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "deupix.bet",
        banca: "DEU PIX",
        styles: "",
    });
});

gulp.task('balneario.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "balneario.bet",
        banca: "BALNEÁRIO BET",
        styles: ""
    });
});

gulp.task('caxias.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "caxias.bet",
        banca: "CAXIAS BET",
        styles: ""
    });
});

gulp.task('floripa.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "floripa.bet",
        banca: "FLORIPA BET",
        styles: ""
    });
});

gulp.task('appjetbet365.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "appjetbet365.com",
        banca: "APP JETBET365",
        styles: ""
    });
});

gulp.task('tourodasorte.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "tourodasorte.bet",
        banca: "TOURO DA SORTE",
        styles: ""
    });
});

gulp.task('decola.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "decola.bet",
        banca: "DECOLA.BET",
        styles: "",
        description: "As melhores ofertas hoje: 100% até R$1000 em Apostas Esportivas e todos os Games. Aproveite as apostas no futebol, basquete, Esoccer, NBA e demais jogos. Dobramos seu depósito de até R$1000. Saque Rápido & Seguro."
    });
});

gulp.task('priv8bet.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "priv8bet.com",
        banca: "PRIV8BET: Apostas Esportivas Online & Casino | Aposte com total segurança",
        styles: "",
    });
});

gulp.task('betinha.com', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betinha.com",
        banca: "betinha.com",
        styles: "",
        xtremepush_sdk: "0F-o4hhQ-HQJhCjSdyAHUcYutoxcrqYB",
        scripts: "<script> window.$chatwoot.toggle(); </script>"
    });
});

gulp.task('goldeplaca.online', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "goldeplaca.online",
        banca: "GOL DE PLACA",
        styles: "",
    });
});

gulp.task('puskasbet.com.br', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "puskasbet.com.br",
        banca: "PUSKAS BET",
        styles: "",
    });
});

gulp.task('betagora.io', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "betagora.io",
        banca: "BET AGORA",
        styles: "",
        scripts: "<!-- Start of betagora Zendesk Widget script --><script id='ze-snippet' src='https://static.zdassets.com/ekr/snippet.js?key=0afeed60-0582-416d-a66b-e4bbc408ad93'></script><!-- End of betagora Zendesk Widget script -->",
        xtremepush_sdk: "E5ilOYbc5X95iSCWM5gf_0K-_turnLxj"
    });
});

gulp.task('tigre.bet', function (done) {
    tasks(done, {
        server: "front4.wee.bet",
        host: "tigre.bet",
        banca: "TIGRE BET",
        styles: "",
    });
});

gulp.task('sortte.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "sortte.bet",
        banca: "SORTTE.BET",
        styles: "",
    });
});

gulp.task('megapix.bet', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "megapix.bet",
        banca: "MEGAPIX.BET",
        styles: "",
        dominioTemp: "megapixbet.wee.bet"
    });
});

gulp.task('pinbet.io', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "pinbet.io",
        banca: "PINBET",
        styles: "",
    });
});

gulp.task('clbet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "clbet.com",
        banca: "CLBET",
        styles: "",
        dominioTemp: "clbet.wee.bet"
    });
});

gulp.task('leaobet.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "leaobet.com",
        banca: "LEÃO BET",
        styles: "",
        dominioTemp: "leaobet.wee.bet"
    });
});

gulp.task('emirates365.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "emirates365.bet",
        banca: "EMIRATES 365",
        styles: "",
    });
});

gulp.task('12bets.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "12bets.bet",
        banca: "12 BETS",
        styles: "",
    });
});

gulp.task('bettotal.bet', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "bettotal.bet",
        banca: "BET TOTAL",
        styles: "",
    });
});

gulp.task('topbets.site', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "topbets.site",
        banca: "TOP BETS",
        styles: "",
    });
});

gulp.task('via-bet.com', function (done) {
    tasks(done, {
        server: "front3.wee.bet",
        host: "via-bet.com",
        banca: "VIA BET",
        styles: "",
    });
});

gulp.task('amabet.bet', function (done) {
    tasks(done, {
        server: "front2.wee.bet",
        host: "amabet.bet",
        banca: "AMA BET",
        styles: "",
        dominioTemp: "amabet.wee.bet"
    });
});

gulp.task('bigwinfree.com', function (done) {
    tasks(done, {
        server: "front5.wee.bet",
        host: "bigwinfree.com",
        banca: "BIG WIN FREE",
        styles: "",
        dominioTemp: "bigwinfree.wee.bet"
    });
});
