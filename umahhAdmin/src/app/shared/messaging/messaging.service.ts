import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import { WebStorage } from '../../core/web.storage';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginService } from '../../login/services/login.service';

@Injectable()
export class MessagingService {
  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null);
  loggedInUserDetails: any = '';
  userID: any;
  constructor(
    public localStorageService: LocalStorageService,
    private angularFireAuth: AngularFireAuth,
    private storage: WebStorage,
    private loginService: LoginService,
    private localSt: LocalStorageService,
  ) {


  }


  getPermission() {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        this.localStorageService.store('fcmToken', token);
        this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
        this.userID = this.loggedInUserDetails._id;
        let data = {
          fcmToken: token,
          identity: this.userID
        }
        this.loginService.createBinding(data).subscribe(res => {
          if (res && res.code == 200) {
            console.log("Binding has been done:::>", res);
          }
          console.log(token)
          //this.updateToken(token)
        })
      }).catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });

  }
  
  receiveMessage() {
    this.messaging.onMessage((payload) => {
     console.log("Message received. ", payload);
     this.currentMessage.next(payload)
   });

 }

}
