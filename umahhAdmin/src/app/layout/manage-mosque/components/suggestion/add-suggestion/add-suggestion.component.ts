import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { appConfig } from '../../../../../core/app.config';
import { LocalStorageService } from 'ngx-webstorage';
import { ManageMosqueService } from '../../../services/manage-mosque.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.scss']
})
export class AddSuggestionComponent implements OnInit {
  addTopicForm: FormGroup;
  loggedInUserDetails: any = '';
  parent_id : any;
  isLoading: boolean = false;
  videourl: any ;
  selectType : any ;
  selectedCategory: any;
  categoryType: SelectItem[] = [];


  constructor(private fb:FormBuilder,private toastr: ToastrService,private localSt: LocalStorageService, private manageMosqueService:ManageMosqueService,private router:Router)
   {
    this.categoryType = [
      { label: 'Select Category', value: null }
    ];
    }

  ngOnInit() {
    this.loggedInUserDetails = this.localSt.retrieve('all');
    this.loggedInUserDetails = JSON.parse(this.loggedInUserDetails);  
    this.addTopicForm= this.fb.group({  
      title:['', [Validators.required, Validators.maxLength(200), Validators.pattern(appConfig.pattern.DESCRIPTION)]],   
      status:['', [Validators.required]],   
      category :['', [Validators.required]],   
      description:['',[Validators.required]], 
      uploadedBy:[this.loggedInUserDetails._id],
      selectStatusType:[''],
      videoPath : null ,
      contentType:['topic'],
    })
    this.categoryList();
  }
  categoryList(){
    this.manageMosqueService.categoryList({}).subscribe((result: any) => {
        if(result.data.length && result.code == 200){
          for(let i=0; i<result.data.length; i++){
            let obj = {
              label: result.data[i].name,
              value: result.data[i]._id
            }
            this.categoryType.push(obj);
          }
          this.addTopicForm.patchValue({ category: this.loggedInUserDetails.category });
        }
    });
  }

  onFileChange(event) {
    this.addTopicForm.value.videoPath=null;
    if (event.target.files && event.target.files[0]) {
      let videoFile = event.target.files[0]
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.videourl = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
      let file = event.target.files[0];
      this.addTopicForm.get('videoPath').setValue(file);
    }
  }


  optionSelectPdf(event){
    this.selectType = event.target.value
    const clearDescription = this.addTopicForm.get('description');
    clearDescription.reset();
    clearDescription.clearValidators();
    clearDescription.updateValueAndValidity();
  }

  optionSelectDescription(event){
    this.selectType = event.target.value
    
  }

  private prepareSave(): any {
    if(this.loggedInUserDetails.userType==appConfig.userType.CLINIC){
      this.parent_id = appConfig.admin.ID;
    }else if(this.loggedInUserDetails.userType==appConfig.userType.STAFF && this.loggedInUserDetails.created_by_id==appConfig.admin.ID)
    {
      //support admin
      this.parent_id = this.loggedInUserDetails.created_by_id;
    }
    else if(this.loggedInUserDetails.userType==appConfig.userType.STAFF)
    {
      //static for only associated with one clinic
      this.parent_id = this.loggedInUserDetails.associated_clinic_detail[0].clinic_id;
    }
    else{
      this.parent_id = appConfig.admin.ID;
    }
    let inputData = new FormData();
    inputData.append('title', this.addTopicForm.get('title').value);
    inputData.append('status', this.addTopicForm.get('status').value);
    inputData.append('category', this.addTopicForm.get('category').value);
    inputData.append('description', this.addTopicForm.get('description').value);
     //for adding contents uploaded by different admins and users (clinic,staff) also
     if(this.loggedInUserDetails.userType==appConfig.userType.ADMIN){
      inputData.append('uploadedBy', appConfig.admin.ID);
    }
    else{
      inputData.append('uploadedBy', this.addTopicForm.get('uploadedBy').value);
    }
    inputData.append('contentType', 'topic');
    inputData.append('userType',this.loggedInUserDetails.userType);
    inputData.append('topicPdf', this.addTopicForm.get('videoPath').value);
    inputData.append('parent_id',this.parent_id);
    return inputData;
  }
  addTopic(){
    if(this.selectType=='pdf' && this.addTopicForm.value.videoPath==null){
      this.toastr.warning("Please select pdf");
      this.addTopicForm.reset();
    }else{
      this.isLoading = true;
      const formModel = this.prepareSave();
      this.manageMosqueService.addContent(formModel).subscribe((res:any)=>{
        this.isLoading = false;
        if(res.code==200){
          this.toastr.success(res.message);
          this.router.navigate(['/layout/manageContent/listTopics'])
        }else{
          this.toastr.error(res.message);
        }
      })
    }
 
  }

}
