
// const _host = 'http://demo.wee.bet';
// const _center = 'http://api-center.wee.bet';
const _host = 'http://weebet.local';
const _center = 'http://localhost:3002';

export const config: any = {
    HOST: _host,
    BASE_URL: `${_host}/api`,
    CENTER_HOST: _center,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    LOGO: `${_host}/tema/logo_banca.png`,
    BG: `${_host}/tema/bk.jpg`,
    BANCA_NOME: 'Demo'
};
