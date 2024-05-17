declare var Legitimuz: any;

export class LegitimuzService {

    private legitimuz;

    private static API_LEGITIMUZ: String = "https://api.legitimuz.com";

    private options = {
        host: LegitimuzService.API_LEGITIMUZ,
        token: '',
        lang: 'pt',
        enableRedirect: false,
        autoOpenValidation: false,
        onSuccess: (eventName) => console.log(eventName),
        onError: (eventName) => console.log(eventName)
    };

    constructor (options: {
        token: string;
        lang?: string;
        enableRedirect?: boolean;
        autoOpenValidation?: boolean;
        onSuccess?;
        onError?;
    }) {
        this.options.token = options.token;

        if (options.lang) {
            this.options.lang = options.lang;
        }

        if (options.enableRedirect) {
            this.options.enableRedirect = options.enableRedirect;
        }

        if (options.autoOpenValidation) {
            this.options.autoOpenValidation = options.autoOpenValidation;
        }

        if (options.onSuccess) {
            this.options.onSuccess = options.onSuccess;
        }

        if (options.onError) {
            this.options.onError = options.onError;
        }
    }

    init() {
        this.legitimuz = Legitimuz(this.options);
    }

    mount() {
        this.legitimuz.mount();
    }

    changeLang(lang: string) {
        this.legitimuz.setLang(lang);
    }

    closeModal() {
        this.legitimuz.closeModal();
    }

}
