import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './utils/headers.service';

export interface Geolocation {
    error: boolean;
    lat: number;
    lng: number;
}

export interface ReverseGeolocation {
    error: boolean;
    ibge_code: string;
    location_city: string;
    location_state: string;
    location_country: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    private Estados = [
        { nome: 'Acre', codigo: 12 },
        { nome: 'Alagoas', codigo: 27 },
        { nome: 'Amapá', codigo: 16 },
        { nome: 'Amazonas', codigo: 13 },
        { nome: 'Bahia', codigo: 29 },
        { nome: 'Ceará', codigo: 23 },
        { nome: 'Distrito Federal', codigo: 53 },
        { nome: 'Espírito Santo', codigo: 32 },
        { nome: 'Goiás', codigo: 52 },
        { nome: 'Maranhão', codigo: 21 },
        { nome: 'Mato Grosso', codigo: 51 },
        { nome: 'Mato Grosso do Sul', codigo: 50 },
        { nome: 'Minas Gerais', codigo: 31 },
        { nome: 'Pará', codigo: 15 },
        { nome: 'Paraíba', codigo: 25 },
        { nome: 'Paraná', codigo: 41 },
        { nome: 'Pernambuco', codigo: 26 },
        { nome: 'Piauí', codigo: 22 },
        { nome: 'Rio Grande do Norte', codigo: 24 },
        { nome: 'Rio Grande do Sul', codigo: 43 },
        { nome: 'Rio de Janeiro', codigo: 33 },
        { nome: 'Rondônia', codigo: 11 },
        { nome: 'Roraima', codigo: 14 },
        { nome: 'Santa Catarina', codigo: 42 },
        { nome: 'São Paulo', codigo: 35 },
        { nome: 'Sergipe', codigo: 28 },
        { nome: 'Tocantins', codigo: 17 }
    ];
    private options = {
        enableHighAccuracy: false,
        timeout: 3000,
        // Cache time = 10min
        maximumAge: 1000 * 60 * 10,
    };
    private central_url = `${config.HOST}/api/geolocation`;
    private requestOnGoing = false;

    constructor(private http: HttpClient, private header: HeadersService) { }

    async getGeolocation(isReverse = true): Promise<Geolocation> {
        try {
            if (this.requestOnGoing) return; // Avoid multiple requests
            this.requestOnGoing = isReverse ? true : false;
            let currentPosition = await this.getCurrentPosition() as Geolocation;

            if (isReverse) this.getReverseGeolocation(currentPosition.lat, currentPosition.lng);

            return currentPosition;
        } catch (error) {
            this.requestOnGoing = false;
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
                    sessionStorage.setItem('location_city', res.location_city ?? null);
                    sessionStorage.setItem('location_state', res.location_state ?? null);
                    sessionStorage.setItem('location_country', res.location_country == 'Brasil' || res.location_country == 'Brazil' ? 'Brasil' : `Internacional - ${res.location_country}`);
                    return res;
                },
                error: () => {
                    this.requestOnGoing = false;
                    return {
                        error: true,
                        ibge_code: '',
                        location_state: '',
                        location_country: ''
                    };
                }
            });
        } catch (error) {
            this.requestOnGoing = false;
            return {
                error: true,
                ibge_code: '',
                location_city: '',
                location_state: '',
                location_country: ''
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
