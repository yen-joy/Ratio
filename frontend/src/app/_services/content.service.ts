import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';
import { Sort, Page } from '../_models';

@Injectable()
export class ContentService {

    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) { }
    public data;    
    public newArray;    

    // my collection    
    private myCollectionSubject = new Subject();
    myCollectionSubject$ = this.myCollectionSubject.asObservable();

    // search content
    private searchResult = new Subject();
    searchResult$ = this.searchResult.asObservable();
    private searchResultPaneltoggle = new Subject();
    searchResultPaneltoggle$ = this.searchResultPaneltoggle.asObservable();

    search(mediaType: string, searchText: string) {
        return this.httpService.postJson('/content/search', {            
            searchText: searchText,
            mediaType: mediaType
        }).pipe(map(data => {
            this.searchResult.next(data);
            this.searchResultPaneltoggle.next(false);

            return data;
        }));
    }

    list(page: Page, sort: Sort, brand_id, category_id, searchContents,
        privateContents) {
        let body = {
            page: page.offset + 1,
            page_size: page.size
        };

        // merge filters
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'brand_id',
            brand_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'category_id',
            category_id);
        this.utilityService.mergePropertyToObjectIfNotNull(body,
            'searchContents', searchContents);
        this.utilityService.mergePropertyToObjectIfNotNull(body,
            'privateContents', privateContents);

        // merge sort
        this.utilityService.mergePropertyToObjectIfNotNull(body, 'sort', sort);

        return this.httpService.postJson('/content/list', body);
    }

    details(id: any) {
        return this.httpService.postJson('/content/details', {
            'content_id': id
        });
    }

    delete(content_id: any) {
        return this.httpService.postJson('/content/delete', content_id);
    }    

    category(brand = null) {
        let url = '/category/tree';        
        if (brand !== null) {
            url += '/' + brand;
        }

        return this.httpService.get(url);
    }

    save(arrayValue: FormData) {
        return this.httpService.uploadFile('/content/save', arrayValue);
    }

    getMyCollection() {
        return this.httpService.get('/content/myCollection').pipe(map(
            data => {                
                this.myCollectionSubject.next(data);

                return data;
            }
        ));
    }

    addToMyCollection(content_id: any) {
        return this.httpService.postJson('/content/addToMyCollection', {
            content_id: content_id
        }).pipe(map(data => {            
            this.myCollectionSubject.next(data);

            return data;
        }));
    }

    removeFromMyCollection(content_id: any) {
        return this.httpService.postJson('/content/removeFromMyCollection', {
            content_id: content_id
        }).pipe(map(data => {            
            this.myCollectionSubject.next(data);

            return data;
        }));
    }    

    download(content_ids) {
        this.httpService.downloadFile('/content/download', {
            content_id: content_ids
        });
    }

}
