import { Injectable, EventEmitter } from '@angular/core';
import { httpClient } from '../../core/http.client';
import { WebStorage } from '../../core/web.storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfig } from "../../core/app.config";
import { AppConst } from "../../core/utils/app_constatnt";

@Injectable()
export class SignUpService {

  constructor(
    private http: httpClient,
    private storage: WebStorage
  ) { }

  userRegistration(data: any): Observable<any> {
    return this.http.post(AppConst.USERREG,data);
  }

  getGeneralClinicListing(data:any): Observable<any> {
    return this.http.post(AppConst.GETGENERALCLINICLISTING, data);
  }

  fillQuestionnaire(userId: any): Observable<any> {
    return this.http.post(AppConst.GETUSERDETAIL,{userId});
  }

  getClinicStaffList(data:any): Observable<any> {
    return this.http.post(AppConst.getClinicStaffList, data);
  }

  createUserForTwilio(data:any): Observable<any>{
    return this.http.post(AppConst.CREATEUSERFORTWILIO, data);
  }
  getClinicCategoryListing(data: any): Observable<any> {
        return this.http.get(AppConst.GETCLINICCATEORYLIST,data);
   }

}
