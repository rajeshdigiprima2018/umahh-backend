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
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss'],
  animations: [routerTransition()]
})
export class EditQuizComponent implements OnInit {
  editQuizForm: FormGroup;
  quizDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  loggedInId:any;
  minDate:any;
  maxDate:any;
  AllCategoryQuiz: any;
  dayType: SelectItem[] = [];
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
      this.AllCategoryQuiz = [
        /*{ label: 'Select Category', value: null }*/
      ];
   }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);
    this.loggedInId = this.loggedInUserDetails._id;

    this.editQuizForm = this.fb.group({
      quiz_category_id:['', [Validators.required]],
      question:['', [Validators.required,Validators.maxLength(200)]],
      option1:['', [Validators.required,Validators.maxLength(200)]],
      option2:['', [Validators.required,Validators.maxLength(200)]],
      option3:['', [Validators.required,Validators.maxLength(200)]],
      option4:['', [Validators.required,Validators.maxLength(200)]],
      answer:['', [Validators.required,Validators.maxLength(200)]],
    })
    this.getAllQuizCategory();
    this.getQuizById();
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

  getQuizById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getQuizById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editQuizForm.patchValue({
            question:res.data.question,
            option1: res.data.option1,
            option2: res.data.option2,
            option3: res.data.option3,
            option4: res.data.option4,
            answer: res.data.answer,
            quiz_category_id: res.data.quiz_category_id
          })
          this.quizDetail = res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('quiz_category_id', this.editQuizForm.get('quiz_category_id').value);
    inputData.append('question', this.editQuizForm.get('question').value);
    inputData.append('option1', this.editQuizForm.get('option1').value);
    inputData.append('option2', this.editQuizForm.get('option2').value);
    inputData.append('option3', this.editQuizForm.get('option3').value);
    inputData.append('option4', this.editQuizForm.get('option4').value);
    inputData.append('answer', this.editQuizForm.get('answer').value);

    return inputData;
  }
  get f() { return this.editQuizForm.controls; }
  editQuizById(){
    this.submitted = true;
    if (this.editQuizForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editQuizById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listQuiz'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
