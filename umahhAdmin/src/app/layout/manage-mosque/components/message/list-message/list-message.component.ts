import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.scss'],
  animations: [routerTransition()]
})
export class ListMessageComponent implements OnInit {
  addMessageForm: FormGroup;
  loggedInUserDetails: any = '';
  displayDelete: boolean = false;
  id: any;
  _id: any;
  recive_id:any;
  totalCount: number = 0;// taking from response dynamic
  count: number = appConfig.paginator.COUNT;//6;data to show on table
  page: number = appConfig.paginator.PAGE; //1;page of table
  pageCountLink: any; //total count/count;
  isLoading: boolean = false;
  imageurl: string = environment.backendBaseUrl;
  baseurl: string = environment.baseUrl;
  loggedInId: string;
  mosque:any =[];
  mosqueMessageList:any = [];
  sideMessage:boolean = false;
  messageObj:any = {};
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
    this.addMessageForm = this.fb.group({
      description: ['', [Validators.required]]
    })
    this.getMessageAllUserList();
  }

  showDeleteDialog(id) {
    this.displayDelete = true;
    this._id = id;

  }

  deleteMessage() {
    this.isLoading = true;
    this.manageMosqueService.deleteNotificationById(this._id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.displayDelete = false;
        this.toastr.success(res.message);
        this.getMessageList();
      } else {
        this.toastr.error(res.message);
        this.getMessageList();
      }

    })
  }
  getMessageAllUserList() {
    this.manageMosqueService.getMessageAllUserList(this.loggedInId).subscribe(res => {
        if (res.code == 200) {
          this.mosque = res.data;
          for (let i = 0; i < this.mosque.length; i++) {
            if (this.mosque[i]._id == this.loggedInUserDetails._id) {
             // this.Associeted_user =this.mosque[i].associates_id.associate_user; 
             this.mosque.splice(i, 1);
            }
          }  
        }
    });
  }
  toggle(id) {
    this.sideMessage = true;
    this.recive_id = id;
    this.getMessageList();  
  }
  getMessageList() {
    this.isLoading = true;
    this.manageMosqueService.getMessageList(this.recive_id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.mosqueMessageList = res.data;
      } else {
        this.toastr.error(res.message);
       
      }
    })
  }
    private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('description', this.addMessageForm.get('description').value);
    inputData.append('recive_id', this.recive_id);
    return inputData;
  }

  addMessage() {

    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addMessage(formModel).subscribe((res: any) => {
      this.addMessageForm.reset();
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.toggle(this.recive_id);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

/*  paginate(event, value) {
    this.page = event.page + 1;
    this.getMessageList();
  }

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }*/
  
}
