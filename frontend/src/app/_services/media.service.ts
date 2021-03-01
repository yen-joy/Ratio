import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';
import { Sort, Page } from '../_models';

@Injectable()
export class MediaService {
    public static MAX_IMAGE_FILE_SIZE: number = 1024 * 1024;

    // edit panel
    private paneltoggle = new Subject();
    paneltoggle$ = this.paneltoggle.asObservable();

    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) {
    }

    list(page: Page, sort: Sort) {
        let body = {
            page: page.offset + 1,
            page_size: page.size
        };

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort',
            sort);

        return this.httpService.postJson('/mediaType/list', body);
    }

    delete(mediatypes: any) {
        let mediatypeIds = [];
        mediatypes.forEach((item) => {
            mediatypeIds.push(item.media_type_id);
        });

        return this.httpService.postJson('/mediaType/delete', mediatypeIds);
    }

    all() {
        return this.httpService.get('/mediaType/all');
    }

    save(data: any) {
        return this.httpService.postJson('/mediaType/save', data)
            .pipe(map(data => {
                this.paneltoggle.next(false);

                return data;
            }));
    }

}