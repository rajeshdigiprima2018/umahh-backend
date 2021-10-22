import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage/dist/services/localStorage';
import { DashboardService } from './service/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { appConfig } from '../../core/app.config';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../shared.service';
import * as moment from 'moment-timezone';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    loggedInUserDetails: any = '';
    usersData: any = '';
    businessData: any = '';
    mosqueData: any = '';
    allData: any = '';
    data: any = '';
    countUser = '';
    date: any = moment.tz(new Date(), "America/Los_Angeles").format();
    isLoading: boolean = false;
    last7dayuserdata: Array<any> = [];
    last7daycountuser: any = '';
    last7daymosquedata: Array<any> = [];
    last7daycountmosque: any = '';
    last7daymessagedata: Array<any> = [];
    last7daycountmessage: any = '';

    images = [
        { i: '../assets/images/slider_th1.png' },
        { i: '../assets/images/slider_th2.png' },
        { i: '../assets/images/slider_th3.png' },
        { i: '../assets/images/slider_th4.png' },
        { i: '../assets/images/slider_th2.png' },
        { i: '../assets/images/slider_th3.png' },
        { i: '../assets/images/slider_th4.png' }
    ];
    viewCustomObjectList: any;

    constructor(
        private translate: TranslateService,
        private localSt: LocalStorageService,
        private toastr: ToastrService,
        private dashboardService: DashboardService,
        public router: Router,
        public sharedService: SharedService



    ) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS', 'hi', 'ar', 'ja', 'sw']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'First slide label',
                text:
                    'Nulla vitae elit libero, a pharetra augue mollis interdum.'
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: 'Second slide label',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
                imagePath: 'assets/images/slider3.jpg',
                label: 'Third slide label',
                text:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            },
            {
                id: 2,
                type: 'warning',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    ngOnInit() {
        this.loggedInUserDetails = this.localSt.retrieve('all');
        this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
        if (this.loggedInUserDetails.role == 'admin' || this.loggedInUserDetails.role == 'mosque') {
            this.getAllUserList();
            this.getAllUserWeblastSevenDay();
        }
        if (this.loggedInUserDetails.forgotPassword == true) {
            //this.toastr.success('Pleaze change Password')
            this.router.navigate(['/layout/changePassword']);
            //console.log('aaaaaaaaa', this.loggedInUserDetails.role);
        }
    }

    getAllUserList() {
        this.isLoading = true;
        this.dashboardService.getAllUserList(this.data).subscribe((res: any) => {
            if (res && res.data && res.code == 200) {
                this.isLoading = false;
                this.usersData = [];
                this.businessData = [];
                this.mosqueData = [];
                this.allData = res.data;
                for (var i = 0; i < this.allData.length; i++) {
                    if (this.loggedInUserDetails.role == 'mosque') {
                        if (this.allData[i].role === 'user' && this.loggedInUserDetails.user_id === this.allData[i].mosque_id) {
                            this.usersData.push(this.allData[i]);
                        }
                    } else {
                        if (this.allData[i].role === 'user') {
                            this.usersData.push(this.allData[i]);
                        }
                    }
                    if (this.allData[i].role == 'business') {

                        this.businessData.push(this.allData[i]);
                    }

                    if (this.allData[i].role == 'mosque') {

                        this.mosqueData.push(this.allData[i]);
                    }

                }
            } else {
                this.toastr.error(res.message)
            }
        });
    }
    getAllUserWeblastSevenDay() {
        this.isLoading = true;
        const data = {
            // "count": 1000,
            "count": 10,
            "page": 1,
            "user_id":this.loggedInUserDetails.user_id
        }
        this.dashboardService.getAllUserWeblastSevenDay(data).subscribe((res: any) => {

            if (res && res.code == 200) {
                this.isLoading = false;
                //this.last7dayuserdata = res.userdata;
                if (this.loggedInUserDetails.role == 'mosque') {
                    for (var i = 0; i < res.userdata.length; i++) {
                        if (this.loggedInUserDetails.user_id === res.userdata[i].mosque_id) {
                            this.last7dayuserdata.push(res.userdata[i]);
                        }
                    }
                }
                else {
                    this.last7dayuserdata = res.userdata;
                }
                this.last7daycountuser = res.totalCountuser;
                this.last7daymosquedata = res.mosquedata;
                this.last7daycountmosque = res.totalCountmosque;
                this.last7daymessagedata = res.messagedata;
                this.last7daycountmessage = res.totalCountmessage;
            } else {
                this.toastr.error(res.message)
            }
        });
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }



}
