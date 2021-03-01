import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { User, Sort, Page } from '../_models';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';

@Injectable()
export class UserService {
    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) { }

    private paneltoggle = new Subject();
    paneltoggle$ = this.paneltoggle.asObservable();

    list(page: Page, sort: Sort, statusValue, brandValue, countryCode) {
        let body = {
            page: page.offset + 1,
            page_size: page.size
        };

        // merge filters
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'statusValue',
            statusValue, true);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'brandValue',
            brandValue, true);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'countryCode',
            countryCode, true);

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort',
            sort);

        return this.httpService.postJson('/user/list', body);
    }

    filter(filterValue: string = null): Observable<any[]> {
        let body = {
            filterValue: filterValue
        };

        return this.httpService.postJson('/user/filter', body)
            .pipe(map(users => {
                var items = [];
                for (let user of users) {
                    var item = {
                        id: user.user_id,
                        name: user.first_name + ' ' + user.last_name
                    };
                    items.push(item);
                }
                return items;
            }));
    }

    save(userRegistrationRequest: User) {
        return this.httpService.postJson('/user/save',
            userRegistrationRequest)
            .pipe(map(data => {
                this.paneltoggle.next(false);

                return data;
            }));
    }

    updatePassword(password: any) {
        return this.httpService.postJson('/user/updatePassword', {
            password: password
        });
    }   

    details(id) {
        return this.httpService.postJson('/user/details', { "id": id });
    }

    update(pass: User) {
        let user = this.utilityService.getCurrentUser();

        return this.httpService.postJson('/user/update', 
            { pass, "id": user.user_id });
    }

}