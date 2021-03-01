import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../../layout/slide-panel/slide-panel.component';
import { UserService, StatesService } from './../../../_services/index';
import { User } from '../../../_models/user';
import { Page } from '../../../_models/page';
import { Subscription, Subject, of, concat } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  @ViewChild('mnguserPanel') mnguserPanel: SlidePanelComponent;

  @ViewChild('viewdownlogsPanel') viewdownlogsPanel: SlidePanelComponent;

  userIdInput: User;
  statuses; 
  countries;
  brands;  
  subscription: Subscription;
  isActive = false;

  // pagination
  page = new Page();
  users: any;
  loadSubject = new Subject();

  // filters
  brandValue; 
  statusValue; 
  countryCode;

  // sort
  sort: null;  

  constructor(
    private userService: UserService,
    private statesService: StatesService) {

    this.page.offset = 0;
    this.page.size = 10;

    this.subscription = userService.paneltoggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
        this.mnguserPanel.open();
      } else {
        this.mnguserPanel.close();
        this.loadData();
      }
    })

    this.countries = this.statesService.getAllStates();
  }

  ngOnInit() {
    this.brands = [{ "value": "", "name": "All" },
      { "value": "1", "name": "Natuzzi Italia" },
      { "value": "2", "name": "Natuzzi Editions" }];
    this.statuses = [{ "value": "", "name": "All" },
      { "value": "1", "name": "Active" },
      { "value": "0", "name": "Inactive" }];

    concat(
      of([]),
      this.loadSubject.pipe(
        debounceTime(200),
        switchMap(() => this.userService.list(this.page, this.sort,
          this.statusValue, this.brandValue, this.countryCode).pipe(
            catchError(() => of([])))
        ))
    ).subscribe(data => {
      this.users = data.data;
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

  onBrand(newValue) {
    this.brandValue = newValue;

    // reset page
    this.page.offset = 0;
    
    this.loadData();
  }

  onStatus(newValue) {
    this.statusValue = newValue;

    // reset page
    this.page.offset = 0;
    
    this.loadData();
  }

  onCountry(newValue) {
    this.countryCode = newValue;

    // reset page
    this.page.offset = 0;
    
    this.loadData();
  }

  edit(user) {
    this.userIdInput = user;

    this.mnguserPanel.open();
  }

  downloadlogs(user) {
    this.userIdInput = user;

    this.viewdownlogsPanel.open();
  }

  newuser() {
    this.userIdInput = new User;

    this.mnguserPanel.open()
  }

}
