import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from "ng2-bootstrap-modal";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PipesModule } from '../core/pipes/pipes.module';
import { ChatComponent } from './twilio/chat.component';
import { SharedService } from '../shared.service';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { AddUserAdminComponent } from './user-admin/add-user-admin/add-user-admin.component';
import { UserComponentService } from './users/services/user-component.service';
import { UserComponent } from './user/user.component';
import { MosqueComponent } from './mosque/mosque.component';
import { BusinessComponent } from './business/business.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule} from 'primeng/calendar';
import { AngularFireModule } from '@angular/fire';
import { EditorModule } from 'primeng/editor';
import { appConfig } from '../core/app.config';
import { NgxPrintModule } from 'ngx-print';
import { MessagingService } from '../shared/messaging/messaging.service';
import { TwoDigitDecimaNumberDirective } from './two-digit-decima-number.directive';


@NgModule({
    imports: [
        PipesModule,
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        TableModule,
        NgbDropdownModule.forRoot(),
        ConfirmDialogModule,
        DialogModule,
        ReactiveFormsModule,
        FormsModule,
        CheckboxModule,
        ToastModule,
        DropdownModule,
        PaginatorModule,
        TooltipModule,
        MultiSelectModule,
        AngularFireModule,
        CalendarModule,
        NgxPrintModule,
        EditorModule


    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        ManageRoleComponent,
        ChangePasswordComponent,
        ChatComponent,
        UserAdminComponent,
        AddUserAdminComponent,
        UserComponent,
        MosqueComponent,
        BusinessComponent,
        TwoDigitDecimaNumberDirective
    ] ,
    providers : [
        DialogService,
        SharedService,
        UserComponentService,
        MessagingService
    ]

})
export class LayoutModule {}
