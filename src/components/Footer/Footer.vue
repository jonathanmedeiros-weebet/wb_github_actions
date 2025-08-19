<template>
    <footer class="footer">
        <div class="footer__logo" v-if="footerProps?.logo">
            <img :src="footerProps?.logo" alt="Logo" />
        </div>

        <div class="footer__separator"></div>

        <span v-if="footerProps?.description" class="footer__description" v-html="footerProps?.description"></span>

        <div class="footer__links">
            <div v-if="footerProps?.institutionalLinks && footerProps?.institutionalLinks.length"
                key="institutional-section" class="footer__section">
                <h3 class="footer__section-title">Institucional</h3>

                <ul class="footer__list">
                    <li v-for="{ url, label } in footerProps?.institutionalLinks" :key="label">
                        <a :href="url" target="_blank">{{ label }}</a>
                    </li>
                </ul>
            </div>

            <div v-if="footerProps?.showMethodPaymentSection || footerProps?.showDownloadApplicationSection"
                key="fixed-section" class="footer__section">
                <div v-if="footerProps?.showMethodPaymentSection" key="method-payment-section" class="footer__section">
                    <h3 class="footer__section-title">Método de pagamento</h3>
                    <div v-if="pixImage" class="footer__images">
                        <img :src="pixImage" alt="pix-image" />
                    </div>
                </div>

                <div v-if="footerProps?.showDownloadApplicationSection" key="download-app-section"
                    class="footer__section">
                    <h3 class="footer__section-title">Nosso aplicativo</h3>
                    <div v-if="btnDownloadAppImage" class="footer__images">
                        <img :src="btnDownloadAppImage" alt="application-image" />
                    </div>
                </div>
            </div>

            <div v-if="footerProps?.licenses && footerProps?.licenses.length" key="licenses-section"
                class="footer__section">
                <h3 class="footer__section-title">Licenças</h3>

                <div class="footer__images">
                    <img v-for="({ src, alt }, index) in footerProps?.licenses" :key="index" :src="src" :alt="alt" />
                </div>
            </div>
        </div>

        <div class="footer__separator"></div>

        <div class="footer__warnings" v-if="footerProps?.warnings && footerProps?.warnings.length">
            <img v-for="({ src, alt }, index) in footerProps?.warnings" :key="index" :src="src" :alt="alt" />
        </div>

        <div class="footer__copy">
            {{ footerProps?.companyName?.toUpperCase() }} {{ year }} © Todos os direitos reservados
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import type { FooterProps } from "./footer.interface";
import { useTenantConfig } from "@/composables/useTenantConfig";

const props = defineProps<FooterProps>();
const tenant = useTenantConfig();
const footerProps = computed<FooterProps>(() => ({
    companyName: props.companyName ?? tenant?.name,
    logo: props.logo ?? tenant?.logo,
    description: props.description ?? tenant?.footerSection?.description,
    institutionalLinks: (props?.institutionalLinks ?? tenant?.footerSection?.institutionalLinks) ?? [],
    licenses: (props.licenses ?? tenant?.footerSection?.licenses) ?? [],
    warnings: (props.warnings ?? tenant?.footerSection?.warnings) ?? [],
    showMethodPaymentSection: props.showMethodPaymentSection || Boolean(tenant?.footerSection?.showMethodPaymentSection),
    showDownloadApplicationSection: props.showDownloadApplicationSection || Boolean(tenant?.footerSection?.showDownloadApplicationSection),
}));

const year = computed(() => new Date().getFullYear());
const pixImage = new URL('../../assets/images/pix.png', import.meta.url).href;
const btnDownloadAppImage = new URL('../../assets/images/baixe-aplicativo.png', import.meta.url).href;
</script>

<style lang="scss" scoped>
.footer {
    background: var(--background, #ffffff);
    font-size: 14px;
    color: var(--foreground, #101820);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__separator {
        height: 3px;
        background-color: var(--separator, #e5e5e5);
    }

    &__logo img {
        max-height: 80px;
        max-width: 200px;
        height: auto;
        width: auto;
    }

    &__description {
        color: var(--foreground, #101820);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 135%;
    }

    &__links {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
    }

    &__section {
        flex: 1 1 200px;
    }

    &__section-title {
        font-weight: bold;
    }

    &__list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__list li a {
        color: var(--foreground, #101820);
        text-decoration: none;
    }

    &__images {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    &__images img {
        height: 40px;
    }

    &__warnings {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 24px;
    }

    &__warnings img {
        height: 48px;
        width: auto;
    }

    &__copy {
        text-align: center;
        color: var(--foreground, #101820);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%;
    }
}

@media screen and (min-width: 768px) {
    .footer {
        padding: 24px 54px;
    }
}
</style>