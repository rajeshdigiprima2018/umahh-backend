import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { appConfig } from '../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ChangePasswordService } from './service/change-password.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../../login/services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  loggedInUserDetails: any = '';
  changePasswordForm:FormGroup;
  isLoading: boolean = false;
  submitted = false;
  constructor(private localSt: LocalStorageService,
              private formBuilder: FormBuilder,
              private changePasswordService:ChangePasswordService,
              private toastr: ToastrService,
              private router:Router,
              private loginService: LoginService) { }

  ngOnInit() {

    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);

    //let newPassword = new FormControl('', [Validators.required, Validators.maxLength(appConfig.password.maxLength),Validators.minLength(appConfig.password.minLength)]);
    //let newRepassword = new FormControl('', [Validators.required, CustomValidators.equalTo(newPassword)])

    this.changePasswordForm = this.formBuilder.group({
      old_password:['',[Validators.required]],
      new_password: ['',[Validators.required]],
     // newRepassword: newRepassword,
      email:[this.loggedInUserDetails.email],
      action: ['reset_password'],
      locale: ['en']
    })
  }
  get f() { return this.changePasswordForm.controls; }
  changePassword(){
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.changePasswordService.changePassword(this.changePasswordForm.value).subscribe(res => {
      this.isLoading = false;
      if(res.success){
        this.toastr.success(res.message)
        this.loginService.logout();
        this.router.navigate([''])
      }else{
        //this.toastr.error(appConfig.err.someThing);
        this.toastr.error('Old password does not match');
        this.changePasswordForm.reset();
      }
    });
  }
}
