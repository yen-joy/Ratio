import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../../layout/slide-panel/slide-panel.component';
import { ContentService, UtilityService, CategoryService } from './../../../_services/index';
import { Contents, Page } from '../../../_models/index';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, of, concat } from 'rxjs';
import { debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { SlideInOutAnimation } from 'src/app/_animations/slide-in-out';

@Component({
  selector: 'app-media-items-list',
  templateUrl: './media-items-list.component.html',
  styleUrls: ['./media-items-list.component.scss'],
  animations: [SlideInOutAnimation]
})
export class MediaItemsListComponent implements OnInit {
  @ViewChild('viewdownlogsPanel') viewdownlogsPanel: SlidePanelComponent;

  filtersVisible = false;

  // pagination
  page = new Page();
  contents: any;
  brands: any[];
  categories: [];
  loadSubject = new Subject();

  // sort
  sort: null;

  // selection
  selected = [];

  // filters  
  searchContents: string = null;
  brand_id: any = null;
  category_id: any;
  privateContents: boolean = false;

  // edit
  contentInput: Contents;

  constructor(
    private contentService: ContentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService,
    private categoryService: CategoryService) {

    this.page.offset = 0;
    this.page.size = 10;

    let currentUser = this.utilityService.getCurrentUser();

    this.brands = this.categoryService.getBrands(currentUser);

    concat(
      of([]),
      this.loadSubject.pipe(
        debounceTime(200),
        tap(() => this.spinner.show()),
        switchMap(() => this.contentService.list(this.page,
          this.sort, this.brand_id, this.category_id, this.searchContents,
          this.privateContents).pipe(
            catchError(() => of([])),
            tap(() => this.spinner.hide()),
          )))
    ).subscribe(data => {
      this.contents = data.data;
      this.page.totalElements = data.total;
    });
  }

  ngOnInit() {
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

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  downloadlogs(content) {
    this.contentInput = content;
    this.viewdownlogsPanel.open();
  }

  setPage(pageInfo) {
    this.page.offset = pageInfo.offset;

    this.loadData();
  }

  onSort(sortInfo) {
    this.sort = sortInfo.sorts[0];

    // reset page
    this.page.offset = 0;

    this.loadData();
  }

  loadData() {
    this.loadSubject.next();
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  categoryFilterOnChange(categoryId: any) {
    this.category_id = (categoryId === '0' ? null : categoryId);

    // reset page
    this.page.offset = 0;

    this.loadData();
  }

  searchContentsOnClick() {
    if (this.searchContents !== null && this.searchContents.trim() === '') {
      this.searchContents = null;
    }

    // reset page
    this.page.offset = 0;

    this.loadData();
  }

  privateFilterOnChange(privateContents: any) {
    this.privateContents = privateContents;

    // reset page
    this.page.offset = 0;

    this.loadData();
  }

  delete() {
    if (this.selected.length > 0) {
      this.contentService.delete(this.selected).subscribe(
        (data) => {          
          this.toastr.success("Content Deleted Successfully");

          this.loadData();
        });
    } else {
      this.toastr.error('Please select User');
    }
  }

}
