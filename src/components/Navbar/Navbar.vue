<template>
    <nav class="navbar">
        <div class="navbar__logo">
            <img v-if="logo" :src="logo" alt="Logo" :key="logo" />
        </div>
        <ul class="navbar__menu">
            <li v-for="item in menuItems" :key="item.text" :class="{ active: item.active }">
                <a :href="item.link">{{ item.text }}</a>
            </li>
        </ul>
        <div class="navbar__actions">
            <Button v-if="showLoginButton" variant="clear" label="Login" @click="onLogin" />
            <Button v-if="showRegisterButton" variant="solid" label="Registre-se" @click="onRegister" />
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { MenuItem, NavbarProps } from './navbar.interface';
import { useTenantConfig } from '@/composables/useTenantConfig';
import Button from '@/components/Button/Button.vue';

const props = defineProps<NavbarProps>();
const tenant = useTenantConfig();
const logo = computed(() => props.logo || tenant?.logo);
const showLoginButton = computed(() => props.showLoginButton || (Boolean(tenant?.modules?.bettingAgentMode) || Boolean(tenant?.modules?.customerMode)));
const showRegisterButton = computed(() => props.showRegisterButton || Boolean(tenant?.modules?.customerMode));

const menuItems = ref<MenuItem[]>([
    {
        text: 'Ao vivo',
        link: 'sports?bt-path=live',
        show: Boolean(tenant?.modules?.betby) || Boolean(tenant?.modules?.liveSports)
    },
    {
        text: 'Esportes',
        link: '/sports',
        active: true,
        show: Boolean(tenant?.modules?.betby) || Boolean(tenant?.modules?.sports)
    },
    {
        text: 'Cassino',
        link: '/casino',
        show: Boolean(tenant?.modules?.casino)
    },
    {
        text: 'Cassino ao vivo',
        link: '/live-casino',
        show: Boolean(tenant?.modules?.liveCasino)
    },
    {
        text: 'Virtuais',
        link: '/virtuals',
        show: Boolean(tenant?.modules?.virtualSports)
    },
    {
        text: 'Acumuladão',
        link: '/jackpot',
        show: Boolean(tenant?.modules?.acumulation)
    },
    {
        text: 'Loteria',
        link: '/lottery',
        show: Boolean(tenant?.modules?.lottery)
    },
    {
        text: 'Desafio',
        link: '/challenge',
        show: Boolean(tenant?.modules?.challenge)
    },
].filter(item => item.show));

const onLogin = () => {
    console.log('Login clicked');
};

const onRegister = () => {
    console.log('Register clicked');
};
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
    background-color: var(--background, #ffffff);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &__logo img {
        height: 40px;
    }

    &__menu {
        list-style: none;
        display: flex;
        gap: 1.5rem;
    }

    &__menu li a {
        text-decoration: none;
        color: var(--foreground, #101820);
        font-weight: 500;
        transition: color 0.2s;
    }

    &__menu li a:hover {
        color: var(--primary, #c71f2d);
    }

    &__menu li.active a {
        color: var(--primary, #c71f2d);
        font-weight: 600;
    }

    &__actions {
        display: flex;
        gap: 1rem;
    }
}
</style>