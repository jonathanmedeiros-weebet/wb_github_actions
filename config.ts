
const _host = '//[HOST]';
const _center = 'https://center6.wee.bet';
const _live = 'https://streaming.wee.bet';
const _stats = 'https://stats.wee.bet';
const _timestamp = '[TIMESTAMP]';

export const config: any = {
    BANCA_NOME: '[BANCA]',
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
    LOGO: 'https://weebet.s3.amazonaws.com/' + _host.replace('central.', '') + '/logos/logo_banca.png?v=latest',

    BG: `${_host}/tema/bk.jpg`
};
