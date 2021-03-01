import { Injectable } from '@angular/core';
import { Subject, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegistrationRequest } from '../_models/registrationrequest';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';

@Injectable()
export class Anonymous {

  private paneltoggle = new Subject();
  paneltoggle$ = this.paneltoggle.asObservable();

  constructor(
    private httpService: HttpService,
    private utilityService: UtilityService) { }

  list(page, sort, status) {
    let body = {
      page: page.offset + 1,
      page_size: page.size
    };

    // merge filters
    this.utilityService.mergePropertyToObjectIfNotNull(body, 'status',
      status, true);

    // merge sort
    this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort',
      sort);

    return this.httpService.postJson('/registration/list', body);
  }

  save(regReq: RegistrationRequest) {
    return this.httpService.postJson('/registration/save', regReq)
      .pipe(map(data => {
        this.paneltoggle.next(false);
        return data;
      }),
        catchError((err, caught) => {
          this.paneltoggle.next(false);

          return empty();
        }));
  }

  count() {
    return this.httpService.get('/registration/count');
  }

  delete(registrationRequests: any) {
    let registrationRequestIds = [];
    registrationRequests.forEach((item) => {
      registrationRequestIds.push(item.registration_request_id);
    });

    return this.httpService.postJson('/registration/delete',
      registrationRequestIds);
  }

}    