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
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.scss'],
  animations: [routerTransition()]
})
export class EditEducationComponent implements OnInit {
  editEducationForm: FormGroup;
  educationDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  startTime:Date;
  endTime:Date;
  startDate:Date;
  endDate:Date;
  minDate:any;
  maxDate:any;
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

    this.editEducationForm= this.fb.group({
      title: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      mobile: ['', [Validators.required,Validators.pattern(appConfig.pattern.PHONE_NO)]],
      pre_requisites: ['', [Validators.required]],
      course_objective: ['', [Validators.required]],
      methodology: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      registration_fee: ['', [Validators.required]],
      about_instructor: ['', [Validators.required]],
    })
    this.getEducationById();
  }

  getEducationById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getEducationById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editEducationForm.patchValue({
            title: res.data.title,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            //startDate: new Date(res.data.startDate),
           // endDate: new Date(res.data.endDate),
            address: res.data.address,
            mobile: res.data.mobile,
            pre_requisites: res.data.pre_requisites,
            course_objective: res.data.course_objective,
            methodology: res.data.methodology,
            duration: res.data.duration,
            registration_fee: res.data.registration_fee,
            about_instructor: res.data.about_instructor,
          })
          this.startDate=  new Date(res.data.startDate);
          this.endDate=  new Date(res.data.endDate);
          this.educationDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editEducationForm.get('title').value);
    inputData.append('startTime', this.editEducationForm.get('startTime').value);
    inputData.append('endTime', this.editEducationForm.get('endTime').value);
    // inputData.append('startDate', this.editEducationForm.get('startDate').value);
    // inputData.append('endDate', this.editEducationForm.get('endDate').value);
     inputData.append('startDate',  String(new Date(this.editEducationForm.get('startDate').value)));
    inputData.append('endDate',  String(new Date(this.editEducationForm.get('endDate').value)));
    inputData.append('address', this.editEducationForm.get('address').value);
    inputData.append('mobile', this.editEducationForm.get('mobile').value);
    inputData.append('pre_requisites', this.editEducationForm.get('pre_requisites').value);
    inputData.append('course_objective', this.editEducationForm.get('course_objective').value);
    inputData.append('methodology', this.editEducationForm.get('methodology').value);
    inputData.append('duration', this.editEducationForm.get('duration').value);
    inputData.append('registration_fee', this.editEducationForm.get('registration_fee').value);
    inputData.append('about_instructor', this.editEducationForm.get('about_instructor').value);
    return inputData;
  }
  get f() { return this.editEducationForm.controls; }
  editEducation(){
    this.submitted = true;
    if (this.editEducationForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editEducation(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listEducation'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
