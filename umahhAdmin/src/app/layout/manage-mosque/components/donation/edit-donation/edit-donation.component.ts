import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-edit-donation',
  templateUrl: './edit-donation.component.html',
  styleUrls: ['./edit-donation.component.scss'],
  animations: [routerTransition()]
})
export class EditDonationComponent implements OnInit {
  editDonationForm: FormGroup;
  donationDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  loggedInId:any;
  minDate:any;
  maxDate:any;
  AllCategoryDonation: any;
  dayType: SelectItem[] = [];
  submitted = false;
  constructor(
    private translate: TranslateService,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private manageMosqueService:ManageMosqueService,
    private router:Router
  ) {
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

    this.editDonationForm = this.fb.group({
      title:['', [Validators.required]],
      amount:['', [Validators.required]],
      dona_category_id:['', [Validators.required]]
    })
    this.getAllDonationCategory();
    this.getDonationById();
  }

  getAllDonationCategory(){
    const AllCategoryUmrah = [];
    const newObject = {
      "count": 10,
      "page": 1
    }
    this.manageMosqueService.getAllDonationCategory(newObject).subscribe((res: any) => {
      if(res.data && res.code == 200){
        if (res.code == 200) {
          for (var i =0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].title,
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

  getDonationById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getDonationById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editDonationForm.patchValue({
            title:res.data.title,
            amount: res.data.amount,
            dona_category_id: res.data.dona_category_id
          })
          this.donationDetail = res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editDonationForm.get('title').value);
    inputData.append('amount', this.editDonationForm.get('amount').value);
    inputData.append('dona_category_id', this.editDonationForm.get('dona_category_id').value);

    return inputData;
  }
  get f() { return this.editDonationForm.controls; }
  editDonationById(){
    this.submitted = true;
    if (this.editDonationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editDonationById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listDonation'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
