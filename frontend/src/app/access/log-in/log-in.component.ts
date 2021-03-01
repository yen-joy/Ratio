import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../layout/slide-panel/slide-panel.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from './../../_services/index';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  providers: [AuthenticationService]
})
export class LogInComponent implements OnInit {
  @ViewChild('remindPanel') remindPanel: SlidePanelComponent;
  @ViewChild('resetPanel') resetPanel: SlidePanelComponent;
  @ViewChild('changePanel') changePanel: SlidePanelComponent;
  @ViewChild('registrationPanel') registrationPanel: SlidePanelComponent;

  f: FormGroup;
  returnUrl: string;
  name: string;
  isActive = false;
  show = 0;
  subscription: Subscription;
  currentStatus = 0;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

    this.subscription = authenticationService.paneltoggle$.subscribe(val => {
      this.show = (val) ? 1 : 0;
      if (this.show == 1) {
        this.registrationPanel.open();
      } else {
        this.registrationPanel.close();
        this.currentStatus = 0;
      }
    });

    this.subscription = authenticationService.toggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
        this.resetPanel.open();
      } else {
        this.resetPanel.close();
      }
    })

    route.queryParams.subscribe(params => {
      this.name = params['name']
    })
  }

  ngOnInit() {
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.minLength(4)]],
      user_hash: [null, [Validators.required]]
    });

    // reset login status
    this.authenticationService.logout();

    this.route.params.subscribe(params => {
      if (params.key) {
        this.authenticationService.emailvalidate(params.key).subscribe(
          (data) => {
            this.currentStatus = 1;
            this.toastr.success('Email verified successfuly');
          }
        );
      }
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/groups';
  }

  onSubmit() {
    this.authenticationService.login(this.f.value.email,
      this.f.value.user_hash).subscribe((data) => {
        this.toastr.success('Login', "Login success");
        this.router.navigate([this.returnUrl]);
      });
  }

}
