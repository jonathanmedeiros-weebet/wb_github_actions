interface LinkItem {
    label: string;
    url: string;
}

interface ImageItem {
    src: string;
    alt: string;
}

export interface FooterProps {
    companyName?: string;
    logo?: string;
    description?: string;
    institutionalLinks?: LinkItem[];
    licenses?: ImageItem[];
    warnings?: ImageItem[];
    showMethodPaymentSection?: boolean;
    showDownloadApplicationSection?: boolean;
}