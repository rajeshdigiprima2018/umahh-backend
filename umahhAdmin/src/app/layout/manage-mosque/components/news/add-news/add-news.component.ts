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
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss'],
  animations: [routerTransition()]
})
export class AddNewsComponent implements OnInit {
  addNewsForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  public thumbnailImage: any;
  startTime:any;
  maxDate:any;
  minDate:any;
  submitted = false;
  constructor(
    private translate: TranslateService,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private localSt: LocalStorageService,
    private manageMosqueService:ManageMosqueService,
    private router:Router,
    private videoService: VideoProcessingService)
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
    this.addNewsForm = this.fb.group({
     // startTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      byName: ['', [Validators.required]],
      textarea: ['', [Validators.required]],
      image: ['', [Validators.required]],
      mosque_id: [this.loggedInUserDetails._id]
    })
  }
  onFileChange(event) {
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
      this.addNewsForm.get('image').setValue(file);
    }
  }
  optionSelectVideo(event) {
    this.selectType = event.target.value
    const clearEmbed = this.addNewsForm.get('embed');
    clearEmbed.reset();
    clearEmbed.clearValidators();
    clearEmbed.updateValueAndValidity();
  }

  optionEmbedVideo(event) {
    this.selectType = event.target.value
  }
  private prepareSave(): any {
    let inputData = new FormData();
    //inputData.append('startTime', this.addNewsForm.get('startTime').value);
    inputData.append('startDate', String(new Date(this.addNewsForm.get('startDate').value)));
    inputData.append('title', this.addNewsForm.get('title').value);
    inputData.append('byName', this.addNewsForm.get('byName').value);
    inputData.append('textarea', this.addNewsForm.get('textarea').value);
    inputData.append('image', this.addNewsForm.get('image').value);
    inputData.append('mosque_id', this.addNewsForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.addNewsForm.controls; }
  addNews() {
    this.submitted = true;
    if (this.addNewsForm.invalid) {
      return;
    }
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addNews(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listNews'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageContent/listVideos']);
  }

}
