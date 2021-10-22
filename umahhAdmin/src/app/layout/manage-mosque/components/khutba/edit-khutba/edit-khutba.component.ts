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
  selector: 'app-edit-khutba',
  templateUrl: './edit-khutba.component.html',
  styleUrls: ['./edit-khutba.component.scss'],
  animations: [routerTransition()]
})
export class EditKhutbaComponent implements OnInit {
  editKhutbaForm: FormGroup;
  khutbaDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  categoryType: SelectItem[] = [];
  startTime:any;
  maxDate:any;
  minDate:any;
  startDate:any;
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
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
   }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.editKhutbaForm= this.fb.group({
      title:['', [Validators.required]],
      speaker_name :['', [Validators.required]],
      startTime:['', [Validators.required]],
      startDate:['', [Validators.required]]
    })
    this.getKhutbaById();
  }

  getKhutbaById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getKhutbaById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editKhutbaForm.patchValue({
            title:res.data.title,
            speaker_name:res.data.speaker_name,
            startTime: new Date(res.data.startTime),
            //startDate: new Date(res.data.startDate)
          });
          this.startDate= new Date(res.data.startDate)
          this.khutbaDetail =res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editKhutbaForm.get('title').value);
    inputData.append('speaker_name', this.editKhutbaForm.get('speaker_name').value);
    inputData.append('startTime', this.editKhutbaForm.get('startTime').value);
    inputData.append('startDate', String(new Date(this.editKhutbaForm.get('startDate').value)));
    return inputData;
  }
  get f() { return this.editKhutbaForm.controls; }
  editKhutba(){
    this.submitted = true;
    if (this.editKhutbaForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editKhutba(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listKhutba'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
