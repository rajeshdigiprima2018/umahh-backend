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
  selector: 'app-edit-hajjandumrah',
  templateUrl: './edit-hajjandumrah.component.html',
  styleUrls: ['./edit-hajjandumrah.component.scss'],
  animations: [routerTransition()]
})
export class EditHajjandumrahComponent implements OnInit {
  editHajjAndUmrahForm: FormGroup;
  hajjAndUmrahDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  pdfUrl:string;
  AllCategoryUmrah:SelectItem[] = [];
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
      this.AllCategoryUmrah = [
        { label: 'Select Category', value: null }
      ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);

    this.editHajjAndUmrahForm= this.fb.group({
      hajjumrahCategory_id:['', [Validators.required]],
      title:['', [Validators.required]],
      title_aro:['', [Validators.required]],
      description:['', [Validators.required]],
      description_aro:['', [Validators.required]]
    })
    this.getAllCategoryUmrah();
    this.getHajjAndUmrahById();
  }

  getAllCategoryUmrah(){
    const AllCategoryUmrah = [];
    this.manageMosqueService.getAllCategoryUmrahList({}).subscribe((res: any) => {
      if(res.data.length && res.code == 200){
        if (res.code == 200) {
          for (var i =0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].name,
              value: res.data[i].hajjumrahCategory_id
            }
            this.AllCategoryUmrah.push(item);
          }

        } else {
          this.toastr.error(res.message);

        }
      }
    });
  }

  getHajjAndUmrahById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getHajjAndUmrahById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editHajjAndUmrahForm.patchValue({
            hajjumrahCategory_id:res.data.hajjumrahCategory_id,
            title:res.data.title,
            title_aro:res.data.title_aro,
            description:res.data.description,
            description_aro:res.data.description_aro,
          })
          this.hajjAndUmrahDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('hajjumrahCategory_id', this.editHajjAndUmrahForm.get('hajjumrahCategory_id').value);
    inputData.append('title', this.editHajjAndUmrahForm.get('title').value);
    inputData.append('title_aro', this.editHajjAndUmrahForm.get('title_aro').value);
    inputData.append('description', this.editHajjAndUmrahForm.get('description').value);
    inputData.append('description_aro', this.editHajjAndUmrahForm.get('description_aro').value);
    return inputData;
  }
  get f() { return this.editHajjAndUmrahForm.controls; }
  editHajjAndUmrah(){
    this.submitted = true;
    if (this.editHajjAndUmrahForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.route.params.subscribe(params=>{
    const formModel = this.prepareSave();
      this.manageMosqueService.editHajjAndUmrahById(params['id'],formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res && res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listHajjandumrah'])
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }
}
