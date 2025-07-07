import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationService } from './geolocation.service';

@Injectable({
    providedIn: 'root'
})

export class GeolocationValidationService {
    constructor(
        private geolocationService: GeolocationService,
        private translateService: TranslateService
    ) {}

    async validateGeolocationWhenBetting({
        enableRequirementGeolocation,
        restrictionState,
    }: {
        enableRequirementGeolocation: boolean;
        restrictionState?: string;
    }): Promise<{ valid: boolean; msg?: string; geolocation?: any }> {
        if (!enableRequirementGeolocation) {
            return { valid: true };
        }

        try {
            const currentGeoLocation = await this.geolocationService.getCurrentPosition();
            const ibgeCode = localStorage.getItem('ibge_code');
            const localeCity = localStorage.getItem('locale_city');
            const localeState = localStorage.getItem('locale_state');

            const requiredFields = [currentGeoLocation, ibgeCode, localeCity, localeState];
            if (requiredFields.some(field => !field)) {
                return {
                    valid: false,
                    msg: this.translateService.instant('geral.geolocationErrorWhenBettting'),
                };
            }

            if (
                restrictionState &&
                restrictionState !== 'Todos' &&
                localeState !== restrictionState
            ) {
                return {
                    valid: false,
                    msg: this.translateService.instant('geral.stateRestriction'),
                };
            }

            return {
                valid: true,
                geolocation: {
                    ...currentGeoLocation,
                    ibge_code: ibgeCode,
                    locale_city: localeCity,
                    state: localeState,
                },
            };
        } catch (error) {
            return {
                valid: false,
                msg: this.translateService.instant('geral.geolocationErrorWhenBettting'),
            };
        }
    }
}
