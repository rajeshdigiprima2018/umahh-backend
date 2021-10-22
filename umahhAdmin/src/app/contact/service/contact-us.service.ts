import { Injectable } from '@angular/core';
import { httpClient } from '../../core/http.client';
import { WebStorage } from '../../core/web.storage';
import { Observable } from 'rxjs/Rx'
import { AppConst } from '../../core/utils/app_constatnt';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(
    private http: httpClient,
    private storage: WebStorage
  ) { }

  sendContactInfo(data: any): Observable<any> {
    return this.http.post(AppConst.CONTACTUS,data);
  }
}
