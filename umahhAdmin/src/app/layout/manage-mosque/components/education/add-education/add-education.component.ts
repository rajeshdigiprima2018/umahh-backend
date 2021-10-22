import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-add-education',
  templateUrl: './add-education.component.html',
  styleUrls: ['./add-education.component.scss'],
  animations: [routerTransition()]
})
export class AddEducationComponent implements OnInit {
  addEducationForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  startTime:Date;
  endTime:Date;
  startDate:Date;
  endDate:Date;
  minDate:any;
  maxDate:any;
  submitted = false;

  constructor(
    private translate: TranslateService,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private localSt: LocalStorageService,
    private manageMosqueService:ManageMosqueService,
    private router:Router
  )
  {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS','hi', 'ar', 'ja', 'sw']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|hi|ar|ja|sw/) ? browserLang : 'en');
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.addEducationForm = this.fb.group({
      title: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      mobile: ['', [Validators.required,Validators.pattern(appConfig.pattern.PHONE_NO)]],
      pre_requisites: ['', [Validators.required]],
      course_objective: ['', [Validators.required]],
      methodology: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      registration_fee: ['', [Validators.required]],
      about_instructor: ['', [Validators.required]],
      mosque_id: [this.loggedInUserDetails._id]
    })
  }

/*  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
        this.videoService.generateThumbnail(videoFile).then(thumbnailImage => {
          this.thumbnailImage = thumbnailImage;
        });
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addBoardForm.get('image').setValue(file);
    }
  }*/


  optionSelectVideo(event) {
    this.selectType = event.target.value
    const clearEmbed = this.addEducationForm.get('embed');
    clearEmbed.reset();
    clearEmbed.clearValidators();
    clearEmbed.updateValueAndValidity();
  }

  optionEmbedVideo(event) {
    this.selectType = event.target.value

  }
  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.addEducationForm.get('title').value);
    inputData.append('startTime', this.addEducationForm.get('startTime').value);
    inputData.append('endTime', this.addEducationForm.get('endTime').value);
   // inputData.append('startDate', this.addEducationForm.get('startDate').value);
   inputData.append('startDate',  String(new Date(this.addEducationForm.get('startDate').value)));
    //inputData.append('endDate', this.addEducationForm.get('endDate').value);
    inputData.append('endDate',  String(new Date(this.addEducationForm.get('endDate').value)));
    inputData.append('address', this.addEducationForm.get('address').value);
    inputData.append('mobile', this.addEducationForm.get('mobile').value);
    inputData.append('pre_requisites', this.addEducationForm.get('pre_requisites').value);
    inputData.append('course_objective', this.addEducationForm.get('course_objective').value);
    inputData.append('methodology', this.addEducationForm.get('methodology').value);
    inputData.append('duration', this.addEducationForm.get('duration').value);
    inputData.append('registration_fee', this.addEducationForm.get('registration_fee').value);
    inputData.append('about_instructor', this.addEducationForm.get('about_instructor').value);
    inputData.append('mosque_id', this.addEducationForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.addEducationForm.controls; }
  addEducation() {
    this.submitted = true;
    if (this.addEducationForm.invalid) {
      return;
    }
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addEducation(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listEducation'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageContent/listVideos']);
  }

}
