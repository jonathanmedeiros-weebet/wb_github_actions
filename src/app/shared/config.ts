
const _host = '//192.168.0.147';
const _center = 'https://center6.wee.bet';
const _live = 'https://streaming.wee.bet';
const _stats = 'https://stats.wee.bet';
const _timestamp = '1629735523803';

export const config: any = {
    BANCA_NOME: 'EmersonBet',
    TIMESTAMP: _timestamp,
    HOST: _host,
    BASE_URL: `${_host}/api`,
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    SLUG: 'bet2.wee.bet',
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: 'https://weebet.s3.amazonaws.com/bet2.wee.bet/logos/logo_banca.png',
    LOGO_IMPRESSAO: 'https://weebet.s3.amazonaws.com/bet2.wee.bet/logos/logo_impressao.png',

    BG: `${_host}/tema/bk.jpg`
};
