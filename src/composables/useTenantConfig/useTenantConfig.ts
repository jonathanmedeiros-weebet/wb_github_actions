import { inject, provide } from "vue";
import type { TenantConfig } from "./tenantConfig.interface";

const TENANT_CONFIG_SYMBOL = Symbol('TENANT_CONFIG')

export function useTenantConfig(): TenantConfig | undefined {
    const config = inject(TENANT_CONFIG_SYMBOL) as TenantConfig | undefined;
    if (!config) {
        console.warn("⚠️ Nenhuma configuração encontrada. Verifique o Storybook setup.");
        return undefined;
    }
    return config;
}

export function setProvideTenantConfig(config: TenantConfig) {
    provide(TENANT_CONFIG_SYMBOL, config);
}