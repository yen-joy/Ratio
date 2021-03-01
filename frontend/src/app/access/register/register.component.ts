import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, StatesService } from './../../_services/index';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  f: FormGroup;
  c_a = "CREATE AN ACCOUNT";
  returnUrl: string;
  public states: States[];
  isActive = false;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private statesService: StatesService,
    private toastr: ToastrService) {
    this.states = this.statesService.getAllStates();
  }
  idd = "1";

  ngOnInit() {
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      confirm_email: [''],
      user_hash: [null, [Validators.required, Validators.minLength(6)]],
      confirm_user_hash: [''],
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      company: [null, [Validators.required]],
      state: [null, [Validators.required]],
      is_corporate: [null],
      natuzzi_access: [null],
      editions_access: [null],
      agreed: [null, [Validators.required]]
    }, { validator: [this.checkPasswords, this.checkEmail] });

    // reset login status
    this.authenticationService.logout();
    this.states = this.statesService.getAllStates();
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.user_hash.value;
    let confirmPass = group.controls.confirm_user_hash.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  checkEmail(group: FormGroup) { // here we have the 'passwords' group
    let email = group.controls.email.value;
    let confirmemail = group.controls.confirm_email.value;

    return email === confirmemail ? null : { notSameemail: true }
  }

  onSubmit() {
    this.c_a = "Submiting...";
    this.authenticationService.register(this.f.value).subscribe(
      (data) => {
        this.toastr.success("Registration request successfuly sent");       
      },      
      err => {},
      () => {
        this.c_a = "CREATE AN ACCOUNT";
        this.router.navigate(['sign-in']);
      }
    );
  }

}

interface States {
  name: string;
  code: string;
}