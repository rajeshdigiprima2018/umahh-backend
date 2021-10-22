import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from "./admin.component";
import { AuthGuard } from '../core/guards/admin-auth.guard';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                loadChildren: './admin-layout/admin-layout.module#AdminLayoutModule',
                canActivateChild: [AuthGuard]
            },
            {
                path: 'login',
                loadChildren: './modules/login/login.module#CaseAdminLoginModule'
            }          
        ]
    }
]


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
    ],
     exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ]

})
export class AdminRoutingModule {

}