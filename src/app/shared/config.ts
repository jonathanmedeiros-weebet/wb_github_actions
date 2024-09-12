
const _host = '//central.demo.wee.bet';
const _center = 'https://center7.wee.bet';
const _live = 'https://streaming.wee.bet';
const _stats = 'https://stats.wee.bet';

export const config: any = {
    BANCA_NOME: 'DEMO',
    HOST: _host,
    BASE_URL: `${_host}/api`,
    LOKI_URL: 'https://loki1.weebet.tech',
    SHARED_URL: 'demo.wee.bet',
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    SLUG: 'demo.wee.bet',
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: 'https://weebet.s3.amazonaws.com/demo.wee.bet/logos/logo_banca.png',
    LOGO_IMPRESSAO: 'https://weebet.s3.amazonaws.com/demo.wee.bet/logos/logo_impressao.png',

    BG: `${_host}/tema/bk.jpg`
};

