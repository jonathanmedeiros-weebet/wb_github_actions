import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NavigatorPermissionsService {

    async checkLocationPermission(): Promise<PermissionState | null> {
        if ('permissions' in navigator) {
            try {
                const permissionStatus = await navigator.permissions.query({
                    name: 'geolocation',
                });
                return permissionStatus.state; // 'granted', 'denied' ou 'prompt'
            } catch (error) {
                console.error('Error checking location permission:', error);
                return null;
            }
        } else {
            console.warn('Permissions API not supported by this browser.');
            return null;
        }
    }

}
