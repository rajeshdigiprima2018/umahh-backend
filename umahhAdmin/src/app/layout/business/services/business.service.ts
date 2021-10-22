import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConst } from '../../../core/utils/app_constatnt';
import { httpClient } from '../../../core/http.client';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: httpClient) { }

  deleteBusiness(_id: any ): Observable<any> {
    return this.http.get(AppConst.DELETEUSER + _id, {});
  }

  updateUserStatus(data: any):Observable<any>{
    return this.http.post(AppConst.UPDATEMOSQUEANDBUSINESSSTATUS ,data);
  }

  getBusinessListing(data: any): Observable<any> {
    return this.http.post(AppConst.GETBUSINESSLIST,data);
  }
}
