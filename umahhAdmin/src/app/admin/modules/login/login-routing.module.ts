import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CaseAdminLoginComponent } from "./component/login.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AlertModule } from 'ngx-bootstrap/alert';
// import { CheckboxModule } from 'primeng/primeng';

import { CaseAdminForgotComponent } from "./component/forgot_password.component";
// import { AutoCompleteModule,DropdownModule } from 'primeng/primeng';
import { CaseAdminForgotUserComponent } from "./component/forgot-user.component";

const routes: Routes = [
    { path: '', component: CaseAdminLoginComponent },
    { path: 'forgot_password', component: CaseAdminForgotComponent },
    { path: 'forgot-user',component: CaseAdminForgotUserComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        // CheckboxModule,
        // AlertModule,
        // AutoCompleteModule,
        // DropdownModule
    ],
    exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // CheckboxModule,
        // AlertModule,
        // AutoCompleteModule,
        // DropdownModule
    ]

})
export class CaseAdminLoginRoutingModule {

}