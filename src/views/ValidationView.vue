<template>
  <div class="validation">
    <Header :title="title" :showBackButton="true" />
    <div class="validate__items">
      <span class="validate__text">
        Digite o código de aposta para realizar a validação
      </span>
      <WInput
        class="validate__input"
        name="consult_ticket"
        placeholder="Ex.: EA5D-DG41"
        type="email"
      />
      <WButton
        id="btn-salvar"
        text="Consultar"
        value="salvar"
        name="btn-salvar"
      />
    </div>
  </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import Header from '@/components/layouts/Header.vue';

export default {
  name: 'validation',
  components: { Header, WInput, WButton },
  data(){
    return {
      title: 'Validar Aposta',
    }
  }
}
</script>

<style lang="scss" scoped>
.validate {

  &__items {
    padding: 17.35px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__text {
    color: var(--color-text-input);
    font-size: 14px;
    text-align: center;
  }

}

::v-deep .input__group,
::v-deep .input__field {
    background-color: var(--color-background);
}
</style>
