import { Component, OnInit, OnDestroy } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder, Validators,FormControl, NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from './services/reset-password.service';
import { MessageService } from 'primeng/api';
import { appConfig } from '../core/app.config';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [routerTransition()]
})
export class ResetPasswordComponent implements OnInit {
  isLoading : boolean = false;
  resetForm: FormGroup;
  subscriber;
  public userId: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService,
    private alertService: MessageService,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
    });
    let password = new FormControl('', [Validators.required, Validators.maxLength(appConfig.password.maxLength),Validators.minLength(appConfig.password.minLength)]);
    let confirmPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)])
    this.resetForm = this.formBuilder.group({
      password: password,
      confirmPassword: confirmPassword
    });

    // this.subscriber = this.resetForm.valueChanges.subscribe(val => {
    //   let password = val.password ? val.password : '';
    //   let confirmPassword = val.confirmPassword ? val.confirmPassword : '';
    //   if (password && confirmPassword && confirmPassword == password)
    //     this.resetForm.controls.confirmPassword.setErrors(null);
    //   else
    //     this.resetForm.controls.confirmPassword.setErrors({ 'passwordMissmatch': true });
    // })
  }

  resetPassword() {
    this.isLoading = true;
    let data = {
      resetkey: this.userId,
      password: this.resetForm.value.confirmPassword
    };
    this.resetService.resetPassword(data)
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.code == 200) {
          // this.alertService.add({ severity: 'success', summary: ' Message', detail: 'Password reset successfully' });
          this.toastr.success(res.message);
          this.router.navigate(['/login'])
        } else {
          this.toastr.error(res.message);
          // this.alertService.add({ severity: 'failed', summary: ' Message', detail: 'ghffgfhfhjgjf' });
        }
      })

  }
  // ngOnDestroy() {
  //   this.subscriber.unsubscribe();
  // }
}
