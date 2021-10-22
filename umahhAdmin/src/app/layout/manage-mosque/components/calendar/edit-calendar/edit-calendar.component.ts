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
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss'],
  animations: [routerTransition()]
})
export class EditCalendarComponent implements OnInit {
  editCalendarForm: FormGroup;
  calendarDetail: any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  minDate: any;
  maxDate: any;
  calendarTime: any;
  calendarDate: any;
  submitted = false;
  constructor(
    private translate: TranslateService,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private manageMosqueService: ManageMosqueService,
    private router: Router
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'de', 'zh-CHS', 'hi', 'ar', 'ja', 'sw']);
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

    this.editCalendarForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200), Validators.pattern(appConfig.pattern.DESCRIPTION)]],
      calendarTime: ['', [Validators.required]],
      calendarDate: ['', [Validators.required]],
    })
    this.getCalendarById();
  }

  getCalendarById() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.isLoading = false;
      this.manageMosqueService.getCalendarById(params['id']).subscribe((res: any) => {
        if (res && res.code == 200 && res.data) {
          // let calendarDate:any = new Date(res.data.calendarDate);
          let calendarTime: any = new Date(res.data.calendarTime);
          this.editCalendarForm.patchValue({
            title: res.data.title,
            // calendarDate:calendarDate,
            calendarTime: calendarTime
          })
          this.calendarDate = new Date(res.data.calendarDate);
          this.calendarDetail = res.data;
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editCalendarForm.get('title').value);
    inputData.append('calendarTime', this.editCalendarForm.get('calendarTime').value);
    // inputData.append('calendarDate', this.editCalendarForm.get('calendarDate').value);
    inputData.append('calendarDate', String(new Date(this.editCalendarForm.get('calendarDate').value)));
    return inputData;
  }
  get f() { return this.editCalendarForm.controls; }
  editCalendar() {
    this.submitted = true;
    if (this.editCalendarForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params => {
      const formModel = this.prepareSave();
      this.manageMosqueService.editCalendar(params['id'], formModel).subscribe((res: any) => {
        this.isLoading = false;
        if (res && res.code == 200) {
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listCalendar'])
        } else {
          this.toastr.error(res.message);
        }
      })
    })
  }
}
