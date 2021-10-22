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
  selector: 'app-list-donation-category',
  templateUrl: './list-donation-category.component.html',
  styleUrls: ['./list-donation-category.component.scss'],
  animations: [routerTransition()]
})
export class ListDonationCategoryComponent implements OnInit {
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
  displayUpdateStatus:boolean=false;
  updateStatusData:any={};

  donationCategory:any = [];

  constructor(
    private translate: TranslateService,
    private manageMosqueService: ManageMosqueService,
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    public sharedService: SharedService,
    private toastr: ToastrService
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');;
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
    this.getAllDonationCategory();  
  }

  showDeleteDialog(id) {
    this.displayDelete = true;
    this._id = id;

  }
  
  deleteDonationategory() {
    this.isLoading = true;
    this.manageMosqueService.deleteDonationategory(this._id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayDelete = false;
        this.toastr.success(res.message);
        this.getAllDonationCategory();
      } else {
        this.toastr.error(res.message);
        this.getAllDonationCategory();
      }

    })
  }

  getAllDonationCategory() {
    this.isLoading = true;
    const data = {
      "count": 10,
      "page": 1
    }
    this.manageMosqueService.getAllDonationCategory(data).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.donationCategory = res.data;      
      } else {
        this.toastr.error(res.message);
       
      }
    })
  }
  closeUpdateStatusDialog(){
    this.displayUpdateStatus=false;
    //this.searchUser();
  }

  onStatusChange(event,categoryId) {
    this.displayUpdateStatus= true;
    this._id = categoryId;
    
    if(event.target.checked == true){
      this.updateStatusData={
          status:"1"
      }
    }else if(event.target.checked == false){
      this.updateStatusData={
        status:"0",
      }
    }

  }

  updateStatus(){
    this.displayUpdateStatus=false;
    
    this.manageMosqueService.updateDonationCategoryStatus(this._id, this.updateStatusData).subscribe(res => {
    
      this.isLoading = false;
      if(res.code==200){
        this.toastr.success(res.message);
        //this.searchUser();
      }else{
        this.toastr.error(res.message);
      }
    })
}
  
}
