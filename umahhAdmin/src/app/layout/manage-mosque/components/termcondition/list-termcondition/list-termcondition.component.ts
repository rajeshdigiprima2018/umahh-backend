import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { appConfig } from '../../../../../core/app.config';
import { SharedService } from '../../../../../shared.service';
import { environment } from '../../../../../../environments/environment';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-list-termcondition',
  templateUrl: './list-termcondition.component.html',
  styleUrls: ['./list-termcondition.component.scss'],
  animations: [routerTransition()]
})
export class ListTermconditionComponent implements OnInit {
  searchTextForm: FormGroup;
  loggedInUserDetails: any = '';
  displayDelete: boolean = false;
  id: any;
  _id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//6;data to show on table
  page: number = appConfig.paginator.PAGE; //1;page of table
  pageCountLink: any; //total count/count;
  isLoading: boolean = false;
  imageurl: string = environment.backendBaseUrl;
  baseurl: string = environment.baseUrl;
  loggedInId: string;

  mosqueNotificationList:any = [];

  constructor(
    private translate: TranslateService,
    private manageMosqueService: ManageMosqueService,
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    public sharedService: SharedService,
    private toastr: ToastrService
  ) 
  {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.loggedInId = this.loggedInUserDetails._id;
    this.getTermconditionList();  
  }

  showDeleteDialog(id) {
    this.displayDelete = true;
    this._id = id;

  }

  deleteNotification() {
    this.isLoading = true;
    this.manageMosqueService.deleteNotificationById(this._id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayDelete = false;
        this.toastr.success(res.message);
        this.getTermconditionList();
      } else {
        this.toastr.error(res.message);
        this.getTermconditionList();
      }

    })
  }

  getTermconditionList() {
    this.isLoading = true;
    let data = {
      "count": this.count,
      "page": this.page
    }
    this.manageMosqueService.getTermconditionList(data).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.mosqueNotificationList = res.data;
        this.totalCount = res.totalCount;
        this.pageCountLink = (this.totalCount / this.count);
        this.pageCountLink = this.isFloat(this.pageCountLink) ? Math.floor(this.pageCountLink) + 1 : this.pageCountLink;
        this.pageCountLink = parseInt(this.pageCountLink);
        
      } else {
        this.toastr.error(res.message);
       
      }
    })
  }

  paginate(event, value) {
    this.page = event.page + 1;
    this.getTermconditionList();
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  
}
