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
  selector: 'app-add-prayer-name',
  templateUrl: './add-prayer-name.component.html',
  styleUrls: ['./add-prayer-name.component.scss'],
  animations: [routerTransition()]
})
export class AddPrayerNameComponent implements OnInit {
  addPrayerNameForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  dayType:any = [];
  dayTypeAerobic:any = [];
  myDateValue:any='';
  timepickerVisible = false;
  time:Date;
  day_aerobic:any;
  days:any;
  day:any;
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
   }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.addPrayerNameForm= this.fb.group({
      name:['', [Validators.required]],
      arabic_name:['', [Validators.required]]
    })
  }


  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('name', this.addPrayerNameForm.get('name').value);
    inputData.append('arabic_name', this.addPrayerNameForm.get('arabic_name').value);
    return inputData;
  }
  get f() { return this.addPrayerNameForm.controls; }
  addPrayerName(){
    this.submitted = true;
    if (this.addPrayerNameForm.invalid) {
      return;
    }
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addPrayerName(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listPrayerName'])
        }else{
          this.toastr.error(res.message);
        }
      })

  }

}
