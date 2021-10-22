import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListEmailTemplateComponent } from './components/list-email-template/list-email-template.component';

const routes: Routes = [
  {
      path: '',
      component: ListEmailTemplateComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class EmailTemplateRoutingModule { }
