import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { ConfirmComponent } from './Modal/confirm.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { DialogModule } from 'primeng/dialog';
import { PageHeaderModule } from '../../shared';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { UserComponentService } from './services/user-component.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoleService } from '../manage-role/service/manage-role.service';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
// import { MessageService } from 'primeng/api';   
// import { ToastModule } from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
    imports: [CommonModule,
        Ng2Charts,
        UsersRoutingModule,
        PageHeaderModule,
        DialogModule,
        TableModule,
        PaginatorModule,
        ScrollPanelModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        // ToastModule,
        BootstrapModalModule.forRoot({ container: document.body }),
        TooltipModule
    ],
    declarations: [
        UsersComponent, 
        ConfirmComponent],
    providers: [UserComponentService, ManageRoleService  ], //,MessageService 
    entryComponents: [
        ConfirmComponent
    ],

})
export class UsersModule { }
