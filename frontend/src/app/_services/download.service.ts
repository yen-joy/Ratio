import { Injectable } from '@angular/core';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';
import { Sort, Page } from '../_models';

@Injectable()
export class DownloadService {
    constructor(        
        private httpService: HttpService,
        private utilityService: UtilityService) { }

    list(page: Page, sort: Sort, brand_id, category_id, user_id,
        content_id, searchContents, privateContents, user_ids) {
        let body = { 
            page: page.offset + 1,
            page_size: page.size
        };

        // merge filters
        this.mergeFiltersToBody(body, brand_id, category_id, user_id, 
            content_id, searchContents, privateContents, user_ids);        

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort', 
            sort);

        return this.httpService.postJson('/downloads/list', body);
    }    

    export(sort: Sort, brand_id, category_id, user_id, content_id,
        searchContents, privateContents, user_ids) {
        let body = {};

        // merge filters
        this.mergeFiltersToBody(body, brand_id, category_id, user_id,
            content_id, searchContents, privateContents, user_ids);

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort', 
            sort);

        this.httpService.downloadFile('/downloads/export', body);
    }

    private mergeFiltersToBody(body: Object, brand_id, category_id, user_id,
        content_id, searchContents, privateContents, user_ids) {
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'brand_id', 
            brand_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'category_id', 
            category_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'user_id', 
            user_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'content_id', 
            content_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body,
            'searchContents', searchContents, true);
        this.utilityService.mergePropertyToObjectIfNotNull(body,
            'privateContents', privateContents);
        this.utilityService.mergePropertyToObjectIfNotNull(body,
            'user_ids', user_ids);      
    }

}
