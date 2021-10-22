import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import { httpClient } from '../../../core/http.client';
import { WebStorage } from '../../../core/web.storage';
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable()
export class UserComponentService {

  constructor(
    private http: httpClient,
    private storage: WebStorage
  ) { }

  addUser(data: any): Observable<any> {
    return this.http.post(AppConst.ADDUSER,data);
  }

  getUserDetails(userId: any): Observable<any> {
    return this.http.post(AppConst.GETUSERDETAIL,{userId : userId});
  }

  getSearchUserDetails(data: any ): Observable<any> {
    return this.http.post(AppConst.GETSEARCHUSERLISTING,data);
  }
  updateUser(data: any ): Observable<any> {
    return this.http.post(AppConst.UPDATEUSER ,data);
  }

  deleteUser(data: any ): Observable<any> {
    return this.http.post(AppConst.DELETEUSER, data);
  }

  assignSurvey(data: any): Observable<any> {
    return this.http.post(AppConst.ASSIGNSUREVEY,data);
  }

  updateUserStatus(data: any):Observable<any>{
    return this.http.post(AppConst.UPDATECLINICSTATUS ,data);
  }
  getListOfUserAndStaff(data:any):Observable<any>{
    return this.http.post(AppConst.GETLISTOFUSERANDSTAFF ,data);
  }

  assignProvider(data: any): Observable<any> {
    return this.http.post(AppConst.ASSIGNPROVIDER,data);
  }

  // getProviderList(data: any): Observable<any> {
  //   return this.http.post(AppConst.ASSIGNPROVIDER,data);
  // }

}
