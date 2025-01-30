<template>
    <div class="config">
        <Header title="Configurações" :showBackButton="true" />
        <div class="config_container">
            <div class="config_content">
                <p class="config__title">Exibir TODOS os campeonatos expandido</p>
                <button-switch
                    id='championshipExpanded'
                    name="championshipExpanded"
                    v-model="championshipExpanded"
                />
            </div>
        </div>
  </div>
    
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'
import { useConfigClient, useToastStore } from '@/stores';
import { ToastType } from '@/enums';

export default {
    name: 'settings',
    components: { 
        Header,
        ButtonSwitch
    },
    data() {
        return {
            configClientStore: useConfigClient(),
            toastStore: useToastStore()
        };
    },
    computed: {
        championshipExpanded: {
            get() {
                return this.configClientStore.settings.championshipExpanded;
            },
            set(value) {
                this.toSave({championshipExpanded: value})
            }
        }
    },
    methods: {
        toSave(data) {
            this.configClientStore.setSettings(data);
            this.toastStore.setToastConfig({
                message: 'Configurações salvas com sucesso.',
                duration: 3000,
                type: ToastType.SUCCESS
            }) 
        }
    }
}

</script>

<style lang="scss" scoped>

.config {
    &_container {
        align-items: center;
        padding: 30px 16px 0px 16px;
    }

    &_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(var(--foreground-rgb), .2);
    }

    &__title {
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        color: var(--foreground);
        width: 80%;
    }
}
</style>