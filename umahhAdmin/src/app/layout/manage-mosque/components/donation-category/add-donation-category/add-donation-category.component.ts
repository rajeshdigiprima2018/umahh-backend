import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { VideoProcessingService } from '../../../services/video-processing.service';

@Component({
  selector: 'app-add-donation-category',
  templateUrl: './add-donation-category.component.html',
  styleUrls: ['./add-donation-category.component.scss']
})
export class AddDonationCategoryComponent implements OnInit {
  addDonationCategoryForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  public thumbnailImage: any;
  maxDate:any;
  minDate:any;


  constructor(private fb:FormBuilder,private toastr: ToastrService,private localSt: LocalStorageService, private manageMosqueService:ManageMosqueService,private router:Router,private videoService: VideoProcessingService)
   {
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.addDonationCategoryForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      //image: ['', [Validators.required]],
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
      this.addDonationCategoryForm.get('image').setValue(file);
    }
  }


  optionSelectVideo(event) {
    this.selectType = event.target.value
    const clearEmbed = this.addDonationCategoryForm.get('embed');
    clearEmbed.reset();
    clearEmbed.clearValidators();
    clearEmbed.updateValueAndValidity();
  }

  optionEmbedVideo(event) {
    this.selectType = event.target.value

  }
  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('startDate', this.addDonationCategoryForm.get('startDate').value);
    inputData.append('endDate', this.addDonationCategoryForm.get('endDate').value);
    inputData.append('title', this.addDonationCategoryForm.get('title').value);
   // inputData.append('image', this.addDonationCategoryForm.get('image').value);
    return inputData;
  }

  addDonationCategory() {
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.manageMosqueService.addDonationCategory(formModel).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code == 200) {
        this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listDonationCategory'])
      } else {
        this.toastr.error(res.message);
      }
    })
  }
  navigateToListing() {
    this.router.navigate(['/layout/manageContent/listVideos']);
  }

}
