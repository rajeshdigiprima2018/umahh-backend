import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpClient } from '../../../core/http.client';
import { WebStorage } from '../../../core/web.storage';
import { AppConst } from '../../../core/utils/app_constatnt';
@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(private http: httpClient,
    private storage: WebStorage) 
    { }

    editProfile(data: any ): Observable<any> {
      return this.http.post(AppConst.EDITPROFILE ,data);
    }

    getCountry(data: any ): Observable<any> {
      return this.http.get(AppConst.GETCOUNTRY ,data);
    }

    getState(country_id: any ): Observable<any> {
      return this.http.get(AppConst.GETSTATE + country_id, {});
    }

    getCity(state_id: any ): Observable<any> {
      return this.http.get(AppConst.GETCITY + state_id, {});
    }
    userAddPhoto(data: any ): Observable<any> {
      return this.http.post(AppConst.USERADDPHOTO, data);
    }
}
