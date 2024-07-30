import { useConfigClient } from '@/stores';
import EscPosEncoder from 'esc-pos-encoder';
declare var WeebetMessage: any;

export const print = () =>{
    console.log('print')
    const { options } = useConfigClient();
    const encoder = new EscPosEncoder();

    const ticketEscPos = encoder
        .initialize();

    ticketEscPos
        .align('center')
        .raw([0x1d, 0x21, 0x10])
        .line(options.banca_nome)
        .raw([0x1d, 0x21, 0x00]);

    ticketEscPos
        .newline()
        .bold(true)
        .align('center')
        .raw([0x1d, 0x21, 0x10])
        .line('Teste - 0001')
        .raw([0x1d, 0x21, 0x00])
        .align('left')
        .size('normal')
        .line('===========================')
        .bold(true);

    const dataToSend = { data: Array.from(ticketEscPos.encode()), action: 'printLottery' };
    WeebetMessage.postMessage(JSON.stringify(dataToSend));
}