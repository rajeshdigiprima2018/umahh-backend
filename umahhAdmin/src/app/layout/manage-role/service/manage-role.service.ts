import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { httpClient } from '../../../core/http.client';
import { WebStorage } from '../../../core/web.storage';
import { AppConst } from '../../../core/utils/app_constatnt';
import { CommonService } from '../../../core/commonService';

@Injectable()
export class ManageRoleService {
    constructor(
        private http: httpClient,
        private storage: WebStorage,
        private  commonService :CommonService
    ) { }

    getRoleListing(data: any): Observable<any> {
        return this.http.post(AppConst.GETROLELIST,data);
    }
    deleteRole(data:any) {
        return this.http.post(AppConst.DELETEROLE,data);
    }
    saveRole(data:any):Observable<any>{
        return this.http.post(AppConst.SAVEROLE,data);
    }
    editRole(data:any):Observable<any>{
        return this.http.post(AppConst.UPDATEROLE,data);
    }
    getRoleById(id:any): Observable<any> {
        return this.http.get(AppConst.GETROLEBYID + id,{});
    }
}
