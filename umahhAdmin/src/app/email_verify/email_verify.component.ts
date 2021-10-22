import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { EmailVerifyService } from './services/email_verify.service';
import { httpClient } from '.././core/http.client';

import {
    NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-emailverify',
    preserveWhitespaces: false,
    templateUrl: './email_verify.component.html',
    styleUrls: ['./email_verify.component.scss'],
    providers: [
        EmailVerifyService
    ]
})
export class EmailverifyComponent {

    isEmailVerifyLoading: boolean = false;
    public verifyStatus: number = 0;
    userName:string;
    clinicName:string;
    userData:any;
    constructor(
        private emailVerifyService :EmailVerifyService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
        
    ) {}

    public ngOnInit() {
        this.isEmailVerifyLoading = true;
        this.verifyStatus = 1;
        this.activatedRoute.params.subscribe((param: any) => {
            this.emailVerifyService.verifyAccount({ verifyToken: param['id'] }).subscribe((result: any) => {
                if(result.code == 200){
                    if(result.data.data){
                        this.userData=result.data.data;
                    }
                    this.isEmailVerifyLoading = false; 
                    this.toastr.success(result.message)                                       
                }else{
                    this.isEmailVerifyLoading = false;                                        
                    this.toastr.error(result.message)                    
                }
            });
        });
    }
}