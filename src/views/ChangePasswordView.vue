<template>
    <Header 
    title="Alterar senha"
    :showBackButton="true" 
    />
    <div class="password">

        <div class="password__container">

            <div class="password_inputs">
                <w-input
                class="login__input"
                label="Senha atual"
                name="current_password"
                placeholder="Digite sua senha atual"
                type="password"
                >
                </w-input>
                
                <w-input
                class="login__input"
                label="Nova Senha"
                name="new_password"
                placeholder="Digite sua nova senha"
                type="password"
                >
                </w-input>
    
                <w-input
                class="login__input"
                label="Confirmar Senha"
                name="confirm_password"
                placeholder="Confirme a nova senha"
                type="password"
                >
                </w-input>
            </div>

        </div>
        <div class="password__button">
            <w-button
            id="btn-salvar"
            text="Salvar Alterações"
            value="salvar"
            name="btn-salvar"
            />
        </div>
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import WButton from '@/components/Button.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import WInput from '@/components/Input.vue'

export default {
    name: 'change-password',
    components: { 
        Header,
        WInput,
        IconPassword,
        WButton
    }
}
</script>

<style lang="scss" scoped>
.password {
    display: flex;
    flex-direction: column;
    height: 90vh;
    padding: 0px 30px;
  
  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    
  }

  &__inputs {
    flex: 1;
    display: flex;
    flex-direction: column;
    
  }

  &__button {
    align-items: flex-end;
    margin-bottom: 20px;
  }
}
</style>