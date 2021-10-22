import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConst } from '../../../core/utils/app_constatnt';
import { httpClient } from '../../../core/http.client';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: httpClient) { }

  deleteUser(_id: any ): Observable<any> {
    return this.http.get(AppConst.DELETEUSER + _id, {});
  }

  getUserDetails(userId: any): Observable<any> {
    return this.http.get(AppConst.GETUSERDETAIL + userId, {});
  }

  getUserListing(data: any): Observable<any> {
    return this.http.post(AppConst.GETUSERLIST,data);
}
}
