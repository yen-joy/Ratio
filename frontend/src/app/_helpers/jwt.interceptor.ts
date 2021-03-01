import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilityService } from '../_services/utility.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private utilityService: UtilityService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUserToken = this.utilityService.getCurrentUserToken();
        if (currentUserToken !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + currentUserToken
                }
            });
        }

        return next.handle(request);
    }
}