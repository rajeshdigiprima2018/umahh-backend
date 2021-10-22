import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';
import { BlockUIModule } from 'primeng/components/blockui/blockui';
import { ProgressSpinnerModule } from 'primeng/components/progressspinner/progressspinner';
import { PanelModule } from 'primeng/panel';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserComponentService } from '../users/services/user-component.service';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProfileRoutingModule,
        ReactiveFormsModule,
        Ng2Webstorage,
        BlockUIModule,
        PanelModule,
        ProgressSpinnerModule ,
        FormsModule,
        CheckboxModule,
        EditorModule,
        TranslateModule
    ],
    declarations: [ProfileComponent ,EditProfileComponent ] ,
    providers : [UserComponentService]
})
export class ProfileModule { }
