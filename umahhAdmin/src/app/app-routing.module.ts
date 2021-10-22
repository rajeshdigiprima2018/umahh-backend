import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { CaseAdminLoginComponent } from "./admin/modules/login/component/login.component";
import { EmailverifyComponent } from "./email_verify/email_verify.component";
import { HomeComponent } from "./home_page/home_page.component";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ContactComponent } from './contact/contact.component';


const routes: Routes = [

    { path: 'layout', loadChildren: './layout/layout.module#LayoutModule',canActivate: [AuthGuard] },
    // { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
    { path: 'admin', loadChildren: './admin/admin.module#CaseManagementAdminModule' },
    { path: '', loadChildren: './login/login.module#LoginModule' },
    { path: 'login/:clinic_id/:survey_id/:user_id', loadChildren: './login/login.module#LoginModule' },
    { path: 'login/:clinic_id/:survey_id', loadChildren: './login/login.module#LoginModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'fillQuestionnaire/:clinic_id/:survey_id/:user_id', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'fillQuestionnaire/:clinic_id/:survey_id', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'ForgotPassword', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'ForgotPassword/:clinic_id/:survey_id/:user_id', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'ForgotPassword/:clinic_id/:survey_id', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'reset_password/:id', loadChildren: './reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
    { path: 'verifyAccount/:id', component: EmailverifyComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }


];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
