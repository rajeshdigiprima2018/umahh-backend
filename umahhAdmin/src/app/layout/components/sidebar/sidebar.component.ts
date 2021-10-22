import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { SharedService } from '../../../shared.service';
import { appConfig } from '../../../core/app.config';
import { LoginService } from '../../../login/services/login.service';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../login/services/data.service';
import { WebStorage } from '../../../core/web.storage';
import { UserService } from '../../user/services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    userId:any;
    isLoading: boolean = false;
    userData: any = null;
    isActive: boolean = false;
    collapsed: boolean = false;
    showMenu: string = '';
    showMenuSurvey: string = '';
    pushRightClass: string = 'push-right';
    loggedInUserDetails: any;
    username : string = '';
    userType : string = '';
    clinicname : string = '';
    imageurl : string = '';
    imageUrl : string = environment.backendBaseUrl;
    baseurl : string = environment.baseUrl;
    adminId:string=appConfig.admin.ID;
    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        private translate: TranslateService,
        public router: Router,
        private localSt: LocalStorageService,
        public sharedService: SharedService,
        private loginService: LoginService,
        private dataService: DataService,
        private storage: WebStorage,
        private userService: UserService,
    ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
        /*this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);*/
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });

        this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
        this.username = this.sharedService.headerUserName ? this.sharedService.headerUserName : this.sharedService.headerUserName = this.loggedInUserDetails.firstName + this.loggedInUserDetails.lastName;
        this.userType = this.loggedInUserDetails.userType ?this.loggedInUserDetails.userType : 'user';
        this.clinicname =  this.loggedInUserDetails.clinicname ? this.loggedInUserDetails.clinicname : this.clinicname;
        this.imageurl =  this.loggedInUserDetails.image ? this.loggedInUserDetails.image : this.imageUrl;
        this.dataService.currentMessage.subscribe(message => {
            this.storage.localStore(appConfig.storage.ISUPDATED, message);
            this.loggedInUserDetails.isUpdated = String(this.localSt.retrieve('isUpdated'));
        });
    }
    ngOnInit() {
    this.getUserDetails(this.loggedInUserDetails._id);
    this.addExpandClass('pages');
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

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    addExpandClassForSurvey(element: any) {
        if (element === this.showMenuSurvey) {
            this.showMenuSurvey = '0';
        } else {
            this.showMenuSurvey = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }


    onLoggedout() {
        this.sharedService.headerUserName = '';
        this.loginService.logout().subscribe((res) => {
            this.storage.clearAll();
            // localStorage.removeItem('isLoggedin');
        }, (error: any) => { console.error(error.message)});
    }

    contentDropdown() {
        var x = document.getElementById("Demo");
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }
}
