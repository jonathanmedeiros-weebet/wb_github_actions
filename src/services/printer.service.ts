import { useConfigClient } from '@/stores';
import { formatCurrency, formatDateTimeBR, now, removerAcentos, wbPostMessage } from '@/utilities';
import EscPosEncoder from 'esc-pos-encoder';
import { axiosInstance } from './axiosInstance';

export const printTicket = async (bet: any) => {
    const { options } = useConfigClient();
    const currentDateTime = now().format('DD/MM/YYYY [as] HH:mm');
    
    try {
        const {
            apkVersion,
            printGraphics,
            printLogo,
            separator
        } = await getPrinterSettings();

        const encoder = new EscPosEncoder();
        const ticketEscPos = encoder
            .initialize();

        if (printGraphics) {
            if (apkVersion < 3) {
                ticketEscPos.image(printLogo, 376, 136, 'atkinson');
            }
        } else {
            ticketEscPos
                .align('center')
                .raw([0x1d, 0x21, 0x10])
                .line(options.banca_nome)
                .raw([0x1d, 0x21, 0x00]);
        }

        ticketEscPos
            .newline()
            .bold(true)
            .align('center')
            .raw([0x1d, 0x21, 0x10])
            .line(bet.codigo)
            .raw([0x1d, 0x21, 0x00])
            .align('left')
            .size('normal')
            .line(separator) // TODO: pegar separator do flutter
            .bold(true);

        if (bet.is_cliente) {
            ticketEscPos
                .text('CLIENTE:')
                .bold(false)
                .text(removerAcentos(bet.passador.nome));
        } else {
            ticketEscPos
                .text('CAMBISTA:')
                .bold(false)
                .text(removerAcentos(bet.passador.nome))
                .newline()
                .bold(true)
                .text('APOSTADOR:')
                .bold(false)
                .text(removerAcentos(bet.apostador));
        }

        ticketEscPos
            .newline()
            .bold(true)
            .text('HORARIO:')
            .bold(false)
            .text(formatDateTimeBR(bet.horario));

        bet.itens.forEach((item: any) => {
            ticketEscPos
                .newline()
                .line(separator)
                .align('center')
                .bold(true)
                .line(removerAcentos(item.campeonato_nome))
                .bold(false)
                .align('left')
                .line(formatDateTimeBR(item.jogo_horario))
                .line(removerAcentos(item.time_a_nome + ' x ' + item.time_b_nome))
                .line(removerAcentos(item.categoria_nome) + ': ' + removerAcentos(item.odd_nome)
                    + '(' + item.cotacao.toFixed(2) + ')');

            if (item.ao_vivo) {
                ticketEscPos
                    .text(' | AO VIVO');
            }
        });

        ticketEscPos
            .newline()
            .align('left')
            .line(separator)
            .bold(true)
            .text('QUANTIDADE DE JOGOS: ')
            .bold(false)
            .text(bet.itens.length)
            .newline()
            .bold(true)
            .text('COTACAO: ')
            .bold(false)
            .text(formatCurrency(bet.possibilidade_ganho / bet.valor))
            .newline()
            .bold(true)
            .text('VALOR APOSTADO: ')
            .bold(false)
            .text(formatCurrency(bet.valor))
            .newline()
            .bold(true)
            .text('POSSIVEL RETORNO: ')
            .bold(false)
            .text(formatCurrency(bet.possibilidade_ganho))
            .newline()
            .bold(true)
            .text('PREMIO: ')
            .bold(false)
            .text(formatCurrency(bet.premio))
            .newline();

        if (bet.passador.percentualPremio > 0) {
            let cambistaPaga = 0;

            if (bet.resultado) {
                cambistaPaga = bet.premio * ((100 - bet.passador.percentualPremio) / 100);
            } else {
                cambistaPaga = bet.possibilidade_ganho * ((100 - bet.passador.percentualPremio) / 100);
            }

            ticketEscPos
                .newline()
                .bold(true)
                .text('CAMBISTA PAGA: ')
                .bold(false)
                .text(formatCurrency(cambistaPaga));
        }

        ticketEscPos
            .newline()
            .align('center')
            .line(removerAcentos(options.informativo_rodape))
            .newline()
            .align('left')
            .size('small')
            .line('impresso em ' + currentDateTime)
            .newline()
            .newline()
            .newline()
            .newline()
            .newline()
            .newline();

        const data = Array.from(ticketEscPos.encode());
        wbPostMessage('printLottery', data)
    } catch (error) {
        alert('error: ' + JSON.stringify(error))
    }
}

const getPrinterSettings = async () => {
    const { printerSetting } = useConfigClient();

    let printGraphics = true;
    let printerWidth = 58;
    let separator = '';

    const apkVersion = Number(printerSetting.apkVersion ?? 2);

    if (Boolean(printerSetting.printGraphics)) {
        printGraphics = true;
    } else {
        printGraphics = (String(printerSetting.printGraphics) === 'true' || String(printerSetting.printGraphics) === '1');
    }

    if (Boolean(printerSetting.printerWidth) && String(printerSetting.printerWidth) === '58') {
        printerWidth = printerSetting.printerWidth;
        separator = '================================';
    } else if (Boolean(printerSetting.printerWidth) && String(printerSetting.printerWidth) === '80') {
        printerWidth = printerSetting.printerWidth;
        separator = '================================================';
    } else {
        printerWidth = 58;
        separator = '================================';
    }

    const printLogo = await prepareLogoToPrint();

    return {
        printGraphics,
        printerWidth,
        separator,
        printLogo,
        apkVersion
    }
}

const prepareLogoToPrint = () => {
    return new Promise(async (resolve) => {
        let logo = new Image();
        logo.crossOrigin = 'anonymous';
        logo.src = await getLogoToPrint();
        logo.onload = () => {
            return this;
        };
        resolve(logo)
    })
}

const getLogoToPrint = async () => {
    const { lokiUrl } = useConfigClient();
    const url = `${lokiUrl}/logo`
    const response: any = await axiosInstance().get(url);
    return response.results;
}
