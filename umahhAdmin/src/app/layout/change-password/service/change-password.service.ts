import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpClient } from '../../../core/http.client';
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http: httpClient) { }

  changePassword(data: any):Observable<any> {
    return this.http.post(AppConst.CHANGEPASSWORD,data);
  }
}
