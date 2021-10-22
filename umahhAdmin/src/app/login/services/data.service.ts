import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService } from 'ngx-webstorage';
import { WebStorage } from '../../core/web.storage';
import { appConfig } from "../../core/app.config";


@Injectable()
export class DataService {
    messageSource = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();

    constructor(
        private storage: WebStorage,
        private localSt: LocalStorageService
     ) {
        let allData = JSON.parse(this.localSt.retrieve('all'));
        if (allData) {
            this.changeMessage(String(allData.isUpdated));
        }
    }

    changeMessage(message: string) {
        this.messageSource.next(message);
    }

}