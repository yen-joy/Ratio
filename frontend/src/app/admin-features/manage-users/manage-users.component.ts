import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, StatesService } from './../../_services/index';
import { User } from '../../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnChanges {

  @Input() userIdInput: User;

  // update user
  isUpdate = false;

  f: FormGroup;
  public error;
  public success;
  userDetails: User;
  user_id: number;
  states: any;
  dropdownSettings;
  selectedItems = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private statesService: StatesService, 
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef) {

    this.states = this.statesService.getAllStates();
    this.selectedItems = this.states;    
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (this.userIdInput !== undefined && this.userIdInput !== null) {
        this.isUpdate = true;
        this.userDetails = this.userIdInput;
        this.selectedItems = this.selectedstates(this.userIdInput.access_country);
      } else {
        this.isUpdate = false;
        this.userDetails = new User;
      }
      this.cdRef.detectChanges();
    });    
  }

  ngOnInit() {
    this.states = this.statesService.getAllStates();
    this.selectedItems = this.states;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'code',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      user_hash: [null, [Validators.minLength(6)]],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company: [null, [Validators.required]],
      state: [null, [Validators.required]],
      is_corporate: [null],
      role: [null],
      enable: [null],
      read_only: [null],
      ldap_flag: [null],
      natuzzi_access: [null],
      editions_access: [null],
      admin_natuzzi_access: [null],
      admin_editions_access: [null],
      access_country: [null],
      notes: [null],
      user_id: [null]
    }, { validator: this.checkAdminsetting });

    if (this.userIdInput !== undefined && this.userIdInput !== null) {
      this.f = this.formBuilder.group(this.userIdInput);
    }
    this.userDetails = this.f.value;    
  }

  onItemSelect(item: any) {

  }

  onSelectAll(items: any) {

  }

  selectedstates(str: any) {
    var sel = (str) ? str.split(',') : [];
    var data = [];
    this.states.filter(element => {
      if (sel.indexOf(element.code) > -1) {
        data.push(element);
      }
    });

    return data;
  }

  checkAdminsetting(group: FormGroup) { // here we have the 'passwords' group
    let role = group.controls.role.value;
    if (role == 1) {
      return ((group.controls.admin_natuzzi_access.value == 1 ||
        group.controls.admin_editions_access.value == 1) &&
        (group.controls.access_country.value &&
          group.controls.access_country.value.length > 0))
        ? null : { isAdmindetailsrequired: true }
    }
  }

  updateUser() {
    this.userService.save(this.f.value).subscribe(
      (data) => {        
        if (this.isUpdate === true) {
          this.toastr.success("User Details Successfully Updated");        
        } else {
          this.toastr.success("New User Successfully Register");        
        }        
      }
    );
  }

}
