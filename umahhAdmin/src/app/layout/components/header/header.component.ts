import { Component, OnInit,Input ,HostListener,Output,EventEmitter} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WebStorage } from '../../../core/web.storage';
import { LoginService } from '../../../login/services/login.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LocalStorageService } from 'ngx-webstorage/dist/services/localStorage';
import { SharedService } from '../../../shared.service';
import { environment } from '../../../../environments/environment';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    baseurl : string = environment.baseUrl;
    imageUrl : string = environment.backendBaseUrl ;
    pushRightClass: string = 'push-right';
    collapsed: boolean = false;
    isActive: boolean = false;
    loggedInUserDetails: any = '';
    userType : string = '';
    username : string = '';
    clinicname : string = '';
    userFName : string = '';
    userLName : string = '';
    imageurl : string = '';


    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService, public router: Router,
        private storage: WebStorage,
        private loginService: LoginService,
        private localSt: LocalStorageService,
        public sharedService : SharedService
    ) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');

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
        this.username = this.sharedService.headerUserName ? this.sharedService.headerUserName : this.sharedService.headerUserName = this.loggedInUserDetails.username;
        this.userType = this.loggedInUserDetails.userType ?this.loggedInUserDetails.userType : 'user';
        this.clinicname =  this.loggedInUserDetails.clinicname ? this.loggedInUserDetails.clinicname : this.clinicname;
        this.imageurl =  this.loggedInUserDetails.image ? this.loggedInUserDetails.image : this.imageUrl;
    }

    ngOnInit() {

    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.sharedService.headerUserName = '';
        this.loginService.logout().subscribe(res =>{
            this.storage.clearAll();

        });
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
