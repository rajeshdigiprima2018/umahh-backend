import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { appConfig } from '../../../../../core/app.config';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VideoProcessingService } from '../../../services/video-processing.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent implements OnInit {
  addNotificationForm: FormGroup;
  loggedInUserDetails: any = '';
  videourl: any;
  parent_id: any;
  isLoading: boolean = false;
  selectType: any;
  public thumbnailImage: any;
  selectedCategory: any;
  categoryType: SelectItem[] = [];


  constructor(private fb: FormBuilder,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private manageMosqueService: ManageMosqueService,
    private videoService: VideoProcessingService,
    private router: Router
  ) {
 
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
    inputData.append('send_id', this.addNotificationForm.get('send_id').value);
    return inputData;
  }

  addNotification() {
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addNotification(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listNotification'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageMosque/listNotification']);
  }
}
