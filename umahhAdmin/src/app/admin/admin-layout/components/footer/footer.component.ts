import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'case-admin-footer-component',
    templateUrl: './footer.component.html'
})
export class AdminFooterComponent implements OnInit {
   
    constructor(
    public router: Router, 
) {

    }

    ngOnInit() {
    }

   
}