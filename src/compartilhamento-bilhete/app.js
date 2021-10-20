document.onreadystatechange = async function() {
    if (this.readyState === 'complete') {
        const params = await getParams();

        if (params) {
            const appCssLink = document.getElementById('app-css');
            const linkTag = document.createElement('link');
            linkTag.href = `https://weebet.s3.amazonaws.com/${params.slug}/param/cores.css`
            linkTag.rel = 'stylesheet';
            appCssLink.parentElement.insertBefore(linkTag, appCssLink);

            const image = document.createElement('img');
            image.src = `https://weebet.s3.amazonaws.com/${params.slug}/logos/logo_banca.png`
            const logoDiv = document.getElementById('logo-frame');
            logoDiv.appendChild(image);

            var ticketData = await getTicketData({
                apiUrl: params.center,
                ticketId: params.ticketId
            });
            if (!ticketData.success) {
                console.error(ticketData.errors)
            } else {
                var template = document.getElementById('item-template');
                ticketData = ticketData.results
                const ticketItens = await orderTicketItens(ticketData.itens);
                ticketData.itens = ticketItens;
            }
        }
    }
}