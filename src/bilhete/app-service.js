import { SOCCER_ID } from '../app/shared/constants/sports-ids';

async function getParams() {
    var url = window.location.pathname;

    var slug = 'demo.wee.bet';
    var centerUrl = 'central.' + slug;
    var ticketId = url.substring(url.lastIndexOf('/') + 1);

    var urlParams = new URLSearchParams(window.location.search);
    var origin = urlParams.get("origin");

    if (ticketId && centerUrl && slug) {
        var params = {
            slug: slug,
            center: centerUrl,
            ticketId: ticketId,
            origin: origin
        };

        return params;
    } else {
        return false;
    }
}

async function getTicketData({ apiUrl, ticketId }) {
    try {
        const request = await fetch(`//${apiUrl}/api/apostas-por-codigo/${ticketId}`);
        const bet = await request.json();
        if (request.status == 404 || request.status == 500) {
            throw bet.errors;
        }
        return bet;
    } catch (error) {
        return error;
    }
}

async function orderTicketItens(tickeItens = [], ticketType) {
    const orderedItens = tickeItens.sort((a, b) => {
        switch (ticketType) {
            case 'acumuladao':
                return new Date(a.jogo.horario).getTime() - new Date(b.jogo.horario).getTime();
            case 'desafio':
                return new Date(a.desafio_datahora_encerramento).getTime() - new Date(b.desafio_datahora_encerramento).getTime();
            default:
                return new Date(a.jogo_horario).getTime() - new Date(b.jogo_horario).getTime()
        }
    });
    return orderedItens;
}

function getFormatedDate(date) {
    const options = {
        dateStyle: 'short',
        timeStyle: 'short'
    }
    return new Date(date).toLocaleString('pt-BR', options);
}

async function getResults(ids) {
    try {
        paramIds = ids.join(',');
        const request = await fetch(`https://center7.wee.bet/v1/resultados/detalhado?ids=${paramIds}`)
        const results = await request.json();

        if (request.status == 404 || request.status == 500) {
            throw results.errors;
        }
        return results;
    } catch (error) {
        return error;
    }
}

function displayError(message) {
    document.getElementById('error').hidden = false;
    document.getElementById('ticket').style.display = 'none';
    if (message) {
        if (message === 'Failed to Fetch') {
            document.getElementById('error-message').append('Imposível conectar ao servidor');
        } else {
            document.getElementById('error-message').append(message);
        }
    }
    document.getElementById('loader').hidden = true;
}

async function getLiveItems(items) {
    try {
        const request = await fetch(`https://center7.wee.bet/v1/resultados/live`, {
            method: "POST",
            body: JSON.stringify(items),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        const results = await request.json();

        if (request.status == 404 || request.status == 500) {
            throw results.errors;
        }
        return results;
    } catch (error) {
        return error;
    }
}

function followLive(liveItems) {
    let hasLiveItem = false;
    this.getLiveItems(liveItems).then(async (liveResults) => {
        if (liveResults && liveResults.result.length) {
            liveResults.result.forEach((game) => {
                let live = game.live_results;
                if (live && live.stats.casa !== undefined) {
                    this.updateLiveItem(game.jogo_api_id, live);
                    if (!hasLiveItem) {
                        hasLiveItem = true;
                    }
                }
            });
        }
        if (!hasLiveItem) {
            this.showAlert();
        }
    });

    let liveInterval = setInterval(async () => {
        liveItems = checkLiveItemsPeriod(liveItems);
        this.getLiveItems(liveItems).then(async (liveResults) => {
            var hasLiveItem = false;
            if (liveResults && liveResults.result.length) {
                liveResults.result.forEach((game) => {
                    let live = game.live_results;
                    if (live && live.stats.casa !== undefined) {
                        if (!hasLiveItem) {
                            hasLiveItem = true;
                        }
                        this.updateLiveItem(game.jogo_api_id, live);
                    } else {
                        this.hideLiveFlag(game.jogo_api_id);
                    }
                });
            }

            if (!hasLiveItem) {
                clearInterval(liveInterval);
            }
        });
    }, 60000
    );

}

function filterLiveItems(ticketItems, itemsWithResults) {
    let liveItems = [];
    ticketItems.forEach((item) => {
        var itemTimestamp = new Date(item.jogo_horario.replace(/-/g, "/")).getTime();

        if (item.sport === SOCCER_ID && this.checkMatchPeriod(itemTimestamp)) {
            if (!itemsWithResults.includes(item.jogo_api_id)) {
                liveItems.push({
                    jogo_api_id: item.jogo_api_id,
                    chave: item.aposta_tipo.chave,
                    start_match: itemTimestamp
                });
            }
        }
    });

    return liveItems;
}

function checkMatchPeriod(startMatchTimestamp, matchTime = 120) {
    var today = new Date();
    var itemEndTime = startMatchTimestamp + (matchTime * 60000);

    var currentTime = new Date(today.toLocaleString('en-US', {
        timeZone: 'America/Recife',
    })).getTime();

    return (startMatchTimestamp <= currentTime) && (currentTime <= itemEndTime);
}

function checkLiveItemsPeriod(liveItems) {
    return liveItems.filter((item) => {
        if (checkMatchPeriod(item.start_match)) {
            return true;
        } else {
            this.hideLiveFlag(item.jogo_api_id);
        }
        return false;
    });
}

function updateLiveItem(jogo_api_id, live) {
    document.getElementById(jogo_api_id + '_scores').innerHTML = live.stats.casa + ' - ' + live.stats.fora;

    document.getElementById(jogo_api_id + '_1half_time_a').innerHTML = live.stats.casa_1t;
    document.getElementById(jogo_api_id + '_2half_time_a').innerHTML = live.stats.casa_2t;

    document.getElementById(jogo_api_id + '_1half_time_b').innerHTML = live.stats.fora_1t;
    document.getElementById(jogo_api_id + '_2half_time_b').innerHTML = live.stats.fora_2t;

    document.getElementById(jogo_api_id + '_corner_time_a').innerHTML = live.stats.casa_escanteios;
    document.getElementById(jogo_api_id + '_corner_time_b').innerHTML = live.stats.fora_escanteios;

    document.getElementById(jogo_api_id + '_live_flag').hidden = false;
    document.getElementById(jogo_api_id + '_time').hidden = false;
    document.getElementById(jogo_api_id + '_time').innerHTML = live.time + "'";

    document.getElementById(jogo_api_id + '_live_status').innerHTML = `<b>${live.status.toUpperCase()}</b>`;
    document.getElementById(jogo_api_id + '_live_status').style.color = live.status === 'perdendo' ? 'red' : 'green';
}

function hideLiveFlag(jogo_api_id) {
    if (document.getElementById(jogo_api_id + '_live_flag').hidden === false) {
        document.getElementById(jogo_api_id + '_live_flag').hidden = true;
        document.getElementById(jogo_api_id + '_time').hidden = true;
    }
}

function closeAlert() {
    document.getElementById('alert-no-live').hidden = true;
}

function showAlert() {
    document.getElementById('alert-no-live').hidden = false;
}
