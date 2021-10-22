import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AuthGuard } from '../../core/guards/admin-auth.guard';
import { AdminDashboardComponent } from '../modules/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        // canActivateChild: [AuthGuard],
        // children: [
            // {
            //     path: 'practices',
            //     loadChildren: './../modules/practice/practice.module#PracticeModule',
            // },
            // {
            //     path: 'users',
            //     loadChildren: './../modules/users/users.module#UsersModule',
            // },
            // {
            //     path: 'patients-list',
            //     loadChildren: './../modules/all-patient-list/all-patient-list.module#AllPatientListModule',
            // },
            // {
            //     path: 'preferences',
            //     loadChildren: './../modules/preferences/preferences.module#WicareAdminPreferencesModule',
            // },
            // {
            //     path: 'healthcare-blog',
            //     loadChildren: './../modules/healthcare-blog/healthcare-blog.module#HealthcareBlogModule',
            // },
            // {
            //     path: 'staff-users',
            //     loadChildren: './../modules/admin-staff/admin-staff.module#AdminStaffModule',
            // },
            // {
            //     path: 'roles-permission',
            //     loadChildren: './../modules/roles-permissions/role-permission.module#RolePermissionModule',
            // },
            // {
            //     path: 'pharmacy',
            //     loadChildren: './../modules/pharmacy/pharmacy.module#PharmacyModule',
            // },
        //     {
        //         path: '',
        //         component: AdminDashboardComponent,
        //     }
        // ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminLayoutRoutingModule {

}