import { Injectable, EventEmitter } from '@angular/core';

import { httpClient } from '../../../../../core/http.client';
import { WebStorage } from '../../../../../core/web.storage';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { appConfig } from "../../../../../core/app.config";


@Injectable()
export class LoginService {
  isLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;
  onLoggedOut: EventEmitter<boolean> = new EventEmitter();
  onLoggedIn: EventEmitter<boolean> = new EventEmitter();
  redirectUrl: string = '';

  constructor(
    private http: httpClient,
    private storage: WebStorage
  ) { }

  // getAdminDashboardList(data: any): Observable<any> {
  //   return this.http.get('/hello', data);
  // }
  //Need to add <LoginResponse> interface by its response
 

}
