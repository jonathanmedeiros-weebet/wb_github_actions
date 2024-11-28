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
    codigo_ibge: string;
    cidade: string;
    estado: string;
    pais: string;
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
                    sessionStorage.setItem('codigo_ibge', res.codigo_ibge ?? null);
                    sessionStorage.setItem('cidade', res.cidade ?? null);
                    sessionStorage.setItem('estado', res.estado ?? null);
                    sessionStorage.setItem('pais', res.pais == 'Brasil' || res.pais == 'Brazil' ? 'Brasil' : `Internacional - ${res.pais}`);
                    return res;
                },
                error: () => {
                    this.requestOnGoing = false;
                    return {
                        error: true,
                        codigo_ibge: '',
                        cidade: '',
                        estado: ''
                    };
                }
            });
        } catch (error) {
            this.requestOnGoing = false;
            return {
                error: true,
                codigo_ibge: '',
                cidade: '',
                estado: '',
                pais: ''
            }
        }
    }

    private getCurrentPosition() {
        return new Promise((resolve, reject) => {
            try {
                if (!navigator.geolocation) throw new Error('Geolocation not allowed.');

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (!position) throw new Error('Unable to find current position')
    
                        resolve({
                            error: false,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        throw error
                    },
                    this.options
                );
            } catch (error) {
                reject(error)
            }
        })
    }

    public checkGeolocation(): Boolean {
        const codigoIbge = (sessionStorage.getItem('codigo_ibge') === 'null' || sessionStorage.getItem('codigo_ibge') === 'undefined') ? null : sessionStorage.getItem('codigo_ibge');
        const cidade = (sessionStorage.getItem('cidade') === 'null' || sessionStorage.getItem('cidade') === 'undefined') ? null : sessionStorage.getItem('cidade');
        const estado = (sessionStorage.getItem('estado') === 'null' || sessionStorage.getItem('estado') === 'undefined') ? null : sessionStorage.getItem('estado');
        const pais = (sessionStorage.getItem('pais') === 'null' || sessionStorage.getItem('pais') === 'undefined') ? null : sessionStorage.getItem('pais');

        if (pais != 'Brasil' && pais != 'Brazil') {
            return false;
        }

        if (!codigoIbge || !cidade || !estado) {
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
        const estadoValido = this.Estados.find((e) => e.codigo === parseInt(codigoIbge.substring(0, 2)));

        if (digitoVerificador == digit && estadoValido.nome == estado) {
            return true;
        } else {
            return false;
        }
    }

    public isInternational(): Boolean {
        const pais = (sessionStorage.getItem('pais') === 'null' || sessionStorage.getItem('pais') === 'undefined') ? null : sessionStorage.getItem('pais');

        if (pais == null || pais == 'Brasil' || pais == 'Brazil') {
            return false;
        } 
        return true;
    }
}
