import { inject } from "vue";
import type { TenantConfig } from "./tenantConfig.interface";

export function useTenantConfig(): TenantConfig | undefined {
    const config = inject("tenantConfig") as TenantConfig | undefined;
    if (!config) {
        console.warn("⚠️ Nenhuma configuração encontrada. Verifique o Storybook setup.");
        return undefined;
    }
    return config;
}
