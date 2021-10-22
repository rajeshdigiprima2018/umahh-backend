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
  selector: 'app-add-khutba',
  templateUrl: './add-khutba.component.html',
  styleUrls: ['./add-khutba.component.scss'],
  animations: [routerTransition()]
})
export class AddKhutbaComponent implements OnInit {
  addKhutbaForm: FormGroup;
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
  maxDate:any;
  minDate:any;
  submitted = false;
  constructor(
    private translate: TranslateService,
    private fb:FormBuilder,
    private toastr: ToastrService,
    private localSt: LocalStorageService,
    private manageMosqueService:ManageMosqueService,
    private router:Router)
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
    this.addKhutbaForm = this.fb.group({
      startTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      speaker_name:['', [Validators.required]],
     // mosque_id: [this.loggedInUserDetails._id]
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
    const clearEmbed = this.addKhutbaForm.get('embed');
    clearEmbed.reset();
    clearEmbed.clearValidators();
    clearEmbed.updateValueAndValidity();
  }

  optionEmbedVideo(event) {
    this.selectType = event.target.value

  }
  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('startTime', this.addKhutbaForm.get('startTime').value);
    inputData.append('startDate', String(new Date(this.addKhutbaForm.get('startDate').value)));
    inputData.append('title', this.addKhutbaForm.get('title').value);
    inputData.append('speaker_name', this.addKhutbaForm.get('speaker_name').value);
    //inputData.append('mosque_id', this.addKhutbaForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.addKhutbaForm.controls; }
  addKhutba() {
    this.submitted = true;
    if (this.addKhutbaForm.invalid) {
      return;
    }
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addKhutba(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listKhutba'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageContent/listVideos']);
  }

}
