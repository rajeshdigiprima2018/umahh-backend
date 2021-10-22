import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpClient } from '../../../core/http.client';
import { WebStorage } from '../../../core/web.storage';
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: httpClient,
    private storage: WebStorage
  ) { }

  clinicDashboardListing(data: any): Observable<any> {
    return this.http.post(AppConst.CLINICDASHBOARDLISTING ,data);
  }

  userDashboardListing(data: any): Observable<any> {
    return this.http.post(AppConst.USERDASHBOARDLISTING ,data);
  }

  adminDashboardListing(data: any): Observable<any> {
    return this.http.post(AppConst.ADMINDASHBOARDLISTING ,data);
  }

  getSearchUserDetails(data: any):Observable<any> {
    return this.http.post(AppConst.GETSEARCHUSERLISTING,data);
  }

  listContent(data): Observable<any>{
    return this.http.post(AppConst.LISTCONTENT, data)
  }

  mostViewedContentList(data): Observable<any>{
    return this.http.post(AppConst.MOSTVIEWEDCONTENTLIST, data)
  }

  getClinicStaffList(data): Observable<any>{
    return this.http.post(AppConst.getClinicStaffList, data);
  }
  getRecomdedContent(data: any): Observable<any>{
    return this.http.get(AppConst.getRecomdedContent + data.category, {});
  }

  getAllUserList(data: any): Observable<any>{
    return this.http.get(AppConst.GETALLUSERLIST,{});
  }
  getAllUserWeblastSevenDay(data: any): Observable<any>{
    return this.http.post(AppConst.GETALLUSERWEBLASTSEVENDAY, data);
  }
  
}
