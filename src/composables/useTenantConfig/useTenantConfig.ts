import { reactive } from 'vue'
import type { TenantConfig } from './tenantConfig.interface'

const state = reactive<{ tenantConfig?: TenantConfig }>({ tenantConfig: undefined })

export function setTenantConfig(tenantConfig: TenantConfig) {
  state.tenantConfig = tenantConfig
}

export function useTenantConfig(): TenantConfig | undefined {
  if (!Boolean(state.tenantConfig)) {
    console.warn('⚠️ Nenhuma configuração encontrada. Use setTenantConfig() primeiro.')
  }
  return state.tenantConfig
}