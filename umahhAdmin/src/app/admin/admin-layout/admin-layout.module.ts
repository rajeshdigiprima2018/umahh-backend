import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutingModule } from "./admin-layout-routing.module";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminHeaderComponent } from "./components/header/header.component";
import { AdminFooterComponent } from "./components/footer/footer.component";
import { AdminSidebarComponent } from "./components/aside/aside.component";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        FormsModule,    
        CommonModule, 
        RouterModule, 
        AdminLayoutRoutingModule, 
    ],
    declarations: [
        AdminLayoutComponent, 
        AdminHeaderComponent, 
        AdminSidebarComponent, 
        AdminFooterComponent,
    ],
    providers: []

    
})
export class AdminLayoutModule {

}