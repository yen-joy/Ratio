import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { AccessesService, UserService, UtilityService } from './../../../_services';
import { Page } from 'src/app/_models';

@Component({
  selector: 'app-accesses-logs',
  templateUrl: './accesses-logs.component.html',
  styleUrls: ['./accesses-logs.component.scss']
})
export class AccessesLogsComponent implements OnInit {
  // pagination
  page = new Page();  
  logs: any;  
  loadSubject = new Subject();

  // users filter
  userFilterList: Observable<any[]>;
  userFilterLoading = false;
  userFilterInput = new Subject<string>();
  userFilterSelected = <any>[];
  user_ids: Array<number> = null;

  // sort
  sort: null;

  constructor(
    private accessesService: AccessesService,
    private userService: UserService,
    private utilityService: UtilityService) {
    this.page.offset = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    concat(
      of([]),
      this.loadSubject.pipe(
        debounceTime(200),
        switchMap(() => this.accessesService.accessesLogs(
          this.page, this.sort, this.user_ids).pipe(
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

  setPage(pageInfo){
    this.page.offset = pageInfo.offset;

    this.loadData();
  }  

  onSort(sortInfo){
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

  exportExcel() {
    this.accessesService.exportExcel(this.sort, this.user_ids);
  }

}
