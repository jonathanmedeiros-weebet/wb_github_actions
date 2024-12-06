import { Injectable } from '@angular/core';

export interface Geolocation {
    error: boolean;
    lat: number;
    lng: number;
}

export interface ReverseGeolocation {
    error: boolean;
    ibge_code: string;
    city: string;
    state: string;
    country: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {
    async getGeolocation(): Promise<Geolocation> {
        try {
            return await this.getCurrentPosition() as Geolocation;
        } catch (error) {
            return {
                error: true,
                lat: 0,
                lng: 0
            }
        }
    }

    private async getReverseGeolocation(lat: number, lng: number): Promise<ReverseGeolocation> {
        try {
            let latlng = {
                latlng: `${lat},${lng}`
            }
            this.http.post(`${this.central_url}/reverseGeolocation`, latlng, this.header.getRequestOptions(true)).subscribe({
                next: (res: ReverseGeolocation) => {
                    this.requestOnGoing = false;
                    sessionStorage.setItem('ibge_code', res.ibge_code ?? null);
                    sessionStorage.setItem('locale_city', res.city ?? null);
                    sessionStorage.setItem('locale_state', res.state ?? null);
                    sessionStorage.setItem('locale_country', res.country == 'Brasil' || res.country == 'Brazil' ? 'Brasil' : `Internacional - ${res.country}`);
                    return res;
                },
                error: () => {
                    this.requestOnGoing = false;
                    return {
                        error: true,
                        ibge_code: '',
                        city: '',
                        state: '',
                        country: ''
                    };
                }
            });
        } catch (error) {
            this.requestOnGoing = false;
            return {
                error: true,
                ibge_code: '',
                city: '',
                state: '',
                country: ''
            }
        }
    }

    private getCurrentPosition() {
        return new Promise((resolve, reject) => {
            try {
                if (!navigator.geolocation) throw new Error('Geolocation not allowed.');
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (!position) throw new Error('Unable to find current position');
    
                        resolve({
                            error: false,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } catch (error) {
                reject(error)
            }
        })
    }

    public checkGeolocation(): Boolean {
        const ibgeCode = (sessionStorage.getItem('ibge_code') === 'null' || sessionStorage.getItem('ibge_code') === 'undefined') ? null : sessionStorage.getItem('ibge_code');
        const localeCity = (sessionStorage.getItem('locale_city') === 'null' || sessionStorage.getItem('locale_city') === 'undefined') ? null : sessionStorage.getItem('locale_city');
        const localeState = (sessionStorage.getItem('locale_state') === 'null' || sessionStorage.getItem('locale_state') === 'undefined') ? null : sessionStorage.getItem('locale_state');
        const localeCountry = (sessionStorage.getItem('locale_country') === 'null' || sessionStorage.getItem('locale_country') === 'undefined') ? null : sessionStorage.getItem('locale_country');

        if (localeCountry != 'Brasil' && localeCountry != 'Brazil') {
            return false;
        }

        if (!ibgeCode || !localeCity || !localeState) {
            return false;
        }
        // Check if the IBGE code is valid. Ref: https://medium.com/@salibi/como-validar-o-c%C3%B3digo-de-munic%C3%ADpio-do-ibge-90dc545cc533;
        const digito1 = parseInt(ibgeCode[0]);
        const digito2 = (parseInt(ibgeCode[1]) * 2) % 10 + Math.floor((parseInt(ibgeCode[1]) * 2) / 10);
        const digito3 = parseInt(ibgeCode[2]);
        const digito4 = (parseInt(ibgeCode[3]) * 2) % 10 + Math.floor((parseInt(ibgeCode[3]) * 2) / 10);
        const digito5 = parseInt(ibgeCode[4]);
        const digito6 = (parseInt(ibgeCode[5]) * 2) % 10 + Math.floor((parseInt(ibgeCode[5]) * 2) / 10);
        const digitoVerificador = parseInt(ibgeCode[6]);
        const digit = (10 - (digito1 + digito2 + digito3 + digito4 + digito5 + digito6) % 10) % 10;
        const estadoValido = this.Estados.find((e) => e.codigo === parseInt(ibgeCode.substring(0, 2)));

        if (digitoVerificador == digit && estadoValido.nome == localeState) {
            return true;
        } else {
            return false;
        }
    }

    public isInternational(): Boolean {
        const localeCountry = (sessionStorage.getItem('locale_country') === 'null' || sessionStorage.getItem('locale_country') === 'undefined') ? null : sessionStorage.getItem('locale_country');

        if (localeCountry == null || localeCountry == 'Brasil' || localeCountry == 'Brazil') {
            return false;
        } 
        return true;
    }
}
