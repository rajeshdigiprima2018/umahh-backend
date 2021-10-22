import { Injectable } from '@angular/core';

import { httpClient } from '../../core/http.client';
import { WebStorage } from '../../core/web.storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConst } from "../../core/utils/app_constatnt"


@Injectable()
export class ForgotPasswordService {
    isLoggedIn = false;
    constructor(
        private http: httpClient,
        private storage: WebStorage
    ) { }

    forgotPassword(data: any): Observable<any> {
        return this.http.post(AppConst.FORGOTPASSWORD, data);
    }
}
