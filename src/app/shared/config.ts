const _host = '//192.168.0.147:8000';
// const _host = '//central.sandbox.wee.bet';
// const _center = '//localhost:3002';
const _center = 'https://hermes.wee.bet';
// const _live = 'https://streaming.wee.bet';
const _live = '//localhost:3003';
const _stats = 'https://stats.wee.bet';
const _timestamp = '1617025700544';

export const config: any = {
    BANCA_NOME: 'DEMO',
    TIMESTAMP: _timestamp,
    HOST: _host,
    BASE_URL: `${_host}/api`,
    SHARED_URL: _host,
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    SLUG: 'demo.wee.bet',
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: 'https://weebet.s3.amazonaws.com/demo.wee.bet/logos/logo_banca.png',

    BG: `${_host}/tema/bk.jpg`
};
