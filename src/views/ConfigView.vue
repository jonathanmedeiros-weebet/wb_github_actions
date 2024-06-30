<template>
    <div class="config">
        <Header title="Configurações" :showBackButton="true" />
        <div class="config_container">
            <div class="config_content">
                <p class="config__title">Ativiar bluetooh</p>
                <button-switch
                    id='bluetooh'
                    name="bluetooh"
                    v-model="bluetooh"
                />
            </div>
            <div class="config_content_column">
                <p class="config__title">Impressora padrão</p>
                <p class="config_description">Selecionar um modelo de impressora abaixo</p>
            </div>
            <div class="config_content">
                <p class="config__title">Imprimir elementos gráficos</p>
                <button-switch 
                    id='print'
                    name="print"
                    v-model="print"
                />
            </div>
        </div>
  </div>
    
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import ButtonSwitch from '@/components/ButtonSwitch.vue'

export default {
  name: 'config',
  components: { 
    Header,
    ButtonSwitch
  },
  data() {
    return {
      bluetooh: false,
      print: false,
    };
  }
}

</script>

<style lang="scss" scoped>

.config {
    
    &_container {
        padding-top: 30px;
        align-items: center;
        padding: 30px 30px 0px 30px;
    }

    &_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    &__title {
        margin: 0;
        font-size: 16px;
        font-weight: 400;
        
    }

    &_content_column {
        display: flex;
        flex-direction: column;
        

    }

    &_description {
        font-size: 14px;
        color: var(--color-text-input);
        margin-bottom: 20px;
    }
}
</style>