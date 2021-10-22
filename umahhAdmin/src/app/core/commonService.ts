import { ConfirmationService } from 'primeng/components/common/api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpClient } from './http.client';
@Injectable()
export class CommonService {

    constructor(
        private confirmationService: ConfirmationService,
        private http: httpClient,
    ) { }

    deleteConfirmationBox(){
         this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                return true
            },
            reject: () => {
                return false;

                // this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
            }
        });
    }
}
