import type { FooterProps } from "@/components/Footer/footer.interface";

interface FooterSection extends Partial<FooterProps> {};

export interface TenantConfig {
    name: string;
    slug: string;
    logo: string;
    footerSection: FooterSection;
    modules: {
        betby: boolean;
        sports: boolean;
        liveSports: boolean;
        acumulation: boolean;
        casino: boolean;
        liveCasino: boolean;
        lottery: boolean;
        virtualSports: boolean;
        challenge: boolean;

        customerMode: boolean
        bettingAgentMode: boolean
    };
}

export type TenantConfigs = Record<string, TenantConfig>;
