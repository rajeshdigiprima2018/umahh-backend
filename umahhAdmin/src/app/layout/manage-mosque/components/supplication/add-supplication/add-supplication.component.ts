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
  selector: 'app-add-supplication',
  templateUrl: './add-supplication.component.html',
  styleUrls: ['./add-supplication.component.scss'],
  animations: [routerTransition()]
})
export class AddSupplicationComponent implements OnInit {
  addSupplicationForm: FormGroup;
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
  AllCategorySupplication:SelectItem[] = [];

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
    this.AllCategorySupplication = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);  
    this.addSupplicationForm= this.fb.group({  
      supCategory_id:['', [Validators.required]],  
      title:['', [Validators.required]], 
      title_aro:['', [Validators.required]], 
      description:['', [Validators.required]],
      description_aro:['', [Validators.required]] 
    })
    this.getSupplicationCategoryList();
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

  onFileChange(event) {
    this.addSupplicationForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addSupplicationForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addSupplicationForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value
    
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('supCategory_id', this.addSupplicationForm.get('supCategory_id').value);
    inputData.append('title', this.addSupplicationForm.get('title').value);
    inputData.append('title_aro', this.addSupplicationForm.get('title_aro').value);
    inputData.append('description', this.addSupplicationForm.get('description').value);
    inputData.append('description_aro', this.addSupplicationForm.get('description_aro').value);
    
    return inputData;
  }
  addSupplication(){
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addSupplication(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
        this.router.navigate(['/layout/manageMosque/listSupplication'])
        }else{
          this.toastr.error(res.message);
        }
      })
  }

}
