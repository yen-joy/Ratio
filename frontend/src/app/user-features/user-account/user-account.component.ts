import { Component, OnInit, Input } from '@angular/core';
import { UserService, StatesService } from '../../_services/index';
import { UtilityService } from './../../_services/index';
import { User } from '../../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {

  @Input() User: User  
  states;

  constructor(
    private userService: UserService,
    private statesService: StatesService,
    private utilityService: UtilityService,
    private toastr: ToastrService, ) {
    this.states = this.statesService.getAllStates();
  }

  ngOnInit() {
    this.User = new User()
    let currentUser = this.utilityService.getCurrentUser();
    this.userService.details(currentUser.user_id).subscribe(data => {
      this.User = data;
    });
  }

  onSubmit() {
    this.userService.update(this.User).subscribe(data => {
      this.toastr.success("User Details Updated");
    });
  }

}
