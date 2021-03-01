import { Injectable } from '@angular/core';
import { Subject, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegistrationRequest } from '../_models';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';

@Injectable()
export class AuthenticationService {
    private paneltoggle = new Subject();
    paneltoggle$ = this.paneltoggle.asObservable();

    private toggle = new Subject();
    toggle$ = this.toggle.asObservable();

    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) { }

    login(email: string, user_hash: string) {
        return this.httpService.postJson('/login', {
            email: email,
            user_hash: user_hash
        }).pipe(map(data => {
            this.utilityService.setCurrentUser(data);
            
            return data;
        }));
    }

    resetpass(email: any) {
        return this.httpService.postJson('/reset', {
            email: email
        }).pipe(map(data => {
            this.toggle.next(false);

            return data;
        }));
    }

    register(registrationRequest: RegistrationRequest) {
        return this.httpService.postJson('/register', registrationRequest
            ).pipe(map(data => {
                this.paneltoggle.next(0);

                return data;
            }),
            catchError((err, caught) => {
              this.paneltoggle.next(0);

              return empty();
            }));
    }

    emailvalidate(key: string) {
        return this.httpService.postJson('/register_email_validate', {
            key: key
        });
    }

    logout() {
        this.utilityService.removeCurrentUser();        
    }
}