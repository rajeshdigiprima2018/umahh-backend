import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { environment } from '../../../../../../environments/environment';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss'],
  animations: [routerTransition()]
})
export class EditActivityComponent implements OnInit {
  editActivityForm: FormGroup;
  submitted = false;
  form: FormGroup;
  baseimageurl : string = environment.backendBaseUrl;
  imageurl : string = environment.backendBaseUrl;
  type: string;
  imgurl: any;
  imageChange : boolean = false;
  activityDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  startTime:any;
  maxDate:any;
  minDate:any;
  startDate:any;
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
  @ViewChild('fileInput') fileInput: ElementRef;
  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.editActivityForm = this.fb.group({
      startTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      title: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern(/^(\d{10}|)$/)]],
      textarea: ['', [Validators.required]],
     // image: ['', [Validators.required]],
     // mosque_id: [this.loggedInUserDetails._id]
    })
    this.form = this.fb.group({
      image: ['']
    });
    this.getActivityById();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      this.imageChange = true ;
      reader.onload = (event: ProgressEvent) => {
        this.imgurl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.form.get('image').setValue(file);

      const formData = new FormData();
      formData.append('image', this.form.get('image').value);
      this.route.params.subscribe(params => {
        this.manageMosqueService.activityUpdatePhoto(params['id'],formData).subscribe(res => {
          this.isLoading = false;
          if (res && res.code == 200) {
            this.activityDetail = res.data;
          } else if (res && res.code == 402) {
            this.toastr.info(res.message);
          } else {
            this.toastr.error(res.message);
          }
        });
      })
    }
  }

  getActivityById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getActivityById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.imgurl = res.data.pictures[0].url
          this.editActivityForm.patchValue({
            startTime: new Date(res.data.startTime),
           // startDate: new Date(res.data.startDate),
            title:res.data.title,
            phone:res.data.phone,
            textarea:res.data.textarea,
            image:res.data.pictures[0].url
          });
          this.startDate=   new Date(res.data.startDate);
          this.activityDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('startTime', this.editActivityForm.get('startTime').value);
    //inputData.append('startDate', this.editActivityForm.get('startDate').value);
    inputData.append('startDate', String(new Date(this.editActivityForm.get('startDate').value)));
    inputData.append('title', this.editActivityForm.get('title').value);
    inputData.append('phone', this.editActivityForm.get('phone').value);
    inputData.append('textarea', this.editActivityForm.get('textarea').value);
    //inputData.append('image', this.editActivityForm.get('image').value);
    //inputData.append('mosque_id', this.editActivityForm.get('mosque_id').value);
    return inputData;
  }
  get f() { return this.editActivityForm.controls; }
  editActivity(){
    this.submitted = true;
    if (this.editActivityForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
    const formModel = this.prepareSave();
      this.manageMosqueService.editActivityById(params['id'],formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res && res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listActivity'])
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }
}
