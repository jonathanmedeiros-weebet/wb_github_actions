// plugins/wee-ui-library.ts
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import WeeUiLibrary, { setTenantConfig } from 'wee-ui-library'
import "wee-ui-library/dist/wee-ui-library.css"

export default defineNuxtPlugin(async (nuxtApp) => {
    nuxtApp.vueApp.use(WeeUiLibrary)

    const config = useRuntimeConfig();
    const slug = config.public.slug;
    console.warn('Runtime Config:', config);
    const response: any = await fetch(`https://weebet.s3.amazonaws.com/${slug}/param/parametros.json?${Date.now()}`).then(res => res.json())
    const {
        banca_nome,
        acumuladao,
        betby,
        aovivo,
        casino,
        desafio,
        esporte,
        rodape_pt,
        loterias,
        modo_cliente,
        modo_cambista,
        virtuais
    } = response.opcoes;
    console.warn('Config fetched:', response)

    setTenantConfig({
        name: banca_nome,
        logo: `https://weebet.s3.amazonaws.com/${slug}/logos/logo_banca.png`,
        slug,
        modules: {
            acumulation: acumuladao,
            betby: betby,
            casino: casino,
            challenge: desafio,
            liveCasino: casino,
            lottery: loterias,
            liveSports: aovivo,
            sports: esporte,
            virtualSports: virtuais,

            bettingAgentMode: modo_cambista,
            customerMode: modo_cliente,
        },
        footerSection: {
            description: rodape_pt,
            warnings: []
        },
        
    })
})
