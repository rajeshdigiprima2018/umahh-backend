import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from "../../admin/modules/login/component/services/login.service";
import { WebStorage } from "../web.storage";
import { appConfig } from "../app.config";

import 'rxjs-compat/add/observable/of';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthGuard  implements CanActivateChild //CanActivate
{
    isAuth: EventEmitter<boolean> = new EventEmitter();
    permissions: any;
    constructor(
        private loginService: LoginService, 
        private router: Router, 
        private storage: WebStorage
    ) { }

 

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {        
        if (route.children && route.children.length ==0) {
            let url: string = state.url;
            
        } else {
            return Observable.of(true)
        }
    }
}


