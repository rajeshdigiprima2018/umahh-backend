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
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.scss'],
  animations: [routerTransition()]
})
export class AddCalendarComponent implements OnInit {
  addCalendarForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  calendarTime:Date;
  myDateValue: Date;
  minDate:any;
  maxDate:any;
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
    this.addCalendarForm= this.fb.group({
      title:['', [Validators.required, Validators.maxLength(200), Validators.pattern(appConfig.pattern.DESCRIPTION)]],
      calendarTime:['', [Validators.required]],
      calendarDate:['', [Validators.required]],
      mosque_id:[this.loggedInUserDetails._id],
    })
    this.myDateValue = new Date();
  }


  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.addCalendarForm.get('title').value);
    inputData.append('calendarTime', this.addCalendarForm.get('calendarTime').value);
    //inputData.append('calendarDate', this.addCalendarForm.get('calendarDate').value);
    inputData.append('calendarDate', String(new Date(this.addCalendarForm.get('calendarDate').value)));
    inputData.append('mosque_id', this.addCalendarForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.addCalendarForm.controls; }
  addCalendar(){
    this.submitted = true;
    if (this.addCalendarForm.invalid) {
      return;
    }
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addCalendar(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listCalendar'])
        }else{
          this.toastr.error(res.message);
        }
      })

  }

}
