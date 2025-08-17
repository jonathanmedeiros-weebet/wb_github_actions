import type { TenantConfigs } from "./tenantConfig.interface";

export const tenantConfigs: TenantConfigs = {
    weebet: {
        slug: "weebet",
        name: "Weebet",
        logo: new URL('@/assets/images/weebet/logo.png', import.meta.url).href,
        footerSection: {
            description: `
              <p>Weebet é um site de entretenimento online que oferece aos seus usuários uma experiência única em apostas esportivas. Este site é operado pela Victoria Games Solutions B.V., uma empresa registrada em Curaçao, sob o número 163425, com sede em 9 Abraham de Veerstraat, Willemstad, Curaçao, entidade devidamente autorizada e licenciada pelo Governo de Curaçao.</p>
              <p>Ao acessar, continuar a usar ou navegar neste site, você concorda que podemos usar determinados cookies do navegador para melhorar sua experiência ao usar nosso site. Utilizamos cookies apenas para melhorar a sua experiência e isso não interfere na sua privacidade.</p>
            `,
            institutionalLinks: [
                { label: 'Quem somos', url: '#' },
                { label: 'Regras', url: '#' },
                { label: 'Política AML', url: '#' },
            ],
            showMethodPaymentSection: true,
            showDownloadApplicationSection: true,
            licenses: [
                { src: new URL('@/assets/images/licenca-02.png', import.meta.url).href, alt: 'Licença 02' },
            ],
            warnings: [
                { src: new URL('@/assets/images/18+.png', import.meta.url).href, alt: 'Aviso - 01' },
                { src: new URL('@/assets/images/therapy.png', import.meta.url).href, alt: 'Aviso - 04' },
            ]
        }
    },
    naipe: {
        slug: "naipe",
        name: "Naipe",
        logo: new URL('@/assets/images/naipe/logo.png', import.meta.url).href,
        footerSection: {
            description: `
              <p>Naípe é um site de entretenimento online que oferece aos seus usuários uma experiência única em apostas esportivas. Este site é operado pela Victoria Games Solutions B.V., uma empresa registrada em Curaçao, sob o número 163425, com sede em 9 Abraham de Veerstraat, Willemstad, Curaçao, entidade devidamente autorizada e licenciada pelo Governo de Curaçao.</p>
              <p>Ao acessar, continuar a usar ou navegar neste site, você concorda que podemos usar determinados cookies do navegador para melhorar sua experiência ao usar nosso site. Utilizamos cookies apenas para melhorar a sua experiência e isso não interfere na sua privacidade.</p>
            `,
            institutionalLinks: [
                { label: 'Quem somos', url: '#' },
                { label: 'Regras', url: '#' },
                { label: 'Política AML', url: '#' },
                { label: 'Política de privacidade', url: '#' },
                { label: 'Termo de uso', url: '#' },
                { label: 'Termo de uso para afiliado', url: '#' }
            ],
            showMethodPaymentSection: true,
            showDownloadApplicationSection: true,
            licenses: [
                { src: new URL('@/assets/images/licenca-01.png', import.meta.url).href, alt: 'Licença 01' },
                { src: new URL('@/assets/images/licenca-02.png', import.meta.url).href, alt: 'Licença 02' },
            ],
            warnings: [
                { src: new URL('@/assets/images/18+.png', import.meta.url).href, alt: 'Aviso - 01' },
                { src: new URL('@/assets/images/jogue-com-responsabilidade.png', import.meta.url).href, alt: 'Aviso - 02' },
                { src: new URL('@/assets/images/conheça-seus-limites.png', import.meta.url).href, alt: 'Aviso - 03' },
                { src: new URL('@/assets/images/therapy.png', import.meta.url).href, alt: 'Aviso - 04' },
            ]
        }
    }
};