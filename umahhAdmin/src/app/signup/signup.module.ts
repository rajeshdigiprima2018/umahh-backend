import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { SignUpService } from './services/signup.service';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/components/dialog/dialog';


import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import {ScrollPanelModule} from 'primeng/scrollpanel';


@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    InternationalPhoneModule,
    AutoCompleteModule,
    CheckboxModule,
    DialogModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ScrollPanelModule
  ],
  providers: [
        SignUpService
    ],
  declarations: [SignupComponent]
})
export class SignupModule { }
