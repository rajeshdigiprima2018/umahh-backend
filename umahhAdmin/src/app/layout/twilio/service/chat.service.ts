import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpClient } from '../../../core/http.client';
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: httpClient) { }

  getToken(data: any):Observable<any> {
    return this.http.post(AppConst.GETTWILIOTOKEN,data);
  }

  createGroup(data: any):Observable<any> {
    return this.http.post(AppConst.CREATEGROUP,data);
  }

  groupList(data: any):Observable<any> {
    return this.http.post(AppConst.GROUPLIST,data);
  }

  allMsgInChannel(data:any):Observable<any> {
    return this.http.post(AppConst.ALLMSGINCHANNEL,data);
  }
  sendMsgToChannel(data:any):Observable<any> {
    return this.http.post(AppConst.SENDMSGTOCHANNEL,data);
  }
}
