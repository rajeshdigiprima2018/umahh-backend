import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CaseAdminForgotUserComponent } from "./component/forgot-user.component";
// import { AutoCompleteModule, InputMaskModule, DropdownModule, ConfirmDialogModule, DialogModule, ConfirmationService } from 'primeng/primeng';
import { FormsModule }   from '@angular/forms';

import { CaseAdminLoginRoutingModule } from "./login-routing.module";
import { CaseAdminLoginComponent } from "./component/login.component";
import { CaseAdminForgotComponent } from "./component/forgot_password.component";

//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        CaseAdminLoginRoutingModule,
        // DropdownModule,
        // InputMaskModule,
        // ConfirmDialogModule,
        // DialogModule,
        FormsModule
    ],//NgbModule
    declarations:
    [
        CaseAdminLoginComponent,
        CaseAdminForgotComponent,
        CaseAdminForgotUserComponent
    ],
    providers: [
        // ConfirmationService
    ]
})
export class CaseAdminLoginModule {

}