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
  selector: 'app-edit-supplication',
  templateUrl: './edit-supplication.component.html',
  styleUrls: ['./edit-supplication.component.scss'],
  animations: [routerTransition()]
})
export class EditSupplicationComponent implements OnInit {
  editSupplicationForm: FormGroup;
  suplicationDetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  AllCategorySupplication: SelectItem[] = [];
  
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
      this.AllCategorySupplication = [
        { label: 'Select Category', value: null }
      ];
   }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);

    this.editSupplicationForm= this.fb.group({  
      supCategory_id:['', [Validators.required]],  
      title:['', [Validators.required]], 
      title_aro:['', [Validators.required]], 
      description:['', [Validators.required]],
      description_aro:['', [Validators.required]] 
    })
    this.getSupplicationCategoryList();
    this.getSupplicationById();    
  }

  getSupplicationCategoryList(){
    const AllCategoryUmrah = [];
    this.manageMosqueService.getSupplicationCategoryList({}).subscribe((res: any) => {
      if(res.data.length && res.code == 200){
        if (res.code == 200) {
          for (var i =0; i < res.data.length; i++) {
            let item = {
              label: res.data[i].name,
              value: res.data[i].supCategory_id
            }
            this.AllCategorySupplication.push(item);
          }
          
        } else {
          this.toastr.error(res.message);
         
        }
      }
    });
  }

  getSupplicationById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      this.isLoading = false;
      this.manageMosqueService.getSupplicationById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          this.editSupplicationForm.patchValue({
            supCategory_id:res.data.supCategory_id,  
            title:res.data.title, 
            title_aro:res.data.title_aro, 
            description:res.data.description,
            description_aro:res.data.description_aro 
          })
          this.suplicationDetail=res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('supCategory_id', this.editSupplicationForm.get('supCategory_id').value);
    inputData.append('title', this.editSupplicationForm.get('title').value);
    inputData.append('title_aro', this.editSupplicationForm.get('title_aro').value);
    inputData.append('description', this.editSupplicationForm.get('description').value);
    inputData.append('description_aro', this.editSupplicationForm.get('description_aro').value);
    return inputData;
  }

  editSupplication(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      const formModel = this.prepareSave();
        this.manageMosqueService.editSupplicationById(params['id'],formModel).subscribe((res:any)=>{
          this.isLoading = false;
          if(res && res.code==200){
            this.toastr.success(res.message);
            this.router.navigate(['/layout/manageMosque/listSupplication'])
          }else{
            this.toastr.error(res.message);
          }
        })
    })
  }
}
