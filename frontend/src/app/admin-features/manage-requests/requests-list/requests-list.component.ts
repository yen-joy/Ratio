import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../../layout/slide-panel/slide-panel.component';
import { Anonymous } from './../../../_services/index';
import { Subscription, Subject, of, concat } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../../../_models';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent implements OnInit {

  @ViewChild('mngrequestsPanel') mngrequestsPanel: SlidePanelComponent;

  @ViewChild('requestsTable') requestsTable: any;

  // pagination
  page = new Page();
  requests: any;
  loadSubject = new Subject();

  // sort
  sort: null;

  // selection  
  selected = [];

  // filter
  statuses;
  status;

  // edit 
  userIdInput: any;
  subscription: Subscription;
  isActive = false;

  constructor(
    private anonymous: Anonymous,
    private toastr: ToastrService) {

    this.page.offset = 0;
    this.page.size = 10;

    this.subscription = anonymous.paneltoggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
        this.mngrequestsPanel.open();
      } else {
        this.mngrequestsPanel.close();
        this.loadData();
      }
    })
  }

  ngOnInit() {
    this.statuses = [{ "value": "", "name": "All" }, {
      "value": "0",
      "name": "On Hold"
    }, { "value": "1", "name": "Approved" },
    { "value": "2", "name": "Rejected" }];

    concat(
      of([]),
      this.loadSubject.pipe(
        debounceTime(200),
        switchMap(() => this.anonymous.list(
          this.page, this.sort, this.status).pipe(
            catchError(() => of([])))
        ))
    ).subscribe(data => {
      this.requests = data.data;
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

  displayCheck(row) {
    return row.status !== 1;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);

    for (let selectedItem of selected) {
      if (selectedItem.status !== 1) {
        this.selected.push(selectedItem);
      }
    }    
  }  

  onFilter(newValue) {
    this.status = newValue;

    // reset page
    this.page.offset = 0;

    this.loadData();
  }

  edit(user) {
    this.userIdInput = user;
    this.mngrequestsPanel.open();
  }

  delete() {
    if (this.selected.length > 0) {
      this.anonymous.delete(this.selected).subscribe(
        (data) => {
          this.toastr.success(
            'Registration Request User Deleted Successfully');
          this.loadData();
          this.selected = [];
        });
    }
  }

}
