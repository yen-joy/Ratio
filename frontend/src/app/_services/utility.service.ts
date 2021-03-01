import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class UtilityService {
    public static DEFAULT_IMAGE: string = '/assets/img/poster.jpg';
    public static SERVER_APP_VERSION: string = "";
    public static CLIENT_APP_VERSION: string = environment.version;
    public static DEFAULT_TIMEZONE: string = "Europe/Rome";

    constructor() {
    }

    public appendObjectToFormData(object: any, formData: FormData,
        appendNull: boolean = false, appendUndefined: boolean = false) {
        for (let key in object) {
            if (object[key] === null) {
                if (appendNull === true) {
                    formData.append(key, object[key]);
                }
            } else if (object[key] === undefined) {
                if (appendUndefined === true) {
                    formData.append(key, object[key]);
                }
            } else {
                formData.append(key, object[key]);
            }
        }
    }

    setCurrentUser(userData) {
        try {
            localStorage.setItem('currentUser',
                JSON.stringify(userData));
        } catch (e) { }
    }

    removeCurrentUser() {
        try {
            localStorage.removeItem('currentUser');
        } catch (e) { }
    }

    getCurrentUser() {
        try {
            let authObj = JSON.parse(localStorage.getItem('currentUser'));
            if (authObj !== null && authObj.data !== undefined
                && authObj.data !== null) {
                return authObj.data;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    getCurrentUserToken() {
        try {
            let authObj = JSON.parse(localStorage.getItem('currentUser'));
            if (authObj !== null && authObj.token !== undefined
                && authObj.token !== null) {
                return authObj.token;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }

    mergePropertyToObjectIfNotNull(object: Object, propertyName: string,
        propertyValue: any, checkEmptyString: boolean = false) {
        if (propertyValue !== null) {
            if (checkEmptyString === true) {
                try {
                    if (propertyValue.trim() !== '') {
                        object[propertyName] = propertyValue;
                    }
                } catch (e) { }
            } else {
                object[propertyName] = propertyValue;
            }
        }
    }

    getCurrentTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) { }

        return UtilityService.DEFAULT_TIMEZONE;
    }

    getDateForNgbDatepicker(date: string) {
        let dateArray = date.split('-');

        return {
            year: Number.parseInt(dateArray[0]),
            month: Number.parseInt(dateArray[1]),
            day: Number.parseInt(dateArray[2])
        };
    }

    getAuthorizedUrl(url) {
        var authorizedUrl = "";

        try {
            var queryStringPrefix = "";
            if (url.indexOf("?") === -1) {
                queryStringPrefix = "?";
            }
            authorizedUrl = environment.api_url + url + queryStringPrefix 
                + 'access_token=' + this.getCurrentUserToken();
        } catch (e) {}
               
        return authorizedUrl;
    }   
}