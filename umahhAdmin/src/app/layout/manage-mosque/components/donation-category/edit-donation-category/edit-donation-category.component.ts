import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { ActivatedRoute } from '@angular/router';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { VideoProcessingService } from '../../../services/video-processing.service';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../../../../../router.animations';
@Component({
  selector: 'app-edit-donation-category',
  templateUrl: './edit-donation-category.component.html',
  styleUrls: ['./edit-donation-category.component.scss'],
  animations: [routerTransition()]
})
export class EditDonationCategoryComponent implements OnInit {
  editDonationCategoryForm: FormGroup;
  categorydetail:any;
  loggedInUserDetails: any = '';
  isLoading: boolean = false;
  pdfUrl:string;
  selectedCategory: any;
  categoryType: SelectItem[] = [];
  public thumbnailImage: any;
  videourl: any ;
  imageChange : boolean = false;
  imgurl: any;
  loggedInId:any = '';
  maxDate:any;
  minDate:any;
  constructor(
    private translate: TranslateService,
    private localSt: LocalStorageService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    private route: ActivatedRoute,
    private manageMosqueService:ManageMosqueService,
    private router:Router,
    private videoService: VideoProcessingService
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
    this.loggedInId = this.loggedInUserDetails._id;
    this.editDonationCategoryForm= this.fb.group({  
      title:['', [Validators.required]],
     // startDate :['', [Validators.required]],   
      //endDate:['', [Validators.required]],  
      //image:null,       
    })
    //this.categoryList();
    this.getCategoryById();    
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
      this.editDonationCategoryForm.get('image').setValue(file);
    }
   
  }
/*  categoryList(){
    this.manageMosqueService.categoryList({}).subscribe((result: any) => {
        if(result.data.length && result.code == 200){
          for(let i=0; i<result.data.length; i++){
            let obj = {
              label: result.data[i].name,
              value: result.data[i]._id
            }
            this.categoryType.push(obj);
          }
        }
    })
  }*/

  getCategoryById(){
    this.isLoading = true;
    this.route.params.subscribe(params=>{
      
      this.isLoading = false;
      this.manageMosqueService.getCategoryById(params['id']).subscribe((res:any)=>{
        if(res && res.code==200 && res.data){
          /* let startDate:any = new Date(res.data.category[0].startDate);
          let endDate:any = new Date(res.data.category[0].endDate); */
          this.editDonationCategoryForm.patchValue({
            title:res.data.title,
            //startDate:startDate,
            //endDate:endDate,
            //image:res.data.iconUrl
          })
          this.categorydetail = res.data;
        }else{
          this.toastr.error(res.message);
        }
      })
    })
  }

  private prepareSave(): any {
    let inputData = new FormData();
    inputData.append('title', this.editDonationCategoryForm.get('title').value);
    //inputData.append('startDate', this.editDonationCategoryForm.get('startDate').value);
    //inputData.append('endDate', this.editDonationCategoryForm.get('endDate').value);
    //inputData.append('mosque_id', this.loggedInId);
    //inputData.append('dona_category_id', this.categorydetail.category[0]._id);
    return inputData;
  }

  editDonationCategory(){
    this.isLoading = true;
    const formModel = this.prepareSave();
    this.route.params.subscribe(params=>{
      this.manageMosqueService.editDonationCategory(params['id'],formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res && res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageMosque/listDonationCategory'])
        }else{
          this.toastr.error(res.message);
        }
      })
    })  
  }
}
