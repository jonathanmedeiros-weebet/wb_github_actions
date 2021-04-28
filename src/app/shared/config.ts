
const _host = '//central.gobets.wee.bet';
const _center = 'https://center2.wee.bet';
const _live = 'https://streaming.wee.bet';
const _stats = 'https://stats.wee.bet';
const _timestamp = '1619645198133';

export const config: any = {
    BANCA_NOME: 'GO BETS',
    TIMESTAMP: _timestamp,
    HOST: _host,
    BASE_URL: `${_host}/api`,
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: '/assets/images/logo_banca.png?' + _timestamp,
    BG: `${_host}/tema/bk.jpg`
};
