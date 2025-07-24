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

    gulp.src(['base-build/manifest.webmanifest'])
        .pipe(replace('[BANCA]', config.banca))
        .pipe(replace('[S3_FOLDER]', config.host))
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
        .pipe(exec('cd dist/browser && tar -czf tosend.tar * && scp -r -i ~/.keystore/weebet.pem tosend.tar ubuntu@' + config.server + ':/var/www/prod/bets/' + config.host + '/ && ssh -i ~/.keystore/weebet.pem ubuntu@' + config.server + ' sh /var/www/prod/bets/update_frontend.sh ' + config.host, options))
        .pipe(exec.reporter(reportOptions));

    done();
}

gulp.task('casadinha.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "casadinha.bet",
        banca: "CASADINHA.BET",
        styles: "",
    });
});

gulp.task('demo.wee.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "demo.wee.bet",
        banca: "DEMO",
        styles: "--header: #222d32; --foreground-header: #35cc96; --sidebar-right:#1a2226; --foreground-sidebar-right: #fff; --sidebar-left: #1a2226; --foreground-sidebar-left: #fff; --highlight: #35cc96; --foreground-highlight: #d2d6de; --odds: #2c3b41; --foreground-odds: #fff;--foreground-selected-odds: #fff;--selected-event: #1e282c;--event-time: #1e282c;",
        scripts: "<script type='text/javascript' src='  https://webchat.voll360.com/voll-webchat.umd.cjs'></script><script>  VollWebChat.init({    subdomain: 'sportive',    width: 300,    height: 400,    token: 'YjhjNDQwNjktYTQ1MC00MDg0LWEyYjItZDNjNmM4MTcxYWViOmRiYmFkMDFk\\nZDYwYjkwODE1YTM5MTNkMjQ4ZjllMWJmNmNjMDc2MzY1NUJQazRrdTR6S0I4\\ndnBURGh1MkhTRThiOUlPdURPSVpROXdGUGlPS3Q=',  });</script>"
    })
});

gulp.task('sandbox.wee.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "sandbox.wee.bet",
        banca: "SANDBOX",
        styles: "",
    });
});

gulp.task('esportivatop.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "esportivatop.com",
        banca: "Esportiva Top",
        styles: ""
    });
});

gulp.task('majorsport.vip', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "majorsport.vip",
        banca: "Major",
        styles: ""
    });
});

gulp.task('mjrsports.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "mjrsports.com",
        banca: "MJR SPORTS",
        styles: "--header: #3F6826; --foreground-header: #b1c5e0; --sidebar-right: #3B5323; --foreground-sidebar-right: #fff; --sidebar-left: #3B5323; --foreground-sidebar-left: #fff; --highlight: #ff0000; --foreground-highlight: #fff; --odds: #dab600; --foreground-odds: #fff; --selected-event: #000;",
        pixel: "<link rel='stylesheet' href='https://wb-assets.com/jivosite/jivosite.css'>"
    });
});

gulp.task('mjrsports.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "mjrsports.bet",
        banca: "MJR SPORTS",
        styles: ""
    });
});

gulp.task('sertaobets.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "sertaobets.com",
        banca: "Sertão Bets",
        styles: "--header: #666666; --foreground-header: #000; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #aec3d8; --odds: #e1b01e; --foreground-odds: #fff;",
    });
});

gulp.task('superbets.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "superbets.bet",
        banca: "SUPERBETS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --sidebar-left: #000;"
    });
});

gulp.task('superbetsport.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "superbetsport.com",
        banca: "SUPER BET SPORT",
        styles: "--highlight:#ff0a0b;--league: yellow;",
    });
});

gulp.task('trevodasorte.me', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "trevodasorte.me",
        banca: "Trevo da Sorte",
        styles: "--header: #4caf50; --foreground-header: #cce2ff; --sidebar-right:#123153; --foreground-sidebar-right: #fff; --sidebar-left: #123153; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #aec3d8; --odds: #4caf50; --foreground-odds: #fff;",
    });
});

gulp.task('esportbets.biz', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "esportbets.biz",
        banca: "Esport Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#14805e; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #ffdf1b; --foreground-highlight: #ffdf1b; --odds: #999; --foreground-odds: #333; --event-time: #14805e; --league: #14805e; --foreground-league: #fff;",
        aditional_styles: ".sem-evento{color: #fff;}  #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #14805e; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('esportbets.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "esportbets.bet",
        banca: "Esport Bets",
        styles: ""
    });
});

gulp.task('redblue.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "redblue.bet",
        banca: "Red Blue",
        styles: ""
    });
});

gulp.task('onbets.club', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "onbets.club",
        banca: "On Bets",
        styles: "--header: #333; --foreground-header: #fff; --sidebar-right:#777; --foreground-sidebar-right: #fff; --sidebar-left: #333; --foreground-sidebar-left: #fff; --highlight: #f0c027; --foreground-highlight: #f0c027; --odds: #999; --foreground-odds: #fff; --event-time: #777; --league: #777; --foreground-league: #f0c027;",
        aditional_styles: " #futebol-default-wrapper, #futebol-live-wrapper, #basquete-default-wrapper, #combate-default-wrapper{ background: #555!important } .jogos, .eventos{ background: #555!important; color: #fff!important; } .jogo{ border-top: none!important; } .campeonato-header{ border-bottom-color: #555!important; } .footer{ background-color:#555!important; }" +
            " .inside-event .indentificacao, .inside-event .campeonato-nome, .inside-event .indentificacao-mobile{ background-color: #777; color: white; } .inside-event .tipo-apostas{ background-color: #555!important; color: white!important; } .tipo-aposta { border-top: 1px solid #777!important; } #esportes-footer{ color:white; } "
    });
});

gulp.task('mrsportsdigital.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "mrsportsdigital.com",
        banca: "MR SPORTS",
        styles: ""
    });
});

gulp.task('bet2.wee.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "bet2.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('bet4.wee.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "bet4.wee.bet",
        banca: "BET",
        styles: ""
    });
});

gulp.task('totalsorte.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "totalsorte.com.br",
        banca: "Total Sorte",
        styles: ""
    });
});

gulp.task('bet7.wee.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "bet7.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('bet9.wee.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "bet9.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('qa1.wee.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "qa1.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('qa2.wee.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "qa2.wee.bet",
        banca: "WEEBET",
        styles: ""
    });
});

gulp.task('topbets.me', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "topbets.me",
        banca: "Top Bets",
        styles: "--header: #33546f; --foreground-header: #ffffff; --sidebar-right: #33546f; --foreground-sidebar-right: #fff; --sidebar-left: #33546f; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: #ffffff; --odds: #eba314;",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WTZFR5F');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WTZFR5F'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        pixel: "<link rel='stylesheet' href='https://wb-assets.com/jivosite/jivosite.css'>",
        scripts: "<script src='https://wb-assets.com/jivosite/jivosite.js' type='text/javascript'></script><script src='//code.jivosite.com/widget/J6Td0uavlU' async></script>",
    });
});

gulp.task('masterbet.wee.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "masterbet.wee.bet",
        banca: "MasterBet",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #ffdf1b; --odds: #000; --foreground-odds: #fff; --event-time: #cb151c; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('vitoriasports.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "vitoriasports.bet",
        banca: "Vitória Sports",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: red; --foreground-highlight: yellow; --odds: #292b75; --foreground-odds: #fff; --event-time: red; --league: #333; --foreground-league: #fff;",
    });
});

gulp.task('footbets.net', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "footbets.net",
        banca: "footbets",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight: yellow; --foreground-highlight: #fff; --odds:red; --foreground-odds: #fff; --event-time: #312782",
        aditional_styles: ".mais-opcoes{ color: var(--event-time)!important; }",
    });
});

gulp.task('rblt.me', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "rblt.me",
        banca: "RBLT",
        styles: "",
    });
});

gulp.task('esportebetsvip.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "esportebets.io",
        banca: "Esporte Bets",
        styles: "--header:#000; --foreground-header:#fff; --sidebar-left: #000; --sidebar-right: #000; --odds: #003ae6; --foreground-highlight: #fff;"
    });
});

gulp.task('mastersports.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "mastersports.bet",
        banca: "MASTER SPORTS",
        styles: "",
    });
});

gulp.task('megasports.club', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "megasports.club",
        banca: "MEGA SPORTS",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --highlight:yellow; --foreground-highlight: #fff; --odds: #008000; --foreground-odds: #fff;--highlight:red;"
    });
});

gulp.task('alfasports.net', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "alfasports.net",
        banca: "ALFA SPORTS",
        styles: "--header:#000;--foreground-header:#fff;--sidebar-right:#000;--sidebar-left:#000;--odds:#dab600;--highlight:red;"
    });
});

gulp.task('sportbets7.net', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "sportbets7.net",
        banca: "SPORT BETS 7",
        styles: "",
    });
});

gulp.task('sportss.vip', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "sportss.vip",
        banca: "BET SPORTS",
        styles: ""
    });
});

gulp.task('citybets.online', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "citybets.online",
        banca: "CITY BETS",
    });
});

gulp.task('lancet.club', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "lancet.club",
        banca: "LANCE BET",
        styles: ""
    });
});

gulp.task('betsgol.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betsgol.bet",
        banca: "BETS GOL",
        styles: "--header:#000; --foreground-header: #fff; --sidebar-left: #000; --sidebar-right: #000; --odds:#4d4d4d;"
    });
});

gulp.task('dolarbets.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "dolarbets.com",
        banca: "DOLAR BETS",
        styles: "--header:#005801; --foreground-header:#fff; --sidebar-left: #005801; --sidebar-right: #005801;--odds:#000;--foreground-highlight:#fff;--league: #ffcc28;",
    });
});

gulp.task('slsports.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "slsports.bet",
        banca: "SL SPORTS",
        styles: "--header: #006600; --foreground-header: #fff; --sidebar-right:#7fb96a; --foreground-sidebar-right: #fff; --sidebar-left: #7fb96a; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #4cbca3; --event-time: yellow; --fg-event-time: #000;",
        scripts: "<!--Start of Tawk.to Script--> <script type='text/javascript'> var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement('script'),s0=document.getElementsByTagName('script')[0]; s1.async=true; s1.src='https://embed.tawk.to/5efb694c9e5f69442291993e/default'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })(); </script> <!--End of Tawk.to Script-->"
    });
});

gulp.task('topbets.website', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "topbets.website",
        banca: "TOP BETS",
        styles: "",
    });
});

gulp.task('superbet365.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "superbet365.bet",
        banca: "SUPER BET 365",
        styles: "",
    });
});

gulp.task('moralbets.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "moralbets.com",
        banca: "MORAL BETS",
        styles: "--header: #a9a9a9; --foreground-header: #000; --sidebar-right: #a9a9a9; --foreground-sidebar-right: #000; --sidebar-left: #a9a9a9; --foreground-sidebar-left: #000;--highlight:#68eb5a;--foreground-highlight: #000;--odds:#000;",
        scripts: "<!-- Global site tag (gtag.js) - Google Analytics --><script async src='https://www.googletagmanager.com/gtag/js?id=G-4D549X8JK5'></script><script>  window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}  gtag('js', new Date());  gtag('config', 'G-4D549X8JK5');</script>",
        pixel: "<!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1966014593746054');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1966014593746054&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '814670293101190'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=814670293101190&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '431191212500414'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=431191212500414&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '667022238352468'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=667022238352468&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '498204865168023'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=498204865168023&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1135773527120449');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1135773527120449&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->  <!-- Meta Pixel Code --> <script>   !function(f,b,e,v,n,t,s)   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?   n.callMethod.apply(n,arguments):n.queue.push(arguments)};   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';   n.queue=[];t=b.createElement(e);t.async=!0;   t.src=v;s=b.getElementsByTagName(e)[0];   s.parentNode.insertBefore(t,s)}(window, document,'script',   'https://connect.facebook.net/en_US/fbevents.js');   fbq('init', '1589508724795812');   fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none'   src='https://www.facebook.com/tr?id=1589508724795812&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->"
    });
});

gulp.task('globoesporte.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "globoesporte.bet",
        banca: "GLOBO ESPORTE",
        styles: "--header: #505050; --foreground-header: #fff; --sidebar-right:#505050; --foreground-sidebar-right: #fff; --sidebar-left: #505050; --foreground-sidebar-left: #fff; --odds: #e32636;",
    });
});

gulp.task('chutebets.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "chutebets.com.br",
        banca: "CHUTE BETS",
        styles: "",
    });
});

gulp.task('ingamesport.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "ingamesport.com",
        banca: "INGAME SPORT",
        styles: ""
    });
});

gulp.task('ingamedasorte.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "ingamedasorte.com",
        banca: "INGAME BET",
        styles: ""
    });
});

gulp.task('garanhunsbet.site', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "garanhunsbet.site",
        banca: "GARANHUNS BET",
        styles: "--header: #000; --foreground-header: #fff; --sidebar-right:#000; --foreground-sidebar-right: #fff; --sidebar-left: #000; --foreground-sidebar-left: #fff; --foreground-highlight: #fff; --odds: #00008B;",
    });
});

gulp.task('cearabetsplacardarodada.site', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "cearabetsplacardarodada.site",
        banca: "CEARÁ BETS",
        styles: "",
    });
});

gulp.task('rrbets.site', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "rrbets.site",
        banca: "RR BETS",
        styles: "",
    });
});

gulp.task('maranhaobets.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "maranhaobets.net",
        banca: "MARANHÃO BETS",
        styles: "",
    });
});

gulp.task('ligabet.click', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "ligabet.click",
        banca: "LIGA BET",
        styles: "",
    });
});

gulp.task('ilhabet.net', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "ilhabet.net",
        banca: "ILHA BET",
        styles: "",
    });
});

gulp.task('starbets.online', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "starbets.online",
        banca: "STAR BETS",
        styles: "",
    });
});

gulp.task('dfsgoo.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "dfsgoo.com",
        banca: "DF SPORTS BET",
        styles: "",
    });
});

gulp.task('betfacil123.app', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "betfacil123.app",
        banca: "BET FÁCIL 123",
        styles: "",
        pixel: "<meta name='facebook-domain-verification' content='91h9n5i6r0qfg3w8tupmcobu4p3k9x' /> <!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '4910465152363836'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=4910465152363836&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google tag (gtag.js) --><script async src='https://www.googletagmanager.com/gtag/js?id=G-ZZJQ4F1X8X'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-ZZJQ4F1X8X');</script>"
    });
});

gulp.task('goldeplaca.net.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "goldeplaca.net.br",
        banca: "GOL DE PLACA",
        styles: "",
    });
});

gulp.task('xbetsports.net', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "xbetsports.net",
        banca: "XBETSPORTS",
        styles: "",
    });
});

gulp.task('betsnordeste.site', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betsnordeste.site",
        banca: "BETS NORDESTE",
        styles: "",
    });
});

gulp.task('monteirosports.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "monteirosports.com",
        banca: "ESPORTE BET",
        styles: "",
    });
});

gulp.task('i2bets.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "i2bets.com",
        banca: "I2 BETS",
        styles: "",
    });
});

gulp.task('lancesports.site', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "lancesports.site",
        banca: "LANCE SPORTS",
        styles: "",
    });
});

gulp.task('betimperativoo.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "betimperativoo.com.br",
        shared_url: "betimperativo.com.br",
        banca: "Bet Imperativo",
        styles: "",
    });
});

gulp.task('rondobet.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "rondobet.com",
        banca: "RONDO BET",
        styles: "",
    });
});

gulp.task('bets60.wee.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "bets60.wee.bet",
        banca: "BETS 60",
        styles: "",
    });
});

gulp.task('finasport.wee.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "finasport.wee.bet",
        banca: "FINA SPORT",
        styles: "",
    });
});

gulp.task('aposta99.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "aposta99.com.br",
        banca: "APOSTA 99",
        styles: "",
    });
});

gulp.task('topbetgames.net', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "topbetgames.net",
        banca: "TOP BET GAMES",
        styles: "",
    });
});

gulp.task('sm7.site', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "sm7.site",
        banca: "SM7",
        styles: "",
    });
});

gulp.task('futpix.online', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "futpix.online",
        shared_url: "futpix.com.br",
        banca: "FUTPIX",
        styles: "",
    });
});

gulp.task('betminas.club', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "betminas.club",
        banca: "BET MINAS",
        styles: "",
    });
});

gulp.task('bet83.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "bet83.com.br",
        banca: "BET83",
        styles: "",
    });
});

gulp.task('betnordeste.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betnordeste.net",
        banca: "BET NORDESTE SPORTS",
        styles: "",
    });
});

gulp.task('betnordeste.net.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betnordeste.net.br",
        banca: "BET NORDESTE SPORTS",
        styles: "",
    });
});

gulp.task('iconebet.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "iconebet.com",
        banca: "ÍconeBet",
        styles: "",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '6441889142559689');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=6441889142559689&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        scripts: "<!-- Google tag (gtag.js) --><script async src='https://www.googletagmanager.com/gtag/js?id=G-HKVTNNSPJ4'></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-HKVTNNSPJ4');</script>"
    });
});

gulp.task('sportingol.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "sportingol.bet",
        banca: "SPORTINGOL",
        styles: "",
    });
});

gulp.task('eshowdebola.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "eshowdebola.bet",
        banca: "É SHOW DE BOLA",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-M7BC6K77');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-M7BC6K77'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"
    });
});

gulp.task('betsmania.live', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betsmania.live",
        banca: "BETS MANIA",
        styles: "",
    });
});

gulp.task('ricardo.wee.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "ricardo.wee.bet",
        banca: "RICARDO",
        styles: "",
    });
});

gulp.task('nautsports.club', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "nautsports.club",
        banca: "NAUTSPORTS",
        styles: "",
    });
});

gulp.task('easybets.club', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "easybets.club",
        banca: "EASY BETS",
        styles: "",
    });
});

gulp.task('expressinhofc.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "expressinhofc.com.br",
        banca: "RITS BET",
        styles: "",
    });
});

gulp.task('santissports.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "santissports.com",
        banca: "SANTIS SPORTS",
        styles: "",
    });
});

gulp.task('bomba.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "bomba.bet",
        banca: "BOMBA.BET",
        styles: "",
    });
});

gulp.task('pointbet.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "pointbet.bet",
        banca: "POINTBET",
        styles: "",
    });
});

gulp.task('megasporte.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "megasporte.com",
        banca: "MEGASPORTE",
        styles: "",
    });
});

gulp.task('primoos.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "primoos.bet",
        banca: "PRIMOOS.BET",
        pixel: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '3466718803573085');fbq('track', 'PageView');</script><noscript><img height='1' width='1' style='display:none'src='https://www.facebook.com/tr?id=3466718803573085&ev=PageView&noscript=1'/></noscript><!-- End Meta Pixel Code -->",
        styles: "",
    });
});

gulp.task('realgol.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "realgol.net",
        banca: "REAL SPORT",
        styles: "",
    });
});

// old pimplay.com
gulp.task('pinplay.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "pinplay.bet",
        banca: "PINPLAY",
        styles: "",
    });
});

gulp.task('pinplay.net', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "pinplay.net",
        banca: "PINPLAY",
        styles: "",
    });
});

gulp.task('3tbet.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "3tbet.com.br",
        banca: "3T BET",
        styles: "",
    });
});

gulp.task('megasports.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "megasports.bet",
        banca: "MEGA SPORTS",
        styles: "",
    });
});

gulp.task('81br.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "81br.net",
        banca: "81 BET PIX",
        styles: "",
    });
});

gulp.task('novabet.site', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "novabet.site",
        banca: "NOVA BET",
        styles: "",
        pixel: "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '991527785504009'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=991527785504009&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->" +
            "<!-- Meta Pixel Code --> <script> !function(f,b,e,v,n,t,s) {if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; n.queue=[];t=b.createElement(e);t.async=!0; t.src=v;s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)}(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '6185972464845414'); fbq('track', 'PageView'); </script> <noscript><img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=6185972464845414&ev=PageView&noscript=1' /></noscript> <!-- End Meta Pixel Code -->",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KF8VM7ZD');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KF8VM7ZD'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('esportenetreipele.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "esportenetreipele.com",
        banca: "ESPORTE NET REI PELÉ",
        styles: "",
    });
});

gulp.task('powerbets.vip', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "powerbets.vip",
        banca: "POWER BETS",
        styles: "",
    });
});

gulp.task('ragnar.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "ragnar.bet",
        banca: "RAGNAR.BET",
        styles: "",
        // xtremepush_sdk: "IiG7anngT2KQjqlbEve0zEVJlmSWIBHi"
    });
});

gulp.task('fizabet.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "fizabet.com",
        banca: "FIZ A BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N2RZCF5S');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-N2RZCF5S'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
        description: "Explore a emoção das apostas esportivas e divirta-se com os melhores jogos de aposta online na FIZABET - Cadastre-se agora e faça sua jogada! E você, já fez a sua bet hoje? #AposteComFIZABET",
    });
});

gulp.task('treinamento.wee.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "treinamento.wee.bet",
        banca: "Treinamento Weebet",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N5PB557T');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-N5PB557T'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->"

    });
});

gulp.task('faithbets.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "faithbets.bet",
        banca: "FAITH BETS",
        styles: "",
    });
});

gulp.task('favelabett.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "favelabett.com",
        banca: "FAVELA BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5DZV99XN');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5DZV99XN'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('kwbet.net', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "kwbet.net",
        banca: "KW BET",
        styles: "",
        pixel: "",
        scripts: "<script type='text/javascript' src='//tags.fulllab.com.br/scripts/produto_kwbet.js' async></script>",
    });
});

gulp.task('apostenasorte.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "apostenasorte.bet",
        banca: "APOSTE NA SORTE",
        styles: "",
        dominioTemp: "apostenasorte.net"
    });
});

gulp.task('ultrabetss.com', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "ultrabetss.com",
        banca: "ULTRA BETSS",
        styles: "",
    });
});

gulp.task('ultrabetss.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "ultrabetss.bet",
        banca: "ULTRA BETSS",
        styles: "",
    });
});

gulp.task('betbras.com', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "betbras.com",
        banca: "BET BRAS",
        styles: "",
    });
});

gulp.task('capitalbets.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "capitalbets.bet",
        banca: "CAPITAL BETS",
        styles: "",
    });
});

gulp.task('betinvestidor.com', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "betinvestidor.com",
        banca: "BET INVESTIDOR",
        styles: "",
    });
});

gulp.task('betsnordeste.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "betsnordeste.bet",
        banca: "BETS NORDESTE",
        styles: "",
    });
});

gulp.task('rc.wee.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "rc.wee.bet",
        banca: "Weebet RC",
        styles: "",
    });
});

gulp.task('amazonsport.io', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
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
        server: "front5.weebet.tech",
        host: "federalsports.bet",
        banca: "FEDERAL SPORTS",
        styles: "",
    });
});

gulp.task('lottomaster.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "lottomaster.bet",
        banca: "LOTTO MASTER",
        styles: "",
    });
});

gulp.task('moneybets.net', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "moneybets.net",
        banca: "MONEY BETS",
        styles: "",
    });
});

gulp.task('bnrbet.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "bnrbet.com",
        banca: "BNR BET",
        styles: "",
    });
});

gulp.task('faturabet.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "faturabet.com",
        banca: "FATURA BET",
        styles: "",
        google_tag_part_1: "<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WDHLXMF6');</script><!-- End Google Tag Manager -->",
        google_tag_part_2: "<!-- Google Tag Manager (noscript) --><noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-WDHLXMF6'height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript><!-- End Google Tag Manager (noscript) -->",
    });
});

gulp.task('supertop3.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "supertop3.bet",
        banca: "SUPERTOP3.BET",
        styles: "",
    });
});

gulp.task('bullbets.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "bullbets.com.br",
        banca: "BULL BETS",
        styles: "",
    });
});

gulp.task('bosscassino.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "bosscassino.bet",
        banca: "BOSS CASSINO",
        styles: "",
    });
});

gulp.task('mdsports.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "mdsports.bet",
        banca: "MD SPORTS",
        styles: "",
    });
});

gulp.task('sortepix.tv', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "sortepix.tv",
        banca: "SORTE PIX",
        styles: "",
    });
});

gulp.task('superesportiva.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "superesportiva.com",
        banca: "SUPER ESPORTIVA",
        styles: "",
    });
});

gulp.task('betstar.vip', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betstar.vip",
        banca: "BETSTAR",
        styles: "",
    });
});

gulp.task('multisports.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "multisports.bet",
        banca: "MULTISPORTS",
        styles: ""
    });
});

gulp.task('brinksbet.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "brinksbet.com",
        banca: "RONDO CASSINO",
        styles: ""
    });
});

gulp.task('betbastet.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betbastet.com",
        banca: "BET BASTET",
        styles: ""
    });
});

gulp.task('asortebets.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "asortebets.com",
        banca: "A SORTE BETS",
        styles: ""
    });
});

gulp.task('proesporte.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "proesporte.net",
        banca: "PRO ESPORTE",
        styles: ""
    });
});

gulp.task('unibets.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "unibets.com.br",
        banca: "UNI BETS",
        styles: ""
    });
});

gulp.task('newbets.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "newbets.com.br",
        banca: "NEW BETS",
        styles: ""
    });
});

gulp.task('jrsports.io', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "jrsports.io",
        banca: "JR SPORTS",
        styles: ""
    });
});

gulp.task('miamipix.net', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "miamipix.net",
        banca: "MIAMI PIX",
        styles: ""
    });
});

gulp.task('pixplay.io', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "pixplay.io",
        banca: "PIX PLAY",
        styles: ""
    });
});

gulp.task('sortegol.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "sortegol.bet",
        banca: "SORTE GOL",
        styles: ""
    });
});

gulp.task('betcombinada.net', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "betcombinada.net",
        banca: "BET COMBINADA",
        styles: ""
    });
});

gulp.task('gramadobet.net.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "gramadobet.net.br",
        banca: "GRAMADO BET",
        styles: ""
    });
});

// Old goalbet.com.br
gulp.task('goalb.net', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "goalb.net",
        banca: "GOAL BET",
        styles: ""
    });
});

gulp.task('sortegol.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "sortegol.com",
        banca: "SORTE GOL",
        styles: ""
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

gulp.task('goldeplaca.online', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "goldeplaca.online",
        banca: "GOL DE PLACA",
        styles: "",
    });
});

gulp.task('betagora.io', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "betagora.io",
        banca: "BET AGORA",
        styles: "",
        scripts: "<script>function initEmbeddedMessaging(){try{embeddedservice_bootstrap.settings.language='pt_BR',embeddedservice_bootstrap.init('00DKd0000052tg8','CA_ChatBotBetAgora','https://lemagroup.my.site.com/ESWCAChatBotBetAgora1730925033106',{scrt2URL:'https://lemagroup.my.salesforce-scrt.com'})}catch(e){console.error('Error loading Embedded Messaging: ',e)}}</script><script onload=initEmbeddedMessaging() src=https://lemagroup.my.site.com/ESWCAChatBotBetAgora1730925033106/assets/js/bootstrap.min.js></script>",
        xtremepush_sdk: "E5ilOYbc5X95iSCWM5gf_0K-_turnLxj"
    });
});

gulp.task('megapix.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "megapix.bet",
        banca: "Apostas Esportivas | Cassino | Bônus de 100% | MEGAPIX.bet",
        styles: "",
    });
});

gulp.task('pinbet.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "pinbet.bet",
        banca: "PINBET",
        styles: "",
        xtremepush_sdk: "l5zlJi7majbIVZTxwtIgEYppdmK4KazO"
    });
});

gulp.task('emirates365.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "emirates365.bet",
        banca: "EMIRATES 365",
        styles: "",
    });
});

gulp.task('topbets.site', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "topbets.site",
        banca: "TOP BETS",
        styles: "",
    });
});

gulp.task('amabet.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "amabet.bet",
        banca: "AMA BET",
        styles: "",
        xtremepush_sdk: "IjvG8zgsO8FKX_Sck5DfQHbGKybQvTDS",
        dominioTemp: "amabet.store"
    });
});

gulp.task('jjsports.vip', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "jjsports.vip",
        banca: "JJ SPORTS",
        styles: "",
    });
});

gulp.task('fortunaplay.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "fortunaplay.bet",
        banca: "FortunaPlay",
        styles: "",
        xtremepush_sdk: "2ZwnVnh2kNB62WUkOAM2PSEMvRWf8Zhp",
        dominioTemp: "fortunaplay.club"
    });
});

gulp.task('apostoubrasil.vip', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "apostoubrasil.vip",
        banca: "APOSTOU BRASIL",
        styles: "",
    });
});

gulp.task('lidersports.vip', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "lidersports.vip",
        banca: "LÍDER SPORTS",
        styles: ""
    });
});

gulp.task('newbet.one', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "newbet.one",
        banca: "NEW BET",
        styles: ""
    });
});

gulp.task('sts13.vip', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "sts13.vip",
        banca: "STS 13",
        styles: ""
    });
});

gulp.task('maxbetbrasil.net', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "maxbetbrasil.net",
        banca: "MAX BET BRASIL",
        styles: ""
    });
});

gulp.task('apostefacil.bet', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "apostefacil.bet",
        banca: "APOSTE FÁCIL",
        styles: "",
        xtremepush_sdk: "PIa6MusAsTj45EIQIPK8FealyxT2fbYS",
        scripts: "<!-- NotificaMe Chat --><script>window.chatCompany = '5781121c-cf76-11ef-961a-0efa6ad28f4f'; window.chatChannel = 'b875c688-536d-4615-895f-925c84841343'; window.chatNotificationSound = '3'; window.chatHeaderColor = '#ffa517'; window.chatHeaderIcon = 'https://weebet.s3.amazonaws.com/apostefacil.bet/logos/logo_banca.png'; window.chatTitle = 'Aposte Fácil'; window.chatFooterText = 'Aposte Fácil'; window.chatOfferHelp = '0'; window.chatHelpMessage = ''; window.chatAutoMaximize = '0'; window.chatNotificaConectar = '0'; window.chatNotificaDesconectar = '0'; window.chatNotificaEncerrar = '0';</script> <script src='https://hub.notificame.com.br/schedule/webchat.js'></script>"
    });
});

gulp.task('viabet.com.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "viabet.com.br",
        banca: "VIA BET",
        styles: "",
        xtremepush_sdk: "l7zEE_Rg3aNOlDmX92zgIeynDPLPsCKy"
    });
});

gulp.task('majovip.net', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "majovip.net",
        banca: "MAJO VIP",
        styles: "",
    });
});

gulp.task('playnabet.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "playnabet.com",
        banca: "PLAY NA BET",
        styles: "",
    });
});

gulp.task('poc.wee.bet', function (done) {
    tasks(done, {
        server: "54.147.182.240",
        host: "poc.wee.bet",
        banca: "POC LOTEP",
        styles: "",
    });
});

gulp.task('bet10.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "bet10.bet",
        banca: "BET10",
        styles: "",
    });
});

gulp.task('pintou.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "pintou.bet",
        banca: "PINTOU.BET",
        styles: "",
        dominioTemp: "pintoubet.com"
    });
});

gulp.task('boaaposta.net', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "boaaposta.net",
        banca: "Boa aposta: A sua melhor escolha | Apostas esportivas e Jogos ao vivo ",
        styles: "",
        description: "Descubra o site de apostas ideal para quem busca diversão e grandes oportunidades! Apostas esportivas, cassino online, bônus exclusivos e muito mais. Jogue com segurança e emoção. Cadastre-se agora!"
    });
});

gulp.task('copasbet.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "copasbet.bet",
        banca: "COPAS BET",
        styles: "",
    });
});

gulp.task('boasorte.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "boasorte.bet",
        banca: "BOA SORTE",
        styles: "",
    });
});

gulp.task('eliteesportes.vip', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "eliteesportes.vip",
        banca: "ELITE ESPORTES",
        styles: "",
    });
});

gulp.task('joguefacil.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "joguefacil.bet",
        banca: "JOGUE FÁCIL",
        styles: ""
    });
});

gulp.task('sportvip.bet', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "sportvip.bet",
        banca: "SportVip",
        styles: ""
    });
});

gulp.task('condutaesp.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "condutaesp.com",
        banca: "CONDUTA ESPORTIVA",
        styles: ""
    });
});

gulp.task('betfortuna.com.br', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "betfortuna.com.br",
        banca: "BET FORTUNA",
        styles: "",
        xtremepush_sdk: "N3siSnW649_uVpLFi26444jgM5AKKNuJ"
    });
});

gulp.task('sidjaisoekroe.io', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "sidjaisoekroe.io",
        banca: "ZÉ DO CASH",
        styles: "",
        scripts: "<script src='https://s3.crmseven.online/scripts/start.js'></script>"
    });
});

gulp.task('timedasorte.com', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "timedasorte.com",
        banca: "TIME DA SORTE",
        styles: ""
    });
});

gulp.task('bet1000.net.br', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "bet1000.net.br",
        banca: "BET 1000",
        styles: ""
    });
});

gulp.task('26sports.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "26sports.bet",
        banca: "26SPORTS",
        styles: ""
    });
});

gulp.task('vitoriasports.vip', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "vitoriasports.vip",
        banca: "VITÓRIA SPORTS",
        styles: ""
    });
});

gulp.task('dentrodaaposta.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "dentrodaaposta.com",
        banca: "DENTRO DA APOSTA",
        styles: ""
    });
});

gulp.task('deubet.io', function (done) {
    tasks(done, {
        server: "front3.weebet.tech",
        host: "deubet.io",
        banca: "DEU BET",
        styles: ""
    });
});

gulp.task('betcapital.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "betcapital.com",
        banca: "BET CAPITAL",
        styles: ""
    });
});

gulp.task('sporte.vip', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "sporte.vip",
        banca: "SPORTE VIP",
        styles: ""
    });
});

gulp.task('vaibet360.com', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "vaibet360.com",
        banca: "VAI BET 360",
        styles: ""
    });
});

gulp.task('sortebet777.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "sortebet777.com",
        banca: "SORTE BET 777",
        styles: ""
    });
});

gulp.task('apostacerta.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "apostacerta.bet",
        banca: "APOSTA CERTA",
        styles: ""
    });
});

gulp.task('brasavipcassino.net', function (done) {
    tasks(done, {
        server: "front5.weebet.tech",
        host: "brasavipcassino.net",
        banca: "BRASA VIP CASSINO",
        styles: ""
    });
});

gulp.task('betsplay.club', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "betsplay.club",
        banca: "BETSPLAY",
        styles: ""
    });
});

gulp.task('avante.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "avante.bet",
        banca: "AVANTE.BET",
        styles: ""
    });
});

gulp.task('decolabet.com', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "decolabet.com",
        banca: "DECOLA BET",
        styles: ""
    });
});

gulp.task('betvem.io', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "betvem.io",
        banca: "BET VEM",
        styles: ""
    });
});

gulp.task('apostecerto.io', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "apostecerto.io",
        banca: "APOSTE CERTO",
        styles: "",
        dominioTemp: "apostecerto.site"
    });
});

gulp.task('brasavip.bet', function (done) {
    tasks(done, {
        server: "front2.weebet.tech",
        host: "brasavip.bet",
        banca: "BRASA VIP",
        styles: "",
    });
});

gulp.task('fadadopirao.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "fadadopirao.bet",
        banca: "FADA DO PIRÃO",
        styles: "",
    });
});

gulp.task('apuesterapido.com', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "apuesterapido.com",
        banca: "APUESTE RAPIDO",
        styles: "",
    });
});

gulp.task('wingobet.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "wingobet.bet",
        banca: "WinGoBet",
        styles: "",
    });
});

gulp.task('esporte.fit', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "esporte.fit",
        banca: "ESPORTE FIT",
        styles: "",
    });
});


gulp.task('reidasorte.bet', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "reidasorte.bet",
        banca: "REI DA SORTE",
        styles: "",
    });
});

gulp.task('naipesoft.app', function (done) {
    tasks(done, {
        server: "front1.weebet.tech",
        host: "naipesoft.app",
        banca: "NAIPE SOFT",
        styles: "",
    });
});

gulp.task('maraplay.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "maraplay.bet",
        banca: "MARAPLAY",
        styles: "",
    });
});

gulp.task('hotbetz.bet', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "hotbetz.bet",
        banca: "HOT BETZ",
        styles: "",
    });
});

gulp.task('betpix77.io', function (done) {
    tasks(done, {
        server: "front4.weebet.tech",
        host: "betpix77.io",
        banca: "BETPIX77",
        styles: "",
    });
});