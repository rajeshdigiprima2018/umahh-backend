import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginService } from './services/login.service';
import { FormGroup, FormBuilder, Validators, NgForm} from "@angular/forms";
import { appConfig } from '../core/app.config';
import { ToastrService } from 'ngx-toastr';
import { UserComponentService } from '../layout/users/services/user-component.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers: [
        LoginService
    ]
})
export class LoginComponent implements OnInit {
    isLoading: boolean = false;
    loginForm: FormGroup;
    hideReg: boolean = false;
    isUrl: boolean = false;
    loggedInUserDetails: any;
    userId: any;
    clinicList: any;
    constructor(
        public router: Router,
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        public ElementRef: ElementRef,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        public userService: UserComponentService,
        public localStorageService: LocalStorageService,       

    ) { }

    ngOnInit() {
        if (this.router.url != '/login') {
            this.hideReg = true;
            if (this.activatedRoute.snapshot.params.user_id) {
                this.getUserDetails(this.activatedRoute.snapshot.params.user_id);
            } else {
                if (this.activatedRoute.snapshot.params.clinic_id) {
                    this.isUrl = true;
                }
            }
        }
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]],
            password: ['', [Validators.required]]
            
        });
    
        this.getAdminDashboardList();
    }

    getBlockableElement(): HTMLElement {
        return this.ElementRef.nativeElement.children[0];
    }

    public getAdminDashboardList() {
       
    }

    login() {
        this.localStorageService.clear();
        this.isLoading = true;
        //this.loginForm.value.rememberme = true;
        let pwd = this.loginForm.get('password'); 
        var isNew = this.loginForm.value.password.search("@M");
        this.loginService.userLogin(this.loginForm.value).subscribe((result: any) => {
           
            this.isLoading = false;

            if (result && result.code == 200 && result.data.isUpdated =='0' && (result.data.role =='mosque' || result.data.role =='business')) {
                this.router.navigate(['layout/profile/editprofile']);
                //this.toastr.success('Please updated your complete details');               
            }
            else if(result && result.code == 200 &&  result.data.avtar !=='null' && result.data.isUpdated =='1' && (result.data.role =='admin' || result.data.role =='mosque' || result.data.role =='business')){
                this.router.navigate(['layout/dashboard']);
            }
            else if (result && result.code == 401) {
                this.toastr.warning(result.message);
                this.router.navigate(['']);
            }else{
                this.toastr.warning('You have not authenticated user');
                this.loginForm.reset();
                this.router.navigate(['/']);

            }
        })

    }

    getUserDetails(id) {
        this.userService.getUserDetails(id).subscribe(res => {
            if (res.code == 200 || res.code == '200') {
                this.loginForm.patchValue({
                    email: res.data[0].email
                })
            } else {
                this.toastr.warning(res.message);
            }
        });
    }

    redirect() {
        let str;
        if (this.activatedRoute.snapshot.params.user_id) {
            str = '/fillQuestionnaire/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id + '/' + this.activatedRoute.snapshot.params.user_id;
        } else {
            str = '/fillQuestionnaire/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id
        }
        this.router.navigateByUrl(str);
    }
    redirectForgot() {
        let str;
        if (this.activatedRoute.snapshot.params.user_id) {
            str = '/ForgotPassword/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id + '/' + this.activatedRoute.snapshot.params.user_id;
        } else {
            str = '/ForgotPassword/' + this.activatedRoute.snapshot.params.clinic_id + '/' + this.activatedRoute.snapshot.params.survey_id
        }
        this.router.navigateByUrl(str);
    }
   
    public resolved(captchaResponse: string) {
      }
}