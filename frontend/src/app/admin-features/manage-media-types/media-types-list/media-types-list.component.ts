import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../../layout/slide-panel/slide-panel.component';
import { MediaService } from '../../../_services/index';
import { MediaTypes, Page } from '../../../_models';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject, of, concat } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-media-types-list',
  templateUrl: './media-types-list.component.html',
  styleUrls: ['./media-types-list.component.scss']
})
export class MediaTypesListComponent implements OnInit {
  @ViewChild('mngmediatypesPanel') mngmediatypesPanel: SlidePanelComponent;

  // pagination
  page = new Page();
  mediatypes: any;
  loadSubject = new Subject();

  // sort
  sort: null;

  // selection  
  selected = [];

  // edit 
  mediaType = new MediaTypes;
  subscription: Subscription;
  isActive = false;

  constructor(
    private mediaService: MediaService,
    private toastr: ToastrService) {      
    this.page.offset = 0;
    this.page.size = 10;
  }  

  ngOnInit() {
    this.subscription = this.mediaService.paneltoggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
        this.mngmediatypesPanel.open();
      } else {
        this.mngmediatypesPanel.close();
        this.loadData();
      }
    });

    concat(
      of([]),
      this.loadSubject.pipe(
        debounceTime(200),
        switchMap(() => this.mediaService.list(
          this.page, this.sort).pipe(
            catchError(() => of([])))
        ))
    ).subscribe(data => {
      this.mediatypes = data.data;
      this.page.totalElements = data.total;
    });

    this.loadData();
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

  edit(media) {
    this.mediaType = media;
    this.mngmediatypesPanel.open();
  }

  delete() {
    if (this.selected.length > 0) {
      this.mediaService.delete(this.selected).subscribe(
        (data) => {
          this.toastr.success("Mediatype Deleted Successfully");
          this.loadData();         
          this.selected = [];             
        });
    }
  }

  create() {
    this.mediaType = new MediaTypes;
    this.mngmediatypesPanel.open();
  }

}
