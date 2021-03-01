import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './../../_services/index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  f: FormGroup;
  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService, 
    private toastr: ToastrService) { }

  ngOnInit() {
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.authenticationService.resetpass(this.f.value.email).subscribe(
      (data) => {
        this.toastr.success(
          "An email with your new password has been sent to you, please check your email.");
      });
  }

}
