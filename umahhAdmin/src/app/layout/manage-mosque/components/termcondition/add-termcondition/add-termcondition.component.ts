import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { appConfig } from '../../../../../core/app.config';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VideoProcessingService } from '../../../services/video-processing.service';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-add-termcondition',
  templateUrl: './add-termcondition.component.html',
  styleUrls: ['./add-termcondition.component.scss'],
  animations: [routerTransition()]
})
export class AddTermconditionComponent implements OnInit {
  addNotificationForm: FormGroup;
  loggedInUserDetails: any = '';
  videourl: any;
  parent_id: any;
  isLoading: boolean = false;
  selectType: any;
  public thumbnailImage: any;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  submitted = false;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private manageMosqueService: ManageMosqueService,
    private videoService: VideoProcessingService,
    private router: Router
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
    this.addNotificationForm = this.fb.group({
/*      name: ['', [Validators.required]],
      title: ['', [Validators.required]],*/
      description: ['', [Validators.required]],
      send_id: [this.loggedInUserDetails._id]
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
      this.addNotificationForm.get('image').setValue(file);
    }
  }


  optionSelectVideo(event) {
    this.selectType = event.target.value
    const clearEmbed = this.addNotificationForm.get('embed');
    clearEmbed.reset();
    clearEmbed.clearValidators();
    clearEmbed.updateValueAndValidity();
  }

  optionEmbedVideo(event) {
    this.selectType = event.target.value

  }
  private prepareSave(): any {
    let inputData = new FormData();
/*    inputData.append('name', this.addNotificationForm.get('name').value);
    inputData.append('title', this.addNotificationForm.get('title').value);*/
    inputData.append('description', this.addNotificationForm.get('description').value);
 /*   inputData.append('image', this.addNotificationForm.get('image').value);*/
  //  inputData.append('send_id', this.addNotificationForm.get('send_id').value);
    return inputData;
  }
  get f() { return this.addNotificationForm.controls; }
  addNotification() {
    this.submitted = true;
    if (this.addNotificationForm.invalid) {
      return;
    }
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addTermcondition(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listTermcondition'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageMosque/listTermcondition']);
  }
}
