import { useConfigClient } from '@/stores';
import { calculateLotteryWinnings, calculateNetLotteryWinnings, getOddAcronym, getOddValue, formatCurrency, formatDateTimeBR, getNameModalityLottery, now, removerAcentos, wbPostMessage } from '@/utilities';

import EscPosEncoder from 'esc-pos-encoder';
import { axiosInstance } from './axiosInstance';
import { getOddsToPrint } from '../utilities/general.utility';

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
                .newline();

            if(bet.apostador) {
                ticketEscPos
                    .bold(true)
                    .text('APOSTADOR:')
                    .bold(false)
                    .text(removerAcentos(bet.apostador));
            }

            if(bet.bettor_document_number) {
                ticketEscPos
                    .bold(true)
                    .text('CPF DO APOSTADOR:')
                    .bold(false)
                    .text(bet.bettor_document_number);
            }
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
            .text('' + bet.itens.length)
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

export const printRechargeReceipt = async (recharge: any) => {
    const { options } = useConfigClient();

    const {
        apkVersion,
        printGraphics,
        printLogo,
        separator
    } = await getPrinterSettings();
    const encoder = new EscPosEncoder();
    const rechargeEscPos = encoder.initialize();

    if (printGraphics) {
        if (apkVersion < 3) {
            rechargeEscPos.image(printLogo, 376, 136, 'atkinson');
        }
    } else {
        rechargeEscPos
            .align('center')
            .raw([0x1d, 0x21, 0x10])
            .line(options.banca_nome)
            .raw([0x1d, 0x21, 0x00]);
    }

    rechargeEscPos
        .newline()
        .bold(true)
        .align('left')
        .size('normal')
        .line(separator)
        .bold(true)
        .text('Cartao: ')
        .bold(false)
        .text(recharge.cartao_aposta)
        .newline()
        .bold(true)
        .text('Cambista: ')
        .bold(false)
        .text(removerAcentos(recharge.passador))
        .newline()
        .bold(true)
        .text('Valor: ')
        .bold(false)
        .text(`R$ ${formatCurrency(recharge.valor)}`)
        .newline()
        .bold(true)
        .text('Data/Hora: ')
        .bold(false)
        .text(formatDateTimeBR(recharge.data))
        .newline()
        .align('center')
        .size('small')
        .bold(true)
        .text(recharge.autenticacao)
        .newline()
        .newline()
        .newline()
        .newline()
        .newline()
        .newline();

    const data = Array.from(rechargeEscPos.encode());
    wbPostMessage('printCard', data)
}

export const printDetailedCard = async (card: any) => {
    const { options } = useConfigClient();

    const {
        apkVersion,
        printGraphics,
        printLogo,
        separator
    } = await getPrinterSettings();
    const encoder = new EscPosEncoder();
    const cardEscPos = encoder.initialize();

    if (printGraphics) {
        if (apkVersion < 3) {
            cardEscPos.image(printLogo, 376, 136, 'atkinson');
        }
    } else {
        cardEscPos
            .align('center')
            .raw([0x1d, 0x21, 0x10])
            .line(options.banca_nome)
            .raw([0x1d, 0x21, 0x00]);
    }

    cardEscPos
        .newline()
        .bold(true)
        .align('left')
        .size('normal')
        .line(separator)
        .bold(true)
        .text('Cartao: ')
        .bold(false)
        .text(card.chave)
        .newline()
        .bold(true)
        .text('Apostador: ')
        .bold(false)
        .text(removerAcentos(card.apostador))
        .newline()
        .newline()
        .bold(true)
        .text('Cambista: ')
        .bold(false)
        .text(removerAcentos(card.passador.nome))
        .newline()
        .bold(true)
        .text('Saldo atual: ')
        .bold(false)
        .text(`R$ ${formatCurrency(card.saldo)}`)
        .newline()
        .bold(true)
        .text('Data/Hora: ')
        .bold(false)
        .text(formatDateTimeBR(card.data_registro))
        .newline()
        .newline()
        .newline()
        .newline()
        .newline()
        .newline();

    const data = Array.from(cardEscPos.encode());
    wbPostMessage('printCard', data)
}

export const printTable = async (camps: any) => {
    const { options } = useConfigClient();
    const {
        apkVersion,
        printGraphics,
        printLogo,
        separator
    } = await getPrinterSettings();
    const encoder = new EscPosEncoder();
    const tableEscPos = encoder.initialize();
    const odds = await getOddsToPrint();
    const cols = 5;
    const lines = Math.ceil((await odds).length / cols);
    if (printGraphics) {
        if (apkVersion < 3) {
            tableEscPos.image(printLogo, 376, 136, 'atkinson');
        }
    } else {
        tableEscPos
            .align('center')
            .raw([0x1d, 0x21, 0x10])
            .line(options.banca_nome)
            .raw([0x1d, 0x21, 0x00]);
    }
    tableEscPos
        .newline()
        .bold(true)
        .align('left')
        .size('normal')
        .line(separator)
        .bold(true)
        .text(formatDateTimeBR(now()))
        .newline()
    camps.forEach((camp: any) => {
        tableEscPos
            .newline()
            .bold(true)
            .text(removerAcentos(camp.nome))
        camp.jogos.forEach((game: any) => {
            const horarioObj = new Date(game.horario);
            const horario = horarioObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            tableEscPos
                .newline()
                .bold(false)
                .text(horario + ' ' + removerAcentos(game.nome));
            for (let i = 0; i < lines; i++) {
                let start = i * cols;
                const oddPos1 = odds[start];
                const oddPos2 = odds[++start];
                const oddPos3 = odds[++start];
                const oddPos4 = odds[++start];
                const oddPos5 = odds[++start];
                tableEscPos
                    .newline()
                    .bold(true)
                    .text(removerAcentos(`${getOddAcronym(oddPos1)} ${getOddAcronym(oddPos2)} ${getOddAcronym(oddPos3)} ${getOddAcronym(oddPos4)} ${getOddAcronym(oddPos5)}`))
                    .newline()
                    .bold(false)
                    .text(`${getOddValue(oddPos1, game.cotacoes)} ${getOddValue(oddPos2, game.cotacoes)} ${getOddValue(oddPos3, game.cotacoes)} ${getOddValue(oddPos4, game.cotacoes)} ${getOddValue(oddPos5, game.cotacoes)}`)
                    .newline();
            }
        });
        tableEscPos.newline();
    })
    const data = Array.from(tableEscPos.encode());
    wbPostMessage('printTable', data)
}

export const printLottery = async (bet: any) => {
    const { options } = useConfigClient();
    const separatorLine = '================================'
    const {
        apkVersion,
        printGraphics,
        printLogo,
        separator
    } = await getPrinterSettings();
    const encoder = new EscPosEncoder();
    const lotteryEscPos = encoder.initialize();
    if (printGraphics) {
        if (apkVersion < 3) {
            lotteryEscPos.image(printLogo, 376, 136, 'atkinson');
        }
    } else {
        lotteryEscPos
            .align('center')
            .raw([0x1d, 0x21, 0x10])
            .line(options.banca_nome)
            .raw([0x1d, 0x21, 0x00]);
    }
    lotteryEscPos
        .newline()
        .bold(true)
        .align('center')
        .raw([0x1d, 0x21, 0x10])
        .line(bet.codigo)
        .raw([0x1d, 0x21, 0x00])
        .align('left')
        .size('normal')
        .line(separatorLine)
        .bold(true)
        .text('Data: ')
        .bold(false)
        .text((formatDateTimeBR(bet.horario)));
    if (bet.is_cliente) {
        lotteryEscPos
            .newline()
            .bold(true)
            .text('CLIENTE: ')
            .bold(false)
            .text(removerAcentos(bet.passador.nome))
            .newline();
    } else {
        lotteryEscPos
            .newline()
            .bold(true)
            .text('CAMBISTA: ')
            .bold(false)
            .text(removerAcentos(bet.passador.nome))
            .newline()
            .bold(true)
            .text('APOSTADOR: ')
            .bold(false)
            .text(removerAcentos(bet.apostador))
            .newline();
    }
    lotteryEscPos
        .bold(true)
        .text('MODALIDADE: ')
        .bold(false)
        .text(getNameModalityLottery(bet.modalidade))
        .newline()
        .bold(true)
        .text('VALOR TOTAL: ')
        .bold(false)
        .text(formatCurrency(bet.valor))
        .newline();
    bet.itens.forEach((item: any) => {
        lotteryEscPos
            .newline()
            .line(separatorLine)
            .align('center')
            .bold(true)
            .line(removerAcentos(item.sorteio_nome))
            .align('left')
            .line('DEZENAS: ')
            .bold(false)
            .line(item.numeros.join('-'))
            .bold(true)
            .newline()
            .text('VALOR: ')
            .bold(false)
            .text(formatCurrency(item.valor));
        
        if (item.tipo === 'seninha' && item.cotacao6 > 0) {
            lotteryEscPos
                .newline()
                .bold(true)
                .text('RETORNO 6: ')
                .bold(false)
                .text('' + formatCurrency(calculateLotteryWinnings(item.valor, item.cotacao6)));
            if (!bet.is_cliente && bet.passador.percentualPremio > 0) {
                lotteryEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO LIQUIDO 6: ')
                    .bold(false)
                    .text('' + formatCurrency(calculateNetLotteryWinnings(item.valor, item.cotacao6, bet.passador.percentualPremio)));
            }
        }
        if (item.cotacao5 > 0) {
            lotteryEscPos
                .newline()
                .bold(true)
                .text('RETORNO 5: ')
                .bold(false)
                .text('' + formatCurrency(calculateLotteryWinnings(item.valor, item.cotacao5)));
            if (!bet.is_cliente && bet.passador.percentualPremio > 0) {
                lotteryEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO LIQUIDO 5: ')
                    .bold(false)
                    .text('' + formatCurrency(calculateNetLotteryWinnings(item.valor, item.cotacao5, bet.passador.percentualPremio)));
            }
        }
        
        if (item.cotacao4 > 0) {
            lotteryEscPos
                .newline()
                .bold(true)
                .text('RETORNO 4: ')
                .bold(false)
                .text('' + formatCurrency(calculateLotteryWinnings(item.valor, item.cotacao4)));
            if (!bet.is_cliente && bet.passador.percentualPremio > 0) {
                lotteryEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO LIQUIDO 4: ')
                    .bold(false)
                    .text('' + formatCurrency(calculateNetLotteryWinnings(item.valor, item.cotacao4, bet.passador.percentualPremio)));
            }
        }
        if (item.cotacao3 > 0) {
            lotteryEscPos
                .newline()
                .bold(true)
                .text('RETORNO 3: ')
                .bold(false)
                .text('' + formatCurrency(calculateLotteryWinnings(item.valor, item.cotacao3)));
            if (!bet.is_cliente && bet.passador.percentualPremio > 0) {
                lotteryEscPos
                    .newline()
                    .bold(true)
                    .text('RETORNO LIQUIDO 3: ')
                    .bold(false)
                    .text('' + formatCurrency(calculateNetLotteryWinnings(item.valor, item.cotacao3, bet.passador.percentualPremio)));
            }
        }
    });
    lotteryEscPos
        .newline()
        .newline()
        .newline()
        .newline()
        .newline()
        .newline();
    const data = Array.from(lotteryEscPos.encode());
    wbPostMessage('printLottery', data)
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