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
  selector: 'app-add-donation',
  templateUrl: './add-donation.component.html',
  styleUrls: ['./add-donation.component.scss'],
  animations: [routerTransition()]
})
export class AddDonationComponent implements OnInit {
  addDonationForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  dayType: SelectItem[] = [];
  myDateValue:any='';
  timepickerVisible = false;
  time:Date;
  AllCategoryDonation:SelectItem[] = [];
  loggedInId:any;
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
    this.AllCategoryDonation = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.loggedInId = this.loggedInUserDetails._id;
    this.addDonationForm= this.fb.group({
      dona_category_id:['', [Validators.required]],
      title:['', [Validators.required]],
      amount:['', [Validators.required]],
      mosque_id:this.loggedInUserDetails._id,
    })
    this.getAllDonationCategory();
  }
  getAllDonationCategory(){
    const newObject = {
      "count": 10,
      "page": 1
    }
    const AllCategoryUmrah = [];
    this.manageMosqueService.getAllDonationCategory(newObject).subscribe((res: any) => {
      if(res.data && res.code == 200){
        if (res.code == 200) {
          for (var i =0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].title,
              //value: res.data[i].dona_category_id
              value: res.data[i]._id
            }
            this.AllCategoryDonation.push(item);
          }

        } else {
          this.toastr.error(res.message);

        }
      }
    });
  }

  onFileChange(event) {
    this.addDonationForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addDonationForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addDonationForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value

  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('dona_category_id', this.addDonationForm.get('dona_category_id').value);
    inputData.append('title', this.addDonationForm.get('title').value);
    inputData.append('amount', this.addDonationForm.get('amount').value);
    inputData.append('mosque_id', this.addDonationForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.addDonationForm.controls; }
  addDonation(){
    this.submitted = true;
    if (this.addDonationForm.invalid) {
      return;
    }
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addDonation(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listDonation'])
        }else{
          this.toastr.error(res.message);
        }
      })
  }

}
