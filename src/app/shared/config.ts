import {environment} from '../../environments/environment';

const _host = environment.api_url;
// const _host = '//central.demo.wee.bet';
// const _center = '//localhost:3002';
const _center = 'https://hermes.wee.bet';
const _live = 'https://streaming.wee.bet';
// const _live = '//localhost:3003';
const _stats = 'https://stats.wee.bet';
const _timestamp = '1617025700544';

export const config: any = {
    BANCA_NOME: 'Bet Social',
    TIMESTAMP: _timestamp,
    HOST: _host,
    BASE_URL: `${_host}/api`,
    SHARED_URL: '//bet4.wee.bet',
    CENTER_HOST: _center,
    LIVE_HOST: _live,
    STATS_HOST: _stats,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    RIFA_URL: `${_host}/api/rifa`,
    SLUG: environment.SLUG,
    // LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    LOGO: 'assets/images/logo.png',

    BG: `${_host}/tema/bk.jpg`
};
