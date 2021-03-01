import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService, DownloadService, ContentService, UtilityService, CategoryService } from './../../../_services';
import { User, Contents, Page } from '../../../_models/index';
import { SlideInOutAnimation } from 'src/app/_animations/slide-in-out';
import { Observable, Subject, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'

@Component({
    selector: 'app-download-logs',
    templateUrl: './download-logs.component.html',
    styleUrls: ['./download-logs.component.scss'],
    animations: [SlideInOutAnimation]
})
export class DownloadLogsComponent implements OnInit, OnChanges {

    private static instanceId = 0;

    @Input() userIdInput: User;
    @Input() contentInput: Contents;

    instanceId: number = 0;

    currentUser: User = null;

    filtersVisible = false;

    // pagination
    page = new Page();
    logs: [];
    categories: [];
    content_id = null;
    brands: any[];
    user_id = null;
    loadSubject = new Subject();

    // filters
    searchContents: string = null;
    brand_id: any = null;
    category_id: any;
    privateContents: boolean = false;
    user_ids: Array<number> = null;

    // tollbar visibility
    showToolbar: boolean = false;

    // users filter
    userFilterList: Observable<any[]>;
    userFilterLoading = false;
    userFilterInput = new Subject<string>();
    userFilterSelected = <any>[];

    // sort
    sort: null;

    constructor(
        private downloadService: DownloadService,
        private contentService: ContentService,
        private utilityService: UtilityService,
        private userService: UserService,
        private categoryService: CategoryService) {
        this.instanceId = DownloadLogsComponent.instanceId++;
        this.page.offset = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.currentUser = this.utilityService.getCurrentUser();

        this.manageToolbarVisibility();

        this.brands = this.categoryService.getBrands(this.currentUser);
        
        concat(
            of([]),
            this.loadSubject.pipe(
                debounceTime(200),
                switchMap(() => this.downloadService.list(
                    this.page, this.sort, this.brand_id, this.category_id, 
                    this.user_id, this.content_id, this.searchContents, 
                    this.privateContents, this.user_ids).pipe(
                        catchError(() => of([])))
                ))
        ).subscribe(data => {
            this.logs = data.data;
            this.page.totalElements = data.total;
        });

        this.userFilterList = concat(
            of([]),
            this.userFilterInput.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.userFilterLoading = true),
                switchMap(filterValue => this.userFilterLoad(filterValue).pipe(
                    catchError(() => of([])),
                    tap(() => this.userFilterLoading = false)
                ))
            )
        );

        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.userIdInput) {
            this.user_id = this.userIdInput.user_id;
        } else {
            this.user_id = null;
        }

        if (this.contentInput) {
            this.content_id = this.contentInput.content_id;
        } else {
            this.content_id = null;
        }

        // reset page
        this.page.offset = 0;

        this.manageToolbarVisibility();

        this.loadData();
    }

    manageToolbarVisibility() {
        if (this.currentUser !== null && this.currentUser.role === 1
            && this.user_id === null) {
            this.showToolbar = true;
        } else {
            this.showToolbar = false;
        }
    }

    toggleFilters() {
        this.filtersVisible = !this.filtersVisible;
    }

    setPage(pageInfo) {
        this.page.offset = pageInfo.offset;

        this.loadData();
    }

    onSort(sortInfo) {
        this.sort = sortInfo.sorts[0];

        this.loadData();
    }

    loadData() {
        this.loadSubject.next();
    }

    userFilterLoad(filterValue: string = null): Observable<any[]> {
        if (filterValue !== null && filterValue.length >= 3) {
            return this.userService.filter(filterValue);
        }

        return of([]);
    }

    userFilterOnSearch($event) {
        // trick for update selected items
        this.utilityService.delay(1).then(any => {
            let items = [];
            for (let user of this.userFilterSelected) {
                items.push(user);
            }

            this.userFilterSelected = items;
        });
    }

    userFilterOnChange($event) {
        if ($event !== null && $event.length > 0) {
            this.user_ids = [];
            for (let user of $event) {
                this.user_ids.push(user.id);
            }
        } else {
            this.user_ids = null;
        }

        // reset page
        this.page.offset = 0;

        this.loadData();
    }

    brandFilterOnChange(brandId: any) {
        this.brand_id = (brandId === '0' ? null : parseInt(brandId));

        this.categories = [];
        if (this.brand_id !== null) {
            // load categories
            this.contentService.category(brandId).subscribe(
                (data) => {
                    this.categories = data;
                }
            );
        }        
        this.category_id = null;

        // reset page
        this.page.offset = 0;

        this.loadData();
    }

    categoryFilterOnChange(categoryId: any) {
        this.category_id = (categoryId === '0' ? null : categoryId);

        // reset page
        this.page.offset = 0;

        this.loadData();
    }

    privateFilterOnChange(privateContents: any) {
        // reset page
        this.page.offset = 0;

        this.loadData();
    }

    searchContentsOnClick() {
        // reset page
        this.page.offset = 0;

        this.loadData();
    }

    exportExcel() {
        this.downloadService.export(this.sort, this.brand_id, 
            this.category_id, this.user_id, this.content_id, 
            this.searchContents, this.privateContents, this.user_ids);
    }

}
