import { Component, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from './services/login.service';


declare var jQuery: any;
@Component({
    selector: 'caseadmin-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class CaseAdminLoginComponent {

  
     loginForm: FormGroup;
    constructor(
        public router: Router,
        private loginService: LoginService,
        private formBuilder: FormBuilder,
    ) { 

    console.log("..login component.....................first")

    }

   


    ngOnInit() {
         this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
            practice_id: [''],
            practice_name: [''],
        });
    }

    
    login() {
        console.log(this.loginForm)
        if (this.loginForm.invalid) {
            Object.keys(this.loginForm.controls).forEach((formControl: any) => {
                this.loginForm.controls[formControl].markAsDirty();
            })
        } else {
            let postData = this.loginForm.value;
           
        }
    }

}
