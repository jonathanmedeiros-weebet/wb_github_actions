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
    city: string;
    state: string;
    country: string;
}

interface LocationData {
    lat: number;
    lng: number;
    ibge_code: string;
    locale_city: string;
    locale_state: string;
    country: string;
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    private states = [
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
        timeout: 5000,
        // Cache time = 100min
        maximumAge: 10000 * 60 * 10,
    };
    private central_url = `${config.HOST}/api/geolocation`;
    private requestOnGoing = false;

    constructor(private http: HttpClient, private header: HeadersService) { }

    private isLocationCompleteAndUnchanged(stored: LocationData, current: Geolocation): boolean {
        return (
            stored.lat === current.lat &&
            stored.lng === current.lng &&
            Boolean(stored.ibge_code) &&
            Boolean(stored.locale_city) &&
            Boolean(stored.locale_state) &&
            Boolean(stored.country)
        );
    }

    async saveLocalStorageLocation() {
        if (this.requestOnGoing) {
            return false;
        }
        this.requestOnGoing = true;
        
        try {
            let currentPosition = await this.getCurrentPosition() as Geolocation;
            
            if (currentPosition.error) {
                throw new Error();
            }

            const [lat, lng, ibgeCode, city, state, country] = 
                ['lat','lng','ibge_code','locale_city','locale_state','country']
                .map(key => localStorage.getItem(key));

            const storedLocation: LocationData = {
                lat: Number(lat),
                lng: Number(lng),
                ibge_code: ibgeCode,
                locale_city: city,
                locale_state: state,
                country: country
            }

            if (this.isLocationCompleteAndUnchanged(storedLocation, currentPosition)) {
                return true;
            };

            let reverseGeolocation = await this.getReverseGeolocation(currentPosition.lat, currentPosition.lng);
            
            if (reverseGeolocation.error) {
                throw new Error();
            }

            localStorage.setItem('lat', String(currentPosition.lat));
            localStorage.setItem('lng', String(currentPosition.lng));
            localStorage.setItem('ibge_code', reverseGeolocation.ibge_code ?? '');
            localStorage.setItem('locale_city', reverseGeolocation.city ?? '');
            localStorage.setItem('locale_state', reverseGeolocation.state ?? '');
            localStorage.setItem('country', reverseGeolocation.country === 'Brasil' || reverseGeolocation.country === 'Brazil' ? 'Brasil' : `Internacional - ${reverseGeolocation.country}`);

            return true;
        } catch {
            return false;
        } finally {
            this.requestOnGoing = false;
        }
    }

    async getGeolocation(): Promise<Geolocation> {
        try {
            return await this.getCurrentPosition() as Geolocation;
        } catch (error) {
            return {
                error: true,
                lat: 0,
                lng: 0
            };
        }
    }

    async getReverseGeolocation(lat: number, lng: number): Promise<ReverseGeolocation> {
        try {
            const res: ReverseGeolocation = await this.http.post<ReverseGeolocation>(
                `${this.central_url}/reverseGeolocation`,
                {
                    lat: lat,
                    lng: lng
                },
                this.header.getRequestOptions(true)
            ).toPromise();

            return res;
        } catch (error) {
            return {
                error: true,
                ibge_code: '',
                city: '',
                state: '',
                country: ''
            };
        }
    }

    public getCurrentPosition(): Promise<Geolocation> {
        return new Promise((resolve, reject) => {
            try {
                if (!navigator.geolocation) {

                    throw new Error('Geolocation not allowed.');
                };

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (!position) {
                            reject('Unable to find current position');
                        }

                        resolve({
                            error: false,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error)
                    },
                    this.options
                );
            } catch (error) {
                reject(error)
            }
        })
    }

    public checkGeolocation(): Boolean {
        const codigoIbge = (localStorage.getItem('ibge_code') === 'null' || localStorage.getItem('ibge_code') === 'undefined') ? null : localStorage.getItem('ibge_code');
        const city = (localStorage.getItem('locale_city') === 'null' || localStorage.getItem('locale_city') === 'undefined') ? null : localStorage.getItem('locale_city');
        const state = (localStorage.getItem('locale_state') === 'null' || localStorage.getItem('locale_state') === 'undefined') ? null : localStorage.getItem('locale_state');
        const country = (localStorage.getItem('country') === 'null' || localStorage.getItem('country') === 'undefined') ? null : localStorage.getItem('country');

        if (country != 'Brasil' && country != 'Brazil') {
            return false;
        }

        if (!codigoIbge || !city || !state) {
            return false;
        }
        // Check if the IBGE code is valid. Ref: https://medium.com/@salibi/como-validar-o-c%C3%B3digo-de-munic%C3%ADpio-do-ibge-90dc545cc533;
        const digito1 = parseInt(codigoIbge[0]);
        const digito2 = (parseInt(codigoIbge[1]) * 2) % 10 + Math.floor((parseInt(codigoIbge[1]) * 2) / 10);
        const digito3 = parseInt(codigoIbge[2]);
        const digito4 = (parseInt(codigoIbge[3]) * 2) % 10 + Math.floor((parseInt(codigoIbge[3]) * 2) / 10);
        const digito5 = parseInt(codigoIbge[4]);
        const digito6 = (parseInt(codigoIbge[5]) * 2) % 10 + Math.floor((parseInt(codigoIbge[5]) * 2) / 10);
        const digitoVerificador = parseInt(codigoIbge[6]);
        const digit = (10 - (digito1 + digito2 + digito3 + digito4 + digito5 + digito6) % 10) % 10;
        const stateValido = this.states.find((e) => e.codigo === parseInt(codigoIbge.substring(0, 2)));

        if (digitoVerificador == digit && stateValido.nome == state) {
            return true;
        } else {
            return false;
        }
    }

    public isInternational(): Boolean {
        const country = (localStorage.getItem('country') === 'null' || localStorage.getItem('country') === 'undefined') ? null : localStorage.getItem('country');

        if (country == null || country == 'Brasil' || country == 'Brazil') {
            return false;
        }
        return true;
    }
}
