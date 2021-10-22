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
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.scss'],
  animations: [routerTransition()]
})
export class ListSuggestionComponent implements OnInit {
  searchTextForm: FormGroup;
  loggedInUserDetails: any = '';
  displayDelete: boolean = false;
  id: any;
  _id: any;
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//data to show on table
  page: number = appConfig.paginator.PAGE;//page of table
  pageCountLink: any; //total count/count;
  isLoading: boolean = false;
  loggedInId: string;

  mosqueSuggestionList:any = [];

  constructor(
    private translate: TranslateService,
    private manageMosqueService: ManageMosqueService,
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    public sharedService: SharedService,
    private toastr: ToastrService) 
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
    this.getSuggestionList();  
  }

  showDeleteDialog(id) {
    this.displayDelete = true;
    this._id = id;

  }

  deleteSuggestion() {
    this.isLoading = true;
    this.manageMosqueService.deleteSuggestion(this._id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayDelete = false;
        this.toastr.success(res.message);
        this.getSuggestionList();
      } else {
        this.toastr.error(res.message);
        this.getSuggestionList();
      }

    })
  }

  getSuggestionList() {
    this.isLoading = true;
    let data = {
      "count": this.count,
      "page": this.page
    }
    this.manageMosqueService.getSuggestionList(this.loggedInId, data).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.mosqueSuggestionList = res.data;
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
    this.getSuggestionList();
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  
}
