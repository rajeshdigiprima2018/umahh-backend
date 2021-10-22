import { Injectable } from '@angular/core';
import { httpClient } from '../../core/http.client';
import { WebStorage } from '../../core/web.storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConst } from "../../core/utils/app_constatnt"


@Injectable()
export class ResetPasswordService {
    isLoggedIn = false;
    constructor(
        private http: httpClient,
        private storage: WebStorage
    ) { }

    resetPassword(data: any): Observable<any> {
        return this.http.post(AppConst.RESETPASSWORD, data);
    }
}
