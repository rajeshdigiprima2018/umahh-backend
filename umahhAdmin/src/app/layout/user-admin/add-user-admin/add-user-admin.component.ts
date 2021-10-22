import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserAdminService } from '../service/user-admin.service';
import { LocalStorageService } from 'ngx-webstorage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../core/app.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WebStorage } from '../../../core/web.storage';
import { UserService } from '../../user/services/user.service';
import { environment } from '../../../../environments/environment';
import { SharedService } from '../../../shared.service';
import { DataService } from '../../../login/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../router.animations';
import { turn } from 'core-js/fn/array';
@Component({
  selector: 'add-user-admin',
  templateUrl: './add-user-admin.component.html',
  styleUrls: ['./add-user-admin.component.scss'],
  animations: [routerTransition()]
})
export class AddUserAdminComponent implements OnInit {
  error: string;
  userId: number = 1;
  uploadResponse = { status: '', message: '', filePath: '' };
  loggedInUserDetails: any = '';
  baseimageurl: string = environment.backendBaseUrl;
  imageurl: string = environment.backendBaseUrl;
  type: string;
  imgurl: any;
  id: string;
  country_id: string;
  state_id: string;
  username: string;
  userData: any;
  contryListData: any;
  display: boolean = false;
  imageChange: boolean = false;
  editProfileForm: FormGroup;
  // form: FormGroup;
  isLoading: boolean = false;
  readOnlyEmail: boolean = false;
  country: any;
  state: any;
  stateListData: any;
  cityListData: any;
  userInfo: any;
  isUpdated: string;
  city: any;
  submitted = false;
  constructor
    (
      private translate: TranslateService,
      private profile: UserAdminService,
      private storage: WebStorage,
      private localSt: LocalStorageService,
      private fb: FormBuilder,
      private router: Router,
      private userService: UserService,
      private toastr: ToastrService,
      public sharedService: SharedService,
      private dataService: DataService
    ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS', 'hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
    this.dataService.currentMessage.subscribe(message => this.isUpdated = String(message));
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.type = this.loggedInUserDetails.userType;
    // this.country = this.loggedInUserDetails.country.id;
    this.id = this.loggedInUserDetails._id;
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(appConfig.pattern.NAME)]],
      email: ['', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]],
      mobile: ['', [Validators.required, Validators.pattern(appConfig.pattern.PHONE_NO)]],
      password: ['', [Validators.required, Validators.required, Validators.maxLength(appConfig.password.maxLength), Validators.minLength(appConfig.password.minLength)]],
      isFBUser: ['true'],
      role: ['admin'],
      deviceToken: ['abc'],
      deviceType: ['abc'],
    })
  }
  get f() { return this.editProfileForm.controls; }
  onEdit() {
     this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.profile.userRegistration(this.editProfileForm.value).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.success == true) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/user-admin']);
      } else {
        this.toastr.error(res.message);
      }
    })

  }

}