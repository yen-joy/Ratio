import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Anonymous, StatesService } from './../../_services/index';
import { RegistrationRequest } from '../../_models/registrationrequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.scss']
})
export class ManageRequestsComponent implements OnInit, OnChanges {

  @Input() userIdInput: any;

  f: FormGroup;
  userDetails;
  states;

  constructor(
    private formBuilder: FormBuilder,    
    private statesService: StatesService,
    private anonymous: Anonymous, private toastr: ToastrService) {
    this.states = this.statesService.getAllStates();
  }

  ngOnInit() {
    this.userDetails = new RegistrationRequest();
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      user_hash: [null, [Validators.minLength(6)]],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company: [null, [Validators.required]],
      state: [null],
      is_corporate: [null],
      role: [null],
      active: [null],
      enable: [null],
      read_only: [null],
      natuzzi_access: [null],
      editions_access: [null],
      notes: [null],
      registration_request_id: [null],
      user_id: [null]
    });

    if (this.userIdInput !== undefined && this.userIdInput !== null) {      
      this.f = this.formBuilder.group(this.userIdInput);
    }
    this.userDetails = this.f.value;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userDetails = this.userIdInput;    
  }

  onSubmit() {
    this.anonymous.save(this.f.value).subscribe(
      (data) => {
        if (this.f.value.enable === 1) {
          this.toastr.success("User Approved");
        } else {
          this.toastr.success("User Updated");
        }        
      });
  }

}
