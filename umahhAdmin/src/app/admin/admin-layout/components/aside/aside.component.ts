import { Component } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'case-admin-sidebar-component',
    templateUrl: 'aside.component.html'
})
export class AdminSidebarComponent {
    constructor(
        private _router: Router,
    ) {

       
    }
     
}