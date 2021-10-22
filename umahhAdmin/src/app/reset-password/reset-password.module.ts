import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';
import { ToastModule } from 'primeng/toast';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordService } from './services/reset-password.service';
import { ResetPasswordRoutingModule } from './reset-password.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage,
        ToastModule,
        ResetPasswordRoutingModule
    ],
    declarations: [ResetPasswordComponent],
    providers: [ResetPasswordService]
})

export class ResetPasswordModule { }