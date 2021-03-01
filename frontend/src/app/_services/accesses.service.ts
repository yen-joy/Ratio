import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';
import { Sort, Page } from '../_models';

@Injectable()
export class AccessesService {
    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) { }

    accessesLogs(page: Page, sort: Sort, user_ids = null) {
        let body = {
            page: page.offset + 1,
            page_size: page.size
        };        

        // merge filters
        this.mergeFiltersToBody(body, user_ids);

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort', 
            sort);
        
        return this.httpService.postJson('/accesses/list', body);
    }

    exportExcel(sort: Sort, user_ids: Array<number>) {
        let body = {};

        // merge filters
        this.mergeFiltersToBody(body, user_ids);

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort', 
            sort);

        this.httpService.downloadFile('/accesses/export', body);
    }

    private mergeFiltersToBody(body: Object, user_ids: Array<number>) {
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'user_ids', 
            user_ids);
    }
}