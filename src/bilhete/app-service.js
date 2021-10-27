async function getParams() {
    var paramsSearch = new URLSearchParams(window.location.search);
    var clientSlug = paramsSearch.get('client-slug');
    var centerUrl = paramsSearch.get('center');
    var ticketId = paramsSearch.get('ticket-id');
    const isAllPresent = (ticketId && centerUrl && clientSlug) ? true : false;
    return isAllPresent ? {
        slug: clientSlug,
        center: centerUrl,
        ticketId: ticketId
    } : false;
}

async function getTicketData({ apiUrl, ticketId }) {
    return await fetch(`https://${apiUrl}/api/apostas-por-codigo/${ticketId}`).then(
        response => {
            return response.json();
        }).catch(error => {
        if (error.status == 404) {
            this.displayError(error.message);
        }
        this.displayError(error);
        console.error(error);
    });
}

async function orderTicketItens(tickeItens = [], ticketType = undefined) {
    const orderedItens = tickeItens.sort((a, b) => {
        switch (ticketType) {
            case 'acumuldao':
                new Date(a.jogo.horario).getTime() - new Date(b.jogo.horario).getTime()
                break;
            case 'desafio':
                new Date(a.desafio_datahora_encerramento).getTime() - new Date(b.desafio_datahora_encerramento).getTime()
                break;
            default:
                new Date(a.jogo_horario).getTime() - new Date(b.jogo_horario).getTime()
        }
    });
    return orderedItens;
}

function getFormatedDate(date) {
    var formatedDate = date.getDate().toString();
    var formatdMonth = date.getMonth() + 1;
    var formatedYear = date.getFullYear().toString();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    var dateArray = [formatedDate, formatdMonth, formatedYear];
    var timeArray = [hour, minutes];
    return `${dateArray.join('/')} ${timeArray.join(':')}`;
}

async function getResuts(ids) {
    paramIds = ids.join(',');
    return await fetch(`
    https://center6.wee.bet/v1/resultados/puro?ids=${paramIds}`)
        .then(response => { return response.json() })
        .catch(error => console.error(error));
}

function displayError(message) {
    document.getElementById('error').hidden = false;
    document.getElementById('ticket').style.display = 'none';
    document.getElementById('error-message').append(message);
}