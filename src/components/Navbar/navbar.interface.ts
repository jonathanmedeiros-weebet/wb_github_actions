
export interface MenuItem {
    text: string;
    link: string;
    active?: boolean;
    show?: boolean
}

export interface NavbarProps {
    logo?: string;
    menuItems?: MenuItem[];
    showLoginButton?: boolean;
    showRegisterButton?: boolean;
}