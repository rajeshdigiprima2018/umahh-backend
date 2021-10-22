import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from "@angular/forms";
import { appConfig } from '../core/app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from './services/forgot-password.service';
// import { MessageService } from 'primeng/api';
import { routerTransition } from '../router.animations';
import { MessageService } from 'primeng/components/common/messageservice';
import {Location} from '@angular/common';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent implements OnInit {
  isLoading : boolean = false;
  forgotPasswordForm: FormGroup;
  localStorageService: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private forgotService: ForgotPasswordService,
    private alertService: MessageService,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]],
      action: ['forgot_password'],
      locale: ['en']
    });
  }

  forgotPassword() {
    this.isLoading = true;
    console.log('helloo',this.forgotPasswordForm.value);
    this.forgotService.forgotPassword(this.forgotPasswordForm.value)
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res) {
          this.toastr.success(res.message);
         
          this._location.back();
        } else {
          this.toastr.error(res.message);
         
          this._location.back(); 
          
        }
      })
  }
}
