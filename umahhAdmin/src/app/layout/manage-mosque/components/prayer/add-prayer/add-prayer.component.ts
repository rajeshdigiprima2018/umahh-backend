import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-add-prayer',
  templateUrl: './add-prayer.component.html',
  styleUrls: ['./add-prayer.component.scss'],
  animations: [routerTransition()]
})
export class AddPrayerComponent implements OnInit {
  addPrayerForm: FormGroup;
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
  time:Date = new Date("2020-01-01");
  timeGet:any = moment.utc("2020-01-01").local().format("YYYY-MM-DD HH:mm:ss a");
  day_aerobic:any;
  days:any;
  day:any;
  submitted = false;
  //offset:Date = new Date("2020-01-01");
  //staticTime:Date = new Date("2020-01-01");

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
    this.addPrayerForm= this.fb.group({
      day:['', [Validators.required]],
      time:['', [Validators.required]],
      sort:['', [Validators.required]],
      mosque_id:[this.loggedInUserDetails._id],
    })

  /*  this.dayTypeAerobic = [
      { id: 'Sunday', name: "الأحد" },
      { id: 'Monday', name: "الإثنين" },
      { id: 'Tuesday', name: "الثلاثاء" },
      { id: 'Wednesday', name: "الأربعاء" },
      { id: 'Thursday', name: "الخميس" },
      { id: 'Friday', name: "يوم الجمعة" },
      { id: 'Saturday', name: "يوم السبت" }
    ];*/
    this.getPrayeNamelist();
  }


  getPrayeNamelist(){
    this.manageMosqueService.getPrayeNamelist({}).subscribe((result: any) => {
        if(result.data.length && result.code == 200){

          this.dayType = result.data;
        }
    });
  }

  onFileChange(event) {
    this.addPrayerForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addPrayerForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addPrayerForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value

  }

  onChange(id){
    this.selectType = id.target.value
    //let myarray = this.selectType.split(',');

/*     this.selectType = {
      "name":myarray[0],
      "arabic_name": myarray[1]
    } */
  //  this.days = this.dayTypeAerobic.filter(
  //    item => item.id == this.selectType);
  //   this.day_aerobic = this.days[0].name;
  }

  private prepareSave(): any {
    let offset:any = new Date(this.addPrayerForm.get('time').value).getTimezoneOffset();
   let staticTime:any = moment.tz(moment(this.addPrayerForm.get('time').value).format('YYYY-MM-DD HH:mm'), this.loggedInUserDetails.timezone);
    let checkPrayerString:any = moment.tz(this.addPrayerForm.get('time').value, 'HH:mm:ss', 'UTC').format();
    let inputData = new FormData();
    inputData.append('prayercategoryId', this.selectType);
    inputData.append('time', this.addPrayerForm.get('time').value);
    inputData.append('sort', this.addPrayerForm.get('sort').value);
    inputData.append('mosque_id',this.loggedInUserDetails._id);
    inputData.append('staticTime', staticTime);
    inputData.append('checkPrayerString', checkPrayerString);
    inputData.append('offset', offset);
    inputData.append('timezone', this.loggedInUserDetails.timezone);

    return inputData;
  }
  get f() { return this.addPrayerForm.controls; }
  addTopic(){
    this.submitted = true;
    if (this.addPrayerForm.invalid) {
      return;
    }
    this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addPrayer(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listPrayer'])
        }else{
          this.toastr.error(res.message);
        }
      })

  }

}
