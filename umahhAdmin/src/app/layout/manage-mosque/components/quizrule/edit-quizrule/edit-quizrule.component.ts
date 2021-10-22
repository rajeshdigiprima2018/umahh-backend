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
  selector: 'app-edit-quizrule',
  templateUrl: './edit-quizrule.component.html',
  styleUrls: ['./edit-quizrule.component.scss'],
  animations: [routerTransition()]
})
export class EditQuizRuleComponent implements OnInit {
  editQuizRuleForm: FormGroup;
  quizRuleDetail:any;
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

    this.editQuizRuleForm = this.fb.group({
      quiz_category_id:['', [Validators.required]],
      title:['', [Validators.required]],
      rules:['', [Validators.required]],
    })
    this.getAllQuizCategory();
    this.getQuizRuleById();
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

  getQuizRuleById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getQuizRuleById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editQuizRuleForm.patchValue({
            title:res.data.title,
            rules: res.data.rules,
            quiz_category_id: res.data.quiz_category_id
          })
          this.quizRuleDetail = res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('quiz_category_id', this.editQuizRuleForm.get('quiz_category_id').value);
    inputData.append('title', this.editQuizRuleForm.get('title').value);
    inputData.append('rules', this.editQuizRuleForm.get('rules').value);
    return inputData;
  }
  get f() { return this.editQuizRuleForm.controls; }
  editQuizRuleById(){
    this.submitted = true;
    if (this.editQuizRuleForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editQuizRuleById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listQuizRule'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
