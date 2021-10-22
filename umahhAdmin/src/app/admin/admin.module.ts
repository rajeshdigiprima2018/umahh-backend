import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module'
import { AdminComponent } from "./admin.component";
import { AdminDashboardComponent } from './modules/admin-dashboard/admin-dashboard.component';
import { LoginService } from './modules/login/component/services/login.service';
import { AuthGuard } from '../core/guards/admin-auth.guard';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
  ],
  declarations: [  
    AdminComponent, AdminDashboardComponent
  ],
  providers: [
    AuthGuard,
    LoginService
  ]
})
export class CaseManagementAdminModule { }
    