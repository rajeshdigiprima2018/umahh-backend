import { Component, OnInit } from '@angular/core';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../shared.service';
import { appConfig } from '../../../../../core/app.config';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-list-quiz-category',
  templateUrl: './list-quiz-category.component.html',
  styleUrls: ['./list-quiz-category.component.scss'],
  animations: [routerTransition()]
})
export class ListQuizCategoryComponent implements OnInit {
  searchTextForm: FormGroup;
  loggedInUserDetails: any = '';
  topics: any = []
  displayDelete: boolean = false;
  id: any;
  _id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//data to show on table
  page: number = appConfig.paginator.PAGE;//page of table
  pageCountLink: any; //total count/count;
  desLength: any;
  assignTopicStatus: boolean = false;
  clinics: any = [];
  searchClinicForm: FormGroup;
  uploadedById: string;
  contentId: string;
  assignContentArr: any = [];
  isLoading: boolean = false;
  clinicTotalCount: number = 0;// taking from response dynamic
  clinicCount: number = appConfig.popUpPaginator.COUNT;
  clinicPage: number = appConfig.popUpPaginator.PAGE;
  clinicPageCountLink: any; //total count/count;
  adminId: string;
  limitForTitle: number = appConfig.limitForTitle.TO;
  limitForDescription: number = appConfig.limitForDescription.TO;
  sortByValue: SelectItem[] = [];
  clinicSort: SelectItem[] = [];
  sortByForm: FormGroup;
  clinicSortForm: FormGroup;
  fetchedClinicList: any;
  userType: string;
  clinicMsg: boolean;
  loggedInId: string;
  adminPublicContent: boolean;

  quizCategory:any = [];

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
    this.sortByValue = [
      { label: 'Sort by', value: null },
      { label: 'Admin', value: 'admin' },
      { label: 'Clinic', value: 'clinic' },
     
    ];

    this.clinicSort = [
      { label: 'Select Clinic', value: null }
    ];
  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.userType = this.loggedInUserDetails.userType;
    this.loggedInId = this.loggedInUserDetails._id;
    this.getAllQuizCategory();  
  }

  showDeleteDialog(id) {
    this.displayDelete = true;
    this._id = id;

  }
  
  deleteQuizCategory() {
    this.isLoading = true;
    this.manageMosqueService.deleteQuizCategory(this._id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayDelete = false;
        this.toastr.success(res.message);
        this.getAllQuizCategory();
      } else {
        this.toastr.error(res.message);
        this.getAllQuizCategory();
      }

    })
  }

  getAllQuizCategory() {
    this.isLoading = true;
    this.manageMosqueService.getAllQuizCategory().subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.quizCategory = res.data;        
      } else {
        this.toastr.error(res.message);
       
      }
    })
  }
  
}
