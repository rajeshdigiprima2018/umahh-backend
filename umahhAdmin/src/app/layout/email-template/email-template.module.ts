import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateRoutingModule } from './/email-template-routing.module';
import { ListEmailTemplateComponent } from './components/list-email-template/list-email-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { PageHeaderModule } from '../../shared';
import { EditorModule } from 'primeng/editor';

@NgModule({
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    ScrollPanelModule,
    DialogModule,
    PageHeaderModule,
    EditorModule
  ],
  declarations: [ListEmailTemplateComponent]
})
export class EmailTemplateModule { }
