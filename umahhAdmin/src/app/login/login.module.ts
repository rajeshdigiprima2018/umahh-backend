import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';
import { BlockUIModule } from 'primeng/components/blockui/blockui';
import { ProgressSpinnerModule } from 'primeng/components/progressspinner/progressspinner';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/components/toast/toast';
import { UserComponentService } from '../layout/users/services/user-component.service';
import { SignUpService } from '../signup/services/signup.service';
import { DropdownModule } from 'primeng/dropdown';
import { SharedService } from '../shared.service';
// import { MessagingService } from '../shared/messaging/messaging.service';
@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage,
        BlockUIModule,
        PanelModule,
        ProgressSpinnerModule,
        ToastModule,
        DropdownModule,
        // BrowserAnimationsModule
    ],
    declarations: [LoginComponent],
    providers: [
        UserComponentService,
        SignUpService,
        SharedService,
        // MessagingService

    ]
})
export class LoginModule { }
