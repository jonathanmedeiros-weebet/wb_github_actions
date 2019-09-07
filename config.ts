
const _host = '//[HOST]';
const _center = 'https://api-center2.wee.bet';

export const config: any = {
    BANCA_NOME: '[BANCA]',
    HOST: _host,
    BASE_URL: `${_host}/api`,
    CENTER_HOST: _center,
    CENTER_API: `${_center}/v1`,
    SPORTS_URL: `${_host}/api/esportes`,
    LOTTERIES_URL: `${_host}/api/loteria`,
    LOGO: _host.replace('central.', '')+'/assets/images/logo_banca.png',
    BG: `${_host}/tema/bk.jpg`
};
