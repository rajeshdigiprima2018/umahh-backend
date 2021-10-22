import { Injectable, EventEmitter } from '@angular/core';

import { httpClient } from '../../core/http.client';
import { HttpEvent, HttpResponse, HttpClient, HttpHeaders, HttpParams, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { WebStorage } from '../../core/web.storage';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { appConfig } from "../../core/app.config";
import { AppConst } from '../../core/utils/app_constatnt';
import 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalStorageService } from 'ngx-webstorage';


@Injectable()
export class LoginService {
    isLoggedIn: boolean = false;
    isAdminLoggedIn: boolean = false;
    onLoggedOut: EventEmitter<boolean> = new EventEmitter();
    onLoggedIn: EventEmitter<boolean> = new EventEmitter();
    redirectUrl: string = '';

    constructor(
        private http: httpClient,
        private storage: WebStorage,
        private localSt: LocalStorageService,
    ) { }


    // getAdminDashboardList(data: any): Observable<any> {
    //   return this.http.get('/hello', data);
    // }

    userLogin(data: any): Observable<any> {
        this.storage.clearAll();
        return this.http.post(AppConst.LOGINUSER, data).pipe(map((result: any) => {
            if (result.code == 200) {
                this.isLoggedIn = true;
                console.log('localstorage set',result);
               // if (data.rememberme == true) {
                    this.storage.localStore(appConfig.storage.TOKEN, result.data.access_token);
                    this.storage.localStore(appConfig.storage.ID, result.data._id);
                    this.storage.localStore(appConfig.storage.USERNAME, result.data.username);
                    /*this.storage.localStore(appConfig.storage.USERFNAME, result.data.firstname);
                    this.storage.localStore(appConfig.storage.USERLNAME, result.data.lastname);*/
                    this.storage.localStore(appConfig.storage.PROFILE_PIC, result.data.avtar);
                    this.storage.localStore(appConfig.storage.ISUPDATED, result.data.isUpdated);
                    this.storage.localStore(appConfig.storage.All, result.data);
              /*  } else {
                    this.storage.sessionStore(appConfig.storage.TOKEN, result.data.access_token);
                    this.storage.sessionStore(appConfig.storage.ID, result.data._id);
                    this.storage.sessionStore(appConfig.storage.USERNAME, result.data.username);
                    this.storage.sessionStore(appConfig.storage.USERFNAME, result.data.firstname);
                    this.storage.sessionStore(appConfig.storage.USERLNAME, result.data.lastname);
                    this.storage.sessionStore(appConfig.storage.PROFILE_PIC, result.data.avtar);
                }

                this.storage.sessionStore(appConfig.storage.USERNAME, result.data.username);*/
                /*this.storage.sessionStore(appConfig.storage.USERFNAME, result.data.firstname);
                this.storage.sessionStore(appConfig.storage.USERLNAME, result.data.lastname);*/
                localStorage.setItem('isLoggedin', 'true');
                this.onLoggedIn.emit(true);

                return result;
            }
            else {
                this.isLoggedIn = false;
                return result;
            }
        }));

    }

    createAuthorizationHeader(headers: HttpHeaders) {
        const token = this.localSt.retrieve('token');
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', "Bearer " + token);
    }

    logout(): Observable<any> {
        let headers = new HttpHeaders();
        this.createAuthorizationHeader(headers);
        this.isLoggedIn = false;
        this.storage.clear(appConfig.storage.All);
        this.onLoggedOut.emit(true);
        localStorage.removeItem('isLoggedin');
        let options: any = {
            headers: headers
        };
       //this.storage.clearAll();
        return this.http.get(AppConst.LOGOUT, options);
    }

    createBinding(data: any): Observable<any> {
        return this.http.post(AppConst.CREATEBINDING, data);
    }


}
