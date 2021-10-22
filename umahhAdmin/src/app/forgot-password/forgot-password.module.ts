import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';
import { BlockUIModule } from 'primeng/components/blockui/blockui';
import { ProgressSpinnerModule } from 'primeng/components/progressspinner/progressspinner';
import { PanelModule } from 'primeng/panel';
import { ForgotPasswordRoutingModule } from './forgot-password.routing'
import { ForgotPasswordService } from './services/forgot-password.service';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage,
        BlockUIModule,
        PanelModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    declarations: [ForgotPasswordComponent],
    providers: [ForgotPasswordService]
})
export class ForgotPasswordModule { }
