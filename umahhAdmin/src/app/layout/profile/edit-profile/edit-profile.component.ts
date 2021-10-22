import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EditProfileService } from '../service/edit-profile.service';
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
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  animations: [routerTransition()]
})
export class EditProfileComponent implements OnInit {
  error: string;
  userId: number = 1;
  uploadResponse = { status: '', message: '', filePath: '' };
  loggedInUserDetails: any = '';
  baseimageurl : string = environment.backendBaseUrl;
  imageurl : string = environment.backendBaseUrl;
  type: string;
  imgurl: any;
  id: string;
  country_id:string;
  state_id:string;
  username: string;
  userData: any;
  contryListData:any;
  display : boolean = false;
  imageChange : boolean = false;
  editProfileForm: FormGroup;
  form: FormGroup;
  isLoading: boolean = false;
  readOnlyEmail : boolean = false;
  country:any;
  state:any;
  stateListData:any;
  cityListData:any;
  userInfo:any;
  isUpdated: string;
  city:any;
  constructor
  (
    private translate: TranslateService,
    private profile: EditProfileService,
    private storage: WebStorage,
    private localSt: LocalStorageService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    public sharedService : SharedService,
    private dataService: DataService
  )
  {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
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
    this.country = this.loggedInUserDetails.country.id;
    this.id = this.loggedInUserDetails._id;
    this.form = this.fb.group({
      image: ['']
    });
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required]],
      nameContactPerson: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(appConfig.pattern.EMAIL)]],
      street_address: ['', [Validators.required]],
      //mobile: ['', [Validators.required, Validators.pattern(appConfig.pattern.PHONE_NO)]],
      mobile: ['', [Validators.required]],
      //lat: ['', [Validators.required]],
     // lng: ['', [Validators.required]],
      description_service:['',[Validators.required]],
     // imagePath: null,
      id: [this.loggedInUserDetails._id],
    })
    if (this.loggedInUserDetails.userType == "user" || this.loggedInUserDetails.userType == "staff") {
      this.display = true;
    }

    if(this.loggedInUserDetails.userType!='admin'){
      this.readOnlyEmail = true;
    }
    this.getCountry();
    this.getUserDetails();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      this.imageChange = true ;
      reader.onload = (event: ProgressEvent) => {
        this.imgurl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.form.get('image').setValue(file);

      const formData = new FormData();
      formData.append('image', this.form.get('image').value);

      this.profile.userAddPhoto(formData).subscribe(res => {
      this.isLoading = false;
      if (res) {
        this.userInfo = res.data;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
    }
  }

  onChange($event){

    const country_id = this.country.split('|');
    this.isLoading = true;
    this.profile.getState(country_id[0]).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.stateListData = res.states;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });

   }

  onSelectCity($event){
    const state_id = this.state.split('|');
    this.isLoading = true;
    this.profile.getCity(state_id[0]).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.cityListData = res.states;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });

   }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('username', this.editProfileForm.get('username').value);
    inputData.append('nameContactPerson', this.editProfileForm.get('nameContactPerson').value);
    inputData.append('city', this.editProfileForm.get('city').value);
    inputData.append('state', this.editProfileForm.get('state').value);
    inputData.append('country', this.editProfileForm.get('country').value);
    inputData.append('zipCode', this.editProfileForm.get('zipCode').value);
    inputData.append('email', this.editProfileForm.get('email').value);
    inputData.append('street_address', this.editProfileForm.get('street_address').value);
    inputData.append('mobile', this.editProfileForm.get('mobile').value);
   // inputData.append('lat', this.editProfileForm.get('lat').value);
    //inputData.append('lng', this.editProfileForm.get('lng').value);
    inputData.append('description_service', this.editProfileForm.get('description_service').value);
    return inputData;
  }


  onEdit() {
    this.isLoading = true;
    // const country = this.editProfileForm.value.country.split('|');
    // const state = this.editProfileForm.value.state.split('|');
    // const city = this.editProfileForm.value.city.split('|');
    const newObjectData = {
      "city": this.editProfileForm.value.city,
      "country": this.editProfileForm.value.country,
      "email": this.editProfileForm.value.email,
      "username": this.editProfileForm.value.username,
      //"lat": this.editProfileForm.value.lat,
     // "lng": this.editProfileForm.value.lng,
      "mobile": this.editProfileForm.value.mobile,
      "nameContactPerson": this.editProfileForm.value.nameContactPerson,
      "state": this.editProfileForm.value.state,
      "street_address": this.editProfileForm.value.street_address,
      "zipCode": this.editProfileForm.value.zipCode,
      "description_service":this.editProfileForm.value.description_service
    }
    this.profile.editProfile(newObjectData).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.code == 200) {
        if(this.loggedInUserDetails.isUpdated != 1){
          //localStorage.setItem('isUpdated', res.data.isUpdated);
          this.isUpdated = '1';
         // this.storage.localStore(appConfig.storage.All, res.data);
          this.dataService.changeMessage(this.isUpdated);
          this.toastr.success(res.message);
         // this.router.navigate(['/layout/profile']);
          this.router.navigate(['/layout/manageMosque/listPrayer']);
          location.reload(true);
        }else{
          //localStorage.setItem('isUpdated', res.data.isUpdated);
          this.isUpdated = '1';
         // this.storage.localStore(appConfig.storage.All, res.data);
          this.dataService.changeMessage(this.isUpdated);
          this.toastr.success(res.message);
         // this.router.navigate(['/layout/profile']);
          this.router.navigate(['/layout/manageMosque/listPrayer']);
        }
      }else{
        this.toastr.error(res.message);
      }
    })
  }

  getUserDetails() {
    this.isLoading = true;
    this.id = this.loggedInUserDetails._id;

    this.userService.getUserDetails(this.id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.userData = res.data;
        this.imgurl = this.userData.avtar;
        // this.getState(this.userData.country.id);
        // this.getCity(this.userData.state.id);

        this.editProfileForm.patchValue({
          username: this.userData.username,
          nameContactPerson:this.userData.nameContactPerson,
          // city: this.userData.city.id + '|' + this.userData.city.cities_id,
          // state: this.userData.state.id + '|' + this.userData.state.state_id,
          // country: this.userData.country.id + '|' + this.userData.country.country_id,
           city: this.userData.city ,
          state: this.userData.state,
          country: this.userData.country,
          zipCode: this.userData.zipCode,
          email: this.userData.email,
          street_address: this.userData.street_address,
          mobile: this.userData.mobile,
          //lat: this.userData.lat,
          //lng: this.userData.lng,
          image: this.userData.avtar,
          description_service:this.userData.description_service
        })
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  getCountry() {
    this.isLoading = true;
    this.id = this.loggedInUserDetails._id;
    this.profile.getCountry(this.id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.contryListData = res.countries;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
  getState(country_id) {
    this.isLoading = true;
    this.id = this.loggedInUserDetails._id;
    this.profile.getState(country_id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.stateListData = res.states;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
  getCity(state_id) {
    this.profile.getCity(state_id).subscribe(res => {
      this.isLoading = false;
      if (res.code == 200) {
        this.cityListData = res.states;
      } else if (res && res.code == 402) {
        this.toastr.info(res.message);
      } else {
        this.toastr.error(res.message);
      }
    });
  }
}