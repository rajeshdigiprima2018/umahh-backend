import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

declare var jQuery: any;


@Component({
    selector: 'case-admin-header-component',
    templateUrl: './header.component.html'
})
export class AdminHeaderComponent implements OnInit {
    
    constructor() {
                console.log("..admin after login header.....")

    }

    ngOnInit() {
       
    }

  
}