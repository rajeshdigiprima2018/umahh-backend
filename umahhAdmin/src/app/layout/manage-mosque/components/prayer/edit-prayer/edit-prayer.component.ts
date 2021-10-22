import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-edit-prayer',
  templateUrl: './edit-prayer.component.html',
  styleUrls: ['./edit-prayer.component.scss'],
  animations: [routerTransition()]
})
export class EditPrayerComponent implements OnInit {
  editPrayerForm: FormGroup;
  payerDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  selectType: any;
  dayType:any = [];
  dayTypeAerobic:any = [];
  myDateValue:any='';
  timepickerVisible = false;
  time:Date = new Date();
  day_aerobic:any;
  days:any;
  day:any;
  sort:any;
  selectValueName:any;
  selectValuearabic_name:any;
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

    this.editPrayerForm= this.fb.group({
      day:['', [Validators.required]],
      time:['', [Validators.required]],
      sort:['', [Validators.required]],
    })


   /* this.dayTypeAerobic = [
      { id: 'Sunday', name: "الأحد" },
      { id: 'Monday', name: "الإثنين" },
      { id: 'Tuesday', name: "الثلاثاء" },
      { id: 'Wednesday', name: "الأربعاء" },
      { id: 'Thursday', name: "الخميس" },
      { id: 'Friday', name: "يوم الجمعة" },
      { id: 'Saturday', name: "يوم السبت" }
    ]; */
    this.getPrayeNamelist();
    this.getPrayerById();
  }

  onChange(id){
    this.selectType = id.target.value

/*     let selectValue = this.selectType.split(',');
    this.selectType = {
      "selectValueName": selectValue[0],
      "selectValuearabic_name": selectValue[1]
    } */
  }
  getPrayeNamelist(){
    this.manageMosqueService.getPrayeNamelist({}).subscribe((result: any) => {
        if(result.data.length && result.code == 200){

          this.dayType = result.data;
        }
    });
  }

  getPrayerById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getPrayerListId(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editPrayerForm.patchValue({
            time: new Date(res.data.time),
            sort: res.data.sort,
            day: res.data.prayerNameId,
            name:  res.data.day,
            arabic_name : res.data.day_aerobic
          });

          this.payerDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }
  private prepareSave(): any {
    let offset:any = new Date(this.editPrayerForm.get('time').value).getTimezoneOffset();
    let staticTime:any = moment.tz(moment(this.editPrayerForm.get('time').value).format('YYYY-MM-DD HH:mm'), this.loggedInUserDetails.timezone);
    let checkPrayerString:any = moment.tz(this.editPrayerForm.get('time').value, 'HH:mm:ss', 'UTC').format();
    let inputData = new FormData();
    inputData.append('prayercategoryId', this.editPrayerForm.get('day').value);
    inputData.append('time', this.editPrayerForm.get('time').value);
    inputData.append('sort', this.editPrayerForm.get('sort').value);
    inputData.append('staticTime', staticTime);
    inputData.append('checkPrayerString', checkPrayerString);
    inputData.append('offset', offset);
    inputData.append('timezone', this.loggedInUserDetails.timezone);
    return inputData;
  }
  get f() { return this.editPrayerForm.controls; }
  editPrayer(){
    this.submitted = true;
    if (this.editPrayerForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editPrayerById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listPrayer'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
