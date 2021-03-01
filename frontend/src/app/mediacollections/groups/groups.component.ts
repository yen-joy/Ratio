import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilityService } from '../../_services/index';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  currentUser: User;

  constructor(
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService) {
    this.currentUser = this.utilityService.getCurrentUser();
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

}
