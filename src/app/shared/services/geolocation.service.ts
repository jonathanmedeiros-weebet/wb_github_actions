import { Injectable } from '@angular/core';

export interface Geolocation {
    error: boolean;
    lat: number;
    lng: number;
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
}
