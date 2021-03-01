import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject, pipe } from 'rxjs';
import { Categories, User } from '../_models';
import { HttpService } from '../_services/http.service';
import { UtilityService } from '../_services/utility.service';

@Injectable()
export class CategoryService {
    constructor(
        private httpService: HttpService,
        private utilityService: UtilityService) { }

    private paneltoggle = new Subject();
    paneltoggle$ = this.paneltoggle.asObservable();

    getChild(cat_id: number) {
        return this.httpService.get('/category/childs/' + cat_id);
    }

    getBybrand(id: any) {
        return this.httpService.get('/category/brand/' + id);
    }

    details(id: number) {
        return this.httpService.get('/category/details/' + id);
    }

    save(categories: Categories, parentId: any, imageFile: File) {
        const formData = new FormData();
        this.utilityService.appendObjectToFormData(categories, formData);
        if (parentId !== undefined && parentId !== null) {
            formData.append("parentId", parentId);
        }
        if (imageFile !== null) {
            formData.append("imageFile", imageFile, imageFile.name);
        }

        return this.httpService.postForm('/category/save', formData)
            .pipe(map(data => {
                this.paneltoggle.next(false);

                return data;                
            }));
    }

    deleteCategory(id: any) {
        return this.httpService.postJson('/category/delete', id);
    }

    getBrands(user: User, forView = false) {
        let brands = [];

        let allBrands = false;
        if (forView === false || user.role === 1) {
            allBrands = true;
        }        

        if (allBrands === true || user.natuzzi_access === 1) {
            brands.push({
                'id': 1,
                'label': 'Natuzzi Italia',
                'userPermission': 'natuzzi_access',
                'navigationId': 'natuzzi'
            });
        }
        if (allBrands === true || user.editions_access === 1) {
            brands.push({
                'id': 2,
                'label': 'Natuzzi Editions',
                'userPermission': 'editions_access',
                'navigationId': 'editions'
            })
        }

        return brands;
    }

    getBrandByNavigationId(navigationId: string, user: User, forView = false) {
        let brands = this.getBrands(user, forView);

        for(var brand of brands) {
            if (brand.navigationId === navigationId) {
                return brand.id;
            }
        }

        return null;
    }    

}
