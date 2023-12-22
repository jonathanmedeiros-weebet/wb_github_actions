const _host = '//central.weebet.eme';
// const _host = '//central.demo.wee.bet';
const _center = '//localhost:3002';
// const _center = 'https://hermes.wee.bet';
const _live = 'https://streaming.wee.bet';
// const _live = '//localhost:3003';
const _stats = 'https://stats.wee.bet';
const _timestamp = '1617025700544';

export const config: any = {
    BANCA_NOME: 'DEMO',
    TIMESTAMP: _timestamp,
    HOST: _host,
    BASE_URL: `${_host}/api`,
    LOKI_URL: 'https://loki.wee.bet',
    SHARED_URL: '//weebet.local',
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    SLUG: 'weebet.eme',
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: 'https://weebet.s3.amazonaws.com/weebet.eme/logos/logo_banca.png',

    BG: `${_host}/tema/bk.jpg`
};
