import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { AddUserAdminComponent } from './user-admin/add-user-admin/add-user-admin.component';
import { UserComponent } from './user/user.component';

import { MosqueComponent } from './mosque/mosque.component';
import { BusinessComponent } from './business/business.component';
import { ChatComponent } from './twilio/chat.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'userDetails', loadChildren: './users/users.module#UsersModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'manageMosque', loadChildren: './manage-mosque/manage-mosque.module#ManageMosqueModule' },
            { path: 'emailTemplate', loadChildren: './email-template/email-template.module#EmailTemplateModule' },
            { path: 'userDetails/:id', loadChildren: './users/users.module#UsersModule' },
            { path: 'manageRole', component : ManageRoleComponent },
            { path: 'twiliochat', component : ChatComponent},
            { path: 'changePassword', component : ChangePasswordComponent},
            { path: 'user-admin', component : UserAdminComponent},
            { path: 'add-user-admin', component : AddUserAdminComponent},
            { path: 'user', component : UserComponent},
            { path: 'mosque', component : MosqueComponent},
            { path: 'business', component : BusinessComponent}



        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
