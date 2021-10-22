import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { VideoProcessingService } from '../../../services/video-processing.service';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss'],
  animations: [routerTransition()]
})
export class AddActivityComponent implements OnInit {
 // addActivityForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id: any;
  isLoading: boolean = false;
  videourl: any;
  selectType: any;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  public thumbnailImage: any;
  startTime: any;
  maxDate: any;
  minDate: any;
  addActivityForm1: FormGroup;
  submitted = false;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localSt: LocalStorageService,
    private manageMosqueService: ManageMosqueService,
    private router: Router,
    private videoService: VideoProcessingService,
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS', 'hi', 'ar', 'ja', 'sw']);
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
    // this.addActivityForm = this.fb.group({
    //   startTime: ['', [Validators.required]],
    //   startDate: ['', [Validators.required]],
    //   title: ['', [Validators.required]],
    //   phone: ['', [Validators.required]],
    //   textarea: ['', [Validators.required]],
    //   image: ['', [Validators.required]],
    //   mosque_id: [this.loggedInUserDetails._id]
    // })

    this.addActivityForm1 = this.fb.group({
      title: ['', Validators.required],
      phone: ['', [Validators.required,Validators.pattern(/^(\d{10}|)$/)]],
      startTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      textarea: ['', [Validators.required]],
      image: ['', [Validators.required]],
      mosque_id: [this.loggedInUserDetails._id]
    });
  }

  onFileChange11(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
       // this.imgurl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
     this.addActivityForm1.get('image').setValue(file);
    }
  }
  get f() { return this.addActivityForm1.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.addActivityForm1.invalid) {
      return;
    }
    const inputData = new FormData();
    inputData.append('startTime', this.addActivityForm1.get('startTime').value);
    inputData.append('startDate', String(new Date(this.addActivityForm1.get('startDate').value)));
    inputData.append('title', this.addActivityForm1.get('title').value);
    inputData.append('phone', this.addActivityForm1.get('phone').value);
    inputData.append('textarea', this.addActivityForm1.get('textarea').value);
    inputData.append('image', this.addActivityForm1.get('image').value);
    inputData.append('mosque_id', this.addActivityForm1.get('mosque_id').value);
    this.isLoading = true;
    this.manageMosqueService.addActivity(inputData).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listActivity'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }


  // onFileChange(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     let videoFile = event.target.files[0]
  //     let reader = new FileReader();
  //     reader.onload = (event: ProgressEvent) => {
  //       this.videourl = (<FileReader>event.target).result;
  //       this.videoService.generateThumbnail(videoFile).then(thumbnailImage => {
  //         this.thumbnailImage = thumbnailImage;
  //       });
  //     }
  //     reader.readAsDataURL(event.target.files[0]);
  //     let file = event.target.files[0];
  //     this.addActivityForm.get('image').setValue(file);
  //   }
  // }


  // optionSelectVideo(event) {
  //   this.selectType = event.target.value
  //   const clearEmbed = this.addActivityForm.get('embed');
  //   clearEmbed.reset();
  //   clearEmbed.clearValidators();
  //   clearEmbed.updateValueAndValidity();
  // }

  optionEmbedVideo(event) {
    this.selectType = event.target.value

  }
  private prepareSave(): any {
    let inputData = new FormData();
    // inputData.append('startTime', this.addActivityForm.get('startTime').value);
    // //inputData.append('startDate', this.addActivityForm.get('startDate').value);
    // inputData.append('startDate', String(new Date(this.addActivityForm.get('startDate').value)));
    // inputData.append('title', this.addActivityForm.get('title').value);
    // inputData.append('phone', this.addActivityForm.get('phone').value);
    // inputData.append('textarea', this.addActivityForm.get('textarea').value);
    // inputData.append('image', this.addActivityForm.get('image').value);
    // inputData.append('mosque_id', this.addActivityForm.get('mosque_id').value);
    return inputData;
  }

  // addActivity() {
  //  this.isLoading = true;
  //   const formModel = this.prepareSave();
  //   this.manageMosqueService.addActivity(formModel).subscribe((res: any) => {
  //     this.isLoading = false;
  //     if (res.code == 200) {
  //       this.toastr.success(res.message);
  //       this.router.navigate(['/layout/manageMosque/listActivity'])
  //     } else {
  //       this.toastr.error(res.message);
  //     }
  //   })
  // }
  navigateToListing() {
    this.router.navigate(['/layout/manageContent/listVideos']);
  }
}
