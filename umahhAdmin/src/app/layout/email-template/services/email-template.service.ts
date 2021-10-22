import { Injectable } from '@angular/core';
import { httpClient } from '../../../core/http.client';
import { Observable } from 'rxjs/Rx'
import { AppConst } from '../../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  constructor(private http: httpClient) { }

  listEmailTemplate(data): Observable<any>{
    return this.http.post(AppConst.LISTEMAILTEMPLATE, data)
  }

  getTemplateById(id:any):Observable<any>{
    console.log("id",id);
    return this.http.get(AppConst.GETEMAILTEMPLATEBYID + id ,{});
  }

  editEmailTemplate(data):Observable<any>{
    return this.http.post(AppConst.EDITEMAILTEMPLATE ,data);
  }
}
