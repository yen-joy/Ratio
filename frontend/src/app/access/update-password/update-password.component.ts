import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../_services/index';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  f: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.f = this.formBuilder.group({
      password: [null, [Validators.required]],
      cpassword: ['']
    }, { validator: [this.checkPasswords] });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.cpassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {
    this.userService.updatePassword(this.f.value.password).subscribe(
      (data) => {
        this.toastr
          .success('successfully your password updated, please login again');

        this.router.navigate(['/sign-in']);
      });
  }

}
