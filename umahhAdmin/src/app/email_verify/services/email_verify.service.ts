import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { httpClient } from "../../core/http.client";
import { AppConst } from "../../core/utils/app_constatnt";

@Injectable()
export class EmailVerifyService {

    constructor(
        private http: httpClient,

    ) { }

    verifyAccount(data: any): Observable<any> {
        return this.http.post(AppConst.VERIFY,data);
    }

}
