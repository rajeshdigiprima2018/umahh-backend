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
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss'],
  animations: [routerTransition()]
})
export class AddQuizComponent implements OnInit {
  addQuizForm: FormGroup;
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
    private router:Router
    )
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
    this.addQuizForm= this.fb.group({
      quiz_category_id:['', [Validators.required]],
      question:['', [Validators.required,Validators.maxLength(200)]],
      option1:['', [Validators.required,Validators.maxLength(200)]],
      option2:['', [Validators.required,Validators.maxLength(200)]],
      option3:['', [Validators.required,Validators.maxLength(200)]],
      option4:['', [Validators.required,Validators.maxLength(200)]],
      answer:['', [Validators.required,Validators.maxLength(200)]],
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
    this.addQuizForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addQuizForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addQuizForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value

  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('quiz_category_id', this.addQuizForm.get('quiz_category_id').value);
    inputData.append('question', this.addQuizForm.get('question').value);
    inputData.append('option1', this.addQuizForm.get('option1').value);
    inputData.append('option2', this.addQuizForm.get('option2').value);
    inputData.append('option3', this.addQuizForm.get('option3').value);
    inputData.append('option4', this.addQuizForm.get('option4').value);
    inputData.append('answer', this.addQuizForm.get('answer').value);
    return inputData;
  }
  get f() { return this.addQuizForm.controls; }
  addQuiz(){
    this.submitted = true;
    if (this.addQuizForm.invalid) {
      return;
    }
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addQuiz(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listQuiz'])
        }else{
          this.toastr.error(res.message);
        }
      })
  }

}
