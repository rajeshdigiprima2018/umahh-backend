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
  selector: 'app-add-quizrule',
  templateUrl: './add-quizrule.component.html',
  styleUrls: ['./add-quizrule.component.scss'],
  animations: [routerTransition()]
})
export class AddQuizRuleComponent implements OnInit {
  addQuizRuleForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  dayType: SelectItem[] = [];
  myDateValue:any='';
  timepickerVisible = false;
  time:Date;
  AllCategoryQuiz:SelectItem[] = [];
  loggedInId:any;
  maxDate:any;
  minDate:any;
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
    this.AllCategoryQuiz = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.loggedInId = this.loggedInUserDetails._id;
    this.addQuizRuleForm= this.fb.group({
      quiz_category_id:['', [Validators.required]],
      title:['', [Validators.required]],
      rules:['', [Validators.required]],
    })
    this.getAllQuizCategory();
  }
  getAllQuizCategory(){
    const AllCategoryUmrah = [];
    this.manageMosqueService.getAllQuizCategory().subscribe((res: any) => {
      if(res.data && res.code == 200){
        if (res.code == 200) {
          for (var i =0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].title,
              value: res.data[i].quiz_category_id
            }
            this.AllCategoryQuiz.push(item);
          }

        } else {
          this.toastr.error(res.message);

        }
      }
    });
  }

  onFileChange(event) {
    this.addQuizRuleForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addQuizRuleForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addQuizRuleForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value

  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('quiz_category_id', this.addQuizRuleForm.get('quiz_category_id').value);
    inputData.append('title', this.addQuizRuleForm.get('title').value);
    inputData.append('rules', this.addQuizRuleForm.get('rules').value);
    return inputData;
  }
  get f() { return this.addQuizRuleForm.controls; }
  addQuizRule(){
    this.submitted = true;
    if (this.addQuizRuleForm.invalid) {
      return;
    }
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addQuizRule(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listQuizRule'])
        }else{
          this.toastr.error(res.message);
        }
      })
  }

}
