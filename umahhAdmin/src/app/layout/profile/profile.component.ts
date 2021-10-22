import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import {  Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { UserService } from '../user/services/user.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../router.animations';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {

  imageurl : string = environment.backendBaseUrl;
  baseurl : string = environment.baseUrl;
  userData: any = null;
  user_id: any;
  loggedInUserDetails: any = '';
  display : boolean = false;
  isLoading: boolean = false;
  userId   : any = '';
  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private localSt: LocalStorageService,
    private route : Router ,
    public sharedService : SharedService
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    if(this.loggedInUserDetails.userType == "user" || this.loggedInUserDetails.userType == "staff" ){
      this.display = true;
    }else{

    }
   }

  ngOnInit() {
    this.getUserDetails(this.loggedInUserDetails._id);
  }

  getUserDetails(id) {
    this.isLoading = true;
    this.userId = id;

    this.userService.getUserDetails(this.userId).subscribe(res => {
      this.isLoading = false;
      if(res.code == 200){
        this.userData = res.data;
       /* this.sharedService.setImage(this.userData.image);
        if(this.loggedInUserDetails.userType == "user" || this.loggedInUserDetails.userType == "staff" ){
          let name = this.userData.firstname + this.userData.lastname;
          this.sharedService.setHeaderName(name);

        }else{
          this.sharedService.setHeaderName(this.userData.clinicName);
        }*/
      }
    });
  }

  editProfile() {
    this.route.navigate(['/layout/profile/editprofile']);
  }
}
