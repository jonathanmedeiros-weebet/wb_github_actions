import type { FooterProps } from "@/components/Footer/footer.interface";

interface FooterSection extends Partial<FooterProps> {};

export interface TenantConfig {
    name: string;
    slug: string;
    logo: string;
    footerSection: FooterSection
}

export type TenantConfigs = Record<string, TenantConfig>;
