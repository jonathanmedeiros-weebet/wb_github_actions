const CENTER = 'https://center7.wee.bet/v1';

async function getParams() {
    var url = window.location.pathname;

    var slug = 'demo.wee.bet';
    var centerUrl = 'central.' + slug;
    var ticketId = url.substring(url.lastIndexOf('/') + 1);
    let timestamp = Date.now();

    var urlParams = new URLSearchParams(window.location.search);
    var origin = urlParams.get("origin");

    async function getLiveTrackerStatus() {
        const response = await fetch(`https://weebet.s3.amazonaws.com/${slug}/param/parametros.json?${timestamp}`)
        const responseJson = await response.json();
        if (responseJson.status == 404 || responseJson.status == 500) {
            return false;
        };

        return responseJson.opcoes.habilitar_live_tracker;
    }

    if (ticketId && centerUrl && slug) {
        var params = {
            slug: slug,
            center: centerUrl,
            ticketId: ticketId,
            origin: origin,
            liveTracker: await getLiveTrackerStatus(),
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
        const request = await fetch(`${CENTER}/resultados/detalhado?ids=${paramIds}`)
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
        const request = await fetch(`${CENTER}/resultados/live`, {
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

        const footballIds = [1, 6046];

        if (footballIds.includes(Number(item.sport)) && this.checkMatchPeriod(itemTimestamp)) {
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
    document.getElementById(jogo_api_id + '_field').innerHTML = `
        <button id="${jogo_api_id}_field_btn"
            class="field_btn";
            onclick="activeAndDeactiveField('${jogo_api_id}')";
            >
            <div style="width:100%; height:100%; display:flex; align-items:center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="12" viewBox="0 0 17 12" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.9037 5.90708C2.9037 6.81257 2.29125 7.57501 1.45801 7.80276V4.0114C2.29125 4.23915 2.9037 5.00159 2.9037 5.90708ZM3.9037 5.90708C3.9037 7.36745 2.84792 8.58124 1.45801 8.82679V8.82942C1.45801 9.6693 2.13886 10.3502 2.97874 10.3502H7.95801V8.26919C6.9152 8.04055 6.13469 7.1114 6.13469 5.99996C6.13469 4.88851 6.9152 3.95936 7.95801 3.73072V1.64981H2.97874C2.20021 1.64981 1.55831 2.23485 1.4687 2.98928C2.85333 3.23916 3.9037 4.45046 3.9037 5.90708ZM7.95801 4.77448C7.47504 4.97166 7.13469 5.44606 7.13469 5.99996C7.13469 6.55385 7.47504 7.02825 7.95801 7.22544V4.77448ZM8.95801 7.22529V4.77463C9.44078 4.97191 9.78096 5.44621 9.78096 5.99996C9.78096 6.55371 9.44078 7.02801 8.95801 7.22529ZM8.95801 8.26911C10.0006 8.04033 10.781 7.11127 10.781 5.99996C10.781 4.88864 10.0006 3.95958 8.95801 3.7308V1.64981H13.9373C14.7166 1.64981 15.359 2.23605 15.4476 2.9916C14.0693 3.24659 13.0253 4.45492 13.0253 5.90708C13.0253 7.36289 14.0745 8.57365 15.458 8.82447V8.82942C15.458 9.6693 14.7772 10.3502 13.9373 10.3502H8.95801V8.26911ZM0.458008 8.82942C0.458008 8.84369 0.458126 8.85792 0.458362 8.87213C0.481159 10.2446 1.60084 11.3502 2.97874 11.3502H7.95801H8.45801H8.95801H13.9373C15.3152 11.3502 16.4349 10.2446 16.4577 8.87213C16.4579 8.85792 16.458 8.84369 16.458 8.82942V8.37213V7.87213V3.94203V3.44203V3.17055C16.458 3.09352 16.4546 3.0173 16.4478 2.94203C16.3323 1.65695 15.2524 0.649811 13.9373 0.649811H8.95801H8.45801H7.95801H2.97874C1.66361 0.649811 0.5837 1.65695 0.468226 2.94203C0.461463 3.0173 0.458008 3.09352 0.458008 3.17055V3.44203V3.94203V7.87213V8.37213V8.82942ZM14.0253 5.90708C14.0253 5.00631 14.6314 4.2471 15.458 4.015V7.79916C14.6314 7.56706 14.0253 6.80785 14.0253 5.90708Z" fill="white"/>
                </svg>
                <p style="margin: 0 0 0 7px">Acompanhar evento</p>
            </div>
        </button>
    `;
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

function activeAndDeactiveField(id) {
    const btn = document.getElementById(`${id}_field_btn`);
    const field = document.getElementById(`${id}_field_body`);

    if(btn) {
        btnText =  btn.getElementsByTagName('p')[0];

        if (field) {
            btn.classList.toggle('field_active');

            field.classList.toggle('hidden_field');

            if (btn.classList.contains('field_active')) {
                btnText.innerText = "Acompanhando evento";
            } else {
                btnText.innerText = "Acompanhar evento";
            }
        }
    };

}
