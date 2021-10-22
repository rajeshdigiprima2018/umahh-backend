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
  selector: 'app-edit-prayer-name',
  templateUrl: './edit-prayer-name.component.html',
  styleUrls: ['./edit-prayer-name.component.scss'],
  animations: [routerTransition()]
})
export class EditPrayerNameComponent implements OnInit {
  editPrayerNameForm: FormGroup;
  payerNameDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  selectType: any;
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
  }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.editPrayerNameForm= this.fb.group({
      name:['', [Validators.required]],
      arabic_name:['', [Validators.required]]
    })
    this.getPrayerNameById();
  }

  onChange(id){
    this.selectType = id.target.value
    this.days = this.dayTypeAerobic.filter(
      item => item.id == this.selectType);
     this.day_aerobic = this.days[0].name;
  }


  getPrayerNameById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getPrayerNameById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editPrayerNameForm.patchValue({
            name:res.data.name,
            arabic_name:res.data.arabic_name
          })
          this.payerNameDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('name', this.editPrayerNameForm.get('name').value);
    inputData.append('arabic_name', this.editPrayerNameForm.get('arabic_name').value);
    return inputData;
  }
  get f() { return this.editPrayerNameForm.controls; }
  editPrayerNameById(){
    this.submitted = true;
    if (this.editPrayerNameForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editPrayerNameById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listPrayerName'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
